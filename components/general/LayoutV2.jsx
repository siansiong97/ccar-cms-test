
import React from 'react';
import Head from 'next/head'
import client from '../../feathers'
import carAdsFilter from '../../api/carAdsFilter'
import { convertParameterToProductListUrl, notEmptyLength } from '../../common-function';
import { checkEnv } from '../../functionContent';
import { UserOutlined, MenuOutlined, CopyrightCircleOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet";
import _ from 'lodash';
import { Affix, AutoComplete, Avatar, Badge, Button, Col, Divider, Drawer, Dropdown, Icon, Input, Layout, Menu, message, Row, Tabs } from 'antd'
import { cnyLogo2 } from '../../icon';
import GlobalSearchBar from './global-search-bar';
import { useMediaQuery } from 'react-responsive';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { loading, loginMode, registerMode, updateActiveMenu, quickSearchProductsList, setApplyYear, setApplyMileage, setApplyPrice, setMenuHeight, setNotificationToken } from '../../redux/actions/app-actions';
import { logoutSuccessful, setUser } from '../../redux/actions/user-actions';
import { fetchCompareCarLimit, clearProductFilterOptions } from '../../redux/actions/productsList-actions';
import { fetchCompareNewCarLimit } from '../../redux/actions/newcars-actions';
import Link from 'next/link';
import CookieConsent, { Cookies } from "react-cookie-consent";
import LoginModal from '../login/login'
import UserAvatar from './user-avatar';
import { withRouter } from 'next/dist/client/router';


var currentEnv = checkEnv(client.io.io.uri)
class LayoutV2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            searchWords: [],
            searchValue: null,
            value: undefined,
            typingTimeout: 0,
            scrollYPosition: 0,
            run: true,
            dataSource: [],
            newKppJson: [],
            visible: false,
            scrollRange: 100,
            scrollY: 0,
            backgroundStyle: {
                backgroundImage: null,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%'
            },
            window: {},
        }

    }


    componentDidMount() {
        if (typeof window != 'undefined') {
            this.setState({
                window: window,
            })
        }

        window.scrollTo(0, 0);
        this.props.loading(false);
        // if(this.props.location.pathname.indexOf('viewCar') > 0){
        //   window.location.href="ccarmy:/" + this.props.location.pathname
        // }
        this.props.setMenuHeight(document.getElementById('menu-bar').getBoundingClientRect().height);
        if (this.props.backgroundImage) {
            this.setState({
                backgroundStyle: {
                    ...this.state.backgroundStyle,
                    backgroundImage: this.props.backgroundImage,
                }
            })
        }

        if (this.props.scrollRange) {
            this.setState({
                scrollRange: this.props.scrollRange,
            })
        }

    }

    _renderUser = (profileMenu) => {
        let self = this;
        if (_.get(this.props, ['user', 'authenticated'])) {
            return (
                <span className='d-inline-block margin-x-md flex-items-align-center' >
                    {/* <span className='d-inline-block margin-right-md' >
                        <Badge count={1}>
                            <Avatar
                                icon={!this.props.user.info || !this.props.user.info.user || !this.props.user.info.user.avatar ? 'user' : null}
                                src={!this.props.user.info || !this.props.user.info.user || !this.props.user.info.user.avatar ? null : this.props.user.info.user.avatar} />
                        </Badge>
                    </span> */}
                    <Dropdown placement="bottomRight" overlayClassName="padding-top-lg" overlayStyle={{ width: '250px' }} overlay={() => {
                        return (
                            <Menu>
                                {
                                    _.map(profileMenu, function (menu, index) {
                                        return (
                                            <Menu.Item key={`profile-menu-${++index}`} className='padding-sm' onClick={(e) => { self.props.router.push(menu.path) }}>
                                                <div className="flex-justify-start flex-items-align-center">
                                                    <span className='d-inline-block margin-x-sm'>
                                                        {menu.icon}
                                                    </span>
                                                    <span className='d-inline-block black headline subtitle1   cursor-pointer margin-x-sm' >
                                                        {menu.text}
                                                    </span>
                                                </div>
                                            </Menu.Item>
                                        )
                                    })
                                }
                                {
                                    _.get(this.props.user, ['info', 'user', 'role']) != 'mobile-user' && _.get(this.props.user, ['info', 'user', 'role']) != 'normaluser' ?
                                        <Menu.Item key={`profile-menu-dealership`} className='padding-sm' onClick={(e) => {

                                        }}>
                                            <div className="flex-justify-start flex-items-align-center">
                                                <Button className=" background-ccar-button-yellow black border-ccar-button-yellow text-align-center" block target="_blank" href={frontUrl} >Manage My Ads</Button>
                                            </div>
                                        </Menu.Item>
                                        :
                                        null
                                }
                            </Menu>
                        )
                    }}>
                        <span className='d-inline-block cursor-pointer' style={{ maxWidth: '200px' }} >
                            <UserAvatar showNameRight avatarClassName="flex-items-no-shrink" textClassName="white text-truncate subtitle1" size={35} data={_.get(this.props.user, ['info', 'user'])} />
                        </span>
                    </Dropdown>
                </span>
            );
        } else {
            return (
                <span className='flex-items-align-center margin-x-md white subtitle1 cursor-pointer ' onClick={() => { this.props.loginMode(true) }}>
                    <img src="/assets/CarListingIcon/login@3x-2.png" style={{ width: 20 }} className="margin-right-xs" />
                    Login
                </span>
            )
        }
    }

    _renderFooter = () => {
        return (
            <React.Fragment>
                <Layout.Footer className="footer">
                    <div className="fixed-container">
                        <div>
                            <Row>
                                <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                                    <Row>
                                        <Col xs={20} sm={20} md={20} lg={20} xl={20} style={{ color: 'white', textAlign: 'left' }}>
                                            <p style={{ marginBottom: '0px', marginTop: '12px', fontWeight: '700' }}> #1 Car Social Platform </p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={0} sm={0} md={12} lg={12} xl={12} style={{ textAlign: 'right', color: 'white' }}>
                                    {/* <span> Available on:</span> */}
                                    <span> <a href="https://play.google.com/store/apps/details?id=com.ccarmy" target="_blank"> <img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/Google Play@3x.png" /></a> </span>
                                    <span> <a href="https://apps.apple.com/my/app/ccar-my/id1526288072" target="_blank"><img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/Apple Store @3x.png" /></a></span>
                                    <span> <a href="https://appgallery.huawei.com/#/app/C102692397" target="_blank"><img style={{ padding: '5px', width: 38 }} src="/assets/Social Media/huawei.png" /></a></span>

                                    {/* <span> Find us at: </span> */}
                                    <span> <a href="https://www.facebook.com/CCARmy-101790904962298/" target="_blank"> <img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/Facebook @3x.png" /></a> </span>
                                    <span> <a href="https://www.instagram.com/ccar.my/" target="_blank"> <img style={{ padding: '5px', width: 35 }} src="/assets/Social Media/instagram.png" /></a> </span>
                                    <span> <a href="https://www.youtube.com/channel/UCxicQ1-VsdNWEdGZCqU-35g" target="_blank"> <img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/youtube.png" /> </a> </span>
                                </Col>

                                <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                    {/* <Row gutter={10} onClick={() => { self.props.router.push('/') }} style={{ cursor: 'pointer' }}>
                                        <Col className="footer-col-logo-center col-centered" xs={6} sm={2} md={2} lg={2} xl={2}>
                                            <div className="wrap-footer-title-logo">
                                            <div className="wrap-logo">
                                                <img alt="ccar" className="w-100" src="/assets/Ccar-logo.png" />
                                            </div>
                                            </div>
                                        </Col>
                                    </Row> */}
                                    <Row>
                                        <Col span={8} className="justify-flex-start" >
                                            <p style={{ fontSize: '10px', color: 'white', fontWeight: '700', marginTop: '4px', marginBottom: '0px', float: 'left' }}> #1 Car Social Platform </p>
                                        </Col>
                                        <Col span={16} style={{ fontSize: '15px' }}>
                                            <Row>
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ fontSize: '10px', color: 'white' }}>
                                                    <div style={{ float: 'right' }}>
                                                        {/* <span> Available on:</span> */}
                                                        <span> <a href="https://play.google.com/store/apps/details?id=com.ccarmy" target="_blank"> <img style={{ padding: '2px', width: 25 }} src="/assets/Social Media/Google Play@3x.png" /></a> </span>
                                                        <span> <a href="https://apps.apple.com/my/app/ccar-my/id1526288072" target="_blank"><img style={{ padding: '2px', width: 25 }} src="/assets/Social Media/Apple Store @3x.png" /></a></span>
                                                        <span> <a href="" target="_blank"><img style={{ padding: '2px', width: 23 }} src="/assets/Social Media/huawei.png" /></a></span>

                                                        {/* <span> Find us at: </span> */}
                                                        <span> <a href="https://www.facebook.com/CCARmy-101790904962298/" target="_blank"> <img style={{ padding: '2px', width: 25 }} src="/assets/Social Media/Facebook @3x.png" /></a> </span>
                                                        <span> <a href="https://www.instagram.com/ccar.my/" target="_blank"> <img style={{ padding: '2px', width: 20 }} src="/assets/Social Media/instagram.png" /></a> </span>
                                                        <span> <a href="https://www.youtube.com/channel/UCxicQ1-VsdNWEdGZCqU-35g" target="_blank"> <img style={{ padding: '2px', width: 25 }} src="/assets/Social Media/youtube.png" /> </a> </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {/* <Row style={{ textAlign: 'center', color: '#E3C57D', margin: '18px 0px' }}>
                                        <Col span={20} className="col-centered" style={{ fontSize: '15px' }}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={7} xl={7} className="col-centered" style={{ fontSize: '15px', color: 'grey' }}>
                                                    <p style={{marginBottom:'0px'}}> Available on: </p>  
                                                    <a href="https://play.google.com/store/apps/details?id=com.ccarmy" target="_blank"> <img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/Google Play@3x.png" /></a>
                                                    <a href="https://apps.apple.com/my/app/ccar-my/id1526288072" target="_blank"><img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/Apple Store @3x.png" /></a>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={7} xl={7} className="col-centered" style={{ fontSize: '15px', color: 'grey' }}>
                                                    <p style={{marginBottom:'0px'}}> Find us at: </p>
                                                    <a href="https://www.facebook.com/CCARmy-101790904962298/" target="_blank"> <img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/Facebook @3x.png" /></a>
                                                    <a href="https://www.instagram.com/ccar.my/" target="_blank"> <img style={{ padding: '5px', width: 35 }} src="/assets/Social Media/instagram.png" /></a>
                                                    <a href="https://www.youtube.com/channel/UCxicQ1-VsdNWEdGZCqU-35g" target="_blank"> <img style={{ padding: '5px', width: 40 }} src="/assets/Social Media/youtube.png" /> </a>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row> */}
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Divider orientation="left" style={{ border: 'solid 1px #FFCC32', fontWeight: 'normal', margin: '4px 0px' }} />
                                    {/* <div className="yellow-divider">
                                    <Divider/>
                                    </div> */}

                                    <Row style={{ color: '#E3C57D' }}>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ fontSize: '15px' }}>
                                            {/* <Link style={{ color: 'white' }} to="/"> */}
                                            <div className="flex-justify-start flex-items-align-center main-footer ">
                                                CCAR.MY <CopyrightCircleOutlined /> 2020
                                                </div>
                                            {/* </Link> */}
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ fontSize: '15px', textAlign: 'right' }}>
                                            {/* <Link style={{ color: 'white' }} to="/termOfUse" target="_blank"> */}
                                            <div className="flex-justify-end flex-items-align-center main-footer">
                                                Terms of Use | Privacy Policy
                                                </div>
                                            {/* </Link> */}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Layout.Footer>
            </React.Fragment>
        )
    }

    render() {
        let self = this;

        const outterMenu = [
            {
                icon: '',
                text: 'CarMarket',
                path: convertParameterToProductListUrl()
            },
            {
                icon: '',
                text: 'All-NewCar',
                path: '/newcar'
            },
            {
                icon: '',
                text: <span className='d-inline-block white background-red  padding-x-md' style={{ borderRadius: '5px' }} >
                    LIVE
    </span>,
                path: '/live'
            },
        ];


        let innerMenu = [
            {
                icon: '',
                text: 'Social News & Videos',
                path: '/socialNewsAndVideo'
            },
            {
                icon: '',
                text: 'CarFreaks',
                path: '/car-freaks'
            },
            {
                icon: '',
                text: 'Petrol Price',
                path: '/petrolprice'
            },
            {
                icon: '',
                text: 'Driving School',
                path: '/kpp'
            },
            {
                icon: '',
                text: 'About Us',
                path: '/about-us'
            },
            {
                icon: '',
                text: 'Contact Us',
                path: '/contact-us'
            },

        ];

        if (currentEnv !== 'prod') {
            let insurances = [
                {
                    icon: '',
                    text: 'Road Tax & Insurance',
                    path: '/roadtax-insurance'
                },
                {
                    icon: '',
                    text: 'Extended Warranty',
                    path: '/extended-warranty'
                },
                {
                    icon: '',
                    text: 'Latest Car Plate No.',
                    path: '/latest-car-plate-no'
                },
            ]
            innerMenu = innerMenu.concat(insurances)
        }

        let profileMenu = [
            {
                icon: <span className='flex-items-align-center flex-justify-center avatar background-grey-darken-3' style={{ width: '20px', height: '20px' }} >
                    <UserOutlined style={{ fontSize: '12px', color: 'white' }} />
                </span>,
                text: 'Profile',
                path: `/profile/${_.get(this.props.user, ['info', 'user', '_id'])}`
            },
            // {
            //     icon: <span className='flex-items-align-center flex-justify-center' style={{ width: '20px', height: '20px' }} >
            //         <Badge dot><Icon type="message" theme="filled" style={{ fontSize: '17px' }} /></Badge>
            //     </span>,
            //     text: 'Notification',
            //     path: '/kpp'
            // },
            {
                icon: (<span className='d-inline-block relative-wrapper' style={{ width: '20px', height: '20px' }} >
                    <img src='/logout icon.svg' className='fill-parent absolute-center'></img>
                </span>),
                text: 'Log out',
                path: '/logout'
            },
        ];

        return (
            <Layout>
                <Helmet>
                    <meta charSet="utf-8" />
                    {/* <!-- Primary Meta Tags --> */}
                    <title>CCAR.MY | #1 Car Social Platform</title>
                    <link rel="canonical" href="https://ccar.my" />
                    <meta name="title" content="CCAR.MY || #1 Car Social Platform" />
                    <meta name="description" content="Search for  new & used cars ! Find cars for sale, car prices, car discuss, car news & more at ccar.my " />

                    {/* <!-- Open Graph / Facebook --> */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://ccar.my" />
                    <meta property="og:image" itemprop="image" content="https://ccar.my/logo192.png" />
                    <meta property="og:title" content="CCAR.MY | #1 Car Social Platform" />
                    <meta property="og:description" content="Search for  new & used cars ! Find cars for sale, car prices, car discuss, car news & more at ccar.my " />

                </Helmet>

                <div className="relative-wrapper">
                    <Row style={{ position: 'sticky', top: 0, zIndex: '99', height: '61px' }}>
                        <Col xs={0} sm={0} md={0} lg={24} xl={24} >
                            <div id="menu-bar" className="topnav" style={{ backgroundColor: '#000000' }}>
                                <div className="fixed-container">
                                    <Row type="flex" align="middle" className='padding-x-md' >
                                        <Col xs={12} sm={12} md={12} lg={11} xl={12}>
                                            <div className='flex-justify-start flex-items-align-center padding-x-md topnav-child' >
                                                <span className='d-inline-block relative-wrapper margin-right-md cursor-pointer' style={{ height: '62px', width: '214px' }} onClick={(e) => { self.props.router.push('/') }}>
                                                    <img alt="ccar" className="fill-parent absolute-center" src={cnyLogo2} />
                                                </span>
                                                {
                                                    this.props.hideSearchBar ?
                                                        null
                                                        :
                                                        <span className='d-inline-block' style={{ minWidth: '300px', overflow: 'visible' }} >
                                                            <GlobalSearchBar enterSearchCarFreaks={this.props.enterSearchCarFreaks} searchTypes={this.props.searchTypes || ['productAds', 'carspec', 'dealerWithAds']} />
                                                        </span>
                                                }
                                            </div>
                                        </Col>

                                        <Col xs={12} sm={12} md={12} lg={13} xl={12}>
                                            <div className='width-100 flex-justify-end flex-items-align-center topnav-child'>
                                                {
                                                    notEmptyLength(outterMenu) ?
                                                        _.map(outterMenu, function (menu, i) {
                                                            return (
                                                                <span key={'outterMenu' + i} className='d-inline-block white subtitle1  margin-x-md cursor-pointer' onClick={(e) => { self.props.router.push(menu.path) }}>
                                                                    {menu.text}
                                                                </span>
                                                            )
                                                        })
                                                        :
                                                        null
                                                }
                                                <Dropdown placement="bottomRight" overlayClassName="padding-top-lg" overlayStyle={{ width: '250px' }} overlay={() => {
                                                    return (
                                                        <Menu >
                                                            {
                                                                _.map(innerMenu, function (menu, index) {
                                                                    return (
                                                                        <Menu.Item key={`inner-menu-${++index}`} className='padding-sm' onClick={(e) => { self.props.router.push(menu.path) }}>
                                                                            <span className='d-inline-block black headline subtitle1  cursor-pointer margin-x-sm' >
                                                                                {menu.text}
                                                                            </span>
                                                                        </Menu.Item>
                                                                    )
                                                                })
                                                            }
                                                        </Menu>
                                                    )
                                                }}>
                                                    <span className='d-inline-block margin-x-md white subtitle1  cursor-pointer relative-wrapper' >
                                                        Menu
                                    </span>

                                                </Dropdown>

                                                <div className="topnav-child">
                                                    {this._renderUser(profileMenu)}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>

                    </Row>


                    {
                        _.get(this.props, ['app', 'loading']) ?
                            <div className='background-grey-opacity-50 fill-parent absolute-center' style={{ zIndex: 1002 }}>
                                <Affix offsetTop={(this.state.window.innerHeight || 500) / 2}>
                                    <div className="flex-justify-center width-100">
                                        <img src="/loading.gif" style={{ width: 100, height: 100 }} />
                                    </div>
                                </Affix>
                            </div>
                            :
                            null
                    }

                    {/* </Content> */}
                    <div style={this.props.backgroundImage ? { minHeight: this.state.window.innerHeight || 500 - 180, ...this.state.backgroundStyle } : { minHeight: this.state.window.innerHeight || 500 - 90 }}>
                        {this.props.children}
                    </div>

                    {/* <BackTop/> */}

                    {this._renderFooter()}
                    <div className='width-100' style={{ position: '-webkit-sticky', position: 'sticky', bottom: 0, zIndex: 1002 }}>
                        {
                            this.props.footerOverLay ?
                                this.props.footerOverLay
                                :
                                null
                        }
                    </div>
                    <span className='d-inline-block' style={{ position: 'fixed', bottom: 30, left: 20, zIndex: 1002 }}  >
                        {
                            this.state.scrollY > 300 ?
                                <Affix offsetBottom={100}>
                                    <div className="wrap-scrolltoTop">
                                        <Button onClick={() => this.state.window.scrollTo(0, 0)}><CaretUpOutlined /></Button>
                                    </div>
                                </Affix>
                                :
                                null
                        }
                    </span>

                    <span className='d-inline-block' style={{ position: 'fixed', bottom: 30, right: 20, zIndex: 1002 }}  >
                        {
                            this.props.showCompareCarButton != undefined && this.props.showCompareCarButton == false && this.props.showCompareCarButton != null ?
                                null
                                :
                                <Affix offsetBottom={20} className='affix-element-show-on-modal-1'>
                                    {/* <Compare /> */}
                                </Affix>
                        }
                    </span>
                </div>
                {/* <style jsx="true" global="true">{``}</style> */}
                <LoginModal />
                {/* <RegisterModal/> */}
                <CookieConsent
                    location="bottom"
                    buttonText="Got it !"
                    cookieName="consent"
                    cookieValue={true}
                    style={{ background: "#2B373B" }}
                    buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                    expires={365}
                    onAccept={() => {
                        Cookies.set('consent', uuidv4())
                    }}
                    acceptOnScroll={true}
                >
                    By continuing to browse this website, you accept cookies which are used for several reasons such as personalizing content/ads and analyzing how this website is used.

                    </CookieConsent>
            </Layout>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loading: loading,
        loginMode: loginMode,
        registerMode: registerMode,
        logoutSuccessful: logoutSuccessful,
        updateActiveMenu: updateActiveMenu,
        quickSearchProductsList: quickSearchProductsList,

        setApplyYear: setApplyYear,
        setApplyPrice: setApplyPrice,
        setApplyMileage: setApplyMileage,
        fetchCompareNewCarLimit: fetchCompareNewCarLimit,
        fetchCompareCarLimit: fetchCompareCarLimit,

        setMenuHeight: setMenuHeight,

        clearProductFilterOptions: clearProductFilterOptions,

        setNotificationToken: setNotificationToken,
        setUser,


    }, dispatch);
}

function mapStateToProps(state) {
    return {
        app: state.app,
        user: state.user
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(withRouter((LayoutV2)));
