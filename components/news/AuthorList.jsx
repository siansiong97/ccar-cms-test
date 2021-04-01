import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Icon, Input, message, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import client from '../../feathers';
import { isValidNumber, notEmptyLength, viewPort } from '../../common-function';
import UserAvatar from '../general/UserAvatar';
import { withRouter } from 'next/router';


const itemCol = {
    xs: 6,
    sm: 6,
    md: 4,
    lg: 2,
    xl: 2,
    xxl: 2,

}

const AUTHOR_LIMIT = 40;

const AuthorList = (props) => {

    const [authors, setAuthors] = useState([])
    const [defaultAuthors, setDefaultAuthors] = useState([])
    const [showMore, setShowMore] = useState(false);
    const [overSize, setOverSize] = useState(false);
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        if (_.isArray(props.authors)) {
            setDefaultAuthors(props.authors);
        } else {
            getDefaultAuthors();
        }
    }, [props.authors])


    useEffect(() => {
        window.addEventListener("resize", itemResizeToViewPortSize);
        return () => window.removeEventListener("resize", itemResizeToViewPortSize);
    }, [defaultAuthors, showMore, searchWord])

    useEffect(() => {
        itemResizeToViewPortSize();
    }, [defaultAuthors, showMore, searchWord])


    function getDefaultAuthors() {
        axios.get(`${client.io.io.uri}getAuthorList`, {
            params: {
                limit: AUTHOR_LIMIT,
            }
        }).then(res => {

            if (notEmptyLength(res.data.data)) {
                setDefaultAuthors(res.data.data);
            } else {
                setDefaultAuthors([]);
            }
        }).catch(err => {
            message.error(err.message)
        });
    }


    function getWindowDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let view;
        let keys = Object.keys(viewPort);
        _.forEach(keys, function (key, index) {
            if (width < viewPort[key]) {
                if (index == 0) {
                    view = keys[0];
                    return false;
                } else {
                    view = keys[index - 1];
                    return false;
                }
            } else {
                view = keys[index]
            }
        })
        return {
            width,
            height,
            viewPort: view,
        };
    }

    function filterSearchWord(authors) {
        if (_.isArray(authors) && notEmptyLength(authors) && searchWord != null) {
            try {
                let newData = _.filter(authors, function (item) {
                    if (!item.name) {
                        item.name = `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`
                    }
                    let regex = new RegExp(`^${searchWord}`, 'i');
                    return regex.test(item.name);
                })
                return newData;
            } catch {
                return [];
            }
        } else {
            return authors;
        }
    }

    function itemResizeToViewPortSize() {
        if (notEmptyLength(defaultAuthors)) {
            if (showMore) {
                setAuthors(filterSearchWord(defaultAuthors))
            } else {
                let windowDimension = getWindowDimensions();
                let itemLength = 0;
                if (!props[windowDimension.viewPort]) {
                    itemLength = itemCol[windowDimension.viewPort];
                } else {
                    if (isValidNumber(props[windowDimension.viewPort])) {
                        itemLength = props[windowDimension.viewPort];
                    } else if (_.isPlainObject(props[windowDimension.viewPort]) && isValidNumber(props[windowDimension.viewPort].span)) {
                        itemLength = props[windowDimension.viewPort].span;
                    }
                }

                let newData = filterSearchWord(defaultAuthors)
                newData = _.slice(newData, 0, 24 / itemLength)

                setAuthors(newData);
                if (defaultAuthors > newData) {
                    setOverSize(true);
                }

            }
        } else {
            setAuthors([]);
        }
    }

    function handleOnClick(author) {
        if (props.onClick) {
            props.onClick(author);
        }
    }
    return (
        <React.Fragment>
            <div id="author-list-container" className={`width-100 ${props.className ? props.className : ''}`} style={{ ...props.style }}>

                {
                    props.allowSearch != null || props.allowSearch == true ?
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className='width-30 round-border-big thin-border padding-x-sm padding-y-xs margin-bottom-lg'>
                                <Input placeholder="Search" className='no-border-input' size="small" compact suffix={<Icon type="search" />} onChange={(e) => { setSearchWord(e.target.value) }} ></Input>
                            </div>
                        </Col>
                        :
                        null

                }
                <Scrollbars style={{ height: showMore ? 120 : 'auto', }} autoHide autoHeight={!showMore}>
                    <div className="width-100 padding-x-xs">
                        <Row gutter={props.gutter ? props.gutter : [10, 20]} type="flex" align="middle" justify="start">
                            {
                                _.isArray(authors) && notEmptyLength(authors) ?
                                    _.map(authors, function (author) {
                                        return (
                                            <Col xs={props.xs ? props.xs : itemCol.xs} sm={props.sm ? props.sm : itemCol.sm} md={props.md ? props.md : itemCol.md} lg={props.lg ? props.lg : itemCol.lg} xl={props.xl ? props.xl : itemCol.xl} xxl={props.xxl ? props.xxl : itemCol.xxl}>
                                                <span style={{ textAlign: 'center' }} className={`relative-wrapper d-inline-block cursor-pointer`} onClick={(e) => {
                                                    handleOnClick(author)
                                                }}>
                                                    <UserAvatar
                                                        showTooltip
                                                        size={isValidNumber(props.size) ? props.size : 80}
                                                        showName={!props.showName || props.showName == false ? false : true}
                                                        textClassName={`text-truncate margin-top-md ${props.textClassName ? props.textClassName : ''} ${!props.selectedAuthor || props.selectedAuthor._id != author._id ? '' : 'ccar-yellow underline'}`}
                                                        avatarClassName={`${props.avatarClassName ? props.avatarClassName : ''} `}
                                                        data={{ avatar: author.avatar || author.thumbnailUrl, name: author.name }} />
                                                </span>
                                            </Col>
                                        )
                                    })
                                    :
                                    <div>
                                        <Empty></Empty>
                                    </div>
                            }
                        </Row>
                    </div>
                </Scrollbars>
                {
                    !notEmptyLength(authors) || !overSize ?
                        null
                        :
                        <div className="width-100 flex-items-align-center flex-justify-center margin-top-sm">
                            {
                                showMore ?
                                    <Button type="primary" className='white width-30 round-border-big'
                                        onClick={(e) => {
                                            setShowMore(false);
                                            var elmnt = document.getElementById("author-list-container");
                                            var offset = 80;
                                            var elementPosition = elmnt.offsetTop;
                                            var offsetPosition = elementPosition - offset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: "smooth"
                                            });
                                        }} >
                                        Show Less <UpOutlined className='margin-left-sm' />
                                    </Button>
                                    :
                                    <Button type="primary" className='white width-30 round-border-big'
                                        onClick={(e) => {
                                            setShowMore(true);
                                            var elmnt = document.getElementById("author-list-container");
                                            var offset = 80;
                                            var elementPosition = elmnt.offsetTop;
                                            var offsetPosition = elementPosition - offset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: "smooth"
                                            });
                                        }}>
                                        Show More <DownOutlined className='margin-left-sm' />
                                    </Button>
                            }
                        </div>
                }
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(AuthorList)));