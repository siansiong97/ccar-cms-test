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
import { routePaths } from '../../../route';
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
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);
    const [origOptions, setOrigOptions] = useState({})
    const [variants, setVariants] = useState([]);

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

    useEffect(() => { 

        if(filterGroup.make){
            getModels();
        }
    
    } , [filterGroup.make])

    useEffect(() => { 

        if(filterGroup.model){
            getYears();
        }
    
    } , [filterGroup.model])

    useEffect(() => { 

        if(filterGroup.year){
            getVariants();
        }
    
    } , [filterGroup.year])

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
        console.log('get brand');

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


    function getModels() {
        console.log('get model');
        if (filterGroup.make) {
            console.log(filterGroup.make);
            client.service('carspecs').find({
                query: {
                    distinctFilter: {
                        make: filterGroup.make,
                        variant: {
                            $ne: null,
                            $ne: undefined,
                            $ne: '',
                        }
                    },
                    distinct: 'model'
                }
            }).then(res => {
                console.log('res');
                console.log(res);
                setModels(_.compact(res) || [])
                setOrigOptions({
                    ...origOptions,
                    models: _.compact(res) || [],
                })

            })
        } else {
            setModels([])
        }
    }
    function getYears() {
        console.log('get year');
        if (filterGroup.make && filterGroup.model) {
            client.service('carspecs').find({
                query: {
                    distinctFilter: {
                        make: filterGroup.make,
                        model: filterGroup.model,
                        variant: {
                            $ne: null,
                            $ne: undefined,
                            $ne: '',
                        }
                    },
                    distinct: 'year'
                }
            }).then(res => {
                setYears(_.compact(res) || [])
                setOrigOptions({
                    ...origOptions,
                    years: _.compact(res) || [],
                })
            })
        } else {
            setYears([])
        }
    }
    function getVariants() {
        console.log('get variant');
        if (filterGroup.make && filterGroup.model && filterGroup.year) {
            client.service('carspecs').find({
                query: {
                    distinctFilter: {
                        make: filterGroup.make,
                        model: filterGroup.model,
                        year: filterGroup.year,
                        variant: {
                            $ne: null,
                            $ne: undefined,
                            $ne: '',
                        }
                    },
                    distinct: 'variant'
                }
            }).then(res => {
                setVariants(_.compact(res) || [])
                setOrigOptions({
                    ...origOptions,
                    variants: _.compact(res) || [],
                })
            })
        } else {
            setVariants([]);
        }
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
                            <BrandList value={filterGroup.make} showTooltip showAllIcon wrapperClassName="flex-justify-start" size={50} avatarClassName="margin-x-lg" data={brands} onClickBrand={(brand) => {
                                if (_.get(brand, ['value']) && _.get(brand, ['value']) != 'all') {
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
                        <div className="flex-justify-space-between flex-items-align-center margin-y-md">
                            <span className='d-inline-block width-80' >
                                <div className="flex-justify-start flex-items-align-center ">
                                    <span className='d-inline-block width- margin-right-md' >
                                        <AutoComplete
                                            disabled={!filterGroup.make}
                                            placeholder="Model"
                                            dataSource={models}
                                            onSelect={(value) => {
                                                setFilterGroup({
                                                    model: value,
                                                    year: undefined,
                                                    variant: undefined,
                                                })
                                            }}
                                            onSearch={(value) => {
                                                if (value) {
                                                    setModels(_.filter(_.get(origOptions, ['models']) || [], function (item) {
                                                        let regex = new RegExp(`^${value}`, 'i')
                                                        return regex.test(item);
                                                    }))
                                                } else {
                                                    setModels(_.get(origOptions, ['models']) || [])
                                                }
                                            }}
                                        >
                                        </AutoComplete>
                                    </span>

                                    <span className='d-inline-block width-20 margin-right-md' >
                                        <AutoComplete
                                            disabled={!filterGroup.make || !filterGroup.model}
                                            placeholder="Manufactured Year"
                                            dataSource={years}
                                            onSelect={(value) => {
                                                setFilterGroup({
                                                    year: value,
                                                    variant: undefined,
                                                })
                                            }}
                                            onSearch={(value) => {
                                                if (value) {
                                                    setYears(_.filter(_.get(origOptions, ['years']) || [], function (item) {
                                                        let regex = new RegExp(`^${value}`, 'i')
                                                        return regex.test(item);
                                                    }))
                                                } else {
                                                    setYears(_.get(origOptions, ['years']) || [])
                                                }
                                            }}
                                        >
                                        </AutoComplete>
                                    </span>
                                    <span className='d-inline-block width-20 margin-right-md' >
                                        <AutoComplete
                                            disabled={!filterGroup.make || !filterGroup.model || !filterGroup.year}
                                            placeholder="Variant"
                                            dataSource={variants}
                                            onSelect={(value) => {
                                                setFilterGroup({
                                                    variant: value,
                                                })
                                            }}
                                            onSearch={(value) => {
                                                if (value) {
                                                    setVariants(_.filter(_.get(origOptions, ['variants']) || [], function (item) {
                                                        let regex = new RegExp(`^${value}`, 'i')
                                                        return regex.test(item);
                                                    }))
                                                } else {
                                                    setVariants(_.get(origOptions, ['variants']) || [])
                                                }
                                            }}
                                        >
                                        </AutoComplete>
                                    </span>
                                </div>

                            </span>
                            <span className='d-inline-block ' >
                                <Link href={routePaths.writeCarReview.to || '/'} as={typeof (routePaths.writeCarReview.as) == 'function' ? routePaths.writeCarReview.as() : '/'} passHref>
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