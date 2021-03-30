import { Divider, Form, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { notEmptyLength } from '../../../common-function';
import client from '../../../feathers';
import { loading, updateActiveMenu } from '../../../redux/actions/app-actions';
import { fetchCarDetails, fetchCarName, fetchCompareNewCarIds, fetchPeerCompareCars } from '../../../redux/actions/newcars-actions';
import LayoutV2 from '../../general/LayoutV2';
import CompareNewCarIndex from '../CompareNewCarIndex';
import NewCarMenu from '../NewCarMenu';
import NewCarOverview from '../NewCarOverview';


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

var PAGESIZE = 10

let arr = [
  { name: "string 1", value: "this", other: "that" },
  { name: "string 2", value: "this", other: "that" }
];
let obj = arr;

const RATINGPAGESIZE = 5;

class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      view: 'overview',
      minOffsetTop: 0,
    };

    this.changeTabs = this.changeTabs.bind(this);
  }


  UNSAFE_componentWillMount() {
    this.getData(0);
    this.props.updateActiveMenu('1')
  }

  componentDidMount() {
    this.setState(({
      minOffsetTop: document.getElementById('menu-bar').getBoundingClientRect().height,
    }))
  }
  componentDidUpdate(prevProps, prevState) {
    if (_.get(prevProps, ['router', 'query', 'make']) != _.get(this.props, ['router', 'query', 'make']) || _.get(prevProps, ['router', 'query', 'model']) != _.get(this.props, ['router', 'query', 'model'])) {
      this.setState({
        activeKey: '1',
        view: 'overview',
      })
      this.getData(0);
      window.scroll(0, 0);
    }
  }

  changeTabs(view) {
    if (view == null || view == '') {

      this.setState({
        view: 'overview'
      })
    } else {

      this.setState({
        view: view
      })
    }
  }


  getData = (skip) => {

    this.props.loading(true);
    axios.get(`${client.io.io.uri}priceRangeSearchNew`,
      {
        params: {
          match: { make: (_.get(this.props, ['router', 'query', 'make']) || '').toLowerCase(), model: (_.get(this.props, ['router', 'query', 'model']) || '').toLowerCase() },
          limit: PAGESIZE + skip,
          newCar: 'yes',
          skip: skip,
        }
      }
    ).then((res) => {
 
      this.props.loading(false);
      let variantsId = []
      res.data.data[0].variants.map(function (item) {
        variantsId.push(new Object(item._id))
      })

 
      this.props.fetchCompareNewCarIds(variantsId);

      if (notEmptyLength(res.data.data)) {
        res.data.data.map((v) => {
          v._id = v.id
          v.price = v.minPrice ? v.minPrice : 0
          v.carUrl = []
          v.carUrl.push({ url: v.uri })
          v.specification = [{
            category: v.specification.category,
            field: v.specification.field,
            value: v.specification.value,
          }]
          v.variants = v.variants.map(function (variant) {
            variant.name = `${_.capitalize(v.make)} ${_.capitalize(v.model)} ${_.capitalize(variant.variant)}`;
            return variant;
          })
          v.carspecsAll = _.cloneDeep(v)
          return v
        })
        this.props.fetchCarName(res.data.data[0])

        this.props.loading(true);
        axios.get(`${client.io.io.uri}priceRangeSearchNew`,
          {
            params: {
              match: { bodyType: res.data.data[0].bodyType },
              newCar: 'yes',
              limit: PAGESIZE + skip,
              skip: skip,
              sorting: "year:-1"
            }
          }
        ).then((res1) => {

          this.props.loading(false);
          let arrayRecord = []

          try {
            arrayRecord = _.cloneDeep(res1.data.data)
          }
          catch (err) {
            arrayRecord = []
          }

          let finalResult = []
          arrayRecord.slice(0, 5).map((item, i) => {
            finalResult.push(item);
          });
          this.props.fetchPeerCompareCars(finalResult);
        })
      }
    })
      .catch((err) => {
        this.props.loading(false);
        message.error(err.message);
      })
  }

  _renderView = () => {
    switch (this.state.view) {
      case 'overview':
        return <NewCarOverview changeTabs={this.changeTabs} ></NewCarOverview>
        break;
      case 'specs':
        return <CompareNewCarIndex />
        break;
      default:
        return null;
        break;
    }
  }
  render() {

    return (
      <LayoutV2>
        <Desktop>
          <div className='section'>
            <div className="container">
              <NewCarMenu view={this.state.view} onChange={(view) => { this.setState({ view: view }) }} />
              <Divider style={{ marginTop: '0px', height: '2px' }} />
              <div className="margin-top-lg">
                {this._renderView()}
              </div>
            </div>
          </div>
        </Desktop>

        <Tablet>
          <div className='section'>
            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              <NewCarMenu  view={this.state.view} onChange={(view) => { this.setState({ view: view }) }} />
              <Divider style={{ marginTop: '0px', height: '2px' }} />
              <div className="margin-top-lg">
                {this._renderView()}
              </div>
            </div>
          </div>
        </Tablet>
        
      </LayoutV2>

    );
  }

}

const mapStateToProps = state => ({
  newCars: state.newcars || state.newCars,
  productsList: state.productsList,
  user: state.user,
});

const mapDispatchToProps = {
  loading: loading,
  fetchCarName: fetchCarName,
  fetchCarDetails: fetchCarDetails,

  fetchCompareNewCarIds: fetchCompareNewCarIds,
  fetchPeerCompareCars: fetchPeerCompareCars,
  updateActiveMenu: updateActiveMenu
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Details)));