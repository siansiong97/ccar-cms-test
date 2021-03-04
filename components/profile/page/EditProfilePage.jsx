import { Form, Select } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import ProfileLayout from '../ProfileLayout';
import ProfileForm from '../ProfileForm';

const { Option } = Select;

const profilePic = "/assets/profile/profilePic.jpg";

const profileImage = "/assets/profile/profile-image.png";

const EditProfilePage = (props) => {

    const [profile, setProfile] = useState({})

    function backProfileHome() {
        if (_.get(profile, ['_id'])) {
            props.router.push(`/profile/${profile._id}`)
        }
    }

    return (
        <ProfileLayout onGetProfile={(data) => {
            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                setProfile(data)
            } else {
                setProfile({});
            }
        }}>
            <ProfileForm data={profile} onProfileCancel={(e) => {
      
                backProfileHome()
            }}
                onProfileSuccess={(data) => {
 
                    backProfileHome()
                }}
            />
        </ProfileLayout>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EditProfilePage)));