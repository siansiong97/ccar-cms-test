import Head from 'next/head'
import { useState, useEffect  } from 'react'
import { useRouter } from 'next/router'
import redirect from 'nextjs-redirect'
import _ from 'lodash'

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
  const {carInfo, companyInfo} = props
  const url = "https://ccar.my/viewCars/" + carInfo._id
  const oriUrl = !carInfo.code?"https://ccar.my/viewCar/" + carInfo._id:"https://ccar.my"
  let desc = carInfo.user.fullName + ' | ' + companyInfo.name
  let area = companyInfo.area? ' | ' + companyInfo.area.toUpperCase() : ''
  desc = desc + area

  
  useEffect(()=>{
    setTimeout(() => {
      window.location.href=oriUrl
    }, 500);
  },[])

  const size = useWindowSize();

  if(carInfo.code){
    return null
  }else{
    let imageUrl = carInfo.carUrl[0].url.indexOf('.jpg')>=0?carInfo.carUrl[0].url:carInfo.carUrl[0].url+'.jpg'
    return (
      <>
        <Head>
          <title>CCAR - {carInfo.title}</title>
          <meta charSet="utf-8" />
          <link rel="icon" href="https://yt3.ggpht.com/a/AATXAJyACAnnk58_qfVZqvjaTkavsxOb8dSYGeciv4a7=s88-c-k-c0x00ffffff-no-rj" />
          <link rel="canonical" href={url} />
          <meta property="title" content={carInfo.title} key="title"/>
          <meta name="description" property="description" content={desc} />
          <meta property="fb:app_id" content="747178012753410" />
  
          <meta property="og:url" content={url} />
          <meta property="og:image" itemProp="image" content={imageUrl} />  
          <meta property="og:title" content={carInfo.title} />
          <meta property="og:description" content={desc} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="CCAR SDN BHD" />
        </Head>
      </>
    )
  }
  

}

export default App

export async function getServerSideProps({req,res}) {
  const { id } = req.params 
  const product = await fetch(`https://api.ccar.my/product-ads/${id}`);
  let json = await product.json();
  // const dealer = await fetch(`https://api.ccar.my/users/${id}`);
  // let json2 = await dealer.json();
  const company = await fetch(`https://api.ccar.my/companys/${json.companyId}`);
  let json3 = await company.json();

  return { props: { 
    carInfo:json,
    // dealerInfo:json2,
    companyInfo:json3,
   } };
}
