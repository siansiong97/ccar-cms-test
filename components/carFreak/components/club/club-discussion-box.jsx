import { Button, Col, Empty, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import { validateViewType } from '../../config';
import EventPost from '../event-post';
import PostCollapse from '../post-collapse';
import WriteEventModal from '../write-event-modal';
import WritePostModal1 from '../write-post-modal-1';
import ClubBackdrop from './club-backdrop';
import { loading } from '../../../../redux/actions/app-actions';
import WindowScrollLoadWrapper from '../../../general/WindowScrollLoadWrapper';
import { arrayLengthCount } from '../../../../common-function';


const PAGE_SIZE = 10;
const BOX_HEIGHT = 300;

const tabs = [
    {
        text: 'All',
        value: 'all',
    },

    {
        text: 'CarFreaks',
        value: 'carfreaks',
    },

    {
        text: 'Social Board',
        value: 'socialboard',
    }
]
const ClubDiscussionBox = (props) => {

    const [posts, setPosts] = useState([]);
    const [postTotal, setPostTotal] = useState(0);
    const [postPage, setPostPage] = useState(1);

    const [clubId, setClubId] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [tabKey, setTabKey] = useState('all');

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
        setClubId(props.clubId || '')
    }, [props.clubId])

    useEffect(() => {
        setPosts([]);
        setUserChatLikes([]);
        getPosts(0)
    }, [clubId, tabKey])

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

        if (clubId) {
            let query = {
                chatType: tabKey == 'carfreaks' ? 'carfreaks' : 'socialboard',
                parentType: {
                    $in: ['club', 'clubEvent']
                },
                clubId: clubId,
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

            if (tabKey == 'all' || tabKey == '') {
                delete query.chatType;
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

            <ClubBackdrop viewType={viewType}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="flex-justify-space-between flex-items-align-center">
                            <span className='d-inline-block ' >
                                {
                                    _.map(tabs, function (tab) {
                                        return <span className={`${tabKey === tab.value ? 'ccar-yellow border-bottom-yellow' : 'grey-darken-2 '} subtitle1 margin-right-lg cursor-pointer`} onClick={(e) => { setTabKey(tab.value) }} >
                                            {tab.text}
                                        </span>
                                    })
                                }
                            </span>
                            <span className='d-inline-block ' >
                                <Button size="large" className="border-ccar-yellow" onClick={(e) => {
                                    setWritePostEditMode(false);
                                    setWritePostVisible(true);
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
                                                    {
                                                        _.get(post, ['chatType']) == 'event' ?
                                                            <EventPost manualControl data={post}
                                                                postLike={_.find(userChatLikes, { chatId: post._id })}
                                                                onEditClick={(data) => {
                                                                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                        setSelectedPost(data);
                                                                        setEventEditMode(true);
                                                                        setWriteEventVisible(true);
                                                                    }
                                                                }}

                                                                onRemoveClick={(data) => {
                                                                    confirmDeleteEvent(data)
                                                                }} />
                                                            :
                                                            <PostCollapse data={post}
                                                                postLike={_.find(userChatLikes, { chatId: post._id })}
                                                                onEditClick={(data) => {
                                                                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                        setWritePostEditMode(true);
                                                                        setSelectedPost(data);
                                                                        setWritePostVisible(true);
                                                                    }
                                                                }}

                                                                onRemoveClick={(data) => {
                                                                    confirmDelete(data)
                                                                }}
                                                            ></PostCollapse>
                                                    }
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

            <WritePostModal1
                visible={writePostVisible}
                editMode={writePostEditMode}
                onCancel={() => {
                    setWritePostVisible(false);
                }}
                parentType="club"
                clubId={clubId}
                data={selectedPost}
                notify
                onCreatePost={(post) => {
                    if (_.isPlainObject(post) && !_.isEmpty(post)) {
                        if (tabKey === 'all' || _.get(post, ['chatType']) == tabKey) {
                            setPosts([post].concat(posts));
                        }
                    }
                }}
                onUpdatePost={(data) => {
                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                        if (tabKey === 'all' || _.get(data, ['chatType']) == tabKey) {

                            let newPosts = _.map(posts, function (item) {
                                return item._id == _.get(data, ['_id']) ? data : item;
                            });
                            setPosts(newPosts);
                        }
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
                        if (tabKey === 'all' || _.get(newData, ['chatType']) == tabKey) {

                            let newPosts = _.map(posts, function (item) {
                                return item._id == _.get(newData, ['_id']) ? newData : item;
                            });
                            setPosts(newPosts);
                        }
                    }
                }}
            ></WriteEventModal>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubDiscussionBox)));