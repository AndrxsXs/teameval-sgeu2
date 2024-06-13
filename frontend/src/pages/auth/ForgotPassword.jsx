import { useState } from "react";

import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "../../components/TopNavbar";

import api from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRequest = (e) => {
    setLoading(true);
    e.preventDefault();

    api
      .post("api/restore_password/", {
        user_email: email,
      })
      .then((response) => {
        console.log(response.data);
        window.dispatchEvent(
          new CustomEvent("ResponseEvent", {
            detail: {
              severity: "success",
              message: `Se ha enviado un correo a ${email} con el código de verificación`,
            },
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        window.dispatchEvent(
          new CustomEvent("ResponseEvent", {
            detail: {
              message: `${error.response.data.error || error.response.message}`,
              severity: "danger",
            },
          })
        );
        setLoading(false);
      });
  };

  return (
    <>
      <TopNavbar />
      <main>
        <CssBaseline />
        <Sheet
          sx={{
            width: 300,
            mx: "auto", // margin left & right
            my: 4, // margin top & bottom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
          }}
          variant="outlined"
        >
          <form onSubmit={handleRequest}>
            <div>
              <Typography level="h4" component="h1">
                <b>Recuperación de contraseña</b>
              </Typography>
              <Typography level="body-sm">
                Digite su correo para enviar el código de verificación
              </Typography>
            </div>
            <FormControl>
              <FormLabel
                sx={{
                  mt: 2,
                }}
              >
                Correo
              </FormLabel>
              <Input
                size="sm"
                name="email"
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>

            <Sheet
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                gap: 2,
                flexWrap: "nowrap",
                justifyContent: "flex-start",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Button
                color="primary"
                sx={{ alignSelf: "center" }}
                type="submit"
                loading={loading}
              >
                {/* <Link
                  to="./codigo/"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    alignSelf: "center",
                  }}
                > */}
                Enviar
                {/* </Link> */}
              </Button>
              <Link
                onClick={() => navigate(-1)}
                style={{ textDecoration: "none", alignSelf: "center" }}
              >
                <Button
                  variant="outlined"
                  color="neutral"
                  sx={{ alignSelf: "center" }}
                >
                  Cancelar
                </Button>
              </Link>
            </Sheet>
          </form>
        </Sheet>
      </main>
    </>
  );
}
