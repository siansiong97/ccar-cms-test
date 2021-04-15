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
var moment = require('moment');
const App = (props) => {
    const carInfo = _.get(props, 'carInfo') || {};
    const companyInfo = _.get(props, 'companyInfo') || {};

    const url = "https://uat2ssr.ccar.my/viewCar/" + _.get(carInfo, '_id')
    const oriUrl = !_.get(carInfo, 'code') ? "https://ccar.my/viewCar/" + _.get(carInfo, '_id') : "https://ccar.my"
    let desc = _.get(carInfo, 'user.fullName') + ' | ' + _.get(companyInfo, 'name')
    let area = _.get(companyInfo, 'area') ? ' | ' + (_.get(companyInfo, 'area') || '').toUpperCase() : ''
    desc = desc + area



    // if (carInfo.code) {
    //     return null
    // } else {
    return (
        <React.Fragment>
            <ReduxPersistWrapper cookie={props.cookie}>
                {
                    props.app.initedRedux ?
                        <ViewCarDetailsPage data={carInfo || {}} />
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
        let basePath = checkEnvReturnCmsUrl(client.io.io.uri)
        
        if (id) {

            carInfo = await client.service('product-ads').find({
                query: {
                    _id: new Object(id),
                    $populate: ['companyId', 'carspecsId', 'createdBy'],
                }
            })

            carInfo = _.get(carInfo, ['data']) || [];
            carInfo = carInfo.map(function (v) {
                v.companys = v.companyId
                v.carspecsAll = v.carspecsId
                return v;
            })
            carInfo = _.get(carInfo, [0]) || {};
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
        if(!carInfo.addonSpotlight){carInfo.addonSpotlight=null}
        if(!carInfo.addonSpicydeal){carInfo.addonSpicydeal=null}
        if(!carInfo.addonKingadType){carInfo.addonKingadType=null}
        if(!carInfo.addonKingadType2){carInfo.addonKingadType2=null}
        if(!carInfo.addonKingadType3){carInfo.addonKingadType3=null}

        let title = _.get(carInfo, ['title']) || null
        let description = `${_.get(carInfo, 'companyId.name') || ''} | ${_.get(carInfo, 'description') || ''}` || null;
         
        let ogDescription = _.get(carInfo, 'user.fullName') + ' | ' + _.get(carInfo, 'companyId.name')
        let imageUrl = (_.get(carInfo, ['carUrl', 0, 'url']) || '').indexOf('.jpg') >= 0 ? _.get(carInfo, ['carUrl', 0, 'url']) : (_.get(carInfo, ['carUrl', 0, 'url']) || '') + '.jpg';
        let url = `${basePath}${req.url || ''}`;
        return {
            props: {
                carInfo: carInfo || {},
                // dealerInfo:json2,
                companyInfo: _.get(carInfo, ['companyId']) || {},
                cookie: _.get(req, ['headers', 'cookie']) || null,
                seoData: {
                    title: title,
                    description: description,
                    facebookAppId: "747178012753410",
                    canonical: url,
                    openGraph: {
                        title: _.get(carInfo, ['title']) || null,
                        description: description,
                        url: url,
                        type: 'website',
                        site_name: 'CCAR SDN BHD',
                        images: [
                            {
                                url: imageUrl,
                                alt: `${_.get(carInfo, 'carspec.make') || ''} ${_.get(carInfo, 'carspec.model' || '')} image` || 'Car Sample Image',
                            }
                        ]
                    }

                }
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
