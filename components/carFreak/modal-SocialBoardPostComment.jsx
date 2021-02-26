import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Tooltip, Upload } from 'antd';
import { CloseOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import {
    loading
} from '../../actions/app-actions';
import { setUser } from '../../actions/user-actions';
import _, { set } from 'lodash';
import client from '../../feathers'
import { Carousel } from 'react-responsive-carousel';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import moment from "moment";
import EmojiPickerButton from '../commonComponent/emoji-picker-button';
import axios from 'axios';
const { TextArea } = Input;


const PostModalComment = (props) => {

    const [newPostModalComment, setNewPostModalComment] = useState(false);
    const [messages, setMessages] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState('');
    const [editComment, setEditComment] = useState({});
    const [disableViewMoreComment, setDisableViewMoreComment] = useState(false);
    const { form } = props;
    const { getFieldDecorator } = form;

    useEffect(() => {

    }, [currentChatId, messages]);

    useEffect(() => {
        let visibleMode = props.visibleMode ? props.visibleMode === true ? true : false : false
        setNewPostModalComment(visibleMode)
        if (props.chatInfo._id !== currentChatId) {
            setCurrentChatId(props.chatInfo._id)
            setMessages(props.messages)
            if (props.messages <= 0) {
                setDisableViewMoreComment(true)
            }
        }

        if (_.isEmpty(props.currentComment) === false) {
            if (props.currentComment !== editComment) {
                if (_.isEmpty(props.currentComment) === false) {
                    if (props.currentComment.message) {
                        form.setFieldsValue({
                            replyMsg: props.currentComment.message,
                        });
                    }
                }
                setEditComment(props.currentComment)
            }
        }

    });


    function closeModal() {
        props.changeVisibleMode(false);
        setNewPostModalComment(false)
    }

    function handleSubmit() {
        setSubmitLoading(true)
        client.authenticate()
            .then((res) => {
                const { form } = props;

                form.validateFields((err, values) => {
                    if (err) { return setSubmitLoading(false); }

                    //patch
                    if (props.editMode) {
                        if (_.isEmpty(props.editMode) === false) {
                            if (props.editMode === 'edit') {

                                client.service('chatmessages')
                                    .patch(editComment._id, {
                                        message: values.replyMsg,
                                    })
                                    .then((res) => {
                                        form.resetFields();
                                        props.changeVisibleMode(false);
                                        setNewPostModalComment(false)
                                        setSubmitLoading(false)
                                    })
                                    .catch((err) => {
                                        message.error("Unable to Edit messages.")
                                        setSubmitLoading(false)

                                    })
                                return
                            }
                        }
                    }
//reply to messages
                    if(props.editModeComment==='replyToMsg'){
                        client.service('chatmessagereplies')
                        .create({
                            messageId: props.replytoMessage._id,
                            userId: res.user._id,
                            message: values.replyMsg,
                            name: res.user.firstName,
                        })
                        .then((res) => {
                            setSubmitLoading(false)
                            setNewPostModalComment(false)
                            props.changeVisibleMode(false);
                            form.resetFields();
                        }).catch((err) => {
                            message.error('Unable to send messages.')
                            setNewPostModalComment(false)
                            props.changeVisibleMode(false);
                        })
                     
                        
                        return
                    }

                    client.service('chatmessages')
                        .create({
                            chatId: props.chatInfo._id,
                            userId: res.user._id,
                            message: values.replyMsg,
                            name: res.user.firstName,
                        })
                        .then((res) => {
                            setSubmitLoading(false)
                            setNewPostModalComment(false)
                            props.changeVisibleMode(false);
                            form.resetFields();
                        }).catch((err) => {
                            message.error('Unable to send messages.')
                            setNewPostModalComment(false)
                            props.changeVisibleMode(false);
                        })

                });


            })
            .catch((err) => {
                setSubmitLoading(false);
                return message.error("Please Login.")
            })


    };

    function getData() {

        client.authenticate()
            .then((res) => {

                client.service('chatmessages').find(
                    {
                        query: {
                            chatId: props.chatInfo._id,
                            $populate: 'userId',
                            $limit: 50,
                            $sort: { _id: -1 },
                            $skip: messages.length
                        }
                    }
                ).then((res) => {
                    if (res.data.length > 0) {
                        let newMessages = messages.concat(res.data)
                        setMessages(newMessages)
                    }
                    if (res.total < res.skip + 50) {
                        setDisableViewMoreComment(true)
                    }

                })

            })
    }



 
    var mediaList = [], avatar = '', firstName = '', createdAt = '-'

    avatar = props.currentUser ? props.currentUser.user?props.currentUser.user.avatar:'':''
    firstName = props.currentUser ? props.currentUser.user?props.currentUser.user.firstName:'':''
    let emojiPosition = { top: -360, right: 0 }
    return (
        <Modal
            // title="Comment Post"
            visible={newPostModalComment}
            onCancel={(e) => { closeModal() }}
            onOk={(e) => { handleSubmit() }}
            okText="Submit"
            width={720}
            confirmLoading={submitLoading}
        >

            <Card>
                {/* Author section */}
                <Row>
                    {/* Avatar */}
                    <Row>
                        <Col span={2} style={{ textAlign: 'center' }}>
                            {avatar ? <img className='avatarProfileImg' src={avatar} /> : ''}
                        </Col>
                        <Col span={22}>
                            <Row style={{ marginLeft: '12px' }}>{firstName ? firstName : ''}</Row>
                        </Col>
                    </Row>

                    {/* reply section */}
                    <Col id='Commentbox' span={24}>
                        <Form layout="vertical">

                            <Form.Item >
                                {getFieldDecorator('replyMsg', {
                                    rules: [{ required: true, message: 'Please input.' }],
                                })(
                                <Input 
                                placeholder="What's on your mind?"
                                maxLength={1000} suffix={
                                    <EmojiPickerButton
                                        onSelect={(emoji) => {
                                            const { form } = props;
                                            let originalMsg = form.getFieldValue('replyMsg')
                                            originalMsg = originalMsg || ''
                                            originalMsg = originalMsg + emoji.native
                                            form.setFieldsValue({ replyMsg: originalMsg })
                                        }}
                                        position={emojiPosition}>
                                        <Icon type="smile" className='cursor-pointer grey margin-right-sm margin-top-xs' style={{ fontSize: '17px' }} />
                                    </EmojiPickerButton>
                                } />
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>

        </Modal>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PostModalComment)));