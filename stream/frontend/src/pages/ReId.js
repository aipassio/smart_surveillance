import styles from './reid.css';
import {Avatar, Col, Divider, Image, List, Row} from "antd";
import {useState} from "react";
import ImportId from "@/pages/ImportId";
import Retrieval from "@/pages/Retrieval";
import ReidVideoPlayer from "@/pages/ReidVideoPlayer";
import {fallbackImage} from "@/pages/util";
import {Menu} from 'antd';

export default function (props) {
  console.log('props.abc', props.abc)
  const [
    currentImage,
    setCurrentImage
  ] = useState(fallbackImage)

  const [results, setResults] = useState([])

  const [previewImage, setPreviewImage] = useState(fallbackImage);

  const [showRetrieval, setshowRetrieval] = useState(false)
  const [showImport, setshowImport] = useState(true)
  const [showVideo, setshowVideo] = useState(false)

  const handleMenuButton = (key) => {
    //console.log('key',key);
    setshowImport(key==='1')
    setshowRetrieval(key==='2')
    setshowVideo(key==='3')
    //console.log('showRetrieval',showRetrieval);

  }
  return (
    


   
    <>
    
  <Menu theme="dark" mode="horizontal" men defaultSelectedKeys={['1']}
      style={{lineHeight: "92px"}}
        onClick = {(e) =>
          handleMenuButton(e.key)
        }

        >
          <Menu.Item key="1">Import Image</Menu.Item>
          <Menu.Item key="2">Retrieval Image</Menu.Item>
          <Menu.Item key="3">Streaming video</Menu.Item>
          
        </Menu> 
        
           <div className={styles.siteLayoutContent}>
         
           {showVideo && <ReidVideoPlayer width="80%"/>}

        <Row id='body' >
        <Col id='col 1' span={8} style={{paddingLeft: 15}}>
          {showRetrieval && <Retrieval setResults={(results) => {
              if (results.length <= 0) {
                return
              }
              setCurrentImage("data:image/jpeg;base64," + results[0].image)
              setResults(results)
            }}/>}
            {/*<Divider/>*/}
            {showImport &&<ImportId/>}
          </Col>
          {showRetrieval && <Col id='body retrieval result' span={16}>
            <Row>
              <Image
               // width="80%"
               style={{maxHeight:350,width:"auto",height:"auto"}}

                src={currentImage}
                fallback={fallbackImage}
              />
            </Row>
            <Divider/>
            <Row id="List of retrieval result">
              <Col>
                <div style={{overflowX: "auto", width: "80%"}}>
                  {results.map((result, index) =>
                    <table style={{float: "left", width: 120}}>
                      <tr>
                        <td><b>Image ID:</b> {result.id} </td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td><b>Distance:</b> {result.distance.toFixed(2)}</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <Image
                            key={index}
                            preview={false}
                            style={{cursor: "pointer"}}
                            onClick={(item) => {
                              setCurrentImage("data:image/jpeg;base64," + result.image)
                            }}
                            width="100px"
                            height="100px"
                            src={"data:image/jpeg;base64," + result.image}
                            fallback={fallbackImage}
                          />
                        </td>
                      </tr>
                    </table>
                  )}
                </div>
              </Col>
            </Row>
          </Col> //end of body retrieval result
          
          }
          
        </Row>
      </div>
     
    </>
  );
}
