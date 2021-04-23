import { Col, Row } from 'antd';
import _ from "lodash";
import React, { useEffect, useState } from 'react';

const KeyCarDetails2 = (props) => {
    const [id, setId] = useState('')
    const [productDetails, setProductDetails] = useState([])

    useEffect(() => {
        if (props.productDetails._id != id) {
            setId(props.productDetails._id)
            setProductDetails(props.productDetails)
        }
    })


    function renderMileageRange(mileage, mileage2) {

        let mileageRange = 0, useMileage = 'no', useMileage2 = 'no'

        if (mileage) {
            if (mileage > 0) {
                mileageRange = mileage
                useMileage = 'yes'
            }
        }

        if (mileage2) {
            if (mileage2 > 0) {
                mileageRange = mileage2
                useMileage2 = 'yes'
            }

        }

        if (typeof mileageRange === 'string') {
            try {
                mileageRange = parseFloat(mileageRange)
            } catch (err) { return mileageRange }
        }

        if (useMileage === 'yes') {

            if (typeof mileageRange === 'number') {
                let mileageFrom = (mileageRange - 2500) / 1000
                let mileageTo = (mileageRange + 2500) / 1000
                mileageRange = mileageFrom + '-' + mileageTo + 'K KM'
            }
            if (_.isEmpty(mileageRange) === true) {
                mileageRange = '0 KM'
            }
            return mileageRange
        }
        else {
            mileageRange = mileageRange / 1000
            return mileageRange + ' KM'
        }
    }


    function renderEngineCapacity(engineCapacity) {
        let engineCapacityStr = '-'
        try {
            if (_.isEmpty(engineCapacity) === false || engineCapacity > 0) {
                engineCapacityStr = parseFloat(engineCapacity).toFixed(2)
            }
            else {
                return '-'
            }
        }
        catch (err) { return '-' }

        return engineCapacityStr + ' CC'
    }



    return (
        <div>
            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Car Maker@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Maker</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{_.get(productDetails, ['carspec', 'make']) || '-'}</p>
                </Col>
            </Row>

            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Car Model@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Model</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{_.get(productDetails, ['carspec', 'model']) || '-'}</p>
                </Col>
            </Row>

            {/* <Row style={{ 
                borderBottom: 'solid 2px rgb(237, 236, 234)', 
                paddingTop: '12px', 
                paddingLeft: '12px', 
                paddingRight: '12px' }}>
                <Col span={12}>
                <Row>
                    <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                        <img className="w-100" src="/assets/carDetails/Location@3x.png"/>
                    </Col>
                    <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                        <p className="headline   text-overflow-break">State</p>
                    </Col>
                </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{productDetails.state}</p>
                </Col>
            </Row> */}

            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Engine Capacity@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Engine</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>
                        {/* {`${_.get(productDetails , ['carspec', 'engineCapacity']) ? `${_.get(productDetails , ['carspec', 'engineCapacity'])} cc` : '-'}`} */}

                        {renderEngineCapacity(productDetails.carspecsAll ? productDetails.carspecsAll.engineCapacity ? productDetails.carspecsAll.engineCapacity : '' : '')}
                    </p>
                </Col>
            </Row>

            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Transmission@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Transmission</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>
                        {_.get(productDetails, ['carspec', 'transmission']) || '-'}

                    </p>
                </Col>
            </Row>

            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Manufactory Years@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Year</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{_.get(productDetails, ['carspec', 'year']) || '-'}</p>
                </Col>
            </Row>

            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Mileage@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Mileage</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{renderMileageRange(productDetails.mileage, productDetails.mileage2)}</p>
                </Col>
            </Row>

            <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Body Type@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Type</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{productDetails.carspecsAll ? productDetails.carspecsAll.bodyType : '-'}</p>
                </Col>
            </Row>

            {/* <Row style={{
                borderBottom: 'solid 2px rgb(237, 236, 234)',
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Wheel@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline   text-overflow-break">Wheel</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{productDetails.carspecsAll ? productDetails.carspecsAll.drivenWheel ? productDetails.carspecsAll.drivenWheel : '-' : '-'}</p>
                </Col>
            </Row> */}

            <Row style={{
                // borderBottom: 'solid 2px rgb(237, 236, 234)', 
                paddingTop: '12px',
                paddingLeft: '12px',
                paddingRight: '12px'
            }}>
                <Col span={12}>
                    <Row>
                        <Col xs={5} sm={5} md={5} lg={5} xl={4}>
                            <img className="w-100" src="/assets/carDetails/Car Color@3x.png" />
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={18} offset={2}>
                            <p className="headline  text-overflow-break">Color</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <p style={{ fontWeight: '700', textTransform: 'capitalize' }}>{productDetails.color ? productDetails.color : ''}</p>
                </Col>
            </Row>
        </div>
    );
}

export default KeyCarDetails2;