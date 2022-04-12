import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Tabs,
  Tab,
  Typography,
  Box,
  ListItem,
  ListItemButton,
  List,
  ListItemText,
} from '@mui/material'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      sx={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

const MenuCategories = (props) => {
  const { categories, isRouteIdxTheme } = props
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: 500,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', flex: '0 0 100px' }}
      >
        {categories.map((item, index) => {
          const { __typename, category } = item.attributes
          return (
            <Tab
              key={__typename + item.id}
              label={category}
              {...a11yProps(index)}
            />
          )
        })}
      </Tabs>
      {categories.map((item, index) => {
        const { category, dataset } = item.attributes
        return (
          <TabPanel key={'panel' + item.id} value={value} index={index} >
            {dataset.data[0] ? (
              <nav aria-label={`Dataset in category "${category}"`}>
                <List>
                  {dataset.data.map((item) => {
                    const { title } = item.attributes
                    return (
                      <ListItem key={item.id} disablePadding>
                        <ListItemButton component="a" href={`${isRouteIdxTheme ? '' : 'data/'}` + item.id}>
                          <ListItemText primary={title} />
                        </ListItemButton>
                      </ListItem>
                    )
                  })}
                </List>
              </nav>
            ) : (
              <Typography align="center">
                No themes in category &quot;{category}&quot;
              </Typography>
            )}
          </TabPanel>
        )
      })}
    </Box>
  )
}

export default MenuCategories

MenuCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  isRouteIdxTheme: PropTypes.bool.isRequired
}
