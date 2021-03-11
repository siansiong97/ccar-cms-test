import 'antd/dist/antd.css';
import '../styles/index.css';
import '../styles/overwrite.css';
import '../styles/main.css';
import '../styles/sellCar.css';
import '../styles/viewProducts.css';
import '../styles/color.css';
import '../styles/common.css';
import '../styles/animation.css';
import '../styles/newcar.css';
import 'rc-banner-anim/assets/index.css';
import 'react-image-lightbox/style.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import '@brainhubeu/react-carousel/lib/style.css';
import "emoji-mart/css/emoji-mart.css";
import 'react-quill/dist/quill.snow.css'; // ES6

import { wrapper, store } from "../redux/store";
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import withRedux from "next-redux-wrapper";
import { Provider } from 'react-redux';
import _ from 'lodash';
import { PageTransition } from '../components/general/PageTransition';
import { RouterContextProvider } from '../hooks/useRouter';
import { checkEnvReturnCmsUrl } from '../functionContent';
import client from '../feathers';
import { ccarWebLogo400X150 } from '../icon';



const WrappedApp = ({ Component, pageProps, router }) => {

  let seoData = _.isPlainObject(_.get(pageProps, ['seoData'])) && !_.isEmpty(_.get(pageProps, ['seoData'])) ? _.get(pageProps, ['seoData']) : {};
  let title = _.get(seoData, ['title']) || 'CCAR.MY | #1 Car Social Platform'
  let basePath = checkEnvReturnCmsUrl(client.io.io.uri);
  let url = seoData.url || `${basePath}${router.asPath}`;
  console.log('router', router);

  return (
    <React.Fragment>
      <NextSeo
        title={title}
        description={seoData.description}
        canonical={seoData.canonical || url}
        openGraph={_.isPlainObject(seoData.openGraph) && !_.isEmpty(seoData.openGraph) ? seoData.openGraph : {
          title: title,
          description: seoData.description,
          url: url,
          type: 'website',
          site_name: 'CCAR SDN BHD',
          images: [
            {
              url: `${basePath}${ccarWebLogo400X150}`,
              alt: `CCAR Logo`,
            }
          ]
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
        facebook={{
          appId: seoData.facebookAppId || '747178012753410'
        }}
      />
      <Head>
        <link rel="icon" href="https://yt3.ggpht.com/a/AATXAJyACAnnk58_qfVZqvjaTkavsxOb8dSYGeciv4a7=s88-c-k-c0x00ffffff-no-rj" />
      </Head>
      <RouterContextProvider>
        <PageTransition>
          <Component {...pageProps} key={router.route} />
        </PageTransition>
      </RouterContextProvider>
    </React.Fragment>
  )
}

export default wrapper.withRedux(WrappedApp)
