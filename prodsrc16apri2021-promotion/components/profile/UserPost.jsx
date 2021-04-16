import { Form, Icon } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { formatNumber } from '../../common-function';
import {
    loading,
    loginMode, updateActiveMenu
} from '../../redux/actions/app-actions';
import { commentIcon } from '../live/config';
import { imageNotFound } from './config';



var moment = require('moment');


const UserPost = (props) => {

    const [post, setPost] = useState({});

    useEffect(() => {
        if (_.isPlainObject(props.post) && !_.isEmpty(props.post)) {
            setPost(props.post);
        } else {
            setPost({});
        }
    }, [props.post])

    function handleOnClick() {
        if (props.onClick) {
            props.onClick(post)
        }
    }


    return (
        <React.Fragment>
            <div className={`width-100 cursor-pointer ${props.className || ''}`} style={{ height: props.height || 400, ...props.style }} onClick={(e) => { handleOnClick() }}>
                <div className="fill-parent relative-wrapper">
                    <img src={_.get(post, ['mediaList', 0, 'url']) || imageNotFound} className='img-cover fill-parent' />
                    <div className="stack-element-opacity-100 absolute-center fill-parent flex-justify-center flex-items-align-center background-black-opacity-50">
                        <span className='flex-justify-center flex-items-align-center white margin-right-xl' >
                            <Icon type="heart" theme="filled" className='white margin-right-sm' style={{ fontSize: 20 }} />
                            {_.get(post, ['totalLike']) ? formatNumber(_.get(post, ['totalLike']), 'auto', true, 0, true) : 0}
                        </span>
                        <span className='flex-justify-center flex-items-align-center white' >
                            <img src={commentIcon} style={{ width: 20, height: 20 }} className='margin-right-sm' />
                            {_.get(post, ['totalReply']) ? formatNumber(_.get(post, ['totalReply']), 'auto', true, 0, true) : 0}
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    sellCars: state.sellCars,
    productsList: state.productsList,
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});


const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    loading: loading,
    loginMode: loginMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserPost)));