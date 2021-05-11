from mmdet.apis import init_detector, inference_detector
import mmcv
import cv2
from PIL import Image
from subprocess import Popen, PIPE
fps, duration = 24, 10000
from time import time, sleep
import numpy as np
import sys
import os
import django
from django.utils import timezone
sys.path.append('..')
sys.path.append('../visual_retrieval')
from retrieval.algorithms import algorithms
os.environ['DJANGO_SETTINGS_MODULE'] = 'reid.settings'
django.setup()
from retrieval import views
# from retrieval.views import ALGORITHMS
url = ''
ALGORITHMS = {
    "features":{
        0: "naive",
        1: "lbp",
        2: "BGR_1_1",
        3: "BGR_1_2",
        4: "BGR_2_1",
        5: "BGR_2_2",
        6: "HSV_1_1",
        7: "HSV_1_2",
        8: "HSV_2_1",
        9: "HSV_2_2",
        10: "HSV_4_0",
    },
    "distances":{
        0: "l2_distance",
        1: "histogram_intersection",
    }
}
from retrieval.models import Object, Camera
import base64
os.environ['status'] = '0'
os.environ['url'] = ''

def show_image(result, img, thresh, obj_id, count):
    object_list = []
    density = 0
    for i, kind in enumerate(result):
        font = cv2.FONT_HERSHEY_SIMPLEX
        for obj in kind:
            if obj[4] < thresh:
                continue
            obj = obj.astype(np.int32)
            color = (255, 0, 0)
            name = 'Person'
            if i != 0:
                color = (0, 255, 0)
                name = 'Vehicle'
            object_img = img[obj[1]: obj[3], obj[0]: obj[2]]
            new_obj_feature = dict()
            start = time()
            if count%10000000000==0:
                for key in ALGORITHMS['features'].keys():
                    method = getattr(algorithms, ALGORITHMS['features'][key])
                    method_result = method(object_img)
                    if isinstance(method_result, dict):
                        new_obj_feature.update(method_result)
                    else:
                        new_obj_feature[ALGORITHMS["features"][key]] = method_result
                # import ipdb; ipdb.set_trace()
                object_img_string = base64.b64encode(cv2.imencode('.jpg',object_img)[1].tobytes()).decode('utf-8')
            # new_obj_feature = Non
                new_obj = Object.objects.create(object_id = obj_id,\
                    object_img=object_img_string,\
                        features=new_obj_feature)
            # new_obj = dict(object_id = obj_id,\
            #     object_img=object_img_string,\
            #         features=new_obj_feature)
                object_list.append(new_obj)
                obj_id += 1
            # print(round((time() - start),4), 's')
                new_obj.save()
            density +=1
            cv2.rectangle(img, (obj[0], obj[1]), (obj[2], obj[3]), color, 3)
            cv2.putText(img, name,(obj[0], obj[1]), font, 0.8, color,3, cv2.LINE_AA)
    # import ipdb; ipdb.set_trace()
    # Object.objects.bulk_create(object_list)
    # import ipdb; ipdb.set_trace()

    return img, obj_id, density

if __name__== "__main__" :
    obj_id = 0
    # Specify the path to model config and checkpoint file
    config_file = './configs/net.py'
    checkpoint_file = 'https://openmmlab.oss-cn-hangzhou.aliyuncs.com/mmdetection/v2.0/vfnet/vfnet_r50_fpn_mdconv_c3-c5_mstrain_2x_coco/vfnet_r50_fpn_mdconv_c3-c5_mstrain_2x_coco_20201027pth-6879c318.pth'

    # build the model from a config file and a checkpoint file
    model = init_detector(config_file, checkpoint_file, device='cuda:0')

    # test a video and show the results
    # video = mmcv.VideoReader('video.mp4')
    cap = cv2.VideoCapture('/home/thetwin/Downloads/test.mp4')
    # cap = cv2.VideoCapture(0)
    fps = cap.get(cv2.CAP_PROP_FPS)
    p = Popen(['ffmpeg',
    '-y', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-r', str(fps), '-i', '-', '-vcodec', 'libx264', '-r', str(fps), '-strict', '-2', '-f', 'flv','rtmp://localhost/show/stream'], stdin=PIPE, bufsize=16000)
    count = 0
    old_url = ''
    cap = cv2.VideoCapture(old_url)
    nothing_img = cv2.imread('./nothing.jpg')
    nothing_img = cv2.imencode('.jpg', nothing_img)[1]
    density = []
    sum_obj = 0
    while True:
        cur_time = timezone.now().strftime("%m/%d/%Y, %H:%M:%S")
        start = time()
        if len(Camera.objects.values())>0:
            status = Camera.objects.get().status
            url = Camera.objects.get().url
            # if len(os.listdir("/home/thetwin/projects/master_program/multimedia/smart_surveillance/stream/mnt/hls/")) >0:
            #     os.system("rm /home/thetwin/projects/master_program/multimedia/smart_surveillance/stream/mnt/hls/* ")
        if url != old_url:
            cap = cv2.VideoCapture(url)
            old_url = url
            # if len(os.listdir("/home/thetwin/projects/master_program/multimedia/smart_surveillance/stream/mnt/hls/")) >0:
            #     os.system("rm -rf /home/thetwin/projects/master_program/multimedia/smart_surveillance/stream/mnt/hls/* ")
        # import ipdb; ipdb.set_trace()
        _, frame = cap.read()
        if frame is None:
            p.stdin.write(nothing_img.tostring())
            sleep(1/fps)
            continue
        result = []
        if int(status) == 1 and count%1 == 0: 
            result = inference_detector(model, frame)
        # visualize the results in a new window
        img, obj_id, density_  = show_image(result[:8], frame, 0.4, obj_id, count)
        density.append(density_)
        sum_obj+=density_
        # if sum_obj > 500:
        #     Object.objects.all().delete()
        #     sum_obj = 0
        if len(density)>60:
            density = density[1:]
        # img = Image.fromarray(img, 'RGB')
        # img.save(p.stdin, 'JPEG')
        cv2.putText(img, cur_time,(10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255),3, cv2.LINE_AA)
        cv2.putText(img,"Mean density last 60 frames: " + str(int(sum(density)/60)),(10, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255),3, cv2.LINE_AA)
        if int(status)==1:
            cv2.putText(img,"Detection ON", (10, 130), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0),3, cv2.LINE_AA)
        else:
            cv2.putText(img,"Detection OFF", (10, 130), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255),3, cv2.LINE_AA)
        cv2.putText(img,str(round(1/(time() - start),2)) +' fps', (img.shape[1]-150, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255),3, cv2.LINE_AA)
        print(round(1/(time() - start),2), 'fps')
        # cv2.imwrite("/home/thetwin/projects/master_program/multimedia/stored_frames/"+str(count).zfill(6)+".jpg", img)
        img = cv2.imencode('.jpg', img)[1]
        p.stdin.write(img.tostring())
        # sleep(1/fps)
        count+=1
