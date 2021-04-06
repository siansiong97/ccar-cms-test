import { Button, Col, Empty, message, Row } from 'antd';
import _ from 'lodash';
import TweenOne from 'rc-tween-one';
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin';
import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { v4 } from 'uuid';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue } from '../../common-function';
import client from '../../feathers';
import { updateActiveMenu } from '../../redux/actions/app-actions';
import { clearClientSocketIo, fetchClientSocketIo } from '../../redux/actions/live-action';
import { updateSocketInfo } from '../../redux/actions/socketRefresh-actions';
import LayoutV2 from '../general/LayoutV2';
import SocialVideoTabs from '../news/social-video-tabs';
import BroadcasterList from './broadcaster-list';
import { getStreamUrl } from './config';
import LiveBoxPreview1 from './live-box-preview-1';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { isIOS, isMobile } from 'react-device-detect'
import BroadCasterListScroll from './BroadCasterListScroll';

TweenOne.plugins.push(BezierPlugin);


const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const TOP_LIVE_LIMIT = 2;
const RECORDED_LIVE_LIMIT = 6;
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



class LiveIndex extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      peerConnections: {},
      videoRef: {},
      broadcasters: [],
      filteredBroadcasters: [],
      connectedUsers: 0,
      searchWord: '',
      popularLives: [],
      recordedLives: [],
      recordedLivePage: 1,
      recordedLiveTotal: 0,
      isLoading: false,
    }

    this.componentCleanup = this.componentCleanup.bind(this);
  }

  componentDidMount = () => {
    this.props.updateSocketInfo(false);
    // this.getRecordedLives();
    const isLoggedIn = _.isEmpty(this.props.user.info.user);

    // "https://upload.wikimedia.org/wikipedia/commons/f/f8/Odin%2C_der_G%C3%B6ttervater.jpg"
    this.activeSocket = io(
      // client.io.io.uri,
      getStreamUrl(client.io.io.uri),
      {
        query: {
          // 'customerName': this.props.displayName,
          // customerDbId: this.props.userId,
          // customerAvatar: this.props.userAvatar
          'customerName': this.props.user.authenticated ? `${this.props.user.info.user.firstName} ${this.props.user.info.user.lastName}` : 'Ccar User',
          customerDbId: this.props.user.authenticated ? this.props.user.info.user._id : v4(),
          customerAvatar: this.props.user.authenticated ? _.get(this.props.user, ['info', 'user', 'avatar']) || "https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/fe/6f/1a/fe6f1a3a-9d14-cfdf-499c-222b7b842fb2/source/512x512bb.jpg" : "https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/fe/6f/1a/fe6f1a3a-9d14-cfdf-499c-222b7b842fb2/source/512x512bb.jpg"
        }
      }
    );
    this.newSocketConfig(this.activeSocket);
    //this o
    // this.socketConfig();
    window.addEventListener('beforeunload', this.componentCleanup);
  }

  UNSAFE_componentWillMount() {
    this.props.updateActiveMenu('4');
  }

  componentDidUpdate(prevProps, prevState) {


    // if (!_.isEqual(prevState.broadcasters, this.state.broadcasters)) {

    //   // this.socketConfig();
    //   if (!!this.timeoutFunction) {
    //     clearTimeout(this.timeoutFunction);
    //   }
    //   this.timeoutFunction = setTimeout(() => {
    //     // this.syncPeerConnections();
    //   }, 1000);

    // }


    // if (!_.isEqual(prevState.peerConnections, this.state.peerConnections)) {
    //   console.log('peerConnections');
    //   console.log(this.state.peerConnections);
    // }

    // if (prevState.recordedLivePage != this.state.recordedLivePage) {
    //   this.getRecordedLives((this.state.recordedLivePage - 1) * RECORDED_LIVE_LIMIT)
    // }

    if (prevState.searchWord != this.state.searchWord) {
      // let data = _.cloneDeep(this.state.broadcasters);
      //no need to clone deep cuz filter returns a new obj
      let data = this.state.broadcasters;
      let self = this;
      if (this.state.searchWord != null) {
        data = _.filter(data, function (item) {
          let regex = new RegExp(`^${self.state.searchWord}`, 'i');
          return regex.test(item.name);
        })
      }

      this.setState({
        filteredBroadcasters: data,
      })
    }

  }

  componentWillUnmount() {

    if (isIOS && isMobile) {
      setTimeout(function () { window.location = `https://apps.apple.com/my/app/ccar-my/id1526288072`; }, 25);
      window.location = "ccarmy:/" + this.props.location.pathname
    }

    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup); // remove the event handler for normal unmounting
  }


  componentCleanup() {
    // this will hold the cleanup code
    // whatever you want to do when the component is unmounted or page refreshes

    let self = this;
    // if (_.isPlainObject(this.state.peerConnections) && notEmptyLength(this.state.peerConnections)) {
    //   let peerConnections = Object.entries(this.state.peerConnections)
    //   _.forEach(peerConnections, function (pc) {
    //     self.closeThePeerConnection(pc[0]);
    //   })
    //   if (!!this.activeSocket) {
    //     this.activeSocket.close();
    //   }
    // }
    self.activeSocket && self.activeSocket.close();

  }

  newSocketConfig = (socket) => {
    socket.on("pushAllBroadcaster", (broadcasters) => {

      let broadcastersArr = Object.entries(broadcasters);


      if (notEmptyLength(broadcastersArr)) {
        //Restruct data
        broadcastersArr = _.map(broadcastersArr, function (broadcaster) {
          broadcaster[1].name = broadcaster[1].dealerName;
          broadcaster[1].avatar = broadcaster[1].dealerAvatar;
          broadcaster[1].dealerSocketId = broadcaster[0];
          broadcaster[1].dealerVideoThumbnailUrl = `${getStreamUrl(client.io.io.uri)}/dealerVideoThumbnails/${broadcaster[0]}.png`
          return broadcaster[1];
        })
      } else {
        broadcastersArr = [];
      }

      this.setState(() => {
        return {
          broadcasters: broadcastersArr,
          // broadcasters: _.slice(broadcastersArr, 0, TOP_LIVE_LIMIT),
          filteredBroadcasters: broadcastersArr,
          // activeBroadcasterId: broadcastersArr[0][0],
        }
      })

    })
  }


  socketConfig() {

    this.activeSocket.removeEventListener('sendAnswerToClient')
    this.activeSocket.on('sendAnswerToClient', (data) => {
      this.setBroadcasterAnswer(data);
    })


    this.activeSocket.removeEventListener('sendCandidateToClient')
    this.activeSocket.on('sendCandidateToClient', (data) => {
      this.setBroadcasterIceCandidate(data);
    })


    this.activeSocket.removeEventListener('pushAllBroadcaster')
    this.activeSocket.on("pushAllBroadcaster", (broadcasters) => {

      let broadcastersArr = Object.entries(broadcasters);


      if (notEmptyLength(broadcastersArr)) {
        //Restruct data
        broadcastersArr = _.map(broadcastersArr, function (broadcaster) {
          broadcaster[1].name = broadcaster[1].dealerName;
          broadcaster[1].avatar = broadcaster[1].dealerAvatar;
          broadcaster[1].dealerSocketId = broadcaster[0];
          broadcaster[1].dealerVideoThumbnailUrl = `${getStreamUrl(client.io.io.uri)}/dealerVideoThumbnails/${broadcaster[0]}.png`
          return broadcaster[1];
        })
      } else {
        broadcastersArr = [];
      }

      if (!_.isEqual(this.state.broadcasters, broadcastersArr)) {
        this.setState(() => {
          return {
            // broadcasters: _.slice(broadcastersArr, 0, TOP_LIVE_LIMIT),
            broadcasters: broadcastersArr,
            filteredBroadcasters: broadcastersArr,
            // activeBroadcasterId: broadcastersArr[0][0],
          }
        })
      }
    })


    this.activeSocket.removeEventListener('newMessage')
    this.activeSocket.on("newMessage", (data) => {

      if (notEmptyLength(objectRemoveEmptyValue(data))) {
        let temp = _.map(this.state.broadcasters, function (broadcaster) {
          if (broadcaster.dealerSocketId == data.dealerSocketId) {
            broadcaster.connectedUsers = data.connectedUsers;
          }
          return broadcaster;
        })
        this.setState({
          broadcasters: temp,
        })
      }
    })


    this.activeSocket.removeEventListener('getAllMessages')
    this.activeSocket.on("getAllMessages", (data) => {
      let temp = _.map(this.state.broadcasters, function (broadcaster) {
        if (broadcaster.dealerSocketId == data.dealerSocketId) {
          broadcaster = { ...broadcaster, ...data };
        }
        return broadcaster;
      })
      this.setState({
        broadcasters: temp,
      })
    })


    this.activeSocket.removeEventListener('getSpecialLives')
    // this.activeSocket.on("getSpecialLives", (data) => {
    //     if (data) {
    //         this.setState({
    //             popularLives: _.isArray(data.popularLives) && notEmptyLength(data.popularLives) ? data.popularLives : [],
    //         })
    //     }
    // });


  }

  syncPeerConnections = () => {
    let self = this;
    try {

      let peerConnections = Object.entries(this.state.peerConnections);
      //Broadcasters
      let newIds = _.compact(_.map(_.cloneDeep(this.state.broadcasters), function (broadcaster) {
        return broadcaster.dealerSocketId;
      }));


      // if (notEmptyLength(this.state.popularLives)) {
      //     let popularLiveIds = _.compact(_.map(_.cloneDeep(this.state.popularLives), function (popularLive) {
      //         if (popularLive.liveType == 'current') {
      //             return popularLive.dealerSocketId;
      //         } else {
      //             return null;
      //         }
      //     }));

      //     newIds = _.union(newIds, popularLiveIds);
      // }


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

  //cleared
  sendToPeer = (messageType, payload) => {
    this.activeSocket.emit(messageType, {
      senderId: this.activeSocket.id,
      payload
    })
  }

  //cleared
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
  //cleared
  setBroadcasterAnswer = (data) => {
    if (!data || !data.sdp || !data.dealerSocketId) {
      return null;
    } else {
      let peerConnections = this.state.peerConnections;
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
  //cleared
  setBroadcasterIceCandidate = (data) => {
    if (!data || !data.candidate || !data.dealerSocketId) {
      return null;
    } else {
      let peerConnections = this.state.peerConnections;
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

  //cleared
  setBroadcasterStream = (dealerSocketId, stream) => {
    try {
      let peerConnections = this.state.peerConnections;
      let self = this;
      if (!!peerConnections[dealerSocketId] && _.get(peerConnections, [dealerSocketId, 'videoRef', 'current']) && stream) {
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

  //cleared
  createOffer = (dealerSocketId) => {
    if (!!dealerSocketId) {

      let self = this;

      let peerConnections = this.state.peerConnections;
      peerConnections[dealerSocketId] = {
        pc: new RTCPeerConnection(pc_config),
        videoRef: React.createRef(),
        stream: null,
      }

      peerConnections[dealerSocketId].pc.ontrack = event => {
        self.setBroadcasterStream(dealerSocketId, event.streams[0]);
      };

      peerConnections[dealerSocketId].pc.createOffer({
        offerToReceiveVideo: 1,
        //for audio
        offerToReceiveAudio: 1
      })
        .then(sdp => {
          peerConnections[dealerSocketId].pc.setLocalDescription(sdp);

          self.setState({
            peerConnections: peerConnections,
          }, () => {
            self.sendToPeer('clientRequestVideoWithDealerSocketId', { sdp, dealerSocketId: dealerSocketId })
          })

        }).catch(x => {

          console.log('offer failed');
        });

    }
  }

  //cleared
  getRecordedLives = (skip) => {
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
        $limit: RECORDED_LIVE_LIMIT,
        $sort: {
          createdAt: -1,
        },
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


  _renderTopLives = () => {
    let self = this;

    if (notEmptyLength(this.state.broadcasters)) {
      return (
        this.state.broadcasters.map(function (broadcaster) {
          return (
            <React.Fragment>
              <Col xs={24} sm={24} md={12} lg={8} xl={8} >
                <Link shallow={false} href={`/live/${broadcaster.dealerSocketId}`} >
                  <a>
                    <LiveBoxPreview1
                      data={broadcaster}
                      key={`live-box-${broadcaster.dealerSocketId}`}
                      className='cursor-pointer'
                      videoRef={_.get(self, ['state', 'peerConnections', _.get(broadcaster, ['dealerSocketId']), 'videoRef'])}

                      dealerSocketId={broadcaster.dealerSocketId}
                      sharedSocket={self.activeSocket}
                    />
                  </a>
                </Link>
              </Col>
            </React.Fragment>
          )
        })
      )
    } else {
      return <Col xs={24} sm={24} md={24} lg={24} xl={24} className='background-white'>
        <Empty />
      </Col>
    }
  }

  //@implementation new socket code


  //@end new socket code
  render() {
    let self = this;
    return (
      <React.Fragment>
        <LayoutV2>
          <div className='section'>
            <div className='padding-x-md padding-y-lg'>
              <Row gutter={[10, 30]} type="flex" align="stretch">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                  {/* <div className="h6 font-weight-bold">
                    Live
                  </div> */}
                  <div className="width-100 background-white padding-md">
                    <div className="width-100 ">
                      <BroadCasterListScroll
                        showName={true}
                        activeBroadcasters={notEmptyLength(this.state.filteredBroadcasters) ? this.state.filteredBroadcasters : []}
                        allowSearch
                      />
                    </div>
                  </div>
                </Col>

                {
                  _.isArray(this.state.broadcasters) && !_.isEmpty(this.state.broadcasters) ?
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="h6 font-weight-bold">TOP LIVE</div>
                    </Col>
                    :
                    null
                }
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Row gutter={[10,10]}>
                    {
                      _.isArray(this.state.broadcasters) && !_.isEmpty(this.state.broadcasters) ?
                        this._renderTopLives()
                        :
                        null
                    }

                  </Row>
                </Col>

                {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div className="h6 font-weight-bold">
                                        Popular Live
                                </div>
                                    <div className="fill-parent background-white padding-md">
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
                                                                    if(popularLive.liveType == 'current'){
                                                                        self.props.router.push(`/live/${popularLive.dealerSocketId}`) 
                                                                    }

                                                                    if(popularLive.liveType == 'recorded'){
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
                                    </div>
                                </Col> */}

                {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="fill-parent background-white padding-md">

                    <div className="h6 font-weight-bold">Recorded Live</div>

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
                        <div className="width-100 padding-md flex-justify-center flex-items-align-center" style={{ height : 40 }}>
                          <Icon type="loading" style={{ fontSize: 30 }} />
                        </div>
                        :
                        null
                    }
                  </div>
                </Col> */}

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
            </div>
          </div>

        </LayoutV2>
      </React.Fragment >
    )
  }

}

const mapStateToProps = state => ({
  app: state.app,
  user: state.user,
});

const mapDispatchToProps = {
  updateSocketInfo,
  updateActiveMenu: updateActiveMenu,
  fetchClientSocketIo: fetchClientSocketIo,
  clearClientSocketIo: clearClientSocketIo,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LiveIndex));
