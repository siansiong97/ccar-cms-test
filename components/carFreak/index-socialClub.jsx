import React, { useEffect, useState, useRef } from 'react';
import { withRouter, Link } from 'next/dist/client/router';
import { connect } from 'react-redux';
import _, { isEmpty } from 'lodash';
import client from '../../feathers'
import axios from 'axios';
import { Row, Col, Card, Button, Tabs, Empty, message, Modal, Icon, Input, Avatar, Pagination, Spin, Table, Switch, Form, Tooltip, Upload, Divider } from 'antd';
import LayoutV2 from '../Layout-V2';
import {
    updateActiveMenu,
} from '../../actions/app-actions';
import UserAvatar from './components/user-avatar';
import { notEmptyLength } from '../profile/common-function';
import PostModal from './modal-club';
import PostCommentModal from './modal-SocialBoardPostComment';
import Carousel, { Dots, slidesToShowPlugin, arrowsPlugin } from '@brainhubeu/react-carousel';

import moment from "moment";
import { ReactSortable } from "react-sortablejs";

const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const { Search } = Input;
const PAGE_SIZE = 17;
const { TextArea } = Input;

const CarFreakIndex = (props) => {

    const [newPostModal, setNewPostModal] = useState([]);
    const [totalClub, setTotalClub] = useState(0);
    const [clubs, setClubs] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [currentPageSize, setCurrentPageSize] = useState(0);
    const [searchTitle, setSearchTitle] = useState('');
    const timeoutRef = useRef(null);

    const [discussionComment, setDiscussionComment] = useState([]);
    const [trendingChat, setTrendingChat] = useState([]);
    const [chatType, setChatType] = useState('');

    const uploadButton = (
        <div style={{ padding: '5%' }}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    useEffect(() => {
        getData()
        setCurrentPageSize(1)
    }, [])



    useEffect(() => {

        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {      // SET A TIMEOUT
            timeoutRef.current = null;                // RESET REF TO NULL WHEN IT RUNS
            getData()
        }, 500);

    }, [searchTitle])



    const changeVisibleMode = () => {
        setNewPostModal(false);
    };

    const refreshData = () => {
        getData()
    };

    function onChangePage(page) {
        let skip = (page - 1) * PAGE_SIZE
        getData(skip)
        setCurrentPageSize(page)
    }

    function getData(skip, type) {

        skip = skip || 0
        setChatLoading(true)
        let title = ''

        if (_.isEmpty(searchTitle) === false) {
            title = { orRegex: { title: searchTitle } }
        }


        client.service('clubs')
            .find({
                query: {
                    ...title,
                    $populate: 'userId',
                    $limit: PAGE_SIZE,
                    $skip: skip,
                }
            })
            .then((res) => {
                setClubs(res.data)
                setTotalClub(res.total)
                setChatLoading(false)

            })
    }



    function openNewPost() {
        setChatLoading(true)
        client.authenticate()
            .then((res) => {
                setChatLoading(false)
                setChatType('socialboard');
                setNewPostModal(true);
            })
            .catch((err) => {
                setChatLoading(false)
                message.error("Please Login.")
            })
    }
    //rendering---------------------------------------------------
    return (
        <LayoutV2>
            <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large" indicator={
                <img src="/loading.gif" style={{ width : 100, height : 100, position : 'sticky', position : '-webkit-sticky', top : 0, bottom : 0, left : 0 , right : 0, margin : 'auto'}} />
            }>
                <div className='section'>
                    <div className="container">
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
                            <div style={{ padding: '12px 60px 0px 60px' }}>
                                <Row gutter={12} align="middle" style={{ marginTop: '24px', marginBottom: '12px' }}>
                                    <Col span={12} ><span style={{ fontSize: '20px' }}>CarFreaks Club</span></Col>
                                    <Col span={12} style={{ textAlign: 'right', }}>
                                        <span className='carfreakNavi' onClick={(e) => { props.router.push('/car-freaks') }} >CarFreaks</span>
                                        <span className='carfreakNavi' onClick={(e) => { props.router.push('/social-board') }}>Social Board</span>
                                        {/* <span style={{ fontSize: '16px' }} >Club</span> */}
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12} style={{ textAlign: 'left' }}>
                                        <Search
                                            placeholder="Search"
                                            allowClear
                                            style={{ width: 200 }}
                                            onChange={(e) => setSearchTitle(e.target.value)}
                                        />
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right', }}> <Button onClick={(e) => { openNewPost() }}  ><Icon type="edit" /> Create a Club</Button></Col>
                                </Row>
                            </div>
                            <br />

{/* all club                   */}
                            <Row style={{ padding:'24px'}}>
                            <div style={{ maxInlineSize: '-webkit-fill-available'}}>
                                <div className='clubMainImageDiv'>
                                    {
                                        clubs.map(function (v, i) {
                                            if (i === 0) {
                                                return (
                                                    <div className={'clubMainImageDivMargin clubMainImage' + i} style={{cursor:'pointer'}}>
                                                        <img className='clubMainImageFirst'  onClick={(e) => { props.router.push('/social-club-main/'+v._id) }} src={v.mediaList[0].url} />
                                                    </div>
                                                )
                                            }
                                            return (
                                                <div className={'clubMainImageDivMargin clubMainImage' + i} style={{cursor:'pointer'}}>
                                                    <img className={'clubMainImage'}  onClick={(e) => { props.router.push('/social-club-main/'+v._id) }} src={v.mediaList[0].url} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            </Row>
                            <Row >
                                <Col style={{ float: 'right' }}>
                                    <Pagination
                                        defaultCurrent={1}
                                        total={totalClub}
                                        onChange={onChangePage}
                                        pageSize={PAGE_SIZE}
                                        current={currentPageSize}
                                    />
                                </Col>

                            </Row>


                            {/* PostModal */}
                            <PostModal chatType={chatType} visibleMode={newPostModal} refreshData={refreshData} changeVisibleMode={changeVisibleMode} />


                        </div>
                        <br />


                    </div>
                </div>
            </Spin>

        </LayoutV2>
    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarFreakIndex);