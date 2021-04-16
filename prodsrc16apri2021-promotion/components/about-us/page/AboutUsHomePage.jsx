import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import LayoutV2 from '../../general/LayoutV2';
import { updateActiveMenu } from '../../../redux/actions/app-actions';


const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
  }
  const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
  }
  const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
  }
  const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
  }

class AboutUsIndex extends React.Component{

    componentDidMount = () => {
        this.props.updateActiveMenu('9');
    }

    render(){

        return (
            <LayoutV2>
                <Desktop>
                <div className="fixed-container" style={{touchAction: 'pan-y'}}>
                    <div className="container background-white">
                        <Row>
                            <Col xs={{order:2, span:24}} sm={{order:2, span:24}} md={{order:1, span:12}} lg={{order:1, span:12}} xl={{order:1, span:12}}>
                                <div className="margin-xl" >
                                    <h1> Who We Are:</h1>
                                    <p>
                                        An all-in-one integrated service enabler where people can purchase and sell their cars, 
                                        share their thoughts and get insights on anything that relates to automobiles from our platform.
                                    </p>
                                    <div>
                                        <img style={{width:'50%'}} src="/assets/about-us/about_us_1.jpg"></img>
                                        <br></br>
                                        <img style={{width:'50%', marginLeft:'115px', marginTop:'-80px'}} src="/assets/about-us/about_us_2.jpg"></img>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={{order:1, span:24}} sm={{order:1, span:24}} md={{order:2, span:12}} lg={{order:2, span:12}} xl={{order:2, span:12}}>
                                <img className="width-100" src="/assets/about-us/about_ut_2.png"></img>
                                <div className="margin-right-xl" style={{marginTop:'-182px', paddingRight:'70px'}}>
                                <h1> Our Vision: </h1>
                                <p> The world-leading all-in-one integrated automobile social platform where everyone could rely on whenever they think about anything that relates to automobiles. </p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="margin-left-xl margin-right-xl margin-top-xs">
                                    <h1> Our Core Values: </h1>
                                    <h3 style={{marginBottom:'0px'}}> <b style={{fontSize:'20px', color:'#FBB040'}}>C</b>onnect - Connect trusted dealers and buyers. </h3>
                                    <p> We make sure you could get the best service at the best price from our authorised dealers. Also, we are here to gather all car enthusiasts together to share thoughts and feelings on cars.</p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>C</b>reate - Create values for you.</h3>
                                    <p> We create values that are related to cars for anyone who uses our platform. We love to see people get their desired cars through our platform and gain as many insights as possible from CCAR. </p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>A</b>dapt - Adapt to change in the fast-moving world.</h3>
                                    <p> We are ready to adapt, change and overcome any challenges to be able to lead in the automobile industry in this digital world to provide the best service to any of you.</p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>R</b>evolutionize - Revolutionize the way the automobile industry works. </h3>
                                    <p> We transform everything related to automobiles into an online service where dealers could easily reach the right clients and users could effortlessly find their dream cars anytime, anywhere.</p>
                                </div>
                                <div className="car-for-sale" >
                                    <img style={{width:'100%', marginTop:'-50px'}} src="/assets/about-us/about_us_3.png"></img>
                                </div>
                                {/* <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                                <img style={{width:'100%'}} src="/assets/about-us/about_us_3.png"></img>
                                </Col> */}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div style={{textAlign:'right'}}>
                                    <img style={{width:'85%'}} src="/assets/about-us/about_us_1.png"></img>
                                </div>
                                <div className="margin-left-xl margin-right-xl">
                                <h1> Why CCAR?</h1>
                                <p><b>All-In-One.</b> You could find anything related to cars from our platform and build your car communities to exchange your thoughts with them.  </p>

                                <p><b>Care For You.</b>We value any of your reviews and feedback to give you a world-class social platform. </p>
                                <p><b>Variety.</b>We offer a wide range of choices from which you could choose your desired car.</p>
                                <p><b>Safe.</b>We review our dealers consistently from our merits and your feedback to ensure dealers are trustable.</p>
                                <p><b>Best Price.</b>Our platform provides irresistible offers with affordable and competitive prices for you.</p>
                                </div>
                            </Col>
                        </Row>

                        {/* <Row>
                            <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                                <img style={{width:'100%', marginTop:'-170px'}} src="/assets/about-us/about_us_3.png"></img>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="margin-left-xl margin-right-xl margin-top-xs">
                                <h1> Why CCAR?</h1>
                                <p><b>All-In-One.</b> You could find anything related to cars from our platform and build your car communities to exchange your thoughts with them.  </p>

                                <p><b>Care For You.</b>We value any of your reviews and feedback to give you a world-class social platform. </p>
                                <p><b>Variety.</b>We offer a wide range of choices from which you could choose your desired car.</p>
                                <p><b>Safe.</b>We review our dealers consistently from our merits and your feedback to ensure dealers are trustable.</p>
                                <p><b>Best Price.</b>Our platform provides irresistible offers with affordable and competitive prices for you.</p>
                                </div>
                            </Col>
                        </Row> */}
                    </div>
                </div>
                </Desktop>

                <Tablet>
                <div className="section-version3" style={{touchAction: 'pan-y'}}>
                    <div className="container-version3 background-white">
                        <Row className="car-for-sale">
                            <Col xs={{order:2, span:24}} sm={{order:2, span:24}} md={{order:1, span:12}} lg={{order:1, span:12}} xl={{order:1, span:12}}>
                                <div className="margin-xl" style={{marginTop:'50px'}}>
                                    <h1> Who We Are:</h1>
                                    <p>
                                        An all-in-one integrated service enabler where people can purchase and sell their cars, 
                                        share their thoughts and get insights on anything that relates to automobiles from our platform.
                                    </p>
                                    <div>
                                        <img style={{width:'50%'}} src="/assets/about-us/about_us_1.jpg"></img>
                                        <br></br>
                                        <img style={{width:'50%', marginLeft:'115px', marginTop:'-80px'}} src="/assets/about-us/about_us_2.jpg"></img>
                                    </div>
                                </div>

                            </Col>
                            <Col xs={{order:1, span:24}} sm={{order:1, span:24}} md={{order:2, span:12}} lg={{order:2, span:12}} xl={{order:2, span:12}}>
                                <img className="width-100" src="/assets/about-us/about_ut_2.png"></img>
                                <div className="margin-right-xl" style={{marginTop:'-100px'}}>
                                <h1> Our Vision: </h1>
                                <p> The world-leading all-in-one integrated automobile social platform where everyone could rely on whenever they think about anything that relates to automobiles. </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="margin-left-xl margin-right-xl margin-top-xs">
                                    <h1> Our Core Values: </h1>
                                    <h3 style={{marginBottom:'0px'}}> <b style={{fontSize:'20px', color:'#FBB040'}}>C</b>onnect - Connect trusted dealers and buyers. </h3>
                                    <p> We make sure you could get the best service at the best price from our authorised dealers. Also, we are here to gather all car enthusiasts together to share thoughts and feelings on cars.</p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>C</b>reate - Create values for you.</h3>
                                    <p> We create values that are related to cars for anyone who uses our platform. We love to see people get their desired cars through our platform and gain as many insights as possible from CCAR. </p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>A</b>dapt - Adapt to change in the fast-moving world.</h3>
                                    <p> We are ready to adapt, change and overcome any challenges to be able to lead in the automobile industry in this digital world to provide the best service to any of you.</p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>R</b>evolutionize - Revolutionize the way the automobile industry works. </h3>
                                    <p> We transform everything related to automobiles into an online service where dealers could easily reach the right clients and users could effortlessly find their dream cars anytime, anywhere.</p>
                                </div>
                                <div className="car-for-sale">
                                <img style={{width:'100%', marginTop:'-50px'}} src="/assets/about-us/about_us_3.png"></img>
                                </div>
                                {/* <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                                <img style={{width:'100%'}} src="/assets/about-us/about_us_3.png"></img>
                                </Col> */}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <img style={{width:'85%', marginLeft:'58px'}} src="/assets/about-us/about_us_1.png"></img>
                                <div className="margin-left-xl margin-right-xl">
                                <h1> Why CCAR?</h1>
                                <p><b>All-In-One.</b> You could find anything related to cars from our platform and build your car communities to exchange your thoughts with them.  </p>

                                <p><b>Care For You.</b>We value any of your reviews and feedback to give you a world-class social platform. </p>
                                <p><b>Variety.</b>We offer a wide range of choices from which you could choose your desired car.</p>
                                <p><b>Safe.</b>We review our dealers consistently from our merits and your feedback to ensure dealers are trustable.</p>
                                <p><b>Best Price.</b>Our platform provides irresistible offers with affordable and competitive prices for you.</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                </Tablet>

                <Mobile>
                <div className="section-version3" style={{touchAction: 'pan-y'}}>
                    <div className="container-ver3 background-white">
                        <Row className="car-for-sale">
                            <Col xs={{order:2, span:24}} sm={{order:2, span:24}} md={{order:1, span:12}} lg={{order:1, span:12}} xl={{order:1, span:12}}>
                                <div className="margin-xl" style={{marginTop:'50px'}}>
                                    <h1> Who We Are:</h1>
                                    <p>
                                        An all-in-one integrated service enabler where people can purchase and sell their cars, 
                                        share their thoughts and get insights on anything that relates to automobiles from our platform.
                                    </p>
                                    <div>
                                        <img style={{width:'50%'}} src="/assets/about-us/about_us_1.jpg"></img>
                                        <br></br>
                                        <img style={{width:'50%', marginLeft:'115px', marginTop:'-80px'}} src="/assets/about-us/about_us_2.jpg"></img>
                                    </div>
                                </div>

                            </Col>
                            <Col xs={{order:1, span:24}} sm={{order:1, span:24}} md={{order:2, span:12}} lg={{order:2, span:12}} xl={{order:2, span:12}}>
                                <img className="width-100" src="/assets/about-us/about_ut_2.png"></img>
                                <div className="margin-right-xl" style={{marginTop:'-182px', paddingRight:'40px'}}>
                                <h1> Our Vision: </h1>
                                <p> The world-leading all-in-one integrated automobile social platform where everyone could rely on whenever they think about anything that relates to automobiles. </p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="phone-responsive">
                            <Col xs={{order:2, span:24}} sm={{order:2, span:24}} md={{order:1, span:12}} lg={{order:1, span:12}} xl={{order:1, span:12}}>
                                <div className="margin-xl" style={{marginTop:'20px'}}>
                                    <h1> Who We Are:</h1>
                                    <p>An all-in-one integrated service enabler where people can purchase and sell their cars, 
                                        share their thoughts and get insights on anything that relates to automobiles from our platform.
                                    </p>
                                    <div>
                                        <img style={{width:'50%'}} src="/assets/about-us/about_us_1.jpg"></img>
                                        <br></br>
                                        <img style={{width:'50%', marginLeft:'115px', marginTop:'-80px'}} src="/assets/about-us/about_us_2.jpg"></img>
                                    </div>
                                </div>

                            </Col>
                            <Col xs={{order:1, span:24}} sm={{order:1, span:24}} md={{order:2, span:12}} lg={{order:2, span:12}} xl={{order:2, span:12}}>
                                {/* <img className="width-100" src="/assets/about-us/about_ut_2.png"></img> */}
                                <div className="margin-right-xl" style={{marginTop:'10px', marginLeft:'42px'}}>
                                <h1> Our Vision: </h1>
                                <p> The world-leading all-in-one integrated automobile social platform where everyone could rely on whenever they think about anything that relates to automobiles. </p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="margin-left-xl margin-right-xl margin-top-xs">
                                    <h1> Our Core Values: </h1>
                                    <h3 style={{marginBottom:'0px'}}> <b style={{fontSize:'20px', color:'#FBB040'}}>C</b>onnect - Connect trusted dealers and buyers. </h3>
                                    <p> We make sure you could get the best service at the best price from our authorised dealers. Also, we are here to gather all car enthusiasts together to share thoughts and feelings on cars.</p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>C</b>reate - Create values for you.</h3>
                                    <p> We create values that are related to cars for anyone who uses our platform. We love to see people get their desired cars through our platform and gain as many insights as possible from CCAR. </p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>A</b>dapt - Adapt to change in the fast-moving world.</h3>
                                    <p> We are ready to adapt, change and overcome any challenges to be able to lead in the automobile industry in this digital world to provide the best service to any of you.</p>

                                    <h3 style={{marginBottom:'0px'}}><b style={{fontSize:'20px', color:'#FBB040'}}>R</b>evolutionize - Revolutionize the way the automobile industry works. </h3>
                                    <p> We transform everything related to automobiles into an online service where dealers could easily reach the right clients and users could effortlessly find their dream cars anytime, anywhere.</p>
                                </div>
                                <div className="car-for-sale">
                                <img style={{width:'100%', marginTop:'-50px'}} src="/assets/about-us/about_us_3.png"></img>
                                </div>
                                {/* <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                                <img style={{width:'100%'}} src="/assets/about-us/about_us_3.png"></img>
                                </Col> */}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <img style={{width:'85%', marginLeft:'100px'}} src="/assets/about-us/about_us_1.png"></img>
                                <div className="margin-left-xl margin-right-xl">
                                <h1> Why CCAR?</h1>
                                <p><b>All-In-One.</b> You could find anything related to cars from our platform and build your car communities to exchange your thoughts with them.  </p>

                                <p><b>Care For You.</b>We value any of your reviews and feedback to give you a world-class social platform. </p>
                                <p><b>Variety.</b>We offer a wide range of choices from which you could choose your desired car.</p>
                                <p><b>Safe.</b>We review our dealers consistently from our merits and your feedback to ensure dealers are trustable.</p>
                                <p><b>Best Price.</b>Our platform provides irresistible offers with affordable and competitive prices for you.</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                </Mobile>
               
            </LayoutV2>
        )
    }

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutUsIndex);