import { Col, Divider, Empty, Form, Icon, Input, message, Row, Dropdown, Menu, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import ShowMoreText from 'react-show-more-text';
import { v4 } from 'uuid';
import { loading } from '../../../actions/app-actions';
import client from '../../../feathers';
import EmojiPickerButton from '../../commonComponent/emoji-picker-button';
import LightBoxCarousel from '../../commonComponent/light-box-carousel';
import ScrollLoadWrapper from '../../commonComponent/scroll-load-wrapper';
import { commentIcon } from '../../live/config';
import { arrayLengthCount, formatNumber, notEmptyLength, objectRemoveEmptyValue, getPlural, getUserName } from '../../profile/common-function';
import { chatRestrictTime } from '../config';
import CommentBox1 from './comment-box-1';
import LikePostButton from './like-post-button';
import UserAvatar from './user-avatar';
import ParseTag from '../../commonComponent/parse-tag';
import FollowButton from '../../commonComponent/follow-button';
import ReportButton from '../../commonComponent/report-button';
import ShareButtonDialog from '../../commonComponent/share-button-dialog';
import SocialInput from './social-input';
import PostMenu from './post-menu';

var pluralize = require('pluralize')

const defaultHeight = '70vh';
const postCommentRef = React.createRef();
const messagePageSize = 6;

const Post1 = (props) => {

    const [post, setPost] = useState({});
    const [postLikeId, setPostLikeId] = useState();
    const [messageTotal, setMessageTotal] = useState(0);
    const [totalLike, setTotalLike] = useState(0);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [canSendMessage, setCanSendMessage] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setPost(props.data);
            setPostLikeId(v4())
        } else {
            setPost({});
        }

    }, [props.data])

    useEffect(() => {

        if (_.isPlainObject(post) && !_.isEmpty(post)) {

            getData();
        } else {
            setMessages([]);
        }

        setTotalLike(!_.isNaN(parseInt(_.get(post, ['totalLike']))) ? formatNumber(_.get(post, ['totalLike']), null, true, 0, 0) : 0)
    }, [post])

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

    function getData() {

        if (_.get(post, ['_id'])) {
            setIsLoading(true);
            client.service('chatmessages').find(
                {
                    query: {
                        chatId: post._id,
                        $populate: 'userId',
                        $limit: messagePageSize,
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
                setMessageTotal(res.total)

            }).catch(err => {
                setIsLoading(false);
            });

        }
    }

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

    let emojiPosition = { top: -360, right: 0 }

    return (
        notEmptyLength(objectRemoveEmptyValue(post)) ?
            <React.Fragment>
                <Row className={`width-100 ${props.className || ''}`} style={{ ...props.style }} type="flex" gutter={10} align="stretch" >
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <LightBoxCarousel height={defaultHeight} images={_.compact(_.map(_.get(post, ['mediaList']), function (v) {
                            return _.get(v, ['url']) || null;
                        }))} />
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div className="width-100 background-white round-border box-shadow-heavy padding-md relative-wrapper" style={{ height: defaultHeight }}>

                            <ScrollLoadWrapper style={{ height: '90%', width: '100%' }} autoHide onScrolledBottom={() => { if (arrayLengthCount(messages) < messageTotal) { getData(); } }}>
                                <Row gutter={[10, 10]} className="width-100">
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="width-100 flex-justify-start flex-items-align-center">
                                            <UserAvatar redirectProfile data={_.get(post, ['userId'])} size={70} className="margin-right-md" />
                                            <span className='d-inline-block' >
                                                <div className="font-weight-bold black h6">
                                                    {`${getUserName(_.get(post, ['userId']), 'freakId')}`}
                                                </div>
                                                <div className="caption">
                                                    {`posted at ${moment(_.get(post, ['createdAt'])).fromNow()}`}
                                                </div>
                                            </span>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="width-100 ">
                                            <ParseTag data={_.get(post, ['title']) || ''} className="font-weight-bold subtitle1 black width-100 pre-wrap" expandable lines={2}
                                                more={<a className="caption">Show More</a>}
                                                less={<a className="caption">Show Less</a>}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="width-100">
                                            <ParseTag data={_.get(post, ['content']) || ''} className="font-weight-bold headline width-100 pre-wrap" expandable lines={2}
                                                more={<a className="caption">Show More</a>}
                                                less={<a className="caption">Show Less</a>}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="headline font-weight-bold">
                                            <span className='d-inline-block margin-right-md' >
                                                {getPlural('Like', 'Likes', totalLike, true)}
                                            </span>
                                            <span className='d-inline-block' >
                                                {getPlural('Comment', 'Comments', messageTotal, true)}
                                            </span>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Divider className="no-margin" type="horizontal"></Divider>
                                        <div className="width-100 flex-justify-start flex-items-align-center padding-y-xs" >
                                            <LikePostButton className='d-inline-block margin-right-md'
                                                chatId={post._id}
                                                likeOn="chat"
                                                refreshId={postLikeId}
                                                onClick={(liked) => { setTotalLike(liked ? parseInt(totalLike) + 1 : parseInt(totalLike) - 1) }} ></LikePostButton>
                                            <span className='flex-items-align-center cursor-pointer' onClick={(e) => {
                                                postCommentRef.current.focus();
                                            }}>
                                                <span className='margin-right-sm' >
                                                    <img src={commentIcon} style={{ width: '20px', height: '20px' }} />
                                                </span>
                                                <span className='headline' >
                                                    Comment
                                        </span>
                                            </span>                                    {/* <LikePostButton className='d-inline-block margin-right-md'></LikePostButton> */}
                                        </div>
                                        <Divider className="no-margin" type="horizontal"></Divider>
                                    </Col>

                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        {
                                            _.isArray(messages) && notEmptyLength(messages) ?
                                                messages.map(function (v, i) {
                                                    return (
                                                        <React.Fragment key={'messages' + i}>
                                                            <CommentBox1 data={v}
                                                                onChange={(data) => {
                                                                    handleCommentChange(data);
                                                                }}
                                                                onRemove={(data) => {
                                                                    handleRemoveComment(data);
                                                                }}
                                                            />
                                                        </React.Fragment>
                                                    )
                                                })
                                                :
                                                <div className="width-100" style={{ height: 100 }}>
                                                    <Empty description="No comment yet..." ></Empty>
                                                </div>
                                        }
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="width-100 flex-justify-center" style={{ height: 20 }}>
                                            {
                                                isLoading ?
                                                    <Icon type="loading" style={{ fontSize: 20 }} />
                                                    :
                                                    null
                                            }
                                        </div>
                                    </Col>

                                </Row>
                            </ScrollLoadWrapper>


                            <SocialInput
                                placeholder="What's on your mind?"
                                maxLength={1000}
                                inputRef={postCommentRef}
                                size="small"
                                onChange={(v) => {
                                    setText(v)
                                }}
                                emojiPosition={emojiPosition}
                                onSubmit={(text) => {
                                    handleSubmit(text);
                                }}
                                excludeEnter
                                autoFocus={true}
                            />


                            <span className='d-inline-block' style={{ position: 'absolute', top: 10, right: 10 }} >
                                <PostMenu post={post}
                                    onEditPostClick={() => {
                                        if (props.onEditClick) {
                                            props.onEditClick(post)
                                        }
                                    }}
                                    onRemovePostClick={() => {
                                        if (props.onRemoveClick) {
                                            props.onRemoveClick(post);
                                        }
                                    }}
                                />
                            </span>


                        </div>
                    </Col>
                </Row>
            </React.Fragment>
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
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Post1)));