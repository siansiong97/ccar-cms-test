import { Avatar, Form, Tooltip, Row, Col, Divider, Button, Icon, message, Popconfirm } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { ccarLogo } from '../../../userProfile/config';
import { loading } from '../../../../actions/app-actions';
import { isValidNumber, getUserName, arrayLengthCount } from '../../../profile/common-function';
import ScrollLoadWrapper from '../../../commonComponent/scroll-load-wrapper';
import UserAvatar from '../user-avatar';
import { useEffect } from 'react';
import client from '../../../../feathers';
import moment from 'moment';
import FollowButton from '../../../commonComponent/follow-button';
import ClubBackdrop from './club-backdrop';
import { validateViewType, clubProfileViewTypes } from '../../config';

const PAGE_SIZE = 10;
const BOX_HEIGHT = 300;
const ClubMemberBox = (props) => {

    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [clubId, setClubId] = useState('');
    const [adminTotal, setAdminTotal] = useState(0);
    const [adminPage, setAdminPage] = useState(1);
    const [memberTotal, setMemberTotal] = useState(0);
    const [memberPage, setMemberPage] = useState(1);
    const [adminIsLoading, setAdminIsLoading] = useState(false);
    const [memberIsLoading, setMemberIsLoading] = useState(false);
    const [viewType, setViewType] = useState('non-member');


    useEffect(() => {
        setViewType(validateViewType(props.viewType))
    }, [props.viewType])

    useEffect(() => {
        setClubId(props.clubId || '')
    }, [props.clubId])

    useEffect(() => {
        getAdmins(0);
        getMembers(0);
    }, [clubId])

    useEffect(() => {
        getMembers((memberPage - 1) * PAGE_SIZE);
    }, [memberPage])

    function getAdmins(skip) {

        if (clubId) {
            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }

            setAdminIsLoading(true);

            client.service('clubjoin').find({
                query: {
                    clubId: clubId,
                    role: 'admin',
                    status: 'approved',
                    $populate: ['userId'],
                    $limit: PAGE_SIZE,
                    $skip: skip,
                }
            }).then(res => {
                setAdmins(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? adminPage <= 1 ? res.data : admins.concat(res.data) : [])
                setAdminTotal(_.get(res, ['total']));
                setAdminIsLoading(false)
            }).catch(err => {
                setAdminIsLoading(false)
                console.log(err);
            });

        } else {
            setAdmins([])
            setAdminTotal(0);
        }
    }

    function getMembers(skip) {

        if (clubId) {
            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }

            setMemberIsLoading(true);

            client.service('clubjoin').find({
                query: {
                    clubId: clubId,
                    role: 'member',
                    status: 'approved',
                    $populate: ['userId'],
                    $limit: PAGE_SIZE,
                    $skip: skip,
                }
            }).then(res => {
                setMembers(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? memberPage <= 1 ? res.data : members.concat(res.data) : [])
                setMemberTotal(_.get(res, ['total']));
                setMemberIsLoading(false)
            }).catch(err => {
                setMemberIsLoading(false)
                console.log(err);
            });

        } else {
            setAdmins([])
            setAdminTotal(0);
        }
    }



    function handleMemberJoinStatusChange(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data)) {
            let selectedJoin = _.find(_.cloneDeep(members), function (item) {
                return item._id == data._id;
            })

            if (_.get(selectedJoin, ['status']) != _.get(data, ['status'])) {
                selectedJoin.status = data.status;
                let newJoins = _.map(_.cloneDeep(members), function (item) {
                    return item._id == selectedJoin._id ? selectedJoin : item;
                });
                setMembers(newJoins);
            }
        }
    }

    function handleRemove(data) {
        if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['_id'])) {

            let promises = [];
            promises.push(client.authenticate());
            promises.push(client.service('clubjoin').remove(data._id))
            //Write in follow model
            Promise.all(promises).then(([auth, joinRes]) => {
                message.success('Removed');
                joinRes.status = 'removed';
                if (_.get(joinRes, ['userId']) == _.get(props.user, ['info', 'user', '_id'])) {
                    window.location.reload();
                } else {
                    handleMemberJoinStatusChange(joinRes);
                }
            }).catch(error => {
                console.log(error);
                message.error('Decline Failed')

            })

        }
    }

    const _renderJoinedUser = (join) => {
        if (_.isPlainObject(join) && !_.isEmpty(join)) {
            return (
                <div className="flex-justify-space-between flex-items-align-center margin-bottom-md">
                    <span className='flex-items-align-center' style={{ maxWidth: '70%' }} >
                        <span className='d-inline-block margin-right-md' >
                            <UserAvatar data={_.get(join, ['userId'])} redirectProfile size={70} />
                        </span>
                        <span className='d-inline-block' >
                            <div className="subtitle1 font-weight-normal text-truncate">
                                {getUserName(_.get(join, ['userId']), 'fullName')}
                            </div>
                            <div className="headline text-truncate grey-darken-2 capitalize">
                                {_.get(join, ['role']) || ''}
                            </div>
                            <div className="headline text-truncate grey-darken-2">
                                Joined about {moment(_.get(join, ['joinedAt'])).fromNow()}
                            </div>
                        </span>
                    </span>
                    <span className='d-inline-block ' >
                        <FollowButton type="user" userId={_.get(join, ['userId', '_id'])} followerId={_.get(props.user, ['info', 'user', '_id'])} className="margin-right-md"></FollowButton>
                        {
                            _.get(props.user, ['info', 'user', '_id']) != _.get(join, ['userId', '_id']) && viewType == clubProfileViewTypes[0] ?
                                _.get(join, ['status']) == 'removed' ?
                                    <span className="d-inline-block red margin-right-md" style={{ padding: '0px 15px' }} >
                                        Removed
                                    </span>
                                    :
                                    <Popconfirm
                                        title="Are you sure to remove this member?"
                                        onConfirm={(e) => {
                                            handleRemove(join);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button className="background-red border-red white margin-right-md">Remove</Button>
                                    </Popconfirm>
                                :
                                _.get(props.user, ['info', 'user', '_id']) == _.get(join, ['userId', '_id']) && viewType != clubProfileViewTypes[0] ?
                                    _.get(join, ['status']) == 'removed' ?
                                        <span className="d-inline-block red margin-right-md" style={{ padding: '0px 15px' }} >
                                            Left
                                        </span>
                                        :
                                        <Popconfirm
                                            title="Are you sure to leave this group?"
                                            onConfirm={(e) => {
                                                handleRemove(join);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button className="background-red border-red white margin-right-md">Leave</Button>
                                        </Popconfirm>
                                    :
                                    null
                        }
                    </span>
                </div>
            )
        } else {
            return null;
        }
    }


    return (
        <React.Fragment>
            <ClubBackdrop viewType={viewType}>
                <div className={`thin-border round-border padding-md ${props.className || ''}`} style={{ ...props.style }}>
                    <Row gutter={[10, 10]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="font-weight-bold subtitle1">
                                Admin
                        </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <ScrollLoadWrapper style={{ width: '100%' }} autoHide autoHeight autoHeightMax={BOX_HEIGHT}>
                                {
                                    _.map(admins, function (admin) {
                                        return _renderJoinedUser(admin)
                                    })
                                }
                            </ScrollLoadWrapper>
                        </Col>
                        <Divider />
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="font-weight-bold subtitle1">
                                Members
                        </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <ScrollLoadWrapper style={{ width: '100%' }} autoHide autoHeight autoHeightMax={BOX_HEIGHT} scrollRange={50} scrollRangeUsePercentage onScrolledBottom={() => {
                                if (arrayLengthCount(members) < memberTotal) {
                                    setMemberPage(memberPage + 1);
                                }
                            }}>
                                {
                                    _.map(members, function (member) {
                                        return _renderJoinedUser(member)
                                    })
                                }
                            </ScrollLoadWrapper>
                            <div className="flex-justify-center flex-items-align-center" style={{ height: 30 }}>
                                {
                                    memberIsLoading ?
                                        <Icon type="loading" style={{ fontSize: 30 }} />
                                        :
                                        null
                                }
                            </div>
                        </Col>

                    </Row>
                </div>
            </ClubBackdrop>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubMemberBox)));