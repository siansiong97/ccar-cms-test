import Head from 'next/head'
import { useRouter } from 'next/router'
const UsedCarsDetail = (props) => {
  const {title, imageUrl} = props
  const router = useRouter()
  let contentDesc =  "-happy 567 works!"
  return (
    <>
    <Head>
      <title>USED CARS 13 </title>
      <meta charset="utf-8" />
      <link rel="icon" href="https://yt3.ggpht.com/a/AATXAJyACAnnk58_qfVZqvjaTkavsxOb8dSYGeciv4a7=s88-c-k-c0x00ffffff-no-rj" />
      <link rel="canonical" href="https://helmet.ccar.my/used-cars/9990/2" />
      <meta property="title" content="USED CARS" key="title"/>
      <meta name="description" property="description" content={contentDesc} />
      <meta property="fb:app_id" content="747178012753410" />

      <meta property="og:url" content="https://helmet.ccar.my/used-cars/9990/2" />  
      <meta property="og:image" itemprop="image" content={imageUrl} />  
      <meta property="og:title" content={title} />
      <meta property="og:description" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ccar social" />

    </Head>
    <h1>USED CARS {title}</h1>


      </>
  )
}

export default UsedCarsDetail

export async function getServerSideProps({req,res}) {
  const { pid, title } = req 
  // const res = await fetch(`https://restcountries.eu/rest/v2/name/${id}`);
  // const country = await res.json();
  // let result = JSON.stringify(req)
  // console.log(`Fetched place: ${country.name}`);
  return { props: { 
    // pid, 
    // title,
    imageUrl:"https://ccar.s3.ap-southeast-1.amazonaws.com/images/24e3cddab61553f4ad5bb74ef18ba68a964bfdb831ec8bd620ca3e2dad06e00b.jpg",
    title:"hello ccar 123095"
   } };
}
