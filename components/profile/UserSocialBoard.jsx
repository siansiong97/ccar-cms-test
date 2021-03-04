import { Button, Col, Empty, Form, Icon, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import SocialBoardCard from '../carFreak/components/social-board-card';
import WritePostModal from '../carFreak/components/write-post-modal';
import { arrayLengthCount, notEmptyLength } from '../../common-function';
import WindowScrollLoadWrapper from '../general/WindowScrollLoadWrapper';
import { loading } from '../../redux/actions/app-actions';
import { withRouter } from 'next/router';
import InfiniteScrollWrapper from '../general/InfiniteScrollWrapper';



var moment = require('moment');

const POSTSIZE = 11;
const UserSocialBoard = (props) => {

    const [profile, setProfile] = useState({})
    const [posts, setPosts] = useState([]);
    const [postTotal, setPostTotal] = useState(0);
    const [postPage, setPostPage] = useState(1);
    const [postLoading, setPostLoading] = useState(false);


    const [editMode, setEditMode] = useState()
    const [writeModalVisible, setWriteModalVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState({})

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

    useEffect(() => { 
    
    } , [posts, postLoading, postTotal])

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
                    chatType: 'socialboard',
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
                }
                setPostTotal(res.total)
            }).catch(err => {
                setPostLoading(false);
                message.error(err.message)
            });
        }
    }

    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted')
                    handleRemoveSocialBoardPost(v)
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }

    }

    function handleSocialBoardPostChange(post) {
        let newPosts = _.map(posts, function (chat) {
            return chat._id == _.get(post, ['_id']) ? post : chat;
        });

        setPosts(newPosts);
    }

    function handleSocialBoardAddPost(post) {
        if (_.isPlainObject(post) && !_.isEmpty(post)) {
            let newPosts = _.concat([post], posts)
            setPosts(newPosts);
        }
    }

    function handleRemoveSocialBoardPost(post) {
        let newPosts = _.filter(posts, function (chat) {
            return chat._id != _.get(post, ['_id']);
        });

        setPosts(newPosts);
    }

    return (
        <Row className={`${props.className || ''}`}>
            {
                _.get(props.user, ['info', 'user', '_id']) && _.get(props.user, ['info', 'user', '_id']) == _.get(profile, ['_id']) ?
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="flex-justify-end flex-items-align-center">
                            <span className='d-inline-block margin-right-md' >
                                <Button size="large" className="border-ccar-yellow" onClick={(e) => {
                                    setEditMode(null);
                                    setWriteModalVisible(true);
                                    setSelectedPost(null);
                                }}  ><Icon type="edit" /> Write a Post</Button>
                            </span>
                        </div>
                    </Col>
                    :
                    null
            }

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <InfiniteScrollWrapper
                    onScrolledBottom={() => {
                        if (arrayLengthCount(posts) < postTotal) {
                            setPostPage(postPage + 1);
                        }
                    }}
                    hasMore={!postLoading && arrayLengthCount(posts) < postTotal}
                >
                    {
                        _.isArray(posts) && !_.isEmpty(posts) ?
                            <Row gutter={[10, 20]} className="padding-md">
                                {
                                    _.map(posts, function (post) {
                                        return <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <SocialBoardCard data={post} redirectPost
                                                onEditClick={(post) => {
                                                    setWriteModalVisible(true);
                                                    setSelectedPost(post);
                                                    setEditMode('edit');
                                                }}

                                                onRemoveClick={(post) => {
                                                    confirmDelete(post)
                                                }}
                                            />
                                        </Col>

                                    })
                                }
                            </Row>
                            :
                            <Empty></Empty>
                    }
                </InfiniteScrollWrapper>
            </Col>

            <WritePostModal
                currentRecord={selectedPost}
                editMode={editMode}
                hideImage
                chatType={'socialboard'}
                visibleMode={writeModalVisible}
                onUpdatePost={(data) => {
                    handleSocialBoardPostChange(data)
                }}
                onCreatePost={(data) => {
                    handleSocialBoardAddPost(data)
                }}
                changeVisibleMode={(v) => {
                    setWriteModalVisible(v);
                    if (!v) {
                        setSelectedPost({});
                    }
                }} />
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
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserSocialBoard)));