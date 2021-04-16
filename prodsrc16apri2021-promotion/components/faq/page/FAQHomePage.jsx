import { Col, Divider, Icon, Input, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { faqDiceBanner } from '../../../icon';
import LayoutV2 from '../../general/LayoutV2';
import { faqTopics } from '../config';



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



const FAQIndex = (props) => {



    function redirect(key) {
        props.router.push(`/faq/details?tab=${key}`)
    }


    return (
        <LayoutV2>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="width-100 flex-justify-center flex-align-center flex-wrap" style={{ backgroundImage: `url("${faqDiceBanner}")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '40vh' }} >
                        <div className="white flex-justify-center width-100 h4 font-weight-bold margin-bottom-lg">
                            We are here to help you.
                    </div>
                        {/* <div className="width-100 flex-justify-center">
                            <span className='flex-items-align-center width-50 background-white' >
                                <span className='d-inline-block no-border-input padding-md width-80' >
                                    <Input placeholder="Type your search..." />
                                </span>
                                <span className='flex-items-align-center flex-justify-center background-ccar-button-yellow white subtitle1 width-20 height-100 cursor-pointer flex-items-no-shrink  hover-background-yellow' >
                                    <Icon type="search" className="white margin-right-sm" style={{ fontSize: 20 }} />
                                    Search
                                </span>
                            </span>
                        </div> */}
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="section">
                        <div className="container">

                            <Row gutter={[0, 20]}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="yellow-divider">
                                    <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' > FAQ </span></Divider>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Row gutter={[20, 20]}>
                                        {
                                            _.map(faqTopics, function (faqTopic) {
                                                return (
                                                    <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                                        <div className="round-border box-shadow-normal flex-align-center flex-justify-center flex-wrap cursor-pointer hover-background-yellow-lighten-4" style={{ height: 150 }} onClick={(e) => {
                                                            redirect(faqTopic.value)
                                                        }}>
                                                            <div className="flex-items-align-center flex-justify-center black flex-items-no-shrink width-100 margin-bottom-sm">
                                                                <img src={faqTopic.icon} style={{ width: 50, height: 50 }} />
                                                            </div>
                                                            <div className="flex-items-align-center flex-justify-center black flex-items-no-shrink width-100">
                                                                {faqTopic.text || ''}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </LayoutV2>
    );
}

const mapStateToProps = state => ({
    productsList: state.productsList,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FAQIndex));