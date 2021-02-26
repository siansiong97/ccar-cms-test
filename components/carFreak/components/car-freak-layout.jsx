import { Form, Row, Col, message } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { loading, loginMode } from '../../../actions/app-actions';
import { useEffect, useState } from 'react';
import _ from 'lodash';

const CarFreakLayout = (props) => {

    const [tabKey, setTabKey] = useState('car-freaks')

    useEffect(() => {

        let pathname = _.get(props.location, ['pathname']) || '';
        pathname = pathname.split('/') || [];
        pathname = pathname[1];

        switch (pathname) {
            case 'car-freaks':
                setTabKey('car-freaks')
                break;
            case 'social-board':
                setTabKey('social-board')
                break;
            case 'social-club':
                setTabKey('social-club')
                break;
            default:
                message.error('Path Not Found!');
                props.router.push('/');
                break;
        }

    }, [])

    return (
        <React.Fragment>
            <div className="section">
                <div className="container">
                    <Row gutter={[0, 30]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-justify-space-between flex-items-align-center">
                                <span className="flex-items-align-center flex-justify-start">
                                    <span className={`d-inline-block cursor-pointer margin-right-lg h6 font-weight-bold ${tabKey == 'car-freaks' ? 'border-bottom-yellow yellow' : 'border-bottom-black black'} `} onClick={(e) => { props.router.push('/car-freaks'); }} >
                                        CarFreaks
                                    </span>
                                    <span className={`d-inline-block cursor-pointer margin-right-lg h6 font-weight-bold ${tabKey == 'social-board' ? 'border-bottom-yellow yellow' : 'border-bottom-black black'} `} onClick={(e) => { props.router.push('/social-board') }}  >
                                        Social Board
                                    </span>
                                    <span className={`d-inline-block cursor-pointer margin-right-lg h6 font-weight-bold ${tabKey == 'social-club' ? 'border-bottom-yellow yellow' : 'border-bottom-black black'} `} onClick={(e) => { props.router.push('/social-club') }}  >
                                        CarFreaks Club
                                    </span>
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {
                                props.children
                            }
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    loginMode
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CarFreakLayout)));