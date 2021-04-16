import { Button, Form, message, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { withRouter } from 'next/router';
import { loading, loginMode } from '../../redux/actions/app-actions';
import { notEmptyLength } from '../../common-function';



const RemoveReviewButton = (props) => {


    const [confirmModalState, setConfirmModalState] = useState(false);
    const [review, setReview] = useState({});

    useEffect(() => {
        client.service('rating').get(props.id).then(res => {
            if (notEmptyLength(res)) {
                setReview(res);
            } else {
                setReview({});
            }
        }).catch(err => {
            message.error(err.message)
        });
    }, [props.id])


    function removeReview() {

        if (props.user.authenticated && review._id) {


            let promises = [];

            promises.push(client.authenticate());

            promises.push(client.service('rating').remove(review._id));

            props.loading(true);
            if (notEmptyLength(review.images)) {

                promises.push(axios.post(`${client.io.io.uri}deleteImageS3`,
                    {
                        params: {
                            imageUrl: review.images
                        },
                        headers: {
                            'Content-Type': 'text/xml; charset=utf-8',
                            'Content-Length': 'length'
                        }
                    }
                ));
            }

            if (notEmptyLength(review.videos)) {

                promises.push(axios.post(`${client.io.io.uri}deleteVideoS3`,
                    {
                        params: {
                            videoUrl: review.videos
                        },
                        headers: {
                            'Content-Type': 'text/xml; charset=utf-8',
                            'Content-Length': 'length'
                        }
                    }
                ));
            }

            Promise.all(promises).then(responses => {
                props.loading(false);
                message.success('Review removed.');
                if (props.handleSuccess) {
                    props.handleSuccess(responses[1]);
                }
            }).catch(err => {
                props.loading(false);
                if (props.handleError) {
                    props.handleError(err);
                }
                message.error(err.message)
            });

        } else {
            props.loginMode(true);
            message.error('Please login to remove this review.');
            if (props.handleError) {
                props.handleError({ message: 'Please login to remove this review.' });
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
                onOk={(e) => { removeReview(); setConfirmModalState(false); }}
                onCancel={(e) => { setConfirmModalState(false) }}
            >
                <div>
                    Do you want to remove this review?
                </div>
            </Modal>


            <a onClick={() => {
                setConfirmModalState(true);
            }}>

                {
                    props.button ?
                        props.button()
                        :
                        <Button type="danger" icon="delete">
                            Remove post
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(RemoveReviewButton)));