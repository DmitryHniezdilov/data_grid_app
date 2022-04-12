import { Typography } from '@mui/material'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { useQuery } from '@apollo/client'
import { GET_CATEGORIES } from '../lib/queries'

const IndexPage = () => {
  const { loading, error, data = {} } = useQuery(GET_CATEGORIES)

  const {data: categories} = data.categories || {}

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return JSON.stringify(error)
  }

  return (
    categories && (
      <Layout categories={categories} isMenuOpen={true}>
        <Typography paragraph>
          1. Created new spreadsheet on route "/data". Link in header. Deleted spreadsheet, category only from admin panel ( more ../api/readme.md ).
        </Typography>
        <Typography paragraph>
          2. Edit spreadsheet on route "/data/id". All links to themes in drop menu. After changes need saving ( button "SAVE THEME") !
        </Typography>
      </Layout>
    )
  )
}

export default IndexPage
