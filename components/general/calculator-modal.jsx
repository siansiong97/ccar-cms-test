import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, InputNumber, Modal, Row, Select, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form } from '@ant-design/compatible';
import { withRouter } from 'next/dist/client/router';
import { formatNumber, notEmptyLength, numberToFixed } from '../../common-function';


const priceRef = React.createRef();
const downPaymentRef = React.createRef();

const CalculatorModal = (props) => {

    const { getFieldDecorator } = props.form;

    const [visible, setVisible] = useState(false);
    // const [calculateFields, setCalculateFields] = useState(
    //     {
    //         price: 0,
    //         downpayment: 0,
    //         interestRate: 0,
    //         loanPeriod: 9,
    //     }
    // );
    const [monthlyInstalment, setMonthlyInstallment] = useState(0);
    const [timeoutFunction, setTimeoutFunction] = useState(null);
    const [formValue, setFormValue] = useState({
        price: 0,
    });


    // useEffect(() => {
    //     if (notEmptyLength(calculateFields)) {
    //         //Start calculate monthly payment
    //         typingTimeOut();
    //     } else {
    //         setCalculateFields({
    //             price: 0,
    //             downpayment: 0,
    //             interestRate: 0,
    //             loanPeriod: 9,
    //         });
    //     }
    // }, [calculateFields])



    useEffect(() => {
        reset();
    }, [props.data])

    function close(e) {
        setVisible(false);
    }


    function typingTimeOut() {
        clearTimeout(timeoutFunction);
        setTimeoutFunction(setTimeout(() => {
            handleSubmit();
        }, 1000))
    }

    function reset() {
        if (notEmptyLength(props.data)) {
            props.form.setFieldsValue({
                price: !_.isNaN(parseFloat(props.data.price)) ? parseFloat(numberToFixed(props.data.price, true, 2)) : null,
                downpayment: !_.isNaN(parseFloat(numberToFixed(props.data.price * 0.1, true, 2))) && _.isNaN(parseFloat(props.data.downpayment)) ? parseFloat(numberToFixed(props.data.price * 0.1, true, 2)) : !_.isNaN(parseFloat(props.data.downpayment)) ? parseFloat(numberToFixed(props.data.downpayment, true, 2)) : null,
                loanPeriod: 9,
                interestRate: 3.00
            })
            handleSubmit();
        } else {
            props.form.setFieldsValue({
                price: 0,
                downpayment: 0,
                loanPeriod: 9,
                interestRate: 0.00
            })
            handleSubmit();

        }
    }


    // function handleOnChange() {
    //     let price = '0';
    //     let downpayment = '0';
    //     let interestRate = '3';
    //     let loanPeriod = '9';


    //     if (props.form.getFieldValue('price')) {
    //         price = props.form.getFieldValue('price').toString();
    //         price = formatNumber(price.replace(',', ''), null, true, 2);
    //     }

    //     if (props.form.getFieldValue('downpayment')) {
    //         downpayment = props.form.getFieldValue('downpayment').toString();
    //         downpayment = formatNumber(downpayment.replace(',', ''), null, true, 2);
    //     }

    //     if (props.form.getFieldValue('interestRate')) {
    //         interestRate = props.form.getFieldValue('interestRate');
    //     }
    //     if (props.form.getFieldValue('loanPeriod')) {
    //         loanPeriod = props.form.getFieldValue('loanPeriod');
    //     }

    //     setCalculateFields({
    //         price: isValidNumber(price.replace(',', '')) ? parseFloat(price.replace(',', '')) : 0,
    //         downpayment: isValidNumber(downpayment.replace(',', '')) ? parseFloat(downpayment.replace(',', '')) : 0,
    //         interestRate: interestRate ? interestRate : 3,
    //         loanPeriod: loanPeriod ? loanPeriod : 9,
    //     });
    // }
    function handleSubmit() {
        props.form.validateFields((err, values) => {
            if (!err) {
                let LoanAmount = parseFloat(values.price) - parseFloat(values.downpayment)
                let LoanPeriod = parseInt(values.loanPeriod)
                let Interest = parseFloat(values.interestRate) / 100
                let totalInterest = Interest * LoanAmount * LoanPeriod
                let monthlyInterest = totalInterest / (LoanPeriod * 12)
                let monthlyInstalment = numberToFixed((LoanAmount + totalInterest) / (LoanPeriod * 12), true, 2)

                //Rounding fields to 2 decimal point
                props.form.setFieldsValue({
                    price: !_.isNaN(parseFloat(values.price)) ? parseFloat(numberToFixed(values.price, true, 2)) : null,
                    downpayment: !_.isNaN(parseFloat(numberToFixed(values.price * 0.1, true, 2))) && _.isNaN(parseFloat(values.downpayment)) ? parseFloat(numberToFixed(values.price * 0.1, true, 2)) : !_.isNaN(parseFloat(values.downpayment)) ? parseFloat(numberToFixed(values.downpayment, true, 2)) : null,
                    interestRate: !_.isNaN(parseFloat(values.interestRate)) ? parseFloat(numberToFixed(values.interestRate, true, 2)) : null,
                })
                setMonthlyInstallment(monthlyInstalment);
            } else {
                setMonthlyInstallment('N/A');
                // _.map(err, function (err) {
                //     return message.error(err.errors[0].message)
                // })
            }
        })
    }


    return (

        <React.Fragment>
            <Modal
                visible={visible}
                centered
                title="Car Loan Calculator"
                maskClosable={true}
                closable={true}
                footer={null}
                onCancel={close}
                width="350px"
                // wrapClassName="md-padding-modal-body"
            >
                <Form
                    name="basic"
                >
                    <Form.Item style={{ margin: '0px 5px' }}>

                        <Row align="middle" gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <span className='caption flex-items-align-center' style={{ maxHeight: '30px' }} >
                                    Loan Amount
                                    </span>
                            </Col>
                            <Col xs={22} sm={22} md={22} lg={22} xl={22}>
                                {
                                    getFieldDecorator('price', {
                                        rules: [{ required: false }],
                                    })(
                                        <InputNumber
                                            ref={priceRef}
                                            placeholder="Total Price (RM)"
                                            formatter={value => {
                                                if (!value && priceRef.current) {
                                                    priceRef.current.focus();
                                                }
                                                return `RM ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                            }}
                                            parser={value => value.replace(/\RM\s?|(,*)/g, '')}
                                            onChange={typingTimeOut}
                                            step="0.01"
                                            className='width-100'
                                        />
                                    )
                                }
                            </Col>
                            {
                                props.form.getFieldValue('price') ?
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <CloseOutlined key="price-close" onClick={() => {
                                                props.form.setFieldsValue({ price: 0 });
                                                handleSubmit();
                                            }} />
                                        </div>
                                    </Col>

                                    :
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <Tooltip placement="topLeft" title="The vehicle selling price.">
                                                <InfoCircleOutlined key="downpayment-info" className='ccar-yellow' />
                                            </Tooltip>
                                        </div>
                                    </Col>

                            }
                        </Row>
                    </Form.Item>
                    <Form.Item style={{ margin: '0px 5px' }}>
                        <Row align="middle" gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <span className='caption flex-items-align-center' style={{ maxHeight: '30px' }} >
                                    Down Payment
                                    </span>
                            </Col>

                            <Col span={props.form.getFieldValue('downpayment') ? 22 : 22}>
                                {
                                    getFieldDecorator('downpayment', {
                                        rules: [{ required: false }],
                                    })(
                                        <InputNumber
                                            ref={downPaymentRef}
                                            placeholder="Downpayment (RM)"
                                            formatter={value => {
                                                if (!value && downPaymentRef.current) {
                                                    downPaymentRef.current.focus();
                                                }
                                                return `RM ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                            }}
                                            parser={value => value.replace(/\RM\s?|(,*)/g, '')}
                                            onChange={typingTimeOut}
                                            step="0.01"
                                            className='width-100 no-margin'
                                        />
                                    )
                                }
                            </Col>
                            {
                                props.form.getFieldValue('downpayment') ?
                                    <Col span={2}  >
                                        <div className='fill-pareont flex-justify-center flex-items-align-center'>
                                            <CloseOutlined key="dwnpayment-close" onClick={() => {
                                                props.form.setFieldsValue({ downpayment: undefined });
                                                handleSubmit();
                                            }} />
                                        </div>
                                    </Col>

                                    :
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <Tooltip placement="topLeft" title="The amount of money you need to pay by your own. Default rate of downpayment is 10%.(This cost is not covered by the loan that take from a bank).">
                                                <InfoCircleOutlined key="downpayment-info" className='ccar-yellow' />
                                            </Tooltip>
                                        </div>
                                    </Col>

                            }
                        </Row>

                    </Form.Item>

                    <Form.Item style={{ margin: '0px 5px' }}>
                        <Row align="middle" gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <span className='caption flex-items-align-center' style={{ maxHeight: '30px' }} >
                                    Loan Period
                                    </span>
                            </Col>
                            <Col span={props.form.getFieldValue('loanPeriod') ? 22 : 22}>
                                {
                                    getFieldDecorator('loanPeriod', {
                                        rules: [{ required: false }],
                                    })(
                                        <Select
                                            className="width-100"
                                            placeholder="Loan Period (Year)"
                                            onChange={typingTimeOut}>
                                            <Select.Option value={5} >5 Years</Select.Option>
                                            <Select.Option value={7} >7 Years</Select.Option>
                                            <Select.Option value={9} >9 Years</Select.Option>
                                        </Select>
                                    )
                                }
                            </Col>
                            {
                                props.form.getFieldValue('loanPeriod') ?
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <CloseOutlined key="loanPeriod-close" onClick={() => {
                                                props.form.setFieldsValue({ loanPeriod: undefined });
                                                handleSubmit();
                                            }} />
                                        </div>
                                    </Col>

                                    :
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <Tooltip placement="topLeft" title="The period (in years) for paying off the bank loan.">
                                                <InfoCircleOutlined key="loanPeriod-info" className='ccar-yellow' />
                                            </Tooltip>
                                        </div>
                                    </Col>

                            }
                        </Row>
                    </Form.Item>
                    <Form.Item style={{ margin: '0px 5px' }}>
                        <Row align="middle" gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <span className='caption flex-items-align-center' style={{ maxHeight: '30px' }} >
                                    Interest Rate
                                    </span>
                            </Col>
                            <Col span={props.form.getFieldValue('interestRate') ? 22 : 22}>
                                {
                                    getFieldDecorator('interestRate', {
                                        rules: [{ required: false }],
                                    })(
                                        <InputNumber
                                            placeholder="Interest Rate (%)"
                                            formatter={value => `${value}%`}
                                            parser={value => value.replace('%', '')}
                                            onChange={typingTimeOut}
                                            step="0.01"
                                            className='width-100'
                                        />
                                    )
                                }
                            </Col>
                            {
                                props.form.getFieldValue('interestRate') ?
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <CloseOutlined key="interestRate-close" onClick={() => {
                                                props.form.setFieldsValue({ interestRate: undefined });
                                                handleSubmit();
                                            }} />
                                        </div>
                                    </Col>

                                    :
                                    <Col span={2}  >
                                        <div className='fill-parent flex-justify-center flex-items-align-center'>
                                            <Tooltip placement="topLeft" title="The loan interest rate charged by your bank.">
                                                <InfoCircleOutlined key="interestRate-info" className='ccar-yellow' />
                                            </Tooltip>
                                        </div>
                                    </Col>

                            }


                        </Row>
                    </Form.Item>


                    <div className='round-border text-align-center border-yellow-darken-1 margin-top-md'>
                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}> Monthly Pay</div>
                        <div style={{ fontWeight: 700, color: 'rgb(251, 176, 64)', fontSize: 18, padding: 0 }}> RM {formatNumber(monthlyInstalment, null, null, 2)} </div>
                    </div>

                </Form>

            </Modal>


            <a onClick={(e) => { setVisible(true); reset(); }}>
                {
                    props.button ?
                        props.button()
                        :
                        // <Tooltip placement="top" title={`Calculate my monthly payment`}>
                        //     <Button style={{ paddingLeft: '9px', paddingRight: '9px' }} >
                        //         <div className='fill-parent flex-items-align-center' >
                        //             <Icon type="calculator" className='ccar-yellow cursor-pointer' style={{ fontSize: '20px' }}/>
                        //         </div>
                        //     </Button>
                        <Button
                            type="normal"
                            className="w-100 ads-purchase-button "
                            style={{ padding: 0 }}
                        >
                            {/* <WhatsAppOutlined style={{ fontSize: 20, color: 'white' }} /> */}
                            <img src="/assets/profile/icon-list/calculator.png" style={{ width: '19px' }} />
                        </Button>
                    // </Tooltip>
                }
            </a>

        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CalculatorModal)));