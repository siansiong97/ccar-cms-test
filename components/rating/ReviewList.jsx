import { Avatar, Col, Dropdown, Form, Input, Menu, message, Rate, Row, Select } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import ScrollContainer from 'react-indiana-drag-scroll';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { isObject, notEmptyLength } from '../../common-function';
import LightBoxGallery from '../general/light-box-gallery';
import HideReviewButton from './HideReviewButton';
import RemoveReviewButton from './RemoveReviewButton';
import WriteReviewButton from './WriteReviewButton';



const { TextArea } = Input;
const { Option } = Select;

var moment = require('moment')



const containerRef = React.createRef();

const ReviewList = (props) => {



    const [reviews, setReviews] = useState([]);
    const [stop, setStop] = useState(false);
    //initial render
    useEffect(() => {

        if (notEmptyLength(props.data)) {
            setStop(false);
            //Set up Ref for Text truncate
            let data = props.data.map((item) => {
                item.textRef = React.createRef();
                item.seeMore = false;
                item.showText = false;
                return item;
            })

            setReviews(data);
        } else {
            setReviews([]);
        }
    }, [props.data])


    useEffect(() => {
        if (notEmptyLength(reviews)) {
            if (!stop) {
                checkForOverFlow();
            }
        }

    })



    function isEllipsisActive(e) {

        //Use outside container width to compare span overflow width
        if (!containerRef || !containerRef.current) {
            return false;
        } else {
            return (containerRef.current.clientWidth < e.clientWidth);
        }
    }

    function checkForOverFlow() {
        let done = true;
        let data;
        if (notEmptyLength(reviews)) {

            if (reviews[0].textRef) {
                data = reviews.map(function (item) {
                    if (item.textRef.current) {
                        item.seeMore = isEllipsisActive(item.textRef.current);
                    } else {
                        done = false;
                        item.seeMore = false;
                    }
                    return item;
                });
            }
        }


        if (done) {
            setReviews(data);
            setStop(done);
        }
    }

    function updateRatings(rating) {
        if (notEmptyLength(reviews)) {
            let data = reviews.map(function (item) {
                if (item._id == rating._id) {
                    item = rating;
                }
                return item;
            })
            setReviews(data);
        }
    }

    function handleChange(e) {
        if (props.handleChange) {
            props.handleChange(e);
        }
    }

    function handleError(e) {
        message.error(e.message);
    }

    function isOwnReview(data) {
        if (props.user.authenticated) {
            if (isObject(data.reviewerId) && data.reviewerId._id == props.user.info.user._id) {
                return true;
            } else if (data.reviewerId == props.user.info.user._id) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }



    const menu = (data) => {
        return (
            isOwnReview(data) ?
                <Menu>
                    <Menu.Item>
                        <WriteReviewButton data={data} mode="edit" button={() => {
                            return (
                                <div>
                                    <img src="https://img.icons8.com/color/24/000000/edit.png" style={{ display: 'inline-block', width: "100" }} />
                                    <p style={{ display: 'inline-block', marginLeft: '10px', color: '#616161' }}>  Edit post </p>
                                </div>
                            )
                        }}
                            handleSuccess={handleChange}
                            handleError={handleError}
                        />

                    </Menu.Item>
                    <Menu.Item>
                        <RemoveReviewButton id={data._id} handleSuccess={handleChange} button={
                            () => {
                                return (
                                    <div>
                                        <img src="https://img.icons8.com/color/24/000000/delete-forever.png" style={{ display: 'inline-block', width: "100" }} />
                                        <p style={{ display: 'inline-block', marginLeft: '10px', color: '#616161' }}> Remove post </p>
                                    </div>
                                );
                            }
                        } />
                    </Menu.Item>

                </Menu>
                :
                <Menu>
                    <Menu.Item>
                        <HideReviewButton data={data} button={() => {
                            return (
                                <div>
                                    <img src="https://img.icons8.com/metro/24/F1C40F/sleep.png" style={{ display: 'inline-block', width: "100", color: 'yellow' }} />
                                    <p style={{ display: 'inline-block', marginLeft: '10px', color: '#616161' }}>  Not interested in this post </p>
                                </div>
                            )
                        }}
                            handleSuccess={handleChange}
                        />
                    </Menu.Item>
                    {/* <Menu.Item>
                        <ReportReviewButton data={data}
                            reportButton={() => {
                                return (
                                    <div>
                                        <img src="https://img.icons8.com/ios-filled/24/E74C3C/flag.png" style={{ display: 'inline-block', width: "100" }} />
                                        <p style={{ display: 'inline-block', marginLeft: '10px' }}>  Report this post </p>
                                    </div>
                                )
                            }}
                            reportedButton={() => {
                                return (
                                    <div>
                                        <img src="https://img.icons8.com/ios-filled/24/E74C3C/flag.png" style={{ display: 'inline-block', width: "100" }} />
                                        <p style={{ display: 'inline-block', marginLeft: '10px' }}>  Reported </p>
                                    </div>
                                )
                            }}
                            handleSuccess={handleChange}
                        />
                    </Menu.Item> */}
                </Menu>
        );
    }

    const _renderReviewList = (data) => {
        let list = null;

        if (notEmptyLength(data)) {
            list = data.map(function (item, i) {
                return (
                    <div key={'divReview1' + i} className="review1" >
                        <Row>
                            <Col span={18}>
                                <Row gutter={[30, 0]}>
                                    <Col span={24}>
                                        <div className="flex-justify-start flex-items-align-center padding-x-sm">
                                            <Avatar src={!item.reviewerId || !item.reviewerId.avatar ? null : item.reviewerId.avatar} icon={!item.reviewerId || !item.reviewerId.avatar ? 'user' : null}></Avatar>
                                            <span className="headline   margin-x-md text-overflow-break">
                                                {!item.reviewerId ? null : item.reviewerId.firstName + ' ' + item.reviewerId.lastName}
                                            </span>
                                            {
                                                item.state ?
                                                    <span className="headline blue">
                                                        {item.state}
                                                    </span>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </Col>
                                    {
                                        _.isPlainObject(_.get(item, ['carspecId'])) && !_.isEmpty(_.get(item, ['carspecId'])) ?
                                            <div className="info flex-justify-start flex-items-align-center">
                                                {
                                                    props.renderCarspec ?
                                                        props.renderCarspec(item)
                                                        :
                                                        <div className="font-weight-bold padding-left-md padding-top-md subtitle1">{_.trim(`${_.get(item, 'carspecId.make') || ''} ${_.get(item, 'carspecId.model') || ''} ${_.get(item, 'carspecId.variant') || ''} ${_.get(item, 'carspecId.year') || ''} `)}</div>
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                    <Col span={24}>
                                        <div className="info flex-justify-start flex-items-align-center">
                                            {
                                                props.renderRate ?
                                                    props.renderRate(item)
                                                    :
                                                    <div><Rate allowHalf value={item.rating} disabled /></div>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <div className="review2">
                                    <span className="headline   margin-x-sm d-inline-block">{moment(item.createdAt).format('D MMMM Y')}</span>
                                    <Dropdown overlay={menu(item)} placement="bottomRight">
                                        <a className="ant-dropdown-link " onClick={e => e.preventDefault()}>
                                            <img src="https://img.icons8.com/material-rounded/24/000000/menu-2.png" />
                                        </a>
                                    </Dropdown>
                                </div>
                            </Col>
                            {
                                item.title && item.comment ?
                                    <div>
                                        <Col span={24}>
                                            <div className="subtitle1 font-weight-bold margin-bottom-sm padding-x-sm">
                                                {item.title}
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div style={{ overflowX: "hidden", maxWidth: '97%' }} className="padding-x-sm" ref={containerRef}>
                                                <span ref={item.textRef} className={item.showText ? "headline   text-overflow-break d-inline-block" : "headline   text-truncate d-inline-block "}>
                                                    {item.comment}
                                                </span>
                                            </div>
                                            <div>
                                                {
                                                    item.seeMore && !item.showText ?
                                                        <span><a onClick={() => { updateRatings({ ...item, showText: true }) }}>...See More</a></span>
                                                        :
                                                        null
                                                }
                                                {
                                                    item.seeMore && item.showText ?
                                                        <span><a onClick={() => { updateRatings({ ...item, showText: false }) }}>...See Less</a></span>
                                                        :
                                                        null
                                                }
                                            </div>
                                        </Col>
                                    </div>
                                    :
                                    null
                            }
                            {
                                notEmptyLength(item.images) || notEmptyLength(item.videos) ?
                                    <Col span={24}>
                                        <div key='imageDiv' className="padding-x-sm margin-top-md">
                                            <ScrollContainer className="d-flex" vertical={false}>
                                                {
                                                    notEmptyLength(item.videos) ?
                                                        item.videos.map(function (video, i) {
                                                            return (
                                                                <span key={'videoDiv' + i} className="d-inline-block margin-sm flex-items-no-shrink " style={{ width: "150px", height: '100px', border: 'solid', borderColor: 'rgba(150, 150, 150, 0.5)' }}>
                                                                    <ReactPlayer width='100%' height="100%" controls url={video.url} />
                                                                </span>
                                                            )
                                                        })
                                                        :
                                                        null
                                                }
                                                {
                                                    notEmptyLength(item.images) ?
                                                        <LightBoxGallery images={_.compact(_.map(item.images, function (v) {
                                                            return _.get(v, ['url']) || null;
                                                        }))}>
                                                            {
                                                                (state, setCurrentIndex, setVisible) => {
                                                                    return (
                                                                        <Scrollbars style={{ width: '100%', height: '120px' }}>
                                                                            <div className="flex-justify-start flex-items-align-center fill-parent">
                                                                                {
                                                                                    _.map(state.images, function (v, index) {
                                                                                        return <span className='d-inline-block margin-right-md cursor-pointer' onClick={(e) => { setCurrentIndex(index); setVisible(true) }} >
                                                                                            <img src={v} style={{ width: 100, height: 100 }} className=" img-cover" />
                                                                                        </span>
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </Scrollbars>
                                                                    )
                                                                }
                                                            }
                                                        </LightBoxGallery>
                                                        :
                                                        null
                                                }
                                            </ScrollContainer>
                                        </div>
                                    </Col>
                                    :
                                    null
                            }
                        </Row>
                    </div >

                );
            })
        }


        return list;
    }

    return (
        <React.Fragment>
            {_renderReviewList(reviews)}
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReviewList)));