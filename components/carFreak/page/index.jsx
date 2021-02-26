import '@brainhubeu/react-carousel/lib/style.css';
import { Button, Col, Icon, Input, message as AntMessages, Row, message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../feathers';
import LayoutV2 from '../../Layout-V2';
import { arrayLengthCount, notEmptyLength } from '../../profile/common-function';
import SocialBoardBox from '../components/social-board-box';
import CarFreakBox from '../components/car-freak-box';
import WritePostModal from '../components/write-post-modal';
import { getDataUrlFromFile } from 'browser-image-compression';
import { carFreakGlobalSearch } from '../config';
import { loginMode } from '../../../actions/app-actions';
import { v4 } from 'uuid';
import { fetchCarFreakPosts, fetchEditedPost } from '../../../actions/carfreak.action';

const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const { Search } = Input;
const TRENDING_PAGE_SIZE = 4;


const PAGE_SIZE = 36;

const CarFreakIndex = (props) => {

    const [tabKey, setTabKey] = useState(props.location.pathname == '/social-board' ? 'socialBoard' : 'carFreaks');
    const [isLoading, setIsLoading] = useState(false);


    const [socialBoards, setSocialBoards] = useState([]);
    const [socialBoardPage, setSocialBoardPage] = useState(1);
    const [totalSocialBoard, setTotalSocialBoard] = useState(0);
    const [trendingChat, setTrendingChat] = useState([]);

    const [chatPage, setChatPage] = useState(1);
    const timeoutRef = useRef(null);


    useEffect(() => {
        getSocialBoardData(0, 'trending');
        getSocialBoardData(0, 'trending');
    }, [])

    useEffect(() => {
        props.history.replace(tabKey == 'socialBoard' ? '/social-board' : '/car-freaks')
    }, [tabKey])


    useEffect(() => {
        getSocialBoardData((socialBoardPage - 1) * PAGE_SIZE)
    }, [socialBoardPage])

    function getSocialBoardData(skip, type) {

        skip = skip || 0
        let title = ''

        let sortingStr = { $sort: { _id: -1 } }
        if (type === 'trending') {
            // sortingStr = {$sort: { _id: -1 }}  sort by comment, view???
        }

        setIsLoading(true);
        client.service('chats')
            .find({
                query: {
                    ...title,
                    chatType: 'socialboard',
                    $populate: 'userId',
                    $limit: type == 'trending' ? TRENDING_PAGE_SIZE : PAGE_SIZE,
                    ...sortingStr,
                    $skip: skip,

                }
            })
            .then((res) => {

                setIsLoading(false);
                if (type === 'trending') {
                    setTrendingChat(trendingChat.concat(res.data))
                    return
                }

                setSocialBoards(socialBoards.concat(res.data));
                setTotalSocialBoard(res.total)

            })
    }




    function handleSocialBoardPostChange(post) {
        let posts = _.map(socialBoards, function (chat) {
            return chat._id == _.get(post, ['_id']) ? post : chat;
        });

        setSocialBoards(posts);
    }

    function handleSocialBoardAddPost(post) {
        if (_.isPlainObject(post) && !_.isEmpty(post)) {
            let posts = _.concat([post], socialBoards)
            setSocialBoards(posts);
        }
    }

    function handleRemoveSocialBoardPost(post) {
        let posts = _.filter(socialBoards, function (chat) {
            return chat._id != _.get(post, ['_id']);
        });

        setSocialBoards(posts);
    }
    return (
        <LayoutV2 backgroundImage={`url("/banner/1 – 1.png")`} searchTypes={carFreakGlobalSearch} enterSearchCarFreaks scrollRange={document.body.scrollHeight * 0.5} onScrolledBottom={() => {

            if (tabKey == 'carFreaks') {
                setChatPage(chatPage + 1);
            }
            if (tabKey == 'socialBoard') {
                if (arrayLengthCount(socialBoards) < totalSocialBoard) {
                    setSocialBoardPage(socialBoardPage + 1);
                }
            }
        }}>
            <div className="section">
                <div className="container">
                    <Row gutter={[0, 30]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-justify-space-between flex-items-align-center">
                                <span className="flex-items-align-center flex-justify-start">
                                    <span className={`d-inline-block cursor-pointer margin-right-lg font-weight-bold h6 ${tabKey == 'carFreaks' ? 'border-bottom-yellow font-weight-bold yellow' : 'black border-bottom-black'}`} onClick={(e) => { setTabKey('carFreaks') }} >
                                        CarFreaks
                                    </span>
                                    <span className={`d-inline-block cursor-pointer margin-right-lg font-weight-bold h6 ${tabKey == 'socialBoard' ? 'border-bottom-yellow font-weight-bold yellow' : 'black border-bottom-black'}`} onClick={(e) => { setTabKey('socialBoard') }}>
                                        Social Board
                                    </span>
                                    {/* <span className={`d-inline-block cursor-pointer margin-right-lg font-weight-bold h6 ${tabKey == 'socialClub' ? 'border-bottom-yellow font-weight-bold yellow' : 'black border-bottom-black'}`} onClick={(e) => { setTabKey('socialClub') }}>
                                        CarFreaks Club
                                    </span> */}
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {
                                tabKey == 'carFreaks' ?
                                    <CarFreakBox page={chatPage} size={36} />
                                    :
                                    tabKey == 'socialBoard' ?
                                        // <SocialBoardIndex />
                                        <SocialBoardBox
                                            data={socialBoards}
                                            redirectToSocialBoard={(data) => {
                                                if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['_id'])) {
                                                    props.router.push(`/social-board/${data._id}`)
                                                }
                                            }}
                                            onCreatePost={(data) => {
                                                handleSocialBoardAddPost(data);
                                            }}
                                            onChangePost={(data) => {
                                                handleSocialBoardPostChange(data);
                                            }}
                                            onRemovePost={(data) => {
                                                handleRemoveSocialBoardPost(data);
                                            }}
                                        />
                                        :
                                        null
                            }
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                            <div className="width-100 flex-justify-center" style={{ height: 50 }}>
                                {
                                    isLoading ?
                                        <Icon type="loading" style={{ fontSize: 50 }} />
                                        :
                                        null
                                }
                            </div>
                        </Col>

                    </Row>
                </div>
            </div>
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    loginMode,
    fetchCarFreakPosts,
    fetchEditedPost,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarFreakIndex);