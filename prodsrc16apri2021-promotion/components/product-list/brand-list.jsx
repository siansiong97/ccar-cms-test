import { Empty, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { arrayLengthCount, isValidNumber } from '../../common-function';
import { allIcon } from '../../icon';
import { carBrandsList } from '../../params/carBrandsList';
import { emptyIcon } from '../../params/common';



const BrandList = (props) => {

    const [brands, setBrands] = useState(carBrandsList)
    const [limit, setLimit] = useState(-1)
    const [tooltipVisible, setTooltipVisible] = useState({});


    useEffect(() => {
        let limit = props.limit;
        if (isValidNumber(parseInt(props.limit))) {
            limit = parseInt(props.limit)
        } else {
            limit = -1;
        }

        if (_.isArray(props.data) && !_.isEmpty(props.data)) {

            let brands = _.compact(_.map(props.data, function (brand) {
                let selectedBrand;
                if (_.isPlainObject(brand) && _.get(brand, ['value'])) {
                    selectedBrand = _.find(carBrandsList, function (origBrand) {
                        return _.toLower(origBrand.value) == _.toLower(brand.value);
                    })
                } else {
                    selectedBrand = _.find(carBrandsList, function (origBrand) {
                        return _.toLower(origBrand.value) == _.toLower(brand);
                    })
                }

                return selectedBrand;

            }))

            setBrands(limit != -1 ? _.slice(brands, 0, limit) : brands);
        } else {
            setBrands([])
            // setBrands(limit != -1 ? _.sampleSize(carBrandsList, limit) : _.sampleSize(carBrandsList, arrayLengthCount(carBrandsList)));
        }

    }, [props.data])


    return (
        <div className={`width-100 ${props.className || ''}`} style={{ ...props.style }}>
            <Scrollbars style={{ width: '100%' }} autoHide autoHeight>
                {
                    _.isArray(brands) && !_.isEmpty(brands) ?
                        <div className={`d-flex ${props.wrapperClassName || 'flex-justify-space-between flex-items-align-center padding-sm'}`}>
                            {
                                props.showAllIcon === true ?
                                    <Tooltip title={`All Brands`} visible={props.showTooltip === true ? _.get(tooltipVisible , ['allIcon']) : false} onVisibleChange={(v) => {
                                        setTooltipVisible({
                                            ...tooltipVisible,
                                            allIcon : v,
                                        });
                                    }}>
                                        <span key={'all-brand'} className={`d-inline-block ${props.avatarClassName || ''} background-grey-lighten-2 avatar relative-wrapper flex-items-no-shrink cursor-pointer`}
                                            style={{ width: props.size || 50, height: props.size || 50 }}
                                            onClick={() => {
                                                if (props.onClickBrand) {
                                                    props.onClickBrand({ value: 'all' })
                                                }
                                            }} >
                                            <img src={allIcon} style={{ width: (props.size || 50) * 0.5, height: (props.size || 50) * 0.5 }} className="absolute-center" ></img>
                                        </span>
                                    </Tooltip>
                                    :
                                    null
                            }
                            {
                                _.map(brands, function (brand, i) {
                                    return (
                                        <Tooltip title={`${brand.value}`} visible={props.showTooltip === true ? _.get(tooltipVisible , [brand.value]) : false} onVisibleChange={(v) => {
                                            setTooltipVisible({
                                                ...tooltipVisible,
                                                [brand.value || ''] : v,
                                            });
                                        }}>
                                            <span key={'brand' + i} className={`d-inline-block ${props.avatarClassName || ''} relative-wrapper flex-items-no-shrink cursor-pointer`}
                                                style={{ width: props.size || 50, height: props.size || 50 }}
                                                onClick={() => {
                                                    if (props.onClickBrand) {
                                                        props.onClickBrand(brand)
                                                    }
                                                }} >
                                                <img src={brand.icon || emptyIcon} className=" absolute-center-img-no-stretch"></img>
                                            </span>
                                        </Tooltip>
                                    )
                                })
                            }
                        </div>
                        :
                        props.emptyView != undefined || props.emptyView === null ?
                            props.emptyView
                            :
                            <div className="flex-justify-center flex-items-align-center padding-md">
                                <Empty></Empty>
                            </div>
                }
            </Scrollbars>
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(BrandList);