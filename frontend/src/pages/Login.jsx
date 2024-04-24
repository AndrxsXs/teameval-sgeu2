import Form from "../components/Form"
import TopNavbar from "../components/TopNavbar"
import { CssBaseline } from "@mui/material"
import "../styles/pages/Login.css"

function App() {

  return (
    <>
      <TopNavbar />
      <main>
        <CssBaseline />
        <Form route="api/token/"/>
      </main >
    </>
  )
}

export default App