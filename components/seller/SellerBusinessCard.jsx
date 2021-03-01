import { Col, Form, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import UserAvatar from '../general/UserAvatar';
import { withRouter } from 'next/dist/client/router';



const SellerBusinessCard = (props) => {


    return (
        <div className="thin-border ">
            <a href={props.readOnly ? null : !props.data1 || !props.data1._id ? null : '/dealer/' + (props.data1.companyurlId||'')+'/'+(props.data1.userurlId||'')} className="grey-darken-2 font-weight-normal">
                <Row>
                    <Col span={12}>
                        <img src="/Artboard.png" style={{ width: '10%', float: 'left', marginLeft: '5px', marginBottom: '-5px', marginTop: '5px' }}></img>
                    </Col>
                    <Col span={12} style={{ float: 'right' }}>
                        <img src="/Artboard.png" style={{ width: '10%', float: 'right', marginRight: '5px', marginBottom: '-5px', marginTop: '5px' }}></img>
                    </Col>
                </Row>
                <Row style={{ paddingLeft: '30px' }} type="flex" align="middle">
                    <Col xs={5} sm={5} md={5} lg={0} xl={5}>
                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                            <UserAvatar redirectProfile data={props.data1} size={50} />
                        </div>
                        {/* <div className="wrap-company-logo-horizontal-dealer">
                            <img src="/assets/General/car-showroom.png" className="w-100" />
                        </div> */}
                    </Col>
                    <Col xs={18} sm={18} md={18} lg={24} xl={18} style={{ marginLeft: '10px' }}>
                        <Row>
                            <Col span={4} style={{ marginRight: '-4px', marginTop: '-3px' }}>
                                <img src="/assets/profile/account-info-active.png" className="fill-parent" style={{ width: '55%' }}></img>
                            </Col>
                            <Col span={20}>
                                <h4 style={{ marginBottom: '0px', marginLeft: '-5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}> {!props.data1 || !props.data1.namePrefix ? null : props.data1.namePrefix} {!props.data1 || !props.data1.firstName ? null : props.data1.firstName} {!props.data1 || !props.data1.lastName ? null : props.data1.lastName}</h4>
                            </Col>
                        </Row>

                        {/* <Row>
                            <Col span={4} style={{ backgroundColor: 'rgb(178, 210,123)', borderRadius:'5px'}}>
                            <div>
                                <img src="/assets/productListDealer/dealer.png" style={{width:'60%', marginLeft:'7px', marginBottom:'2px'}}/>
                            <span className="width-70 caption text-truncate text-align-left padding-x-sm " >
                                DEALER
                            </span>
                            </div> 
                            </Col>
                            <Col span={20}>
                            <h4 style={{marginLeft:'7px'}}>{!props.data || !props.data.name ? null : props.data.name}</h4>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col span={4} style={{ marginRight: '-5px', marginTop: '-3px' }}>
                                <img src="/assets/profile/address-work.png" className="fill-parent" style={{ width: '50%' }}></img>
                            </Col>
                            <Col span={20}>
                                <p style={{ marginBottom: '0px', color: 'rgb(173, 173, 173)', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginLeft: '-4px' }}>{!props.data || !props.data.name ? null : props.data.name}</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={4} style={{ marginTop: '1px' }}>
                                <img src="/assets/carDetails/Location@3x.png" className="fill-parent" style={{ width: '60%' }}></img>
                            </Col>
                            <Col span={20} style={{ marginLeft: '-8px' }}>
                                <span className="caption text-overflow-break text-align-left" >
                                    {!props.data || !props.data.area ? null : props.data.area}
                                </span>
                            </Col>
                        </Row>
                        <div className="flex-items-align-center width-100">
                            {/* <span className="width-20 margin-x-xs relative-wrapper" style={{ height: '30px' }}>
                                {
                                props.data
                                    ?props.data.state?<img src={getStateIcon(props.data.state)} className="fill-parent absolute-center" />:''
                                    :''}
                                <img src={getStateIcon(!props.data1 || !props.data1.state ? null : props.data1.state)} className="fill-parent absolute-center" />
                            </span> */}
                            {/* <span className="width-20 margin-x-xs caption text-align-center">
                                {'>>'}
                            </span> */}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <img src="/Artboard.png" style={{ width: '10%', float: 'left', marginLeft: '5px', marginBottom: '5px', marginTop: '-5px' }}></img>
                    </Col>
                    <Col span={12} style={{ float: 'right' }}>
                        <img src="/Artboard.png" style={{ width: '10%', float: 'right', marginRight: '5px', marginBottom: '5px', marginTop: '-5px' }}></img>
                    </Col>
                </Row>
            </a>
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SellerBusinessCard)));