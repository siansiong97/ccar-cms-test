import { Avatar, Form, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import LightBoxGallery from './light-box-gallery';
import { loading } from '../../redux/actions/app-actions';
import { isValidNumber } from '../../common-function';
import { darkThemeColorList } from '../../params/darkThemeColorList';
import { withRouter } from 'next/router';


const UserAvatar = (props) => {

    const [tooltipVisible, setTooltipVisible] = useState(false);


    return (
        <React.Fragment>
            <div className={`flex-items-align-center flex-justify-center ${props.className ? props.className : ''} ${props.redirectProfile ? 'cursor-pointer' : ''} `} style={{ ...props.style }}
                onClick={(e) => {
                    if (props.onClick) {
                        props.onClick(e)
                    }

                    if (_.get(props.data, ['_id']) && props.redirectProfile) {
                        if (props.onRedirect) {
                            props.onRedirect()
                        }
                        props.router.push(`/profile/${props.data._id}`, undefined, { shallow : false })
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
                                        src={!props.data || !props.data.avatar ? null : props.data.avatar}
                                        icon={!props.data || (!props.data.avatar && !props.data.name && !props.data.firstName && !props.data.lastName) ? 'user' : null}
                                        className={`${props.avatarClassName ? props.avatarClassName : ''} ${props.redirectProfile || props.showPreview ? 'cursor-pointer' : ''}`}
                                        style={!props.data || !props.data.avatar ?
                                            {
                                                //donar
                                                backgroundColor: !props.data || (!props.data.name && !props.data.firstName && !props.data.lastName) ?
                                                    "#F89F27"
                                                    :
                                                    darkThemeColorList[_.toString(props.data.name ? props.data.name : `${props.data.firstName ? props.data.firstName : ''} ${props.data.lastName ? props.data.lastName : props.data.lastName}`).length % darkThemeColorList.length].code, verticalAlign: 'middle'
                                            }
                                            :
                                            {}}>
                                        {
                                            !props.data ?
                                                null
                                                :
                                                !props.data.avatar ?
                                                    props.data.name ?
                                                        props.data.name
                                                        :
                                                        `${props.data.firstName ? props.data.firstName : ''} ${props.data.lastName ? props.data.lastName : ''}`
                                                    :
                                                    null
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserAvatar));