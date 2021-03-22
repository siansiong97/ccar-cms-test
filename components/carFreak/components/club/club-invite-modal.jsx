import { Col, Empty, Form, Icon, Input, message, Modal, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import { loading } from '../../../../redux/actions/app-actions';
import { setUser } from '../../../../redux/actions/user-actions';
import InviteButton from '../../../general/InviteButton';
import ScrollLoadWrapper from '../../../general/ScrollLoadWrapper';
import { isDealer } from '../../../profile/config';
import { arrayLengthCount, getUserName, isValidNumber } from '../../../../common-function';
import UserAvatar from '../../../general/UserAvatar';


const PAGE_SIZE = 12;
const TYPING_TIMEOUT = 500;

const ClubInviteModal = (props) => {

    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [userTotal, setUserTotal] = useState(0);
    const [userPage, setUserPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const [typingTimeout, setTypingTimeout] = useState();
    const [filterGroup, setFilterGroup] = useState({
        keyword: '',
    });
    const [scrollBarRef, setScrollBarRef] = useState({});

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible])

    useEffect(() => {

        getUserList(props.clubId, props.userId, (userPage - 1) * PAGE_SIZE);

    }, [userPage])

    useEffect(() => {

        if(scrollBarRef){
            console.log(scrollBarRef);
            if(scrollBarRef.scrollToTop){
                scrollBarRef.scrollToTop();
            }
        }

        setUsers([]);
        if (userPage == 1) {
            getUserList(props.clubId, props.userId, 0);
        } else {
            setUserPage(1);
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

        if (visible && props.userId && props.clubId) {
            getUserList(props.clubId, props.userId, 0);
        }

    }, [visible, props.userId, props.clubId])


    function getUserList(clubId, userId, skip) {

        if (userId && clubId) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }

            setIsLoading(true);

            let filter = filterGroup;
            if (!filter.keyword) {
                delete filter.keyword;
            }

            axios.get(`${client.io.io.uri}getInvitationUsers`, {
                params: {
                    userId: userId,
                    clubId: clubId,
                    limit: PAGE_SIZE,
                    skip: skip,
                    match: filter,
                }
            }).then(res => {

                console.log('res');
                console.log(res);
                setUsers(_.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ? userPage <= 1 ? res.data.data : users.concat(res.data.data) : users)
                setUserTotal(_.get(res, ['data', 'total']));
                setIsLoading(false)

            }).catch(err => {
                message.error(err.message)
            });


        }
    }

    function closeModal() {
        setUsers([]);
        if (props.onCancel) {
            props.onCancel()
        }
    }

    return (
        <Modal
            visible={visible}
            footer={null}
            centered
            maskClosable={false}
            width={500}
            onCancel={() => { closeModal() }}
        >
            <Row className="padding-top-lg margin-top-md" gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="flex-justify-space-between flex-items-align-center width-100">
                        <span className='d-inline-block font-weight-black h6' >
                            Invite
                        </span>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="width-100 thin-border round-border-big no-border-input padding-sm">
                        <Input size="small" value={searchWord} onChange={(e) => { setSearchWord(e.target.value) }} placeholder="Search..." suffix={<Icon type="search"></Icon>} ></Input>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="width-100 padding-top-sm">
                        <ScrollLoadWrapper style={{ height: '50vh' }} getRef={(scrollBarRef) => {
                            setScrollBarRef(scrollBarRef);
                        }} onScrolledBottom={() => {
                            if (arrayLengthCount(users) < userTotal) {
                                setUserPage(userPage + 1);
                            }
                        }}>
                            {
                                _.isArray(users) && !_.isEmpty(users) ?
                                    <div className="width-100">
                                        {
                                            _.map(users, function (user) {
                                                return (
                                                    <div className="flex-justify-space-between flex-items-align-center margin-bottom-sm width-100" >
                                                        <span className="flex-items-align-center width-80"  >
                                                            <UserAvatar
                                                                data={user}
                                                                size={50}
                                                                redirectProfile
                                                                onRedirect={() => { closeModal() }}
                                                                avatarClassName='flex-items-no-shrink'
                                                                className="margin-right-md"
                                                            />

                                                            <span className='d-inline-block text-truncate' >
                                                                <div>
                                                                    {getUserName(user, ['freakId'])}
                                                                </div>
                                                                <div>
                                                                    {`${getUserName(user, ['fullName'])} ${isDealer(user) && _.get(user, ['companys', 'name']) ? '|' : ''} ${isDealer(user) && _.get(user, ['companys', 'name']) ? _.get(user, ['companys', 'name']) : ''}`}
                                                                </div>
                                                            </span>
                                                        </span>
                                                        <span className='d-inline-block' >
                                                            <div className="flex-justify-end flex-items-align-center">
                                                                <InviteButton notify type="club" clubId={props.clubId} invitedBy={_.get(props.user, ['info', 'user', '_id'])} invitee={_.get(user, ['_id'])} />
                                                            </div>
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubInviteModal)));