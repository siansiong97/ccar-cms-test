import { Button, Col, Divider, Form, Icon, message, Rate, Row, Upload } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { v4 as uuidv4 } from 'uuid';
import {
    ccarWebLogo400X150, defaultProfileBackground, phone, email, help, address, location,
} from '../../icon';
import ClubAvatar from '../carFreak/components/club/club-avatar';
import client from '../../feathers';
import {
    filterCarBrandMode, filterCarModelMode, filterCarSearchKeywords, loading,
    loginMode, quickSearchProductsList,
    setApplyMileage, setApplyPrice, setApplyYear, updateActiveMenu
} from '../../redux/actions/app-actions';
import { fetchProductsList, updateActiveIdProductList } from '../../redux/actions/productsList-actions';
import { setUser } from '../../redux/actions/user-actions';
import UserAvatar from '../general/UserAvatar';
import { withRouter } from 'next/router';
import { updateSellerProfile } from '../../redux/actions/sellerProfile-actions';
import { formatNumber, getUserName, isObject, isValidNumber, notEmptyLength, roundToHalf } from '../../common-function';
import FollowButton from './FollowButton';
import LightBoxGallery from '../general/light-box-gallery';
import ShareButtonDialog from '../general/ShareButtonDialog';
import FollowingListModal from './FollowingListModal';
import FollowerListModal from './FollowerListModal';



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



var moment = require('moment');

const CLUB_SIZE = 6;

const ProfileDetailsBox = (props) => {

    const [profile, setProfile] = useState({})
    const [clubs, setClubs] = useState([])
    const [clubTotal, setClubTotal] = useState(0);
    const [followerModalVisible, setFollowerModalVisible] = useState(false);
    const [followingModalVisible, setFollowingModalVisible] = useState(false);

    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }

    }, [props.data])

    function handleSumbitCoverPhoto(coverPhoto) {
        if (coverPhoto && _.get(profile, ['_id'])) {
            props.loading(true);
            client.authenticate().then((res) => {
                let formData = new FormData();
                var fileName = uuidv4() + "-" + coverPhoto.name.split('.').join("-") + "-" + new Date().getTime();

                formData.append('images', coverPhoto.originFileObj, fileName);

                //Upload Image
                axios.post(`${client.io.io.uri}upload-images-array`,
                    formData
                    , {
                        headers: {
                            'Authorization': client.settings.storage.storage.storage['feathers-jwt'],
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                ).then((res) => {
                    if (notEmptyLength(_.get(res, ['data', 'result']))) {
                        coverPhoto = res.data.result[0].url;
                    } else {
                        coverPhoto = null;
                    }

                    client.service('users').patch(profile._id, { profileCoverPhoto: coverPhoto }).then(res => {
                        props.loading(false);
                        if (props.onChange) {
                            props.onChange(res);
                        }
                        if (props.onChangeCoverPhoto) {
                            props.onChangeCoverPhoto(_.get(res, ['profileCoverPhoto']));
                        }
                    }).catch(err => {
                        props.loading(false);
                        message.error(err.message)
                    });

                })
            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });

        }
    }

    useEffect(() => {
        if (_.isPlainObject(profile) && !_.isEmpty(profile)) {
            getClubs(_.get(profile, ['_id']));
        } else {
            setClubs([]);
        }

    }, [profile])

    function getClubs(id, skip) {

        if (id) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }

            client.service('clubjoin').find({
                query: {
                    userId: id,
                    status: 'approved',
                    $sort: {
                        createdAt: -1,
                    },
                    $limit: CLUB_SIZE,
                    $skip: skip,
                    $populate: ['clubId']
                }
            }).then(res => {
                setClubs(_.isArray(res.data) && !_.isEmpty(res.data) ? _.uniqBy(_.map(res.data, 'clubId') || [], '_id') : []);
                setClubTotal(res.total || 0);
            }).catch(err => {
            });
        }
    }

    const _renderBusinessHour = (data) => {

        if (notEmptyLength(data) && isObject(data)) {

            let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            let groupedDay = [];
            let dayLayout = [];
            let keys = Object.keys(data);

            days.forEach(function (day, index) {
                let temp = {};
                let start = keys.find(function (key) {
                    return key == (day + 'Start');
                })
                let end = keys.find(function (key) {
                    return key == (day + 'End');
                })

                temp.day = day;
                temp.dayCount = index;

                if (start != null) {
                    temp.startTime = data[start];
                } else {
                    temp.startTime = null;
                }

                if (end != null) {
                    temp.endTime = data[end];
                } else {
                    temp.endTime = null;
                }
                groupedDay.push(temp);
            })

            let isSame = true;
            let sameStartDay = null;

            groupedDay.forEach(function (item, index) {

                if (index != 0) {
                    if (moment(groupedDay[index].startTime).format("h:mm a") == moment(groupedDay[index - 1].startTime).format("h:mm a") && moment(groupedDay[index].endTime).format("h:mm a") == moment(groupedDay[index - 1].endTime).format("h:mm a")) {
                        isSame = true;
                    } else {
                        isSame = false;
                    }
                }
                if (!notEmptyLength(dayLayout) || !isSame) {
                    let layout = (
                        <div className="flex-justify-start flex-items-align-center fill-parent">
                            <span className="headline   d-inline-block " style={{ width: '150px' }}>
                                {item.day ? item.day : null}
                            </span>
                            <span className="headline   d-inline-block ">
                                :
                            </span>
                            <span className="headline   d-inline-block text-overflow-break text-align-center" style={{ width: '150px' }}>
                                {item.startTime ? moment(item.startTime).format("h:mm a") : null} - {item.endTime ? moment(item.endTime).format("h:mm a") : null}
                            </span>
                        </div>
                    )
                    isSame = true;
                    sameStartDay = item.day;
                    dayLayout.push(layout);
                } else {
                    dayLayout.pop();
                    let layout = (
                        <div className="flex-justify-start flex-items-align-center fill-parent">
                            <span className="headline   d-inline-block margin-right-md" style={{ width: '150px' }}>
                                {sameStartDay} - {item.day ? item.day : null}
                            </span>
                            <span className="headline   d-inline-block margin-right-sm">
                                :
                            </span>
                            <span className="headline   d-inline-block text-overflow-break text-align-center" style={{ width: '150px' }}>
                                {item.startTime ? moment(item.startTime).format("h:mm a") : null} - {item.endTime ? moment(item.endTime).format("h:mm a") : null}
                            </span>
                        </div>
                    )
                    dayLayout.push(layout);
                }
            })

            return (
                <div className="fill-parent d-inline-block text-overflow-break">
                    {dayLayout}
                </div>
            )
        } else {
            return null;
        }


    }

    return (
        <React.Fragment>

            <div className='relative-wrapper' style={{ backgroundImage: `url("${_.get(profile, ['profileCoverPhoto']) || defaultProfileBackground}")`, backgroundRepeat: 'no-repeat', backgroundSize: _.get(profile, ['profileCoverPhoto']) ? 'cover' : '100% 100%', }} >
                <div className='background-black opacity-60 absolute-center'>
                </div>
                <Desktop>
                    <Row type="flex" align="stretch" justify="center" className='padding-md' style={{ height: 450 }}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={6}>
                            <div className="fill-parent flex-items-align-center flex-justify-center">
                                <Row type="flex" align="middle">
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <UserAvatar showPreview data={profile} size={175} />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className='flex-items-no-shrink text-align-center white font-weight-bold subtitle1 margin-sm width-100'>
                                            {getUserName(profile, 'freakId')}
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                        </Col>

                        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }}>
                            <Row gutter={[10, 10]} className='padding-md fill-parent'>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-lg">
                                    <div className='flex-justify-start flex-items-align-center fill-parent'>
                                        <span className='d-inline-block' >
                                            <div className='white font-weight-light h5 text-align-center'>
                                                {!isValidNumber(_.get(profile, ['totalPost'])) ? 0 : formatNumber(_.get(profile, ['totalPost']), null, false, 0, false)}
                                            </div>
                                            <div className='white subtitle1 text-align-center'>
                                                Posts
                                                </div>
                                        </span>
                                        <span className='d-inline-block margin-x-sm height-100' >
                                            <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                        </span>
                                        <span className='d-inline-block cursor-pointer' onClick={(e) => { setFollowerModalVisible(true) }}  >
                                            <div className='white font-weight-light h5 text-align-center'>
                                                {!isValidNumber(_.get(profile, ['totalFollower'])) ? 0 : formatNumber(_.get(profile, ['totalFollower']), 'auto', true, 0, true)}
                                            </div>
                                            <div className='white subtitle1 text-align-center'>
                                                Followers
                                        </div>
                                        </span>
                                        <span className='d-inline-block margin-x-sm' >
                                            <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                        </span>
                                        <span className='d-inline-block cursor-pointer' onClick={() => { setFollowingModalVisible(true) }} >
                                            <div className='white font-weight-light h5 text-align-center'>
                                                {!isValidNumber(_.get(profile, ['totalFollowingUser'])) ? 0 : formatNumber(_.get(profile, ['totalFollowingUser']), 'auto', true, 0, true)}
                                            </div>
                                            <div className='white subtitle1 text-align-center'>
                                                Following
                                            </div>
                                        </span>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                    <div className='flex-justify-start flex-items-align-center '>
                                        <span className='d-inline-block white h7 font-weight-bold margin-right-md' >
                                            {getUserName(profile, 'namePrefix')}
                                        </span>
                                        {
                                            props.type == 'dealer' ?
                                                <span className='d-inline-block round-border background-ccar-button-yellow padding-x-md' >
                                                    {_.isNaN(parseInt(_.get(profile, ['totalAdsAvailable']))) ? 0 : formatNumber(_.get(profile, ['totalAdsAvailable']), 'auto', true, 0, true)} Ads Available
                                                </span>
                                                :
                                                null
                                        }
                                    </div>
                                </Col>
                                {
                                    props.type == 'dealer' ?
                                        [
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div>
                                                    <Rate value={_.isNaN(parseFloat(_.get(profile, ['avgRating']))) ? 0 : roundToHalf(parseFloat(_.get(profile, ['avgRating'])))} disabled allowHalf style={{ fontSize: '16px' }} ></Rate>
                                                </div>
                                            </Col>,
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="width-100 flex-justify-start flex-items-align-start">
                                                    <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                        <img src={phone} className='fill-parent absolute-center' />
                                                    </span>
                                                    <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                        {`${_.get(profile, ['contactNoPrimary']) || ''}`}
                                                    </span>
                                                </div>
                                            </Col>,
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="width-100  flex-justify-start flex-items-align-start">
                                                    <span className='d-inline-block relative-wrapper margin-right-sm' style={{ height: '20px', width: '20px' }}>
                                                        <img src={email} className='fill-parent absolute-center flex-items-no-shrink' />
                                                    </span>
                                                    <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                        {`${_.get(profile, ['email']) || ''}`}
                                                    </span>
                                                </div>
                                            </Col>,
                                        ]
                                        :
                                        null
                                }
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Scrollbars autoHide style={{ height: 70, maxWidth: '100%' }}>
                                        <div className="width-100 flex-justify-start flex-items-align-start text-overflow-break headline white">
                                            {_.get(profile, ['bio']) || ''}
                                        </div>
                                    </Scrollbars>
                                </Col>
                                {
                                    _.isArray(clubs) && !_.isEmpty(clubs) ?
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Scrollbars autoHeight style={{ width: '100%' }} >
                                                <div className="width-100 flex-justify-start flex-items-align-center">
                                                    {
                                                        _.map(clubs, function (club, index) {
                                                            return (
                                                                <span className='d-inline-block flex-items-no-shrink margin-right-md relative-wrapper cursor-pointer'>
                                                                    <ClubAvatar redirectProfile showTooltip data={club} size={30} />
                                                                    {
                                                                        clubTotal > CLUB_SIZE && index + 1 == CLUB_SIZE ?
                                                                            <span className='fill-parent flex-items-align-center flex-justify-center small-text white avatar absolute-center background-black-opacity-30' >
                                                                                + {formatNumber(clubTotal - CLUB_SIZE, 'auto', true, 0, true) || 0}
                                                                            </span>
                                                                            :
                                                                            null
                                                                    }
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </Scrollbars>
                                        </Col>
                                        :
                                        null
                                }
                                {
                                    props.showProfileActions ?
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="flex-justify-start flex-items-align-center">
                                                <Upload {...props} showUploadList={false} onChange={(e) => { handleSumbitCoverPhoto(e.file); }} multiple={false} accept="image/*">
                                                    <Button className='margin-right-md white background-grey-opacity-30'> <Icon type="camera" /> Edit Cover Photo </Button>
                                                </Upload>
                                                <Button onClick={(e) => {
                                                    if (_.get(profile, ['_id'])) {
                                                        props.router.push(`/profile/${profile._id}/details`)
                                                    }
                                                }} className='white background-grey-opacity-30'> <Icon type="user" /> Manage My Account </Button>
                                            </div>
                                        </Col>
                                        :
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent flex-justify-start flex-items-align-start">
                                                {/* <Button className='background-ccar-yellow white border-ccar-yellow margin-right-md'>Chat Now</Button> */}
                                                <FollowButton type="user" userId={_.get(profile, ['_id']) || ''} followerId={_.get(props.user, ['authenticated']) ? _.get(props, ['user', 'info', 'user', '_id']) || null : null}
                                                    handleError={(e) => { message.error(e.message) }}
                                                    handleSuccess={(e) => { message.success(e.type == 'remove' ? 'Unfollowed successful' : 'Followed successful') }}
                                                    className="margin-right-md"
                                                    followButton={() => {
                                                        return (
                                                            <Button className=' border-ccar-button-yellow background-ccar-button-yellow black padding-x-xl'>+ Follow</Button>
                                                        )
                                                    }}
                                                />
                                                <ShareButtonDialog className='padding-x-xl' />
                                            </div>
                                        </Col>
                                }
                            </Row>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            {
                                props.type == 'dealer' ?
                                    <Row className='padding-lg' gutter={[0, 10]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <LightBoxGallery images={_.compact([_.get(profile, ['companyId', 'bannerUrl', 0, 'url']) || ccarWebLogo400X150])}>
                                                {
                                                    (data, setCurrentIndex, setVisible) => {
                                                        return (
                                                            <div className="relative-wrapper background-black-opacity-40 cursor-pointer" style={{ height: 150, width: 400, maxWidth: '100%', maxHeight: '20%' }} onClick={(e) => {
                                                                setCurrentIndex(0);
                                                                setVisible(true);
                                                            }}>
                                                                <img src={
                                                                    _.isArray(_.get(profile, ['companyId', 'bannerUrl'])) && notEmptyLength(_.get(profile, ['companyId', 'bannerUrl'])) ?
                                                                        profile.companyId.bannerUrl[0].url
                                                                        :
                                                                        ccarWebLogo400X150
                                                                } className={`fill-parent ${_.isArray(_.get(profile, ['companyId', 'bannerUrl'])) && notEmptyLength(_.get(profile, ['companyId', 'bannerUrl'])) ? 'absolute-center-img-no-stretch' : 'absolute-center'}`} />
                                                            </div>
                                                        )
                                                    }
                                                }
                                            </LightBoxGallery>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src="/assets/profile/address-work.png" className="fill-parent absolute-center" ></img>
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline">
                                                    {`${_.get(profile, ['companyId', 'name']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={address} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline uppercase ">
                                                    {`${_.get(profile, ['companyId', 'address']) || ''}, ${_.get(profile, ['companyId', 'area']) || ''}, ${_.get(profile, ['companyId', 'postCode']) || ''}, ${_.get(profile, ['companyId', 'state']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={location} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline uppercase  ">
                                                    {`${_.get(profile, ['companyId', 'area']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={help} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white flex-items-align-center flex-justify-start headline car-for-sale ">
                                                    {_renderBusinessHour(_.get(profile, ['companyId', 'businessHour']) || [])}
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                </Desktop>

                <Tablet>
                    <Row type="flex" align="stretch" justify="center" className='padding-md' style={{ minHeight: '50vh' }}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={6}>
                            <div className="fill-parent flex-items-align-center flex-justify-center">
                                <Row type="flex" align="middle">
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <UserAvatar showPreview data={profile} size={175} />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className='flex-items-no-shrink text-align-center white font-weight-bold subtitle1 margin-sm width-100'>
                                            {getUserName(profile, 'freakId')}
                                        </div>
                                    </Col>

                                    {
                                        !props.showProfileActions ?
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="fill-parent flex-justify-start flex-items-align-start">
                                                    {/* <Button className='background-ccar-yellow white border-ccar-yellow margin-right-md'>Chat Now</Button> */}
                                                    <FollowButton type="user" userId={_.get(profile, ['_id']) || ''} followerId={_.get(props.user, ['authenticated']) ? _.get(props, ['user', 'info', 'user', '_id']) || null : null}
                                                        handleError={(e) => { message.error(e.message) }}
                                                        handleSuccess={(e) => { message.success(e.type == 'remove' ? 'Unfollowed successful' : 'Followed successful') }}
                                                        className="margin-right-md"
                                                        followButton={() => {
                                                            return (
                                                                <Button className=' border-ccar-button-yellow background-ccar-button-yellow black padding-x-xl'>+ Follow</Button>
                                                            )
                                                        }}
                                                    />
                                                    <ShareButtonDialog className='padding-x-xl' />
                                                </div>
                                            </Col>
                                            :
                                            null
                                    }
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-lg ">
                                        <div className='flex-justify-center flex-items-align-center fill-parent '>
                                            <span className='d-inline-block' >
                                                <div className='white font-weight-light h5 text-align-center'>
                                                    {!isValidNumber(_.get(profile, ['totalPost'])) ? 0 : formatNumber(_.get(profile, ['totalPost']), null, false, 0, false)}
                                                </div>
                                                <div className='white subtitle1 text-align-center'>
                                                    Posts
                                                </div>
                                            </span>
                                            <span className='d-inline-block margin-x-sm height-100' >
                                                <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                            </span>
                                            <span className='d-inline-block cursor-pointer' onClick={(e) => { setFollowerModalVisible(true) }}  >
                                                <div className='white font-weight-light h5 text-align-center'>
                                                    {!isValidNumber(_.get(profile, ['totalFollower'])) ? 0 : formatNumber(_.get(profile, ['totalFollower']), 'auto', true, 0, true)}
                                                </div>
                                                <div className='white subtitle1 text-align-center'>
                                                    Followers
                                        </div>
                                            </span>
                                            <span className='d-inline-block margin-x-sm' >
                                                <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                            </span>
                                            <span className='d-inline-block cursor-pointer' onClick={() => { setFollowingModalVisible(true) }} >
                                                <div className='white font-weight-light h5 text-align-center'>
                                                    {!isValidNumber(_.get(profile, ['totalFollowingUser'])) ? 0 : formatNumber(_.get(profile, ['totalFollowingUser']), 'auto', true, 0, true)}
                                                </div>
                                                <div className='white subtitle1  text-align-center'>
                                                    Following
                                    </div>
                                            </span>
                                        </div>
                                    </Col>
                                    {
                                        props.showProfileActions ?
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="flex-justify-center flex-items-align-center">
                                                    <Upload {...props} showUploadList={false} onChange={(e) => { handleSumbitCoverPhoto(e.file); }} multiple={false} accept="image/*">
                                                        <Button className='margin-right-md white background-grey-opacity-30'> <Icon type="camera" /> Edit Cover Photo </Button>
                                                    </Upload>
                                                    <Button onClick={(e) => {
                                                        if (_.get(profile, ['_id'])) {
                                                            props.router.push(`/profile/${profile._id}/details`)
                                                        }
                                                    }} className='white background-grey-opacity-30'> <Icon type="user" /> Manage My Account </Button>
                                                </div>
                                            </Col>
                                            :
                                            null
                                    }
                                    {
                                        props.type == 'dealer' ?
                                            [
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                                    <div className='white headline text-align-center '>
                                                        {_.isNaN(parseInt(_.get(profile, ['totalAdsAvailable']))) ? 0 : formatNumber(_.get(profile, ['totalAdsAvailable']), 'auto', true, 0, true)} Ads Available
                                        </div>
                                                </Col>,
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                    <div className="text-align-center">
                                                        <Rate value={_.isNaN(parseFloat(_.get(profile, ['avgRating']))) ? 0 : roundToHalf(parseFloat(_.get(profile, ['avgRating'])))} disabled allowHalf style={{ fontSize: '16px' }} ></Rate>
                                                    </div>
                                                </Col>,
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                    <div className="width-100 flex-justify-center flex-items-align-start">
                                                        <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                            <img src={phone} className='fill-parent absolute-center' />
                                                        </span>
                                                        <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                            {`${_.get(profile, ['contactNoPrimary']) || ''}`}
                                                        </span>
                                                    </div>
                                                </Col>,
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                    <div className="width-100  flex-justify-center flex-items-align-start">
                                                        <span className='d-inline-block relative-wrapper margin-right-sm' style={{ height: '20px', width: '20px' }}>
                                                            <img src={email} className='fill-parent absolute-center flex-items-no-shrink' />
                                                        </span>
                                                        <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                            {`${_.get(profile, ['email']) || ''}`}
                                                        </span>
                                                    </div>
                                                </Col>,
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                    <Scrollbars style={{ height: 150, maxWidth: '100%' }} autoHide>
                                                        <div className="width-100 flex-justify-start flex-items-align-start text-overflow-break headline white">
                                                            {_.get(profile, ['bio']) || ''}
                                                        </div>
                                                    </Scrollbars>
                                                </Col>
                                            ]
                                            :
                                            null
                                    }
                                </Row>
                            </div>
                        </Col>

                        {/* <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }}>
                        <Row gutter={[10, 10]} className='padding-md fill-parent'>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-lg">
                                <div className='flex-justify-start flex-items-align-center fill-parent'>
                                    <span className='d-inline-block' >
                                        <div className='white font-weight-light h5 text-align-center'>
                                            {!isValidNumber(_.get(profile, ['totalPost'])) ? 0 : formatNumber(_.get(profile, ['totalPost']), null, false, 0, false)}
                                        </div>
                                        <div className='white subtitle1 text-align-center'>
                                            Posts
                                                </div>
                                    </span>
                                    <span className='d-inline-block margin-x-sm height-100' >
                                        <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                    </span>
                                    <span className='d-inline-block cursor-pointer' onClick={(e) => {setFollowerModalVisible(true)}}  >
                                        <div className='white font-weight-light h5 text-align-center'>
                                            {!isValidNumber(_.get(profile, ['totalFollower'])) ? 0 : formatNumber(_.get(profile, ['totalFollower']), 'auto', true, 0, true)}
                                        </div>
                                        <div className='white subtitle1 text-align-center'>
                                            Followers
                                        </div>
                                    </span>
                                    <span className='d-inline-block margin-x-sm' >
                                        <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                    </span>
                                    <span className='d-inline-block cursor-pointer' onClick={() => { setFollowingModalVisible(true) }} >
                                        <div className='white font-weight-light h5 text-align-center'>
                                            {!isValidNumber(_.get(profile, ['totalFollowingUser'])) ? 0 : formatNumber(_.get(profile, ['totalFollowingUser']), 'auto', true, 0, true)}
                                        </div>
                                        <div className='white subtitle1  text-align-center'>
                                            Following
                                    </div>
                                    </span>
                                </div>
                            </Col>
                            {
                                props.showProfileActions ?
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className="flex-justify-start flex-items-align-center">
                                            <Upload {...props} showUploadList={false} onChange={(e) => { handleSumbitCoverPhoto(e.file); }} multiple={false} accept="image/*">
                                                <Button className='margin-right-md white background-grey-opacity-30'> <Icon type="camera" /> Edit Cover Photo </Button>
                                            </Upload>
                                            <Button onClick={(e) => {
                                                if (_.get(profile, ['_id'])) {
                                                    props.router.push(`/profile/${profile._id}/details`)
                                                }
                                            }} className='white background-grey-opacity-30'> <Icon type="user" /> Manage My Account </Button>
                                        </div>
                                    </Col>
                                    :
                                    null
                            }
                            {
                                props.type == 'dealer' ?
                                    [
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                            <div className='white headline '>
                                                {_.isNaN(parseInt(_.get(profile, ['totalAdsAvailable']))) ? 0 : formatNumber(_.get(profile, ['totalAdsAvailable']), 'auto', true, 0, true)} Ads Available
                                        </div>
                                        </Col>,
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div>
                                                <Rate value={_.isNaN(parseFloat(_.get(profile, ['avgRating']))) ? 0 : roundToHalf(parseFloat(_.get(profile, ['avgRating'])))} disabled allowHalf style={{ fontSize: '16px' }} ></Rate>
                                            </div>
                                        </Col>,
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="width-100 flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={phone} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                    {`${_.get(profile, ['contactNoPrimary']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>,
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="width-100  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm' style={{ height: '20px', width: '20px' }}>
                                                    <img src={email} className='fill-parent absolute-center flex-items-no-shrink' />
                                                </span>
                                                <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                    {`${_.get(profile, ['email']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>,
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Scrollbars style={{ height: 150 }} autoHide>
                                                <div className="width-100 flex-justify-start flex-items-align-start text-overflow-break headline white">
                                                    {_.get(profile, ['bio']) || ''}
                                                </div>
                                            </Scrollbars>
                                        </Col>
                                    ]
                                    :
                                    null
                            }
                        </Row>
                    </Col> */}

                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                            {
                                props.type == 'dealer' ?
                                    <Row gutter={[0, 10]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="relative-wrapper background-black-opacity-40" style={{ height: 150, width: 400 }}>

                                                <img src={
                                                    _.isArray(_.get(profile, ['companyId', 'bannerUrl'])) && notEmptyLength(_.get(profile, ['companyId', 'bannerUrl'])) ?
                                                        profile.companyId.bannerUrl[0].url
                                                        :
                                                        ccarWebLogo400X150
                                                } className={`fill-parent ${_.isArray(_.get(profile, ['companyId', 'bannerUrl'])) && notEmptyLength(_.get(profile, ['companyId', 'bannerUrl'])) ? 'absolute-center-img-no-stretch' : 'absolute-center'}`} />
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src="/assets/profile/address-work.png" className="fill-parent absolute-center" ></img>
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline">
                                                    {`${_.get(profile, ['companyId', 'name']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink uppercase' style={{ height: '20px', width: '20px' }}>
                                                    <img src={address} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline uppercase">
                                                    {`${_.get(profile, ['companyId', 'address']) || ''}, ${_.get(profile, ['companyId', 'area']) || ''}, ${_.get(profile, ['companyId', 'postCode']) || ''}, ${_.get(profile, ['companyId', 'state']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={location} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline uppercase">
                                                    {`${_.get(profile, ['companyId', 'area']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={help} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white flex-items-align-center flex-justify-start headline car-for-sale ">
                                                    {_renderBusinessHour(_.get(profile, ['companyId', 'businessHour']) || [])}
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                </Tablet>

                <Mobile>
                    <Row type="flex" align="stretch" justify="center" className='padding-md' style={{ minHeight: '50vh' }}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={6}>
                            <div className="fill-parent flex-items-align-center flex-justify-center">
                                <Row type="flex" align="middle">
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <UserAvatar showPreview data={profile} size={175} />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className='flex-items-no-shrink text-align-center white font-weight-bold subtitle1 margin-sm width-100'>
                                            {getUserName(profile, 'freakId')}
                                        </div>
                                    </Col>

                                    {
                                        !props.showProfileActions ?
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="fill-parent flex-justify-start flex-items-align-start">
                                                    {/* <Button className='background-ccar-yellow white border-ccar-yellow margin-right-md'>Chat Now</Button> */}
                                                    <FollowButton type="user" userId={_.get(profile, ['_id']) || ''} followerId={_.get(props.user, ['authenticated']) ? _.get(props, ['user', 'info', 'user', '_id']) || null : null}
                                                        handleError={(e) => { message.error(e.message) }}
                                                        handleSuccess={(e) => { message.success(e.type == 'remove' ? 'Unfollowed successful' : 'Followed successful') }}
                                                        className="margin-right-md"
                                                        followButton={() => {
                                                            return (
                                                                <Button className=' border-ccar-button-yellow background-ccar-button-yellow black padding-x-xl'>+ Follow</Button>
                                                            )
                                                        }}
                                                    />
                                                    <ShareButtonDialog className='padding-x-xl' />
                                                </div>
                                            </Col>
                                            :
                                            null
                                    }
                                </Row>
                            </div>
                        </Col>

                        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }}>
                            <Row gutter={[10, 10]} className='padding-md fill-parent'>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-lg">
                                    <div className='flex-justify-start flex-items-align-center fill-parent'>
                                        <span className='d-inline-block' >
                                            <div className='white font-weight-light h5 text-align-center'>
                                                {!isValidNumber(_.get(profile, ['totalPost'])) ? 0 : formatNumber(_.get(profile, ['totalPost']), null, false, 0, false)}
                                            </div>
                                            <div className='white subtitle1 text-align-center'>
                                                Posts
                                                </div>
                                        </span>
                                        <span className='d-inline-block margin-x-sm height-100' >
                                            <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                        </span>
                                        <span className='d-inline-block cursor-pointer' onClick={(e) => { setFollowerModalVisible(true) }}  >
                                            <div className='white font-weight-light h5 text-align-center'>
                                                {!isValidNumber(_.get(profile, ['totalFollower'])) ? 0 : formatNumber(_.get(profile, ['totalFollower']), 'auto', true, 0, true)}
                                            </div>
                                            <div className='white subtitle1 text-align-center'>
                                                Followers
                                        </div>
                                        </span>
                                        <span className='d-inline-block margin-x-sm' >
                                            <Divider orientation="center" type="vertical" className="background-color-white border-white thin-border" style={{ height: '30px' }}></Divider>
                                        </span>
                                        <span className='d-inline-block cursor-pointer' onClick={() => { setFollowingModalVisible(true) }} >
                                            <div className='white font-weight-light h5 text-align-center'>
                                                {!isValidNumber(_.get(profile, ['totalFollowingUser'])) ? 0 : formatNumber(_.get(profile, ['totalFollowingUser']), 'auto', true, 0, true)}
                                            </div>
                                            <div className='white subtitle1  text-align-center'>
                                                Following
                                    </div>
                                        </span>
                                    </div>
                                </Col>
                                {
                                    props.showProfileActions ?
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="flex-justify-start flex-items-align-center">
                                                <Upload {...props} showUploadList={false} onChange={(e) => { handleSumbitCoverPhoto(e.file); }} multiple={false} accept="image/*">
                                                    <Button className='margin-right-md white background-grey-opacity-30'> <Icon type="camera" /> Edit Cover Photo </Button>
                                                </Upload>
                                                <Button onClick={(e) => {
                                                    if (_.get(profile, ['_id'])) {
                                                        props.router.push(`/profile/${profile._id}/details`)
                                                    }
                                                }} className='white background-grey-opacity-30'> <Icon type="user" /> Manage My Account </Button>
                                            </div>
                                        </Col>
                                        :
                                        null
                                }
                                {
                                    props.type == 'dealer' ?
                                        [
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                                <div className='white headline '>
                                                    {_.isNaN(parseInt(_.get(profile, ['totalAdsAvailable']))) ? 0 : formatNumber(_.get(profile, ['totalAdsAvailable']), 'auto', true, 0, true)} Ads Available
                                        </div>
                                            </Col>,
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div>
                                                    <Rate value={_.isNaN(parseFloat(_.get(profile, ['avgRating']))) ? 0 : roundToHalf(parseFloat(_.get(profile, ['avgRating'])))} disabled allowHalf style={{ fontSize: '16px' }} ></Rate>
                                                </div>
                                            </Col>,
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="width-100 flex-justify-start flex-items-align-start">
                                                    <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                        <img src={phone} className='fill-parent absolute-center' />
                                                    </span>
                                                    <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                        {`${_.get(profile, ['contactNoPrimary']) || ''}`}
                                                    </span>
                                                </div>
                                            </Col>,
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className="width-100  flex-justify-start flex-items-align-start">
                                                    <span className='d-inline-block relative-wrapper margin-right-sm' style={{ height: '20px', width: '20px' }}>
                                                        <img src={email} className='fill-parent absolute-center flex-items-no-shrink' />
                                                    </span>
                                                    <span className="d-inline-block white margin-right-md flex-items-align-center flex-justify-start headline  ">
                                                        {`${_.get(profile, ['email']) || ''}`}
                                                    </span>
                                                </div>
                                            </Col>,
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Scrollbars style={{ height: 150, maxWidth: '100%', width: '100%' }} autoHide>
                                                    <div className="width-100 wrapBorderRed flex-justify-start flex-items-align-start text-overflow-break headline white">
                                                        {_.get(profile, ['bio']) || ''}
                                                    </div>
                                                </Scrollbars>
                                            </Col>
                                        ]
                                        :
                                        null
                                }
                            </Row>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            {
                                props.type == 'dealer' ?
                                    <Row className='padding-lg' gutter={[0, 10]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="relative-wrapper background-black-opacity-40" style={{ height: 150, width: 400, maxWidth: '100%', maxHeight: '20%' }}>

                                                <img src={
                                                    _.isArray(_.get(profile, ['companyId', 'bannerUrl'])) && notEmptyLength(_.get(profile, ['companyId', 'bannerUrl'])) ?
                                                        profile.companyId.bannerUrl[0].url
                                                        :
                                                        ccarWebLogo400X150
                                                } className={`fill-parent ${_.isArray(_.get(profile, ['companyId', 'bannerUrl'])) && notEmptyLength(_.get(profile, ['companyId', 'bannerUrl'])) ? 'absolute-center-img-no-stretch' : 'absolute-center'}`} />
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src="/assets/profile/address-work.png" className="fill-parent absolute-center" ></img>
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline">
                                                    {`${_.get(profile, ['companyId', 'name']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={address} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline  uppercase ">
                                                    {`${_.get(profile, ['companyId', 'address']) || ''}, ${_.get(profile, ['companyId', 'area']) || ''}, ${_.get(profile, ['companyId', 'postCode']) || ''}, ${_.get(profile, ['companyId', 'state']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={location} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white  flex-items-align-center flex-justify-start headline uppercase  ">
                                                    {`${_.get(profile, ['companyId', 'area']) || ''}`}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="fill-parent  flex-justify-start flex-items-align-start">
                                                <span className='d-inline-block relative-wrapper margin-right-sm flex-items-no-shrink' style={{ height: '20px', width: '20px' }}>
                                                    <img src={help} className='fill-parent absolute-center' />
                                                </span>
                                                <span className="d-inline-block white flex-items-align-center flex-justify-start headline car-for-sale ">
                                                    {_renderBusinessHour(_.get(profile, ['companyId', 'businessHour']) || [])}
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                </Mobile>

            </div>


            <FollowerListModal userId={_.get(profile, ['_id'])} visible={followerModalVisible} onCancel={() => {
                setFollowerModalVisible(false);
            }}
            />

            <FollowingListModal userId={_.get(profile, ['_id'])} visible={followingModalVisible} onCancel={() => {
                setFollowingModalVisible(false);
            }} />
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
    loginMode: loginMode,

    setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProfileDetailsBox)));