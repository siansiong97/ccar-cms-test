import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import client from '../../feathers'
import axios from 'axios';
import { Row, Col, Card, Button, Tabs, Empty, message, Modal, Icon, Input } from 'antd';
import LayoutV2 from '../Layout-V2';
import {
  updateActiveMenu,
  loading
} from '../../actions/app-actions';

import CustomTabs from '../commonComponent/custom-tabs';
import { notEmptyLength, objectRemoveEmptyValue, arrayLengthCount, isValidNumber } from '../profile/common-function';
import LiveBoxPreview1 from './live-box-preview-1';
import { liveDummyData } from './dummy-data';
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin';
import TweenOne from 'rc-tween-one';
import { reactionGif, defaultReactions, reactionAnimationTransitions, closeThePeerConnection, syncReactionSummary } from './config';
import io from 'socket.io-client'
import { v4 } from 'uuid';
import BroadcasterList from './broadcaster-list';
import { profile } from '../carFreak/dummy-data';
import { fetchClientSocketIo, clearClientSocketIo } from '../../actions/live-action';
import LiveBoxPreview2 from './live-box-preview-2';
import LiveBoxRecorded from './live-box-recorded';
import Scrollbars from 'react-custom-scrollbars';
import WindowScrollLoadWrapper from '../commonComponent/window-scroll-load-wrapper';
import BroadCasterListScroll from './BroadCasterListScroll';
TweenOne.plugins.push(BezierPlugin);


const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const TOP_LIVE_LIMIT = 2;
const RECORDED_LIVE_LIMIT = 6;

class LiveRecordedPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      broadcaster: {},
      popularLives: [],
      recordedLives: [],
      recordedLiveTotal: 0,
      recordedLivePage: 1,
      isLoading: false,
      activeBroadcasters: [],
    }

  }

  componentDidMount = () => {

    this.getLiveData();
  }

  componentDidUpdate(prevProps, prevState) {



    if (!_.isEqual(prevProps.match.params.id, this.props.router.query.id)) {
      this.getLiveData();
    }


    if (!_.isEqual(prevState.broadcaster, this.state.broadcaster)) {

      this.setState({
        recordedLives: [],
      }, () => {
        this.getDealerRecordedLives(0);
      })
    }

    if (prevState.recordedLivePage != this.state.recordedLivePage && !_.isEmpty(this.state.broadcaster)) {
      this.getDealerRecordedLives((this.state.recordedLivePage - 1) * RECORDED_LIVE_LIMIT)
    }


  }

  componentWillUnmount() {
    let self = this;
    if (_.isPlainObject(this.state.peerConnections) && notEmptyLength(this.state.peerConnections)) {
      let peerConnections = Object.entries(_.cloneDeep(this.state.peerConnections))
      _.forEach(peerConnections, function (pc) {
        self.closeThePeerConnection(pc[0]);
      })
      if (!!this.activeSocket) {
        this.activeSocket.close();
      }
    }
  }

  getLiveData = () => {
    if (this.props.router.query.id) {
      this.props.loading(true);
      client.service('live-stream-messages').find({
        query: {
          _id: this.props.router.query.id,
          $limit: 1,
          $sort: {
            createdAt: -1,
          },
          $populate: [
            {
              path: 'dealerDbId',
              ref: 'users'
            },
            {
              path: 'chatLogs.userId',
              ref: 'users'
            },
          ],
        }
      }).then(res => {
        this.props.loading(false);

        if (notEmptyLength(res.data)) {
          this.setState({
            broadcaster: res.data[0],
          })
        } else {
          this.setState({
            broadcaster: {},
          })
        }
      }).catch(err => {
        this.props.loading(false);
        message.error(err.message)
      });
    } else {
      this.setState({
        broadcaster: {},
      })
    }
  }

  pushChat = (text, userId) => {
    if (_.isPlainObject(this.state.broadcaster) && notEmptyLength(this.state.broadcaster) && text && userId) {
      let broadcaster = _.cloneDeep(this.state.broadcaster);
      broadcaster.chatLogs = broadcaster.chatLogs.concat({
        value: text,
        userId: userId,
        createdAt: new Date(),
      });
      client.service('live-stream-messages').patch(this.props.router.query.id, broadcaster).then(res => {
        if (res) {
          this.setState({
            broadcaster: {
              ...this.state.broadcaster,
              chatLogs: this.state.broadcaster.chatLogs.concat({
                value: text,
                userId: this.props.user.info.user,
                createdAt: new Date(),
              }),
              totalChat: this.state.broadcaster.totalChat + 1,
            }

          })
        }
      }).catch(err => {
        message.error(err.message)
      });
    }
  }

  pushReaction = (reaction, userId) => {
    if (_.isPlainObject(this.state.broadcaster) && notEmptyLength(this.state.broadcaster) && reaction && userId) {
      let broadcaster = _.cloneDeep(this.state.broadcaster);
      broadcaster.reactionLogs = broadcaster.reactionLogs.concat([reaction]);
      broadcaster.reactionSummary = syncReactionSummary(broadcaster.reactionLogs);
      this.setState({
        broadcaster: {
          ...this.state.broadcaster,
          reactionLogs: broadcaster.reactionLogs,
          reactionSummary: broadcaster.reactionSummary,
        }
      })

      client.service('live-stream-messages').patch(this.props.router.query.id, broadcaster).then(res => {
      }).catch(err => {
        message.error(err.message)
      });
    }
  }

  getDealerRecordedLives = (skip) => {
    if (_.isPlainObject(this.state.broadcaster) && this.state.broadcaster.dealerDbId && this.props.router.query.id) {
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
          _id: {
            $ne: this.props.router.query.id,
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
          isLoading: true,
        })
        message.error(err.message)
      });
    } else {
      this.setState({
        recordedLives: [],
        recordedLivePage: 1,
        recordedLiveTotal: 0,
      })
    }
  }

  render() {
    let self = this;
    return (
      <React.Fragment>
        <LayoutV2>
          <div className='section'>
            <div className='padding-x-md padding-y-lg'>
              <Row gutter={[10, 20]} type="flex" align="stretch">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="h6 font-weight-bold">
                    LIVE
                                </div>
                  <div className="padding-md background-white margin-top-md">
                    <BroadCasterListScroll activeBroadcasters={this.state.activeBroadcasters} showName allowSearch />
                  </div>

                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                  <div className="h6 font-weight-bold">LATEST LIVE</div>
                  <div className="width-100 padding-md">
                    {
                      _.isPlainObject(this.state.broadcaster) && notEmptyLength(this.state.broadcaster) ?
                        <LiveBoxRecorded data={_.isPlainObject(this.state.broadcaster) && notEmptyLength(this.state.broadcaster) ? this.state.broadcaster : {}}
                          onNewChat={(text, userId) => {
                            self.pushChat(text, userId);
                          }}
                          onNewReaction={(reaction, userId) => {
                            self.pushReaction(reaction, userId);
                          }}
                        />
                        :
                        <div className="width-100 background-white">
                          <Empty>
                          </Empty>
                        </div>
                    }
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  {
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
                                                  self.props.router.push(`/live/${recordedLive._id}/recorded`, undefined, { shallow : false })
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
                  }
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
  updateActiveMenu: updateActiveMenu,
  fetchClientSocketIo: fetchClientSocketIo,
  clearClientSocketIo: clearClientSocketIo,
  loading: loading,
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveRecordedPage);