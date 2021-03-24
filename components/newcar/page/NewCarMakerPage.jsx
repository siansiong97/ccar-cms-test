import { Affix, Breadcrumb, Col, Collapse, Empty, message, Pagination, Row, Table } from 'antd';
import axios from 'axios';
import _ from "lodash";
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { loading, updateActiveMenu } from '../../../redux/actions/app-actions';
import { formatNumber, notEmptyLength } from '../../../common-function';
import LayoutV2 from '../../general/LayoutV2';
import client from '../../../feathers';
import { fetchBrandCars, fetchBrands } from '../../../redux/actions/newcars-actions';
import { addCompareProductId } from '../../../redux/actions/productsList-actions';
import { calMonth } from '../../../functionContent';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { carBrandsList, getCarBrandsIcon } from '../../../params/carBrandsList';
import BrandFiltering from '../BrandFiltering';


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

const { Panel } = Collapse;

var PAGESIZE = 12

class Maker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            news: [],
            brands: [],
            brandCars: [],
            availabeCarBrands: [],
            filterCarBrands: [],
            rowData: [],
            page: 1,
            total: 0
        };
    }

    getData(skip) {
        let promises = [];
        promises.push(axios.get(`${client.io.io.uri}priceRangeSearchNew`,
            {
                params: {
                    match: { make: (_.get(this.props, ['router', 'query', 'id']) || '').toLowerCase() },
                    newCar: 'yes',
                    limit: PAGESIZE,
                    skip: skip,
                }
            }
        ));
        promises.push(axios.get(`${client.io.io.uri}getPriceRangeSearchCarBrands`, {
            params: {
                newCar: 'yes',
            }
        }))
        this.props.loading(true);
        Promise.all(promises).then(([res, res1]) => {


            setTimeout(() => {
                this.props.loading(false);
            }, 1000);

            this.setState({
                total: res.data.total,
                availabeCarBrands: notEmptyLength(res1.data.data) ? res1.data.data : [],
            })
            this.props.fetchBrands(notEmptyLength(res.data.data) ? res.data.data : [])
            this.props.fetchBrandCars(notEmptyLength(res.data.data) ? res.data.data : []);



        })

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.router.query.id != _.get(this.props, ['router', 'query', 'id']) || '') {
            this.setState({
                page: 1,
                rowData: [],
                rowKey: null,
                activeKey: null,
            })
            this.getData(0);
        }

        if (!_.isEqual(prevState.page, this.state.page)) {
            this.getData((this.state.page - 1) * PAGESIZE)
        }

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
    }

    UNSAFE_componentWillMount() {
        this.props.updateActiveMenu('1')
        this.getData(0);
        this.props.loading(true)
        client.service('news').find({
            query: {
                $sort: {
                    createdAt: -1
                },
                $limit: 6,
                publisher: { $ne: 'youtube' }
            }
        }).then((res) => {
            this.props.loading(false);
            this.setState({ news: res.data });
        }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
        });
    }

    getRowKey(item, i) {
        if (this.state.activeKey == item.rowKey + '' + i) {
            this.setState({ rowKey: -1, activeKey: -1 })
        } else {

            this.setState({
                rowKey: item.rowKey,
                rowData: item.variants,
                activeKey: item.rowKey + '' + i
            })
        }
    }

    pushCompare = (item) => {
        this.props.loading(true)
        client.service('carspecs').find({
            query: {
                _id: new Object(item._id)
            }
        }).then((res) => {
            this.props.loading(false);
            _.map(res.data, (v) => {
                v.condition = 'new'
                v.price = v.price ? v.price : 0
                v.carspecsAll = v
                return v
            })
            this.props.addCompareProductId(res.data[0])
            message.success('Added to compare list')
        }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
        });
    }

    _renderVariants() {
        const columns = [
            {
                title: 'Model',
                dataIndex: 'model',
                key: 'model',
                render: (text, record) => {
                    return (
                        <span>
                            {_.capitalize(record.make) + ' ' + _.capitalize(record.model) + ' ' + _.capitalize(record.variant) + ' ' + record.year}
                        </span>
                    )
                },
            },
            {
                title: 'Transmission',
                dataIndex: 'transmission',
                key: 'transmission',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => (
                    <span style={{ color: 'rgb(251, 176, 64)' }}>
                        {text ? "RM" + formatNumber(text, null, null, 2) : 'TBC'}
                    </span>
                ),
            },
            {
                title: 'Monthly Payment',
                dataIndex: 'monthlyPayment',
                key: 'monthlyPayment',
                render: (text, record) => (
                    <span style={{ color: 'rgb(80, 135, 251)' }}>
                        {record.price ? "RM" + formatNumber(calMonth(record.price), null, null, 2) : 'TBC'}
                    </span>
                ),
            },
            // {
            //   title: 'Action',
            //   key: 'action',
            //   render: (text, record) => (
            //     <span>
            //         <Button style={{ marginRight: '10px', width: '100px' }} 
            //         onClick={() => this.pushCompare(record)}
            //         > + Compare </Button>
            //     </span>
            //   ),
            // },
        ];

        let uniqbrands = this.props.newCars.brands
        let getDecimal = uniqbrands.length / 4
        var rowDivided = Math.ceil(getDecimal)
        var count = 0
        var rowKey = 0
        let list = []
        if (notEmptyLength(uniqbrands)) {

            uniqbrands.map((item, i) => {
                count++
                item.rowKey = rowKey
                list.push(
                    <React.Fragment>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6} key={i} >

                            <div>
                                <img src={item.uri} style={{ width: '100%', padding: '5px', marginLeft: '5px' }} onClick={(e) => {
                                    this.props.router.push(`/newcar/details/${item.make + '/' + item.model}`)
                                }}></img>
                                <div className="newcars-wrap-p" onClick={(e) => {
                                    this.props.router.push(`/newcar/details/${item.make + '/' + item.model}`)
                                }}>
                                    <p style={{ textTransform: 'capitalize', textAlign: 'center', fontSize: '16px', fontWeight: '600', marginBottom: '0px', color: "rgba(0, 0, 0, 0.65)" }} className='text-truncate'> {item.make}  {item.model}</p>
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
                                <div style={{ padding: '0 26px', position: 'relative', zIndex: 2, width: '100%', bottom: -2, marginTop: '50px' }}>
                                    <Collapse onChange={(e) => this.getRowKey(item, i)} className={this.state.activeKey == `${item.rowKey}${i}` ? "collapse-variants" : ''} activeKey={this.state.activeKey}>
                                        <Panel header={`${notEmptyLength(item.variants) ? item.variants.length : 0} Variants Found`} key={rowKey + '' + i}>
                                        </Panel>
                                    </Collapse>
                                </div>
                            </div>
                        </Col>
                        {
                            count > 3
                                ?
                                <Col span={24} id={rowKey} style={this.state.rowKey == item.rowKey ? { display: 'block' } : { display: 'none' }}>
                                    <div style={{ padding: '0 26px' }}>
                                        <Table rowKey="_id" bordered columns={columns} dataSource={_.sortBy(this.state.rowData, ['year'])} pagination={false} scroll={{ y: 150 }} />
                                    </div>
                                </Col>
                                :
                                null
                        }
                    </React.Fragment>
                )

                if (count > 3) {
                    count = 0;
                    rowKey++
                }
            })

            if (Number.isInteger(getDecimal) === false) {
                list.push((
                    <Col span={24} id={rowKey} style={this.state.rowKey == rowKey ? { display: 'block' } : { display: 'none' }}>
                        <div style={{ padding: '0 26px' }}>
                            <Table rowKey="_id" bordered columns={columns} dataSource={_.sortBy(this.state.rowData, ['year'])} pagination={false} />
                        </div>
                    </Col>
                ))
            }

            return list;
        } else {
            return (
                <div className='padding-sm'>
                    <Empty></Empty>
                </div>
            );
        }
    }

    render() {

        return (
            <LayoutV2>
                <Desktop>
                    <div className="section" style={{ marginTop: '20px' }}>
                        <div className="container">
                            <Breadcrumb style={{ marginBottom: '5px' }}>
                                <Breadcrumb.Item>
                                    <Link shallow={false}  href="/" passHref>
                                        <a>Home</a>
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link shallow={false}  href="/newcar" passHref>
                                        <a>New Car</a>
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link shallow={false}  href="/newcar/filter" passHref>
                                        <a>Filter</a>
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link shallow={false}  href="/newcar/maker" passHref>
                                        <a>
                                            {_.capitalize(_.get(this.props, ['router', 'query', 'id']) || '')}
                                        </a>
                                    </Link>
                                </Breadcrumb.Item>
                            </Breadcrumb>

                            <Desktop>
                                <Row gutter={[20, 0]}>
                                    <Col xs={24} sm={24} md={19} lg={19} xl={19}>
                                        {/* <Row>
                            <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>
                                <span className='d-inline-block h6 font-weight-bold grey-darken-3 capitalize' >
                                    {this.props.newCars.brands[0]?this.props.newCars.brands[0].make:''}
                                </span>
                            </Col>
                            </Row> */}
                                        <Row className="maker-details padding-lg">
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center' }}>
                                                <img style={{ width: '10%' }} src={getCarBrandsIcon(_.get(this.props, ['router', 'query', 'id']) || '')}></img>
                                            </Col>
                                            {/* <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                                    <p style={{marginBottom:'10px'}} className="h6 font-weight-bold grey-darken-3 uppercase"> {this.props.newCars.brands[0] ? this.props.newCars.brands[0].make : ''} </p>
                                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                    </Col> */}
                                        </Row>

                                        <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>

                                            <span className='d-inline-block h6 font-weight-bold grey-darken-3 uppercase' >
                                                {this.props.newCars.brands[0] ? this.props.newCars.brands[0].make : 0} Cars in Malaysia
                        </span>
                                        </Col>

                                        <Row className="maker-list-car" type="flex" >
                                            {this._renderVariants()}
                                        </Row>

                                        {
                                            this.state.total > PAGESIZE ?
                                                <div className="flex-justify-center margin-md">
                                                    <Pagination simple pageSize={PAGESIZE} current={this.state.page} total={this.state.total} onChange={(e) => { this.setState({ page: e }) }} />
                                                </div>
                                                :
                                                null
                                        }

                                        {/* <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>

                                <span className='d-inline-block h6 font-weight-bold grey-darken-3 uppercase' >
                                    {this.props.newCars.brands[0] ? this.props.newCars.brands[0].make : ''} News in Malaysia
                        </span>
                            </Col> */}

                                        {/* <div className="maker-page"> */}
                                        {/* <Row gutter={[10, 10]}>
                                {this.props.newCars.news.map(function (item, i) {
                                    return (
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <a href={item.originalUrl}>
                                                <Row className="fnews1">
                                                    <Col span={12} className="inews">
                                                        <img src={item.thumbnailUrl} style={{ width: "100%" }} />
                                                    </Col>
                                                    <Col span={12} className="ftitle">
                                                        <h4>{item.title}</h4>
                                                        <p>
                                                            {item.content}
                                                        </p>

                                                        <span style={{ textTransform: 'capitalize' }}>{item.publisher} | {moment(item.createdAt).format('DD-MM-YYYY')}</span>
                                                    </Col>
                                                </Row>
                                            </a>
                                        </Col>
                                    )
                                })
                                }
                            </Row> */}
                                        {/* </div> */}

                                        {/* temporary remark */}
                                        {/* <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>
                            
            <span className='d-inline-block h6 font-weight-bold grey-darken-3' >
              CAR TIPS & TRICKS
                        </span>
                            </Col> */}

                                        {/* <div className="tips">
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #1 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #2 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #3 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #4 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #5 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #6 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                </Row>
                            </div>
          */}
                                        {/* -----temporary remark */}
                                    </Col>


                                    <Col className="stick-column" xs={0} sm={0} md={5} lg={5} xl={5}>
                                        <Affix offsetTop={65}>
                                            <BrandFiltering brands={notEmptyLength(this.state.filterCarBrands) ? this.state.filterCarBrands : carBrandsList} />
                                        </Affix>
                                    </Col>
                                </Row>
                            </Desktop>

                            <Tablet>
                                <Row>
                                    <Col xs={24} sm={24} md={16} lg={19} xl={19} style={{ paddingLeft: '5px' }}>
                                        {/* <Row>
                            <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>
                                <span className='d-inline-block h6 font-weight-bold grey-darken-3 capitalize' >
                                    {this.props.newCars.brands[0]?this.props.newCars.brands[0].make:''}
                                </span>
                            </Col>
                            </Row> */}
                                        <Row className="maker-details padding-lg">
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center' }}>
                                                <img style={{ width: '15%' }} src={getCarBrandsIcon(_.get(this.props, ['router', 'query', 'id']) || '')}></img>
                                            </Col>
                                            {/* <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                                    <p style={{marginBottom:'10px'}} className="h6 font-weight-bold grey-darken-3 uppercase"> {this.props.newCars.brands[0] ? this.props.newCars.brands[0].make : ''} </p>
                                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                    </Col> */}
                                        </Row>

                                        <Col className="gutter-row text-align-center" xs={18} sm={18} md={24} lg={20} xl={20} >
                                            <span className='d-inline-block h6 font-weight-bold grey-darken-3 uppercase ' >
                                                {this.props.newCars.brands[0] ? this.props.newCars.brands[0].make : 0} Cars in Malaysia
                                    </span>
                                        </Col>

                                        <Row className="maker-list-car" type="flex" >
                                            {this._renderVariants()}
                                        </Row>

                                        {
                                            this.state.total > PAGESIZE ?
                                                <div className="flex-justify-center margin-md">
                                                    <Pagination simple pageSize={PAGESIZE} current={this.state.page} total={this.state.total} onChange={(e) => { this.setState({ page: e }) }} />
                                                </div>
                                                :
                                                null
                                        }

                                        {/* <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>

                                <span className='d-inline-block h6 font-weight-bold grey-darken-3 uppercase' >
                                    {this.props.newCars.brands[0] ? this.props.newCars.brands[0].make : ''} News in Malaysia
                        </span>
                            </Col> */}

                                        {/* <div className="maker-page"> */}
                                        {/* <Row gutter={[10, 10]}>
                                {this.props.newCars.news.map(function (item, i) {
                                    return (
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <a href={item.originalUrl}>
                                                <Row className="fnews1">
                                                    <Col span={12} className="inews">
                                                        <img src={item.thumbnailUrl} style={{ width: "100%" }} />
                                                    </Col>
                                                    <Col span={12} className="ftitle">
                                                        <h4>{item.title}</h4>
                                                        <p>
                                                            {item.content}
                                                        </p>

                                                        <span style={{ textTransform: 'capitalize' }}>{item.publisher} | {moment(item.createdAt).format('DD-MM-YYYY')}</span>
                                                    </Col>
                                                </Row>
                                            </a>
                                        </Col>
                                    )
                                })
                                }
                            </Row> */}
                                        {/* </div> */}

                                        {/* temporary remark */}
                                        {/* <Col className="gutter-row" xs={18} sm={18} md={20} lg={20} xl={20}>
                            
            <span className='d-inline-block h6 font-weight-bold grey-darken-3' >
              CAR TIPS & TRICKS
                        </span>
                            </Col> */}

                                        {/* <div className="tips">
                                <Row gutter={[10, 10]}>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #1 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #2 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #3 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #4 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #5 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card hoverable src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png">
                                            <h3> #6 Why does my car hydroplane?</h3>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Card>
                                    </Col>
                                </Row>
                            </div>
          */}
                                        {/* -----temporary remark */}
                                    </Col>


                                    <Col className="stick-column" xs={0} sm={0} md={8} lg={5} xl={5}>
                                        <Affix offsetTop={65}>
                                            <BrandFiltering brands={notEmptyLength(this.state.filterCarBrands) ? this.state.filterCarBrands : carBrandsList} />
                                        </Affix>
                                    </Col>
                                </Row>

                            </Tablet>
                        </div>
                    </div>
                </Desktop>

            </LayoutV2>
        )
    }
}

const mapStateToProps = state => ({
    newCars: state.newcars || state.newCars,
});
const mapDispatchToProps = {
    loading: loading,
    fetchBrands: fetchBrands,
    fetchBrandCars: fetchBrandCars,
    addCompareProductId: addCompareProductId,
    updateActiveMenu: updateActiveMenu
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Maker));