import { Button, Form, Icon, message } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../../feathers';
import { loading, loginMode } from '../../../../redux/actions/app-actions';
import { setUser } from '../../../../redux/actions/user-actions';



const ClubApprovalButton = (props) => {


    const [join, setJoin] = useState({});


    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setJoin(props.data)
        } else {
            setJoin({});
        }

    }, [props.data])



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

        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
            if (props.notify) {
                message.error('Please login to approve.')
            }
            handleError({ message: 'Please login to approve.' });
            props.loginMode(true);
            return null;
        }

        if (!_.isPlainObject(join) && _.isEmpty(join)) {
            if (props.notify) {
                message.error('Request not found!')
            }
            handleError({ message: 'Request not found!' });
            return null;
        }

        let promises = [];
        promises.push(client.authenticate());
        let data = {
            status: 'approved',
            joinedAt : new Date(),
        }
        data.actionType = `approvedJoin`
        promises.push(client.service('clubjoin').patch(join._id, data))
        //Write in follow model
        Promise.all(promises).then(([auth, joinRes]) => {
            handleSuccess(joinRes);
            if (props.notify) {
                message.success(joinRes.status == 'approved' ? 'Approved' : '');
            }

            setJoin(joinRes)

        }).catch(error => {
            console.log(error);
            handleError({ message: "Join Failed" })
            if (props.notify) {
                message.error('Approve Failed')
            }

        })

    };



    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null} >
            {
                _.get(join, ['status']) == 'approved' ?
                    props.approvedButton ?
                        props.approvedButton()
                        :
                        <span className="cursor-pointer cursor-pointer">
                            <Icon type="check" style={{ color: '#F57F17' }} className="margin-right-xs" />
                                    Approved
                                </span>
                    :
                    _.get(join, ['status']) == 'pending' ?
                        <span className="cursor-pointer" onClick={(e) => { handleSubmit() }} >
                            {
                                props.pendingButton ?
                                    props.pendingButton()
                                    :
                                    <Button className=" background-ccar-button-yellow border-ccar-button-yellow black">Approve</Button>
                            }
                        </span>
                        :
                        null
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubApprovalButton)));