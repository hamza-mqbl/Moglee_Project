import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Loader = () => {
  return (
    <Box
         display="flex"
         justifyContent="center"
         alignItems="center"
         minHeight="100vh"
         mt={-10} // Adjust this value as needed
       >
         <CircularProgress size={50} />
       </Box>
  )
}

export default Loader
