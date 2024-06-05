import { Link } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import Typography from "@mui/joy/Typography";
import PhotoHomePage from "../assets/photoHomePage.png";
import "../styles/pages/HomePage.css";

import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
// import Stack from "@mui/joy/Stack";
import { CssVarsProvider } from "@mui/joy";

import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <CssVarsProvider
        disableTransitionOnChange
        // direction="column"
        // justifyContent="center"
        // sx={{
        //   height: "100vh",
        //   width: "100%",
        // }}
      >
        <TopNavbar />
        <Box component="main" className="main-homepage">
          <article className="hero">
            <section className="presentation">
              <Typography level="title-lg" color="primary">
                El poder de hacer más
              </Typography>
              <Typography level="h1">
                La mejor manera de evaluar el talento
              </Typography>
              <Typography level="body-md">
                Con TeamEval puedes agilizar la forma en que evalúas a tus
                compañeros de equipo.
              </Typography>
              <div>
                <Link to="/login/">
                  <Button>Entrar</Button>
                </Link>
              </div>
            </section>
            <section>
              <img className="img-home" src={PhotoHomePage} alt="" />
            </section>
          </article>
        </Box>
      </CssVarsProvider>
    </Fragment>
  );
}
