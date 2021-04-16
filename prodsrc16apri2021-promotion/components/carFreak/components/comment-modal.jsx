import { Col, Form, Icon, Input, message, Modal, Row, Spin, Tooltip, Upload } from 'antd';
import axios from 'axios';
import Compress from "browser-image-compression";
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { v4 } from 'uuid';
import { notEmptyLength } from '../../../common-function';
import client from '../../../feathers';
import { loading, loginMode } from '../../../redux/actions/app-actions';
import { setUser } from '../../../redux/actions/user-actions';
import SocialInput from './social-input';



const { TextArea } = Input;


const CommentModal = (props) => {

    const [imageList, setImageList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [editRecord, setEditRecord] = useState({});
    const [visible, setVisible] = useState(false);
    const [resetIndicator, setResetIndicator] = useState();
    const [post, setPost] = useState({});
    const [text, setText] = useState('');



    const { form } = props;
    const { getFieldDecorator } = form;
    const uploadButton = (
        <div style={{ padding: '5%' }}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    useEffect(() => {

        if (!visible) {
            form.resetFields();
            setText('');
            setResetIndicator(v4())
            setEditRecord({});
            setImageList([]);
            setPreviewImage('');
        }

    }, [visible])

    useEffect(() => {

    }, [text])


    useEffect(() => {
        if (_.isPlainObject(props.post) && !_.isEmpty(props.post)) {
            setPost(props.post);
        } else {
            setPost({});
        }
    }, [props.post])

    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setEditRecord(props.data);
        } else {
            setEditRecord({});
        }
    }, [props.data])

    useEffect(() => {

        if (_.isPlainObject(editRecord) && !_.isEmpty(editRecord)) {
            const { form } = props;
            let imageList = _.cloneDeep(editRecord.mediaList)

            if (imageList) {
                var uid = 0
                imageList.map(function (v) {
                    v.uid = uid + 1
                    uid++
                    return v
                })
            }

            form.setFieldsValue({
                message: editRecord.message,
                imageList: imageList,
                // imageList:props.currentRecord.title,
            });
            setImageList(imageList)
        }
    }, [editRecord])

    useEffect(() => {
        if (props.visible === true) {
            if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
                message.error('Please Login First!')
                props.loginMode(true);
                if (props.onChangeVisible) {
                    props.onChangeVisible(false);
                }
            } else {
                setVisible(true);
            }
        } else {
            setVisible(false);
        }
    }, [props.visible])

    function closeModal() {
        const { form } = props;
        form.resetFields()
        setEditRecord({})
        setImageList([])
        if (props.onChangeVisible) {
            props.onChangeVisible(false);
        }
    }

    function onSubmit() {
        const { form } = props;

        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
            message.error('Please Login First!')
            props.loginMode(true);
            return;
        }

        if (props.editMode == 'edit' && !_.get(editRecord, ['_id'])) {
            message.error('Comment Not Found')
            return;
        }

        if (props.editMode != 'edit' && !_.get(post, ['_id'])) {
            message.error('Post Not Found')
            return;
        }
        setConfirmLoading(true)
        form.validateFields((err, values) => {
            if (err) {
                setConfirmLoading(false)
                return;
            }

            let fileList = _.cloneDeep(imageList)

            let promiseArr = []
            let imageFile = ''

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
                        fileList = res[0]

                        let finalfileList = []
                        finalfileList = fileList
                        if (!finalfileList) { finalfileList = [] }

                        client.authenticate()
                            .then((res) => {
                                //patch
                                if (props.editMode) {
                                    if (_.isEmpty(props.editMode) === false) {
                                        if (props.editMode === 'edit') {

                                            client.service('chatmessages')
                                                .patch(editRecord._id, {
                                                    message: text,
                                                    chatId: post._id,
                                                    userId: _.get(props.user, ['info', 'user', '_id']),
                                                    mediaList: finalfileList,
                                                })
                                                .then((res1) => {
                                                    form.resetFields();
                                                    setVisible(false);

                                                    if (props.onUpdate) {
                                                        res1.userId = res.user;
                                                        props.onUpdate(res1);
                                                    }
                                                    closeModal();
                                                    setConfirmLoading(false)
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    message.error("Unable to write a Post. T.T")
                                                    setConfirmLoading(false)

                                                })
                                            return
                                        }
                                    }
                                } else {
                                    //create
                                    client.service('chatmessages')
                                        .create({
                                            message: text,
                                            chatId: post._id,
                                            userId: _.get(props.user, ['info', 'user', '_id']),
                                            mediaList: finalfileList,
                                        })
                                        .then((res1) => {
                                            form.resetFields();
                                            setVisible(false);
                                            // if (props.refreshData) {
                                            //     props.refreshData();
                                            // }
                                            if (props.onCreate) {
                                                res1.userId = res.user;
                                                props.onCreate(res1);
                                            }
                                            setConfirmLoading(false)
                                            closeModal();
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            message.error("Unable to write a Post. T.T")
                                            setConfirmLoading(false)

                                        })
                                }
                            })
                    })
                })

        });
    };



    function handleImageRemove2(record) {
        let oldFileList = _.cloneDeep(imageList)
        var newFileList = _.filter(oldFileList, function (val) {
            return val.uid !== record.uid
        });
        setImageList(newFileList)
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
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    };

    function handleChangeAdsImage(e) {
        e.fileList = e.fileList.slice(-26);

        e.fileList.map(function (v) {
            if (v.url) { return }
            v.ObjectUrl = URL.createObjectURL(v.originFileObj)
        });

        setImageList(e.fileList)
        // this.props.form.setFieldsValue({ adsImage: e.fileList });
    }

    function handleCancel() {

    }

    let emojiPosition = { bottom: -360, right: 0 }

    return (
        <React.Fragment>

            <Modal
                title="New Comment"
                visible={visible}
                onCancel={(e) => { closeModal() }}
                onOk={(e) => { onSubmit() }}
                okText="Submit"
                confirmLoading={confirmLoading}
            >
                <Spin spinning={confirmLoading}>

                    <Form layout="vertical">

                        {imageList && !props.hideImage ?
                            <Form.Item
                                wrapperCol={{ span: 24 }}>
                                {
                                    getFieldDecorator('imageList', {
                                        rules: [{ required: false, message: 'Please Upload Photo.' }]
                                    })(
                                        <div className="clearfix createCarAds">
                                            <Row gutter={6}  >


                                                <ReactSortable
                                                    invertSwap={true}
                                                    animation={300}
                                                    list={notEmptyLength(imageList) ? imageList : []}
                                                    setList={newState => setImageList(newState)}
                                                >

                                                    {imageList.map((item, idx) => (
                                                        <Col key={'image' + idx} xl={8} xs={12} md={12} xs={24} style={{ maxWidth: '300px', maxHeight: '250px' }}>
                                                            {item.url
                                                                ?
                                                                <div className="containerCarAdsImg">
                                                                    <div className='containerCarAdsImgBackGround'>
                                                                        <img alt="header" src={item.url} />
                                                                    </div>
                                                                    <Tooltip title="Click to Remove">
                                                                        <Icon onClick={() => { handleImageRemove2(item) }} className="removeImage" type="close-circle" theme="filled" />
                                                                    </Tooltip>
                                                                    {
                                                                        idx === 0 ?
                                                                            <span className='seqCount'>{idx + 1 + '/Main'}</span>
                                                                            : <span className='seqCount'>{idx + 1}</span>
                                                                    }

                                                                </div>
                                                                :
                                                                <div className="containerCarAdsImg">
                                                                    <div className='containerCarAdsImgBackGround'>
                                                                        <img alt="header" src={item.ObjectUrl} />
                                                                    </div>
                                                                    <Tooltip title="Click to Remove">
                                                                        <Icon onClick={() => { handleImageRemove2(item) }} className="removeImage" type="close-circle" theme="filled" />
                                                                    </Tooltip>
                                                                    <span className='seqCount'>{idx + 1}</span>

                                                                </div>
                                                            }

                                                        </Col>
                                                    ))}

                                                </ReactSortable>
                                            </Row>
                                            <Upload
                                                accept='.png,.jpeg,.jpg'
                                                multiple={true}
                                                key="uploadCarImage"
                                                beforeUpload={() => false}
                                                listType="picture-card"
                                                fileList={imageList}
                                                showUploadList={false}
                                                onPreview={(e) => { handlePreview(e) }}
                                                onChange={(e) => {
                                                    handleChangeAdsImage(e)
                                                }}
                                            >
                                                {imageList.length >= 27 ? null : uploadButton}
                                            </Upload>

                                            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                            </Modal>
                                        </div>
                                    )
                                }
                            </Form.Item>
                            : ''}



                        <Form.Item >
                            <SocialInput
                                height={100}
                                editMode={props.editMode == 'edit' ? true : false}
                                text={props.editMode == 'edit' ? editRecord.message : ''}
                                placeholder="Please enter your comment (maximum 1000 characters)"
                                className="flex-items-align-start"
                                onChange={(text, finalText) => {
                                    setText(finalText);
                                }}
                                excludeEnter
                                resetIndicator={resetIndicator}
                            >

                            </SocialInput>
                        </Form.Item>

                    </Form>
                </Spin>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CommentModal)));