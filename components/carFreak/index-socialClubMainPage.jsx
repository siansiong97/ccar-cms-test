import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import _, { isEmpty } from 'lodash';
import client from '../../feathers'
import axios from 'axios';
import { Row, Col, Card, Button, Tabs, Empty, message, Modal, Icon, Input, Avatar, Pagination, Spin, Table, Switch, Form, Tooltip, Upload, Divider, Breadcrumb } from 'antd';
import LayoutV2 from '../Layout-V2';
import Carousel, { Dots, slidesToShowPlugin, arrowsPlugin } from '@brainhubeu/react-carousel';

import moment from "moment";
import DiscussionTab from './index-socialClubDiscussion';
import PhotoTab from './index-socialClubPhoto';
import MemberTab from './index-socialClubMember';


const { TabPane } = Tabs;

const CarFreakClubIndex = (props) => {

    const [clubs, setClubs] = useState({});
    const [chatLoading, setChatLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState("1");


    const timeoutRef = useRef(null);


    useEffect(() => {

        getData()
    }, [])


    useEffect(() => {
    }, [currentTab])


    function getData() {
        setClubs({})
        client.service('clubs')
            .get(props.match.params.id)
            .then((res) => {
                setClubs(res)
            }).catch((err) => {
                console.log(err);
            })
    }


    

    //rendering---------------------------------------------------
    return (
        <LayoutV2>
            <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large" indicator={
                <img src="/loading.gif" style={{ width : 100, height : 100, position : 'sticky', position : '-webkit-sticky', top : 0, bottom : 0, left : 0 , right : 0, margin : 'auto'}} />
            }>
                <Row style={{ marginLeft: '16px' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item><a onClick={(e) => { props.router.push('/car-freaks') }}>CarFreaks</a></Breadcrumb.Item>
                        <Breadcrumb.Item><a onClick={(e) => { props.router.push('/social-club') }}  >CarFreak Club</a></Breadcrumb.Item>
                        <Breadcrumb.Item>{clubs.clubName || ''}</Breadcrumb.Item>
                    </Breadcrumb>

                </Row>
                <p style={{ border: '1px solid rgb(238 238 238)', margin: '0px', padding: '0px' }}></p>
                <div style={{ backgroundColor: '#464646', color: '#ffffff' }}>
                    <div style={{ padding: '12px 60px 0px 60px' }}>
                        <Row gutter={12} align="middle" style={{ marginTop: '24px', marginBottom: '12px' }}>
                            {/* <Col span={24} style={{ textAlign: 'right', }}>
                                <span className='carfreakNavi' onClick={(e) => { props.router.push('/car-freaks') }}>CarFreaks</span>
                                <span className='carfreakNavi' onClick={(e) => { props.router.push('/social-board') }}>Social Board</span>
                                <span className='carfreakNavi' onClick={(e) => { props.router.push('/social-club') }}>Club</span>
                            </Col> */}
                        </Row>
                        {/* club header */}
                        <Row>
                            <Col span={6}>
                                {clubs.mediaList
                                    ? clubs.mediaList[0]
                                        ? <div style={{ padding: '24px' }}><img className='clubMainPageProfilePic' src={clubs.mediaList[0].url} /></div>
                                        : '' : ''}
                            </Col>
                            <Col span={18}>
                                <Row><span style={{ fontWeight: '900', fontSize: '24px' }}>{clubs.clubName || ''}</span></Row>

                                {/* <Row style={{ margin: '16px 0px' }}>total post , discussion, member</Row> */}

                                <Row style={{ overflowWrap: 'break-word' }}>{clubs.clubDescription || ''}</Row>
                                {/* <Row style={{ margin: '16px 0px' }}><Button>Share</Button></Row> */}
                                {/* <Row style={{ textAlign:'right' }}><Button style={{ marginRight:'6px' }} >Edit Cover Photo</Button><Button>Edit Profile</Button></Row> */}
                            </Col>

                        </Row>
                    </div>
                    <br />

                </div>
                <p style={{ border: '1px solid rgb(238 238 238)', margin: '0px', padding: '0px' }}></p>
                <Row>
                    <div style={{ backgroundColor: '#ffffff' }}>
                        <Col offset={1}>
                            <Tabs defaultActiveKey="1"  onChange={(e) => { setCurrentTab(e) }}>
                                <TabPane tab="Discussion" key="1" ></TabPane>
                                <TabPane tab="Photo" key="2"></TabPane>
                                <TabPane tab="Member" key="3"></TabPane>
                            </Tabs>
                        </Col>
                    </div>
                </Row>


                <div className='section'>
                        <Row style={{ padding: '24px' }}>
                            <Col offset={1}>
                                {currentTab === "1" ? <DiscussionTab  props={props}/> : ''}
                                {currentTab === "2" ? <PhotoTab props={props}/> : ''}
                                {currentTab === "3" ? <MemberTab props={props}/> : ''}
                            </Col>
                        </Row>
                </div>

                <br />
            </Spin>

        </LayoutV2>
    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CarFreakClubIndex);