import { Col, Form, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { formatNumber, sortByDesc } from '../../common-function';
import CompanySummary from './CompanySummary';
import RatingProgress from './RatingProgress';


RatingProgress
const RatingBox = (props) => {

    const [profile, setProfile] = useState({})

    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }

    }, [props.data])


    const _renderRatingDetails = () => {
        try {
            return (
                <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <CompanySummary
                            rating={_.get(profile, ['avgRating'] || 0)}
                            recommended={formatNumber(_.get(profile, ['recommendedRate']), null, true, 2, true) || 0}
                            // chat={77}
                            renderRating={(rating) => {
                                return (
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="h5 font-weight-bold text-align-center">
                                            {rating}
                                            <div className="headline   font-weight-normal">Rating</div>
                                        </div>
                                    </Col>
                                )
                            }}
                            renderRecommended={
                                (recommended) => {
                                    return (
                                        _.get(profile, ['totalRecommended']) > 0 ?
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="h5 font-weight-bold text-align-center">
                                                    {(parseFloat(recommended) || 0) * 100}%
                                                    <div className="headline   font-weight-normal">Recommended</div>
                                                </div>
                                            </Col>
                                            :
                                            null
                                    )
                                }
                            }
                        // renderChat={
                        //     (chat) => {
                        //         return (
                        //             <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        //                 <div className="h5 font-weight-bold text-align-center">
                        //                     {chat}
                        //                     <div className="headline   font-weight-normal">Chat Response</div>
                        //                 </div>
                        //             </Col>
                        //         )
                        //     }
                        // }
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <RatingProgress
                            size={5}
                            startFrom={1}
                            data={sortByDesc(_.get(profile, ['ratingCategory']), 'label') || []}
                            total={_.get(profile, ['totalRating']) || 0}
                            className="fill-parent" />
                    </Col>
                    <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                        <div className="headline   text-align-center text-overflow-break">
                            Based on {_.get(profile, ['totalRating']) || 0} customer reviews
                            </div>
                    </Col>
                </Row>
            )
        }
        catch (e) {
            return null;
        }
    }

    return (
        <div>
            <div style={{ height: '30px' }} className="background-ccar-yellow round-border-top flex-items-align-center padding-lg">
                <div className="headline   white font-weight-bold text-overflow-break">
                    Seller Rating
                </div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF' }} className="round-border-bottom flex-items-align-center padding-md">
                {_renderRatingDetails()}
            </div>
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(RatingBox)));