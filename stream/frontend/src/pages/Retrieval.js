import styles from './reid.css';
import {Button, Col, Divider, Form, Image, Input, Row, Select, Upload} from "antd";
import {useState} from "react";
import request from "umi-request";
import {fallbackImage, importURL, retrievalURL} from "@/pages/util";

const {Option} = Select;


export default function Retrieval(props) {
  // const [setResults] = props;
  const [form] = Form.useForm();
  const [initValues] = useState({
    rank: 7,
    feature: 0,
    distance: 0,
    image: "base"
  });

  const onFinish = (values) => {
    const {file} = values.image;
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      values.image = reader.result.substring("data:image/jpeg;base64,".length)
      request.post(retrievalURL, {
        method: 'post',
        processData: false,
        data: values
      }).then(function (response) {
        let images = [];
        response.data.map(item => images.push({
          id: item[0],
          distance: item[1],
          image: item[2]
        }))
        props.setResults(images);
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
      <h3><b>RETRIEVAL</b></h3>
      <Row>
        <Col>
          <Form form={form}
                initialValues={initValues}
                onFinish={onFinish}
                layout="vertical">
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

            <Form.Item
              name="feature"
              valuePropName="option"
              label="Feature:"
            >
              <Select defaultValue={initValues.feature}>
                <Option value={0}>naive</Option>
                <Option value={1}>lbp</Option>
                <Option value={2}>BGR_1_1</Option>
                <Option value={3}>BGR_1_2</Option>
                <Option value={4}>BGR_2_1</Option>
                <Option value={5}>BGR_2_2</Option>
                <Option value={6}>HSV_1_1</Option>
                <Option value={7}>HSV_1_2</Option>
                <Option value={8}>HSV_2_1</Option>
                <Option value={9}>HSV_2_2</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="distance"
              label="Distance:"
            >
              <Select onChange={null}>
                <Option value={0}>l2_distance</Option>
                <Option value={1}>histogram_intersection</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="rank"
              label="Rank:"
            >
              <Input type={"number"} placeholder="Please enter rank"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Retrieval
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
