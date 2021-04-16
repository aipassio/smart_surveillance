import {Row} from "antd";
import styles from './ReidVideoPlayer.css';
import { useState } from 'react';
import Button from "@/pages/Button";
import myvideo from '../assets/myvideo.mp4' // relative path to image 

export default function ReidVideoPlayer(props) {
    console.log('myvideo',myvideo)
    const defaultVideoURL = myvideo
    const[textURL,setTextURL] = useState('')
    const[isPlay,setisPlay] = useState(true)

   
    const onClickPlay = (e) => {
        
        e.preventDefault()
        setisPlay(!isPlay)
        const video = document.getElementById('myvideo')
        video.src = textURL
        
        isPlay?video.play():video.pause()
 
        

     }
    return (
      <>
           <header className = {styles.header}>
              <h1 >STREAM VIDEO:</h1>
           
           </header>

        <form className={styles['add-form']}>
            <div className={styles['form-control']} >
                <label>Video URL</label>
                <input type='text' placeholder={defaultVideoURL}
                value={textURL}
                onChange={(e) => setTextURL(e.target.value)}
                
                />
            </div>

            <Button color = {isPlay?'green':'red'} text = {isPlay?'Start':'Stop'} onClick={onClickPlay}/>
        </form>

           <Row id='video player'>
          <video id='myvideo'   src={defaultVideoURL}
          width="100%"
          //autoPlay="true"
          controls></video>
          
          </Row>
           
       
      </>
    );
  }
  