import { AutoComplete, Button, Col, Divider, Empty, Input, message, Row, Tabs } from 'antd';
import axios from 'axios';
import _ from "lodash";
import moment from 'moment';
import BannerAnim, { Element } from 'rc-banner-anim';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { bodyTypeOri } from '../../../params/bodyTypeOri';
import { carBrandsList, getCarBrandsIcon } from '../../../params/carBrandsList';
import { withRouter } from 'next/router';
import { loading, updateActiveMenu } from '../../../redux/actions/app-actions';
import Link from 'next/link';
import { fetchBrandDetail, fetchClub, fetchFuel, fetchNewCarFilterGroup, fetchNews, fetchPopularCars } from '../../../redux/actions/newcars-actions';
import client from '../../../feathers';
import GlobalSearchBar from '../../general/global-search-bar';
import LayoutV2 from '../../general/LayoutV2';
import SocialNewTabs from '../../news/social-new-tabs';
import SocialVideoTabs from '../../news/social-video-tabs';
import { formatNumber, isValidNumber, notEmptyLength, queryStringifyNestedObject, arrayLengthCount } from '../../../common-function';

const BgElement = Element.BgElement;
var PAGESIZE = 8
const CARBRANDSSIZE = 8;
const { TabPane } = Tabs;
const { TextArea } = Input;
const image2 = '../BMW2.jpg'
const { Option, OptGroup } = AutoComplete;
const searchBarRef = React.createRef();

const opts = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
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

const CAROUSEL_ITEM_HEIGHT = '500px'
const BODY_TYPE_LENGTH = 8
// const {Option} = Select;
const { Search } = Input;


class NewCarVersion3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            news: [],
            club: [],
            bodyType: 'sedan',
            priceRangeSearch: [],
            popularCars: [],
            availabeCarBrands: [],
            filterCarBrands: [],
            comments: [],
            submitting: false,
            value: '',
            visible: false,
            hideSearchBar: true,
            brandDetail: [],
            filterAnd: {
                $and: [
                    { 'price': { $gte: +(0) } },
                    { 'price': { $lte: +(188763) } }
                ]
            },
            sorting: '',
            fuel: [],
            videoPosition: 0,
            window: {},

        };

        this.filterByBrand = this.filterByBrand.bind(this);
    }

    handleScroll = (e) => {
        this.checkForHiddenSearchBar();
    };

    checkForHiddenSearchBar() {

        if (!searchBarRef || !searchBarRef.current) {
            return;
        } else {
            let data = searchBarRef.current.getBoundingClientRect();
            if (!data.height || !data.y || !this.state.window.innerHeight || !this.props.app) {
                return;
            } else {
                let searchBarHeight = data.height;
                let searchBarPositionY = data.y;
                let windowHeight = this.state.window.innerHeight;
                let menuHeight = isValidNumber(this.props.app.menuHeight) ? parseInt(this.props.app.menuHeight) : 90;
                let minScreenHeight = 0 + menuHeight;
                let maxScreenHeight = windowHeight;

                this.setState({
                    hideSearchBar: (searchBarPositionY + searchBarHeight >= minScreenHeight && searchBarPositionY + searchBarHeight <= maxScreenHeight)
                })
            }
        }
    }

    callback = (key) => {
        if (key == 1) {
            this.setState({
                filterAnd: {
                    $and: [
                        { 'price': { $gte: +(0) } },
                        { 'price': { $lte: +(188763) } }
                    ]
                }
            }, () => this.getData(0))
        } else if (key == 2) {
            this.setState({ sorting: 'year:-1', filterAnd: {} }, () => this.getData(0))
        } else if (key == 3) {
            this.setState({
                filterAnd: {
                    $and: [
                        { 'price': { $gte: +(0) } },
                        { 'price': { $lte: +(188763) } }
                    ]
                },
                sorting: ''
            }, () => this.getData(0))
        } else if (key == 4) {
            this.setState({
                filterAnd: {
                    $and: [
                        { 'price': { $gte: +(0) } },
                        { 'price': { $lte: +(30000) } }
                    ]
                },
                sorting: ''
            }, () => this.getData(0))
        } else if (key == 5) {
            this.setState({
                filterAnd: {
                    $and: [
                        { 'price': { $gte: +(20000) } },
                        { 'price': { $lte: +(60000) } }
                    ]
                },
                sorting: ''
            }, () => this.getData(0))
        } else if (key == 6) {
            this.setState({
                filterAnd: {
                    $and: [
                        { 'price': { $gte: +(60000) } },
                        { 'price': { $lte: +(100000) } }
                    ]
                },
                sorting: ''
            }, () => this.getData(0))
        } else if (key == 7) {
            this.setState({
                filterAnd: {
                    $and: [
                        { 'price': { $gte: +(100000) } },
                    ]
                },
                sorting: ''
            }, () => this.getData(0))
        } else {
            this.setState({ filterAnd: {} }, this.getData(0))
        }
    }

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    getData = (skip) => {

        this.props.loading(true)
        axios.get(`${client.io.io.uri}priceRangeSearchNew`,
            {
                params: {
                    // sorting: this.state.sorting,
                    match: {
                        ...this.state.filterAnd,
                    },
                    newCar: 'yes',
                    limit: PAGESIZE + skip,
                    skip: skip,
                    sorting: this.state.sorting
                }
            }
        ).then((res) => {
            this.props.loading(false);

            if (res.data.data.length > 0) {
                this.props.fetchPopularCars(res.data.data)
            } else {
                this.props.fetchPopularCars([])
            }
            this.props.fetchBrandDetail(res.data.data)
        })
            .catch((err) => {
                this.props.loading(false);
                console.log(err)
                message.error(err.message);
            })
    }

    customfunction() {
        this.props.loading(true)
        client.service('news').find({
            query: {
                $sort: {
                    createdAt: -1
                },
                $limit: 5,
                publisher: { $ne: 'youtube' }
            }
        }).then((res) => {
            this.props.loading(false);
            if (res.data.length > 0) {
                this.props.fetchNews(res.data)
            }
        }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
        });

        this.props.loading(true)
        client.service('news').find({
            query: {
                $sort: {
                    createdAt: -1
                },
                $limit: 6,
                publisher: 'youtube'
            }
        }).then((res) => {
            this.props.loading(false);
            if (res.data.length > 0) {
                this.props.fetchClub(res.data)
            }
        }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
        });
    }

    getFuelPrice() {
        this.props.loading(true)
        client.service('fuelprices').find({
            query: {
                $sort: {
                    createdAt: -1
                },
                name: { $in: ['euro5', 'ron97', 'ron95', 'ron100', 'vpr', 'euro2m'] }
            }
        }).then((res) => {
            this.props.loading(false);
            this.props.fetchFuel(res.data);
        }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
        });
    }

    UNSAFE_componentWillMount() {
        this.customfunction()
        this.callback('5')
        // this.getData(0)
        this.getFuelPrice()

        this.props.updateActiveMenu('1');

        this.props.loading(true)
        axios.get(`${client.io.io.uri}getPriceRangeSearchCarBrands`, {
            params: {
                newCar: 'yes',
            }
        }).then((res) => {
            this.props.loading(false);
            this.setState({ availabeCarBrands: notEmptyLength(res.data.data) ? res.data.data : [] });
        }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
        });


    }

    componentDidMount() {
        this.checkForHiddenSearchBar();
        this.setState({
            window: window,
        })

        let windowHeight = this.state.window.innerHeight;
        let windowWidth = this.state.window.innerWidth;

        let calculateRatio = 100 - parseFloat(parseFloat((1 - ((2400 - windowWidth) / 2400)) * 100).toFixed(0))
        this.setState({
            videoPosition: calculateRatio
        });


    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevState.availabeCarBrands, this.state.availabeCarBrands)) {

            if (notEmptyLength(this.state.availabeCarBrands)) {
                let selectedCarBrands = _.cloneDeep(this.state.availabeCarBrands);
                let data = _.filter(carBrandsList, function (brand) {
                    return _.some(selectedCarBrands, function (item) {
                        return _.toLower(item.make) == _.toLower(brand.value);
                    })
                })
                if (notEmptyLength(data)) {
                    this.setState({
                        filterCarBrands: data,
                    })
                } else {
                    this.setState({
                        filterCarBrands: [],
                    })

                }
            } else {
                this.setState({
                    filterCarBrands: [],
                })
            }
        }

        if (!_.isEqual(prevState.window, this.state.window)) {
            this.state.window.addEventListener('scroll', this.handleScroll, { passive: true });

            return () => {
                this.state.window.removeEventListener('scroll', this.handleScroll);
            };
        }
    }

    filterByBrand(data) {
        if (data) {
            this.props.fetchNewCarFilterGroup({ ...this.props.newCars.newCarFilterGroup, make: _.toLower(data) });
            this.props.router.push('/newcar/filter');
        }
    }

    renderFilterCarsTabs = () => {
        if (arrayLengthCount(_.get(this.props, ['newCars', 'popularCars'])) > 0) {
            return (
                this.props.newCars.popularCars.map(function (item, i) {
                    return (
                        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 22, offset: 1 }} md={{ span: 6, offset: 0 }} lg={{ span: 6, offset: 0 }} xl={{ span: 6, offset: 0 }} key={i}>

                            <Link shallow={false} prefetch href={`/newcar/details/${item.make + '/' + item.model}`} passHref >
                                <a>
                                    <div className="newcars-uniqBy-model cursor-pointer" style={{ height: 320 }} >
                                        <img src={item.uri} style={{ width: '100%', padding: '5px' }}></img>
                                        <div className="newcars-wrap-p">
                                            <p style={{ textTransform: 'capitalize', textAlign: 'center', fontSize: '16px', fontWeight: '600', marginBottom: '0px', color: "rgba(0, 0, 0, 0.65)" }}> {item.make}  {item.model}</p>
                                            <p style={{ textAlign: 'center', color: '#FBB040', fontSize: '16px', fontWeight: 600 }}>
                                                {
                                                    !item.minPrice && !item.maxPrice ?
                                                        'TBC'
                                                        :
                                                        item.minPrice == item.maxPrice ?
                                                            `${item.minPrice ? 'RM ' + formatNumber(item.minPrice) : 'TBC'}`
                                                            :
                                                            `${item.minPrice ? 'RM ' + formatNumber(item.minPrice) : 'TBC'} - ${item.maxPrice ? 'RM ' + formatNumber(item.maxPrice) : 'TBC'}`
                                                }
                                            </p>
                                        </div>
                                    </div>

                                </a>
                            </Link>
                            {/* <div className="car-tab">
                  <img src={item.uri} style={{ width: "100%", padding:'10px'}} />
                  <p className="overlay-car-name" style={{textTransform:'capitalize', textAlign:'center', fontSize:'18px'}}> {item.make} {item.model}</p>
              </div> */}
                        </Col>
                    )
                })
            )
        } else {
            return (
                <div style={{ height: '30em' }}>
                    <Empty
                        style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                        image="/empty.png"
                        imageStyle={{
                            height: 60,
                        }
                        }
                        description={
                            <span>
                                No Result
                            </span>
                        }
                    >
                    </Empty>
                </div>
            )
        }
    }

    _renderCarousel = () => {
        return (
            <div>
                <Tablet>
                    <BannerAnim prefixCls="banner-user" autoPlay>
                        <Element
                            prefixCls="banner-user-elem"
                            key="0"
                        >
                            <BgElement
                                key="bg"
                                className="bg"
                                style={{
                                    backgroundImage: 'url(/banner/770x250.jpg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    maxInlineSize: '-webkit-fill-available'
                                }}
                            />
                        </Element>
                        <Element
                            prefixCls="banner-user-elem"
                            key="web1"
                        >
                            <BgElement
                                onClick={(e) => { this.state.window.location = 'https://ccar.my/banner/duit-duit-giveaway.pdf' }}
                                key="bg"
                                className="bg"
                                style={{
                                    backgroundImage: 'url(/banner/CCAR-Website-Tab-Banner-01.jpg)',
                                    backgroundSize: 'fit',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    maxInlineSize: '-webkit-fill-available'
                                }}
                            />
                        </Element>
                        <Element
                            prefixCls="banner-user-elem"
                            key="1"
                        >
                            <BgElement
                                key="webbg"
                                className="bg"
                            />
                            <video autoPlay style={{
                                // overflow: 'hidden', right: videoPosition 

                                position: 'fixed',
                                right: '0',
                                bottom: '0',
                                minWidth: '100%',
                                minHeight: '100%',
                                transform: 'translateX(calc((100% - 100vw) / 2))'
                            }} >
                                <source src="/banner/ipad-360.mp4" type="video/mp4"></source>
                            </video>
                        </Element>
                        <Element
                            prefixCls="banner-user-elem"
                            key="2"
                        >
                            <BgElement
                                key="webbg"
                                className="bg"
                            />
                            <video autoPlay style={{
                                // overflow: 'hidden', right: videoPosition  
                                position: 'fixed',
                                right: '0',
                                bottom: '0',
                                minWidth: '100%',
                                minHeight: '100%',
                                transform: 'translateX(calc((100% - 100vw) / 2))'

                            }} >
                                <source src="/banner/carfreaks-ipad.mp4" type="video/mp4"></source>
                            </video>
                        </Element>
                    </BannerAnim>
                </Tablet>

                <Mobile>
                    <BannerAnim prefixCls="banner-user-mobile" autoPlay>
                        {/* <Element
                      prefixCls="banner-user-elem"
                      key="0"
                  >
                      <BgElement
                          key="bg"
                          className="bg"
                      style={{backgroundSize:'cover'}}
                      style={{width:'100%', height:'100px'}}
                      />
                      <video
                          autoPlay={false}
                          style={{ maxInlineSize: '-webkit-fill-available' }}  >
                          <source src="/banner/ccar-app-banner_3.mp4" type="video/mp4"></source>
                      </video>
                  </Element> */}
                        <Element
                            prefixCls="banner-user-elem"
                            key="1"
                        >
                            <BgElement
                                key="bg"
                                className="bg"
                                style={{
                                    backgroundImage: 'url(/banner/slogan.png)',
                                    backgroundSize: 'fit',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    maxInlineSize: '-webkit-fill-available'
                                }}
                            />
                        </Element>
                        <Element
                            prefixCls="banner-user-elem"
                            key="2"
                        >
                            <BgElement
                                key="bg"
                                className="bg"
                                style={{
                                    backgroundImage: 'url(/banner/375x100.png)',
                                    backgroundSize: 'fit',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    maxInlineSize: '-webkit-fill-available'
                                }}
                            />
                        </Element>
                    </BannerAnim>
                </Mobile>
            </div>
        );
    };

    _renderCarouselWeb = () => {

        return (
            <BannerAnim prefixCls="banner-user-web" autoPlay>
                <Element
                    prefixCls="banner-user-elem"
                    key="web0"
                >
                    <BgElement
                        key="bg"
                        className="bg"
                        style={{
                            backgroundImage: 'url(/banner/ccar-cny-web-banner.png)',
                            backgroundSize: 'fit',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            maxInlineSize: '-webkit-fill-available'
                        }}
                    />
                </Element>
                <Element
                    prefixCls="banner-user-elem"
                    key="web1"
                >
                    <BgElement
                        onClick={(e) => { this.state.window.location = 'https://ccar.my/banner/duit-duit-giveaway.pdf' }}
                        key="bg"
                        className="bg"
                        style={{
                            backgroundImage: 'url(/banner/duit-duit-3.jpg)',
                            backgroundSize: 'fit',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            maxInlineSize: '-webkit-fill-available'
                        }}
                    />
                </Element>

                {/* <Element
                    prefixCls="banner-user-elem"
                    key="web1"
                >
                    <BgElement
                        key="webbg"
                        className="bg"
                        style={{
                            backgroundImage: 'url(/banner/2560x250-smarter-way-to-find-cars.png)',
                            backgroundSize: 'fit',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            maxInlineSize: '-webkit-fill-available',

                        }}
                    />
                </Element> */}

                <Element
                    prefixCls="banner-user-elem"
                    key="web2"
                >
                    <BgElement
                        key="webbg"
                        className="bg"
                    />
                    <video autoPlay style={{
                        // overflow: 'hidden', right: videoPosition 

                        position: 'fixed',
                        right: '0',
                        bottom: '0',
                        minWidth: '100%',
                        minHeight: '100%',
                        transform: 'translateX(calc((100% - 100vw) / 2))'
                    }} >
                        <source src="/banner/360-web-banner-2560x250.mp4" type="video/mp4"></source>
                    </video>
                </Element>

                <Element
                    prefixCls="banner-user-elem"
                    key="web3"
                >
                    <BgElement
                        key="webbg"
                        className="bg"
                    />
                    <video autoPlay style={{
                        // overflow: 'hidden', right: videoPosition  
                        position: 'fixed',
                        right: '0',
                        bottom: '0',
                        minWidth: '100%',
                        minHeight: '100%',
                        transform: 'translateX(calc((100% - 100vw) / 2))'

                    }} >
                        <source src="/banner/2560x250-4.mp4" type="video/mp4"></source>
                    </video>
                </Element>
            </BannerAnim>);
        // <BannerAnim prefixCls="banner-user-web" autoPlay>
        //   <Element
        //     prefixCls="banner-user-elem"
        //     key="web0"
        //   >
        //     <BgElement
        //       key="bg"
        //       className="bg"
        //       style={{ width: '100%', height: '100px' }}
        //     />

        //     <video autoPlay style={{ maxInlineSize: '-webkit-fill-available' }}   >
        //       <source src="/banner/ccar-banner.mp4" type="video/mp4"></source>
        //     </video>
        //   </Element>
        //   <Element
        //     prefixCls="banner-user-elem"
        //     key="web1"
        //   >
        //     <BgElement
        //       key="bg"
        //       className="bg"
        //       style={{
        //         backgroundImage: 'url(/banner/slogan-banner-2.png)',
        //         backgroundSize:'fit',
        //         backgroundPosition: 'center',
        //         backgroundRepeat: 'no-repeat',
        //         maxInlineSize: '-webkit-fill-available'
        //       }}
        //     />
        //   </Element>
        //   <Element
        //     prefixCls="banner-user-elem"
        //     key="web2"
        //   >
        //     <BgElement
        //       key="webbg"
        //       className="bg"
        //       style={{
        //         backgroundImage: 'url(/banner/banner-2.png)',
        //         backgroundSize:'fit',
        //         backgroundPosition: 'center',
        //         backgroundRepeat: 'no-repeat',
        //         maxInlineSize: '-webkit-fill-available',

        //       }}
        //     />
        //   </Element>
        //   <Element
        //     prefixCls="banner-user-elem"
        //     key="web3"
        //   >
        //     <BgElement
        //       key="webbg"
        //       className="bg"
        //     />
        //     <video autoPlay style={{ maxInlineSize: '-webkit-fill-available' }} >
        //       <source src="/banner/banner-3.mp4" type="video/mp4"></source>
        //     </video>
        //   </Element>
        // </BannerAnim>);
    }

    _renderCarBrandsList = (data) => {
        if (notEmptyLength(data)) {
            if (data.length > CARBRANDSSIZE) {
                data = _.slice(data, 0, CARBRANDSSIZE);
            }
            let self = this;
            return (
                <Row className="col-centered">
                    {
                        data.map(function (item) {
                            return (
                                <Col xs={4} sm={4} md={2} lg={2} xl={2} className="col-centered" style={{ margin: '0px 10px' }}>
                                    <Link shallow={false} prefetch href={`/newcar/maker/${_.toLower(item.value)}`} passHref>
                                        <a>
                                            <div className="wrap-newCar-brand cursor-pointer" onClick={(e) => { self.filterByBrand(item.value); }}>
                                                <img src={getCarBrandsIcon(_.toLower(item.value))} className="type w-100" />
                                                <p>{_.capitalize(item.value)}</p>
                                            </div>
                                        </a>
                                    </Link>
                                </Col>
                            )
                        })
                    }
                    <Col xs={4} sm={4} md={2} lg={2} xl={2} className="col-centered" style={{ margin: '0px 10px' }}>
                        <div className="wrap-newCar-brand">
                            <Link shallow={false} prefetch href={'/newcar/filter'} passHref >
                                <a>
                                    <img src="/assets/add file.png" style={{ width: '70%' }} className="type" />
                                    <p>More</p>
                                </a>
                            </Link>
                        </div>
                    </Col>
                </Row>
            )
        } else {
            return (
                <Row className="col-centered">
                    <Col span={24} className="col-centered" style={{ margin: '0px 10px' }}>
                        <Empty></Empty>
                    </Col>
                </Row>
            )
        }
    };

    render() {
        return (
            <LayoutV2 hideSearchBar={this.state.hideSearchBar}>
                <Row className="banner-newcar">
                    <Col xs={24} sm={24} md={24} lg={0} xl={0} >
                        {this._renderCarousel()}
                    </Col>
                    <Col xs={0} sm={0} md={0} lg={24} xl={24} >
                        {this._renderCarouselWeb()}
                    </Col>
                </Row>

                <Desktop>
                    <div className="section">
                        <div className="container" style={{ touchAction: 'pan-y' }}>
                            <Row>
                                <Col span={24} className="overlay-search-bar text-align-center certain-category-search ">
                                    <Row >
                                        <Col xs={{ span: 12, offset: 6 }} sm={{ span: 12, offset: 6 }} md={{ span: 10, offset: 7 }} lg={{ span: 10, offset: 7 }} xl={{ span: 10, offset: 7 }}  >
                                            <div ref={searchBarRef}>
                                                <GlobalSearchBar searchTypes={this.props.searchTypes || ['productAds', 'carspec', 'dealerWithAds']} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="background-white margin-right-xl margin-left-xl  padding-top-md ">
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div className="brand-header">
                                        <Tabs defaultActiveKey="1" >
                                            <TabPane tab="Car Maker" key="parent1">
                                                {this._renderCarBrandsList(notEmptyLength(this.state.filterCarBrands) ? this.state.filterCarBrands : [])}
                                            </TabPane>

                                            <TabPane tab="Body Type" key="parent2">
                                                {bodyTypeOri.map((v, i) => {
                                                    if (i > 0) {
                                                        return (
                                                            <Col className="cartype" style={{ marginRight: '10px' }} xs={6} sm={6} md={2} lg={3} xl={2} key={i}>
                                                                <div className="type cursor-pointer" onClick={() => {
                                                                    this.setState({ bodyType: (v.value).toLowerCase() }
                                                                        // ,()=>this.getData(0) 
                                                                    );
                                                                    this.props.router.push(`/newcar/filter?${queryStringifyNestedObject({ bodyType: v.value.toLowerCase() })}`)
                                                                }
                                                                }>
                                                                    <img src={v.icon} />
                                                                    <p style={{ marginTop: '-12px', textAlign: 'center', fontWeight: '700', textTransform: 'capitalize', marginBottom: '0px' }}> {v.value} </p>
                                                                </div>
                                                                {/* <p style={{color:'black', textAlign:'center', paddingTop:'10px'}}> {v.value}</p> */}
                                                            </Col>
                                                        )
                                                    }
                                                })}
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="background-white margin-right-xl margin-left-xl ">
                                <Col className="gutter-row" span={24} className="margin-bottom-sm margin-top-sm text-align-center yellow-divider">
                                    <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} > All NEW CARS</span> </Divider>
                                    {/* <span style={{float:'right', marginRight:'10px'}}> <Link shallow={false} prefetch href={'/newcar/filter'}>See More</Link> </span> */}
                                </Col>
                                <Col span={24}>
                                    <div className="brand-header">
                                        <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={<Link shallow={false} prefetch href={'/newcar/filter'} passHref>
                                            <a>See More</a></Link>}>
                                            {/* <TabPane tab="Popular Cars" key="1">
                    <Row>
                      {this.renderFilterCarsTabs()}
                    </Row>
                  </TabPane>

                  <TabPane tab="Latest Car" key="2">
                    <Row>
                      {this.renderFilterCarsTabs()}
                    </Row>
                  </TabPane>

                  <TabPane tab="Recommended" key="3">
                    <Row>
                      {this.renderFilterCarsTabs()}
                    </Row>
                  </TabPane> */}

                                            {/* <TabPane tab="Below RM30K" key="4">
                        <Row>
                          {this.renderFilterCarsTabs()}
                        </Row>
                      </TabPane> */}

                                            <TabPane tab="RM20K - RM60K" key="5">
                                                <Row>
                                                    {this.renderFilterCarsTabs()}
                                                </Row>
                                            </TabPane>

                                            <TabPane tab="RM60K - RM100K" key="6">
                                                <Row>
                                                    {this.renderFilterCarsTabs()}
                                                </Row>
                                            </TabPane>

                                            <TabPane tab="Over RM100K" key="7">
                                                <Row>
                                                    {this.renderFilterCarsTabs()}
                                                </Row>
                                            </TabPane>
                                            {/* <div className="faen">
                    <a href="#">See More</a>
                  </div> */}
                                        </Tabs>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="background-white margin-right-xl margin-left-xl">
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-xl">
                                    <Row>
                                        <Col className="gutter-row" span={24} className="margin-bottom-sm margin-top-sm text-align-center yellow-divider ">
                                            <Divider><span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >SOCIAL VIDEOS</span></Divider>
                                        </Col>
                                        <Col span={24} style={{ overflowX: 'auto' }}>
                                            <SocialVideoTabs />
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                                            <a href="/socialNewsAndVideo?type=videos"><Button type="primary"> Show More </Button></a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="background-white margin-right-xl margin-left-xl ">
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-xl">
                                    <Row>
                                        <Col className="gutter-row" span={24} className="margin-bottom-sm margin-top-sm text-align-center yellow-divider">
                                            <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >SOCIAL NEWS</span></Divider>
                                        </Col>
                                        <Col span={24} >
                                            <SocialNewTabs />
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                                            <a href="/socialNewsAndVideo"><Button type="primary"> Show More </Button></a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* <Row className="background-white margin-right-xl margin-left-xl ">
              <Desktop>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-xl padding-bottom-md">
                  <Row>
                    <Col className="gutter-row" span={24} className="margin-bottom-sm margin-top-sm text-align-center yellow-divider">
                      <Divider><span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >USER REVIEWS</span></Divider>
                    </Col>
                    <Col span={24} >
                      <CarMakeReviewList />
                    </Col>
                  </Row>
                </Col>
              </Desktop>
            </Row> */}
                        </div>
                    </div>
                </Desktop>

            </LayoutV2>
        );
    }
}

const mapStateToProps = state => ({
    newCars: state.newcars || state.newCars,
    app: state.app,
});

const mapDispatchToProps = {
    loading: loading,
    fetchNews: fetchNews,
    fetchClub: fetchClub,
    fetchPopularCars: fetchPopularCars,
    fetchBrandDetail: fetchBrandDetail,
    updateActiveMenu: updateActiveMenu,
    fetchFuel: fetchFuel,
    fetchNewCarFilterGroup: fetchNewCarFilterGroup,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewCarVersion3));