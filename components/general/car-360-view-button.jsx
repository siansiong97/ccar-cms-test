import { Button, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { Form } from '@ant-design/compatible';


// const urlPrefix = 'https://uat2-api.ccar.my/360View/';
const urlPrefix = 'https://api.ccar.my/360view/';

const Car360ViewButton = (props) => {


    return (
        <React.Fragment>
            <a target={`${props.id ? '_blank' : ''}`} href={props.id ? `${urlPrefix}${props.id}` : null} className={`width-100`}>
                {
                    props.children ?
                        props.children
                        :
                        <Tooltip title="360&deg; View">
                            <Button type="normal" className="w-100 ads-purchase-button" style={{ padding: 0, background: 'rgb(237, 236, 234)', borderColor: 'rgb(237, 236, 234)' }}><img src="/assets/profile/icon-list/carmarket-bar-icon/360.png" /></Button>
                        </Tooltip>
                }
            </a>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Car360ViewButton)));