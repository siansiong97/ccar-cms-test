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
  const { chatInfo, user } = props
  const url = "https://ccar.my/car-freaks/" + chatInfo._id 
  const oriUrl = chatInfo.title?"https://ccar.my/car-freaks/" + chatInfo._id:"https://ccar.my" 
  let desc = chatInfo.content 
  console.log({user});

  chatInfo.title = chatInfo.title + ' by ' + (user.firstName || '') + ' ' + (user.lastName || '')
  
  useEffect(()=>{
    setTimeout(() => {
      window.location.href=oriUrl
    }, 300);
  },[])
  
  const size = useWindowSize();

  if(chatInfo.code){
    return null
  }else{
    let imageUrl = chatInfo.mediaList[0].url.indexOf('.jpg')>=0?chatInfo.mediaList[0].url:chatInfo.mediaList[0].url+'.jpg'
    return (
      <>
        <Head>
          <title>CCAR - {chatInfo.title}</title>
          <meta charSet="utf-8" />
          <link rel="icon" href="https://yt3.ggpht.com/a/AATXAJyACAnnk58_qfVZqvjaTkavsxOb8dSYGeciv4a7=s88-c-k-c0x00ffffff-no-rj" />
          <link rel="canonical" href={url} />
          <meta property="title" content={chatInfo.title} key="title"/>
          <meta name="description" property="description" content={desc} />
          <meta property="fb:app_id" content="747178012753410" />
  
          <meta property="og:url" content={url} />
          <meta property="og:image" itemProp="image" content={imageUrl} />  
          <meta property="og:title" content={chatInfo.title} />
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
  const product = await fetch(`https://api.ccar.my/chats/${id}`);
  let json = await product.json();
  console.log(json.createdBy);

  const user = await fetch(`https://api.ccar.my/users?_id=${json.createdBy}`);
  let json2 = await user.json();
  console.log({json2});

  return { props: { 
    chatInfo:json,
    user:json2.data[0],
   } };
}
