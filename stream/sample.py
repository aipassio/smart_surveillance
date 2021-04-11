from PIL import Image
from subprocess import Popen, PIPE
fps, duration = 24, 10000
p = Popen(['ffmpeg.exe',
 '-y', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-r', '24', '-i', '-', '-vcodec', 'libx264', '-r', '24', '-strict', '-2', '-f', 'flv','rtmp://localhost/show/stream'], stdin=PIPE)
for i in range(fps * duration):
    im = Image.new("RGB", (1024, 768), (i, 1, 1))
    im.save(p.stdin, 'JPEG')
p.stdin.close()
p.wait()