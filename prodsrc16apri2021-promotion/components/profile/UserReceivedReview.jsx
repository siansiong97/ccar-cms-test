import { Col, Empty, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { updateSellerProfile } from '../../redux/actions/sellerProfile-actions';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import WindowScrollLoadWrapper from '../general/WindowScrollLoadWrapper';
import { arrayLengthCount, notEmptyLength } from '../../common-function';
import ReviewList from '../rating/ReviewList';
import WriteReviewButton from '../rating/WriteReviewButton';
import InfiniteScrollWrapper from '../general/InfiniteScrollWrapper';



var moment = require('moment');
const RATINGPAGESIZE = 4;

const reviewContainerRef = React.createRef();

const UserReceivedReview = (props) => {


    const [reviewLoading, setReviewLoading] = useState(false)
    const [ratings, setRatings] = useState([])
    const [ratingPage, setRatingPage] = useState(1)
    const [ratingTotal, setRatingTotal] = useState(0)
    const [ownRating, setOwnRating] = useState([])
    const [profile, setProfile] = useState({})

    useEffect(() => {
    }, [])

    useEffect(() => {
        getRatings((ratingPage - 1) * RATINGPAGESIZE);
    }, [ratingPage])


    useEffect(() => {
        setRatingPage(1);
        setRatingTotal(0);
        getRatings(0);
        getOwnRating();
    }, [profile, props.user])


    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }
    }, [props.data])

    function init() {

        if (profile._id) {
            client.service('users').find({
                query: {
                    _id: profile._id,
                    $populate: [
                        {
                            path: 'companyId',
                            ref: 'companys'
                        }
                    ],
                }
            }).then(res => {
                if (notEmptyLength(res.data)) {
                    props.updateSellerProfile(res.data[0])
                }
            }).catch(err => {
                message.error(err.message);
            })
        }
    }

    function getOwnRating() {
        if (_.get(profile, ['_id']) && _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id'])) {

            setReviewLoading(true);
            client.service('rating').find({
                query: {
                    // companyId: props.sellerProfile.company._id,
                    userId: _.get(profile, ['_id']),
                    reviewerId: _.get(props.user, ['info', 'user', '_id']),
                    $populate: [
                        {
                            path: 'companyId',
                            ref: 'companys'
                        },
                        {
                            path: 'userId',
                            ref: 'users'
                        },
                        {
                            path: 'reviewerId',
                            ref: 'users'
                        }
                    ],
                    $limit: 1,
                }

            }).then((res) => {
                setTimeout(() => {
                    setReviewLoading(false)
                }, 1000);
                if (notEmptyLength(res.data)) {
                    setOwnRating(res.data);
                } else {
                    setOwnRating([]);
                }
            })
                .catch((err) => {
                    setTimeout(() => {
                        setReviewLoading(false)
                    }, 1000);
                    message.error(err.message);
                })
        } else {
            setOwnRating([]);
        }
    }

    function getRatings(skip) {
        if (_.get(profile, ['_id'])) {

            let query = {
                // companyId: profile.companyId._id,
                userId: _.get(profile, ['_id']),
                $populate: [
                    {
                        path: 'companyId',
                        ref: 'companys'
                    },
                    {
                        path: 'reviewerId',
                        ref: 'users'
                    }
                ],
                $sort: {
                    createdAt: -1
                },
                $limit: RATINGPAGESIZE,
                $skip: skip,
            }

            //exclude auth user own rating and hide rating
            if (_.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id'])) {
                query.reviewerId = {
                    $ne: _.get(props.user, ['info', 'user', '_id']),
                }

                query["hideBy.userId"] = {
                    $ne: _.get(props.user, ['info', 'user', '_id']),
                }
            }
            setReviewLoading(true);
            client.service('rating').find({
                query: query
            }).then((res) => {
                setTimeout(() => {
                    setReviewLoading(false)
                }, 1000);
                if (notEmptyLength(res.data)) {
                    let data;
                    if (skip == 0) {
                        data = res.data;
                    } else {
                        data = ratings.concat(res.data);
                    }
                    setRatingTotal(res.total);
                    setRatings(data);
                }
            })
                .catch((err) => {
                    setTimeout(() => {
                        setReviewLoading(false)
                    }, 1000);
                    message.error(err.message);
                })
        } else {
            setRatingTotal(0);
            setRatings([]);
        }
    }


    const _renderReviews = (data) => {
        if (_.isPlainObject(data) && !_.isEmpty(profile)) {
            return (
                <Row type="flex" justify="center" align="middle" gutter={[10, 10]}>
                    <Col span={12}>
                        <div>
                            <span className="padding-left-xs flex-items-align-center h6 font-weight-bold">
                                USER REVIEWS
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className=" text-align-right">
                            {
                                !_.get(profile, ['_id']) || notEmptyLength(ownRating) || _.get(profile, ['_id']) == _.get(props.user, ['info', 'user', '_id']) ?
                                    null
                                    :
                                    <WriteReviewButton
                                        data={{ type: 'user', userId: profile ? profile._id : null, reviewerId: props.user.info.user ? props.user.info.user._id : null }}
                                        mode="add"
                                        handleSuccess={(v) => { init() }}
                                        handleError={(e) => { message.error(e.message) }} />
                            }
                        </div>
                    </Col>
                    <Col span={24}>
                        {
                            notEmptyLength(ratings) || notEmptyLength(ownRating) ?
                                <div>
                                    <div className="width-100">
                                        <ReviewList data={notEmptyLength(ownRating) ? ownRating : []} handleChange={(v) => { init() }} /> 
                                    </div>
                                    {
                                        notEmptyLength(ratings) ?
                                            <InfiniteScrollWrapper onScrolledBottom={() => {
                                                if (arrayLengthCount(ratings) < ratingTotal) {
                                                    setRatingPage(ratingPage + 1)
                                                }
                                            }}
                                            hasMore={!reviewLoading && arrayLengthCount(ratings) < ratingTotal}
                                            >
                                                <div>
                                                    <ReviewList data={ratings} handleChange={(v) => { init() }} />
                                                </div>
                                            </InfiniteScrollWrapper>
                                            :
                                            null
                                    }
                                </div>
                                :
                                (
                                    <div style={{ height: '15em', backgroundColor: '#FFFFFF' }}>
                                        <Empty
                                            style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                                            image="/empty.png"
                                            imageStyle={{
                                                height: 60,
                                            }
                                            }
                                            description={
                                                <span>
                                                    No Review Yet
                                                </span>
                                            }
                                        >
                                        </Empty>
                                    </div>
                                )
                        }
                    </Col>
                </Row>
            )
        } else {
            return null
        }
    }


    return (
        <Row type="flex" justify="center" gutter={[20, 10]}>
            <Col xs={{ order: 1, span: 24 }} sm={{ order: 1, span: 24 }} md={{ order: 1, span: 24 }} lg={{ order: 1, span: 24 }} xl={{ order: 1, span: 24 }}>
                <Row gutter={[20, 10]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        {_renderReviews(profile)}
                    </Col>
                </Row>
            </Col>
        </Row>
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
    updateSellerProfile: updateSellerProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserReceivedReview)));