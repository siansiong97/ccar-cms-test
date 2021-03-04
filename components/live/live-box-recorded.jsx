import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Spin, Empty } from 'antd';
import { CloseOutlined, WhatsAppOutlined, ShareAltOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../../actions/user-actions';
import _, { result } from 'lodash';
import { isValidNumber, objectRemoveEmptyValue, notEmptyLength, formatNumber, getTopItems, arrayLengthCount, toSnakeCase } from '../profile/common-function';
import UserAvatar from '../carFreak/components/user-avatar';
import { defaultReactions, liveIcon, supportIcon, commentIcon, shareIcon, reactionGif, likeIcon, getTotalReactions, getTopReactions } from './config';
import ReactPlayer from 'react-player';
import UserComment1 from '../commonComponent/comment-1';
import SeeMoreWrapper from '../commonComponent/see-more-wrapper';
import { loginMode } from '../../actions/app-actions';
import login from '../login';
import ShowMoreText from 'react-show-more-text';
import { Picker, Emoji } from 'emoji-mart';
import EmojiPicker from 'emoji-picker-react';
import EmojiPickerButton from '../commonComponent/emoji-picker-button';
import client from '../../feathers';
import PopOverReactionButton from './pop-over-reaction-button';
import ReactionButton from './reaction-button';
import ShareButtonDialog from '../commonComponent/share-button-dialog';
import { Player, ControlBar, ReplayControl, ForwardControl, BigPlayButton, Shortcut, PlayToggle } from 'video-react';

const defaultHeight = 550;
const defaultTitleHeight = 200;
const defaultReactionHeight = 30;
const defaultWriteCommentHeight = 100;
const commentRef = React.createRef();

const newShortcuts = [
    {
        keyCode: 37, // Left arrow
        handle: (player, actions) => {
            if (!player.hasStarted) {
                return;
            }

            // this operation param is option
            // helps to display a bezel
            const operation = {
                action: 'replay-10',
                source: 'shortcut'
            };
            actions.replay(10, operation); // Go back 10 seconds
        }
    },
    {
        keyCode: 39, // Right arrow
        handle: (player, actions) => {
            if (!player.hasStarted) {
                return;
            }

            // this operation param is option
            // helps to display a bezel
            const operation = {
                action: 'forward-10',
                source: 'shortcut'
            };
            actions.forward(10, operation); // Go forward 10 seconds
        }
    }
];

const LiveBoxRecorded = (props) => {

    const [height, setHeight] = useState(defaultHeight);
    const [overlayVisible, setOverlayVisible] = useState(true);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {

        if (!props.style || !isValidNumber(props.style.height) || !parseFloat(props.style.height) >= defaultHeight) {
            setHeight(defaultHeight);
        } else {
            setHeight(props.style.height);
        }
    }, [props.style])




    useEffect(() => {
    }, [commentText])

    function handleOnClick(e) {
        if (props.onClick) {
            props.onClick(e);
        }
    }

    function pushUserChat(text, userId) {
        if (_.isPlainObject(props.data) && notEmptyLength(props.data) && text && userId) {
            if (props.onNewChat) {
                setCommentText('');
                props.onNewChat(text, userId);
            }
        }
    }


    function pushUserReaction(reaction, userId) {
        if (_.isPlainObject(props.data) && notEmptyLength(props.data) && _.isPlainObject(reaction) && notEmptyLength(reaction) && userId) {
            let data = {
                type: reaction.type,
                total: 1,
                userId: userId,
                createdAt: new Date(),
            }

            if (props.onNewReaction) {
                props.onNewReaction(data, userId);
            }
        }
    }

    function getUserLastestReaction() {
        if (props.user.authenticated && _.isPlainObject(props.data)) {
            if (notEmptyLength(props.data.reactionLogs) && _.isArray(props.data.reactionLogs)) {
          
                let userLatestReaction = _.cloneDeep(props.data.reactionLogs);
                userLatestReaction = _.filter(userLatestReaction, function (reaction) {
                    return reaction.userId == props.user.info.user._id;
                })
                if (notEmptyLength(userLatestReaction)) {
                    userLatestReaction = userLatestReaction.pop();
                    return <React.Fragment>
                        <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >

                            <ReactionButton type={userLatestReaction.type} size={25} className='margin-right-xs' style={{ width: '20px', height: '20px' }} />
                            <span className='grey headline' >
                                {_.capitalize(toSnakeCase(userLatestReaction.type, ' '))}
                            </span>
                        </span>
                    </React.Fragment>
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }

    return (
        <React.Fragment>
            <Row className='width-100' gutter={[10, 0]} type="flex" align="stretch">
                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <Player
                        fluid={false}
                        playsInline
                        width={"100%"}
                        height={height}
                        src={props.data.videoUrl ? props.data.videoUrl : null}
                        poster={_.get(props, ['data', 'thumbnailUrl']) || ''}
                    >

                        <Shortcut shortcuts={newShortcuts} />
                        <BigPlayButton position="center" />
                        <ControlBar autoHide={false} >
                            <PlayToggle />
                            <ReplayControl seconds={10} order={2.1} />
                            <ForwardControl seconds={10} order={2.2} />
                        </ControlBar>
                    </Player>

                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    {

                        notEmptyLength(props.data) && _.isPlainObject(props.data) ?
                            <React.Fragment>

                                <div className="width-100 background-white padding-y-sm" style={{ height: height }}>
                                    <div className='padding-sm d-flex flex-wrap' style={{ height: defaultTitleHeight }}>
                                        <div className="flex-justify-start flex-items-align-center">
                                            <UserAvatar redirectProfile data={props.data.dealerDbId} size={50} className='margin-right-md' />
                                            <span className='d-inline-block width-80' >
                                                <div className="font-weight-normal black headline  text-truncate ">
                                                    {_.isPlainObject(props.data.dealerDbId) && notEmptyLength(objectRemoveEmptyValue(props.data.dealerDbId)) ? `${props.data.dealerDbId.firstName ? props.data.dealerDbId.firstName : ''} ${props.data.dealerDbId.lastName ? props.data.dealerDbId.lastName : ''}` : null}
                                                </div>
                                                <div className="font-weight-thin black headline text-truncate">
                                                    Recorded Live
                                                </div>
                                            </span>
                                        </div>
                                        <div className='height-40 font-weight-thin black subtitle1 width-100 text-overflow-break' style={{ overflow: 'auto' }}>
                                            <ShowMoreText
                                                lines={1}
                                            >
                                                {!props.data.titleOfChat ? null : props.data.titleOfChat}
                                            </ShowMoreText>
                                        </div>
                                        <div className='height-20 flex-items-align-center flex-justify-start width-100 padding-x-sm'>
                                            {notEmptyLength(props.data.reactionSummary) ?
                                                <React.Fragment>
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
                                                    <span className='d-inline-block margin-left-xs' >
                                                        {formatNumber(getTotalReactions(props.data.reactionSummary), 'auto', true, 1, true)}
                                                    </span>
                                                </React.Fragment>
                                                :
                                                null
                                            }
                                        </div>
                                    </div>

                                    <div className="flex-justify-space-between flex-items-align-center width-100 padding-x-md" style={{ height: defaultReactionHeight, borderTop: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>
                                        <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                            <PopOverReactionButton onClick={(reaction) => {
                                                pushUserReaction(reaction, props.user.authenticated ? props.user.info.user._id : null)
                                            }}>
                                                {
                                                    getUserLastestReaction()
                                                }
                                            </PopOverReactionButton>
                                        </span>
                                        <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' onClick={(e) => {

                                            var elmnt = document.getElementById("live-recorded-comment-container");
                                            commentRef.current.focus();
                                            var offset = 0;
                                            var elementPosition = elmnt.offsetTop;
                                            var offsetPosition = elementPosition - offset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: "smooth"
                                            });
                                        }} >
                                            <img src={commentIcon} style={{ width: '20px', height: '20px' }} className='margin-right-xs' />
                                            <span className='grey headline  ' >
                                                Comment
                                </span>
                                        </span>
                                        <ShareButtonDialog className='padding-x-md'>
                                            <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                                <img src={shareIcon} style={{ width: '20px', height: '20px' }} className='margin-right-xs' />
                                                <span className='grey headline  ' >
                                                    Share
                                </span>
                                            </span>
                                        </ShareButtonDialog>
                                    </div>

                                    <div className="padding-sm width-100" style={{ overflowY: 'auto', height: height - defaultTitleHeight - defaultReactionHeight - defaultWriteCommentHeight }}>
                                        {
                                            notEmptyLength(props.data.chatLogs) ?
                                                _.map(props.data.chatLogs, function (chatLog, index) {
                                                    return <div className="flex-justify-start flex-items-align-start margin-bottom width-100" style={{ borderBottom: '1px solid #E0E0E0' }} key={`chat-${index}`}>
                                                        <UserAvatar redirectProfile data={chatLog.userId} className='margin-right-sm' size={35} />
                                                        <span className='d-inline-block margin-bottom-sm width-100' style={{ overflow: 'hidden' }} >
                                                            <div className="headline black">
                                                                {_.isPlainObject(chatLog.userId) && notEmptyLength(objectRemoveEmptyValue(chatLog.userId)) ? `${chatLog.userId.firstName ? chatLog.userId.firstName : ''} ${chatLog.userId.lastName ? chatLog.userId.lastName : ''}` : null}
                                                            </div>
                                                            <div className="width-100">
                                                                <ShowMoreText
                                                                    lines={2}
                                                                >
                                                                    <div className='font-weight-thin headline text-overflow-break'>
                                                                        {!chatLog.value ? null : chatLog.value}
                                                                    </div>
                                                                </ShowMoreText>
                                                            </div>
                                                        </span>
                                                    </div>;
                                                })
                                                :
                                                <Empty />
                                        }
                                    </div>

                                    <div className="padding-sm width-100" style={{ height: defaultWriteCommentHeight, borderTop: '1px solid #E0E0E0' }} id="live-recorded-comment-container">
                                        {
                                            props.user.authenticated ?
                                                <React.Fragment>
                                                    <div className="flex-justify-start flex-items-align-center margin-bottom-sm">
                                                        <UserAvatar redirectProfile data={props.user.info.user} className='margin-right-sm' size={35} />
                                                        <span className='d-inline-block margin-bottom-sm' >
                                                            <div className="headline   font-weight-thin">
                                                                {`${props.user.info.user.namePrefix ? `${props.user.info.user.namePrefix}.` : ''} ${props.user.info.user.firstName ? props.user.info.user.firstName : ''} ${props.user.info.user.lastName ? props.user.info.user.lastName : ''}`}
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <Input
                                                        className='round-border-big'
                                                        placeholder="Say something..." value={commentText}
                                                        onChange={(e) => { setCommentText(e.target.value) }}
                                                        ref={commentRef}
                                                        suffix={<EmojiPickerButton
                                                            onSelect={(emoji) => { setCommentText(commentText + emoji.native) }}
                                                        />
                                                        }
                                                        onPressEnter={(e) => {
                                                            pushUserChat(commentText, props.user.authenticated ? props.user.info.user._id : null);
                                                        }}
                                                    />
                                                </React.Fragment>
                                                :
                                                <div className="flex-justify-center flex-items-align-center width-100 height-100">
                                                    <a onClick={(e) => { props.loginMode(true) }} className='underline'>Please login to comment</a>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </React.Fragment>
                            :
                            null
                    }
                </Col>

            </Row>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    setUser: setUser,
    loginMode: loginMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(LiveBoxRecorded)));