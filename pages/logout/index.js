import { message } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loading, loginMode } from '../../redux/actions/app-actions';
import { loginSuccessful, logoutSuccessful } from '../../redux/actions/user-actions';
import client from '../../feathers';
import { withRouter } from 'next/router';

const Logout = (props) => {

    useEffect(() => {
        try {
            localStorage.clear()
            sessionStorage.clear()
            props.logoutSuccessful();
            client.logout().then((res) => {
                message.success('Log out successful')
                props.router.push('/');
            }).catch(err => {
                props.router.push('/');
            });
        }
        catch (err) {

        }
    }, [])

    return (
        <React.Fragment>
        </React.Fragment>

    );
}

const mapStateToProps = state => ({
    app: state.app
});

const mapDispatchToProps = {
    loading: loading,
    loginMode: loginMode,
    loginSuccessful: loginSuccessful,
    logoutSuccessful: logoutSuccessful,
};

export async function getStaticProps({ params }) {
    return { props: {  } }
  }
  
  
export default connect(mapStateToProps, mapDispatchToProps)((withRouter(Logout)));

