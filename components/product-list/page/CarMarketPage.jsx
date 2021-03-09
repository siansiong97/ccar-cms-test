import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { Affix, Breadcrumb, Button, Col, Divider, Empty, Icon, Pagination, Radio, Row, Spin, Switch, Tooltip } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import { withRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { convertParameterToProductListUrl, notEmptyLength, isValidNumber } from '../../../common-function'
import LayoutV2 from '../../../components/general/LayoutV2'
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper'
import GridProductList from '../../../components/product-list/grid-product-list'
import ProductList from '../../../components/product-list/ProductList'
import ProductListFilterForm from '../../../components/product-list/ProductListFilterForm'
import client from '../../../feathers'
import { loading } from '../../../redux/actions/app-actions'
import { getCarBrand } from '../../../params/carBrandsList'
import GridProductSkeleton from '../../skeleton-loader/GridProductSkeleton'
import queryString from 'query-string';
import carAdsFilter from '../../../api/carAdsFilter'
import brandFilterTotal from '../../../api/brandFilterTotal'
import { setProductListLoading } from '../../../redux/actions/productsList-actions'


const modals = ['make', 'model', 'state', 'area', 'bodyType', 'color', 'fuelType'];
const antIcon = <img src="/assets/Ccar-logo.png" style={{ fontSize: 60 }} />;
const PAGESIZE = 30;
const searchBarRef = React.createRef();
const CarMarketPage = (props) => {


    const [mainConfig, setMainConfig] = useState(props.config || {
        page: 1,
        sorting: {},
        view: 'gridView',
    })
    const [view, setView] = useState('gridView')
    const [currentFilterGroup, setCurrentFilterGroup] = useState(props.filterGroup || {})
    const [availableFilterOption, setAvailableFilterOption] = useState(props.availableOptions || {})
    const [total, setTotal] = useState(props.productListTotal || 0)
    const [productList, setProductList] = useState(props.productList || [])
    const [spinning, setSpinning] = useState(false)
    const [isEmptyData, setIsEmptyData] = useState(false);
    const [initRan, setInitRan] = useState({
        filterGroup: false,
        config: false,
    });

    useEffect(() => {

        setInitRan({
            filterGroup: true,
            config: true,
        })
    }, [])

    useEffect(() => {
        if (initRan.filterGroup && initRan.config) {
            getUrlData();
        }
    }, [props.router.query])


    useEffect(() => {

        if (initRan.filterGroup && initRan.config) {
            props.setProductListLoading(true);
            if (window) {
                window.scroll(0, 0)
            }
            carAdsFilter({
                filterGroup: currentFilterGroup,
                config: mainConfig
            }, PAGESIZE).then(res => {
                props.setProductListLoading(false);
                setProductList(_.get(res, ['data']) || []);
                setTotal(_.get(res, ['total']) || 0);

            }).catch(err => {
                props.setProductListLoading(false);
            });
            brandFilterTotal(modals, {
                filterGroup: currentFilterGroup,
                config: mainConfig
            }).then(res => {
                setAvailableFilterOption(res);

            }).catch(err => {
            });
        }
    }, [currentFilterGroup, mainConfig])

    useEffect(() => {
        setTimeout(() => {

            let productList2 = _.cloneDeep(productList)

            let inputProductList = _.map(productList2, function (v) {
                v.productAdsId = v._id
                return { productAdsId: v.productAdsId }
            });

            if (_.isEmpty(inputProductList) === false) {
                axios.post(`${client.io.io.uri}processImpression`,
                    {
                        params: {
                            productList: inputProductList,
                            source: 'web',
                        }
                    }).then((res) => { })
            }
        },
            3000);

    }, [productList])

    function pushParameterToUrl(data, config) {

        try {
            let path = convertParameterToProductListUrl(data, config)
            let asPath = path.split('?')[0].split('/');
            asPath = _.map(asPath, function (item, i) {
                if (i > 1) {
                    item = `[parameter${i - 1}]`
                }
                return item;
            })
            asPath = asPath.join('/')
            setProductList([]);
            props.setProductListLoading(true);
            props.router.push(asPath, path, { shallow: false })
        } catch (error) {

        }

    }

    function getUrlData() {
        try {
            let querySearch = props.router.asPath.split('?')[1];
            let query = queryString.parse(querySearch);
            if (!query) {
                query = {};
            }

            let filterGroup = query.data ? JSON.parse(query.data) : {};
            let sorting = query.sorting ? JSON.parse(query.sorting) : {};
            let config = {
                page: query.page,
                sorting: sorting,
                view: query.view,
            }

            if (!isValidNumber(parseInt(config.page))) {
                config.page = 1;
            }

            if (!_.get(config, ['sorting', 'carspec.year']) && !_.get(config, ['sorting', 'mileageFilter']) && !_.get(config, ['sorting', 'searchPrice'])) {
                config.sorting = {};
            }
            if (_.get(config, ['view']) != 'gridView' && _.get(config, ['view']) != 'listView') {
                config.view = 'gridView';
            }
            setMainConfig(config);


            //Only state need to check manually;
            let state = props.router.asPath.split('?')[0].split('/');
            state = state[state.length - 1]

            let stateArr = state.split('_');

            filterGroup.state = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [1]) || '' : '';
            filterGroup.area = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [2]) || '' : '';


            if (filterGroup.priceRange) {
                filterGroup.priceRange = convertRangeFormatBack(filterGroup.priceRange)
            }
            if (filterGroup.yearRange) {
                filterGroup.yearRange = convertRangeFormatBack(filterGroup.yearRange)
            }
            if (filterGroup.mileageRange) {
                filterGroup.mileageRange = convertRangeFormatBack(filterGroup.mileageRange)
            }
            if (filterGroup.engineCapactityRange) {
                filterGroup.engineCapactityRange = convertRangeFormatBack(filterGroup.engineCapactityRange)
            }

            setCurrentFilterGroup({
                ...currentFilterGroup,
                ...filterGroup,
            });

        } catch (error) {
            console.log('error', error);
        }
    }

    const _renderGridView = (data) => {
        if (notEmptyLength(data)) {
            if (mainConfig.view == 'gridView') {
                return (
                    <GridProductList data={data} xs={24} sm={12} md={12} lg={8} xl={8} loading={_.get(props.productsList, ['productListLoading'])} />
                )
            } else {
                return (
                    <ProductList data={data} loading={_.get(props.productsList, ['productListLoading'])} />
                )
            }
        } else {
            return (

                <React.Fragment>
                    {
                        _.get(props.productsList, ['productListLoading']) ?
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
                    }
                </React.Fragment>
            );
        }
    }

    return (
        <LayoutV2>
            <div className="section">
                <div className="container">
                    <Spin indicator={antIcon} spinning={spinning} indicator={
                        <img src="/loading.gif" style={{ width: 100, height: 100, position: 'sticky', position: '-webkit-sticky', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} />
                    }>
                        <Row gutter={[{ xs: 8, sm: 8, md: 15, lg: 15, xl: 15 }, 16]}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={18} xl={18}>
                                <div className="flex-justify-space-between flex-items-align-center">
                                    <span className='d-inline-block ' >
                                        <Breadcrumb>
                                            <Breadcrumb.Item>
                                                <Link shallow={false} prefetch passHref href="/">
                                                    <a>Home</a>
                                                </Link>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <Link shallow={false} prefetch passHref href={convertParameterToProductListUrl()} >
                                                    <a>Product List</a>
                                                </Link>
                                            </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </span>
                                    <span className='d-inline-block ' >
                                        <Radio.Group onChange={(e) => { pushParameterToUrl(currentFilterGroup, { ...mainConfig, view: e.target.value }) }} value={_.get(mainConfig, 'view') || 'gridView'} className="wrap-gridView-btn" style={{ float: 'right' }}>
                                            <Tooltip title="List View"><Radio.Button value="listView"><BarsOutlined style={{ fontSize: '14px' }} /> </Radio.Button></Tooltip>
                                            <Tooltip title="Grid View"><Radio.Button value="gridView"><AppstoreOutlined style={{ fontSize: '14px' }} /> </Radio.Button></Tooltip>
                                        </Radio.Group>
                                    </span>
                                </div>

                                <div className="thin-border round-border-light padding-sm margin-top-md">
                                    <Row gutter={[10, 10]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <div className="flex-justify-space-between">
                                                <span className='d-inline-block h6' >
                                                    <span>{total} </span>
                                                    <span>{_.capitalize(_.get(getCarBrand(_.get(currentFilterGroup, ['make'])), ['value']) || '')} </span>
                                                    <span>{_.capitalize(_.get(currentFilterGroup, ['model']) || '')} </span>
                                                    <span>Cars in CarMarket </span>
                                                </span>
                                                <span className='flex-items-align-center flex-justify-space-around ' >
                                                    <span className='flex-items-align-center margin-right-md' >
                                                        <span className="margin-right-md" >
                                                            Reg Card:
                              </span>
                                                        <Switch checked={currentFilterGroup.registrationUrl} onChange={(checked) => { setCurrentFilterGroup({ ...currentFilterGroup, registrationUrl: checked }); pushParameterToUrl({ ...currentFilterGroup, registrationUrl: checked }, { ...mainConfig, page: 1 }) }} />
                                                    </span>

                                                    <span className='flex-items-align-center margin-right-md' >
                                                        <span className="margin-right-md" >
                                                            Ready Stock:
                              </span>
                                                        <Switch checked={currentFilterGroup.readyStock} onChange={(checked) => { setCurrentFilterGroup({ ...currentFilterGroup, readyStock: checked ? 'yes' : null }); pushParameterToUrl({ ...currentFilterGroup, readyStock: checked ? 'yes' : null }, { ...mainConfig, page: 1 }) }} />
                                                    </span>
                                                    <span className='flex-items-align-center margin-right-md' >
                                                        <span className="margin-right-md" >
                                                            360&deg; View:
                              </span>
                                                        <Switch checked={currentFilterGroup.car360View} onChange={(checked) => { setCurrentFilterGroup({ ...currentFilterGroup, car360View: checked }); pushParameterToUrl({ ...currentFilterGroup, car360View: checked }, { ...mainConfig, page: 1 }) }} />
                                                    </span>
                                                </span>
                                            </div>
                                        </Col>

                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Divider type="horizontal" style={{ margin: 0 }} />
                                        </Col>

                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginTop: '-10px', marginBottom: '-10px' }}>
                                            <div className="flex-justify-space-between flex-items-align-center">
                                                <span className='d-inline-block' >
                                                    <Radio.Group
                                                        className="wrap-businessType-radio"
                                                        onChange={(e) => { setCurrentFilterGroup({ ...currentFilterGroup, condition: e.target.value }); pushParameterToUrl({ ...currentFilterGroup, condition: _.toLower(e.target.value) }, { ...mainConfig, page: 1 }) }}
                                                        value={currentFilterGroup.condition ? currentFilterGroup.condition : ''}>
                                                        <Radio.Button value="">All</Radio.Button>
                                                        <Radio.Button value="used">Used</Radio.Button>
                                                        <Radio.Button value="recon">Recon</Radio.Button>
                                                        <Radio.Button value="new">New</Radio.Button>
                                                    </Radio.Group>
                                                </span>
                                                {/* </Col> */}

                                                {/* <Col span={12}> */}
                                                <span className="flex-items-align-center flex-justify-space-around">
                                                    <span className='flex-justify-center flex-items-align-center margin-x-sm' >
                                                        <span className='d-inline-block '>
                                                            Year
                              </span>
                                                        <span className='flex-justify-center flex-items-align-center'>
                                                            {
                                                                _.get(mainConfig, ['sorting', 'carspec.year']) == 1 ?
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'carspec.year': null }, page: 1 }) }}
                                                                    ></img>
                                                                    :
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high_default.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'carspec.year': 1 }, page: 1 }) }} ></img>
                                                            }

                                                            {
                                                                _.get(mainConfig, ['sorting', 'carspec.year']) == -1 ?
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'carspec.year': null }, page: 1 }) }}></img>
                                                                    :
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low_default.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'carspec.year': -1 }, page: 1 }) }}></img>
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
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'searchPrice': null }, page: 1 }) }}
                                                                    ></img>
                                                                    :
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high_default.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'searchPrice': 1 }, page: 1 }) }} ></img>
                                                            }

                                                            {
                                                                _.get(mainConfig, ['sorting', 'searchPrice']) == -1 ?
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'searchPrice': null }, page: 1 }) }}></img>
                                                                    :
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low_default.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'searchPrice': -1 }, page: 1 }) }}></img>
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
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'mileageFilter': null }, page: 1 }) }}
                                                                    ></img>
                                                                    :
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/low-to-high_default.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'mileageFilter': 1 }, page: 1 }) }} ></img>
                                                            }

                                                            {
                                                                _.get(mainConfig, ['sorting', 'mileageFilter']) == -1 ?
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'mileageFilter': null }, page: 1 }) }}></img>
                                                                    :
                                                                    <img style={{ width: '50px', height: '50px' }} src="/assets/General/sorting/high-to-low_default.png" className="cursor-pointer" onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: { ...mainConfig.sorting, 'mileageFilter': -1 }, page: 1 }) }}></img>
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
                                                                onClick={(e) => { pushParameterToUrl(currentFilterGroup, { sorting: {}, page: 1 }) }} >

                                                                <Icon type="reload" />
                                                            </Button>
                                                        </Tooltip>
                                                    </span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="padding-top-md">
                                    <Row gutter={[5, 10]}>
                                        <Col xs={0} sm={0} md={24} lg={24} xl={24} className="padding-x-xl">
                                            <Row gutter={[10, 10]}>
                                                <Col xs={{ span: 18, offset: 3 }} sm={{ span: 18, offset: 3 }} md={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }}>
                                                    {_renderGridView(notEmptyLength(productList) ? productList : [])}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col style={{ textAlign: 'center' }} xs={0} sm={0} md={24} lg={24} xl={24}>
                                            <Pagination current={parseInt(mainConfig.page)} pageSize={PAGESIZE} onChange={(page) => { pushParameterToUrl(currentFilterGroup, { ...mainConfig, page: page }) }} total={total} />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            <Col className="gutter-row" xs={0} sm={0} md={0} lg={6} xl={6} >
                                <div className='padding-x-sm'>
                                    <Affix offsetTop={(props.app.menuHeight || 0) + 20} className={`${props.productsList.isFilterModalOpen ? 'affix-element-show-on-modal' : ''}`}>
                                        <ProductListFilterForm
                                            initFilterGroup={currentFilterGroup}
                                            onChange={(data) => {
                                                setCurrentFilterGroup({ ...data, businessType: currentFilterGroup.businessType || '', registrationUrl: currentFilterGroup.registrationUrl || false, car360View: currentFilterGroup.car360View || false });
                                                pushParameterToUrl({ ...data, businessType: currentFilterGroup.businessType || '', registrationUrl: currentFilterGroup.registrationUrl || false, car360View: currentFilterGroup.car360View || false }, { ...mainConfig, page: 1 })
                                            }}
                                            availableFilterOption={notEmptyLength(availableFilterOption) ? availableFilterOption : {}} />
                                    </Affix>
                                </div>
                            </Col>
                        </Row>
                    </Spin>
                </div>
            </div>
        </LayoutV2>
    )
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
    loading: loading,
    setProductListLoading: setProductListLoading,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CarMarketPage))