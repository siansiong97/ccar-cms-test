import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Empty, Form, Icon, message, Pagination, Radio, Row, Select, Switch, Tooltip } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import client from '../../feathers';
import { getCarBrand } from '../../params/carBrandsList';
import {
    filterBodyTypes, filterCarBrandMode, filterCarBrands, filterCarModelMode, filterCarModels, filterCarSearchKeywords, filterColors,
    filterDrivenWheels,
    filterFuelTypes,
    filterStates, loading,
    quickSearchProductsList,
    setApplyMileage, setApplyPrice, setApplyYear, updateActiveMenu
} from '../../redux/actions/app-actions';
import { convertParameterToProductListUrl, formatNumber, notEmptyLength, objectRemoveEmptyValue } from '../../common-function';
import GridProductList from '../product-list/grid-product-list';
import ProductList from '../product-list/ProductList';
import { fetchProductsList, updateActiveIdProductList  } from '../../redux/actions/productsList-actions';
import { withRouter } from 'next/router';



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

const PAGESIZE = 30;
const adsverImg = '/buy-car-ads.png'

const filterTypes = ['make', 'model'];

const UserCarOnSale = (props) => {

    const [moreOptionModalVisible, setMoreOptionModalVisible] = useState(false)
    const [profile, setProfile] = useState({});
    const [productLoading, setProductLoading] = useState(false)
    const [view, setView] = useState('gridView')
    const [productList, setProductList] = useState([])
    const [filterGroup, setFilterGroup] = useState({})
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [mainConfig, setMainConfig] = useState({
        sorting: {},
        page: 1,
    })
    const [total, setTotal] = useState(0)
    const [availableFilterOptions, setAvailableFilterOptions] = useState({});



    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }
    }, [props.data])


    useEffect(() => {

    }, [availableFilterOptions])

    // useEffect(() => {

    //     // Bind the event listener
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         // Unbind the event listener on clean up
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isDropDownOpen])

    useEffect(() => {
        if (_.isPlainObject(profile) && !_.isEmpty(profile)) {
            if (_.get(mainConfig, ['page']) == 1) {
                getData();
                getAvailableOptions();
            } else {
                setMainConfig({ ...mainConfig, page: 1 })
            }
        } else {
            setProductList([]);
        }
    }, [filterGroup, profile])

    useEffect(() => {
        getData();
    }, [mainConfig])

    function scrollToCarOnSale() {
        var elmnt = document.getElementById("user-car-on-sale-container");
        var offset = -100;
        var elementPosition = _.get(elmnt.getBoundingClientRect(), ['top']) || 0;
        var offsetPosition = elementPosition - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    function pushParameterToUrl(data, config) {

        let path = convertParameterToProductListUrl(data, config)
        if (path != `${props.location.pathname}${props.location.search}`) {
            props.loading(true);
            props.router.replace(path)
        }

    }

    // function handleClickOutside(event) {

    //     if ((!containerRef.current || !containerRef.current.contains(event.target))) {
    //         setMoreOptionModalVisible(false)
    //     }
    // }

    function getData() {
        //     let query = queryString.parse(props.location.search);
        //   if (!query) {
        //     query = {};
        //   }
        //     let sorting = query.sorting ? JSON.parse(query.sorting) : { createdAt: -1 };
        //     let config = {
        //         page: query.page,
        //         view: query.view,
        //         sorting: sorting
        //       }
        if (_.get(profile, ['_id'])) {
            let sorting = _.cloneDeep(objectRemoveEmptyValue(mainConfig.sorting));
            if (_.isPlainObject(_.pick(sorting, ['searchPrice', 'mileageFilter', 'carspec.year'])) && !_.isEmpty(_.pick(sorting, ['searchPrice', 'mileageFilter', 'carspec.year']))) {
            } else {
                sorting = {}
            }
            props.loading(true);
            let match = { $match: { ...objectRemoveEmptyValue(filterGroup), 'createdBy': _.get(profile, ['_id']) } }
            axios.get(`${client.io.io.uri}carAdsFilterV3`,
                {
                    params: {
                        match,
                        sorting: sorting,
                        limit: PAGESIZE,
                        skip: (mainConfig.page - 1) * PAGESIZE,
                    }
                }
            ).then((res) => {
                props.loading(false);
                if (notEmptyLength(res.data.data)) {
                    setProductList(res.data.data)
                    setTotal(res.data.total);
                } else {
                    setProductList([])
                    setTotal(0);
                }
            })
                .catch((err) => {
                    props.loading(false);
                    message.error(err.message);
                })
        }

        // if (!filterGroup.state) {
        //      setMainConfig(config);
        //     return null;
        //   }

    }

    function getAvailableOptions() {
        if (_.get(profile, ['_id'])) {
            let promises = [];
            let match = { $match: { ...objectRemoveEmptyValue(filterGroup), 'createdBy': _.get(profile, ['_id']) } }
            _.forEach(filterTypes, function (filterType) {
                promises.push(
                    axios.get(`${client.io.io.uri}brandFilterTotalV3`, {
                        params: { filterType: filterType, match },
                        headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] }
                    })
                )
            })

            Promise.all(promises).then((responses) => {
                if (_.isArray(responses) && !_.isEmpty((responses))) {
                    let options = {}
                    _.forEach(responses, function (response, index) {
                        options[`${filterTypes[index]}List`] = response.data.uniqueInfo[`${filterTypes[index]}List`];
                    })


                    setAvailableFilterOptions(options)
                }
            }).catch((err) => {
                // message.error(err.message);
            })
        }

    }

    const _renderGridView = () => {

        if (notEmptyLength(productList)) {
            if (view == 'gridView') {
                return (
                    <GridProductList data={productList} xs={24} sm={24} md={8} lg={8} xl={8}
                    />

                )
            } else {
                return (
                    <ProductList data={productList} />
                )
            }
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

    const _renderCarOnSale = () => {
        return (
            <Row style={{ minHeight: 800 }}>
                {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="flex-justify-end flex-items-align-center">
                        <Radio.Group onChange={(e) => { setView(e.target.value) }} defaultValue="gridView" className="wrap-gridView-btn">
                            <Radio.Button value="listView"><BarsOutlined style={{ fontSize: '16px', paddingRight: '5px' }} /></Radio.Button>
                            <Radio.Button value="gridView"><AppstoreOutlined style={{ fontSize: '16px', paddingRight: '5px' }} /></Radio.Button>
                        </Radio.Group>
                    </div>
                </Col> */}

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="thin-border round-border-light padding-sm">
                        <Row gutter={[10, 10]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="flex-justify-space-between">
                                    <span className='d-inline-block h6' >
                                        <span>{total} </span>
                                        <span>Cars for Sale</span>
                                    </span>
                                    <span className='flex-items-align-center flex-justify-space-around ' >
                                        <span className='flex-items-align-center margin-right-md' >
                                            <span className="margin-right-md" >
                                                Reg Card:
                                            </span>
                                            <Switch checked={filterGroup.registrationUrl} onChange={(checked) => { props.loading(true); setFilterGroup({ ...filterGroup, registrationUrl: checked }); }} />
                                        </span>

                                        <span className='flex-items-align-center margin-right-md' >
                                            <span className="margin-right-md" >
                                                Ready Stock:
                                            </span>
                                            <Switch checked={filterGroup.readyStock} onChange={(checked) => { props.loading(true); setFilterGroup({ ...filterGroup, readyStock: checked ? 'yes' : null }); }} />
                                        </span>
                                        <span className='flex-items-align-center margin-right-md' >
                                            <span className="margin-right-md" >
                                                360&deg; View:
                                            </span>
                                            <Switch checked={filterGroup.car360View} onChange={(checked) => { props.loading(true); setFilterGroup({ ...filterGroup, car360View: checked }); }} />
                                        </span>
                                    </span>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Divider type="horizontal" style={{ margin: 0 }} />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                <div className="flex-justify-space-between flex-items-align-center">
                                    <span className='d-inline-block' >
                                        <Select allowClear value={_.get(filterGroup, ['make'])}
                                            style={{ width: 120 }}
                                            className="margin-right-md"
                                            dropdownMatchSelectWidth={false} placeholder="Brand"
                                            onChange={(value) => {
                                                setFilterGroup({ ...filterGroup, make: _.toLower(value) || undefined, model: undefined })
                                            }}
                                        >
                                            {
                                                _.map(_.isArray(_.get(availableFilterOptions, ['makeList'])) && !_.isEmpty(_.get(availableFilterOptions, ['makeList'])) ? _.sortBy(_.get(availableFilterOptions, ['makeList']), 'value') : [], function (item) {
                                                    return (
                                                        <Select.Option value={_.get(item, ['value'])} className="capitalize">
                                                            {_.get(getCarBrand(_.get(item, ['value'])), ['value']) || _.get(item, ['value']) || ''} ({formatNumber(_.get(item, ['count']), 'auto', true, 0, true) || 0})
                                                        </Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <Select allowClear value={_.get(filterGroup, ['model'])}
                                            style={{ width: 120 }}
                                            dropdownMatchSelectWidth={false} placeholder="Model"
                                            onChange={(value) => {
                                                setFilterGroup({ ...filterGroup, model: _.toLower(value) || undefined })
                                            }}
                                            disabled={!filterGroup.make}
                                        >
                                            {
                                                _.map(_.isArray(_.get(availableFilterOptions, ['modelList'])) && !_.isEmpty(_.get(availableFilterOptions, ['modelList'])) ? _.sortBy(_.get(availableFilterOptions, ['modelList']), 'value') : [], function (item) {
                                                    return (
                                                        <Select.Option value={_.get(item, ['value'])} className="capitalize">
                                                            {_.get(item, ['value']) || ''} ({formatNumber(_.get(item, ['count']), 'auto', true, 0, true) || 0})
                                                        </Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </span>
                                    <span className="flex-items-align-center flex-justify-space-around">
                                        <span className='flex-justify-center flex-items-align-center margin-x-sm' >
                                            <span className='d-inline-block ' >
                                                Year
                              </span>
                                            <span className='flex-justify-center flex-items-align-center'>
                                                {
                                                    _.get(mainConfig, ['sorting', 'carspec.year']) == 1 ?
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, 'carspec.year': null, }, page: 1 }) }}
                                                        ></img>
                                                        :
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high_default.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, 'carspec.year': 1 }, page: 1 }) }} ></img>
                                                }

                                                {
                                                    _.get(mainConfig, ['sorting', 'carspec.year']) == -1 ?
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, 'carspec.year': null, }, page: 1 }) }}></img>
                                                        :
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low_default.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, 'carspec.year': -1 }, page: 1 }) }}></img>
                                                }
                                            </span>
                                        </span>

                                        <span className='flex-justify-center flex-items-align-center margin-x-sm' >
                                            <span className='d-inline-block ' >
                                                Price
                              </span>
                                            <span className='flex-justify-center flex-items-align-center'>
                                                {
                                                    _.get(mainConfig, ['sorting', 'searchPrice']) == 1 ?
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, searchPrice: null, }, page: 1 }) }}
                                                        ></img>
                                                        :
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high_default.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, searchPrice: 1 }, page: 1 }) }} ></img>
                                                }

                                                {
                                                    _.get(mainConfig, ['sorting', 'searchPrice']) == -1 ?
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, searchPrice: null, }, page: 1 }) }}></img>
                                                        :
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low_default.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, searchPrice: -1 }, page: 1 }) }}></img>
                                                }
                                            </span>
                                        </span>

                                        <span className='flex-justify-center flex-items-align-center margin-x-sm' >
                                            <span className='d-inline-block ' >
                                                Mileage
                              </span>
                                            <span className='flex-justify-center flex-items-align-center'>
                                                {
                                                    _.get(mainConfig, ['sorting', 'mileageFilter']) == 1 ?
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, mileageFilter: null, }, page: 1 }) }}
                                                        ></img>
                                                        :
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high_default.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, mileageFilter: 1 }, page: 1 }) }} ></img>
                                                }

                                                {
                                                    _.get(mainConfig, ['sorting', 'mileageFilter']) == -1 ?
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, mileageFilter: null, }, page: 1 }) }}></img>
                                                        :
                                                        <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low_default.png" className="cursor-pointer" onClick={(e) => { setMainConfig({ sorting: { ...mainConfig.sorting, mileageFilter: -1 }, page: 1 }) }}></img>
                                                }
                                            </span>
                                        </span>

                                        <span className='d-inline-block ' >
                                            <Tooltip title="Reset Sorting">
                                                <Button
                                                    style={{
                                                        border: 'none',
                                                        background: 'none',
                                                        color: 'red',
                                                        padding: 0,
                                                        fontSize: 12,
                                                        fontWeight: 500
                                                    }} className="w-100 h-100"
                                                    onClick={(e) => { setMainConfig({ sorting: {}, page: 1 }) }} >

                                                    <Icon type="reload" />
                                                </Button>
                                            </Tooltip>
                                        </span>
                                    </span>
                                </div>
                            </Col>

                            <Col xs={0} sm={0} md={{ span: 0 }} lg={{ span: 0 }} xl={{ span: 4 }} style={{ float: 'right' }}>
                                <Radio.Group onChange={(e) => { setView(e.target.value) }} value={view} className="wrap-gridView-btn" style={{ float: 'right' }}>
                                    <Tooltip title="List View"><Radio.Button value="listView"><BarsOutlined style={{ fontSize: '14px' }} /> </Radio.Button></Tooltip>
                                    <Tooltip title="Grid View"><Radio.Button value="gridView"><AppstoreOutlined style={{ fontSize: '14px' }} /> </Radio.Button></Tooltip>
                                </Radio.Group>
                            </Col>
                        </Row>
                    </div>

                </Col>
                <Col span={24} className="margin-top-lg">
                    <Row gutter={[10, 10]}>
                            {_renderGridView()}
                    </Row>
                </Col>
            </Row>
        )
    }

    return (
        <Row type="flex" align="start" justify="center" gutter={[20, 10]}>
            <Col xs={{ order: 1, span: 24 }} sm={{ order: 1, span: 24 }} md={{ order: 1, span: 24 }} lg={{ order: 1, span: 24 }} xl={{ order: 1, span: 24 }} >
                <div id="user-car-on-sale-container" style={{ minHeight: "1000px", padding: '0px' }}>
                    {_renderCarOnSale()}
                </div>
                <Row gutter={[10, 10]}>
                    <Col className="margin-md" style={{ textAlign: 'center' }} span={24}>
                        <Pagination current={mainConfig.page} defaultCurrent={1} pageSize={PAGESIZE} onChange={(page) => { scrollToCarOnSale(); setMainConfig({ ...mainConfig, page: page }) }} total={total} />
                    </Col>
                </Row>
            </Col>
        </Row>
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
    loading: loading,
    updateActiveMenu: updateActiveMenu,
    fetchProductsList: fetchProductsList,
    updateActiveIdProductList: updateActiveIdProductList,
    filterCarBrandMode: filterCarBrandMode,
    filterCarModelMode: filterCarModelMode,
    filterCarSearchKeywords: filterCarSearchKeywords,
    quickSearchProductsList: quickSearchProductsList,
    setApplyYear: setApplyYear,
    setApplyPrice: setApplyPrice,
    setApplyMileage: setApplyMileage,

    filterCarBrands: filterCarBrands,
    filterCarModels: filterCarModels,
    filterColors: filterColors,
    filterBodyTypes: filterBodyTypes,
    filterDrivenWheels: filterDrivenWheels,
    filterFuelTypes: filterFuelTypes,
    filterStates: filterStates
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserCarOnSale)));