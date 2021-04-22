import _ from 'lodash'
import axios from 'axios';
import client from '../feathers'
import { isValidNumber, notEmptyLength, convertToRangeFormat, convertRangeFormatBack, convertFilterRange, objectRemoveEmptyValue } from '../common-function';

const PAGESIZE = 30;
const distinctArr = (value, index, self) => {
  return self.indexOf(value) === index
}

export default async function (data, limit) {

  if (!_.isPlainObject(data)) {
    data = {};
  }

  if (!_.has(data, ['filterGroup'])) {
    data.filterGroup = {};
  } else {
    data.filterGroup = _.cloneDeep(data.filterGroup)
  }

  if (!_.has(data, ['config'])) {
    data.config = {
      page: 1,
      sorting: {},
    };
  }

  if (!isValidNumber(parseInt(limit))) {
    limit = PAGESIZE;
  }

  if (!isValidNumber(parseInt(data.config.page))) {
    data.config.page = 1;
  }

  if (!_.get(data.config, ['sorting', 'carspec.year']) && !_.get(data.config, ['sorting', 'mileageFilter']) && !_.get(data.config, ['sorting', 'searchPrice'])) {
    data.config.sorting = {};
  }

  let andFilter = { $and: [] }

  if (_.isArray(data.filterGroup.$and) && !_.isEmpty(data.filterGroup.$and)) {
    andFilter.$and = [...data.filterGroup.$and];
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
    data.filterGroup.engineCapacityRange = convertToRangeFormat(data.filterGroup.engineCapacityRange);
    data.filterGroup.engineCapacityRange = convertFilterRange(data.filterGroup.engineCapacityRange, 'carspec.engineCapacity')
    if (notEmptyLength(data.filterGroup.engineCapacityRange)) {
      andFilter.$and = [...andFilter.$and, ...data.filterGroup.engineCapacityRange]
      data.filterGroup = Object.assign(data.filterGroup, andFilter)
    }
    delete data.filterGroup.engineCapacityRange;
  }


  data.filterGroup = objectRemoveEmptyValue(data.filterGroup);
  let match = { $match: { ...data.filterGroup } }
  console.log(match);
  console.log(data.config.sorting);
  return await axios.get(`${client.io.io.uri}carAdsFilterV3`,
    {
      params: {
        match,
        sorting: data.config.sorting,
        limit: limit,
        skip: (data.config.page - 1) * limit,
      }
    }
  ).then((res) => {
    return res.data;
  })
    .catch((err) => {
      return {};
    })

}