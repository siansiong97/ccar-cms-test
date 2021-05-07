import { Button, Form, Icon, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import { loading, loginMode } from '../../../../redux/actions/app-actions';
import { setUser } from '../../../../redux/actions/user-actions';



const JoinClubButton = (props) => {


    const [join, setJoin] = useState({});
    const [club, setClub] = useState({});
    const [joinStatus, setJoinStatus] = useState();
    const [joinAction, setJoinAction] = useState();
    const [ranCheckJoinStatus, setRanCheckJoinStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setClub(_.isPlainObject(props.club) && !_.isEmpty(props.club) ? props.club : {});
    }, [props.club])


    useEffect(() => {

        if (props.userId && _.get(club, `_id`) && ranCheckJoinStatus) {
            if (!joinStatus) {
                checkJoinAction(props.userId, club);
            }
        }

    }, [props.userId, club, ranCheckJoinStatus])


    useEffect(() => {

        if (props.userId && _.get(club, `_id`)) {
            checkJoinStatus(props.userId, _.get(club, `_id`));
        }

    }, [props.userId, club._id])


    function handleSuccess(success) {
        if (props.onSuccess) {
            props.onSuccess(success);
        }
    }

    function checkJoinStatus(userId, clubId) {

        if (userId && clubId) {
            client.authenticate().then(res => {
                client.service('clubjoin').find({
                    query: {
                        clubId: clubId,
                        userId: userId,
                    }
                }).then(res => {
                    setJoin(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? _.get(res, ['data', 0]) || {} : {})
                    setJoinStatus(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? _.get(res, ['data', 0, 'status']) || '' : '');
                    setRanCheckJoinStatus(true);
                })
            }).catch(err => {
                message.error(err.message)
            });
        }
    }

    function checkJoinAction(requester, club) {

        if (requester && _.get(club, `_id`)) {
            if (_.get(club, `nonMemberAccessibilitySettings.autoApproval`) === true) {
                setJoinAction('approved');
            } else {
                axios.get(`${client.io.io.uri}checkIsInvitedByClubAdmin`, {
                    params: {
                        clubId:  _.get(club, `_id`),
                        invitee: requester
                    }
                }).then(res => {
                    setJoinAction(_.get(res, ['data', 'isAdminInvited']) ? 'approved' : !joinStatus ? 'pending' : '');
                }).catch(err => {
                    message.error(err.message)
                });
            }
        }
    }

    function handleError(error) {
        if (props.handleError) {
            props.handleError(error);
        }
    }

    function handleSubmit() {
        ;
        if (props.userId && _.get(club, `_id`)) {
            let promises = [];
            setIsLoading(true);
            promises.push(client.authenticate());
            if (!joinStatus && joinAction) {
                let data = {}
                data.clubId = _.get(club, `_id`);
                data.userId = props.userId;
                data.status = joinAction;
                if (joinAction == 'approved') {
                    data.joinedAt = new Date();
                }
                data.actionType = `joinClub`
                promises.push(client.service('clubjoin').create(data))
                //Write in follow model
                Promise.all(promises).then(([auth, joinRes]) => {
                    setIsLoading(false);
                    handleSuccess({
                        type: joinRes.status,
                        data: joinRes
                    });
                    if (props.notify) {
                        message.success(joinRes.status == 'approved' ? 'Joined Group' : joinRes.status == 'pending' ? 'Requested To Join' : '');
                    }

                    setJoin(joinRes)
                    setJoinStatus(joinRes.status);

                }).catch(error => {
                    setIsLoading(false);
                    console.log(error);
                    handleError({ message: "Join Failed" })
                    if (props.notify) {
                        message.error('Join Failed')
                    }

                })
            }


        } else {
            if (props.notify) {
                message.error('Something Went Wrong!')
            }
            handleError({ message: "Something Went Wrong!" })

        }


    };

    function handleChange() {


        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id']) || !props.userId) {
            handleError({ message: 'Please login to follow.' });
            message.error('Please login to follow.')
            props.loginMode(true);
            return null;
        }

        if (!_.get(club, `_id`)) {
            handleError({ message: 'Club not found!' });
            message.error('Club not found!')
            return null;
        }

        if (!joinStatus) {
            handleSubmit();
        }

    }



    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            {
                joinStatus == 'approved' ?
                    props.joinedButton ?
                        props.joinedButton()
                        :
                        <span className="cursor-pointer">
                            <Icon type="check" style={{ color: '#F57F17' }} className="margin-right-xs" />
                                    Joined
                                </span>
                    :
                    joinStatus == 'pending' ?
                        props.pendingButton ?
                            props.pendingButton()
                            :
                            <span className=" ccar-button-yellow cursor-not-allowed">
                                Pending Approval
                            </span>
                        :
                        <a onClick={() => { if (!isLoading) { handleChange() } }}>
                            {
                                props.joinButton ?
                                    props.joinButton(joinAction)
                                    :
                                    <Button> {joinAction == 'approved' && !_.get(club , `nonMemberAccessibilitySettings.autoApproval`)?  'Accept' : `Join Club`}</Button>
                            }
                        </a>
            }

        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loginMode: loginMode,
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(JoinClubButton)));