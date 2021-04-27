
import { Button, Card, Col, Form, message, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../../../common-function';
import client from '../../../../feathers';
import { convertNameString } from '../../config';
import ClubAvatar from './club-avatar';
import JoinClubButton from './join-club-button';
import OtherClubsBox from './other-clubs-box';


const MyClubInvitationBox = (props) => {

    const [invites, setInvites] = useState([]);

    useEffect(() => {
        setInvites(_.isArray(props.data) && !_.isEmpty(props.data) ? props.data : []);
    }, [props.data])

    function handleStatusChange(join) {
        if (_.isPlainObject(join) && !_.isEmpty(join)) {
            let selectedInvite = _.find(_.cloneDeep(invites), function (item) {
                return _.get(item, ['invitee', '_id']) == _.get(join, ['userId']) && _.get(item, ['clubId', '_id']) == _.get(join, ['clubId']);
            })

            if (_.get(selectedInvite, ['status']) != _.get(join, ['status'])) {
                selectedInvite.status = join.status;

                let newInvites = _.map(_.cloneDeep(invites), function (item) {
                    return _.get(item, ['invitee', '_id']) == _.get(selectedInvite, ['invitee', '_id']) && _.get(item, ['clubId', '_id']) == _.get(selectedInvite, ['clubId', '_id']) ? selectedInvite : item;
                });
                setInvites(newInvites);
            }
        }
    }

    function handleReject(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['invitee', '_id']) && _.get(data, ['clubId', '_id'])) {

            let promises = [];
            promises.push(client.authenticate());
            promises.push(axios.post(`${client.io.io.uri}deleteInvites`, {
                match: {
                    type: 'club',
                    invitee: _.get(data, ['invitee', '_id']),
                    clubId: _.get(data, ['clubId', '_id']),
                }

            }))
            //Write in follow model
            Promise.all(promises).then(([auth, inviteRes]) => {

                message.success('Rejected');
                inviteRes = {
                    clubId: _.get(data, ['clubId', '_id']),
                    userId: _.get(data, ['invitee', '_id']),
                    status: 'rejected',

                }
                handleStatusChange(inviteRes)
            }).catch(error => {
                console.log(error);
                message.error('Decline Failed')

            })

        }
    }


    return (
        <React.Fragment>
            <Row gutter={[10, 10]}>
                <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                    {
                        _.isArray(invites) && notEmptyLength(invites) ?
                            <React.Fragment>
                                <div className="thin-border round-border padding-md">
                                    {
                                        _.map(invites, function (invite) {
                                            return (
                                                <div className="flex-justify-space-between flex-items-align-center margin-bottom-md">
                                                    <span className='d-inline-block flex-items-no-shrink' style={{ maxWidth: '60%' }} >
                                                        <div className="flex-items-align-center">
                                                            <span className='d-inline-block margin-right-md' >
                                                                <ClubAvatar data={_.get(invite, ['clubId'])} size={70} redirectProfile></ClubAvatar>
                                                            </span>
                                                            <span className='d-inline-block' >
                                                                <div className="font-weight-bold h6 black">
                                                                    {_.get(invite, ['clubId', 'clubName']) || ''}
                                                                </div>
                                                                {
                                                                    _.isArray(_.get(invite, ['invitedBy'])) && !_.isEmpty(_.get(invite, ['invitedBy'])) ?
                                                                        <div className="headline grey-darken-2">
                                                                            Invited by {convertNameString(_.get(invite, ['invitedBy']))}
                                                                        </div>
                                                                        :
                                                                        null
                                                                }
                                                                <div className="headline grey-darken-2">
                                                                    Requested {moment(_.get(invite, ['createdAt'])).fromNow()}
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </span>
                                                    <span className='d-inline-block flex-items-no-shrink' style={{ maxWidth: '40%' }} >
                                                        <div className="flex-items-align-center">
                                                            <span className='d-inline-block margin-right-md' >
                                                                {
                                                                    _.get(invite, ['status']) != 'rejected' ?
                                                                        <JoinClubButton notify clubId={_.get(invite, ['clubId', '_id'])} userId={_.get(props.user, ['info', 'user', '_id'])}
                                                                            joinButton={(joinAction) => {
                                                                                return <Button className="padding-x-md background-ccar-button-yellow black ">{joinAction == 'approved' ? 'Accept' : 'Join'}</Button>
                                                                            }}
                                                                            onSuccess={(joinRes) => {
                                                                                if (_.isPlainObject(joinRes) && !_.isEmpty(joinRes)) {
                                                                                    handleStatusChange(joinRes.data);
                                                                                }
                                                                            }}
                                                                        ></JoinClubButton>
                                                                        :
                                                                        null
                                                                }
                                                            </span>
                                                            {
                                                                _.get(invite, ['status']) == 'rejected' ?
                                                                    <span className="padding-x-md red cursor-not-allowed">Rejected</span>
                                                                    :
                                                                    !_.get(invite, ['status']) ?
                                                                        <Button className="padding-x-md border-red-lighten-1 background-white black" onClick={(e) => { handleReject(invite) }}>Decline</Button>
                                                                        :
                                                                        null
                                                            }
                                                        </div>
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </React.Fragment>
                            :
                            null
                    }
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Card
                        title="Other CarFreaks Clubs"
                    >
                        <OtherClubsBox userId={props.userId} />
                    </Card>
                </Col>

            </Row>
        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes,
    carFreak: state.carFreak,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(MyClubInvitationBox)));