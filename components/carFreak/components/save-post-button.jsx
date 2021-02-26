import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notEmptyLength } from '../../profile/common-function';
import client from '../../../feathers';
import { loading, loginMode } from '../../../actions/app-actions';


const SavePostButton = (props) => {


    const [savedPost, setSavedPost] = useState([]);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        init();
    }, [props.userId, props.chatId])

    function init() {
        if (props.userId && props.chatId) {
            let query = {};
            query.chatId = props.chatId;
            query.userId = props.userId;

            client.service('savedpost').find({
                query: query
            }).then(res => {
                if (notEmptyLength(res.data)) {
                    setSavedPost(res.data[0])
                    setIsSaved(true);
                } else {
                    setSavedPost(null)
                    setIsSaved(false);
                }
            }).catch(err => {
                message.error(err.message)
            });
        }
    }

    function handleSuccess(success) {
        setConfirmModalState(false);
        if (props.handleSuccess) {
            props.handleSuccess(success);
        }

        if (props.notify && _.get(success, ['type']) == 'remove') {
            message.success('Unsaved Post.');
        }

        if (props.notify && _.get(success, ['type']) == 'save') {
            message.success('Saved Post.');
        }
    }


    function handleError(error) {
        setConfirmModalState(false);
        if (props.handleError) {
            props.handleError(error);
        }
        if (props.notify && _.get(error , ['message'])) {
            message.success(error.message);
        }
    }

    function handleSubmit() {
        if (props.userId && props.chatId) {
            let promises = [];
            promises.push(client.authenticate());
            if (!isSaved) {
                let data = {}
                data.userId = props.userId;
                data.chatId = props.chatId;
                promises.push(client.service('savedpost').create(data))
            } else {
                promises.push(client.service('savedpost').remove(savedPost._id))
            }

            //Write in savedPost model
            Promise.all(promises).then(([auth, savedPostRes]) => {
                props.loading(false);
                handleSuccess({
                    type: isSaved ? 'remove' : 'save',
                    data: savedPostRes
                });

                init();

            }).catch(error => {
                handleError({ message: "Submit SavePost Failed" })
            })
        } else {
            handleError({ message: "Unable to save post!" })

        }


    };

    function handleChange() {

        if (!props.userId) {
            props.loginMode(true);
            handleError({ message: 'Please login to save the savedPost.' });
            return null;
        }

        if (!props.chatId) {
            handleError({ message: 'Post not found!' });
            return null;
        }

        if (isSaved) {
            setConfirmModalState(true);
        } else {
            handleSubmit();
        }

    }



    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Modal
                visible={confirmModalState}
                title="Are you sure?"
                maskClosable={true}
                centered={true}
                onOk={(e) => { handleSubmit(); setConfirmModalState(false); }}
                onCancel={(e) => { setConfirmModalState(false) }}
            >
                <div>
                    Do you want to unsave this post?
                </div>
            </Modal>

            {
                isSaved ?
                    <a onClick={() => props.readOnly ? null : handleChange()}>
                        {
                            props.savedButton ?
                                props.savedButton()
                                :
                                <Button style={{ color: '#F57F17' }}>Saved</Button>
                        }
                    </a>
                    :
                    <a onClick={() => props.readOnly ? null : handleChange()}>
                        {
                            props.saveButton ?
                                props.saveButton()
                                :
                                <Button>Save</Button>
                        }
                    </a>
            }

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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SavePostButton)));