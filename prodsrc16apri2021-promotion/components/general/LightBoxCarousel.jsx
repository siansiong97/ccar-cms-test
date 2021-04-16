import Carousel from '@brainhubeu/react-carousel';
import { Form, Icon } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayLengthCount } from '../../common-function';
import LightBoxGallery from './light-box-gallery';
import { imageNotFound } from '../profile/config';


const LightBoxCarousel = (props) => {

    const [images, setImages] = useState([])
    const [imageIndex, setImageIndex] = useState(0);
    const [height, setHeight] = useState(400);



    useEffect(() => {
        setHeight(props.height)
    }, [props.height])

    useEffect(() => {
        if (_.isArray(props.images) && !_.isEmpty(props.images)) {
            setImages(props.images);
        } else {
            setImages([]);
        }
    }, [props.images])

    useEffect(() => {
    }, [images])


    return (

        <React.Fragment>
            <div className={`width-100 ${props.className || ''}`} style={{  ...props.style, height : height}}>
                {
                    _.isArray(images) && !_.isEmpty(images) ?
                        <LightBoxGallery
                            images={images}
                            onChange={(index, image) => {
                                setImageIndex(index);
                            }}
                        >
                            {
                                (data, setCurrentIndex, setVisible) => {
                                    return (
                                        arrayLengthCount(images) > 1 ?
                                            <div className="width-100 carousel-background-black show-carousel-dots-inside carousel-custom-arrows" style={{ height : height }}>
                                                <Carousel
                                                    infinite
                                                    arrowLeft={<Icon type="left" className="grey-lighten-2 cursor-pointer" style={{ fontSize: 30 }} />}
                                                    arrowRight={<Icon type="right" className="grey-lighten-1 cursor-pointer" style={{ fontSize: 30 }} />}
                                                    addArrowClickHandler
                                                    dots
                                                    dotPosition="bottom"
                                                    value={imageIndex}
                                                    slides={
                                                        _.isArray(_.get(data, ['images'])) && !_.isEmpty(_.get(data, ['images'])) ?
                                                            _.map(_.get(data, ['images']), function (image, index) {
                                                                return (
                                                                    <div className="relative-wrapper width-100" style={{ height : height }}>
                                                                        <img src={image} className="absolute-center-img-no-stretch cursor-pointer"
                                                                            onClick={(e) => {
                                                                                setVisible(true);
                                                                                setCurrentIndex(index);
                                                                            }} ></img>
                                                                    </div>
                                                                )
                                                            })
                                                            :
                                                            []}
                                                    onChange={(value) => {
                                                        setImageIndex(value);
                                                    }}
                                                />
                                            </div>
                                            :
                                            <div className="relative-wrapper background-black width-100"  style={{ height : height }}>
                                                <img src={images[0] || imageNotFound} onClick={(e) => {
                                                    setVisible(true);
                                                    setCurrentIndex(0);
                                                }} className=" absolute-center-img-no-stretch" />
                                            </div>
                                    );
                                }
                            }
                        </LightBoxGallery>
                        :
                        <div className="relative-wrapper background-black width-100"  style={{ height : height }}>
                            <img src={imageNotFound} className=" absolute-center-img-no-stretch" />
                        </div>
                }
            </div>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(LightBoxCarousel)));