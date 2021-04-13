import { Col, Form, Progress, Row } from 'antd';
import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { isObject, notEmptyLength } from '../../common-function';



const RatingProgress = (props) => {


    function setToSize(data, size, startFrom) {

        if (isNaN(parseInt(startFrom))) {
            startFrom = 0;
        } else {
            startFrom = parseInt(startFrom);
        }

        if (!isNaN(parseInt(size)) && data.length < parseInt(size)) {

            data = data.map((item, index) => {

                if (isNaN(parseInt(item.position))) {
                    if (isObject(item)) {
                        item.position = index + startFrom;
                    } else {
                        item = {
                            label: index + startFrom,
                            position: index + startFrom,
                            total: item,
                        }
                    }
                }

                return item;

            });


            let finaldata = [];
            for (let index = 0; index < size; index++) {

                let replace = data.find(function (item) {
                    return item.position == index + startFrom;
                })

                if (replace) {
                    finaldata[index] = replace;
                } else {
                    finaldata[index] = {
                        label: index + startFrom,
                        position: index + startFrom,
                        total: 0
                    };
                }
            }





            finaldata = finaldata.reverse();
            return finaldata;
        } else {
            return data;
        }

    }

    const _renderRatingProgress = (data, total, size, startFrom) => {

        if (isNaN(parseInt(total))) {
            total = 100;
        } else {
            total = parseInt(total);
        }

        if (isNaN(parseInt(startFrom))) {
            startFrom = 0;
        } else {
            startFrom = parseInt(startFrom);
        }

        if (notEmptyLength(data)) {

            if (size) {
                data = setToSize(data, size, startFrom);
            }

            return data.map(function (item, index) {

                if (item != null) {
                    var num = 0;
                    if (isObject(item)) {
                        if (item.total && !isNaN(parseFloat(item.total))) {
                            num = item.total;
                        } else {
                            num = 0;
                        }
                    } else {
                        if (!isNaN(parseFloat(item))) {
                            num = parseFloat(item);
                        } else {
                            num = 0;
                        }
                    }

                    return (<Col span={24}>
                        <div>
                            <span className="headline   font-weight-bold margin-right-md">{item.label != null ? item.label : index + startFrom}</span>
                            <span>
                                <Progress percent={parseFloat(num / total) * 100} type="line" showInfo={false} strokeColor="#F9A825" style={{ display: 'inline-block', width: '80%' }} />
                            </span>
                        </div>
                    </Col>)
                } else {
                    return null;
                }
            });
        } else {
            return null;
        }
    }


    return (
        <div className={props.className ? props.className : null} style={props.style ? props.style : null}>

            <Row type="flex" justify="center" align="middle" gutter={[0, 0]}>
                {
                    props.render ?
                        props.render(notEmptyLength(props.data) ? props.data : [], props.total ? props.total : null)
                        :
                        _renderRatingProgress(notEmptyLength(props.data) ? props.data : [], props.total ? props.total : null, props.size ? props.size : null, props.startFrom ? props.startFrom : null)
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(RatingProgress)));