import { Button, Col, Form, Icon, message, Row, Upload } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import client from '../../../../feathers';
import { clubProfileViewTypes, validateViewType } from '../../config';
import ClubApprovalModal from './club-approval-modal';
import ClubAvatar from './club-avatar';
import ClubInviteModal from './club-invite-modal';
import JoinClubButton from './join-club-button';
import WriteClubModal from './write-club-modal';
import { loading } from '../../../../redux/actions/app-actions';
import ShareButtonDialog from '../../../general/ShareButtonDialog';
import { formatNumber, notEmptyLength } from '../../../../common-function';
import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}


const defaultHeight = 400;


const ClubProfolioBanner = (props) => {

    const [club, setClub] = useState({});
    const [writeClubVisible, setWriteClubVisible] = useState(false);
    const [inviteVisible, setInviteVisible] = useState(false)
    const [clubApprovalVisible, setClubApprovalVisible] = useState(false)
    const [viewType, setViewType] = useState('non-member');


    useEffect(() => {
        let query = props.router.query;
        if (!query) {
            query = {};
        }
        if (query.invite == '1') {
            setInviteVisible(true)
        }
    }, [props.router.query])

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
                            'Authorization': client.settings.storage.storage.storage['feathers-jwt'],
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

            <Desktop>
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
                                            <Button className=" background-black-opacity-30 white" onClick={(e) => { setWriteClubVisible(true) }}>Edit Club Info</Button>
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
                                                <JoinClubButton club={club} clubId={_.get(club, ['_id'])} userId={_.get(props.user, ['info', 'user', '_id'])}
                                                    onSuccess={(res) => {
                                                        if (_.get(res, ['type']) == 'approved') {
                                                            window.location.reload();
                                                        }
                                                    }}
                                                    joinButton={(joinAction) => {
                                                        return (
                                                            <Button className=" background-ccar-button-yellow border-ccar-button-yellow padding-x-xl black ">Join</Button>
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
            </Desktop>

            <Tablet>
                <div className={`width-100 relative-wrapper flex-justify-start flex-items-align-center padding-md ${props.className || ''}`} style={{ ...props.style, backgroundImage: `url("${_.get(club, ['clubBackgroundImage'])}")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: defaultHeight, backgroundPosition: 'center' }} >
                    <div className='background-black opacity-60 absolute-center'>
                    </div>
                    <span className='width-50 flex-items-align-center height-100' >
                        <Row gutter={[0, 20]} className="width-100">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="width-100 flex-justify-center flex-items-align-center">
                                    <ClubAvatar showPreview data={club} size={150} ></ClubAvatar>
                                </div>
                            </Col>
                            {
                                viewType == clubProfileViewTypes[0] ?
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <div className={`width-100 flex-justify-center flex-items-align-center`}>
                                            <Button className=" background-black-opacity-30 white margin-right-md" onClick={(e) => { setClubApprovalVisible(true) }}>Club Request</Button>
                                            <Button className=" background-black-opacity-30 white" onClick={(e) => { setWriteClubVisible(true) }}>Edit Club Info</Button>
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
                                                <JoinClubButton club={club} clubId={_.get(club, ['_id'])} userId={_.get(props.user, ['info', 'user', '_id'])}
                                                    onSuccess={(res) => {

                                                        if (_.get(res, ['type']) == 'approved') {
                                                            window.location.reload();
                                                        }
                                                    }}
                                                    joinButton={(joinAction) => {
                                                        return (
                                                            <Button className=" background-ccar-button-yellow border-ccar-button-yellow padding-x-xl black ">Join</Button>
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
            </Tablet>

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