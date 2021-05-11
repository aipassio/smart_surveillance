import { Layout, Menu } from 'antd';
import './index.css';
import Button from 'antd/lib/button';
import { useState, useEffect } from 'react'
import React from 'react';
import logo from '../assets/logo.png' // relative path to image 

const { Header, Footer, Sider, Content } = Layout;
function BasicLayout(props) {

  const [showRetrieval, setshowRetrieval] = useState(true)

  //Delete Task
  const handleMenuButton = (key) => {
    console.log(key);
    setshowRetrieval(false);
  }

  return (
    <Layout>
      {<Header style={{ height: '90px'}}>
      
        <div className="logo" style={{ display: 'flex', flexDirection: "row" 
          ,backgroundColor: '#1f1818'
          ,height: '90px',justifyContent: 'space-evenly'}} >
          <img style={{ height: '80%',    alignSelf: 'center'}} src={logo}></img>
          <div style={{ display: 'flex', flexDirection: 'column' ,padding:"5px"}}>
          <div style={{display:'flex',maxHeight:'20%',alignItems:"center",color: 'rgb(245 223 223 / 85%)'}}>Nhóm thực hiện:</div>
           <div style={{display:'flex',maxHeight:'20%',alignItems:"center",color: 'rgb(245 223 223 / 85%)'}}>19C11038 - Nguyễn Thanh Sơn</div>
           <div style={{display:'flex',maxHeight:'20%',alignItems:"center",color: 'rgb(245 223 223 / 85%)'}}>19C11032 - Tôn Thất Cao Nguyên</div>
            <div  style={{display:'flex',maxHeight:'20%',alignItems:"center",color: 'rgb(245 223 223 / 85%)'}}>19C11008 - Phạm Tiến Thành</div>
          </div>
        </div>

      </Header>}
      <Content style={{ padding: '0 0px' }} >
        {(props.children)}
      </Content>
      {/*<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>*/}
    </Layout>
  );
}

export default BasicLayout;
