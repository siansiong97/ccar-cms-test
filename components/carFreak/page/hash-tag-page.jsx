
import { Col, Empty, Form, message, Row, Icon } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { withRouter } from 'next/dist/client/router';
import client from '../../../feathers';
import LayoutV2 from '../../Layout-V2';
import { formatNumber, isValidNumber, arrayLengthCount } from '../../profile/common-function';
import PostCollapse from '../components/post-collapse';
import { carFreakGlobalSearch } from '../config';
import WritePostModal1 from '../components/write-post-modal-1';
import WriteEventModal from '../components/write-event-modal';
import WindowScrollLoadWrapper from '../../commonComponent/window-scroll-load-wrapper';

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


const PAGE_SIZE = 12;

const tabs = [
    {
        text: 'CarFreaks',
        value: 'carfreaks',
    },
    {
        text: 'Social Board',
        value: 'socialboard',
    },
    // {
    //     text: 'Event',
    //     value: 'event',
    // }
]

const HashTagPage = (props) => {

    const [tabKey, setTabKey] = useState('carfreaks');

    const [hashTag, setHashTag] = useState({});
    const [hashTagTotal, setHashTagTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [posts, setPosts] = useState([]);
    const [postPage, setPostPage] = useState(1);
    const [postTotal, setPostTotal] = useState(0);

    const [writePostVisible, setWritePostVisible] = useState(false);
    const [writePostEditMode, setWritePostEditMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});

    const [writeEventVisible, setWriteEventVisible] = useState(false);
    const [eventEditMode, setEventEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});

    useEffect(() => {
        if (postPage == 1) {
            getData();
        } else {
            setPostPage(1);
        }
    }, [props.match.params.id, tabKey])

    useEffect(() => {
        getData((postPage - 1) * PAGE_SIZE);
    }, [postPage])

    useEffect(() => {
        client.service('hashtaggroup').find({
            query: {
                hashTagId: props.match.params.id,
                $limit: 1,
                $populate: [
                    {
                        path: 'hashTagId',
                        ref: 'hashtag',
                    },
                ],
            }
        }).then(res => {
            setHashTag(_.get(res, ['data', 0, 'hashTagId']) || {})
            setHashTagTotal(_.get(res, ['total']) || 0)
        }).catch(err => {
            console.log(err);
        });
    }, [props.match.params.id])

    function getData(skip) {

        if (props.match.params.id) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }


            let query = {
                hashTagId: props.match.params.id,
                type: 'chat',
                'chat.chatType': tabKey,
                $limit: PAGE_SIZE,
                $skip: skip,
            }

            if (tabKey == 'event') {
                // query = {
                //     ...query,
                //     $populate: [
                //         {
                //             path: 'chatId',
                //             ref: 'chats',
                //             populate: [
                //                 {
                //                     path: 'userId',
                //                     ref: 'users'
                //                 },
                //             ]
                //         },
                //     ],
                // }
            } else {
                query = {
                    ...query,
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
                }
            }

            setIsLoading(true);
            client.service('hashtaggroup').find({
                query: {
                    ...query,
                }
            }).then(res => {
                setIsLoading(false);
                let newData = [];
                newData = _.cloneDeep(posts);
                if (postPage > 1) {
                    newData = newData.concat(_.map(res.data, 'chatId'))
                } else {
                    newData = _.map(res.data, 'chatId');
                }
                setPosts(_.compact(newData));
                setPostTotal(res.total);

            }).catch(err => {
                setIsLoading(false);
                message.error(err.message)
            });
        }
    }

    function confirmDelete(v) {
        if (v._id) {
            client.service('chats')
                .remove(v._id).then((res) => {
                    message.success('Record Deleted')

                    let newPosts = _.filter(_.cloneDeep(posts), function (item) {
                        return item._id != _.get(res, ['_id']);
                    });

                    setPosts(newPosts || []);
                }).catch((err) => {
                    console.log('Unable to delete Chat.');
                })
        }
    }

    return (
        <React.Fragment>
            <LayoutV2 backgroundImage={`url("/banner/1 – 1.png")`} searchTypes={carFreakGlobalSearch} enterSearchCarFreaks >
                <div className="section">
                    <div className="container">
                        <Row gutter={[0, 20]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="font-weight-bold black h4">
                                    {_.get(hashTag, ['tag']) || ''}
                                </div>
                                <div className="h6 black" >
                                    {formatNumber(hashTagTotal, 'auto', true, 0, true)} people discussing on this hashtag.
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="flex-items-align-center h4 font-weight-bold black">
                                    {
                                        _.map(tabs, function (tab) {
                                            return <span className={`${tabKey === tab.value ? 'yellow border-bottom-yellow' : 'black '} subtitle1 margin-right-lg cursor-pointer`} onClick={(e) => { setTabKey(tab.value) }} >
                                                {tab.text}
                                            </span>
                                        })
                                    }
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <WindowScrollLoadWrapper scrollRange={document.body.scrollRange * 0.5} onScrolledBottom={() => {
                                    if (arrayLengthCount(posts) < postTotal) {
                                        setPostPage(postPage + 1);
                                    }
                                }}>
                                    {
                                        tabKey == tabs[0].value || tabKey == tabs[1].value ?
                                            _.isArray(posts) && !_.isEmpty(posts) ?
                                                <Row gutter={[0, 20]}>
                                                    {
                                                        _.map(posts, function (post) {
                                                            return (
                                                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                                    <PostCollapse data={post} className="background-white"
                                                                        onEditClick={(data) => {
                                                                            if (_.isPlainObject(data) && !_.isEmpty(data)) {
                                                                                setWritePostEditMode(true);
                                                                                setSelectedPost(data);
                                                                                setWritePostVisible(true);
                                                                            }
                                                                        }}

                                                                        onRemoveClick={(data) => {
                                                                            confirmDelete(data)
                                                                        }}
                                                                    />
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                                :
                                                <Empty description={isLoading ? 'Getting Result' : 'No Result'}></Empty>
                                            :
                                            null
                                    }
                                </WindowScrollLoadWrapper>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="flex-justify-center flex-items-align-center" style={{ height: 30 }}>
                                    {
                                        isLoading ?
                                            <Icon type="loading" style={{ fontSize: 30 }} />
                                            :
                                            null
                                    }
                                </div>
                            </Col>

                        </Row>
                    </div>
                </div>
            </LayoutV2>

            <WritePostModal1
                visible={writePostVisible}
                editMode={writePostEditMode}
                onCancel={() => {
                    setWritePostVisible(false);
                }}
                data={selectedPost}
                notify
                onUpdatePost={(data) => {
                    if (_.isPlainObject(data) && !_.isEmpty(data)) {
                        console.log(data);
                        console.log(posts);
                        let newPosts = _.map(posts, function (item) {
                            return item._id == _.get(data, ['_id']) ? data : item;
                        });
                        setPosts(newPosts);
                    }
                }}
            >

            </WritePostModal1>

            <WriteEventModal
                visible={writeEventVisible}
                editMode={eventEditMode}
                data={_.get(selectedPost, ['eventId']) || {}}
                onCancel={() => {
                    setSelectedEvent({});
                    setEventEditMode(false);
                    setWriteEventVisible(false);
                }}
                type="club"
                clubId={_.get(selectedPost, ['eventId', 'clubId', '_id'])}
                creator={_.get(selectedPost, ['eventId', 'clubId'])}
                notify
                onUpdate={(event) => {
                    if (_.isPlainObject(event) && !_.isEmpty(event)) {
                    }
                }}
            ></WriteEventModal>
        </React.Fragment>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes,
    carFreak: state.carFreak,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(HashTagPage)));