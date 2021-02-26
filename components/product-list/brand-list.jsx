import { Empty } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { arrayLengthCount, isValidNumber } from '../../common-function';
import { carBrandsList } from '../../params/carBrandsList';
import { emptyIcon } from '../../params/common';



const BrandList = (props) => {

    const [brands, setBrands] = useState(carBrandsList)
    const [limit, setLimit] = useState(-1)

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
            setBrands(limit != -1 ? _.sampleSize(carBrandsList, limit) : _.sampleSize(carBrandsList, arrayLengthCount(carBrandsList)));
        }

    }, [props.data])


    return (
        <div className={`width-100 ${props.className || ''}`} style={{ ...props.style }}>
            <Scrollbars style={{ width: '100%' }} autoHide autoHeight>
                {
                    _.isArray(brands) && !_.isEmpty(brands) ?
                        <div className="flex-justify-space-between flex-items-align-center padding-sm">
                            {
                                _.map(brands, function (brand,i) {
                                    return (
                                        <span key={'brand'+i} className='d-inline-block relative-wrapper flex-items-no-shrink cursor-pointer'
                                            style={{ width: props.size || 50, height: props.size || 50 }}
                                            onClick={() => {
                                                if (props.onClickBrand) {
                                                    props.onClickBrand(brand)
                                                }
                                            }} >
                                            <img src={brand.icon || emptyIcon} className=" absolute-center-img-no-stretch"></img>
                                        </span>
                                    )
                                })
                            }
                        </div>
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