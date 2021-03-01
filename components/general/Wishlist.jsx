import { Button, Form, message, Modal } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { loading, loginMode } from '../../redux/actions/app-actions';
import client from '../../feathers';
import { setUser } from '../../redux/actions/user-actions';
import { notEmptyLength } from '../../common-function';



const Wishlist = (props) => {


    const [wishlist, setWishlist] = useState([]);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        init();
    }, [props.saverId, props[props.type + 'Id']])

    function init() {
        if (!_.isEmpty(props.saverId) && !_.isEmpty(props[props.type + 'Id'])) {
            let query = {};
            query[props.type + 'Id'] = props[props.type + 'Id'];
            query.type = props.type;
            query.saverId = props.saverId

            client.service('wishlists').find({
                query: query
            }).then(res => {
                if (notEmptyLength(res.data)) {
                    setWishlist(res.data[0])
                    setIsSaved(true);
                } else {
                    setWishlist(null)
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
    }


    function handleError(error) {
        setConfirmModalState(false);
        if (props.handleError) {
            props.handleError(error);
        }
    }

    function handleSubmit() {
        if (!_.isEmpty(props.saverId) && !_.isEmpty(props[props.type + 'Id'])) {
            let promises = [];
            promises.push(client.authenticate());
            if (!isSaved) {
                let data = {}
                data.type = props.type;
                data.saverId = props.saverId;
                data[props.type + 'Id'] = props[props.type + 'Id'];
                promises.push(client.service('wishlists').create(data))
            } else {
                promises.push(client.service('wishlists').remove(wishlist._id))
            }

            props.loading(true);
            //Write in wishlist model
            Promise.all(promises).then(([auth, wishlistRes]) => {
                props.loading(false);
                handleSuccess({
                    type: isSaved ? 'remove' : 'save',
                    data: wishlistRes
                });

                init();

            }).catch(error => {
                props.loading(false);
                handleError({ message: "Submit Wishlist Failed" })
            })
        } else {
            handleError({ message: "Something Went Wrong!" })

        }


    };

    function handleChange() {

        if (!props.saverId) {
            props.loginMode(true);
            handleError({ message: 'Please login to save the wishlist.' });
            return null;
        }

        if (!props[props.type + 'Id']) {
            handleError({ message: 'Item not found!' });
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
                    Do you want to remove this product from your wishlist?
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
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Wishlist)));