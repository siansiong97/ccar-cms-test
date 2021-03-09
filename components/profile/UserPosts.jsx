import { Col, Empty, Form, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayLengthCount, notEmptyLength } from '../../common-function';
import {
    loading,
    loginMode, updateActiveMenu
} from '../../redux/actions/app-actions';
import PostModal from '../carFreak/components/post-modal';
import WritePostModal from '../carFreak/components/write-post-modal';
import UserPost from './UserPost';


var moment = require('moment');


const defaultHeight = 200;

const UserPosts = (props) => {

    const [posts, setPosts] = useState([]);
    const [postLikes, setPostLikes] = useState([]);
    const [writePostVisible, setWritePostVisible] = useState(false);
    const [postVisible, setPostVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});

    useEffect(() => {

        if (_.isArray(props.posts) && notEmptyLength(props.posts)) {
            setPosts(props.posts)
        } else {
            setPosts([]);
        }

    }, [props.posts])

    useEffect(() => {

        if (_.isArray(props.postLikes) && notEmptyLength(props.postLikes)) {
            setPostLikes(props.postLikes)
        } else {
            setPostLikes([]);
        }
    }, [props.postLikes])

    return (
        <React.Fragment>
            <Row type='flex' gutter={props.gutter ? props.gutter : [10, 10]}>
                {
                    props.showAddPostCard ?
                        <Col xs={props.xs ? props.xs : 24} sm={props.sm ? props.sm : 24} md={props.md ? props.md : 12} lg={props.lg ? props.lg : 6} xl={props.xl ? props.xl : 6}>
                            <div className="width-100 background-white relative-wrapper cursor-pointer" style={{ height: defaultHeight, position: 'relative' }} onClick={(e) => { setWritePostVisible(true) }}>
                                <img src="/assets/upload_photo.png" style={{ width: defaultHeight * 0.5, height: defaultHeight * 0.5 }} className='absolute-center' />
                                <div className="flex-justify-center flex-items-align-center subtitle1 absolute-center" style={{ paddingTop: defaultHeight * 0.5 + 30 }}>
                                    POST / UPLOAD PHOTO
                                </div>
                            </div>
                        </Col>
                        :
                        null
                }
                {
                    posts.map(function (post, i) {
                        return (
                            <Col key={'colPost' + i} xs={props.xs ? props.xs : 24} sm={props.sm ? props.sm : 24} md={props.md ? props.md : 12} lg={props.lg ? props.lg : 6} xl={props.xl ? props.xl : 6}>
                                <UserPost height={defaultHeight} post={post} onClick={(post) => { setSelectedPost(post); setPostVisible(true); }} />
                            </Col>
                        )
                    })
                }
                {
                    !props.showAddPostCard && arrayLengthCount(posts) <= 0 ?
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="width-100" style={{ height: 400 }}>
                                <Empty></Empty>
                            </div>
                        </Col>
                        :
                        null
                }
            </Row>
            <WritePostModal
                visibleMode={writePostVisible}
                changeVisibleMode={(e) => { setWritePostVisible(e) }}
                chatType={'carfreaks'}
                onCreatePost={(data) => {
                    if (props.onCreatePost) {
                        props.onCreatePost(data)
                    }
                }}
            ></WritePostModal>
            <PostModal
                postLike={_.find(postLikes, { chatId: selectedPost._id })}
                onPostLikeChange={(liked, data) => {
                    let newPostLikes = postLikes;
                    if (liked) {
                        newPostLikes = _.concat(newPostLikes, [data]);
                    } else {
                        newPostLikes = _.filter(newPostLikes, function (like) {
                            return _.get(like, ['chatId']) != _.get(data, ['chatId']);
                        })
                    }

                    if (props.onUpdatePostLikes) {
                        props.onUpdatePostLikes(newPostLikes);
                    }
                }}
                visibleMode={postVisible}
                changeVisibleMode={(e) => { setPostVisible(e); setSelectedPost({}) }}
                chatInfo={_.isPlainObject(selectedPost) && !_.isEmpty(selectedPost) ? selectedPost : {}}
                onUpdatePost={(data) => {
                    if (props.onUpdatePost) {
                        props.onUpdatePost(data);
                    }
                }}
            />
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    sellCars: state.sellCars,
    productsList: state.productsList,
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});


const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    loading: loading,
    loginMode: loginMode,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(UserPosts)));