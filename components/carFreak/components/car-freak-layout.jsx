import { Form, Row, Col, message } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { withRouter } from 'next/router';
import Link from 'next/link';

import { loginMode, loading } from '../../../redux/actions/app-actions';


const CarFreakLayout = (props) => {

    const [tabKey, setTabKey] = useState('car-freaks')


    useEffect(() => {


    }, [])

    useEffect(() => {

        let pathname = _.get(props.router, ['asPath']) || '';
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
                break;
        }

    }, [props.router.asPath])

    return (
        <React.Fragment>
            <div className="section">
                <div className="container">
                    <Row gutter={[0, 30]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-justify-space-between flex-items-align-center">
                                <span className="flex-items-align-center flex-justify-start">
                                    <Link shallow prefetch href={'/car-freaks'}>
                                        <a>
                                            <span className={`d-inline-block cursor-pointer margin-right-lg h6 font-weight-bold ${tabKey == 'car-freaks' ? 'border-bottom-yellow yellow' : 'border-bottom-black black'} `} >
                                                CarFreaks
                                            </span>
                                        </a>
                                    </Link>
                                    <Link shallow prefetch href={'/social-board'}>
                                        <a>
                                            <span className={`d-inline-block cursor-pointer margin-right-lg h6 font-weight-bold ${tabKey == 'social-board' ? 'border-bottom-yellow yellow' : 'border-bottom-black black'} `}  >
                                                Social Board
                                    </span>
                                        </a>
                                    </Link>
                                    <Link shallow prefetch href={'/social-club'}>
                                        <a>
                                            <span className={`d-inline-block cursor-pointer margin-right-lg h6 font-weight-bold ${tabKey == 'social-club' ? 'border-bottom-yellow yellow' : 'border-bottom-black black'} `} >
                                                CarFreaks Club
                                    </span>
                                        </a>
                                    </Link>
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