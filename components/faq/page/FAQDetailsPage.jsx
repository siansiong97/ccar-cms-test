import { Col, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LayoutV2 from '../../general/LayoutV2';
import FAQAccountBox from '../component/faq-account-box';
import FAQBuyCarBox from '../component/faq-buy-car-box';
import FAQCarFreaksBox from '../component/faq-car-freaks-box';
import FAQCstarBox from '../component/faq-cstar-box';
import FAQFeatureBox from '../component/faq-features-box';
import FAQSellCarBox from '../component/faq-sell-car-box';
import { faqTopics } from '../config';



const FAQDetails = (props) => {

    const [key, setKey] = useState(_.get(faqTopics, [0, 'value']) || '');

    useEffect(() => {

        let query = props.router.query || {};
        if (!query) {
            query = {};
        }

        if (_.some(faqTopics, ['value', query.tab])) {
            setKey(query.tab)
        }

    }, [props.router.query])


    const _renderView = () => {
        switch (key) {
            case 'account':
                return <FAQAccountBox />
                break;
            case 'features':
                return <FAQFeatureBox />
                break;
            case 'buyCar':
                return <FAQBuyCarBox />
                break;
            case 'sellCar':
                return <FAQSellCarBox />
                break;
            case 'carFreaks':
                return <FAQCarFreaksBox />
                break;
            case 'cstar':
                return <FAQCstarBox />
                break;

            default:
                return <FAQAccountBox />
                break;
        }
    }

    return (
        <LayoutV2>
            <div className="section">
                <div className="container">
                    <Row gutter={[20, 0]}>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Row gutter={[0, 20]}>
                                {
                                    _.map(faqTopics, function (faqTopic) {
                                        return (
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                <div className={`round-border box-shadow-normal flex-items-align-center flex-justify-center flex-wrap black subtitle1 cursor-pointer ${key == faqTopic.value ? 'background-ccar-button-yellow' : 'hover-background-yellow-lighten-4 background-white'}`} style={{ height: 50 }} onClick={(e) => {
                                                    props.router.push(`/faq/details?tab=${faqTopic.value}`)
                                                }}>
                                                    {faqTopic.text || ''}
                                                </div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                            {
                                _renderView()
                            }
                        </Col>

                    </Row>
                </div>
            </div>
        </LayoutV2>
    );
}

const mapStateToProps = state => ({
    productsList: state.productsList,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FAQDetails));