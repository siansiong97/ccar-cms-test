import React, { useEffect, useState, useRef } from 'react';
import { withRouter, Link } from 'next/dist/client/router';
import { connect } from 'react-redux';
import _, { set } from 'lodash';
import client from '../../feathers'
import axios from 'axios';
import { Row, Col, Card, Button, Tabs, Empty, Modal, Icon, Input, Avatar, Pagination, Spin, Divider, message as AntMessages } from 'antd';
import LayoutV2 from '../Layout-V2';
import {
    updateActiveMenu,
} from '../../actions/app-actions';
import {
    addLike,
    removeLike,
    addBookmark,
    removeBookmark,
} from '../../actions/userlikes-actions';

import UserAvatar from './components/user-avatar';
import { notEmptyLength } from '../profile/common-function';
import ScrollContainer from 'react-indiana-drag-scroll';
import Post from './post';
import PostModal from './modal-Post';
import PostCommentModal from './modal-Post-comment';
import Carousel, { Dots, slidesToShowPlugin, arrowsPlugin } from '@brainhubeu/react-carousel';

const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const { Search } = Input;
const PAGE_SIZE = 32;

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
    const [chatType, setChatType] = useState('');
    const timeoutRef = useRef(null);

    useEffect(() => {
        props.updateActiveMenu('11');
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

    function getData(skip) {

        skip = skip || 0
        setChatLoading(true)
        let title = ''

        if (_.isEmpty(searchTitle) === false) {
            title = { orRegex: { title: searchTitle } }
        }

        client.service('chats')
            .find({
                query: {
                    ...title,
                    chatType: 'carfreaks',
                    $populate: 'userId',
                    $limit: PAGE_SIZE,
                    $sort: { _id: -1 },
                    $skip: skip,

                }
            })
            .then((res) => {
                setChats(res.data)
                setTotalChat(res.total)
                setChatLoading(false)


                let allChat = _.cloneDeep(res.data)

                let inputChatId = _.map(allChat, function (v) {
                    return v._id
                });


                axios.post(`${client.io.io.uri}getTotalReplyChat`,
                    {
                        params: {
                            chatList: inputChatId,
                        }
                    }).then((res) => {

                        try {
                            let result = res.data.data

                            const merged = _(allChat) // start sequence
                            .keyBy('_id') // create a dictionary of the 1st array
                            .merge(_.keyBy(result, '_id')) // create a dictionary of the 2nd array, and merge it to the 1st
                            .values() // turn the combined dictionary to array
                            .value(); // get the value (array) out of the sequence
                            setChats(merged)

                        }
                        catch (err) { }
                    })


            })
    }

    function openNewPost() {
        setChatLoading(true)
        client.authenticate()
            .then((res) => {
                setChatLoading(false)
                setChatType('carfreaks');
                setNewPostModal(true);
            })
            .catch((err) => {
                setChatLoading(false)
                AntMessages.error("Please Login.")
            })
    }

    function openNewPostComment(v) {
        setChatLoading(true)
        client.service('chat-messages').find(
            {
                query: {
                    chatId: v._id,
                    $populate: 'userId',
                    $limit: 50,
                    $sort: { _id: -1 },
                }
            }
        ).then((res) => {
            setChatLoading(false)
            if (res.data.length > 0) {
                setMessages(res.data)
                setChatInfo(v);
                setNewPostModalComment(true);
                setTotalChatCount(res.total);
            }
            else {

                setMessages([])
                setChatInfo(v);
                setNewPostModalComment(true);
            }
        })

    }


    function onClickLike(v, type) {

        client.authenticate().then((res) => {
            axios.post(`${client.io.io.uri}updateLike`,
                {
                    userId: res.user._id,
                    chatId: v._id,
                    type: type
                }, {
                headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] },
            }).then((res) => {
                let result = res.data

                if (type === 'add') {
                    props.addLike({ userId: result.userId, chatId: result.chatId })
                    // AntMessages.success('Liked')

                    let addtoChats = _.cloneDeep(chats)
                    _.map(addtoChats,function(v){
                        if(result.chatId == v._id){
                        v.likedBy.push({ userId: result.userId, chatId: result.chatId })
                        }
                        return v
                    });
                    setChats(addtoChats)

                }
                if (type === 'remove') {
                    props.removeLike({ userId: result.userId, chatId: result.chatId })

                    let removeFromChats = _.cloneDeep(chats)
                    _.map(removeFromChats,function(v){
                        if(result.chatId == v._id){
                        v.likedBy.pop()
                        }
                        return v
                    });
                    setChats(removeFromChats)

                    // AntMessages.success('Unlike')
                }
            }).catch((err) => {
                console.log(err);
                console.log('not able to like');
            })

        }).catch((err) => {
            console.log("Unexpected Error.Like Error");
        })

    }

    function onClickBookmark(v, type) {

        client.authenticate().then((res) => {
            axios.post(`${client.io.io.uri}updateBookmark`,
                {
                    userId: res.user._id,
                    chatId: v._id,
                    type: type
                }, {
                headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] },
            }).then((res) => {
                let result = res.data

                if (type === 'add') {
                    props.addBookmark({ userId: result.userId, chatId: result.chatId })
                    // AntMessages.success('Followed')
                }
                if (type === 'remove') {
                    props.removeBookmark({ userId: result.userId, chatId: result.chatId })
                    // AntMessages.success('UnFollowed')
                }
            }).catch((err) => {

                console.log('not able to like');
            })

        }).catch((err) => {
            console.log("Unexpected Error.Like Error");
        })

    }


    function renderHeart(v) {

        let result = _.find(props.userlikes.allLike, function (obj) {
            if (obj.chatId === v._id) {
                return true;
            }
        });
        if (result) {
            return (<Icon id={'heart' + v} style={{marginRight: '6px'}}  type="heart" theme="twoTone" twoToneColor="#eb2f96" onClick={(e) => { onClickLike(v, 'remove') }} />)
        }

        return (<Icon id={'heart' + v} style={{marginRight: '6px'}}  type="heart" onClick={(e) => { onClickLike(v, 'add') }} />)
    }

    function renderBookmark(v) {

        let result = _.find(props.userlikes.allBookmark, function (obj) {
            if (obj.chatId === v._id) {
                return true;
            }
        });
        if (result) {
            return (<Icon id={'book' + v} className='bookmarkRight' type="book" theme="twoTone" twoToneColor="#e2de02" onClick={(e) => { onClickBookmark(v, 'remove') }} />)
        }

        return (<Icon id={'book' + v} className='bookmarkRight' type="book" onClick={(e) => { onClickBookmark(v, 'add') }} />)
    }


    function renderEditMenu(v) {

        let userId = ''
        try{userId = props.user.info.user._id}catch(err){userId=''}
        if (userId ===v.userId._id) {
            return (<Icon type="more" />)
        }
    }

    return (
        <LayoutV2>
            <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large">
                <div className='section'>
                    <div className="containerCarFreak">
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
                            <div style={{ padding: '12px 60px 0px 60px' }}>
                                <Row gutter={12} align="middle" style={{ marginTop: '24px', marginBottom: '12px' }}>
                                    <Col span={12} ><span style={{ fontSize: '20px' }}>CarFreaks</span></Col>
                                    <Col span={12} style={{ textAlign: 'right', }}>
                                        <span style={{ fontSize: '16px', marginRight: '10px' }}>CarFreaks</span>
                                        <span style={{ fontSize: '16px', marginRight: '10px', cursor: 'pointer', textDecoration: 'underline' }} onClick={(e) => { props.router.push('/social-board', '/social-board', { shallow={false} : false}) }}  >Social Board</span>
                                        {/* <span style={{ fontSize: '16px', textDecoration: 'underline', cursor: 'pointer' }} onClick={(e) => { props.router.push('/social-club') }}>Club</span> */}
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
                                    <Col span={12} style={{ textAlign: 'right', }}> <Button onClick={(e) => { openNewPost() }}  ><Icon type="edit" /> Write a Post</Button></Col>
                                </Row>
                            </div>
                            <br />

                            {/* Discussion/Post */}
                            <div style={{ padding: '12px 36px 0px 36px' }}>
                                <Row gutter={12} type="flex" style={{ padding: '0px 0px 24px 0px' }}>
                                    {
                                        chats.map(function (v, i) {
                                            return (
                                                <Col key={'chatbox' + i}
                                                    style={{
                                                        'WebkitBoxShadow': '2px 2px 10px 1px rgba(0,0,0,0.4)',
                                                        'border': '1px solid rgb(128 128 128 / .2)',
                                                        'borderRadius': '6px',
                                                        'minHeight': '200px',
                                                        'maxWidth' :'300px',
                                                        'margin': '18px',
                                                        'paddingLeft': '0px',
                                                        'paddingRight': '0px',
                                                    }}
                                                    xs={24} sm={12} md={8} lg={6} xl={6}
                                                >
                                                    <Row>
                                                        <Col span={12}>
                                                            {renderBookmark(v)}
                                                        </Col>
                                                        <Col style={{ textAlign: 'right' }} span={12}>
                                                            {renderEditMenu(v)}
                                                            {/* <Icon type="book" className='bookmarkRight' onClick={(e) => { onClickBookmark(v, 'add') }} /> */}
                                                        </Col>
                                                    </Row>
                                                    {/* <div style={{ cursor: 'pointer' }} onClick={(e) => { openNewPostComment(v) }}> */}
                                                    <div>
                                                        <Row style={{ textAlign: 'center' }}>{v.userId ? v.userId.avatar ? <img className='avatarProfileImg' src={v.userId.avatar} /> : '' : ''}</Row>
                                                        <Row style={{ textAlign: 'center' }}>{v.userId ? v.userId.firstName ? v.userId.firstName : '' : ''}</Row>
                                                        <Row style={{ textAlign: 'center',cursor: 'pointer'  }} onClick={(e) => { openNewPostComment(v) }}>

                                                            {v.mediaList ?
                                                                <Carousel plugins={['arrows']}>
                                                                    {
                                                                        v.mediaList.map(function (item) {
                                                                            return (
                                                                                <div className='carfreskMainPage'>
                                                                                    <img key={item._id}
                                                                                        style={{
                                                                                            'objectFit': 'contain',
                                                                                            width: '-webkit-fill-available',
                                                                                            height: '-webkit-fill-available'
                                                                                        }}
                                                                                        src={item.url ? item.url : null} />
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </Carousel>
                                                                : ''}

                                                        </Row>
                                                        <Row style={{ paddingLeft: '12px' }}>
                                                            {renderHeart(v)}{v.likedBy ? v.likedBy.length : 0}
                                                            <Icon style={{ marginLeft: '6px', marginRight: '6px' }} type="message" />{v.totalCount ? v.totalCount : 0}</Row>
                                                        <Row className='text-truncate-twoline' style={{ paddingLeft: '12px', color: '#000000' }}>{v.title}</Row>
                                                        <Row className='text-truncate-fiveline' style={{ paddingLeft: '12px' }}>{v.content}</Row>
                                                        {v.location ? <Row style={{ paddingLeft: '12px' }}>{v.location}</Row> : ''}
                                                    </div>
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
                            <PostModal chatType={chatType} visibleMode={newPostModal} refreshData={refreshData} changeVisibleMode={changeVisibleMode} />
                            <PostCommentModal
                                totalChatCount={setTotalChatCount}
                                messages={messages}
                                chatInfo={chatInfo}
                                visibleMode={newPostModalComment}
                                changeVisibleMode={changeVisibleModeComment}
                            />

                        </div>
                    </div>
                </div>
            </Spin>
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user:state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    addLike: addLike,
    removeLike: removeLike,
    addBookmark: addBookmark,
    removeBookmark: removeBookmark,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarFreakIndex);