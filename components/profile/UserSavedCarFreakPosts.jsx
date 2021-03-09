import { Col, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import UserPosts from './UserPosts';
import { arrayLengthCount, notEmptyLength } from '../../common-function';
import WindowScrollLoadWrapper from '../general/WindowScrollLoadWrapper';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import { updateSellerProfile } from '../../redux/actions/sellerProfile-actions';
import { withRouter } from 'next/router';
import InfiniteScrollWrapper from '../general/InfiniteScrollWrapper';



var moment = require('moment');

const POSTSIZE = 11;
const UserSavedCarFreakPosts = (props) => {

    const [profile, setProfile] = useState({})
    const [postLikes, setPostLikes] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postTotal, setPostTotal] = useState(0);
    const [postPage, setPostPage] = useState(1);
    const [postLoading, setPostLoading] = useState(false);


    useEffect(() => {
        getUserChatLikes(_.map(posts, '_id'))
    }, [props.user.authenticated])


    useEffect(() => {
        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setProfile(props.data);
        } else {
            setProfile({});
        }
    }, [props.data])


    useEffect(() => {
        if (_.get(profile, ['_id'])) {
            if (postPage == 1) {
                getPosts(0)
            } else {
                setPostPage(1);
            }
        } else {
            setPosts([])
            setPostTotal(0);
            setPostPage(1);
        }
    }, [profile])

    useEffect(() => {
        getPosts((postPage - 1) * POSTSIZE);
    }, [postPage])

    function getPosts(skip) {
        if (_.get(profile, ['_id'])) {
            if (_.isNumber(skip)) {
                skip = parseInt(skip)
            } else {
                skip = 0;
            }
            setPostLoading(true);
            client.service('savedpost').find({
                query: {
                    userId: _.get(profile, ['_id']),
                    chatType: 'carfreaks',
                    $sort: {
                        createdAt: -1,
                    },
                    $limit: POSTSIZE,
                    $populate: [
                        {
                            path: 'chatId',
                            ref: 'chats',
                            populate: [
                                {
                                    path: 'userId',
                                    ref: 'users'
                                },
                            ]
                        },
                    ],
                    $skip: skip,
                }
            }).then(res => {
                setPostLoading(false);
                if (notEmptyLength(res.data)) {
                    setPosts(postPage == 1 ? _.map(res.data, 'chatId') : posts.concat(_.map(res.data, 'chatId')));
                    setPostTotal(res.total)
                    getUserChatLikes(_.map(res.data, 'chatId._id'), true)
                } else {
                    setPosts([]);
                    setPostTotal(0);
                }
            }).catch(err => {
                setPostLoading(false);
                message.error(err.message)
            });
        }
    }

    function getUserChatLikes(ids, concat) {

        if (_.isArray(ids) && !_.isEmpty(ids) && _.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id'])) {
            client.service('chatlikes')
                .find({
                    query: {
                        chatId: {
                            $in: ids || [],
                        },
                        userId: _.get(props.user, ['info', 'user', '_id'])
                    }
                })
                .then((res) => {
                    setPostLikes(concat ? _.concat(postLikes, res.data) : res.data)
                })
        }
    }

    return (
        <Row className='margin-top-md'>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <InfiniteScrollWrapper
                    onScrolledBottom={() => {
                        if (arrayLengthCount(posts) < postTotal && !postLoading) {
                            setPostPage(postPage + 1);
                        }
                    }}
                    hasMore={!postLoading && arrayLengthCount(posts) < postTotal }
                >
                    <UserPosts
                        posts={posts}
                        showAddPostCard={false}
                        postLikes={postLikes}
                        onUpdatePost={(data) => {
                            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                let newPosts = _.map(posts, function (post) {
                                    return post._id == data._id ? data : post;
                                })
                                setPosts(newPosts);
                            }
                        }}
                        onUpdatePostLikes={(data) => {
                            if (_.isArray(data) && !_.isEmpty(data)) {
                                setPostLikes(data);
                            }
                        }}
                    />
                </InfiniteScrollWrapper>
            </Col>
        </Row>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
    updateSellerProfile: updateSellerProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserSavedCarFreakPosts)));