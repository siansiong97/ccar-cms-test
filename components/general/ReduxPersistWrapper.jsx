import { } from 'antd';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setInitedRedux } from '../../redux/actions/app-actions';
import { dynamicDispatch, getLocalStoragePersistStates } from '../../redux/config';


const ReduxPersistWrapper = (props) => {


    useEffect(() => {
        if (props.cookie) {
            let persistStates = getLocalStoragePersistStates();
            console.log(persistStates);
            _.forEach(persistStates, function (persistState) {
                props.dynamicDispatch(_.get(persistState, ['persistObj', 'action']), _.get(persistState, ['data']))
            })
            props.setInitedRedux(true);
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
    setInitedRedux: setInitedRedux,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReduxPersistWrapper);