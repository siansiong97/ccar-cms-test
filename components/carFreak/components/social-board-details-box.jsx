
import { Button, Col, Empty, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../feathers';
import { writePostIcon } from '../../../icon';
import CommentBox from './comment-box';
import CommentModal from './comment-modal';
import PostMenu from './post-menu';
import WritePostModal from './write-post-modal';
import UserAvatar from '../../general/UserAvatar';
import { arrayLengthCount, getUserName, notEmptyLength, sortByDateDesc, getObjectId } from '../../../common-function';
import ParseTag from '../../general/ParseTag';



const messagePageSize = 10
const SocialBoardDetailsBox = (props) => {

    const [post, setPost] = useState({})
    const [pinnedCommentIds, setPinnedCommentIds] = useState([]);
    const [pinnedComments, setPinnedComments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [editMode, setEditMode] = useState('');
    const [commentModalVisible, setCommentModalVisible] = useState('');
    const [selectedComment, setSelectedComment] = useState({});
    const [commentEditMode, setCommentEditMode] = useState('')

    const [writeModalVisible, setWriteModalVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState({})

    useEffect(() => {
        setMessages([]);
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setPost(props.data);
            console.log(props.data);
        } else {
            setPost({});
        }
    }, [props.data])


    useEffect(() => {
        if (!editMode) {
            if (_.isPlainObject(post) && !_.isEmpty(post)) {
                setPinnedCommentIds(_.get(post, ['pinnedComments']) || [])
                getDataMessage(0, _.map(_.get(post, ['pinnedComments']) || [], '_id'));
            } else {
                setMessages([]);
                setPinnedCommentIds([]);
            }
        }

    }, [post])

    useEffect(() => {
        getPinnedDataMessage(_.map(pinnedCommentIds || [], '_id'))
    }, [pinnedCommentIds])

    function getDataMessage(skip, excludeIds) {

        if (_.isEmpty(post) === true) {
            return
        }

        let query = {
            chatId: post._id,
            $populate: 'userId',
            $limit: messagePageSize,
            $sort: { createdAt: -1 },
            $skip: messages.length
        }

        if (_.isArray(excludeIds) && !_.isEmpty(excludeIds)) {
            query._id = {
                $nin: excludeIds || [],
            }
        }

        client.service('chatmessages').find(
            {
                query: {
                    ...query,
                }
            }
        ).then((res) => {

            setMessages(_.isArray(res.data) && notEmptyLength(res.data) ? res.data : []);

        })
    }

    function getPinnedDataMessage(ids) {

        if (_.isEmpty(post) === true) {
            return
        }

        let query = {
            _id: {
                $in: ids || [],
            },
            chatId: post._id,
            $populate: 'userId',
            $sort: { createdAt: -1 },

        }

        client.service('chatmessages').find(
            {
                query: {
                    ...query,
                }
            }
        ).then((res) => {
            console.log('pinned comment');
            console.log(res);
            setPinnedComments(_.isArray(res.data) && notEmptyLength(res.data) ? res.data : []);

        })
    }



    function confirmDeleteMessage(v) {
        if (v._id) {
            client.service('chatmessages')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted')
                    handleRemoveComment(res);
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }

    }


    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted')
                    props.router.push('/social-board', undefined ,{ shallow : false })
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }
    }

    function handleCommentChange(comment) {
        let newData = _.map(messages, function (v) {
            return v._id == _.get(comment, ['_id']) ? comment : v;
        });

        setMessages(newData);
    }


    function handleRemoveComment(comment) {
        let newData = _.filter(messages, function (v) {
            return v._id != _.get(comment, ['_id']);
        });

        setMessages(newData);
    }

    function handlePinCommentChange(ids) {
        ids = _.isArray(ids) && !_.isEmpty(ids) ? ids : [];

        let removeIds = _.differenceBy(pinnedCommentIds || [], ids, '_id')
        let addIds = _.differenceBy(ids, pinnedCommentIds || [], '_id')

        let commentToAdd = [];
        _.forEach(removeIds, function (removeId) {
            let selectedComment = _.find(pinnedComments, function (pinnedComment) {
                return removeId._id == pinnedComment._id
            })
            if (selectedComment) {
                commentToAdd.push(selectedComment);
            }
        })

        let commentToRemove = [];
        _.forEach(addIds, function (addId) {
            let selectedComment = _.find(messages, function (item) {
                return addId._id == item._id
            })
            if (selectedComment) {
                commentToRemove.push(selectedComment);
            }
        })
        let newComments = messages;
        newComments = _.concat(newComments, commentToAdd);
        newComments = _.filter(newComments, function (newComment) {
            return !_.some(commentToRemove, ['_id', newComment._id])
        })
        newComments = sortByDateDesc(newComments, 'createdAt');
        setMessages(newComments);
        setPinnedCommentIds(ids);
    }

    return (
        <React.Fragment>

            <div className={`padding-md background-transparent ${props.className ? props.className : ''}`} style={{ ...props.style }}>
                <Row gutter={[10, 15]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="font-weight-black subtitle1 black">
                            Discussions
                        </div>
                    </Col>

                    <Col xs={20} sm={20} md={20} lg={20} xl={20}>
                        <div>
                            <ParseTag data={_.get(post, ['title']) || ''} expandable className="h6 black width-100" />
                        </div>
                        <div>
                            <ParseTag data={_.get(post, ['content']) || ''} expandable className="headline width-100" />
                        </div>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div className="flex-justify-end">
                            <span className='d-inline-block'>
                                <PostMenu post={post}
                                    onEditPostClick={() => {
                                        setEditMode('edit');
                                        setWriteModalVisible(true);
                                        setSelectedPost(post);
                                    }}
                                    onRemovePostClick={() => {
                                        confirmDelete(post)
                                    }}
                                >
                                    <Icon type="more" className="black" style={{ fontSize: 30 }} />
                                </PostMenu>
                            </span>


                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                        <div className="flex-justify-start flex-items-align-center subtitle1 text-truncate ">
                            <UserAvatar redirectProfile data={_.get(post, ['userId'])} size={30} className="margin-right-sm" />
                            <span className="black" >
                                {`${getUserName(_.get(post, ['userId']), 'freakId')}`}
                            </span>
                            {
                                _.get(post, ['location']) ?
                                    <React.Fragment>
                                        <span className="grey-darken-3">
                                            in
                                        </span>
                                        <span className="black">
                                            {`${_.get(post, ['location']) || ''}`}
                                        </span>
                                    </React.Fragment>
                                    :
                                    null
                            }
                        </div>
                        <div className="flex-justify-space-between flex-items-align-center text-truncate margin-top-sm">
                            <span className='d-inline-block caption grey-darken-3' >
                                {moment(_.get(post, ['createdAt']) || null).format('MMM Do')} | {moment(_.get(post, ['createdAt']) || null).fromNow()}
                            </span>
                            <span className='d-inline-block' >
                                <Button onClick={() => { setCommentModalVisible(true); setCommentEditMode(''); setSelectedComment({}) }}>
                                    <div className="flex-justify-center flex-items-align-center headline font-weight-bold">
                                        <img src={writePostIcon} style={{ width: 20, height: 20 }} className="margin-right-sm" />
                                            Advise This Freak
                                    </div>
                                </Button>
                            </span>
                        </div>
                    </Col>


                    {
                        notEmptyLength(pinnedComments) ?
                            _.map(pinnedComments, function (v, index) {
                                return (
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} key={`social-board-comment-${index}`}>
                                        <CommentBox
                                            data={v}
                                            pinnedComments={pinnedComments}
                                            pinnable={getObjectId(_.get(post, ['userId'])) && _.get(props.user, ['info', 'user', '_id']) == getObjectId(_.get(post, ['userId']))}
                                            theme="pin"
                                            onEditClick={(data) => {
                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                    setSelectedComment(data);
                                                    setCommentEditMode('edit');
                                                    setCommentModalVisible(true);
                                                }
                                            }}
                                            onRemoveClick={(data) => {
                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                    confirmDeleteMessage(data);
                                                }
                                            }}
                                            onUpdatePinComments={(data) => {
                                                handlePinCommentChange(data);
                                            }}
                                        />
                                    </Col>
                                )
                            })
                            :
                            null

                    }
                    {
                        notEmptyLength(messages) ?
                            _.map(messages, function (v, index) {
                                return (
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} key={`social-board-comment-${index}`}>
                                        <CommentBox
                                            data={v}
                                            pinnedComments={pinnedComments}
                                            pinnable={arrayLengthCount(pinnedCommentIds) < 3 && getObjectId(_.get(post, ['userId'])) && _.get(props.user, ['info', 'user', '_id']) == getObjectId(_.get(post, ['userId']))}
                                            onEditClick={(data) => {
                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                    setSelectedComment(data);
                                                    setCommentEditMode('edit');
                                                    setCommentModalVisible(true);
                                                }
                                            }}
                                            onRemoveClick={(data) => {
                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                    confirmDeleteMessage(data);
                                                }
                                            }}
                                            onUpdatePinComments={(data) => {
                                                handlePinCommentChange(data);
                                            }}
                                        />
                                    </Col>
                                )
                            })
                            :
                            notEmptyLength(pinnedComments) ?
                                null
                                :
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div className="width-100 padding-md background-white">
                                        <Empty description="No comment yet..." />
                                    </div>
                                </Col>

                    }

                </Row>
            </div>

            <CommentModal
                visible={commentModalVisible}
                onChangeVisible={(v) => {
                    setCommentModalVisible(v);
                    if (!v) {
                        setSelectedComment({});
                        setEditMode('');
                    }
                }}
                data={selectedComment}
                editMode={commentEditMode}
                post={post}
                onCreate={(data) => {
                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                        setMessages([data].concat(messages));
                    }
                }}
                onUpdate={(data) => {
                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                        handleCommentChange(data);
                    }
                }}
            />

            <WritePostModal
                currentRecord={selectedPost}
                editMode={editMode}
                hideImage
                chatType={'socialboard'}
                visibleMode={writeModalVisible}
                onUpdatePost={(data) => {
                    setPost(data)
                    setEditMode()
                    setSelectedPost()
                }}
                changeVisibleMode={(v) => {
                    setWriteModalVisible(v);
                    if (!v) {
                        setSelectedPost({});
                    }
                }} />
        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialBoardDetailsBox)));