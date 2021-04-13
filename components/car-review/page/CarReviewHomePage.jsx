import { AutoComplete, Avatar, Button, Col, Divider, Form, Input, message, Rate, Row } from 'antd';
import Axios from 'axios';
import _ from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { arrayLengthCount, objectRemoveEmptyValue } from '../../../common-function';
import client from '../../../feathers';
import { ccarLogo, ratingBanner } from '../../../icon';
import { loading, loginMode, updateActiveMenu } from '../../../redux/actions/app-actions';
import InfiniteScrollWrapper from '../../general/InfiniteScrollWrapper';
import LayoutV2 from '../../general/LayoutV2';
import BrandList from '../../product-list/brand-list';
import ReviewList from '../../rating/ReviewList';
import ReviewList2 from '../../rating/ReviewList2';
import WriteReviewButton from '../../rating/WriteReviewButton';



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

const RATING_SIZE = 10;

const CarReviewHomePage = (props) => {

    const [brands, setBrands] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [ratingPage, setRatingPage] = useState(1);
    const [ratingTotal, setRatingTotal] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [filterGroup, setFilterGroup] = useState({});

    useEffect(() => {
        getBrands()
    }, [])


    useEffect(() => {

        getRatings((ratingPage - 1) * RATING_SIZE);

    }, [ratingPage])

    useEffect(() => {

        if (_.isPlainObject(filterGroup) && !_.isEmpty(filterGroup)) {
            if (ratingPage == 1) {
                getRatings();
            } else {
                setRatingPage(1);
            }
        }

    }, [filterGroup])


    function getRatings(skip) {
        if (!_.isNaN(parseInt(skip))) {
            skip = parseInt(skip);
        } else {
            skip = 0;
        }

        let query = objectRemoveEmptyValue(_.cloneDeep(filterGroup));

        setRatingLoading(true);
        Axios.get(`${client.io.io.uri}getRatedCarspecs`, {
            params: {
                limit: RATING_SIZE,
                skip: skip,
                match: {
                    ...query
                }
            }
        }).then(res => {
            console.log('res');
            console.log(res);
            setRatings(ratingPage == 1 ? _.get(res, 'data.data') : _.concat(ratings, _.get(res, 'data.data') || []))
            setRatingTotal(_.get(res, 'data.total') || 0);
            setRatingLoading(false);
        }).catch(err => {
            message.error(err.message)
        });
        // client.service('rating').find({
        //     query: {
        //         ...query,
        //         type: 'carspec',
        //         $populate: ['carspecId', 'reviewerId'],
        //         $limit: RATING_SIZE,
        //         $skip: skip || 0,
        //         $sort: {
        //             createdAt: -1,
        //         }
        //     }
        // }).then(res => {
        //     setRatings(ratingPage == 1 ? _.get(res, ['data']) : _.concat(ratings, _.get(res, ['data']) || []))
        //     setRatingTotal(_.get(res, ['total']));
        //     setRatingLoading(false);

        // }).catch(err => {
        //     setRatingLoading(false);
        //     message.error(err.message)
        // });

    }

    function getBrands() {

        Axios.get(`${client.io.io.uri}getRatedCarspecBrands`).then(res => {
            let data = _.map(_.get(res, 'data.data') || [], function (item) {
                item.value = item.make;
                return item;
            })
            setBrands(data || []);
        }).catch(err => {
            message.error(err.message)
        });
    }

    return (
        <LayoutV2>
            <Desktop>
                <div className="section">
                    <div className="container">
                        <div className="font-weight-thin grey-darken-1 h5">
                            Review and Rating
                        </div>
                        <div className="padding-y-lg flex-items-align-center">
                            <BrandList showTooltip showAllIcon wrapperClassName="flex-justify-start" size={50} avatarClassName="margin-x-lg" data={brands} onClickBrand={(brand) => {
                                if (_.get(brand, ['value']) && _.get(brand , ['value']) != 'all') {
                                    setFilterGroup({
                                        make: _.toLower(brand.value),
                                    });
                                } else {
                                    setFilterGroup({
                                        make: '',
                                    })
                                }
                            }}
                                emptyView={null}
                            />
                        </div>
                        <Divider />
                        <div className="flex-justify-space-between flex-items-align-center">
                            <span className='d-inline-block ' >
                            </span>
                            <span className='d-inline-block ' >
                                <Link href="/write-car-review" passHref>
                                    <a>
                                        <Button style={{ color: '#F57F17' }}  ><Avatar src={'/assets/add-post/create-post.png'} shape="square" size="small" /></Button>
                                    </a>
                                </Link>
                            </span>
                        </div>

                        <InfiniteScrollWrapper
                            onScrolledBottom={() => {
                                if (!ratingLoading && (RATING_SIZE * ratingPage) < ratingTotal) {
                                    setRatingPage(ratingPage + 1);
                                }
                            }}
                            hasMore={!ratingLoading && (RATING_SIZE * ratingPage) < ratingTotal}
                        >
                            <ReviewList2 data={ratings || []} />
                        </InfiniteScrollWrapper>

                    </div>
                </div>
            </Desktop>

        </LayoutV2>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
    loading,
    loginMode,
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CarReviewHomePage));