
import { Col, Empty, Row, Form, message, Button, Icon } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../profile/common-function';
import TrendingSocialBoardBox from './trending-social-board-box';
import UserAvatar from './user-avatar';
import SocialBoardCard from './social-board-card';
import { withRouter } from 'next/dist/client/router';
import WritePostModal from './write-post-modal';
import client from '../../../feathers';






const SocialBoardBox = (props) => {

    const [posts, setPosts] = useState([])
    const [writeModalVisible, setWriteModalVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState({})
    const [editMode, setEditMode] = useState()

    useEffect(() => {

        if (_.isArray(props.data) && !_.isEmpty(props.data)) {
            setPosts(props.data);
        } else {
            setPosts({});
        }
    }, [props.data])


    function redirectToSocialBoard(post) {
        if (props.redirectToSocialBoard) {
            props.redirectToSocialBoard(post)
        }
    }

    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted')
                    if (props.onRemovePost) {
                        props.onRemovePost(v)
                    }
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }

    }
    return (
        <React.Fragment> {
            <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                    <div className="flex-justify-end flex-items-align-center margin-bottom-lg">
                        <span className='d-inline-block margin-right-md' >
                            <Button size="large" className="border-ccar-yellow" onClick={(e) => {
                                setEditMode(null);
                                setWriteModalVisible(true);
                                setSelectedPost(null);
                            }}  ><Icon type="edit" /> Write a Post</Button>
                        </span>
                    </div>
                    {
                        _.isArray(posts) && notEmptyLength(posts) ?
                            <Row gutter={[10, 10]} justify="center">
                                {
                                    posts.map(function (post, i) {
                                        return (
                                            <Col key={'chats' + i} className="gutter-row"
                                                xs={24} sm={24} md={12} lg={12} xl={12}
                                            >
                                                <SocialBoardCard data={post}
                                                    onRedirectToPost={(data) => {
                                                        if (_.isPlainObject(data) && !_.isEmpty(data) && _.get(data, ['_id'])) {
                                                            props.router.push(`/social-board/${data._id}`, undefined ,{shallow :true})
                                                        }
                                                    }}
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
                                        )
                                    })

                                }
                            </Row>
                            :
                            <div className="width-100 flex-items-align-center flex-justify-center background-white" style={{ height: 400 }}>
                                <Empty />
                            </div>
                    }
                </Col>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <TrendingSocialBoardBox redirectToSocialBoard={(data) => {
                        redirectToSocialBoard(data)
                    }} />
                </Col>
            </Row>
        }

            <WritePostModal
                currentRecord={selectedPost}
                editMode={editMode}
                hideImage
                chatType={'socialboard'}
                visibleMode={writeModalVisible}
                onUpdatePost={(data) => {
                    if (props.onChangePost) {
                        props.onChangePost(data);
                    }
                }}
                onCreatePost={(data) => {
                    if (props.onCreatePost) {
                        props.onCreatePost(data);
                    }
                }}
                changeVisibleMode={(v) => {
                    setWriteModalVisible(v);
                    if (!v) {
                        setSelectedPost({});
                    }
                }} />

        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialBoardBox)));