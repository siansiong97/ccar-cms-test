import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, message, Icon, Modal, Tooltip, Upload, Spin, Button, Avatar, Radio } from 'antd';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import {
    loading, loginMode
} from '../../../actions/app-actions';
import { setUser } from '../../../actions/user-actions';
import _, { isEmpty, set } from 'lodash';
import client from '../../../feathers'
import { ReactSortable } from "react-sortablejs";
import { watermark } from '../../../assets/images';
import axios from 'axios';
import Compress from "browser-image-compression";
import EmojiPickerButton from '../../commonComponent/emoji-picker-button';
import { notEmptyLength, getUserName } from '../../profile/common-function';
import { writePostIcon } from '../../../icon';
import UserAvatar from './user-avatar';
import RadioGroup from 'antd/lib/radio/group';
import SocialInput from './social-input';
import { v4 } from 'uuid';
const { TextArea } = Input;



const titleInputRef = React.createRef();
const contentInputRef = React.createRef();
const IMAGE_LIMIT = 10;
const WritePostModal1 = (props) => {

    var img2 = new Image();
    img2.src = watermark

    const [visible, setVisible] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [origImageList, setOrigImageList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [post, setPost] = useState({});
    const [chatType, setChatType] = useState('carfreaks');
    const [resetIndicator, setResetIndicator] = useState('');


    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data) && visible && props.editMode) {

            setPost(props.data);
            setChatType(_.get(props.data, ['chatType']))
            setOrigImageList(_.get(props, ['data', 'mediaList']) || []);

            let imageList = _.get(props, ['data', 'mediaList']) || [];
            if (_.isArray(imageList) && !_.isEmpty(imageList)) {
                var uid = 0
                imageList = imageList.map(function (v) {
                    v.uid = uid + 1
                    uid++
                    return v;
                })
            }
            setImageList(imageList || []);
        } else {
            setPost({});
            setOrigImageList([]);
            setImageList([]);
        }
    }, [props.data, visible, props.editMode])


    useEffect(() => {
        if ((!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) && props.visible) {
            console.log('vabrawbrbwabwbaw');
            props.loginMode(true);
            message.error('Please login first');
            setVisible(false)
        } else {
            setVisible(props.visible)
        }
    }, [props.visible])

    useEffect(() => {
        setChatType(props.chatType == 'socialboard' ? 'socialboard' : 'carfreaks')
    }, [props.chatType])


    function closeModal() {
        if (props.onCancel) {
            props.onCancel();
        }
        setResetIndicator(v4())
        setPost({})
        setImageList([]);
        setOrigImageList([]);
        setVisible(false)
    }

    function onSubmit() {

        setConfirmLoading(true)

        if (!_.get(post, ['title'])) {
            setTimeout(() => {
                setConfirmLoading(false)
            }, 1000);
            message.error("Please input title.");
            return;
        }

        if (!_.get(post, ['content'])) {
            setTimeout(() => {
                setConfirmLoading(false)
            }, 1000);
            message.error("Please input content.");
            return;
        }

        let fileList = _.cloneDeep(imageList)

        if (chatType === 'carfreaks') {
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
                                    'Authorization': client.settings.accessToken,
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
                                updatePost(post._id, {
                                    title: post.title,
                                    content: post.content,
                                    location: post.location || '',
                                    mediaList: finalfileList,
                                })
                                return
                            } else {
                                //create
                                let data = {
                                    userId: res.user._id,
                                    title: post.title,
                                    content: post.content,
                                    location: post.location || '',
                                    postDate: new Date(),
                                    mediaList: fileList,
                                    chatType: chatType,
                                };

                                if (props.parentType && props[`${props.parentType}Id`]) {
                                    data.parentType = props.parentType;
                                    data[`${props.parentType}Id`] = props[`${props.parentType}Id`];
                                }
                                createPost(data);
                            }
                        })
                })
            })

    };



    function handleImageRemove(record) {
        let oldFileList = _.cloneDeep(imageList)
        var newFileList = _.filter(oldFileList, function (val) {
            return val.uid !== record.uid
        });
        setImageList(newFileList)
    }

    function handleImageChange(e) {
        e.fileList = e.fileList.slice(-IMAGE_LIMIT);

        e.fileList.map(function (v) {
            if (v.url) { return }
            v.ObjectUrl = URL.createObjectURL(v.originFileObj)
        });

        setImageList(e.fileList)
    }

    function createPost(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            client.authenticate()
                .then((res) => {
                    client.service('chats')
                        .create(data)
                        .then((res1) => {
                            closeModal();
                            if (props.notify) {
                                message.success('Post created!');
                            }
                            if (props.onCreatePost) {
                                res1.userId = res.user;
                                props.onCreatePost(res1);
                            }
                            setConfirmLoading(false)
                        })
                        .catch((err) => {
                            console.log(err);
                            message.error("Unable to write a Post. T.T")
                            setConfirmLoading(false)
                        })
                }).catch(err => {
                    setConfirmLoading(false);
                    message.error(err.message)
                });
        }
    }

    function updatePost(id, data) {
        if (id && _.isPlainObject(data) && !_.isEmpty(data)) {
            client.authenticate()
                .then((res) => {
                    client.service('chats')
                        .patch(id, data)
                        .then((res1) => {
                            closeModal();

                            if (props.notify) {
                                message.success('Post updated!');
                            }
                            if (props.onUpdatePost) {

                                res1.userId = res.user;
                                props.onUpdatePost(res1);
                            }
                            setVisible(false)
                            setConfirmLoading(false)
                        })
                        .catch((err) => {
                            console.log(err);
                            message.error("Unable to write a Post. T.T")
                            setConfirmLoading(false)

                        })
                }).catch(err => {
                    setConfirmLoading(false);
                    message.error(err.message)
                });
        }
    }
    return (
        <React.Fragment>
            <Modal
                title={props.editMode ? 'Edit Post' : 'New Post'}
                visible={visible}
                onCancel={(e) => { closeModal() }}
                onOk={(e) => { onSubmit() }}
                okText="Submit"
                maskClosable={false}
                confirmLoading={confirmLoading}
            >
                <Spin spinning={confirmLoading}>
                    <div className="flex-justify-space-between flex-items-align-start">
                        <span className='d-inline-block' >
                            <div className="flex-justify-start flex-items-align-center margin-bottom-md">
                                <UserAvatar data={_.get(props.user, ['info', 'user'])} size={50} className="margin-right-md" />
                                <span className='d-inline-block' >
                                    <div className="headline text-truncate black">
                                        {getUserName(_.get(props.user, ['info', 'user']), 'fullName') || ''}
                                    </div>

                                    {
                                        chatType == 'carfreaks' ?
                                            <Upload
                                                accept='.png,.jpeg,.jpg'
                                                multiple={true}
                                                key="uploadCarImage"
                                                beforeUpload={() => false}
                                                fileList={imageList}
                                                showUploadList={false}
                                                onChange={(e) => {
                                                    handleImageChange(e)
                                                }}
                                            >
                                                <div className="flex-justify-start flex-items-align-center thin-border margin-top-sm padding-x-sm cursor-pointer" style={{ borderRadius: '2px' }}>
                                                    <span className='d-inline-block small-text grey-darken-2' >
                                                        <Icon type="file-image" className="margin-right-sm" />
                                                            Photo / Video
                                                    </span>
                                                </div>
                                            </Upload>
                                            :
                                            null
                                    }
                                </span>
                            </div>
                        </span>
                        <span className='d-inline-block' >
                            <RadioGroup className=" round-border-radio-button" value={chatType} buttonStyle="solid">
                                <Radio.Button className="round-border-right" value="carfreaks" onClick={(e) => {
                                    setChatType('carfreaks')
                                }}>
                                    CarFreaks
                                </Radio.Button>
                                <Radio.Button className="round-border-left" value="socialboard" onClick={(e) => {
                                    setChatType('socialboard')
                                }}>
                                    Social Board
                                </Radio.Button>
                            </RadioGroup>
                        </span>
                    </div>

                    {
                        _.isArray(imageList) && !_.isEmpty(imageList) && chatType == 'carfreaks' ?

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
                                                            <Icon onClick={() => { handleImageRemove(item) }} className="removeImage" type="close-circle" theme="filled" />
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
                                                            <Icon onClick={() => { handleImageRemove(item) }} className="removeImage" type="close-circle" theme="filled" />
                                                        </Tooltip>
                                                        <span className='seqCount'>{idx + 1}</span>

                                                    </div>
                                                }

                                            </Col>
                                        ))}

                                    </ReactSortable>
                                </Row>
                            </div>
                            :
                            null
                    }


                    <Form layout="vertical">
                        <Form.Item>
                            <SocialInput
                                inputRef={titleInputRef}
                                height={30}
                                resetIndicator={resetIndicator}
                                placement="bottom"
                                editMode={props.editMode}
                                text={props.editMode && visible ? _.get(props.data, ['title']) || '' : ''}
                                placeholder="Topic Title(max 200)"
                                className="flex-items-align-start"
                                onChange={(text, finalText) => {
                                    setPost({ ...post, title: finalText });
                                }}
                                emojiPosition={{ right: 33, top: -20 }}
                            >
                            </SocialInput>
                        </Form.Item>

                        <Form.Item >

                            <SocialInput
                                inputRef={contentInputRef}
                                height={100}
                                resetIndicator={resetIndicator}
                                editMode={props.editMode}
                                text={props.editMode && visible ? _.get(props.data, ['content']) || '' : ''}
                                placeholder="Please enter your content (maximum 1000 characters)"
                                className="flex-items-align-start"
                                onChange={(text, finalText) => {
                                    setPost({ ...post, content: finalText });
                                }}
                                emojiPosition={{ right: 33, top: -244 }}
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
    loginMode : loginMode,
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WritePostModal1)));