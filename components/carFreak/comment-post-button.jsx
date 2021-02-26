import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Tooltip } from 'antd';
import { CloseOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import {
    loading
} from '../../actions/app-actions';
import { setUser } from '../../actions/user-actions';
import _ from 'lodash';
import client from '../../feathers'
import { notEmptyLength, isSavedWishList } from '../profile/common-function';



const CommentPostButton = (props) => {


    return (

        <span className={`${props.className ? props.className : ''}`}>
            {
                props.children ?
                    props.children
                    :
                    <span className='flex-items-align-center cursor-pointer' >
                        <span className='margin-right-sm' >
                            <Icon type="like" />
                        </span>
                        <span className='headline  ' >
                            Like
                  </span>
                    </span>
            }
        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CommentPostButton)));