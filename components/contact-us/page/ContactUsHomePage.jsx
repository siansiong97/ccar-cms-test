import { Button, Col, Form, Icon, Input, message, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import client from '../../../feathers';
import LayoutV2 from '../../general/LayoutV2';
import { loading } from '../../../redux/actions/app-actions';
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

class ContactUsIndex extends React.Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                client.service('contact-us').create(values).then(res => {
                    message.success('Form submited. We will get back to you soon.');
                    this.props.form.resetFields();
                }).catch(err => {
                    message.error(err.message)
                });

            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <LayoutV2>
                <Desktop>
                <div className="fixed-container">
                    <div className="container background-white">
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                                <div className="margin-left-xl margin-top-xs">
                                    <h1> Contact Us </h1>
                                    <h3> We value your feedback! Let us know what you think.</h3>

                                    <Row>
                                        <Col span={20}>
                                            <Form onSubmit={this.handleSubmit} >
                                                <Form.Item label="Subject" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('subject', {
                                                        rules: [{ required: true, message: 'Please input your subject!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Subject"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Name" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('name', {
                                                        rules: [{ required: true, message: 'Please input your name!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Fullname"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Mobile Number" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('mobileNumber', {
                                                        rules: [{ required: true, message: 'Please input your mobile number!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="eg:+601234567"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Email" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('email', {
                                                        rules: [{ required: true, message: 'Please input your email!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="eg: example@gmail.com"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Description" style={{ marginBottom: '10px' }}>
                                                    {getFieldDecorator('description', {
                                                        rules: [{ required: true, message: 'Please state your description!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Description"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ textAlign: 'right' }}>
                                                    <Button type="primary" htmlType="submit">
                                                        Submit
                                        </Button>
                                                </Form.Item>

                                            </Form>
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                            <Col xs={0} sm={0} md={12} lg={14} xl={14}>
                                <img style={{ width: '100%', marginTop: '-120px' }} src="/assets/about-us/contact_us_1.png"></img>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={0} sm={0} md={0} lg={24} xl={24} style={{ marginTop: '-22px' }}>
                                <img style={{ width: '75%', height: '225px' }} src="/assets/about-us/contact_us_2.png"></img>
                                <div className="overlay margin-left-xl " style={{ marginTop: '50px' }}>
                                    <Row>
                                        <Col xs={{ span: 0, offsetTop: 110 }} sm={{ span: 0, offsetTop: 110 }} md={{ span: 12, offsetTop: 110 }} lg={{ span: 12, offsetTop: 110 }} xl={{ span: 12, offsetTop: 110 }}>
                                            <h3> Should you have any urgent questions or concerns, please contact us.</h3>
                                            <p> Name: CCAR SDN BHD | CCAR.my(1377691-V)</p>
                                            <p> Address: S-23-1 & S-23-3, Menara YNH, No. 8, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur</p>
                                            <p> Office: 03-64197710 / 03-64197712</p>
                                            <p> Email: info@ccar.my </p>
                                        </Col>

                                        <Col style={{ marginTop: '50px' }} xs={{ span: 20, offsetTop: 110 }} sm={{ span: 20, offsetTop: 110 }} md={{ span: 0, offsetTop: 110 }} lg={{ span: 0, offsetTop: 110 }} xl={{ span: 0, offsetTop: 110 }}>
                                            <h3> Should you have any urgent questions or concerns, please contact us.</h3>
                                            <p> Name: CCAR SDN BHD | CCAR.my(1377691-V)</p>
                                            <p> Address: S-23-1 & S-23-3, Menara YNH, No. 8, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur</p>
                                            <p> Office: 03-64197710 / 03-64197712</p>
                                            <p> Email: info@ccar.my </p>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                </Desktop>

                <Tablet>
                <div className="section-version3">
                    <div className="container-version3 background-white">

                        <Row>
                            <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                                <div className="margin-left-xl margin-top-xs">
                                    <h1> Contact Us </h1>
                                    <h3> We value your feedback! Let us know what you think.</h3>

                                    <Row>
                                        <Col span={20}>
                                            <Form onSubmit={this.handleSubmit} >
                                                <Form.Item label="Subject" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('subject', {
                                                        rules: [{ required: true, message: 'Please input your subject!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Subject"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Name" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('name', {
                                                        rules: [{ required: true, message: 'Please input your name!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Fullname"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Mobile Number" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('mobileNumber', {
                                                        rules: [{ required: true, message: 'Please input your mobile number!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="eg:+601234567"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Email" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('email', {
                                                        rules: [{ required: true, message: 'Please input your email!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="eg: example@gmail.com"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Description" style={{ marginBottom: '10px' }}>
                                                    {getFieldDecorator('description', {
                                                        rules: [{ required: true, message: 'Please state your description!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Description"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ textAlign: 'right' }}>
                                                    <Button type="primary" htmlType="submit">
                                                        Submit
                                        </Button>
                                                </Form.Item>

                                            </Form>
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                            <Col xs={0} sm={0} md={12} lg={14} xl={14}>
                                <img style={{ width: '100%', marginTop: '-120px' }} src="/assets/about-us/contact_us_1.png"></img>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={24} md={24} lg={0} xl={0} style={{ marginTop: '-22px' }}>
                                <img style={{ width: '75%', height: '320px' }} src="/assets/about-us/contact_us_2.png"></img>
                                <div className="overlay" style={{ marginLeft: '20px' }}>
                                    <Row>
                                        <Col style={{ marginTop: '90px' }} xs={{ span: 0, offsetTop: 110 }} sm={{ span: 0, offsetTop: 110 }} md={{ span: 12, offsetTop: 110 }} lg={{ span: 12, offsetTop: 110 }} xl={{ span: 12, offsetTop: 110 }}>
                                            <h3> Should you have any urgent questions or concerns, please contact us.</h3>
                                            <p> Name: CCAR SDN BHD | CCAR.my(1377691-V)</p>
                                            <p> Address: S-23-1 & S-23-3, Menara YNH, No. 8, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur</p>
                                            <p> Office: 03-64197710 / 03-64197712</p>
                                            <p> Email: info@ccar.my </p>
                                        </Col>

                                        <Col style={{ marginTop: '50px' }} xs={{ span: 20, offsetTop: 110 }} sm={{ span: 20, offsetTop: 110 }} md={{ span: 0, offsetTop: 110 }} lg={{ span: 0, offsetTop: 110 }} xl={{ span: 0, offsetTop: 110 }}>
                                            <h3> Should you have any urgent questions or concerns, please contact us.</h3>
                                            <p> Name: CCAR SDN BHD | CCAR.my(1377691-V)</p>
                                            <p> Address: S-23-1 & S-23-3, Menara YNH, No. 8, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur</p>
                                            <p> Office: 03-64197710 / 03-64197712</p>
                                            <p> Email: info@ccar.my </p>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                </Tablet>

                <Mobile>
                <div className="section-version3">
                    <div className="container-version3 background-white">

                        <Row>
                            <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                                <div className="margin-left-xl margin-top-xs">
                                    <h1> Contact Us </h1>
                                    <h3> We value your feedback! Let us know what you think.</h3>

                                    <Row>
                                        <Col span={20}>
                                            <Form onSubmit={this.handleSubmit} >
                                                <Form.Item label="Subject" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('subject', {
                                                        rules: [{ required: true, message: 'Please input your subject!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Subject"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Name" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('name', {
                                                        rules: [{ required: true, message: 'Please input your name!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Fullname"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Mobile Number" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('mobileNumber', {
                                                        rules: [{ required: true, message: 'Please input your mobile number!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="eg:+601234567"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Email" style={{ marginBottom: '0px' }}>
                                                    {getFieldDecorator('email', {
                                                        rules: [{ required: true, message: 'Please input your email!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="eg: example@gmail.com"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item label="Description" style={{ marginBottom: '10px' }}>
                                                    {getFieldDecorator('description', {
                                                        rules: [{ required: true, message: 'Please state your description!' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Description"
                                                        />
                                                    )}
                                                </Form.Item>

                                                <Form.Item style={{ textAlign: 'right' }}>
                                                    <Button type="primary" htmlType="submit">
                                                        Submit
                                        </Button>
                                                </Form.Item>

                                            </Form>
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                            <Col xs={0} sm={0} md={12} lg={14} xl={14}>
                                <img style={{ width: '100%', marginTop: '-120px' }} src="/assets/about-us/contact_us_1.png"></img>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={24} md={24} lg={0} xl={0} style={{ marginTop: '-22px' }}>
                                <img style={{ width: '75%', height: '320px' }} src="/assets/about-us/contact_us_2.png"></img>
                                <div className="overlay" style={{ marginLeft: '20px' }}>
                                    <Row>
                                        <Col style={{ marginTop: '90px' }} xs={{ span: 0, offsetTop: 110 }} sm={{ span: 0, offsetTop: 110 }} md={{ span: 12, offsetTop: 110 }} lg={{ span: 12, offsetTop: 110 }} xl={{ span: 12, offsetTop: 110 }}>
                                            <h3> Should you have any urgent questions or concerns, please contact us.</h3>
                                            <p> Name: CCAR SDN BHD | CCAR.my(1377691-V)</p>
                                            <p> Address: S-23-1 & S-23-3, Menara YNH, No. 8, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur</p>
                                            <p> Office: 03-64197710 / 03-64197712</p>
                                            <p> Email: info@ccar.my </p>
                                        </Col>

                                        <Col style={{ marginTop: '50px' }} xs={{ span: 20, offsetTop: 110 }} sm={{ span: 20, offsetTop: 110 }} md={{ span: 0, offsetTop: 110 }} lg={{ span: 0, offsetTop: 110 }} xl={{ span: 0, offsetTop: 110 }}>
                                            <h3> Should you have any urgent questions or concerns, please contact us.</h3>
                                            <p> Name: CCAR SDN BHD | CCAR.my(1377691-V)</p>
                                            <p> Address: S-23-1 & S-23-3, Menara YNH, No. 8, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur</p>
                                            <p> Office: 03-64197710 / 03-64197712</p>
                                            <p> Email: info@ccar.my </p>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                </Mobile>
                
            </LayoutV2>
        )
    }
}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ContactUsIndex)));