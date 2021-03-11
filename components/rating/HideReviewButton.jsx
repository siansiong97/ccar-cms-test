import { Button, Form, message, Modal } from 'antd';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { withRouter } from 'next/router';
import { loading, loginMode } from '../../redux/actions/app-actions';
import { notEmptyLength } from '../../common-function';



const HideReviewButton = (props) => {


    const [confirmModalState, setConfirmModalState] = useState(false);

    function hideReview(data) {

        if (props.user.authenticated && notEmptyLength(data) && data._id) {

            if (notEmptyLength(data.hideBy)) {
                let existed = data.hideBy.some(function (item) {
                    return item.userId == props.user.info.user._id;
                })

                if (!existed) {

                    props.loading(true);
                    client.authenticate()
                        .then((res) => {
                            props.loading(false);
                            client.service('rating').patch(data._id, {
                                hideBy: data.hideBy.concat([{ userId: props.user.info.user._id }])
                            }).then((res) => {
                                message.success('You hide the review.');
                                if (props.handleSuccess) {
                                    props.handleSuccess(res);
                                }
                            })
                        })
                        .catch((err) => {
                            props.loading(false);
                            message.error(err.message);
                            if (props.handleError) {
                                props.handleError(err);
                            }
                        })
                }
            } else {

                props.loading(true);
                client.authenticate()
                    .then((res) => {
                        props.loading(false);
                        client.service('rating').patch(data._id, {
                            hideBy: [{ userId: props.user.info.user._id }]
                        }).then((res) => {
                            message.success('You hide the review.');
                            if (props.handleSuccess) {
                                props.handleSuccess(res);
                            }
                        })
                    })
                    .catch((err) => {
                        props.loading(false);
                        message.error(err.message);
                        if (props.handleError) {
                            props.handleError(err);
                        }
                    })

            }

        } else {
            props.loginMode(true);
            message.error('Please login to hide this review.');
            if (props.handleError) {
                props.handleError({ message: 'Please login to hide this review.' });
            }
        }
    }

    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Modal
                visible={confirmModalState}
                title="Are you sure?"
                maskClosable={true}
                centered={true}
                onOk={(e) => { hideReview(props.data ? props.data : null); setConfirmModalState(false); }}
                onCancel={(e) => { setConfirmModalState(false) }}
            >
                <div>
                    Do you want to hide this review ?
                </div>
            </Modal>


            <a onClick={() => {
                setConfirmModalState(true);
            }}>

                {
                    props.button ?
                        props.button()
                        :
                        <Button type="warning" icon="eye-invisible">
                            Hide post
                        </Button>
                }
            </a>

        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loginMode: loginMode,
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(HideReviewButton)));