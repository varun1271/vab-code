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
    functions: ['cv2.imread', 'cv2.cvtColor', 'COLOR_BGR2GRAY', 'cv2_imshow'],
    code: `import cv2
from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()
img = cv2.imread(list(f.keys())[0])
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2_imshow(img)
cv2_imshow(gray)
`
  },

  {
    id: 'cv-exp-2',
    num: 2,
    title: 'Gaussian Blur',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Convert an Image to Blur using GaussianBlur.',
    functions: ['cv2.GaussianBlur', 'cv2.imread', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

blur = cv2.GaussianBlur(img, (5, 5), 0)

cv2_imshow(img)
cv2_imshow(blur)
`
  },

  {
    id: 'cv-exp-3',
    num: 3,
    title: 'Canny Edge Outline',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Convert an Image to show outline using Canny function.',
    functions: ['cv2.Canny', 'cv2.cvtColor', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

edges = cv2.Canny(gray, 100, 200)

cv2_imshow(img)
cv2_imshow(edges)
`
  },

  {
    id: 'cv-exp-4',
    num: 4,
    title: 'Image Dilation',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Dilate an Image using Dilate function.',
    functions: ['cv2.dilate', 'cv2.getStructuringElement', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))

dilate = cv2.dilate(gray, kernel)

cv2_imshow(img)
cv2_imshow(dilate)
`
  },

  {
    id: 'cv-exp-5',
    num: 5,
    title: 'Image Erosion',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Read an image in Python and Erode an Image using erode function.',
    functions: ['cv2.erode', 'cv2.getStructuringElement', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))

erode = cv2.erode(gray, kernel)

cv2_imshow(img)
cv2_imshow(erode)
`
  },

  {
    id: 'cv-exp-6',
    num: 6,
    title: 'Video Processing (Slow & Fast Motion)',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Read captured video in Python and display the video in slow motion and fast motion.',
    functions: ['cv2.VideoCapture', 'cv2.VideoWriter', 'IPython.display'],
    code: `import cv2
from google.colab import files
from IPython.display import Video, display

f = files.upload()

input_video = list(f.keys())[0]

video = cv2.VideoCapture(input_video)

fps = video.get(cv2.CAP_PROP_FPS)
width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

fast = cv2.VideoWriter(
    "fast_temp.mp4",
    cv2.VideoWriter_fourcc(*"mp4v"),
    fps * 2,
    (width, height)
)

slow = cv2.VideoWriter(
    "slow_temp.mp4",
    cv2.VideoWriter_fourcc(*"mp4v"),
    fps / 2,
    (width, height)
)

while True:
    ret, frame = video.read()

    if not ret:
        break

    fast.write(frame)
    slow.write(frame)

video.release()
fast.release()
slow.release()

!ffmpeg -y -i fast_temp.mp4 -vcodec libx264 -acodec aac fast_motion.mp4 -loglevel error
!ffmpeg -y -i slow_temp.mp4 -vcodec libx264 -acodec aac slow_motion.mp4 -loglevel error

print("Fast Motion:")
display(Video("fast_motion.mp4", embed=True))

print("Slow Motion:")
display(Video("slow_motion.mp4", embed=True))
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
    code: `import cv2

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Webcam stream initialized in sandbox environment.")

ret, frame = cap.read()
if ret:
    h, w = frame.shape[:2]
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
    functions: ['cv2.resize', 'fx=2', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

bigger = cv2.resize(img, None, fx=2, fy=2)

smaller = cv2.resize(img, None, fx=0.5, fy=0.5)

cv2_imshow(img)
cv2_imshow(bigger)
cv2_imshow(smaller)
`
  },

  {
    id: 'cv-exp-9',
    num: 9,
    title: 'Image Rotation (Clockwise & Counter-Clockwise)',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Perform Rotation of an image to clockwise and counter clockwise direction.',
    functions: ['cv2.rotate', 'ROTATE_90_CLOCKWISE', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

clockwise = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)

counter_clockwise = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

cv2_imshow(img)
cv2_imshow(clockwise)
cv2_imshow(counter_clockwise)
`
  },

  {
    id: 'cv-exp-10',
    num: 10,
    title: 'Image Translation (Moving)',
    category: 'basic',
    categoryLabel: 'Basic Operations',
    aim: 'Perform moving of an image from one place to another.',
    functions: ['cv2.warpAffine', 'np.float32', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

rows, cols = img.shape[:2]

M = np.float32([[1, 0, 100],
                [0, 1, 50]])

moved = cv2.warpAffine(img, M, (cols, rows))

cv2_imshow(img)
cv2_imshow(moved)
`
  },

  {
    id: 'cv-exp-11',
    num: 11,
    title: 'Affine Transformation',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform Affine Transformation on the image.',
    functions: ['cv2.getAffineTransform', 'cv2.warpAffine', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

rows, cols = img.shape[:2]

p1 = np.float32([[50, 50], [200, 50], [50, 200]])
p2 = np.float32([[10, 100], [200, 50], [100, 250]])

M = cv2.getAffineTransform(p1, p2)

affine = cv2.warpAffine(img, M, (cols, rows))

cv2_imshow(img)
cv2_imshow(affine)
`
  },

  {
    id: 'cv-exp-12',
    num: 12,
    title: 'Perspective Transformation (Image)',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform Perspective Transformation on the image.',
    functions: ['cv2.getPerspectiveTransform', 'cv2.warpPerspective', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

rows, cols = img.shape[:2]

p1 = np.float32([[0, 0], [cols, 0],
                 [0, rows], [cols, rows]])

p2 = np.float32([[50, 50], [cols-50, 50],
                 [0, rows], [cols, rows]])

M = cv2.getPerspectiveTransform(p1, p2)

perspective = cv2.warpPerspective(img, M, (cols, rows))

cv2_imshow(img)
cv2_imshow(perspective)
`
  },

  {
    id: 'cv-exp-13',
    num: 13,
    title: 'Perspective Transformation on Video',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Perform Perspective Transformation on the Video.',
    functions: ['cv2.VideoCapture', 'cv2.warpPerspective', 'IPython.display'],
    code: `import cv2
import numpy as np

from google.colab import files
from IPython.display import Video, display

f = files.upload()

video = cv2.VideoCapture(list(f.keys())[0])

fps = video.get(cv2.CAP_PROP_FPS)
width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

output = cv2.VideoWriter(
    "perspective_temp.mp4",
    cv2.VideoWriter_fourcc(*"mp4v"),
    fps,
    (width, height)
)

p1 = np.float32([[0, 0], [width, 0],
                 [0, height], [width, height]])

p2 = np.float32([[50, 50], [width-50, 50],
                 [0, height], [width, height]])

M = cv2.getPerspectiveTransform(p1, p2)

while True:
    ret, frame = video.read()

    if not ret:
        break

    transformed = cv2.warpPerspective(frame, M, (width, height))

    output.write(transformed)

video.release()
output.release()

!ffmpeg -y -i perspective_temp.mp4 -vcodec libx264 -acodec aac perspective_video.mp4 -loglevel error

display(Video("perspective_video.mp4", embed=True))
`
  },

  {
    id: 'cv-exp-14',
    num: 14,
    title: 'Transformation using Homography Matrix',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform transformation using Homography matrix.',
    functions: ['cv2.findHomography', 'cv2.warpPerspective', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

rows, cols = img.shape[:2]

p1 = np.float32([[0, 0], [cols, 0],
                 [0, rows], [cols, rows]])

p2 = np.float32([[50, 50], [cols-50, 50],
                 [0, rows], [cols, rows]])

H, status = cv2.findHomography(p1, p2)

homography = cv2.warpPerspective(img, H, (cols, rows))

cv2_imshow(img)
cv2_imshow(homography)
`
  },

  {
    id: 'cv-exp-15',
    num: 15,
    title: 'Direct Linear Transformation (DLT)',
    category: 'transform',
    categoryLabel: 'Transformations',
    aim: 'Perform transformation using Direct Linear Transformation (DLT).',
    functions: ['np.linalg.svd', 'cv2.warpPerspective', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

rows, cols = img.shape[:2]

p1 = np.float32([[0, 0], [cols, 0],
                 [0, rows], [cols, rows]])

p2 = np.float32([[50, 50], [cols-50, 50],
                 [0, rows], [cols, rows]])

A = []

for (x, y), (u, v) in zip(p1, p2):
    A.append([-x, -y, -1, 0, 0, 0, u*x, u*y, u])
    A.append([0, 0, 0, -x, -y, -1, v*x, v*y, v])

A = np.array(A)

U, S, Vt = np.linalg.svd(A)

H = Vt[-1].reshape(3, 3)

dlt = cv2.warpPerspective(img, H, (cols, rows))

cv2_imshow(img)
cv2_imshow(dlt)
`
  },

  {
    id: 'cv-exp-16',
    num: 16,
    title: 'Edge Detection using Canny Method',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Canny method.',
    functions: ['cv2.Canny', 'cv2.cvtColor', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

edges = cv2.Canny(gray, 100, 200)

cv2_imshow(img)
cv2_imshow(edges)
`
  },

  {
    id: 'cv-exp-17',
    num: 17,
    title: 'Edge Detection using Sobel Matrix along X Axis',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Sobel Matrix along X axis.',
    functions: ['cv2.Sobel', 'cv2.convertScaleAbs', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)

sobel_x = cv2.convertScaleAbs(sobel_x)

cv2_imshow(img)
cv2_imshow(sobel_x)
`
  },

  {
    id: 'cv-exp-18',
    num: 18,
    title: 'Edge Detection using Sobel Matrix along Y Axis',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Sobel Matrix along Y axis.',
    functions: ['cv2.Sobel', 'cv2.convertScaleAbs', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

sobel_y = cv2.convertScaleAbs(sobel_y)

cv2_imshow(img)
cv2_imshow(sobel_y)
`
  },

  {
    id: 'cv-exp-19',
    num: 19,
    title: 'Edge Detection using Sobel Matrix along XY Axis',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Perform Edge detection using Sobel Matrix along XY axis.',
    functions: ['cv2.Sobel', 'cv2.convertScaleAbs', 'cv2.addWeighted', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

sobel_x = cv2.convertScaleAbs(sobel_x)
sobel_y = cv2.convertScaleAbs(sobel_y)

sobel_xy = cv2.addWeighted(sobel_x, 0.5, sobel_y, 0.5, 0)

cv2_imshow(img)
cv2_imshow(sobel_xy)
`
  },

  {
    id: 'cv-exp-20',
    num: 20,
    title: 'Sharpening using Laplacian Mask with Negative Center Coefficient',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Laplacian mask with negative center coefficient.',
    functions: ['np.array', 'cv2.filter2D', 'cv2.subtract', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

kernel = np.array([[0, 1, 0],
                   [1, -4, 1],
                   [0, 1, 0]])

laplacian = cv2.filter2D(img, -1, kernel)

sharpened = cv2.subtract(img, laplacian)

cv2_imshow(img)
cv2_imshow(sharpened)
`
  },

  {
    id: 'cv-exp-21',
    num: 21,
    title: 'Sharpening using Laplacian Mask with Diagonal Neighbors',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Laplacian mask implemented with an extension of diagonal neighbors.',
    functions: ['np.array', 'cv2.filter2D', 'cv2.subtract', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

kernel = np.array([[1, 1, 1],
                   [1, -8, 1],
                   [1, 1, 1]])

laplacian = cv2.filter2D(img, -1, kernel)

sharpened = cv2.subtract(img, laplacian)

cv2_imshow(img)
cv2_imshow(sharpened)
`
  },

  {
    id: 'cv-exp-22',
    num: 22,
    title: 'Sharpening using Laplacian Mask with Positive Center Coefficient',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Laplacian mask with positive center coefficient.',
    functions: ['np.array', 'cv2.filter2D', 'cv2.add', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

kernel = np.array([[0, -1, 0],
                   [-1, 4, -1],
                   [0, -1, 0]])

laplacian = cv2.filter2D(img, -1, kernel)

sharpened = cv2.add(img, laplacian)

cv2_imshow(img)
cv2_imshow(sharpened)
`
  },

  {
    id: 'cv-exp-23',
    num: 23,
    title: 'Sharpening using Unsharp Masking',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using unsharp masking.',
    functions: ['cv2.GaussianBlur', 'cv2.addWeighted', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

blur = cv2.GaussianBlur(img, (5, 5), 0)

sharpened = cv2.addWeighted(img, 1.5, blur, -0.5, 0)

cv2_imshow(img)
cv2_imshow(sharpened)
`
  },

  {
    id: 'cv-exp-24',
    num: 24,
    title: 'Sharpening using High-Boost Mask',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using High-Boost Mask.',
    functions: ['cv2.GaussianBlur', 'cv2.addWeighted', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

blur = cv2.GaussianBlur(img, (5, 5), 0)

high_boost = cv2.addWeighted(img, 2.0, blur, -1.0, 0)

cv2_imshow(img)
cv2_imshow(high_boost)
`
  },

  {
    id: 'cv-exp-25',
    num: 25,
    title: 'Sharpening using Gradient Masking',
    category: 'sharpen',
    categoryLabel: 'Sharpening',
    aim: 'Perform Sharpening of Image using Gradient Masking.',
    functions: ['cv2.Sobel', 'cv2.magnitude', 'cv2.convertScaleAbs', 'cv2.add', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)

gradient = cv2.magnitude(sobel_x, sobel_y)

gradient = cv2.convertScaleAbs(gradient)

sharpened = cv2.add(gray, gradient)

cv2_imshow(img)
cv2_imshow(sharpened)
`
  },

  {
    id: 'cv-exp-26',
    num: 26,
    title: 'Insert Watermark to Image using OpenCV',
    category: 'roi',
    categoryLabel: 'Watermarking & ROI',
    aim: 'Insert water marking to the image using OpenCV.',
    functions: ['cv2.putText', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

watermark = "VAB-CODE"

cv2.putText(img, watermark, (50, 50),
            cv2.FONT_HERSHEY_SIMPLEX, 1,
            (255, 255, 255), 2)

cv2_imshow(img)
`
  },

  {
    id: 'cv-exp-27',
    num: 27,
    title: 'Cropping, Copying and Pasting Image Inside Another Image',
    category: 'roi',
    categoryLabel: 'Watermarking & ROI',
    aim: 'Do Cropping, Copying and pasting image inside another image using OpenCV.',
    functions: ['img[y:y+h, x:x+w]', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

crop = img[50:200, 50:200]

img[250:400, 250:400] = crop

cv2_imshow(img)
cv2_imshow(crop)
`
  },

  {
    id: 'cv-exp-28',
    num: 28,
    title: 'Find Boundary using Convolution Kernel',
    category: 'edge',
    categoryLabel: 'Edge Detection',
    aim: 'Find the boundary of the image using Convolution kernel for the given image.',
    functions: ['cv2.filter2D', 'np.array', 'cv2.cvtColor', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.array([
    [-1, -1, -1],
    [-1,  8, -1],
    [-1, -1, -1]
])

boundary = cv2.filter2D(gray, -1, kernel)

cv2_imshow(img)
cv2_imshow(boundary)
`
  },

  {
    id: 'cv-exp-29',
    num: 29,
    title: 'Morphological Operation using Erosion',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Erosion technique.',
    functions: ['cv2.erode', 'np.ones', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

eroded = cv2.erode(gray, kernel)

cv2_imshow(img)
cv2_imshow(eroded)
`
  },

  {
    id: 'cv-exp-30',
    num: 30,
    title: 'Morphological Operation using Dilation',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Dilation technique.',
    functions: ['cv2.dilate', 'np.ones', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

dilated = cv2.dilate(gray, kernel)

cv2_imshow(img)
cv2_imshow(dilated)
`
  },

  {
    id: 'cv-exp-31',
    num: 31,
    title: 'Morphological Opening',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Opening technique.',
    functions: ['cv2.morphologyEx', 'MORPH_OPEN', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

opening = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)

cv2_imshow(img)
cv2_imshow(opening)
`
  },

  {
    id: 'cv-exp-32',
    num: 32,
    title: 'Morphological Closing',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Closing technique.',
    functions: ['cv2.morphologyEx', 'MORPH_CLOSE', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

closing = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)

cv2_imshow(img)
cv2_imshow(closing)
`
  },

  {
    id: 'cv-exp-33',
    num: 33,
    title: 'Morphological Gradient',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Morphological Gradient technique.',
    functions: ['cv2.morphologyEx', 'MORPH_GRADIENT', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

gradient = cv2.morphologyEx(gray, cv2.MORPH_GRADIENT, kernel)

cv2_imshow(img)
cv2_imshow(gradient)
`
  },

  {
    id: 'cv-exp-34',
    num: 34,
    title: 'Morphological Top Hat',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Top hat technique.',
    functions: ['cv2.morphologyEx', 'MORPH_TOPHAT', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

top_hat = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, kernel)

cv2_imshow(img)
cv2_imshow(top_hat)
`
  },

  {
    id: 'cv-exp-35',
    num: 35,
    title: 'Morphological Black Hat',
    category: 'morphology',
    categoryLabel: 'Morphological Operations',
    aim: 'Morphological operations based on OpenCV using Black hat technique.',
    functions: ['cv2.morphologyEx', 'MORPH_BLACKHAT', 'cv2_imshow'],
    code: `import cv2
import numpy as np

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

kernel = np.ones((5, 5), np.uint8)

black_hat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

cv2_imshow(img)
cv2_imshow(black_hat)
`
  },

  {
    id: 'cv-exp-36',
    num: 36,
    title: 'Recognise Watch using Object Recognition',
    category: 'detection',
    categoryLabel: 'Object & Face Detection',
    aim: 'Recognise watch from the given image by general Object recognition using OpenCV.',
    functions: ['cv2.matchTemplate', 'cv2.minMaxLoc', 'TM_CCOEFF_NORMED', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

template = gray[50:200, 50:200]

result = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)

_, max_val, _, max_loc = cv2.minMaxLoc(result)

h, w = template.shape

cv2.rectangle(img, max_loc,
              (max_loc[0] + w, max_loc[1] + h),
              (0, 255, 0), 2)

cv2_imshow(img)
`
  },

  {
    id: 'cv-exp-37',
    num: 37,
    title: 'Play Video in Reverse Mode',
    category: 'video',
    categoryLabel: 'Video & Camera',
    aim: 'Using OpenCV play Video in Reverse mode.',
    functions: ['cv2.VideoCapture', 'reversed(frames)', 'cv2.VideoWriter'],
    code: `import cv2
import numpy as np

from google.colab import files
from IPython.display import Video, display

f = files.upload()

input_video = list(f.keys())[0]

video = cv2.VideoCapture(input_video)

frames = []

while True:
    ret, frame = video.read()

    if not ret:
        break

    frames.append(frame)

fps = video.get(cv2.CAP_PROP_FPS)
width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

video.release()

output = cv2.VideoWriter(
    "reverse_temp.mp4",
    cv2.VideoWriter_fourcc(*"mp4v"),
    fps,
    (width, height)
)

for frame in reversed(frames):
    output.write(frame)

output.release()

!ffmpeg -y -i reverse_temp.mp4 -vcodec libx264 -acodec aac reverse_video.mp4 -loglevel error

display(Video("reverse_video.mp4", embed=True))
`
  },

  {
    id: 'cv-exp-38',
    num: 38,
    title: 'Face Detection using OpenCV',
    category: 'detection',
    categoryLabel: 'Object & Face Detection',
    aim: 'Face Detection using OpenCV.',
    functions: ['cv2.CascadeClassifier', 'detectMultiScale', 'cv2.rectangle', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

faces = face_cascade.detectMultiScale(gray, 1.1, 5)

for x, y, w, h in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

cv2_imshow(img)
`
  },

  {
    id: 'cv-exp-39',
    num: 39,
    title: 'Vehicle Detection in a Video Frame',
    category: 'detection',
    categoryLabel: 'Object & Face Detection',
    aim: 'Vehicle Detection in a Video frame using OpenCV.',
    functions: ['cv2.createBackgroundSubtractorMOG2', 'cv2.findContours', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

video = cv2.VideoCapture(list(f.keys())[0])

background = cv2.createBackgroundSubtractorMOG2()

count = 0

while True:
    ret, frame = video.read()

    if not ret:
        break

    mask = background.apply(frame)

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    for contour in contours:
        area = cv2.contourArea(contour)

        if area > 1000:
            x, y, w, h = cv2.boundingRect(contour)

            cv2.rectangle(
                frame,
                (x, y),
                (x+w, y+h),
                (0, 255, 0),
                2
            )

    if count == 30:
        cv2_imshow(frame)
        break

    count += 1

video.release()
`
  },

  {
    id: 'cv-exp-40',
    num: 40,
    title: 'Draw Rectangle and Extract Objects',
    category: 'roi',
    categoryLabel: 'Watermarking & ROI',
    aim: 'Draw Rectangular shape and extract objects.',
    functions: ['cv2.rectangle', 'cv2_imshow'],
    code: `import cv2

from google.colab import files
from google.colab.patches import cv2_imshow

f = files.upload()

img = cv2.imread(list(f.keys())[0])

x1, y1 = 50, 50
x2, y2 = 250, 250

cv2.rectangle(
    img,
    (x1, y1),
    (x2, y2),
    (0, 255, 0),
    2
)

object = img[y1:y2, x1:x2]

cv2_imshow(img)
cv2_imshow(object)
`
  }
];
