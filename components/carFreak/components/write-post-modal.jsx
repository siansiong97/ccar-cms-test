import { Col, Form, Icon, Input, message, Modal, Row, Spin, Tooltip, Upload } from 'antd';
import axios from 'axios';
import Compress from "browser-image-compression";
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSortable } from "react-sortablejs";
import { v4 } from 'uuid';
import client from '../../../feathers';
import { loading, loginMode } from '../../../redux/actions/app-actions';
import SocialInput from './social-input';
import { setUser } from '../../../redux/actions/user-actions';
import { notEmptyLength } from '../../../common-function';
const { TextArea } = Input;


const titleInputRef = React.createRef();
const contentInputRef = React.createRef();
const IMAGE_LIMIT = 10;
const WritePostModal = (props) => {


    const [newPostModal, setNewPostModal] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [editRecord, setEditRecord] = useState({});
    const [text, setText] = useState('');
    const [resetIndicator, setResetIndicator] = useState('');
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        location: '',
    });


    const uploadButton = (
        <div style={{ padding: '5%' }}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    useEffect(() => {
        let visibleMode = props.visibleMode ? props.visibleMode === true ? true : false : false
        if (_.isEmpty(props.currentRecord) === false) {
            if (props.currentRecord !== editRecord) {
                let imageList = _.cloneDeep(props.currentRecord.mediaList)

                if (imageList) {
                    var uid = 0
                    imageList.map(function (v) {
                        v.uid = uid + 1
                        uid++
                        return v
                    })
                }

                setImageList(imageList)
                setEditRecord(props.currentRecord)
                setPostData(props.currentRecord)
            }
        }

        if ((!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) && visibleMode === true) {
            props.loginMode(true);
            message.error('Please login first');
            visibleMode = false;
            closeModal();
        }

        setNewPostModal(visibleMode)

    });


    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    function closeModal() {
        props.changeVisibleMode(false);
        setResetIndicator(v4());
        setEditRecord({})
        setImageList([])
        setNewPostModal(false)
    }

    function onSubmit() {

        setConfirmLoading(true)
        if (!_.get(postData, ['title'])) {
            setTimeout(() => {
                setConfirmLoading(false)
            }, 1000);
            message.error("Please input title.");
            return;
        }

        if (!_.get(postData, ['content'])) {
            setTimeout(() => {
                setConfirmLoading(false)
            }, 1000);
            message.error("Please input content.");
            return;
        }


        let fileList = _.cloneDeep(imageList)

        if (props.chatType === 'carfreaks') {
            if (fileList.length <= 0) {
                setConfirmLoading(false)
                return message.error("Please upload Image.")
            }
        }

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

                                        client.service('chats')
                                            .patch(editRecord._id, {
                                                title: postData.title,
                                                content: postData.content,
                                                location: postData.location || '',
                                                mediaList: finalfileList,
                                            })
                                            .then((res1) => {
                                                closeModal();

                                                if (props.onUpdatePost) {

                                                    res1.userId = res.user;
                                                    props.onUpdatePost(res1);
                                                }
                                                setNewPostModal(false)
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
                                client.service('chats')
                                    .create({
                                        userId: res.user._id,
                                        title: postData.title,
                                        content: postData.content,
                                        location: postData.location || '',
                                        postDate: new Date(),
                                        mediaList: fileList,
                                        chatType: props.chatType,
                                    })
                                    .then((res1) => {
                                        closeModal();
                                        // if (props.refreshData) {
                                        //     props.refreshData();
                                        // }
                                        if (props.onCreatePost) {
                                            res1.userId = res.user;
                                            props.onCreatePost(res1);
                                        }
                                        setNewPostModal(false)
                                        setConfirmLoading(false)
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
        e.fileList = e.fileList.slice(-IMAGE_LIMIT);

        e.fileList.map(function (v) {
            if (v.url) { return }
            v.ObjectUrl = URL.createObjectURL(v.originFileObj)
        });

        setImageList(e.fileList)
    }

    function handleCancel() {

    }

    let emojiPosition = { bottom: -360, right: 0 }

    return (
        <React.Fragment>
            <Modal
                title={props.editMode == 'edit' ? 'Edit Post' : 'New Post'}
                visible={newPostModal}
                onCancel={(e) => { closeModal() }}
                onOk={(e) => { onSubmit() }}
                okText="Submit"
                maskClosable={false}
                confirmLoading={confirmLoading}
            >
                <Spin spinning={confirmLoading}>


                    <Form layout="vertical">
                        <Form.Item>
                            <SocialInput
                                inputRef={titleInputRef}
                                height={30}
                                placement="bottom"
                                resetIndicator={resetIndicator}
                                editMode={props.editMode == 'edit' ? true : false}
                                text={props.editMode == 'edit' ? editRecord.title : ''}
                                placeholder="Topic Title(max 200)"
                                className="flex-items-align-start"
                                onChange={(text, finalText) => {
                                    setPostData({ ...postData, title: finalText });
                                }}
                                emojiPosition={{ right: 33, top: -244 }}
                                maxLength={200}
                            >

                            </SocialInput>
                        </Form.Item>


                        {imageList && props.chatType === 'carfreaks' ?
                            <Form.Item
                                wrapperCol={{ span: 24 }}>
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
                            </Form.Item>
                            : ''}

                        <Form.Item >
                            <SocialInput
                                inputRef={contentInputRef}
                                height={100}
                                resetIndicator={resetIndicator}
                                editMode={props.editMode == 'edit' ? true : false}
                                text={props.editMode == 'edit' ? editRecord.content : ''}
                                placeholder="Please enter your content (maximum 1000 characters)"
                                className="flex-items-align-start"
                                onChange={(text, finalText) => {
                                    setPostData({ ...postData, content: finalText });
                                }}
                                emojiPosition={{ right: 33, top: -244 }}
                                maxLength={1000}
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
    loginMode: loginMode,
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WritePostModal)));