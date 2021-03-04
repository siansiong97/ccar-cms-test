import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Form, Icon, Input, Row, Select, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { calMonth } from '../../functionContent';
import { calculateTimeRange, formatNumber, notEmptyLength, numberToFixed } from '../../common-function';
import CalculatorModal from '../general/calculator-modal';
import ShareButtonDialog from '../general/ShareButtonDialog';


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

const opts = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
};
const AUTHORSIZE = 10
const OLDERYEARRANGE = 1
const NewCarOverview = (props) => {


    const [variants, setVariants] = useState([]);
    const [selectedYear, setSelectedYear] = useState('All');
    const [peerComp, setPeerComp] = useState([]);
    const [carDetails, setCarDetails] = useState({});
    const [monthlyInstalment, setMonthlyInstallment] = useState(0);
    const [timeoutFunction, setTimeoutFunction] = useState(null);


    useEffect(() => {

        if (notEmptyLength(props.newCars.CarName)) {
            setCarDetails(props.newCars.CarName);
            if (notEmptyLength(props.newCars.CarName.variants)) {
                setVariants(props.newCars.CarName.variants);
            } else {
                setVariants([]);
            }
        }
    }, [props.newCars.CarName])

    useEffect(() => {

        if (notEmptyLength(props.newCars.peerComp)) {
            setPeerComp(props.newCars.peerComp);
        } else {
            setPeerComp([]);
        }
    }, [props.newCars.peerComp])


    function filteredVariants() {

        return variants;
    }

    function calculateMonthlyPay(item) {

        if (notEmptyLength(item)) {
            props.form.setFieldsValue({
                price: parseFloat(item.price),
                downpayment: parseFloat(numberToFixed(item.price * 0.1, true, 2)),
                loanPeriod: 9,
                interestRate: 3
            })
            handleSubmit();
        } else {
            props.form.setFieldsValue({
                price: 0,
                downpayment: 0,
                loanPeriod: 5,
                interestRate: 0
            })
            handleSubmit();

        }
    }

    function isSelectedYear(year) {

        if (selectedYear == 'All') {
            return true;
        }

        if (selectedYear == 'Older' && calculateTimeRange(moment(), moment(year).format('YYYY'), 'year', false).difference > OLDERYEARRANGE) {
            return true;
        }

        if (year == selectedYear) {
            return true;
        }

        return false
    }

    function typingTimeOut() {

        clearTimeout(timeoutFunction);
        setTimeoutFunction(setTimeout(() => {
            handleSubmit();
        }, 1000))
    }

    function handleSubmit() {
        window.scroll(0, 0)
        props.form.validateFields((err, values) => {

            if (!err) {

                let LoanAmount = parseFloat(values.price) - parseFloat(values.downpayment)
                let LoanPeriod = parseInt(values.loanPeriod)
                let Interest = parseFloat(values.interestRate)
                let totalInterest = (Interest / 100) * LoanAmount * LoanPeriod
                let monthlyInterest = totalInterest / (LoanPeriod * 12)
                let monthlyInstalment = (LoanAmount + totalInterest) / (LoanPeriod * 12)

                setMonthlyInstallment(monthlyInstalment);

            } else {
                // _.map(err, function (err) {
                //     return message.error(err.errors[0].message)
                // })
            }
        })
    }

    const _renderCarDetailsbox = () => {
        return (
            <div className="details">
                <Desktop>
                    <Row>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Row>
                                <Col span={24}>
                                    <div className="hide-overflow">
                                        <img src={carDetails.uri ? carDetails.uri : ''}></img>
                                    </div>
                                </Col>
                            </Row>
                            {/* <Row>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <Button style={{ border: 'none' }}>Interior</Button>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center', border: 'none' }}>
                                <Button style={{ border: 'none' }}>Exterior</Button>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center', border: 'none' }}>
                                <Button style={{ border: 'none' }}>360</Button>
                            </Col>
                        </Row> */}
                        </Col>

                        <Col style={{ marginTop: '13px', marginBottom: '13px' }} xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div className=' flex-justify-space-between flex-items-align-center'>
                                <span className='d-inline-block h5 font-weight-bold uppercase' >
                                    {carDetails ? carDetails.make + ' ' + carDetails.model : '-'}
                                </span>
                                <ShareButtonDialog style={{ border: 'none', marginRight: '10px', marginTop: '0px' }} />
                            </div>
                            <p style={{ fontWeight: '700', color: '#FBB040', marginBottom: '5px', fontSize: '20px' }}>

                                {
                                    !carDetails.minPrice && !carDetails.maxPrice ?
                                        'Price To Be Confirmed'
                                        :
                                        `${carDetails.minPrice ? 'RM ' + formatNumber(carDetails.minPrice, null, null, 2) : 'TBC'} - ${carDetails.maxPrice ? 'RM ' + formatNumber(carDetails.maxPrice, null, null, 2) : 'TBC'}`
                                }
                            </p>

                            <p> Malaysia Preference Price Range </p>

                            <Row style={{ marginTop: '35px' }}>
                                <Col span={12}>
                                    <Row>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={4} style={{ textAlign: 'center' }}>
                                                    <img src="/assets/carDetails/Car Maker@3x.png" style={{ width: '100%' }}></img>
                                                </Col>
                                                <Col span={20} style={{ paddingLeft: '10px' }}>Maker</Col>
                                            </Row>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <p style={{ textTransform: 'capitalize' }} >{carDetails ? carDetails.make : ''} </p>
                                        </Col>
                                    </Row>
                                    <Divider style={{ margin: 0 }} />
                                    <Row>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={4}>
                                                    <img src="/assets/carDetails/Car Maker@3x.png" style={{ width: '100%' }}></img>
                                                </Col>
                                                <Col style={{ paddingLeft: '10px' }} span={20}>
                                                    <p> Model </p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <p style={{ textTransform: 'capitalize' }}>{carDetails ? carDetails.model : ''} </p>
                                        </Col>
                                    </Row>
                                    <Divider style={{ margin: 0 }} />
                                    <Row>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={4}>
                                                    <img src="/assets/carDetails/Transmission@3x.png" style={{ width: '100%' }}></img>
                                                </Col>
                                                <Col style={{ paddingLeft: '10px' }} span={20}>
                                                    <p> Transmission </p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <p style={{ textTransform: 'capitalize' }}>{carDetails ? carDetails.seats : ''} </p>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col span={12}>
                                    <Row>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={4}>
                                                    <img src="/assets/carDetails/Car Maker@3x.png" style={{ width: '100%' }}></img>
                                                </Col>
                                                <Col span={10} style={{ paddingLeft: '10px' }}>
                                                    Type
                                            </Col>
                                            </Row>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <p style={{ textTransform: 'UPPERCASE' }} >{carDetails ? carDetails.bodyType : ''} </p>
                                        </Col>
                                    </Row>
                                    <Divider style={{ margin: 0 }} />
                                    <Row>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={4}>
                                                    <img src="/assets/carDetails/Wheel@3x.png" style={{ width: '100%' }}></img>
                                                </Col>
                                                <Col span={20} style={{ paddingLeft: '10px' }}>
                                                    <p> Wheel </p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <p> - </p>
                                        </Col>
                                    </Row>
                                    <Divider style={{ margin: 0 }} />
                                    <Row>
                                        <Col span={14}>
                                            <Row>
                                                <Col span={4}>
                                                    <img src="/assets/carDetails/Wheel@3x.png" style={{ width: '100%' }}></img>
                                                </Col>
                                                <Col style={{ paddingLeft: '10px' }} span={20}>
                                                    <p> Seats </p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={10} style={{ textAlign: 'right', paddingRight: '20px' }}>
                                            <p style={{ textTransform: 'capitalize' }}>{carDetails ? carDetails.seats : ''} </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* <div>
                            <p style={{ color: '#1890ff', fontSize: '20px', marginBottom: '5px', marginTop: '30px' }}>  Key Highlight </p>
                            <p><Icon type="check" /> Priced competitively</p>
                            <p> <Icon type="check" /> Wide dealer and services centre network </p>
                            <p> <Icon type="check" /> Various after-market accesories available</p>
                        </div> */}
                            <Row>
                                {/* <Col style={{ padding: '5px' }} xs={24} sm={24} md={12} lg={12} xl={12}>
                                <ReserveFormButton
                                    type="carspec"
                                    make={carDetails.make}
                                    model={carDetails.model}
                                    reserverId={props.user.authenticated ? props.user.info.user._id : null}
                                    selection={filteredVariants()}
                                    button={() => {
                                        return (
                                            <Button type="primary" style={{ width: '100%' }}> Ask For Reservation</Button>
                                        )
                                    }}
                                    handleError={(e) => { message.error(e.message) }} />
                            </Col> */}
                                <Col style={{ padding: '5px' }} xs={24} sm={24} md={12} lg={12} xl={12}>
                                    {/* <Link href={`/newcar/details/${props.match.params.make}/${props.match.params.model}/specs`}>
                                    <Button style={{ width: '100%' }}>
                                        <p style={{ textTransform: 'capitalize', marginTop: '5px' }}> View {carDetails ? carDetails.make + ' ' + carDetails.model : ''} Specification </p>
                                    </Button>
                                </Link> */}
                                    <Button style={{ width: '100%', color: '#F89F27' }} onClick={(e) => props.changeTabs ? props.changeTabs('specs') : null}>
                                        {/* <p style={{ textTransform: 'capitalize', marginTop: '5px' }}> View {carDetails ? carDetails.make + ' ' + carDetails.model : ''} Specification </p> */}
                                        <p style={{ textTransform: 'capitalize', marginTop: '5px' }}> View Specification </p>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Desktop>

            </div>
        )
    }

    const _renderVariantGroupTitle = () => {

        let years = ['All'];
        if (notEmptyLength(variants)) {
            _.forEach(variants, function (item) {
                if (!_.includes(years, item.year)) {
                    years.push(item.year);
                }
            });
        }

        let gotOlderYears = false;
        years = _.compact(_.map(years, function (year) {
            if (year != 'All') {
                year = moment(year).format('YYYY');
                if (!gotOlderYears) {
                    gotOlderYears = calculateTimeRange(moment(), year, 'year', false).difference > OLDERYEARRANGE;
                }
                return calculateTimeRange(moment(), year, 'year', false).difference > OLDERYEARRANGE ? null : year;
            }

            return year;
        }))

        if (gotOlderYears) {
            years.push('Older');
        }

        years = years.join(',|,');
        years = years.split(',');
        return (
            <span className='d-inline-block flex-items-align-center padding-x-sm' >
                {_.map(years, function (item, idx) {
                    return (
                        item == '|' ?
                            <span key={item + idx} className='d-inline-block margin-x-md' >
                                {item}
                            </span>
                            :
                            <span key={item + idx} className={selectedYear == item ? 'd-inline-block cursor-pointer border-bottom-ccar-yellow hover-yellow-darken-3 ccar-yellow' : 'd-inline-block cursor-pointer hover-ccar-yellow'} onClick={() => { setSelectedYear(item) }}>
                                {item}
                            </span>
                    )
                })}
            </span>
        )
    }

    const _renderVariantsPriceList = () => {
        return (
            <React.Fragment>
                <Desktop>
                    {/* <div className=' w-100 flex-items-align-center flex-justify-space-between'>
                    <span className='d-inline-block h5 uppercase font-weight-bold' >
                        Variants Price list
                    </span>
                    {
                        _renderVariantGroupTitle()
                    }
                </div>

                <div>
                    <div className="price-list-test scroll-x-wrapper ">
                        <span>All Variant</span>
                        <span style={{ marginLeft: '324px' }}>Transmission</span>
                        <span style={{ marginLeft: '90px' }} >Price</span>
                        <span style={{ marginLeft: '140px' }} >Monthly Payment</span>
                    </div>
                    <div className="price-list-test-detail scroll-x-wrapper">
                        {
                            !carDetails || !notEmptyLength(variants) ?
                                <Empty />
                                :
                                _.compact(_.map(variants, (item, idx) => {
                                    return (
                                        isSelectedYear(item.year) ?
                                            <div key={item._id + idx + 'div'}  >
                                                <span className='cursor-pointer' style={{ width: '370px', display: 'inline-block' }}
                                                >
                                                    {item.nameSearchBar}
                                                </span>
                                                <span style={{ width: '100px', display: 'inline-block', marginLeft: '28px' }}>
                                                    {item.transmission}
                                                </span>
                                                <span style={{ width: '100px', display: 'inline-block', color: 'rgb(251, 176, 64)', marginLeft: '50px' }}>
                                                    RM {formatNumber(item.price || 0, null, null, 2)}
                                                </span>
                                                <span style={{ width: '100px', display: 'inline-block', color: 'rgb(80, 135, 251)', marginLeft: '90px' }}>
                                                    RM {formatNumber(calMonth(item.price || 0), null, null, 2)}
                                                </span>
                                                <span style={{ width: '100px', display: 'inline-block', marginLeft: '20px' }}>
                                                    <Tooltip placement="right" title={`Calculate ${_.upperCase(item.nameSearchBar)} Monthly Pay`}>
                                                        <Icon type="calculator" className='ccar-yellow cursor-pointer' style={{ fontSize: '25px', paddingTop: '13px' }} onClick={() => { calculateMonthlyPay(item) }} />
                                                    </Tooltip>
                                                </span>
                                            </div>
                                            :
                                            null
                                    )
                                }))
                        }
                    </div>
                </div> */}
                    <div className=' w-100 flex-items-align-center flex-justify-space-between'>
                        <span className='d-inline-block h5 uppercase font-weight-bold' >
                            Variants Price list
                    </span>
                        {
                            _renderVariantGroupTitle()
                        }
                    </div>

                    <div >
                        <Row style={{ backgroundColor: '#EEEDEB', padding: '10px' }} className="scroll-x-wrapper ">
                            <Col span={12}>All Variant</Col>
                            <Col span={3}>Transmission</Col >
                            <Col span={4}>Price</Col>
                            <Col span={5}>Monthly Payment</Col>
                        </Row>
                        <div style={{ padding: '10px' }} className="scroll-x-wrapper">
                            {
                                !carDetails || !notEmptyLength(variants) ?
                                    <Empty />
                                    :
                                    _.compact(_.map(variants, (item, idx) => {
                                        return (
                                            isSelectedYear(item.year) ?
                                                <div key={item._id + idx + 'div'}  >
                                                    <Row>
                                                        <Col span={12}>
                                                            <div className='cursor-pointer' style={{ display: 'inline-block' }}>
                                                                {item.nameSearchBar}
                                                            </div>
                                                        </Col>
                                                        <Col span={3}>
                                                            <div style={{ display: 'inline-block' }}>
                                                                {item.transmission}
                                                            </div>
                                                        </Col>
                                                        <Col span={4}>
                                                            <div style={{ display: 'inline-block', color: 'rgb(251, 176, 64)' }}>
                                                                RM {formatNumber(item.price || 0, null, null, 2)}
                                                            </div>
                                                        </Col>
                                                        <Col span={4}>
                                                            <div style={{ display: 'inline-block', color: 'rgb(80, 135, 251)' }}>
                                                                RM {formatNumber(calMonth(item.price || 0), null, null, 2)}
                                                            </div>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Tooltip placement="right" title={`Calculate ${_.upperCase(item.nameSearchBar)} Monthly Pay`}>
                                                                <Icon type="calculator" className='ccar-yellow cursor-pointer' style={{ fontSize: '25px' }} onClick={() => { calculateMonthlyPay(item) }} />
                                                            </Tooltip>
                                                        </Col>
                                                    </Row>

                                                    {/* <span style={{ width: '100px', display: 'inline-block', marginLeft: '20px' }}>
                                                    <Tooltip placement="right" title={`Calculate ${_.upperCase(item.nameSearchBar)} Monthly Pay`}>
                                                        <Icon type="calculator" className='ccar-yellow cursor-pointer' style={{ fontSize: '25px', paddingTop: '13px' }} onClick={() => { calculateMonthlyPay(item) }} />
                                                    </Tooltip>
                                                </span> */}
                                                </div>
                                                :
                                                null
                                        )
                                    }))
                            }
                        </div>
                    </div>
                </Desktop>


            </React.Fragment>

        )

    }

    const _renderCarTipsAndTricks = () => {
        return (
            <React.Fragment>

                <Row>
                    <Col xs={12} sm={12} md={20} lg={20} xl={20}>
                        <label className="container-title" style={{ fontSize: '22px', fontWeight: '500', marginTop: '10px' }}> Car Tips & Tricks </label>
                    </Col>
                    <Col className="gutter-row" xs={12} sm={12} md={4} lg={4} xl={4}>
                        <div className="faen">
                            <a href="/newcar/filter">See More</a>
                        </div>
                    </Col>
                </Row>
                <div className="tips">
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
            </React.Fragment>
        );
    }

    const _renderPeerComparison = () => {
        return (
            <Card className="key-details" title="Peer Comparison">
                <Row>
                    {peerComp.map((item, idx) => {
                        return (
                            <Col key={'keyDetails' + idx} xs={12} sm={12} md={6} lg={6} xl={6} >
                                <Link href={`/newcar/details/${item.make + '/' + item.model}`} passHref >
                                    <div className="newcars-uniqBy-model cursor-pointer">
                                        <img src={item.uri} style={{ width: '100%', padding: '5px' }}></img>
                                        <div className="newcars-wrap-p">
                                            <p style={{ textTransform: 'capitalize', textAlign: 'center', fontSize: '16px', fontWeight: '600', marginBottom: '0px', color: "rgba(0, 0, 0, 0.65)" }}> {item.make}  {item.model}</p>
                                            <p style={{ textAlign: 'center', color: '#FBB040', fontSize: '16px', fontWeight: 500 }}>
                                                {
                                                    !item.minPrice && !item.maxPrice ?
                                                        'TBC'
                                                        :
                                                        `${item.minPrice ? 'RM ' + formatNumber(item.minPrice) : 'TBC'} - ${item.maxPrice ? 'RM ' + formatNumber(item.maxPrice) : 'TBC'}`
                                                }</p>
                                        </div>
                                    </div>
                                </Link>
                            </Col>
                        )
                    })}
                </Row>
            </Card>
        )

    }

    const _renderEstimatedFinancing = () => {

        const { getFieldDecorator } = props.form;
        return (

            <Card className="key-details" title="Car Loan Calculator" size="small">
                <Form
                    name="basic"
                >
                    <Row type="flex" align="middle">
                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img style={{ width: 25 }} src="/assets/carDetails/Car Maker@3x.png" />
                        </Col>
                        <Col xs={21} sm={21} md={21} lg={21} xl={21}>
                            <Form.Item style={{ margin: '10px' }}>
                                {
                                    getFieldDecorator('price', {
                                        rules: [{ required: true }],
                                    })(
                                        <Input
                                            placeholder="Total Price (RM)"
                                            onChange={typingTimeOut}
                                            type="number"
                                            suffix={
                                                <span className='d-inline-block' >
                                                    {
                                                        props.form.getFieldValue('price') ?
                                                            <CloseOutlined onClick={() => {
                                                                props.form.setFieldsValue({ price: undefined });
                                                                handleSubmit();
                                                            }} />
                                                            :
                                                            null
                                                    }
                                                </span>
                                            }
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row type="flex" align="middle">
                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img style={{ width: 25 }} src="/assets/carDetails/Wheel@3x.png" />
                        </Col>
                        <Col xs={21} sm={21} md={21} lg={21} xl={21}>
                            <Form.Item style={{ margin: '10px' }}>
                                {
                                    getFieldDecorator('downpayment', {
                                        rules: [{ required: true }],
                                    })(
                                        <Input
                                            placeholder="Downpayment (RM)"
                                            onChange={typingTimeOut}
                                            type="number"
                                            suffix={
                                                <span className='d-inline-block' >
                                                    {
                                                        props.form.getFieldValue('downpayment') ?
                                                            <CloseOutlined onClick={() => {
                                                                props.form.setFieldsValue({ downpayment: undefined });
                                                                handleSubmit();
                                                            }} />
                                                            :
                                                            null
                                                    }
                                                </span>
                                            }
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row type="flex" align="middle">
                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img style={{ width: 25 }} src="/assets/carDetails/Manufactory Years@3x.png" />
                        </Col>
                        <Col xs={21} sm={21} md={21} lg={21} xl={21}>
                            <Form.Item style={{ margin: '10px' }}>
                                {
                                    getFieldDecorator('loanPeriod', {
                                        rules: [{ required: true }],
                                    })(
                                        <Select
                                            placeholder="Loan Period (Year)"
                                            onChange={(e) => {
                                                setTimeout(() => {
                                                    handleSubmit();
                                                }, 500);
                                            }}>
                                            <Select.Option value={5} >5</Select.Option>
                                            <Select.Option value={7} >7</Select.Option>
                                            <Select.Option value={9} >9</Select.Option>
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row type="flex" align="middle">
                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img style={{ width: 25 }} src="/assets/carDetails/Location@3x.png" />
                        </Col>
                        <Col xs={21} sm={21} md={21} lg={21} xl={21}>
                            <Form.Item style={{ margin: '10px' }}>
                                {
                                    getFieldDecorator('interestRate', {
                                        rules: [{ required: true }],
                                    })(
                                        <Input
                                            placeholder="Interest Rate (%)"
                                            onChange={typingTimeOut}
                                            suffix={
                                                <span className='d-inline-block' >
                                                    {
                                                        props.form.getFieldValue('interestRate') ?
                                                            <CloseOutlined onClick={() => {
                                                                props.form.setFieldsValue({ interestRate: undefined });
                                                                handleSubmit();
                                                            }} />
                                                            :
                                                            null
                                                    }
                                                </span>
                                            }
                                        />
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>

                <div className="estimate-finance">
                    <div className="estimate-pay">
                        <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}> Monthly Pay</p>
                        <p style={{ fontWeight: 700, color: 'rgb(251, 176, 64)', fontSize: 18, padding: 0, margin: '6px 0' }}> RM {formatNumber(monthlyInstalment, null, null, 2)} </p>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <React.Fragment>
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={24} lg={18} xl={19}>
                    <Row gutter={[10, 10]}>
                        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className=' flex-justify-space-between flex-items-align-center'>
                                <span className='d-inline-block h5 font-weight-bold uppercase' >
                                    {carDetails ? carDetails.make + ' ' + carDetails.model : '-'}
                                </span>
                                <span className='d-inline-block' >
                                    <Wishlist
                    carspecId={!props.newCars || !carDetails ? null : carDetails._id}
                    saverId={props.user.authenticated ? props.user.info.user._id : null}
                    type="carspec"
                    handleError={(e) => handleError(e)}
                    handleSuccess={(e) => { message.success(e.type == 'remove' ? 'Removed from wishlist' : 'Saved to wishlist') }}
                    saveButton={() => {
                      return (
                        <Button className="compare"> <Icon type="heart" /> Save </Button>
                      )
                    }}
                    savedButton={() => {
                      return (
                        <Button className="compare ccar-yellow"> <Icon type="heart" theme="filled" /> Saved </Button>
                      )
                    }
                    } />
                                    <ShareButtonDialog />
                                    <Button className="compare" onClick={() => pushCompare()}><Icon type="car" /> Compare</Button>
                                </span>
                            </div>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {_renderCarDetailsbox()}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {_renderVariantsPriceList()}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {/* temporary remove */}
                            {/* {_renderCarTipsAndTricks()} */}
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} sm={24} md={0} lg={6} xl={5}>
                    <Row gutter={[10, 10]}>
                        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {_renderKeyDetailsBox()}
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {_renderEstimatedFinancing()}
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {_renderPeerComparison()}
                </Col>
            </Row>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    newCars: state.newcars || state.newCars,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(NewCarOverview)));