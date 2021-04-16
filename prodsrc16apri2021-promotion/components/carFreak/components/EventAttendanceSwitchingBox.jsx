import { Empty, Form, message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../feathers';
import { withRouter } from 'next/router';
import { loading } from '../../../redux/actions/app-actions';
import UserAvatar from '../../general/UserAvatar';
import ScrollLoadWrapper from '../../general/ScrollLoadWrapper';
import {  arrayLengthCount, formatNumber, getUserName, isValidNumber, notEmptyLength, toSnakeCase  } from '../../../common-function';


const PAGE_SIZE = 20;
const defaultActions = ['going', 'maybe', 'notInterest'];
let timeoutFunc;

const EventAttendanceSwitchingBox = (props) => {

    const [event, setEvent] = useState({})
    const [eventJoins, setEventJoins] = useState([])
    const [eventJoinTotal, setEventJoinTotal] = useState(0)
    const [eventJoinPage, setEventJoinPage] = useState(1)
    const [tabKey, setTabKey] = useState(0)
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        getEventJoins((eventJoinPage - 1) * PAGE_SIZE);
    }, [eventJoinPage])

    useEffect(() => {

        setEventJoins([]);
        if (_.isPlainObject(event) && !_.isEmpty(event) && _.get(event, ['_id'])) {
            if (eventJoinPage == 1) {
                getEventJoins(0);
            } else {
                setEventJoinPage(1)
            }
        } else {
            setEventJoins([]);
        }
    }, [tabKey, event])


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

    function getEventJoins(skip) {

        if (_.get(event, ['_id']) && defaultActions[tabKey]) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }
            setIsLoading(true);
            clearTimeout(timeoutFunc);
            timeoutFunc = setTimeout(() => {
                client.service('eventjoins').find({
                    query: {
                        eventId: _.get(event, ['_id']),
                        status: defaultActions[tabKey],
                        $sort: {
                            createdAt: -1,
                        },
                        $populate: ['userId'],
                        $limit: PAGE_SIZE,
                        $skip: skip,
                    }
                }).then(res => {
                    setIsLoading(false);
 
                    setEventJoins(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? eventJoinPage <= 1 ? res.data : eventJoins.concat(res.data) : [])
                    setEventJoinTotal(_.get(res, ['total']) || 0);
                }).catch(err => {
                    setIsLoading(false);
                    message.error(err.message)
                });
            }, 300);
        } else {
            setEventJoins([]);
        }
    }

    return (
        <React.Fragment>
            <span className={`d-inline-block width-100 padding-md thin-border round-border ${props.className || ''}`} style={{ ...props.style }}>
                <div className="flex-justify-start flex-items-align-center grey-darken-2">
                    Guest List
                </div>
                <div className="flex-justify-space-around flex-items-align-start flex-wrap padding-y-md ">
                    {
                        _.map(defaultActions, function (action, index) {

                            let selectedStatus = _.find(_.get(event, ['participateStatus']), function (item) {
                                return item.status == action;
                            });
                            return (
                                <span className={`d-inline-block flex-items-no-shrink cursor-pointer padding-bottom-xs ${tabKey == index ? 'border-bottom-yellow' : 'border-bottom-grey-lighten-2'}`}
                                    onClick={() => {
                                        setTabKey(index);
                                    }} >
                                    <div className={`${tabKey == index ? 'yellow' : 'grey-darken-2'} flex-justify-center flex-items-align-center caption`}>
                                        {
                                            formatNumber(
                                                _.get(selectedStatus, ['total'])
                                                , 'auto'
                                                , true
                                                , 0
                                                , true
                                            ) || 0
                                        }
                                    </div>
                                    <div className={`${tabKey == index ? 'yellow' : 'grey-darken-2'} flex-justify-center flex-items-align-center small-text uppercase`}>
                                        {toSnakeCase(action, ' ')}
                                    </div>
                                </span>
                            )
                        })
                    }
                </div>
                <ScrollLoadWrapper autoHeight autoHide autoHeightMax={300} scrollRangeUsePercentage scrollRange={50} onScrolledBottom={() => {
                    if (arrayLengthCount(eventJoins) < eventJoinTotal) {
                        setEventJoinPage(eventJoinPage + 1);
                    }
                }}>
                    <div className="padding-md">
                        {
                            _.isArray(eventJoins) && !_.isEmpty(eventJoins) ?
                                _.map(eventJoins, function (eventJoin) {
                                    return (
                                        <div className="flex-justify-start flex-items-align-center">
                                            <span className='d-inline-block margin-right-md' >
                                                <UserAvatar data={_.get(eventJoin, ['userId'])} />
                                            </span>
                                            <span className='d-inline-block ' >
                                                <div className="headline grey-darken-2">
                                                    {getUserName(_.get(eventJoin, ['userId'])) || ''}
                                                </div>
                                                <div className="headline grey-darken-2">
                                                    {_.get(eventJoin, ['status']) || ''}
                                                </div>
                                            </span>
                                        </div>
                                    )
                                })
                                :
                                <Empty description={isLoading ? 'Getting Data...' : 'No Result'}></Empty>
                        }
                    </div>
                </ScrollLoadWrapper>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EventAttendanceSwitchingBox)));