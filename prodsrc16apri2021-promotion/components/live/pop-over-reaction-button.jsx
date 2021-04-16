import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Switch, Radio, message, Icon, Card, Avatar, Select, Modal, Rate, Dropdown, Menu, Divider, Popover } from 'antd';
import { CloseOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    loading
} from '../../actions/app-actions';
import { setUser } from '../../actions/user-actions';
import _ from 'lodash';
import client from '../../feathers'
import { notEmptyLength, isSavedWishList, isValidNumber, objectRemoveEmptyValue } from '../profile/common-function';
import { reactionGif, defaultReactions, likeIcon } from './config';
import ReactionButton from './reaction-button';
import ScrollContainer from 'react-indiana-drag-scroll';
import ReactionButtonList from './reaction-button-list';


const PopOverReactionButton = (props) => {

    const [reactions, setReactions] = useState([])
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (notEmptyLength(props.reactions)) {
            setReactions(props.reactions)
        } else {
            let temp = [];
            _.forEach(defaultReactions, function (reaction) {
                temp.push({
                    type: reaction,
                })
            })
            setReactions(temp);
        }
    }, [props.reactions])

    function handleOnClick(data) {
        if (props.onClick) {
            props.onClick(data);
        }
    }

    return (
        <React.Fragment>
            <Popover
                overlayClassName="reaction-popover"
                content={
                    <React.Fragment>
                        <span className='d-inline-block ' style={{ height: '25px', width: '200px' }} >
                            <ReactionButtonList reactions={reactions} className='flex-justify-center flex-items-align-center fill-parent' reactionClassName="hover-reaction-button-bigger margin-right-sm" onClick={(reaction) => {
                                handleOnClick(reaction);
                                setVisible(false)
                            }} />
                        </span>
                    </React.Fragment>}
                trigger="hover"
                placement="top"
                arrowPointAtCenter
                visible={visible}
                onVisibleChange={(v) => {
                    setVisible(v);
                }}
            >
                <span className='d-inline-block' onClick={(e) => {
       
                    let data = {
                        total: 1,
                        userId: props.user.authenticated ? props.user.info.user._id : null,
                        type: reactions[0].type,
                        createdAt: new Date(),
                    }
                    handleOnClick(data);
                    setVisible(false)
                }} >
                    {
                        props.children ?
                            props.children
                            :
                            <span className='flex-items-align-center flex-justify-center cursor-pointer margin-right-sm' >
                                <img src={likeIcon} style={{ width: '20px', height: '20px' }} className='margin-right-xs' />
                                <span className='grey headline' >
                                    Like
                            </span>
                            </span>
                    }
                </span>
            </Popover>
        </React.Fragment>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PopOverReactionButton)));