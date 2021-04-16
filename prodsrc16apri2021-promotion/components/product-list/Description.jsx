import { Button, Card, Col, Empty, Form, message, Row, Select, Tabs } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { notEmptyLength } from '../../common-function';
import client from '../../feathers';
import { loading } from '../../redux/actions/app-actions';
import { fetchFeaturesList, updateCheckedFeaturesDate } from '../../redux/actions/productsList-actions';
import CarspecsCompareTable from '../compare/CarspecsCompareTable';
import { isIOS, isMobile } from 'react-device-detect'
import OverallRating from '../rating/OverallRating';
import RatingProgress from '../rating/RatingProgress';
import WriteReviewButton from '../rating/WriteReviewButton';
import ReviewList2 from '../rating/ReviewList2';


const { TabPane } = Tabs;
const { Option } = Select;
const reviewContainerRef = React.createRef();

const RATINGPAGESIZE = 4;



const columns = [
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (text, row) => {
            if (row.field == 'skip') {
                return {
                    children: <span><strong>{text}</strong></span>,
                    props: {
                        colSpan: 3,
                    },
                };
            } else {
                return {
                    children: <span>{text}</span>,
                };
            }
        },
    },
    {
        title: 'Field',
        dataIndex: 'field',
        key: 'field',
        render: (text, row) => {
            if (text == 'skip') {
                return {
                    props: {
                        colSpan: 0,
                    },
                };
            } else {
                return {
                    children: <span>{text}</span>,
                };
            }
        },
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        render: (text, row) => {
            if (text == 'skip') {
                return {
                    props: {
                        colSpan: 0,
                    },
                };
            } else {
                return {
                    children: <span>{text}</span>,
                };
            }
        },
    },
];

const Description = (props) => {
    const [id, setId] = useState('')
    const [companyId, setCompanyId] = useState(null)
    const [productDetails, setProductDetails] = useState({})
    const [carSpecs, setCarSpecs] = useState([])
    const [expandedRow, setExpandedRow] = useState([])
    const [ratings, setRatings] = useState([])
    const [ratingPage, setRatingPage] = useState(1)
    const [ratingTotal, setRatingTotal] = useState(0)
    const [ownRating, setOwnRating] = useState([])
    const [displayContact, setDisplayContact] = useState(false)
    const [carspecIds, setCarspecIds] = useState([])

    const [count, setCount] = useState(0)

    useEffect(() => {
        if (props.productDetails._id != id) {
            setId(props.productDetails._id)
            setProductDetails(props.productDetails)
            setCompanyId(props.productDetails.companys._id)

            let uniqSpec = _.uniqBy(props.productDetails.carspecsAll.specification, 'category')
            let cloneUniqSpec = _.cloneDeep(uniqSpec)
            uniqSpec.map((v, i) => {
                cloneUniqSpec[i].key = i
                cloneUniqSpec[i].children = []
                cloneUniqSpec[i].field = 'skip'
                cloneUniqSpec[i].value = 'skip'
                props.productDetails.carspecsAll.specification.map((v1, i1) => {
                    if (v1.category == v.category) {
                        cloneUniqSpec[i].children.push({ key: i + '' + i1, field: v1.field, value: v1.value })
                    }
                })
            })

            setCarSpecs(cloneUniqSpec)
        }
    })

    useEffect(() => {

        if (!props.productsList.checkedFeaturesDate || moment(props.productsList.checkedFeaturesDate).isBefore(moment(), 'day')) {
            props.loading(true);
            axios.get(`${client.io.io.uri}getFeatureList`).then(res => {
                props.loading(false);
                props.fetchFeaturesList(res.data.data);
                props.updateCheckedFeaturesDate(moment());
            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });
        }
    }, []);



    useEffect(() => {

        getRatings((ratingPage - 1) * RATINGPAGESIZE);
    }, [ratingPage])


    useEffect(() => {
        init();
        setCarspecIds(_.compact([_.get(productDetails , 'carspecsAll._id')]));
    }, [productDetails, props.user])

    // useEffect(() => {
    //     setCount(count + 1);
    //     if (count < 10) {
    //         console.log(props.user);
    //         props.loading(!props.app.loading)
    //     }
    // }, [props.user])



    function init() {
        if (ratingPage == 1) {
            getRatings(0);
        } else {
            setRatingPage(1);
        }
        setRatingTotal(0);
        getOwnRating();
    }

    function getRatings(skip) {
        console.log('get ratings');
        if (_.get(productDetails, ['carspecsId', '_id'])) {

            let query = {
                carspecId: _.get(productDetails, ['carspecsId', '_id']),
                type: 'carspec',
                $populate: [
                    {
                        path: 'carspecId',
                        ref: 'carspecs'
                    },
                    {
                        path: 'reviewerId',
                        ref: 'users'
                    }
                ],
                $limit: RATINGPAGESIZE,
                $skip: skip,
            }

            if (props.user.authenticated) {
                query.reviewerId = {
                    $ne: props.user.info.user._id,
                }

                query["hideBy.userId"] = {
                    $ne: props.user.info.user._id,
                }
            }
            props.loading(true);
            client.service('rating').find({
                query
            }).then((res) => {
                console.log('res');
                console.log(res);
                props.loading(false);
                if (notEmptyLength(res.data)) {
                    let data = ratings.concat(res.data);
                    setRatingTotal(res.total);
                    setRatings(data);
                }
            })
                .catch((err) => {
                    props.loading(false);
                    message.error(err.message);
                })
        } else {
            setRatings([]);
        }
    }



    function getOwnRating() {
        if (_.get(productDetails, ['carspecsId', '_id']) && props.user.authenticated) {

            props.loading(true);
            client.service('rating').find({
                query: {
                    type: 'carspec',
                    carspecId: _.get(productDetails, ['carspecsId', '_id']),
                    reviewerId: props.user.info.user._id,
                    $populate: [
                        {
                            path: 'carspecId',
                            ref: 'carspecs'
                        },
                        {
                            path: 'reviewerId',
                            ref: 'users'
                        }
                    ],
                    $limit: 1,
                }

            }).then((res) => {
                props.loading(false);
                if (notEmptyLength(res.data)) {
                    setOwnRating(res.data);
                } else {
                    setOwnRating([]);
                }
            })
                .catch((err) => {
                    props.loading(false);
                    message.error(err.message);
                })
        } else {
            setOwnRating([]);
        }
    }

    const callback = (key) => {
    }

    // function getFeatureText(data) {

    //     switch (data) {
    //         case "abs":
    //             return 'ABS';
    //         case "adjustablesteeringwheel":
    //             return 'Adjustable Steering Wheel';
    //         case "airbags":
    //             return "Air bags"
    //         case "alarm":
    //             return "Alarm"
    //         case "blindspotmonitor":
    //             return "Blind spot monitor"
    //         case "bodykits":
    //             return "Body Kits"
    //         case "brakeassist":
    //             return "Brake Assist"
    //         case "bucketseat":
    //             return "Bucket Seat"
    //         case "cdplayer":
    //             return "Cd Player"
    //         case "centrallocks":
    //             return "Central Locks"
    //         case "centraltouchscreen":
    //             return "Central touchscreen"
    //         case "childsafetylock":
    //             return "Child safety lock"
    //         case "cruisecontrol":
    //             return "Cruise Control"
    //         case "daytimerunninglights":
    //             return "Daytime running lights"
    //         case "driveradjustablelumbar":
    //             return "Driver adjustable lumbar"
    //         case "drivervanityminor":
    //             return "Driver Vanity minor"
    //         case "electricseat":
    //             return "Electric Seat"
    //         case "foglamps":
    //             return "Fog Lamps"
    //         case "frontwheeldrive":
    //             return "Front Wheel Drive"
    //         case "gpsnavigation":
    //             return "GPS Navigation"
    //         case "heatedfrontseat":
    //             return "Heated Front Seat"
    //         case "keylessstart":
    //             return "Keyless Start"
    //         case "lanedeparturewarning":
    //             return "Lane departure warning"
    //         case "leatherseats":
    //             return "Leather Seats"
    //         case "manufacturerwarranty":
    //             return "Manufacturer Warranty"
    //         case "mp3players":
    //             return "MP3 Players"
    //         case "multifunctionsteering":
    //             return "Multi Function Steering"
    //         case "paddleshift":
    //             return "Paddle Shift"
    //         case "parkingsensor":
    //             return "Parking Sensor"
    //         case "passangerilluminatedvisormirror":
    //             return "Passanger Illuminated visor mirror"
    //         case "powersteering":
    //             return "Power Steering"
    //         case "powerwindow":
    //             return "Power Window"
    //         case "reardefrost":
    //             return "Rear Defrost"
    //         case "reservecamera":
    //             return "Reserve Camera"
    //         case "sportrims":
    //             return "Sport rims"
    //         case "stabilitycontrol":
    //             return "Stability Control"
    //         case "steeringwheelaudio":
    //             return "Steering Wheel Audio"
    //         case "sunroof/moonroof":
    //             return "Sunroof / Moonroof"
    //         case "telematics":
    //             return "Telematics"
    //         case "tripcomputer":
    //             return "Trip Computer"
    //         case "usb":
    //             return "USB"
    //         case "wheellock":
    //             return "Wheel lock"
    //         case "windowtint":
    //             return "Window Tint"
    //         case "wipes":
    //             return "Wipes"
    //         default:
    //             return null;
    //     }
    // }

    function expandAllRow() {
        if (notEmptyLength(carSpecs)) {
            let keys = _.map(carSpecs, 'key');
            if (notEmptyLength(keys)) {
                setExpandedRow(keys);
            }
        } else {
            setExpandedRow([]);
        }
    }

    function shrinkAllRow() {
        setExpandedRow([]);
    }

    const _renderFeatures = (data) => {
        if (notEmptyLength(props.productsList.featuresList) && notEmptyLength(data)) {
            let temp = _.filter(props.productsList.featuresList, function (item) {
                return _.includes(data, item.value);
            })
            if (notEmptyLength(temp)) {

                let list = temp.map(function (item) {
                    return (
                        <Col span={8}>
                            <div className="flex-justify-start flex-items-align-center padding-x-sm fill-parent ">
                                {/* <div className="round-border wrapBorderRed" style={{width:'50px', height:'50px'}}> */}
                                <span className="margin-x-sm relative-wrapper" style={{ height: "30px", width: '30px' }}>
                                    <img src={item.icon ? item.icon : null} className="fill-parent absolute-center" />
                                </span>
                                {/* </div> */}
                                <span className="padding-sm headline flex-justify-center flex-items-align-center text-truncate-threeline">
                                    {item.text ? item.text : null}
                                </span>
                            </div>
                        </Col>
                    );
                })

                return (
                    <div style={{ minHeight: 500 }}>
                        <Row type="flex" align="middle" gutter={[10, 10]} >
                            {list}
                        </Row>
                    </div>
                )
            } else {
                return <Empty
                    style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                    image="/empty.png"
                    imageStyle={{
                        height: 60,
                    }
                    }
                    description={
                        <span>
                            No Result
            </span>
                    }
                >
                </Empty>
            }


        } else {

            return <Empty
                style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                image="/empty.png"
                imageStyle={{
                    height: 60,
                }
                }
                description={
                    <span>
                        No Result
            </span>
                }
            >
            </Empty>
        }
    }

    const _renderExpandButton = () => {
        return (
            <React.Fragment>

                <Button icon="arrows-alt" onClick={expandAllRow} className="background-ccar-yellow margin-x-sm">
                    Expand All
            </Button>
                <Button icon="shrink" onClick={shrinkAllRow} className="margin-x-sm">
                    Shrink All
            </Button>
            </React.Fragment>
        )
    }

    function changeProductDetails(data, type) {

        if (_.isEmpty(data) === true) { return }
        let dataString = _.cloneDeep(data)
        let phoneFormat = /((601)|(01))[0-46-9]*[0-9]{7,10}/gim
        let phoneFormat2 = /([601]|[01]|)[0-46-9]-*[0-9]{7,10}/g

        dataString = dataString.split('\n')
        dataString = dataString.map(function (v) {

            let v2 = v
            v = v.replace(/\s/g, '')
            v = v.replace(/\+/g, '')
            v = v.replace(/-/g, '')
            let n = v.match(phoneFormat);
            let s = v.split(phoneFormat2);


            let x = ''
            if (_.isEmpty(n) === true) { return <p style={{ marginBottom: '0em' }}>{v2}</p> }

            s = _.without(s, '6')
            s = _.without(s, '0')
            s = _.without(s, '')
            x = s.map(function (v, i) {

                if (n[i]) {
                    if (type === 'callContact') {

                        if (n[i].charAt(0) !== '6') {
                            n[i] = '6' + n[i]
                        }

                        if (isMobile) {
                            v = <><>{v}</> <a className='contactShow'
                                target={'_blank'}
                                href={"tel:" + n[i]}
                            >{n[i]}</a></>
                        }
                        else {

                            let username = ''
                            try {
                                username = productDetails.createdBy.namePrefix + ' ' + productDetails.createdBy.fullName
                            }
                            catch (err) { username = '' }

                            v = <><>{v}</> <a className='contactShow'
                                target={'_blank'}
                                href={
                                    "https://web.whatsapp.com/send?phone="
                                    + n[i].replace('+', '') + "&text=Hi "
                                    + username
                                    + ", I am interested in your car ad on ccar.my and I would like to know more about "
                                    + productDetails.title
                                    + " (RM "
                                    + productDetails.price.toFixed(2) + "). Thank you. https://ccar.my/viewCar/"
                                    + productDetails._id}

                            >{n[i]}</a></>
                        }
                    }
                    else {
                        v = <><>{v}</> <span className='contactHide' onClick={() => { setDisplayContact(true) }}>(Click to View Contact No.)</span></>
                    }
                }
                return v
            })
            return <p style={{ marginBottom: '0em' }}>{x}</p>
        })
        return dataString
    }

    return (
        <div>
            <Card size="small">
                <Tabs defaultActiveKey="1" onChange={callback} className="wrap-desciption">
                    <TabPane tab="Description" key="1">
                        {/* <p style={{ whiteSpace: 'pre-wrap' }}>{productDetails.description}</p> */}
                        <p style={{ whiteSpace: 'pre-wrap' }}  >{displayContact ? changeProductDetails(productDetails.description, 'callContact') : changeProductDetails(productDetails.description)}</p>
                    </TabPane>
                    <TabPane tab="Features" key="2">
                        {_renderFeatures(productDetails.features)}
                    </TabPane>
                    <TabPane tab="Specification" key="3">
                        <div style={{ minHeight: 500 }}>
                            <p> *The actual specifications for this vehicle may be differ, please confirm with the sales agent. </p>
                            <CarspecsCompareTable findById data={carspecIds} />
                        </div>
                    </TabPane>
                    <TabPane tab="Rating & Reviews" key="4">
                        <Row gutter={[0, 10]} type="flex" justify="center" align="stretch">
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Row>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <OverallRating rating={_.get(productDetails , ['carspecsId', 'avgRating']) || 0} total={_.get(productDetails , ['carspecsId', 'totalRating']) || 0} />
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <RatingProgress
                                            data={_.get(productDetails , ['carspecsId', 'ratingCategory']) || []}
                                            total={_.get(productDetails , ['carspecsId', 'totalRating']) || 0}
                                            startFrom={1}
                                            size={5}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <div className="fill-parent">
                                    <div className="height-50 flex-justify-end flex-items-align-top ">

                                        {
                                            !notEmptyLength(ownRating) ?
                                                <WriteReviewButton
                                                    title={_.trim(`Review on ${_.get(productDetails, ['carspecsId', 'make']) || ''} ${_.get(productDetails, ['carspecsId', 'model']) || ''} ${_.get(productDetails, ['carspecsId', 'variant']) || ''}`)}
                                                    data={{ type: 'carspec', carspecId: _.get(productDetails, ['carspecsId', '_id']) || '', reviewerId: props.user.authenticated ? props.user.info.user._id : null }}
                                                    mode="add"
                                                    handleError={(e) => { message.error(e.message) }}
                                                    readOnly={props.readOnly}
                                                /> :
                                                null
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div className="fill-parent margin-top-md">
                                {
                                    notEmptyLength(ratings) || notEmptyLength(ownRating) ?
                                        <React.Fragment>
                                            <div className="fill-parent" style={{ paddingRight: '3%' }}>
                                                <ReviewList2 data={notEmptyLength(ownRating) ? ownRating : []} handleChange={(v) => { init() }} />
                                            </div>
                                            {
                                                notEmptyLength(ratings) ?

                                                    <div className="fill-parent padding-right-md wrapBorderRed" style={{ display: 'inline-block', overflowX: 'hidden', overflowY: "scroll", maxHeight: '500px', border: 'none' }}>
                                                        <ReviewList2 data={ratings} handleChange={(v) => { init() }} />
                                                        {
                                                            ratings.length < ratingTotal ?
                                                                <div className="text-align-center subtitle1 font-weight-bold"><a onClick={() => { setRatingPage(ratingPage + 1) }}>Load More</a></div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </React.Fragment>
                                        :
                                        (
                                            <div style={{ height: '15em', backgroundColor: '#FFFFFF' }}>
                                                <Empty
                                                    style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                                                    image="/empty.png"
                                                    imageStyle={{
                                                        height: 60,
                                                    }
                                                    }
                                                    description={
                                                        <span>
                                                            No Review Yet
                                            </span>
                                                    }
                                                >
                                                </Empty>
                                            </div>
                                        )
                                }
                            </div>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>
        </div >
    );
}

const mapStateToProps = state => ({
    user: state.user,
    app: state.app,
    productsList: state.productsList,
});

const mapDispatchToProps = {
    loading: loading,
    fetchFeaturesList: fetchFeaturesList,
    updateCheckedFeaturesDate: updateCheckedFeaturesDate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Description)));