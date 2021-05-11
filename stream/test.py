from PIL import Image
from subprocess import Popen, PIPE
import cv2
fps, duration = 24, 10000
p = Popen(['ffmpeg', '-y', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-r', '10', '-i', '-', '-vcodec:v', 'libx264', '-video_size', '1280x720', '-f', 'flv', '-strict',  'experimental', 'rtmp://localhost/show/stream'], stdin=PIPE)
cap = cv2.VideoCapture(0)
while True:
    p.stdout.flush()
    _, frame = cap.read()
    im = Image.fromarray(frame, 'RGB')
    im.save(p.stdin, 'JPEG')
p.stdin.close()
p.wait()

