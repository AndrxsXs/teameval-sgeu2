import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

import { handleKeyPress } from "../../utils/handleKeyPress";

import { CssVarsProvider, CssBaseline } from "@mui/joy";

import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";

import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/joy/IconButton";

import TopNavbar from "../../components/TopNavbar";
import eventDispatcher from "../../utils/eventDispacher";

function interpretNumbers(nums) {
  let element;
  switch (nums) {
    case 1:
      element = "student";
      break;
    case 2:
      element = "teacher";
      break;
    case 3:
      element = "admin";
      break;
    default:
      return;
  }

  return element;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post("api/token/", {
        code: formData.code,
        password: formData.password,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        const decoded = jwtDecode(res.data.access);

        const userRole = interpretNumbers(decoded.role);

        const firstLogin = decoded.first_login;

        if (firstLogin) {
          navigate("/crear-contrasena");
        } else {
          switch (userRole) {
            case "student":
              navigate("/estudiante");
              break;
            case "teacher":
              navigate("/profesor");
              break;
            case "admin":
              navigate("/admin");
              break;
            default:
              return;
          }
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      eventDispatcher("responseEvent", error, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssVarsProvider disableTransitionOnChange>
        <TopNavbar />
        <Box component="main">
          <CssBaseline />
          <Sheet
            component="article"
            variant="outlined"
            sx={{
              width: 300,
              mx: "auto", // margin left & right
              my: 4, // margin top & bottom
              py: 3, // padding top & bottom
              px: 2, // padding left & right
              pb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
            }}
          >
            <form onSubmit={handleSubmit}>
              <header>
                <Typography level="h4" component="h1">
                  Le damos la bienvenida
                </Typography>
                <Typography level="body-sm">
                  Inicie sesión para continuar
                </Typography>
              </header>
              <FormControl>
                <FormLabel
                  sx={{
                    mt: 2,
                  }}
                >
                  Código
                </FormLabel>
                <Input
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  // html input attribute
                  name="code"
                  type="text"
                  onKeyDown={handleKeyPress}
                  placeholder="Ingrese su código"
                  value={formData.code}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  sx={{
                    mt: 2,
                  }}
                >
                  Contraseña
                </FormLabel>
                <Input
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  required
                  endDecorator={
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                />
                {/* <Typography sx={{ alignSelf: 'center' }}>
                <Link href="/login"
                fontSize="sm">
                Olvidé mi contraseña
                </Link></Typography> */}

                <Button loading={loading} type="submit" sx={{ mt: 2, mb: 1 }}>
                  Iniciar sesión
                </Button>
                <Link
                  to="/login/recuperar"
                  style={{ textDecoration: "none", alignSelf: "center" }}
                >
                  <Typography
                    level="body-sm"
                    color="primary"
                    sx={{
                      alignSelf: "center",
                      //color: 'primary',
                      textDecoration: "none",
                    }}
                  >
                    ¿Olvidó su contraseña?
                  </Typography>
                </Link>
              </FormControl>
            </form>
          </Sheet>
        </Box>
      </CssVarsProvider>
    </>
  );
}
