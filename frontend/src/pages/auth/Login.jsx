import Form from "../../components/auth/Form"
import TopNavbar from "../../components/TopNavbar"
import { CssBaseline } from "@mui/material"
import Box from "@mui/joy/Box"
import { CssVarsProvider } from "@mui/joy"
import "../../styles/pages/Login.css"

function App() {

  return (
    <CssVarsProvider disableTransitionOnChange>
      <TopNavbar />
      <Box component="main">
        <CssBaseline />
        <Form method="login" />
      </Box >
    </CssVarsProvider>
  )
}

export default App