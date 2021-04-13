import { CarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Icon, message, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import LayoutV2 from '../../general/LayoutV2';
import GridProductList from '../../product-list/grid-product-list';
import { loading } from '../../../redux/actions/app-actions';
import { clearCompareProductIds, filteredCompareData, removeCompareProductId, updateActiveIdProductList } from '../../../redux/actions/productsList-actions';
import client from '../../../feathers';
import { convertParameterToProductListUrl, notEmptyLength } from '../../../common-function';
import CarspecsCompareTable from '../CarspecsCompareTable';
import Link from 'next/link';


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

const adsCompare = '../buy-car-ads.png';
const adsCompare2 = '../social-news-ads.png';

const CompareIndex = (props) => {
    const [contactList, setContactList] = useState({})
    const [checked, setChecked] = useState(false)
    const [filteredCompareData, setFilteredCompareData] = useState([])
    const [productList, setProductList] = useState([])
    const [carspecIds, setCarspecIds] = useState([])


    useEffect(() => {

        if (notEmptyLength(props.productsList.compareIds)) {
            props.loading(true);
            client.service('product-ads').find({
                query: {
                    _id: {
                        $in: props.productsList.compareIds,
                    },
                    $populate: [
                        {
                            path: 'carspecsId',
                            ref: 'carspecs'
                        },
                        {
                            path: 'companyId',
                            ref: 'companys'
                        },
                        {
                            path: 'createdBy',
                            ref: 'users'
                        }
                    ],
                }
            }).then(res => {
                props.loading(false);
                if (notEmptyLength(res.data)) {
                    setProductList(res.data.map(function (item) {
                        item.companys = item.companyId;
                        item.carspecsAll = item.carspecsId;
                        return item;
                    }))
                } else {
                    setProductList([]);
                }
            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });
        } else {
            setProductList([]);
        }
    }, [props.productsList.compareIds])

    useEffect(() => {

        if (notEmptyLength(productList)) {
            setCarspecIds(_.map(productList, function (item) {
                return item.carspecsAll._id;
            }))
        } else {
            setCarspecIds([]);
        }
    }, [productList])


    function removeCompareProductId(v) {
        props.removeCompareProductId(v)
    }

    const _renderCondition = (v) => {

        if (v.condition == 'new') {
            return (
                <div className="wrap-condition wrap-condition-new">
                    <p>{v.condition}</p>
                </div>
            )
        } else if (v.condition == 'used') {
            return (
                <div className="wrap-condition wrap-condition-used">
                    <p>{v.condition}</p>
                </div>
            )
        } else if (v.condition == 'recon') {
            return (
                <div className="wrap-condition wrap-condition-recon">
                    <p>{v.condition}</p>
                </div>
            )
        } else {
            return (
                <div className="wrap-condition wrap-condition-default">
                    <p>{v.condition}</p>
                </div>
            )
        }
    }
    return (
        <LayoutV2>
            <Desktop>
                <div className="section" style={{ touchAction: 'pan-y' }}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
                            <Card title="Summary" className="card-padding-0 ">
                                <Row gutter={[10, 10]} style={{ margin: '0px 0px' }}>

                                    <GridProductList data={notEmptyLength(productList) ? productList : []} xs={24} sm={24} md={8} lg={6} xl={6}
                                        topRight={(v) => {
                                            return (
                                                <span className='d-inline-block background-grey-opacity-60' >
                                                    <Icon type="close" style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => { props.removeCompareProductId(v._id) }} className='font-weight-bold' />
                                                </span>
                                            )
                                        }}
                                    />
                                    {props.productsList.compareIds.length < props.productsList.compareLimit ?
                                        <Col key="add new" className="gutter-row col-centered" xs={24} sm={24} md={5} lg={5} xl={5}>
                                            <Link shallow={false} href={convertParameterToProductListUrl()} >
                                                <a>
                                                    <Button className="w-100" style={{ height: '10em' }}>
                                                        <CarOutlined style={{ fontSize: 40 }} />
                                                        <br></br>
                                                        +Add a car to compare
                                                    </Button>
                                                </a>
                                            </Link>
                                        </Col>
                                        : null
                                    }
                                </Row>
                                <CarspecsCompareTable data={notEmptyLength(carspecIds) ? carspecIds : []} limit={props.productsList.compareLimit} findById />
                            </Card>
                        </Col>

                        <Col xs={0} sm={0} md={0} lg={0} xl={4} className="padding-left-md">
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <img style={{ width: '100%' }} src={adsCompare}></img>
                                        <div className="advertisement-overlay">
                                            <a href="/newcar" style={{ color: 'rgba(0,0,0,0.65' }}> <p> Ads <Icon type="info-circle" /> </p>  </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <img style={{ width: '100%', marginTop: '10px' }} src={adsCompare2}></img>
                                        <div className="advertisement-overlay">
                                            <a href="/newcar" style={{ color: 'rgba(0,0,0,0.65' }}> <p> Ads <Icon type="info-circle" /> </p>  </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Desktop>

            <Tablet>
            <div className="section" style={{ touchAction: 'pan-y' }}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                            <Card title="Summary" className="card-padding-0 ">
                                <Row gutter={[10, 10]} style={{ margin: '0px 0px' }}>

                                    <GridProductList data={notEmptyLength(productList) ? productList : []} xs={24} sm={24} md={8} lg={6} xl={6}
                                        topRight={(v) => {
                                            return (
                                                <span className='d-inline-block background-grey-opacity-60' >
                                                    <Icon type="close" style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => { props.removeCompareProductId(v._id) }} className='font-weight-bold' />
                                                </span>
                                            )
                                        }}
                                    />
                                    {props.productsList.compareIds.length < props.productsList.compareLimit ?
                                        <Col key="add new" className="gutter-row col-centered" xs={24} sm={24} md={5} lg={5} xl={5}>
                                            <Link shallow={false} href={convertParameterToProductListUrl()} >
                                                <a>
                                                    <Button className="w-100" style={{ height: '10em' }}>
                                                        <CarOutlined style={{ fontSize: 40 }} />
                                                        <br></br>
                                                        +Add a car to compare
                                                    </Button>
                                                </a>
                                            </Link>
                                        </Col>
                                        : null
                                    }
                                </Row>
                                <CarspecsCompareTable data={notEmptyLength(carspecIds) ? carspecIds : []} limit={props.productsList.compareLimit} findById />
                            </Card>
                        </Col>

                        <Col xs={0} sm={0} md={0} lg={4} xl={4} className="padding-left-md">
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <img style={{ width: '100%' }} src={adsCompare}></img>
                                        <div className="advertisement-overlay">
                                            <a href="/newcar" style={{ color: 'rgba(0,0,0,0.65' }}> <p> Ads <Icon type="info-circle" /> </p>  </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <img style={{ width: '100%', marginTop: '10px' }} src={adsCompare2}></img>
                                        <div className="advertisement-overlay">
                                            <a href="/newcar" style={{ color: 'rgba(0,0,0,0.65' }}> <p> Ads <Icon type="info-circle" /> </p>  </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Tablet>
        </LayoutV2>
    );
}

const mapStateToProps = state => ({
    productsList: state.productsList,
});

const mapDispatchToProps = {
    loading: loading,
    updateActiveIdProductList: updateActiveIdProductList,
    removeCompareProductId: removeCompareProductId,
    clearCompareProductIds: clearCompareProductIds,
    filteredCompareData: filteredCompareData,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompareIndex));