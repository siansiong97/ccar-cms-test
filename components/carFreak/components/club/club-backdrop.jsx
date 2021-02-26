import { Avatar, Form, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { ccarLogo } from '../../../userProfile/config';
import { loading } from '../../../../actions/app-actions';
import { isValidNumber } from '../../../profile/common-function';
import { clubNonMember } from '../../../../icon';
import { validateViewType, clubProfileViewTypes } from '../../config';


const ClubBackdrop = (props) => {

    const [viewType, setViewType] = useState('non-member');

    useEffect(() => {
        setViewType(validateViewType(props.viewType))
    }, [props.viewType])


    return (
        <React.Fragment>
            <div className={`width-100 ${props.className || ''} relative-wrapper`}>
                {
                    viewType == clubProfileViewTypes[3] || viewType == clubProfileViewTypes[2]?
                        <div className="height-100 flex-items-align-start flex-justify-center padding-top-xl absolute-center" style={{ zIndex : 2 }}>
                            <div className="margin-top-xl text-align-center">
                                <img src={clubNonMember} style={{ width: 100, height: 100 }} />
                                <div className="font-weight-bold headline text-overflow-break margin-top-md">
                                    In order to view our contents, you are required to join us as our member.
                            </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div className={`${viewType == clubProfileViewTypes[3] || viewType == clubProfileViewTypes[2] ? 'background-blur' : ''}`} style={{ zIndex : 1 }}>
                    {props.children}
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubBackdrop)));