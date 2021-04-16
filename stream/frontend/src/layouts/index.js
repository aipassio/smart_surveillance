import {Layout} from 'antd';
import './index.css';

const {Content} = Layout;

function BasicLayout(props) {
  return (
    <Layout>
      {/*<Header className={styles.header}>*/}
      {/*  <div className={styles.logo}/>*/}
      {/*  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>*/}
      {/*    <Menu.Item key="1">nav 1</Menu.Item>*/}
      {/*    <Menu.Item key="2">nav 2</Menu.Item>*/}
      {/*    <Menu.Item key="3">nav 3</Menu.Item>*/}
      {/*  </Menu>*/}
      {/*</Header>*/}
      <Content style={{padding: '0 50px'}}>
        {props.children}
      </Content>
      {/*<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>*/}
    </Layout>
  );
}

export default BasicLayout;
