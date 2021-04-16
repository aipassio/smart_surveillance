import {Button, Col, Form, Input, Row, Upload} from "antd";
import {useState} from "react";
import request from "umi-request";
import {fallbackImage, importURL} from "@/pages/util";


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
    reader.onload = () => {
      request.post(importURL, {
        method: 'post',
        processData: false,
        data: {
          "image": reader.result.substring("data:image/jpeg;base64,".length),
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
      <h3><b>IMPORT IMAGE</b></h3>
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
                     style={{width: '100%'}}/>
              </Upload>
            </Form.Item>

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
