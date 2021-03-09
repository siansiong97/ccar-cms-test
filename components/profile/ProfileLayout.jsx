import { Avatar, Breadcrumb, Card, Col, Form, message, Row } from 'antd';
import _ from 'lodash';
import Link from 'next/link';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../common-function';
import client from '../../feathers';
import { filterCarBrandMode, filterCarModelMode, filterCarSearchKeywords, loading, loginMode, quickSearchProductsList, updateActiveMenu } from '../../redux/actions/app-actions';
import { fetchProductsList, updateActiveIdProductList } from '../../redux/actions/productsList-actions';
import LayoutV2 from '../general/LayoutV2';
import UserAvatar from '../general/UserAvatar';
import { ccarLogo, facebookLogo, googleLogo } from '../profile/config';



const { Meta } = Card;


const profilePic = "/assets/profile/profilePic.jpg";

const accountInfoIconActived = "/assets/profile/account-info-active.png";
const addressBookIconActived = "/assets/profile/address-book-active.png";
const followedStoreIconActived = "/assets/profile/followed-store-active.png";
const recentViewedIconActived = "/assets/profile/recent-viewed-active.png";
const wishlistIconActived = "/assets/profile/wishlist-active.png";
const bookAccountIconActived = "/assets/profile/book-account-active.png";
const settingIconActived = "/assets/profile/bell-yellow.png";
const dashboardIconActivated = "/assets/profile/dashboard-active.png";
const editProfileIconActivated = "/assets/profile/edit-profile-yellow.png";


const editProfileIcon = "/assets/profile/edit-profile-grey.png";
const accountInfoIcon = "/assets/profile/account-info.png";
const addressBookIcon = "/assets/profile/address-book.png";
const followedStoreIcon = "/assets/profile/followed-store.png";
const recentViewedIcon = "/assets/profile/recent-viewed.png";
const wishlistIcon = "/assets/profile/wishlist.png";
const bookAccountIcon = "/assets/profile/book-account.png";
const settingIcon = "/assets/profile/bell-grey.png";
const dashboardIcon = "/assets/profile/dashboard.png";


const PAGESIZE = 30;


const profileMenu = [
    // {
    //     title: 'Dashboard',
    //     name: 'dashboard',
    //     iconSrc: dashboardIcon,
    //     activeIconSrc: dashboardIconActivated,
    // },
    {
        title: 'My Wishlist',
        name: 'wishlists',
        iconSrc: wishlistIcon,
        activeIconSrc: wishlistIconActived,
        path: '/profile/:id/details/wishlists'
    },
    // {
    //     title: 'Prefer Agents',
    //     name: 'follow-agents',
    //     iconSrc: followedStoreIcon,
    //     activeIconSrc: followedStoreIconActived,
    //     path: '/profile/:id/details/follow-agents'
    // },
    // {
    //     title: 'Address Book',
    //     name: 'address-book',
    //     iconSrc: addressBookIcon,
    //     activeIconSrc: addressBookIconActived,
    //     path: '/profile/:id/details/address-book'
    // },
    // {
    //     title: 'Bank Accounts / Cards',
    //     name: 'accounts',
    //     iconSrc: bookAccountIcon,
    //     activeIconSrc: bookAccountIconActived,
    //     path: '/profile/:id/details/accounts'
    // },
];

const ProfileLayout = (props) => {

    const [step, setStep] = useState('')
    const [profile, setProfile] = useState()
    const [navItems, setNavItems] = useState()

    useEffect(() => {

        let path = props.router.asPath.split('/')[4];
        setStep(path);
    }, [props.router.asPath])

    useEffect(() => {
        getProfile();
    }, [props.router.query.id])

    useEffect(() => {

        switch (step) {
            case 'wishlists':
                setNavItems([
                    <Breadcrumb.Item>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details/wishlists`}>
                            <a>My Wishlist</a>
                        </Link>
                    </Breadcrumb.Item>
                ])
                break;
            case 'address-book':
                setNavItems([
                    <Breadcrumb.Item>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details/address-book`}>
                            <a>
                                My Address Book
                                </a>
                        </Link>
                    </Breadcrumb.Item>
                ])
                break;
            case 'address-book-create':
                setNavItems([
                    <Breadcrumb.Item>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details/address-book`}> 
                            <a>
                                My Address Book
                                </a></Link>
                    </Breadcrumb.Item>,
                    <Breadcrumb.Item>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details/address-book-create`}>
                            <a>
                                Add Address
                                </a></Link>
                    </Breadcrumb.Item>
                ])
                break;
            case 'address-book-edit':
                setNavItems([
                    <Breadcrumb.Item>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details/address-book`}> 
                            <a>
                                My Address Book
                                </a></Link>
                    </Breadcrumb.Item>,
                    <Breadcrumb.Item>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details/address-book-edit/${props.router.query.address_id || ''}`}>
                            <a>
                                Edit Address
                                </a></Link>
                    </Breadcrumb.Item>
                ])
                break;

            default:
                setNavItems([
                    <Breadcrumb.Item key='editprofile'>
                        <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}/details`}>
                            <a>
                                Edit Profile
                            </a>
                        </Link>
                    </Breadcrumb.Item>
                ])
                break;
        }

    }, [step, profile])


    function getProfile() {
        props.loading(true);
        if (_.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == props.router.query.id) {
            client.service('users').find({
                query: {
                    _id: props.router.query.id,
                    $populate: [
                        {
                            path: 'companyId',
                            ref: 'companys'
                        }
                    ],
                }
            }).then(res => {
                props.loading(false);
                setProfile(_.isArray(res.data) && notEmptyLength(res.data) ? res.data[0] : {})
                if (props.onGetProfile) {
                    props.onGetProfile(_.isArray(res.data) && notEmptyLength(res.data) ? res.data[0] : {})
                }
            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });
        } else {
            message.error('Profile Not Found.');
            props.router.push('/');
        }
    }

    const _renderProfileMenu = (menuItems) => {

        return menuItems.map((item, index) => {
            return (
                <a key={'path' + index} onClick={() => {
                    if (_.get(profile, ['_id'])) {
                        let path = item.path.replace(':id', profile._id);
                        props.router.push(path);
                    }
                }}>
                    <Row key={'row' + index} type="flex" justify="start" gutter={[0, 30]} className="padding-left-md" key={index} >
                        <Col span={24}>
                            <h4 className="text-truncate">
                                {step === item.name ?
                                    <Avatar src={item.activeIconSrc} className="margin-right-lg" /> : <Avatar src={item.iconSrc} className="margin-right-lg" />}
                                {item.title}
                            </h4>
                        </Col>
                    </Row>
                </a>
            );
        });
    }

    return (
        <React.Fragment>

            <LayoutV2>
                <div className="section">
                    <div className="container">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link shallow={false} prefetch href="/">
                                    <a>
                                        Home
                                    </a>
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link shallow={false} prefetch href={`/profile/${_.get(profile, ['_id'])}`}>
                                    <a>
                                        Profile
                                    </a>
                                </Link>
                                {/* <a onClick={(e) => { setStep('dashboard') }}>Profile</a> */}
                            </Breadcrumb.Item>
                            {
                                navItems
                            }
                        </Breadcrumb>
                        <Row gutter={[10, 10]} type="flex" justify="center" align="top" >
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={6} xl={6} >
                                <Row type="flex" justify="center" align="top" gutter={[10, 10]}>
                                    {/* Profile Pic */}
                                    <Col span={24} >
                                        <div className="round-border thin-border padding-sm">
                                            <Row >
                                                <Col span={24} className="text-align-center" >
                                                    <div style={{ 'position': 'relative' }}>
                                                        <div>

                                                            <UserAvatar size={150} data={profile} avatarStyle={{ "border-color": 'black', 'border': 'solid' }} />
                                                            {
                                                                _.isPlainObject(profile) && !_.isEmpty(profile) ?
                                                                    <Avatar size={35} src={profile.facebookId ? facebookLogo : profile.googleId ? googleLogo : ccarLogo} style={{ 'position': 'absolute', top: "80%", left: "63%" }} className='background-white' />
                                                                    :
                                                                    null
                                                            }
                                                        </div>

                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row type="flex" justify="center" >
                                                <h3 style={{
                                                    'fontWeight': 'bold'
                                                }}>{_.get(profile, ['freakId']) || ''}</h3>
                                            </Row>
                                            <Row type="flex" justify="center" >
                                                <p >{_.get(profile, ['email']) || ''}</p>
                                            </Row>
                                        </div>
                                    </Col>

                                    {/* Profile Menu */}
                                    <Col span={24}>
                                        <div className=" round-border thin-border padding-sm">
                                            {_renderProfileMenu(profileMenu)}
                                        </div>
                                    </Col>

                                    {/* Setting */}
                                    {/* <Col span={24}>
                                        <div className=" round-border thin-border padding-sm">
                                            <Row type="flex"   justify="start" gutter={[0, 0]} className="padding-left-md" onClick={() => {
                                                if (_.get(profile, ['_id'])) {
                                                    props.router.push(`/profile/${profile._id}/details/settings`);
                                                }
                                            }}>
                                                <Col span={24}>
                                                    <a>

                                                        <h4 className="text-truncate">
                                                            {step === 'settings' ?
                                                                <Avatar src={settingIconActived} className="margin-right-lg" />
                                                                :
                                                                <Avatar src={settingIcon} className="margin-right-lg" />
                                                            }
                                                    Notification Settings
                                                    </h4>
                                                    </a>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col> */}
                                    <Col span={24}>
                                        <div className="round-border thin-border padding-sm">
                                            <Row type="flex" justify="start" gutter={[0, 0]} className="padding-left-md" onClick={() => {
                                                if (_.get(profile, ['_id'])) {
                                                    props.router.push(`/profile/${profile._id}/details`);
                                                }
                                            }}>
                                                <Col span={24}>
                                                    <a>
                                                        <h4 className="text-truncate">
                                                            {step == null || step == '' || step == undefined ?
                                                                <Avatar src={editProfileIconActivated} className="margin-right-lg" />
                                                                :
                                                                <Avatar src={editProfileIcon} className="margin-right-lg" />
                                                            }
                                                    Edit Profile
                                                    </h4>
                                                    </a>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    {/* Setting */}
                                </Row>
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={18} xl={18}>
                                {
                                    props.children
                                }
                            </Col>
                        </Row>
                    </div>
                </div>
            </LayoutV2>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    sellCars: state.sellCars,
    productsList: state.productsList,
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loginMode: loginMode,
    updateActiveMenu: updateActiveMenu,
    fetchProductsList: fetchProductsList,
    updateActiveIdProductList: updateActiveIdProductList,
    filterCarBrandMode: filterCarBrandMode,
    filterCarModelMode: filterCarModelMode,
    filterCarSearchKeywords: filterCarSearchKeywords,
    quickSearchProductsList: quickSearchProductsList,

    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProfileLayout)));