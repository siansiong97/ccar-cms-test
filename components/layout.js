import React, { PureComponent } from 'react'
import Link from 'next/link'
import { Layout } from 'antd';
import { Row, Col, } from 'antd'
import { routePaths } from '../route';
const { Header, Footer, Sider, Content } = Layout;

export default function MainLayout({children}) {
// export default class Layout extends PureComponent {
//   render () {
    return (
      <Layout>
          <Row justify='center' className="wrapBorderRed" style={{height:'80px', backgroundColor:'#000', paddingTop:'20px'}} gutter={10}>
            <Col span={3} style={{textAlign:"right"}}>
              <Link shallow={false}  passHref  href={routePaths.home.to || '/'} as={typeof(routePaths.home.as) == 'function' ? routePaths.home.as() : '/'}>
                <a>Home</a>
              </Link>
            </Col>
            
            <Col offset={0} span={21} style={{backgroundColor:"red"}}>
              <Row className="wrapBorderRed" gutter={10} justify='end'>
                <Col span={2}>
                  <Link shallow={false}  passHref  href={routePaths.usedCarsOnSale.to || '/'} as={typeof(routePaths.usedCarsOnSale.as) == 'function' ? routePaths.usedCarsOnSale.as() : '/'}>
                    <a>CarMarket</a>
                  </Link>
                </Col>
                <Col span={2}>
                  <Link shallow={false}  passHref  href={routePaths.newCar.to || '/'} as={typeof(routePaths.newCar.as) == 'function' ? routePaths.newCar.as() : '/'}>
                    <a>All-NewCar</a>
                  </Link>
                </Col>
                <Col span={2}>
                  <Link shallow={false}  passHref href={routePaths.live.to || '/'} as={typeof(routePaths.live.as) == 'function' ? routePaths.live.as() : '/'}>
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
