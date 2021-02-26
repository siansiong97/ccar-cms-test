import { Avatar, Form, Tooltip, message, Button } from 'antd';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { ccarLogo } from '../../../userProfile/config';
import { loading } from '../../../../actions/app-actions';
import { isValidNumber, toSnakeCase, objectRemoveEmptyValue, notEmptyLength, formatNumber, arrayLengthCount, checkObjectId } from '../../../profile/common-function';
import client from '../../../../feathers';
import axios from 'axios';
import UserAvatar from '../user-avatar';

const defaultActions = ['going', 'maybe', 'notInterest'];

const EventAttendanceBox = (props) => {

    const [event, setEvent] = useState({})
    const [eventJoins, setEventJoins] = useState([])

    useEffect(() => {

        if (_.isString(props.data)) {
            getEvent(props.data);
        } else {
            setEvent(_.isPlainObject(props.data) && notEmptyLength(props.data) ? props.data : {});
        }

    }, [props.data])

    useEffect(() => {

        if (_.isPlainObject(event) && !_.isEmpty(event) && _.get(event, ['_id'])) {
            getEventJoins(_.get(event, ['_id']))
        } else {
            setEventJoins([]);
        }
    }, [event])


    function getEvent(id) {

        if (id) {
            client.service('events').find({
                query: {
                    _id: id,
                    $limit: 1,
                }
            }).then(res => {
                setEvent(_.isArray(res.data) && notEmptyLength(res.data) ? res.data[0] : {});
            }).catch(err => {
                setEvent({});
            });
        } else {
            setEvent({});
        }
    }

    function getEventJoins(id) {

        if (id) {
            axios.get(`${client.io.io.uri}getEventJoinList`, {
                params: {
                    match: {
                        eventId: id,
                    },
                    limit: 3,
                    skip: 0,
                }
            }).then(res => {
                console.log('eventjoins');
 
                setEventJoins(_.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ? _.get(res, ['data', 'data']) : []);
            }).catch(err => {
                message.error(err.message)
            });
        } else {
            setEventJoins([]);
        }
    }

    const _renderAvatarList = (users, limit) => {
        if (_.isArray(users) && !_.isEmpty(users)) {
            let limit = isValidNumber(parseInt(limit)) ? parseInt(limit) || 3 : 3
            return (
                <span className="flex-justify-center flex-items-align-center">
                    {
                        _.map(_.slice(users, 0, limit), function (user, index) {
                            return (
                                <span className='d-inline-block' style={{ position: 'relative', left: -7 * index, zIndex: index }} >
                                    <UserAvatar data={user} size={25} />
                                    {
                                        arrayLengthCount(users) > limit && index + 1 == limit ?
                                            <span className='fill-parent flex-items-align-center flex-justify-center small-text white avatar absolute-center background-black-opacity-30' >
                                                + {formatNumber(arrayLengthCount(users) - limit, 'auto', true, 0, true)}
                                            </span>
                                            :
                                            null
                                    }
                                </span>
                            )
                        })
                    }
                </span>
            )
        } else {
            return null;
        }
    }

    return (
        <React.Fragment>
            <span className={`d-inline-block width-100 padding-md thin-border round-border ${props.className || ''}`} style={{ ...props.style }}>
                <div className="flex-justify-start flex-items-align-center grey-darken-2">
                    Guest List
                </div>
                <div className="flex-justify-space-around flex-items-align-start flex-wrap margin-top-md">
                    {
                        _.map(defaultActions, function (action) {

                            let selectedJoin = _.find(eventJoins, function (item) {
                                return item.status == action && checkObjectId(event, _.get(item, ['event', '_id']));
                            });
                            return (
                                <span className='d-inline-block flex-items-no-shrink' >
                                    <div className="grey-darken-2 flex-justify-center flex-items-align-center caption">
                                        {
                                            formatNumber(
                                                arrayLengthCount(_.get(
                                                    selectedJoin
                                                    , ['users']
                                                ))
                                                , 'auto'
                                                , true
                                                , 0
                                                , true
                                            ) || 0
                                        }
                                    </div>
                                    <div className="grey-darken-2 flex-justify-center flex-items-align-center small-text uppercase">
                                        {toSnakeCase(action, ' ')}
                                    </div>
                                    <div className="flex-justify-center flex-items-align-center" style={{ paddingLeft: 7 }}>
                                        {
                                            _renderAvatarList(_.get(selectedJoin , ['users']), 3)
                                        }
                                    </div>
                                </span>
                            )
                        })
                    }
                </div>
            </span>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EventAttendanceBox)));