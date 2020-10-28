import Head from 'next/head'
import { useRouter } from 'next/router'

const UsedCarsDetail = () => {
  const router = useRouter()
  const { pid } = router.query
  console.log(router.query);

  return (
    <>
    <Head>
        <title>USED CARS</title>
        <link rel="icon" href="/logo.png" />
        <meta name="og:title" content="USED CARS" key="title"/>
        {/* <meta name="description" content="hello" />
        <meta property="og:type" content="website" />
        <meta name="og:description" property="og:description" content="desc" />
        <meta property="og:site_name" content="ccar social" />
        <meta property="og:url" content="" />  
        <meta property="og:image" content="" />   */}
      </Head>


        <h1>USED CARS</h1>
      </>
  )
}

export default UsedCarsDetail

// export async function getServerSideProps() {
  // console.log({params});

  // let carAds = await carAdsFilter({}, 0)
  // return {
  //   props:{
  //     carAds
  //   }
  // }
// }
