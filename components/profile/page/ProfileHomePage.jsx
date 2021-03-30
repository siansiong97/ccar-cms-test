import { Card, Form, message } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { notEmptyLength } from '../../../common-function';
import { filterCarBrandMode, filterCarModelMode, filterCarSearchKeywords, loading, loginMode, quickSearchProductsList, updateActiveMenu } from '../../../redux/actions/app-actions';
import { fetchProductsList, updateActiveIdProductList } from '../../../redux/actions/productsList-actions';
import { setUser } from '../../../redux/actions/user-actions';
import LayoutV2 from '../../general/LayoutV2';
import DealerProfile from '../DealerProfile';
import ProfileNotFound from '../ProfileNotFound';
import UserProfile from '../UserProfile';
import client from '../../../feathers';


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

const { Meta } = Card;


const ProfileHomePage = (props) => {


    const [userType, setUserType] = useState('user');
    const [profile, setProfile] = useState({});
    const [isOwn, setIsOwn] = useState(false);

    useEffect(() => { 
 
    } , [])

    useEffect(() => {
        getProfile();
    }, [props.router.query.id])

    useEffect(() => {
    }, [isOwn])

    useEffect(() => {
 
        setIsOwn(_.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) == _.get(profile, ['_id']))
    }, [props.user.authenticated, profile])

    useEffect(() => {
        if (_.isPlainObject(profile) && !_.isEmpty(profile)) {
            setUser(profile);
        }

    }, [profile])

    function getProfile() {
        props.loading(true);
        client.service('users').find({
            query: {
                _id: props.router.query.id,
                $populate: [
                    {
                        path: 'companyId',
                        ref: 'companys'
                    }
                ],
            }
        }).then(res => {
            props.loading(false);
            setProfile(_.isArray(res.data) && notEmptyLength(res.data) ? res.data[0] : {})
            setIsOwn(_.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) == props.router.query.id)
            setUserType(_.get(res, ['data', 0, 'role']) ? _.get(res, ['data', 0, 'role']) == 'mobile-user' || _.get(res, ['data', 0, 'role']) == 'normaluser' ? 'user' : 'dealer' : '')
        }).catch(err => {
            props.loading(false);
            message.error(err.message)
        });
    }


    return (
        <LayoutV2>
            <Desktop>
                <div className="section">
                    <div className="container">
                        {
                            userType == 'user' ?
                                <UserProfile data={profile} isOwn={isOwn} onChangeCoverPhoto={(url) => {
                                    setProfile({ ...profile, profileCoverPhoto: url })
                                }}
                                />
                                :
                                userType == 'dealer' ?
                                    <DealerProfile data={profile} isOwn={isOwn} onChangeCoverPhoto={(url) => {
                                        setProfile({ ...profile, profileCoverPhoto: url })
                                    }} />
                                    :
                                    <ProfileNotFound />
                        }
                    </div>
                </div>
            </Desktop>

            <Tablet>
                <div className="section" style={{ touchAction: 'pan-y' }}>
                    <div>
                        {
                            userType == 'user' ?
                                <UserProfile data={profile} isOwn={isOwn} onChangeCoverPhoto={(url) => {
                                    setProfile({ ...profile, profileCoverPhoto: url })
                                }}
                                />
                                :
                                userType == 'dealer' ?
                                    <DealerProfile data={profile} isOwn={isOwn} onChangeCoverPhoto={(url) => {
                                        setProfile({ ...profile, profileCoverPhoto: url })
                                    }} />
                                    :
                                    <ProfileNotFound />
                        }
                    </div>
                </div>
            </Tablet>

            <Mobile>
                <div className="section-version3">
                    <div className="container-version3">
                        {
                            userType == 'user' ?
                                <UserProfile data={profile} isOwn={isOwn} onChangeCoverPhoto={(url) => {
                                    setProfile({ ...profile, profileCoverPhoto: url })
                                }}
                                />
                                :
                                userType == 'dealer' ?
                                    <DealerProfile data={profile} isOwn={isOwn} onChangeCoverPhoto={(url) => {
                                        setProfile({ ...profile, profileCoverPhoto: url })
                                    }} />
                                    :
                                    <ProfileNotFound />
                        }
                    </div>
                </div>
            </Mobile>

        </LayoutV2 >
    );
}

const mapStateToProps = state => ({
    sellCars: state.sellCars,
    productsList: state.productsList,
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
    loginMode: loginMode,
    updateActiveMenu: updateActiveMenu,
    fetchProductsList: fetchProductsList,
    updateActiveIdProductList: updateActiveIdProductList,
    filterCarBrandMode: filterCarBrandMode,
    filterCarModelMode: filterCarModelMode,
    filterCarSearchKeywords: filterCarSearchKeywords,
    quickSearchProductsList: quickSearchProductsList,

    loading: loading,
    setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProfileHomePage)));
