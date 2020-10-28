import _ from 'lodash'
import axios from 'axios';
import client from '../feathers'

const PAGESIZE = 30;
const distinctArr = (value, index, self) => {
  return self.indexOf(value) === index
}

export default async function (searchInfo, skip) {
  // if all undefined, return empty
  let searchCheck = false
  Object.keys(searchInfo).map(k=>{
    if(typeof(searchInfo[k]) === 'string'){
      searchInfo[k] = searchInfo[k].toLowerCase()
      searchCheck = true
    }
  })
  if(searchCheck === false){
    return await axios.get(`${client.io.io.uri}carAdsFilter`,
      {
        params: {
          // match,
          // businessType: businessType,
          limit: PAGESIZE + skip,
          skip: skip,
        }
      }
    )
    .then((res) => {
      console.log({res});
      let data = res.data.modelList
      let stateArr = []
      res.data.modelList.map(i => {
        stateArr = stateArr.concat(i.state)
      })
      stateArr = stateArr.filter(distinctArr)
      return { data, stateArr, products:res.data.data }
    })
    .catch((err) => {
      console.log(err)
      return null
    })

    // return { data:[], stateArr:[] }
  }else{
    let skip = 0
    // remove undefined & null
    let cloneProds = _.cloneDeep(_.pickBy(searchInfo, _.identity))
    let filter = {}
    let filterAnd = []

    // AND year
    if (cloneProds.year) {
      filterAnd = filterAnd.concat(
        { 'year': { $gte: cloneProds.year[0] } },
        { 'year': { $lte: cloneProds.year[1] } }
      )
      delete cloneProds.year
    }

    // AND price
    if (cloneProds.price) {
      filterAnd = filterAnd.concat(
        { 'price': { $gte: cloneProds.price[0] } },
        { 'price': { $lte: cloneProds.price[1] } }
      )
      delete cloneProds.price
    }

    // AND mileage
    if (cloneProds.mileage) {
      filterAnd = filterAnd.concat(
        { 'mileageFilter': { $gte: cloneProds.mileage[0] } },
        { 'mileageFilter': { $lte: cloneProds.mileage[1] } }
      )
      delete cloneProds.mileage
    }

    if (filterAnd.length > 0) {
      filter['$and'] = filterAnd
    }

    let match = { $match: { ...cloneProds, ...filter } }

    return await axios.get(`${client.io.io.uri}carAdsFilter`,
      {
        params: {
          match,
          // businessType: businessType,
          limit: PAGESIZE + skip,
          skip: skip,
        }
      }
    )
    .then((res) => {
      let data = res.data.modelList
      let stateArr = []
      res.data.modelList.map(i => {
        stateArr = stateArr.concat(i.state)
      })
      stateArr = stateArr.filter(distinctArr)
      return { data, stateArr, products:res.data.data }
    })
    .catch((err) => {
      console.log(err)
      return null
    })
  }
  
}