import { Empty, Form } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { calendarIcon, carFreakLikeGreyIcon, carFreakLikeIcon } from '../../../icon';
import { commentIcon } from '../../live/config';
import ClubAvatar from './club/club-avatar';
import LikePostButton from './like-post-button';
import PostMenu from './post-menu';
import { withRouter } from 'next/router';
import ParseTag from '../../general/ParseTag';
import UserAvatar from '../../general/UserAvatar';
import { formatNumber, getPlural, isValidNumber, notEmptyLength, objectRemoveEmptyValue } from '../../../common-function';
import { loading } from '../../../redux/actions/app-actions';


const defaultHeight = 450;
const headerHeight = 100;
const imageHeight = 200;
const titleHeight = 40;
const footerHeight = 100;
const actionHeight = 40;


const Post = (props) => {

    const [post, setPost] = useState({});
    const [chatType, setChatType] = useState('carfreaks');
    const [postLike, setPostLike] = useState({});
    const [totalLike, setTotalLike] = useState(0);
    const [height, setHeight] = useState(defaultHeight);


    useEffect(() => {

        if (_.isPlainObject(props.data) && !_.isEmpty(props.data)) {
            setPost(props.data);
        } else {
            setPost({});
        }

    }, [props.data])

    useEffect(() => {

        if (_.isPlainObject(props.postLike) && !_.isEmpty(props.postLike)) {
            setPostLike(props.postLike);
        } else {
            setPostLike({});
        }

    }, [props.postLike])

    useEffect(() => {
        setTotalLike(!_.isNaN(parseInt(_.get(post, ['totalLike']))) ? formatNumber(_.get(post, ['totalLike']), null, true, 0, 0) : 0);
        setChatType(_.get(post, ['chatType']))
    }, [post])


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
    }

    function redirectToPost(post) {
        if (props.onRedirectToPost) {
            props.onRedirectToPost(post)
        }
    }

    return (
        notEmptyLength(objectRemoveEmptyValue(props.data)) ?
            <React.Fragment>
                <div className={`${props.className ? props.className : 'thin-border box-shadow-heavy'}`} style={{ ...props.style, height: height }}>
                    <div className="width-100 border-bottom relative-wrapper" style={{ height: headerHeight }}>
                        {
                            props.renderHeader ?
                                props.renderHeader(post)
                                :
                                <div className="fill-parent text-align-center padding-md" >
                                    <span className='d-inline-block relative-wrapper width-100' >
                                        {
                                            _.get(post, ['parentType']) == 'club' || _.get(post, ['parentType']) == 'clubEvent' ?
                                                <ClubAvatar redirectProfile
                                                    data={_.get(post, ['clubId'])}
                                                    size={50}
                                                    showName
                                                    avatarClassName="cursor-pointer"
                                                    style={{ maxWidth : 100 }}
                                                    textClassName="margin-top-sm font-weight-bold grey headline text-truncate cursor-pointer" />
                                                :
                                                <UserAvatar redirectProfile
                                                    data={_.get(post, ['userId'])}
                                                    size={50}
                                                    showName
                                                    renderName={(data) => {
                                                        return <span >
                                                            {`${_.get(data, ['freakId']) || ''}`}
                                                        </span>
                                                    }}
                                                    avatarClassName="cursor-pointer"
                                                    textClassName="margin-top-sm font-weight-bold grey headline text-truncate cursor-pointer"
                                                />
                                        }
                                        {
                                            chatType == 'event' ?
                                                <span className='d-inline-block' style={{ position: 'absolute', top: 30, right: -5 }} >
                                                    <img src={calendarIcon} style={{ height: 25, width: 25 }} />
                                                </span>
                                                :
                                                null
                                        }
                                    </span>
                                </div>
                        }

                        {
                            !props.hideAction ?
                                <span className='d-inline-block' style={{ position: 'absolute', top: 10, right: 10 }} >
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
                                :
                                null
                        }
                    </div>
                    <div className="width-100" style={{ height: imageHeight }}>
                        {
                            props.renderImageSlideShow ?
                                props.renderImageSlideShow(_.isArray(_.get(post, ['mediaList'])) && !_.isEmpty(_.get(post, ['mediaList'])) ? _.get(post, ['mediaList']) : [], post)
                                :
                                chatType == 'event' ?
                                    <div className="relative-wrapper width-100 background-black" style={{ height: imageHeight }} onClick={(e) => {
                                        redirectToPost(post)
                                    }}
                                    >
                                        <img src={_.get(post, ['eventId', 'coverPhoto'])} className="fill-parent img-cover cursor-pointer" />
                                    </div>
                                    :
                                    notEmptyLength(_.get(post, ['mediaList'])) ?
                                        <div className="relative-wrapper width-100 background-black" style={{ height: imageHeight }} onClick={(e) => {
                                            redirectToPost(post)
                                        }}
                                        >
                                            <img src={_.get(post, ['mediaList'])[0].url} className="img-cover fill-parent cursor-pointer" />
                                        </div>
                                        :
                                        <Empty className="fill-parent" />
                        }
                    </div>
                    <div className="width-100" style={{ height: actionHeight }}>
                        {
                            props.renderAction ?
                                props.renderAction(post)
                                :
                                <div className="fill-parent padding-x-md flex-justify-start flex-items-align-center cursor-pointer">
                                    <LikePostButton
                                        chatId={_.get(post, ['_id'])}
                                        likeOn="chat"
                                        postLike={postLike}
                                        onClick={(actived) => {
                                            setTotalLike(actived ? parseInt(totalLike) + 1 : parseInt(totalLike) - 1);
                                        }}
                                        onSuccessUpdate={(liked, data) => {
                                            if (props.onPostLikeChange) {
                                                props.onPostLikeChange(liked, data);
                                            }
                                            if (props.onUpdatePost) {
                                                props.onUpdatePost({ ...post, totalLike: liked ? parseInt(post.totalLike) + 1 : parseInt(post.totalLike) - 1 });
                                            }
                                        }}
                                        activeButton={
                                            <div className="flex-items-align-center">
                                                <img src={carFreakLikeIcon} style={{ width: 35, height: 25 }} className="margin-right-sm cursor-pointer" />
                                                {formatNumber(totalLike, 'auto', true, 0, true) || 0}
                                            </div>
                                        }
                                        className='d-inline-block margin-right-md'>
                                        <div className="flex-items-align-center">
                                            <img src={carFreakLikeGreyIcon} style={{ width: 35, height: 25 }} className="margin-right-sm cursor-pointer" />
                                            {formatNumber(totalLike, 'auto', true, 0, true) || 0}
                                        </div>
                                    </LikePostButton>
                                    <span className='flex-items-align-center cursor-pointer' onClick={(e) => {
                                        redirectToPost(post)
                                    }}  >
                                        <span className='margin-right-sm' >
                                            <img src={commentIcon} style={{ width: 20, height: 20 }} />
                                        </span>
                                        <span className='headline' >
                                            {getPlural('Comment', 'Comments', _.get(post, ['totalReply']) || 0, true)}
                                        </span>
                                    </span>
                                </div>
                        }
                    </div>
                    <div className="width-100" style={{ height: (height - headerHeight - imageHeight - actionHeight) }}>
                        {
                            props.renderTitle ?
                                props.renderTitle(post)
                                :
                                <div className="width-100 flex-justify-start flex-items-align-center padding-x-md pre-wrap" onClick={(e) => {
                                    redirectToPost(post)
                                }}>
                                    <ParseTag data={chatType == 'event' ? _.get(post, ['eventId', 'name']) || '' : _.get(post, ['title']) || ''} className="text-truncate-twoline font-weight-bold headline cursor-pointer width-100" />
                                </div>
                        }  {
                            props.renderContent ?
                                props.renderContent(post)
                                :
                                <div className="width-100 padding-x-md" onClick={(e) => {
                                    redirectToPost(post)
                                }}>
                                    {
                                        chatType == 'event' ?
                                            <span className='d-inline-block cursor-pointer' >
                                                <div className="flex-justify-start flex-items-align-center">
                                                    <span className="red font-weight-thin margin-right-md headline">
                                                        {`${moment(_.get(post, ['eventId', 'startAt'])).format('dddd, YYYY-MM-DD, hh:mm')}`}
                                                    </span>
                                                </div>
                                                <div className="headline text-truncate-twoline blue">
                                                    {_.get(post, ['eventId', 'location'])}
                                                </div>
                                            </span>
                                            :
                                            <ParseTag data={_.get(post, ['content']) || ''} className="text-truncate-threeline headline cursor-pointer width-100 pre-wrap" />
                                    }
                                </div>
                        }
                    </div>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Post)));