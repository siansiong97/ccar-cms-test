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

import { wrapper } from "../redux/store";



const WrappedApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default wrapper.withRedux(WrappedApp)
