import { Form, Select } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import MyWishList from '../MyWishList';
import ProfileLayout from '../ProfileLayout';


withRouter
const ProfileWishlistPage = (props) => {

    const [profile, setProfile] = useState({})

    return (
        <ProfileLayout onGetProfile={(data) => {
            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                setProfile(data)
            } else {
                setProfile({});
            }
        }}>
            <MyWishList data={profile} />
        </ProfileLayout>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProfileWishlistPage)));