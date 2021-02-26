import { Avatar, Form, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { ccarLogo } from '../../../userProfile/config';
import { loading } from '../../../../actions/app-actions';
import { isValidNumber } from '../../../profile/common-function';
import LightBoxGallery from '../../../commonComponent/light-box-gallery';


const ClubAvatar = (props) => {

    const [tooltipVisible, setTooltipVisible] = useState(false);


    return (
        <React.Fragment>
            <span className={`flex-items-align-center flex-justify-center ${props.className ? props.className : ''} ${props.redirectProfile ? 'cursor-pointer' : ''} `}
                onClick={(e) => {
                    if (props.onClick) {
                        props.onClick(e)
                    }

                    if (_.get(props.data, ['_id']) && props.redirectProfile) {
                        if (props.onRedirect) {
                            props.onRedirect()
                        }
                        props.router.push(`/social-club/${props.data._id}`)
                    }
                }}
            >
                <LightBoxGallery images={_.compact([_.get(props.data , ['clubAvatar'])])}>
                    {
                        (data, setCurrentIndex, setVisible) => {
                            return (
                                <Tooltip title={_.isPlainObject(props.data) && !_.isEmpty(props.data) ? _.get(props.data, ['clubName']) || '' : ''} visible={tooltipVisible} onVisibleChange={(visible) => {
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
                                        src={_.get(props.data, ['clubAvatar']) || ccarLogo}
                                        className={`${props.redirectProfile || props.showPreview ? 'cursor-pointer' : ''} ${props.avatarClassName ? props.avatarClassName : ''}`}>
                                    </Avatar>
                                </Tooltip>
                            )
                        }
                    }
                </LightBoxGallery>
                {
                    props.showNameRight && props.data ?
                        <span className={`d-inline-block text-align-center headline margin-left-md ${props.textClassName ? props.textClassName : '  '}`} >
                            {
                                props.renderName ?
                                    props.renderName(props.data)
                                    :
                                    `${_.get(props.data, ['clubName'])}`
                            }
                        </span>
                        :
                        null
                }
            </span>
            <div className={`text-align-center headline ${props.textClassName ? props.textClassName : '  '}`}>
                {
                    props.showName && props.data && !props.showNameRight ?
                        props.renderName ?
                            props.renderName(props.data)
                            :
                            `${_.get(props.data, ['clubName'])}`
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubAvatar)));