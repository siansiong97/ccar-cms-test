import '@brainhubeu/react-carousel/lib/style.css';
import { Col, Empty, message, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../feathers';
import { notEmptyLength, getUserName } from '../../profile/common-function';
import UserAvatar from './user-avatar';
import ParseTag from '../../commonComponent/parse-tag';



const TRENDING_PAGE_SIZE = 4;

const TrendingSocialBoardBox = (props) => {

    const [trendingPosts, setTrendingPosts] = useState([])

    useEffect(() => {
        getData();
    }, [])

    function redirectToSocialBoard(post) {
        if (props.redirectToSocialBoard) {
            props.redirectToSocialBoard(post)
        }
    }

    function getData() {

        client.service('chats')
            .find({
                query: {
                    chatType: 'socialboard',
                    $populate: 'userId',
                    $limit: TRENDING_PAGE_SIZE,
                    $sort : {
                        createdAt : -1,
                    }
                }
            })
            .then((res) => {
                setTrendingPosts(notEmptyLength(res.data) ? res.data : {});
            }).catch(err => {
                message.error(err.message)
            });
    }


    return (
        <React.Fragment>
            <div
                style={{
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    overflowX: 'scroll',
                    overflow: '-moz-scrollbars-vertical',
                    maxHeight: '900px',
                }}
            >
                <Row
                    style={{
                        backgroundColor: 'orange',
                        minHeight: '50px',
                        padding: '24px',
                        fontSize: '18px',
                        fontWeight: '600',
                        borderRadius: '12px 12px 0px 0px'
                    }}
                >Trending Today</Row>

                <Row
                    style={{
                        // minHeight: '480px',
                        // padding: '24px',
                        borderRadius: '0px 0px 12px 12px'
                    }}
                >
                    {
                        _.isArray(trendingPosts) && notEmptyLength(trendingPosts) ?

                            <React.Fragment>
                                {
                                    trendingPosts.map(function (v, i) {
                                        return (
                                            <Col key={'trendingChat' + i} style={{ 'cursor': 'pointer' }}
                                                onClick={(e) => { redirectToSocialBoard(v) }}
                                                span={24}
                                            >
                                                <Row style={{ padding: '12px' }}>
                                                    <ParseTag data={v.title || ''} className='text-truncate-twoline font-weight-bold width-100' style={{ color: '#000000', fontSize: '20px' }} />
                                                    </Row>
                                                <Row style={{ marginBottom: '12px' }}>
                                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                        <div className="flex-items-align-center flex-justify-start padding-x-md">
                                                            <span className="d-inline-block margin-right-md"><UserAvatar redirectProfile style={{ textAlign: 'left' }} data={v.userId} /></span>
                                                            <span className='d-inline-block' >
                                        <div className='chatMessageDatexMargin'>{`Posted by ${getUserName(_.get(v , ['userId']), 'freakId')}`}{_.isEmpty(v.location)===false ? <span> in {v.location}</span> : ''}</div>
                                                                <div className='chatMessageDatexMargin'>{moment(v.createdAt).format('MMM Do')} | {moment(v.createdAt).fromNow()}</div>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row style={{ borderBottom: '1px solid rgb(128 128 128 / .2)', marginTop: '12px' }}>
                                                </Row>
                                            </Col>
                                        )
                                    })
                                }
                            </React.Fragment>
                            :
                            <div className="width-100 flex-items-align-center flex-justify-center background-white padding-md" >
                                <Empty />
                            </div>

                    }

                </Row>
            </div>
        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TrendingSocialBoardBox);