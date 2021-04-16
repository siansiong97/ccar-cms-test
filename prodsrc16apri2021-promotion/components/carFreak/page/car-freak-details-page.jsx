
import { Col, Empty, Icon, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Post from '../components/post';
import Post1 from '../components/post-1';
import WritePostModal from '../components/write-post-modal';
import { carFreakGlobalSearch } from '../config';
import client from '../../../feathers';
import LayoutV2 from '../../general/LayoutV2';
import { isValidNumber, notEmptyLength } from '../../../common-function';
import { loading } from '../../../redux/actions/app-actions';
import { withRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}

const PAGE_SIZE = 36;

const CarFreakDetailsPage = (props) => {

    const [post, setPost] = useState({})
    const [userChatLikes, setUserChatLikes] = useState([]);
    const [otherPosts, setOtherPosts] = useState([])
    const [otherPostTotal, setOtherPostTotal] = useState(0)
    const [otherPostPage, setOtherPostPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false);

    const [editMode, setEditMode] = useState('');
    const [selectedPost, setSelectedPost] = useState({});
    const [writeModalVisible, setWriteModalVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0)
        getPost();
    }, [props.router.query.id])

    useEffect(() => {
        if (props.user.authenticated && _.get(post, '_id')) {
            getUserChatLikes(_.compact(_.concat([_.get(post, '_id')], _.map(otherPosts, '_id') || [])), false);
        }

    }, [props.user.authenticated])

    useEffect(() => {

        if (_.isPlainObject(post) && !_.isEmpty(post)) {
            getOtherPosts(0);
            getUserChatLikes([post._id], false)
        } else {
            setOtherPosts([]);
        }

    }, [post])

    useEffect(() => {
        console.log(userChatLikes);
    }, [userChatLikes])

    useEffect(() => {
        getOtherPosts((otherPostPage - 1) * PAGE_SIZE)
    }, [otherPostPage])


    function getPost() {

        if (_.get(props, ['router', 'query', 'id'])) {
            props.loading(true);
            client.service('chats')
                .find({
                    query: {
                        _id: props.router.query.id,
                        chatType: 'carfreaks',
                        $populate: 'userId',
                        $limit: 1,
                    }
                })
                .then((res) => {

                    props.loading(false);
                    setPost(notEmptyLength(res.data) ? res.data[0] : {});
                }).catch(err => {
                    props.loading(false);
                    message.error(err.message)
                });
        } else {
            setPost({});
        }
    }



    function getUserChatLikes(ids, concat) {

        if (_.isArray(ids) && !_.isEmpty(ids) && _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id'])) {
            client.service('chatlikes')
                .find({
                    query: {
                        chatId: {
                            $in: ids || [],
                        },
                        userId: _.get(props.user, ['info', 'user', '_id'])
                    }
                })
                .then((res) => {
                    setUserChatLikes(concat ? _.concat(userChatLikes, res.data) : res.data)
                })
        }
    }


    function getOtherPosts(skip) {

        if (!isValidNumber(parseInt(skip))) {
            skip = 0
        } else {
            skip = parseInt(skip);
        }

        if (_.get(post, ['_id']) && _.get(post, ['userId', '_id'])) {
            setIsLoading(true);
            client.service('chats')
                .find({
                    query: {
                        _id: {
                            $ne: post._id,
                        },
                        userId: post.userId._id,
                        chatType: 'carfreaks',
                        $populate: 'userId',
                        $limit: PAGE_SIZE,
                        $skip: skip,
                    }
                })
                .then((res) => {
                    setOtherPosts(
                        otherPostPage == 1 ?
                            _.isArray(res.data) && !_.isEmpty(res.data) ?
                                res.data
                                :
                                []
                            :
                            _.isArray(res.data) && !_.isEmpty(res.data) ?
                                otherPosts.concat(res.data)
                                :
                                otherPosts
                    );

                    getUserChatLikes(_.map(_.get(res, ['data']), '_id'), true)
                    setOtherPostTotal(res.total);
                    setIsLoading(false);
                }).catch(err => {
                    setIsLoading(false);
                    message.error(err.message)
                });
        } else {
            setPost({});
        }
    }


    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted');
                    setPost({})
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }

    }
    return (
        <LayoutV2 backgroundImage={`url("/banner/1 – 1.png")`} searchTypes={carFreakGlobalSearch} enterSearchCarFreaks scrollRange={window.innerHeight * 0.5} onScrolledBottom={() => { if (otherPostPage * PAGE_SIZE < otherPostTotal) { setOtherPostPage(otherPostPage + 1) } }} >

            <Desktop>
            <div className="section">
                <div className="container">
                    <Row gutter={[10, 20]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Post1 data={post}
                                postLike={_.find(userChatLikes, { chatId: post._id })}
                                onEditClick={(post) => {
                                    setEditMode('edit');
                                    setWriteModalVisible(true);
                                    setSelectedPost(post);
                                }}
                                onRemoveClick={(post) => {
                                    confirmDelete(post) 
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-items-align-center flex-justify-start h5 font-weight-bold black">
                                {`${_.get(post, ['userId', 'firstName']) || ''} ${_.get(post, ['userId', 'lastName']) || ''} ${_.get(post, ['userId', 'firstName']) || _.get(post, ['userId', 'lastName']) ? "'s" : ''} Other Post`}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {
                                _.isArray(otherPosts) && !_.isEmpty(otherPosts) ?
                                    <Row gutter={[10, 10]}>
                                        {

                                            _.map(otherPosts, function (otherPost) {
                                                return (
                                                    <Col xs={24} sm={24} md={8} lg={8} xl={6}>
                                                        <Post data={otherPost} className="background-white box-shadow-heavy round-border"
                                                            hideAction
                                                            postLike={_.find(userChatLikes, { chatId: otherPost._id })}
                                                            onRedirectToPost={() => {
                                                                if (_.isPlainObject(otherPost) && !_.isEmpty(otherPost) && _.get(otherPost, ['_id'])) {
                                                                    props.router.push(`/car-freaks/${otherPost._id}`, undefined, { shallow: false })
                                                                }
                                                            }}
                                                        />
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    :
                                    <div className="padding-md background-white box-shadow-heavy">
                                        <Empty></Empty>
                                    </div>
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
            </Desktop>

            <Tablet>
            <div className="section-version3">
                <div className="container-version3 padding-x-md">
                    <Row gutter={[10, 20]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Post1 data={post}
                                postLike={_.find(userChatLikes, { chatId: post._id })}
                                onEditClick={(post) => {
                                    setEditMode('edit');
                                    setWriteModalVisible(true);
                                    setSelectedPost(post);
                                }}
                                onRemoveClick={(post) => {
                                    confirmDelete(post) 
                                }}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-items-align-center flex-justify-start h5 font-weight-bold black">
                                {`${_.get(post, ['userId', 'firstName']) || ''} ${_.get(post, ['userId', 'lastName']) || ''} ${_.get(post, ['userId', 'firstName']) || _.get(post, ['userId', 'lastName']) ? "'s" : ''} Other Post`}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {
                                _.isArray(otherPosts) && !_.isEmpty(otherPosts) ?
                                    <Row gutter={[10, 10]}>
                                        {

                                            _.map(otherPosts, function (otherPost) {
                                                return (
                                                    <Col xs={24} sm={24} md={8} lg={8} xl={6}>
                                                        <Post data={otherPost} className="background-white box-shadow-heavy round-border"
                                                            hideAction
                                                            postLike={_.find(userChatLikes, { chatId: otherPost._id })}
                                                            onRedirectToPost={() => {
                                                                if (_.isPlainObject(otherPost) && !_.isEmpty(otherPost) && _.get(otherPost, ['_id'])) {
                                                                    props.router.push(`/car-freaks/${otherPost._id}`, undefined, { shallow: false })
                                                                }
                                                            }}
                                                        />
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    :
                                    <div className="padding-md background-white box-shadow-heavy">
                                        <Empty></Empty>
                                    </div>
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
            </Tablet>
            

            <WritePostModal
                currentRecord={selectedPost}
                editMode={editMode}
                chatType={'carfreaks'}
                visibleMode={writeModalVisible}
                onUpdatePost={(data) => {
                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                        setPost(data);
                    }
                }}
                changeVisibleMode={(v) => {
                    setWriteModalVisible(v);
                    if (!v) {
                        setSelectedPost({});
                    }
                }} />
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    loading
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CarFreakDetailsPage));