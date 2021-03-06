import { Button, Col, Empty, Form, Icon, Row, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { getStateIcon } from '../../params/stateList';
import { flameRedShadow, flameRed, rayaFlame, rayaFood, rayaLamp, rayaMosque, rayaPeople } from '../../icon';
import { formatMoney, renderMileageRange, calMonth } from '../../functionContent';
import { isValidNumber, notEmptyLength } from '../../common-function';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import Loading from '../general/Loading';
import WhatsAppButton from '../general/whatapps-button';
import ContactList from '../general/contactList';
import RegisterCard from '../general/registerCard';
import CalculatorModal from '../general/calculator-modal';
import AddCompareProductButton from '../general/add-compare-product-button';
import Car360ViewButton from '../general/car-360-view-button';
import { withRouter } from 'next/dist/client/router';
import Link from 'next/link';
import SellerBusinessCard from '../seller/SellerBusinessCard';
import { routePaths } from '../../route';
import ProductListSkeleton from '../skeleton-loader/ProductListSkeleton';


const ProductList = (props) => {

  const [descriptionIndex, setDescriptionIndex] = useState(-1)
  const [productList, setProductList] = useState([])
  const [skeletonLoading, setSkeletonLoading] = useState(true);


  useEffect(() => {
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
        setSkeletonLoading(true);
        let inputDataList = _.cloneDeep(props.data)

        inputDataList.map(function (v) {

          v.currentImg = 0;
          v.seeMore = false;

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
        setSkeletonLoading(false);
      }
    }

  }

  function setCurrentImg(id, imgIndex) {

    if (id != null && imgIndex != null) {
      let data = productList.map(function (item) {
        if (item._id == id) {
          item.currentImg = imgIndex;
        }
        return item;
      })
      setProductList(data);
    }
  }

  function toggleSeeMore(id) {

    if (id != null) {
      let data = productList.map(function (item) {
        if (item._id == id) {
          item.seeMore = !item.seeMore;
        }
        return item;
      })
      setProductList(data);
    }
  }

  const scrollToLeftBtn = (v, i) => {
    let minusOne = v.currentImg - 1
    if (minusOne >= 0) {
      setCurrentImg(v._id, minusOne)
    } else {
      setCurrentImg(v._id, v.carUrl.length - 1)
    }
  }

  const scrollToRightBtn = (v, i) => {
    let plusOne = v.currentImg + 1
    if (plusOne < v.carUrl.length) {
      setCurrentImg(v._id, plusOne)
    } else {
      setCurrentImg(v._id, 0)
    }
  }

  const renderCurrentImg = (v, i) => {

    if (notEmptyLength(v.carUrl)) {
      if (v.currentImg != null && v.currentImg < v.carUrl.length) {
        return (
          <Link shallow={false} passHref href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'} >
            <a>
              <React.Fragment>
                <div className="wrap-product-ads-img-horizontal">
                  <img src={v.carUrl[v.currentImg].url} className="head-product-ads-img" />
                </div>
              </React.Fragment>
            </a>
          </Link>
        )
      } else {
        return (
          <Link shallow={false} passHref href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'} >
            <a>
              <React.Fragment>
                <div className="wrap-product-ads-img-horizontal">
                  <div className="overlay">
                    <img src="/assets/Ccar-logo.png" />
                  </div>
                  <img src={v.carUrl[0].url} className="head-product-ads-img" />

                </div>
              </React.Fragment>
            </a>
          </Link>
        )
      }
    } else {
      return (
        <Link shallow={false} passHref href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'} >
          <a>
            <React.Fragment>
              <div className="wrap-product-ads-img-horizontal">
                <div className="overlay-condition">
                  {_renderCondition(v)}
                </div>
                <div className="overlay">
                  <img src="/assets/Ccar-logo.png" />
                </div>
                <img src={'/image-not-found.png'} className="head-product-ads-img" />

              </div>
            </React.Fragment>
          </a>
        </Link>
      )
    }

  }

  const _renderImgList = (v, i) => {

    if (notEmptyLength(v.carUrl)) {

      var list = v.carUrl.map((item, index) => {
        return (
          <Col span={6} key={index}>
            <div className="wrap-product-ads-list-img-horizontal" onClick={() => { setCurrentImg(v._id, index); }}>
              <img src={item.url} style={{ margin: 0 }} className="head-product-ads-img w-100" />
            </div>
          </Col>
        );
      });
      return (
        <div className={"demo-infinite-container-list"}>
          <InfiniteScroll initialLoad={false} pageStart={0}>
            <Row gutter={[10, 0]}>
              {list}
            </Row>
          </InfiniteScroll>
        </div>
      )
    } else {
      return null;
    }

  }

  const _renderCondition = (v) => {
    let value = v.condition.toUpperCase()
    if (v.condition == 'new') {
      return (
        <div className="wrap-condition wrap-condition-new">
          <p>{value}</p>
        </div>
      )
    } else if (v.condition == 'used') {
      return (
        <div className="wrap-condition wrap-condition-used">
          <p>{value}</p>
        </div>
      )
    } else if (v.condition == 'recon') {
      return (
        <div className="wrap-condition wrap-condition-recon">
          <p>{value}</p>
        </div>
      )
    } else {
      return (
        <div className="wrap-condition wrap-condition-default">
          <p>{value}</p>
        </div>
      )
    }
  }

  const _renderShowHideBtn = (v, i) => {
    let count = v.description.length
    return (
      <div>
        <p style={{ textDecoration: 'underline', textAlign: 'right' }}>
          {count > 200 ? !v.seeMore ? (
            <a
              onClick={(event) => { event.preventDefault(); toggleSeeMore(v._id) }}>
              See More
            </a>) : (
            <a
              onClick={(event) => { event.preventDefault(); toggleSeeMore(v._id) }}>
              Hide
            </a>) : (null)}
        </p>
      </div>
    )
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

  const _renderTextTitle = (v) => {
    const addonSpotlight = _.find(v.addon, { 'addonType': 'spotlight' })
    const addonSpicydeal = _.find(v.addon, { 'addonType': 'spicydeal' })
    const currentDateTime = moment().format();

    if (v.addon) {
      if (v.addon && addonSpicydeal) {
        if (currentDateTime < addonSpicydeal.endDate) {
          return (
            'wrap-product-ads-title-horizontal'
          )
        }
      }
    }
  }

  const _renderCountdown = (v) => {
    const duration = moment.duration(moment(v).diff(moment()));
    const days = Math.floor(duration.asDays());
    const daysFormatted = days ? `${days}` : 0;
    const hours = duration.hours();
    const hoursFormatted = hours ? `${hours}` : 0;

    return (
      <p style={{ marginLeft: '10px', color: 'white', marginBottom: '0px' }}>
        <span style={{ fontSize: '10px', verticalAlign: 'super' }}>D </span>
        <span style={{ backgroundColor: '#d62828', borderRadius: '3px', fontWeight: '900', fontSize: '15px', padding: '1px 2px' }}>{formatCountdown(daysFormatted, 2)}</span>
        <span style={{ fontSize: '10px', verticalAlign: 'super' }}> H </span>
        <span style={{ backgroundColor: '#d62828', borderRadius: '3px', fontWeight: '900', fontSize: '15px', padding: '1px 2px' }}>{formatCountdown(hoursFormatted, 2)}</span>
        {/* <div className="overlay-price"> <img src={flame}/> </div> */}
        {/* <img src={flame} style={{marginTop:'-20px', width:'25%', marginRight:'-97px'}}/> */}
      </p>
    )
  }

  const _renderPrice = (v) => {
    const currentDateTime = moment().format();
    const addon = _.find(v.addon, { 'addonType': 'spicydeal' });
    const addon2 = _.find(v.addon, { 'addonType': 'kingad' });

    if (v.addon && addon) {
      if (currentDateTime < addon.endDate) {
        if (addon.addonType === 'spicydeal' && addon.showPrice === 'show') {
          return (
            <div className="wrap-product-ads-price">
              <span style={{ textDecoration: 'line-through', fontSize: '12px', marginLeft: '10px', color: '#ffffff' }}>RM {formatMoney((v.price).toString())}</span> {_renderDiscount(v)}
              <h4 style={{ marginLeft: '10px', color: '#FBB040' }}>RM {formatMoney((addon.discountedPrice).toString())}</h4>
              {/* <Row>
                <Col xs={14} sm={14} md={16} lg={16} xl={16}>
                  <p style={{ marginLeft: '10px', color: '#a9d46f' }}>RM {formatMoney((calMonth(addon.discountedPrice)).toString())}/month</p>
                </Col>
              </Row> */}
            </div>
          )
        } else if (addon.addonType === 'spicydeal' && addon.showPrice === 'hide') {
          return (
            <div className="wrap-product-ads-countdown-spicydeal">
              <span style={{ marginLeft: '10px', color: '#f9f5ef' }}><span>SuperDeal Ends in</span></span>
              <Row>
                <Col xs={14} sm={14} md={16} lg={18} xl={16}>
                  {_renderCountdown(addon.endDate)}
                </Col>
              </Row>
            </div>
          )
        } else {
          return (
            <div className="wrap-product-ads-price">
              <Row>
                <Col xs={14} sm={14} md={16} lg={18} xl={16}>
                  <p style={{ marginLeft: '10px', color: '#ffffff' }}>RM {formatMoney((calMonth(v.price)).toString())}/month</p>
                </Col>
              </Row>

              <h4 style={{ marginLeft: '10px' }}>RM {formatMoney((v.price).toString())}</h4>

            </div>
          )
        }
      }
      else if (v.addon && addon2) {
        if (currentDateTime < addon2.endDate) {
          if (addon2.addonType === 'kingad' && addon2.showPrice === 'show') {
            return (
              <div className="wrap-product-ads-price">
                <span style={{ textDecoration: 'line-through', fontSize: '12px', marginLeft: '10px', color: '#ffffff' }}>RM {formatMoney((v.price).toString())}</span> {_renderDiscount(v)}
                <h4 style={{ marginLeft: '10px', color: '#d62828' }}>RM {formatMoney((addon2.discountedPrice).toString())}</h4>
                <Row>
                  <Col xs={14} sm={14} md={16} lg={18} xl={16}>
                    <p style={{ marginLeft: '10px', color: '#a9d46f' }}>RM {formatMoney((calMonth(addon2.discountedPrice)).toString())}/month</p>
                  </Col>
                </Row>
              </div>
            )
          } else if (addon2.addonType === 'kingad' && addon2.showPrice === 'hide') {
            return (
              <div className="wrap-product-ads-countdown-spicydeal">
                <span style={{ marginLeft: '10px', color: '#f9f5ef' }}><span>SuperDeal Ends in</span></span>  <img src={flameRedShadow} />
                <Row>
                  <Col xs={14} sm={14} md={16} lg={18} xl={16}>
                    {_renderCountdown(addon2.endDate)}
                  </Col>
                </Row>
              </div>
            )
          }
        }
      }
      else {
        return (
          <div className="wrap-product-ads-price">
            <Row>
              <Col xs={14} sm={14} md={16} lg={18} xl={16}>
                <p style={{ marginLeft: '10px', color: '#ffffff' }}>RM {formatMoney((calMonth(v.price)).toString())}/month</p>
              </Col>
            </Row>

            <h4 style={{ marginLeft: '10px' }}>RM {formatMoney((v.price).toString())}</h4>

          </div>
        )
      }
    } else {
      return (
        <div className="wrap-product-ads-price">
          <Row>
            <Col xs={14} sm={14} md={16} lg={18} xl={16}>
              <span style={{ marginLeft: '10px', color: '#ffffff' }}>RM {formatMoney((calMonth(v.price)).toString())}/month</span>
            </Col>
          </Row>

          <h4 style={{ marginLeft: '10px' }}>RM {formatMoney((v.price).toString())}</h4>

        </div>
      )
    }
  }

  const _renderDiscount = (v) => {
    const currentDateTime = moment().format();
    const addon = _.find(v.addon, { 'addonType': 'spicydeal' });
    const addon2 = _.find(v.addon, { 'addonType': 'kingad' });

    const pattern = /\.(\d*?)0+(\D*)$/gm;
    if (v.addon && addon) {
      if (currentDateTime < addon.endDate) {
        if (addon.addonType === 'spicydeal' && addon.showPrice === 'show') {
          return (
            <span className="wrap-condition wrap-product-ads-discount-spicydeal" style={{ marginLeft: '5px' }} >{addon ? (((100 * (v.price - addon.discountedPrice) / v.price) * -1).toFixed(1).toString()).replace(pattern, '') + '%' : 0}</span>
          )
        }
      }
    } else if (v.addon && addon2) {
      if (currentDateTime < addon2.endDate) {
        if (addon2.addonType === 'kingad' && addon2.showPrice === 'show') {
          return (
            <span className="wrap-condition wrap-product-ads-discount-spicydeal" style={{ marginLeft: '5px' }} >{addon2 ? (((100 * (v.price - addon2.discountedPrice) / v.price) * -1).toFixed(1).toString()).replace(pattern, '') + '%' : 0}</span>
          )
        }
      }
    }
  }

  const _renderImage = (v) => {
    const currentDateTime = moment().format();
    const addon = _.find(v.addon, { 'addonType': 'spicydeal' });
    const addon2 = _.find(v.addon, { 'addonType': 'kingad' });

    if (v.addon && addon) {
      if (currentDateTime < addon.endDate) {
        if (addon.addonType === 'spicydeal' && addon.showPrice === 'show' || addon.addonType === 'spicydeal' && addon.showPrice === 'hide') {
          return (
            <div className="red-flame1">
              <img src={flameRed} />
            </div>
          )
        }
      } else {
        return (
          <img src="/assets/Ccar-logo.png" />
        )
      }
    } else if (v.addon && addon2) {
      if (currentDateTime < addon2.endDate) {
        if (addon2.addonType === 'kingad' && addon2.showPrice === 'show') {
          return (
            <div className="red-flame1">
              <img src={flameRed} />
            </div>
          )
        } else if (addon2.addonType === 'kingad' && addon2.showPrice === 'hide') {
          return (
            <div className="red-flame1">
              <img src={flameRed} />
            </div>
          )
        }
      } else {
        return (
          <img src="/assets/Ccar-logo.png" />
        )
      }
    }
    else {
      return (
        <img src="/assets/Ccar-Spotlight.gif" />

      )
    }
  }

  const _renderLayout = (v) => {

    if (!v.priority) { return ('wrap-product-ads') }
    if (v.priority === 'addonSpotlight' || v.priority === 'addonKingadType3') { return ('wrap-product-ads-spotlight') }
    else if (v.priority === 'addonSpicydeal' || v.priority === 'addonKingadType' || v.priority === 'addonKingadType2') { return ('wrap-product-ads-spicydeal') }
    else { return ('wrap-product-ads') }
  }

  const _renderList = (data) => {

    if (notEmptyLength(data)) {

      return (
        data.map((v, i) =>
          <Col key={i} xs={24} sm={24} md={24} lg={24} xl={24} style={{ padding: '0px' }}>
            {/* <div className="wrap-product-ads-horizontal"> */}
            <div className={`${_renderLayout(v)} margin-y-sm round-border padding-md relative-wrapper`} id={_renderTextTitle(v)}>
              {
                v.priority === 'addonKingadType' || v.priority === 'addonKingadType2' || v.priority === 'addonKingadType3' ?
                  <Link href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'} >
                    <a target="_blank">
                      <span className="d-inline-block" style={{ position: 'absolute', top: 0, left: 40, zIndex: 2 }}>
                        <img src={rayaLamp} style={{ width: 230, height: 230 }} />
                      </span>
                    </a>
                  </Link>
                  :
                  null
              }
              <Row>
                <Col span={7}>
                  <div className="relative-wrapper">
                    {renderCurrentImg(v, i)}
                    <span className='d-inline-block' style={{ position: 'absolute', top: 0, left: 0 }} >
                      {_renderCondition(v)}
                    </span>
                    <span className='d-inline-block' style={{ position: 'absolute', top: 0, right: 0 }} >
                      <img src={getStateIcon(v.state)} style={{ height: 30, width: 50, borderRadius: '5px' }} />
                    </span>

                    <div className="width-100 background-black-opacity-50 cursor-pointer flex-justify-space-between flex-items-align-center" style={{ position: 'absolute', bottom: 0, zIndex: 2 }}>
                      <span className='d-inline-block width-80' >
                        {_renderPrice(v)}
                      </span>
                      <span className='d-inline-block width-20 padding-right-sm' >
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
                  </div>
                  {_renderImgList(v, i)}
                </Col>
                <Col span={17}>
                  <Row style={{ minHeight: '200px' }}>
                    <Col span={14} style={{ marginBottom: '-11px' }}>
                      <div className="wrap-product-ads-title-horizontal">
                        <Row gutter={[20, 20]}>
                          {/* <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                                        {_renderCondition(v)}
                                                    </Col> */}
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ padding: '10px 10px' }}>
                            <Link href={routePaths.viewCarDetails.to || '/'} as={typeof (routePaths.viewCarDetails.as) == 'function' ? routePaths.viewCarDetails.as(v) : '/'} >
                              <a target="_blank">
                                <div className="text-truncate-twoline">
                                  <label>
                                    {/* <span style={{ color: '#E3C57D' }}>[ {v.condition} ] </span> */}
                                    {v.title}
                                    {/* {v.carspecsAll ?
                                  v.carspecsAll.make + ' ' +
                                  v.carspecsAll.model + ' ' +
                                  v.carspecsAll['engine-capacity'] +
                                  ' (' + v.carspecsAll.variant + ') ' +
                                  '-' + v.carspecsAll.year
                                  : ''} */}
                                  </label>
                                </div>
                              </a>
                            </Link>
                          </Col>
                        </Row>
                      </div>
                      <div style={{ padding: '5px 15px' }}>
                        <p>
                          {v.carspecsAll ?
                            v.carspecsAll.transmission + ' | ' +
                            renderMileageRange(v.mileage, v.mileage2) + ' | ' +
                            (v.color ? v.color.toUpperCase() : '')
                            : ''}
                        </p>
                        {/* <p style={!v.seeMore ? { maxHeight: '120px', overflow: 'hidden', lineHeight: '1.6', marginBottom: '0px', textOverflow: 'ellipsis' } : {}}>{v.description}</p> */}
                        <div className="relative-wrapper" style={{ height: '120px', lineHeight: '1.6', marginBottom: '0px' }}>
                          {
                            v.priority === 'addonSpicydeal' || v.priority === 'addonKingadType' || v.priority === 'addonKingadType2' ?
                              <img src={rayaMosque} style={{ width: 150, height: 150, position: 'absolute', bottom: -70, right: 0 }} />
                              :
                              v.priority === 'addonSpotlight' || v.priority === 'addonKingadType3' ?
                                <img src={rayaPeople} style={{ width: 150, height: 150, position: 'absolute', bottom: -70, right: 0 }} />
                                :
                                null
                          }
                          <div className=" text-truncate-fiveline" >{v.description}</div>
                        </div>
                      </div>
                    </Col>
                    <Col span={10}>
                      <div className="wrap-product-ads-carSpecs-horizontal round-border thin-border padding-xs background-white-opacity-40 backdrop-blur" >
                        <Row>
                          <Col xs={2} sm={2} md={2} lg={0} xl={2}>
                            <img src="/assets/carDetails/Transmission@3x.png" />
                          </Col>
                          <Col xs={{ span: 10, offset: 0 }} sm={{ span: 10, offfset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 12, offfset: 0 }} xl={{ span: 10, offset: 0 }}>
                            <div className="grey-darken-3">Transmission</div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h4 style={{ textTransform: 'capitalize' }}>{v.carspecsAll.transmission}</h4>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={2} sm={2} md={2} lg={0} xl={2}>
                            <img src="/assets/carDetails/Mileage@3x.png" />
                          </Col>
                          <Col xs={10} sm={10} md={10} lg={12} xl={10}>
                            <div className="grey-darken-3"> Mileage</div>
                          </Col>
                          <Col span={12}>
                            <h4 style={{ textTransform: 'capitalize' }}>{renderMileageRange(v.mileage, v.mileage2)}</h4>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={2} sm={2} md={2} lg={0} xl={2}>
                            <img src="/assets/carDetails/Car Color@3x.png" />
                          </Col>
                          <Col xs={10} sm={10} md={10} lg={12} xl={10}>
                            <div className="grey-darken-3">Color</div>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h4 style={{ textTransform: 'capitalize' }}>{v.color}</h4>
                          </Col>
                        </Row>
                        {/* <Row>
                            <Col span={12}>
                              <p><img src="/assets/carDetails/Transmission@3x.png" />Transmission</p>
                            </Col>
                            <Col span={12}>
                              <h4 style={{ textTransform: 'capitalize' }}>{v.carspecsAll.transmission}</h4>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <p><img src="/assets/carDetails/Mileage@3x.png" /> Mileage</p>
                            </Col>
                            <Col span={12}>
                              <h4 style={{ textTransform: 'capitalize' }}>{formatNumber(v.mileage)}</h4>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              <p><img src="/assets/carDetails/Car Color@3x.png" /> Color</p>
                            </Col>
                            <Col span={12}>
                              <h4 style={{ textTransform: 'capitalize' }}>{v.color}</h4>
                            </Col>
                          </Row> */}
                      </div>
                    </Col>
                  </Row>

                  <Row >
                    <Col span={14}>
                      <div style={{ margin: '0px 15px' }}>
                        <Row style={{ paddingLeft: '5px', paddingTop: '5px', paddingBottom: '5px', paddingRight: '1px', height: '47px', marginBottom: '-8px', marginTop: '20px' }}>
                          <Col xs={{ span: 10, offset: 0 }} sm={{ span: 10, offset: 0 }} md={{ span: 10, offset: 0 }} lg={{ span: 10, offset: 0 }} xl={{ span: 10, offset: 0 }}> </Col>
                          {/* <Col span={18}>
                            {_renderPrice(v)}
                            <div className="wrap-product-ads-price">
                              <h4>RM {formatMoney((v.price).toString())}</h4>
                              <p style={{ color: 'rgb(169, 212, 111)', margin: '0px' }}>RM {formatMoney((calMonth(v.price)).toString())}/month</p>
                            </div>
                          </Col>
                          <Col span={24} style={{float:'right'}}>
                            {_renderShowHideBtn(v, i)}
                          </Col> */}
                          {/* <Col xs={{ span: 8, offset: 0 }} sm={{ span: 8, offset: 0 }} md={{ span: 4, offset: 10 }} lg={{ span: 4, offset: 10 }} xl={{ span: 4, offset: 10 }}>
                            <RegisterCard button={
                              [<Tooltip title="Register Card"><Button type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: 'rgb(209 ,110, 132)', borderColor: 'rgb(209 ,110, 132)' }}><img src="/assets/CarListingIconMobile/registration-card.png" /></Button></Tooltip>]
                            } registrationUrl={v.registrationUrl ? v.registrationUrl : null} />
                          </Col> */}
                        </Row>
                      </div>
                      <div className="wrap-product-ads-btn-horizontal">
                        <Row gutter={[5, 0]}>
                          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                            <WhatsAppButton mobileNumber={v ? v : null} />
                          </Col>
                          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                            <ContactList companys={v.companys ? v.companys : null} contactPerson={notEmptyLength(v.createdBy) ? v.createdBy : null} />
                          </Col>
                          <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                            <AddCompareProductButton data={v} />
                          </Col>
                          <Col xs={4} sm={8} md={4} lg={4} xl={4}>
                            <Car360ViewButton id={v.xmlUrl ? v._id : null}>
                              <Tooltip title="360&deg; View">
                                <Button type="normal" className={`w-100 ads-purchase-button ${v.xmlUrl ? 'cursor-pointer' : 'cursor-not-allowed '}`} style={{ padding: 0, background: v.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)', borderColor: v.xmlUrl ? 'rgb(85,204,212)' : 'rgb(237, 236, 234)' }}><img src="/assets/profile/icon-list/Ccar-360_1.gif" /></Button>
                              </Tooltip>
                            </Car360ViewButton>
                          </Col>
                          <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                            {
                              _.isArray(v.registrationUrl) && notEmptyLength(v.registrationUrl) ?
                                <RegisterCard key='register' button={
                                  [<Tooltip key='tooltipsregister' title="Registration Card">
                                    <Button type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: 'rgb(209 ,110, 132)', borderColor: 'rgb(209 ,110, 132)' }}><img src="/assets/CarListingIconMobile/registration-card.png" /></Button>
                                  </Tooltip>]
                                } registrationUrl={v.registrationUrl} />
                                :
                                <div className="width-100">
                                  <Tooltip key='tooltipsregister' title="Registration Card">
                                    <Button type="normal" className="width-100 ads-purchase-button cursor-not-allowed" style={{ padding: 0, background: 'rgb(237, 236, 234)', borderColor: 'rgb(237, 236, 234)' }}><img src="/assets/CarListingIconMobile/registration-card.png" /></Button>
                                  </Tooltip>
                                </div>
                            }
                          </Col>
                          <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                            <CalculatorModal key='calculator' button={() => {
                              return <Tooltip placement="top" title={`Calculate This Car Monthly Pay`}>
                                <Button style={{ paddingLeft: '9px', paddingRight: '9px' }} className='width-100' >
                                  <div className='fill-parent flex-items-align-center width-100 flex-justify-center' >
                                    <img src="/assets/profile/icon-list/calculator.png" style={{ width: '19px' }} />
                                  </div>
                                </Button>
                              </Tooltip>
                            }} data={{ price: v.searchPrice, downpayment: v.searchPrice * 0.1, loanPeriod: 9, interestRate: 3 }} />
                          </Col>
                          {/* <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                            <Button type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: 'rgb(237, 236, 234)', borderColor: 'rgb(237, 236, 234)' }}><img src="/assets/CarListingIconMobile/video.png" style={{ width: '40%' }} /></Button>
                          </Col> */}
                          {/* {v.companys.businessCardUrl.length > 0 ?
                                                        ( */}
                          {/* ) : null
                                                    } */}
                        </Row>
                      </div>
                    </Col>

                    <Col span={10}>
                      <div style={{ marginTop: 9 }}>
                        <SellerBusinessCard className="background-white-opacity-40 round-border backdrop-blur" data={v.companys} data1={v.createdBy} />
                      </div>
                    </Col>
                  </Row>
                </Col>

              </Row>
            </div>
          </Col >)
      );
    } else {
      return skeletonLoading ?
        <React.Fragment>
          <Row>
            {
              _.map(_.range(0, 30), function (index) {
                return (
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <ProductListSkeleton />
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
    }
  }

  return (
    <div className={props.className ? props.className : null} style={props.style ? props.style : null} >
      {_renderList(notEmptyLength(productList) ? productList : [])}
    </div>
  );

}

const mapStateToProps = state => ({
  app: state.app,
  user: state.user,
});

const mapDispatchToProps = {
  loading: loading,
  setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProductList)));