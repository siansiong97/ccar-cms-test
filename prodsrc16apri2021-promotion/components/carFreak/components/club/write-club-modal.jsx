import { Avatar, Button, Col, Form, Input, message, Modal, Row, Upload } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import ClubInviteModal from './club-invite-modal';
import { loading, loginMode } from '../../../../redux/actions/app-actions';
import { setUser } from '../../../../redux/actions/user-actions';
import client from '../../../../feathers';
import UserAvatar from '../../../general/UserAvatar';
import { getUserName } from '../../../../common-function';
const { TextArea } = Input;


const profileImage = "/assets/profile/profile-image.png";

const WriteClubModal = (props) => {

    const { form } = props;
    const { getFieldDecorator } = form;

    const [visible, setVisible] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [origImage, setOrigImage] = useState()
    const [uploadImage, setUploadImage] = useState()
    const [uploadImagePreview, setUploadImagePreview] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [inviteVisible, setInviteVisible] = useState(false);
    const [club, setClub] = useState({});

    useEffect(() => {

        setVisible(props.visible ? true : false)

    }, [props.visible])

    useEffect(() => {
        setClub(_.isPlainObject(props.data) && !_.isEmpty(props.data) ? props.data : {})
        setUploadImagePreview(_.get(props.data, ['clubAvatar']));
        setOrigImage(_.get(props.data, ['clubAvatar']));
    }, [props.data])

    useEffect(() => {

        setEditMode(props.editMode ? true : false);

    }, [props.editMode])


    useEffect(() => {

        if (visible) {
            if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
                message.error('Please Login First!');
                props.loginMode(true);
                closeModal();
            }

            if (!_.isPlainObject(club) && _.isEmpty(club) && editMode) {
                message.error('Club Not Found!');
                closeModal();
            }
        }

    }, [visible])

    function closeModal() {

        form.resetFields();
        setUploadImagePreview(origImage);
        setUploadImage();
        if (props.onCancel) {
            props.onCancel();
        }
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function handlePreview(file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setUploadImagePreview(file.url || file.preview);
    };

    function handleSubmit() {
        form.validateFields((err, values) => {
            if (err) {
                return;
            }


            let formData = new FormData();
            let file = uploadImage;
            if (!file && !editMode) {

                message.error('Club Image Is Required.')
                return;
            }

            if (file) {
                setIsLoading(true);

                var fileName = v4() + "-" + file.name.split('.').join("-") + "-" + new Date().getTime();
                formData.append('images', file.originFileObj, fileName);
                //Upload Image
                axios.post(`${client.io.io.uri}upload-images-array`,
                    formData
                    , {
                        headers: {
                            'Authorization': client.settings.storage.storage.storage['feathers-jwt'],
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                ).then((res) => {
                    let fileList = _.get(res, ['data', 'result'])
                    if (!editMode) {
                        createClub({ ...values, clubAvatar: _.get(fileList, [0, 'url']) })
                    } else {
                        updateClub(_.get(club, ['_id']), { ...values, clubAvatar: _.get(fileList, [0, 'url']) })
                    }
                })
                    .catch((err) => {
                        setIsLoading(false);
                        message.error("Unable to create club. T.T")
                        console.log(err)

                    })
            } else {
                if (editMode) {
                    updateClub(_.get(club, ['_id']), values)
                }
            }
        })

    }

    function createClub(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            client.authenticate()
                .then((res) => {
                    client.service('clubs')
                        .create({ ...data, userId: _.get(res, ['user', '_id']) })
                        .then((res) => {
                            setIsLoading(false);
                            setClub(res)
                            closeModal();
                            if (props.notify) {
                                message.success('Club Created.')
                            }
                            if (props.triggerInvite) {
                                if (props.notify) {
                                    message.info('Invite others join your club now!')
                                }
                                setInviteVisible(true);
                            }

                            if (props.onCreate) {
                                props.onCreate(res);
                            }
                        })
                        .catch((err) => {
                            setIsLoading(false);
                            message.error("Unable to create club. T.T")

                        })
                }).catch(err => {
                    setIsLoading(false);
                    message.error(err.message)
                });
        }
    }

    function updateClub(id, data) {
        if (id && _.isPlainObject(data) && !_.isEmpty(data)) {
            client.authenticate()
                .then((res) => {
                    client.service('clubs')
                        .patch(id, { ...data, userId: _.get(res, ['user', '_id']) })
                        .then((res) => {
                            setIsLoading(false);
                            setClub(res)
                            closeModal();
                            if (props.notify) {
                                message.success('Club Updated.')
                            }
                            if (props.onUpdate) {
                                props.onUpdate(res);
                            }
                        })
                        .catch((err) => {
                            setIsLoading(false);
                            message.error("Unable to create club. T.T")

                        })
                }).catch(err => {
                    setIsLoading(false);
                    message.error(err.message)
                });
        }
    }
    return (
        <React.Fragment>
            <Modal
                visible={visible}
                footer={null}
                centered
                maskClosable={false}
                onCancel={() => {
                    closeModal();
                }}
                width={700}
                bodyStyle={{ backgroundColor: 'white' }}
            >
                <Form layout="vertical">
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="flex-justify-space-between flex-items-align-start">
                                <span className='d-inline-block' >
                                    <div className="flex-justify-start flex-items-align-center">
                                        <UserAvatar data={_.get(props.user, ['info', 'user'])} size={50} className="margin-right-md" />
                                        <span className='d-inline-block' >
                                            <div className="headline text-truncate black">
                                                {getUserName(_.get(props.user, ['info', 'user']), 'fullName') || ''}
                                            </div>
                                            <div className="caption text-truncate font-weight-light">
                                                Admin
                                    </div>
                                        </span>
                                    </div>
                                </span>

                                <span className='d-inline-block' >

                                    <div style={{ 'position': 'relative', textAlign: 'center' }} className="margin-md">

                                        <Upload {...props} showUploadList={false} accept="image/*" onChange={(v) => { handlePreview(v.file); setUploadImage(v.file) }} multiple={false}>
                                            <Avatar size={50} src={uploadImagePreview} className='cursor-pointer'></Avatar>

                                            <Avatar size={30} src={profileImage} style={{ 'position': 'absolute', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto' }} className="padding-xs cursor-pointer" />

                                        </Upload>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>

                                        <h5 className="font-weight-thin">File size: Max 1MB</h5>
                                        <h5 className="font-weight-thin">File Extension: JPEG, PNG</h5>
                                    </div>
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="headline margin-bottom-sm">
                                Club Name
                            </div>
                            <Form.Item style={{ margin: 0 }} >
                                {getFieldDecorator('clubName', {
                                    initialValue: _.get(props.data, ['clubName']),
                                    rules: [{ required: true, message: 'Please input.' }],
                                })(<Input placeholder="Club Name" />)}
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="headline margin-bottom-sm">
                                Bio
                            </div>
                            <Form.Item style={{ margin: 0 }}>
                                {getFieldDecorator('clubBio', {
                                    initialValue: _.get(props.data, ['clubBio']),
                                    rules: [{ required: true, message: 'Please input.' }],
                                })(<TextArea rows={4} placeholder="Please enter your bio (maximum 1000 characters)" maxLength={1000} />)}
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100">
                                <Button block disabled={isLoading} className=" background-ccar-button-yellow" onClick={(e) => { handleSubmit() }}>Submit</Button>
                            </div>
                        </Col>


                        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="headline margin-bottom-sm">
                                Description
                            </div>
                            <Form.Item style={{ margin: 0 }}>
                                {getFieldDecorator('clubDescription', {
                                    rules: [{ required: true, message: 'Please input.' }],
                                })(<TextArea rows={4} placeholder="Please enter your content (maximum 1000 characters)" maxLength={1000} />)}
                            </Form.Item>
                        </Col> */}

                    </Row>
                </Form>
            </Modal>

            <ClubInviteModal
                visible={inviteVisible}
                onCancel={() => {
                    setInviteVisible(false);
                }}
                clubId={_.get(club, ['_id'])}
                userId={_.isPlainObject(_.get(club, ['userId'])) && !_.isEmpty(_.get(club, ['userId'])) ? _.get(club, ['userId', '_id']) : _.get(club, ['userId'])}
            ></ClubInviteModal>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
    loginMode
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WriteClubModal)));