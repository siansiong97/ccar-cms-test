import { CloseOutlined } from '@ant-design/icons';
import { Col, Dropdown, Empty, Form, Icon, Input, Menu, message as AntMessage, Modal, Row } from 'antd';
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayLengthCount, formatNumber, getPlural, getUserName, notEmptyLength } from '../../../common-function';
import client from '../../../feathers';
import { carFreakLikeGreyIcon, carFreakLikeIcon } from '../../../icon';
import { loading, loginMode } from '../../../redux/actions/app-actions';
import LightBoxCarousel from '../../general/LightBoxCarousel';
import ParseTag from '../../general/ParseTag';
import ScrollLoadWrapper from '../../general/ScrollLoadWrapper';
import UserAvatar from '../../general/UserAvatar';
import { commentIcon } from '../../live/config';
import { chatRestrictTime } from '../config';
import CommentBox1 from './comment-box-1';
import LikePostButton from './like-post-button';
import SocialInput from './social-input';
import { withRouter } from 'next/router';
import Link from 'next/link';



const messagePageSize = 6;
const { TextArea } = Input;

const postCommentRef = React.createRef();


const PostModal = (props) => {

    const [newPostModalComment, setNewPostModalComment] = useState(false);
    const [messages, setMessages] = useState([]);
    const [post, setPost] = useState({});
    const [postLike, setPostLike] = useState({});
    const [message, setMessage] = useState('');
    const [messageTotal, setMessageTotal] = useState(0);
    const [totalLike, setTotalLike] = useState(0);
    const [canSendMessage, setCanSendMessage] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState(false);

    const { form } = props;
    const { getFieldDecorator } = form;


    useEffect(() => {
        if (_.isPlainObject(props.chatInfo) && !_.isEmpty(props.chatInfo)) {
            setFocused(false);
            setMessages([]);
            setPost(props.chatInfo);
        } else {
            setPost({});
        }

    }, [props.chatInfo])

    useEffect(() => {

        if (_.isPlainObject(props.postLike) && !_.isEmpty(props.postLike)) {
            setPostLike(props.postLike);
        } else {
            setPostLike({});
        }

    }, [props.postLike])

    useEffect(() => {

        if (_.isPlainObject(post) && !_.isEmpty(post) && newPostModalComment) {
            getData();
        }

        else {
            setMessages([]);
        }

        setTotalLike(!_.isNaN(parseInt(_.get(post, ['totalLike']))) ? formatNumber(_.get(post, ['totalLike']), null, true, 0, 0) : 0)
    }, [post, newPostModalComment])


    useEffect(() => {
        let visibleMode = props.visibleMode ? props.visibleMode === true ? true : false : false
        setNewPostModalComment(visibleMode)
        if (postCommentRef.current && !focused) {
            if (postCommentRef.current.focus) {
                postCommentRef.current.focus();
            }
            setFocused(true)
        }
    });


    function closeModal() {
        props.changeVisibleMode(false);
        setNewPostModalComment(false)
        setMessage('');
        setMessages([]);
        setCanSendMessage(true);
    }

    function handleSubmit(text) {

        if (!_.get(props.user, ['authenticated']) && !_.get(props.user, ['info', 'user', '_id'])) {
            AntMessage.error('Please Login First!');
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
                                if (props.onUpdatePost) {
                                    props.onUpdatePost({ ...post, totalReply: messageTotal + 1 })
                                }
                                setMessage('');
                                setCanSendMessage(false);
                                res1.userId = res.user;
                                //for new message appear at top after submit
                                let newData = [res1]
                                setMessages(newData.concat(messages))
                                // setMessages(messages.concat([res1]));
                                setMessageTotal(messageTotal + 1);
                                setTimeout(() => {
                                    setCanSendMessage(true);
                                }, chatRestrictTime);

                            }).catch((err) => {
                                console.log('Unable to send messages.')
                            })

                    })
                    .catch((err) => {
                        return AntMessage.error("Please Login.")
                    })
            } else {
                AntMessage.warning('You are typing too fast...')
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
                //if not found , remain , no need set empty
                // else {
                //     setMessages([])
                // }
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
        <Modal
            // title="Comment Post"
            visible={newPostModalComment}
            onCancel={(e) => { closeModal() }}
            footer={null}
            width={720}
            centered
            maskClosable={false}
            className=" no-padding-modal-body modal-body-background-transparent"
            closable={true}
            closeIcon={
                <span className='padding-md background-black-opacity-70 flex-justify-center flex-items-align-center' >
                    <CloseOutlined className="white" style={{ fontSize: 20 }} />
                </span>
            }
        >

            {/* post content section */}

            <div className="show-carousel-dots-inside carousel-background-black background-black">
                <LightBoxCarousel height={'30vh'} images={_.compact(_.map(_.get(post, ['mediaList']), function (v) {
                    return _.get(v, ['url']) || null;
                }))} />
            </div>
            <div className="padding-x-lg padding-y-md background-white round-border-bottom relative-wrapper">

                {
                    !props.hideAction ?
                        <span className='d-inline-block' style={{ position: 'absolute', top: 10, right: 10 }} >
                            <Dropdown overlay={
                                <Menu>
                                    <Menu.Item key={_.get(post, ['_id']) + 'goToPost'}>
                                        <Link shallow prefetch passHref href={`/car-freaks/${_.get(post, ['_id'])}`}>
                                            <a>
                                                <span>Go To Post</span>
                                            </a>
                                        </Link>
                                    </Menu.Item>
                                </Menu>
                            }>
                                <Icon type="more" className="black" style={{ fontSize: 20 }} />
                            </Dropdown>
                        </span>
                        :
                        null
                }
                <ScrollLoadWrapper autoHeight autoHeightMax={'50vh'} onScrolledBottom={() => { if (arrayLengthCount(messages) < messageTotal) { getData(); } }}>
                    <div style={{ minHeight: '50vh' }}>
                        <Row gutter={[0, 10]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="fill-parent flex-justify-start flex-items-align-center">
                                    <UserAvatar redirectProfile data={_.get(post, ['userId'])} size={50} />
                                    <div className="padding-left-md">
                                        <div className="subtitle1 font-weight-bold black">
                                            {`${getUserName(_.get(post, ['userId']), 'freakId')}`}
                                        </div>
                                        <div className="headline grey">
                                            {`posted at ${moment(_.get(post, ['createdAt'])).fromNow()}`}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div >
                                    <ParseTag data={(_.get(post, ['title']) || '')} className="font-weight-bold subtitle1 width-100 pre-wrap" expandable
                                        lines={1}
                                        more={<span className="caption">Show More</span>}
                                        less={<span className="caption">Show Less</span>} />
                                </div>
                                <div >
                                    <ParseTag data={(_.get(post, ['content']) || '')} className="headline font-weight-normal width-100 pre-wrap" expandable
                                        lines={1}
                                        more={<span className="caption">Show More</span>}
                                        less={<span className="caption">Show Less</span>} />
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
                                <div className="width-100 flex-justify-start flex-items-align-center" >
                                    <LikePostButton className='d-inline-block margin-right-md'
                                        chatId={post._id}
                                        postLike={postLike}
                                        likeOn="chat"
                                        onClick={(liked) => { setTotalLike(liked ? parseInt(totalLike) + 1 : parseInt(totalLike) - 1) }}
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
                                                <img src={carFreakLikeIcon} style={{ width: 35, height: 25 }} className="margin-right-sm cursor-pointer" />
                                                {formatNumber(totalLike, 'auto', true, 0, true) || 0}
                                            </div>
                                        }
                                    >

                                        <div className="flex-items-align-center">
                                            <img src={carFreakLikeGreyIcon} style={{ width: 35, height: 25 }} className="margin-right-sm cursor-pointer" />
                                            {formatNumber(totalLike, 'auto', true, 0, true) || 0}
                                        </div>
                                    </LikePostButton>
                                    <span className='flex-items-align-center cursor-pointer' onClick={(e) => {

                                        if (postCommentRef.current.focus) {
                                            postCommentRef.current.focus();
                                        }
                                    }}>
                                        <span className='margin-right-sm' >
                                            <img src={commentIcon} style={{ width: '20px', height: '20px' }} />
                                        </span>
                                        <span className='headline' >
                                            Comment
                                        </span>
                                    </span>
                                </div>
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
                    </div>
                </ScrollLoadWrapper>

                <SocialInput
                    placeholder="What's on your mind?"
                    maxLength={1000}
                    inputRef={postCommentRef}
                    size="small"
                    onChange={(v) => {
                        setMessage(v)
                    }}
                    emojiPosition={{ right: 33, bottom: 0 }}
                    onSubmit={(text) => {
                        handleSubmit(text);
                    }}
                    autoFocus={true}
                    excludeEnter
                />

            </div>
        </Modal>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    loginMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PostModal)));