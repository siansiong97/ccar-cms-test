import { Col, Divider, Form, Row, Tabs } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { 
    filterCarBrandMode, filterCarModelMode, filterCarSearchKeywords, loading,
    loginMode, quickSearchProductsList,
    setApplyMileage, setApplyPrice, setApplyYear, updateActiveMenu } from '../../redux/actions/app-actions';
import { fetchProductsList, updateActiveIdProductList  } from '../../redux/actions/productsList-actions';
import { updateSellerProfile } from '../../redux/actions/sellerProfile-actions';
import ProfileDetailsBox from './ProfileDetailsBox';
import UserCarFreakPosts from './UserCarFreakPosts';
import UserSavedCarFreakPosts from './UserSavedCarFreakPosts';
import UserSocialBoard from './UserSocialBoard';
import UserSavedSocialBoard from './UserSavedSocialBoard';



const { TabPane } = Tabs;

const UserProfile = (props) => {

    const [profile, setProfile] = useState({});


    //initial render

    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }

    }, [props.data])



    const _renderMenu = (profile) => {
        return (
            <Row type="flex" align="middle" className='background-white'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="CarFreaks" key="1">
                            <UserCarFreakPosts data={profile} />
                        </TabPane>
                        <TabPane tab="Social Board" key="2">
                            <UserSocialBoard data={profile} className="margin-y-lg" />
                        </TabPane>
                        {
                            _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(profile, ['_id']) ?
                                <TabPane tab="Saved CarFreaks" key="3">
                                    <UserSavedCarFreakPosts data={profile} className="margin-y-lg" />
                                </TabPane>
                                :
                                null
                        }
                        {
                            _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(profile, ['_id']) ?
                                <TabPane tab="Saved Social Board" key="4">
                                    <UserSavedSocialBoard data={profile} className="margin-y-lg" />
                                </TabPane>
                                :
                                null
                        }
                        {/* <TabPane tab="My Purchase" key="3">
                            Content of Tab Pane 3
                        </TabPane> */}
                        {/* <TabPane tab="Reviews" key="3">
                            Content of Tab Pane 3
                        </TabPane> */}
                    </Tabs>
                </Col>
            </Row>
        );
    }

    return (
        <React.Fragment>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Divider className="no-margin" />
                    <ProfileDetailsBox data={profile} showProfileActions={props.isOwn} type="user"
                        onChangeCoverPhoto={(res) => {
                            if (props.onChangeCoverPhoto) {
                                props.onChangeCoverPhoto(res);
                            }
                        }
                        }
                        onChange={(res) => {
                            if (props.onChange) {
                                props.onChange(res);
                            }
                        }
                        }
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Divider className="no-margin" />
                    {_renderMenu(profile)}
                </Col>
            </Row>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    sellCars: state.sellCars,
    productsList: state.productsList,
    app: state.app,
    sellerProfile: state.sellerProfile,
    user : state.user,
});


const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    fetchProductsList: fetchProductsList,
    updateActiveIdProductList: updateActiveIdProductList,
    filterCarBrandMode: filterCarBrandMode,
    filterCarModelMode: filterCarModelMode,
    filterCarSearchKeywords: filterCarSearchKeywords,
    quickSearchProductsList: quickSearchProductsList,

    loading: loading,
    setApplyYear: setApplyYear,
    setApplyPrice: setApplyPrice,
    setApplyMileage: setApplyMileage,
    updateSellerProfile: updateSellerProfile,
    loginMode: loginMode,

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserProfile)));