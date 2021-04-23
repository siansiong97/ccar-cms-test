import { Button, Col, Empty, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { imageNotFoundIcon } from '../../params/common';
import { getStateIcon } from '../../params/stateList';
import { notEmptyLength } from '../../common-function';
import { withRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { Form } from '@ant-design/compatible';
import { loading } from '../../redux/actions/app-actions';
import { calMonth, formatMoney, renderMileageRange } from '../../functionContent';
import AddCompareProductButton from '../general/add-compare-product-button';
import Car360ViewButton from '../general/car-360-view-button';
import { flameRed, rayaFlame, rayaFood, rayaLamp, rayaMosque, rayaPeople } from '../../icon';
import Loading from '../general/Loading';
import WhatsAppButton from '../general/whatapps-button';
import ContactList from '../general/contactList';
import RegisterCard from '../general/registerCard';
import CalculatorModal from '../general/calculator-modal';
import GridProductSkeleton from '../skeleton-loader/GridProductSkeleton';
import { routePaths } from '../../route';


const currentDateTime = moment().format()

const GridProductList = (props) => {

    const [productList, setProductList] = useState([])
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        console.log(props.data);
        // processAddonProduct()
        processAddonProduct()
        var interval2 = setInterval(() => {
            processAddonProduct()
        }, 60000);
        return () => clearInterval(interval2);

    }, [props.data])

    function processAddonProduct() {
        let currentDateTime = moment().format()
        if (notEmptyLength(props.data)) {
            if (props.data != productList) {
                setProductList([]);
                let inputDataList = _.cloneDeep(props.data)

                inputDataList.map(function (v) {
                    v.addonSpotlight = _.find(v.addon, { 'addonType': 'spotlight' })
                    v.addonSpicydeal = _.find(v.addon, { 'addonType': 'spicydeal' })
                    v.addonKingadType = _.find(v.addon, { 'addonType': 'kingad', 'showPrice': 'show' })
                    v.addonKingadType2 = _.find(v.addon, { 'addonType': 'kingad', 'showPrice': 'hide' })
                    v.addonKingadType3 = _.find(v.addon, { 'addonType': 'kingad', 'showPrice': 'highlight' })
                    let priority = ''
                    v.priority = '';
                    if (priority === '') {
                        if (v.addonKingadType) {
                            if (currentDateTime > moment(v.addonKingadType.startDate).format() && currentDateTime < moment(v.addonKingadType.endDate).format()) {
                                priority = 'addonKingadType'
                                v.priority = 'addonKingadType'
                                v.addonKingadType.endDate = moment(v.addonKingadType.endDate).format()
                                v.addonKingadType.startDate = moment(v.addonKingadType.startDate).format()
                            }
                        }
                    }

                    if (priority === '') {
                        if (v.addonKingadType2) {
                            if (currentDateTime > moment(v.addonKingadType2.startDate).format() && currentDateTime < moment(v.addonKingadType2.endDate).format()) {
                                priority = 'addonKingadType2'
                                v.priority = 'addonKingadType2'
                                v.addonKingadType2.startDate = moment(v.addonKingadType2.startDate).format()
                                v.addonKingadType2.endDate = moment(v.addonKingadType2.endDate).format()
                            }
                        }
                    }

                    if (priority === '') {
                        if (v.addonKingadType3) {
                            if (currentDateTime > moment(v.addonKingadType3.startDate).format() && currentDateTime < moment(v.addonKingadType3.endDate).format()) {
                                priority = 'addonKingadType3'
                                v.priority = 'addonKingadType3'
                                v.addonKingadType3.startDate = moment(v.addonKingadType3.startDate).format()
                                v.addonKingadType3.endDate = moment(v.addonKingadType3.endDate).format()
                            }
                        }
                    }

                    if (priority === '') {
                        if (v.addonSpicydeal) {
                            if (currentDateTime > moment(v.addonSpicydeal.startDate).format() && currentDateTime < moment(v.addonSpicydeal.endDate).format()) {
                                priority = 'addonSpicydeal'
                                v.priority = 'addonSpicydeal'
                                v.addonSpicydeal.startDate = moment(v.addonSpicydeal.startDate).format()
                                v.addonSpicydeal.endDate = moment(v.addonSpicydeal.endDate).format()
                            }
                        }
                    }

                    if (priority === '') {
                        if (v.addonSpotlight) {
                            if (currentDateTime > moment(v.addonSpotlight.startDate).format() && currentDateTime < moment(v.addonSpotlight.endDate).format()) {
                                priority = 'addonSpotlight'
                                v.priority = 'addonSpotlight'
                                v.addonSpotlight.startDate = moment(v.addonSpotlight.startDate).format()
                                v.addonSpotlight.endDate = moment(v.addonSpotlight.endDate).format()
                            }
                        }
                    }

                    return v
                })
                setProductList(inputDataList);
            }
        }
    }

    useEffect(() => {
        setInitLoading(props.productsList.productListLoading)
    }, [props.productsList.productListLoading])

    const _renderState = (v) => {
        let value = _.get(v, ['companys', 'state'])

        let value2 = _.get(v, ['createdBy', 'userstate'])
        if (_.isEmpty(value2) === false) {
            value = value2
        }
        return (
            <div className="width-20 relative-wrapper gridStateFloatRight" >
                <img src={getStateIcon(value) || imageNotFoundIcon} className="fill-parent absolute-center" style={{ marginTop: '0px' }} />
            </div>
        )
    }

    const _renderCondition = (v) => {
        let value = v.condition.toUpperCase()
        if (v.condition == 'new') {
            return (<div className="wrap-condition wrap-condition-new"><p>{value}</p></div>)
        } else if (v.condition == 'used') {
            return (<div className="wrap-condition wrap-condition-used"><p>{value}</p></div>)
        } else if (v.condition == 'recon') {
            return (<div className="wrap-condition wrap-condition-recon"><p>{value}</p></div>)
        } else {
            return (<div className="wrap-condition wrap-condition-default"><p>{value}</p></div>)
        }
    }

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

    const _renderLayout = (v) => {

        if (!v.priority) { return ('wrap-product-ads') }
        if (v.priority === 'addonSpotlight' || v.priority === 'addonKingadType3') { return ('wrap-product-ads-spotlight') }
        else if (v.priority === 'addonSpicydeal' || v.priority === 'addonKingadType' || v.priority === 'addonKingadType2') { return ('wrap-product-ads-spicydeal') }
        else { return ('wrap-product-ads') }
    }




    const _renderPrice = (v) => {
        console.log(v.title);
        console.log(v.priority);
        let normalPrice =
            (<div className="wrap-product-ads-price" style={{ height : 57 }}>
                <Row><Col xs={14} sm={14} md={16} lg={16} xl={16}><span className='installmentPrice'>RM {formatMoney((calMonth(v.price)).toString())}/month</span></Col></Row>
                <h4 style={{ marginLeft: '10px' }}>RM {formatMoney((v.price).toString())}</h4>
            </div>)

        function renderShowPrice(price, discountedPrice) {

            const pattern = /\.(\d*?)0+(\D*)$/gm;
            return (
                <div className="wrap-product-ads-price"  style={{ height : 57 }}>
                    <span className='gridMoneyText'>RM {formatMoney((price).toString())}</span>
                    <span className="wrap-condition wrap-product-ads-discount-spicydeal" >{(((100 * (price - discountedPrice) / price) * -1).toFixed(1).toString()).replace(pattern, '') + '%'}</span>
                    <h4 style={{ marginLeft: '10px', color: '#FBB040' }}>RM {formatMoney((discountedPrice).toString())}</h4>
                    {/* <Row>
          <Col xs={14} sm={14} md={16} lg={16} xl={16}>
            <p style={{ marginLeft: '10px', color: '#a9d46f' }}>RM {formatMoney((calMonth(discountedPrice)).toString())}/month</p>
          </Col>
        </Row> */}
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


            return (
                <div className="wrap-product-ads-countdown-spicydeal"  style={{ height : 57 }}>
                    <span className='gridAddonMainText' style={{ marginLeft: '10px' }} ><span>SuperDeal Ends in</span></span>
                    <Row>
                        <Col xs={14} sm={14} md={16} lg={16} xl={16}>
                            <p className='gridAddonDayHourSubText'>

                                <span className='gridAddonDayHourText'>D </span>
                                <span className='gridAddonDayHour'>{formatCountdown(daysFormatted, 2)}</span>
                                <span className='gridAddonDayHourText'> H </span>
                                <span className='gridAddonDayHour'>{formatCountdown(hoursFormatted, 2)}</span>
                                <span className='gridAddonDayHourText'> M </span>
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


    const _renderIcon = (v, type) => {

        let defaultIcon = <img src="/assets/profile/icon-list/account-info-active.png" className="fill-parent"  ></img>
        let blackIcon = <img src="/assets/profile/icon-list/dealer.png" className="fill-parent" ></img>

        if (type === 'company') {
            defaultIcon = eval(<img src="/assets/profile/icon-list/address-work.png" className="fill-parent" ></img>)
            blackIcon = eval(<img src="/assets/profile/icon-list/company.png" className="fill-parent" ></img>)
        }

        if (type === 'area') {
            defaultIcon = eval(<img src="/assets/profile/icon-list/location-latest.png" className="fill-parent" ></img>)
            blackIcon = eval(<img src="/assets/profile/icon-list/location-long.png" className="fill-parent" ></img>)
        }

        if (v.priority === 'addonSpicydeal' ||
            v.priority === 'addonKingadType' ||
            v.priority === 'addonKingadType2' ||
            v.priority === 'addonKingadType3' ||
            v.priority === 'addonSpotlight'
        ) { return (blackIcon) }
        else {
            return (defaultIcon)
        }

    }

    const _renderImage = (v) => {

        if (v.priority === 'addonSpicydeal' || v.priority === 'addonKingadType' || v.priority === 'addonKingadType2'
            // ||  v.priority === 'addonKingadType3'
        ) {
            // return (<div className="red-flame"><img src={flameRed} /></div>)
            return (<div className="red-flame"><img src={rayaFlame} style={{ width: 50, height: 50 }} /></div>)
        }
        else {
            // return (<div className="spotlight"><img src="/assets/Ccar-Spotlight.gif" /></div>)
            return (<div className="spotlight"><img src={rayaFood} style={{ width: 50, height: 50 }} /></div>)
        }
    }


    const _renderList = (data) => {

        if (notEmptyLength(data)) {
            return (

                <Row >
                    {data.map((v, i) => {
                        if (v) {

                            let companyName = v.companys ? v.companys.name : null
                            let areaName = v.companys ? v.companys.area : null

                            let userCompany = _.get(v, ['createdBy', 'usercompanyName']) || ''
                            if (_.isEmpty(userCompany) === false) {
                                companyName = userCompany
                            }

                            let userarea = _.get(v, ['createdBy', 'userarea']) || ''
                            if (_.isEmpty(userarea) === false) {
                                areaName = userarea
                            }

                            // let companyName = v.companys ? v.companys.name : null
                            // let areaName = v.companys ? v.companys.area : null

                            return (
                                <Col key={'product' + i}
                                    style={{ touchAction: 'pan-y' }}
                                    className='gridDataList'
                                    xs={props.xs ? props.xs : 24}
                                    sm={props.sm ? props.sm : 24}
                                    md={props.md ? props.md : 12}
                                    lg={props.lg ? props.lg : 8}
                                    xl={props.xl ? props.xl : 8} >
                                    <div className="box-shadow-thin" key={'listDiv' + i} >
                                        <div className={_renderLayout(v)}>
                                            <div className="wrap-product-ads-img">
                                                <Link shallow={false} href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'}>
                                                    <a>
                                                        <React.Fragment>
                                                            <div className="overlay-condition">
                                                                {_renderCondition(v)}
                                                            </div>
                                                            <div className="overlay-state">
                                                                {_renderState(v)}
                                                            </div>
                                                            {
                                                                v.priority === 'addonKingadType' || v.priority === 'addonKingadType2' || v.priority === 'addonKingadType3' ?
                                                                    <div className="flex-justify-center flex-items-align-start width-100" style={{ position: 'absolute', top: 0, zIndex: 2 }}>
                                                                        <img src={rayaLamp} style={{ width: 200, height: 200 }} />
                                                                    </div>
                                                                    :
                                                                    null
                                                            }
                                                            <div className="width-100 background-black-opacity-50 cursor-pointer flex-justify-space-between flex-items-align-center" style={{ position: 'absolute', bottom: 0, zIndex: 2 }}>
                                                                <span className='d-inline-block ' >
                                                                    {_renderPrice(v)}
                                                                </span>
                                                                <span className='d-inline-block margin-x-sm ' >
                                                                    {
                                                                        v.priority === 'addonSpicydeal' || v.priority === 'addonKingadType' || v.priority === 'addonKingadType2' ?
                                                                            <img src={rayaFlame} style={{ width: 50, height: 50 }} />
                                                                            :
                                                                            v.priority === 'addonSpotlight' || v.priority === 'addonKingadType3' ?
                                                                                <img src={rayaFood} style={{ width: 50, height: 50 }} />
                                                                                :
                                                                                <img src="/assets/Ccar-Spotlight.gif" style={{ width: 40, height: 40 }} />
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {
                                                                    notEmptyLength(v.carUrl)
                                                                        ? <img src={v.carUrl[0].url} style={{ maxInlineSize: '-webkit-fill-available' }} className="head-product-ads-img" key={0} />
                                                                        : <img src={'/image-not-found.png'} className="head-product-ads-img" key={-1} />
                                                                }

                                                            </div>
                                                        </React.Fragment>
                                                    </a>
                                                </Link>
                                                <span className="text-align-right gridTopRight">
                                                    {props.topRight ? props.topRight(v) : null}</span>
                                                {
                                                    _.get(v, ['readyStock']) == 'Yes'
                                                        ? <span className="text-align-right avatar background-green readyStockDot"></span>
                                                        : null
                                                }
                                            </div>
                                            <div className="wrap-product-ads-text relative-wrapper">

                                                {

                                                    props.body ?
                                                        props.body(v)
                                                        :
                                                        props.body === null ?
                                                            null
                                                            :
                                                            <React.Fragment>

                                                                {
                                                                    v.priority === 'addonSpicydeal' || v.priority === 'addonKingadType' || v.priority === 'addonKingadType2' ?
                                                                        <img src={rayaMosque} style={{ width: 100, height: 100, position: 'absolute', bottom: 50, right: 10 }} />
                                                                        :
                                                                        v.priority === 'addonSpotlight' || v.priority === 'addonKingadType3' ?
                                                                            <img src={rayaPeople} style={{ width: 100, height: 100, position: 'absolute', bottom: 50, right: 10 }} />
                                                                            :
                                                                            null
                                                                }
                                                                <div className="wrap-product-ads-title">
                                                                    <Link shallow={false} passHref href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'} >
                                                                        <a>
                                                                            <div className='text-truncate-twoline'><label style={{ fontSize: 16 }}>{v.title}</label></div>
                                                                        </a>
                                                                    </Link>
                                                                </div>

                                                                <div className="wrap-product-ads-title-p text-overflow-break">
                                                                    <Row>
                                                                        <Col span={20}>
                                                                            <p>
                                                                                {v.carspecsAll ?
                                                                                    v.carspecsAll.transmission + ' | ' +
                                                                                    renderMileageRange(v.mileage, v.mileage2) + ' | ' +
                                                                                    (v.color ? v.color.toUpperCase() : '')
                                                                                    : ''}
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </div>

                                                                <Row className="margin-bottom-xs">
                                                                    <Col xs={24} sm={24} md={18} lg={18} xl={18} >
                                                                        <Row >
                                                                            <Col className="icon-res" span={3} style={{ marginTop: '-3px' }}>{_renderIcon(v)}</Col>
                                                                            <Col span={20}>
                                                                                <p className='gridDealerName'>{v.createdBy ? v.createdBy.namePrefix : null}
                                                                                    {v.createdBy ? v.createdBy.firstName : null}
                                                                                    {v.createdBy ? v.createdBy.lastName : null} </p>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col className="icon-res" span={3} >{_renderIcon(v, 'company')}</Col>
                                                                            <Col span={20}>
                                                                                <p style={{ marginLeft: '5px', fontSize: '14px' }} className="product-ads-company">{companyName} </p>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col span={3} className="flex-justify-center flex-align-center flex-items-align-center icon-res">
                                                                                {_renderIcon(v, 'area')}
                                                                            </Col>
                                                                            <Col span={20}>
                                                                                <p style={{ marginLeft: '5px', fontSize: '14px', textTransform: 'uppercase' }} className="product-ads-company">{areaName} </p>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>

                                                            </React.Fragment>

                                                }

                                                {
                                                    props.footer ?
                                                        props.footer(v)
                                                        :
                                                        props.footer === null ?
                                                            null
                                                            :
                                                            <Row type="flex" justify="start" align="middle" className='w-100' gutter={[2.5, 0]}>
                                                                <Col xs={4} sm={4} md={4} lg={4} xl={4}><WhatsAppButton mobileNumber={v ? v : null} /></Col>
                                                                <Col xs={4} sm={4} md={4} lg={4} xl={4}><ContactList companys={v.companys ? v.companys : null} contactPerson={notEmptyLength(v.createdBy) ? v.createdBy : null} /></Col>
                                                                <Col xs={4} sm={4} md={4} lg={4} xl={4}><AddCompareProductButton data={v} /></Col>
                                                                <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                                                    <Car360ViewButton id={v.xmlUrl ? v._id : null}>
                                                                        {/* <Tooltip title="360&deg; View"> */}
                                                                        <Button type="normal" className={`w-100 ads-purchase-button ${v.xmlUrl ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ padding: 0, background: v.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', borderColor: v.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)' }}><img src="/assets/profile/icon-list/Ccar-360_1.gif" /></Button>
                                                                        {/* </Tooltip> */}
                                                                    </Car360ViewButton>
                                                                </Col>
                                                                <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                                                    {
                                                                        _.isArray(v.registrationUrl) && notEmptyLength(v.registrationUrl) ?
                                                                            <RegisterCard key='register' button={
                                                                                // [<Tooltip key='tooltipsregister' title="Registration Card">
                                                                                //   <Button type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: 'rgb(209 ,110, 132)', borderColor: 'rgb(209 ,110, 132)' }}><img src="/assets/CarListingIconMobile/registration-card.png" /></Button>
                                                                                // </Tooltip>]
                                                                                [
                                                                                    <Button key='btnRegister' type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: 'rgb(209 ,110, 132)', borderColor: 'rgb(209 ,110, 132)' }}><img src="/assets/profile/icon-list/carmarket-bar-icon/reg-card.png" /></Button>
                                                                                ]
                                                                            } registrationUrl={v.registrationUrl} />
                                                                            :
                                                                            <div className="width-100">
                                                                                {/* <Tooltip key='tooltipsregister' title="Registration Card"> */}
                                                                                <Button type="normal" className="width-100 ads-purchase-button cursor-not-allowed" style={{ padding: 0, background: 'rgb(237, 236, 234)', borderColor: 'rgb(237, 236, 234)' }}><img src="/assets/profile/icon-list/carmarket-bar-icon/reg-card.png" /></Button>
                                                                                {/* </Tooltip> */}
                                                                            </div>
                                                                    }
                                                                </Col>
                                                                <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                                                    <CalculatorModal key='calculator' data={{ price: v.searchPrice, downpayment: v.searchPrice * 0.1, loanPeriod: 9, interestRate: 3 }} />
                                                                </Col>
                                                            </Row>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </Col>
                            )
                        } else {
                            return null;
                        }
                    })
                    }
                </Row>)
        } else {
            return (
                _.get(props.productsList, ['productListLoading']) || initLoading ?
                    <React.Fragment>
                        <Row>
                            {
                                _.map(_.range(0, 30), function (index) {
                                    return (
                                        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                                            <GridProductSkeleton />
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </React.Fragment>
                    :
                    <div style={{ height: '15em', backgroundColor: '#FFFFFF' }}>
                        <Empty
                            style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                            image="/empty.png"
                            imageStyle={{ height: 60, }}
                            description={<span>{props.app.loading ? 'Getting Result' : 'No Result'}</span>}
                        >
                        </Empty>
                    </div>
            );
        }
    }

    return (
        <div key='listDiv2' className={props.className ? props.className : null} style={props.style ? props.style : null} >
            {_renderList(notEmptyLength(productList) ? productList : [])}
        </div>
    );
}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(GridProductList)));