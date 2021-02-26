import '@brainhubeu/react-carousel/lib/style.css';
import { Button, Col, Empty, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { withRouter } from 'next/dist/client/router';
import client from '../../../feathers';
import LayoutV2 from '../../Layout-V2';
import { isValidNumber, notEmptyLength, arrayLengthCount } from '../../profile/common-function';
import CarFreakLayout from '../components/car-freak-layout';
import WriteClubModal from '../components/club/write-club-modal';
import { carFreakGlobalSearch } from '../config';
import { imageNotFound } from '../../userProfile/config';
import SocialClubLayout from '../components/club/social-club-layout';
import AllClubBox from '../components/club/all-club-box';
import MyClubBox from '../components/club/my-club-box';
import axios from 'axios';
import MyClubInvitationBox from '../components/club/my-club-invitation-box';

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


const PAGE_SIZE = 36;


const SocialClubPage = (props) => {

    const [tabKey, setTabKey] = useState('allClubs');
    const [isLoading, setIsLoading] = useState(false)

    const [clubs, setClubs] = useState([])
    const [clubTotal, setClubTotal] = useState(0);
    const [clubPage, setClubPage] = useState(1);


    const [invites, setInvites] = useState([])
    const [inviteTotal, setInviteTotal] = useState(0);
    const [invitePage, setInvitePage] = useState(1);

    useEffect(() => {

        getClubs((clubPage - 1) * PAGE_SIZE);

    }, [clubPage])



    useEffect(() => {

        if (invitePage == 1) {
            getInvites();
        } else {
            setInvitePage(1);
        }

    }, [props.user.authenticated])


    useEffect(() => {

        getInvites((invitePage - 1) * PAGE_SIZE);

    }, [invitePage])

    function getClubs(skip) {

        skip = isValidNumber(parseInt(skip)) ? parseInt(skip) : 0;

        client.service('clubs').find({
            query: {
                $limit: PAGE_SIZE,
                $skip: skip,
                $sort: {
                    createdAt: -1,
                }
            }
        }).then(res => {
            setClubs(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? clubPage == 1 ? _.get(res, ['data']) : _.concat(clubs, _.get(res, ['data'])) : clubs);
            setClubTotal(_.get(res, ['total']) || 0);
        }).catch(err => {
            console.log(err);
        });

    }

    function getInvites(skip) {

        if (_.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id'])) {

            skip = isValidNumber(parseInt(skip)) ? parseInt(skip) : 0;

            axios.get(`${client.io.io.uri}getInviteList`, {
                params: {
                    match: {
                        invitee: _.get(props.user, ['info', 'user', '_id']),
                        status: ''
                    },
                    limit: PAGE_SIZE,
                    skip: skip,
                }
            }).then(res => {
                setInvites(_.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ? invitePage == 1 ? _.get(res, ['data', 'data']) : _.concat(invites, _.get(res, ['data', 'data'])) : invites);
                setInviteTotal(_.get(res, ['data', 'total']) || 0);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <React.Fragment>
            <LayoutV2 searchTypes={carFreakGlobalSearch} enterSearchCarFreaks scrollRange={document.body.scrollHeight * 0.5} onScrolledBottom={() => {
                if (tabKey == 'allClubs' && (clubPage * PAGE_SIZE) < clubTotal) {
                    setClubPage(clubPage + 1)
                }
                if (tabKey == 'myClubInvitation' && (invitePage * PAGE_SIZE) < inviteTotal) {
                    setInvitePage(clubPage + 1)
                }
            }}>

                <Desktop>
                    <CarFreakLayout>
                        <SocialClubLayout
                            tabKey={tabKey}
                            onCreate={(item) => {
                                if (_.isPlainObject(item) && !_.isEmpty(item)) {
                                    setClubs([item].concat(clubs))
                                }
                            }}
                            onChange={(tabKey) => {
                                setTabKey(tabKey);
                            }}
                        >


                            {
                                tabKey == 'myClub' ?
                                    <React.Fragment>
                                        <MyClubBox userId={_.get(props.user, ['info', 'user', '_id'])} />
                                    </React.Fragment>
                                    :
                                    tabKey == 'myClubInvitation' ?
                                        _.isArray(invites) && notEmptyLength(invites) ?
                                            <React.Fragment>
                                                <MyClubInvitationBox data={invites} userId={_.get(props.user, ['info', 'user', '_id'])} />
                                            </React.Fragment>
                                            :
                                            !isLoading ?
                                                <div className="width-100 flex-items-align-center flex-justify-center background-white" style={{ height: 400 }}><Empty /></div>
                                                : <div></div>
                                        :
                                        _.isArray(clubs) && notEmptyLength(clubs) ?
                                            <React.Fragment>
                                                <AllClubBox data={clubs} />
                                            </React.Fragment>
                                            :
                                            !isLoading ?
                                                <div className="width-100 flex-items-align-center flex-justify-center background-white" style={{ height: 400 }}><Empty /></div>
                                                : <div></div>
                            }


                            <div className="width-100 flex-justify-center" style={{ height: 50 }}>
                                {
                                    isLoading ?
                                        <Icon type="loading" style={{ fontSize: 50 }} />
                                        :
                                        null
                                }
                            </div>
                        </SocialClubLayout>
                    </CarFreakLayout>
                </Desktop>

            </LayoutV2>

        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes,
    carFreak: state.carFreak,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialClubPage)));