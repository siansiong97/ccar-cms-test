import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import _, { isEmpty } from 'lodash';
import client from '../../feathers'
import axios from 'axios';
import { Row, Col, Card, Button, Tabs, Empty, message, Modal, Icon, Input, Avatar, Pagination, Spin, Table, Switch, Form, Tooltip, Upload, Divider, Breadcrumb, Image } from 'antd';
import LayoutV2 from '../Layout-V2';
import Carousel, { Dots, slidesToShowPlugin, arrowsPlugin } from '@brainhubeu/react-carousel';

import moment from "moment";
import Gallery from "react-photo-gallery";
import { ReactSortable } from "react-sortablejs";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const { TabPane } = Tabs;

const PhotoTab = (props) => {

    const [clubs, setClubs] = useState({});
    const [chatLoading, setChatLoading] = useState(false);
    const [photosList, setPhotosList] = useState([]);
    const [lightBoxImages, setLightBoxImages] = useState([]);
    const [uploadModal, setUploadModal] = useState(false);
    const [fileListAdsImage, setFileListAdsImage] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const timeoutRef = useRef(null);
    const [currentImage, setCurrentImage] = useState({});
    const [photoIndex, setPhotoIndex] = useState(0);
    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    


    const uploadButton = (
        <div style={{ padding: '5%' }}>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );


    useEffect(() => {

        getData()

        client.authenticate().then((res)=>{
            setCurrentUser(res.user)
        }).catch((err)=>{
            setCurrentUser({})
        })
    }, [])


    function getData() {
        setClubs({})

        
        client.service('clubs')
            .get(props.props.match.params.id)
            .then((res) => {
                let result = _.cloneDeep(res)
                if (result.mediaList) {
                    if (result.mediaList.length > 0) {
                        setPhotosList(result.mediaList)
                        let LightBoxImageList = _.map(result.mediaList, e => _.values(_.pick(e, 'url')))//get url only
                        setLightBoxImages(LightBoxImageList)
                    }
                }

                setClubs(result)
            }).catch((err) => {
                console.log(err);
            })
    }


    function openUploadModal() {
        setUploadModal(true)
    }

    function handleImageRemove2(record) {
        let oldFileList = _.cloneDeep(fileListAdsImage)

        var newFileList = _.filter(oldFileList, function (val) {
            return val.uid !== record.uid
        });
        setFileListAdsImage(newFileList)
    }

    function handleChangeAdsImage(e) {
        e.fileList = e.fileList.slice(-26);

        e.fileList.map(function (v) {
            v.ObjectUrl = URL.createObjectURL(v.originFileObj)
        });

        setFileListAdsImage(e.fileList)

    }


    function handleSubmit() {
        setSubmitLoading(true)
        client.authenticate()
            .then((res) => {

                let fileList = _.cloneDeep(fileListAdsImage)

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
                                        max_height: 2160,
                                        max_width: 3840,
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

                        Promise.all(uploadPromiseArr).then((res) => {
                            fileList = res[0]

                            axios.post(`${client.io.io.uri}updateClubPhoto`,
                                {

                                    clubId: props.props.match.params.id,
                                    fileList: fileList,
                                }, {
                                headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] },
                            }
                            ).then((res) => {
                                setFileListAdsImage([])
                                setSubmitLoading(false)
                                setUploadModal(false)
                            }).catch((err) => {
                                message.err("Failed to upload.")
                                setFileListAdsImage([])
                                setSubmitLoading(false)
                                setUploadModal(false)
                            })

                        })
                    })




            })
            .catch((err) => {
                setSubmitLoading(false);
                return message.error("Please Login.")
            })

    };




    //rendering---------------------------------------------------
    return (

        <Spin style={{ zIndex: 99999 }} spinning={chatLoading} size="large" indicator={
            <img src="/loading.gif" style={{ width : 100, height : 100, position : 'sticky', position : '-webkit-sticky', top : 0, bottom : 0, left : 0 , right : 0, margin : 'auto'}} />
        }>

            <Row style={{ padding: '24px' }}>
                <div style={{ backgroundColor: '#ffffff' }}>

                    <Row style={{ padding: '24px' }}>
                        
                            {
                                currentUser._id?currentUser._id===clubs.userId?
                                <Col span={6} style={{ padding: '2px' }} >
                            <Button onClick={(e) => { openUploadModal() }}>Upload Photo here </Button>
                            </Col>
                                :''
                                :''
                            }
                            

                        {
                            photosList.map(function (v, i) {
                                return (
                                    <Col span={6} style={{ padding: '2px' }}>
                                        <img className={'clubMainImage'} src={v.url} onClick={(e) => { setPhotoIndex(i); setLightBoxOpen(true); }} />
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </Row>
            <br />



            <Modal
                visible={uploadModal}
                onCancel={(event, src) => {
                    setUploadModal(false)
                }}
                width={720}
                onOk={(e) => { handleSubmit() }}
                confirmLoading={submitLoading}
            >

                <Upload
                    accept='.png,.pdf,.jpeg,.jpg'
                    multiple={true}
                    key="uploadCarImage"
                    beforeUpload={() => false}
                    listType="picture-card"
                    fileList={fileListAdsImage}
                    showUploadList={false}
                    onChange={(e) => {
                        handleChangeAdsImage(e);
                    }}
                >
                    {fileListAdsImage.length >= 27 ? null : uploadButton}
                </Upload>

                <Row>
                    <ReactSortable
                        invertSwap={true}
                        animation={300}
                        list={fileListAdsImage}
                        setList={newState => setFileListAdsImage(newState)}
                    >

                        {fileListAdsImage.map((item, idx) => (
                            <Col xl={6} xs={8} md={12} xs={24} style={{ maxWidth: '200px', maxHeight: '150px' }}>
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
 
            </Modal>
 
            <div>

                {lightBoxOpen === true && (
                    <Lightbox
                        mainSrc={lightBoxImages[photoIndex]}
                        nextSrc={lightBoxImages[(photoIndex + 1) % lightBoxImages.length]}
                        prevSrc={lightBoxImages[(photoIndex + lightBoxImages.length - 1) % lightBoxImages.length]}
                        onCloseRequest={() => setLightBoxOpen(false)}
                        onMovePrevRequest={() => setPhotoIndex((photoIndex + lightBoxImages.length - 1) % lightBoxImages.length)}
                        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % lightBoxImages.length)}
                    />
                )}
            </div>

        </Spin>

    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTab);