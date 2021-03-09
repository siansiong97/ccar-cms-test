import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Icon, Input, message, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
// import UserAvatar from './user-avatar';
// import UserAvatar from '../carFreak/components/user-avatar';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import client from '../../feathers';
import UserAvatar from './user-avatarCCARLive';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue, viewPort } from '../../common-function';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';


const itemCol = {
    xs: 6,
    sm: 6,
    md: 4,
    lg: 2,
    xl: 2,
    xxl: 2,
}

const BROADCASTER_LIMIT = 40;

const BroadcasterList = (props) => {

    const [broadcasters, setBroadcasters] = useState([])
    const [defaultBroadcasters, setDefaultBroadcasters] = useState([])
    const [activeBroadcasters, setActiveBroadcasters] = useState([])
    const [showMore, setShowMore] = useState(false);
    const [overSize, setOverSize] = useState(false);
    const [searchWord, setSearchWord] = useState('');



    console.log("wotan array of what is passed in ", broadcasters);

    useEffect(() => {
        if (_.isArray(props.broadcasters)) {
            setDefaultBroadcasters(props.broadcasters);
        } else {
            getDefaultBroadcasters();
        }
    }, [props.broadcasters])

    useEffect(() => {
        if (_.isArray(props.activeBroadcasters) && notEmptyLength(props.activeBroadcasters)) {
            setActiveBroadcasters(props.activeBroadcasters);
        } else {
            setActiveBroadcasters([]);
        }
    }, [props.activeBroadcasters])

    useEffect(() => {
        window.addEventListener("resize", itemResizeToViewPortSize);
        return () => window.removeEventListener("resize", itemResizeToViewPortSize);
    }, [defaultBroadcasters, showMore, activeBroadcasters, searchWord])

    useEffect(() => {
        itemResizeToViewPortSize();
    }, [defaultBroadcasters, showMore, activeBroadcasters, searchWord])


    function getDefaultBroadcasters() {
        client.service('users').find({
            query: {
                allowLive: 'yes',
                // $limit: BROADCASTER_LIMIT,
            }
        }).then(res => {
            if (notEmptyLength(res.data)) {
                setDefaultBroadcasters(res.data);
            } else {
                setDefaultBroadcasters([]);
            }
        }).catch(err => {
            message.error(err.message)
        });
    }

    function reorderActiveBroadcaster(broadcasters, activeBroadcasters) {

        if (_.isArray(activeBroadcasters) && notEmptyLength(broadcasters)) {
            //Put Active Broadcaster to front
            let newData = _.sortBy(broadcasters, function (broadcaster) {
                return isActiveBroadcaster(broadcaster) ? -1 : 1;
            })
            return newData;
        } else {
            return broadcasters;
        }
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

    function filterSearchWord(broadcasters) {
        if (_.isArray(broadcasters) && notEmptyLength(broadcasters) && searchWord != null) {
            try {
                let newData = _.filter(broadcasters, function (item) {
                    if (!item.name) {
                        item.name = `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`
                    }
                    let regex = new RegExp(`^${searchWord}`, 'i');
                    return regex.test(item.name);
                })
                return newData;
            } catch{
                return [];
            }
        } else {
            return broadcasters;
        }
    }

    function itemResizeToViewPortSize() {
        if (notEmptyLength(defaultBroadcasters)) {
            if (showMore) {
                setBroadcasters(filterSearchWord(reorderActiveBroadcaster(defaultBroadcasters, activeBroadcasters)))
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

                let newData = filterSearchWord(reorderActiveBroadcaster(defaultBroadcasters, activeBroadcasters))
                newData = _.slice(newData, 0, 24 / itemLength)

                setBroadcasters(newData);
                if (defaultBroadcasters > newData) {
                    setOverSize(true);
                }

            }
        } else {
            setBroadcasters([]);
        }
    }

    function isActiveBroadcaster(broadcaster) {
        if (_.isPlainObject(broadcaster) && notEmptyLength(objectRemoveEmptyValue(broadcaster))) {
            return _.some(activeBroadcasters, function (activeBroadcaster) {
                return activeBroadcaster.dealerDbId == broadcaster._id
            })
        } else {
            return false;
        }
    }

    return (
        <React.Fragment>
            <div id="broadcaster-list-container" className={`width-100 height-100 ${props.className ? props.className : ''}`} style={{ ...props.style }}>

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
                <Scrollbars autoHide style={{ height: showMore ? 300 : 130, width: '100%' }}>
                    <Row gutter={props.gutter ? props.gutter : [10, 20]} type="flex" align="stretch" justify="start">
                        {
                            _.isArray(broadcasters) && notEmptyLength(broadcasters) ?
                                _.map(broadcasters, function (broadcaster) {
                                    return (
                                        <Col xs={props.xs ? props.xs : itemCol.xs} sm={props.sm ? props.sm : itemCol.sm} md={props.md ? props.md : itemCol.md} lg={props.lg ? props.lg : itemCol.lg} xl={props.xl ? props.xl : itemCol.xl} xxl={props.xxl ? props.xxl : itemCol.xxl} className=''>
                                            <span className={`relative-wrapper d-inline-block ${isActiveBroadcaster(broadcaster) ? 'cursor-pointer' : 'cursor-not-allowed'} width-100`} onClick={(e) => {
                                                let selectedActiveBroadcaster = _.find(activeBroadcasters, function (activeBroadcaster) {
                                                    return activeBroadcaster.dealerDbId == broadcaster._id;
                                                })
                                                if (!selectedActiveBroadcaster || !selectedActiveBroadcaster.dealerSocketId) {
                                                    // props.router.push(`/live-streamer/${broadcaster._id}`)
                                                }
                                                else {
                                                    //donar it manages the routes
                                                    props.router.push(`/live/${selectedActiveBroadcaster.dealerSocketId}`, undefined, { shallow: true })
                                                }
                                            }}>
                                                <UserAvatar
                                                    isBroadcastersList={true}
                                                    avatarClassName={`${isActiveBroadcaster(broadcaster) ? 'border-red' : 'border-grey cursor-not-allowed'} ${props.avatarClassName ? props.avatarClassName : ''}`}
                                                    className={`${isActiveBroadcaster(broadcaster) ? '' : 'cursor-not-allowed'}`}
                                                    size={isValidNumber(props.size) ? props.size : 80}
                                                    showName={!props.showName || props.showName == false ? false : true}
                                                    textClassName={`text-truncate margin-top-md ${props.textClassName ? props.textClassName : ''}`}
                                                    data={broadcaster} />
                                                {
                                                    isActiveBroadcaster(broadcaster) ?
                                                        <span className='d-inline-block background-red white text-align-center round-border width-50' style={{ padding: 3, fontSize: 12, position: 'absolute', top: (isValidNumber(props.size) ? props.size : 80) - (isValidNumber(props.size) ? props.size : 80) * 0.2, left: 0, right: 0, margin: 'auto' }} >
                                                            Live
                                                        </span>
                                                        :
                                                        <span className='d-inline-block background-grey white text-align-center round-border width-50' style={{ padding: 3, fontSize: 12, position: 'absolute', top: (isValidNumber(props.size) ? props.size : 80) - (isValidNumber(props.size) ? props.size : 80) * 0.2, left: 0, right: 0, margin: 'auto' }} >
                                                            Live
                                                        </span>
                                                }
                                            </span>
                                        </Col>
                                    )
                                })
                                :
                                <div className="width-100">
                                    <Empty></Empty>
                                </div>
                        }
                    </Row>
                </Scrollbars>
                {
                    !notEmptyLength(broadcasters) || !overSize ?
                        null
                        :
                        <div className="width-100 flex-items-align-center flex-justify-center margin-top-md">
                            {
                                showMore ?
                                    <Button type="primary" className='white width-30 round-border-big'
                                        onClick={(e) => {
                                            setShowMore(false);
                                            var elmnt = document.getElementById("broadcaster-list-container");
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
                                            var elmnt = document.getElementById("broadcaster-list-container");
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
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(BroadcasterList)));