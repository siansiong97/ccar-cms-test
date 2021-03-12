import axios from 'axios'
import _ from 'lodash'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper'
import ViewCarDetailsPage from '../../../components/product-list/page/ViewCarDetailsPage'
import client from '../../../feathers'
import { withRouter } from 'next/router'
import { checkEnvReturnCmsUrl } from '../../../functionContent'

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

export default withRouter(App)

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
        }

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
