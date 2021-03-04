import { Button, Form, message } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loading, loginMode } from '../../../redux/actions/app-actions';
import client from '../../../feathers';



const PinCommentButton = (props) => {

    const [pinnedComments, setPinnedComments] = useState([]);
    const [comment, setComment] = useState({});

    useEffect(() => {

        if (_.isPlainObject(props.comment) && !_.isEmpty(props.comment)) {
            setComment(props.comment);
        } else {
            setComment({});
        }

    }, [props.comment])

    useEffect(() => {

        if (_.isArray(props.pinnedComments) && !_.isEmpty(props.pinnedComments)) {
            setPinnedComments(props.pinnedComments);
        } else {
            setPinnedComments({});
        }

    }, [props.pinnedComments])

    function isPinned(pinnedComments, comment) {

        if (_.isArray(pinnedComments) && !_.isEmpty(pinnedComments) && _.isPlainObject(comment) && !_.isEmpty(comment)) {
            return _.some(pinnedComments, ['_id', comment._id]);
        }
        return false;
    }

    function handlePinComment() {

        if (comment._id && comment.chatId) {
            let data = {
                createdAt: new Date(),
                _id: comment._id,
            }

            client.service('chats').find({
                query: {
                    _id: comment.chatId,
                    $limit: 1,
                }
            }).then(res => {
                let post = _.get(res, ['data', 0]) || {};
                if (post._id) {
                    let pinnedComments = _.get(post, ['pinnedComments']) || [];
                    pinnedComments = _.unionBy(pinnedComments, [data], '_id') || [];
                    client.authenticate().then(res => {
                        client.service('chats').patch(post._id, {
                            pinnedComments
                        }).then(res1 => {

                            res1.userId = res.user;
                            if (props.onUpdatePinComments) {
                                props.onUpdatePinComments(_.get(res1, ['pinnedComments']) || [])
                            }
                            setPinnedComments(_.get(res1, ['pinnedComments']) || []);
                            message.success('Pinned Comment');
                        }).catch(err => {
                            message.error(err.message)
                        });
                    })
                }
            }).catch(err => {
            });


        }
    }


    function handleUnpinComment() {


        if (comment._id && comment.chatId) {
            client.service('chats').find({
                query: {
                    _id: comment.chatId,
                    $limit: 1,
                }
            }).then(res => {
                let post = _.get(res, ['data', 0]) || {};
                if (post._id) {
                    let pinnedComments = _.get(post, ['pinnedComments']) || [];
                    pinnedComments = _.filter(pinnedComments, function (pinnedComment) {
                        return pinnedComment._id != comment._id;
                    }) || [];

                    client.authenticate().then(res => {
                        client.service('chats').patch(post._id, {
                            pinnedComments
                        }).then(res1 => {

                            res1.userId = res.user;
                            if (props.onUpdatePinComments) {
                                props.onUpdatePinComments(_.get(res1, ['pinnedComments']) || [])
                            }
                            message.success('Unpinned Comment');
                        }).catch(err => {
                            message.error(err.message)
                        });
                    })
                }
            }).catch(err => {
            });


        }
    }


    return (
        <React.Fragment>
            {
                isPinned(pinnedComments || [], comment) ?
                    <a onClick={() => props.readOnly ? null : handleUnpinComment()}>
                        {
                            props.unpinButton ?
                                props.unpinButton()
                                :
                                <Button style={{ color: '#F57F17' }}>Unpin Comment</Button>
                        }
                    </a>
                    :
                    <a onClick={() => props.readOnly ? null : handlePinComment()}>
                        {
                            props.pinButton ?
                                props.pinButton()
                                :
                                <Button>Pin Comment</Button>
                        }
                    </a>
            }
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});
const mapDispatchToProps = {
    loginMode: loginMode,
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PinCommentButton)));