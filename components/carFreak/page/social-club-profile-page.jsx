import '@brainhubeu/react-carousel/lib/style.css';
import { Button, Col, Empty, Form, Icon, message, Row, Divider, Card } from 'antd';
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
import { carFreakGlobalSearch, getViewType } from '../config';
import { imageNotFound } from '../../userProfile/config';
import ClubInviteModal from '../components/club/club-invite-modal';
import JoinClubButton from '../components/club/join-club-button';
import ClubProfolioBanner from '../components/club/club-profolio-banner';
import Scrollbars from 'react-custom-scrollbars';
import ClubMemberBox from '../components/club/club-member-box';
import OtherClubsBox from '../components/club/other-clubs-box';
import ClubEventBox from '../components/club/club-event-box';
import ClubDiscussionBox from '../components/club/club-discussion-box';
import queryString from 'query-string';

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

const tabs = [
    {
        text: 'Discussions',
        value: 'discussions',
    },
    {
        text: 'Members',
        value: 'members',
    },
    {
        text: 'Events',
        value: 'events',
    },
    // {
    //     text: 'Media',
    //     value: 'media',
    // },
];


const SocialClubProfilePage = (props) => {

    const [club, setClub] = useState({})
    const [tabKey, setTabKey] = useState(tabs[0].value);
    const [clubJoin, setClubJoin] = useState({});

    useEffect(() => {
        let query = queryString.parse(props.location.search);
        if (!query) {
            query = {};
        }

        setTabKey(_.get(_.find(tabs, function (tab) {
            return tab.value == query.tab;
        }), ['value']) || 'discussions');
    }, [])

    useEffect(() => {
        getClub()
    }, [props.match.params.id])

    useEffect(() => {

        getClubJoin();

    }, [props.user.authenticated, props.match.params.id])


    function getClubJoin() {

        if (props.match.params.id && _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id'])) {
            client.service('clubjoin').find({
                query: {
                    $limit: 1,
                    $skip: 0,
                    clubId: props.match.params.id,
                    userId: _.get(props.user, ['info', 'user', '_id']),
                }
            }).then(res => {
                setClubJoin(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? _.get(res, ['data', 0]) : {});
            }).catch(err => {
                message.error(err.message)
            });
        }
    }


    function getClub() {

        if (props.match.params.id) {
            client.service('clubs').find({
                query: {
                    $limit: 1,
                    $skip: 0,
                    _id: props.match.params.id,
                    $populate: 'userId'
                }
            }).then(res => {
                setClub(_.isArray(_.get(res, ['data'])) && !_.isEmpty(_.get(res, ['data'])) ? _.get(res, ['data', 0]) : {});
            }).catch(err => {
                message.error(err.message)
            });
        }
    }

    const _renderView = (value) => {
        switch (value) {
            case 'discussions':
                return <ClubDiscussionBox viewType={getViewType(clubJoin)} clubId={_.get(club, '_id')} />
                break;
            case 'members':
                return <ClubMemberBox viewType={getViewType(clubJoin)} clubId={_.get(club, ['_id'])} />
                break;
            case 'events':
                return <ClubEventBox viewType={getViewType(clubJoin)} data={club} />
                break;
            case 'media':

                break;
            default:
                break;
        }
    }

    return (
        <React.Fragment>
            <LayoutV2 searchTypes={carFreakGlobalSearch} enterSearchCarFreaks scrollRange={document.body.scrollHeight * 0.5}>

                <Desktop>
                    <CarFreakLayout>
                        <Row gutter={[15, 15]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <ClubProfolioBanner viewType={getViewType(clubJoin)} data={club} onChange={(data) => {
                                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                        setClub(data);
                                    }
                                }}></ClubProfolioBanner>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Scrollbars style={{ width: '100%' }} autoHide autoHeight>
                                    <div className="flex-justify-start flex-items-align-center">
                                        {
                                            _.map(tabs || [], function (tab) {
                                                return (
                                                    <span className={`d-inline-block flex-items-no-shrink cursor-pointer margin-x-lg h7 ${tabKey == tab.value ? 'ccar-yellow border-bottom-ccar-yellow' : 'black'}`} onClick={(e) => { setTabKey(tab.value); }} >
                                                        {tab.text}
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                </Scrollbars>
                                <Divider style={{ margin: '10px 0px 10px 0px' }} type="horizontal"></Divider>
                            </Col>
                            <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                                {_renderView(tabKey)}
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Card
                                    title="Other CarFreaks Club"
                                >
                                    <OtherClubsBox clubId={_.get(club, ['_id'])} userId={_.get(props.user, ['info', 'user', '_id'])} />
                                </Card>
                            </Col>
                        </Row>
                    </CarFreakLayout>
                </Desktop>

            </LayoutV2>

        </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialClubProfilePage)));