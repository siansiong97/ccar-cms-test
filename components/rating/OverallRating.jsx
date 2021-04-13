import { Col, Form, Rate, Row } from 'antd';
import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { roundToHalf } from '../../common-function';


const OverallRating = (props) => {

    return (
        <div className={props.className ? props.className : null} style={props.style ? props.style : null}>

            <Row type="flex" justify="center" align="middle" gutter={[0, 10]}>
                <Col span={24}>
                    {
                        props.text ?
                            props.text(props.rating ? props.rating : 0)
                            :
                            <div className="h5 font-weight-bold text-align-center">{props.rating ? props.rating : 0}</div>
                    }
                </Col>
                <Col span={24}>
                    {
                        props.rate ?
                            props.rate(props.rating ? props.rating : 0)
                            :
                            <div className="text-align-center"><Rate value={props.rating ? roundToHalf(props.rating) : 0} style={{ width: '80%', height: '80%' }} allowHalf disabled></Rate></div>
                    }
                </Col>
                <Col span={24}>
                    {
                        props.total ?
                            (props.footer ?
                                props.footer(props.total ? props.total : 0)
                                :
                                <div className="headline   text-align-center">Based on {props.total ? props.total : 0} customer reviews</div>)
                            :
                            null
                    }
                </Col>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(OverallRating)));