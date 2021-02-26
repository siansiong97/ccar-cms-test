import Carousel from '@brainhubeu/react-carousel';
import { Dropdown, Empty, Form, Icon, Menu, Popconfirm, Row, Col, Button, Collapse, Input, message as AntMessage, Divider } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue, formatNumber, getUserName, getObjectId, getPlural } from '../../profile/common-function';
import UserAvatar from './user-avatar';
import LikePostButton from './like-post-button';
import { loading, loginMode } from '../../../actions/app-actions';
import moment from 'moment';
import { writePostIcon, pinIcon } from '../../../icon';
import ShowMoreText from 'react-show-more-text';
import Scrollbars from 'react-custom-scrollbars';
import LightBoxGallery from '../../commonComponent/light-box-gallery';
import CommentBox1 from './comment-box-1';
import EmojiPickerButton from '../../commonComponent/emoji-picker-button';
import ScrollLoadWrapper from '../../commonComponent/scroll-load-wrapper';
import { chatRestrictTime, getTagString } from '../config';
import client from '../../../feathers';
import ReplyBox from './reply-box';
import ParseTag from '../../commonComponent/parse-tag';
import SocialInput from './social-input';
import PinCommentButton from './pin-comment-button';

const defaultHeight = 'auto';
const headerHeight = 100;
const imageHeight = 200;
const titleHeight = 40;
const footerHeight = 100;
const actionHeight = 40;

const commentInputRef = React.createRef();
const PAGE_SIZE = 6;

const CommentBox = (props) => {

    const [comment, setComment] = useState({});
    const [pinnedComments, setPinnedComments] = useState([]);
    const [height, setHeight] = useState(defaultHeight);
    const [totalLike, setTotalLike] = useState(0);
    const [expandReplyKey, setExpandReplyKey] = useState();
    const [text, setText] = useState('')
    const [textEditMode, setTextEditMode] = useState(false);
    const [messages, setMessages] = useState([])
    const [canSendMessage, setCanSendMessage] = useState(true);
    const [messageTotal, setMessageTotal] = useState(0);
    const [loading, setIsLoading] = useState(false);
    const [commentMenu, setCommentMenu] = useState([]);


    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setComment(props.data);
        } else {
            setComment({});
        }

    }, [props.data])

    useEffect(() => {

        if (_.isArray(props.pinnedComments) && !_.isEmpty(props.pinnedComments)) {
            setPinnedComments(props.pinnedComments);
        } else {
            setPinnedComments({});
        }

    }, [props.pinnedComments])

    useEffect(() => {
        if (_.isPlainObject(comment) && !_.isEmpty(comment)) {
            setTotalLike(_.get(comment, ['totalLike']) || 0)
            getData();
        } else {
            setTotalLike(0);
            setMessages([]);
        }

    }, [comment])


    useEffect(() => {

        let newMenu = [];
        if (props.pinnable) {
            newMenu = _.concat(newMenu, [
                <Menu.Item>
                    <PinCommentButton
                        comment={comment}
                        pinnedComments={pinnedComments}
                        pinButton={() => {
                            return (
                                <span >Pin Comment</span>
                            )
                        }}
                        unpinButton={() => {
                            return (
                                <span >Unpin Comment</span>
                            )
                        }}
                        onUpdatePinComments={(data) => {
                            if (props.onUpdatePinComments) {
                                props.onUpdatePinComments(data);
                            }
                        }} />
                </Menu.Item>
            ])
        }

        if (props.user.authenticated && _.get(props.user, ['info', 'user', '_id']) == _.get(comment, ['userId', '_id'])) {
            newMenu = _.concat(newMenu, [
                <Menu.Item onClick={(e) => {
                    if (props.onEditClick) {
                        props.onEditClick(comment)
                    }
                }}><span >Edit</span>
                </Menu.Item>,
                <Menu.Item>
                    <Popconfirm
                        title="Are you sure to delete this comment?"
                        onConfirm={(e) => {
                            if (props.onRemoveClick) {
                                props.onRemoveClick(comment);
                            }
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <span>Delete</span>
                    </Popconfirm>
                </Menu.Item>
            ])
        }

        setCommentMenu(newMenu)

    }, [props.user.authenticated, props.pinnable, comment])

    // useEffect(() => {
    //     if (!props.style || !isValidNumber(props.style.height) || !(parseFloat(props.style.height) >= defaultHeight)) {
    //         setHeight(defaultHeight);
    //     } else {
    //         setHeight(props.style.height);
    //     }

    // }, [props.style])

    useEffect(() => {
        if (expandReplyKey && commentInputRef.current) {
            // commentInputRef.current.focus();
        }

    }, [expandReplyKey])


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

        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
            AntMessage.error('Please Login First!');
            props.loginMode(true);
            return;
        }

        if (!_.get(comment, ['_id'])) {
            AntMessage.error('Comment Not Found!');
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
            AntMessage.warning('You are typing too fast!');
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
                <div className={`${props.theme == 'pin' ? 'background-yellow-lighten-4' : ' thin-border background-white '} relative-wrapper round-border flex-items-align-start flex-justify-start  box-shadow-heavy padding-md `} style={props.theme == 'pin' ? { border: '3px solid #FFCC32' } : { ...props.style }}>
                    {
                        props.theme == 'pin' ?
                            <img src={pinIcon} style={{ position: 'absolute', right: -15, top: -10, width: 35, height: 35 }} />
                            :
                            null
                    }
                    <Row className="width-100" gutter={[10, 20]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-items-align-center flex-justify-start ">
                                <UserAvatar redirectProfile data={_.get(comment, ['userId'])} size={50} className="margin-right-md" />
                                <span className='d-inline-block width-90' >
                                    <div className="flex-justify-start flex-items-align-center subtitle1 text-truncate ">
                                        <span className="black" >
                                            {getUserName(_.get(comment, ['userId']), 'freakId')}
                                        </span>
                                        {
                                            _.get(comment, ['location']) ?
                                                <React.Fragment>
                                                    <span className="grey-darken-3">
                                                        in
                                                    </span>
                                                    <span className="black">
                                                        {`${_.get(comment, ['location']) || ''}`}
                                                    </span>
                                                </React.Fragment>
                                                :
                                                null
                                        }
                                    </div>
                                    <div className="flex-justify-space-between flex-items-align-center text-truncate width-100">
                                        <span className='d-inline-block caption grey-darken-3' >
                                            {moment(_.get(comment, ['createdAt']) || null).format('MMM Do')} | {moment(_.get(comment, ['createdAt']) || null).fromNow()}
                                        </span>
                                    </div>
                                </span>
                            </div>
                        </Col>
                        {
                            _.isArray(_.get(comment, ['mediaList'])) && !_.isEmpty(_.get(comment, ['mediaList'])) ?
                                <LightBoxGallery images={_.compact(_.map(comment.mediaList, function (v) {
                                    return _.get(v, ['url']) || null;
                                }))}>
                                    {
                                        (state, setCurrentIndex, setVisible) => {
                                            return (
                                                <Scrollbars style={{ width: '100%', height: '120px' }}>
                                                    <div className="flex-justify-start flex-items-align-center fill-parent">
                                                        {
                                                            _.map(state.images, function (v, index) {
                                                                return <span className='d-inline-block margin-right-md cursor-pointer' onClick={(e) => { setCurrentIndex(index); setVisible(true) }} >
                                                                    <img src={v} style={{ width: 100, height: 100 }} />
                                                                </span>
                                                            })
                                                        }
                                                    </div>
                                                </Scrollbars>
                                            )
                                        }
                                    }
                                </LightBoxGallery>
                                :
                                null

                        }
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <ParseTag data={_.get(comment, ['message']) || ''} className="black headline width-100" expandable lines={3} />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-justify-space-between flex-items-align-center">
                                <span className='flex-justify-start flex-items-align-center' >
                                    <LikePostButton className="margin-right-md"
                                        text={(actived) => `${formatNumber(totalLike, 'auto', true, 0, true) || 0}`}
                                        messageId={_.get(comment, ['_id'])} likeOn='message'
                                        onClick={(actived) => {
                                            setTotalLike(actived ? totalLike + 1 : totalLike - 1)
                                        }} />
                                    <span className="cursor-pointer" onClick={() => { setExpandReplyKey(expandReplyKey ? null : '1') }}>
                                        {getPlural('Reply', 'Replies', messageTotal, true)}
                                    </span>
                                </span>
                                <span className='d-inline-block' >
                                    <Button onClick={() => {
                                        setExpandReplyKey('1');
                                        addAlias(getUserName(_.get(comment, ['userId']), 'freakId') || '', getObjectId(_.get(comment, ['userId'])) || '')
                                    }}><MessageOutlined /> Reply</Button>
                                </span>
                            </div>
                            <Collapse className="collapse-no-header border-none collapse-body-no-padding collapse-body-overflow-visible" activeKey={expandReplyKey} >
                                <Collapse.Panel key="1" showArrow={false}>
                                    <div className="width-100 margin-top-md border-top-grey-lighten-3" style={{ borderTop: 'solid 1px', borderTopColor: '#E0E0E0' }}>
                                        <div className="padding-left-xl" style={{ overflowY: 'visible' }}>
                                            {
                                                _.map(messages, function (v) {
                                                    return (
                                                        <div>
                                                            <ReplyBox data={v}
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
                                                            <Divider style={{ margin: 0, padding: 0 }} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="padding-top-md">
                                        <SocialInput
                                            placeholder="What's on your mind?"
                                            inputRef={commentInputRef}
                                            editMode={textEditMode}
                                            text={text || ''}
                                            excludeEnter
                                            onSubmit={(text) => {
                                                handleSubmit(text);
                                            }}
                                        />
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </Col>


                    </Row>

                    {
                        _.isArray(commentMenu) && !_.isEmpty(commentMenu) ?
                            <span className='d-inline-block' style={{ position: 'absolute', top: 30, right: 20 }} >
                                <Dropdown overlay={
                                    <Menu>
                                        {commentMenu}
                                    </Menu>
                                }>
                                    <Icon type="more" className="black" style={{ fontSize: 20 }} />
                                </Dropdown>

                            </span>
                            :
                            null
                    }

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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CommentBox)));