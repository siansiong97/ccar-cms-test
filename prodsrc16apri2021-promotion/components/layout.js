import React, { PureComponent } from 'react'
import Link from 'next/link'
import { Layout } from 'antd';
import { Row, Col, } from 'antd'
const { Header, Footer, Sider, Content } = Layout;

export default function MainLayout({children}) {
// export default class Layout extends PureComponent {
//   render () {
    return (
      <Layout>
          <Row justify='center' className="wrapBorderRed" style={{height:'80px', backgroundColor:'#000', paddingTop:'20px'}} gutter={10}>
            <Col span={3} style={{textAlign:"right"}}>
              <Link shallow={false}  passHref  href='/'>
                <a>Home</a>
              </Link>
            </Col>
            
            <Col offset={0} span={21} style={{backgroundColor:"red"}}>
              <Row className="wrapBorderRed" gutter={10} justify='end'>
                <Col span={2}>
                  <Link shallow={false}  passHref  href='/used-car'>
                    <a>CarMarket</a>
                  </Link>
                </Col>
                <Col span={2}>
                  <Link shallow={false}  passHref  href='/used-car'>
                    <a>All-NewCar</a>
                  </Link>
                </Col>
                <Col span={2}>
                  <Link shallow={false}  passHref  href='/used-car'>
                    <a>LIVE</a>
                  </Link>
                </Col>
                <Col span={2}>
                  <Link shallow={false}  passHref  href='/used-car'>
                    <a>Menu</a>
                  </Link>
                </Col>
                <Col span={2}>
                  <Link shallow={false}  passHref  href='/used-car'>
                    <a>Login</a>
                  </Link>
                </Col>
                <Col span={2}>
                </Col>
              </Row>
            </Col>
          </Row>

        <Content style={{minHeight:360,  backgroundColor:'#fff', margin:'0 20px'}}>{ children }</Content>

        {/* <Footer>Footer</Footer> */}
    </Layout>
    )
  }
// }
