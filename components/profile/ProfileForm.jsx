import { Avatar, Button, Card, Col, Form, Input, message, Radio, Row, Select, Upload } from 'antd';
import axios from 'axios';
import Compress from "browser-image-compression";
import FormData from 'form-data';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isNumberAndSpace } from '../../common-function';
import client from '../../feathers';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';



const { Option } = Select;

const profilePic = "/assets/profile/profilePic.jpg";

const profileImage = "/assets/profile/profile-image.png";

const ProfileForm = (props) => {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, isFieldValidating } = props.form;

    const [userForm, setUserForm] = useState({});
    const [timeoutFunction, setTimeoutFunction] = useState();
    const [checkUserNameLoading, setCheckUserNameLoading] = useState(false);
    const [submitUserForm, setSubmitUserForm] = useState();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidFreakId, setIsValidFreakId] = useState(true);
    const [isValidUserUrlId, setIsValidUserUrlId] = useState(true);
    // Only show error after a field is touched.
    const freakIdError = (isFieldTouched('freakId') || !isFieldValidating('freakId')) && getFieldError('freakId') || !isValidFreakId ? 'This freakId already used by others.' : '';
    const userurlIdError = (isFieldTouched('userurlId') || !isFieldValidating('userurlId')) && getFieldError('userurlId') || !isValidUserUrlId ? 'This user url already used by others.' : '';
    const usernameError = (isFieldTouched('username') || !isFieldValidating('username')) && getFieldError('username') || !isValidUsername ? 'This username already used by others.' : '';
    const firstNameError = (isFieldTouched('firstName') || !isFieldValidating('firstName')) && getFieldError('firstName');
    const lastNameError = (isFieldTouched('lastName') || !isFieldValidating('lastName')) && getFieldError('lastName');
    const contactNoPrimaryError = (isFieldTouched('contactNoPrimary') || !isFieldValidating('contactNoPrimary')) && getFieldError('contactNoPrimary');
    const isFemaleError = (isFieldTouched('isFemale') || !isFieldValidating('isFemale')) && getFieldError('isFemale');
    const birthdayDayError = (isFieldTouched('birthdayDay') || !isFieldValidating('birthdayDay')) && getFieldError('birthdayDay');
    const birthdayMonthError = (isFieldTouched('birthdayMonth') || !isFieldValidating('birthdayMonth')) && getFieldError('birthdayMonth');
    const birthdayYearError = (isFieldTouched('birthdayYear') || !isFieldValidating('birthdayYear')) && getFieldError('birthdayYear');

    const prefixPrimarySelector = getFieldDecorator('contactNoPrimaryPrefix', {
        initialValue: '+60',
    })(
        <Select style={{ width: 70 }}>
            <Option value="+60">+60</Option>
        </Select>
    )

    useEffect(() => {
        // props.form.setFieldsValue(userForm)
        props.form.setFieldsValue({
            userurlId: userForm.userurlId,
            freakId: userForm.freakId,
            username: userForm.username,
            lastName: userForm.lastName,
            firstName: userForm.firstName,
            contactNoPrimary: userForm.contactNoPrimary,
            isFemale: userForm.isFemale,
            bio: userForm.bio,
            birthdayDay: userForm.birthdayDay,
            birthdayMonth: userForm.birthdayMonth,
            birthdayYear: userForm.birthdayYear,
        })
    }, [userForm])


    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            if (props.data.contactNoPrimary && props.data.contactNoPrimaryPrefix) {
                props.data.contactNoPrimary = props.data.contactNoPrimary.replace(props.data.contactNoPrimaryPrefix, '')
            }
            setUserForm(props.data);
        } else {
            setUserForm({});
        }

    }, [props.data])


    function disableButtonTimeOut(time) {
        if (!isNaN(parseInt(time)) || !time) {
            time = 5;
        }

        setButtonDisabled(true);
        setTimeout(() => {
            setButtonDisabled(false);
        }, time * 1000);
    }


    function dayOption() {
        var options = [];
        for (let index = 0; index < 31; index++) {
            var count = index;
            var item = <Option key={'day' + index} value={'' + (count + 1)}>{count + 1}</Option>
            options.push(item);

        }
        return options;
    };

    function monthOption() {
        var options = [];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        for (let index = 0; index < 12; index++) {
            var count = index;
            var item = <Option key={'monthOpt' + index} value={'' + (count + 1)}>{months[index]}</Option>
            options.push(item);

        }
        return options;
    };

    function yearOption() {
        var options = [];
        for (let index = 1900; index < new Date().getFullYear(); index++) {
            var count = index;
            var item = <Option key={'yearOpt' + index} value={'' + (count + 1)}>{count + 1}</Option>
            options.push(item);

        }
        return options;
    };



    async function handlePreview(file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setUserForm({ ...userForm, avatar: file.url || file.preview });
    };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // function checkIsValidUsername() {

    //     if (_.get(userForm, ['_id']) && _.get(userForm, ['username'])) {
    //         props.loading(true)
    //         setCheckUserNameLoading(true);
    //         axios.get(`${client.io.io.uri}checkUniqueUsername`, {
    //             params: {
    //                 id: userForm._id,
    //                 username: userForm.username
    //             }
    //         }).then(res => {
    //             setCheckUserNameLoading(false);
    //             props.loading(false)
    //             if (_.get(res, ['data', 'status']) == 'used') {
    //                 setIsValidUsername(isValidUsername => false);
    //                 message.error('Username has been used. Please select another username.')
    //             } else {
    //                 setIsValidUsername(isValidUsername => true);
    //                 handleSubmit();
    //             }

    //         }).catch(err => {
    //             props.loading(false);
    //             setCheckUserNameLoading(false);
    //             message.error(err.message)
    //         });
    //     } else {
    //         message.error('Username Not Found!')
    //     }

    // }

    function checkIsValid() {

        if (_.get(userForm, ['_id']) && _.get(userForm, ['freakId']) && _.get(userForm, ['userurlId'])) {
            props.loading(true)
            let promises = [];
            promises.push(axios.get(`${client.io.io.uri}checkUniqueFreakId`, {
                params: {
                    id: userForm._id,
                    freakId: _.get(userForm, 'freakId')
                }
            }))

            promises.push(axios.get(`${client.io.io.uri}checkUniqueUserUrlId`, {
                params: {
                    id: userForm._id,
                    userurlId: _.get(userForm, 'userurlId')
                }
            }))
            Promise.all(promises).then(responses => {
                props.loading(false)
                if (_.get(responses, [0, 'data', 'status']) == 'used') {
                    setIsValidFreakId(false);
                    message.error('FreakId has been used. Please select another FreakId.')
                } else if (_.get(responses, [1, 'data', 'status']) == 'used') {
                    setIsValidUserUrlId(false);
                    message.error('User url has been used. Please select another user url.')
                } else {
                    setIsValidFreakId(true);
                    setIsValidUserUrlId(true);
                    handleSubmit();
                }

            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });
        } else {
            message.error('FreakId Not Found!')
        }
    }
    function handleSubmit(e) {
        props.form.validateFields((err, values) => {
            if (!err) {
                props.loading(true);
                client.authenticate()
                    .then((res) => {

                        let formData = new FormData();
                        let fileList = userForm.imageList;
                        let promiseArr = [];

                        if (_.isArray(fileList) && !_.isEmpty(fileList)) {
                            for (let i = 0; i < fileList.length; i++) {

                                if (!fileList[i].url) {
                                    let imgObj = fileList[i].originFileObj
                                    const options = {
                                        maxSizeMB: 0.2,
                                        useWebWorker: true,
                                        maxWidthOrHeight: 1920,
                                    }

                                    let imageFile = Compress(imgObj, options)
                                        .then(compressedBlob => {
                                            compressedBlob.lastModifiedDate = new Date()
                                            const convertedBlobFile = new File([compressedBlob], imgObj.name, { type: imgObj.type, lastModified: Date.now() })
                                            return convertedBlobFile
                                        })

                                    promiseArr.push(imageFile.then((res) => {
                                        fileList[i].originFileObj = res
                                        return fileList[i]
                                    }))
                                }
                                else {
                                    promiseArr.push(fileList[i])
                                }
                            }
                        }
                        // after image processing
                        Promise.all(promiseArr)
                            .then((resArr) => {
                                let formData = new FormData();
                                let uploadYes = 'no'
                                for (let i = 0; i < resArr.length; i++) {
                                    if (!resArr[i].url) {
                                        uploadYes = 'yes'
                                        formData.append('images', resArr[i].originFileObj);
                                    }
                                }
                                let uploadPromiseArr = []
                                if (uploadYes === 'yes') {
                                    uploadPromiseArr.push(
                                        axios.post(`${client.io.io.uri}upload-images-array`,
                                            formData
                                            , {
                                                headers: {
                                                    'Authorization': client.settings.storage.storage.storage['feathers-jwt'],
                                                    'Content-Type': 'multipart/form-data',
                                                }
                                            }
                                        ).then((res) => {
                                            let imageListResult = []
                                            try { imageListResult = res.data.result } catch (err) { imageListResult = [] }
                                            _.map(imageListResult, function (v) { fileList.push(v) });
                                            fileList = _.map(fileList, function (v) { if (v.url) { return v } });
                                            return fileList = _.without(fileList, undefined)
                                        })
                                    )
                                }
                                else {
                                    uploadPromiseArr.push(resArr)
                                }

                                Promise.all(uploadPromiseArr).then((res) => {
                                    let finalData = _.cloneDeep(userForm) || {};
                                    if (_.get(res, [0, 0, 'url'])) {
                                        finalData.avatar = res[0][0].url;
                                    }
                                    updateUser(finalData)
                                })
                            })

                    })
                    .catch((err) => {
                        disableButtonTimeOut();
                        props.loading(false);
                        console.log(err)
                        message.error(err.message);
                    })
            } else {

                props.loading(false);
                disableButtonTimeOut();
                _.map(err, function (err) {
                    return message.error(err.errors[0].message)
                })

            }
        });
    };

    function updateUser(userForm) {
        if (_.get(userForm, ['_id'])) {
            props.loading(true);
            client.authenticate()
                .then((res) => {
                    let finalData = {
                        avatar: userForm.avatar,
                        username: userForm.username,
                        freakId: userForm.freakId,
                        userurlId: userForm.userurlId,
                        firstName: userForm.firstName,
                        lastName: userForm.lastName,
                        birthdayDay: userForm.birthdayDay,
                        birthdayMonth: userForm.birthdayMonth,
                        birthdayYear: userForm.birthdayYear,
                        contactNoPrimaryPrefix: userForm.contactNoPrimaryPrefix,
                        contactNoPrimary: userForm.contactNoPrimaryPrefix + userForm.contactNoPrimary,
                        bio: userForm.bio,
                        isFemale: userForm.isFemale,

                    }

                    client.service('users').patch(userForm._id, finalData).then((res) => {

                        message.success('Updated Successful');
                        props.loading(false);
                        props.setUser(res)
                        if (props.onProfileSuccess) {
                            props.onProfileSuccess(res);
                        }
                    }).catch(err => {
                        console.log(err);
                        props.loading(false);
                        message.error(err.message)
                    });
                }).catch(err => {
                    props.loading(false);
                    message.error(err.message)
                });
        } else {
            message.error('Profile Not Found.')
        }
    }

    function onChangeContactNoPrimary(e) {
        var pattern = /[^0-9]+/g
        e.target.value = e.target.value.replace(pattern, '')
        props.form.setFieldsValue({ contactNoPrimary: e.target.value })
        let contactNoPrimaryPrefix = props.form.getFieldValue('contactNoPrimaryPrefix')
        setUserForm({ ...userForm, contactNoPrimary: e.target.value, contactNoPrimaryPrefix: contactNoPrimaryPrefix })
    }

    return (


        <Card title="Edit Profile" className="round-border thin-border" >

            <Form layout="vertical" >
                <Row gutter={[10, 30]} type="flex" >
                    <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }} lg={{ span: 16, order: 1 }} xl={{ span: 16, order: 1 }}>

                        <Form.Item required={false} label="FreakId" validateStatus={freakIdError ? 'error' : ''} help={freakIdError || ''}>
                            {getFieldDecorator('freakId', {
                                rules: [{ required: false }, {
                                    validator: (rule, value, callback) => {

                                        if (!value) {
                                            callback('Please input your FreakId.');
                                        } else if (!isValidFreakId) {
                                            callback('This FreakId already used by others.');
                                        } else {
                                            callback();
                                        }
                                    }
                                }],
                            })(
                                <Input
                                    style={{ height: '40px' }}
                                    placeholder="FreakId"
                                    onChange={(e) => { setUserForm({ ...userForm, freakId: e.target.value }) }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item required={false} label="User Url" validateStatus={userurlIdError ? 'error' : ''} help={userurlIdError || ''}>
                            {getFieldDecorator('userurlId', {
                                rules: [{ required: false }, {
                                    validator: (rule, value, callback) => {

                                        if (!value) {
                                            callback('Please input your user url.');
                                        } else if (!isValidFreakId) {
                                            callback('This user url already used by others.');
                                        } else {
                                            callback();
                                        }
                                    }
                                }],
                            })(
                                <Input
                                    style={{ height: '40px' }}
                                    placeholder="FreakId"
                                    onChange={(e) => { setUserForm({ ...userForm, userurlId: e.target.value }) }}
                                />
                            )}
                        </Form.Item>

                        {/* <Form.Item required={false} label="Username" validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                            {getFieldDecorator('username', {
                                rules: [{ required: false }, {
                                    // validator: (rule, value, callback) => {

                                    //     if (!value) {
                                    //         callback('Please input your username.');
                                    //     } else if (!isValidUsername) {

                                    //         callback('This username already used by others.');
                                    //     } else {
                                    //         callback();
                                    //     }
                                    // }
                                }],
                            })(
                                <Input
                                disabled
                                    style={{ height: '40px' }}
                                    placeholder="Username"
                                    onChange={(e) => { setUserForm({ ...userForm, username: e.target.value }) }}
                                />
                            )}
                        </Form.Item> */}

                        <Form.Item required={false} label="First Name" validateStatus={firstNameError ? 'error' : ''} help={firstNameError || ''}>
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: 'Please input your first name!' }],
                            })(
                                <Input
                                    style={{ height: '40px' }}
                                    placeholder="First Name"
                                    onChange={(e) => { setUserForm({ ...userForm, firstName: e.target.value }) }}
                                />
                            )}
                        </Form.Item>


                        <Form.Item required={false} label="Last Name" validateStatus={lastNameError ? 'error' : ''} help={lastNameError || ''}>
                            {getFieldDecorator('lastName', {
                                rules: [{ required: true, message: 'Please input your last name!' }],
                            })(
                                <Input
                                    style={{ height: '40px' }}
                                    placeholder="Last Name"
                                    onChange={(e) => { setUserForm({ ...userForm, lastName: e.target.value }) }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item required={false} label="Mobile Numbers" validateStatus={contactNoPrimaryError ? 'error' : ''} help={contactNoPrimaryError || ''}>
                            {getFieldDecorator('contactNoPrimary', {
                                rules: [{ required: false }, {
                                    validator: (rule, value, callback) => {
                                        if (isNumberAndSpace(value) || !value) {
                                            callback();
                                        } else if (value) {
                                            callback('Please input digit only');
                                        }
                                    }
                                }],
                            })(
                                <Input
                                    addonBefore={
                                        prefixPrimarySelector
                                    }
                                    style={{ height: '40px' }}
                                    placeholder="Mobile Numbers"
                                    onChange={(e) => { onChangeContactNoPrimary(e) }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item required={false} label="Bio" >
                            {getFieldDecorator('bio', {
                                rules: [{ required: false, max: 300 }],
                            })(
                                <Input
                                    style={{ height: '40px' }}
                                    placeholder="Add Bio"
                                    onChange={(e) => { setUserForm({ ...userForm, bio: e.target.value }) }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item required={false} label="Gender" validateStatus={isFemaleError ? 'error' : ''} help={isFemaleError || ''}>
                            {getFieldDecorator('isFemale', {
                                // rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <Radio.Group
                                    onChange={(e) => { setUserForm({ ...userForm, isFemale: e.target.value }) }}
                                >
                                    <Radio value={false} className="margin-right-xl">Male</Radio>
                                    <Radio value={true} className="margin-right-xl">Female</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>

                        <div className="headline   margin-y-md" style={{ color: "#000000" }}>
                            Date Of Birthday
            </div>
                        <Row>

                            <Col xs={8} sm={8} md={5} lg={5} xl={5} className="margin-right-sm">

                                <Form.Item required={false} validateStatus={birthdayDayError ? 'error' : ''} help={birthdayDayError || ''}>
                                    {getFieldDecorator('birthdayDay', {
                                        // rules: [{ required: true, message: 'Please input your day of birthday!' }],
                                    })(
                                        <Select placeholder="Day" style={{ width: '100%' }} onChange={(value) => { setUserForm({ ...userForm, birthdayDay: value }) }} >
                                            {dayOption()}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={8} sm={8} md={5} lg={5} xl={5} className="margin-right-sm">

                                <Form.Item required={false} validateStatus={birthdayMonthError ? 'error' : ''} help={birthdayMonthError || ''}>
                                    {getFieldDecorator('birthdayMonth', {
                                        // rules: [{ required: true, message: 'Please input your month of birthday!' }],
                                    })(
                                        <Select placeholder="Month" style={{ width: '100%' }} onChange={(value) => { setUserForm({ ...userForm, birthdayMonth: value }) }} >
                                            {monthOption()}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={8} sm={8} md={5} lg={5} xl={5} className="margin-right-sm">

                                <Form.Item required={false} validateStatus={birthdayYearError ? 'error' : ''} help={birthdayYearError || ''}>
                                    {getFieldDecorator('birthdayYear', {
                                        // rules: [{ required: true, message: 'Please input your year of birthday!' }],
                                    })(
                                        <Select placeholder="Year" style={{ width: '100%' }} onChange={(value) => { setUserForm({ ...userForm, birthdayYear: value }) }} >
                                            {yearOption()}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        {/* <h4 className="font-weight-normal margin-y-lg"><a style={{ color: '#039BE5' }}>Unsubscribe from our Newsletter</a></h4> */}


                        <Button style={{ borderColor: '#F9A825' }} className="margin-right-lg" onClick={(e) => {
                            if (props.onProfileCancel) {

                                props.onProfileCancel();
                            }
                        }}>Cancel</Button>
                        <Button style={{ backgroundColor: '#F9A825', borderColor: '#F9A825' }} className="margin-right-lg" onClick={(e) => { checkIsValid() }} disabled={buttonDisabled}>Save Changes</Button>

                    </Col>

                    <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }} lg={{ span: 8, order: 2 }} xl={{ span: 8, order: 2 }}>

                        <div style={{ 'position': 'relative', textAlign: 'center' }} className="margin-md">

                            <Upload {...props} showUploadList={false} accept="image/*" onChange={(v) => { handlePreview(v.file); setUserForm({ ...userForm, imageList: v.fileList }) }} multiple={false}>
                                <Avatar size={100} src={userForm.avatar ? userForm.avatar : null} className='cursor-pointer'></Avatar>

                                <Avatar size={50} src={profileImage} style={{ 'position': 'absolute', top: 0, bottom: 0, right: 0, left: 0, margin: 'auto' }} className="padding-xs cursor-pointer" />

                            </Upload>
                        </div>

                        <div style={{ textAlign: 'center' }}>

                            <h5 className="font-weight-thin">File size: Max 1MB</h5>
                            <h5 className="font-weight-thin">File Extension: JPEG, PNG</h5>
                        </div>
                    </Col>

                </Row>

            </Form>
        </Card >
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    setUser: setUser,
    loading: loading,

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProfileForm)));