
import { Col, Form, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../../../common-function';
import { imageNotFound } from '../../../profile/config';
import Link from 'next/link';
import { routePaths } from '../../../../route';



const AllClubBox = (props) => {

    const [clubs, setClubs] = useState([])


    useEffect(() => {

        setClubs(_.isArray(props.data) && !_.isEmpty(props.data) ? props.data : []);

    }, [props.data])

    return (
        <React.Fragment>
            {
                _.isArray(clubs) && notEmptyLength(clubs) ?
                    <React.Fragment>
                        <Row justify="start" align="top" gutter={[10, 10]}>
                            {
                                clubs.map(function (v, i) {
                                    if (i === 0) {
                                        return (
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <Link shallow={false}  href={routePaths.socialClub.to || '/'} as={typeof (routePaths.socialClub.as) == 'function' ? routePaths.socialClub.as(v) : '/'} >
                                                    <a>
                                                        <div className="width-100 relative-wrapper cursor-pointer" style={{ height: 400 }}>
                                                            <img src={_.get(v, ['clubAvatar']) || imageNotFound} className="fill-parent absolute-center img-cover" ></img>
                                                            <div className="fill-parent background-black-opacity-50 flex-items-align-center flex-justify-center padding-md absolute-center stack-element-opacity-100">
                                                                <span className='d-inline-block white h6 text-truncate-threeline' >
                                                                    {_.get(v, ['clubName']) || ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            </Col>

                                        )
                                    }
                                    return (
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                            <Link shallow={false} href={routePaths.socialClub.to || '/'} as={typeof (routePaths.socialClub.as) == 'function' ? routePaths.socialClub.as(v) : '/'}>
                                                <a>
                                                    <div className="width-100 relative-wrapper cursor-pointer" style={{ height: 200 }}>
                                                        <img src={_.get(v, ['clubAvatar']) || imageNotFound} className="fill-parent absolute-center img-cover" ></img>
                                                        <div className="fill-parent background-black-opacity-50 flex-items-align-center flex-justify-center padding-md absolute-center stack-element-opacity-100">
                                                            <span className='d-inline-block white h6 text-truncate-threeline' >
                                                                {_.get(v, ['clubName']) || ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </Link>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </React.Fragment>
                    :
                    null
            }
        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes,
    carFreak: state.carFreak,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(AllClubBox)));