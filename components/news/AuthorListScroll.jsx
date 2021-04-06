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

const AuthorListScroll = (props) => {

    const [authors, setAuthors] = useState([])
    const [defaultAuthors, setDefaultAuthors] = useState([])
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        if (_.isArray(props.authors)) {
            setDefaultAuthors(props.authors);
        } else {
            getDefaultAuthors();
        }
    }, [props.authors])

    useEffect(() => {

        setAuthors(filterSearchWord(defaultAuthors));

    }, [searchWord, defaultAuthors])



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


    function filterSearchWord(authors) {
        if (_.isArray(authors) && notEmptyLength(authors) && searchWord != null) {
            try {
                let newData = _.filter(authors, function (item) {
                    if (!item.name) {
                        item.name = `${item.firstName || ''} ${item.lastName || ''}`
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
                <Scrollbars autoHide autoHeight>
                    <div className="width-100 padding-x-md flex-items-align-center">
                        {
                            _.isArray(authors) && notEmptyLength(authors) ?
                                _.map(authors, function (author) {
                                    return (
                                        <span style={{ textAlign: 'center' }} className={`relative-wrapper d-inline-block cursor-pointer margin-right-xl`} onClick={(e) => {
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
                                    )
                                })
                                :
                                <div>
                                    <Empty></Empty>
                                </div>
                        }
                    </div>
                </Scrollbars>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(AuthorListScroll)));