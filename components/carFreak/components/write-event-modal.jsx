import { Form, Input, Modal, Row, Col, message, Upload, Avatar, Button, Radio, DatePicker, Select, Divider, Icon } from 'antd';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { v4 } from 'uuid';
import ClubAvatar from './club/club-avatar';
import client from '../../../feathers';
import Loading from '../../commonComponent/loading';
import UserAvatar from './user-avatar';
import { getUserName } from '../../profile/common-function';
import { loading, loginMode } from '../../../actions/app-actions';
import { setUser } from '../../../actions/user-actions';
import { uploadPhoto } from '../../../icon';
import moment from 'moment';




const { TextArea } = Input;



const profileImage = "/assets/profile/profile-image.png";
const MINUTE_INTERVAL = 30;
const HOUR_RANGE = 24;

const WriteEventModal = (props) => {

    const { form } = props;
    const { getFieldDecorator } = form;

    const [visible, setVisible] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [origImage, setOrigImage] = useState()
    const [uploadImage, setUploadImage] = useState()
    const [uploadImagePreview, setUploadImagePreview] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [inviteVisible, setInviteVisible] = useState(false);
    const [event, setEvent] = useState({});
    const [creator, setCreator] = useState({});

    useEffect(() => {

        setVisible(props.visible ? true : false)

    }, [props.visible])

    useEffect(() => {

        setCreator(_.isPlainObject(props.creator) && !_.isEmpty(props.creator) ? props.creator : {});

    }, [props.creator])

    useEffect(() => {
        setEvent(_.isPlainObject(props.data) && !_.isEmpty(props.data) ? props.data : {})
        setUploadImagePreview(_.get(props.data, ['coverPhoto']));
        setOrigImage(_.get(props.data, ['coverPhoto']));
    }, [props.data])


    useEffect(() => {

        setEditMode(props.editMode === true ? true : false);

    }, [props.editMode, visible])

    useEffect(() => {

        if (visible) {
            if ((!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) && visible) {
                message.error('Please Login First!');
                console.log('here');
                props.loginMode(true);
                closeModal();
            }

            if ((!props.type || !props[`${props.type}Id`]) && !editMode) {
                message.error('Content Not Found!');
                closeModal();
            }

            if (!_.isPlainObject(event) && _.isEmpty(event) && editMode) {
                message.error('Event Not Found!');
                closeModal();
            }
        }

    }, [visible])

    function closeModal() {

        form.resetFields();
        setUploadImagePreview(origImage);
        setUploadImage();
        setOrigImage();
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

                message.error('Event Cover Photo Is Required.')
                return;
            }

            let data = {
                name: values.name,
                description: values.description,
                location: values.location,
                startAt: _.get(values, ['dateRange', 0]) ? new Date(_.get(values, ['dateRange', 0])) : new Date(),
                endAt: _.get(values, ['dateRange', 1]) ? new Date(_.get(values, ['dateRange', 1])) : new Date(),
                scope: values.scope,
            };
            if (file) {
                setIsLoading(true);

                var fileName = v4() + "-" + file.name.split('.').join("-") + "-" + new Date().getTime();
                formData.append('images', file.originFileObj, fileName);
                //Upload Image
                axios.post(`${client.io.io.uri}upload-images-array`,
                    formData
                    , {
                        headers: {
                            'Authorization': client.settings.accessToken,
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                ).then((res) => {
                    let fileList = _.get(res, ['data', 'result'])
                    data.coverPhoto = _.get(fileList, [0, 'url']);
                    if (!editMode) {
                        data.type = props.type;
                        data.status = 'ongoing';
                        data[`${props.type}Id`] = props[`${props.type}Id`];

                        createEvent(data)
                    } else {
                        updateEvent(_.get(event, ['_id']), data)
                    }
                })
                    .catch((err) => {
                        setIsLoading(false);
                        message.error("Unable to create event. T.T")
                        console.log(err)
                    })
            } else {
                if (editMode) {
                    updateEvent(_.get(event, ['_id']), data)
                }
            }
        })
    }

    function createEvent(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            client.authenticate()
                .then((res) => {
                    client.service('events')
                        .create(data)
                        .then((res1) => {
                            setIsLoading(false);
                            setEvent(res1)
                            closeModal();
                            if (props.notify) {
                                message.success('Event Created.')
                            }

                            res1.createdBy = res.user;
                            if (props.onCreate) {
                                props.onCreate(res1);
                            }
                        })
                        .catch((err) => {
                            setIsLoading(false);
                            message.error("Unable to create event. T.T")

                        })
                }).catch(err => {
                    setIsLoading(false);
                    message.error(err.message)
                });
        }
    }

    function updateEvent(id, data) {
        console.log('update');
  
        if (id && _.isPlainObject(data) && !_.isEmpty(data)) {
            client.authenticate()
                .then((res) => {
                    client.service('events')
                        .patch(id, data)
                        .then((res1) => {
                            setIsLoading(false);
                            setEvent(res1)
                            closeModal();
                            res1.createdBy = res.user;
                            if (props.notify) {
                                message.success('Event Updated.')
                            }
                            if (props.onUpdate) {
                                props.onUpdate(res1);
                            }
                        })
                        .catch((err) => {
                            setIsLoading(false);
                            message.error("Unable to create event. T.T")

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
                width={500}
                bodyStyle={{ backgroundColor: 'white' }}
            >
                <Form layout="vertical">
                    <Loading spinning={isLoading}>

                        <Row gutter={[10, 10]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="flex-justify-space-between flex-items-align-start margin-bottom-md">
                                    <span className='d-inline-block' >
                                        <div className="flex-justify-start flex-items-align-center">
                                            {
                                                props.type == 'club' ?
                                                    <ClubAvatar data={creator} size={50} className="margin-right-md" />
                                                    :
                                                    <UserAvatar data={creator} size={50} className="margin-right-md" />
                                            }
                                            <span className='d-inline-block' >
                                                <div className="subtitle1 text-truncate black">
                                                    {
                                                        props.type == 'club' ?
                                                            _.get(creator, ['clubName'])
                                                            :
                                                            getUserName(creator, 'fullName') || ''
                                                    }
                                                </div>
                                                <div className="headline text-truncate font-weight-light">
                                                    Host
                                                </div>
                                            </span>
                                        </div>
                                    </span>

                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item style={{ margin: 0 }} className="radio-button-space-around" >
                                    {getFieldDecorator('scope', {
                                        initialValue: props.editMode ? _.get(props.data, ['scope']) : 'public',
                                        rules: [{ required: true, message: 'Please input.' }],
                                    })(
                                        <Radio.Group buttonStyle="solid" disabled={editMode} >
                                            <Radio.Button value="public" className="padding-x-lg margin-x-md round-border-big text-align-center border-ccar-button-yellow" style={{ width: "40%" }}>
                                                <span className="h7" >
                                                    Public
                                                </span>
                                            </Radio.Button>
                                            <Radio.Button value="private" className="padding-x-lg margin-x-md round-border-big text-align-center border-ccar-button-yellow" style={{ width: "40%" }}>
                                                <span className="h7" >
                                                    Private
                                                </span>
                                            </Radio.Button>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="headline margin-bottom-sm">
                                    Event Name
                            </div>
                                <Form.Item style={{ margin: 0 }} >
                                    {getFieldDecorator('name', {
                                        initialValue: _.get(props.data, ['name']),
                                        rules: [{ required: true, message: 'Please input.' }],
                                    })(<Input placeholder="Event Name" />)}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="headline margin-bottom-sm">
                                    Event Date
                                </div>
                                <Form.Item style={{ margin: 0 }} >
                                    {getFieldDecorator('dateRange', {
                                        initialValue: props.editMode ? [moment(_.get(props.data, ['startAt'])), moment(_.get(props.data, ['endAt']))] : [],
                                        rules: [{ required: true, message: 'Please input.' }],
                                    })(<DatePicker.RangePicker disabledDate={(current) => {
                                        return current < moment();
                                    }} showTime style={{ width: '100%' }} />)}
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="headline margin-bottom-sm">
                                    Location
                                </div>
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('location', {
                                        initialValue: _.get(props.data, ['location']),
                                        rules: [{ required: true, message: 'Please input.' }],
                                    })(<TextArea rows={2} placeholder="Please enter event location (maximum 1000 characters)" maxLength={1000} />)}
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="headline margin-bottom-sm">
                                    Description
                                </div>
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('description', {
                                        initialValue: _.get(props.data, ['description']),
                                        rules: [{ required: true, message: 'Please input.' }],
                                    })(<TextArea rows={4} placeholder="Please enter event description (maximum 1000 characters)" maxLength={1000} />)}
                                </Form.Item>
                                <div className="caption grey font-weight-light">
                                    Provide more information about your event so that guests know what to expect.
                                </div>
                            </Col>
                            <Divider style={{ margin: 0 }} type="horizontal" />
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="headline margin-bottom-sm">
                                    Additional Details
                                </div>
                                <div className="thin-border cursor-pointer relative-wrapper">
                                    <Upload accept="image/*" showUploadList={false} onChange={(v) => { handlePreview(v.file); setUploadImage(v.file) }} multiple={false}
                                    >
                                        <div className="flex-justify-center flex-items-align-center " style={{ borderRadius: '2px', height: 150 }}>
                                            {
                                                uploadImagePreview ?
                                                    <img src={uploadImagePreview} className=" absolute-center-img-no-stretch fill-parent" />
                                                    :
                                                    <React.Fragment>
                                                        <img src={uploadPhoto} style={{ width: 100, height: 70 }} className='absolute-center' />
                                                        <div className="flex-justify-center flex-items-align-center grey subtitle1 absolute-center" style={{ paddingTop: 70 + 20 }}>
                                                            POST / UPLOAD PHOTO
                                                        </div>
                                                    </React.Fragment>

                                            }
                                        </div>
                                    </Upload>
                                </div>
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
                    </Loading>
                </Form>
            </Modal>


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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WriteEventModal)));