import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Tooltip, Upload } from 'antd';
import { CloseOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import {
    loading
} from '../../actions/app-actions';
import { setUser } from '../../actions/user-actions';
import _, { isEmpty, set } from 'lodash';
import client from '../../feathers'
import { notEmptyLength, isSavedWishList, isValidNumber } from '../profile/common-function';
import { colorList } from '../../params/colorList';
import { ReactSortable } from "react-sortablejs";
import { watermark } from '../../assets/images/';
import axios from 'axios';
const { TextArea } = Input;


const PostModal = (props) => {

    var img2 = new Image();
    img2.src = watermark

    const [newPostModal, setNewPostModal] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);


    const { form } = props;
    const { getFieldDecorator } = form;
    const uploadButton = (
        <div style={{ padding: '5%' ,borderRadius:'60px'}}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    useEffect(() => {
        let visibleMode = props.visibleMode ? props.visibleMode === true ? true : false : false
        setNewPostModal(visibleMode)
    });

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    function closeModal() {
        props.changeVisibleMode(false);
        setNewPostModal(false)
    }

    function onCreate() {
        const { form } = props;

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
                    imageFile = new Promise(resolve => {
                        const reader = new FileReader();
                        reader.readAsDataURL(imgObj);
                        reader.onload = () => {
                            const img = document.createElement('img');
                            img.src = reader.result;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width
                                canvas.height = img.height
                                const ctx = canvas.getContext('2d');
                                ctx.webkitImageSmoothingEnabled = false;
                                ctx.mozImageSmoothingEnabled = false;
                                ctx.imageSmoothingEnabled = false;
                                let dimensions = {
                                    max_height: 800,
                                    max_width: 600,
                                    width: 800, // this will change
                                    height: 600, // this will change
                                    largest_property: function () {
                                        return this.height > this.width ? "height" : "width";
                                    },
                                    read_dimensions: function (img) {
                                        this.width = img.width;
                                        this.height = img.height;
                                        return this;
                                    },
                                    scaling_factor: function (original, computed) {
                                        return computed / original;
                                    },
                                    scale_to_fit: function () {
                                        var x_factor = this.scaling_factor(this.width, this.max_width),
                                            y_factor = this.scaling_factor(this.height, this.max_height),

                                            largest_factor = Math.min(x_factor, y_factor);

                                        this.width *= largest_factor;
                                        this.height *= largest_factor;
                                    }
                                };

                                dimensions.read_dimensions(img).scale_to_fit();
                                canvas.width = dimensions.width;
                                canvas.height = dimensions.height;
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                let x = canvas.width * 0.7
                                let y = canvas.height / 2
                                // ctx.drawImage(img2, x, y, 160, 45);

                                canvas.toBlob(resolve);
                            };
                        };

                    })

                    promiseArr.push(imageFile.then((res) => {
                        fileList[i].originFileObj = res
                        return fileList[i]
                    }))

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
                                        'Authorization': client.settings.accessToken,
                                        'Content-Type': 'multipart/form-data',
                                    }
                                }
                            ).then((res) => {
                                let imageListResult = []
                                try {imageListResult = res.data.result}catch (err) {imageListResult = []}
                                _.map(imageListResult, function (v) {fileList.push(v)});
                                fileList = _.map(fileList, function (v) {if (v.url) {return v}});
                                return fileList = _.without(fileList, undefined)
                            })
                        )
                    }

                    Promise.all(uploadPromiseArr).then((res) => {
                        fileList = res[0]
                        client.authenticate()
                            .then((res) => {
                                client.service('clubs')
                                    .create({
                                        userId: res.user._id,
                                        clubName: values.clubName,
                                        clubBrand: values.clubBrand,
                                        clubBio: values.clubBio,
                                        clubDescription: values.clubDescription,
                                        mediaList: fileList,
                                        chatType: props.chatType,
                                    })
                                    .then((res) => {
                                        form.resetFields();
                                        props.changeVisibleMode(false);
                                        props.refreshData();
                                        setNewPostModal(false)
                                        setConfirmLoading(false)
                                    })
                                    .catch((err) => {
                                        message.error("Unable to write a Post. T.T")
                                        setConfirmLoading(false)

                                    })
                            })
                    })
                })

        });
    };

 

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
        e.fileList = e.fileList.slice(-1);
        e.fileList.map(function (v) {
            v.ObjectUrl = URL.createObjectURL(v.originFileObj)
        });
        setImageList(e.fileList)
    }

    function handleCancel() {

    }


    return (
        <Modal
            title="New Club"
            visible={newPostModal}
            onCancel={(e) => { closeModal() }}
            onOk={(e) => { onCreate() }}
            okText="Submit"
            confirmLoading={confirmLoading}
        >
            <Form layout="vertical">
 
                <Form.Item
                    wrapperCol={{ span: 24 }}>
                    {
                        getFieldDecorator('imageList', {
                            rules: [{ required: false, message: 'Please Upload Photo.' }]
                        })(
                            <div className="carfreakClub">
                                
                                <Upload
                                    accept='.png,.jpeg,.jpg'
                                    key="uploadCarImage"
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    fileList={imageList}
                                    showUploadList={false}
                                    onPreview={(e) => { handlePreview(e) }}
                                    onChange={(e) => { handleChangeAdsImage(e)}}
                                >
                                    {imageList.length > 0 ?  <img src={imageList[0].ObjectUrl} alt="avatar" style={{ width: '100%' }} />  : uploadButton}
                                </Upload>

                                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        )
                    }
                </Form.Item>


                <Form.Item >
                    {getFieldDecorator('clubName', {
                        rules: [{ required: true, message: 'Please input.' }],
                    })(<Input placeholder="Club Name" />)}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator('carBrand', {
                        rules: [{ required: true, message: 'Please input.' }],
                    })(<Input placeholder="Car Brand" />)}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator('clubBio', {
                        rules: [{ required: true, message: 'Please input.' }],
                    })(<Input placeholder="Add Bio" maxLength={2000} />)}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator('clubDescription', {
                        rules: [{ required: true, message: 'Please input.' }],
                    })(<TextArea rows={4} placeholder="Please enter your content (maximum 1000 characters)" maxLength={1000} />)}
                </Form.Item>

            </Form>

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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PostModal)));