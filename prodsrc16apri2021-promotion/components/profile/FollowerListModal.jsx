import { Button, Col, Empty, Form, Icon, Input, message, Modal, Radio, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { isDealer } from './config';
import { arrayLengthCount, getUserName, isValidNumber } from '../../common-function';
import UserAvatar from '../general/UserAvatar';
import FollowButton from './FollowButton';
import ScrollLoadWrapper from '../general/ScrollLoadWrapper';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';


const PAGE_SIZE = 12;
const TYPING_TIMEOUT = 500;

const FollowerListModal = (props) => {

    const [visible, setVisible] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followerTotal, setFollowerTotal] = useState(0);
    const [followerPage, setFollowerPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const [typingTimeout, setTypingTimeout] = useState();
    const [filterGroup, setFilterGroup] = useState({
        keyword: '',
        type: null,
    });

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible])

    useEffect(() => {

        getFollowerList(props.userId, (followerPage - 1) * PAGE_SIZE);

    }, [followerPage])


    useEffect(() => {

        if (followerPage == 1) {
            getFollowerList(props.userId, (followerPage - 1) * PAGE_SIZE);
        } else {
            setFollowerPage(1);
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

        if (visible && props.userId) {
            getFollowerList(props.userId, 0);
        }

    }, [visible, props.userId, props.type])


    function getFollowerList(userId, skip) {

        if (userId) {

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

            if (!filter.type) {
                delete filter.type;
            }




            axios.get(`${client.io.io.uri}getFollowerList`, {
                params: {
                    followingId: userId,
                    type: 'user',
                    limit: PAGE_SIZE,
                    skip: skip,
                    match: filter,
                }
            }).then(res => {

                setFollowers(_.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ? followerPage <= 1 ? res.data.data : followers.concat(res.data.data) : [])
                setFollowerTotal(_.get(res, ['data', 'total']));
                setIsLoading(false)

            }).catch(err => {
                message.error(err.message)
            });


        }
    }

    function closeModal() {
        setFollowers([]);
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
                            Follower
                        </span>
                        <span className='d-inline-block' >
                            <Radio.Group className="condition-form" style={{ textAlign: 'center' }} value={filterGroup.type || ''} onChange={(e) => { setFilterGroup({ ...filterGroup, type: _.toLower(e.target.value) }) }} >
                                <Radio.Button style={{ paddingX: 10 }} className="margin-right-md" value="user" onClick={(e) => { if (filterGroup.type == 'user') { setFilterGroup({ ...filterGroup, type: '' }) } }}> <p style={{ fontSize: "13px", textAlign: "center" }}> User </p> </Radio.Button>
                                <Radio.Button style={{ paddingX: 10 }} value="dealer" onClick={(e) => { if (filterGroup.type == 'dealer') { setFilterGroup({ ...filterGroup, type: '' }) } }}> <p style={{ fontSize: "13px", textAlign: "center" }}> Dealer</p> </Radio.Button>
                            </Radio.Group>
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
                        <ScrollLoadWrapper style={{ height: '50vh' }} autoHide onScrolledBottom={() => {
                            if (arrayLengthCount(followers) < followerTotal) {
                                setFollowerPage(followerPage + 1);
                            }
                        }}>
                            <div className="width-100">
                                {
                                    _.isArray(followers) && !_.isEmpty(followers) ?
                                        <div className="width-100">
                                            {
                                                _.map(followers, function (follower) {
                                                    let user = _.get(follower, 'followerId');
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
                                                                        {getUserName(user, 'freakId')}
                                                                    </div>
                                                                    <div>
                                                                        {`${getUserName(user, 'fullName')} ${isDealer(user) && _.get(user, ['companys', 'name']) ? '|' : ''} ${isDealer(user) && _.get(user, ['companys', 'name']) ? _.get(user, ['companys', 'name']) : ''}`}
                                                                    </div>
                                                                </span>
                                                            </span>
                                                            <span className='d-inline-block' >
                                                                <div className="flex-justify-end flex-items-align-center">
                                                                    <FollowButton userId={_.get(user, ['_id'])} type="user" followerId={_.get(props.user, ['info', 'user', '_id'])}
                                                                        notify
                                                                        followingButton={() => {
                                                                            return (
                                                                                <Button>Following</Button>
                                                                            )
                                                                        }}
                                                                        followButton={() => {
                                                                            return <Button className="background-ccar-yellow border-ccar-yellow black">+ Follow</Button>
                                                                        }}
                                                                    />                                                                            </div>
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
                            </div>
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
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(FollowerListModal)));