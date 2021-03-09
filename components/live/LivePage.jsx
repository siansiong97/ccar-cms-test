import { Button, Col, message, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import TweenOne from 'rc-tween-one';
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin';
import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { v4 } from 'uuid';
import client from '../../feathers';
import BroadcasterList from './broadcaster-list';
import { getStreamUrl } from './config';
import LiveBox from './live-box';
import { deleteSocketInfo, updateSocketInfo } from '../../redux/actions/socketRefresh-actions';
import { updateActiveMenu } from '../../redux/actions/app-actions';
import { isValidDate, isValidNumber, notEmptyLength, objectRemoveEmptyValue } from '../../common-function';
import SocialVideoTabs from '../news/social-video-tabs';
import LayoutV2 from '../general/LayoutV2';
import { withRouter } from 'next/router';


TweenOne.plugins.push(BezierPlugin);


const banner = 'hands-on-wheel.jpg'
const RECORDED_LIVE_LIMIT = 24;
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'

const messageExpireTimeout = 60000;

class LivePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      broadcaster: {},
      newMessage: {},
      activeBroadcasters: [],
      popularLives: [],
      dealerSocketId: null,
      pushReactions: [],
      pushChats: [],
      peerConnections: {},
      recordedLives: [],
      recordedLiveTotal: 0,
      recordedLivePage: 1,
      isLoading: false,
      numberOfConnectedUsers: null,
      loading: true,
      liveHasEnded: false
    }
    this.componentCleanup = this.componentCleanup.bind(this);

    if (this.props.refreshSocket) {
      this.props.updateSocketInfo(false);
      this.props.router.replace("/live")
    }
  }

  renderContent = () => {

    if (this.state.loading || _.isEmpty(this.state.broadcaster)) {
      if (this.state.loading) {
        return (
          <div style={{ height: 500, backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img style={{
              objectFit: 'contain',
              height: '50%', width: '50%',
              // position: 'absolute', bottom: 20, left: "50%",
              // transform: `translate(${x}px, ${y}px)` 
              //  transform: `translateX(-50%)` 
            }}
              src={"/assets/ccarLive/logo.png"}
            />
          </div>
        )
      } else {

        var wording;
        //if we do not show the finish line image, we show the url not valid image
        var showFinishLine;

        if (this.state.liveHasEnded) {
          wording = "The live has ended";
          showFinishLine = true;
        } else {
          wording = "The given url is not valid";
        }

        //  topImageUrl = "../../assets/ccarLive/url-not-valid.png";
        return (
          <div style={{
            height: 500, backgroundColor: 'black', display: 'flex',
            justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
          }}>
            {
              (!showFinishLine) && (
                <img style={{
                  height: 55, width: 55, marginBottom: 20
                }}
                  src={"/assets/ccarLive/url-not-valid.png"}
                />
              )
            }
            <h2 style={{
              color: 'white', fontWeight: 'bold', width: '100%', fontSize: 26,
              textAlign: 'center', color: '#FFFFFF'
            }}>{wording}</h2>
            {
              (showFinishLine) && (
                <img style={{
                  height: '75%', width: '45%',
                  position: 'absolute', bottom: 20, left: "50%",
                  // transform: `translate(${x}px, ${y}px)` 
                  transform: `translateX(-50%)`
                }}
                  src={"/assets/finishLine.png"}
                />
              )
            }
          </div>
        )
      }
    }
    else {
      return (
        <LiveBox
          numberOfConnectedUsers={this.state.numberOfConnectedUsers}
          dealerSocketId={this.state.broadcaster.dealerSocketId}
          activeSocketId={this.activeSocket}
          data={this.state.broadcaster}
          // videoRef={_.get(this.state.peerConnections, [this.state.broadcaster.dealerSocketId, 'videoRef'])}
          sharedSocket={this.activeSocket}
          //donar we will use this for messages...
          //we will also use the newMessage event for user sent messages
          pushChats={this.state.pushChats}
          pushReactions={this.state.pushReactions}
          onNewReaction={(data) => { this.sendToPeer('sendReactionToRoom', data) }}
          onNewChat={(data) => {
            this.activeSocket.emit('sendMessageToRoom', data)
            // this.sendToPeer('sendMessageToRoom', data) 
          }}
        />
      )
    }

  }

  componentDidMount = () => {
    window.addEventListener('beforeunload', () => {
      // this event might be triggered before the refresh occurs...
      this.componentCleanup();
    });

    //this is where it sets the dealer socket id
    this.setState({
      dealerSocketId: this.props.router.query.id,
    })

    if (this.props.user.authenticated) {
      var queryObj = {
        'customerName': `${this.props.user.info.user.firstName || ''} ${this.props.user.info.user.lastName || ''}`,
        customerDbId: this.props.user.info.user._id,
        customerAvatar: this.props.user.info.user.avatar,
        isDetailsComponent: true
      };
    } else {
      var queryObj = {
        'customerName': 'anonymous',
        customerAvatar: "https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/fe/6f/1a/fe6f1a3a-9d14-cfdf-499c-222b7b842fb2/source/512x512bb.jpg",
        isDetailsComponent: true
      };
    }

    this.activeSocket = io(
      // client.io.io.uri,
      getStreamUrl(client.io.io.uri),
      {
        query: queryObj
      }
    );

    this.theNewSocketEventHandlers();


    this.sendToPeer('clientRequestVideoWithDealerSocketId', { sdp: null, dealerSocketId: this.props.router.query.id });
    // this.activeSocket.emit('clientRequestVideoWithDealerSocketId', {
    //   dealerSocketId: this.props.router.query.id
    // });

    //donar das ist wichtig
    // window.onbeforeunload = (event) => {
    //   console.log('before unload event occured');
    //   console.log('componentCleanup ran through beforeunload');
    //   this.componentCleanup();
    // }

    // console.log("at the end of did mount");
    //set this.state.broadcasters


  }

  componentDidUpdate(prevProps, prevState) {


    const authenticatedStateChanged = prevProps.user.authenticated !== this.props.user.authenticated;
    if (authenticatedStateChanged) {
      let queryObj;
      if (this.props.user.authenticated) {
        queryObj = {
          'customerName': `${this.props.user.info.user.firstName || ''} ${this.props.user.info.user.lastName || ''}`,
          customerDbId: this.props.user.info.user._id,
          customerAvatar: this.props.user.info.user.avatar,
        };
      } else {
        queryObj = {
          'customerName': 'anonymous',
          customerAvatar: "https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/fe/6f/1a/fe6f1a3a-9d14-cfdf-499c-222b7b842fb2/source/512x512bb.jpg"
        };
      }
      this.activeSocket && this.activeSocket.emit('updateClientInfo', queryObj);
    }



    if (!_.isEqual(prevState.activeBroadcasters, this.state.activeBroadcasters)) {
      //happens after pushAllBroadcasters 

    }

    //this is the reload code...
    //if the broadcaster changes let the server know...
    if (prevProps.router.query.id != this.props.router.query.id) {
      //is not ran on mount

      // console.log('emitting clientRequestVideoWithDealerSocketId');
      // console.log(this.props.router.query.id);

      // this.activeSocket.emit('clientRequestVideoWithDealerSocketId', {
      //   payload: {
      //     dealerSocketId: this.props.router.query.id
      //   }
      // });


      // window.location.reload();

      //donar this part is ran when the selected dealer is changed
      //here we run the part where we ask to change rooms

      const newDealerId = this.props.router.query.id;
      let selectedBroadcaster = _.find(this.state.activeBroadcasters, function (broadcaster) {
        return broadcaster.dealerSocketId == newDealerId;
      });

      if (_.isEmpty(selectedBroadcaster)) {
        this.setState({
          broadcaster: {},
          numberOfConnectedUsers: null,
          pushChats: [],
          liveHasEnded: false
        })
        // } else if (!_.isEmpty(selectedBroadcaster)) {
      } else {
        this.setState({
          broadcaster: selectedBroadcaster,
          numberOfConnectedUsers: null,
          pushChats: [],
          liveHasEnded: false
        })
      }
      //remove the refresh socket state...
      this.props.updateSocketInfo(false);

      this.sendToPeer('clientRequestVideoWithDealerSocketId', { sdp: null, dealerSocketId: this.props.router.query.id });
    }

    // if (!_.isEqual(prevState.broadcaster, this.state.broadcaster)) {
    //   this.setState({
    //     recordedLives: [],
    //   }, () => {
    //     this.getDealerRecordedLives(0);
    //   })
    // }

    // commented out and unused...
    // if (prevState.recordedLivePage != this.state.recordedLivePage) {
    //   this.getDealerRecordedLives((this.state.recordedLivePage - 1) * RECORDED_LIVE_LIMIT)
    // }

    // if (!_.isEqual(prevState.broadcaster, this.state.broadcaster) || !_.isEqual(prevState.popularLives, this.state.popularLives)) {
    //   if (!!this.timeoutFunction) {
    //     clearTimeout(this.timeoutFunction);
    //   }
    //   this.timeoutFunction = setTimeout(() => {
    //     this.syncPeerConnections();
    //   }, 1000);
    // }


    // this.activeSocket.removeEventListener('sendAnswerToClient')
    // this.activeSocket.on('sendAnswerToClient', (data) => {
    //   this.setBroadcasterAnswer(data);
    // })


    // this.activeSocket.removeEventListener('sendCandidateToClient')
    // this.activeSocket.on('sendCandidateToClient', (data) => {
    //   this.setBroadcasterIceCandidate(data);
    // })






    this.activeSocket.removeEventListener('getSpecialLives')
    this.activeSocket.on("getSpecialLives", (data) => {
      if (data) {
        this.setState({
          popularLives: _.isArray(data.popularLives) && notEmptyLength(data.popularLives) ? data.popularLives : [],
        })
      }
    });


  }

  componentWillUnmount() {
    this.props.updateSocketInfo(false);
    this.componentCleanup();
    // window.removeEventListener('beforeunload', this.componentCleanup); // remove the event handler for normal unmounting
  }


  componentCleanup() {
    // this will hold the cleanup code
    // whatever you want to do when the component is unmounted or page refreshes
    let self = this;

    if (!!this.activeSocket) {
      this.activeSocket.close();
    }
    // if (_.isPlainObject(this.state.peerConnections) && notEmptyLength(this.state.peerConnections)) {
    //   let peerConnections = Object.entries(_.cloneDeep(this.state.peerConnections))
    //   _.forEach(peerConnections, function (pc) {
    //     self.closeThePeerConnection(pc[0]);
    //   })  
    // }

  }

  theNewSocketEventHandlers = () => {
    //this is example code

    this.activeSocket.on("pushAllBroadcaster", (broadcasters) => {

      let broadcastersArr = Object.entries(broadcasters);
      if (notEmptyLength(broadcastersArr)) {
        //Restruct data
        broadcastersArr = _.map(broadcastersArr, function (broadcaster) {
          broadcaster[1].name = broadcaster[1].dealerName;
          broadcaster[1].avatar = broadcaster[1].dealerAvatar;
          broadcaster[1].dealerSocketId = broadcaster[0];
          return broadcaster[1];
        })
      } else {
        broadcastersArr = [];
      }

      //if its the first push, set the broadcaster as well
      this.setState((x) => {
        //this condition means its the first boot
        if (x.loading) {
          const newDealerId = this.props.router.query.id;
          let selectedBroadcaster = _.find(broadcastersArr, function (broadcaster) {
            return broadcaster.dealerSocketId == newDealerId;
          });
          return {
            activeBroadcasters: broadcastersArr,
            broadcaster: (_.isEmpty(selectedBroadcaster)) ? {} : selectedBroadcaster,
            loading: false
          }
        }
        //the dealer has ended his live... 
        //make broadcaster empty but make liveHasEnded true
        // broadcastersArr
        else if (
          !_.isEmpty(x.broadcaster) && broadcastersArr.every(y => y.dealerSocketId !== x.broadcaster.dealerSocketId)
        ) {
          this.props.updateSocketInfo(true);
          return {
            activeBroadcasters: broadcastersArr,
            broadcaster: {},
            liveHasEnded: true
          }
        }
        //the screen shows that the url is invalid or the dealer has stopped his broadcast
        //and the dealer with the socket id of the route we are on has started his live 
        else if (_.isEmpty(this.state.broadcaster) && broadcastersArr.some(x => x.dealerSocketId === this.props.router.query.id)) {
          const newDealerId = this.props.router.query.id;
          let selectedBroadcaster = _.find(broadcastersArr, function (broadcaster) {
            return broadcaster.dealerSocketId == newDealerId;
          });
          this.sendToPeer('clientRequestVideoWithDealerSocketId', { sdp: null, dealerSocketId: this.props.router.query.id });
          return {
            activeBroadcasters: broadcastersArr,
            broadcaster: selectedBroadcaster,
          }
        }
        else {
          return {
            activeBroadcasters: broadcastersArr
          }
        }
      })
    })


    this.activeSocket.on("newReaction", (data) => {
      if (notEmptyLength(objectRemoveEmptyValue(data))) {
        if (notEmptyLength(data.reactionLog) && data.senderId != this.activeSocket.id) {
          if (isValidDate(data.reactionLog.createdAt) && moment().diff(moment(data.reactionLog.createdAt)) <= messageExpireTimeout) {
            data.reactionLog.key = v4();
            this.setState({
              pushReactions: [data.reactionLog],
            })
          }
        }
      }
    })


    this.activeSocket.on("getAllMessages", (data) => {


      if (notEmptyLength(objectRemoveEmptyValue(data))) {

        // if (notEmptyLength(data.chatLog) && data.userId != _.get(this.props.user, ['info', 'user', '_id'])) {
        //     if (isValidDate(data.chatLog.createdAt) && moment().diff(moment(data.chatLog.createdAt)) <= messageExpireTimeout) {
        //         this.setState({
        //             pushChats: [data.chatLog],
        //         })
        //     }
        // }
        // if ( data.userId != _.get(this.props.user, ['message'])) {
        // if (isValidDate(data.date) && moment().diff(moment(data.date)) <= messageExpireTimeout) {
        // pushChats.push(data.data)

        //donar when we get all of the messages we get the current number of connected user as well
        //do not show the client has left messages
        const messagesWithoutClientHasLeft = data._data.filter(x => {
          return x.type !== "anonymous-left" && x.type !== "client-left";
        });

        this.setState({
          pushChats: messagesWithoutClientHasLeft,
          // pushChats: data._data,
          numberOfConnectedUsers: data.connectedUsers
        });
        // }
        // }
      }
    })

    this.activeSocket.on("newMessage", (data) => {
      //do not show client has left message
      if (data.message.type === "anonymous-left" || data.message.type === "client-left") {
        return;
      }

      if (notEmptyLength(objectRemoveEmptyValue(data))) {
        this.setState((alt) => ({
          numberOfConnectedUsers: data.connectedUsers,
          pushChats: alt.pushChats.concat(data.message)
        }));
      }
    })
  }


  //commented
  syncPeerConnections = () => {
    let self = this;
    try {

      let peerConnections = Object.entries(this.state.peerConnections);


      //Broadcasters
      let newIds = [];
      if (_.isPlainObject(this.state.broadcaster) && this.state.broadcaster.dealerSocketId) {
        newIds = [this.state.broadcaster.dealerSocketId];
      }

      //Popular Lives
      if (notEmptyLength(this.state.popularLives)) {
        let popularLiveIds = _.compact(_.map(_.cloneDeep(this.state.popularLives), function (popularLive) {
          if (popularLive.liveType == 'current') {
            return popularLive.dealerSocketId;
          } else {
            return null;
          }
        }));

        newIds = _.union(newIds, popularLiveIds);
      }

      let peerConnectionToAddIds = _.compact(_.map(newIds, function (id) {
        return !_.some(peerConnections, function (peerConnection) {
          return peerConnection[0] == id;
        }) ? id : null
      }))

      let peerConnectionToRemoveIds = _.compact(_.map(peerConnections, function (peerConnection) {
        return !_.some(newIds, function (id) {
          return peerConnection[0] == id;
        }) ? peerConnection[0] : null
      }))


      _.forEach(peerConnectionToAddIds, function (id) {
        if (!self.state.peerConnections[id] || !self.state.peerConnections[id].pc) {
          self.createOffer(id);
        }
      })


      _.forEach(peerConnectionToRemoveIds, function (id) {
        if (self.state.peerConnections[id] || self.state.peerConnections[id].pc) {
          self.closeThePeerConnection(id);
        }
      })


      //Find removed peerConnections

    } catch (error) {
      console.log(error);
    }
  }


  sendToPeer = (messageType, payload) => {
    this.activeSocket.emit(messageType, {
      senderId: this.activeSocket.id,
      payload
    })
  }

  //commented
  closeThePeerConnection = (previousDealerSocketId) => {


    let peerConnections = _.cloneDeep(this.state.peerConnections);
    if (!!peerConnections[previousDealerSocketId]) {
      if (!!peerConnections[previousDealerSocketId].pc) {
        peerConnections[previousDealerSocketId].pc.close();
        this.activeSocket.emit('closeClientSocket', previousDealerSocketId);
        delete peerConnections[previousDealerSocketId];
        this.setState({
          peerConnections: peerConnections
        })
      }
    }
  }

  //commented
  setBroadcasterAnswer = (data) => {
    if (!data || !data.sdp || !data.dealerSocketId) {
      return null;
    } else {
      let peerConnections = _.cloneDeep(this.state.peerConnections);

      if (!!peerConnections[data.dealerSocketId]) {
        if (!!peerConnections[data.dealerSocketId].pc) {
          peerConnections[data.dealerSocketId].pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
      }

      this.setState({
        peerConnections: peerConnections,
      })

    }
  }

  //commented
  setBroadcasterIceCandidate = (data) => {
    if (!data || !data.candidate || !data.dealerSocketId) {
      return null;
    } else {
      let peerConnections = _.cloneDeep(this.state.peerConnections);
      if (!!peerConnections[data.dealerSocketId]) {
        if (!!peerConnections[data.dealerSocketId].pc) {
          peerConnections[data.dealerSocketId].pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        }
      }

      this.setState({
        peerConnections: peerConnections,
      })

    }
  }

  //commented
  setBroadcasterStream = (dealerSocketId, stream) => {
    try {
      let peerConnections = this.state.peerConnections;
      if (!!peerConnections[dealerSocketId] && _.get(peerConnections, [dealerSocketId, 'videoRef', 'current']) && stream) {
        let self = this;
        peerConnections[dealerSocketId].videoRef.current.srcObject = stream;
        peerConnections[dealerSocketId].stream = stream;
        this.setState({
          peerConnections: peerConnections,
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  //commented 
  createOffer = (dealerSocketId) => {


    if (!!dealerSocketId) {
      const pc_config = {
        iceServers: [{
          urls: ["stun:ss-turn2.xirsys.com"]
        }, {
          username: "K7RYJQ0iO86IzU-paa6guXxfLJ7vXWhFwfWzE3X88-LOsT0QN4vquwAUx1vsJJmqAAAAAF-yezBjY2FyMzEzMQ==",
          credential: "a5e31b16-280d-11eb-89e3-0242ac140004",
          urls: [
            "turn:ss-turn2.xirsys.com:80?transport=udp",
            "turn:ss-turn2.xirsys.com:3478?transport=udp",
            "turn:ss-turn2.xirsys.com:80?transport=tcp",
            "turn:ss-turn2.xirsys.com:3478?transport=tcp",
            "turns:ss-turn2.xirsys.com:443?transport=tcp",
            "turns:ss-turn2.xirsys.com:5349?transport=tcp"
          ]
        }]
      }
      let peerConnections = this.state.peerConnections;
      //pcdefinition
      peerConnections[dealerSocketId] = {
        pc: new RTCPeerConnection(pc_config),
        stream: null,
        videoRef: React.createRef(),
      }



      peerConnections[dealerSocketId].pc.ontrack = event => {
        this.setBroadcasterStream(dealerSocketId, event.streams[0]);
      };

      peerConnections[dealerSocketId].pc.createOffer({
        offerToReceiveVideo: 1,
        //for audio
        offerToReceiveAudio: 1
      })
        .then(sdp => {
          peerConnections[dealerSocketId].pc.setLocalDescription(sdp);

          this.setState({
            peerConnections: peerConnections,
          }, () => {
            this.sendToPeer('clientRequestVideoWithDealerSocketId', { sdp, dealerSocketId: dealerSocketId })
          })

        }).catch(x => {

          console.log('offer failed');
        });

    }
  }

  //commented
  getDealerRecordedLives = (skip) => {
    if (_.isPlainObject(this.state.broadcaster) && this.state.broadcaster.dealerDbId) {
      if (!isValidNumber(skip)) {
        skip = 0;
      } else {
        skip = parseInt(skip);
      }

      this.setState({
        isLoading: true,
      })
      client.service('live-stream-messages').find({
        query: {
          dealerDbId: this.state.broadcaster.dealerDbId,
          $sort: {
            createdAt: -1,
          },
          $limit: RECORDED_LIVE_LIMIT,
          $skip: skip,
          $populate: 'dealerDbId'
        }
      }).then(res => {
        this.setState({
          isLoading: false,
        })
        if (notEmptyLength(res.data)) {
          this.setState({
            recordedLives: this.state.recordedLives.concat(res.data),
            recordedLiveTotal: res.total,
          })
        } else {
          this.setState({
            recordedLives: this.state.recordedLives.concat([]),
            recordedLiveTotal: res.total,
          })
        }
      }).catch(err => {
        this.setState({
          isLoading: false,
        })
        message.error(err.message)
      });
    }
  }


  render() {

    let self = this;

    return (
      <React.Fragment>
        <LayoutV2 showCompareCarButton={false} >
          <div className='section' style={{ backgroundColor: 'powderblue' }}>
            <div className='padding-x-md padding-y-lg'>
              <Row gutter={[10, 10]} type="flex" align="stretch">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="h6 font-weight-bold">
                    LIVE
                                </div>
                  <div className="padding-md background-white margin-top-md">
                    <BroadcasterList activeBroadcasters={this.state.activeBroadcasters} showName allowSearch />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div >
                    {this.renderContent()}
                  </div>
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Row>
                    <Col className="gutter-row" span={24} className="margin-bottom-sm margin-top-sm ">
                      <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social Videos</span>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ overflowX: 'auto' }} >
                      <SocialVideoTabs />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo?type=videos"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* {
                notEmptyLength(this.state.recordedLives) ?

                  <Row className='margin-top-xl'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="fill-parent background-white padding-md">

                        <div className="h6 font-weight-bold margin-bottom-md">
                          Recorded Live
                                        </div>

                        <WindowScrollLoadWrapper scrollRange={document.body.scrollHeight * 0.5} onScrolledBottom={() => {
                          if (arrayLengthCount(this.state.recordedLives) < this.state.recordedLiveTotal) {
                            this.setState({
                              recordedLivePage: this.state.recordedLivePage + 1,
                            })
                          }
                        }} >
                          <div className="width-100 padding-md">
                            <Row gutter={[15, 15]} type="flex">
                              {
                                notEmptyLength(this.state.recordedLives) ?
                                  this.state.recordedLives.map(function (recordedLive, index) {
                                    return (
                                      <React.Fragment>
                                        <Col xs={24} sm={24} md={12} lg={8} xl={8} key={`recorded-live-box-${index}`}>
                                          <LiveBoxPreview2
                                            data={recordedLive}
                                            className='cursor-pointer box-shadow-light'
                                            onClick={(e) => {
                                              self.props.router.push(`/live/${recordedLive._id}/recorded`)
                                            }}
                                            stream={recordedLive.videoUrl ? recordedLive.videoUrl : null} />
                                        </Col>
                                      </React.Fragment>
                                    )
                                  })
                                  :
                                  <Col xs={24} sm={24} md={24} lg={24} xl={24} className='background-white'>
                                    <Empty />
                                  </Col>
                              }
                            </Row>
                          </div>
                        </WindowScrollLoadWrapper>
                        {
                          this.state.isLoading ?
                            <div className="width-100 padding-md flex-justify-center flex-items-align-center" style={{ height: 40 }}>
                              <Icon type="loading" style={{ fontSize: 30 }} />
                            </div>
                            :
                            null
                        }
                      </div>
                    </Col>
                  </Row>
                  :
                  null
              } */}
              {/* <Row className='margin-top-xl'>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div className='width-100 height-auto background-white padding-md'>

                                        <div className="h6 font-weight-bold">
                                            Popular Live
                                        </div>
                                        <div className="fill-parent background-white padding-md">
                                            <Row gutter={[15,15]}>
                                            {
                                                notEmptyLength(this.state.popularLives) ?
                                                    this.state.popularLives.map(function (popularLive, index) {
                                                        return (
                                                            <React.Fragment>
                                                                <Col xs={24} sm={24} md={12} lg={8} xl={8} key={`popular-live-box-${index}`}>
                                                                    <LiveBoxPreview2
                                                                        data={popularLive}
                                                                        className='cursor-pointer box-shadow-light'
                                                                        onClick={(e) => {
                                                                            if (popularLive.liveType == 'current') {
                                                                                self.props.router.push(`/live/${popularLive.dealerSocketId}`)
                                                                            }

                                                                            if (popularLive.liveType == 'recorded') {
                                                                                self.props.router.push(`/live/${popularLive._id}/recorded`)
                                                                            }
                                                                        }}
                                                                        stream={
                                                                            popularLive.liveType == 'current' ?
                                                                                !!self.state.peerConnections[popularLive.dealerSocketId] ?
                                                                                    self.state.peerConnections[popularLive.dealerSocketId].stream
                                                                                    :
                                                                                    null
                                                                                :
                                                                                popularLive.videoUrl
                                                                        } />
                                                                </Col>
                                                            </React.Fragment>
                                                        )
                                                    })
                                                    :
                                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className='background-white'>
                                                        <Empty />
                                                    </Col>
                                            }
                                            </Row>
                                        </div>
                                    </div>
                                </Col> 
                            </Row>*/}
            </div>
          </div>

        </LayoutV2>
      </React.Fragment >
    )
  }

}

const mapStateToProps = state => {
  return ({
    app: state.app,
    user: state.user,
    refreshSocket: state.socketRefresh,
  })
};

const mapDispatchToProps = {
  updateActiveMenu: updateActiveMenu,
  updateSocketInfo,
  deleteSocketInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LivePage));