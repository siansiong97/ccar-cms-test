import Head from 'next/head'
import { useState, useEffect  } from 'react'
import { useRouter } from 'next/router'
import redirect from 'nextjs-redirect'
import _ from 'lodash'
import client from '../../feathers'

const io = require('socket.io-client');
// const domain = 'https://ccar.my'
const domain = 'https://uat2.ccar.my'
const apiDomain = 'https://stream.ccar.my'
// const apiDomain = 'http://192.168.0.118:3030'
const App = (props) => {
  const {broadCastInfo, thumbnail} = props
  // const oriUrl = !carInfo.code?domain+"/live/" + carInfo._id:domain
  
  useEffect(()=>{
    setTimeout(() => {
      window.location.href=domain + '/live/' + broadCastInfo.id
    }, 500);
  },[])

    return (
      <>
        <Head>
          <title>CCAR LIVE {broadCastInfo.user} ({broadCastInfo.companyName})</title>
          <meta charSet="utf-8" />
          <link rel="icon" href={thumbnail} />
          <link rel="canonical" href={domain} />
          <meta property="title" content={'CCAR LIVE-' +  broadCastInfo.user} key="title"/>
          <meta name="description" property="description" content={broadCastInfo.title} />
          <meta property="fb:app_id" content="747178012753410" />
  
          <meta property="og:url" content={domain} />
          <meta property="og:image" itemProp="image" content={thumbnail} />  
          <meta property="og:title" content={'CCAR LIVE-' + broadCastInfo.user} />
          <meta property="og:description" content={broadCastInfo.title} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="CCAR SDN BHD" />
        </Head>
      </>
    )
  // }
}

export default App

export async function getServerSideProps({req,res}) {
  const { id } = req.params 
  const { user, title, companyName } = req.query
  let broadCastInfo = {user, title, id, companyName}
  // let socket = io(client.io.io.uri, { query:{share:true, dealerSockerId:id} })
  // socket.on('getBroadcasterInfoReply', (data)=>{broadCastInfo = data })

  return { props: { 
    thumbnail:`${apiDomain}/dealerVideoThumbnails/${id}.png`,
    broadCastInfo,
   } };
}
