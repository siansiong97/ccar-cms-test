import { Button, Col, Divider, Empty, message, Row } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import { withRouter } from 'next/dist/client/router'
import BannerAnim, { Element } from 'rc-banner-anim'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { convertParameterToProductListUrl } from '../common-function'
import GlobalSearchBar from '../components/general/global-search-bar'
import LayoutV2 from '../components/general/LayoutV2'
import ReduxPersistWrapper from '../components/general/ReduxPersistWrapper'
import SocialNewTabs from '../components/news/social-new-tabs'
import SocialVideoTabs from '../components/news/social-video-tabs'
import BrandList from '../components/product-list/brand-list'
import GridProductList from '../components/product-list/grid-product-list'
import client from '../feathers'
import { fetchProductsListHome } from '../redux/actions/productsList-actions'
import { useMediaQuery } from 'react-responsive';
import { loading, updateActiveMenu } from '../redux/actions/app-actions';

const BgElement = Element.BgElement;

const searchBarRef = React.createRef();
const Index = (props) => {

  const [quickFilterType, setQuickFilterType] = useState('carMarket');
  const [brandList, setBrandList] = useState(props.brands || []);

  useEffect(() => {
    props.updateActiveMenu('1');
}, [])

  useEffect(() => {

    if (_.isArray(props.productLists) && !_.isEmpty(props.productLists)) {
      props.fetchProductsListHome(props.productLists);
    }

  }, [])

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


  const _renderCarousel = () => {

    return (
      <div>
        <Tablet>
          <BannerAnim className="carousel" prefixCls="banner-user" autoPlay>
            <Element
              prefixCls="banner-user-elem"
              key="0"
            >
              <BgElement
                key="bg"
                className="bg"
                style={{
                  backgroundImage: 'url(/banner/CCAR-Tab-Banner-TBH-March-2021.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  maxInlineSize: '-webkit-fill-available'
                }}
              />
              {/* <div className="width-100 relative-wrapper" style={{height : 250}}>
                            <img src={'/banner/CCAR-Tab-Banner-TBH-March-2021.jpg'} className="absolute-center"/>
                        </div> */}
            </Element>
            <Element
              prefixCls="banner-user-elem"
              key="1"
            >
              <BgElement
                key="bg"
                className="bg"
                style={{
                  backgroundImage: 'url(/banner/Tab-Banner-360-01.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  maxInlineSize: '-webkit-fill-available'
                }}
              />
            </Element>
            {/* <Element
                        prefixCls="banner-user-elem"
                        key="web1"
                    >
                    <BgElement
                        onClick={(e) => {window.location='https://ccar.my/banner/duit-duit-giveaway.pdf'}}
                        key="bg"
                        className="bg"
                        style={{
                        backgroundImage: 'url(/banner/CCAR-Website-Tab-Banner-01.jpg)',
                        backgroundSize: 'fit',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        maxInlineSize: '-webkit-fill-available'
                    }}
                />
            </Element> */}
            {/* <Element
              prefixCls="banner-user-elem"
              key="1"
            >
              <BgElement
                key="webbg"
                className="bg"
              />
              <video autoPlay style={{
                // overflow: 'hidden', right: videoPosition 

                position: 'fixed',
                right: '0',
                bottom: '0',
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translateX(calc((100% - 100vw) / 2))'
              }} >
                <source src="/banner/ipad-360.mp4" type="video/mp4"></source>
              </video>
            </Element> */}

            <Element
              prefixCls="banner-user-elem"
              key="1"
            >
              <BgElement
                key="bg"
                className="bg"
                style={{
                  backgroundImage: 'url(/banner/Tab-Banner-01.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  maxInlineSize: '-webkit-fill-available'
                }}
              />
            </Element>

            {/* <Element
              prefixCls="banner-user-elem"
              key="2"
            >
              <BgElement
                key="webbg"
                className="bg"
              />
              <video autoPlay style={{
                // overflow: 'hidden', right: videoPosition  
                position: 'fixed',
                right: '0',
                bottom: '0',
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translateX(calc((100% - 100vw) / 2))'

              }} >
                <source src="/banner/carfreaks-ipad.mp4" type="video/mp4"></source>
              </video>
            </Element> */}
          </BannerAnim>
        </Tablet>

        <Mobile>
          <BannerAnim prefixCls="banner-user-mobile" autoPlay>
            {/* <Element
                prefixCls="banner-user-elem"
                key="0"
            >
                <BgElement
                    key="bg"
                    className="bg"
                style={{backgroundSize:'cover'}}
                style={{width:'100%', height:'100px'}}
                />
                <video
                    autoPlay={false}
                    style={{ maxInlineSize: '-webkit-fill-available' }}  >
                    <source src="/banner/ccar-app-banner_3.mp4" type="video/mp4"></source>
                </video>
            </Element> */}
            <Element
              prefixCls="banner-user-elem"
              key="1"
            >
              <BgElement
                key="bg"
                className="bg"
                style={{
                  backgroundImage: 'url(/banner/slogan.png)',
                  backgroundSize: 'fit',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  maxInlineSize: '-webkit-fill-available'
                }}
              />
            </Element>
            <Element
              prefixCls="banner-user-elem"
              key="2"
            >
              <BgElement
                key="bg"
                className="bg"
                style={{
                  backgroundImage: 'url(/banner/375x100.png)',
                  backgroundSize: 'fit',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  maxInlineSize: '-webkit-fill-available'
                }}
              />
            </Element>
          </BannerAnim>
        </Mobile>
      </div>
    );
  }

  const _renderCarouselWeb = () => {

    return (
      <BannerAnim className="carousel" type="across" prefixCls="banner-user-web" autoPlay>
        <Element
          prefixCls="banner-user-elem"
          key="web0"
        >
          <BgElement
            id="banner-1"
            className="bg"
            style={{
              backgroundImage: 'url(/banner/CCAR-Website-Banner-TBH-March-2021-2.jpg)',
              backgroundSize: 'fit',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              maxInlineSize: '-webkit-fill-available'
            }}
          />
        </Element>

        {/* <Element
          prefixCls="banner-user-elem"
          key="web1"
        >
          <div className="width-100 relative-wrapper" style={{height : 250}}>
            <img src={'/banner/Website-Banner-360-02.jpg'} className="absolute-center"/>
          </div>
        </Element> */}

        <Element
          prefixCls="banner-user-elem"
          key="web3"
        >
          <BgElement
            id="banner-1"
            className="bg"
            style={{
              backgroundImage: 'url(/banner/Website-Banner-360-02.jpg)',
              backgroundSize: 'fit',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              maxInlineSize: '-webkit-fill-available',
            }}
          />
        </Element>

        {/* <Element
          prefixCls="banner-user-elem"
          key="web2"
        >
          <BgElement
            id="banner-3"
            className="bg"
            videoResize
          />
          <video playsInline autoPlay muted loop style={{
            // overflow: 'hidden', right: videoPosition 

            position: 'fixed',
            right: '0',
            bottom: '0',
            minWidth: '100%',
            minHeight: '100%',
            transform: 'translateX(calc((100% - 100vw) / 2))'
          }} >
            <source src="/banner/360-web-banner-2560x250.mp4" type="video/mp4"></source>
          </video>
        </Element> */}

        <Element
          prefixCls="banner-user-elem"
          key="web2"
        >
          <BgElement
            id="banner-1"
            className="bg"
            style={{
              backgroundImage: 'url(/banner/Website-Banner-02-02.jpg)',
              backgroundSize: 'fit',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              maxInlineSize: '-webkit-fill-available',
            }}
          />
        </Element>

        {/* <Element
          prefixCls="banner-user-elem"
          key="web3"
        >
          <BgElement
            id="banner-4"
            className="bg"
            videoResize
          />
          <video playsInline autoPlay muted loop style={{
            // overflow: 'hidden', right: videoPosition  
            position: 'fixed',
            right: '0',
            bottom: '0',
            minWidth: '100%',
            minHeight: '100%',
            transform: 'translateX(calc((100% - 100vw) / 2))'

          }} >
            <source src="/banner/2560x250-4.mp4" type="video/mp4"></source>
          </video>
        </Element> */}
      </BannerAnim>);
  }

  const _renderProductList = () => {
    return (
      <React.Fragment>
        <Row gutter={[10, 10]}>
          {props.productsList.productsListHome.length > 0 ?
            <GridProductList data={props.productsList.productsListHome} xs={0} sm={0} md={0} lg={8} xl={6} />
            :
            <div style={{ height: '30em' }}>
              <Empty
                style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                image="/empty.png"
                imageStyle={{
                  height: 60,
                }
                }
                description={
                  <span>
                    No Result
                  </span>
                }
              >
              </Empty>
            </div>
          }
        </Row>
      </React.Fragment>
    )
  }

  const _renderProductListRes = () => {
    return (
      <React.Fragment>
        {/* <div className=" scroller-type" style={{ overflowX: 'scroll' }}> */}
        <div>
          <Row >
            {props.productsList.productsListHome.length > 0 ?
              <GridProductList data={props.productsList.productsListHome} xs={0} sm={0} md={8} lg={0} xl={0} />
              :
              <div style={{ height: '30em' }}>
                <Empty
                  style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
                  image="/empty.png"
                  imageStyle={{
                    height: 60,
                  }
                  }
                  description={
                    <span>
                      No Result
                                    </span>
                  }
                >
                </Empty>
              </div>
            }
          </Row>
        </div>
      </React.Fragment>
    )
  }

  const _renderQuickFilter = () => {

    return (
      <React.Fragment>
        <Row>
          {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="flex-justify-space-between flex-items-align-center">
                        <span className='d-inline-block h6 ' >
                            Quick Filter
                        </span>

                    </div>
                </Col> */}
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="width-100">
              <BrandList limit={10} data={brandList} onClickBrand={(brand) => {
                if (_.get(brand, ['value'])) {
                  let path = '/';
                  if (quickFilterType == 'carMarket') {
                    path = convertParameterToProductListUrl({ make: _.toLower(brand.value) }, null);
                  } else {
                    path = `/newcar/maker/${_.toLower(brand.value)}`
                  }
                  props.router.push(path);
                } else {
                  message.error('Brand Not Found!')
                }
              }} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="flex-justify-start flex-items-align-center width-100">
              <span className='d-inline-block width-100' >
                <Divider style={{ margin: 0 }}></Divider>
              </span>
              <span className='d-inline-block flex-items-no-shrink text-align-right margin-left-md' onClick={() => {

                let path = '/';
                if (quickFilterType == 'carMarket') {
                  path = convertParameterToProductListUrl(null, null);
                } else {
                  path = `/newcar/filter`
                }
                props.router.push(path);
              }} >
                <Button className="background-ccar-button-yellow border-ccar-button-yellow black padding-x-lg" >More</Button>
              </span>
            </div>
          </Col>

        </Row>
      </React.Fragment>
    )
  }

  return (
    <ReduxPersistWrapper cookie={props.cookie}>

      <LayoutV2>

        <Row>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} >
            {_renderCarousel()}
          </Col>
          <Col xs={0} sm={0} md={0} lg={24} xl={24} >
            {_renderCarouselWeb()}
          </Col>
        </Row>

        <Desktop>
          <div className="section">
            <div className="container">
              <Row>
                <Col span={24} className="overlay-search-bar">
                  <Row >
                    <Col xs={{ span: 12, offset: 6 }} sm={{ span: 12, offset: 6 }} md={{ span: 10, offset: 7 }} lg={{ span: 10, offset: 7 }} xl={{ span: 10, offset: 7 }} >
                      <div ref={searchBarRef}>
                        <GlobalSearchBar searchTypes={props.searchTypes || ['productAds', 'carspec', 'dealerWithAds']} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="background-white margin-right-xl margin-left-xl">
                <Col xs={0} sm={0} md={24} lg={24} xl={24} className="margin-top-lg padding-x-xl">
                  {/* <SectionCarsForm /> */}
                  {_renderQuickFilter()}
                </Col>
              </Row>

              <Row gutter={[0, 0]} className="background-white  margin-right-xl margin-left-xl ">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-xl">
                  <Row>
                    <Col className="gutter-row text-align-center margin-top-sm margin-bottom-md yellow-divider" xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' >CarMarket</span></Divider>
                    </Col>
                    <Col xs={0} sm={0} md={24} lg={24} xl={24} >
                      {_renderProductList()}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-lg text-align-center">
                      <a href={convertParameterToProductListUrl()}><Button type="primary"> Show More </Button></a>
                    </Col>
                    {/* <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                                <Button type="primary"> Show More </Button>
                            </Col> */}
                  </Row>
                </Col>
              </Row>

              <Row className="background-white  margin-right-xl margin-left-xl ">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-xl">
                  <Row>
                    <Col span={24} className="margin-bottom-sm margin-top-sm text-align-center yellow-divider">
                      <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social News</span></Divider>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <SocialNewTabs />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="background-white  margin-right-xl margin-left-xl">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-xl">
                  <Row>
                    <Col className="gutter-row" span={24} className="margin-bottom-sm margin-top-sm text-align-center yellow-divider">
                      <Divider > <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social Videos</span> </Divider>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <SocialVideoTabs />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo?type=videos"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

            </div>
          </div>
        </Desktop>


        <Tablet>
          <div className="section-version3">
            <div className="container-version3">
              <Row>
                <Col span={24} className="overlay-search-bar-res">
                  <Row >
                    <Col xs={{ span: 12, offset: 6 }} sm={{ span: 12, offset: 6 }} md={{ span: 10, offset: 7 }} lg={{ span: 10, offset: 7 }} xl={{ span: 10, offset: 7 }} >
                      <div ref={searchBarRef}>
                        <GlobalSearchBar enterSearchCarFreaks={props.enterSearchCarFreaks} searchTypes={props.searchTypes || ['productAds', 'carspec', 'dealerWithAds']} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="background-white margin-x-xs">
                <Col xs={0} sm={0} md={24} lg={24} xl={24} className="margin-top-lg" style={{ padding: '15px' }}>
                  {/* <SectionCarsForm /> */}
                  {_renderQuickFilter()}
                </Col>
              </Row>

              <Row style={{ marginBottom: '10px' }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-md background-white yellow-divider">
                  <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' >CarMarket</span></Divider>
                  <Row style={{ touchAction: 'pan-y' }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {/* <div className="d-flex scroller-type" style={{ overflow: 'scroll', height: '500px'}} > */}
                      <div>
                        {_renderProductListRes()}
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-lg text-align-center">
                      <a href={convertParameterToProductListUrl()}><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginBottom: '10px' }} >
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ paddingLeft: '10px', paddingRight: '10px' }} className=" background-white yellow-divider">
                  <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social News</span></Divider>
                  {/* <h1 style={{ textAlign: 'center' }}> Social News</h1> */}
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="d-flex scroller-type"  >
                        <SocialNewTabs />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginBottom: '10px' }} >
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ paddingLeft: '10px', paddingRight: '10px' }} className=" background-white yellow-divider">
                  <Divider > <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social Videos</span> </Divider>
                  {/* <h1 style={{ textAlign: 'center' }}> Social Videos</h1> */}
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="d-flex scroller-type"  >
                        <SocialVideoTabs style={{ limit: '3' }} />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo?type=videos"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

            </div>
          </div>
        </Tablet>

        <Mobile>
          <div className="section-version3">
            <div className="container-version3">
              <Row>
                <Col span={24} className="overlay-search-bar-res">
                  <Row >
                    <Col xs={{ span: 12, offset: 6 }} sm={{ span: 12, offset: 6 }} md={{ span: 10, offset: 7 }} lg={{ span: 10, offset: 7 }} xl={{ span: 10, offset: 7 }} >
                      <div ref={searchBarRef}>
                        <GlobalSearchBar enterSearchCarFreaks={props.enterSearchCarFreaks} searchTypes={props.searchTypes || ['productAds', 'carspec', 'dealerWithAds']} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginBottom: '10px' }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="padding-x-md background-white yellow-divider">
                  <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' >CarMarket</span></Divider>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="d-flex scroller-type" style={{ overflow: 'scroll', height: '500px' }} >
                        {_renderProductListRes()}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginBottom: '10px' }} className="margin-sm">
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className=" background-white yellow-divider ">
                  <Divider> <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social News</span></Divider>
                  {/* <h1 style={{ textAlign: 'center' }}> Social News</h1> */}
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="d-flex scroller-type"  >
                        <SocialNewTabs />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginBottom: '10px' }} >
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className=" background-white yellow-divider">
                  <Divider > <span className='d-inline-block h6 font-weight-bold grey-darken-3' style={{ marginLeft: '10px' }} >Social Videos</span> </Divider>
                  {/* <h1 style={{ textAlign: 'center' }}> Social Videos</h1> */}
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="d-flex scroller-type"  >
                        <SocialVideoTabs style={{ limit: '3' }} />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="margin-top-md margin-bottom-md text-align-center">
                      <a href="/socialNewsAndVideo?type=videos"><Button type="primary"> Show More </Button></a>
                    </Col>
                  </Row>
                </Col>
              </Row>

            </div>
          </div>
        </Mobile>

      </LayoutV2>
    </ReduxPersistWrapper>
  )
}


export async function getServerSideProps(context) {

  let brandRes = await axios.get(`${client.io.io.uri}brandFilterTotalV3`, {
    params: {
      filterType: 'make'
    },
  })

  let brands = _.isArray(_.get(brandRes, ['data', 'uniqueInfo', 'makeList'])) && !_.isEmpty(_.get(brandRes, ['data', 'uniqueInfo', 'makeList'])) ? _.get(brandRes, ['data', 'uniqueInfo', 'makeList']) : [];
  brands = _.reverse(_.sortBy(brands, ['count', 'value']));
  brands = _.map(brands, 'value').slice(10)

  let kingAdsRes = await axios.get(`${client.io.io.uri}displayKingAds`)
  kingAdsRes = _.get(kingAdsRes, ['data']) || [];

  return {
    props: {
      cookie: _.get(context, ['req', 'headers', 'cookie']) || null,
      brands: brands,
      productLists: kingAdsRes,
      seoData: {
        description: ''
      }
    }
  }
}

const mapStateToProps = state => ({
  app: state.app,
  user: state.user,
  productsList: state.productsList,
});


const mapDispatchToProps = {
  fetchProductsListHome: fetchProductsListHome,
  updateActiveMenu: updateActiveMenu,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index))