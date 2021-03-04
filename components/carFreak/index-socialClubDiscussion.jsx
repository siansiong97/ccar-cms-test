import Carousel from '@brainhubeu/react-carousel';
import { Button, Col, Icon, Input, message, Modal, Pagination, Row, Spin } from 'antd';
import _ from 'lodash';
// import Carousel, { Dots, slidesToShowPlugin, arrowsPlugin } from '@brainhubeu/react-carousel';
// 
import moment from "moment";
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import SmartGallery from 'react-smart-gallery';
import { updateActiveMenu } from '../../actions/app-actions';
import client from '../../feathers';
import PostModal from './components/post-modal';
import WritePostModal from './components/write-post-modal';



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
    const [trendingChat, setTrendingChat] = useState([]);
    const [currentDiscussion, setCurrentDiscussion] = useState({});
    const [modalImage, setModalImage] = useState(false);
    const [modalActiveChat, setModalActiveChat] = useState({});
    const [dotValue, setdotValue] = useState(0);
    const timeoutRef = useRef(null);

    const onChangeDotImage = value => {
        setdotValue(value);
    }

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

                let resultList = res.data
                for (let i = 0; i < resultList.length; i++) {
                    const record = resultList[i];
                    if (resultList[i].mediaList) {
                        if (resultList[i].mediaList.length > 0) {
                            resultList[i].allImageUrl = _.map(resultList[i].mediaList, e => _.values(_.pick(e, 'url')))//get url only
                        }
                    }

                }
                setChats(resultList)
                setTotalChat(res.total)
                setChatLoading(false)
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
                message.error("Please Login.")
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


    return (

        <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large" indicator={
            <img src="/loading.gif" style={{ width: 100, height: 100, position: 'sticky', position: '-webkit-sticky', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} />
        }>

            {/* Discussion/Post */}

            <Row  >
                <Col style={{ backgroundColor: '#ffffff', borderRadius: '12px' }} xs={24} sm={24} md={14} lg={14} xl={16}>
                    {
                        chats.map(function (v, i) {
                            return (
                                <Col key={'chatbox' + i}
                                    style={{
                                        'WebkitBoxShadow': '2px 2px 10px 1px rgba(0,0,0,0.4)',
                                        'border': '1px solid rgb(128 128 128 / .2)',
                                        'borderRadius': '6px',
                                        'width': '100%',
                                        'marginBottom': '6px'
                                    }}
                                    span={24}
                                >
                                    <Row style={{ padding: '8px' }}>
                                        <div class="socialClubListing">
                                            <div class="socialClubListingAvatar" >
                                                {v.userId.avatar ? <img className='avatarProfileImg' src={v.userId.avatar} /> : ''}
                                            </div>
                                            <div class="socialClubListingContent" syle={{ paddingTop: '10px' }}>
                                                <Row>
                                                    <p><span>{v.userId.firstName ? v.userId.firstName : ''}{v.location ? <span>in {v.location}</span> : ''}</span></p>
                                                    <p><span className='chatMessageDatexMargin'>{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span></p>
                                                </Row>
                                            </div>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div>
                                            {v.mediaList ?
                                                v.mediaList.length > 0 ?
                                                    <SmartGallery
                                                        images={v.allImageUrl || []}
                                                        height={480}
                                                        width='100%'
                                                        rootStyle={{ maxInlineSize: '-webkit-fill-available' }}
                                                        onImageSelect={(event, src) => {
                                                            setModalActiveChat(v)
                                                            setModalImage(true)
                                                        }}
                                                    />
                                                    : ''
                                                : ''}
                                        </div>
                                    </Row>

                                    <Row className='text-truncate-twoline' style={{ fontSize: '16px', margin: '12px 0px', paddingLeft: '12px', color: '#000000' }}>{v.title}</Row>
                                    <Row style={{ padding: '0px 12px', marginBottom: '12px' }}>
                                        <Col span={12}>
                                            <Icon type="heart" style={{ color: 'red', marginRight: '6px' }} theme="filled" />{v.replyby ? v.replyby.length : 0}
                                            <Icon style={{ marginLeft: '6px', marginRight: '6px' }} type="message" />{v.replyby ? v.replyby.length : 0}
                                        </Col>
                                        <Col span={12} style={{ textAlign: 'right' }}>
                                            <Button onClick={(e) => { openNewPostComment(v) }}>Reply</Button>
                                        </Col>
                                    </Row>

                                </Col>
                            )
                        })
                    }
                </Col>
                <Col style={{ padding: '6px' }} xs={24} sm={24} md={14} lg={14} xl={8}>

                    <div
                        style={{

                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            overflowX: 'scroll',
                            overflow: '-moz-scrollbars-vertical',
                            maxHeight: '900px',
                        }}
                    >
                        {/* <Row
                            style={{
                                backgroundColor: 'orange',
                                minHeight: '50px',
                                padding: '24px',
                                fontSize: '18px',
                                fontWeight: '600',
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
                                            trendingChat.map(function (v) {
                                                return (
                                                    <Col style={{ 'cursor': 'pointer' }}
                                                        onClick={(e) => { setMessages([]); setCurrentDiscussion(v); }}
                                                        span={24}
                                                    >
                                                        <Row style={{ padding: '12px' }}><b className='text-truncate-twoline' style={{ color: '#000000', fontSize: '20px' }}>{v.title}</b></Row>
                                                        <Row style={{ marginBottom: '12px' }}>
                                                            <Col>
                                                                <span style={{ padding: '6px' }}>{v.userId.avatar ? <img className='avatarProfileImgTrending' src={v.userId.avatar} /> : ''}</span>
                                                                <span>
                                                                    {v.userId.firstName ? v.userId.firstName : ''}
                                                                    {v.location ? <span>in {v.location}</span> : ''}
                                                                </span>
                                                            </Col>
                                                            <Row className='chatMessageDate'>
                                                                <span >{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</span>
                                                            </Row>
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

                        </Row> */}
                    </div>

                </Col>

            </Row>

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


            {/* WritePostModal */}
            <WritePostModal chatType={chatType} visibleMode={newPostModal} refreshData={refreshData} changeVisibleMode={changeVisibleMode} />
            <PostModal
                totalChatCount={setTotalChatCount}
                messages={messages}
                chatInfo={chatInfo}
                visibleMode={newPostModalComment}
                changeVisibleMode={changeVisibleModeComment}
            />

            <Modal
                visible={modalImage}
                footer={null}
                onCancel={(event, src) => {
                    setModalImage(false)
                }}
                width={720}
                bodyStyle={{ minHeight: '480px' }}
            >

                {
                    _.isEmpty(modalActiveChat) === false ?
                        _.isEmpty(modalActiveChat.mediaList) === false ?
                            <div>
                                <Carousel
                                    arrows
                                    dots
                                >
                                    {
                                        modalActiveChat.mediaList.map(function (item) {
                                            return (
                                                <img key={item._id}
                                                    style={{ maxInlineSize: '-webkit-fill-available' }}
                                                    src={item.url ? item.url : null} />

                                            );
                                        })
                                    }

                                </Carousel>

                            </div>
                            : ''
                        : ''
                }
            </Modal>


        </Spin >

    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarFreakIndex);