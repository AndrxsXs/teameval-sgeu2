import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";

import {
  CssVarsProvider,
  Sheet,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  LinearProgress,
  FormHelperText,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/joy";

import Key from "@mui/icons-material/Key";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import TopNavbar from "../../components/TopNavbar";

export default function CreatePasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const minLength = 8;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (event, field) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (event.target.value === "") {
      setPasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (validatePassword(formData.password)) {
      try {
        const res = await api.post(
          "api/change_password/",
          {
            password: formData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          }
        );

        if (res.status === 200) {
          navigate("/login");
        } else {
          navigate("/login/crear-contrasena");
        }
      } catch (error) {
        window.dispatchEvent(
          new CustomEvent("responseEvent", {
            detail: {
              message: "Error al crear la contraseña, intente de nuevo",
              severity: "danger",
            },
          })
        );
      } finally {
        setLoading(false);
      }
    } else {
      setPasswordError(true);
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
                  Crear contraseña
                </Typography>
                <Typography level="body-sm">
                  Debe crear una contraseña segura para su cuenta
                </Typography>
              </header>
              <FormControl error={passwordError}>
                <FormLabel
                  sx={{
                    mt: 2,
                  }}
                >
                  Contraseña
                </FormLabel>

                <Stack
                  spacing={0.5}
                  sx={{
                    "--hue": Math.min(formData.password.length * 10, 120),
                  }}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Escriba aquí su contraseña"
                    startDecorator={<Key />}
                    value={formData.password}
                    onChange={(event) => handleInputChange(event, "password")}
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
                  <LinearProgress
                    determinate
                    size="sm"
                    value={Math.min(
                      (formData.password.length * 100) / minLength,
                      100
                    )}
                    sx={{
                      bgcolor: "background.level3",
                      color: "hsl(var(--hue) 80% 40%)",
                    }}
                  />
                  <Typography
                    level="body-xs"
                    sx={{
                      alignSelf: "flex-end",
                      color: "hsl(var(--hue) 80% 30%)",
                    }}
                  >
                    {formData.password.length < 3 && "Muy débil"}
                    {formData.password.length >= 3 &&
                      formData.password.length < 6 &&
                      "Débil"}
                    {formData.password.length >= 6 &&
                      formData.password.length < 10 &&
                      "Fuerte"}
                    {formData.password.length >= 10 && "Muy fuerte"}
                  </Typography>
                </Stack>
              </FormControl>
              <FormControl error={passwordError}>
                <FormLabel
                  sx={{
                    mt: 2,
                  }}
                >
                  Repetir contraseña
                </FormLabel>
                <Input
                  onChange={(event) => handleInputChange(event, "newPassword")}
                  name="password"
                  startDecorator={<Key />}
                  type={showPassword ? "text" : "password"}
                  {...((formData.newPassword === formData.password) &
                    (formData.newPassword !== "") & (validatePassword(formData.password)) && {
                    color: "success",
                  })}
                  placeholder="Repita la contraseña"
                  value={formData.newPassword}
                  required
                />
                {passwordError && (
                  <FormHelperText>
                    <InfoOutlined />
                    La contraseña debe tener al menos 8 caracteres, un número,
                    un símbolo y una letra mayúscula.
                  </FormHelperText>
                )}
                <Button loading={loading} type="submit" sx={{ mt: 2, mb: 1 }}>
                  Crear contraseña
                </Button>
                <Link
                  to="/login/recuperar"
                  style={{ textDecoration: "none", alignSelf: "center" }}
                ></Link>
              </FormControl>
            </form>
          </Sheet>
        </Box>
      </CssVarsProvider>
    </>
  );
}
