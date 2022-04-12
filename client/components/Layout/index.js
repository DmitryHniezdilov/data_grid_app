import { useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Head from 'next/head'
import MenuCategories from '../MenuCategories'
import Header from '../Header'
import { Box, Drawer, IconButton, Divider } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { styled, useTheme } from '@mui/material/styles'

const drawerWidth = 350

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
)

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const Layout = (props) => {
  const { categories, children, isMenuOpen } = props
  const theme = useTheme()
  const router = useRouter()
  const [isOpen, setOpen] = useState(isMenuOpen)

  const isRouteIdxTheme = !(router.route === '/' || router.route === '/data')
  const isRouteTheme = router.route !== '/data'

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Head>
        <title>Get themes app</title>
        <meta name='description' content='Data grid app by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box sx={{ display: 'flex' }}>
        <AppBar position='fixed' open={isOpen}>
          <Header isDrawerOpen={isOpen} isRouteTheme={isRouteTheme} handleDrawerOpen={handleDrawerOpen} />
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant='persistent'
          anchor='left'
          open={isOpen}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}</IconButton>
          </DrawerHeader>
          <Divider />
          <MenuCategories categories={categories} isRouteIdxTheme={isRouteIdxTheme} />
        </Drawer>
        <Main open={isOpen} sx={{ backgroundColor: '#f5f5f5', height: '100vh', overflow: 'auto' }}>
          <DrawerHeader />
          <Box sx={{ display: 'flex', flexFlow: 'column nowrap', p: 3, height: { xs: 'calc( 100% - 56px)', sm: 'calc( 100% - 64px)' } }}>
            {children}
          </Box>
        </Main>
      </Box>
    </>
  )
}

export default Layout

Layout.propTypes = {
  categories: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  isMenuOpen: PropTypes.bool.isRequired
}
