import { useState, useEffect } from 'react'
import {
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField
} from '@mui/material'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import { useMutation, useQuery } from '@apollo/client'
import {useRouter} from 'next/router'
import { GET_CATEGORIES, CREATE_DATA } from '../../lib/queries'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const CreateData = () => {
  const { loading, error, data = {} } = useQuery(GET_CATEGORIES)
  const router = useRouter()
  const [curCategory, setCategory] = useState('')
  const [curTitle, setTitle] = useState('')
  const [responseTitle, setResponseTitle] = useState('')
  const [responseId, setResponseId] = useState('')

  const isSubmitValid = curCategory.length === 1 && curTitle.length > 6

  const {data: categories} = data.categories || {}
  const {data: dataset} = data.dataset || {}

  const dateTime = new Date()
  const defaultTemplate = [['','A','B','C','D']]
  defaultTemplate.length = 50
  defaultTemplate.fill(['','','','',''],1)

  const [createTheme, { data: responseUpdateData, loading: isLoading, error: isError }] = useMutation(CREATE_DATA)
  const createThemeBody = { variables: { title: curTitle, data: defaultTemplate, chapt: curCategory, publishedAt: dateTime }, optimisticResponse: true }

  const handleCategory = (event) => {
    setCategory(event.target.value)
  }

  const handleThemeTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAddTheme = () => {
    const hasTitle = dataset.some(item => curTitle === item.attributes.title)
    hasTitle ? setResponseTitle('error') : createTheme(createThemeBody)
    setCategory('')
    setTitle('')
  }

  useEffect(() => {
    if (responseTitle){
      const timeout = setTimeout(() => {
        setResponseTitle('')
      }, 2500)
      router.push(`/data/${responseId}`)
    }

    return () => clearTimeout(timeout);

  }, [responseTitle])

  useEffect(() => {
    if (responseUpdateData){
      const { createData: { data: { attributes: { title }, id: createID } }} = responseUpdateData
      setResponseTitle(title)
      setResponseId(createID)
    }

  }, [responseUpdateData])

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <p>JSON.stringify(error)</p>
  }

  return (
    <Layout categories={categories} isMenuOpen={false}>
      <Paper elevation={3} sx={{p:2}}>
        <Typography variant='h5' component='h1' paragraph>
          Add New Spreadsheet
        </Typography>
        <Box sx={{ display: 'flex', flexFlow: {xs: 'column nowrap', sm: 'row wrap' }, pt: 1, mr: '-1', ml: '-1' }}>
          <Box sx={{ minWidth: 180, p: 1 }}>
            <FormControl fullWidth >
              <InputLabel id='select-category-label'>Category</InputLabel>
              <Select
                labelId='select-category-label'
                id='form-select-category'
                value={curCategory}
                label='Category'
                onChange={handleCategory}
              >
                {categories.map((item) => {
                  const { category } = item.attributes
                  return (
                    <MenuItem
                      key={category + item.id}
                      value={item.id}
                    >
                      {category}
                    </MenuItem>
                  )
                })}
              </Select>

            </FormControl>
          </Box>
          <Box sx={{ minWidth: {xs: '100%', sm: 180}, p: 1 }}>
            <TextField
              id='form-input-category'
              label='Title'
              variant='outlined'
              onChange={handleThemeTitle}
              value={curTitle}
              sx={{width: '100%'}}/>
          </Box>
          <Box sx={{ minWidth: {xs: '', sm: '56px'}, p: 1, display: 'flex', alignContent: 'center' }}>
            <IconButton
              type='submit'
              sx={{ p: '10px', minWidth: {xs: '', sm: '56px'}}}
              aria-label='add title'
              disabled={!isSubmitValid}
              onClick={handleAddTheme}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
          { responseTitle && (
            <Box sx={{ p: 1 }}>
              <Typography variant='h6' component='h2' sx={{color: `${responseTitle === 'error' ? '#f50057' : '#4caf50'}`, lineHeight: {xs: '', sm: '56px'}}}>
                { responseTitle === 'error' ? 'The title exists!' : `'${responseTitle}' created`}
              </Typography>
            </Box>
          ) }
        </Box>
      </Paper>
    </Layout>
  )
}

export default CreateData