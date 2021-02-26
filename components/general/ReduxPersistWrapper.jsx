import { } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Lightbox from 'react-image-lightbox';
import { connect } from 'react-redux';
import { Form } from '@ant-design/compatible';
import { isValidNumber, getCookiePersistStates } from '../../common-function';
import { dynamicDispatch } from '../../redux/config';


const ReduxPersistWrapper = (props) => {


    useEffect(() => {
        if (props.cookie) {
            let cookiePersistStates = getCookiePersistStates(props.cookie);
            _.forEach(cookiePersistStates, function(cookiePersistState) { 
              props.dynamicDispatch(_.get(cookiePersistState, ['persistObj', 'action']), _.get(cookiePersistState, ['data']))
            })
        }

    }, [props.cookie])

    return (

        <React.Fragment>
            {
                props.children
            }
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
    dynamicDispatch: dynamicDispatch,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReduxPersistWrapper);