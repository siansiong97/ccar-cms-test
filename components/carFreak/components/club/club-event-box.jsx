import { Button, Col, Divider, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import WriteEventModal from '../write-event-modal';
import EventDetailsBox from './event-details-box';
import { loading } from '../../../../redux/actions/app-actions';
import WindowScrollLoadWrapper from '../../../general/WindowScrollLoadWrapper';
import { arrayLengthCount, isValidNumber } from '../../../../common-function';
import { validateViewType, clubProfileViewTypes } from '../../config';
import ClubBackdrop from './club-backdrop';


const PAGE_SIZE = 10;
const BOX_HEIGHT = 300;

const ClubEventBox = (props) => {

    const [club, setClub] = useState({});
    const [writeEventVisible, setWriteEventVisible] = useState(false);
    const [eventEditMode, setEventEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [events, setEvents] = useState([]);
    const [eventTotal, setEventTotal] = useState(0);
    const [eventPage, setEventPage] = useState(1);

    const [viewType, setViewType] = useState('non-member');

    useEffect(() => {
        setViewType(validateViewType(props.viewType))
    }, [props.viewType])


    useEffect(() => {
        setClub(_.isPlainObject(props.data) && !_.isEmpty(props.data) ? props.data : {});
    }, [props.data])


    useEffect(() => {
        if (_.isPlainObject(club) && !_.isEmpty(club)) {
            if (eventPage == 1) {
                getEvents(0);
            } else {
                setEventPage(1);
            }
        } else {
            setEventPage(1);
            setEvents([]);
        }
    }, [club])

    useEffect(() => {
        getEvents((eventPage - 1) * PAGE_SIZE);
    }, [eventPage])


    function getEvents(skip, filter) {
        if (_.get(club, ['_id'])) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }

            let query = {};

            if (_.isPlainObject(filter) && !_.isEmpty(filter)) {
                query = { ...query, ...filter };
            }

            setIsLoading(true);
            client.service('events').find({
                query: {
                    type: 'club',
                    clubId: club._id,
                    $limit: PAGE_SIZE,
                    $skip: skip,
                    $sort: {
                        status: -1,
                        createdAt: -1,
                    },
                    $populate: ['clubId', 'createdBy'],
                    ...query,
                }
            }).then(res => {
                setEvents(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? eventPage <= 1 ? res.data : events.concat(res.data) : [])
                setEventTotal(_.get(res, ['total']));
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
                console.log(err);
            });

        }
    }

    function confirmDelete(v) {
        if (v._id) {
            client.service('events')
                .remove(v._id).then((res) => {
                    message.success('Event Deleted')

                    let newEvents = _.filter(_.cloneDeep(events), function (item) {
                        return item._id != _.get(res, ['_id']);
                    });

                    setEvents(newEvents);
                }).catch((err) => {
                    console.log('Unable to delete Event.');
                })
        }

    }

    return (
        <React.Fragment>

            <ClubBackdrop viewType={viewType}>
                <div className={`thin-border round-border padding-md ${props.className || ''}`} style={{ ...props.style }}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="flex-justify-space-between flex-items-align-center">
                                <span className='d-inline-block h7' >
                                    Upcoming Event
                          </span>
                                {
                                    viewType == clubProfileViewTypes[0] ?
                                        <span className='d-inline-block' >
                                            <Button className="border ccar-button-yellow black" onClick={(e) => { setWriteEventVisible(true) }}>Create Event</Button>
                                        </span>
                                        :
                                        null
                                }
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Divider type="horizontal" ></Divider>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <WindowScrollLoadWrapper scrollRange={document.body.scrollHeight * 0.5} onScrolledBottom={() => {
                                if (arrayLengthCount(events) < eventTotal) {
                                    setEventPage(eventPage + 1);
                                }
                            }}>
                                {
                                    _.isArray(events) && !_.isEmpty(events) ?
                                        _.map(events, function (event, index) {
                                            return (
                                                <React.Fragment>
                                                    <div className="width-100">
                                                        <EventDetailsBox data={event}
                                                            hideDescription
                                                            manualControl
                                                            onEditClick={(data) => {
                                                                if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                    setSelectedEvent(data);
                                                                    setEventEditMode(true);
                                                                    setWriteEventVisible(true);
                                                                }
                                                            }}

                                                            onRemoveClick={(data) => {
                                                                confirmDelete(data)
                                                            }}
                                                        />
                                                    </div>
                                                    {
                                                        index + 1 != arrayLengthCount(events) ?
                                                            <Divider type="horizontal" />
                                                            :
                                                            null
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                        :
                                        null
                                }
                            </WindowScrollLoadWrapper>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                            <div className="flex-justify-center flex-items-align-center" style={{ height: 30 }}>
                                {
                                    isLoading ?
                                        <Icon type="loading" style={{ fontSize: 30 }} />
                                        :
                                        null
                                }
                            </div>

                        </Col>
                    </Row>
                </div>
            </ClubBackdrop>

            <WriteEventModal
                visible={writeEventVisible}
                editMode={eventEditMode}
                data={selectedEvent}
                onCancel={() => {
                    setSelectedEvent({});
                    setEventEditMode(false);
                    setWriteEventVisible(false);
                }}
                type="club"
                clubId={_.get(club, ['_id'])}
                creator={club}
                notify
                onCreate={(event) => {
                    if (_.isPlainObject(event) && !_.isEmpty(event)) {
                        setEvents([event].concat(events));
                    }
                }}
                onUpdate={(event) => {
                    if (_.isPlainObject(event) && !_.isEmpty(event)) {
                        let newEvents = _.map(events, function (item) {
                            return item._id == _.get(event, ['_id']) ? event : item;
                        });
                        setEvents(newEvents);
                    }
                }}
            ></WriteEventModal>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubEventBox)));