import { Button, Col, Empty, Form, Icon, Input, message, Modal, Radio, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { loading } from '../../../../actions/app-actions';
import { setUser } from '../../../../actions/user-actions';
import client from '../../../../feathers';
import UserAvatar from '../user-avatar';
import ScrollLoadWrapper from '../../../commonComponent/scroll-load-wrapper';
import FollowButton from '../../../commonComponent/follow-button';
import { arrayLengthCount, isValidNumber, getUserName } from '../../../profile/common-function';
import { isDealer } from '../../../userProfile/config';
import InviteButton from '../../../commonComponent/invite-button';
import moment from 'moment';
import { convertNameString } from '../../config';
import JoinClubButton from './join-club-button';
import ClubApprovalButton from './club-approval-button';

const PAGE_SIZE = 12;
const TYPING_TIMEOUT = 500;

const ClubApprovalModal = (props) => {

    const [visible, setVisible] = useState(false);
    const [clubJoins, setClubJoins] = useState([]);
    const [clubJoinTotal, setClubJoinTotal] = useState(0);
    const [clubJoinPage, setClubJoinPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const [typingTimeout, setTypingTimeout] = useState();
    const [filterGroup, setFilterGroup] = useState({
        keyword: '',
    });

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible])

    useEffect(() => {

        getClubJoinList(props.clubId, (clubJoinPage - 1) * PAGE_SIZE);

    }, [clubJoinPage])

    useEffect(() => {

        if (clubJoinPage == 1) {
            getClubJoinList(props.clubId, (clubJoinPage - 1) * PAGE_SIZE);
        } else {
            setClubJoinPage(1);
        }

    }, [filterGroup])


    useEffect(() => {

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(
            setTimeout(() => {
                setFilterGroup(filterGroup => { return { ...filterGroup, keyword: searchWord } })
            }, TYPING_TIMEOUT)
        )

    }, [searchWord])


    useEffect(() => {

        if (visible && props.clubId) {
            getClubJoinList(props.clubId, 0);
        }

    }, [visible, props.clubId])


    function getClubJoinList(clubId, skip) {

        if (clubId) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }

            setIsLoading(true);

            axios.get(`${client.io.io.uri}getClubJoinList`, {
                params: {
                    match: {
                        clubId: clubId,
                        status: 'pending',
                    },
                    sort: {
                        createdAt: -1,
                    },
                }
            }).then(res => {
                console.log('clubJoin');
      
                setClubJoins(_.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ? clubJoinPage == 1 ? _.get(res, ['data', 'data']) : _.concat(clubJoins, [_.get(res, ['data', 'data'])]) : clubJoins);
                setClubJoinTotal(_.get(res, ['total']));
                setIsLoading(false);
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
                message.error(err.message)
            });

        }
    }

    function closeModal() {
        setClubJoins([]);
        if (props.onCancel) {
            props.onCancel()
        }
    }

    function handleJoinStatusChange(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            let selectedJoin = _.find(_.cloneDeep(clubJoins), function (item) {
                return item._id == data._id;
            })

            if (_.get(selectedJoin, ['status']) != _.get(data, ['status'])) {
                selectedJoin.status = data.status;
                let newJoins = _.map(_.cloneDeep(clubJoins), function (item) {
                    return item._id == selectedJoin._id ? selectedJoin : item;
                });
                setClubJoins(newJoins);
            }
        }
    }

    function handleReject(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['_id'])) {

            let promises = [];
            promises.push(client.authenticate());
            promises.push(client.service('clubjoin').remove(data._id))
            //Write in follow model
            Promise.all(promises).then(([auth, joinRes]) => {
                message.success('Rejected');
                joinRes.status = 'rejected';
                handleJoinStatusChange(joinRes)
            }).catch(error => {
                console.log(error);
                message.error('Decline Failed')

            })

        }
    }

    return (
        <Modal
            visible={visible}
            footer={null}
            centered
            maskClosable={false}
            width={window.innerWidth * 0.5}
            onCancel={() => { closeModal() }}
        >
            <Row className="padding-top-lg margin-top-md" gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="flex-justify-space-between flex-items-align-center width-100">
                        <span className='d-inline-block font-weight-black h6' >
                            Request to join club
                        </span>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="width-100 padding-top-sm">
                        <ScrollLoadWrapper autoHide style={{ height: '50vh' }} onScrolledBottom={() => {
                            if (arrayLengthCount(clubJoins) < clubJoinTotal) {
                                setClubJoinPage(clubJoinPage + 1);
                            }
                        }}>
                            {
                                _.isArray(clubJoins) && !_.isEmpty(clubJoins) ?
                                    <Row gutter={[10, 15]} >
                                        {
                                            _.map(clubJoins, function (clubJoin) {
                                                return (
                                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                        <div className="flex-justify-space-between flex-items-align-center">
                                                            <span className='flex-justify-start flex-items-align-center' style={{ maxWidth: '80%' }} >
                                                                <UserAvatar
                                                                    data={_.get(clubJoin, ['userId'])}
                                                                    size={70}
                                                                    className="margin-right-md"
                                                                    redirectProfile
                                                                    onRedirect={() => { closeModal() }}
                                                                    avatarClassName='flex-items-no-shrink'
                                                                />
                                                                <span className='d-inline-block' >
                                                                    <div className="font-weight-bold subtitle1 black">
                                                                        {getUserName(_.get(clubJoin, ['userId']), 'fullName') || ''}
                                                                    </div>
                                                                    {
                                                                        _.isArray(_.get(clubJoin, ['invitedBy'])) && !_.isEmpty(_.get(clubJoin, ['invitedBy'])) ?
                                                                            <div className="caption grey-darken-2">
                                                                                Invited by {convertNameString(_.get(clubJoin, ['invitedBy']))}
                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                    <div className="caption grey-darken-2">
                                                                        Requested {moment(_.get(clubJoin, ['createdAt'])).fromNow()} ago
                                                                         </div>
                                                                </span>
                                                            </span>
                                                            <span className='d-inline-block flex-items-no-shrink' style={{ maxWidth: '40%' }} >
                                                                <div className="flex-items-align-center">
                                                                    <span className='d-inline-block margin-right-md' >
                                                                        <ClubApprovalButton notify data={clubJoin} onSuccess={(data) => {
                                                                            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                                handleJoinStatusChange(data);
                                                                            }
                                                                        }} />
                                                                    </span>
                                                                    {
                                                                        _.get(clubJoin, ['status']) == 'approved' ?
                                                                            null
                                                                            :
                                                                            _.get(clubJoin, ['status']) == 'rejected' ?
                                                                                <span className="padding-x-md red cursor-not-allowed">Rejected</span>
                                                                                :
                                                                                <Button className="padding-x-md border-red-lighten-1 background-white black" onClick={(e) => { handleReject(clubJoin) }}>Decline</Button>
                                                                    }
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    :
                                    <div className="flex-justify-center flex-align-center padding-md">
                                        <Empty></Empty>
                                    </div>
                            }
                        </ScrollLoadWrapper>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="width-100 flex-justify-center" style={{ height: 20 }}>
                        {
                            isLoading ?
                                <Icon type="loading" style={{ fontSize: 20 }} />
                                :
                                null
                        }
                    </div>
                </Col>

            </Row>
        </Modal>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubApprovalModal)));