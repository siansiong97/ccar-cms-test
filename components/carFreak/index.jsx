import '@brainhubeu/react-carousel/lib/style.css';
import { Button, Col, Dropdown, Icon, Input, Menu, message as AntMessages, message, Popconfirm, Popover, Row, Spin } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
    updateActiveMenu
} from '../../actions/app-actions';
import {
    addBookmark, addLike,
    removeBookmark, removeLike
} from '../../actions/userlikes-actions';
import { like } from '../../assets/carfreak/';
import client from '../../feathers';
import LayoutV2 from '../Layout-V2';
import PostModal from './write-post-modal';
import PostCommentModal from './post-modal';
import UserAvatar from './components/user-avatar';

const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const { Search } = Input;
const PAGE_SIZE = 32;



const CarFreakIndex = (props) => {

    const [newPostModal, setNewPostModal] = useState([]);
    const [newPostModalComment, setNewPostModalComment] = useState([]);
    // const [totalChatCount, setTotalChatCount] = useState(0);
    const [totalChat, setTotalChat] = useState(0);
    const [messages, setMessages] = useState([]);
    const [chatInfo, setChatInfo] = useState([]);
    const [chats, setChats] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const [chatType, setChatType] = useState('');
    const [editMode, setEditMode] = useState('');
    const [currentRecord, setCurrentRecord] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [endofPost, setEndofPost] = useState(false);


    const timeoutRef = useRef(null);

    useEffect(() => {
        props.updateActiveMenu('11');
        getData()

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
        setCurrentRecord({});
        setEditMode('')
    };

    const changeVisibleModeComment = () => {
        setCurrentRecord({});
        setNewPostModalComment(false);
    };

    const refreshData = () => {
        getData()
    };

    // function onChangePage(page) {
    //     let skip = (page - 1) * PAGE_SIZE
    //     getData(skip)
    //     setCurrentPageSize(page)
    // }
    function onChangePage() {
        let skip = (currentPage + 1) * PAGE_SIZE
        getData(skip)
        setCurrentPage(currentPage + 1)
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

                let inputChatId = _.map(res.data, function (v) { return v._id.toString() });

                let userId = ''
                try { userId = props.user.info.user._id } catch (err) { userId = '' }
                if (_.isEmpty(userId) === false) {
                    userId = { userId: userId }
                }

                client.service('chatlikes')
                    .find({
                        query: {
                            "chatId": { $in: inputChatId },
                            ...userId
                        }
                    }).then((res2) => {
                        let merged = []

                        res2.data.map(function (v) {
                            res.data.map(function (v2) {
                                if (v2._id === v.chatId) {
                                    v2.userLike = {}
                                    return v2
                                }
                            })
                            return v
                        })


                        let newData = _.cloneDeep(chats)
                        newData = newData.concat(res.data)

                        if (res.data.length <= 0 ||
                            res.total < 32
                        ) {
                            setEndofPost(true)
                        }
                        setChats(newData)
                        setTotalChat(res.total)
                        setChatLoading(false)

                    }).catch((err) => {
                        console.log(err);
                    })


            })
    }

    function openNewPost(type, record) {

        setChatLoading(true)
        client.authenticate()
            .then((res) => {
                setChatLoading(false)
                setChatType('carfreaks');
                if (type) {
                    if (type === 'edit') {
                        setEditMode('edit')
                        setCurrentRecord(record)
                    }
                    else {
                        setEditMode('')
                        setCurrentRecord({})
                    }
                }
                setNewPostModal(true);
            })
            .catch((err) => {
                setChatLoading(false)
                setEditMode('')
                setCurrentRecord({})
                AntMessages.error("Please Login.")
            })
    }

    function openNewPostComment(v) {
        // setChatLoading(true)
        // client.service('chatmessages').find(
        //     {
        //         query: {
        //             chatId: v._id,
        //             $populate: 'userId',
        //             $limit: 2,
        //             $sort: { _id: -1 },
        //         }
        //     }
        // ).then((res) => {
        //     setChatLoading(false)
        // if (res.data.length > 0) {
        // setMessages(res.data)
        setChatInfo(v);
        setNewPostModalComment(true);
        // setTotalChatCount(res.total);
        // }
        // else {

        //     setMessages([])
        //     setChatInfo(v);
        //     setNewPostModalComment(true);
        // }
        // })

    }


    function onClickLike(v, type) {

        client.authenticate().then((res) => {
            axios.post(`${client.io.io.uri}updateLike`,
                {
                    userId: res.user._id,
                    chatId: v._id,
                    type: type
                }, {
                headers: { 'Authorization': client.settings.accessToken },
            }).then((res) => {
                let result = res.data

                if (type === 'add') {
                    let addtoChats = _.cloneDeep(chats)
                    _.map(addtoChats, function (v) {
                        if (result.chatId == v._id) {
                            v.userLike = {}
                            v.totalLike = (v.totalLike || 0) + 1
                        }
                        return v
                    });
                    setChats(addtoChats)

                }
                if (type === 'remove') {

                    let removeFromChats = _.cloneDeep(chats)
                    _.map(removeFromChats, function (v) {
                        if (result.chatId == v._id) {
                            delete v.userLike
                            v.totalLike = (v.totalLike || 0) - 1
                        }
                        return v
                    });

                    setChats(removeFromChats)
                }
            }).catch((err) => {
                console.log('not able to like');
            })

        }).catch((err) => {
            AntMessages.error("Please Login.")
            // console.log("Unexpected Error.Like Error");
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
                headers: { 'Authorization': client.settings.accessToken },
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

        if (v.userLike) {
            return (<img className='likeHeart' onClick={(e) => { onClickLike(v, 'remove') }} src={like} />)
        }
        else {
            return (<img className='likeHeartGrey' onClick={(e) => { onClickLike(v, 'add') }} src={like} />)
        }
    }

    function renderBookmark(v) {

        let result = _.find(props.userlikes.allBookmark, function (obj) {
            if (obj.chatId === v._id) {
                return true;
            }
        });
        if (result) {
            return (
                <Popover content="Unfollow this Freak.">
                    <Icon id={'book' + v} className='bookmarkRight' type="book" theme="twoTone" twoToneColor="#e2de02" onClick={(e) => { onClickBookmark(v, 'remove') }} />
                </Popover>
            )
        }

        return (

            <Popover content="Follow this Freak !">
                <Icon id={'book' + v} className='bookmarkRight' type="book" onClick={(e) => { onClickBookmark(v, 'add') }} />
            </Popover>
        )
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
        if (!v.userId) {
            return
        }
        if (!v.userId._id) {
            return
        }
        if (userId === v.userId._id) {
            return (

                <Dropdown overlay={

                    <Menu>
                        <Menu.Item onClick={(e) => { openNewPost('edit', v) }}>
                            <span >Edit</span>
                        </Menu.Item>
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
    }

    return (
        <LayoutV2>
            <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large" indicator={
                <img src="/loading.gif" style={{ width: 100, height: 100, position: 'sticky', position: '-webkit-sticky', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} />
            }>
                <div style={{ backgroundImage: `url("/banner/1 – 1.png")`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>

                    <div className='section'  >
                        <Row className="margin-bottom-md">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="width-100 flex-items-align-center flex-justify-start">
                                    {/* <span className={`d-inline-block cursor-pointer margin-x-sm font-weight-normal h6 ${tabKey == 'news' ? 'border-bottom-ccar-yellow font-weight-bold ccar-yellow' : ''}`} onClick={(e) => { setTabKey('news') }} > */}
                                    <span className={`d-inline-block cursor-pointer margin-x-sm font-weight-bold h6 black ${props.location.pathname == '/car-freaks' ? 'border-bottom-ccar-yellow font-weight-bold ccar-yellow' : ''}`} onClick={(e) => { props.router.push('/car-freaks') }} >
                                        CarFreaks
                                </span>
                                    <span className='d-inline-block cursor-pointer margin-x-sm black' >
                                        |
                                </span>
                                    <span className={`d-inline-block cursor-pointer margin-x-sm font-weight-bold h6 black ${props.location.pathname == '/social-board' ? 'border-bottom-ccar-yellow font-weight-bold ccar-yellow' : ''}`} onClick={(e) => { props.router.push('/social-board') }}>
                                        Social Board
                                </span>
                                </div>
                            </Col>
                        </Row>
                        <div className="containerCarFreak">
                            <div style={{ backgroundColor: 'transparent', borderRadius: '12px', }}>
                                {/* <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', height:'600px' }} */}
                                {/* <div className="padding-x-sm padding-y-xs" >
                                <Row align="middle" style={{ marginTop: '5px', marginBottom: '10px' }}>
                                    <Col span={12} ><span style={{ fontSize: '20px' }}>CarFreaks</span></Col>
                                    <Col span={12} style={{ textAlign: 'right', }}>
                                        <span style={{ fontSize: '16px', marginRight: '10px' }}>CarFreaks</span>
                                        <span style={{ fontSize: '16px', marginRight: '10px', cursor: 'pointer', textDecoration: 'underline' }} onClick={(e) => { props.router.push('/social-board') }}  >Social Board</span>
                                        <span style={{ fontSize: '16px', textDecoration: 'underline', cursor: 'pointer' }} onClick={(e) => { props.router.push('/social-club') }}>Club</span>
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col xs={11} sm={11} md={11} lg={11} xl={11} style={{ textAlign: 'left' }}>
                                        <Search
                                            placeholder="Search"
                                            allowClear
                                            style={{ width: 200 }}
                                            onChange={(e) => setSearchTitle(e.target.value)}
                                        />
                                    </Col>
                                    <Col xs={{ span: 12, offset: 1 }} sm={{ span: 12, offset: 1 }} md={{ span: 12, offset: 0 }} lg={{ span: 12, offset: 0 }} xl={{ span: 12, offset: 0 }} style={{ textAlign: 'right' }}>
                                        <Button onClick={(e) => { openNewPost('new') }}  ><Icon type="edit" /> Write a Post</Button>
                                    </Col>
                                </Row>
                            </div>
                            <br /> */}

                                {/* Discussion/Post */}
                                {/* <div style={{ padding: '12px 36px 0px 36px', height:'450px', overflowY:'scroll' }}> */}
                                <div style={{ padding: '12px 36px 12px 36px', overflowY: 'scroll' }}>
                                    <Row gutter={[20, 20]} type="flex">
                                        {
                                            chats.map(function (v, i) {
                                                return (
                                                    <Col className="gutter-row" key={'chatbox' + i}
                                                        // style={{
                                                        //     height:'380px',
                                                        //     width:'310px',
                                                        //     'minHeight': '200px',
                                                        //     'border': '1px solid rgb(128 128 128 / .2)',
                                                        //     'borderRadius': '6px',
                                                        // }}
                                                        xs={24} sm={12} md={8} lg={6} xl={6}
                                                    >
                                                        <div
                                                            style={{
                                                                'border': '1px solid rgb(128 128 128 / .2)',
                                                                'borderRadius': '6px',
                                                                'minHeight': '200px',
                                                                padding: '4px',
                                                                height: '100%',
                                                                maxHeight: 'fit-content',
                                                                backgroundColor: '#ffffff'
                                                            }}
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
                                                                <Row style={{ textAlign: 'center' }}>
                                                                    {/* {v.userId ? v.userId.avatar ? <img className='avatarProfileImg' src={v.userId.avatar} /> : '' : ''} */}

                                                                    <UserAvatar redirectProfile data={v.userId} />
                                                                </Row>
                                                                <Row style={{ textAlign: 'center' }}>{v.userId ? v.userId.firstName ? v.userId.firstName : '' : ''}</Row>
                                                                <Row style={{ textAlign: 'center', cursor: 'pointer' }} onClick={(e) => { openNewPostComment(v) }}>

                                                                    {v.mediaList ? v.mediaList.length > 0 ?
                                                                        // <Carousel plugins={['arrows']}>
                                                                        //     {
                                                                        //         v.mediaList.map(function (item, i) {
                                                                        //             return (
                                                                        //                 <div key={'media' + i} className='carfreskMainPage'>
                                                                        //                     <img key={item._id}
                                                                        //                         style={{
                                                                        //                             'objectFit': 'contain',
                                                                        //                             width: '-webkit-fill-available',
                                                                        //                             height: '-webkit-fill-available'
                                                                        //                         }}
                                                                        //                         src={item.url ? item.url : null} />
                                                                        //                 </div>
                                                                        //             );
                                                                        //         })
                                                                        //     }
                                                                        // </Carousel>
                                                                        v.mediaList[0].url ?
                                                                            <div style={{ minHeight: '200px' }}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        // width: '-webkit-fill-available',
                                                                                        height: '100%',
                                                                                        maxHeight: '200px',
                                                                                        maxInlineSize: '-webkit-fill-available',
                                                                                        // verticalAlign: 'middle',
                                                                                        // height: '100%',
                                                                                    }}
                                                                                    src={v.mediaList[0].url}
                                                                                />
                                                                            </div>

                                                                            : ''
                                                                        : ''
                                                                        : ''}

                                                                </Row>
                                                                <Row style={{ paddingLeft: '12px' }}>
                                                                    {renderHeart(v)}{v.totalLike || 0}
                                                                    <Icon style={{ marginLeft: '6px', marginRight: '6px' }} type="message" />{v.totalReply || 0}</Row>
                                                                <Row className='text-truncate-oneline' style={{ paddingLeft: '12px', color: '#000000' }}>{v.title}</Row>
                                                                <Row className='text-truncate-oneline' style={{ paddingLeft: '12px' }}>{v.content}</Row>
                                                                {v.location ? <Row style={{ paddingLeft: '12px' }}>{v.location}</Row> : ''}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>

                                    <Row className="margin-y-md">
                                        <Col style={{ textAlign: 'center' }}>
                                            {/* <Pagination
                                            defaultCurrent={1}
                                            total={totalChat}
                                            onChange={onChangePage}
                                            pageSize={PAGE_SIZE}
                                            current={currentPageSize}
                                        /> */}


                                            <Button
                                                disabled={endofPost}
                                                onClick={(e) => { onChangePage() }}
                                            >Show more Freak Post.</Button>
                                        </Col>

                                    </Row>
                                </div>



                                {/* PostModal */}
                                <PostModal
                                    currentRecord={currentRecord}
                                    editMode={editMode}
                                    chatType={chatType}
                                    visibleMode={newPostModal}
                                    refreshData={refreshData}
                                    changeVisibleMode={changeVisibleMode} />
                                <PostCommentModal
                                    // totalChatCount={setTotalChatCount}
                                    // messages={messages}
                                    chatInfo={chatInfo}
                                    visibleMode={newPostModalComment}
                                    editMode={editMode}
                                    changeVisibleMode={changeVisibleModeComment}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
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