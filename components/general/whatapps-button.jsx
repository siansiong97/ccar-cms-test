import { Button, message } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Form } from '@ant-design/compatible';
import { useRouter, withRouter } from 'next/dist/client/router';
import { formatNumber, getUserName } from '../../common-function';


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


const WhatsAppButton = (props) => {


    return (
        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Default>
                <a target={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : '_blank'} href={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : "https://web.whatsapp.com/send?phone=" + _.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) + "&text=Hi " + getUserName(_.get(props.mobileNumber, ['createdBy']), 'prefixName') + ", I am interested in your car ad on ccar.my and I would like to know more about " + props.mobileNumber.title + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true) + "). Thank you. https://share.ccar.my/viewCar/" + props.mobileNumber._id} onClick={(e) => {
                    if (!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary'])) {
                        message.error('Whatsapp No Not Found')
                    }
                }}  >
                    {
                        props.button ?
                            props.button()
                            :
                            <Button
                                type="normal"
                                className="w-100 ads-purchase-button ccar-product-btn-car"
                                style={{ padding: 0 }}
                            >
                                {/* <WhatsAppOutlined style={{ fontSize: 20, color: 'white' }} /> */}
                                <img src="/assets/profile/icon-list/carmarket-bar-icon/whatsapp.png" style={{ width: '20px' }} />
                            </Button>
                    }
                </a>
            </Default>
            <Mobile>
                <a  href={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : "https://wa.me/" + _.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) + "&text=Hi " + getUserName(_.get(props.mobileNumber, ['createdBy']), 'prefixName') + ", I am interested in your car ad on ccar.my and I would like to know more about " + props.mobileNumber.title + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true) + "). Thank you. https://share.ccar.my/viewCar/" + props.mobileNumber._id} onClick={(e) => {
                    if (!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary'])) {
                        message.error('Whatsapp No Not Found')
                    }
                }}  >
                    {
                        props.button ?
                            props.button()
                            :
                            <Button
                                type="normal"
                                className="w-100 ads-purchase-button ccar-product-btn-car"
                                style={{ padding: 0 }}
                            >
                                {/* <WhatsAppOutlined style={{ fontSize: 20, color: 'white' }} /> */}
                                <img src="/assets/profile/icon-list/carmarket-bar-icon/whatsapp.png" style={{ width: '20px' }} />
                            </Button>
                    }
                </a>
                {/* </Tooltip> */}
            </Mobile>
        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WhatsAppButton)));