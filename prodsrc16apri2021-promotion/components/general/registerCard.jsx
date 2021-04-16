import { Col, Modal, Row } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import LightBoxGallery from './light-box-gallery';
import { arrayLengthCount } from '../../common-function';



const RegisterCard = (props) => {
    const [visible, setVisible] = useState(false)

    return (
        <React.Fragment>
            <a onClick={() => {
                if (arrayLengthCount(props.registrationUrl) > 0) {
                    setVisible(true)
                }
            }}>
                {
                    props.button ?
                        props.button
                        :
                        // <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                        //     <div className="wrap-product-ads-tag">
                        //         <img src="/assets/CarListingIconMobile/registration-card.png" className="w-100" /> 
                        //     </div>
                        // </Col>
                        <div className="wrap-product-ads-tag">
                            <Row>
                                <Col xs={3} sm={2} md={5} lg={5} xl={5} offset={1}>
                                    <img src="/assets/CarListingIconMobile/registration-card.png" className="w-100" />
                                </Col>
                                <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                                    <p style={{ fontSize: '10px' }}>Reg Card</p>
                                </Col>

                            </Row>
                        </div>
                }
            </a>
            <Modal
                title="Registration Card"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}>
                <Row>
                    <Col span={24}>
                        <LightBoxGallery images={_.isArray(props.registrationUrl) && !_.isEmpty(props.registrationUrl) && _.get(props.registrationUrl, [0, 'url']) ? [_.get(props.registrationUrl, [0, 'url'])] : []}>
                            {
                                (data, setCurrentIndex, setVisible) => {
                                    return (
                                        <img src={_.get(data, ['images', 0])} className="w-100 cursor-pointer" onClick={(e) => { setVisible(true) }} />
                                    )
                                }
                            }
                        </LightBoxGallery>
                    </Col>
                </Row>
            </Modal>
        </React.Fragment>
    )
}

export default RegisterCard;