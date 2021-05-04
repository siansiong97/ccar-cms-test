import { Button, Col, Empty, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import { clubProfileViewTypes, isNotAllowedSocialInteraction, validateViewType } from '../../config';
import EventPost from '../event-post';
import PostCollapse from '../post-collapse';
import WriteEventModal from '../write-event-modal';
import WritePostModal1 from '../write-post-modal-1';
import ClubBackdrop from './club-backdrop';
import { loading } from '../../../../redux/actions/app-actions';
import WindowScrollLoadWrapper from '../../../general/WindowScrollLoadWrapper';
import { arrayLengthCount } from '../../../../common-function';
import { useMediaQuery } from 'react-responsive';
import ClubJoinModal from './ClubJoinModal';

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


const PAGE_SIZE = 10;
const BOX_HEIGHT = 300;

const ClubSocialBoardBox = (props) => {

    const [posts, setPosts] = useState([]);
    const [postTotal, setPostTotal] = useState(0);
    const [postPage, setPostPage] = useState(1);

    const [club, setClub] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const [joinClubModalVisible, setJoinClubModalVisible] = useState(false);

    const [writePostVisible, setWritePostVisible] = useState(false);
    const [writePostEditMode, setWritePostEditMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});

    const [writeEventVisible, setWriteEventVisible] = useState(false);
    const [eventEditMode, setEventEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});

    const [viewType, setViewType] = useState('non-member');

    const [userChatLikes, setUserChatLikes] = useState([]);

    useEffect(() => {
        setViewType(validateViewType(props.viewType))
    }, [props.viewType])


    useEffect(() => {
        getUserChatLikes(_.map(posts, '_id'))
    }, [props.user.authenticated])

    useEffect(() => {
        setClub(_.isPlainObject(props.club) && !_.isEmpty(props.club) ? props.club : {});
    }, [props.club])

    useEffect(() => {
        setPosts([]);
        setUserChatLikes([]);
        if (postPage == 1) {
            getPosts(0);
        } else {
            setPostPage(1);
        }
    }, [club])

    useEffect(() => {
        getPosts((postPage - 1) * PAGE_SIZE);
    }, [postPage])

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

    function getPosts(skip) {
        skip = skip || 0

        if (_.get(club, `_id`)) {
            let query = {
                chatType: 'socialboard',
                parentType: {
                    $in: ['club', 'clubEvent']
                },
                clubId: _.get(club, `_id`),
                $populate: [
                    {
                        path: 'userId',
                        ref: 'users'
                    },
                    {
                        path: 'eventId',
                        ref: 'events',
                        populate: [
                            {
                                path: 'createdBy',
                                ref: 'users'
                            },
                        ]
                    },
                    {
                        path: 'clubId',
                        ref: 'clubs'
                    }
                ],
                $limit: PAGE_SIZE,
                $sort: { _id: -1 },
                $skip: skip,
            }


            setIsLoading(true)
            client.service('chats')
                .find({
                    query: {
                        ...query,
                    }
                })
                .then((res) => {

                    let newData = [];
                    newData = _.cloneDeep(posts)
                    if (postPage > 1) {
                        newData = newData.concat(res.data)
                    } else {
                        newData = res.data;
                    }
                    setPosts(newData);
                    setPostTotal(res.total);
                    setIsLoading(false);
                    getUserChatLikes(_.map(_.get(res, ['data']), '_id'), true)

                })
        }
    }

    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted')

                    let newPosts = _.filter(_.cloneDeep(posts), function (item) {
                        return item._id != _.get(res, ['_id']);
                    });

                    setPosts(newPosts || []);
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }
    }

    function confirmDeleteEvent(v) {
        if (v._id && _.get(v, ['eventId', '_id'])) {
            client.service('events')
                .remove(_.get(v, ['eventId', '_id'])).then((res) => {
                    confirmDelete(v);
                }).catch((err) => {
                    console.log('Unable to delete Event.');
                })
        }
    }

    return (
        <React.Fragment>

            <Desktop>
                <ClubBackdrop viewType={viewType} club={club}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="flex-justify-end flex-items-align-center">
                                <span className='d-inline-block ' >
                                    <Button size="large" className="border-ccar-yellow" onClick={(e) => {
                                        if (isNotAllowedSocialInteraction(club, viewType)) {
                                            setJoinClubModalVisible(true);
                                        } else if (viewType != clubProfileViewTypes[3] || viewType != clubProfileViewTypes[2]) {
                                            setWritePostEditMode(false);
                                            setWritePostVisible(true);
                                        }
                                    }}  ><Icon type="edit" /> Write a Post</Button>
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <WindowScrollLoadWrapper scrollRange={document.body.scrollHeight * 0.5} onScrolledBottom={() => {
                                if (arrayLengthCount(posts) < postTotal) {
                                    setPostPage(postPage + 1);
                                }
                            }}>
                                <div className="padding-md">
                                    {
                                        _.isArray(posts) && !_.isEmpty(posts) ?
                                            _.map(posts, function (post) {
                                                return (
                                                    <div className="margin-bottom-md">
                                                        <PostCollapse
                                                            data={post}
                                                            readOnly={isNotAllowedSocialInteraction(club, viewType)}
                                                            postLike={_.find(userChatLikes, { chatId: post._id })}
                                                            onEditClick={(data) => {
                                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                    setWritePostEditMode(true);
                                                                    setSelectedPost(data);
                                                                    setWritePostVisible(true);
                                                                }
                                                            }}
                                                            clubId={_.get(club, `_id`)}
                                                            onRemoveClick={(data) => {
                                                                confirmDelete(data)
                                                            }}
                                                            onLikeClick={() => {
                                                                if(isNotAllowedSocialInteraction(club, viewType)){
                                                                    setJoinClubModalVisible(true)
                                                                }
                                                            }}
                                                            onReplyClick={() => {
                                                                if(isNotAllowedSocialInteraction(club, viewType)){
                                                                    setJoinClubModalVisible(true)
                                                                }
                                                            }}
                                                        ></PostCollapse>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className="padding-md flex-items-align-center flex-justify-center">
                                                <Empty></Empty>
                                            </div>
                                    }
                                </div>
                            </WindowScrollLoadWrapper>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                            <div className="flex-justify-center flex-items-align-center" style={{ height: 30 }}>
                                {
                                    isLoading ?
                                        <Icon type="loading" style={{ fontSize: 30 }} />
                                        :
                                        null
                                }
                            </div>

                        </Col>
                    </Row>
                </ClubBackdrop>
            </Desktop>

            <Tablet>
                <ClubBackdrop viewType={viewType} club={club}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="flex-justify-end flex-items-align-center">
                                <span className='d-inline-block ' >
                                    <Button size="medium" className="border-ccar-yellow" onClick={(e) => {
                                        if (isNotAllowedSocialInteraction(club, viewType)) {
                                            setJoinClubModalVisible(true);
                                        } else if (viewType != clubProfileViewTypes[3] || viewType != clubProfileViewTypes[2]) {
                                            setWritePostEditMode(false);
                                            setWritePostVisible(true);
                                        }
                                    }}  ><Icon type="edit" /> Write a Post</Button>
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <WindowScrollLoadWrapper scrollRange={document.body.scrollHeight * 0.5} onScrolledBottom={() => {
                                if (arrayLengthCount(posts) < postTotal) {
                                    setPostPage(postPage + 1);
                                }
                            }}>
                                <div className="padding-md">
                                    {
                                        _.isArray(posts) && !_.isEmpty(posts) ?
                                            _.map(posts, function (post) {
                                                return (
                                                    <div className="margin-bottom-md">
                                                        <PostCollapse
                                                            data={post}
                                                            readOnly={isNotAllowedSocialInteraction(club, viewType)}
                                                            postLike={_.find(userChatLikes, { chatId: post._id })}
                                                            onEditClick={(data) => {
                                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                    setWritePostEditMode(true);
                                                                    setSelectedPost(data);
                                                                    setWritePostVisible(true);
                                                                }
                                                            }}
                                                            clubId={_.get(club, `_id`)}
                                                            onRemoveClick={(data) => {
                                                                confirmDelete(data)
                                                            }}
                                                            onLikeClick={() => {
                                                                if(isNotAllowedSocialInteraction(club, viewType)){
                                                                    setJoinClubModalVisible(true)
                                                                }
                                                            }}
                                                            onReplyClick={() => {
                                                                if(isNotAllowedSocialInteraction(club, viewType)){
                                                                    setJoinClubModalVisible(true)
                                                                }
                                                            }}
                                                        ></PostCollapse>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className="padding-md flex-items-align-center flex-justify-center">
                                                <Empty></Empty>
                                            </div>
                                    }
                                </div>
                            </WindowScrollLoadWrapper>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                            <div className="flex-justify-center flex-items-align-center" style={{ height: 30 }}>
                                {
                                    isLoading ?
                                        <Icon type="loading" style={{ fontSize: 30 }} />
                                        :
                                        null
                                }
                            </div>

                        </Col>


                    </Row>
                </ClubBackdrop>
            </Tablet>

            <WritePostModal1
                visible={writePostVisible}
                editMode={writePostEditMode}
                onCancel={() => {
                    setWritePostVisible(false);
                }}
                parentType="club"
                clubId={_.get(club, `_id`)}
                data={selectedPost}
                notify
                onCreatePost={(post) => {
                    if (_.isPlainObject(post) && !_.isEmpty(post)) {
                        setPosts([post].concat(posts));
                    }
                }}
                hideChatType
                chatType="socialboard"
                onUpdatePost={(data) => {
                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                        let newPosts = _.map(posts, function (item) {
                            return item._id == _.get(data, ['_id']) ? data : item;
                        });
                        setPosts(newPosts);
                    }
                }}
            >

            </WritePostModal1>

            <WriteEventModal
                visible={writeEventVisible}
                editMode={eventEditMode}
                data={_.get(selectedPost, ['eventId']) || {}}
                onCancel={() => {
                    setSelectedEvent({});
                    setEventEditMode(false);
                    setWriteEventVisible(false);
                }}
                type="club"
                clubId={_.get(selectedPost, ['eventId', 'clubId', '_id'])}
                creator={_.get(selectedPost, ['eventId', 'clubId'])}
                notify
                onUpdate={(event) => {
                    if (_.isPlainObject(event) && !_.isEmpty(event)) {
                        let newData = _.cloneDeep(selectedPost);
                        newData.eventId = {
                            ...event,
                            clubId: _.get(newData, ['eventId', 'clubId']),
                        }
                        let newPosts = _.map(posts, function (item) {
                            return item._id == _.get(newData, ['_id']) ? newData : item;
                        });
                        setPosts(newPosts);
                    }
                }}
            ></WriteEventModal>

            <ClubJoinModal visible={joinClubModalVisible} club={club} onCancel={() => { setJoinClubModalVisible(false) }} ></ClubJoinModal>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubSocialBoardBox)));