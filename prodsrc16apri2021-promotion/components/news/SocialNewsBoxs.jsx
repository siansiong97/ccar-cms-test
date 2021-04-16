import { Col, Empty, Form, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../common-function';
import { withRouter } from 'next/router';


const opts = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
    },
};
const AUTHORSIZE = 10
const SocialNewsBoxs = (props) => {

    const [news, setNews] = useState([]);


    useEffect(() => {

        if (notEmptyLength(props.data)) {
            setNews(props.data);
        } else {
            setNews([]);
        }
    }, [props.data])

    const renderContent = (data) => {
        switch (data.language) {
            case "en":
                return (
                    data.content ? data.content : null
                )
            case "cn":
                return (
                    data.content ? data.content2 : null
                )
            case 'my':
                return (
                    data.content3 ? data.content3 : null
                )
            default:
                break;
        }
    }

    return (


        <React.Fragment>
            {
                notEmptyLength(news) ?
                    <Row gutter={[10, 10]}>
                        <div key='newsList' className="padding-x-md " style={{ height: '500px' }}>
                            {news.map(function (item, i) {
                                if (i % 5 == 0) {
                                    return (
                                        <Col key={'newsListChildMain' + i} xs={24} sm={24} md={12} lg={12} xl={12}>
                                            {/* {item.title} */}
                                            <a target="_blank" href={item.originalUrl} >
                                                <div className="social">
                                                    <img src={item.thumbnailUrl} style={{ width: "100%" }} />
                                                    <div className="overlay-news">
                                                        <p> {item.title} </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </Col>
                                    )
                                } else {
                                    return (
                                        <Col key={'newsListChildSub' + i} xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <a target="_blank" href={item.originalUrl} >
                                                <Row className="fnews1">
                                                    <Col span={12} className="inews">
                                                        <img src={item.thumbnailUrl} style={{ width: "100%" }} />
                                                    </Col>
                                                    <Col span={12} className="ftitle">
                                                        <h4>{item.title}</h4>
                                                        <p>
                                                            {renderContent(item)}
                                                        </p>

                                                        <span style={{ textTransform: 'capitalize' }}>{item.authorId ? item.authorId.name : null} | {moment(item.publishedAt).format('DD-MM-YYYY')}</span>
                                                    </Col>
                                                </Row>
                                            </a>
                                        </Col>
                                    )
                                }
                            })
                            }
                        </div>
                    </Row>
                    :
                    <div className="fill-parent">
                        <Empty></Empty>
                    </div>
            }
        </React.Fragment>

    );
}


const mapStateToProps = state => ({
    app: state.app,
    newCars: state.newCars,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialNewsBoxs)));