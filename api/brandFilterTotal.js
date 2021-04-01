import _ from 'lodash'
import axios from 'axios';
import client from '../feathers'
import { isValidNumber, notEmptyLength, convertToRangeFormat, convertRangeFormatBack, convertFilterRange, objectRemoveEmptyValue } from '../common-function';
const availableOptions = ['make', 'model', 'state', 'area', 'bodyType', 'color', 'fuelType'];
const PAGESIZE = 30;
const distinctArr = (value, index, self) => {
    return self.indexOf(value) === index
}

export default async function (modal, data) {

    if (_.isArray(modal) && !_.isEmpty(modal)) {
        modal = _.intersection(modal, availableOptions) || [];
    } else if (_.isString(modal)) {
        modal = _.compact([_.find(availableOptions, modal)])
    } else {
        return {};
    }

    let andFilter = { $and: [] }

    if (_.isArray(modal) && !_.isEmpty(modal)) {

        if (!_.has(data, ['filterGroup'])) {
            data.filterGroup = {};
        } else {
            data.filterGroup = _.cloneDeep(data.filterGroup)
        }

        if (notEmptyLength(data.filterGroup) && notEmptyLength(data.filterGroup.yearRange)) {
            data.filterGroup.yearRange = convertToRangeFormat(data.filterGroup.yearRange);
            data.filterGroup.yearRange = convertFilterRange(data.filterGroup.yearRange, 'carspec.year')
            if (notEmptyLength(data.filterGroup.yearRange)) {
                andFilter.$and = [...andFilter.$and, ...data.filterGroup.yearRange]
                data.filterGroup = Object.assign(data.filterGroup, andFilter)
            }
            delete data.filterGroup.yearRange;
        }

        if (notEmptyLength(data.filterGroup) && notEmptyLength(data.filterGroup.priceRange)) {
            data.filterGroup.priceRange = convertToRangeFormat(data.filterGroup.priceRange);
            data.filterGroup.priceRange = convertFilterRange(data.filterGroup.priceRange, 'searchPrice')
            if (notEmptyLength(data.filterGroup.priceRange)) {
                andFilter.$and = [...andFilter.$and, ...data.filterGroup.priceRange]
                data.filterGroup = Object.assign(data.filterGroup, andFilter)
            }
            delete data.filterGroup.priceRange;
        }

        if (notEmptyLength(data.filterGroup) && notEmptyLength(data.filterGroup.mileageRange)) {
            data.filterGroup.mileageRange = convertToRangeFormat(data.filterGroup.mileageRange);
            data.filterGroup.mileageRange = convertFilterRange(data.filterGroup.mileageRange, 'mileageFilter')
            if (notEmptyLength(data.filterGroup.mileageRange)) {
                andFilter.$and = [...andFilter.$and, ...data.filterGroup.mileageRange]
                data.filterGroup = Object.assign(data.filterGroup, andFilter)
            }
            delete data.filterGroup.mileageRange;
        }

        if (notEmptyLength(data.filterGroup) && notEmptyLength(data.filterGroup.engineCapacityRange)) {
            data.filterGroup.engineCapacityRange = convertRangeFormatBack(data.filterGroup.engineCapacityRange);
            data.filterGroup.engineCapacityRange = convertFilterRange(data.filterGroup.engineCapacityRange, 'carspec.engineCapacity')
            if (notEmptyLength(data.filterGroup.engineCapacityRange)) {
                andFilter.$and = [...andFilter.$and, ...data.filterGroup.engineCapacityRange]
                data.filterGroup = Object.assign(data.filterGroup, andFilter)
            }
            delete data.filterGroup.engineCapacityRange;
        }

        data.filterGroup = objectRemoveEmptyValue(data.filterGroup);
        let match = { $match: { ...data.filterGroup } }
        console.log('match');
        console.log(match);
        let promises = [];
        _.forEach(modal, function (modal) {
            promises.push(
                axios.get(`${client.io.io.uri}brandFilterTotalV3`, {
                    params: { filterType: modal, match },
                })
            )
        })

        return await Promise.all(promises).then((responses) => {
            if (_.isArray(responses) && !_.isEmpty((responses))) {
                let options = {}
                _.forEach(responses, function (response, index) {
                    options[`${modal[index]}List`] = response.data.uniqueInfo[`${modal[index]}List`];
                })

                console.log(options);
                return options;

            }
        }).catch((err) => {
            return {};
            // message.error(err.message);
        })
    } else {
        return {};
    }

}