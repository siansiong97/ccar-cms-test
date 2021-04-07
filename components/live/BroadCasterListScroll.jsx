import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Icon, Input, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
// import UserAvatar from './user-avatar';
// import UserAvatar from '../carFreak/components/user-avatar';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import client from '../../feathers';
import UserAvatar from './user-avatarCCARLive';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue, viewPort } from '../../common-function';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';


const itemCol = {
    xs: 6,
    sm: 6,
    md: 4,
    lg: 2,
    xl: 2,
    xxl: 2,
}

const BROADCASTER_LIMIT = 40;

const BroadcasterListScroll = (props) => {

    const [broadcasters, setBroadcasters] = useState([])
    const [defaultBroadcasters, setDefaultBroadcasters] = useState([])
    const [activeBroadcasters, setActiveBroadcasters] = useState([])
    const [searchWord, setSearchWord] = useState('');




    useEffect(() => {
        if (_.isArray(props.broadcasters)) {
            setDefaultBroadcasters(props.broadcasters);
        } else {
            getDefaultBroadCasters();
        }
    }, [props.broadcasters])

    useEffect(() => {
        if (_.isArray(props.activeBroadcasters) && notEmptyLength(props.activeBroadcasters)) {
            setActiveBroadcasters(props.activeBroadcasters);
        } else {
            setActiveBroadcasters([]);
        }
    }, [props.activeBroadcasters])


    useEffect(() => {

        setBroadcasters(reorderActiveBroadcaster(filterSearchWord(defaultBroadcasters), activeBroadcasters));

    }, [searchWord, activeBroadcasters, defaultBroadcasters])


    function getDefaultBroadCasters() {
        client.service('users').find({
            query: {
                allowLive: 'yes',
                // $limit: BROADCASTER_LIMIT,
            }
        }).then(res => {
            if (notEmptyLength(res.data)) {
                setDefaultBroadcasters(res.data);
            } else {
                setDefaultBroadcasters([]);
            }
        }).catch(err => {
            message.error(err.message)
        });
    }

    function reorderActiveBroadcaster(broadcasters, activeBroadcasters) {

        if (_.isArray(activeBroadcasters) && notEmptyLength(broadcasters)) {
            //Put Active Broadcaster to front
            let newData = _.sortBy(broadcasters, function (broadcaster) {
                return isActiveBroadcaster(broadcaster) ? -1 : 1;
            })
            return newData;
        } else {
            return broadcasters;
        }
    }

    function filterSearchWord(broadcasters) {
        if (_.isArray(broadcasters) && notEmptyLength(broadcasters) && searchWord != null) {
            try {
                let newData = _.filter(broadcasters, function (item) {
                    if (!item.name) {
                        item.name = `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`
                    }
                    let regex = new RegExp(`^${searchWord}`, 'i');
                    return regex.test(item.name);
                })
                return newData;
            } catch {
                return [];
            }
        } else {
            return broadcasters;
        }
    }

    function isActiveBroadcaster(broadcaster) {
        if (_.isPlainObject(broadcaster) && notEmptyLength(objectRemoveEmptyValue(broadcaster))) {
            return _.some(activeBroadcasters, function (activeBroadcaster) {
                return activeBroadcaster.dealerDbId == broadcaster._id
            })
        } else {
            return false;
        }
    }

    return (
        <React.Fragment>
            <div id="broadcaster-list-container" className={`width-100 height-100 ${props.className ? props.className : ''}`} style={{ ...props.style }}>

                {
                    props.allowSearch != null && props.allowSearch == true ?
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className='width-30 round-border-big thin-border padding-x-sm padding-y-xs margin-bottom-lg'>
                                <Input placeholder="Search" className='no-border-input' size="small" compact suffix={<Icon type="search" />} onChange={(e) => { setSearchWord(e.target.value) }} ></Input>
                            </div>
                        </Col>
                        :
                        null

                }

                <Scrollbars autoHide autoHeight >
                    <div className=" flex-items-align-start padding-x-md">
                        {
                            _.isArray(broadcasters) && notEmptyLength(broadcasters) ?
                                _.map(broadcasters, function (broadcaster) {
                                    return (
                                        <span className={`relative-wrapper d-inline-block ${isActiveBroadcaster(broadcaster) ? 'cursor-pointer' : 'cursor-not-allowed'} margin-right-xl`} onClick={(e) => {
                                            let selectedActiveBroadcaster = _.find(activeBroadcasters, function (activeBroadcaster) {
                                                return activeBroadcaster.dealerDbId == broadcaster._id;
                                            })
                                            if (!selectedActiveBroadcaster || !selectedActiveBroadcaster.dealerSocketId) {
                                                // props.router.push(`/live-streamer/${broadcaster._id}`)
                                            }
                                            else {
                                                //donar it manages the routes
                                                props.router.push(`/live/${selectedActiveBroadcaster.dealerSocketId}`, undefined, { shallow: true })
                                            }
                                        }}>
                                            <UserAvatar
                                                isBroadcastersList={true}
                                                avatarClassName={`${isActiveBroadcaster(broadcaster) ? 'border-red' : 'border-grey cursor-not-allowed'} ${props.avatarClassName ? props.avatarClassName : ''}`}
                                                avatarStyle={isActiveBroadcaster(broadcaster) ? { borderWidth: 'thick' } : {}}
                                                className={`${isActiveBroadcaster(broadcaster) ? '' : 'cursor-not-allowed'}`}
                                                size={isValidNumber(props.size) ? props.size : 80}
                                                showName={!props.showName || props.showName == false ? false : true}
                                                textClassName={`text-truncate margin-top-md ${props.textClassName ? props.textClassName : ''}`}
                                                data={broadcaster} />
                                            {
                                                isActiveBroadcaster(broadcaster) ?
                                                    <span className='d-inline-block background-red white text-align-center round-border width-50' style={{ padding: 3, fontSize: 12, position: 'absolute', top: (isValidNumber(props.size) ? props.size : 80) - (isValidNumber(props.size) ? props.size : 80) * 0.2, left: 0, right: 0, margin: 'auto' }} >
                                                        Live
                                                        </span>
                                                    :
                                                    <span className='d-inline-block background-grey white text-align-center round-border width-50' style={{ padding: 3, fontSize: 12, position: 'absolute', top: (isValidNumber(props.size) ? props.size : 80) - (isValidNumber(props.size) ? props.size : 80) * 0.2, left: 0, right: 0, margin: 'auto' }} >
                                                        Live
                                                        </span>
                                            }
                                        </span>
                                    )
                                })
                                :
                                <div className="width-100">
                                    <Empty></Empty>
                                </div>
                        }
                    </div>
                </Scrollbars>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(BroadcasterListScroll)));