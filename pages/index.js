// import { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import client from '../feathers'
import carAdsFilter from '../api/carAdsFilter'

const Index = ({carAds}) => {
  console.log({carAds});
  // useEffect(() => {
  //   const timer = props.startClock()

  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [props])

  return (
    <Layout>
      <Head>
        <title>CCAR SOCIAL HOME</title>
        <link rel="icon" href="/logo.png" />
        <meta name="og:title" content="CCAR SOCIAL HOME" key="title"/>
        {/* <meta name="description" content="hello" />
        <meta property="og:type" content="website" />
        <meta name="og:description" property="og:description" content="desc" />
        <meta property="og:site_name" content="ccar social" />
        <meta property="og:url" content="" />  
        <meta property="og:image" content="" />   */}
      </Head>
    </Layout>
  )
}

export default Index

export async function getServerSideProps(params) {
  console.log({params});

  let carAds = await carAdsFilter({}, 0)
  return {
    props:{
      carAds
    }
  }
}
