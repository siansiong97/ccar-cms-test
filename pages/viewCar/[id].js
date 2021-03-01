import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import redirect from 'nextjs-redirect'
import _ from 'lodash'
import ViewCarDetailsPage from '../../components/product-list/page/ViewCarDetailsPage'
import axios from 'axios';
import client from '../../feathers'
import ReduxPersistWrapper from '../../components/general/ReduxPersistWrapper'

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
  const { carInfo, companyInfo } = props
  console.log(carInfo);
  console.log(companyInfo);
  const url = "https://ccar.my/viewCars/" + carInfo._id
  const oriUrl = !carInfo.code ? "https://ccar.my/viewCar/" + carInfo._id : "https://ccar.my"
  let desc = carInfo.user.fullName + ' | ' + companyInfo.name
  let area = companyInfo.area ? ' | ' + companyInfo.area.toUpperCase() : ''
  desc = desc + area

  const size = useWindowSize();

  if (carInfo.code) {
    return null
  } else {
    let imageUrl = carInfo.carUrl[0].url.indexOf('.jpg') >= 0 ? carInfo.carUrl[0].url : carInfo.carUrl[0].url + '.jpg'
    return (
      <ReduxPersistWrapper cookie={props.cookie}>
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

        <ViewCarDetailsPage data={carInfo || {}} />
      </ReduxPersistWrapper>
    )
  }


}

export default App

export async function getServerSideProps({ req, res }) {
  const { id } = req.params
  let promises = [];
  let carInfo = {};
  if (id) {
    promises = promises.concat(client.service('product-ads').find({
      query: {
        _id: new Object(id),
        $populate: ['companyId', 'carspecsId', 'createdBy'],
      }
    }))

    setTimeout(() => {

      axios.post(`${client.io.io.uri}processCTR`,
        {
          params: {
            adsId: id,
            source: 'web',
          }
        })

      let inputProductList = [{ productAdsId: id }]
      axios.post(`${client.io.io.uri}processImpression`,
        {
          params: {
            productList: inputProductList,
            source: 'web',
          }
        }).then((res) => { })


    }, 3000)

    carInfo = await Promise.all(promises)
    carInfo = _.get(carInfo, [0,'data']) || [];
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
      cookie: _.get(context, ['req', 'headers', 'cookie']),
    }
  };
}
