import { useRouter } from 'next/router'

const UsedCars = () => {
  const router = useRouter()
  const { pid } = router.query
  console.log(router.query);

  return <p>List: {pid}</p>
  // return (
  //   <h1>Used Cars</h1>
  // )
}

export default UsedCars

// export async function getServerSideProps() {
  // console.log({params});

  // let carAds = await carAdsFilter({}, 0)
  // return {
  //   props:{
  //     carAds
  //   }
  // }
// }
