import { Form, Icon, Modal, Tooltip, Upload } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../common-function';
import ReviewImageCard from './ReviewImageCard';



const ReviewAttachmentBox = (props) => {

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);

    const [imageLimit, setImageLimit] = useState(10);
    const [videoLimit, setVideoLimit] = useState(1);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('')
    const [previewType, setPreviewType] = useState('image')


    useEffect(() => {
        setImages(_.isArray(props.images) && !_.isEmpty(props.images) ? props.images : []);
    }, [props.images])


    const _renderImageCard = (data) => {
        if (notEmptyLength(data)) {
            return (
                data.map(function (item) {
                    return <ReviewImageCard image={item} manualControl
                        onPreview={(image) => {
                            setPreviewVisible(true);
                            setPreviewType('image');
                            setPreviewUrl(_.get(image, ['url']))
                        }}
                        onDelete={(image) => {
                            if (image) {
                                setImages(_.filter(images || [], function (item) {
                                    return _.get(image, ['_id']) != _.get(item, ['_id'])
                                }))
                            }
                        }}
                    />
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


    async function onChangeImage(fileList) {
        if (notEmptyLength(fileList)) {
            if (fileList.length > imageLimit) {
                fileList = fileList.slice(0, imageLimit);
            }

            for (let index = 0; index < fileList.length; index++) {
                if (fileList[index].originFileObj) {
                    fileList[index].url = await getBase64(fileList[index].originFileObj)
                    fileList[index]._id = fileList[index].uid;
                }

            }

            fileList = _.union(fileList, images)
            setImages(fileList);
            if (props.onChangeImages) {
                props.onChangeImages(fileList);
            }
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

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    return (
        <React.Fragment>
            <Scrollbars autoHide style={{ width: "100%" }} className="d-flex margin-y-sm" autoHeight >
                <div className="flex-justify-start flex-items-align-center">
                    {_renderVideoCard(videos)}
                    {_renderImageCard(images)}
                </div>
            </Scrollbars>
            <div className="flex-justify-space-between flex-items-align-center thin-border round-border padding-md margin-top-md margin-bottom-sm">
                <span className='d-inline-block ' >
                    <div className="fill-parent  headline   text-overflow-break"> Add to your post</div>
                </span>
                <span className='d-inline-block ' >
                    <div className="fill-parent flex-justify-end flex-items-align-center flex-align-center text-overflow-break">
                        <Upload
                            accept="image/*"
                            onChange={({ fileList }) => {

                                onChangeImage(fileList)
                            }}
                            multiple={true}
                            fileList={images}
                            showUploadList={false}
                            beforeUpload={file => false}
                            disabled={notEmptyLength(images) ? images.length >= imageLimit : false}
                        >
                            <Tooltip placement="top" title={`Maximum ${imageLimit} images upload`}>
                                <img src="/assets/add-post/image.png" style={{ width: '25px', height: '25px' }} className={`margin-x-sm margin-bottom-sm ${images.length >= imageLimit ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
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
                                fileList={videos}
                                showUploadList={false}
                                beforeUpload={file => false}
                                disabled={notEmptyLength(videos) ? videos.length >= videoLimit : false}
                            >
                                <Tooltip placement="top" title={`Maximum ${videoLimit} videos upload`}>
                                    <img src="/assets/add-post/Video.png" style={{ width: '25px', height: '25px' }} className="margin-x-sm margin-bottom-sm" />
                                </Tooltip>
                            </Upload>
                        </a> */}
                    </div>


                </span>

            </div>

            <Modal visible={previewVisible} footer={null} onCancel={() => {
                setPreviewVisible(false);
            }} centered={true} closable={true} title={'Preview'} width={500}>
                {
                    previewType == 'video' ?
                        <ReactPlayer width='100%' height="200px" controls url={previewUrl} config={{
                            file: {
                                forceVideo: true,
                            }
                        }} />
                        :
                        <img alt="preview" style={{ width: '100%' }} src={previewUrl} />
                }
            </Modal>
        </React.Fragment>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReviewAttachmentBox));