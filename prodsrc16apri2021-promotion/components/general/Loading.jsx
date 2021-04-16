import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form } from '@ant-design/compatible';
import { withRouter } from 'next/dist/client/router';


const Loading = (props) => {


    useEffect(() => {
    }, [props.loading])


    return (

        <React.Fragment>
            <Spin spinning={props.spinning ? props.spinning : false} size={props.size ? props.size : 'large'} wrapperClassName={props.className ? props.className : ''} indicator={
                <img src="/loading.gif" style={{ width : 100, height : 100, position : 'sticky', position : '-webkit-sticky', top : 0, bottom : 0, left : 0 , right : 0, margin : 'auto'}} />
            }>
                {props.children}
            </Spin>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Loading)));