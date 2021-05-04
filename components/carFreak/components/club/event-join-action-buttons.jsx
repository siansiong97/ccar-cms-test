import { Button, Form, message } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import { loading } from '../../../../redux/actions/app-actions';
import { notEmptyLength, objectRemoveEmptyValue, toSnakeCase } from '../../../../common-function';


const eventActions = [
    {
        value: 'going',
        render: <Button>Going</Button>
    },
    {
        value: 'maybe',
        render: <Button>Maybe</Button>
    },
    {
        value: 'notInterest',
        render: <Button>Not Interest</Button>
    },
]

const EventJoinActionButtons = (props) => {

    const [dataSources, setDataSources] = useState([]);
    const [eventJoin, setEventJoin] = useState({});

    const eventActions = [
        {
            value: 'going',
            render: <Button >Going</Button>,
            activeRender: <Button type="primary" className="background-ccar-button-yellow border-ccar-button-yellow">Going</Button>
        },
        {
            value: 'maybe',
            render: <Button>Maybe</Button>,
            activeRender: <Button type="primary" className="background-ccar-button-yellow border-ccar-button-yellow">Maybe</Button>
        },
        {
            value: 'notInterest',
            render: <Button>Can't Go</Button>,
            activeRender: <Button type="primary" className="background-ccar-button-yellow border-ccar-button-yellow">Can't Go</Button>
        },
    ]

    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setEventJoin(props.data);
        } else {
            if (props.eventId && props.userId) {
                getEventJoin(props.eventId, props.userId);
            } else {
                setEventJoin({});
            }
        }

    }, [props.data, props.eventId, props.userId])


    useEffect(() => {
        if (_.isArray(props.data) && !_.isEmpty(props.data)) {
            let structedData = _.compact(_.map(props.data, function (item) {
                if (_.isString(item)) {
                    let text = toSnakeCase(item, ' ');
                    return {
                        value: item,
                        render: <Button>{text}</Button>
                    }
                } else {
                    if (_.isPlainObject(objectRemoveEmptyValue(item)) && !_.isEmpty(objectRemoveEmptyValue(item))) {
                        if (!item.value) {
                            return null;
                        }

                        if (!item.render) {
                            let text = toSnakeCase(item.value, ' ');
                            return {
                                value: item.value,
                                render: <Button>{text}</Button>
                            }
                        }
                    } else {
                        return null;
                    }
                }
            }))

            setDataSources(structedData);
        } else {
            setDataSources(eventActions);
        }
    }, [props.data])

    function getEventJoin(eventId, userId) {

        if (eventId && userId) {
            client.service('eventjoins').find({
                query: {
                    eventId: eventId,
                    userId: userId,
                    $limit: 1,
                    $skip: 0,
                }
            }).then(res => {
                setEventJoin(_.isArray(res.data) && notEmptyLength(res.data) ? res.data[0] : {});
            }).catch(err => {
                message.error(err.message)
            });
        } else {
            setEventJoin({});
        }
    }

    function patchEventJoin(eventId, userId, status) {

        if (eventId && userId && status) {
            if (_.isPlainObject(eventJoin) && !_.isEmpty(eventJoin)) {
                if (_.get(eventJoin, ['status']) != status) {
                    client.authenticate().then(res => {
                        client.service('eventjoins').patch(eventJoin._id, { eventId, userId, status }).then(res => {
                            setEventJoin(res);
                            if (props.notify) {
                                message.success('Thank you for your response.');
                            }
                            if (props.onUpdate) {
                                props.onUpdate(res);
                            }
                        }).catch(err => {
                            message.error(err.message)
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            } else {
                client.authenticate().then(res => {
                    client.service('eventjoins').create({
                        eventId,
                        userId,
                        status,
                    }).then(res => {
                        setEventJoin(res);
                        if (props.notify) {
                            message.success('Thank you for your response.');
                        }
                        if (props.onCreate) {
                            props.onCreate(res);
                        }
                    }).catch(err => {
                        message.error(err.message)
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }

    return (
        <React.Fragment>
            <span className={`d-inline-block padding-x-md flex-justify-start flex-items-align-center ${props.className || ''}`}>
                {
                    _.map(dataSources, function (dataSource) {
                        return (
                            <span className='d-inline-block cursor-pointer margin-right-md' onClick={(e) => {
                                if (props.readOnly !== true) {
                                    patchEventJoin(props.eventId, props.userId, dataSource.value)
                                } else {
                                    if(props.onClick){
                                        props.onClick(dataSource.value)
                                    }
                                }
                            }} >
                                {
                                    _.get(eventJoin, ['status']) == _.get(dataSource, ['value']) ?
                                        dataSource.activeRender
                                        :
                                        dataSource.render
                                }
                            </span>
                        )
                    })
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EventJoinActionButtons)));