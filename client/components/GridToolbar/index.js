import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  TextField,
  InputBase
} from '@mui/material'
import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import SaveIcon from '@mui/icons-material/Save'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'

const GridToolbar = (props) => {

  const [anchorElAdd, setAnchorElAdd] = useState(null)
  const [anchorElDel, setAnchorElDel] = useState(null)
  const isMenuAddOpen = Boolean(anchorElAdd)
  const isMenuDelOpen = Boolean(anchorElDel)

  const handleAddMenuOpen = (event) => {
    setAnchorElAdd(event.currentTarget)
  }

  const handleAddMenuClose = () => {
    setAnchorElAdd(null)
  }

  const handleAddCol = () => {
    setAnchorElAdd(null)
    props.addColClick()
  }

  const handleDelMenuOpen = (event) => {
    setAnchorElDel(event.currentTarget)
  }

  const handleDelMenuClose = () => {
    setAnchorElDel(null)
  }

  const menuIdAdd = 'add-Data-menu'
  const renderMenuAdd = (
    <Menu
      anchorEl={anchorElAdd}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={menuIdAdd}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMenuAddOpen}
      onClose={handleAddMenuClose}
    >
      <Box
        sx={{
          p: 0.5,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter Title"
          inputProps={{ 'aria-label': 'enter new Data' }}
          onChange={props.onChangeInputData}
          value={props.valueInputData}
        />
        <IconButton
          type="submit"
          sx={{ p: '10px' }}
          aria-label="add Data"
          onClick={handleAddCol}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Menu>
  )

  const menuIdDel = 'menu-del'
  const dataDel = [...props.menuDelData]
  dataDel.splice(0, 1)

  const renderMenuDel = (
    <Menu
      anchorEl={anchorElDel}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={menuIdDel}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMenuDelOpen}
      onClose={handleDelMenuClose}
    >
      {dataDel.map((title, idx) => (
        <MenuItem
          id={++idx}
          key={`titleMenuDel${idx}`}
          onClick={props.deleteDataClick}
        >
          {title}
        </MenuItem>
      ))}
    </Menu>
  )

  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button variant="text"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddMenuOpen}>
          Add Column
        </Button>
        <Button variant="text"
          startIcon={<DeleteIcon />}
          onClick={handleDelMenuOpen}>
          Delete Column
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button variant="text"
          startIcon={<SaveIcon />}
          onClick={props.updateDataClick}>
          Save Data
        </Button>
      </Stack>
      <TextField
        variant="standard"
        value={props.valueSearch}
        onChange={props.onChangeSearch}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (Data) => Data.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
      {renderMenuAdd}
      {renderMenuDel}
    </Box>
  )
}

GridToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChangeSearch: PropTypes.func.isRequired,
  valueSearch: PropTypes.string.isRequired,
  updateDataClick: PropTypes.func.isRequired,
  valueInputData: PropTypes.string.isRequired,
  onChangeInputData: PropTypes.func.isRequired,
  addColClick: PropTypes.func.isRequired,
  deleteDataClick: PropTypes.func.isRequired,
  menuDelData: PropTypes.array.isRequired
}

export default GridToolbar