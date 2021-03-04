import { Button, Form, Icon, message, Popconfirm } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import { withRouter } from 'next/router';
import { loading, loginMode } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';



const InviteButton = (props) => {


    const [invite, setInvite] = useState({});
    const [isInvited, setIsInvited] = useState(false);


    // function init(){
    //     if (!_.isEmpty(props.invitedBy) && !_.isEmpty(props[props.type + 'Id'])) {
    //         console.log('check follows');
    //         let query = {};
    //         query[props.type + 'Id'] = props[props.type + 'Id'];
    //         query.type = props.type;
    //         query.invitedBy = props.invitedBy

    //         client.service('follows').find({
    //             query: query
    //         }).then(res => {
    //             if (notEmptyLength(res.data)) {
    //                 setInvite(res.data[0])
    //                 setIsInvited(true);
    //             } else {
    //                 setInvite(null)
    //                 setIsInvited(false);
    //             }
    //         }).catch(err => {
    //         message.error(err.message)
    //         });
    //     }
    // }

    function handleSuccess(success) {
        if (props.onSuccess) {
            props.onSuccess(success);
        }
    }


    function handleError(error) {
        if (props.handleError) {
            props.handleError(error);
        }
    }

    function handleSubmit() {
        if (!_.isEmpty(props.invitedBy) && !_.isEmpty(props[props.type + 'Id']) && !_.isEmpty(props.invitee)) {
            let promises = [];
            promises.push(client.authenticate());
            if (!isInvited) {
                let data = {}
                data.type = props.type;
                data.invitedBy = props.invitedBy;
                data.invitee = props.invitee;
                data.status = '';
                data[props.type + 'Id'] = props[props.type + 'Id'];
                data.actionType = `invite${_.capitalize(props.type)}`
                promises.push(client.service('invite').create(data))
                //Write in invite model
            } else {
                promises.push(client.service('invite').remove(invite._id))
            }

            Promise.all(promises).then(([auth, inviteRes]) => {
                handleSuccess({
                    type: isInvited ? 'remove' : 'save',
                    data: inviteRes
                });
                if (props.notify) {
                    message.success(isInvited ? 'Canceled Invitation' : 'Invited');
                }

                if (!isInvited) {
                    setInvite(inviteRes)
                } else {
                    setInvite({});
                }

                setIsInvited(!isInvited);

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


        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id']) || !props.invitedBy) {
            handleError({ message: 'Please login to invite.' });
            props.loginMode(true);
            return null;
        }

        if (!props.invitee) {
            handleError({ message: 'Invitee not found.' });
            return null;
        }

        if (!props[props.type + 'Id']) {
            handleError({ message: 'Item not found!' });
            return null;
        }

        handleSubmit();
    }



    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            {
                isInvited ?
                    props.invitedButton ?
                        props.invitedButton()
                        :
                        <Popconfirm
                            title="Are you sure to cancel this invitation?"
                            onConfirm={(e) => {
                                handleChange();
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <span className=" cursor-pointer">
                                <Icon type="check" style={{ color: '#F57F17' }} className="margin-right-xs" />
                                Invited
                            </span>
                        </Popconfirm>
                    :
                    <a onClick={() => { handleChange() }}>
                        {
                            props.inviteButton ?
                                props.inviteButton()
                                :
                                <Button>+ Invite</Button>
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
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(InviteButton)));