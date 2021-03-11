import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Icon, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { clearCompareProductIds, removeCompareProductId, updateActiveIdProductList } from '../../redux/actions/productsList-actions';
import client from '../../feathers';
import { withRouter } from 'next/dist/client/router';
import { notEmptyLength } from '../../common-function';
import GridProductList from '../product-list/grid-product-list';
import Link from 'next/link';


const CompareFloatingButton = (props) => {
  const refCompare = useRef();
  const [visible, setVisible] = useState(false)
  const [productList, setProductList] = useState([])

  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.id != 'compare') {
        if (refCompare.current && !refCompare.current.contains(event.target)) {
          setVisible(false)
        }
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refCompare]);

  useEffect(() => {

    if (notEmptyLength(props.productsList.compareIds)) {
      client.service('product-ads').find({
        query: {
          _id: {
            $in: props.productsList.compareIds,
          },
          $populate: [
            {
              path: 'carspecsId',
              ref: 'carspecs'
            },
            {
              path: 'companyId',
              ref: 'companys'
            },
            {
              path: 'createdBy',
              ref: 'users'
            }
          ],
        }
      }).then(res => {
        if (notEmptyLength(res.data)) {
          setProductList(res.data.map(function (item) {
            item.companys = item.companyId;
            item.carspecsAll = item.carspecsId;
            return item;
          }))
        } else {
          setProductList([]);
        }
      }).catch(err => {
        // message.error(err.message);
        props.clearCompareProductIds();
      });
    } else {
      setProductList([]);
    }
  }, [props.productsList.compareIds])


  const toggle = () => {
    visible == true ? setVisible(false) : setVisible(true)
  }

  const _renderCondition = (v) => {
    let condDesc = v.condition.toUpperCase()
    if (v.condition == 'used') {
      return (
        <div className="wrap-condition wrap-condition-used" style={{ marginTop: 3 }}>
          <p>{condDesc}</p>
        </div>
      )
    } else if (v.condition == 'recon') {
      return (
        <div className="wrap-condition wrap-condition-recon" style={{ marginTop: 3 }}>
          <p>{condDesc}</p>
        </div>
      )
    } else {
      return (
        <div className="wrap-condition wrap-condition-new" style={{ marginTop: 3 }}>
          <p>New</p>
        </div>
      )
    }
  }

  return (
    <div>
      {visible === false ?
        productList.length > 0 ? (
          <div className="wrap-compare-btn">
            <Button onClick={() => toggle()} id="compare">
              <img src="/assets/CarListingIconMobile/car-compare.png" className="w-100" />
            </Button>
          </div>
        ) : null
        :
        <div className="wrap-compare-btn-circle">
          <Button onClick={() => toggle()} className="w-100" id="compare">
            <CloseOutlined />
          </Button>
        </div>
      }

      {visible === true ? (
        <div ref={refCompare}>
          <Card
            title="Compare Car"
            size="small"
            className="card-compare card-padding-0"
            bordered={true}
            extra={<Button onClick={() => { props.clearCompareProductIds(); toggle(); }}> Clear All</Button>}
          >
            <Scrollbars style={{ width: '100%', maxWidth: window.innerWidth * 0.7 }} autoHide autoHeight autoHeightMax='70vh'>
              {
                notEmptyLength(productList) ?
                  <React.Fragment>
                    <div className="flex-justify-start flex-items-align-center padding-sm">
                      {
                        _.map(productList, function (item) {
                          return (
                            <span className="d-inline-block margin-right-md flex-items-no-shrink" style={{ width: 300 }}>
                              <GridProductList data={[item]} xs={24} sm={24} md={24} lg={24} xl={24}
                                topRight={(v) => {
                                  return (
                                    <span className='d-inline-block background-black-opacity-50 padding-x-sm' >
                                      <Icon type="close" style={{ cursor: 'pointer', fontSize: '15px' }} onClick={() => { props.removeCompareProductId(v._id) }} />
                                    </span>
                                  )
                                }}
                              />
                            </span>
                          )
                        })
                      }
                    </div>
                  </React.Fragment>
                  :
                  <Empty style={{ margin: 30 }} />
              }
            </Scrollbars>

            <Row style={{ margin: 10 }}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Link shallow={false} prefetch href={'/compare'} >
                  <a>
                    <Button
                      style={{ fontWeight: 'bold' }}
                      type="primary"
                    >Confirm & Compare</Button>
                  </a>
                </Link>
              </Col>
            </Row>
          </Card>
        </div>
      ) : null
      }
    </div >
  );
}

function mapStateToProps(state) {
  return {
    productsList: state.productsList,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeCompareProductId: removeCompareProductId,
    updateActiveIdProductList: updateActiveIdProductList,
    clearCompareProductIds: clearCompareProductIds,
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CompareFloatingButton));