import { Avatar, Button, Form, message, Modal } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loading } from '../../redux/actions/app-actions';
import { withRouter } from 'next/router';
import client from '../../feathers';


const minTimeout = 1000;
const popoutPercentage = [true, true, false, false, false, false, false, false, false, false]
// const popoutPercentage = [true, true, true, true, true, true, true, true, true, true]
// const popoutPercentage = [false, false, false, false, false, false, false, false, false, false]

const types = ['company', 'product', 'user'];
const RecommendDialog = (props) => {

    const [confirmModalState, setConfirmModalState] = useState(false);

    useEffect(() => {
        let timeout = minTimeout * Math.random() * 10;
        setTimeout(function () { setConfirmModalState(_.sample(_.shuffle(popoutPercentage), 1)) }, timeout);
        
    }, [])

    function close(e) {
        setConfirmModalState(false);
    }

    function createRecommended(type, id, isRecommended) {

        if (props[type + 'Id'] == null) {
            if (props.handleError) {
                props.handleError({ message: 'Invalid recommend item.' });
            }
            return null;
        }

        if (!props.user.authenticated) {
            if (props.handleError) {
                props.handleError({ message: 'Please Login First.' });
            }
            return null;
        }

        let data = {};
        data.type = type;
        data[type + 'Id'] = id;
        data.reviewerId = props.user.info.user._id;
        data.isRecommended = isRecommended;

        props.loading(true);
        setTimeout(() => {
            client.authenticate()
                .then((res) => {
                    client.service('recommendeds').create(data).then((res) => {
                        props.loading(false);
                        message.success(isRecommended ? 'Thank you for recommending us.' : 'Kindly provide your feedback to us. We will try our best to improve our services.');
                        if (props.handleSuccess) {
                            props.handleSuccess(res);
                        }

                        close();
                    })

                })
                .catch((err) => {
                    props.loading(false);
                    console.log(err)
                    message.error(err.message);
                    if (props.handleError) {
                        props.handleError(err);
                    }

                    close();
                })
        }, 1000);
    }

    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Modal
                visible={confirmModalState}
                closable
                centered
                maskClosable={false}
                footer={null}
                onCancel={close}
            >
                <div className="padding-md fill-parent">
                    {
                        props.renderAvatar ?
                            props.renderAvatar(props.avatar ? props.avatar : null)
                            :
                            props.avatar ?
                                <div className="flex-justify-center flex-items-align-center fill-parent padding-y-sm">
                                    <Avatar size={100} src={props.avatar} />
                                </div>
                                :
                                null
                    }
                    {
                        props.renderTitle ?
                            props.renderTitle(props.title ? props.title : null)
                            :
                            props.title ?
                                <div className="flex-justify-center flex-items-align-center text-overflow-break headline   font-weight-bold fill-parent padding-y-sm margin-bottom-lg">
                                    {props.title}
                                </div>
                                :
                                null
                    }
                    {
                        props.renderDesc ?
                            props.renderDesc(props.desc ? props.desc : null)
                            :
                            props.desc ?
                                <div className="flex-justify-center flex-items-align-center text-overflow-break subtitle1 fill-parent padding-y-sm margin-bottom-sm">
                                    {props.desc}
                                </div>
                                :
                                null
                    }
                    <div className={props.buttonClass ? props.buttonClass : "flex-justify-center flex-items-align-center fill-parent padding-y-sm"} >
                        <a className="margin-x-sm" onClick={(e) => {
                            if (!props.app.loading) {
                                createRecommended(props.type ? props.type : null, props[`${props.type}Id`] ? props[`${props.type}Id`] : null, true)
                            }
                        }}>
                            {
                                props.renderYesButton ?
                                    props.renderYesButton()
                                    :
                                    <Button style={{ backgroundColor: "#F9A825" }}>{props.okText ? props.okText : "Yes"}</Button>
                            }
                        </a>
                        <a className="margin-x-sm" onClick={(e) => {
                            if (!props.app.loading) {
                                createRecommended(props.type ? props.type : null, props[`${props.type}Id`] ? props[`${props.type}Id`] : null, false)
                            }
                        }}>
                            {
                                props.renderNoButton ?
                                    props.renderNoButton()
                                    :
                                    <Button>{props.noText ? props.noText : "No"}</Button>
                            }
                        </a>
                    </div>
                </div>

            </Modal>


        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(RecommendDialog)));