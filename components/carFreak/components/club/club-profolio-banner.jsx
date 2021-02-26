import { Form, Button, Row, Col, Icon, Upload, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import ClubAvatar from './club-avatar';
import { loading } from '../../../../actions/app-actions';
import _ from 'lodash';
import { formatNumber, notEmptyLength } from '../../../profile/common-function';
import Scrollbars from 'react-custom-scrollbars';
import WriteClubModal from './write-club-modal';
import client from '../../../../feathers';
import { v4 } from 'uuid';
import axios from 'axios';
import ClubInviteModal from './club-invite-modal';
import ShareButtonDialog from '../../../commonComponent/share-button-dialog';
import ClubApprovalModal from './club-approval-modal';
import { validateViewType, clubProfileViewTypes } from '../../config';
import JoinClubButton from './join-club-button';

const defaultHeight = 400;


const ClubProfolioBanner = (props) => {

    const [club, setClub] = useState({});
    const [writeClubVisible, setWriteClubVisible] = useState(false);
    const [inviteVisible, setInviteVisible] = useState(false)
    const [clubApprovalVisible, setClubApprovalVisible] = useState(false)
    const [viewType, setViewType] = useState('non-member');

    useEffect(() => {
        setClub(_.isPlainObject(props.data) && !_.isEmpty(props.data) ? props.data : {});
    }, [props.data])

    useEffect(() => {
        setViewType(validateViewType(props.viewType))
    }, [props.viewType])

    useEffect(() => {
 
    }, [viewType])

    function handleSumbitCoverPhoto(coverPhoto) {
        if (coverPhoto && _.get(club, ['_id'])) {
            props.loading(true);
            client.authenticate().then((res) => {
                let formData = new FormData();
                var fileName = v4() + "-" + coverPhoto.name.split('.').join("-") + "-" + new Date().getTime();

                formData.append('images', coverPhoto.originFileObj, fileName);

                //Upload Image
                axios.post(`${client.io.io.uri}upload-images-array`,
                    formData
                    , {
                        headers: {
                            'Authorization': client.settings.accessToken,
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                ).then((res) => {
                    if (notEmptyLength(_.get(res, ['data', 'result']))) {
                        coverPhoto = res.data.result[0].url;
                    } else {
                        coverPhoto = null;
                    }

                    client.service('clubs').patch(club._id, { clubBackgroundImage: coverPhoto }).then(res => {
                        props.loading(false);
                        if (props.onChange) {
                            props.onChange(res);
                        }
                        if (props.onChangeCoverPhoto) {
                            props.onChangeCoverPhoto(_.get(res, ['clubBackgroundImage']));
                        }
                    }).catch(err => {
                        props.loading(false);
                        message.error(err.message)
                    });

                })
            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });

        }
    }

    return (
        <React.Fragment>

            <div className={`width-100 relative-wrapper flex-justify-start flex-items-align-center padding-md ${props.className || ''}`} style={{ ...props.style, backgroundImage: `url("${_.get(club, ['clubBackgroundImage'])}")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: defaultHeight, backgroundPosition: 'center' }} >
                <div className='background-black opacity-60 absolute-center'>
                </div>
                <span className='width-30 flex-items-align-center height-100' >
                    <Row gutter={[0, 20]} className="width-100">
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100 flex-justify-center flex-items-align-center">
                                <ClubAvatar showPreview data={club} size={200} ></ClubAvatar>
                            </div>
                        </Col>
                        {
                            viewType == clubProfileViewTypes[0] ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div className={`width-100 flex-justify-center flex-items-align-center`}>
                                        <Button className=" background-black-opacity-30 white margin-right-md" onClick={(e) => { setClubApprovalVisible(true) }}>Club Request</Button>
                                        <Button className=" background-black-opacity-30 white" onClick={(e) => { setWriteClubVisible(true) }}>Edit Profile</Button>
                                    </div>
                                </Col>
                                :
                                null
                        }
                    </Row>
                </span>
                <span className='width-50 flex-items-align-center height-100' >
                    <Row gutter={[0, 10]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className=" width-100 flex-justify-start flex-items-align-center h4 white font-weight-bold text-truncate">
                                {_.get(club, ['clubName']) || ''}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className={`width-100 flex-justify-start flex-items-align-center`}>
                                <span className='d-inline-block text-align-center margin-right-lg' >
                                    <div className=" h6 font-weight-normal white">
                                        {formatNumber(_.get(club, ['clubTotalPosts']), 'auto', true, 0, true) || 0}
                                    </div>
                                    <div className=" headline font-weight-light white">
                                        Posts
                                    </div>
                                </span>
                                <span className='d-inline-block text-align-center margin-right-lg' >
                                    <div className=" h6 font-weight-normal white">
                                        {formatNumber(_.get(club, ['clubTotalDiscussions']), 'auto', true, 0, true) || 0}
                                    </div>
                                    <div className=" headline font-weight-light white">
                                        Discussions
                                    </div>
                                </span>
                                <span className='d-inline-block text-align-center margin-right-lg' >
                                    <div className=" h6 font-weight-normal white">
                                        {formatNumber(_.get(club, ['clubTotalMembers']), 'auto', true, 0, true) || 0}
                                    </div>
                                    <div className=" headline font-weight-thin white">
                                        Members
                                    </div>
                                </span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className={`width-100 flex-justify-start flex-items-align-center`}>
                                {
                                    viewType == clubProfileViewTypes[3] || viewType == clubProfileViewTypes[2] ?
                                        <span className='d-inline-block margin-right-md' >
                                            <JoinClubButton clubId={_.get(club, ['_id'])} userId={_.get(props.user, ['info', 'user', '_id'])}
                                                onSuccess={(res) => {
                                              
                                                    if (_.get(res, ['type']) == 'approved') {
                                                        window.location.reload();
                                                    }
                                                }}
                                                joinButton={(joinAction) => {
                                                    return (
                                                        <Button className=" background-ccar-button-yellow border-ccar-button-yellow padding-x-xl black ">{joinAction == 'approved' ? 'Accept' : 'Join'}</Button>
                                                    )
                                                }}
                                                joinedButton={() => {
                                                    return (
                                                        <Button className=" background-ccar-button-yellow border-ccar-button-yellow padding-x-xl black ">Joined</Button>
                                                    )
                                                }}
                                                pendingButton={() => {
                                                    return (
                                                        <Button className=" background-ccar-button-yellow border-ccar-button-yellow padding-x-xl black ">Pending Approval</Button>
                                                    )
                                                }}
                                            />
                                        </span>
                                        :
                                        <Button className=" background-ccar-button-yellow border-ccar-button-yellow padding-x-xl black margin-right-md" onClick={(e) => { setInviteVisible(true) }}>+ Invite</Button>
                                }

                                <ShareButtonDialog link={`/social-club/${_.get(club, ['_id'])}`}>
                                    <Button className=" background-white border-white padding-x-xl black"><Icon type="share-alt" ></Icon>Share</Button>
                                </ShareButtonDialog>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Scrollbars autoHeight autoHeightMax={100}>
                                <div className="text-overflow-break width-100 white headline font-weight-thin">
                                    {_.get(club, ['clubBio']) || ''}
                                </div>
                            </Scrollbars>
                        </Col>
                    </Row>
                </span>
                {
                    viewType == clubProfileViewTypes[0] ?
                        <span className='d-inline-block ' style={{ position: 'absolute', bottom: 20, right: 20 }} >
                            <Upload {...props} showUploadList={false} onChange={(e) => { handleSumbitCoverPhoto(e.file); }} multiple={false} accept="image/*">
                                <Button className='margin-right-md white background-grey-opacity-30'> <Icon type="camera" /> Edit Cover Photo </Button>
                            </Upload>
                        </span>
                        :
                        null
                }
            </div>

            <WriteClubModal
                editMode={true}
                data={club}
                notify
                visible={writeClubVisible}
                onCancel={() => {
                    setWriteClubVisible(false);
                }}
                onUpdate={(res) => {
                    if (props.onChange) {
                        props.onChange(res);
                    }
                }}
            ></WriteClubModal>

            <ClubInviteModal
                visible={inviteVisible}
                onCancel={() => {
                    setInviteVisible(false);
                }}
                clubId={_.get(club, ['_id'])}
                userId={_.get(props.user, ['info', 'user', '_id'])}
            >

            </ClubInviteModal>

            <ClubApprovalModal
                visible={clubApprovalVisible}
                onCancel={() => {
                    setClubApprovalVisible(false);
                }}
                clubId={_.get(club, ['_id'])}
            >

            </ClubApprovalModal>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubProfolioBanner)));