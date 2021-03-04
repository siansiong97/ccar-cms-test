import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Spin } from 'antd';
import { CloseOutlined, WhatsAppOutlined, ShareAltOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../../actions/user-actions';
import _, { result } from 'lodash';
import { isValidNumber, objectRemoveEmptyValue, notEmptyLength, formatNumber, getTopItems, arrayLengthCount } from '../profile/common-function';
import UserAvatar from '../carFreak/components/user-avatar';
import { defaultReactions, liveIcon, supportIcon, commentIcon, shareIcon, reactionGif, getTotalReactions, getTopReactions } from './config';

const defaultHeight = 300;
const popularVideoRef = React.createRef();

const LiveBoxPreview2 = (props) => {
    // props.data.dealerDisplayName

    useEffect(() => {

        if (popularVideoRef.current && props.stream && props.data.liveType == 'current') {
            popularVideoRef.current.srcObject = props.stream;
 
            popularVideoRef.current.currentTime = 1;
        }
    }, [props.stream, popularVideoRef.current])

    function handleOnClick(e) {
        if (props.onClick) {
            props.onClick(e);
        }
    }

    return (
        _.isPlainObject(props.data) && notEmptyLength(objectRemoveEmptyValue(props.data)) ?
            <React.Fragment>
                <div className={`${props.className ? props.className : 'background-white'}`} style={{ height: `${defaultHeight}px`, width: '100%', ...props.style }} onClick={(e) => { handleOnClick(e) }}>
                    <div className="width-100 relative-wrapper" style={{ height: !props.style || !isValidNumber(props.style.height) ? `${defaultHeight * 0.6}px` : `${parseFloat(props.style.height) * 0.6}px` }} >
                        {
                            props.data.liveType == 'current' ?
                                <video ref={popularVideoRef} autoPlay muted className='fill-parent absolute-center background-black' />
                                :
                                <video src={props.stream} muted className='fill-parent absolute-center background-black' />
                        }
                        {/* video header */}
                        <div className="width-80 flex-justify-start flex-items-align-center padding-x-md padding-y-sm " style={{ position: 'absolute', top: 0, left: 0, margin: 'auto' }}  >
                            {
                                props.data.liveType == 'current' ?
                                    <React.Fragment>
                                        <span className='d-inline-block background-red white caption padding-x-sm padding-y-xs margin-right-md'  >
                                            Live
                                        </span>
                                        <Icon type="eye" theme="filled" className='margin-right-sm white' />
                                        <span className='d-inline-block white' >
                                            {isValidNumber(props.data.highestView) ? formatNumber(props.data.highestView, 'auto', true, 1, true) : 0}
                                        </span>
                                    </React.Fragment>
                                    :
                                    <span className='d-inline-block background-black white caption padding-x-sm padding-y-xs'  >
                                        Recorded Live
                            </span>
                            }
                        </div>
                    </div>
                    <div className="width-100 padding-x-md padding-y-md" style={{ height: !props.style || !isValidNumber(props.style.height) ? `${defaultHeight * 0.4}px` : `${parseFloat(props.style.height) * 0.4}px` }}>
                        <div className="background-transparent flex-items-align-start flex-justify-center">
                            <UserAvatar redirectProfile data={props.data.dealerDbId} size={70} className='margin-right-md' />
                            <span className='d-inline-block width-80' >
                                <div className="black subtitle1 text-truncate-twoline">
                                    {props.data.titleOfChat}
                                </div>
                                <div className="grey subtitle1 text-truncate margin-y-sm">
                                    {_.isPlainObject(props.data.dealerDbId) && notEmptyLength(objectRemoveEmptyValue(props.data.dealerDbId)) ? props.data.dealerDbId.name ? props.data.dealerDbId.name : `${props.data.dealerDbId.firstName ? props.data.dealerDbId.firstName : ''} ${props.data.dealerDbId.lastName ? props.data.dealerDbId.lastName : ''}` : null}
                                </div>
                                <div className="flex-justify-start flex-items-align-center">
                                    <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                        {notEmptyLength(props.data.reactionSummary) ?
                                            <React.Fragment>
                                                <span className='d-inline-block margin-right-xs' >
                                                    {formatNumber(getTotalReactions(props.data.reactionSummary), 'auto', true, 1, true)}
                                                </span>
                                                {
                                                    notEmptyLength(getTopReactions(props.data.reactionSummary, 3)) ?
                                                        _.map(getTopReactions(props.data.reactionSummary, 3), function (reaction, index) {
                                                            return (
                                                                <img key={`reaction-${index}`} src={reactionGif[`${reaction.type}Gif`]} style={{ width: '25px', height: '25px', position: 'relative', left: -7 * index, zIndex: defaultReactions.length - index }} />
                                                            )
                                                        })
                                                        :
                                                        null
                                                }
                                            </React.Fragment>
                                            :
                                            null
                                        }
                                    </span>
                                    <span className='flex-items-align-center flex-justify-center cursor-pointer' >
                                        <span className='d-inline-block margin-right-xs grey headline  ' >
                                            {formatNumber(props.data.totalChat, 'auto', true, 1, true)} comments
                                        </span>
                                    </span>
                                </div>
                            </span>
                        </div>


                    </div>
                </div>
            </React.Fragment>
            :
            null
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(LiveBoxPreview2)));