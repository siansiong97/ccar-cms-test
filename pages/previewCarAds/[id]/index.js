import axios from 'axios'
import _ from 'lodash'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper'
import ViewCarDetailsPage from '../../../components/product-list/page/ViewCarDetailsPage'
import client from '../../../feathers'
import { withRouter } from 'next/router'
import { checkEnvReturnCmsUrl } from '../../../functionContent'
import { connect } from 'react-redux'
import PreviewCarDetailsPage from '../../../components/product-list/page/PreviewCarDetailsPage'
var moment = require('moment');
const App = (props) => {



    // if (carInfo.code) {
    //     return null
    // } else {
    return (
        <React.Fragment>
            <ReduxPersistWrapper cookie={props.cookie}>
                {
                    props.app.initedRedux ?
                        <PreviewCarDetailsPage data={_.get(props, 'carInfo') || {}} />
                        :
                        null
                }
            </ReduxPersistWrapper>
        </React.Fragment>
    )
    // }


}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))

export async function getServerSideProps({ req, res, }) {
    try {
        const { id } = req.params
        let carInfo = {
            condition: '', companys: {}, carspecsAll: {}, registrationUrl: {}
        };
        if (id) {

            if (id === 'record') {
                let splitPath = _.get(Object.entries(req.query), [0]);

                carInfo = await client.service('product-ads').find({
                    query: {
                        _id: splitPath[0],
                        $populate: ['companyId', 'carspecsId', 'createdBy'],
                    }
                })
            } else {
                carInfo = await client.service('product-ads-preview').find({
                    query: {
                        _id: id,
                        $populate: ['companyId', 'carspecsId', 'createdBy'],
                    }
                })
            }

            carInfo = _.get(carInfo, ['data']) || [];
            carInfo = carInfo.map(function (v) {
                v.companys = v.companyId || {}
                v.carspecsAll = v.carspecsId || {}
                return v;
            })
            carInfo = _.get(carInfo, [0]) || { condition: '', companys: {}, carspecsAll: {}, registrationUrl: {} };
            const currentDateTime = moment().format()


            carInfo.addonSpotlight = _.find(carInfo.addon, { 'addonType': 'spotlight' })
            carInfo.addonSpicydeal = _.find(carInfo.addon, { 'addonType': 'spicydeal' })
            carInfo.addonKingadType = _.find(carInfo.addon, { 'addonType': 'kingad', 'showPrice': 'show' })
            carInfo.addonKingadType2 = _.find(carInfo.addon, { 'addonType': 'kingad', 'showPrice': 'hide' })
            carInfo.addonKingadType3 = _.find(carInfo.addon, { 'addonType': 'kingad', 'showPrice': 'highlight' })
            let priority = ''
            if (priority === '') {

                if (carInfo.addonKingadType) {
                    if (currentDateTime > moment(carInfo.addonKingadType.startDate).format() && currentDateTime < moment(carInfo.addonKingadType.endDate).format()) {
                        priority = 'addonKingadType'
                        carInfo.priority = 'addonKingadType'
                        carInfo.addonKingadType.endDate = moment(carInfo.addonKingadType.endDate).format()
                        carInfo.addonKingadType.startDate = moment(carInfo.addonKingadType.startDate).format()
                    }
                }
            }

            if (priority === '') {
                if (carInfo.addonKingadType2) {
                    if (currentDateTime > moment(carInfo.addonKingadType2.startDate).format() && currentDateTime < moment(carInfo.addonKingadType2.endDate).format()) {
                        priority = 'addonKingadType2'
                        carInfo.priority = 'addonKingadType2'
                        carInfo.addonKingadType2.startDate = moment(carInfo.addonKingadType2.startDate).format()
                        carInfo.addonKingadType2.endDate = moment(carInfo.addonKingadType2.endDate).format()
                    }
                }
            }

            if (priority === '') {
                if (carInfo.addonKingadType3) {
                    if (currentDateTime > moment(carInfo.addonKingadType3.startDate).format() && currentDateTime < moment(carInfo.addonKingadType3.endDate).format()) {
                        priority = 'addonKingadType3'
                        carInfo.priority = 'addonKingadType3'
                        carInfo.addonKingadType3.startDate = moment(carInfo.addonKingadType3.startDate).format()
                        carInfo.addonKingadType3.endDate = moment(carInfo.addonKingadType3.endDate).format()
                    }
                }
            }

            if (priority === '') {
                if (carInfo.addonSpicydeal) {
                    if (currentDateTime > moment(carInfo.addonSpicydeal.startDate).format() && currentDateTime < moment(carInfo.addonSpicydeal.endDate).format()) {
                        priority = 'addonSpicydeal'
                        carInfo.priority = 'addonSpicydeal'
                        carInfo.addonSpicydeal.startDate = moment(carInfo.addonSpicydeal.startDate).format()
                        carInfo.addonSpicydeal.endDate = moment(carInfo.addonSpicydeal.endDate).format()
                    }
                }
            }

            if (priority === '') {
                if (carInfo.addonSpotlight) {
                    if (currentDateTime > moment(carInfo.addonSpotlight.startDate).format() && currentDateTime < moment(carInfo.addonSpotlight.endDate).format()) {
                        priority = 'addonSpotlight'
                        carInfo.priority = 'addonSpotlight'
                        carInfo.addonSpotlight.startDate = moment(carInfo.addonSpotlight.startDate).format()
                        carInfo.addonSpotlight.endDate = moment(carInfo.addonSpotlight.endDate).format()
                    }
                }
            }
        }
        if (!carInfo.addonSpotlight) { carInfo.addonSpotlight = null }
        if (!carInfo.addonSpicydeal) { carInfo.addonSpicydeal = null }
        if (!carInfo.addonKingadType) { carInfo.addonKingadType = null }
        if (!carInfo.addonKingadType2) { carInfo.addonKingadType2 = null }
        if (!carInfo.addonKingadType3) { carInfo.addonKingadType3 = null }

        return {
            props: {
                carInfo: carInfo || {},
                // dealerInfo:json2,
                companyInfo: _.get(carInfo, ['companyId']) || {},
                cookie: _.get(req, ['headers', 'cookie']) || null,
            }
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                carInfo: {},
                // dealerInfo:json2,
                companyInfo: {},
                cookie: _.get(req, ['headers', 'cookie']) || null,
            }
        };
    }
}
