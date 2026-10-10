/* ============================================================
   VAB-CODE — Computer Vision Lab Dedicated Engine (vision.js)
   Pyodide WebAssembly, OpenCV 4.x, Colab Shims & Vision Canvas
   ============================================================ */

// ──────────────────────────────────────────────
// CLIENT-SIDE PKZIP GENERATOR (Zero dependencies, 100% Offline)
// ──────────────────────────────────────────────
class SimpleZip {
  constructor() {
    this.files = [];
  }

  addFile(filename, content) {
    const encoder = new TextEncoder();
    const data = typeof content === 'string' ? encoder.encode(content) : content;
    this.files.push({ filename, data, crc: this.crc32(data) });
  }

  crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ byte) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xEDB88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  generate() {
    const encoder = new TextEncoder();
    const chunks = [];
    const centralHeaders = [];
    let offset = 0;

    for (const f of this.files) {
      const nameBuf = encoder.encode(f.filename);
      const size = f.data.length;
      const crc = f.crc;

      // Local File Header (30 bytes + name length)
      const lh = new Uint8Array(30 + nameBuf.length);
      const view = new DataView(lh.buffer);
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, size, true);
      view.setUint32(22, size, true);
      view.setUint16(26, nameBuf.length, true);
      view.setUint16(28, 0, true);
      lh.set(nameBuf, 30);

      chunks.push(lh);
      chunks.push(f.data);

      // Central Directory Header (46 bytes + name length)
      const ch = new Uint8Array(46 + nameBuf.length);
      const cview = new DataView(ch.buffer);
      cview.setUint32(0, 0x02014b50, true);
      cview.setUint16(4, 20, true);
      cview.setUint16(6, 20, true);
      cview.setUint16(8, 0, true);
      cview.setUint16(10, 0, true);
      cview.setUint16(12, 0, true);
      cview.setUint16(14, 0, true);
      cview.setUint32(16, crc, true);
      cview.setUint32(20, size, true);
      cview.setUint32(24, size, true);
      cview.setUint16(28, nameBuf.length, true);
      cview.setUint16(30, 0, true);
      cview.setUint16(32, 0, true);
      cview.setUint16(34, 0, true);
      cview.setUint16(36, 0, true);
      cview.setUint32(38, 0, true);
      cview.setUint32(42, offset, true);
      ch.set(nameBuf, 46);

      centralHeaders.push(ch);
      offset += lh.length + size;
    }

    const centralDirSize = centralHeaders.reduce((acc, h) => acc + h.length, 0);
    const centralDirOffset = offset;

    // End of Central Directory Record (22 bytes)
    const eocd = new Uint8Array(22);
    const eview = new DataView(eocd.buffer);
    eview.setUint32(0, 0x06054b50, true);
    eview.setUint16(4, 0, true);
    eview.setUint16(6, 0, true);
    eview.setUint16(8, this.files.length, true);
    eview.setUint16(10, this.files.length, true);
    eview.setUint32(12, centralDirSize, true);
    eview.setUint32(16, centralDirOffset, true);
    eview.setUint16(20, 0, true);

    return new Blob([...chunks, ...centralHeaders, eocd], { type: 'application/zip' });
  }
}

const VisionApp = {
  pyodide: null,
  pyodideLoading: false,
  loadedPackages: new Set(),
  activeMediaName: 'input.jpg',
  activeMediaType: 'image',
  uploadedMediaBytes: null,
  visionOutputs: [],
  activeCategory: 'all',
  searchQuery: '',
  savedSnippets: [],

  // ──── Initialization ────
  init() {
    this.initEditor();
    this.initToolbar();
    this.initHistory();
    this.initExperimentsModal();
    this.initTabs();
    this.initMediaUploads();
    this.initSplitResize();
    this.loadInitialCode();
    this.checkUrlHash();
  },

  // ──── Editor & Gutter ────
  initEditor() {
    const editor = document.getElementById('cvCodeEditor');
    const gutter = document.getElementById('editorGutter');
    if (!editor || !gutter) return;

    const updateGutter = () => {
      const lineCount = (editor.value.split('\n').length) || 1;
      let gutterText = '';
      for (let i = 1; i <= lineCount; i++) {
        gutterText += i + '\n';
      }
      gutter.textContent = gutterText;
    };

    editor.addEventListener('input', () => {
      updateGutter();
      try {
        localStorage.setItem('vab_vision_code', editor.value);
      } catch (e) {}
    });

    editor.addEventListener('scroll', () => {
      gutter.scrollTop = editor.scrollTop;
    });

    // Support Tab key (4 spaces)
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        updateGutter();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        this.formatCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.saveCurrentCode();
      }
    });

    // Font size selector
    const fontSel = document.getElementById('fontSizeSelect');
    if (fontSel) {
      fontSel.addEventListener('change', (e) => {
        editor.style.fontSize = e.target.value + 'px';
        editor.style.lineHeight = (parseInt(e.target.value) + 7) + 'px';
        gutter.style.fontSize = e.target.value + 'px';
        gutter.style.lineHeight = (parseInt(e.target.value) + 7) + 'px';
      });
    }

    updateGutter();
  },

  stripComments(code) {
    if (!code) return '';
    return code
      .split('\n')
      .filter(line => !line.trim().startsWith('#'))
      .map(line => {
        const hashIdx = line.indexOf('#');
        if (hashIdx !== -1) {
          const before = line.slice(0, hashIdx);
          const sQuotes = (before.match(/'/g) || []).length;
          const dQuotes = (before.match(/"/g) || []).length;
          if (sQuotes % 2 === 0 && dQuotes % 2 === 0) {
            return before.trimEnd();
          }
        }
        return line;
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n';
  },

  loadInitialCode() {
    const editor = document.getElementById('cvCodeEditor');
    if (!editor) return;

    let saved = '';
    try {
      saved = localStorage.getItem('vab_vision_code');
    } catch (e) {}

    if (saved && saved.trim().length > 0) {
      editor.value = this.stripComments(saved);
    } else if (window.CV_EXPERIMENTS && window.CV_EXPERIMENTS[0]) {
      editor.value = this.stripComments(window.CV_EXPERIMENTS[0].code);
      const fileNameEl = document.getElementById('fileName');
      if (fileNameEl) fileNameEl.textContent = 'exp1_grayscale_conversion.py';
    } else {
      editor.value = `import cv2
from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()
img = cv2.imread(list(f.keys())[0])
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2_imshow(img)
cv2_imshow(gray)
`;
    }

    const gutter = document.getElementById('editorGutter');
    if (gutter) {
      const lineCount = (editor.value.split('\n').length) || 1;
      let gutterText = '';
      for (let i = 1; i <= lineCount; i++) gutterText += i + '\n';
      gutter.textContent = gutterText;
    }
  },

  // ──── Toolbar Handlers ────
  initToolbar() {
    // Run button
    const runBtn = document.getElementById('runBtn');
    if (runBtn) runBtn.addEventListener('click', () => this.runCode());

    // Auto-Format / Beautify Code
    const formatBtn = document.getElementById('formatBtn');
    if (formatBtn) formatBtn.addEventListener('click', () => this.formatCode());

    // Share Code via URL Hash
    const shareBtn = document.getElementById('shareCodeBtn');
    if (shareBtn) shareBtn.addEventListener('click', () => this.shareCode());

    // Save Code to LocalStorage
    const saveBtn = document.getElementById('saveCodeBtn');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveCurrentCode());

    // ZIP Multi-file Project Export
    const toolbarZipBtn = document.getElementById('toolbarZipBtn');
    if (toolbarZipBtn) toolbarZipBtn.addEventListener('click', () => this.downloadAllSavedCodesAsZip());

    const exportAllZipBtn = document.getElementById('exportAllZipBtn');
    if (exportAllZipBtn) exportAllZipBtn.addEventListener('click', () => this.downloadAllSavedCodesAsZip());

    // Saved Code History Drawer Toggle
    const historyBtn = document.getElementById('historyBtn');
    const historyOverlay = document.getElementById('historyOverlay');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const confirmSaveBtn = document.getElementById('confirmSaveSnippetBtn');

    if (historyBtn && historyOverlay) {
      historyBtn.addEventListener('click', () => {
        this.renderHistory();
        historyOverlay.style.display = 'grid';
      });
    }

    if (closeHistoryBtn && historyOverlay) {
      closeHistoryBtn.addEventListener('click', () => {
        historyOverlay.style.display = 'none';
      });
    }

    if (historyOverlay) {
      historyOverlay.addEventListener('click', (e) => {
        if (e.target === historyOverlay) {
          historyOverlay.style.display = 'none';
        }
      });
    }

    if (confirmSaveBtn) {
      confirmSaveBtn.addEventListener('click', () => {
        this.saveCurrentCode();
      });
    }

    // Global Ctrl+S shortcut
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.saveCurrentCode();
      }
    });

    // Copy code button
    const copyBtn = document.getElementById('copyCodeBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const editor = document.getElementById('cvCodeEditor');
        if (editor) {
          navigator.clipboard.writeText(editor.value).then(() => {
            this.toast('📋 Code copied to clipboard!', 'success');
          }).catch(() => {
            this.toast('Failed to copy code', 'error');
          });
        }
      });
    }

    // Download code button
    const dlBtn = document.getElementById('downloadCodeBtn');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        const editor = document.getElementById('cvCodeEditor');
        const fileNameEl = document.getElementById('fileName');
        const fileName = (fileNameEl ? fileNameEl.textContent : 'cv_code.py') || 'cv_code.py';
        const blob = new Blob([editor.value], { type: 'text/x-python' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName.endsWith('.py') ? fileName : `${fileName}.py`;
        a.click();
        URL.revokeObjectURL(a.href);
        this.toast(`📥 Downloaded ${a.download}`, 'success');
      });
    }

    // Clear editor button
    const clearBtn = document.getElementById('clearEditorBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const editor = document.getElementById('cvCodeEditor');
        if (editor) {
          editor.value = '';
          const gutter = document.getElementById('editorGutter');
          if (gutter) gutter.textContent = '1\n';
          this.toast('Editor cleared', 'info');
        }
      });
    }

    // 3-Dots More Options Menu Dropdown
    const moreTrigger = document.getElementById('moreMenuTriggerBtn');
    const morePopover = document.getElementById('morePopoverMenu');
    const moreWrapper = document.getElementById('moreMenuWrapper');

    if (moreTrigger && morePopover) {
      moreTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = morePopover.style.display === 'flex';
        if (isOpen) {
          morePopover.style.display = 'none';
          if (moreWrapper) moreWrapper.classList.remove('is-open');
        } else {
          morePopover.style.display = 'flex';
          if (moreWrapper) moreWrapper.classList.add('is-open');
        }
      });

      // Automatically close popover when clicking any action item button inside
      morePopover.addEventListener('click', (e) => {
        if (e.target.closest('button.more-menu-item')) {
          morePopover.style.display = 'none';
          if (moreWrapper) moreWrapper.classList.remove('is-open');
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#moreMenuWrapper')) {
          morePopover.style.display = 'none';
          if (moreWrapper) moreWrapper.classList.remove('is-open');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && morePopover.style.display === 'flex') {
          morePopover.style.display = 'none';
          if (moreWrapper) moreWrapper.classList.remove('is-open');
        }
      });
    }
  },

  // ──── Output Tabs & Canvas ────
  initTabs() {
    const tabVision = document.getElementById('tabVisionBtn');
    const tabConsole = document.getElementById('tabConsoleBtn');
    const viewVision = document.getElementById('visionOutputView');
    const viewConsole = document.getElementById('consoleOutputView');

    if (tabVision && tabConsole && viewVision && viewConsole) {
      tabVision.addEventListener('click', () => {
        tabVision.classList.add('active');
        tabConsole.classList.remove('active');
        viewVision.style.display = 'flex';
        viewConsole.style.display = 'none';
      });

      tabConsole.addEventListener('click', () => {
        tabConsole.classList.add('active');
        tabVision.classList.remove('active');
        viewConsole.style.display = 'block';
        viewVision.style.display = 'none';
      });
    }

    const clearCanvasBtn = document.getElementById('clearVisionCanvasBtn');
    if (clearCanvasBtn) {
      clearCanvasBtn.addEventListener('click', () => this.clearVisionCanvas());
    }
  },

  switchTab(tab) {
    const tabVision = document.getElementById('tabVisionBtn');
    const tabConsole = document.getElementById('tabConsoleBtn');
    const viewVision = document.getElementById('visionOutputView');
    const viewConsole = document.getElementById('consoleOutputView');

    if (tab === 'vision' && tabVision && viewVision) {
      tabVision.classList.add('active');
      if (tabConsole) tabConsole.classList.remove('active');
      viewVision.style.display = 'flex';
      if (viewConsole) viewConsole.style.display = 'none';
    } else if (tab === 'console' && tabConsole && viewConsole) {
      tabConsole.classList.add('active');
      if (tabVision) tabVision.classList.remove('active');
      viewConsole.style.display = 'block';
      if (viewVision) viewVision.style.display = 'none';
    }
  },

  // ──── Media Uploads (Image & Video) ────
  initMediaUploads() {
    const imgInput = document.getElementById('imageUploadInput');
    if (imgInput) {
      imgInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.handleImageUpload(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    const videoInput = document.getElementById('videoUploadInput');
    if (videoInput) {
      videoInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.handleVideoUpload(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    const resetBtn = document.getElementById('resetSampleMediaBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetSampleMedia());
    }
  },

  async handleImageUpload(file) {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      this.uploadedMediaBytes = bytes;
      this.activeMediaName = file.name;
      this.activeMediaType = 'image';

      // Write to Pyodide filesystem if available
      if (this.pyodide && this.pyodide.FS) {
        this.writeMediaToPyodideFS(file.name, bytes, 'image');
      }

      this.updateActiveMediaBadge(`📷 Image: ${file.name}`);

      // Render thumbnail card in Vision Canvas
      const reader = new FileReader();
      reader.onload = (e) => {
        const b64 = e.target.result.split(',')[1];
        this.addVisionOutput({
          type: 'image',
          title: `Uploaded Image: ${file.name}`,
          src: `data:image/png;base64,${b64}`,
          time: new Date().toLocaleTimeString(),
          isInput: true
        });
      };
      reader.readAsDataURL(file);

      this.toast(`📷 Uploaded '${file.name}' to virtual filesystem! Ready to run.`, 'success');
      this.switchTab('vision');
    } catch (err) {
      this.toast(`Upload failed: ${err.message}`, 'error');
    }
  },

  async handleVideoUpload(file) {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      this.uploadedMediaBytes = bytes;
      this.activeMediaName = file.name;
      this.activeMediaType = 'video';

      if (this.pyodide && this.pyodide.FS) {
        this.writeMediaToPyodideFS(file.name, bytes, 'video');
      }

      this.updateActiveMediaBadge(`🎬 Video: ${file.name}`);

      // Render video preview in Vision Canvas
      const blob = new Blob([bytes], { type: file.type || 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);

      this.addVisionOutput({
        type: 'video',
        title: `Uploaded Video: ${file.name}`,
        src: blobUrl,
        time: new Date().toLocaleTimeString(),
        isInput: true
      });

      this.toast(`🎬 Uploaded '${file.name}' to virtual filesystem! Ready to run.`, 'success');
      this.switchTab('vision');
    } catch (err) {
      this.toast(`Video upload failed: ${err.message}`, 'error');
    }
  },

  writeMediaToPyodideFS(name, bytes, type) {
    try {
      if (!this.pyodide || !this.pyodide.FS) return;
      this.pyodide.FS.writeFile('/' + name, bytes);
      this.pyodide.FS.writeFile(name, bytes);
      if (type === 'image') {
        this.pyodide.FS.writeFile('/input.jpg', bytes);
        this.pyodide.FS.writeFile('input.jpg', bytes);
        this.pyodide.FS.writeFile('/sample.jpg', bytes);
        this.pyodide.FS.writeFile('sample.jpg', bytes);
      } else if (type === 'video') {
        this.pyodide.FS.writeFile('/input.mp4', bytes);
        this.pyodide.FS.writeFile('input.mp4', bytes);
      }
    } catch (e) {
      console.warn('FS write error:', e);
    }
  },

  resetSampleMedia() {
    this.uploadedMediaBytes = null;
    this.activeMediaName = 'input.jpg';
    this.activeMediaType = 'image';
    this.updateActiveMediaBadge('Default Sample Image (/input.jpg)');

    if (this.pyodide && this.pyodide.FS) {
      const imgBytes = this.generateSampleImageBytes();
      this.writeMediaToPyodideFS('input.jpg', imgBytes, 'image');
    }
    this.toast('🔄 Virtual filesystem reset to default test image (/input.jpg)', 'info');
  },

  updateActiveMediaBadge(text) {
    const badgeText = document.getElementById('activeMediaText');
    if (badgeText) badgeText.textContent = text;
  },

  generateSampleImageBytes() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 480, 360);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 480, 360);

      ctx.beginPath();
      ctx.arc(130, 180, 75, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(250, 110, 160, 100);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(250, 110, 160, 100);

      ctx.beginPath();
      ctx.moveTo(330, 240);
      ctx.lineTo(250, 320);
      ctx.lineTo(410, 320);
      ctx.closePath();
      ctx.fillStyle = '#10b981';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VAB-CODE VISION LAB', 240, 50);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('OpenCV Python Virtual Sandbox (480x360)', 240, 75);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const binary = atob(dataUrl.split(',')[1]);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    } catch (e) {
      return new Uint8Array(0);
    }
  },

  // ──── Vision Output Rendering ────
  addVisionOutput(item) {
    this.visionOutputs.push(item);

    const empty = document.getElementById('visionEmptyState');
    if (empty) empty.style.display = 'none';

    const countPill = document.getElementById('visionImageCount');
    if (countPill) countPill.textContent = `${this.visionOutputs.length} Output${this.visionOutputs.length === 1 ? '' : 's'}`;

    const badge = document.getElementById('visionCountBadge');
    if (badge) {
      badge.textContent = this.visionOutputs.length;
      badge.style.display = 'inline-block';
    }

    const list = document.getElementById('visionImagesList');
    if (!list) return;

    const card = document.createElement('div');
    card.className = 'vision-image-card';

    if (item.type === 'video') {
      card.innerHTML = `
        <div class="vision-image-card-header">
          <div class="vision-image-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect width="14" height="14" x="1" y="5" rx="2" ry="2"/></svg>
            <span>${item.title || 'Processed Video'}</span>
          </div>
          <span class="vision-image-meta">${item.isInput ? 'Input Source' : 'Video Output'}</span>
        </div>
        <div class="vision-img-wrapper" style="padding:10px">
          <video src="${item.src}" controls autoplay loop class="video-card-player"></video>
        </div>
        <div class="vision-card-footer">
          <span style="font-size:11px;color:var(--text-muted)">Rendered at ${item.time}</span>
          <a href="${item.src}" download="${(item.title || 'video').replace(/[^a-z0-9_-]/gi, '_')}.mp4" class="vision-download-btn" style="text-decoration:none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Download Video</span>
          </a>
        </div>
      `;
    } else {
      const dimLabel = (item.w && item.h) ? `${item.w} × ${item.h} px · ${item.channels === 1 ? 'Grayscale' : 'RGB'}` : (item.isInput ? 'Input Photo' : 'OpenCV Result');
      card.innerHTML = `
        <div class="vision-image-card-header">
          <div class="vision-image-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/></svg>
            <span>${item.title || 'Processed Image'}</span>
          </div>
          <span class="vision-image-meta">${dimLabel}</span>
        </div>
        <div class="vision-img-wrapper">
          <img src="${item.src}" alt="${item.title}" class="vision-rendered-img">
        </div>
        <div class="vision-card-footer">
          <span style="font-size:11px;color:var(--text-muted)">Rendered at ${item.time}</span>
          <button class="vision-download-btn" type="button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Download PNG</span>
          </button>
        </div>
      `;

      const dlBtn = card.querySelector('.vision-download-btn');
      if (dlBtn) {
        dlBtn.addEventListener('click', () => {
          const a = document.createElement('a');
          a.href = item.src;
          a.download = `${(item.title || 'vision_output').replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.toast(`📥 Downloaded ${a.download}`, 'success');
        });
      }
    }

    list.appendChild(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'end' });
  },

  clearVisionCanvas() {
    this.visionOutputs = [];
    const list = document.getElementById('visionImagesList');
    if (list) list.innerHTML = '';
    const empty = document.getElementById('visionEmptyState');
    if (empty) empty.style.display = 'flex';
    const countPill = document.getElementById('visionImageCount');
    if (countPill) countPill.textContent = '0 Outputs';
    const badge = document.getElementById('visionCountBadge');
    if (badge) badge.style.display = 'none';
    this.toast('Vision canvas cleared', 'info');
  },

  // ──── Experiments Modal ────
  initExperimentsModal() {
    const openBtn = document.getElementById('openCvModalBtn');
    const overlay = document.getElementById('cvLabOverlay');
    const closeBtn = document.getElementById('closeCvLabBtn');
    const search = document.getElementById('cvSearchInput');
    const categoriesBar = document.getElementById('cvCategoriesBar');

    if (openBtn && overlay) {
      openBtn.addEventListener('click', () => {
        overlay.style.display = 'flex';
        this.renderExperimentsGrid();
        if (search) {
          search.value = '';
          this.searchQuery = '';
          setTimeout(() => search.focus(), 60);
        }
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.style.display = 'none');
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
          overlay.style.display = 'none';
        }
      });
    }

    if (search) {
      search.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderExperimentsGrid();
      });
    }

    if (categoriesBar) {
      categoriesBar.querySelectorAll('.cv-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          categoriesBar.querySelectorAll('.cv-cat-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeCategory = btn.dataset.cat || 'all';
          this.renderExperimentsGrid();
        });
      });
    }

    this.renderExperimentsGrid();
  },

  renderExperimentsGrid() {
    const grid = document.getElementById('cvExperimentsGrid');
    if (!grid) return;

    const allExps = window.CV_EXPERIMENTS || [];
    const cat = this.activeCategory || 'all';
    const q = this.searchQuery || '';

    const filtered = allExps.filter(exp => {
      const matchCat = cat === 'all' || exp.category === cat;
      const matchQ = !q ||
        exp.title.toLowerCase().includes(q) ||
        exp.aim.toLowerCase().includes(q) ||
        exp.num.toString() === q ||
        exp.functions.some(f => f.toLowerCase().includes(q));
      return matchCat && matchQ;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--text-muted);font-size:13px">No matching experiments found.</div>';
      return;
    }

    grid.innerHTML = filtered.map(exp => `
      <div class="cv-exp-card" data-id="${exp.id}">
        <div class="cv-exp-header">
          <div class="cv-exp-title-box">
            <span class="cv-exp-num">Ex ${exp.num}</span>
            <span class="cv-exp-title">${exp.title}</span>
          </div>
          <span class="cv-exp-cat">${exp.categoryLabel}</span>
        </div>
        <div class="cv-exp-aim">${exp.aim}</div>
        <div class="cv-exp-footer">
          <div class="cv-exp-tags">
            ${exp.functions.slice(0, 3).map(fn => `<span class="cv-exp-tag">${fn}</span>`).join('')}
          </div>
          <button class="cv-exp-load-btn" data-id="${exp.id}" type="button">
            <span>Load Code</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.cv-exp-load-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadExperiment(btn.dataset.id);
      });
    });

    grid.querySelectorAll('.cv-exp-card').forEach(card => {
      card.addEventListener('click', () => {
        this.loadExperiment(card.dataset.id);
      });
    });
  },

  loadExperiment(id) {
    const allExps = window.CV_EXPERIMENTS || [];
    const exp = allExps.find(e => e.id === id);
    if (!exp) return;

    const editor = document.getElementById('cvCodeEditor');
    if (editor) {
      const cleanCode = this.stripComments(exp.code);
      editor.value = cleanCode;
      const gutter = document.getElementById('editorGutter');
      if (gutter) {
        const lineCount = (cleanCode.split('\n').length) || 1;
        let gutterText = '';
        for (let i = 1; i <= lineCount; i++) gutterText += i + '\n';
        gutter.textContent = gutterText;
      }
      try {
        localStorage.setItem('vab_vision_code', cleanCode);
      } catch (e) {}
    }

    const fileNameEl = document.getElementById('fileName');
    if (fileNameEl) {
      fileNameEl.textContent = `exp${exp.num}_${exp.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.py`;
    }

    const overlay = document.getElementById('cvLabOverlay');
    if (overlay) overlay.style.display = 'none';

    this.toast(`🔬 Loaded Experiment #${exp.num}: ${exp.title}`, 'success');
  },

  // ──── Pyodide WASM Runtime Loader ────
  async loadPyodideEngine(log) {
    if (this.pyodide) return this.pyodide;
    if (this.pyodideLoading) {
      while (this.pyodideLoading) await new Promise(r => setTimeout(r, 150));
      return this.pyodide;
    }

    this.pyodideLoading = true;
    log('system', '⚡ Initializing Pyodide WebAssembly runtime...');

    try {
      if (typeof loadPyodide === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to download Pyodide core script.'));
        });
      }

      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
      });

      log('success', '✓ Pyodide WASM Core initialized ($0 Server Cost)');
      this.pyodideLoading = false;
      return this.pyodide;
    } catch (err) {
      this.pyodideLoading = false;
      log('stderr', `Pyodide init error: ${err.message}`);
      return null;
    }
  },

  async ensureCvPackages(py, log) {
    const packagesToLoad = [];
    if (!this.loadedPackages.has('numpy')) packagesToLoad.push('numpy');
    if (!this.loadedPackages.has('opencv-python')) packagesToLoad.push('opencv-python');

    if (packagesToLoad.length > 0) {
      log('info', `📦 Auto-loading computer vision packages: ${packagesToLoad.join(', ')}...`);
      log('dim', '   (Cached in browser for zero latency on future runs)');
      await py.loadPackage(packagesToLoad);
      packagesToLoad.forEach(p => this.loadedPackages.add(p));
      log('success', '✓ OpenCV & NumPy loaded successfully!');
    }
  },

  // ──── Execution Pipeline ────
  async runCode() {
    const editor = document.getElementById('cvCodeEditor');
    if (!editor) return;
    const code = editor.value;

    const logDiv = document.getElementById('consoleLogContent');
    if (logDiv) logDiv.innerHTML = '';

    const log = (type, text) => {
      if (!logDiv) return;
      const el = document.createElement('div');
      if (type === 'system') el.style.color = '#38bdf8';
      else if (type === 'success') el.style.color = '#34d399';
      else if (type === 'stderr') el.style.color = '#f87171';
      else if (type === 'warn') el.style.color = '#fbbf24';
      else if (type === 'dim') el.style.color = '#64748b';
      else el.style.color = '#e2e8f0';
      el.textContent = text;
      logDiv.appendChild(el);
      logDiv.parentElement.scrollTop = logDiv.parentElement.scrollHeight;
    };

    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusTime = document.getElementById('statusTime');
    if (statusDot) statusDot.className = 'status-dot yellow';
    if (statusText) statusText.textContent = 'Executing...';

    const t0 = performance.now();
    log('system', '$ python3 vision_script.py');

    const py = await this.loadPyodideEngine(log);
    if (!py) {
      if (statusDot) statusDot.className = 'status-dot red';
      if (statusText) statusText.textContent = 'Error';
      return;
    }

    try {
      await this.ensureCvPackages(py, log);

      // Ensure virtual filesystem files exist
      if (this.uploadedMediaBytes) {
        this.writeMediaToPyodideFS(this.activeMediaName, this.uploadedMediaBytes, this.activeMediaType);
      } else {
        const sampleBytes = this.generateSampleImageBytes();
        this.writeMediaToPyodideFS('input.jpg', sampleBytes, 'image');
      }

      // Configure global bridge for cv2_imshow and cv2.imshow
      window.renderVisionImage = (title, b64, w, h, channels) => {
        this.addVisionOutput({
          type: 'image',
          title: title || 'Processed Image',
          src: `data:image/png;base64,${b64}`,
          w: w || 0,
          h: h || 0,
          channels: channels || 3,
          time: new Date().toLocaleTimeString()
        });
      };

      // Set up Pyodide OpenCV + Google Colab bridge in Python
      await py.runPythonAsync(`
import sys
import base64
import os
import types

try:
    import cv2
    import numpy as np

    def _vab_imshow(winname, mat):
        if mat is None:
            print(f"[OpenCV Warning] '{winname}': Image matrix is None.")
            return
        try:
            m = mat
            if m.dtype != np.uint8:
                if m.max() <= 1.0:
                    m = (m * 255).astype(np.uint8)
                else:
                    m = np.clip(m, 0, 255).astype(np.uint8)
            success, encoded = cv2.imencode('.png', m)
            if success:
                b64 = base64.b64encode(encoded.tobytes()).decode('ascii')
                h, w = m.shape[:2]
                channels = 1 if len(m.shape) == 2 else m.shape[2]
                import js
                if hasattr(js, 'renderVisionImage'):
                    js.renderVisionImage(str(winname), b64, int(w), int(h), int(channels))
        except Exception as e:
            print(f"[OpenCV Display Error] {e}")

    cv2.imshow = _vab_imshow
    cv2.waitKey = lambda *args, **kwargs: 0
    cv2.destroyAllWindows = lambda *args, **kwargs: None
    cv2.destroyWindow = lambda *args, **kwargs: None

    if not hasattr(cv2, '_vab_orig_imread'):
        cv2._vab_orig_imread = cv2.imread

    def _vab_safe_imread(filename, flags=cv2.IMREAD_COLOR):
        res = cv2._vab_orig_imread(filename, flags)
        if res is not None:
            return res
        for fallback in ['/input.jpg', 'input.jpg', '/sample.jpg', 'sample.jpg']:
            if os.path.exists(fallback):
                fb = cv2._vab_orig_imread(fallback, flags)
                if fb is not None:
                    return fb
        syn = np.zeros((300, 400, 3), dtype=np.uint8)
        cv2.rectangle(syn, (30, 30), (370, 270), (0, 140, 255), -1)
        cv2.circle(syn, (200, 150), 70, (255, 255, 0), -1)
        cv2.putText(syn, "VAB-CODE LAB", (60, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
        return syn

    cv2.imread = _vab_safe_imread

    # VideoCapture Stub
    class _VabVideoCapture:
        def __init__(self, *args, **kwargs):
            self.frame_count = 0
            self.max_frames = 25
            self.w, self.h = 400, 300
        def isOpened(self):
            return True
        def read(self):
            if self.frame_count >= self.max_frames:
                return False, None
            frame = np.zeros((self.h, self.w, 3), dtype=np.uint8)
            cv2.rectangle(frame, (0, 180), (self.w, self.h), (45, 45, 45), -1)
            x_pos = int((self.frame_count / self.max_frames) * (self.w - 90)) + 10
            cv2.rectangle(frame, (x_pos, 195), (x_pos + 70, 245), (0, 165, 255), -1)
            cv2.circle(frame, (x_pos + 18, 248), 8, (200, 200, 200), -1)
            cv2.circle(frame, (x_pos + 52, 248), 8, (200, 200, 200), -1)
            cv2.putText(frame, f"Frame {self.frame_count+1}/25", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1)
            self.frame_count += 1
            return True, frame
        def get(self, propId):
            return 30.0
        def release(self):
            pass

    cv2.VideoCapture = _VabVideoCapture

    # VideoWriter Stub
    if not hasattr(cv2, 'CAP_PROP_FPS'): cv2.CAP_PROP_FPS = 5
    if not hasattr(cv2, 'CAP_PROP_FRAME_WIDTH'): cv2.CAP_PROP_FRAME_WIDTH = 3
    if not hasattr(cv2, 'CAP_PROP_FRAME_HEIGHT'): cv2.CAP_PROP_FRAME_HEIGHT = 4
    if not hasattr(cv2, 'VideoWriter'):
        class _VideoWriterStub:
            def __init__(self, *args, **kwargs): pass
            def write(self, frame): pass
            def release(self): pass
        cv2.VideoWriter = _VideoWriterStub
    if not hasattr(cv2, 'VideoWriter_fourcc'):
        cv2.VideoWriter_fourcc = lambda *args: 0

    # ──── Google Colab Bridge ────
    _g = sys.modules.get('google') or types.ModuleType('google')
    sys.modules['google'] = _g
    _gc = types.ModuleType('google.colab')
    _g.colab = _gc
    sys.modules['google.colab'] = _gc

    # google.colab.files
    _files = types.ModuleType('google.colab.files')
    def _colab_upload():
        # Look for active media in FS
        for fn in ['input.jpg', '/input.jpg', 'input.mp4', '/input.mp4', 'sample.jpg']:
            if os.path.exists(fn):
                try:
                    with open(fn, 'rb') as f:
                        return {os.path.basename(fn): f.read()}
                except Exception:
                    pass
        return {'input.jpg': b''}
    _files.upload = _colab_upload
    _gc.files = _files
    sys.modules['google.colab.files'] = _files

    # google.colab.patches
    _patches = types.ModuleType('google.colab.patches')
    _win_cnt = [0]
    def _colab_imshow(mat):
        _win_cnt[0] += 1
        lbl = 'Original Image' if _win_cnt[0] == 1 else ('Grayscale / Processed Image' if _win_cnt[0] == 2 else f'Output {_win_cnt[0]}')
        _vab_imshow(lbl, mat)
    _patches.cv2_imshow = _colab_imshow
    _gc.patches = _patches
    sys.modules['google.colab.patches'] = _patches

    # ──── IPython.display Bridge ────
    _ipy = sys.modules.get('IPython') or types.ModuleType('IPython')
    sys.modules['IPython'] = _ipy
    _ipyd = types.ModuleType('IPython.display')
    _ipy.display = _ipyd
    sys.modules['IPython.display'] = _ipyd

    class _VideoStub:
        def __init__(self, filename, embed=False):
            self.filename = filename

    def _display_stub(*args, **kwargs):
        for a in args:
            if hasattr(a, 'filename'):
                print(f"✓ Video ready: {a.filename}")

    _ipyd.Video = _VideoStub
    _ipyd.display = _display_stub

except Exception as _e:
    print(f"Bridge init note: {_e}")
`);

      // Set stdout/stderr handlers
      py.setStdout({ batched: (s) => log('stdout', s) });
      py.setStderr({ batched: (s) => log('stderr', s) });

      // Sanitize shell lines like !ffmpeg
      const execCode = code.replace(/^[ \t]*[!%](.*)$/gm, '# [Shell command skipped in browser]: $1');

      await py.runPythonAsync(execCode);

      const ms = (performance.now() - t0).toFixed(1);
      log('dim', `\n[Finished in ${ms}ms — exit code 0]`);

      if (statusDot) statusDot.className = 'status-dot green';
      if (statusText) statusText.textContent = 'Completed (0)';
      if (statusTime) statusTime.textContent = `${ms}ms`;

      this.toast(`✓ Execution finished in ${ms}ms`, 'success');
      this.switchTab('vision');
    } catch (err) {
      const ms = (performance.now() - t0).toFixed(1);
      log('stderr', err.message);
      log('dim', `\n[Terminated in ${ms}ms — exit code 1]`);

      if (statusDot) statusDot.className = 'status-dot red';
      if (statusText) statusText.textContent = 'Error (1)';
      if (statusTime) statusTime.textContent = `${ms}ms`;

      this.toast(`Execution error: ${err.message}`, 'error');
      this.switchTab('console');
    }
  },

  // ──── Resizable Split ────
  initSplitResize() {
    const handle = document.getElementById('splitHandle');
    const leftCol = document.getElementById('workspaceLeftEditor');
    const rightCol = document.getElementById('workspaceRightColumn');
    if (!handle || !leftCol || !rightCol) return;

    // Restore saved split ratio if available
    try {
      const savedRatio = localStorage.getItem('vab_vision_split_ratio');
      if (savedRatio && window.innerWidth > 868) {
        const r = parseFloat(savedRatio);
        if (r >= 0.25 && r <= 0.75) {
          leftCol.style.flex = r;
          rightCol.style.flex = 1 - r;
        }
      }
    } catch(e) {}

    let isResizing = false;

    const onStart = () => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      handle.classList.add('dragging');
    };

    const onMove = (clientX) => {
      if (!isResizing || !leftCol.parentElement) return;
      const totalWidth = leftCol.parentElement.offsetWidth;
      const newLeft = clientX - leftCol.parentElement.getBoundingClientRect().left;
      const ratio = Math.max(0.25, Math.min(0.75, newLeft / totalWidth));
      leftCol.style.flex = ratio;
      rightCol.style.flex = 1 - ratio;
    };

    const onEnd = () => {
      if (isResizing) {
        isResizing = false;
        handle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        try {
          if (leftCol.parentElement) {
            const currentRatio = leftCol.offsetWidth / leftCol.parentElement.offsetWidth;
            localStorage.setItem('vab_vision_split_ratio', currentRatio.toFixed(3));
          }
        } catch(e) {}
      }
    };

    handle.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    handle.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onStart();
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isResizing && e.touches.length === 1) onMove(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Double-click to reset split to default 55% / 45%
    handle.addEventListener('dblclick', () => {
      leftCol.style.flex = '1.1';
      rightCol.style.flex = '0.9';
      try { localStorage.removeItem('vab_vision_split_ratio'); } catch(e) {}
    });
  },

  // ──── Saved Code History & LocalStorage ────
  initHistory() {
    try {
      const raw = localStorage.getItem('codepulse_saved_snippets');
      this.savedSnippets = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.savedSnippets = [];
    }
    this.updateHistoryBadge();
    this.renderHistory();
  },

  updateHistoryBadge() {
    const badge = document.getElementById('historyBadge');
    if (badge) badge.textContent = this.savedSnippets.length;
  },

  formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;

    let totalBytes = 0;
    this.savedSnippets.forEach(s => {
      totalBytes += new TextEncoder().encode(s.code || '').length;
    });

    const usedText = document.getElementById('storageUsedText');
    const countText = document.getElementById('storageCountText');
    const quotaText = document.getElementById('storageQuotaText');
    const quotaFill = document.getElementById('storageQuotaFill');

    const approx5MB = 5 * 1024 * 1024;
    const percentUsed = (totalBytes / approx5MB) * 100;

    if (usedText) usedText.textContent = this.formatBytes(totalBytes);
    if (countText) countText.textContent = `${this.savedSnippets.length} ${this.savedSnippets.length === 1 ? 'script' : 'scripts'}`;
    if (quotaText) quotaText.textContent = `Browser Quota: ~5 MB (${percentUsed < 0.01 && totalBytes > 0 ? '<0.01%' : percentUsed.toFixed(2) + '%'} used)`;
    if (quotaFill) quotaFill.style.width = `${Math.min(100, Math.max(0.4, percentUsed))}%`;

    if (this.savedSnippets.length === 0) {
      container.innerHTML = `
        <div class="history-empty" style="text-align:center;padding:48px;color:var(--text-muted)">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.4;margin-bottom:8px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p>No saved scripts yet.</p>
          <span style="font-size:12px;color:var(--text-muted)">Write or load computer vision code and click "Save" (or Ctrl+S)</span>
        </div>
      `;
      return;
    }

    const dotColors = { python: '#facc15', c: '#22d3ee', cpp: '#60a5fa', java: '#fb923c' };

    container.innerHTML = this.savedSnippets.map(item => {
      const codeStr = item.code || '';
      const bytes = new TextEncoder().encode(codeStr).length;
      const sizeStr = this.formatBytes(bytes);
      const lines = codeStr.split('\n').length;
      const chars = codeStr.length;
      const langName = (item.lang || 'python').toUpperCase();
      const dotColor = dotColors[item.lang] || '#06b6d4';

      return `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-top">
            <div class="history-item-meta">
              <span class="history-lang-pill" style="color:${dotColor}">
                <span class="lang-dot" style="background:${dotColor}"></span>
                ${langName}
              </span>
              <span class="history-date">${item.date || ''}</span>
              <span class="history-size-badge" title="Storage size: ${bytes} bytes">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                ${sizeStr}
              </span>
            </div>
            <div class="history-actions">
              <button class="history-btn-load" data-id="${item.id}" title="Load into editor">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>
                Load
              </button>
              <button class="history-btn-del" data-id="${item.id}" title="Delete snippet">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
          <div class="history-title-wrap">
            <div class="history-title" title="${this.escapeHtml(item.title || item.name || 'Untitled')}">${this.escapeHtml(item.title || item.name || 'Untitled')}</div>
            <div class="history-size-details">
              <span class="history-size-tag">💾 <strong>${sizeStr}</strong> (${bytes} bytes)</span>
              <span>•</span>
              <span class="history-size-tag">📄 ${lines} ${lines === 1 ? 'line' : 'lines'}</span>
              <span>•</span>
              <span class="history-size-tag">🔤 ${chars} chars</span>
            </div>
          </div>
          <div class="history-preview-box" title="Code Preview">
            <div class="history-preview">${this.escapeHtml(codeStr.split('\n').slice(0, 2).join(' '))}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.history-btn-load').forEach(btn => {
      btn.addEventListener('click', () => this.loadSnippet(btn.dataset.id));
    });

    container.querySelectorAll('.history-btn-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteSnippet(btn.dataset.id);
      });
    });
  },

  saveCurrentCode(customTitle = '') {
    const editor = document.getElementById('cvCodeEditor');
    const code = editor ? editor.value : '';
    if (!code || !code.trim()) {
      this.toast('Cannot save empty code', 'warn');
      return;
    }

    const input = document.getElementById('saveSnippetName');
    let title = (customTitle || (input ? input.value : '')).trim();
    if (!title) {
      const fileNameEl = document.getElementById('fileName');
      const baseName = (fileNameEl ? fileNameEl.textContent : 'CV Script').replace('.py', '');
      title = `${baseName} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    const byteLength = new TextEncoder().encode(code).length;
    const formattedSize = this.formatBytes(byteLength);

    const snippet = {
      id: 'snip_' + Date.now(),
      title,
      lang: 'python',
      code,
      size: byteLength,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    this.savedSnippets.unshift(snippet);
    try {
      localStorage.setItem('codepulse_saved_snippets', JSON.stringify(this.savedSnippets));
      localStorage.setItem('vab_vision_code', code);
    } catch (e) {
      console.warn('Storage quota exceeded');
    }

    if (input) input.value = '';
    this.updateHistoryBadge();
    this.renderHistory();
    this.toast(`💾 Saved "${title}" (${formattedSize}) to local storage!`, 'success');
  },

  loadSnippet(id) {
    const item = this.savedSnippets.find(s => s.id === id);
    if (!item) return;

    const editor = document.getElementById('cvCodeEditor');
    if (editor) {
      editor.value = item.code || '';
      const gutter = document.getElementById('editorGutter');
      if (gutter) {
        const lineCount = (editor.value.split('\n').length) || 1;
        let gutterText = '';
        for (let i = 1; i <= lineCount; i++) gutterText += i + '\n';
        gutter.textContent = gutterText;
      }
    }

    const fileNameEl = document.getElementById('fileName');
    if (fileNameEl) {
      const safe = (item.title || item.name || 'cv_code')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 35);
      fileNameEl.textContent = `${safe}.py`;
    }

    const overlay = document.getElementById('historyOverlay');
    if (overlay) overlay.style.display = 'none';

    this.toast(`📂 Loaded "${item.title || item.name}" into editor!`, 'success');
  },

  deleteSnippet(id) {
    this.savedSnippets = this.savedSnippets.filter(s => s.id !== id);
    try {
      localStorage.setItem('codepulse_saved_snippets', JSON.stringify(this.savedSnippets));
    } catch (e) {}

    this.updateHistoryBadge();
    this.renderHistory();
    this.toast('🗑️ Script deleted from local storage', 'info');
  },

  // ──── ZIP Multi-File / Semester Lab Project Export ────
  downloadAllSavedCodesAsZip() {
    const zip = new SimpleZip();
    const count = this.savedSnippets ? this.savedSnippets.length : 0;
    const extMap = { python: 'py', c: 'c', cpp: 'cpp', java: 'java', html: 'html', css: 'css', javascript: 'js' };

    if (count > 0) {
      this.savedSnippets.forEach((s, idx) => {
        const ext = extMap[s.lang] || 'py';
        const safeName = (s.title || s.name || `script_${idx + 1}`)
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '_')
          .replace(/_+/g, '_')
          .substring(0, 40);
        const fileName = `${String(idx + 1).padStart(2, '0')}_${safeName}.${ext}`;
        zip.addFile(fileName, s.code || '');
      });

      const dateStr = new Date().toLocaleString();
      const readmeContent = `================================================================
VAB-CODE — Computer Vision Lab & Project Scripts Export
================================================================
Generated: ${dateStr}
Total Scripts: ${count}
Platform: https://vab-code.in/vision.html
Client-side Zero-Cost OpenCV Python WebAssembly Lab

Files Included:
${this.savedSnippets.map((s, i) => `  ${i + 1}. [${(s.lang || 'python').toUpperCase()}] ${s.title || s.name} (${s.date || 'Saved'})`).join('\n')}

================================================================
Run & Test your code instantly at https://vab-code.in/vision.html
================================================================`;
      zip.addFile('README.txt', readmeContent);

      const blob = zip.generate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VAB-CODE-Vision-Projects-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      this.toast(`📦 Exported ${count} saved codes to ZIP package!`, 'success');
    } else {
      // Export current active code as ZIP
      const editor = document.getElementById('cvCodeEditor');
      const currentCode = editor ? editor.value : '';
      if (!currentCode || !currentCode.trim()) {
        this.toast('Write or load some code before creating a ZIP!', 'warn');
        return;
      }
      const fileNameEl = document.getElementById('fileName');
      const fileName = (fileNameEl ? fileNameEl.textContent : 'cv_experiment.py') || 'cv_experiment.py';

      zip.addFile(fileName, currentCode);
      zip.addFile('README.txt', `VAB-CODE Computer Vision Export\nFile: ${fileName}\nExported: ${new Date().toLocaleString()}\nPlatform: https://vab-code.in/vision.html\nRun online with zero setup on VAB-CODE!\n`);

      const blob = zip.generate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VAB-CODE-${fileName.replace(/\.[^/.]+$/, '')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      this.toast(`📦 Exported active code as ZIP! (Save more codes to bundle all into one ZIP)`, 'info');
    }
  },

  // ──── Serverless URL Hash Sharing ($0 Database) ────
  shareCode() {
    const editor = document.getElementById('cvCodeEditor');
    const code = editor ? editor.value : '';
    if (!code || !code.trim()) {
      this.toast('Write some code before sharing!', 'warn');
      return;
    }
    try {
      const fileName = document.getElementById('fileName')?.textContent || 'cv_code.py';
      const payload = { l: 'python', c: code, title: fileName };
      const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#code=${encoded}`;
      window.location.hash = `code=${encoded}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          this.toast('🔗 Shareable link copied to clipboard! Anyone opening it will see your code.', 'success');
        }).catch(() => {
          window.prompt('Copy your shareable code link:', shareUrl);
        });
      } else {
        window.prompt('Copy your shareable code link:', shareUrl);
      }
    } catch (err) {
      this.toast('Failed to share code: ' + err.message, 'error');
    }
  },

  checkUrlHash() {
    const hash = window.location.hash;
    if (!hash) return;
    const match = hash.match(/#code=(.+)/) || hash.match(/#c=(.+)/);
    if (match && match[1]) {
      try {
        const decodedStr = decodeURIComponent(atob(match[1]));
        const payload = JSON.parse(decodedStr);
        if (payload.c !== undefined) {
          const editor = document.getElementById('cvCodeEditor');
          if (editor) {
            editor.value = payload.c;
            const gutter = document.getElementById('editorGutter');
            if (gutter) {
              const lineCount = (editor.value.split('\n').length) || 1;
              let gutterText = '';
              for (let i = 1; i <= lineCount; i++) gutterText += i + '\n';
              gutter.textContent = gutterText;
            }
            if (payload.title) {
              const fileNameEl = document.getElementById('fileName');
              if (fileNameEl) fileNameEl.textContent = payload.title;
            }
            this.toast('🎉 Loaded shared computer vision code from URL!', 'success');
          }
        }
      } catch (e) {
        console.warn('Could not decode code from URL hash', e);
      }
    }
  },

  // ──── Auto-Format / Beautify Code ────
  formatCode() {
    const editor = document.getElementById('cvCodeEditor');
    if (!editor || !editor.value.trim()) return;

    const lines = editor.value.split('\n');
    const formatted = [];
    let prevEmpty = false;

    for (let line of lines) {
      const trimmedEnd = line.trimEnd();
      const isEmpty = trimmedEnd.trim().length === 0;

      if (isEmpty) {
        if (!prevEmpty) {
          formatted.push('');
          prevEmpty = true;
        }
      } else {
        formatted.push(trimmedEnd);
        prevEmpty = false;
      }
    }

    editor.value = formatted.join('\n');
    const gutter = document.getElementById('editorGutter');
    if (gutter) {
      const lineCount = (editor.value.split('\n').length) || 1;
      let gutterText = '';
      for (let i = 1; i <= lineCount; i++) gutterText += i + '\n';
      gutter.textContent = gutterText;
    }
    this.toast('✨ Code formatted and cleaned!', 'success');
  },

  // ──── Toast Notification ────
  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => VisionApp.init());
} else {
  VisionApp.init();
}
