import { Dropdown, Form, Icon, Input, Menu, Popconfirm, message } from 'antd';
import "emoji-mart/css/emoji-mart.css";
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { withRouter } from 'next/dist/client/router';
import { loading, loginMode } from '../../../actions/app-actions';
import SavePostButton from './save-post-button';
import FollowButton from '../../commonComponent/follow-button';
import ReportButton from '../../commonComponent/report-button';
import ShareButtonDialog from '../../commonComponent/share-button-dialog';
import { BookOutlined, BookFilled } from '@ant-design/icons';



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
                            <Menu.Item key={_.get(post, ['_id']) + 'editBtn'} onClick={(e) => {
                                if (props.onEditPostClick) {
                                    props.onEditPostClick(post)
                                }
                            }}><span >Edit</span></Menu.Item>,
                            <Menu.Item key={_.get(post, ['_id']) + 'removeBtn'}>
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
                                    <span>Delete</span>
                                </Popconfirm>
                            </Menu.Item>
                        ]
                        :
                        null
                }
                {
                    _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) != _.get(post, ['userId', '_id']) && _.get(post, ['chatType']) != 'event' ?
                        <Menu.Item key={_.get(post, ['_id']) + 'saveBtn'}>
                            <SavePostButton userId={_.get(props.user, ['info', 'user', '_id'])} chatId={_.get(post, ['_id'])}
                                saveButton={() => {
                                    return <span className="grey-darken-3"><BookOutlined className="margin-right-xs" />Save Post</span>
                                }}
                                savedButton={() => {
                                    return <span className=""><BookFilled className="margin-right-xs" />Saved Post</span>
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
                            <Menu.Item key={_.get(post, ['_id']) + 'followBtn'}>
                                <FollowButton type="user" followerId={_.get(props.user, ['info', 'user', '_id'])} userId={_.get(post, ['userId', '_id'])}
                                    followButton={() => {
                                        return <span className="grey-darken-3">Follow</span>
                                    }}
                                    handleSuccess={(data) => {
                                        message.success(data.type == 'remove' ? 'Unfollowed' : 'Followed')
                                    }}
                                    handleError={(err) => {
                                        message.error(err.message)
                                    }}
                                />
                            </Menu.Item>,
                            <Menu.Item key={_.get(post, ['_id']) + 'reportBtn'}>
                                <ReportButton type="chat"
                                    reporterId={_.get(props.user, ['info', 'user', '_id'])}
                                    chatId={_.get(post, ['_id'])}
                                    reportButton={() => {
                                        return <span className="red">Report</span>
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
                <Menu.Item key={_.get(post, ['_id']) + 'shareBtn'}>
                    <ShareButtonDialog link={`/car-freaks/${_.get(post, ['_id'])}`}>
                        <span>Share Link</span>
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
    loading: loading,
    loginMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PostMenu)));