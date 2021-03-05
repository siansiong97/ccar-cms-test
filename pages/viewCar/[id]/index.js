import axios from 'axios'
import _ from 'lodash'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper'
import ViewCarDetailsPage from '../../../components/product-list/page/ViewCarDetailsPage'
import client from '../../../feathers'
import { withRouter } from 'next/router'


function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }

            // Add event listener
            window.addEventListener("resize", handleResize);

            // Call handler right away so state gets updated with initial window size
            handleResize();

            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

const App = (props) => {
    const carInfo = _.get(props, 'carInfo') || {};
    const companyInfo = _.get(props, 'companyInfo') || {};

    const url = "https://uat2ssr.ccar.my/viewCar/" + _.get(carInfo, '_id')
    const oriUrl = !_.get(carInfo, 'code') ? "https://ccar.my/viewCar/" + _.get(carInfo, '_id') : "https://ccar.my"
    let desc = _.get(carInfo, 'user.fullName') + ' | ' + _.get(companyInfo, 'name')
    let area = _.get(companyInfo, 'area') ? ' | ' + (_.get(companyInfo, 'area') || '').toUpperCase() : ''
    desc = desc + area

    const size = useWindowSize();


    if (carInfo.code) {
        return null
    } else {
        let imageUrl = (_.get(carInfo, ['carUrl', 0, 'url']) || '').indexOf('.jpg') >= 0 ? _.get(carInfo, ['carUrl', 0, 'url']) : (_.get(carInfo, ['carUrl', 0, 'url']) || '') + '.jpg'
        return (
            <React.Fragment>
                <Head>
                    <title>CCAR - {carInfo.title}</title>
                    <meta charSet="utf-8" />
                    <link rel="icon" href="https://yt3.ggpht.com/a/AATXAJyACAnnk58_qfVZqvjaTkavsxOb8dSYGeciv4a7=s88-c-k-c0x00ffffff-no-rj" />
                    <link rel="canonical" href={url} />
                    <meta property="title" content={carInfo.title} key="title" />
                    <meta name="description" property="description" content={desc} />
                    <meta property="fb:app_id" content="747178012753410" />

                    <meta property="og:url" content={url} />
                    <meta property="og:image" itemProp="image" content={imageUrl} />
                    <meta property="og:title" content={carInfo.title} />
                    <meta property="og:description" content={desc} />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="CCAR SDN BHD" />
                </Head>

                <ReduxPersistWrapper cookie={props.cookie}>
                    <ViewCarDetailsPage data={carInfo || {}} />
                </ReduxPersistWrapper>
            </React.Fragment>
        )
    }


}

export default withRouter(App)

export async function getServerSideProps({ req, res }) {
    try {
        const { id } = req.params
        let carInfo = {};
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

        return {
            props: {
                carInfo: carInfo || {},
                // dealerInfo:json2,
                companyInfo: _.get(carInfo, ['companyId']) || {},
                cookie: _.get(req, ['headers', 'cookie']),
            }
        };
    } catch (error) {
        return {
            props: {
                carInfo: {},
                // dealerInfo:json2,
                companyInfo: {},
                cookie: _.get(req, ['headers', 'cookie']),
            }
        };
        console.log(error);
    }
}
