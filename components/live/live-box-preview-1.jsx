import { Form, Icon } from 'antd';
import _ from 'lodash';
import TweenOne from 'rc-tween-one';
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { getStreamUrl, liveIcon } from './config';
import UserAvatar from './user-avatarCCARLive';
import { withRouter } from 'next/router';
import { setUser } from '../../redux/actions/user-actions';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue  } from '../../common-function';
TweenOne.plugins.push(BezierPlugin);


const defaultHeight = 400;

const LiveBoxPreview1 = (props) => {
    // props.data.dealerDisplayName
    const [videoLoading, setVideoLoading] = useState(false);
    const [pictureUrl, setPictureUrl] = useState(false);
    const [numberOfCurrentlyConnectedClients, setNumberOfCurrentlyConnectedClients] = useState(props.data.connectedUsers);

    const getThumbnailUrl = () => {
        const dealerSocketId = props.dealerSocketId;
        return `${getStreamUrl(client.io.io.uri)}/dealerVideoThumbnails/${dealerSocketId}.png?${Date.now()}`
    }

    useEffect(() => {
        //the dealer this represents has changed
        getThumbnailUrl();

    },[props.dealerSocketId]);


    useEffect(x => {

        const _handleThumbnailEvent = (data) => {
            const dealerSocketId = data.dealerSocketId;
            if(dealerSocketId === props.dealerSocketId){
              setPictureUrl(
                getThumbnailUrl()
              );
            }
        }

        const _handleNumberOfConnectedChanged = (data) => {
            let  { connectedUsers, dealerSocketId } = data.dealerSocketId
            if (dealerSocketId === props.dealerSocketId) {
              //by odin it is this
              setNumberOfCurrentlyConnectedClients(connectedUsers);
            }
        }

        props.sharedSocket.on('broadcastVideoThumbnailHasChanged', _handleThumbnailEvent)
        props.sharedSocket.on('numberOfViews', _handleNumberOfConnectedChanged)
        setPictureUrl(
            getThumbnailUrl()
        );
        return () => {
            props.sharedSocket.off('broadcastVideoThumbnailHasChanged', _handleThumbnailEvent);
            props.sharedSocket.off('numberOfViews', _handleNumberOfConnectedChanged);
        }
    },[]);


    function handleOnClick(e) {
        if (props.onClick) {
            props.onClick(e);
        }
    }
    
    
    return (
        _.isPlainObject(props.data) && notEmptyLength(objectRemoveEmptyValue(props.data)) ?
            <React.Fragment>
                <div className={`${props.className ? props.className : ''} background-white`} style={{ height: `${defaultHeight}px`, width: '100%', ...props.style }} onClick={(e) => { handleOnClick(e) }}
                    
                >
                    <div className="width-100 relative-wrapper" style={{ height: !props.style || !isValidNumber(props.style.height) ? `${defaultHeight * 0.85}px` : `${parseFloat(props.style.height) * 0.85}px` }} >
                        <img 
                            // src={_.get(props.data , ['dealerVideoThumbnailUrl'])} 
                            src={pictureUrl}
                            className='fill-parent absolute-center img-cover background-black'
                        />
                        {/* <video ref={props.videoRef} autoPlay muted className='fill-parent absolute-center background-black'/> */}
                        <div className="absolute-center flex-items-align-center flex-justify-center fill-parent background-black opacity-30 " >
                        </div>
                        <img src={liveIcon} style={{ position: 'absolute', top: 0, left: 10, margin: 'auto', width: '50px', height: '50px' }} />
                        <div className="background-grey-darken-4 opacity-80 round-border-light flex-items-align-center flex-justify-center padding-x-sm" style={{ position: 'absolute', top: 10, left: 70, margin: 'auto', height: '30px' }}>
                            <Icon type="eye" theme="filled" className='margin-right-sm white' />
                            <span className='d-inline-block white' >
                                {numberOfCurrentlyConnectedClients}
                            </span>
                        </div>
                        <div className="background-transparent flex-items-align-center flex-justify-center" style={{ position: 'absolute', bottom: 0, left: 10, margin: 'auto', width: '90%', height: !props.style || !isValidNumber(props.style.height) ? `${defaultHeight * 0.85 * 0.4}px` : `${parseFloat(props.style.height) * 0.85 * 0.4}px` }}>
                            <UserAvatar 
                                redirectProfile 
                                data={{
                                    name:props.data.dealerDisplayName,
                                    avatar:props.data.dealerAvatar,
                                }} 
                                size={70} 
                                className='margin-right-md'
                            />
                            <span className='d-inline-block width-80' >
                                <div className="font-weight-bold white subtitle1 text-truncate ">
                                    {props.data.title}
                                </div>
                                <div className="font-weight-normal white subtitle1 text-truncate">
                                    {_.isPlainObject(props.data) && notEmptyLength(objectRemoveEmptyValue(props.data)) ? `${props.data.name}` : null}
                                </div>
                            </span>
                        </div>
                    </div>
                    {/* <div className="width-100 flex-justify-space-between flex-items-align-center" style={{ height: !props.style || !isValidNumber(props.style.height) ? `${defaultHeight * 0.15}px` : `${parseFloat(props.style.height) * 0.15}px` }}>

                        <span className="height-100 flex-justify-start flex-items-align-center padding-x-sm">
                            <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                <img src={likeIcon} style={{ width: '20px', height: '20px' }} className='margin-right-xs' />
                                <span className='grey headline  ' >
                                    Like
                                </span>
                            </span>
                            <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                <img src={commentIcon} style={{ width: '20px', height: '20px' }} className='margin-right-xs' />
                                <span className='grey headline  ' >
                                    Comment
                                </span>
                            </span>
                            <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                <img src={shareIcon} style={{ width: '20px', height: '20px' }} className='margin-right-xs' />
                                <span className='grey headline  ' >
                                    Share
                                </span>
                            </span>
                        </span>

                        <span className="height-100 flex-justify-end flex-items-align-center padding-x-sm">
                            <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                {notEmptyLength(objectRemoveEmptyValue(props.data.reactionSummary)) ?
                                    <React.Fragment>
                                        <span className='d-inline-block margin-right-xs' >
                                            {formatNumber(getTotalReactions(props.data.reactionSummary), 'auto', true, 1, true)}
                                        </span>
                                        {
                                            notEmptyLength(getTopReactions(props.data.reactionSummary, 3)) ?
                                                _.map(getTopReactions(props.data.reactionSummary, 3), function (reaction, index) {
                                                    return (
                                                        <React.Fragment>
                                                            <img src={reactionGif[`${reaction.type}Gif`]} style={{ width: '25px', height: '25px', position: 'relative', left: -7 * index, zIndex: defaultReactions.length - index }} />
                                                        </React.Fragment>
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
                                {
                                    props.data.totalChat ?
                                        <React.Fragment>
                                            <span className='d-inline-block margin-right-xs grey headline  ' >
                                                {formatNumber(props.data.totalChat, 'auto', true, 1, true)} comments
                                        </span>
                                        </React.Fragment>
                                        :
                                        null
                                }
                            </span>
                        </span>
                    </div> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(LiveBoxPreview1)));