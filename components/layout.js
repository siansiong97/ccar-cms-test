import React, { PureComponent } from 'react'
import Link from 'next/link'
import { Layout } from 'antd';
import { Row, Col } from 'antd'
const { Header, Footer, Sider, Content } = Layout;

export default function MainLayout({children}) {
// export default class Layout extends PureComponent {
//   render () {
    return (
      <Layout>
        <Header>
          <Row gutter={10}>
            <Col span={5}>
              <Link href='/'>
                <a>Home</a>
              </Link>
            </Col>
            <Col span={5}>
              <Link href='/used-car'>
                <a>Buy Car</a>
              </Link>
            </Col>
          </Row>
        </Header>
        <Content style={{minHeight:360,  backgroundColor:'#fff', margin:'0 20px'}}>{ children }</Content>
        <Footer>Footer</Footer>
    </Layout>
    )
  }
// }
