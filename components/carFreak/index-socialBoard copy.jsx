import React, { useEffect, useState, useRef } from 'react';
import { withRouter, Link } from 'next/dist/client/router';
import { connect } from 'react-redux';
import _, { isEmpty } from 'lodash';
import client from '../../feathers'
import axios from 'axios';
import { Row, Col, Card, Button, Tabs, Empty, message, Modal, Icon, Input, Avatar, Pagination, Spin, Table, Switch, Form, Tooltip, Upload,Divider } from 'antd';
import LayoutV2 from '../Layout-V2';
import {
    updateActiveMenu,
} from '../../actions/app-actions';
import UserAvatar from './components/user-avatar';
import { notEmptyLength } from '../profile/common-function';
import PostModal from './modal-Post';
import PostCommentModal from './modal-SocialBoardPostComment';
import Carousel, { Dots, slidesToShowPlugin, arrowsPlugin } from '@brainhubeu/react-carousel';

import moment from "moment";
import { ReactSortable } from "react-sortablejs";

const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const { Search } = Input;
const PAGE_SIZE = 9;
const { TextArea } = Input;

const CarFreakIndex = (props) => {
 
    const [newPostModal, setNewPostModal] = useState([]);
    const [newPostModalComment, setNewPostModalComment] = useState([]);
    const [totalChatCount, setTotalChatCount] = useState(0);
    const [totalChat, setTotalChat] = useState(0);
    const [messages, setMessages] = useState([]);
    const [chatInfo, setChatInfo] = useState([]);
    const [chats, setChats] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [currentPageSize, setCurrentPageSize] = useState(0);
    const [searchTitle, setSearchTitle] = useState('');
    const timeoutRef = useRef(null);
    const [currentDiscussion, setCurrentDiscussion] = useState({});
    const [discussionComment, setDiscussionComment] = useState([]);
    const [trendingChat, setTrendingChat] = useState([]);
 

    const uploadButton = (
        <div style={{ padding: '5%' }}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    useEffect(() => {
        getData()
        setCurrentPageSize(1)
        setMessages([])
        setCurrentDiscussion({})
        getData(0, 'trending')
    }, [])

    useEffect(() => {
        client.service('chat-messages').removeListener('created');

        client.service('chat-messages').on('created', (record) => {

            if (record.chatId == currentDiscussion._id) {
                let newMessages = []
                newMessages = newMessages.concat(record) //new to old
                newMessages = newMessages.concat(messages) //new to old
                let chatCount = newMessages.length || 0

                setMessages(newMessages)
            }

        })
 
    });

    useEffect(() => {

        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {      // SET A TIMEOUT
            timeoutRef.current = null;                // RESET REF TO NULL WHEN IT RUNS
            getData()
        }, 500);

    }, [searchTitle])


    useEffect(() => {

        getDataMessage()

    }, [currentDiscussion])




    const changeVisibleMode = () => {
        setNewPostModal(false);
    };

    const changeVisibleModeComment = () => {

        setNewPostModalComment(false);
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

        let sortingStr = { $sort: { _id: -1 } }
        if (type === 'trending') {
            // sortingStr = {$sort: { _id: -1 }}  sort by comment, view???
        }

        client.service('chats')
            .find({
                query: {
                    ...title,
                    $populate: 'userId',
                    $limit: PAGE_SIZE,
                    ...sortingStr,
                    $skip: skip,

                }
            })
            .then((res) => {

                if (type === 'trending') {
                    setTrendingChat(res.data)
                    return
                }

                setChats(res.data)
                setTotalChat(res.total)
                setChatLoading(false)

            })
    }


    function getDataMessage() {

        if (isEmpty(currentDiscussion) === true) {
            return
        }
        client.service('chat-messages').find(
            {
                query: {
                    chatId: currentDiscussion._id,
                    $populate: 'userId',
                    $limit: 50,
                    $sort: { _id: -1 },
                    $skip: messages.length
                }
            }
        ).then((res) => {

            if (res.data.length > 0) {
                let newMessages = messages.concat(res.data)
                setMessages(newMessages)
            }
            if (res.total < res.skip + 50) {
                // setDisableViewMoreComment(true)
            }

        })


    }


    function openNewPost() {
        setChatLoading(true)
        client.authenticate()
            .then((res) => {
                setChatLoading(false)
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
            <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large"  indicator={
                <img src="/loading.gif" style={{ width : 100, height : 100, position : 'sticky', position : '-webkit-sticky', top : 0, bottom : 0, left : 0 , right : 0, margin : 'auto'}} />
            }>
                <div className='section'>
                    <div className="container">
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
                            <div style={{ padding: '12px 60px 0px 60px' }}>
                                <Row gutter={12} align="middle" style={{ marginTop: '24px', marginBottom: '12px' }}>
                                    <Col span={12} ><span style={{ fontSize: '20px' }}>Social Board</span></Col>
                                    <Col span={12} style={{ textAlign: 'right', }}>
                                        <span style={{ fontSize: '16px', marginRight: '10px' }}>CarFreaks</span>
                                        <span style={{ fontSize: '16px', marginRight: '10px' }} onClick={(e) => { props.router.push('/social-board') }}  >Social Board</span>
                                        {/* <span style={{ fontSize: '16px', }}>Club</span> */}
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
                                    <Col span={12} style={{ textAlign: 'right', }}> <Button onClick={(e) => { openNewPost() }}  ><Icon type="edit" /> Create a Topic</Button></Col>
                                </Row>
                            </div>
                            <br />

                            {/* Discussion/Post */}
                            <div style={{ padding: '12px 36px 0px 36px' }}>
                                <Row gutter={12} type="flex" style={{ padding: '0px 0px 24px 0px', justifyContent: 'center' }}>
                                    {
                                        chats.map(function (v) {
                                            return (
                                                <Col style={{
                                                    'WebkitBoxShadow': '2px 2px 10px 1px rgba(0,0,0,0.2)',
                                                    'border': '1px solid rgb(128 128 128 / .2)',
                                                    'borderRadius': '6px',
                                                    // 'minHeight': '100px',
                                                    // 'padding': '12px',
                                                    'margin': '12px',
                                                    'paddingLeft': '0px',
                                                    'paddingRight': '0px',
                                                    'cursor': 'pointer'
                                                }}

                                                    onClick={(e) => { setMessages([]); setCurrentDiscussion(v); }}
                                                    xs={22} sm={22} md={10} lg={10} xl={7}
                                                >
                                                    <Row>
                                                        <Col span={6}>
                                                            <span style={{ marginTop: '12px' }}>{v.userId.avatar ? <img className='avatarProfileImg' src={v.userId.avatar} /> : ''}</span>
                                                        </Col>
                                                        <Col span={18}>
                                                            <p><span style={{ paddingLeft: '12px', color: '#000000' }}>{v.title}</span></p>
                                                            <p>
                                                                {v.userId.firstName ? v.userId.firstName : ''}
                                                                {v.location ? <span>in {v.location}</span> : ''}
                                                            </p>
                                                        </Col>
                                                    </Row>


                                                    <Row>

                                                    </Row>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </div>
                            <Row >
                                <Col style={{ float: 'right' }}>
                                    <Pagination
                                        defaultCurrent={1}
                                        total={totalChat}
                                        onChange={onChangePage}
                                        pageSize={PAGE_SIZE}
                                        current={currentPageSize}
                                    />
                                </Col>

                            </Row>


                            {/* PostModal */}
                            <PostModal visibleMode={newPostModal} refreshData={refreshData} changeVisibleMode={changeVisibleMode} />
                            <PostCommentModal
                                totalChatCount={setTotalChatCount}
                                messages={messages}
                                chatInfo={currentDiscussion}
                                visibleMode={newPostModalComment}
                                changeVisibleMode={changeVisibleModeComment}
                                
                            />

                        </div>
                        <br />
                        {/* <div style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}> */}
                        <Row>
                            <Col
                                xs={24} sm={24} md={16} lg={16} xl={16}
                                style={{ maxHeight: '900px', }}>

                                {/* // Social Board Title //*/}

                                {isEmpty(currentDiscussion) === false ?
                                    <div style={{
                                        padding: '24px',
                                        backgroundColor: '#ffffff',
                                        marginRight: '10px',
                                        borderRadius: '6px'
                                    }}>

                                        <Row>
                                            <Col span={12}>
                                                <span style={{ fontSize: '18x' }}>Discussion</span>
                                            </Col>

                                            <Col span={12} style={{ textAlign: 'right' }}>
                                                <span style={{ marginRight: '6px' }}>Highlight
                                                        <Switch
                                                        checkedChildren="On"
                                                        unCheckedChildren="Off"
                                                    //  onChange={onChange} 
                                                    /></span>

                                                <span>
                                                    <Button onClick={(e) => { setNewPostModalComment(true); }}><Icon type="edit" />Advise This Freak</Button>
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row><span style={{ color: '#000000', fontSize: '24px' }}>{currentDiscussion.title}</span></Row>

                                        <Row >
                                            <Col span={12} >
                                                <Row>
                                                    <span style={{ padding: '6px' }}>{currentDiscussion.userId.avatar ? <img className='avatarProfileImgTrending' src={currentDiscussion.userId.avatar} /> : ''}</span>
                                                    <span>
                                                        {currentDiscussion.userId.firstName ? currentDiscussion.userId.firstName : ''}
                                                        {currentDiscussion.userId.location ? <span>in {currentDiscussion.userId.location}</span> : ''}
                                                    </span>
                                                </Row>
                                                <Row className='chatMessageDate'>
                                                    <span>{moment(currentDiscussion.createdAt).format('MMM Do')} | {moment(currentDiscussion.createdAt).fromNow()}</span>
                                                </Row>
                                            </Col>

                                        </Row>

                                        <Row>
                                            <Row>
                                                <Row style={{ margin: '12px 0px' }}>
                                                    <Carousel>
                                                        {
                                                            currentDiscussion.mediaList.map(function (v, i) {
                                                                return (
                                                                    <img key={'img' + i} src={v.url} />
                                                                )
                                                            })
                                                        }
                                                    </Carousel>
                                                </Row>
                                                <Row style={{ margin: '24px 0px' }}>
                                                    <span >{currentDiscussion.content}</span></Row>
                                            </Row>
                                        </Row>

                                        <Row>


                                        </Row>


                                    </div>
                                    : <Row>
                                        <div style={{
                                            padding: '24px',
                                            backgroundColor: '#ffffff',
                                            marginRight: '10px',
                                            borderRadius: '6px'
                                        }}>
                                            <span>No topic Selected.</span>
                                        </div>
                                    </Row>}
                                {/* // comment section //*/}
                                <div className='socialBoard'>
                                    {
                                        isEmpty(messages) === false
                                            ?

                                            <Row>
                                                {
                                                    messages.map(function (v, i) {
                                                        return (
                                                            <div key={'messages' + i}
                                                                style={{
                                                                    border: '1px solid rgb(255,200,105,0.5)',
                                                                    padding: '12px',
                                                                    borderRadius: '6px',
                                                                    marginBottom: '6px'
                                                                }}
                                                            >
                                                                <Row id={'chat' + i}>
                                                                    {/* <span style={{ color: '#000000', marginRight: '6px' }}>{v.name ? v.name : v.userId.firstName}</span> */}

                                                                    <div class="chatRecordHeader">
                                                                        <div class="chatRecordHeaderAvatar">
                                                                            <span style={{ padding: '6px' }}>{v.userId.avatar ? <img className='avatarProfileImgTrending' src={v.userId.avatar} /> : ''}</span>
                                                                        </div>
                                                                        <div class="chatRecordHeaderName">
                                                                            {v.userId.firstName ? v.userId.firstName : ''}{v.location ? <span>in {v.location}</span> : ''}
                                                                        </div>
                                                                        <div class="chatRecordHeaderTime">
                                                                            <span className='chatMessageDatexMargin'>{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span>
                                                                        </div>
                                                                    </div>


                                                                </Row>

                                                                <Row>
                                                                    <span style={{ fontSize: '12px', fontWeight: 'lighter', overflowWrap: 'break-word' }}>{v.message}</span>
                                                                </Row>
                                                                <Row>
                                                                    <Col span={12}>
                                                                        like , reply
                                                                    </Col>
                                                                    <Col style={{ textAlign: 'right' }} span={12} >
                                                                        reply ,counter
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Row>

                                            : <Row></Row>
                                    }


                                </div>
                            </Col>
                            <Col
                                xs={24} sm={24} md={10} lg={10} xl={8}
                            >

                                <div
                                    style={{
                                        borderRadius: '12px',
                                        backgroundColor: '#ffffff',
                                        overflowX: 'scroll',
                                        overflow: '-moz-scrollbars-vertical',
                                        maxHeight: '600px',
                                    }}
                                >
                                    <Row
                                        style={{
                                            backgroundColor: 'orange',
                                            minHeight: '50px',
                                            padding: '24px',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            borderRadius: '12px 12px 0px 0px'
                                        }}
                                    >Trending Today</Row>

                                    <Row
                                        style={{
                                            minHeight: '480px',
                                            // padding: '24px',
                                            borderRadius: '0px 0px 12px 12px'
                                        }}
                                    >
                                        {
                                            isEmpty(trendingChat) === false ?

                                                <React.Fragment>
                                                    {
                                                        trendingChat.map(function (v) {
                                                            return (
                                                                <Col style={{
                                                                    'cursor': 'pointer'
                                                                }}
                                                                    onClick={(e) => { setMessages([]); setCurrentDiscussion(v); }}
                                                                    span={24}
                                                                >
                                                                    <Row style={{ padding: '12px' }}><b style={{ color: '#000000', fontSize: '20px' }}>{v.title}</b></Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <span style={{ padding: '6px' }}>{v.userId.avatar ? <img className='avatarProfileImgTrending' src={v.userId.avatar} /> : ''}</span>
                                                                            <span>
                                                                                {v.userId.firstName ? v.userId.firstName : ''}
                                                                                {v.location ? <span>in {v.location}</span> : ''}
                                                                            </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row
                                                                        // style={{ padding: '0px 12px 12px 12px', fontSize: '10px', 'color': 'rgb(0 0 0 / .6)' }}
                                                                        className='chatMessageDate'
                                                                    >
                                                                        <span >{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span>
                                                                    </Row>


                                                                    <Row
                                                                        style={{
                                                                            borderBottom: '1px solid rgb(128 128 128 / .2)',
                                                                        }}
                                                                    >

                                                                    </Row>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </React.Fragment>
                                                : ''

                                        }

                                    </Row>
                                </div>




                            </Col>
                        </Row>
                        {/* </div> */}
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