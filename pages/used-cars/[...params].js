import { useRouter } from 'next/router'

const UsedCars = () => {
  const router = useRouter()
  const { pid } = router.query

  return <p>List: {pid}</p>
  // return (
  //   <h1>Used Cars</h1>
  // )
}

export default UsedCars

// export async function getServerSideProps() {

  // let carAds = await carAdsFilter({}, 0)
  // return {
  //   props:{
  //     carAds
  //   }
  // }
// }
