import { Button, message, Modal } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
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
    const [visible, setVisible] = useState(false)
    let contactList = []
    let hideContactName = 'show'
    let contactStyle= { float: 'right' }
    try { contactList = props.mobileNumber.createdBy.contactList } catch (err) { contactList = [] }
    try { hideContactName = props.mobileNumber.createdBy.hideContactName } catch (err) { hideContactName = 'show' }

    if (!contactList) { contactList = [] }
    if (contactList.length > 0) {

        return (
            <>
                <Button
                    type="normal"
                    className="w-100 ads-purchase-button ccar-product-btn-car"
                    style={{ padding: 0 }}
                    onClick={() => { setVisible(true) }}>
                    <img src="/assets/profile/icon-list/carmarket-bar-icon/whatsapp.png" style={{ width: '20px' }} />
                </Button>
                <Modal
                    title="Contact Seller"
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                >

                    <div>
                        {contactList.map(function (v) {
                            let contactName = <></>
                            if (hideContactName === 'show') {
                                contactName = <span>{
                                    (v.contactNamePrefix || '') + ' ' +
                                    (v.contactFirstName || '') + ' ' +
                                    (v.contactLastName || '')}</span>
                            }else{
                                contactStyle={}
                            }


                            return (<p>{contactName}
                                <span style={contactStyle}>{(v.contactNoPrefix || '') + (v.contactNo || '')}
                                    <span>
                                        <a target={'_blank'}
                                            href={"https://web.whatsapp.com/send?phone="
                                                + v.contactNoPrefix.replace('+', '')
                                                + v.contactNo + "&text=Hi "
                                                + (v.contactNamePrefix ? v.contactNamePrefix + ' ' : '')
                                                + (v.contactFirstName ? v.contactFirstName + ' ' : '') + (v.contactLastName || '')
                                                + ", I am interested in your car ad on ccar.my and I would like to know more about "
                                                + props.mobileNumber.title
                                                + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true)
                                                + "). Thank you. https://ccar.my/viewCar/"
                                                + props.mobileNumber._id} onClick={(e) => {

                                                }}  >
                                            <Button type="normal" className="ads-purchase-button ccar-product-btn-car" style={{ padding: 0 }}>
                                                <img src="/assets/profile/icon-list/carmarket-bar-icon/whatsapp.png" style={{ width: '20px' }} />
                                            </Button>
                                        </a>
                                    </span>

                                </span>


                            </p>)
                        })}
                    </div>

                </Modal>
            </>
        )
    }
    return (
        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Default>
                {/* <a target={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : '_blank'} href={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : "https://web.whatsapp.com/send?phone=" + _.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) + "&text=Hi " + getUserName(_.get(props.mobileNumber, ['createdBy']), 'prefixName') + ", I am interested in your car ad on ccar.my and I would like to know more about " + props.mobileNumber.title + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true) + "). Thank you. https://ccar.my/viewCar/" + props.mobileNumber._id} onClick={(e) => { */}
                {/* <Tooltip title="WhatsApp"> */}
                {/* <a href={"https://web.whatsapp.com/send?phone=" + props.mobileNumber + "&text=Hi"} > */}
                {/* </Tooltip><a href={props.readOnly ? null : "https://web.whatsapp.com/send?phone=+60194341511&text=Hello From Ccar"}  > */}
                <a target={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : '_blank'} href={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : "https://web.whatsapp.com/send?phone=" + _.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']).replace('+60', '') + "&text=Hi " + getUserName(_.get(props.mobileNumber, ['createdBy']), 'prefixName') + ", I am interested in your car ad on ccar.my and I would like to know more about " + props.mobileNumber.title + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true) + "). Thank you. https://ccar.my/viewCar/" + props.mobileNumber._id} onClick={(e) => {
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
                {/* <a  href={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : "https://wa.me/" + _.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) + "&text=Hi " + getUserName(_.get(props.mobileNumber, ['createdBy']), 'prefixName') + ", I am interested in your car ad on ccar.my and I would like to know more about " + props.mobileNumber.title + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true) + "). Thank you. https://ccar.my/viewCar/" + props.mobileNumber._id} onClick={(e) => { */}
                {/* <Tooltip title="WhatsApp"> */}
                {/* <a href={"https://web.whatsapp.com/send?phone=" + props.mobileNumber + "&text=Hi"} > */}
                {/* </Tooltip><a href={props.readOnly ? null : "https://web.whatsapp.com/send?phone=+60194341511&text=Hello From Ccar"}  > */}
                <a href={!_.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']) ? null : "https://wa.me/" + _.get(props.mobileNumber, ['createdBy', 'contactNoPrimary']).replace('+60', '') + "&text=Hi " + getUserName(_.get(props.mobileNumber, ['createdBy']), 'prefixName') + ", I am interested in your car ad on ccar.my and I would like to know more about " + props.mobileNumber.title + " (RM " + formatNumber(props.mobileNumber.price, null, false, 2, true) + "). Thank you. https://ccar.my/viewCar/" + props.mobileNumber._id} onClick={(e) => {
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