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
import { notEmptyLength } from '../profile/common-function';

const { TabPane } = Tabs;

const CarFreakPhoto = (props) => {

    const [photosList, setPhotosList] = useState([]);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [lightBoxImages, setLightBoxImages] = useState([]);


    useEffect(() => {

        if (notEmptyLength(props.photosList)) {
            setPhotosList(props.photosList);

            let LightBoxImageList = _.map(props.photosList, e => _.values(_.pick(e, 'url')))//get url only
            setLightBoxImages(LightBoxImageList)
        } else {
            setPhotosList([])
        }
    }, [props.photosList])

    //rendering---------------------------------------------------
    return (
        <React.Fragment>

            <div className={`width-100 relative-wrapper cursor-pointer ${props.className ? props.className : ''}`}>
                {
                    notEmptyLength(photosList) ?
                        <img className={'absolute-center'} style={{ width: props.width ? props.width : '90%', height: props.height ? props.height : '300px' }} src={photosList[0].url} onClick={(e) => { setLightBoxOpen(true); }} />
                        :
                        <Empty></Empty>
                }
            </div>


            {lightBoxOpen === true && notEmptyLength(lightBoxImages) ?
                (
                    <Lightbox
                        mainSrc={lightBoxImages[photoIndex]}
                        nextSrc={lightBoxImages[(photoIndex + 1) % lightBoxImages.length]}
                        prevSrc={lightBoxImages[(photoIndex + lightBoxImages.length - 1) % lightBoxImages.length]}
                        onCloseRequest={() => setLightBoxOpen(false)}
                        onMovePrevRequest={() => setPhotoIndex((photoIndex + lightBoxImages.length - 1) % lightBoxImages.length)}
                        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % lightBoxImages.length)}
                    />
                )
                :
                null
            }
        </React.Fragment>
    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CarFreakPhoto);