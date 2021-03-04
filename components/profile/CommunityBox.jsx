import { Col, Form, Icon, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { formatNumber } from '../../common-function';
import { withRouter } from 'next/router';



const CommunityBox = (props) => {


    const [profile, setProfile] = useState({})

    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }

    }, [props.data])

    const _renderComunityDetails = () => {
        try {
            return (
                <Row type="flex" align="middle" justify="center" gutter={[0, 10]}>
                    {/* <Col span={4}>
                    <div>
                        <Icon type="share-alt" style={{ color: '#F9A825' }} />
                    </div>
                </Col>
                <Col span={20}>
                    <div>
                        14,795 people share this
                            </div>
                </Col> */}
                    <Col span={4}>
                        <div>
                            <Icon type="plus" style={{ color: '#F9A825' }} />
                        </div>
                    </Col>
                    <Col span={20}>
                        <div>
                            {formatNumber(_.get(profile, ['totalFollower']), 'auto', true, 0, true) || 0} people follow this dealer
                            </div>
                    </Col>
                    <Col span={4}>
                        <div>
                            <Icon type="edit" style={{ color: '#F9A825' }} />
                        </div>
                    </Col>
                    <Col span={20}>
                        <div>
                            {_.get(profile, ['totalRating']) || 0} people write review
                            </div>
                    </Col>
                </Row>
            );
        } catch (e) {
            return
        }
    }

    return (

        <div>
            <div style={{ height: '30px' }} className="background-ccar-yellow round-border-top flex-items-align-center padding-lg">
                <div className="headline   white font-weight-bold text-overflow-break">
                    Community
                    </div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF' }} className="round-border-bottom flex-items-align-center padding-md">
                {_renderComunityDetails()}
            </div>
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CommunityBox)));