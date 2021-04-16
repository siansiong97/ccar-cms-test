import { BookFilled, BookOutlined } from '@ant-design/icons';
import { Dropdown, Form, Icon, Menu, message, Popconfirm } from 'antd';
import _ from "lodash";
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SavePostButton from './save-post-button';
import FollowButton from '../../profile/FollowButton';
import ShareButtonDialog from '../../general/ShareButtonDialog';
import ReportButton from '../../general/ReportButton';



const postCommentRef = React.createRef();


const PostMenu = (props) => {

    const [post, setPost] = useState({});



    useEffect(() => {
        if (_.isPlainObject(props.post) && !_.isEmpty(props.post)) {
            setPost(props.post);
        } else {
            setPost({});
        }

    }, [props.post])

    return (
        <Dropdown overlay={
            <Menu>
                {
                    _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(post, ['userId', '_id']) && _.get(post, ['chatType']) != 'event' ?
                        [
                            <Menu.Item key={_.get(post, ['_id']) + 'editBtn'} className="no-padding" onClick={(e) => {
                                if (props.onEditPostClick) {
                                    props.onEditPostClick(post)
                                }
                            }}><span className="d-inline-block padding-x-sm padding-y-xs">Edit</span></Menu.Item>,
                            <Menu.Item key={_.get(post, ['_id']) + 'removeBtn'} className="no-padding">
                                <Popconfirm
                                    title="Are you sure to delete this post?"
                                    onConfirm={(e) => {
                                        if (props.onRemovePostClick) {
                                            props.onRemovePostClick(post);
                                        }
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <span className="d-inline-block padding-x-sm padding-y-xs">Delete</span>
                                </Popconfirm>
                            </Menu.Item>
                        ]
                        :
                        null
                }
                {
                    _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) != _.get(post, ['userId', '_id']) && _.get(post, ['chatType']) != 'event' ?
                        <Menu.Item key={_.get(post, ['_id']) + 'saveBtn'} className="no-padding">
                            <SavePostButton userId={_.get(props.user, ['info', 'user', '_id'])} chatId={_.get(post, ['_id'])}
                                saveButton={() => {
                                    return <span className="grey-darken-3 d-inline-block padding-x-sm padding-y-xs"><BookOutlined className="margin-right-xs" />Save Post</span>
                                }}
                                savedButton={() => {
                                    return <span className="d-inline-block padding-x-sm padding-y-xs"><BookFilled className="margin-right-xs" />Saved Post</span>
                                }}
                                notify
                            />
                        </Menu.Item>
                        :
                        null
                }
                {
                    _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) != _.get(post, ['userId', '_id']) ?
                        [
                            <Menu.Item key={_.get(post, ['_id']) + 'followBtn'} className="no-padding">
                                <FollowButton type="user" followerId={_.get(props.user, ['info', 'user', '_id'])} userId={_.get(post, ['userId', '_id'])}
                                    followButton={() => {
                                        return <span className="grey-darken-3 d-inline-block padding-x-sm padding-y-xs">Follow</span>
                                    }}
                                    followingButton={() => {
                                        return <span className="d-inline-block padding-x-sm padding-y-xs">
                                            <Icon type="check" style={{ color: '#F57F17' }} className="margin-right-xs" />
                                                Following
                                            </span>
                                    }}
                                    handleSuccess={(data) => {
                                        message.success(data.type == 'remove' ? 'Unfollowed' : 'Followed')
                                    }}
                                    handleError={(err) => {
                                        message.error(err.message)
                                    }}
                                />
                            </Menu.Item>,
                            <Menu.Item key={_.get(post, ['_id']) + 'reportBtn'} className="no-padding">
                                <ReportButton type="chat"
                                    reporterId={_.get(props.user, ['info', 'user', '_id'])}
                                    chatId={_.get(post, ['_id'])}
                                    reportButton={() => {
                                        return <span className="red d-inline-block padding-x-sm padding-y-xs">Report</span>
                                    }}
                                    cancelButton={() => {
                                        return null;
                                    }}
                                    handleSuccess={(data) => {
                                        message.success(data.type == 'cancel' ? 'Canceled' : 'Reported')
                                    }}
                                    handleError={(err) => {
                                        message.error(err.message)
                                    }} />
                            </Menu.Item>
                        ]
                        :
                        null
                }
                <Menu.Item key={_.get(post, ['_id']) + 'shareBtn'} className="no-padding">
                    <ShareButtonDialog link={`/${_.get(post, ['chatType']) == 'event' ? 'event-post' : _.get(post, ['chatType']) == 'socialboard' ? 'social-board' : 'car-freaks'}/${_.get(post, ['_id'])}`}>
                        <span className="d-inline-block padding-x-sm padding-y-xs">Share Link</span>
                    </ShareButtonDialog>
                </Menu.Item>
            </Menu>
        }>
            {
                props.children || <Icon type="more" className="black" style={{ fontSize: 20 }} />
            }
        </Dropdown>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PostMenu)));