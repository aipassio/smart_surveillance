import {Button, Col, Form, Input, Row, Upload,Image} from "antd";
import {useState} from "react";
import request from "umi-request";
import {fallbackImage, importURL} from "@/pages/util";

import "./ImportId.css";

export default function ImportId() {
  const [form] = Form.useForm();
  const [initValues] = useState({
    id: 0,
    image: "base"
  });

  const onFinish = (values) => {
    const {file} = values.image;
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    console.log(file);

    reader.onload = () => {
      request.post(importURL, {
        method: 'post',
        processData: false,
        data: {
          "image": reader.result.substring(`data:${file.type };base64,`.length),
          "id": values.id
        }
      }).then(function (response) {
        alert(response);
      })
        .catch(function (error) {
          alert(`error: ${error}`);
        });

    }
  };

  const handleChange = (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.file.originFileObj);
    reader.onload = () => setPreviewImage(reader.result);

  }

  const [previewImage, setPreviewImage] = useState(fallbackImage);
  return (
    <>
      <h1><b>IMPORT IMAGE</b></h1>
      <Row>
        <Col>
          <Form form={form}
                initialValues={initValues}
                onFinish={onFinish}
                layout="vertical">
            <Form.Item
              name="id"
              label="Image ID:"
            >
              <Input type={"number"} placeholder="Please enter image id"/>
            </Form.Item>
            <br/>
            
            <Form.Item
              name="image"
              label="Image:"
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={false}
                showUploadList={false}
                onChange={handleChange}
              >
              
                <img src={previewImage}
                     alt="avatar"
                     style={{width: '100%',height:"100%"}}/>
              </Upload>
            </Form.Item>
            <br/>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Import
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
