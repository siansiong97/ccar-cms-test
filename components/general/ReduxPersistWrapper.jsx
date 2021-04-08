import { } from 'antd';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setInitedRedux } from '../../redux/actions/app-actions';
import { dynamicDispatch, getLocalStoragePersistStates, restoreRedux } from '../../redux/config';
import localStorage from 'local-storage';



const ReduxPersistWrapper = (props) => {


    useEffect(() => {

        //Used better approach, straight persist states at reducer

        // if (props.cookie) {
        //     let persistStates = getLocalStoragePersistStates();
        //     _.forEach(persistStates, function (persistState) {
        //         props.dynamicDispatch(_.get(persistState, ['persistObj', 'action']), _.get(persistState, ['data']))
        //     })
        // console.log(localStorage.get('redux'));
        props.restoreRedux(localStorage.get('redux') || {});
        props.setInitedRedux(true);
        // }

    }, [props.cookie])

    return (

        <React.Fragment>
            {
                props.app.initedRedux ?
                    props.children
                    :
                    null
            }
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
    restoreRedux: restoreRedux,
    dynamicDispatch: dynamicDispatch,
    setInitedRedux: setInitedRedux,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReduxPersistWrapper);