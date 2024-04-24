import Form from "../../components/auth/Form"
import TopNavbar from "../../components/TopNavbar"
import { CssBaseline } from "@mui/material"
import "../../styles/pages/Login.css"

function App() {

  return (
    <>
      <TopNavbar />
      <main>
        <CssBaseline />
        <Form method="login"/>
      </main >
    </>
  )
}

export default App