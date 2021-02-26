import '@brainhubeu/react-carousel/lib/style.css';
import { Col, Form, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { notEmptyLength } from '../../../profile/common-function';
import { imageNotFound } from '../../../userProfile/config';



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
                                                <div className="width-100 relative-wrapper cursor-pointer" style={{ height: 400 }} onClick={() => {
                                                    if (_.get(v, ['_id'])) {
                                                        props.router.push(`/social-club/${v._id}`)
                                                    }
                                                }}>
                                                    <img src={_.get(v, ['clubAvatar']) || imageNotFound} className="fill-parent absolute-center img-cover" ></img>
                                                    <div className="fill-parent background-black-opacity-50 flex-items-align-center flex-justify-center padding-md absolute-center stack-element-opacity-100">
                                                        <span className='d-inline-block white h6 text-truncate-threeline' >
                                                            {_.get(v, ['clubName']) || ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Col>

                                        )
                                    }
                                    return (
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                            <div className="width-100 relative-wrapper cursor-pointer" style={{ height: 200 }} onClick={() => {
                                                if (_.get(v, ['_id'])) {
                                                    props.router.push(`/social-club/${v._id}`)
                                                }
                                            }}>
                                                <img src={_.get(v, ['clubAvatar']) || imageNotFound} className="fill-parent absolute-center img-cover" ></img>
                                                <div className="fill-parent background-black-opacity-50 flex-items-align-center flex-justify-center padding-md absolute-center stack-element-opacity-100">
                                                    <span className='d-inline-block white h6 text-truncate-threeline' >
                                                        {_.get(v, ['clubName']) || ''}
                                                    </span>
                                                </div>
                                            </div>
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