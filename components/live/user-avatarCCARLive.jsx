import { Avatar, Form, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { darkThemeColorList } from '../../params/darkThemeColorList';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';
import { isValidNumber } from '../../common-function';
import LightBoxGallery from '../general/light-box-gallery';


/*
    This works with broadcasters data
    
    
    For the messages data, what we do is we put a userName in all the messages
    make sure the user name is in the exact same format as displayName
*/

const UserAvatar = (props) => {
    if(props.data.avatar === "undefined"){
        props.data.avatar = null;
    }
    // ...props.avatar for chats and broadcasters...


    const [tooltipVisible, setTooltipVisible] = useState(false);
    //../../assets/ccarLive/ccar_anonymous.png
    // const anonymous = ()
    
    // the real avatar
    var realAvatar;
    if(props.isAnonymous){
        realAvatar = "/assets/ccarLive/ccar_anonymous.png";
    } else {
        //it is the anonymous
        // realAvatar = !props.data || !props.data.avatar ? null : props.data.avatar;
        realAvatar = (!props.data || !props.data.avatar) ? null : props.data.avatar;
    }


    var calculatedFullName;
    //it can be used in broadcasters list or the list for ccar messages
    if(props.isBroadcastersList){
        calculatedFullName = _.chain([props.data.firstName, props.data.lastName])
                            .compact()
                            .join(' ')
                            .value();
    } else {
        //name: chat.userName from the chat messages
        calculatedFullName = props.data.name;
    }

    var realStyle;
    if(!realAvatar){
        realStyle = {
            backgroundColor: darkThemeColorList[
                //props.data.name means it is a message
                _.toString(calculatedFullName)
                .length % darkThemeColorList.length].code, verticalAlign: 'middle'
            
        }
    } else {
        realStyle={};
    }

    if(props.data.name === "banana Bong" && !props.isBroadcastersList){
    }
    

    return (
        <React.Fragment>
            <div className={`flex-items-align-center flex-justify-center ${props.className ? props.className : ''} ${props.redirectProfile ? 'cursor-pointer' : ''} `} style={{ ...props.style }}
                onClick={(e) => {
                    if (props.onClick) {
                        props.onClick(e)
                    }

                    if (_.get(props.data, ['userurlId']) && props.redirectProfile) {
                        if (props.onRedirect) {
                            props.onRedirect()
                        }
                        props.router.push(`/profile/${props.data.userurlId}`, undefined, { shallow : false })
                    }
                }}
            >
                <LightBoxGallery images={_.compact([_.get(props.data, ['avatar'])])}>
                    {
                        (data, setCurrentIndex, setVisible) => {
                            return (
                                <Tooltip title={_.isPlainObject(props.data) && !_.isEmpty(props.data) ? _.get(props.data, ['name']) ? _.get(props.data, ['name']) || '' : _.get(props.data, ['firstName', 'lastName']) || '' : ''} visible={tooltipVisible} onVisibleChange={(visible) => {
                                    if (props.showTooltip) {
                                        setTooltipVisible(visible)
                                    }
                                }}>
                                    <Avatar
                                        onClick={(e) => {
                                            if (!props.redirectProfile && props.showPreview) {
                                                setCurrentIndex(0);
                                                setVisible(true);
                                            }
                                        }}
                                        size={isValidNumber(props.size) || props.size == 'small' || props.size == 'large' ? props.size : 'default'}
                                        // src={!props.data || !props.data.avatar ? null : props.data.avatar}
                                        src={realAvatar}
                                        icon={!props.data || (!props.data.avatar && !props.data.name && !props.data.firstName && !props.data.lastName) ? 'user' : null}
                                        className={`${props.avatarClassName ? props.avatarClassName : ''} ${props.redirectProfile || props.showPreview ? 'cursor-pointer' : ''}`}
                                        style={realStyle}
                                            >
                                        {
                                            !realAvatar && (
                                                calculatedFullName
                                            )
                                        }
                                    </Avatar>
                                </Tooltip>
                            )
                        }
                    }
                </LightBoxGallery>
                {
                    props.showNameRight && props.data ?
                        <span className={`d-inline-block text-align-center headline margin-left-md text-truncate ${props.textClassName ? props.textClassName : '  '}`} style={{ ...props.textStyle, maxWidth: '80%' }} >
                            {
                                props.renderName ?
                                    props.renderName(props.data)
                                    :
                                    props.data.name ?
                                        props.data.name
                                        :
                                        `${props.data.firstName ? props.data.firstName : ''} ${props.data.lastName ? props.data.lastName : ''}`
                            }
                        </span>
                        :
                        null
                }
            </div>
            <div className={`text-align-center headline ${props.textClassName ? props.textClassName : '  '}`}>
                {
                    props.showName && props.data && !props.showNameRight ?
                        props.renderName ?
                            props.renderName(props.data)
                            :
                            props.data.name ?
                                props.data.name
                                :
                                `${props.data.firstName ? props.data.firstName : ''} ${props.data.lastName ? props.data.lastName : ''}`
                        :
                        null
                }
            </div>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserAvatar)));