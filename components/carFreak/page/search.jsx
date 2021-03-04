
import { Input, Row, Col, Divider, Button, message, Empty, Icon } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import LayoutV2 from '../../Layout-V2';
import client from '../../../feathers';
import axios from "axios";
import _, { set } from "lodash"
import { carFreakGlobalSearch } from '../config';
import WritePostModal1 from '../components/write-post-modal-1';
import { isValidNumber, formatNumber, arrayLengthCount } from '../../profile/common-function';
import WindowScrollLoadWrapper from '../../commonComponent/window-scroll-load-wrapper';
import PostCollapse from '../components/post-collapse';

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

const SearchIndex = (props) => {

    const [searchText, setSearchText] = useState('');
    const [tabKey, setTabKey] = useState('carfreaks');
    const [isLoading, setIsLoading] = useState(false);

    const [posts, setPosts] = useState([]);
    const [postPage, setPostPage] = useState(1);
    const [postTotal, setPostTotal] = useState(0);

    const [writePostVisible, setWritePostVisible] = useState(false);
    const [writePostEditMode, setWritePostEditMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});




    const timeoutRef = useRef(null);


    useEffect(() => {
        let search = props.match.params.matchStr;
        setSearchText(search);
    }, [])

    useEffect(() => {
        getData(0)
    }, [searchText])


    useEffect(() => {
        if (postPage == 1) {
            getData();
        } else {
            setPostPage(1);
        }
    }, [props.match.params.matchStr, tabKey])

    useEffect(() => {
        getData((postPage - 1) * PAGE_SIZE);
    }, [postPage])

    function getData(skip) {

        if (searchText) {

            if (!isValidNumber(parseInt(skip))) {
                skip = 0;
            } else {
                skip = parseInt(skip);
            }


            let query = {
                orRegex: {
                    title: searchText,
                },
                'chatType': tabKey,
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
                            path: 'userId',
                            ref: 'users'
                        },
                    ],
                }
            }

            console.log(query);
            setIsLoading(true);
            client.service('chats').find({
                query: {
                    ...query,
                }
            }).then(res => {
                console.log('res');
                console.log(res);
                setIsLoading(false);
                let newData = [];
                newData = _.cloneDeep(posts);
                if (postPage > 1) {
                    newData = newData.concat(res.data)
                } else {
                    newData = res.data;
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
        <LayoutV2 backgroundImage={`url("/banner/1 – 1.png")`} searchTypes={carFreakGlobalSearch} enterSearchCarFreaks >
            <div className="section">
                <div className="container">
                    <Row gutter={[0, 20]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="font-weight-bold black h4">
                                Search {searchText || 'N/A'}
                            </div>
                            <div className="h6 black" >
                                {formatNumber(postTotal, 'auto', true, 0, true)} posts found.
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
        </LayoutV2 >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchIndex);