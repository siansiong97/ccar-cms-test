import { Form, Icon, Input } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// import CustomScroll from 'react-custom-scroll';
// import Scrollable from 'hide-scrollbar-react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import ShowMoreText from 'react-show-more-text';
import { getUserName, isValidNumber, notEmptyLength, objectRemoveEmptyValue } from '../../common-function';
import { loginMode } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import EmojiPickerButton from '../general/EmojiPickerButton';
import { defaultGifts, defaultReactions, liveIcon, LIVE_TEXT_TEMPLATE } from './config';
import ReactionButtonList from './reaction-button-list';
import SadVideo from './sadvideo';
// import UserAvatar from '../carFreak/components/user-avatarCCARLive';
import UserAvatar from './user-avatarCCARLive';


const defaultHeight = 550;
const defaultHeaderHeight = 100;
const defaultFooterHeight = 100;
//nicht benutzen
const videoRef = React.createRef();
const commentContainerRef = React.createRef();
const chatRestrictTime = 5000;


const LiveBox = (props) => {

  const [height, setHeight] = useState(defaultHeight);
  //immer falsh
  const [videoLoading, setVideoLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  //wirklich funktioniert
  //change this
  const [muted, setMuted] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [reactions, setReactions] = useState([]);
  //now all chats come through props.pushChat
  // const [chats, setChats] = useState([]);
  const [keepAtBottom, setKeepAtBottom] = useState(true);
  const [gifts, setGifts] = useState([]);
  const [giftAnimations, setGiftAnimations] = useState([]);
  const [testNumber, setTestnumber] = useState(2);
  const [textDelay, setTextDelay] = useState(1000);
  const [timeoutFunction, setTimeoutFunction] = useState(null);
  const [canSendChat, setCanSendChat] = useState(true);



  useEffect(() => {

  }, [props.chatSize])

  useEffect(() => {

  }, [commentText])

  useEffect(() => {
    let temp = [];
    _.forEach(defaultReactions, function (reaction) {
      temp.push({
        type: reaction,
        'mode': 'none',
        'total': 0,
      })
    })
    setReactions(temp);

    temp = [];
    _.forEach(defaultGifts, function (gift) {
      gift.total = 0;
      temp.push(gift)
    })
    setGifts(temp);

  }, [])

  useEffect(() => {
    if (!props.style || !isValidNumber(props.style.height) || !parseFloat(props.style.height) >= defaultHeight) {
      setHeight(defaultHeight);
    } else {
      setHeight(props.style.height);
    }
  }, [props.style])

  //donar wenn neu nachricht
  // useEffect(() => {
  //   // console.log('----props.pushChats', props.pushChats);
  //   if (notEmptyLength(props.newMessage)) {
  //     checkNeedKeepBottom();
  //     setChats(_.cloneDeep(chats).concat(props.newMessage));
  //   }
  // }, [props.newMessage])

  // useEffect(() => {
  //   // console.log('----props.pushChats', props.pushChats);
  //   if (notEmptyLength(props.pushChats)) {
  //     checkNeedKeepBottom();
  //     setChats(_.cloneDeep(chats).concat(props.pushChats));
  //   }
  // }, [props.pushChats])

  useEffect(() => {
    if (commentContainerRef.current) {
      if (keepAtBottom) {
        commentContainerRef.current.scrollToBottom();
      }
    }
  }, [props.pushChats])



  // useEffect(() => {

  //   if (videoRef.current) {
  //     if (props.stream) {
  //       videoRef.current.srcObject = props.stream;
  //       console.log(props.stream);
  //     } else {
  //       videoRef.current.srcObject = null;
  //     }
  //   }
  // }, [props.stream, videoRef.current])

  function handleOnClick(e) {
    if (props.onClick) {
      props.onClick(e);
    }
  }

  function checkNeedKeepBottom() {
    if (commentContainerRef.current) {
      let scrollHeight = commentContainerRef.current.getScrollHeight();
      let currentPosition = commentContainerRef.current.getValues();
      let offset = 100;
      currentPosition = currentPosition.scrollTop + currentPosition.clientHeight + offset;
      setKeepAtBottom(currentPosition >= scrollHeight ? true : false);
    }
  }

  // function modifyReactionAnimation(type, step) {
  //     if (notEmptyLength(reactions)) {

  //         let selectedReaction = _.find(reactions, function (reaction) {
  //             return reaction.type == type;
  //         })

  //         if (!isValidNumber(step)) {
  //             step = 0;
  //         } else {
  //             step = parseInt(step);
  //         }
  //         if (notEmptyLength(selectedReaction)) {
  //             let currentModeIndex = _.indexOf(defaultReactionsAnimation, selectedReaction.mode);
  //             let nextIndex = currentModeIndex + step;
  //             if (currentModeIndex != -1 && !(nextIndex + 1 > defaultReactionsAnimation.length) && !(nextIndex + 1 < 0)) {
  //                 selectedReaction.mode = defaultReactionsAnimation[currentModeIndex + step];
  //             }

  //             setReactions(_.map(reactions, function (reaction) {
  //                 return reaction.type == selectedReaction.type ? selectedReaction : reaction;
  //             }))
  //         } else {

  //             let temp = _.map(reactions, function (reaction) {
  //                 let currentModeIndex = _.indexOf(defaultReactionsAnimation, reaction.mode);
  //                 let nextIndex = currentModeIndex + step;
  //                 if (currentModeIndex != -1 && !(nextIndex + 1 > defaultReactionsAnimation.length) && !(nextIndex + 1 < 0)) {
  //                     reaction.mode = defaultReactionsAnimation[currentModeIndex + step];
  //                 }

  //                 return reaction;

  //             })

  //             setReactions(temp)
  //         }

  //     }
  // }


  function addReactionCount(type) {

    if (notEmptyLength(reactions)) {

      let selectedReaction = _.find(reactions, function (reaction) {
        return reaction.type == type;
      })

      if (notEmptyLength(selectedReaction)) {
        selectedReaction.total += 1;

        setReactions(_.map(reactions, function (reaction) {
          return reaction.type == selectedReaction.type ? selectedReaction : reaction;
        }))
      }
    }
  }

  function listenToInsertGift(gift) {

  }


  function pushUserReaction(data) {
    if (notEmptyLength(objectRemoveEmptyValue(data))) {
      addReactionCount(data.type);
      if (props.onNewReaction) {

        props.onNewReaction(data);
      }
    }
  }

  function pushUserChat() {
    // if (canSendChat) {
      if (_.trim(_.toString(commentText))) {
        let data = {
          text: commentText,
          userId: props.user.authenticated ? props.user.info.user._id : null,
          userName: props.user.authenticated ? getUserName(_.get(props.user, ['info', 'user']), 'fullName') : 'Ccar User',
          userAvatar: props.user.authenticated ? props.user.info.user.avatar : null,
        }

        checkNeedKeepBottom();
        // setChats(_.cloneDeep(chats).concat([data]))
        setCommentText('');
        setCanSendChat(false);
        setTimeout(() => {
          setCanSendChat(true);
        }, chatRestrictTime);

        if (props.onNewChat) {
          props.onNewChat({ text: commentText });
        }


      }
    // } else {
    //   message.warning('You are typing too fast...');
    // }
  }

  const _renderLiveChat = (chat) => {
    var isAnonymous;
    if(chat.type === "anonymous-joined" || chat.type === "anonymous-left"){
      isAnonymous = true;
    }else {
      isAnonymous = false;
    }

    if (_.isPlainObject(chat) && !_.isEmpty(chat)) {
      let text;
      let template = Object.entries(LIVE_TEXT_TEMPLATE);
      switch (chat.type) {
        case `${template[0][0]}`:
        case `${template[4][0]}`:
          text = <div className="flex-items-align-center flex-justify-start padding-md width-100">
            <span className='d-inline-block margin-right-sm' >
              <UserAvatar redirectProfile data={{ avatar: chat.userAvatar, name: chat.userName }} size={30} isAnonymous={isAnonymous} />
            </span>
            <span className='d-inline-block background-grey-opacity-30 white caption padding-x-md padding-y-sm round-border-big text-overflow-break' style={{ maxWidth: '80%' }} >
              <span className="blue font-weight-bold margin-right-sm" >
                {`${props.authenticated && _.get(props.user, ['info', 'user', '_id']) == chat.userId ? 'You' : chat.userName || 'Anonymous'}`}
              </span>
              {`${template[0][1] || ''}`}
            </span>
          </div>
          break;
        case `${template[1][0]}`:
        case `${template[5][0]}`:
          text = <div className="flex-items-align-center flex-justify-start padding-md width-100">
            <span className='d-inline-block margin-right-sm' >
              <UserAvatar redirectProfile data={{ avatar: chat.userAvatar, name: chat.userName }} size={30} isAnonymous={isAnonymous} />
            </span>
            <span className='d-inline-block background-grey-opacity-30 white caption padding-x-md padding-y-sm round-border-big text-overflow-break' style={{ maxWidth: '80%' }} >
              <span className="blue font-weight-bold margin-right-sm" >
                {`${props.authenticated && _.get(props.user, ['info', 'user', '_id']) == chat.userId ? 'You' : chat.userName || ''}`}
              </span>
              {`${template[1][1] || ''}`}
            </span>
          </div>
          break;
        case `${template[2][0]}`:
          text = <div className="flex-items-align-center flex-justify-start padding-md width-100">
            <span className='d-inline-block margin-right-sm' >
              <UserAvatar redirectProfile data={{ avatar: chat.userAvatar, name: chat.userName }} size={30} isAnonymous={isAnonymous} />
            </span>
            <span className='d-inline-block background-grey-opacity-30 white caption padding-x-md padding-y-sm round-border-big text-overflow-break' style={{ maxWidth: '80%' }} >
              <ShowMoreText
                lines={1}
              >
                {`${chat.userName || 'Ccar User'}: ${chat.text || ''}`}
              </ShowMoreText>
            </span>
          </div>
          break;
        case `${template[3][0]}`:
          text = <div className="flex-items-align-center flex-justify-start padding-md width-100">
            <span className='d-inline-block margin-right-sm' >
              <UserAvatar redirectProfile data={{ avatar: chat.userAvatar, name: chat.userName }} size={30} isAnonymous={isAnonymous} />
            </span>
            <span className='d-inline-block background-grey-opacity-30 white caption padding-x-md padding-y-sm round-border-big text-overflow-break' style={{ maxWidth: '80%' }} >
              <ShowMoreText
                lines={1}
              >
                {`${_.get(props.data, ['name']) || 'Dealer'}: ${chat.text || ''}`}
              </ShowMoreText>
            </span>
          </div>
          break;
        default:
          return null;
      }

      return text;
    } else {
      return null;
    }
  }

  function getDealerSocketId() {
    return props.router.query.id
  }

  // console.log(props.router.query.id);
  //get the dealers socket id
  const widukindDealerSocketId = getDealerSocketId();
  useEffect(() => {
    setCommentText('');
  }, _.get(props, "router.query.id"))

  

  return (
    <React.Fragment>
      <div className={`${props.className ? props.className : ''}`} style={{ height: height, width: '100%', ...props.style }} onClick={(e) => { handleOnClick(e) }}>
        <div id="live-box" className="width-100 relative-wrapper" style={{ height: height }} >
          {/*
            <video ref={props.videoRef} autoPlay muted={muted} className='fill-parent absolute-center background-black' onLoadedData={() => {
              setVideoLoading(false);
            }} /> 
          */}

          <SadVideo dealerSocketId={widukindDealerSocketId} muted={muted} />
          {/* <video ref={videoRef} autoPlay muted={muted} className='fill-parent absolute-center background-white' /> */}
          {/* Backdrop */}
          <div className="absolute-center flex-items-align-center flex-justify-center fill-parent background-black opacity-30 " >
            {
              videoLoading ?
                <Icon type="loading" className='white' style={{ fontSize: 80 }} />
                :
                null
            }
          </div>
          {/* Overlay screen */}
          <div className="absolute-center fill-parent" >
            <div className='relative-wrapper fill-parent'>
              {/* video header */}
              <div className="width-80 flex-justify-start flex-items-align-center padding-x-lg padding-y-sm " style={{ position: 'absolute', top: 0, left: 0, height: defaultHeaderHeight, overflow: 'auto',
              }} >
                <UserAvatar 
                  redirectProfile size={defaultHeaderHeight * 0.5} 
                  // data={props.data}
                  data={{ 
                    avatar: props.data.dealerAvatar, 
                    name: props.data.dealerDisplayName 
                  }}
                />
                <span className='d-inline-block subtitle1 white font-weight-normal margin-x-sm' >
                  <div className='font-weight-bold'>
                    {props.data.title ? props.data.title : null}
                  </div>
                  <div>
                    {`${props.data.name ? props.data.name : ''}`}
                  </div>
                </span>
                <img src={liveIcon} style={{ width: '60px', height: '60px' }} />
                <div className="background-grey-darken-4 opacity-80 round-border-light flex-items-align-center flex-justify-center padding-sm margin-x-sm">
                  <Icon type="eye" theme="filled" className='margin-right-sm white' style={{ fontSize: '20px' }} />
                  <span className='d-inline-block white subtitle2' >
                    {props.numberOfConnectedUsers}
                  </span>
                </div>
              </div>

              {/* video body */}
              <div className="width-80 padding-x-md padding-top-xl" style={{ position: 'absolute', top: defaultHeaderHeight, left: 0, height: (height - defaultHeaderHeight - defaultFooterHeight) }} >
                {/* <QueueAnim
                    type="left"
                    leaveReverse
                    delay={1000}
                    className='fill-parent'
                >
                    <div className="relative-wrapper width-50 round-border-big flex-justify-start gift-box-gradient padding-md flex-items-align-center margin-x-lg" key="1">
                        <UserAvatar size={40} data={profile[0]} className='margin-right-md' />
                        <span className='d-inline-block subtitle1 font-weight-normal white width-30 text-truncate'>
                            {`${profile[0].name ? profile[0].name : ''}`}
                        </span>
                        <span className='flex-justify-start flex-items-align-center width-100' style={{ maxHeight: '30px' }} >

                            <QueueAnim
                                type="scaleBig"
                                delay={500}
                            >
                                <img src={defaultGifts[4].icon} style={{ width: 120, height: 120 }} key="2" />
                            </QueueAnim>
                            <QueueAnim
                                type="alpha"
                                delay={700}
                                onEnd={(e) => {
                                    setTimeout(() => {
                                        setTextDelay(0);
                                    }, textDelay);
                                }}
                            >
                                <span className='d-inline-block cyan-accent-2 h4 font-weight-bold margin-x-xs' key="3" >
                                    X
                            </span>
                            </QueueAnim>
                            <span className='d-inline-block cyan-accent-2 h4 font-weight-bold margin-x-xs' key={`text-${testNumber}`}>
                                <Texty
                                    mode="reverse"
                                    type="mask-bottom"
                                    duration={300}
                                    delay={textDelay}
                                    onEnd={(e) => {
                                    }}
                                >
                                    {`${testNumber}`}
                                </Texty>
                            </span>
                        </span>
                    </div>
                </QueueAnim> */}

                <div className="width-50">
                  <Scrollbars autoHide style={{ height: (height - defaultHeaderHeight - defaultFooterHeight) * 0.8, width: '100%' }} ref={commentContainerRef}  >
                    {
                      notEmptyLength(props.pushChats) ?
                        _.compact(_.map(props.pushChats, function (chat, index) {
                          return _renderLiveChat(chat);
                        }))
                        :
                        null
                    }
                  </Scrollbars>
                </div>


              </div>

              {/* video footer */}
              <div style={{
                position: 'absolute', bottom: 0, height: defaultFooterHeight,
                // backgroundColor: 'red'

              }} className='flex-justify-space-between flex-items-align-end padding-x-lg padding-y-md width-100'>
                <span className='flex-justify-start flex-items-align-center width-70' style={{
                  }}>
                  <UserAvatar 
                  redirectProfile 
                  size={defaultFooterHeight * 0.5} 
                  data={props.user.authenticated ? props.user.info.user : {}} 
                  className='margin-right-md'></UserAvatar>
                  <span className='d-inline-block width-80' >

                    <div className='subtitle1 white font-weight-bold text-truncate margin-bottom-xs' >
                      {
                        props.user.authenticated ?
                          getUserName(_.get(props.user, ['info', 'user']), 'fullName')
                          :
                          'Ccar User'
                      }
                    </div>
                    <div className='flex-justify-center flex-items-align-center fill-parent round-border-big background-white padding-x-xs padding-y-xs no-border-input'>
                      {
                        props.user.authenticated ?
                          <React.Fragment>
                            <Input
                              className=' width-50 height-100'
                              placeholder="Say something..."
                              value={commentText}
                              maxLength={80}
                              onChange={(e) => { setCommentText(e.target.value) }}
                              onPressEnter={(e) => {
                                pushUserChat();
                              }}
                            />

                            <EmojiPickerButton onSelect={(emoji) => { setCommentText(commentText + emoji.native) }} position={{ top: -380, right: -200 }}>
                              <Icon type="smile" className='cursor-pointer grey margin-right-sm margin-top-xs' style={{ fontSize: '17px' }} />
                            </EmojiPickerButton>

                            {/* <GiftPickerButton placement="top" onSelect={(gift) => { listenToInsertGift(gift); }}>
                              <img src={giftGif} style={{ width: 23, height: 23 }} className='cursor-pointer margin-right-sm' />
                            </GiftPickerButton> */}

                            <ReactionButtonList
                              className='width-40 height-100  flex-items-align-center flex-justify-space-between'
                              reactionClassName="margin-x-sm"
                              size={23}
                              reactions={reactions}
                              onClick={(data) => { pushUserReaction(data) }}
                              pushReactions={notEmptyLength(props.pushReactions) ? props.pushReactions : []}
                              onClickAnimation
                              onClickTimeOut={3000} />
                          </React.Fragment>
                          :
                          <a onClick={(e) => { props.loginMode(true) }}>
                            Please Login To Chat...
                                                    </a>
                      }
                    </div>
                  </span>
                </span>
                <span className='flex-items-align-center flex-justify-end' >
                  {
                    !isFullScreen ?
                      <Icon type="fullscreen" className='cursor-pointer white margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => {
                        document.getElementById('live-box').requestFullscreen();
                        setIsFullScreen(true);
                      }} />
                      :
                      <Icon type="fullscreen-exit" className='cursor-pointer white margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => {
                        document.exitFullscreen().then(res => {
                          setIsFullScreen(false);
                        })
                      }} />
                  }
                  {
                    muted ?
                      <img src='/assets/live/mute.png' style={{ width: 30, height: 30 }} className="cursor-pointer margin-x-xs" onClick={(e) => { setMuted(false) }} />
                      :
                      <Icon type="sound" className='cursor-pointer white margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => { setMuted(true) }} />

                  }
                  {/* <Icon type="up-circle" className='cursor-pointer white margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => {
                                        modifyReactionAnimation(null, 1);
                                    }} />
                                    <Icon type="down-circle" className='cursor-pointer white margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => {
                                        modifyReactionAnimation(null, -1);
                                    }} /> */}

                  {/* <Icon type="up-circle" className='cursor-pointer red margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => {
                                        setTestnumber(testNumber + 1)
                                    }} />
                                    <Icon type="down-circle" className='cursor-pointer red margin-x-xs' style={{ fontSize: 30 }} onClick={(e) => {
                                        setTestnumber(testNumber - 1)
                                    }} /> */}
                </span>
              </div>
              <div>

              </div>
            </div>
          </div>

          {/* Backdrop 2 */}
          {
            _.isEmpty(props.data) ?
              <React.Fragment>
                <div className="absolute-center flex-items-align-center flex-justify-center fill-parent background-black opacity-70 " >
                </div>
                <div className="absolute-center flex-items-align-center flex-justify-center fill-parent  white h4 font-weight-normal" >
                  This live is ended or invalid now
                            </div>
              </React.Fragment>
              :
              null
          }
        </div>
      </div>
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



export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(LiveBox)));



