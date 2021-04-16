import Carousel from '@brainhubeu/react-carousel';

import { Button, Col, Divider, Dropdown, Icon, Input, Menu, message as AntMessages, message, Popconfirm, Row, Spin, Pagination } from 'antd';
import axios from 'axios';
import _, { add, isEmpty } from 'lodash';
import moment from "moment";
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
    updateActiveMenu
} from '../../actions/app-actions';
import {
    addLikeMsg,
    removeLikeMsg
} from '../../actions/userlikes-actions';
import { like } from '../../assets/carfreak/';
import client from '../../feathers';
import LayoutV2 from '../Layout-V2';
import PostCommentModal from './modal-SocialBoardPostComment';
import UserAvatar from './components/user-avatar';
import WritePostModal from './components/write-post-modal';


const { Search } = Input;
const PAGE_SIZE = 9;
const messagePageSize = 10;
const { TextArea } = Input;

const SocialBoardIndex = (props) => {

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
    const [chatType, setChatType] = useState('');
    const [editMode, setEditMode] = useState('');
    const [currentRecord, setCurrentRecord] = useState({});
    const [editModeComment, setEditModeComment] = useState('');
    const [currentComment, setCurrentComment] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [currentMessage, setCurrentMessage] = useState({});
    const [replytoMessage, setReplyToMessage] = useState({});


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
        client.service('chatmessages').removeListener('created');

        client.service('chatmessages').on('created', (record) => {

            if (record.chatId == currentDiscussion._id) {
                let newMessages = []
                newMessages = newMessages.concat(record) //new to old
                newMessages = newMessages.concat(messages) //new to old
                let chatCount = newMessages.length || 0

                setMessages(newMessages)
            }

        })

        client.service('chatmessagereplies').removeListener('created');

        client.service('chatmessagereplies').on('created', (record) => {

            if (record.chatId == currentDiscussion._id) {
                let newMessages = []

                // newMessages = newMessages.concat(record) //new to old
                // newMessages = newMessages.concat(messages) //new to old
                // let chatCount = newMessages.length || 0

                // setMessages(newMessages)
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
        setCurrentRecord({});
        setEditMode('')
        setCurrentUser({})
    };

    const changeVisibleModeComment = () => {

        setNewPostModalComment(false);
    };

    const refreshData = () => {

        getData()
        setCurrentDiscussion({});
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
                    chatType: 'socialboard',
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
        client.service('chatmessages').find(
            {
                query: {
                    chatId: currentDiscussion._id,
                    $populate: 'userId',
                    $limit: messagePageSize,
                    $sort: { _id: -1 },
                    $skip: messages.length
                }
            }
        ).then((res) => {

            if (res.data.length > 0) {
                let newMessages = messages.concat(res.data)


                let inputMessageId = _.map(res.data, function (v) { return v._id.toString() });

                client.service('chatmessagereplies')
                    .find({
                        query: {
                            $populate: 'userId',
                            "messageId": { $in: inputMessageId },
                            $limit: messagePageSize * messagePageSize
                        }
                    }).then((res2) => {

                        var result = _(res2.data)
                            .groupBy('messageId')
                            .map((v, messageId) => ({
                                messageId,
                                replyMessage: v
                            }))
                            .value();

                        _.map(newMessages, function (v) {

                            return _.assign(v, _.find(result, { messageId: v._id }));
                        });

                        setMessages(newMessages)

                    }).catch((err) => {
                        console.log(err);
                    })


            }
            if (res.total < res.skip + messagePageSize) {
            }

        })


    }


    function openNewPost(type, record) {
        setChatLoading(true)
        client.authenticate()
            .then((res) => {
                setChatLoading(false)
                setChatType('socialboard');
                if (type) {
                    setEditMode('edit')
                    setCurrentRecord(record)
                } else {
                    setEditMode('')
                    setCurrentRecord({})

                }
                setNewPostModal(true);
            })
            .catch((err) => {
                setChatLoading(false)
                setEditMode('')
                setCurrentRecord({})
                message.error("Please Login.")
            })
    }

    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    AntMessages.success('Record Deleted')
                    refreshData()
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }

    }

    function renderEditMenu(v) {

        let userId = ''
        try { userId = props.user.info.user._id } catch (err) { userId = '' }
        if (userId === _.get(v, ['userId', '_id'])) {
            return (

                <Dropdown overlay={

                    <Menu>
                        <Menu.Item onClick={(e) => { openNewPost('edit', v) }}><span >Edit</span></Menu.Item>
                        <Menu.Item>
                            <Popconfirm
                                title="Are you sure to delete this chat?"
                                onConfirm={(e) => { confirmDelete(v) }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span>Delete</span>
                            </Popconfirm>
                        </Menu.Item>
                    </Menu>
                }>
                    <Icon type="more" />
                </Dropdown>

            )
        }
        else {
            return (<span>&nbsp;</span>)
        }
    }

    function renderEditMenuComment(v, msgkey) {

        let userId = ''
        try { userId = props.user.info.user._id } catch (err) { userId = '' }
        if (userId === v.userId._id) {
            return (

                <Dropdown overlay={
                    <Menu>
                        <Menu.Item onClick={(e) => { openComment('edit', v) }}><span >Edit</span></Menu.Item>
                        <Menu.Item>
                            <Popconfirm
                                title="Are you sure to delete this chat?"
                                onConfirm={(e) => { confirmDeleteMsg(v, msgkey) }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span>Delete</span>
                            </Popconfirm>
                        </Menu.Item>
                    </Menu>
                }>
                    <Icon type="more" />
                </Dropdown>

            )
        }
        else {
            return (<span>&nbsp;</span>)
        }
    }

    function confirmDeleteMsg(v, msgkey) {
        if (v._id) {
            client.service('chatmessages')
                .remove(v._id).then((res) => {

                    try {
                        let x = document.getElementById(msgkey);
                        // x.style= {}
                        x.style.display = "none";
                        if (messages.length <= 1) {
                            setMessages([])
                        }
                    }
                    catch (err) { console.log(err) }

                    AntMessages.success('Record Deleted')

                }).catch((err) => {

                    console.log('Unable to delete Chat.');
                })
        }

    }

    function openComment(type, record) {

        setChatLoading(true)
        client.authenticate()
            .then((res) => {
                setChatLoading(false)
                setCurrentUser(res)
                setChatType('socialboard');
                if (type) {
                    if (type === 'edit') {
                        setEditModeComment('edit')
                        setCurrentComment(record)
                    }
                    if (type === 'replyToMsg') {
                        setEditModeComment('replyToMsg')
                        setReplyToMessage(record)
                    }
                    else {
                        setEditModeComment('')
                        setCurrentComment({})
                    }
                }
                setNewPostModalComment(true);
            })
            .catch((err) => {
                setCurrentUser({})
                setChatLoading(false)
                setEditModeComment('')
                setCurrentComment({})
                AntMessages.error("Please Login.")
            })

    }

    function renderHeart(v, category) {

        if (v.userLike) {
            return (<img className='likeHeart' onClick={(e) => { onClickLike(v, 'remove', category) }} src={like} />)
        }
        else {
            return (<img className='likeHeartGrey' onClick={(e) => { onClickLike(v, 'add', category) }} src={like} />)
        }
    }



    function onClickLike(v, type, category) {

        client.authenticate().then((res) => {
            axios.post(`${client.io.io.uri}updateLikeMessages`,
                {
                    userId: res.user._id,
                    messageId: v._id,
                    type: type,
                }, {
                headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] },
            }).then((res) => {
                let result = res.data

                if (type === 'add') {

                    if (category) {
                        if (category === 'replyMsg') {
                            let addtoMessages = _.cloneDeep(messages)
                            _.map(addtoMessages, function (v) {
                                _.map(v.replyMessage, function (v2) {
                                    if (result.messageId == v2._id) {
                                        v2.userLike = {}
                                        v2.totalLike = (v2.totalLike || 0) + 1
                                    }
                                    return v2
                                })

                                return v
                            });
                            setMessages(addtoMessages)
                            return
                        }
                    }
                    else {

                        let addtoMessages = _.cloneDeep(messages)
                        _.map(addtoMessages, function (v) {
                            if (result.messageId == v._id) {
                                v.userLike = {}
                                v.totalLike = (v.totalLike || 0) + 1
                            }
                            return v
                        });
                        setMessages(addtoMessages)
                    }
                }
                if (type === 'remove') {
                    if (category) {
                        if (category === 'replyMsg') {
                            let removeFromMessages = _.cloneDeep(messages)
                            _.map(removeFromMessages, function (v) {
                                _.map(v.replyMessage, function (v2) {
                                    if (result.messageId == v2._id) {
                                        delete v2.userLike
                                        v2.totalLike = (v2.totalLike || 0) - 1
                                    }
                                    return v2
                                })
                                return v
                            });

                            setMessages(removeFromMessages)
                        }
                    }
                    else {
                        let removeFromMessages = _.cloneDeep(messages)
                        _.map(removeFromMessages, function (v) {
                            if (result.messageId == v._id) {
                                delete v.userLike
                                v.totalLike = (v.totalLike || 0) - 1
                            }
                            return v
                        });

                        setMessages(removeFromMessages)
                    }
                }
            }).catch((err) => {

                // console.log('not able to like');
            })

        }).catch((err) => {
            console.log("Unexpected Error.Like Error");
        })

    }


    //rendering---------------------------------------------------
    return (
        <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
                {/* <div style={{ padding: '12px 10px 0px 10px' }}>
                                <Row gutter={12} align="middle" style={{ marginTop: '5px', marginBottom: '10px' }}>
                                    <Col span={12} ><span style={{ fontSize: '20px' }}>Social Board</span></Col>
                                    <Col span={12} style={{ textAlign: 'right', }}>
                                        <span className='carfreakNavi' onClick={(e) => { props.router.push('/car-freaks') }} >CarFreaks</span>
                                        <span style={{ fontSize: '16px', marginRight: '10px' }}  >Social Board</span>
                                    </Col>
                                        <span style={{ fontSize: '16px', cursor: 'pointer', textDecoration: 'underline' }} onClick={(e) => { props.router.push('/social-club') }}>Club</span>
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
                                    // <Col span={12} style={{ textAlign: 'right', }}> <Button onClick={(e) => { openNewPost() }}  ><Icon type="edit" /> Create a Topic</Button></Col>
                                </Row>
                            </div>
                            <br /> */}

                {/* Discussion/Post */}
                <div style={{ padding: '12px 36px', overflowY: 'scroll' }}>
                    <Row gutter={[0, 0]} justify="center" type="flex">

                        {

                            chats.map(function (v, i) {
                                return (
                                    <Col key={'chats' + i} className="gutter-row" style={{ 'border': '1px solid rgb(128 128 128 / .2)', 'borderRadius': '6px', }}

                                        xs={22} sm={22} md={10} lg={10} xl={8}
                                    >

                                        <Row style={{ padding: '8px', lineHeight: 1 }}>
                                            <Row><Col style={{ textAlign: 'right' }}>{renderEditMenu(v)}</Col></Row>
                                            <div className="socialBoardListing" style={{ 'cursor': 'pointer' }} onClick={(e) => { setMessages([]); setCurrentDiscussion(v); }}>
                                                <div className="socialBoardListingAvatar" style={{ textAlign: 'center' }} >
                                                    {/* {v.userId.avatar ? <img className='avatarProfileImg' src={v.userId.avatar} /> : ''} */}

                                                    <UserAvatar data={v.userId} redirectProfile  />
                                                </div>
                                                <div className="socialBoardListingContent">
                                                    <Row ><span className='text-truncate-threeline' style={{ color: '#000000' }}>{v.title}</span></Row>
                                                    <Row><span className='chatMessageDatexMargin'>{v.userId.firstName ? 'Posted by ' + v.userId.firstName : ''}{v.location ? <span>in {v.location}</span> : ''}</span></Row>
                                                    <Row><span className='chatMessageDatexMargin'>{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span></Row>
                                                </div>
                                                <div className="socialBoardListingEmpty1"> </div>
                                            </div>
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


            </div>
            <Row style={{ margin: '4px 0px' }}></Row>

            <Row >

                {/* dicussion chat ---------*/}
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>

                    {/* // Social Board Title //*/}

                    {isEmpty(currentDiscussion) === false ?
                        <div style={{
                            // padding: '24px',
                            backgroundColor: '#ffffff',
                            marginRight: '10px',
                            borderRadius: '6px'
                        }}>

                            <Row>
                                <Col span={12}>
                                    <span style={{ fontSize: '18x' }}>Discussion</span>
                                </Col>

                                <Col span={12} style={{ textAlign: 'right' }}>
                                    {/* <span style={{ marginRight: '6px' }}>Highlight
                                                        <Switch
                                                        checkedChildren="On"
                                                        unCheckedChildren="Off"
                                                    //  onChange={onChange} 
                                                    /></span> */}

                                    <span>
                                        <Button onClick={(e) => { openComment('new') }}><Icon type="edit" />Advise This Freak</Button>
                                    </span>
                                </Col>
                            </Row>

                            <Row >
                                <Col span={12} >


                                    <div className="socialBoardListing">
                                        <div className="socialBoardListingAvatar" style={{ textAlign: 'center' }}>
                                            <UserAvatar data={currentDiscussion.userId} redirectProfile />
                                            {/* {currentDiscussion.userId.avatar ? <img className='avatarProfileImg' src={currentDiscussion.userId.avatar} /> : ''} */}
                                        </div>
                                        <div className="socialBoardListingContent">
                                            <Row><span>{currentDiscussion.userId.firstName ? currentDiscussion.userId.firstName : ''}{currentDiscussion.location ? <span>in {currentDiscussion.location}</span> : ''}</span></Row>
                                            <Row><span className='chatMessageDatexMargin'>{moment(currentDiscussion.createdAt).format('MMM Do')} | {moment(currentDiscussion.createdAt).fromNow()}</span></Row>
                                        </div>
                                        <div className="socialBoardListingEmpty1"> </div>
                                    </div>
                                </Col>

                            </Row>

                            <Row><span style={{ color: '#000000', fontSize: '24px', overflowWrap: 'break-word' }}>{currentDiscussion.title}</span></Row>

                            <Row>
                                <Row>
                                    <Row style={{ margin: '12px 0px' }}>
                                        {
                                            currentDiscussion.mediaList.length > 0 ?
                                                <Carousel dots arrows>
                                                    {
                                                        currentDiscussion.mediaList.map(function (v, i) {
                                                            return (
                                                                <div key={'currentDiscussion' + i} className='carfreskcarousel'>
                                                                    <img
                                                                        style={{
                                                                            'objectFit': 'contain',
                                                                            width: '-webkit-fill-available',
                                                                            height: '-webkit-fill-available'
                                                                        }}
                                                                        key={'img' + i} src={v.url} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Carousel>
                                                : ''
                                        }
                                    </Row>
                                    <Row style={{ margin: '24px 0px' }}>
                                        <span style={{ marginLeft: '6px' }}>{currentDiscussion.content}</span>
                                    </Row>

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
                    {/* // discussion comment section //*/}
                    <div className='socialBoard'>
                        {
                            isEmpty(messages) === false
                                ?

                                <Row>
                                    {
                                        messages.map(function (v, i) {
                                            return (
                                                <div key={'messages' + i}
                                                    id={'messages' + i}
                                                    style={{
                                                        border: '1px solid rgb(255,200,105,0.5)',
                                                        // padding: '12px',
                                                        borderRadius: '6px',
                                                        marginBottom: '6px'
                                                    }}
                                                >
                                                    <Row style={{ textAlign: 'right' }}> {renderEditMenuComment(v, 'messages' + i)}</Row>
                                                    <Row id={'chat' + i}>



                                                        <Row className='lineHeight1' style={{ paddingLeft: '6px' }}>
                                                            <Col span={1}>
                                                                <span><UserAvatar redirectProfile style={{ textAlign: 'left' }} data={v.userId} /></span>
                                                            </Col>
                                                            <Col span={23}>
                                                                <Row>
                                                                    <Col span={24}><span>{v.userId.firstName ? v.userId.firstName : ''}{v.location ? <span>in {v.location}</span> : ''}</span></Col>
                                                                    <Col span={24}>
                                                                        <span className='chatMessageDatexMargin'>{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span>
                                                                        <span style={{ marginLeft: '6px' }}>&#183;</span>
                                                                        <span style={{ marginLeft: '6px' }}>{renderHeart(v)}{v.totalLike || 0}</span>
                                                                        <span style={{ marginLeft: '6px' }}>&#183;</span>
                                                                        <span style={{ marginLeft: '6px' }} className='chatMessageDatexMargin hoverUnderline' onClick={(e) => { openComment('replyToMsg', v) }} >Reply</span>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>

                                                    </Row>

                                                    <Row style={{ margin: '8x 0px' }}>
                                                        <Col offset={1}>
                                                            <span style={{ fontSize: '12px', fontWeight: 'lighter', overflowWrap: 'break-word' }}>{v.message}</span>
                                                        </Col>
                                                    </Row>

                                                    {/* <Row style={{ marginBottom: '10px' }}>
                                                                    <Col span={11} offset={1}>
                                                                        {renderHeart(v)}{v.totalLike || 0}
                                                                    </Col>
                                                                    <Col style={{ textAlign: 'right' }} span={12}>
                                                                        <Button onClick={(e) => { openComment('replyToMsg', v) }} >Reply</Button>
                                                                    </Col>
                                                                </Row> */}

                                                    {/* //start reply messages render ----- */}
                                                    <Row>

                                                        {v.replyMessage ?
                                                            v.replyMessage.length > 0 ?
                                                                <div style={{ padding: '16px' }}>
                                                                    {v.replyMessage.map(function (v2, i) {
                                                                        return (
                                                                            <div key={'messagesReply' + i}
                                                                                id={'messagesReply' + i}
                                                                                style={{
                                                                                    // border: '1px solid rgb(255,200,105,0.5)',
                                                                                    paddingLeft: '12px',
                                                                                    borderRadius: '6px',
                                                                                    marginBottom: '6px'
                                                                                }}
                                                                            >
                                                                                {/* <Row style={{ textAlign: 'right' }}> {renderEditMenuComment(v2, 'messagesReply' + i)}</Row> */}

                                                                                <Row id={'chat' + i}>

                                                                                    {/* <Row className='lineHeight1'>
                                                                                                    <Col span={1}>
                                                                                                        <span><UserAvatar style={{ textAlign: 'left' }} data={v2.userId} /></span>
                                                                                                    </Col>
                                                                                                    <Col span={23}>
                                                                                                        <Row>
                                                                                                            <Col span={24}>{v2.userId.firstName ? v2.userId.firstName : ''}{v2.location ? <span>in {v2.location}</span> : ''}</Col>
                                                                                                            <Col span={24}>
                                                                                                                <span className='chatMessageDatexMargin'> {moment(v2.createdAt).fromNow()}</span>
                                                                                                                <span style={{ marginLeft: '6px' }}>&#183;</span>
                                                                                                                <span style={{ marginLeft: '6px' }}>{renderHeart(v2)}{v2.totalLike || 0}</span>
                                                                                                            </Col>
                                                                                                        </Row>
                                                                                                    </Col>
                                                                                                </Row> */}


                                                                                </Row>

                                                                                <Row className='lineHeight1'>
                                                                                    <Col offset={1} style={{ borderRadius: '12px', border: '1px solid rgb(155 155 155 / 50%)', padding: '6px' }}>
                                                                                        <Row>
                                                                                            <Col span={1}>

                                                                                                <span><UserAvatar redirectProfile style={{ textAlign: 'left' }} data={v2.userId} /></span>

                                                                                            </Col>
                                                                                            <Col span={22}>
                                                                                                <Row style={{ margin: '8x 0px' }}>
                                                                                                    <Col>
                                                                                                        {v2.userId.firstName ? v2.userId.firstName : ''}{v2.location ? <span>in {v2.location}</span> : ''}
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <Row style={{ margin: '8x 0px' }}>
                                                                                                    <Col>

                                                                                                        <span style={{ fontWeight: 'lighter', overflowWrap: 'break-word', fontWeight: '500', fontFamily: 'Helvetica, Arial, sans-serif !important' }}>{v2.message}</span>
                                                                                                    </Col>import WritePostModal from './write-post-modal';

                                                                                                </Row>
                                                                                            </Col>
                                                                                            <Col style={{ textAlign: 'right' }} span={1}> <span className='showHoverMenu'>{renderEditMenuComment(v2, 'messagesReply' + i)}</span></Col>
                                                                                        </Row>


                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col offset={1}>
                                                                                        <span className='chatMessageDatexMargin'> {moment(v2.createdAt).fromNow()}</span>
                                                                                        <span style={{ marginLeft: '6px' }}>&#183;</span>
                                                                                        <span style={{ marginLeft: '6px' }}>{renderHeart(v2, 'replyMsg')}{v2.totalLike || 0}</span>
                                                                                    </Col>
                                                                                </Row>


                                                                                {/* 
                                                                                            <Row>
                                                                                                <Col offset={1}>
                                                                                                    {renderHeart(v2)}{v2.totalLike || 0}
                                                                                                </Col>
                                                                                            </Row> */}
                                                                            </div>

                                                                        )
                                                                    })}
                                                                </div>
                                                                : ''
                                                            : ''}

                                                    </Row>
                                                    {/* ----- start reply messages render  */}
                                                </div>
                                            )
                                        })
                                    }
                                </Row>

                                :

                                isEmpty(currentDiscussion) === false ?
                                    <div style={{ textAlign: 'center' }}>
                                        <Divider />
                                        <Row><Icon
                                            style={{ color: 'steelblue', fontSize: '36px' }}
                                            type="message" /></Row>
                                        <br />
                                        <Row>No Comments Yet</Row>
                                        <br />
                                        <Row>Be the first to share what you think!</Row>
                                    </div> : ''
                        }

                        {/*--------- dicussion chat */}
                    </div>
                </Col>

                {/* trending chat */}
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>

                    <div
                        style={{
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            overflowX: 'scroll',
                            overflow: '-moz-scrollbars-vertical',
                            maxHeight: '900px',
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
                                // minHeight: '480px',
                                // padding: '24px',
                                borderRadius: '0px 0px 12px 12px'
                            }}
                        >
                            {
                                isEmpty(trendingChat) === false ?

                                    <React.Fragment>
                                        {
                                            trendingChat.map(function (v, i) {
                                                return (
                                                    <Col key={'trendingChat' + i} style={{ 'cursor': 'pointer' }}
                                                        onClick={(e) => { setMessages([]); setCurrentDiscussion(v); }}
                                                        span={24}
                                                    >
                                                        <Row style={{ padding: '12px' }}><b className='text-truncate-twoline' style={{ color: '#000000', fontSize: '20px' }}>{v.title}</b></Row>
                                                        <Row style={{ marginBottom: '12px' }}>
                                                            <Col>

                                                                <Row >
                                                                    <Col span={2}>
                                                                        <span><UserAvatar redirectProfile style={{ textAlign: 'left' }} data={v.userId} /></span>
                                                                    </Col>
                                                                    <Col span={22}>
                                                                        <Row>
                                                                            <Col span={24}><span className='chatMessageDatexMargin'>{v.userId.firstName ? 'Posted by ' + v.userId.firstName : ''}{_.isEmpty(v.location)===false  ? <span> in {v.location}</span> : ''}</span></Col>
                                                                            <Col span={24}><span className='chatMessageDatexMargin'>{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span></Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ borderBottom: '1px solid rgb(128 128 128 / .2)', marginTop: '12px' }}>
                                                        </Row>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </React.Fragment>
                                    : <div></div>

                            }

                        </Row>
                    </div>
                </Col>
            </Row>

            {/* PostModal */}
            <WritePostModal
                currentRecord={currentRecord}
                editMode={editMode}
                chatType={chatType}
                visibleMode={newPostModal}
                refreshData={refreshData}
                changeVisibleMode={changeVisibleMode}
                onCreatePost={(data) => {

                    refreshData();
                }} />
            <PostCommentModal
                currentUser={currentUser}
                currentComment={currentComment}
                editModeComment={editModeComment}
                chatInfo={currentDiscussion}
                visibleMode={newPostModalComment}
                changeVisibleMode={changeVisibleModeComment}
                replytoMessage={replytoMessage}
            />

        </div>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    addLikeMsg: addLikeMsg,
    removeLikeMsg: removeLikeMsg,
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialBoardIndex);