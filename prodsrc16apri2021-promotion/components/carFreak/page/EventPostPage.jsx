import { Col, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../../common-function';
import client from '../../../feathers';
import { loading } from '../../../redux/actions/app-actions';
import EventPost from '../../carFreak/components/event-post';
import { carFreakGlobalSearch } from '../../carFreak/config';
import LayoutV2 from '../../general/LayoutV2';
import EventAttendanceSwitchingBox from '../components/EventAttendanceSwitchingBox';
import { withRouter } from 'next/router';



const PAGE_SIZE = 36;

const EventPostPage = (props) => {

    const [eventPost, setEventPost] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0)
        getPost();
    }, [props.router.query.id])



    function getPost() {

        if (_.get(props, ['router', 'query', 'id'])) {
            props.loading(true);
            client.service('chats')
                .find({
                    query: {
                        _id: props.router.query.id,
                        chatType: 'event',
                        $populate: [
                            {
                                path: 'userId',
                                ref: 'users'
                            },
                            {
                                path: 'eventId',
                                ref: 'events',
                                populate: [
                                    {
                                        path: 'createdBy',
                                        ref: 'users'
                                    },
                                ]
                            },
                            {
                                path: 'clubId',
                                ref: 'clubs'
                            }
                        ],
                        $limit: 1,
                    }
                })
                .then((res) => {

               
                    props.loading(false);
                    setEventPost(notEmptyLength(res.data) ? res.data[0] : {});
                }).catch(err => {
                    props.loading(false);
                    message.error(err.message)
                });
        } else {
            setEventPost({});
        }
    }


    return (
        <LayoutV2 searchTypes={carFreakGlobalSearch} enterSearchCarFreaks scrollRange={window.innerHeight * 0.5} >
            <div className="section">
                <div className="container">
                    <Row gutter={[20, 20]}>
                        <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                            <EventPost data={eventPost} expandable={false} notify hideGuestList
                                onUpdate={(data) => {
                                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                        setEventPost(data);
                                    }
                                }}
                                onRemove={(data) => {
                                    props.history.push('/car-freaks');
                                }}
                            />
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <EventAttendanceSwitchingBox data={_.get(eventPost, ['eventId'])} />
                        </Col>
                    </Row>
                </div>
            </div>
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    loading
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EventPostPage));