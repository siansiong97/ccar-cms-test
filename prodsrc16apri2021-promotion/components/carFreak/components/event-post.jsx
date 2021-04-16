import { Col, Collapse, Dropdown, Form, Icon, Input, Menu, message, Popconfirm, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import client from '../../../feathers';
import { calendarIcon, carFreakLikeGreyIcon, carFreakLikeIcon } from '../../../icon';
import { chatRestrictTime } from '../config';
import ClubAvatar from './club/club-avatar';
import EventDetailsBox from './club/event-details-box';
import CommentBox1 from './comment-box-1';
import LikePostButton from './like-post-button';
import WriteEventModal from './write-event-modal';
import UserAvatar from '../../general/UserAvatar';
import { loading, loginMode } from '../../../redux/actions/app-actions';
import { formatNumber, getObjectId, getPlural, getUserName, notEmptyLength, objectRemoveEmptyValue } from '../../../common-function';
import EmojiPickerButton from '../../general/EmojiPickerButton';



const defaultHeight = 'auto';
const headerHeight = 100;
const imageHeight = 200;
const titleHeight = 40;
const footerHeight = 100;
const actionHeight = 40;

let uid = v4();

const PAGE_SIZE = 6;
const commentInputRef = React.createRef();

const EventPost = (props) => {

    const [post, setPost] = useState({});
    const [postLike, setPostlike] = useState({});
    const [height, setHeight] = useState(defaultHeight);
    const [totalLike, setTotalLike] = useState(0);
    const [expandReplyKey, setExpandReplyKey] = useState();
    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])
    const [canSendMessage, setCanSendMessage] = useState(true);
    const [messageTotal, setMessageTotal] = useState(0);
    const [loading, setIsLoading] = useState(false);


    const [writeEventVisible, setWriteEventVisible] = useState(false);
    const [eventEditMode, setEventEditMode] = useState(false);


    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            if (_.isEqualWith(props.data, post, '_id')) {
                setTotalLike(_.get(post, ['totalLike']) || 0)
                getData();
            } else {
                setPost(props.data);
            }
        } else {
            setPost({});
        }

    }, [props.data])



    useEffect(() => {
        if (_.isPlainObject(post) && !_.isEmpty(post)) {
            setTotalLike(_.get(post, ['totalLike']) || 0)
            getData();
        } else {
            setTotalLike(0);
            setMessages([]);
        }

    }, [post])


    function getData() {

        if (_.get(post, ['_id'])) {
            client.authenticate()
                .then((res) => {
                    setIsLoading(true);

                    client.service('chatmessages').find(
                        {
                            query: {
                                chatId: post._id,
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

        if (!_.get(props.user, ['authenticated']) && !_.get(props.user, ['info', 'user', '_id'])) {
            message.error('Please Login First!');
            props.loginMode(true);
            return;
        }
        if (_.get(post, ['_id']) && text) {
            if (canSendMessage) {
                client.authenticate()
                    .then((res) => {
                        client.service('chatmessages')
                            .create({
                                chatId: post._id,
                                userId: res.user._id,
                                message: text,
                            })
                            .then((res1) => {
                                setText('');
                                setCanSendMessage(false);
                                res1.userId = res.user;
                                setMessages(messages.concat([res1]));
                                setMessageTotal(messageTotal + 1);
                                setTimeout(() => {
                                    setCanSendMessage(true);
                                }, chatRestrictTime);

                            }).catch((err) => {
                                console.log('Unable to send messages.')
                            })

                    })
                    .catch((err) => {
                        return message.error("Please Login.")
                    })
            } else {
                message.warning('You are typing too fast...')
            }
        }

    };

    function handleCommentChange(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            let newMessages = _.map(messages, function (v) {
                return _.get(v, ['_id']) == _.get(data, ['_id']) ? data : v;
            });

            setMessages(newMessages);
        }
    }


    function handleRemoveComment(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            let newMessages = _.filter(messages, function (v) {
                return _.get(v, ['_id']) != _.get(data, ['_id']);
            });

            setMessages(newMessages);
        }
    }


    //Event should not be removed after enable event details page
    function confirmDelete(v) {
        if (v._id) {
            if (_.get(v, ['chatType']) == 'event') {
                confirmDeleteEvent(v);
            }
            client.service('chats')
                .remove(v._id).then((res) => {
                    if (props.notify) {
                        message.success('Record Deleted')
                    }

                    if (props.onRemove) {
                        props.onRemove(v);
                    }
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }

    }

    function confirmDeleteEvent(v) {
        if (v._id && _.get(v, ['eventId', '_id'])) {
            client.service('events')
                .remove(_.get(v, ['eventId', '_id'])).then((res) => {

                }).catch((err) => {
                    console.log('Unable to delete Event.');
                })
        }

    }

    return (
        notEmptyLength(objectRemoveEmptyValue(post)) ?
            <React.Fragment>
                <Row className="thin-border round-border padding-md" gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="flex-justify-space-between flex-items-align-start">
                            <span className='flex-justify-start flex-items-align-center ' >
                                <span className='d-inline-block margin-right-md relative-wrapper flex-items-no-shrink' >
                                    {
                                        _.get(post, ['parentType']) == 'club' || _.get(post, ['parentType']) == 'clubEvent' ?
                                            <ClubAvatar redirectProfile
                                                data={_.get(post, ['clubId'])}
                                                size={50}
                                                avatarClassName="cursor-pointer" />
                                            :
                                            <UserAvatar redirectProfile
                                                data={_.get(post, ['userId'])}
                                                size={50}
                                                avatarClassName="cursor-pointer"
                                            />
                                    }
                                    {
                                        _.get(post, ['chatType']) == 'event' ?
                                            <span className='d-inline-block ' style={{ position: 'absolute', top: 30, right: -5 }} >
                                                <img src={calendarIcon} style={{ height: 25, width: 25 }} />
                                            </span>
                                            :
                                            null
                                    }
                                </span>
                                <span className='d-inline-block ' >
                                    <div>
                                        <span className="font-weight-bold subtitle1 text-overflow-break d-inline-block" >
                                            {
                                                _.get(post, ['parentType']) == 'club' || _.get(post, ['parentType']) == 'clubEvent' ?
                                                    _.get(post, ['clubId', 'clubName']) || ''
                                                    :
                                                    getUserName(_.get(post, ['userId']), 'freakId')
                                            }
                                        </span>
                                        {
                                            _.get(post, ['location']) ?
                                                <React.Fragment>
                                                    <span className="margin-x-sm" >
                                                        in
                                                </span>
                                                    <span className='d-inline-block font-weight-bold subtitle1' >
                                                        {_.get(post, ['location'])}
                                                    </span>
                                                </React.Fragment>
                                                :
                                                null
                                        }
                                    </div>
                                    <div className="headline grey-darken-2">
                                        {moment(_.get(post, ['createdAt'])).format('MMMM DD')} | {moment(_.get(post, ['createdAt'])).fromNow()}
                                    </div>
                                </span>
                            </span>
                            <span className='d-inline-block' style={{ width: 30 }} >
                                {
                                    _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(post, ['userId', '_id']) ?
                                        <span className='d-inline-block' id={`post-menu-${uid}`} >
                                            <Dropdown getPopupContainer={() => document.getElementById(`post-menu-${uid}`)}
                                                overlay={
                                                    <Menu>
                                                        {
                                                            _.get(post, ['eventId', 'status']) == 'expired' ?
                                                                null
                                                                :
                                                                <Menu.Item onClick={(e) => {
                                                                    if (props.onEditClick && props.manualControl) {
                                                                        props.onEditClick(post)
                                                                    } else {
                                                                        setWriteEventVisible(true);
                                                                        setEventEditMode(true);
                                                                    }
                                                                }}><span >Edit</span></Menu.Item>
                                                        }
                                                        <Menu.Item>
                                                            <Popconfirm
                                                                title="Are you sure to delete this post?"
                                                                onConfirm={(e) => {
                                                                    if (props.onRemoveClick && props.manualControl) {
                                                                        props.onRemoveClick(post);
                                                                    } else {
                                                                        confirmDelete(post);
                                                                    }
                                                                }}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <span>Delete</span>
                                                            </Popconfirm>
                                                        </Menu.Item>
                                                    </Menu>
                                                }>
                                                <Icon type="more" className="black" style={{ fontSize: 20 }} />
                                            </Dropdown>
                                        </span>
                                        :
                                        null
                                }
                            </span>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <EventDetailsBox data={_.get(post, ['eventId'])} hideAction hideDescription={props.hideDescription === true ? true : false} hideGuestList={props.hideGuestList === true ? true : false} />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="fill-parent flex-justify-start flex-items-align-center cursor-pointer">
                            <LikePostButton
                                postLike={props.postLike}
                                chatId={_.get(post, ['_id'])}
                                likeOn="chat"
                                onClick={(actived) => {
                                    setTotalLike(actived ? parseInt(totalLike) + 1 : parseInt(totalLike) - 1);
                                }}
                                onSuccessUpdate={(liked, data) => {
                                    if (props.onPostLikeChange) {
                                        props.onPostLikeChange(liked, data);
                                    }
                                    if (props.onUpdatePost) {
                                        props.onUpdatePost({ ...post, totalLike: liked ? parseInt(post.totalLike) + 1 : parseInt(post.totalLike) - 1 });
                                    }
                                }}
                                activeButton={
                                    <div className="flex-items-align-center">
                                        <img src={carFreakLikeIcon} style={{ width: 30, height: 20 }} className="margin-right-sm cursor-pointer" />
                                        {getPlural('Like', 'Likes', totalLike, true)}
                                    </div>
                                }
                                className='d-inline-block margin-right-md'>
                                <div className="flex-items-align-center">
                                    <img src={carFreakLikeGreyIcon} style={{ width: 30, height: 20 }} className="margin-right-sm cursor-pointer" />
                                    {getPlural('Like', 'Likes', totalLike, true)}
                                </div>
                            </LikePostButton>
                            <span className='flex-items-align-center cursor-pointer' onClick={(e) => {
                                setExpandReplyKey(expandReplyKey ? null : '1')
                            }}  >
                                <span className='margin-right-sm' >
                                    {formatNumber(messageTotal, 'auto', true, 0, true)}
                                </span>
                                <span className='headline' >
                                    {getPlural('Reply', 'Replies', messageTotal, false)}
                                </span>
                            </span>
                        </div>
                        <div className="width-100 margin-top-md">
                            <Collapse className="collapse-no-header border-none collapse-body-no-padding collapse-body-overflow-visible" activeKey={expandReplyKey} >
                                <Collapse.Panel key="1" showArrow={false}>
                                    <div className="width-100">
                                        <div className="padding-left-xl margin-y-sm">
                                            {
                                                _.map(messages, function (v) {
                                                    return (
                                                        <div>
                                                            <CommentBox1 data={v}
                                                                onChange={(data) => {
                                                                    handleCommentChange(data);
                                                                }}
                                                                onRemove={(data) => {
                                                                    handleRemoveComment(data);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="no-border-input thin-border round-border-big background-white padding-sm margin-top-xs" id="post-post-input">
                                        <Input
                                            placeholder="What's on your mind?"
                                            maxLength={1000}
                                            ref={commentInputRef}
                                            size="small"
                                            onPressEnter={(e) => {
                                                handleSubmit(text);
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
                                                        let originalMsg = text || ''
                                                        originalMsg = text + emoji.native
                                                        setText(originalMsg)
                                                    }}
                                                    position={{ bottom: 0, right: 33 }}
                                                >
                                                    <Icon type="smile" className='cursor-pointer grey margin-right-sm margin-top-xs' style={{ fontSize: '17px' }} />
                                                </EmojiPickerButton>
                                            } />
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    </Col>
                </Row>

                {
                    !props.manualControl ?

                        <WriteEventModal
                            visible={writeEventVisible}
                            editMode={eventEditMode}
                            data={_.get(post, ['eventId']) || {}}
                            onCancel={() => {
                                setEventEditMode(false);
                                setWriteEventVisible(false);
                            }}
                            type="club"
                            clubId={getObjectId(_.get(post, ['eventId', 'clubId']))}
                            creator={_.get(post, ['eventId', 'clubId'])}
                            notify
                            onUpdate={(event) => {
                                if (_.isPlainObject(event) && !_.isEmpty(event)) {
                                    let newData = _.cloneDeep(post);
                                    newData.eventId = {
                                        ...event,
                                        clubId: _.get(newData, ['eventId', 'clubId']),
                                    }
                                    if (props.onUpdate) {
                                        props.onUpdate(newData);
                                    }
                                }
                            }}
                        ></WriteEventModal>
                        :
                        null
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EventPost)));