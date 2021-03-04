import { Col, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayLengthCount, notEmptyLength } from '../../common-function';
import client from '../../feathers';
import { loading } from '../../redux/actions/app-actions';
import { updateSellerProfile } from '../../redux/actions/sellerProfile-actions';
import WindowScrollLoadWrapper from '../general/WindowScrollLoadWrapper';
import UserPosts from './userPosts';
import InfiniteScrollWrapper from '../general/InfiniteScrollWrapper';


var moment = require('moment');

const POSTSIZE = 11;
const UserCarFreakPosts = (props) => {

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

    }, [posts, postTotal, postLoading])

    useEffect(() => {
        console.log(postPage);
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
            client.service('chats').find({
                query: {
                    createdBy: _.get(profile, ['_id']),
                    chatType: 'carfreaks',
                    $and: [
                        {
                            parentType: { $ne: 'club' }
                        },
                        {
                            parentType: { $ne: 'clubEvent' }
                        },
                    ],
                    $sort: {
                        createdAt: -1,
                    },
                    $limit: POSTSIZE,
                    $populate: 'userId',
                    $skip: skip,
                }
            }).then(res => {
                setPostLoading(false);
                if (notEmptyLength(res.data)) {
                    setPosts(postPage == 1 ? res.data : posts.concat(res.data));
                    setPostTotal(res.total)
                    getUserChatLikes(_.map(res.data, '_id'), true)
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
                    hasMore={!postLoading && arrayLengthCount(posts) < postTotal}

                >
                    <UserPosts
                        posts={posts}
                        postLikes={postLikes}
                        showAddPostCard={_.get(props.user, ['authenticated']) ? _.get(profile, ['_id']) == _.get(props.user, ['info', 'user', '_id']) : false}
                        onUpdatePost={(data) => {
                            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                let newPosts = _.map(posts, function (post) {
                                    return post._id == data._id ? data : post;
                                })
                                setPosts(newPosts);
                            }
                        }}
                        onCreatePost={(data) => {
                            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                let newPosts = _.concat([data], posts)
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
    updateSellerProfile: updateSellerProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserCarFreakPosts)));