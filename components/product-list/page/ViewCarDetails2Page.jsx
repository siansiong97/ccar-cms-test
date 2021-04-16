import {
    DownOutlined,
    HeartOutlined,
    LeftOutlined,
    RightOutlined, UpOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Divider, Icon, Input, message, Modal, Row, Tooltip } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { bindActionCreators } from "redux";
import { ccarWebLogo400X150, flame, soldOutIcon } from '../../../icon';
import { loading, quickSearchProductsList, showContactList, updateActiveMenu } from '../../../redux/actions/app-actions';
import { updateActiveIdProductList } from '../../../redux/actions/productsList-actions';
import { calMonth, formatMoney } from '../../../functionContent';
import client from '../../../feathers';
import { setUser } from '../../../redux/actions/user-actions';
import { imageNotFoundIcon } from '../../../params/common';
import LayoutV2 from '../../general/LayoutV2';
import UserAvatar from '../../general/UserAvatar';
import AddCompareProductButton from '../../general/add-compare-product-button';
import CalculatorModal from '../../general/calculator-modal';
import Car360ViewButton from '../../general/car-360-view-button';
import LightBoxGallery from '../../general/light-box-gallery';
import { convertParameterToProductListUrl, formatNumber, getUserName, notEmptyLength } from '../../../common-function';
import SellerBusinessCard from '../../seller/SellerBusinessCard';
import WhatsAppButton from '../../general/whatapps-button';
import ContactList from '../../general/contactList';
import Wishlist from '../../general/Wishlist';
import ShareButtonDialog from '../../general/ShareButtonDialog';
import { getStateIcon } from '../../../params/stateList';
import RegisterCard from '../../general/registerCard';
import KeyCarDetails from '../KeyCarDetails';
import Link from 'next/link';
import Description from '../Description';
import { routePaths } from '../../../route';


const { TextArea } = Input;

const adverImg = "/advertisement.jpg"

const Div = (props) => {
    const childrenProps = { ...props };
    delete childrenProps.show;
    return <div {...childrenProps} />;
};

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


class ViewCarDetails2Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentImg: 0,
            productDetails: props.data || { condition: '', companys: {}, carspecsAll: {}, registrationUrl: {} },
            show: true,
            contactList: {},
            visible: false,
            submitting: false,
            value: '',
            rating: {
            },
            scrollYPosition: 0,
            dealerTotalAds: 0,
            window: {},
            soldOutModalVisible: false,
        }
    }

    componentDidMount() {

        console.log(this.state.productDetails);
        this.setState({
            window: window,
            soldOutModalVisible: _.get(this.state.productDetails, ['status']) == 'sold',
        })

    }

    UNSAFE_componentWillMount() {
        this.props.updateActiveMenu('2');
        this.setState({

            typingTimeout: setTimeout(() => {
                axios.post(`${client.io.io.uri}processCTR`,
                    {
                        params: {
                            adsId: this.state.productDetails._id,
                            source: 'web',
                        }
                    })
                let inputProductList = [{ productAdsId: this.state.productDetails._id }]
                axios.post(`${client.io.io.uri}processImpression`,
                    {
                        params: {
                            productList: inputProductList,
                            source: 'web',
                        }
                    }).then((res) => { })


            }, 3000)
        })
    }
    componentDidUpdate(prevProps, prevState) {

        // if (typeof (window) != undefined) {
        //   window.addEventListener('scroll', this.handleScroll, { passive: true });

        //   return () => {

        //     window.removeEventListener('scroll', this.handleScroll);
        //   };
        // }

        if (!_.isEqual(prevState.productDetails, this.state.productDetails)) {
            if (_.get(this.state.productDetails, ['status']) == 'sold') {
                this.setState({
                    soldOutModalVisible: true,
                })
            }
        }


    }

    onClickShow = () => {
        this.setState({
            show: !this.state.show,
        });
    }

    handleScroll = (e) => {
        this.setState({
            scrollYPosition: this.state.window.scrollY,
        })

    };

    _renderImages() {
        var imgList = this.state.productDetails.carUrl ?
            this.state.productDetails.carUrl.map((v, i) => {
                return (
                    <Row key={i}>
                        <Col span={24}>
                            <div className="dot-img" onClick={() => { this.setState({ currentImg: i }); this.onClickShow() }}>
                                {this.state.currentImg === i ?
                                    <div className="dot-img-overlay">
                                    </div> : null}
                                <img src={v.url} />
                            </div>
                        </Col>
                    </Row>
                );
            }) : '';

        return (
            <div className="wrap-dot-img" id="wrap-dot-img">
                {imgList}
            </div>
        )
    }


    dotScrollToBottom() {
        // this.onClickShow()
        // const objDiv = document.getElementById("wrap-dot-img");
        // objDiv.scrollTop = objDiv.scrollTop + 30;
        let plusOne = this.state.currentImg + 1
        if (plusOne < this.state.productDetails.carUrl.length) {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = objDiv.scrollTop + 30;
            this.setState({ currentImg: plusOne })
        } else {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = 0;
            this.setState({ currentImg: 0 })
        }
    }

    dotScrollToTop() {
        // this.onClickShow()
        // const objDiv = document.getElementById("wrap-dot-img");
        // objDiv.scrollTop = objDiv.scrollTop - 30;
        let minusOne = this.state.currentImg - 1
        if (minusOne >= 0) {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = objDiv.scrollTop - 30;
            this.setState({ currentImg: this.state.currentImg - 1 })
        } else {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = objDiv.scrollHeight;
            this.setState({ currentImg: this.state.productDetails.carUrl.length - 1 })
        }
    }

    scrollToLeftBtn() {
        let minusOne = this.state.currentImg - 1
        if (minusOne >= 0) {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = objDiv.scrollTop - 104;
            this.setState({ currentImg: this.state.currentImg - 1 })
        } else {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = objDiv.scrollHeight;
            this.setState({ currentImg: this.state.productDetails.carUrl.length - 1 })
        }
    }

    scrollToRightBtn() {
        let plusOne = this.state.currentImg + 1
        if (plusOne < this.state.productDetails.carUrl.length) {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = objDiv.scrollTop + 104;
            this.setState({ currentImg: plusOne })
        } else {
            this.onClickShow()
            const objDiv = document.getElementById("wrap-dot-img");
            objDiv.scrollTop = 0;
            this.setState({ currentImg: 0 })
        }
    }

    breadcrumbSearchCondition = (v) => {

        let path = convertParameterToProductListUrl({ condition: v });
        this.props.router.push(path);

    }

    breadcrumbSearchMake = (v) => {

        let path = convertParameterToProductListUrl({ make: v.toLowerCase() });
        this.props.router.push(path);
    }

    breadcrumbSearchModel = (v) => {

        let path = convertParameterToProductListUrl({ model: v.toLowerCase() });
        this.props.router.push(path);
    }

    _renderCondition = (v) => {
        if (v.condition === 'new') {
            return (
                <span className="avatar wrap-condition-new capitalize white flex-items-align-center flex-justify-center" style={{ width : 50, height : 50 }}>
                    {v.condition}
                </span>
            )
        } else if (v.condition === 'used') {
            return (
                <span className="avatar wrap-condition-used capitalize white flex-items-align-center flex-justify-center" style={{ width : 50, height : 50 }}>
                    {v.condition}
                </span>
            )
        } else if (v.condition === 'recon') {
            return (
                <span className="avatar wrap-condition-recon capitalize white flex-items-align-center flex-justify-center" style={{ width : 50, height : 50 }}>
                    {v.condition}
                </span>
            )
        } else {
            return (
                <span className="avatar wrap-condition-default capitalize white flex-items-align-center flex-justify-center" style={{ width : 50, height : 50 }}>
                    {v.condition}
                </span>
            )
        }
    }

    _renderPrice = () => {

        let v = this.state.productDetails

        if (_.isEmpty(v) === true) { return }

        if (_.isEmpty(v.carspecsAll) === true &&
            _.isEmpty(v.companys) === true &&
            _.isEmpty(v.condition) === true &&
            _.isEmpty(v.registrationUrl) === true
        ) { return }


        let normalPrice =
            (<div className="wrap-product-ads-price">
                <Row><Col xs={14} sm={14} md={16} lg={16} xl={16}><span style={{ color: '#20abcc' }} className='installmentPrice'>RM {formatMoney((calMonth(v.price)).toString())}/month</span></Col></Row>
                <h4 style={{ marginLeft: '10px' }}>RM {formatMoney((v.price).toString())}</h4>
            </div>)

        function renderShowPrice(price, discountedPrice) {

            const pattern = /\.(\d*?)0+(\D*)$/gm;
            return (
                <div className="wrap-product-ads-price">
                    <span style={{ color: '#000000' }} className='gridMoneyText'>RM {formatMoney((price).toString())}</span>
                    <span className="wrap-condition wrap-product-ads-discount-spicydeal" >{(((100 * (price - discountedPrice) / price) * -1).toFixed(1).toString()).replace(pattern, '') + '%'}</span>
                    <h4 style={{ marginLeft: '10px', color: '#d62828' }}>RM {formatMoney((discountedPrice).toString())}</h4>
                    <div className="wrap-product-ads-price">
                        <Row><Col xs={14} sm={14} md={16} lg={16} xl={16}><span style={{ color: '#20abcc' }} className='installmentPrice'>RM {formatMoney((calMonth(discountedPrice)).toString())}/month</span></Col></Row>
                    </div>
                </div>
            )
        }

        function renderCountdown(endDate) {

            const duration = moment.duration(moment(endDate).diff(moment()));
            const days = Math.floor(duration.asDays());
            const daysFormatted = days ? `${days}` : 0;
            const hours = duration.hours();
            const minutes = duration.minutes();
            const hoursFormatted = hours ? `${hours}` : 0;
            const minutesFormatted = minutes ? `${minutes}` : 0;

            const formatCountdown = (value, fixedPoint) => {
                if (value != null) {
                    if (isNaN(parseFloat(value))) {
                        return value;
                    } else {
                        value = value.toString().split('.');
                        if (value[0]) {
                            if (value[0].length > fixedPoint) {
                                value[0] = value[0].slice(value[0].length - fixedPoint);
                            }

                            if (value[0].length < fixedPoint) {
                                _.forEach(_.range(fixedPoint - value[0].length), function () {
                                    value[0] = '0' + value[0];
                                })
                            }
                            return value[0];
                        }
                        return value;
                    }
                } else {
                    return value;
                }
            }


            return (
                <div className="wrap-product-ads-countdown-spicydeal">
                    <span className='gridAddonMainText' style={{ marginLeft: '10px', color: '#000000' }} ><span>SuperDeal Ends in</span></span>
                    <Row>
                        <Col xs={14} sm={14} md={16} lg={16} xl={16}>
                            <p className='gridAddonDayHourSubText'>

                                <span style={{ color: '#000000' }} className='gridAddonDayHourText'>D </span>
                                <span className='gridAddonDayHour'>{formatCountdown(daysFormatted, 2)}</span>
                                <span style={{ color: '#000000' }} className='gridAddonDayHourText'> H </span>
                                <span className='gridAddonDayHour'>{formatCountdown(hoursFormatted, 2)}</span>
                                <span style={{ color: '#000000' }} className='gridAddonDayHourText'> M </span>
                                <span className='gridAddonDayHour'>{formatCountdown(minutesFormatted, 2)}</span>
                            </p>
                        </Col>
                    </Row>
                </div>
            )

        }

        if (v.priority === 'addonKingadType') { return renderShowPrice(v.price, v.addonKingadType.discountedPrice) }
        else if (v.priority === 'addonKingadType2') { return renderCountdown(v.addonKingadType2.endDate) }
        else if (v.priority === 'addonSpicydeal') {
            if (v.addonSpicydeal.showPrice === 'show') { return renderShowPrice(v.price, v.addonSpicydeal.discountedPrice) }
            if (v.addonSpicydeal.showPrice === 'hide') { return renderCountdown(v.addonSpicydeal.endDate) }
        }
        else { return (normalPrice) }
    }

    _renderPriceAffix = () => {
        const currentDateTime = moment().format();
        const addon = _.find(this.state.productDetails.addon, { 'addonType': 'spicydeal' });

        if (addon) {
            if (currentDateTime < addon.endDate) {
                if (addon.addonType === 'spicydeal' && addon.showPrice === 'show') {
                    return (
                        <div className="wrap-viewProducts-price-affix">
                            <label style={{ color: 'rgb(190,150,46)' }}>RM {formatMoney((addon.discountedPrice ? addon.discountedPrice : 0).toString())}</label>
                            <p>RM {formatMoney((calMonth(addon.discountedPrice ? addon.discountedPrice : 0)).toString())}/month</p>
                        </div>
                    )
                } else if (addon.addonType === 'spicydeal' && addon.showPrice === 'hide') {
                    return (
                        <div className="wrap-viewProducts-price-affix">

                        </div>
                    )
                } else {
                    return (
                        <div className="wrap-viewProducts-price-affix">
                            <label style={{ color: 'rgb(190,150,46)' }}>RM {formatMoney((this.state.productDetails.price ? this.state.productDetails.price : 0).toString())}</label>
                            <p>RM {formatMoney((calMonth(this.state.productDetails.price ? this.state.productDetails.price : 0)).toString())}/month</p>
                        </div>
                    )
                }
            } else {
                return (
                    <div className="wrap-viewProducts-price-affix">
                        <label style={{ color: 'rgb(190,150,46)' }}>RM {formatMoney((this.state.productDetails.price ? this.state.productDetails.price : 0).toString())}</label>
                        <p>RM {formatMoney((calMonth(this.state.productDetails.price ? this.state.productDetails.price : 0)).toString())}/month</p>
                    </div>
                )
            }
        } else {
            return (
                <div className="wrap-viewProducts-price-affix">
                    <label style={{ color: 'rgb(190,150,46)' }}>RM {formatMoney((this.state.productDetails.price ? this.state.productDetails.price : 0).toString())}</label>
                    <p>RM {formatMoney((calMonth(this.state.productDetails.price ? this.state.productDetails.price : 0)).toString())}/month</p>
                </div>
            )
        }
    }

    _renderDealerBar = () => {
        return (
            <React.Fragment>
                <Desktop>
                    <div className="background-white broder-top-grey thin-border car-for-sale">
                        {this.state.scrollYPosition > (this.state.window.innerHeight || 500) * 0.2 ?
                            <Row className="padding-top-sm fixed-container" style={{ backgroundColor: '#ffffff' }}>
                                <Col xs={12} sm={12} md={18} lg={18} xl={18} style={{ paddingRight: '20px' }}>
                                    <Row>
                                        <Col xs={12} sm={12} md={18} lg={18} xl={18}>
                                            <div className="text-truncate-twoline">
                                                <h1 style={{ marginBottom: '0px', fontWeight: '700', fontSize: '18px' }}>
                                                    {this.state.productDetails.title}
                                                    {/* {this.state.productDetails.carspecsAll ?
                                  this.state.productDetails.carspecsAll.year + ' ' +
                                  this.state.productDetails.carspecsAll.make + ' ' +
                                  this.state.productDetails.carspecsAll.model + ' ' +
                                  this.state.productDetails.carspecsAll['engine-capacity'] +
                                ' (' + this.state.productDetails.carspecsAll.variant + ') '
                                : ''} */}
                                                </h1>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} >
                                            {this._renderPriceAffix()}
                                        </Col>
                                        <Col xs={12} sm={12} md={24} lg={24} xl={24}>
                                            <span style={{ marginBottom: '0px', marginRight: '5px' }}> <img src="/assets/profile/address-work.png" alt="address" className="fill-parent" style={{ width: '2%', marginTop: '-4px' }}></img> {!this.state.productDetails.companys || !this.state.productDetails.companys.name ? null : this.state.productDetails.companys.name} </span>
                                            <span style={{ marginBottom: '0px' }}> <img src="/assets/carDetails/Location@3x.png" alt="location" className="fill-parent" style={{ width: '2%' }}></img> {!this.state.productDetails.companys || !this.state.productDetails.companys.area ? null : this.state.productDetails.companys.area} </span>
                                            {/* <span style={{marginBottom:'0px'}}> <img src="/assets/carDetails/Location@3x.png" className="fill-parent" style={{width:'2%'}}></img> {!this.state.productDetails.companys || !this.state.productDetails.companys.state ? null : this.state.productDetails.companys.state} </span> */}
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col xs={12} sm={12} md={12} lg={10} xl={12}>
                                            <Row style={{ marginTop: '9px' }}>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px 5px' }}>
                                                    <WhatsAppButton readOnly={_.get(this.state, 'productDetails.status') != 'approved'} mobileNumber={this.state.productDetails} />
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px 5px' }}>
                                                    <ContactList companys={this.state.productDetails.companys} contactPerson={notEmptyLength(this.state.productDetails.createdBy) ? this.state.productDetails.createdBy : null} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={14} xl={12}>
                                            <div className="flex-justify-end flex-items-align-center flex-wrap" style={{ marginTop: '5px' }}>
                                                <span className="d-inline-block">
                                                    <Wishlist readOnly={_.get(this.state, 'productDetails.status') != 'approved'} type="product" productId={this.state.productDetails._id} saverId={this.props.user.authenticated ? this.props.user.info.user._id : null}
                                                        savedButton={
                                                            () => <Button className="padding-x-sm margin-xs" style={{ borderColor: '#F9A825' }}><Icon type="heart" theme="filled" style={{ color: '#F9A825' }} /> <span style={{ color: '#F9A825' }}>Saved</span></Button>
                                                        }
                                                        saveButton={
                                                            () => <Button className="padding-x-sm margin-xs" ><HeartOutlined />Save</Button>
                                                        }
                                                        handleError={(e) => { message.error(e.message) }}
                                                        handleSuccess={(e) => { message.success(e.type === 'remove' ? 'Removed from wishlist' : 'Saved to wishlist') }}
                                                    />
                                                </span>
                                                <span className="d-inline-block" style={{ marginRight: '5px' }}>
                                                    <ShareButtonDialog readOnly={_.get(this.state, 'productDetails.status') != 'approved'} title={`CCAR.my | ${this.state.productDetails.title}`} />
                                                </span>
                                                <span className="d-inline-block margin-xs">
                                                    <CalculatorModal data={{ price: this.state.productDetails.searchPrice, downpayment: this.state.productDetails.searchPrice * 0.1, loanPeriod: 9, interestRate: 3 }}
                                                        button={() => {
                                                            return (
                                                                <Tooltip placement="top" title={`Calculate my monthly payment`}>
                                                                    <Button
                                                                        type="normal"
                                                                    >
                                                                        {/* <WhatsAppOutlined style={{ fontSize: 20, color: 'white' }} /> */}
                                                                        <img src="/assets/profile/icon-list/calc.png" style={{ width: 25, height: 25 }} alt="Car Loan Calculator Icon" />
                                                                    </Button>
                                                                </Tooltip>
                                                            )
                                                        }} />
                                                </span>
                                                <span className="d-inline-block" style={{ width: '50px' }}>
                                                    <RegisterCard key='register' button={
                                                        [<Tooltip key='tooltipsregister' title="Registration Card"><Button type="normal" className={`w-100 ads-purchase-button ${_.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ padding: 0, background: _.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'rgb(209 ,110, 132)' : 'rgb(237, 236, 234)', borderColor: _.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'rgb(209 ,110, 132)' : 'rgb(237, 236, 234)' }}><img src="/assets/CarListingIconMobile/registration-card.png" alt=" Registration Card Icon" /></Button></Tooltip>]
                                                    } registrationUrl={this.state.productDetails.registrationUrl ? this.state.productDetails.registrationUrl : []} />
                                                </span>
                                                <span className="d-inline-block">
                                                    <Car360ViewButton id={this.state.productDetails.xmlUrl ? this.state.productDetails._id : null} >
                                                        <Button type="normal" className={`padding-x-sm margin-xs ${this.state.productDetails.xmlUrl ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ background: this.state.productDetails.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', borderColor: this.state.productDetails.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', minWidth: '50px' }}><img src="/assets/profile/icon-list/Ccar-360_1.gif" style={{ width: '25px', height: '25px' }} alt="Car 360 View Icon" /></Button>
                                                    </Car360ViewButton>
                                                </span>
                                                <span className="d-inline-block">
                                                    <AddCompareProductButton readOnly={_.get(this.state, 'productDetails.status') != 'approved'} data={this.state.productDetails} saveButton={() => {
                                                        return (
                                                            <Button type="normal" className="padding-x-sm margin-xs ads-purchase-compare-btn" style={{ minWidth: '50px' }}><img src="/assets/CarListingIconMobile/car-compare.png" style={{ width: '25px', height: '25px' }} alt="compare" /></Button>
                                                        );
                                                    }}
                                                        savedButton={() => {
                                                            return (
                                                                <Button type="normal" className="padding-x-sm margin-xs ads-purchase-button" style={{ minWidth: '50px', background: 'rgb(89, 54, 26)' }}><img src="/assets/CarListingIconMobile/car-compare.png" style={{ width: '25px', height: '25px' }} alt="compare" /></Button>
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="margin-y-md" style={{ marginTop: '-2px' }}>
                                    <div className="thin-border" style={{ marginTop: '5px' }}>
                                        <a href={`${!this.state.productDetails || !this.state.productDetails.createdBy || !this.state.productDetails.createdBy.userurlId ? '#' : `/profile/${this.state.productDetails.createdBy.userurlId}`}`} className="grey-darken-2 font-weight-normal">
                                            <Row>
                                                <Col span={12}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'left', marginLeft: '5px', marginBottom: '-5px', marginTop: '5px' }} alt="artboard"></img>
                                                </Col>
                                                <Col span={12} style={{ float: 'right' }}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'right', marginRight: '5px', marginBottom: '-5px', marginTop: '5px' }} alt="artboard"></img>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col span={6} >
                                                    <div className='fill-parent flex-justify-center flex-items-align-center' style={{ paddingLeft: '35px' }}>
                                                        <UserAvatar redirectProfile data={_.get(this.state.productDetails, ['createdBy'])} size={50} />
                                                    </div>
                                                </Col>
                                                <Col span={18} style={{ textAlign: 'left', paddingLeft: '15px', paddingTop: '3px' }}>
                                                    <p style={{ marginBottom: '0px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}> <img src="/assets/profile/account-info-active.png" alt="account active" className="fill-parent" style={{ width: '10%', marginTop: '-1px' }}></img> {!this.state.productDetails.createdBy || !this.state.productDetails.createdBy.namePrefix ? null : this.state.productDetails.createdBy.namePrefix} {!this.state.productDetails.createdBy || !this.state.productDetails.createdBy.firstName ? null : this.state.productDetails.createdBy.firstName} {!this.state.productDetails.createdBy || !this.state.productDetails.createdBy.lastName ? null : this.state.productDetails.createdBy.lastName}</p>
                                                    <h3 style={{ paddingLeft: '4px' }}> Cars On Sale ({formatNumber(_.get(this.state.productDetails, ['createdBy', 'totalAdsAvailable']), 'auto', true, 0, 0)}) </h3>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={12}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'left', marginLeft: '5px', marginBottom: '5px', marginTop: '-5px' }} alt="artboard"></img>
                                                </Col>
                                                <Col span={12} style={{ float: 'right' }}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'right', marginRight: '5px', marginBottom: '5px', marginTop: '-5px' }} alt="artboard"></img>
                                                </Col>
                                            </Row>
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            :
                            null
                        }
                    </div>
                </Desktop>

                <Tablet>
                    <div className="background-white broder-top-grey thin-border car-for-sale">
                        {this.state.scrollYPosition > 10 ?
                            <Row className="padding-top-sm " style={{ backgroundColor: '#ffffff', paddingLeft: '10px', paddingRight: '10px' }}>
                                <Col xs={12} sm={12} md={18} lg={18} xl={18} style={{ paddingRight: '20px' }}>
                                    <Row>
                                        <Col xs={12} sm={12} md={18} lg={18} xl={18}>
                                            <div className="text-truncate-twoline">
                                                <h1 style={{ marginBottom: '0px', fontWeight: '700', fontSize: '18px' }}>
                                                    {this.state.productDetails.title}
                                                    {/* {this.state.productDetails.carspecsAll ?
                                  this.state.productDetails.carspecsAll.year + ' ' +
                                  this.state.productDetails.carspecsAll.make + ' ' +
                                  this.state.productDetails.carspecsAll.model + ' ' +
                                  this.state.productDetails.carspecsAll['engine-capacity'] +
                                ' (' + this.state.productDetails.carspecsAll.variant + ') '
                                : ''} */}
                                                </h1>
                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} >
                                            {this._renderPriceAffix()}
                                        </Col>
                                        <Col xs={12} sm={12} md={24} lg={24} xl={24}>
                                            <span style={{ marginBottom: '0px', marginRight: '5px' }}> <img src="/assets/profile/address-work.png" alt="address" className="fill-parent" style={{ width: '2%', marginTop: '-4px' }}></img> {!this.state.productDetails.companys || !this.state.productDetails.companys.name ? null : this.state.productDetails.companys.name} </span>
                                            <span style={{ marginBottom: '0px' }}> <img src="/assets/carDetails/Location@3x.png" alt="location" className="fill-parent" style={{ width: '2%' }}></img> {!this.state.productDetails.companys || !this.state.productDetails.companys.area ? null : this.state.productDetails.companys.area} </span>
                                            {/* <span style={{marginBottom:'0px'}}> <img src="/assets/carDetails/Location@3x.png" className="fill-parent" style={{width:'2%'}}></img> {!this.state.productDetails.companys || !this.state.productDetails.companys.state ? null : this.state.productDetails.companys.state} </span> */}
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col xs={12} sm={12} md={6} lg={12} xl={12}>
                                            <Row style={{ marginTop: '9px' }}>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px 5px' }}>
                                                    <WhatsAppButton readOnly={_.get(this.state, 'productDetails.status') != 'approved'} mobileNumber={this.state.productDetails} />
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px 5px' }}>
                                                    <ContactList companys={this.state.productDetails.companys} contactPerson={notEmptyLength(this.state.productDetails.createdBy) ? this.state.productDetails.createdBy : null} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={18}>
                                            <div className="flex-justify-end flex-items-align-center flex-wrap" style={{ marginTop: '5px' }}>
                                                <span className="d-inline-block">
                                                    <Wishlist readOnly={_.get(this.state, 'productDetails.status') != 'approved'} type="product" productId={this.state.productDetails._id} saverId={this.props.user.authenticated ? this.props.user.info.user._id : null}
                                                        savedButton={
                                                            () => <Button className="padding-x-sm margin-xs" style={{ borderColor: '#F9A825' }}><Icon type="heart" theme="filled" style={{ color: '#F9A825' }} /> <span style={{ color: '#F9A825' }}>Saved</span></Button>
                                                        }
                                                        saveButton={
                                                            () => <Button className="padding-x-sm margin-xs" ><HeartOutlined />Save</Button>
                                                        }
                                                        handleError={(e) => { message.error(e.message) }}
                                                        handleSuccess={(e) => { message.success(e.type === 'remove' ? 'Removed from wishlist' : 'Saved to wishlist') }}
                                                    />
                                                </span>
                                                <span className="d-inline-block" style={{ marginRight: '5px' }}>
                                                    <ShareButtonDialog readOnly={_.get(this.state, 'productDetails.status') != 'approved'} title={`CCAR.my | ${this.state.productDetails.title}`} />
                                                </span>
                                                <span className="d-inline-block margin-xs">
                                                    <CalculatorModal data={{ price: this.state.productDetails.searchPrice, downpayment: this.state.productDetails.searchPrice * 0.1, loanPeriod: 9, interestRate: 3 }}
                                                        button={() => {
                                                            return (
                                                                <Tooltip placement="top" title={`Calculate my monthly payment`}>
                                                                    <Button
                                                                        type="normal"
                                                                    >
                                                                        {/* <WhatsAppOutlined style={{ fontSize: 20, color: 'white' }} /> */}
                                                                        <img src="/assets/profile/icon-list/calc.png" style={{ width: 25, height: 25 }} alt="Car Loan Calculator" />
                                                                    </Button>
                                                                </Tooltip>
                                                            )
                                                        }} />
                                                </span>
                                                <span className="d-inline-block" style={{ width: '50px' }}>
                                                    <RegisterCard key='register' button={
                                                        [<Tooltip key='tooltipsregister' title="Registration Card"><Button type="normal" className={`w-100 ads-purchase-button ${_.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ padding: 0, background: _.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'rgb(209 ,110, 132)' : 'rgb(237, 236, 234)', borderColor: _.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'rgb(209 ,110, 132)' : 'rgb(237, 236, 234)' }}><img src="/assets/CarListingIconMobile/registration-card.png" alt="Registration Card Icon" /></Button></Tooltip>]
                                                    } registrationUrl={this.state.productDetails.registrationUrl ? this.state.productDetails.registrationUrl : []} />
                                                </span>
                                                <span className="d-inline-block">
                                                    <Car360ViewButton id={this.state.productDetails.xmlUrl ? this.state.productDetails._id : null} >
                                                        <Button type="normal" className={`padding-x-sm margin-xs ${this.state.productDetails.xmlUrl ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ background: this.state.productDetails.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', borderColor: this.state.productDetails.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', minWidth: '50px' }}><img src="/assets/profile/icon-list/Ccar-360_1.gif" style={{ width: '25px', height: '25px' }} alt="Car 360 View Icon" /></Button>
                                                    </Car360ViewButton>
                                                </span>
                                                <span className="d-inline-block">
                                                    <AddCompareProductButton readOnly={_.get(this.state, 'productDetails.status') != 'approved'} data={this.state.productDetails} saveButton={() => {
                                                        return (
                                                            <Button type="normal" className="padding-x-sm margin-xs ads-purchase-compare-btn" style={{ minWidth: '50px' }}><img src="/assets/CarListingIconMobile/car-compare.png" style={{ width: '25px', height: '25px' }} alt="compare" /></Button>
                                                        );
                                                    }}
                                                        savedButton={() => {
                                                            return (
                                                                <Button type="normal" className="padding-x-sm margin-xs ads-purchase-button" style={{ minWidth: '50px', background: 'rgb(89, 54, 26)' }}><img src="/assets/CarListingIconMobile/car-compare.png" style={{ width: '25px', height: '25px' }} alt="compare" /></Button>
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="margin-y-md" style={{ marginTop: '-2px' }}>
                                    <div className="thin-border" style={{ marginTop: '5px' }}>
                                        <a href={`${!this.state.productDetails || !this.state.productDetails.createdBy || !this.state.productDetails.createdBy.userurlId ? '#' : `/profile/${this.state.productDetails.createdBy.userurlId}`}`} className="grey-darken-2 font-weight-normal">
                                            <Row>
                                                <Col span={12}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'left', marginLeft: '5px', marginBottom: '-5px', marginTop: '5px' }} alt="artboard"></img>
                                                </Col>
                                                <Col span={12} style={{ float: 'right' }}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'right', marginRight: '5px', marginBottom: '-5px', marginTop: '5px' }} alt="artboard"></img>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={6} sm={6} md={0} lg={6} xl={6} >
                                                    <div className='fill-parent flex-justify-center flex-items-align-center' style={{ paddingLeft: '35px' }}>
                                                        <UserAvatar redirectProfile data={_.get(this.state.productDetails, ['createdBy'])} size={50} />
                                                    </div>
                                                </Col>
                                                <Col span={18} style={{ textAlign: 'left', paddingLeft: '15px', paddingTop: '3px' }}>
                                                    <p style={{ marginBottom: '0px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}> <img src="/assets/profile/account-info-active.png" className="fill-parent" style={{ width: '10%', marginTop: '-1px' }} alt="Account Icon" ></img> {!this.state.productDetails.createdBy || !this.state.productDetails.createdBy.namePrefix ? null : this.state.productDetails.createdBy.namePrefix} {!this.state.productDetails.createdBy || !this.state.productDetails.createdBy.firstName ? null : this.state.productDetails.createdBy.firstName} {!this.state.productDetails.createdBy || !this.state.productDetails.createdBy.lastName ? null : this.state.productDetails.createdBy.lastName}</p>
                                                    <h3 style={{ paddingLeft: '4px' }}> Cars On Sale ({formatNumber(_.get(this.state.productDetails, ['createdBy', 'totalAdsAvailable']), 'auto', true, 0, 0)}) </h3>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={12}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'left', marginLeft: '5px', marginBottom: '5px', marginTop: '-5px' }} alt="artboard"></img>
                                                </Col>
                                                <Col span={12} style={{ float: 'right' }}>
                                                    <img src="/Artboard.png" style={{ width: '10%', float: 'right', marginRight: '5px', marginBottom: '5px', marginTop: '-5px' }} alt="artboard"></img>
                                                </Col>
                                            </Row>
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            :
                            null
                        }
                    </div>
                </Tablet>
            </React.Fragment>
        )
    }

    render() {


        const { comments, submitting, value } = this.state;
        let stateName = getStateIcon(_.get(this.state.productDetails, ['companys', 'state']) || imageNotFoundIcon)
        let userstate = _.get(this.state.productDetails, ['createdBy', 'userstate']) || ''
        if (_.isEmpty(userstate) === false) { stateName = getStateIcon(userstate) || imageNotFoundIcon }

        return (
            <LayoutV2
                footerOverLay={this._renderDealerBar()}
            >


                <div className="section">
                    <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link shallow={false} href="/">
                                    <a>
                                        Home
                    </a>
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className='cursor-pointer' onClick={() => this.breadcrumbSearchCondition(this.state.productDetails.condition)}>Products List</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className='cursor-pointer' onClick={() => this.breadcrumbSearchCondition(this.state.productDetails.condition)} className=" capitalize" >{this.state.productDetails.condition}</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className='cursor-pointer' onClick={() => this.breadcrumbSearchMake(this.state.productDetails.carspecsAll.make)}>{this.state.productDetails.carspecsAll.make}</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span className='cursor-pointer' onClick={() => this.breadcrumbSearchModel(this.state.productDetails.carspecsAll.model)}>{this.state.productDetails.carspecsAll.model}</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <div className="width-100 relative-wrapper thin-border round-border margin-y-md" style={{ height: 150, }}>
                            <img src={_.get(this.state.productDetails , 'companys.bannerUrl[0]') || ccarWebLogo400X150} className="absolute-center-img-no-stretch" />
                        </div>

                        <Row gutter={[0, 0]} className="margin-top-sm">
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={18} xl={18} >

                                <Row gutter={[20, 10]}>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Row gutter={[20, 10]}>
                                            <Col className="gutter-row" xs={24} sm={24} md={20} lg={20} xl={20}>
                                                <div className="relative-wrapper width-100" style={{ height: '34em' }}>

                                                    <LightBoxGallery
                                                        images={_.isArray(_.get(this.state.productDetails, ['carUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['carUrl'])) ? _.map(_.get(this.state.productDetails, ['carUrl']) || [], 'url') : []}
                                                        onChange={(currentIndex) => {
                                                            this.setState({
                                                                currentImg: currentIndex,
                                                            })
                                                        }}
                                                        currentIndex={this.state.currentImg}
                                                    >

                                                        {
                                                            (data, setCurrentIndex, setVisible) => {
                                                                return (
                                                                    <div show={this.state.show} className="code-box-shape" >
                                                                        <img className="fade-in cursor-pointer absolute-center-img-no-stretch " onClick={() => { setVisible(true) }} id="my-element" src={_.get(data, ['images', data.currentIndex])} alt={`${_.get(this.state.productDetails, 'carspec.make') || ''} ${_.get(this.state.productDetails, 'carspec.model') || ''} Image ${data.currentIndex + 1}`} />
                                                                    </div>
                                                                )
                                                            }
                                                        }
                                                    </LightBoxGallery>
                                                    <div className="width-100 padding-sm background-black-opacity-70-gradient-bottom padding-bottom-xl" style={{ position: 'absolute', top: 0, left: 0 }}>
                                                        <div className="flex-justify-space-between flex-items-align-start ">
                                                            <span className='d-inline-block width-70' >
                                                                <div className="width-100 text-overflow-break h6 white font-weight-normal">
                                                                    {this.state.productDetails.title}
                                                                </div>
                                                                <div className="font-weight-thin subtitle1 white">
                                                                    Posted on {moment(this.state.productDetails.createdAt).format("Do MMM YYYY")}
                                                                </div>
                                                            </span>
                                                            <span className=' flex-items-align-center flex-justify-end width-30' >
                                                                <Wishlist readOnly={_.get(this.state, 'productDetails.status') != 'approved'} t type="product" productId={this.state.productDetails._id} saverId={this.props.user.authenticated ? this.props.user.info.user._id : null}
                                                                    savedButton={
                                                                        () => <Button className="padding-x-sm margin-xs" style={{ borderColor: '#F9A825' }}><Icon type="heart" theme="filled" style={{ color: '#F9A825' }} /> <span style={{ color: '#F9A825' }}>Saved</span></Button>
                                                                    }
                                                                    saveButton={
                                                                        () => <Button className="padding-x-sm margin-xs" ><HeartOutlined />Save</Button>
                                                                    }
                                                                    handleError={(e) => { message.error(e.message) }}
                                                                    handleSuccess={(e) => { message.success(e.type === 'remove' ? 'Removed from wishlist' : 'Saved to wishlist') }}
                                                                />
                                                                <ShareButtonDialog readOnly={_.get(this.state, 'productDetails.status') != 'approved'} title={`CCAR.my | ${this.state.productDetails.title}`} />
                                                            </span>
                                                        </div>
                                                        <div className="flex-justify-start flex-items-align-center margin-y-xs">
                                                            <img
                                                                src={stateName}
                                                                style={{ width: 50, height: 50 }}
                                                                className="avatar margin-right-md"
                                                                alt={`${_.get(this.state.productDetails, ['companys', 'state']) || 'State Icon'}`} />
                                                            <span className="d-inline-block" >
                                                                {this._renderCondition(this.state.productDetails)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* <img
                                                        src={stateName}
                                                        style={{ width: 70, height: '30px', position: 'absolute', top: 0, right: 0 }}
                                                        alt={`${_.get(this.state.productDetails, ['companys', 'state']) || 'State Icon'}`} />
                                                    <span className="d-inline-block width-20" style={{ position: 'absolute', top: 0, left: 0 }} >
                                                        {this._renderCondition(this.state.productDetails)}
                                                    </span> */}
                                                    <button className="left-btn-viewProduct" onClick={() => this.scrollToLeftBtn()}><LeftOutlined /></button>
                                                    <button className="right-btn-viewProduct" onClick={() => this.scrollToRightBtn()}><RightOutlined /></button>

                                                    <img src="/assets/Ccar-logo.png" style={{ width: this.state.window.innerHeight * 0.1, height: this.state.window.innerHeight * 0.1, position: 'absolute', bottom: 10, right: 10 }} alt="CCAR Logo" />

                                                </div>
                                            </Col>
                                            <Col className="gutter-row" xs={0} sm={0} md={4} lg={4} xl={4}>
                                                <div className="wrap-dot">
                                                    <button onClick={() => { this.dotScrollToTop() }} style={{ top: 0 }}><UpOutlined /></button>
                                                    {this._renderImages()}
                                                    <button onClick={() => { this.dotScrollToBottom() }} style={{ bottom: 0 }}><DownOutlined /></button>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row gutter={[10, 10]}>
                                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <Description readOnly={_.get(this.state, 'productDetails.status') != 'approved'} productDetails={this.state.productDetails} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>

                            <Col className="gutter-row" xs={24} sm={24} md={0} lg={6} xl={6} style={{ paddingLeft: '10px', paddingRight: '10px' }} >
                                <div className="fill-parent" >

                                    <div className="background-white padding-sm thin-border">
                                        <Row>
                                            <Col span={20} >
                                                {this._renderPrice()}
                                            </Col>
                                            <Col span={4}>
                                                <CalculatorModal data={{ price: this.state.productDetails.searchPrice, downpayment: this.state.productDetails.searchPrice * 0.1, loanPeriod: 9, interestRate: 3 }} />
                                            </Col>
                                        </Row>
                                        <Row className="padding-top-sm">
                                            <Col span={24}>
                                                <span className="d-inline-block">

                                                    <span className="d-inline-block">
                                                        <Car360ViewButton id={this.state.productDetails.xmlUrl ? this.state.productDetails._id : null} >
                                                            <Button type="normal" className={`padding-x-sm margin-xs ${this.state.productDetails.xmlUrl ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ background: this.state.productDetails.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', borderColor: this.state.productDetails.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', minWidth: '50px' }}><img src="/assets/profile/icon-list/Ccar-360_1.gif" style={{ width: '25px', height: '25px' }} alt="Car 360 View Icon" /></Button>
                                                        </Car360ViewButton>
                                                    </span>
                                                </span>
                                                <span className="d-inline-block">
                                                    <Button disabled type="normal" className="padding-x-sm margin-xs  " style={{ background: 'white', borderColor: '#d9d9d9', minWidth: '50px' }}><img src="/assets/CarListingIcon/Video@3x.png" style={{ 'WebkitFilter': 'grayscale(100%)', 'filter': 'grayscale(100%)', width: '25px', height: '25px' }} alt="Car Video Icon" /></Button>
                                                </span>

                                                <span className="d-inline-block">
                                                    <AddCompareProductButton readOnly={_.get(this.state, 'productDetails.status') != 'approved'} data={this.state.productDetails} saveButton={() => {
                                                        return (
                                                            <Button type="normal" className="padding-x-sm margin-xs ads-purchase-compare-btn" style={{ minWidth: '50px' }}><img src="/assets/CarListingIconMobile/car-compare.png" style={{ width: '25px', height: '25px' }} alt="compare" /></Button>
                                                        );
                                                    }}
                                                        savedButton={() => {
                                                            return (
                                                                <Button type="normal" className="padding-x-sm margin-xs ads-purchase-button" style={{ minWidth: '50px', background: 'rgb(89, 54, 26)' }}><img src="/assets/CarListingIconMobile/car-compare.png" style={{ width: '25px', height: '25px' }} alt="compare" /></Button>
                                                            );
                                                        }}
                                                    />
                                                </span>
                                                <span className="d-inline-block" style={{ width: '50px' }}>
                                                    <RegisterCard key='register' button={
                                                        [<Tooltip key='tooltipsregister' title="Registration Card">
                                                            <Button type="normal"
                                                                className={`w-100 ads-purchase-button margin-xs ${_.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'cursor-pointer' : 'cursor-not-allowed '}`}
                                                                style={{ padding: 0, background: _.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'rgb(209 ,110, 132)' : 'rgb(237, 236, 234)', borderColor: _.isArray(_.get(this.state.productDetails, ['registrationUrl'])) && !_.isEmpty(_.get(this.state.productDetails, ['registrationUrl'])) ? 'rgb(209 ,110, 132)' : 'rgb(237, 236, 234)' }}>
                                                                <img src="/assets/CarListingIconMobile/registration-card.png" alt="Registration Card Icon" /></Button></Tooltip>]
                                                    } registrationUrl={this.state.productDetails.registrationUrl ? this.state.productDetails.registrationUrl : []} />
                                                </span>
                                            </Col>
                                        </Row>

                                        <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

                                        <SellerBusinessCard readOnly={_.get(this.state, 'productDetails.status') != 'approved'} data={this.state.productDetails.companys} data1={this.state.productDetails.createdBy} />
                                        <Row className="padding-top-sm">
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px 5px' }}>
                                                <WhatsAppButton readOnly={_.get(this.state, 'productDetails.status') != 'approved'} mobileNumber={this.state.productDetails} />
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ padding: '0px 5px' }}>
                                                <ContactList companys={this.state.productDetails.companys} contactPerson={notEmptyLength(this.state.productDetails.createdBy) ? this.state.productDetails.createdBy : null} />
                                            </Col>
                                        </Row>
                                    </div>

                                    <Card title="Key Details" size="small" className="card-padding-0" style={{ width: '100%', marginTop: '10px' }} >
                                        <KeyCarDetails productDetails={this.state.productDetails} />
                                    </Card>
                                </div>
                            </Col>
                        </Row>

                    </div>
                </div>



                <style jsx="true" global="true">{`
                  `}</style>


                <Modal
                    closable
                    visible={this.state.soldOutModalVisible}
                    onCancel={() => {
                        this.setState({
                            soldOutModalVisible: false,
                        })
                    }}
                    centered
                    footer={null}
                >
                    <div className="padding-md flex-justify-center flex-items-align-center">
                        <img src={soldOutIcon} style={{ width: 200, height: 200 }} />
                    </div>
                    <div className="padding-y-sm h6 flex-justify-center flex-items-align-center">
                        This car has been sold.
            </div>
                    <div className="padding-y-sm flex-justify-center flex-items-align-center">
                        <span className='d-inline-block width-50' >
                            <Link  href={routePaths.dealerProfile.to || '/'} as={typeof (routePaths.dealerProfile.as) == 'function' ? routePaths.dealerProfile.as(_.get(this.state.productDetails , `createdBy`)) : '/'} >
                                <a>
                                    <Button block className="black background-ccar-button-yellow" >More Information</Button>
                                </a>
                            </Link>
                        </span>
                    </div>
                    <div className="padding-y-sm text-align-center text-overflow-break">
                        Posted by <b>{_.trim(`${_.get(this.state.productDetails, ['createdBy.namePrefix']) || ''} ${getUserName(_.get(this.state.productDetails, ['createdBy']) || {}) || ''}`)}</b>
                    </div>
                </Modal>
            </LayoutV2 >
        );
    }
}

const mapStateToProps = state => ({
    productsList: state.productsList,
    app: state.app,
    compare: state.compare,
    user: state.user,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateActiveIdProductList: updateActiveIdProductList,
        quickSearchProductsList: quickSearchProductsList,

        showContactList: showContactList,
        updateActiveMenu: updateActiveMenu,
        setUser: setUser,
        loading,

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewCarDetails2Page));
