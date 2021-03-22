import { Form, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../../feathers';
import { carFreakLikeGreyIcon, carFreakLikeIcon } from '../../../icon';
import { loading, loginMode } from '../../../redux/actions/app-actions';



const TIME_OUT = 1000;

const LikePostButton = (props) => {

    const [likeOn, setLikeOn] = useState('chat')
    const [postLike, setPostLike] = useState({})
    const [isActived, setIsActived] = useState(false)
    const [timeoutFunc, setTimeoutFunc] = useState();

    useEffect(() => {
        setLikeOn(props.likeOn || 'chat');
    }, [props.likeOn])

    useEffect(() => {
        if (_.isPlainObject(props.postLike) && !_.isEmpty(props.postLike)) {
            setPostLike(props.postLike);
        } else {
            setPostLike({});
        }
    }, [props.postLike])

    useEffect(() => {
        if (_.isPlainObject(postLike) && !_.isEmpty(postLike)) {
            setIsActived(true);
        } else {
            setIsActived(false);
        }
    }, [postLike])

    useEffect(() => {
    }, [isActived])

    useEffect(() => {
        if (props.autoHandle && likeOn) {
            getPostLike()
        }
    }, [props.autoHandle, likeOn])


    function getPostLike() {
        if (props[`${likeOn}Id`] && _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id']) ) {
            let query = {};
            query.likeOn = likeOn
            query[`${likeOn}Id`] = props[`${likeOn}Id`]
            query.userId = _.get(props.user, ['info', 'user', '_id'])
            client.service('chatlikes').find({
            query: {
                ...query
            }
            }).then(res => {
                setPostLike(_.get(res, ['data', 0]) || {})
            }).catch(err => {
                console.log(error);
            });
        }
    }



    function onClickLike() {


        if (!props.readOnly) {
            if (!_.get(props.user, ['authenticated']) && !_.get(props.user, ['info', 'user', '_id'])) {
                message.error('Please Login First!');
                props.loginMode(true);
                return;
            }

            switch (likeOn) {
                case 'chat':
                    break;
                case 'message':
                    break;
                case 'reply':
                    break;
                default:
                    message.error('Content Not Found.')
                    return;
            }

            if (props[`${likeOn}Id`]) {
                let actived = !isActived;
                setIsActived(actived);

                if (timeoutFunc) {
                    clearTimeout(timeoutFunc);
                }

                if (props.onClick) {
                    props.onClick(actived)
                }


                setTimeoutFunc(setTimeout(() => {
                    //Only run if the like status no same
                    let query =
                    {
                        userId: _.get(props.user, ['info', 'user', '_id']),
                        type: actived ? 'add' : 'remove',
                        likeOn: likeOn,
                    };

                    query[`${likeOn}Id`] = props[`${likeOn}Id`];

                    axios.post(`${client.io.io.uri}updateLike`,
                        query
                        , {
                            headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] },
                        }).then((res) => {
                            if (props.onSuccessUpdate) {
                                props.onSuccessUpdate(actived, _.get(res, ['data']));
                            }
                            if (_.get(res.data, ['type']) == 'add') {
                                setPostLike(res.data)
                            } else {
                                setPostLike({});
                            }
                            setTimeoutFunc();
                        }).catch((err) => {
                            setTimeoutFunc();
                            console.log(error);
                            console.log('not able to like');
                        })
                }, TIME_OUT))
            } else {
                message.error('Post Not Found')
            }

        }
    }

    return (

        <span className={`${props.className ? props.className : ''}`} onClick={(e) => {
            if (!props.readOnly) {
                onClickLike()
            }
        }}>
            {
                !isActived ?
                    props.children ?
                        props.children
                        :
                        <span className='flex-items-align-center cursor-pointer' >
                            <span className='margin-right-sm' >
                                <img src={carFreakLikeGreyIcon} style={{ width: 35, height: 25 }} className="cursor-pointer" />
                                {/* <Icon type="like" /> */}
                            </span>
                            <span className='headline' >
                                {
                                    props.text ? props.text(false) || 'Like' : 'Like'
                                }
                            </span>
                        </span>
                    :
                    props.activeButton ?
                        props.activeButton
                        :
                        <span className='flex-items-align-center cursor-pointer' >
                            <span className='margin-right-sm' >
                                <img src={carFreakLikeIcon} style={{ width: 35, height: 25 }} className="cursor-pointer" />
                                {/* <Icon type="like" theme="filled" className="blue" /> */}
                            </span>
                            <span className='headline' >
                                {
                                    props.text ? props.text(true) || 'Liked' : 'Liked'
                                }
                            </span>
                        </span>
            }
        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    loginMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(LikePostButton)));