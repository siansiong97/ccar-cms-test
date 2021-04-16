import { Avatar, Button, Col, Form, Icon, Input, message, Modal, Rate, Row, Select, Tooltip, Upload } from 'antd';
import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import { withRouter } from 'next/router';
import QueueAnim from 'rc-queue-anim';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import ScrollContainer from 'react-indiana-drag-scroll';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { isValidNumber, notEmptyLength } from '../../common-function';
import client from '../../feathers';
import { getStateIcon, StateList } from '../../params/stateList';
import { loading, loginMode } from '../../redux/actions/app-actions';


const { TextArea } = Input;
var moment = require('moment');

const FORM_CONTAINER_SIZE = 500;
const IMAGELIMIT = 7;
const VIDEOLIMIT = 1;


const WriteReviewButton = (props) => {


    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState("Add Post");
    const [run, setRun] = useState(true);
    const [timeoutFunction, setTimeoutFunction] = useState();
    const [previewType, setPreviewType] = useState('image');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState({});
    const [previewVideo, setPreviewVideo] = useState({});

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, isFieldValidating } = props.form;

    const [view, setView] = useState('add');
    const [reviewForm, setReviewForm] = useState({
        rating: null,
        title: null,
        comment: null,
        type: null,
        productId: null,
        userId: null,
        reviewerId: null,
        companyId: null,
        carspecId: null,
        images: [],
        videos: [],
        state: null,
    });


    const [filteredState, setFilteredState] = useState([]);
    const [searchStateWords, setSearchStateWords] = useState([])
    const [origImages, setOrigImages] = useState([]);
    const [origVideos, setOrigVideos] = useState([]);
    const [writer, setWriter] = useState({});
    const [mode, setMode] = useState('add');
    const [buttonLoading, setButtonLoading] = useState(false);
    // Only show error after a field is touched.
    const ratingError = (isFieldTouched('rating') || !isFieldValidating('rating')) && getFieldError('rating');
    const commentError = (isFieldTouched('comment') || !isFieldValidating('comment')) && getFieldError('comment');
    const titleError = (isFieldTouched('title') || !isFieldValidating('title')) && getFieldError('title');
    const selectionError = (isFieldTouched('selection') || !isFieldValidating('selection')) && getFieldError('selection');




    useEffect(() => {
        if (props.mode) {
            if (props.mode == 'edit') {
                setMode('edit');
            } else {
                setMode('add');
            }
        }

    }, [props.mode])

    useEffect(() => {

        props.form.setFieldsValue(reviewForm);
        switch (view) {
            case 'edit':
                setTitle('Edit Post')
                break;
            case 'add':
                setTitle('Add Post')
                break;
            case 'state':
                setTitle(
                    <React.Fragment>
                        <span className="margin-right-sm ">
                            <a onClick={() => {
                                setView(props.mode == "edit" ? "edit" : "add")
                            }} className="black">
                                <Icon type="left" />
                            </a>
                        </span>
                        <span className="margin-x-sm">
                            Select State
                     </span>
                    </React.Fragment>
                )
                filterState(null);
                break;
            default:
                setTitle('Add Post')
                break;
        }
    }, [view])
    useEffect(() => {

        if (props.mode == 'edit') {
            setReviewForm(
                {
                    ...reviewForm,
                    _id: props.data._id,
                    rating: props.data.rating ? props.data.rating : null,
                    title: props.data.title ? props.data.title : null,
                    comment: props.data.comment ? props.data.comment : null,
                    state: props.data.state ? props.data.state : null,
                    type: props.data.type ? props.data.type : null,
                    userId: props.data.userId ? props.data.userId : null,
                    reviewerId: props.data.reviewerId ? props.data.reviewerId : null,
                    companyId: props.data.companyId ? props.data.companyId : null,
                    productId: props.data.productId ? props.data.productId : null,
                    carspecId: props.data.carspecId ? props.data.carspecId : null,
                    createdAt: props.data.createdAt ? props.data.createdAt : null,
                    images: props.data.images ? props.data.images : [],
                    videos: props.data.videos ? props.data.videos : [],
                }
            )
            setOrigImages(props.data.images ? props.data.images : []);
            setOrigVideos(props.data.videos ? props.data.videos : []);
        } else {
            setReviewForm(
                {
                    ...reviewForm,
                    rating: null,
                    comment: null,
                    title: null,
                    state: null,
                    type: props.data.type ? props.data.type : null,
                    userId: props.data.userId ? props.data.userId : null,
                    reviewerId: props.data.reviewerId ? props.data.reviewerId : null,
                    companyId: props.data.companyId ? props.data.companyId : null,
                    productId: props.data.productId ? props.data.productId : null,
                    carspecId: props.data.carspecId ? props.data.carspecId : null,
                    images: props.data.images ? props.data.images : [],
                    videos: props.data.videos ? props.data.videos : [],
                }
            )
            setOrigImages([]);
            setOrigVideos([]);
        }
    }, [props.data])

    useEffect(() => {

        let form = _.cloneDeep(reviewForm);
        form.selection = reviewForm[reviewForm.type + 'Id'];
        if (visible && props.data.reviewerId) {
            props.form.setFieldsValue({ selection: form.selection });
        }

    }, [reviewForm])

    useEffect(() => {


        if (run) {
            setRun(false);
            //only run every 2 seconds
            setTimeout(() => {
                setRun(true);
            }, 2000);


            if (visible && !props.data.reviewerId) {
                props.loginMode(true);
                handleError({ message: 'Please login to write review' });
            }

            if (mode == 'add') {
                if (visible && (!props.data[props.data.type + 'Id'] && !notEmptyLength(props.selection))) {
                    handleError({ message: 'Item not Found' });
                }
            }
        }
    })


    useEffect(() => {
        setView(mode == 'edit' ? 'edit' : 'add');
    }, [mode])


    useEffect(() => {
        if (reviewForm.reviewerId) {
            props.loading(true);
            client.authenticate()
                .then((res) => {
                    props.loading(false);
                    client.service('users').get(reviewForm.reviewerId).then((res) => {
                        if (res) {
                            setWriter(res);
                        } else {
                            setWriter({});
                        }
                    })
                })
                .catch((err) => {
                    props.loading(false);
                    setButtonLoading(false);
                    handleError({ message: 'Error on getting user.' });
                })
        } else {
            setWriter({});
        }
    }, [reviewForm.reviewerId])


    function handleCancel() {
        setPreviewVisible(false);
    }


    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function handlePreview(file, type) {

        if (type == 'video') {
            setPreviewType('video');
            setPreviewVisible(true)
            setPreviewVideo(
                {
                    url: file.url,
                    name: file.name
                })
        } else {
            setPreviewType('image');
            setPreviewVisible(true)
            setPreviewImage(
                {
                    url: file.url,
                    name: file.name
                })
        }
    }

    function handleDelete(file, type) {

        if (!file || !file._id) {
            //handle Error
            message.error(type == 'video' ? "Video not found." : 'Image not found.')
        } else {
            if (type == 'video') {

                let data = _.filter(reviewForm.videos, function (item) {
                    return item._id != file._id;
                });
                if (notEmptyLength(data)) {
                    setReviewForm({ ...reviewForm, videos: data });
                } else {
                    setReviewForm({ ...reviewForm, videos: [] })
                }
            } else {

                let data = _.filter(reviewForm.images, function (item) {
                    return item._id != file._id;
                });
                if (notEmptyLength(data)) {
                    setReviewForm({ ...reviewForm, images: data });
                } else {
                    setReviewForm({ ...reviewForm, images: [] })
                }
            }
        }
    }

    function handleSuccess(success) {
        setVisible(false);
        if (props.handleSuccess) {
            props.handleSuccess(success);
        }
    }


    function handleError(error) {
        setVisible(false);
        if (props.handleError) {
            props.handleError(error);
        }
    }
    function timeout(func, time) {
        if (!isValidNumber(time)) {
            time = 500;
        }
        clearTimeout(timeoutFunction);
        setTimeoutFunction(setTimeout(() => {
            return func
        }, parseInt(time)))
    }

    function filterState(v) {
        if (v) {
            let regex = new RegExp(`^.*${v}.*$`, 'i')
            setFilteredState(StateList.filter(function (state) {
                return regex.test(state.value);
            }))
            setSearchStateWords([v]);
        } else {
            setSearchStateWords([]);
            setFilteredState(StateList);
        }
    }

    function reset() {
        setView(mode == "edit" ? "edit" : "add");
        props.form.resetFields();
        setReviewForm({ ...reviewForm, images: origImages, videos: origVideos, state: props.data.state ? props.data.state : null, });
        setButtonLoading(false);
    }

    function reviewModalVisible() {
        if (props.data.reviewerId) {
            setVisible(true)
        }
        else {
            props.loginMode(true);
            handleError({ message: 'Please login to write review' });
        }

    }

    function onChangeImage(fileList) {

        if (notEmptyLength(fileList)) {
            if (fileList.length > IMAGELIMIT) {
                fileList = fileList.slice(0, IMAGELIMIT);
            }

            let data = fileList.map(function (file) {
                if (file.originFileObj) {
                    getBase64(file.originFileObj).then(res => {
                        file.url = res
                    })

                    file._id = file.uid;
                }
                return file;
            })
            data = _.union(data, reviewForm.images)
            setReviewForm({ ...reviewForm, images: data });
        }


    }

    function onChangeVideo(fileList) {


        if (notEmptyLength(fileList)) {
            if (fileList.length > VIDEOLIMIT) {
                fileList = fileList.slice(0, VIDEOLIMIT);
            }
            let data = fileList.map(function (file) {
                if (file.originFileObj) {
                    getBase64(file.originFileObj).then(res => {
                        file.url = res
                    })

                    file._id = file.uid;
                }
                return file;
            })

            data = _.union(data, reviewForm.videos)
            setReviewForm({ ...reviewForm, videos: data });
        }
    }

    function hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setButtonLoading(true);
        props.form.validateFields((err, values) => {
            if (!err) {
                let insertImages = [];
                let removeImages = [];
                let insertVideos = [];
                let removeVideos = [];
                let finalData = _.cloneDeep(reviewForm);
                let images = _.cloneDeep(reviewForm.images);
                let videos = _.cloneDeep(reviewForm.videos);
                let promises = [];

                //get new upload images
                if (notEmptyLength(images)) {

                    insertImages = insertImages.concat(images.filter(function (image) {
                        return _.has(image, "originFileObj")
                    }));

                    if (insertImages.length > 0) {
                        let formData = new FormData();
                        for (let i = 0; i < insertImages.length; i++) {
                            var fileName = uuidv4() + "-" + insertImages[i].name.split('.').join("-") + "-" + new Date().getTime();

                            formData.append('images', insertImages[i].originFileObj, fileName);
                        }

                        //Upload Image
                        promises.push(
                            axios.post(`${client.io.io.uri}upload-images-array`,
                                formData
                                , {
                                    headers: {
                                        'Authorization': client.settings.storage.storage.storage['feathers-jwt'],
                                        'Content-Type': 'multipart/form-data',
                                    }
                                }
                            )
                        )
                    }
                }

                //get new upload videos
                if (notEmptyLength(videos)) {

                    insertVideos = insertVideos.concat(videos.filter(function (video) {
                        return _.has(video, "originFileObj")
                    }));


                    if (insertVideos.length > 0) {
                        let formData = new FormData();
                        for (let i = 0; i < insertVideos.length; i++) {
                            var fileName = uuidv4() + "-" + insertVideos[i].name.split('.').join("-") + "-" + new Date().getTime();

                            formData.append('videos', insertVideos[i].originFileObj, fileName);
                        }

                        //Upload Image
                        promises.push(
                            axios.post(`${client.io.io.uri}upload-videos-array`,
                                formData
                                , {
                                    headers: {
                                        'Authorization': client.settings.storage.storage.storage['feathers-jwt'],
                                        'Content-Type': 'multipart/form-data',
                                    }
                                }
                            )
                        )
                    }
                }

                //get removed images
                if (mode == 'edit') {

                    let diffIds = _.map(_.differenceBy(origImages, images, '_id'), "_id");
                    removeImages = removeImages.concat(_.filter(origImages, function (image) {
                        return _.includes(diffIds, image._id);
                    }))

                    diffIds = _.map(_.differenceBy(origVideos, videos, '_id'), "_id");
                    removeVideos = removeVideos.concat(_.filter(origVideos, function (video) {
                        return _.includes(diffIds, video._id);
                    }))
                }

                props.loading(true);
                //Upload new images to server first
                Promise.all(promises).then((responses) => {
                    props.loading(false);

                    _.forEach(responses, function (res) {
                        if (res.config.url == `${client.io.io.uri}upload-videos-array`) {
                            if (notEmptyLength(res.data.result)) {

                                //Replace new upload videos with url
                                videos = videos.filter(function (video) {
                                    return !_.has(video, "originFileObj")
                                });

                                videos = videos.concat(res.data.result);
                                finalData.videos = videos;
                            }

                        } else {
                            if (notEmptyLength(res.data.result)) {


                                //Replace new upload images with url
                                images = images.filter(function (image) {
                                    return !_.has(image, "originFileObj")
                                });

                                images = images.concat(res.data.result);
                                finalData.images = images
                            }
                        }
                    })



                    promises = [];
                    promises.push(client.authenticate());
                    if (mode == 'add') {
                        promises.push(client.service('rating').create(finalData))
                    } else {
                        promises.push(client.service('rating').patch(finalData._id, finalData))
                    }

                    //Write in rating model
                    if (finalData[finalData.type + "Id"] != null) {
                        props.loading(true);
                        Promise.all(promises).then(([auth, reviewRes]) => {
                            props.loading(false);
                            message.success(mode == "edit" ? 'Edit Successful' : 'Create Successful');
                            handleSuccess(reviewRes);
                            setButtonLoading(false);
                            setOrigImages(reviewRes.images);
                            setOrigVideos(reviewRes.videos);


                            //Remove useless images
                            if (notEmptyLength(removeImages)) {
                                axios.post(`${client.io.io.uri}deleteImageS3`,
                                    {
                                        params: {
                                            imageUrl: removeImages
                                        },
                                        headers: {
                                            'Content-Type': 'text/xml; charset=utf-8',
                                            'Content-Length': 'length'
                                        }
                                    }
                                ).then(res => {
                                })
                            }
                            //Remove useless videos
                            if (notEmptyLength(removeVideos)) {
                                axios.post(`${client.io.io.uri}deleteVideoS3`,
                                    {
                                        params: {
                                            videoUrl: removeVideos
                                        },
                                        headers: {
                                            'Content-Type': 'text/xml; charset=utf-8',
                                            'Content-Length': 'length'
                                        }
                                    }
                                )
                            }

                        })
                    }

                }).catch(err => {
                    props.loading(false);
                    setButtonLoading(false)
                    console.log('err');
                    console.log(err);
                    message.error(err.message)
                });


            } else {
                props.loading(false);
                setButtonLoading(false);
                _.map(err, function (err) {
                    return message.error(err.errors[0].message)
                })

            }
        });
    };

    const _renderImageCard = (data) => {
        if (notEmptyLength(data)) {
            return (
                data.map(function (item) {
                    return <span
                        className={"d-inline-block thin-border margin-right-xs margin-bottom-xs background-white flex-items-no-shrink"}
                        style={{ width: '70px', height: '70px' }}
                    >
                        <div className="relative-wrapper fill-parent">
                            <div className="absolute-center" >
                                <img src={item.url} className="fill-parent" ></img>
                            </div>
                            <div className="absolute-center background-grey-darken-4 stack-element-opacity-50 flex-items-align-center flex-justify-center">
                                <a onClick={(e) => { handlePreview(item, 'image') }}>
                                    <Icon type="eye" className="white margin-x-xs" style={{ fontSize: '20px' }} />
                                </a>
                                <a onClick={(e) => { handleDelete(item, 'image') }}>
                                    <Icon type="delete" className="white margin-x-xs" style={{ fontSize: '20px' }} />
                                </a>
                            </div>
                        </div>
                    </span>
                })
            )

        } else {
            return null;
        }
    }

    const _renderVideoCard = (data) => {
        if (notEmptyLength(data)) {
            return (
                data.map(function (item) {
                    return <span
                        className={"d-inline-block thin-border margin-right-xs margin-bottom-xs background-white flex-items-no-shrink"}
                        style={{ width: '70px', height: '70px' }}
                    >
                        <div className="relative-wrapper fill-parent">
                            <div className="absolute-center" >
                                <ReactPlayer width='100%' height="100%" url={item.url} />
                            </div>
                            <div className="absolute-center background-grey-darken-4 stack-element-opacity-50 flex-items-align-center flex-justify-center">
                                <a onClick={(e) => { handlePreview(item, 'video') }}>
                                    <Icon type="eye" className="white margin-x-xs" style={{ fontSize: '20px' }} />
                                </a>
                                <a onClick={(e) => { handleDelete(item, 'video') }}>
                                    <Icon type="delete" className="white margin-x-xs" style={{ fontSize: '20px' }} />
                                </a>
                            </div>
                        </div>
                    </span>
                })
            )

        } else {
            return null;
        }
    }

    const _renderSelection = (data, text) => {

        if (notEmptyLength(data)) {

            let idType = `${reviewForm.type}Id`;
            return (
                <React.Fragment>
                    <div className="headline  " >
                        {text != null ? text : 'Please select item to review'}
                    </div>

                    <Form.Item required={false} validateStatus={selectionError ? 'error' : ''} help={selectionError || ''} style={{ margin: 0 }}>
                        {getFieldDecorator('selection', {
                            rules: [{ required: true, message: 'Please pick 1 item to review!' }],
                            initialValue: props.data[idType],
                        })(
                            <Select onChange={(v) => {
                                let stateObj = _.cloneDeep(reviewForm);
                                stateObj[idType] = v;
                                setReviewForm(stateObj)
                            }}
                            >
                                {
                                    data.map(function (item) {
                                        return (
                                            <Select.Option key={item._id} value={item._id}>
                                                {item.name}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }


    const _renderForm = () => {

        return (
            <div key="form">

                <Form onSubmit={handleSubmit} >

                    <div style={{ height: FORM_CONTAINER_SIZE * 0.15 + 'px' }} className="scroll-y-wrapper padding-x-sm ">
                        <Form.Item style={{ margin: 0 }}>
                            <Row type="flex" align="top">
                                <Col span={12}>
                                    <div className='flex-items-align-start'>
                                        <span className='d-inline-block margin-right-sm' >
                                            <Avatar size={50} src={writer.avatar ? writer.avatar : null} icon={writer.avatar ? null : 'user'} ></Avatar>
                                        </span>
                                        <span className='d-inline-block flex-items-align-center' >
                                            <span className='d-inline-block'>{writer.firstName ? writer.firstName : null} {writer.lastName ? writer.lastName : null}</span>
                                            {
                                                reviewForm.state ?
                                                    <span className='blue d-inline-block margin-right-sm flex-items-align-center padding-left-xs'> {reviewForm.state}</span>
                                                    :
                                                    null
                                            }
                                        </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="review2">
                                        <p>{reviewForm.createdAt ? moment(reviewForm.createdAt).format('D MMMM Y') : moment().format('D MMMM Y')}</p>
                                    </div>
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>
                    <div style={{ height: FORM_CONTAINER_SIZE * 0.75 + 'px' }} className="scroll-y-wrapper padding-x-sm">

                        {
                            notEmptyLength(props.selection) ?
                                _renderSelection(props.selection, props.selectionText)
                                :
                                null
                        }
                        {
                            _.isPlainObject(_.get(props.data, 'carspecId')) && !_.isEmpty(_.get(props.data, 'carspecId')) ?
                                <div className="headline font-weight-bold">
                                    {_.trim(`${_.get(props.data, 'carspecId.make') || ''} ${_.get(props.data, 'carspecId.model') || ''} ${_.get(props.data, 'carspecId.variant') || ''}`)}
                                </div>
                                :
                                null
                        }
                        <div className="headline  ">
                            How awesome this?
                        </div>
                        <Form.Item required={false} validateStatus={ratingError ? 'error' : ''} help={ratingError || ''} style={{ margin: 0 }}>
                            {getFieldDecorator('rating', {
                                rules: [{ required: true, message: 'Please rate this store!' }],
                                initialValue: !props.data || !props.data.rating ? null : props.data.rating,
                            })(
                                <Rate allowHalf
                                    onChange={(v) => { setReviewForm({ ...reviewForm, rating: v }) }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item required={false} validateStatus={titleError ? 'error' : ''} help={titleError || ''} style={{ margin: 0 }}>
                            {getFieldDecorator('title', {
                                initialValue: props.data ? props.data.title : null,
                            })(
                                <Input
                                    placeholder="Title"
                                    maxLength={300}
                                    onChange={(e) => { setReviewForm({ ...reviewForm, title: e.target.value }) }} />
                            )}
                        </Form.Item>
                        <Form.Item required={false} validateStatus={commentError ? 'error' : ''} help={commentError || ''} style={{ margin: 0 }}>
                            {getFieldDecorator('comment', {
                                initialValue: props.data ? props.data.comment : null,
                            })(
                                <TextArea rows={4}
                                    maxLength={1000}
                                    placeholder="Write your review...."
                                    onChange={(e) => { setReviewForm({ ...reviewForm, comment: e.target.value }) }} />
                            )}
                        </Form.Item>


                        <Form.Item style={{ margin: 0 }} >

                            <ScrollContainer style={{ height: '70px', width: "100%" }} className="d-flex margin-y-sm" vertical={false}>
                                {_renderVideoCard(reviewForm.videos)}
                                {_renderImageCard(reviewForm.images)}

                            </ScrollContainer>
                        </Form.Item>

                        <div className="margin-y-sm">
                            <Form.Item style={{ margin: 0 }}>
                                <Row className="thin-border round-border padding-sm" gutter={[10, 20]}>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <div className="fill-parent  headline   text-overflow-break"> Add to your post</div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <div className="fill-parent flex-justify-end flex-items-align-center flex-align-center text-overflow-break">

                                            <Upload
                                                accept="image/*"
                                                onChange={({ fileList }) => {
                                                    onChangeImage(fileList)
                                                }}
                                                multiple={true}
                                                fileList={reviewForm.images}
                                                showUploadList={false}
                                                beforeUpload={file => false}
                                                disabled={notEmptyLength(reviewForm.images) ? reviewForm.images.length >= IMAGELIMIT : false}
                                            >
                                                <Tooltip placement="top" title={`Maximum ${IMAGELIMIT} images upload`}>
                                                    <img src="/assets/add-post/image.png" style={{ width: '25px', height: '25px' }} className={`margin-x-sm margin-bottom-sm ${reviewForm.images.length >= IMAGELIMIT ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
                                                </Tooltip>
                                            </Upload>
                                            {/* <a onClick={(e) => { setView('state') }}>
                                                <img src="/assets/add-post/location.png" style={{ width: '25px', height: '25px' }} className="margin-x-sm margin-bottom-sm" />
                                            </a> */}
                                            {/* <a>
                                                <img src="/assets/add-post/add-people.png" style={{ width: '25px', height: '25px' }} className="margin-x-sm margin-bottom-sm" />
                                            </a> */}
                                            {/* <a>
                                                <Upload
                                                    accept="video/*"
                                                    onChange={({ fileList }) => {
                                                        onChangeVideo(fileList)
                                                    }}
                                                    fileList={reviewForm.videos}
                                                    showUploadList={false}
                                                    beforeUpload={file => false}
                                                    disabled={notEmptyLength(reviewForm.videos) ? reviewForm.videos.length >= VIDEOLIMIT : false}
                                                >
                                                    <Tooltip placement="top" title={`Maximum ${VIDEOLIMIT} videos upload`}>
                                                        <img src="/assets/add-post/Video.png" style={{ width: '25px', height: '25px' }} className="margin-x-sm margin-bottom-sm" />
                                                    </Tooltip>
                                                </Upload>
                                            </a> */}
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </div>
                    </div>
                    <div style={{ height: FORM_CONTAINER_SIZE * 0.1 + 'px' }} className="flex-items-align-center">
                        <Button htmlType="submit" loading={buttonLoading} type="primary" style={{ color: 'white', width: '100%' }}>
                            {mode == 'add' ? "Add Post" : "Edit Post"}
                        </Button>
                    </div>
                </Form>
            </div >
        )
    }

    const _renderState = () => {
        return (
            <div key="state">
                <Row gutter={[0, 10]} >
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className='fill-parent'>
                            <Input placeholder="Where are you?" onChange={(e) => { filterState(e.target.value) }}></Input>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div style={{ height: FORM_CONTAINER_SIZE * 0.85 + 'px' }} className='scroll-y-wrapper '>
                            {
                                filteredState.map(function (state) {
                                    return (
                                        <div className={`flex-justify-start flex-items-align-center margin-y-md hover-background-yellow-lighten-3 cursor-pointer ${_.toLower(reviewForm.state) == _.toLower(state.value) ? 'background-yellow-lighten-2' : ''}`} onClick={(e) => { setReviewForm({ ...reviewForm, state: state.value }); setView(mode == 'edit' ? 'edit' : 'add') }}>
                                            <span className='d-inline-block relative-wrapper margin-x-md' style={{ width: '30px', height: '20px' }} >
                                                <img src={getStateIcon(state.value)} className="fill-parent absolute-center"></img>
                                            </span>
                                            <span className='d-inline-block' >
                                                <Highlighter
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={state.value}
                                                    autoEscape={true}
                                                    className="subtitle1"
                                                    searchWords={searchStateWords} />
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Col>

                </Row>
            </div>
        )
    }
    const _renderView = (data) => {
        switch (data) {
            case 'state':
                return _renderState();
            case 'edit':
                return _renderForm();
            case 'add':
                return _renderForm();
            default:
                return null;
                break;
        }
    }


    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Modal
                visible={visible}
                title={props.title && (view == 'add' || view == 'edit') ? props.title : title}
                maskClosable={true}
                centered={true}
                closable={true}
                footer={null}
                onCancel={(e) => { setVisible(false); }}
                afterClose={() => {
                    reset();
                }}
            >
                <div style={{ height: FORM_CONTAINER_SIZE + 'px' }} className="scroll-y-wrapper" >
                    <QueueAnim type="bottom">
                        {
                            view == 'add' || view == 'edit' ?
                                _renderForm()
                                :
                                _renderState()
                        }
                    </QueueAnim>
                </div>
            </Modal>

            <Modal visible={previewVisible} footer={null} onCancel={handleCancel} centered={true} closable={true} title={previewType == 'image' ? previewImage.name : previewVideo.name} width={400}>
                {
                    previewType == 'video' ?
                        <ReactPlayer width='100%' height="200px" controls url={previewVideo.url} config={{
                            file: {
                                forceVideo: true,
                            }
                        }} />
                        :
                        <img alt="example" style={{ width: '100%' }} src={previewImage.url} />
                }
            </Modal>
            <a onClick={props.readOnly ? null : reviewModalVisible}>

                {
                    props.button ?
                        props.button()
                        :
                        <Button style={{ color: '#F57F17' }}><Avatar src={'/assets/add-post/create-post.png'} shape="square" size="small" /></Button>
                }
            </a>

        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loginMode: loginMode,
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WriteReviewButton)));