import Carousel from '@brainhubeu/react-carousel';
import { Dropdown, Empty, Form, Icon, Menu, Popconfirm, message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue, getUserName } from '../../profile/common-function';
import UserAvatar from './user-avatar';
import LikePostButton from './like-post-button';
import { loading } from '../../../actions/app-actions';
import moment from 'moment';
import ReportButton from '../../commonComponent/report-button';
import FollowButton from '../../commonComponent/follow-button';
import ShareButtonDialog from '../../commonComponent/share-button-dialog';
import ParseTag from '../../commonComponent/parse-tag';
import PostMenu from './post-menu';

const defaultHeight = 'auto';


const SocialBoardCard = (props) => {

    const [post, setPost] = useState({});
    const [height, setHeight] = useState(defaultHeight);


    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setPost(props.data);
        } else {
            setPost({});
        }

    }, [props.data])

    useEffect(() => {
        if (!props.style || !isValidNumber(props.style.height) || !(parseFloat(props.style.height) >= defaultHeight)) {
            setHeight(defaultHeight);
        } else {
            setHeight(props.style.height);
        }

    }, [props.style])

    function redirectToPost(post) {
        if (props.onRedirectToPost) {
            props.onRedirectToPost(post)
        }

        if (props.redirectPost && _.isPlainObject(post) && !_.isEmpty(post)) {
            props.router.push(`/social-board/${_.get(post, ['_id'])}`);
        }
    }

    return (
        notEmptyLength(objectRemoveEmptyValue(post)) ?
            <React.Fragment>
                <div className={` thin-border box-shadow-heavy round-border background-white flex-items-align-start flex-justify-start padding-md cursor-pointer ${props.className ? props.className : ''}`} style={{ ...props.style, height: height }} onClick={(e) => {
                    redirectToPost(post)
                }}>
                    <span className='d-inline-block margin-right-md' >
                        <UserAvatar redirectProfile size={50} data={_.get(post, ['userId'])} />
                    </span>
                    <span className='d-inline-block width-70' >
                        <div className="width-100">
                            <ParseTag data={_.get(post, ['title']) || ''} className="subtitle1 font-weight-bold text-truncate" />
                        </div>
                        <div className="flex-justify-start flex-items-align-center headline text-truncate">
                            <span className="black" >
                                {getUserName(_.get(post, ['userId']), 'freakId')}
                            </span>
                            {
                                _.get(post, ['location']) ?
                                    <React.Fragment>
                                        <span className="grey">
                                            in
                                        </span>
                                        <span className="black">
                                            {`${_.get(post, ['location']) || ''}`}
                                        </span>
                                    </React.Fragment>
                                    :
                                    null
                            }
                        </div>
                        <div className="flex-justify-space-between flex-items-align-center text-truncate">
                            <span className='d-inline-block' >
                                {moment(_.get(post, ['createdAt']) || null).format('MMM Do')} | {moment(_.get(post, ['createdAt']) || null).fromNow()}
                            </span>
                        </div>
                    </span>
                </div>
                <span className='d-inline-block' style={{ position: 'absolute', top: 30, right: 20 }} >
                    <PostMenu post={post}
                        onEditPostClick={() => {
                            if (props.onEditClick) {
                                props.onEditClick(post)
                            }
                        }}
                        onRemovePostClick={() => {
                            if (props.onRemoveClick) {
                                props.onRemoveClick(post);
                            }
                        }}
                    />
                </span>
            </React.Fragment>
            :
            null
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialBoardCard)));