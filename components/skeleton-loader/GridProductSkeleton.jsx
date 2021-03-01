import { Col, Form, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";




const GridProductSkeleton = (props) => {


    return (
        <React.Fragment>
            <SkeletonTheme>
                <div className="gridDataList">
                    <div className="box-shadow-normal" style={{ height: 400 }}>
                        <div className="wrap-product-ads">
                            <div className="wrap-product-ads-img padding-x-md">
                                <Skeleton className="fill-parent"></Skeleton>
                            </div>
                            <div className="wrap-product-ads-text">
                                <div className="wrap-product-ads-title">
                                    <Skeleton className='text-truncate-twoline' style={{ fontSize: 16 }} count={2}></Skeleton>
                                </div>

                                <div className="wrap-product-ads-title-p text-overflow-break">
                                    <Row>
                                        <Col span={20}>
                                            <Skeleton count={1}></Skeleton>
                                        </Col>
                                    </Row>
                                </div>

                                <Row className="margin-bottom-xs">
                                    <Col xs={24} sm={24} md={18} lg={18} xl={18} >
                                        <Row >
                                            <Col className="icon-res" span={3} style={{ marginTop: '-3px' }}>
                                                <Skeleton circle={true} />
                                            </Col>
                                            <Col span={20}>
                                                <Skeleton className="gridDealerName" count={1}></Skeleton>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="icon-res" span={3} >
                                                <Skeleton circle={true} />
                                            </Col>
                                            <Col span={20}>
                                                <Skeleton style={{ marginLeft: '5px', fontSize: '14px' }} className="product-ads-company" count={1}></Skeleton>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={3} className="icon-res">
                                                <Skeleton circle={true} />
                                            </Col>
                                            <Col span={20}>
                                                <Skeleton style={{ marginLeft: '5px', fontSize: '14px', textTransform: 'uppercase' }} className="product-ads-company" count={1}></Skeleton>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="start" align="middle" className='w-100' gutter={[2.5, 0]}>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4}><Skeleton count={1} height={30} /></Col>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4}><Skeleton count={1} height={30} /></Col>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4}><Skeleton count={1} height={30} /></Col>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                        <Skeleton count={1} height={30} />
                                    </Col>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                        <Skeleton count={1} height={30} />
                                    </Col>
                                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                        <Skeleton count={1} height={30} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </React.Fragment >
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(GridProductSkeleton)));