import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import GridToolbar from '../../components/GridToolbar'
import Loading from '../../components/Loading'
import { Typography, Box } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import useWarningOnExit from '../../lib/utils'
import { useQuery } from '@apollo/client'
import { GET_DATA, UPDATE_DATA } from '../../lib/queries'
import { useMutation } from '@apollo/client'

const Data = ({ categories, dataInfo }) => {

  const { id, attributes: { data: apiData = [], title } } = dataInfo

  const [data, setData] = useState(apiData)
  const [editRowsModel, setEditRowsModel] = useState({})
  const [searchText, setSearchText] = useState('')
  const [inputText, setInputText] = useState('')

  const [updateData, { data: responseUpdateData, loading: isLoading, error: isError }] = useMutation(UPDATE_DATA)
  const updateDataBody = { variables: { id: id, data: { title: title, data: data } }, optimisticResponse: true }

  // normalize data functions

  let normalizeCol = data[0].reduce((prev, item, idx) => {
    return [...prev,
    {
      field: `col${idx + 1}`,
      headerName: item,
      minWidth: `${idx ? '180' : '250'}`,
      hideable: idx,
      editable: true,
      sortable: false
    }]
  }, [])

  const normalizeRow = ([, ...normData] = data) => {
    return normData.reduce((prev, item, idx) => {
      let colValues = item.reduce((map, val, idx) => {
        map[`col${idx + 1}`] = val
        return map
      }, {})

      return [...prev, { id: `${idx + 1}`, ...colValues }]
    }, [])
  }

  // addCol logic

  const addCol = () => {
    setData((prevData) =>
      prevData.map((row, idx) => {
        const newRow = [...row]
        idx === 0 ? newRow.push(inputText) : newRow.push('')

        return newRow
      }),
    )
  }

  // delete Data logic

  const delData = (id) => {
    setData((prevData) => {
      const newData = [...prevData].map( row => {
        const filtered = row.filter((item, idx) => idx !== Number(id))
        return filtered
      })
      return newData
    })
  }

  // logic functions for actionCol

  const deleteRow = useCallback(
    (id) => () => {
      setData((prevData) => {
        const newData = [...prevData]
        newData.splice(id, 1)
        return [...newData]
      })
    },
    [],
  )

  const addRow = useCallback(
    (id) => () => {
      setData((prevData) => {
        const rowBlank = new Array(prevData[id].length)
        rowBlank.fill('')
        const newData = [...prevData]
        newData.splice(++id, 0, rowBlank)
        return [...newData]
      })
    },
    [],
  )

  const duplicateRow = useCallback(
    (id) => () => {
      setData((prevData) => {
        const rowToDuplicate = prevData[id]
        const newData = [...prevData]
        newData.splice(id, 0, rowToDuplicate)
        return [...newData]
      })
    },
    [],
  )

  const actionCol = {
    field: 'actions',
    type: 'actions',
    width: 80,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        key="DeleteItem"
        onClick={deleteRow(params.id)}
      />,
      <GridActionsCellItem
        icon={<ContentCopyIcon />}
        label="Blank Row"
        key="BlankRowItem"
        onClick={addRow(params.id)}
        showInMenu
      />,
      <GridActionsCellItem
        icon={<FileCopyIcon />}
        label="Duplicate Row"
        key="DuplicateRowItem"
        onClick={duplicateRow(params.id)}
        showInMenu
      />,
    ],
  }

  // install value rows and columns
  let initialRows = normalizeRow(data)
  const [rows, setRows] = useState(initialRows)

  // let initialColumns = useMemo(() => [...normalizeCol, actionCol], [deleteRow, addRow, duplicateRow],)
  let initialColumns = [...normalizeCol, actionCol]
  const [columns, setColumns] = useState(initialColumns)

  // creating controlled DataGrid component
  const handleEditRowsModelChange = useCallback((model) => {
    setEditRowsModel(model)
  }, [])

  // search logic 
  const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }

  const requestSearch = (searchValue) => {
    setSearchText(searchValue)
    if (searchValue === '') {
      setRows(initialRows)
      return
    }
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = rows.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString())
      })
    })
    setRows(filteredRows)
  }

  // change data if cell edit
  useEffect(() => {
    const isEditCell = Object.keys(editRowsModel).length
    if (isEditCell) {
      const editRow = Object.keys(editRowsModel)[0]
      const editCol = Object.keys(editRowsModel[editRow])[0]
      const editValue = editRowsModel[editRow][editCol].value

      const newData = data.map((item, idx) => {
        if (idx == editRow) {
          const idxCol = Number(editCol.split("col")[1] - 1)
          const newItem = [...item]

          newItem[idxCol] = editValue

          return newItem
        }

        return item
      })
      setData(newData)
    }
  }, [editRowsModel])

  // update dataGrid if change data
  useEffect(() => {
    setColumns((prevCol) => {
      return initialColumns
    })
    setRows((prevRows) => {
      return initialRows
    })
  }, [data])

  // Warning On Exit
  useWarningOnExit(true)

  return (
    data && (
      <Layout categories={categories} isMenuOpen={false}>
        <>
          <textarea id="myInput" style={{display: 'none'}}/>
          <Typography variant="h5" component="h1" paragraph>
            {`Data "${title}"`}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              '& .editCell': {
                position: 'relative'
              }
            }}
          >
            <DataGrid
              components={{ Toolbar: GridToolbar }}
              rows={rows}
              columns={columns}
              rowHeight={30}
              rowsPerPageOptions={[100]}
              sx={{ backgroundColor: '#ffffff' }}
              getCellClassName={(params) => {
                if (params.field === 'col1' || params.field === 'actions') {
                  return ''
                }
                return 'editCell'
              }}
              editRowsModel={editRowsModel}
              onEditRowsModelChange={handleEditRowsModelChange}
              componentsProps={{
                toolbar: {
                  valueSearch: searchText,
                  onChangeSearch: useCallback((event) => requestSearch(event.target.value), []),
                  clearSearch: () => { requestSearch(''), setRows(initialRows) },
                  updateDataClick: () => updateData(updateDataBody),
                  valueInputData: inputText,
                  onChangeInputData: useCallback((event) => setInputText(event.target.value), []),
                  addColClick: addCol,
                  menuDelData: data[0],
                  deleteDataClick: (event) => delData(event.target.id)
                },
              }}
            />
          </Box>
        </>
      </Layout>
    )
  )
}

const GetData = () => {
  const router = useRouter()
  const id = router.asPath.split("/")[2]

  const { loading, error, data: dataQuery } = useQuery(GET_DATA, { variables: { id } })

  const {data: categories} = dataQuery?.categories || {}
  const {data: dataInfo} = dataQuery?.data || {}

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <p>JSON.stringify(error)</p>
  }

  return (
    dataQuery && (
      <Data categories={categories} dataInfo={dataInfo} />
    )
  )
}

Data.propTypes = {
  categories: PropTypes.array.isRequired,
  dataInfo: PropTypes.object.isRequired
}

export default GetData
