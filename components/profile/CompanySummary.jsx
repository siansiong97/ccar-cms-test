import { Col, Form, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';



const CompanySummary = (props) => {


    return (
        <div className={props.className ? props.className : null} style={props.style ? props.style : null}>

            <Row type="flex" justify="center" align="middle" gutter={[0, 10]}>
                {
                    props.renderRating ?
                        props.renderRating(props.rating ? props.rating : 0)
                        :
                        props.rating != null ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div className="h5 font-weight-bold text-align-center">
                                    {props.rating}
                                    <div className="headline   font-weight-normal">Rating</div>
                                </div>
                            </Col>
                            :
                            null
                }
                {
                    props.renderRecommended ?
                        props.renderRecommended(props.recommended ? props.recommended : 0)
                        :
                        props.recommended != null ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div className="h5 font-weight-bold text-align-center">
                                    {props.recommended}%
                                <div className="headline   font-weight-normal">Rating</div>
                                </div>
                            </Col>
                            :
                            null
                }
                {/* {
                    props.renderChat ?
                        props.renderChat(props.chat ? props.chat : 0)
                        :
                        props.chat != null ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div className="h5 font-weight-bold text-align-center">
                                    {props.chat}%
                                <div className="headline   font-weight-normal">Chat Response</div>
                                </div>
                            </Col>
                            :
                            null
                } */}
                {
                    props.renderRate ?
                        props.renderRate(props.rating ? props.rating : 0)
                        :
                        props.rate != null ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div className="">
                                    {/* <Rate value={props.rating ? roundToHalf(props.rating) : null} allowHalf disabled /> */}
                                </div>
                            </Col>
                            : null
                }
                {
                    props.renderReview ?
                        props.renderReview(props.review ? props.review : 0)
                        :
                        props.review != null ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            </Col>
                            : null
                }
            </Row>
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CompanySummary)));