import { Button, Col, Divider, Modal, Row } from 'antd';
import _ from "lodash";
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getStateIcon } from '../../params/stateList';
import { Form } from '@ant-design/compatible';
import { notEmptyLength } from '../../common-function';
import { showContactList } from '../../redux/actions/app-actions';


const ContactList = (props) => {

    const [visible, setVisible] = useState(false)

    let contactList = []
    let hideContactName = 'show'
    try { contactList = props.contactPerson.contactList } catch (err) { contactList = [] }
    if(!contactList){contactList=[]}

    try { hideContactName = props.contactPerson.hideContactName } catch (err) { hideContactName = 'show' }
    

    return (
        <span className={props.className ? props.className : null} style={props.style ? props.style : null} >
            <a onClick={() => { setVisible(true) }}>
                {
                    props.button ?
                        props.button()
                        :
                        // <Tooltip placement="top" title={`Call`}>
                            <Button type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: '#25D366', borderColor: '#25D366' }}><img src="/assets/profile/icon-list/carmarket-bar-icon/call.png" style={{width:'17px'}} /></Button>
                        // </Tooltip>
                }
            </a>
            <Modal
                title="Contact Seller"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Row type="flex" align="middle">
                    <Col span={18}>
                        <h3>
                            {props.companys ? props.companys.name : ''}
                        </h3>
                        <Row type="flex" align="middle" gutter={[10, 10]}>
                            <Col xs={4} sm={4} md={2} lg={2} xl={2}>
                                <div className="fill-parent  " style={{ height: '20px' }}>
                                    <img src="/assets/carDetails/Location@3x.png" className="absolute-center width-100 " />
                                </div>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4} xl={4}>
                                <div className="fill-parent  " style={{ height: '50px' }}>
                                    <img src={getStateIcon(props.companys?props.companys.state ? props.companys.state : null:null)} style={{ height: '50%' }} className="absolute-center width-100 " />
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                <div className="flex-items-align-center flex-justify-start flex-wrap fill-parent">
                                    <span className="headline   text-align-left padding-x-sm">
                                        {'>'}
                                    </span>
                                    <span className="headline   text-align-left padding-x-sm">
                                        {props.companys ? props.companys.area : ''}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <div className="w-100 relative-wrapper">
                            <img src="/assets/Ccar-logo.png" className="absolute-center" style={{ width: 70, height: 70 }} />
                        </div>
                    </Col>
                </Row>
                <Divider orientation="left" style={{ fontWeight: 'normal', margin: '5px 0px' }} />
                {/* {props.companys?props.companys.multipleContact !== 'on' ? */}
                              {contactList.length===0?
                    <Row type="flex" align="middle" justify="space-between" gutter={[10, 10]}>
                        <Col xs={24} sm={24} md={16} lg={16} xl={16} >
                            <div className="flex-items-align-center flex-justify-start flex-wrap">
                                <span className="headline   text-truncate padding-xs text-align-left">
                                    {
                                        `${_.get(props.contactPerson, ['namePrefix']) || ''} ${_.get(props.contactPerson, ['firstName']) || ''} ${_.get(props.contactPerson, ['lastName']) || ''}`
                                    }
                                </span>
                                <span className="headline   text-truncate padding-xs">
                                    {'|'}
                                </span>
                                <span className="headline   text-truncate padding-xs">
                                    {
                                        // `${_.get(props.contactPerson, ['contactNoPrimary']) || ''}`
                                        `${_.get(props.contactPerson, ['contactNoPrimary']) || ''}`
                                    }
                                </span>
                            </div>
                        </Col>
    
                    </Row>
                    :
                    !notEmptyLength(props.contactPerson) || !notEmptyLength(props.contactPerson.contactList) ?
                        null
                        :
                        props.contactPerson.contactList.sort(() => 0.5 - Math.random()).map((v, id) => {

                            let contactName = <></>
                            if (hideContactName === 'show') {
                                
                                contactName = 
                                
                                <>
                                {_.get(v, ['contactNamePrefix']) || ''}{_.get(v, ['contactFirstName']) || ''} {_.get(v, ['contactLastName']) || ''}
                                <span className="headline   text-truncate padding-xs">{'|'}</span>
                                </>
                            } 
                            
                            return (
                                <Row key={'contact' + id} type="flex" align="middle" justify="space-between" gutter={[10, 10]}>
                                    <Col span={16}>
                                        <div className="flex-items-align-center flex-justify-start flex-wrap">
                                            <span className="headline   text-truncate padding-xs text-align-left">
                                                {
                                                    // `${_.get(v, ['contactNamePrefix']) || ''} ${_.get(v, ['contactFirstName']) || ''} ${_.get(v, ['contactLastName']) || ''}`
                                                    contactName
                                                }
                                            </span>
                                        
                                            <span className="headline   text-truncate padding-xs">
                                                {
                                                    // `${_.get(v, ['contactNoPrefix']) || ''} ${_.get(v, ['contactNo']) || ''} ${_.get(v, ['contactLastName']) || ''}`
                                                    `${_.get(v, ['contactNoPrefix']) || ''} ${_.get(v, ['contactNo']) || ''}`
                                                }
                                            </span>
                                        </div>
                                    </Col>
                
                                </Row>
                            )
                        })
                      
                }
            </Modal>
        </span>
    );
}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    showContactList: showContactList,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContactList));