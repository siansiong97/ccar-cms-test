import { Form, Select } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import ProfileLayout from '../ProfileLayout';
import Setting from '../Setting';


const ProfileSettingsPage = (props) => {

    const [profile, setProfile] = useState({})

    return (
        <ProfileLayout onGetProfile={(data) => {
            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                setProfile(data)
            } else {
                setProfile({});
            }
        }}>
            <Setting data={profile} onSuccess={(data) =>{
                setProfile({...profile, pushNotificationSettings : _.get(data, ['pushNotificationSettings']) || {}})
            }} />
        </ProfileLayout>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProfileSettingsPage)));