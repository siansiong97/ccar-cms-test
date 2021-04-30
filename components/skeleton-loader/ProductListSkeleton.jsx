import { Col, Form, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import _ from 'lodash';




const ProductListSkeleton = (props) => {


    return (
        <React.Fragment>
            <div className=" flex-items-align-stretch flex-justify-start padding-md margin-y-md box-shadow-normal">
                <span className='d-inline-block margin-right-sm width-30' >
                    <Skeleton className="width-100" style={{ height: 200 }}></Skeleton>
                    <Row gutter={[6, 2]}>
                        {
                            _.map(_.range(8), function (item) {
                                return (
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        <Skeleton className="width-100" style={{ height: 30 }}></Skeleton>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </span>
                <span className='flex-align-space-between flex-wrap margin-right-sm width-40' >
                    <div className="flex-items-no-shrink width-100">
                        <div className="width-100">
                            <Skeleton count={1}></Skeleton>
                        </div>
                        <div className="width-70">
                            <Skeleton count={1}></Skeleton>
                        </div>
                        <div className="width-80 margin-top-md">
                            <Skeleton count={1}></Skeleton>
                        </div>
                        <div className="width-100 margin-top-md">
                            <Skeleton count={5}></Skeleton>
                        </div>
                    </div>
                    <div className="flex-items-no-shrink width-100">
                        <Row gutter={[6, 2]}>
                            {
                                _.map(_.range(6), function (item) {
                                    return (
                                        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                                            <Skeleton className="width-100" style={{ height: 30 }}></Skeleton>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </span>
                <span className='flex-align-space-between flex-wrap margin-right-sm width-30' >
                    <div className="flex-items-no-shrink width-100">
                        <div className="width-100">
                            <Skeleton count={1} style={{ height: 100 }}></Skeleton>
                        </div>
                    </div>
                    <div className="flex-items-no-shrink width-100">
                        <Skeleton count={1} style={{ height: 100 }}></Skeleton>
                    </div>
                </span>
            </div>
        </React.Fragment >
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProductListSkeleton)));