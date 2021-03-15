import { Form } from '@ant-design/compatible';
import { Button, message, Modal, Tooltip } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayLengthCount, notEmptyLength } from '../../common-function';
import client from '../../feathers';
import { loading } from '../../redux/actions/app-actions';
import { clearCompareProductIds, patchCompareProductIds, removeCompareProductId } from '../../redux/actions/productsList-actions';
import { setUser } from '../../redux/actions/user-actions';



const AddCompareProductButton = (props) => {

  const [confirmModalState, setConfirmModalState] = useState(false);
  const [compareLimit, setCompareLimit] = useState(4);


  useEffect(() => {

    setCompareLimit(_.isNaN(parseInt(props.productsList.compareLimit)) ? 4 : parseInt(props.productsList.compareLimit))
  }, [props.productsList.compareLimit])

  function isSavedCompare(id) {
    if (id && notEmptyLength(props.productsList.compareIds)) {
      var check = props.productsList.compareIds.filter(function (item) {
        return item == id;
      });

      return check.length > 0;
    } else {
      return false;
    }

  }

  const pushToList = (data) => {
    if (data._id) {

      if (arrayLengthCount(_.get(props.productsList, ['compareIds'])) >= compareLimit) {
        message.warning(`Maximum ${compareLimit} products in comparison list.`)
        return;
      }
      if (notEmptyLength(props.productsList.compareIds)) {
        let ids = [];

        client.service('product-ads').find({
          query: {
            _id: {
              $in: props.productsList.compareIds,
            },
          }
        }).then(res => {
          if (notEmptyLength(res.data)) {
          } else {
            props.clearCompareProductIds();
          }

          ids = _.map(_.get(res, ['data']), '_id') || [];
          ids.push(data._id);
          props.patchCompareProductIds(ids);
          message.success('Added to comparison list')
        }).catch(err => {
          // message.error(err.message)
        });

      }
      else {
        message.success('Added to comparison list')
        props.patchCompareProductIds([data._id]);
      }
    } else {
      message.error("Product Not Found")
    }
  }

  function removeFromList(data) {
    if (data._id) {
      props.removeCompareProductId(data._id);
      message.success('Removed from comparison list')
    }
  }

  return (

    <span className={props.className ? props.className : null} style={props.style ? props.style : null}>

      <Modal
        visible={confirmModalState}
        title="Are you sure?"
        maskClosable={true}
        centered={true}
        onOk={(e) => { removeFromList(props.data); setConfirmModalState(false); }}
        onCancel={(e) => { setConfirmModalState(false) }}
      >
        <div> Do you want to remove this product from your comparison list? </div>
      </Modal>
      <Tooltip placement="top" title="Add me into the comparison list">
        {
          isSavedCompare(props.data._id) ?
            <a onClick={() => props.readOnly ? null : setConfirmModalState(true)}>
              {props.savedButton ? props.savedButton() : <Button type="normal" style={{ background: 'rgb(89, 54, 26)', padding: 0 }} className="ads-purchase-button w-100"><img src="/assets/profile/icon-list/carmarket-bar-icon/compare.png" alt="compare" /></Button>}
            </a>
            :
            <a onClick={() => props.readOnly ? null : pushToList(props.data)}>
              {props.saveButton ? props.saveButton() : <Button type="normal" className="w-100 ads-purchase-button ads-purchase-compare-btn"><img src="/assets/profile/icon-list/carmarket-bar-icon/compare.png" alt="compare" /></Button>}
            </a>
        }
      </Tooltip>
    </span>
  );
}


const mapStateToProps = state => ({
  app: state.app,
  user: state.user,
  productsList: state.productsList,
});


const mapDispatchToProps = {
  loading: loading,
  setUser: setUser,
  removeCompareProductId: removeCompareProductId,
  patchCompareProductIds: patchCompareProductIds,
  clearCompareProductIds: clearCompareProductIds,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(AddCompareProductButton)));