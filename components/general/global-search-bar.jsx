import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Form, Input, message } from 'antd';
import axios from "axios";
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { v4 } from 'uuid';
import client from '../../feathers';
import { parseTagStringToPlainString } from '../carFreak/config';
import { notEmptyLength, convertParameterToProductListUrl, formatNumber, arrayLengthCount } from '../../common-function';
import { loading } from '../../redux/actions/app-actions';
import { withRouter } from 'next/router';



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

const { Option, OptGroup } = AutoComplete;
const WORD_LENGTH_TO_START_SEARCH = 2;

const searchBarRef = React.createRef();

const SEARCH_SECTIONS = [
    // {
    //     value: 'carFreak',
    //     text: 'CarFreaks'
    // },
    {
        value: 'socialBoard',
        text: 'Social Board'
    },
    {
        value: 'dealerWithAds',
        text: 'Dealer',
    },
    {
        value: 'people',
        text: 'User',
    },
    {
        value: 'dealer',
        text: 'Dealer',
    },
    {
        value: 'productAds',
        text: 'CarMarket',
    },
    {
        value: 'carspec',
        text: 'All-NewCar',
    },
]

const GlobalSearchBar = (props) => {

    const [searchValue, setSearchValue] = useState(null);
    const [searchWords, setSearchWords] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState();
    const [searchType, setSearchType] = useState();
    const [searchTypes, setSearchTypes] = useState();
    const [isEmptyDataSource, setIsEmptyDataSource] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (props.searchTypes == 'all' || !props.searchTypes) {
            setSearchTypes(SEARCH_SECTIONS);
        } else {
            let availableSections = _.compact(_.map(props.searchTypes, function (item) {
                let selectedSection = _.find(SEARCH_SECTIONS, function (section) {
                    return _.isPlainObject(item) && !_.isEmpty(item) ? _.toLower(item.value) == _.toLower(section.value) : _.toLower(item) == _.toLower(section.value);
                })
                if (!selectedSection) {
                    return null;
                }

                return _.isPlainObject(item) && !_.isEmpty(item) && _.get(item, ['text']) ? item : selectedSection;
            }));
            setSearchTypes(availableSections || [])
        }
    }, [props.searchTypes])


    function handleSearch(value) {

        // value = value.replace(/[\W_]/g, "");
        // value = value.replace(/[^a-zA-Z ]/g, "");
        setDataSource([]);
        setIsEmptyDataSource(true);
        if (!value || value.length < WORD_LENGTH_TO_START_SEARCH) {
            setSearchWords([]);
        } else {
            clearTimeout(typingTimeout);
            setTypingTimeout(setTimeout(() => {
                axios.post(`${client.io.io.uri}globalSearch`, {
                    params: {
                        keywords: value.trim(),
                        filterType: _.map(searchTypes, 'value'),
                    }
                }).then(res => {
                    let dataSource = [];

                    _.forEach(searchTypes, function (v) {
                        if (_.isArray(_.get(res, ['data', 'result', v.value, 'data'])) && !_.isEmpty(_.get(res, ['data', 'result', v.value, 'data']))) {
                            setIsEmptyDataSource(false);
                        }
                        dataSource.push(
                            {
                                title: v.text,
                                children: _.get(res, ['data', 'result', v.value, 'data']) || [],
                                total: _.get(res, ['data', 'result', v.value, 'total']) || 0,
                                value: v.value
                            }
                        )
                    })
                    setDataSource(dataSource);
                    setSearchWords(notEmptyLength(value.split(' ')) ? value.split(' ') : []);
                    setTypingTimeout();
                }).catch(err => {
                    message.error(err.message)
                });
            }, 700)
            )
        }
    };

    const renderTitle = (title, total) => {
        return (
            <span>
                {title}
                <a href="#" style={{ float: 'right' }}>
                    Total: {total}
                </a>
            </span>
        );
    }
    const restructData = (data) => {
        let base = [
            <Option disabled key="all" className="show-all">
                <Desktop>
                    <p>
                        Search Car/Dealer Name
                    </p>
                </Desktop>
                <Tablet>
                    <p>
                        Search Car/Dealer Name
                    </p>
                </Tablet>
                <Mobile>
                    <p>
                        Car/Dealer Name
                    </p>
                </Mobile>
            </Option>
        ];

        if (notEmptyLength(data)) {
            let list = data.map(group => {
                switch (_.get(group, ['value'])) {
                    // case 'carFreak':
                    //     return (
                    //         <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                    //             {
                    //                 _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                    //                     group.children.map((opt, index) => (
                    //                         <Option key={`${group.title}-${index}`} value={parseTagStringToPlainString(`${opt.title || ''} | ${opt.content || ''}`)} onClick={() => {
                    //                             if (_.isPlainObject(opt)) {
                    //                                 if (opt._id) {
                    //                                     props.router.push('/car-freaks/' + opt._id);
                    //                                 }
                    //                             }
                    //                         }}>
                    //                             <Highlighter
                    //                                 style={{ padding: '0px 10px' }}
                    //                                 highlightStyle={{ color: '#ffc069', padding: 0 }}
                    //                                 textToHighlight={parseTagStringToPlainString(`${opt.title || ''} | ${opt.content || ''}`)}
                    //                                 autoEscape={true}
                    //                                 className="overline"
                    //                                 searchWords={searchWords} />
                    //                         </Option>
                    //                     ))
                    //                     :
                    //                     <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                    //                         <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                    //                             {group.title} Not Found
                    //                         </span>
                    //                     </Option>
                    //             }
                    //         </OptGroup>
                    //     )
                    //     break;
                    case 'socialBoard':
                        return (
                            <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`} value={parseTagStringToPlainString(`${opt.title || ''} | ${opt.content || ''}`)} onClick={() => {
                                                if (_.isPlainObject(opt)) {
                                                    if (opt._id) {
                                                        props.router.push('/social-board/' + opt._id);
                                                    }
                                                }
                                            }}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={parseTagStringToPlainString(`${opt.title || ''} | ${opt.content || ''}`)}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                                                {group.title} Not Found
                                                </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                        break;
                    case 'people':

                        return (
                            <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`} value={`${opt.freakId || ''}`} onClick={() => {
                                                if (_.isPlainObject(opt) && !_.isEmpty(opt)) {
                                                    if (opt._id) {
                                                        props.router.push(`/profile/${opt._id}`);
                                                    }
                                                }
                                            }}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={`${opt.freakId || ''}`}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                                                {group.title} Not Found
                                        </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                        break;
                    case 'dealer':

                        return (
                            <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`} value={`${opt.freakId || ''}`} onClick={() => {
                                                if (_.isPlainObject(opt) && !_.isEmpty(opt)) {
                                                    if (opt._id) {
                                                        props.router.push(`/dealer/${opt.companyurlId}/${opt.userurlId}`);
                                                    }
                                                }
                                            }}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={`${opt.freakId || ''}`}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                                                {group.title} Not Found
                                        </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                    case 'productAds':
                        return (
                            <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`} value={`${opt.make ? opt.make : ''} ${opt.model ? opt.model : ''}`} onClick={(e) => {
                                                let path = convertParameterToProductListUrl({ make: _.toLower(opt.make), model: _.toLower(opt.model) })
                                                props.router.push(path);

                                            }}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={`${opt.make ? opt.make : ''} ${opt.model ? opt.model : ''} (${opt.total ? opt.total : ''})`}
                                                    // textToHighlight={`${opt.title || ''} (${opt.total ? opt.total : ''})`}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                                                {group.title} Not Found
                                                </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                        break;
                    case 'carspec':
                        return (
                            <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`} value={`${opt.make ? opt.make : ''} ${opt.model ? opt.model : ''}`} onClick={() => {
                                                props.router.push(`/newcar/details/${opt.make}/${opt.model}`);
                                                window.location.reload()
                                            }}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={`${opt.make ? opt.make : ''} ${opt.model ? opt.model : ''}`}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                                                {group.title} Not Found
                                                </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                    case 'dealerWithAds':
                        return (
                            <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`} value={`${opt.fullName || ''} | ${opt.companyName ? opt.companyName : ''}`} onClick={() => {
                                                if (opt.companyurlId && opt.userurlId) {
                                                    props.router.push(`/dealer/${_.get(opt, 'companyurlId')}/${_.get(opt, 'userurlId')}`);
                                                }
                                            }}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={`${opt.fullName || ''} | ${opt.companyName ? opt.companyName : ''} (${formatNumber(opt.total, 'auto', true, 0, true)})`}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={'notFoundCompany'} value={'notFoundCompany'} disabled>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} disabled>
                                                {group.title} Not Found
                                            </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                    case 'company':
                        return <OptGroup key={group.title} label={renderTitle(group.title, group.total)}>
                            {
                                _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                    group.children.map((opt, index) => (
                                        <Option key={`${group.title}-${index}`} onClick={() => { props.router.push('/profile/' + opt._id); }}>
                                            <Highlighter
                                                style={{ padding: '0px 10px' }}
                                                highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                textToHighlight={opt.name ? opt.name : ''}
                                                autoEscape={true}
                                                className="overline"
                                                searchWords={searchWords} />
                                        </Option>
                                    ))
                                    :
                                    <Option key={`${group.title}NotFound`} value={`${group.title}NotFound`} disabled>
                                        <span className='d-inline-block overline' style={{ padding: '0px 10px' }} >
                                            {group.title} Not Found
                                            </span>
                                    </Option>
                            }
                        </OptGroup>

                    default:
                        return (
                            <OptGroup key={v4()} label={renderTitle('Others', group.total)}>
                                {
                                    _.isArray(_.get(group, ['children'])) && !_.isEmpty(_.get(group, ['children'])) ?
                                        group.children.map((opt, index) => (
                                            <Option key={`${group.title}-${index}`}>
                                                <Highlighter
                                                    style={{ padding: '0px 10px' }}
                                                    highlightStyle={{ color: '#ffc069', padding: 0 }}
                                                    textToHighlight={opt.value ? opt.value : ''}
                                                    autoEscape={true}
                                                    className="overline"
                                                    searchWords={searchWords} />
                                            </Option>
                                        ))
                                        :
                                        <Option key={`othersNotFound`} value={`othersNotFound`}>
                                            <span className='d-inline-block overline' style={{ padding: '0px 10px' }} disabled>
                                                Not Found
                                            </span>
                                        </Option>
                                }
                            </OptGroup>
                        )
                }
            })

            base = _.union(list, base);
        }

        return base;
    }

    return (
        <React.Fragment>
            <AutoComplete
                className="certain-category-search layout-global-search"
                dropdownClassName="certain-category-search-dropdown group-item-scroll"
                // dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                // size="large"
                style={{ width: '100%' }}
                ref={searchBarRef}
                dataSource={restructData(dataSource)}
                onSearch={handleSearch}
                placeholder="Search here"
                optionLabelProp="value"
                open={!isEmptyDataSource && isFocused}
                onChange={(value) => {
                    setSearchValue(value);
                }}
                onSelect={() => {
                    setIsFocused(false)
                    setIsEmptyDataSource(true)
                    if (searchBarRef.current) {
                        searchBarRef.current.blur();
                    }
                }}
                defaultActiveFirstOption={false}
                onFocus={() => {
                    setIsFocused(true)
                }}
                onBlur={() => {
                    setIsFocused(false)
                }}

            >
                <Input
                    className="search-input"
                    border="false"
                    size="large"
                    value={searchValue}
                    // onSearch={() => props.router.push('/cars-on-sale')}
                    onPressEnter={(e) => {
                        if (e.target.value) {
                            // let path = `/cars-on-sale-search?page=${1}${`&${queryStringifyNestedObject({ title: searchValue })}`}`;
                            if (props.enterSearchCarFreaks) {
                                let text = e.target.value || '';
                                let canSearchHashTag = false;
                                if (text.indexOf('#') == 0 && arrayLengthCount(text.split(' ')) == 1) {
                                    canSearchHashTag = true;
                                }
                                text = text.replace('#', '');
                                if (canSearchHashTag) {
                                    props.router.push(`/hashtag/${text}`);
                                } else {
                                    props.router.push(`/search-car-freaks?matchStr=${text}`);
                                }
                            } else {
                                let path = convertParameterToProductListUrl({ title: searchValue });
                                props.router.push(path);
                            }
                        }
                    }}
                    suffix={
                        <SearchOutlined onClick={(e) => {
                            // let path = `/cars-on-sale-search?page=${1}${`&${queryStringifyNestedObject({ title: searchValue })}`}`;
                            let path = convertParameterToProductListUrl({ title: searchValue });
                            props.router.push(path);
                        }} />
                    }
                />
            </AutoComplete>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GlobalSearchBar));