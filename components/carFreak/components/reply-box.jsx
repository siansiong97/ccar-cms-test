import { MessageOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Form, Icon, Menu, message, Popconfirm, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import client from '../../../feathers';
import LikePostButton from './like-post-button';
import SocialInput from './social-input';
import UserAvatar from '../../general/UserAvatar';
import { formatNumber, getObjectId, getUserName, notEmptyLength, objectRemoveEmptyValue  } from '../../../common-function';
import LightBoxGallery from '../../general/light-box-gallery';
import ParseTag from '../../general/ParseTag';
import { loading, loginMode } from '../../../redux/actions/app-actions';



const defaultHeight = 'auto';
const headerHeight = 100;
const imageHeight = 200;
const titleHeight = 40;
const footerHeight = 100;
const actionHeight = 40;

const commentInputRef = React.createRef();
const PAGE_SIZE = 6;

const ReplyBox = (props) => {

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
                <div className={`background-white flex-items-align-start flex-justify-start relative-wrapper padding-md ${props.className ? props.className : ''}`} style={{ ...props.style }}>
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
                            {
                                editMode ?
                                    <SocialInput
                                        placeholder="Write your comment..."
                                        editMode
                                        clickOutsideSubmit
                                        text={`${_.get(comment, ['message']) || ''}`}
                                        emojiPosition={{ top: -360, right: 0 }}
                                        onSubmit={(text) => {
                                            handleSubmit(text);
                                            setEditMode(false);
                                        }}
                                        excludeEnter
                                    />
                                    :
                                    <div>
                                        <ParseTag data={_.get(comment, ['message']) || ''} className="headline black width-100" expandable lines={3} />
                                    </div>
                            }
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-justify-space-between flex-items-align-center">
                                <span className='flex-justify-start flex-items-align-center margin-right-md' >
                                    <LikePostButton className="margin-right-md" text={(actived) => `${formatNumber(totalLike, 'auto', true, 0, true) || 0}`} replyId={_.get(comment, ['_id'])} likeOn='reply' onClick={(actived) => {
                                        setTotalLike(actived ? totalLike + 1 : totalLike - 1)
                                    }} />
                                </span>
                                <span className='d-inline-block' >
                                    <Button
                                        onClick={() => {
                                            if (props.handleReply) {
                                                props.handleReply(getUserName(_.get(comment, ['userId']), 'freakId') || '', getObjectId(_.get(comment, ['userId'])) || '')
                                            }
                                        }}
                                    ><MessageOutlined /> Reply</Button>
                                </span>
                            </div>
                        </Col>


                    </Row>

                    {
                        _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(comment, ['userId', '_id']) ?
                            <span className='d-inline-block' style={{ position: 'absolute', top: 30, right: 20 }} >
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item onClick={(e) => {
                                            if (!props.manualControl) {
                                                setEditMode(true)
                                            } else {
                                                if (props.onEditClick) {
                                                    props.onEditClick(comment)
                                                }
                                            }
                                        }}><span >Edit</span></Menu.Item>
                                        <Menu.Item>
                                            <Popconfirm
                                                title="Are you sure to delete this comment?"
                                                onConfirm={(e) => {
                                                    if (!props.manualControl) {
                                                        handleRemove();
                                                    } else {
                                                        if (props.onRemoveClick) {
                                                            props.onRemoveClick(comment)
                                                        }
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReplyBox)));