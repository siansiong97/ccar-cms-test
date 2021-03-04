import { Avatar, Card, Col, Form, message, Row, Select, Switch } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { deepEqual } from '../../common-function';
import client from '../../feathers';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';


const { Option } = Select;
const profilePic = "/assets/profile/profilePic.jpg";

const profileImage = "/assets/profile/profile-image.png";

const countryOptions = [
    {
        label: () => {
            return (
                <Option>
                    <Avatar src={profilePic} />
                    <span className="overline margin-x-md">Malaysia</span>
                </Option>
            );
        },
        icon: profilePic,
        value: 'malaysia1'
    },
    {
        label: 'Malaysia2',
        icon: profilePic,
        value: 'malaysia2'
    },
    {
        label: 'Malaysia3',
        icon: profilePic,
        value: 'malaysia3'
    },
    {
        label: 'Malaysia4',
        icon: profilePic,
        value: 'malaysia4'
    },
];

const Setting = (props) => {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');

    const [pushNotificationSettings, setPushNotificationSettings] = useState(
        {
            promotions: false,
            orders: false,
            alertsAndReminders: false,
            chat: false,
        }
    );
    const [profile, setProfile] = useState({})

    const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);


    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }

    }, [props.data])

    useEffect(() => {

        if (_.isPlainObject(_.get(profile, ['pushNotificationSettings']))) {
            setPushNotificationSettings(_.get(profile, ['pushNotificationSettings']))
        } else {
            setPushNotificationSettings({
                promotions: false,
                orders: false,
                alertsAndReminders: false,
                chat: false,
            })
        }
    }, [profile])

    useEffect(() => {

        if ((!profile.pushNotificationSettings || !deepEqual(profile.pushNotificationSettings, pushNotificationSettings)) && profile._id) {
            props.loading(true);
            client.authenticate()
                .then((res) => {
                    client.service('users').patch(profile._id, { pushNotificationSettings: pushNotificationSettings }).then((res) => {
                        message.success('Updated Successful');
                        props.loading(false);
                        if(props.onSuccess){
                            props.onSuccess(res)
                        }
                    })
                })
                .catch((err) => {
                    props.loading(false);
                    message.error(err.message);
                })
        }


    }, [pushNotificationSettings])


    const _renderNotificationBox = () => {

        return (
            <Card className="thin-border round-border" title="Push Notification">
                <Row type="flex" justify="center" align="center">
                    <Col span={20}>
                        <div className="subtitle1 font-weight-bold margin-sm">Promotions</div>
                        <div className="headline   margin-sm">Receive regular updates on great deals and steals</div>
                    </Col>
                    <Col span={4} className="">
                        <div className="flex-justify-center flex-items-align-center  fill-parent">
                            <Switch size={200} className=""
                                checked={pushNotificationSettings.promotions}
                                onClick={(c) => { setPushNotificationSettings({ ...pushNotificationSettings, promotions: c }); }} />
                        </div>
                    </Col>
                    <Col span={20}>
                        <div className="subtitle1 font-weight-bold margin-sm">Orders</div>
                        <div className="headline   margin-sm">Get the latest status in your order</div>
                    </Col>
                    <Col span={4} className="">
                        <div className="flex-justify-center flex-items-align-center  fill-parent">
                            <Switch size={200} className=""
                                checked={pushNotificationSettings.orders}
                                onClick={(c) => { setPushNotificationSettings({ ...pushNotificationSettings, orders: c }) }} />
                        </div>
                    </Col>
                    <Col span={20}>
                        <div className="subtitle1 font-weight-bold margin-sm">Alerts & Reminders</div>
                        <div className="headline   margin-sm">Updates on price drops, Feed and other in web events</div>
                    </Col>
                    <Col span={4} className="">
                        <div className="flex-justify-center flex-items-align-center  fill-parent">
                            <Switch size={200} className=""
                                checked={pushNotificationSettings.alertsAndReminders}
                                onClick={(c) => { setPushNotificationSettings({ ...pushNotificationSettings, alertsAndReminders: c }) }} />
                        </div>
                    </Col>
                    <Col span={20}>
                        <div className="subtitle1 font-weight-bold margin-sm">Chat</div>
                        <div className="headline   margin-sm">Get notification when you receive a private chat messages</div>
                    </Col>
                    <Col span={4} className="">
                        <div className="flex-justify-center flex-items-align-center  fill-parent">
                            <Switch className=""
                                checked={pushNotificationSettings.chat}
                                onClick={(c) => { setPushNotificationSettings({ ...pushNotificationSettings, chat: c }) }} />
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }


    const _renderCountryOptions = (labels, selectedOptions) => {
        return labels.map((label, i) => {
            const option = selectedOptions[i];
            return <span key={option.value}>{label} / </span>;
        });
    }

    const _renderCountryBox = () => {
        return (

            <Card className="thin-border round-border" title="Country">
                <Row type="flex" justify="space-between" align="center">
                    <Col span={12}>
                        <div className="subtitle1 font-weight-bold margin-sm">Region</div>
                    </Col>
                    <Col span={12} className="">
                        <div className="flex-justify-end flex-items-align-center  fill-parent">
                            <Select
                                style={{ width: '200px' }}
                                placeholder="Select one country"
                                defaultValue={['malaysia']}
                                onChange={null}
                            >
                                <Option value="malaysia" label="Malaysia">
                                    <div className="flex-items-align-center">
                                        <Avatar src={profilePic} size="small" className="margin-right-md" />
                                    Malaysia
                                    </div>
                                </Option>
                            </Select>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }


    return (
        <div>
            <Row gutter={[0, 30]}>
                <Col span={24}>
                    {_renderNotificationBox()}
                </Col>
                <Col span={24}>
                    {_renderCountryBox()}
                </Col>
            </Row>
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Setting)));