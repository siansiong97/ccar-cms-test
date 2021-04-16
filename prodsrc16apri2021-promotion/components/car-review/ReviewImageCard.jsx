import { Form, Icon, Modal } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { imageNotFoundIcon } from '../../icon';



const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}


const ReviewImageCard = (props) => {

    const [image, setImage] = useState();
    const [previewVisible, setPreviewVisible] = useState(false)

    useEffect(() => {
        if (_.isPlainObject(props.image) && !_.isEmpty(props.image)) {
            setImage(props.image);
        }
    }, [props.image])


    
    return (
        <span
            className={"d-inline-block thin-border margin-right-xs margin-bottom-xs background-white flex-items-no-shrink"}
            style={{ width: props.size || '70px', height: props.size || '70px' }}
        >
            <div className="relative-wrapper fill-parent">
                <div className="absolute-center" >
                    <img src={_.get(image, ['url'])} className="fill-parent" ></img>
                </div>
                <div className="absolute-center background-grey-darken-4 stack-element-opacity-50 flex-items-align-center flex-justify-center">
                    <a onClick={(e) => {
                        if (props.manualControl) {
                            if (props.onPreview) {
                                props.onPreview(image);
                            }
                        } else {
                            setPreviewVisible(true);
                        }

                    }}>
                        <Icon type="eye" className="white margin-x-xs" style={{ fontSize: '20px' }} />
                    </a>
                    <a onClick={(e) => { 
                        if(props.onDelete){
                            props.onDelete(image)
                        }
                     }}>
                        <Icon type="delete" className="white margin-x-xs" style={{ fontSize: '20px' }} />
                    </a>
                </div>
            </div>
            {
                props.manualControl === true ?
                    null
                    :
                    <Modal visible={previewVisible} footer={null} onCancel={() => { setPreviewVisible(false) }} centered={true} closable={true} title={_.get(image, ['name']) || ''} width={400}>
                        <img alt="example" style={{ width: '100%' }} src={_.get(image, ['url']) || imageNotFoundIcon} />
                    </Modal>
            }
        </span>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReviewImageCard));