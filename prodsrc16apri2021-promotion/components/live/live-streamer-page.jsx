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
import LiveRecordedPage from './live-recorded-page';
TweenOne.plugins.push(BezierPlugin);


const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const TOP_LIVE_LIMIT = 2;
const RECORDED_LIVE_LIMIT = 6;

class LiveStreamerPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStream: {},
        }

    }

    componentDidMount = () => {

        this.getLiveData();
    }



    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.match.params.id, this.props.router.query.id) && this.props.router.query.id) {
            this.getLiveData();
        }
    }

    getLiveData() {
        if (this.props.router.query.id) {
            this.props.loading(true);
            client.service('live-stream-messages').find({
                query: {
                    dealerDbId: this.props.router.query.id,
                    $limit: 1,
                    $sort: {
                        createdAt: -1,
                    },
                    $populate: [
                        {
                            path: 'dealerDbId',
                            ref: 'users'
                        },
                    ],
                }
            }).then(res => {
                this.props.loading(false);
 
                if (notEmptyLength(res.data)) {
                    this.setState({
                        selectedStream: res.data[0],
                    })
                } else {
                    this.setState({
                        selectedStream: {},
                    })
                }
            }).catch(err => {
                this.props.loading(false);
                message.error(err.message)
            });
        }
    }


    render() {
        return (
            <React.Fragment>
                <LiveRecordedPage match={{ ...this.props.match, params: { id: this.state.selectedStream._id } }} history={this.props.router}></LiveRecordedPage>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveStreamerPage);