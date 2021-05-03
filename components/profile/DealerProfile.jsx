import { Button, Col, Divider, Form, message, Row, Tabs } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import client from '../../feathers';
import { checkEnvReturnWebAdmin } from '../../functionContent';
import {
    filterCarBrandMode, filterCarModelMode, filterCarSearchKeywords, loading, quickSearchProductsList,
    setApplyMileage, setApplyPrice, setApplyYear, updateActiveMenu
} from '../../redux/actions/app-actions';
import { fetchProductsList, updateActiveIdProductList } from '../../redux/actions/productsList-actions';
import { updateSellerProfile } from '../../redux/actions/sellerProfile-actions';
import CommunityBox from './CommunityBox';
import ProfileDetailsBox from './ProfileDetailsBox';
import RatingBox from './RatingBox';
import RecommendDialog from './RecommendDialog';
import UserCarFreakPosts from './UserCarFreakPosts';
import UserCarOnSale from './UserCarOnSale';
import UserReceivedReview from './UserReceivedReview';
import UserSavedCarFreakPosts from './UserSavedCarFreakPosts';
import UserSocialBoard from './UserSocialBoard';
import UserSavedSocialBoard from './UserSavedSocialBoard';



var frontUrl = checkEnvReturnWebAdmin(client.io.io.uri)

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}

const { TabPane } = Tabs;

const adsverImg = '/buy-car-ads.png'

const DealerProfile = (props) => {

    const [profile, setProfile] = useState({});
    const [videoTabKey, setVideoTabKey] = useState('recordedLive');

    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }

    }, [props.data])

    useEffect(() => {
    }, [profile])


    const _renderDealerDetailsBox = () => {
        return (
            <Row gutter={[20, 20]}>
                <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                    <CommunityBox data={profile} />
                </Col>
                <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                    <RatingBox data={profile} />
                </Col>
                <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                    <div>
                        <img className="w-100" src={adsverImg} />
                    </div>
                </Col>
            </Row>
        )
    }

    const _renderMenu = () => {
        return (
            <Row type="flex" align="middle" className='background-white'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    <Tabs defaultActiveKey="1"
                        tabBarExtraContent={
                            _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == profile._id && (_.get(profile, ['role']) != 'normaluser' && _.get(profile, ['role']) != 'mobile-user') ?
                                <Button className=" background-ccar-button-yellow black border-ccar-button-yellow text-align-center" shape="round" href={frontUrl} >Manage My Ads</Button>
                                :
                                null
                        }
                    >
                        <TabPane tab="Cars For Sale" key="1">
                            <Row gutter={[20, 10]} className='margin-top-md'>
                                <Col xs={24} sm={24} md={24} lg={24} xl={18}>
                                    <UserCarOnSale data={profile} /> 
                                </Col>
                                <Col xs={0} sm={0} md={0} lg={0} xl={6}>
                                    {_renderDealerDetailsBox()}
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="CarFreaks" key="2">
                            <Row gutter={[20, 10]} className='margin-top-md'>
                                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                    <UserCarFreakPosts data={profile} />
                                </Col>
                                <Col xs={0} sm={0} md={0} lg={6} xl={6}>
                                    {_renderDealerDetailsBox()}
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Social Board" key="3">
                            <Row gutter={[20, 10]} className='margin-top-md'>
                                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                    <UserSocialBoard data={profile} className="margin-y-lg" />
                                </Col>
                                <Col xs={0} sm={0} md={0} lg={6} xl={6}>
                                    {_renderDealerDetailsBox()}
                                </Col>
                            </Row>
                        </TabPane>
                        {
                            _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(profile, ['_id']) ?
                                <TabPane tab="Saved CarFreaks" key="4">
                                    <Col xs={18} sm={18} md={24} lg={18} xl={18}>
                                        <UserSavedCarFreakPosts data={profile} className="margin-y-lg" />
                                    </Col>
                                    <Col xs={6} sm={6} md={0} lg={6} xl={6}>
                                        {_renderDealerDetailsBox()}
                                    </Col>
                                </TabPane>
                                :
                                null
                        }
                        {
                            _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(profile, ['_id']) ?
                                <TabPane tab="Saved Social Board" key="5">
                                    <Col xs={18} sm={18} md={24} lg={18} xl={18}>
                                        <UserSavedSocialBoard data={profile} className="margin-y-lg" />
                                    </Col>
                                    <Col xs={6} sm={6} md={0} lg={6} xl={6}>
                                        {_renderDealerDetailsBox()}
                                    </Col>
                                </TabPane>
                                :
                                null
                        }
                        {/* <TabPane tab="Video" key="4">
                            <Row gutter={[20, 10]} className='margin-top-md'>
                                <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                                    <Row gutter={[0, 20]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="flex-justify-start flex-items-align-center">
                                                <span className={`d-inline-block cursor-pointer subtitle1 font-weight-bold black  ${videoTabKey == 'recordedLive' ? 'ccar-button-yellow' : 'black' }`} onClick={(e) => {setVideoTabKey('recordedLive')}} >
                                                    Recorded Live
                                              </span>
                                                <span className={`d-inline-block subtitle1 font-weight-bold black margin-x-lg`} >
                                                    |
                                              </span>
                                                <span className={`d-inline-block cursor-pointer subtitle1 font-weight-bold ${videoTabKey == 'corporate' ? 'ccar-button-yellow' : 'black' }`}  onClick={(e) => {setVideoTabKey('corporate')}}>
                                                    Corporate
                                              </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            {
                                                videoTabKey == 'recordedLive' ?
                                                    <UserLiveVideos data={profile} />
                                                    :
                                                    <UserCorporateVideos data={profile} />

                                            }
                                        </Col>

                                    </Row>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                    {_renderDealerDetailsBox()}
                                </Col>
                            </Row>
                        </TabPane> */}
                        <TabPane tab="Reviews" key="6">
                            <Row gutter={[20, 10]} className='margin-top-md'>
                                <Col xs={{ order: 2, span: 18 }} sm={{ order: 2, span: 18 }} md={{ order: 2, span: 24 }} lg={{ order: 1, span: 18 }} xl={{ order: 1, span: 18 }}>
                                    <UserReceivedReview data={profile} /> 
                                </Col>
                                <Col xs={{ order: 1, span: 6 }} sm={{ order: 1, span: 6 }} md={{ order: 1, span: 0 }} lg={{ order: 2, span: 6 }} xl={{ order: 2, span: 6 }}>
                                    {_renderDealerDetailsBox()}
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        );
    }


    return (
        <React.Fragment>
            <div className="section-version3">
                <Desktop>
                    <div className="container-ver3">
                        <div className="margin-bottom-lg margin-top-lg margin-right-lg margin-left-lg">
                            {/* <Breadcrumb className="margin-y-md">
                                {baseNavBreadcrumbItem}
                            </Breadcrumb> */}
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <ProfileDetailsBox data={profile} showProfileActions={props.isOwn} type="dealer"
                                        onChangeCoverPhoto={(res) => { 
                                            if (props.onChangeCoverPhoto) {
                                                props.onChangeCoverPhoto(res); 
                                            }
                                        }
                                        }
                                        onChange={(res) => {
                                            if (props.onChange) {
                                                props.onChange(res);
                                            }
                                        }
                                        }
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Divider className="no-margin" />
                                    {_renderMenu()}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Desktop>

                <Mobile>
                    <div className="container-version3">
                        <div className="margin-bottom-lg margin-top-lg margin-right-lg margin-left-lg">
                            {/* <Breadcrumb className="margin-y-md">
                                {baseNavBreadcrumbItem}
                            </Breadcrumb> */}
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <ProfileDetailsBox data={profile} showProfileActions={props.isOwn} type="dealer"
                                        onChangeCoverPhoto={(res) => {
                                            if (props.onChangeCoverPhoto) {
                                                props.onChangeCoverPhoto(res);
                                            }
                                        }
                                        }
                                        onChange={(res) => {
                                            if (props.onChange) {
                                                props.onChange(res);
                                            }
                                        }
                                        }
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Divider className="no-margin" />
                                    {_renderMenu()}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Mobile>
            </div>

            <Tablet>
                <div className="margin-bottom-lg margin-top-lg" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    {/* <Breadcrumb className="margin-y-md">
                                {baseNavBreadcrumbItem}
                            </Breadcrumb> */}
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <ProfileDetailsBox data={profile} showProfileActions={props.isOwn} type="dealer" 
                                onChangeCoverPhoto={(res) => {
                                    if (props.onChangeCoverPhoto) {
                                        props.onChangeCoverPhoto(res);
                                    }
                                }
                                }
                                onChange={(res) => {
                                    if (props.onChange) {
                                        props.onChange(res);
                                    }
                                }
                                }
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Divider className="no-margin" />
                            {_renderMenu()}
                        </Col>
                    </Row>
                </div>
            </Tablet>

            {
                props.user.authenticated && !props.isOwn ?
                    <RecommendDialog
                        avatar={_.get(profile, ['avatar']) || null}
                        title={`${_.get(profile, ['firstName']) || ''} ${_.get(profile, ['lastName']) || ''}`}
                        desc={"Would you like to recommend our shop to others?"}
                        type="user"
                        userId={_.get(profile, ['_id']) || null}
                        handleError={(e) => { message.error(e.message) }}
                    />
                    :
                    null
            }
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    sellCars: state.sellCars,
    productsList: state.productsList,
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    fetchProductsList: fetchProductsList,
    updateActiveIdProductList: updateActiveIdProductList,
    filterCarBrandMode: filterCarBrandMode,
    filterCarModelMode: filterCarModelMode,
    filterCarSearchKeywords: filterCarSearchKeywords,
    quickSearchProductsList: quickSearchProductsList,

    loading: loading,
    setApplyYear: setApplyYear,
    setApplyPrice: setApplyPrice,
    setApplyMileage: setApplyMileage,
    updateSellerProfile: updateSellerProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(DealerProfile)));