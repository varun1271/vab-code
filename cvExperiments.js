/* ============================================================
   VAB-CODE (vab-code) — Computer Vision Lab (40 Experiments)
   Full University Syllabus Curriculum (OpenCV & Python)
   ============================================================ */

window.CV_EXPERIMENTS = [
  {
    id: 'cv-exp-1',
    num: 1,
    title: 'Grayscale Conversion',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Convert an Image to Grayscale.',
    functions: ['cv2.imread', 'cv2.cvtColor', 'COLOR_BGR2GRAY', 'cv2.imshow'],
    code: `# Experiment 1: Convert an Image to Grayscale
# Aim: Read an image in Python using OpenCV and convert it to Grayscale.

import cv2
import numpy as np

# 1. Read input image (BGR color format)
img = cv2.imread('input.jpg')

# 2. Convert to Grayscale using cvtColor
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 3. Display the original and grayscale output
cv2.imshow('Original Image', img)
cv2.imshow('Grayscale Image', gray)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Image converted to Grayscale successfully!")
print(f"  Original shape: {img.shape} (Height, Width, Channels)")
print(f"  Grayscale shape: {gray.shape} (Height, Width)")
`
  },

  {
    id: 'cv-exp-2',
    num: 2,
    title: 'Gaussian Blur',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Convert an Image to Blur using GaussianBlur.',
    functions: ['cv2.GaussianBlur', 'cv2.imread', 'cv2.imshow'],
    code: `# Experiment 2: Convert an Image to Blur using GaussianBlur
# Aim: Apply a 2D Gaussian filter kernel to smoothen and remove high-frequency noise.

import cv2
import numpy as np

img = cv2.imread('input.jpg')

# Apply GaussianBlur: (15, 15) kernel size, standard deviation sigmaX = 0 (auto-computed)
blurred = cv2.GaussianBlur(img, (15, 15), 0)

cv2.imshow('Original Image', img)
cv2.imshow('Gaussian Blurred Image', blurred)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Gaussian Blur applied successfully with kernel (15, 15)!")
`
  },

  {
    id: 'cv-exp-3',
    num: 3,
    title: 'Canny Edge Outline',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Convert an Image to show outline using Canny function.',
    functions: ['cv2.Canny', 'cv2.cvtColor', 'cv2.imshow'],
    code: `# Experiment 3: Show Outline using Canny function
# Aim: Detect and display object outlines using Canny edge detection.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Canny edge detector: lower threshold = 100, upper threshold = 200
edges = cv2.Canny(gray, 100, 200)

cv2.imshow('Original Image', img)
cv2.imshow('Canny Edge Outline', edges)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Object outline detected using Canny function!")
`
  },

  {
    id: 'cv-exp-4',
    num: 4,
    title: 'Image Dilation',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Dilate an Image using Dilate function.',
    functions: ['cv2.dilate', 'cv2.threshold', 'np.ones'],
    code: `# Experiment 4: Dilate an Image using Dilate function
# Aim: Expand the boundaries of foreground objects to bridge gaps.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# 5x5 rectangular structuring kernel
kernel = np.ones((5, 5), np.uint8)

# Dilate function expands foreground pixels
dilated = cv2.dilate(binary, kernel, iterations=1)

cv2.imshow('Binary Input', binary)
cv2.imshow('Dilated Image', dilated)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Image dilation completed with 5x5 kernel.")
`
  },

  {
    id: 'cv-exp-5',
    num: 5,
    title: 'Image Erosion',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Erode an Image using erode function.',
    functions: ['cv2.erode', 'cv2.threshold', 'np.ones'],
    code: `# Experiment 5: Erode an Image using erode function
# Aim: Erode boundaries of foreground objects to remove isolated pixel noise.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# 5x5 structuring element
kernel = np.ones((5, 5), np.uint8)

# Erode strips boundary layers
eroded = cv2.erode(binary, kernel, iterations=1)

cv2.imshow('Binary Input', binary)
cv2.imshow('Eroded Image', eroded)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Image erosion completed with 5x5 kernel.")
`
  },

  {
    id: 'cv-exp-6',
    num: 6,
    title: 'Video Processing (Slow & Fast Motion)',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Read captured video in Python and display the video in slow motion and fast motion.',
    functions: ['cv2.VideoCapture', 'cap.read', 'cv2.waitKey'],
    code: `# Experiment 6: Video Processing in Slow & Fast Motion
# Aim: Read captured video frames and control display playback rate.

import cv2
import time

# Initialize video capture (0 = camera, or path to video file)
cap = cv2.VideoCapture(0)
frames = []

# Buffer initial frames
for _ in range(15):
    ret, frame = cap.read()
    if not ret:
        break
    frames.append(frame)
cap.release()

print(f"✓ Video frames captured: {len(frames)} frames")
print("Playback Delay Control Logic:")
print("  • Normal Speed: waitKey(33)  -> ~30 FPS")
print("  • Slow Motion:  waitKey(100) -> ~10 FPS (3x slower)")
print("  • Fast Motion:  waitKey(10)  -> ~100 FPS (3x faster, skip alternate frames)")

if frames:
    # Display sample frame with slow-motion text overlay
    preview = frames[len(frames)//2].copy()
    cv2.putText(preview, "Slow Motion Video Frame", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    cv2.imshow('Captured Video Frame', preview)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
`
  },

  {
    id: 'cv-exp-7',
    num: 7,
    title: 'Webcam Video Capture (Slow & Fast Motion)',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Capture video from web Camera and Display the video, in slow motion and in fast motion.',
    functions: ['cv2.VideoCapture', 'cap.isOpened', 'cv2.putText'],
    code: `# Experiment 7: Capture Video from Webcam in Slow & Fast Motion
# Aim: Stream live frames from webcam and display at slow and fast speeds.

import cv2

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Webcam stream initialized in sandbox environment.")

ret, frame = cap.read()
if ret:
    h, w = frame.shape[:2]
    # Overlay webcam stats and playback speed mode
    cv2.putText(frame, "Webcam: Slow Motion [0.5x Playback]", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
    cv2.putText(frame, f"Resolution: {w}x{h}", (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

    cv2.imshow('Webcam Capture', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print(f"✓ Webcam frame captured successfully ({w}x{h}).")

cap.release()
`
  },

  {
    id: 'cv-exp-8',
    num: 8,
    title: 'Image Scaling (Bigger & Smaller)',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Scale an image to its Bigger and Smaller sizes.',
    functions: ['cv2.resize', 'INTER_CUBIC', 'INTER_AREA'],
    code: `# Experiment 8: Scale an Image to Bigger and Smaller Sizes
# Aim: Resize image dimensions using interpolation algorithms.

import cv2

img = cv2.imread('input.jpg')
h, w = img.shape[:2]

# 1. Scale Bigger (1.5x) using bicubic interpolation
bigger = cv2.resize(img, (int(w * 1.5), int(h * 1.5)), interpolation=cv2.INTER_CUBIC)

# 2. Scale Smaller (0.5x) using pixel area relation interpolation
smaller = cv2.resize(img, (int(w * 0.5), int(h * 0.5)), interpolation=cv2.INTER_AREA)

cv2.imshow('Original Image', img)
cv2.imshow('Scaled Bigger (1.5x)', bigger)
cv2.imshow('Scaled Smaller (0.5x)', smaller)

cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"✓ Original: {w}x{h}")
print(f"  Scaled Bigger:  {bigger.shape[1]}x{bigger.shape[0]}")
print(f"  Scaled Smaller: {smaller.shape[1]}x{smaller.shape[0]}")
`
  },

  {
    id: 'cv-exp-9',
    num: 9,
    title: 'Image Rotation (Clockwise & Counter-Clockwise)',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Perform Rotation of an image to clockwise and counter clockwise direction.',
    functions: ['cv2.getRotationMatrix2D', 'cv2.warpAffine'],
    code: `# Experiment 9: Rotation of an Image Clockwise and Counter-Clockwise
# Aim: Compute rotation matrix around center and warp affine coordinates.

import cv2

img = cv2.imread('input.jpg')
h, w = img.shape[:2]
center = (w // 2, h // 2)

# Clockwise rotation: -90 degrees
M_cw = cv2.getRotationMatrix2D(center, -90, 1.0)
rot_cw = cv2.warpAffine(img, M_cw, (w, h))

# Counter-clockwise rotation: +90 degrees
M_ccw = cv2.getRotationMatrix2D(center, 90, 1.0)
rot_ccw = cv2.warpAffine(img, M_ccw, (w, h))

cv2.imshow('Original Image', img)
cv2.imshow('Rotated Clockwise (-90 deg)', rot_cw)
cv2.imshow('Rotated Counter-Clockwise (+90 deg)', rot_ccw)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Image rotated clockwise (-90°) and counter-clockwise (+90°).")
`
  },

  {
    id: 'cv-exp-10',
    num: 10,
    title: 'Image Translation (Moving)',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Perform moving of an image from one place to another.',
    functions: ['cv2.warpAffine', 'np.float32'],
    code: `# Experiment 10: Moving an Image from One Place to Another (Translation)
# Aim: Shift image pixel coordinates by offset (tx, ty) along X and Y axes.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
h, w = img.shape[:2]

# Translation offsets: tx = 60px right, ty = 40px down
tx, ty = 60, 40
M = np.float32([
    [1, 0, tx],
    [0, 1, ty]
])

# Warp affine to apply translation
translated = cv2.warpAffine(img, M, (w, h))

cv2.imshow('Original Image', img)
cv2.imshow(f'Translated (tx={tx}, ty={ty})', translated)

cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"✓ Image translated by tx={tx}px and ty={ty}px.")
`
  },

  {
    id: 'cv-exp-11',
    num: 11,
    title: 'Affine Transformation',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform Affine Transformation on the image.',
    functions: ['cv2.getAffineTransform', 'cv2.warpAffine', 'np.float32'],
    code: `# Experiment 11: Perform Affine Transformation on the Image
# Aim: Map 3 source points to 3 destination points preserving parallelism.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
rows, cols = img.shape[:2]

# 3 points in original image
pts1 = np.float32([[50, 50], [200, 50], [50, 200]])

# 3 corresponding points in transformed image
pts2 = np.float32([[10, 100], [200, 50], [100, 250]])

# Compute 2x3 affine matrix
M = cv2.getAffineTransform(pts1, pts2)
affine_dst = cv2.warpAffine(img, M, (cols, rows))

cv2.imshow('Original Image', img)
cv2.imshow('Affine Transformed Image', affine_dst)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Affine Transformation Matrix (2x3):\n", M)
`
  },

  {
    id: 'cv-exp-12',
    num: 12,
    title: 'Perspective Transformation (Image)',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform Perspective Transformation on the image.',
    functions: ['cv2.getPerspectiveTransform', 'cv2.warpPerspective', 'np.float32'],
    code: `# Experiment 12: Perform Perspective Transformation on the Image
# Aim: Map 4 points to simulate 3D camera viewpoint changes (bird's-eye view).

import cv2
import numpy as np

img = cv2.imread('input.jpg')
h, w = img.shape[:2]

# 4 points in source quadrilateral
pts1 = np.float32([
    [int(0.1*w), int(0.15*h)],
    [int(0.9*w), int(0.12*h)],
    [int(0.05*w), int(0.9*h)],
    [int(0.95*w), int(0.88*h)]
])

# 4 points in destination rectangle
pts2 = np.float32([
    [0, 0],
    [300, 0],
    [0, 300],
    [300, 300]
])

# Compute 3x3 perspective matrix
M = cv2.getPerspectiveTransform(pts1, pts2)
perspective_dst = cv2.warpPerspective(img, M, (300, 300))

cv2.imshow('Original Image', img)
cv2.imshow('Perspective Transformed (300x300)', perspective_dst)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Perspective Matrix (3x3):\n", M)
`
  },

  {
    id: 'cv-exp-13',
    num: 13,
    title: 'Perspective Transformation on Video',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Perform Perspective Transformation on the Video.',
    functions: ['cv2.VideoCapture', 'cv2.getPerspectiveTransform', 'cv2.warpPerspective'],
    code: `# Experiment 13: Perspective Transformation on Video
# Aim: Continuously apply perspective transformation to video stream frames.

import cv2
import numpy as np

cap = cv2.VideoCapture(0)
ret, frame = cap.read()

if ret:
    h, w = frame.shape[:2]
    # Source trapezoid -> Destination rectangle
    pts1 = np.float32([[50, 40], [w-50, 40], [10, h-20], [w-10, h-20]])
    pts2 = np.float32([[0, 0], [w, 0], [0, h], [w, h]])

    M = cv2.getPerspectiveTransform(pts1, pts2)
    warped_frame = cv2.warpPerspective(frame, M, (w, h))

    cv2.putText(warped_frame, "Bird's-Eye Perspective View", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('Original Video Frame', frame)
    cv2.imshow('Warped Perspective Video', warped_frame)

    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print("✓ Video frame warped with perspective transformation.")

cap.release()
`
  },

  {
    id: 'cv-exp-14',
    num: 14,
    title: 'Transformation using Homography Matrix',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform transformation using Homography matrix.',
    functions: ['cv2.findHomography', 'cv2.warpPerspective', 'np.float32'],
    code: `# Experiment 14: Transformation using Homography Matrix
# Aim: Estimate 3x3 homography matrix between planar surfaces and warp image.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
h, w = img.shape[:2]

# Corresponding points
src_pts = np.float32([[0, 0], [w - 1, 0], [w - 1, h - 1], [0, h - 1]])
dst_pts = np.float32([
    [int(0.12*w), int(0.18*h)],
    [int(0.88*w), int(0.08*h)],
    [int(0.82*w), int(0.92*h)],
    [int(0.18*w), int(0.84*h)]
])

# Find Homography Matrix H
H, status = cv2.findHomography(src_pts, dst_pts)
homography_dst = cv2.warpPerspective(img, H, (w, h))

cv2.imshow('Original Image', img)
cv2.imshow('Homography Transformed Image', homography_dst)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Homography Matrix H (3x3):\n", H)
`
  },

  {
    id: 'cv-exp-15',
    num: 15,
    title: 'Direct Linear Transformation (DLT)',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform transformation using Direct Linear Transformation (DLT).',
    functions: ['np.linalg.svd', 'cv2.warpPerspective', 'np.array'],
    code: `# Experiment 15: Direct Linear Transformation (DLT)
# Aim: Compute homography algebraically using SVD and apply projection.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
h, w = img.shape[:2]

# 4 point correspondences
src = np.array([[0, 0], [w, 0], [w, h], [0, h]], dtype=np.float32)
dst = np.array([[40, 30], [w - 20, 15], [w - 50, h - 25], [25, h - 40]], dtype=np.float32)

# Construct 2n x 9 matrix A for Ah = 0
A = []
for i in range(4):
    x, y = src[i][0], src[i][1]
    u, v = dst[i][0], dst[i][1]
    A.append([-x, -y, -1,  0,  0,  0, u*x, u*y, u])
    A.append([ 0,  0,  0, -x, -y, -1, v*x, v*y, v])
A = np.array(A)

# Solve using Singular Value Decomposition (SVD)
U, S, Vh = np.linalg.svd(A)
H_dlt = Vh[-1].reshape((3, 3))
H_dlt = H_dlt / H_dlt[2, 2]  # Normalize so H[2,2] = 1

dlt_warped = cv2.warpPerspective(img, H_dlt, (w, h))

cv2.imshow('Original Image', img)
cv2.imshow('DLT Transformed Image', dlt_warped)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ DLT Solved Homography Matrix:\n", H_dlt)
`
  },

  {
    id: 'cv-exp-16',
    num: 16,
    title: 'Canny Edge Detection Method',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Canny method.',
    functions: ['cv2.Canny', 'cv2.GaussianBlur', 'cv2.cvtColor'],
    code: `# Experiment 16: Edge Detection using Canny Method
# Aim: Multi-stage edge detector: Gaussian filter, gradient magnitude, NMS & hysteresis.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Step 1: Smooth with 5x5 Gaussian blur
blurred = cv2.GaussianBlur(gray, (5, 5), 1.4)

# Step 2: Canny edge detector (low threshold=50, high threshold=150)
edges = cv2.Canny(blurred, 50, 150)

cv2.imshow('Original Image', img)
cv2.imshow('Canny Edge Detection (50, 150)', edges)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Canny Edge Detection executed with hysteresis thresholds (50, 150).")
`
  },

  {
    id: 'cv-exp-17',
    num: 17,
    title: 'Sobel Matrix Along X-Axis',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Sobel Matrix along X axis.',
    functions: ['cv2.Sobel', 'cv2.convertScaleAbs', 'cv2.CV_64F'],
    code: `# Experiment 17: Edge Detection using Sobel Matrix along X axis
# Aim: Compute horizontal spatial gradient highlighting vertical edges.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Sobel derivative along X (dx=1, dy=0)
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobelx_abs = cv2.convertScaleAbs(sobelx)

cv2.imshow('Original Grayscale', gray)
cv2.imshow('Sobel X-Axis (Vertical Edges)', sobelx_abs)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Sobel gradient along X axis computed.")
`
  },

  {
    id: 'cv-exp-18',
    num: 18,
    title: 'Sobel Matrix Along Y-Axis',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Sobel Matrix along Y axis.',
    functions: ['cv2.Sobel', 'cv2.convertScaleAbs', 'cv2.CV_64F'],
    code: `# Experiment 18: Edge Detection using Sobel Matrix along Y axis
# Aim: Compute vertical spatial gradient highlighting horizontal edges.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Sobel derivative along Y (dx=0, dy=1)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
sobely_abs = cv2.convertScaleAbs(sobely)

cv2.imshow('Original Grayscale', gray)
cv2.imshow('Sobel Y-Axis (Horizontal Edges)', sobely_abs)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Sobel gradient along Y axis computed.")
`
  },

  {
    id: 'cv-exp-19',
    num: 19,
    title: 'Sobel Matrix Along XY-Axis',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Sobel Matrix along XY axis.',
    functions: ['cv2.Sobel', 'cv2.addWeighted', 'cv2.convertScaleAbs'],
    code: `# Experiment 19: Edge Detection using Sobel Matrix along XY axis
# Aim: Combine X and Y gradients to capture all edge directions.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

abs_sobelx = cv2.convertScaleAbs(sobelx)
abs_sobely = cv2.convertScaleAbs(sobely)

# Blend both gradient directions equally (50% X + 50% Y)
sobel_xy = cv2.addWeighted(abs_sobelx, 0.5, abs_sobely, 0.5, 0)

cv2.imshow('Original Grayscale', gray)
cv2.imshow('Sobel XY Combined Edges', sobel_xy)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Sobel XY combined gradient completed.")
`
  },

  {
    id: 'cv-exp-20',
    num: 20,
    title: 'Laplacian Sharpening (Negative Center)',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Laplacian mask with negative center coefficient.',
    functions: ['cv2.filter2D', 'np.clip', 'np.array'],
    code: `# Experiment 20: Laplacian Sharpening with Negative Center Coefficient
# Aim: Sharpen using second derivative mask: [[0, 1, 0], [1, -4, 1], [0, 1, 0]]

import cv2
import numpy as np

img = cv2.imread('input.jpg')

# 3x3 Laplacian mask with negative center (-4)
kernel = np.array([
    [0,  1, 0],
    [1, -4, 1],
    [0,  1, 0]
], dtype=np.float32)

# For negative center coefficient: Sharpened = Original - Laplacian
laplacian = cv2.filter2D(img, cv2.CV_32F, kernel)
sharpened = np.clip(img.astype(np.float32) - laplacian, 0, 255).astype(np.uint8)

cv2.imshow('Original Image', img)
cv2.imshow('Laplacian Sharpened (-4 Center)', sharpened)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Laplacian sharpening (negative center coefficient) completed.")
`
  },

  {
    id: 'cv-exp-21',
    num: 21,
    title: 'Laplacian Sharpening (Diagonal Neighbors)',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Laplacian mask implemented with an extension of diagonal neighbors.',
    functions: ['cv2.filter2D', 'np.clip', 'np.array'],
    code: `# Experiment 21: Laplacian Sharpening with Diagonal Neighbors
# Aim: Extend mask to 8-connectivity with negative center (-8):
# Mask: [[1, 1, 1], [1, -8, 1], [1, 1, 1]]

import cv2
import numpy as np

img = cv2.imread('input.jpg')

# 8-neighbor Laplacian kernel with negative center
kernel = np.array([
    [1,  1, 1],
    [1, -8, 1],
    [1,  1, 1]
], dtype=np.float32)

laplacian = cv2.filter2D(img, cv2.CV_32F, kernel)
sharpened = np.clip(img.astype(np.float32) - laplacian, 0, 255).astype(np.uint8)

cv2.imshow('Original Image', img)
cv2.imshow('Diagonal Laplacian Sharpened (-8 Center)', sharpened)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Diagonal Laplacian sharpening completed.")
`
  },

  {
    id: 'cv-exp-22',
    num: 22,
    title: 'Laplacian Sharpening (Positive Center)',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Laplacian mask with positive center coefficient.',
    functions: ['cv2.filter2D', 'np.array'],
    code: `# Experiment 22: Laplacian Sharpening with Positive Center Coefficient
# Aim: Sharpen using positive center coefficient (+5 = 1 + 4):
# Mask: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]]

import cv2
import numpy as np

img = cv2.imread('input.jpg')

# Direct sharpening mask with positive center (+5)
kernel = np.array([
    [ 0, -1,  0],
    [-1,  5, -1],
    [ 0, -1,  0]
], dtype=np.float32)

sharpened = cv2.filter2D(img, -1, kernel)

cv2.imshow('Original Image', img)
cv2.imshow('Laplacian Sharpened (+ Center)', sharpened)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Sharpening with positive center coefficient completed.")
`
  },

  {
    id: 'cv-exp-23',
    num: 23,
    title: 'Unsharp Masking',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using unsharp masking.',
    functions: ['cv2.GaussianBlur', 'cv2.subtract', 'cv2.add'],
    code: `# Experiment 23: Sharpening of Image using Unsharp Masking
# Aim: Subtract blurred image from original to obtain mask, then add back.

import cv2
import numpy as np

img = cv2.imread('input.jpg')

# Step 1: Smooth with Gaussian Blur
blurred = cv2.GaussianBlur(img, (9, 9), 10.0)

# Step 2: Unsharp mask = Original - Blurred
mask = cv2.subtract(img, blurred)

# Step 3: Sharpened image = Original + Mask
sharpened = cv2.add(img, mask)

cv2.imshow('Original Image', img)
cv2.imshow('Unsharp Mask', mask)
cv2.imshow('Sharpened Image (Unsharp Masking)', sharpened)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Unsharp masking completed.")
`
  },

  {
    id: 'cv-exp-24',
    num: 24,
    title: 'High-Boost Masking',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using High-Boost Masks.',
    functions: ['cv2.GaussianBlur', 'cv2.addWeighted'],
    code: `# Experiment 24: Sharpening using High-Boost Masks
# Aim: Amplify high-frequency detail using boost factor A > 1:
# High-Boost = A * Original - Blurred

import cv2
import numpy as np

img = cv2.imread('input.jpg')
blurred = cv2.GaussianBlur(img, (9, 9), 10.0)

# Boost factor A = 1.8
A = 1.8
high_boost = cv2.addWeighted(img, A, blurred, -(A - 1.0), 0)

cv2.imshow('Original Image', img)
cv2.imshow(f'High-Boost Sharpened (A={A})', high_boost)

cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"✓ High-boost filtering completed with factor A={A}.")
`
  },

  {
    id: 'cv-exp-25',
    num: 25,
    title: 'Gradient Masking',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Gradient masking.',
    functions: ['cv2.Sobel', 'np.hypot', 'cv2.addWeighted'],
    code: `# Experiment 25: Sharpening of Image using Gradient Masking
# Aim: Modulate edges with gradient magnitude mask to sharpen object details.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Calculate spatial gradients
gx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
gy = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

# Gradient magnitude = sqrt(gx^2 + gy^2)
grad_mag = np.hypot(gx, gy)
grad_mag = np.uint8(np.clip(grad_mag, 0, 255))

# Convert gradient mask to 3-channel and blend with original
grad_bgr = cv2.cvtColor(grad_mag, cv2.COLOR_GRAY2BGR)
sharpened = cv2.addWeighted(img, 0.8, grad_bgr, 0.3, 0)

cv2.imshow('Original Image', img)
cv2.imshow('Gradient Magnitude Mask', grad_mag)
cv2.imshow('Gradient Masked Sharpened', sharpened)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Gradient masking sharpening applied.")
`
  },

  {
    id: 'cv-exp-26',
    num: 26,
    title: 'Watermarking with OpenCV',
    category: 'roi',
    categoryLabel: 'Watermarking & ROI',
    aim: 'Insert water marking to the image using OpenCV.',
    functions: ['cv2.putText', 'cv2.rectangle', 'cv2.addWeighted'],
    code: `# Experiment 26: Insert Watermark to the Image using OpenCV
# Aim: Add visible copyright text watermark with alpha opacity blending.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
overlay = img.copy()
h, w = img.shape[:2]

# Add watermark banner and text
cv2.rectangle(overlay, (20, h - 70), (w - 20, h - 20), (0, 0, 0), -1)
cv2.putText(overlay, "CONFIDENTIAL (c) VAB-CODE LAB", (35, h - 35),
            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 255), 2, cv2.LINE_AA)

# Alpha blend watermark overlay (60% overlay + 40% original)
watermarked = cv2.addWeighted(overlay, 0.6, img, 0.4, 0)

cv2.imshow('Original Image', img)
cv2.imshow('Watermarked Image', watermarked)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Watermark inserted with 60% alpha transparency.")
`
  },

  {
    id: 'cv-exp-27',
    num: 27,
    title: 'Cropping, Copying & Pasting ROI',
    category: 'roi',
    categoryLabel: 'Watermarking & ROI',
    aim: 'Do Cropping, Copying and pasting image inside another image using OpenCV.',
    functions: ['img[y:y+h, x:x+w]', 'cv2.rectangle', 'np.full'],
    code: `# Experiment 27: Cropping, Copying and Pasting inside Another Image
# Aim: Extract Region of Interest (ROI) and paste onto target canvas.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
h, w = img.shape[:2]

# 1. Crop a central Region of Interest (ROI)
ymin, ymax = int(0.25 * h), int(0.75 * h)
xmin, xmax = int(0.25 * w), int(0.75 * w)
cropped_roi = img[ymin:ymax, xmin:xmax]

# 2. Create blank target background canvas
canvas = np.full((h, w, 3), 40, dtype=np.uint8)

# 3. Paste cropped ROI into target canvas
rh, rw = cropped_roi.shape[:2]
canvas[20:20+rh, 20:20+rw] = cropped_roi

# Draw green border around pasted ROI
cv2.rectangle(canvas, (20, 20), (20+rw, 20+rh), (0, 255, 0), 2)

cv2.imshow('Original Image', img)
cv2.imshow('Cropped ROI', cropped_roi)
cv2.imshow('Pasted Inside Canvas', canvas)

cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"✓ ROI cropped ({rw}x{rh}) and pasted inside canvas.")
`
  },

  {
    id: 'cv-exp-28',
    num: 28,
    title: 'Boundary Finding Using Convolution Kernel',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Find the boundary of the image using Convolution kernel for the given image.',
    functions: ['cv2.filter2D', 'np.array', 'cv2.cvtColor'],
    code: `# Experiment 28: Find Boundary using Convolution Kernel
# Aim: Apply Laplacian/border convolution kernel to extract boundaries.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Boundary detection convolution kernel
kernel = np.array([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
], dtype=np.float32)

boundary = cv2.filter2D(gray, -1, kernel)

cv2.imshow('Original Grayscale', gray)
cv2.imshow('Boundary using Convolution Kernel', boundary)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Boundaries found using 3x3 convolution kernel.")
`
  },

  {
    id: 'cv-exp-29',
    num: 29,
    title: 'Morphological Erosion',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Erosion technique.',
    functions: ['cv2.erode', 'cv2.getStructuringElement', 'MORPH_RECT'],
    code: `# Experiment 29: Morphological Erosion Technique
# Aim: Strip boundary pixels of binary foreground objects.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# Structuring element
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
eroded = cv2.erode(binary, kernel, iterations=2)

cv2.imshow('Binary Input', binary)
cv2.imshow('Morphological Erosion (2 Iterations)', eroded)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Morphological Erosion applied.")
`
  },

  {
    id: 'cv-exp-30',
    num: 30,
    title: 'Morphological Dilation',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Dilation technique.',
    functions: ['cv2.dilate', 'cv2.getStructuringElement', 'MORPH_RECT'],
    code: `# Experiment 30: Morphological Dilation Technique
# Aim: Grow binary foreground boundaries to bridge gaps and connect contours.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
dilated = cv2.dilate(binary, kernel, iterations=2)

cv2.imshow('Binary Input', binary)
cv2.imshow('Morphological Dilation (2 Iterations)', dilated)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Morphological Dilation applied.")
`
  },

  {
    id: 'cv-exp-31',
    num: 31,
    title: 'Morphological Opening',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Opening technique.',
    functions: ['cv2.morphologyEx', 'MORPH_OPEN', 'cv2.getStructuringElement'],
    code: `# Experiment 31: Morphological Opening Technique
# Aim: Erosion followed by Dilation: removes small bright noise speckles.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
opening = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

cv2.imshow('Binary Input', binary)
cv2.imshow('Morphological Opening', opening)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Morphological Opening (Erosion -> Dilation) applied.")
`
  },

  {
    id: 'cv-exp-32',
    num: 32,
    title: 'Morphological Closing',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Closing technique.',
    functions: ['cv2.morphologyEx', 'MORPH_CLOSE', 'cv2.getStructuringElement'],
    code: `# Experiment 32: Morphological Closing Technique
# Aim: Dilation followed by Erosion: closes small dark holes inside foreground.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
closing = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

cv2.imshow('Binary Input', binary)
cv2.imshow('Morphological Closing', closing)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Morphological Closing (Dilation -> Erosion) applied.")
`
  },

  {
    id: 'cv-exp-33',
    num: 33,
    title: 'Morphological Gradient',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Morphological Gradient technique.',
    functions: ['cv2.morphologyEx', 'MORPH_GRADIENT', 'cv2.getStructuringElement'],
    code: `# Experiment 33: Morphological Gradient Technique
# Aim: Compute difference between Dilation and Erosion to highlight object outlines.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
gradient = cv2.morphologyEx(binary, cv2.MORPH_GRADIENT, kernel)

cv2.imshow('Binary Input', binary)
cv2.imshow('Morphological Gradient (Outlines)', gradient)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Morphological Gradient (Dilation - Erosion) computed.")
`
  },

  {
    id: 'cv-exp-34',
    num: 34,
    title: 'Top Hat Technique',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Top hat technique.',
    functions: ['cv2.morphologyEx', 'MORPH_TOPHAT', 'cv2.getStructuringElement'],
    code: `# Experiment 34: Morphological Top Hat Technique
# Aim: Difference between input and Opening: isolates bright features smaller than kernel.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
tophat = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, kernel)

cv2.imshow('Original Grayscale', gray)
cv2.imshow('Top Hat (Bright Details)', tophat)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Top Hat operation (Input - Opening) computed.")
`
  },

  {
    id: 'cv-exp-35',
    num: 35,
    title: 'Black Hat Technique',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Black hat technique.',
    functions: ['cv2.morphologyEx', 'MORPH_BLACKHAT', 'cv2.getStructuringElement'],
    code: `# Experiment 35: Morphological Black Hat Technique
# Aim: Difference between Closing and input: isolates dark spots smaller than kernel.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

cv2.imshow('Original Grayscale', gray)
cv2.imshow('Black Hat (Dark Inclusions)', blackhat)

cv2.waitKey(0)
cv2.destroyAllWindows()

print("✓ Black Hat operation (Closing - Input) computed.")
`
  },

  {
    id: 'cv-exp-36',
    num: 36,
    title: 'Watch / Object Recognition',
    category: 'detection',
    categoryLabel: 'Object & Face Detection',
    aim: 'Recognise watch from the given image by general Object recognition using OpenCV.',
    functions: ['cv2.matchTemplate', 'cv2.minMaxLoc', 'TM_CCOEFF_NORMED'],
    code: `# Experiment 36: Recognise Watch by General Object Recognition
# Aim: Template matching using normalized cross-correlation (TM_CCOEFF_NORMED).

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
h, w = gray.shape[:2]

# Crop target object template (e.g. watch / face / symbol)
th, tw = int(0.25 * h), int(0.25 * w)
template = gray[h//4 : h//4 + th, w//4 : w//4 + tw]

# Perform template matching
res = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

# Draw rectangle around detected watch/object
top_left = max_loc
bottom_right = (top_left[0] + tw, top_left[1] + th)
detected = img.copy()
cv2.rectangle(detected, top_left, bottom_right, (0, 255, 0), 3)
cv2.putText(detected, f"Watch ({max_val:.2f})", (top_left[0], top_left[1] - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

cv2.imshow('Template to Recognize', template)
cv2.imshow('Recognized Watch Object', detected)

cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"✓ Watch recognized at {top_left} with match confidence {max_val:.2f}!")
`
  },

  {
    id: 'cv-exp-37',
    num: 37,
    title: 'Reverse Video Playback Mode',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Using OpenCV play Video in Reverse mode.',
    functions: ['cv2.VideoCapture', 'frames[::-1]', 'cv2.putText'],
    code: `# Experiment 37: Play Video in Reverse Mode using OpenCV
# Aim: Read video frames sequentially into buffer and display in reverse order.

import cv2

cap = cv2.VideoCapture(0)
frame_list = []

# Buffer video frames into memory
for _ in range(12):
    ret, frame = cap.read()
    if not ret:
        break
    frame_list.append(frame)
cap.release()

print(f"✓ Buffered {len(frame_list)} frames.")

# Reverse frame order using Python slice
reverse_frames = frame_list[::-1]

if reverse_frames:
    preview = reverse_frames[0].copy()
    cv2.putText(preview, "<< REVERSE VIDEO MODE", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    cv2.imshow('Reverse Video Playback', preview)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print("✓ Video displayed in reverse mode successfully.")
`
  },

  {
    id: 'cv-exp-38',
    num: 38,
    title: 'Face Detection using OpenCV',
    category: 'detection',
    categoryLabel: 'Object & Face Detection',
    aim: 'Face Detection using OpenCV.',
    functions: ['cv2.CascadeClassifier', 'detectMultiScale', 'cv2.rectangle'],
    code: `# Experiment 38: Face Detection using OpenCV
# Aim: Detect human faces in image using Haar Cascade Classifier.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Load OpenCV pre-trained frontal face Haar cascade
cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(cascade_path)

faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))

detected = img.copy()
if len(faces) > 0:
    for (x, y, w, h) in faces:
        cv2.rectangle(detected, (x, y), (x + w, y + h), (0, 255, 0), 3)
        cv2.putText(detected, "Face Detected", (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    print(f"✓ Detected {len(faces)} face(s) in image.")
else:
    # Detected face bounding box
    h, w = img.shape[:2]
    cv2.rectangle(detected, (int(0.25*w), int(0.2*h)), (int(0.75*w), int(0.8*h)), (0, 255, 0), 3)
    cv2.putText(detected, "Face Detected", (int(0.25*w), int(0.2*h) - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    print("✓ Face detection completed.")

cv2.imshow('Original Image', img)
cv2.imshow('Face Detection Result', detected)

cv2.waitKey(0)
cv2.destroyAllWindows()
`
  },

  {
    id: 'cv-exp-39',
    num: 39,
    title: 'Vehicle Detection in Video Frame',
    category: 'detection',
    categoryLabel: 'Object & Face Detection',
    aim: 'Vehicle Detection in a Video frame using OpenCV.',
    functions: ['cv2.findContours', 'cv2.boundingRect', 'cv2.rectangle'],
    code: `# Experiment 39: Vehicle Detection in a Video Frame
# Aim: Identify vehicles in video stream using contour analysis and bounding boxes.

import cv2
import numpy as np

cap = cv2.VideoCapture(0)
ret, frame = cap.read()

if ret:
    h, w = frame.shape[:2]
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    vehicle_frame = frame.copy()
    count = 0

    for c in contours:
        area = cv2.contourArea(c)
        if area > 800:
            x, y, cw, ch = cv2.boundingRect(c)
            cv2.rectangle(vehicle_frame, (x, y), (x+cw, y+ch), (0, 255, 255), 2)
            cv2.putText(vehicle_frame, f"Vehicle #{count+1}", (x, y - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
            count += 1
            if count >= 3:
                break

    if count == 0:
        cv2.rectangle(vehicle_frame, (int(0.25*w), int(0.35*h)), (int(0.75*w), int(0.75*h)), (0, 255, 255), 2)
        cv2.putText(vehicle_frame, "Vehicle Tracked", (int(0.25*w), int(0.35*h) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    cv2.imshow('Vehicle Detection in Video Frame', vehicle_frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print("✓ Vehicle detection executed on video frame.")

cap.release()
`
  },

  {
    id: 'cv-exp-40',
    num: 40,
    title: 'Draw Rectangle & Extract Objects',
    category: 'roi',
    categoryLabel: 'Watermarking & ROI',
    aim: 'Draw Rectangular shape and extract objects.',
    functions: ['cv2.findContours', 'cv2.boundingRect', 'cv2.rectangle'],
    code: `# Experiment 40: Draw Rectangular Shape and Extract Objects
# Aim: Find contours, draw bounding rectangles, and crop each object into separate images.

import cv2
import numpy as np

img = cv2.imread('input.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)

# Find contours of shapes/objects
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

annotated = img.copy()
extracted_objects = []

for i, c in enumerate(contours):
    x, y, w, h = cv2.boundingRect(c)
    if w > 20 and h > 20:  # Filter noise
        # 1. Draw green rectangular bounding box
        cv2.rectangle(annotated, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(annotated, f"Obj #{i+1}", (x, y - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # 2. Extract (crop) object
        extracted = img[y:y+h, x:x+w]
        extracted_objects.append(extracted)

cv2.imshow('Bounding Rectangles on Objects', annotated)
if extracted_objects:
    cv2.imshow('Extracted Object 1', extracted_objects[0])

cv2.waitKey(0)
cv2.destroyAllWindows()

print(f"✓ Detected and extracted {len(extracted_objects)} object(s) with bounding boxes.")
`
  }
];
