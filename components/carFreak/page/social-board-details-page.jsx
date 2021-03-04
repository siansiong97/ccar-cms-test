
import { Col, Input, message, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../../common-function';
import client from '../../../feathers';
import { loading } from '../../../redux/actions/app-actions';
import LayoutV2 from '../../general/LayoutV2';
import CarFreakLayout from '../components/car-freak-layout';
import SocialBoardDetailsBox from '../components/social-board-details-box';
import TrendingSocialBoardBox from '../components/trending-social-board-box';
import { carFreakGlobalSearch } from '../config';



const banner = 'hands-on-wheel.jpg'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'
const { Search } = Input;
const PAGE_SIZE = 36;

const SocialBoardDetailsPage = (props) => {

    const [post, setPost] = useState({})

    useEffect(() => {
        getPost();
    }, [props.router.query.id])

    function getPost() {

        if (_.get(props, ['router', 'query', 'id'])) {
            props.loading(true);
            client.service('chats')
                .find({
                    query: {
                        _id: props.router.query.id,
                        chatType: 'socialboard',
                        $populate: 'userId',
                        $limit: 1,
                    }
                })
                .then((res) => {

                    setPost(notEmptyLength(res.data) ? res.data[0] : {});
                    props.loading(false);

                }).catch(err => {
                    props.loading(false);
                    message.error(err.message)
                });
        } else {
            setPost({});
        }
    }

    return (
        <LayoutV2 backgroundImage={`url("/banner/1 – 1.png")`} searchTypes={carFreakGlobalSearch} enterSearchCarFreaks >
            <div className="section">
                <div className="container">
                    <CarFreakLayout>
                        <Row gutter={[10, 10]}>
                            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                <SocialBoardDetailsBox data={post} />
                            </Col>
                            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                <TrendingSocialBoardBox redirectToSocialBoard={(data) => {
                                    if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['_id'])) {
                                        props.router.push(`/social-board/${data._id}`)
                                    }
                                }} />
                            </Col>
                        </Row>
                    </CarFreakLayout>
                </div>
            </div>
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    loading
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialBoardDetailsPage));