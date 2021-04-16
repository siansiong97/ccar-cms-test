import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Spin, Empty } from 'antd';
import { CloseOutlined, WhatsAppOutlined, ShareAltOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../../actions/user-actions';
import _, { result } from 'lodash';
import client from '../../feathers'
import { Picker } from 'emoji-mart';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue, formatNumber } from '../profile/common-function';
import { giftGif } from '../live/config';
import { ccoinIcon, defaultGifts } from './config';

const giftRef = React.createRef();
const defaultHeight = 300;
const defaultWidth = 400;
const headerHeight = 50;
const footerHeight = 60;
const marginY = 20;
const marginX = 20;



const GiftPickerButton = (props) => {

    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({
        top: -(defaultHeight) - marginY,
    });
    const [height, setHeight] = useState(defaultHeight);
    const [width, setWidth] = useState(defaultWidth);

    const [gifts, setGifts] = useState([])

    useEffect(() => {
        if (notEmptyLength(props.gifts)) {
            setGifts(props.gifts)
        } else {
            let temp = [];
            _.forEach(defaultGifts, function (gift) {
                gift.total = 0;
                temp.push(gift)
            })
            setGifts(temp);
        }
    }, [props.gifts])

    useEffect(() => {
        if (!props.style || !isValidNumber(props.style.height) || !parseFloat(props.style.height) >= defaultHeight) {
            setHeight(defaultHeight);
        } else {
            setHeight(props.style.height);
        }

        if (!props.style || !isValidNumber(props.style.width) || !parseFloat(props.style.width) >= defaultWidth) {
            setWidth(defaultWidth);
        } else {
            setWidth(props.style.width);
        }
    }, [props.style])


    useEffect(() => {
        let position = {}
        switch (props.placement) {
            case 'topLeft':
                position = {
                    top: -(height) - marginY,
                    left: -width,
                }
                break;
            case 'topRight':
                position = {
                    top: -(height) - marginY,
                    right: -width,
                }
                break;
            case 'bottom':
                position = {
                    bottom: -(height) - marginY,
                    right : -(width / 2),
                }
                break;
            case 'bottomLeft':
                position = {
                    bottom: -(height) - marginY,
                    left: -width,
                }
                break;
            case 'bottomRight':
                position = {
                    bottom: -(height) - marginY,
                    right: -width,
                }
                break;

            default:
                position = {
                    top: -(height) - marginY,
                    right : -(width / 2),
                }
                break;
        }

 
        setPosition(position)

    }, [props.placement, height, width])


    useEffect(() => {

        function handleClickOutside(event) {

            if ((!giftRef.current || !giftRef.current.contains(event.target))) {
                setVisible(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [giftRef.current])

    function handleOnSelect(gift) {
        if (props.onSelect) {
            props.onSelect(gift);
        }
    }


    return (
        <React.Fragment>
            <span className='d-inline-block relative-wrapper' >
                <span onClick={(e) => { setVisible(true) }} >
                    {
                        props.children ?
                            props.children
                            :
                            <img src={giftGif} style={{ width: 23, height: 23 }} className='cursor-pointer' />
                    }
                </span>
                {
                    visible ?
                        <span className='d-inline-block' ref={giftRef} style={{ width: width, height: height, position: 'absolute', ...position, zIndex : 999 }}>
                            <div className="fill-parent relative-wrapper">

                                <div className="background-black opacity-50 absolute-center">
                                </div>
                                <div className="fill-parent absolute-center">
                                    {/* header */}
                                    <div className="width-100 flex-justify-space-between flex-items-align-center padding-sm" style={{ height: headerHeight }}>
                                        <span className='flex-items-align-center cyan-accent-2 subtitle1' >
                                            <Icon type="question-circle" className='margin-right-sm' theme="filled" />
                                                CSTAR :
                                                <img src={ccoinIcon} style={{ width: 23, height: 23 }} className='margin-left-sm' />
                                            <span className='white margin-x-xs' >
                                                0
                                                </span>
                                        </span>
                                        <span className='d-inline-block' >
                                            <Icon type="close" className='grey-darken-2 cursor-pointer' style={{ fontSize: 23 }} onClick={(e) => { setVisible(false) }} />
                                        </span>
                                    </div>
                                    {/* body */}
                                    <div className="width-100 flex-items-align-center" style={{ height: height - headerHeight - footerHeight }}>
                                        <Row gutter={[20, 20]} align="stretch">
                                            {
                                                notEmptyLength(gifts) ?
                                                    _.map(gifts, function (gift) {
 
                                                        return (
                                                            <React.Fragment>
                                                                <Col xs={6} sm={6} md={6} lg={6} xl={6} >
                                                                    <div className="cursor-pointer" onClick={(e) => {handleOnSelect(gift)}}>
                                                                        <div className="fill-parent flex-items-align-center flex-justify-center">
                                                                            <img src={gift.icon} style={{ height: 50, width: 50 }} />
                                                                        </div>
                                                                        <div className="fill-parent flex-items-align-center flex-justify-center">
                                                                            <img src={ccoinIcon} style={{ width: 23, height: 23 }} className='margin-left-sm' />
                                                                            <span className='white margin-x-xs' >
                                                                                {isValidNumber(gift.price) ? formatNumber(gift.price, 'auto', true, 0, true) : 0}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                    :
                                                    <Empty />
                                            }

                                        </Row>
                                    </div>
                                    {/* footer */}
                                    <div className="width-100 flex-justify-end flex-items-align-center padding-x-sm" style={{ height: footerHeight }}>
                                        <Button className="background-transparent border-ccar-yellow ccar-yellow round-border-big" >Buy CSTAR</Button>
                                    </div>
                                </div>
                            </div>

                        </span>
                        :
                        null
                }
            </span>

        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(GiftPickerButton)));