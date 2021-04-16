import styles from './reid.css';
import {Avatar, Col, Divider, Image, List, Row} from "antd";
import {useState} from "react";
import ImportId from "@/pages/ImportId";
import Retrieval from "@/pages/Retrieval";
import {fallbackImage} from "@/pages/util";


export default function () {
  const [
    currentImage,
    setCurrentImage
  ] = useState(fallbackImage)

  const [results, setResults] = useState([])

  const [previewImage, setPreviewImage] = useState(fallbackImage);
  return (
    <>
      <div className={styles.siteLayoutContent}>
        <Row>
          <Col span={16}>
            <Row>
              <Image
                width="650px"
                height="650px"
                src={currentImage}
                fallback={fallbackImage}
              />
            </Row>
            <Divider/>
            <Row>
              <Col>
                <div style={{overflowX: "auto", width: 650, height: 154}}>
                  {results.map((result, index) =>
                    <table style={{float: "left", width: 120}}>
                      <tr>
                        <td><b>ID:</b> {result.id} </td>
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
          </Col>
          <Col span={8} style={{paddingLeft: 15}}>
            <Retrieval setResults={(results) => {
              if (results.length <= 0) {
                return
              }
              setCurrentImage("data:image/jpeg;base64," + results[0].image)
              setResults(results)
            }}/>
            <Divider/>
            <ImportId/>
          </Col>
        </Row>
      </div>
    </>
  );
}
