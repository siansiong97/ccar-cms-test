import { Form, Typography, Dropdown, Menu, Popconfirm, Icon, Input, message, Collapse, Divider } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import ShowMoreText from 'react-show-more-text';
import { loading, loginMode } from '../../../actions/app-actions';
import { notEmptyLength, objectRemoveEmptyValue, formatNumber, getPlural, getUserName, getObjectId } from '../../profile/common-function';
import UserAvatar from './user-avatar';
import { v4 } from 'uuid';
import EmojiPickerButton from '../../commonComponent/emoji-picker-button';
import client from '../../../feathers';
import ClickOutsideDetectWrapper from '../../commonComponent/click-outside-detect-wrapper';
import LikePostButton from './like-post-button';
import { chatRestrictTime } from '../config';
import ReplyBox from './reply-box';
import SocialInput from './social-input';
import ParseTag from '../../commonComponent/parse-tag';

const defaultHeight = 'auto';
const headerHeight = 100;
const imageHeight = 200;
const titleHeight = 40;
const footerHeight = 100;
const actionHeight = 40;

let uid = v4();

const PAGE_SIZE = 6;
const commentInputRef = React.createRef();

const ReplyBox1 = (props) => {

    const [comment, setComment] = useState({});
    const [totalLike, setTotalLike] = useState(0);
    const [editMode, setEditMode] = useState(false)



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
        } else {
            setTotalLike(0);
        }

    }, [comment])


    function handleSubmit(text) {

        setEditMode(false)

        if (_.isPlainObject(comment) && !_.isEmpty(comment) && _.get(comment, ['_id']) && editMode) {

            if (props.onChange) {
                comment.message = text;
                props.onChange(comment)
            }
            client.authenticate().then(res => {
                client.service('chatmessagereplies')
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
                message.error(err.message)
            });
        }
    }

    function handleRemove() {

        if (_.isPlainObject(comment) && !_.isEmpty(comment) && _.get(comment, ['_id'])) {
            client.authenticate().then(res => {
                client.service('chatmessagereplies')
                    .remove(comment._id)
                    .then((res) => {
                        message.success('Comment Deleted')
                        if (props.onRemove) {
                            props.onRemove(res);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error("Unable to edit comment. T.T")

                    })
            }).catch(err => {
                message.error(err.message)
            });
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
                                    placeholder="Write your comment..."
                                    editMode
                                    clickOutsideSubmit
                                    text={`${_.get(comment, ['message']) || ''}`}
                                    emojiPosition={{ bottom: -20, right: 33 }}
                                    onSubmit={(text) => {
                                        handleSubmit(text);
                                        setEditMode(false);
                                    }}
                                    excludeEnter
                                />
                                :
                                <ParseTag data={_.get(comment, ['message']) || ''} className="width-100" />
                        }
                        <div className="width-100 flex-justify-start flex-items-align-center" style={{ padding: 0 }}>
                            <span className="small-text margin-right-md grey font-weight-light" >{formatNumber(totalLike, 'auto', true, 0, false) || 0} Likes</span>
                            {/* <span className="small-text margin-right-md grey font-weight-light" >{getPlural('Reply', 'Replies', messageTotal, true)}</span> */}
                        </div>

                        <div className="width-100" style={{ padding: 0 }}>
                            <span className="margin-right-sm small-text">{moment(comment.createdAt).fromNow()}</span>
                            <LikePostButton className="margin-right-sm" likeOn="reply"
                                replyId={_.get(comment, ['_id'])} onClick={(actived) => {
                                    setTotalLike(actived ? totalLike + 1 : totalLike - 1)
                                }}
                                activeButton={
                                    <span className="small-text blue font-weight-light cursor-pointer">Liked</span>
                                }
                            >
                                <span className="small-text grey font-weight-light cursor-pointer">
                                    {getPlural('Like', 'Likes', totalLike, true)}
                                </span>
                            </LikePostButton>
                            <span className="small-text margin-right-sm grey font-weight-light cursor-pointer"
                                onClick={() => {
                                    if (props.handleReply) {
                                        props.handleReply(getUserName(_.get(comment, ['userId']), 'freakId') || '', getObjectId(_.get(comment, ['userId'])) || '')
                                    }
                                }}>Reply</span>
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
                                        <Icon type="more" className="black" style={{ fontSize: 20 }} />
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReplyBox1)));