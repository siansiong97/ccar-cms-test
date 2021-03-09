import { Collapse, Dropdown, Form, Icon, Menu, message, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import client from '../../../feathers';
import { chatRestrictTime, getTagString } from '../config';
import LikePostButton from './like-post-button';
import ReplyBox1 from './reply-box-1';
import SocialInput from './social-input';
import { loading, loginMode } from '../../../redux/actions/app-actions';
import { getObjectId, getPlural, getUserName, notEmptyLength, objectRemoveEmptyValue } from '../../../common-function';
import UserAvatar from '../../general/UserAvatar';
import ParseTag from '../../general/ParseTag';



const defaultHeight = 'auto';
const headerHeight = 100;
const imageHeight = 200;
const titleHeight = 40;
const footerHeight = 100;
const actionHeight = 40;

let uid = v4();

const PAGE_SIZE = 6;
const commentInputRef = React.createRef();

const CommentBox1 = (props) => {

    const [comment, setComment] = useState({});
    const [height, setHeight] = useState(defaultHeight);
    const [editMode, setEditMode] = useState(false);
    const [totalLike, setTotalLike] = useState(0);
    const [expandReplyKey, setExpandReplyKey] = useState();
    const [text, setText] = useState('')
    const [textEditMode, setTextEditMode] = useState(false);
    const [messages, setMessages] = useState([])
    const [canSendMessage, setCanSendMessage] = useState(true);
    const [messageTotal, setMessageTotal] = useState(0);
    const [loading, setIsLoading] = useState(false);



    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setComment(props.data);
        } else {
            setComment({});
        }

    }, [props.data])



    useEffect(() => {
        if (_.isPlainObject(comment) && !_.isEmpty(comment)) {
            setTotalLike(_.get(comment, ['totalLike']) || 0)
            getData();
        } else {
            setTotalLike(0);
            setMessages([]);
        }

    }, [comment])

    // useEffect(() => {
    //     if (!props.style || !isValidNumber(props.style.height) || !(parseFloat(props.style.height) >= defaultHeight)) {
    //         setHeight(defaultHeight);
    //     } else {
    //         setHeight(props.style.height);
    //     }

    // }, [props.style])

    function getData() {

        if (_.get(comment, ['_id'])) {
            client.authenticate()
                .then((res) => {
                    setIsLoading(true);

                    client.service('chatmessagereplies').find(
                        {
                            query: {
                                messageId: comment._id,
                                $populate: 'userId',
                                $limit: PAGE_SIZE,
                                $sort: { _id: -1 },
                                $skip: messages.length
                            }
                        }
                    ).then((res) => {

                        setIsLoading(false);
                        if (res.data.length > 0) {
                            let newMessages = messages.concat(res.data)
                            setMessages(newMessages)
                        }
                        else {
                            setMessages([])
                        }
                        setMessageTotal(res.total)

                    }).catch(err => {
                        setIsLoading(false);
                    });

                })
        }
    }

    function handleSubmit(text) {

        setEditMode(false)
        if (props.onChange) {
            props.onChange({ ...comment, message: text })
        }

        if (_.isPlainObject(comment) && !_.isEmpty(comment) && _.get(comment, ['_id']) && editMode) {
            client.authenticate().then(res => {
                client.service('chatmessages')
                    .patch(comment._id, {
                        message: text,
                    })
                    .then((res1) => {
                        if (props.onUpdate) {
                            res1.userId = res.user;
                            props.onUpdate(res1);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error("Unable to edit comment. T.T")

                    })
            }).catch(err => {
                message.error("Unable to edit comment. T.T")
            });
        }
    }

    function handleRemove(data) {

        if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['_id'])) {
            client.service('chatmessages')
                .remove(data._id).then((res) => {
                    message.success('Comment Deleted')
                    if (props.onRemove) {
                        props.onRemove(res);
                    }
                }).catch((err) => {
                    console.log('Unable to delete comment.');
                })
        }
    }

    function handleReplySubmit(text) {

        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
            message.error('Please Login First!');
            props.loginMode(true);
            return;
        }

        if (!_.get(comment, ['_id'])) {
            message.error('Comment Not Found!');
            return;
        }

        if (canSendMessage) {
            client.authenticate().then(res => {
                client.service('chatmessagereplies').create({
                    messageId: comment._id,
                    userId: res.user._id,
                    message: text,
                }).then(res1 => {
                    setText('');
                    setCanSendMessage(false);
                    res1.userId = res.user;
                    setMessages(messages.concat([res1]));
                    setMessageTotal(messageTotal + 1);
                    setTimeout(() => {
                        setCanSendMessage(true);
                    }, chatRestrictTime);

                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
        } else {
            message.warning('You are typing too fast!');
        }

    };

    function handleReplyChange(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            let newMessages = _.map(messages, function (v) {
                return _.get(v, ['_id']) == _.get(data, ['_id']) ? data : v;
            });

            setMessages(newMessages);
        }
    }

    function handleReplyRemove(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            let newMessages = _.filter(messages, function (v) {
                return _.get(v, ['_id']) != _.get(data, ['_id']);
            });

            setMessages(newMessages);
        }
    }

    function addAlias(value, id) {

        if (value && id) {
            setTextEditMode(true);
            setText(getTagString(value, id) + ' ');

            setTimeout(() => {
                setTextEditMode(false);
                setText('');
            }, 200);

        }
    }

    return (
        notEmptyLength(objectRemoveEmptyValue(comment)) ?
            <React.Fragment>
                <div className={`flex-justify-space-between flex-items-align-start ${props.className ? props.className : ''}`} style={{ ...props.style }}>
                    <span className='d-inline-block' style={{ width: 50 }} >
                        <UserAvatar redirectProfile data={_.get(comment, ['userId'])} size={30} />
                    </span>
                    <span className='d-inline-block headline width-80' >
                        <span className='headline font-weight-black padding-right-sm black' >
                            {getUserName(_.get(comment, ['userId']), 'freakId')}
                        </span>
                        {
                            editMode ?
                                <SocialInput
                                    placeholder="What's on your mind?"
                                    editMode
                                    clickOutsideSubmit
                                    excludeEnter
                                    text={`${_.get(comment, ['message']) || ''}`}
                                    emojiPosition={{ right: 33, bottom: 0 }}
                                    onSubmit={(text) => {
                                        handleSubmit(text);
                                        setEditMode(false);
                                    }}
                                />
                                :
                                <ParseTag data={_.get(comment, ['message']) || ''} className="width-100 text-overflow-break" />
                        }
                        <div className="width-100 flex-justify-start flex-items-align-center" style={{ padding: 0 }}>
                            <span className="small-text margin-right-md grey font-weight-light" >{getPlural('Like', 'Likes', totalLike, true)}</span>
                            <span className="small-text margin-right-md grey font-weight-light  cursor-pointer" onClick={() => { setExpandReplyKey(expandReplyKey ? null : '1') }} >{getPlural('Reply', 'Replies', messageTotal, true)}</span>
                        </div>

                        <div className="width-100" style={{ padding: 0 }}>
                            <span className="margin-right-sm small-text">{moment(comment.createdAt).fromNow()}</span>
                            <LikePostButton className="margin-right-sm" likeOn="message"
                                autoHandle
                                messageId={_.get(comment, ['_id'])} onClick={(actived) => {
                                    setTotalLike(actived ? totalLike + 1 : totalLike - 1)
                                }}

                                activeButton={
                                    <span className="small-text blue font-weight-light cursor-pointer">Liked</span>
                                }
                            >
                                <span className="small-text grey font-weight-light cursor-pointer">Like</span>
                            </LikePostButton>
                            <span className="small-text margin-right-sm grey font-weight-light cursor-pointer" onClick={() => {
                                setExpandReplyKey('1');
                                addAlias(getUserName(_.get(comment, ['userId']), 'freakId') || '', getObjectId(_.get(comment, ['userId'])) || '')
                            }}>Reply</span>
                        </div>
                        <div className="width-100">
                            <Collapse className="collapse-no-header border-none collapse-body-no-padding collapse-body-overflow-visible" activeKey={expandReplyKey} >
                                <Collapse.Panel key="1" showArrow={false}>
                                    <div className="width-100">
                                        <div className="padding-left-xl margin-y-sm">
                                            {
                                                _.map(messages, function (v) {
                                                    return (
                                                        <div>
                                                            <ReplyBox1 data={v}
                                                                onChange={(data) => {
                                                                    handleReplyChange(data);
                                                                }}
                                                                onRemove={(data) => {
                                                                    handleReplyRemove(data);
                                                                }}
                                                                handleReply={(name, id) => {
                                                                    if (name && id) {
                                                                        setExpandReplyKey('1');
                                                                        addAlias(name || '', getObjectId(id) || '')
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div>

                                        <SocialInput
                                            placeholder="What's on your mind?"
                                            editMode={textEditMode}
                                            text={text || ''}
                                            inputRef={commentInputRef}
                                            excludeEnter
                                            emojiPosition={{ bottom: 0, right: 33 }}
                                            onChange={(text, finalText) => {
                                                if (!text) {
                                                    setText('');
                                                }
                                            }}
                                            onSubmit={(text) => {
                                                handleReplySubmit(text);
                                            }}
                                        />
                                        {/* <Input
                                            placeholder="What's on your mind?"
                                            maxLength={1000}
                                            ref={commentInputRef}
                                            size="small"
                                            onPressEnter={(e) => {
                                                handleReplySubmit();
                                            }}
                                            autoFocus={true}
                                            value={text}
                                            onChange={(e) => {
                                                setText(e.target.value)
                                            }}
                                            suffix={
                                                <EmojiPickerButton
                                                    className="emoji-mart-small"
                                                    onSelect={(emoji) => {
                                                        let originalMsg = message || ''
                                                        originalMsg = message + emoji.native
                                                        setText(originalMsg)
                                                    }}
                                                    position={{ bottom: 0, right: 33 }}
                                                >
                                                    <Icon type="smile" className='cursor-pointer grey margin-right-sm margin-top-xs' style={{ fontSize: '17px' }} />
                                                </EmojiPickerButton>
                                            } /> */}
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    </span>
                    <span className='d-inline-block' style={{ width: 30 }} >
                        {
                            _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(comment, ['userId', '_id']) ?
                                <span className='d-inline-block' id={`comment-menu-${uid}`} >
                                    <Dropdown getPopupContainer={() => document.getElementById(`comment-menu-${uid}`)}
                                        overlay={
                                            <Menu>
                                                <Menu.Item onClick={(e) => {
                                                    setEditMode(true)
                                                }}><span >Edit</span></Menu.Item>
                                                <Menu.Item>
                                                    <Popconfirm
                                                        title="Are you sure to delete this comment?"
                                                        onConfirm={(e) => {
                                                            handleRemove(comment);
                                                        }}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <span>Delete</span>
                                                    </Popconfirm>
                                                </Menu.Item>
                                            </Menu>
                                        }>
                                        <Icon type="more" className="commentMore" style={{ fontSize: 20 }} />
                                    </Dropdown>
                                </span>
                                :
                                null
                        }
                    </span>
                </div>
            </React.Fragment >
            :
            null
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    loginMode
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CommentBox1)));