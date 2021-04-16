import { Button, Form, Icon, message, Modal } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { withRouter } from 'next/router';
import { notEmptyLength } from '../../common-function';
import { loginMode } from '../../redux/actions/app-actions';



const FollowButton = (props) => {


    const [follow, setFollowButton] = useState([]);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        init();
    }, [props.followerId, props[props.type + 'Id']])

    function init() {
        if (!_.isEmpty(props.followerId) && !_.isEmpty(props[props.type + 'Id'])) {
            let query = {};
            query[props.type + 'Id'] = props[props.type + 'Id'];
            query.type = props.type;
            query.followerId = props.followerId

            client.service('follows').find({
                query: query
            }).then(res => {
                if (notEmptyLength(res.data)) {
                    setFollowButton(res.data[0])
                    setIsFollowed(true);
                } else {
                    setFollowButton(null)
                    setIsFollowed(false);
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
    }


    function handleError(error) {
        setConfirmModalState(false);
        if (props.handleError) {
            props.handleError(error);
        }
    }

    function handleSubmit() {
        if (!_.isEmpty(props.followerId) && !_.isEmpty(props[props.type + 'Id'])) {
            let promises = [];
            promises.push(client.authenticate());
            if (!isFollowed) {
                let data = {}
                data.type = props.type;
                data.followerId = props.followerId;
                data[props.type + 'Id'] = props[props.type + 'Id'];
                data.actionType = `follow${_.capitalize(props.type)}`
                promises.push(client.service('follows').create(data))
            } else {
                promises.push(client.service('follows').remove(follow._id))
            }

            //Write in follow model
            Promise.all(promises).then(([auth, followRes]) => {
                handleSuccess({
                    type: isFollowed ? 'remove' : 'save',
                    data: followRes
                });
                if (props.notify) {
                    message.success(isFollowed ? 'Unfollowed' : 'Followed')
                }

                init();

            }).catch(error => {
                handleError({ message: "Follow Failed" })
                if (props.notify) {
                    message.error('Follow Failed')
                }

            })
        } else {
            if (props.notify) {
                message.error('Something Went Wrong!')
            }
            handleError({ message: "Something Went Wrong!" })

        }


    };

    function handleChange() {


        if (!props.followerId) {
            handleError({ message: 'Please login to follow.' });
            props.loginMode(true);
            return null;
        }

        if (!props[props.type + 'Id']) {
            handleError({ message: 'Item not found!' });
            return null;
        }

        if (isFollowed) {
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
                    {props.description || 'Do you want to unfollow?'}

                </div>
            </Modal>

            {
                _.get(props, ['userId']) == _.get(props.user, ['info', 'user', '_id']) ?
                    null
                    :
                    isFollowed ?
                        <a onClick={() => { handleChange() }}>

                            {
                                props.followingButton ?
                                    props.followingButton()
                                    :
                                    <span>
                                        <Icon type="check" style={{ color: '#F57F17' }} className="margin-right-xs" />
                                    Following
                                </span>
                            }
                        </a>
                        :
                        <a onClick={() => { handleChange() }}>
                            {
                                props.followButton ?
                                    props.followButton()
                                    :
                                    <Button>+ Follow</Button>
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
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(FollowButton)));