import {  } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Lightbox from 'react-image-lightbox';
import { connect } from 'react-redux';
import { Form } from '@ant-design/compatible';
import { isValidNumber } from '../../common-function';


const LightBoxGallery = (props) => {

    const [visible, setVisible] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState()


    useEffect(() => {
        if (_.isArray(props.images) && !_.isEmpty(props.images)) {
            setImages(props.images);
        } else {
            setImages([]);
        }
    }, [props.images])

    useEffect(() => {
        if (_.isArray(images) && !_.isEmpty(images)) {
            if (props.onChange) {
                props.onChange(currentIndex, images[currentIndex]);
            }
        }
    }, [currentIndex])

    useEffect(() => {
        if(isValidNumber(parseInt(props.currentIndex))){
            setCurrentIndex(props.currentIndex)
        }
    }, [props.currentIndex])

    return (

        <React.Fragment>
            {
                props.children ?
                    props.children({ images, currentIndex, visible }, setCurrentIndex, setVisible)
                    :
                    <Scrollbars style={{ width: '100%', height: '100px' }}>
                        <div className="flex-justify-start flex-items-align-center fill-parent">
                            {
                                _.map(images, function (v, index) {
                                    return <span className='d-inline-block margin-right-md cursor-pointer' onClick={(e) => { setCurrentIndex(index); setVisible(true) }} >
                                        <img src={v} style={{ width: props.size || 70, height: props.size || 70 }} />
                                    </span>
                                })
                            }
                        </div>
                    </Scrollbars>
            }
            {visible && (
                <Lightbox
                    mainSrc={images[currentIndex]}
                    nextSrc={images[(currentIndex + 1) % images.length]}
                    prevSrc={images[(currentIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => { setVisible(false) }}
                    onMovePrevRequest={() => {
                        setCurrentIndex((currentIndex + images.length - 1) % images.length)
                    }
                    }
                    onMoveNextRequest={() => {
                        setCurrentIndex((currentIndex + 1) % images.length)
                    }
                    }
                />
            )}
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LightBoxGallery));