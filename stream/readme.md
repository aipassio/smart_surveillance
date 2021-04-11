# stream video 
```ffmpeg -re -i 1.mp4 -vcodec libx264 -vprofile baseline -g 30 -acodec aac -strict -2 -f flv rtmp://localhost/show/stream```

# stream image

```ffmpeg -framerate 1 -f image2 -i 1.jpg -c:v libx264 -vf format=yuv420p -r 25 -movflags +faststart -f flv rtmp://localhost/show/stream```

## view stream 

```http://localhost```