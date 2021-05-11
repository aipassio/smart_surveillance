import {Row} from "antd";
import styles from './ReidVideoPlayer.css';
import { useEffect, useState } from 'react';
import Button from "@/pages/Button";
import myvideo from '../assets/myvideo.mp4' // relative path to image 

import request from "umi-request";





export default function ReidVideoPlayer(props) {
    console.log('myvideo',myvideo)
    const defaultVideoURL = "http://171.232.191.170:8090/hls/stream.m3u8"
    const defaultInputVideoURL = "/home/thetwin/Downloads/traffic_no_shadow/20170812_162710.mp4"
    const[textURL,setTextURL] = useState(defaultInputVideoURL)
    const[isPlay,setisPlay] = useState(true)
    //const[isDetection,setDetection] = useState(false)
    useEffect(()=>{

      var player = videojs('#myvideo');
    });
    const onClickPlay = (e) => {
        
        e.preventDefault()
       setisPlay(!isPlay)
       //const video = document.getElementById('myvideo')
       // video.src = textURL
       
       // isPlay?video.play():video.pause()
        request.post("http://171.232.191.170:8000/camera", {
            method: 'post',
            processData: false,
            data: {
                status: isPlay?"1":"0",
                url: textURL
            }
          }).then(function (response) {
           console.log(response);

          })
            .catch(function (error) {
              alert(`error: ${error}`);
            });
        

     }
    return (
      <>
           <header className = {styles.header}>
              <h1 >STREAM VIDEO:</h1>
           
           </header>

        <form className={styles['add-form']}>
            <div className={styles['form-control']} >
                <label>Video URL</label>
                <input type='text' value={defaultInputVideoURL} placeholder={defaultInputVideoURL}
                value={textURL}
                onChange={(e) => setTextURL(e.target.value)}
                
                />
            </div>

            <Button color = {isPlay?'green':'red'} text = {isPlay?'Start':'Stop'} onClick={onClickPlay}/>
        </form>

           <Row id='video player'>
          {/* <video id='myvideo'   src={defaultVideoURL}
          width="100%"
          //autoPlay={true}
          controls></video> */}
          
          <video id="myvideo" autoPlay={true} class="video-js vjs-default-skin" width="720" controls preload="auto">
			<source src={defaultVideoURL} type="application/x-mpegURL" />
		</video>
          </Row>
           
       
      </>
    );
  }
  