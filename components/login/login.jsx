import React from 'react';
import { Modal, Input, Row, Col, Divider, Button, message } from 'antd';
import { Form} from '@ant-design/compatible';
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import _ from 'lodash'
import { UserOutlined, LockFilled } from '@ant-design/icons';
import { loginSuccessful } from '../../redux/actions/user-actions';
import { loading, loginMode } from '../../redux/actions/app-actions';
import client from '../../feathers';
import { getFaceBookId, getGoogleId } from '../../functionContent';
import { loginBackground, tbh1Cny, tbh2Cny, cnyLionHead, cnyLogo, googleLogo } from '../../icon';
const facebookId = getFaceBookId(client.io.io.uri)
const googleClientId = getGoogleId(client.io.io.uri)


const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class LoginModal extends React.Component {
  // static getInitialProps({store}) {}
  constructor(props) {
    super(props);
    this.state = {
      tab: 'socialMediaLogin',
    }
  }

  responseGoogle = (response) => {

    if (response.error) {
      return
    }

    this.props.loading(true);
    client.authenticate({
      strategy: 'google',
      access_token: response.accessToken
    })
      .then((res) => {
        this.props.loading(false);

        this.props.loginSuccessful(res);
        this.props.loginMode(false)
      }).catch((err) => {
        this.props.loading(false);
        console.log(err)
        // message.error(err.message)
      })
  }

  responseFacebook = (response) => {
    this.props.loading(true);
    client.authenticate({
      strategy: 'facebook',
      access_token: response.accessToken
    })
      .then((res) => {
        this.props.loading(false);
        this.props.loginSuccessful(res);
        this.props.loginMode(false)
      })
      .catch((err) => {
        this.props.loading(false);
        console.log(err)
        // message.error(err.message)
      })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loading(true);
        client.authenticate({
          strategy: 'local',
          username: values.username,
          password: values.password
        })
          .then((res) => {
            this.props.loading(false);
            this.props.loginSuccessful(res);
            this.props.loginMode(false)
          }).catch(err => {
            this.props.loading(false);
            message.error(err.message)
          });
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        // title="Basic Modal"
        visible={_.get(this.props, ['app', 'loginMode'])}
        onOk={() => (this.refClick.click())}
        onCancel={() => this.props.loginMode(false)}
        style={{ borderRadius: '100px' }}
        footer={null}
        bodyStyle={{ padding: 0 }}
        centered
      >
        <div className="padding-lg round-border relative-wrapper" style={{
          backgroundImage: `url(${loginBackground})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }} >


          <Row gutter={[20, 40]}>
            <Col span={24}>
              <Row>
                <Col xs={{ span: 3, offset: 0 }} sm={{ span: 3, offset: 0 }} md={{ span: 3, offset: 4 }} lg={{ span: 3, offset: 4 }} xl={{ span: 3, offset: 4 }} style={{ marginRight: 10 }}>
                  {/* <Row>
                              <Col style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }} className="col-centered" xs={6} sm={6} md={24} lg={24} xl={24}> */}
                  <div className="wrap-login-logo">
                    {/* <img alt="ccar" className="w-100" src="/assets/Ccar-logo.png" /> */}
                    <img alt="ccar" className="w-100" src={cnyLogo} />
                  </div>
                  {/* </Col>
                          </Row> */}
                </Col>
                <Col xs={20} sm={20} md={16} lg={16} xl={16}>
                  <div className="wrap-login-title flex-wrap">
                    <h2 style={{ marginBottom: '15px' }}>Welcome to CCAR</h2>
                    <p >{`Connect with your ${this.state.tab == 'socialMediaLogin' ? 'social media' : 'dealer account'}`}</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="width-100" >
            {
              this.state.tab == 'socialMediaLogin' ?
                <div key="social-media-login-form" className='fill-parent'>
                  <Row gutter={[20, 20]} className='fill-parent' type="flex" justify="center" align="middle">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <GoogleLogin
                        clientId={googleClientId}
                        buttonText="Login"
                        render={renderProps => (
                          <button className="google-btn w-100" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                            <div className="wrap-social-login-btn-child">
                              <img src={googleLogo} />
                              <span>GOOGLE</span>
                            </div>
                          </button>
                        )}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <FacebookLogin
                        appId={facebookId}
                        isMobile={false}
                        callback={this.responseFacebook}
                        render={renderProps => (
                          <button className="facebook-btn w-100" onClick={renderProps.onClick}>
                            <div className="wrap-social-login-btn-child">
                              <img src="/assets/Social Media/Facebook @3x.png" />
                              <span>FACEBOOK</span>
                            </div>
                          </button>
                        )}
                      />
                    </Col>
                  </Row>
                </div>
                :
                <div key="dealer-login-form" className='fill-parent'>
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Row gutter={[0, 10]} className='fill-parent' type="flex" justify="center" align="middle">
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="width-100 flex-justify-center flex-items-align-center">
                          <Form.Item style={{ margin: '0px' }}>
                            {getFieldDecorator('username', {
                              rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                              <Input prefix={
                                  <UserOutlined />
                              }
                                placeholder="Username"
                              />
                            )}
                          </Form.Item>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="width-100 flex-justify-center flex-items-align-center">
                          <Form.Item style={{ margin: '0px' }}>
                            {getFieldDecorator('password', {
                              rules: [{ required: true, message: 'Please input your password!' }],
                            })(
                              <Input type="password" prefix={
                                  <LockFilled />
                              }
                                placeholder="Password"
                              />
                            )}
                          </Form.Item>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="width-100 flex-justify-center flex-items-align-center">
                          <Button className="padding-x-xl background-ccar-yellow border-ccar-yellow" htmlType="submit" >Sign In</Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>

            }

          </div>
          <Divider orientation="center" className="background-transparent" style={{ color: '#333', fontWeight: 'normal' }}>
            <div><p style={{ marginBottom: 0, color: 'rgb(142, 142, 142)' }}>or</p></div>
          </Divider>

          <div className="wrap-register-link">
            {/* <a onClick={() => { this.props.router.push('/register'); this.props.loginMode(false) }}>Register as Business Owner </a>
                <Divider type="vertical"/> */}
            {
              this.state.tab == 'socialMediaLogin' ?
                <a onClick={(e) => { this.setState({ tab: 'dealerLogin' }) }}> Login as Business Owner</a>
                :
                <a onClick={(e) => { this.setState({ tab: 'socialMediaLogin' }) }}> Login as Normal User</a>
            }
          </div>
          {/* 
            <Form
                {...layout}
                name="basic"
                onSubmit={this.handleSubmit}
            >

            <Form.Item style={{ marginBottom: '10px' }}>
                {
                getFieldDecorator('email', {
                    rules: [{ required: false }]
                })(
                  <Input/>
                )
                }
            </Form.Item>

            <Form.Item style={{ marginBottom: '10px' }}>
                {
                getFieldDecorator('password', {
                    rules: [{ required: false }]
                })(
                  <Input/>
                )
                }
            </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="submit"  htmlType="submit">
                    Submit
                    </Button>
                </Form.Item>
              </Form> */}

          <style jsx="true" global="true">{`
              .ant-modal-content {
                border-radius: 6px;
              }
          `}</style>


          {/* <img src={tbhCny} style={{ width: 283, height: 400,position: 'absolute', left: -115, bottom: -30, margin : 'auto' }}></img> */}
          <img src={tbh1Cny} style={{ width: 166, height: 330,position: 'absolute', left: -90, bottom: 0, margin : 'auto' }}></img>
          <img src={tbh2Cny} style={{ width: 150, height: 100,position: 'absolute', left: -15, bottom: 8, margin : 'auto' }}></img>
          <img src={cnyLionHead} style={{ width: 100, height: 150, position: 'absolute', right: -30, top: -95 }}></img>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  app: state.app
});

const mapDispatchToProps = {
  loading: loading,
  loginMode: loginMode,
  loginSuccessful: loginSuccessful,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LoginModal));
