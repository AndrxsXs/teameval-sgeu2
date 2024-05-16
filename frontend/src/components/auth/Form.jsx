/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
// import Snackbar from '@mui/joy/Snackbar';
import SimpleSnackbar from "../SimpleSnackbar";

function interpretNumbers(nums) {
    let element
    switch (nums) {
        case 1:
            element = 'student';
            break
        case 2:
            element = 'teacher';
            break
        case 3:
            element = 'admin';
            break
        default:
            return;
    }

    return element;
}

export default function Form({ method }) {


    const [open, setOpen] = useState(false);
    let description;

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Inicie sesión" : "Cree una contraseña";
    const input = method === "login" ? "Ingrese su código" : "Nueva contraseña";
    const labelCode = input === "Ingrese su código" ? "Código" : "Contraseña";
    const pass = input === "Ingrese su código" ? "Ingrese su contraseña" : "Confirme su contraseña";
    const labelPassword = pass === "Ingrese su contraseña" ? "Contraseña" : "Confirmar contraseña";
    const submit = method === "login" ? "Iniciar sesión" : "Crear contraseña";
    const type = method === "login" ? "number" : "password";
    const inputName = method === "login" ? "code" : "password";
    const route = method === "login" ? "api/token/" : "api/change_password/";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (route === "api/token/") {
            try {
                const res = await api.post(route, { code, password })


                if (res.status === 200) {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                    // const decoded = jwtDecode(res.data.access);

                    // console.log(decoded)

                    const decoded = jwtDecode(res.data.access);

                    const userRole = interpretNumbers(decoded.role);

                    console.log(userRole)

                    const firstLogin = decoded.first_login;
                    // console.log("first login: ", firstLogin)

                    // Si es el primer inicio de sesión y el usuario es un estudiante o profesor, redirige al usuario a la página de cambio de contraseña
                    if (firstLogin && (userRole === 'student' || userRole === 'teacher')) {
                        navigate("/crear-contraseña");
                    } else {
                        // Navega a la ruta correspondiente basado en el rol del usuario
                        if (userRole === 'admin') {
                            navigate("/admin")
                        } else if (userRole === 'student') {
                            navigate("/estudiante")
                        } else if (userRole === 'teacher') {
                            navigate("/profesor")
                        } else {
                            navigate("/login")
                        }
                    }
                } else {
                    navigate("/login")
                }
            } catch (error) {
                alert(error)
                // description = error;
                setOpen(true)
            } finally {
                setLoading(false)
            }
        } else if (route === "api/change_password/") {
            try {
                const res = await api.post(route, { password },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                        }
                    }
                )
                // console.log("first login: ", res.data.first_login)

                if (res.status === 200) {
                    navigate("/login")
                } else {
                    navigate("/create-password")
                }
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false)
            }
        }


    };

    return (
        <CssVarsProvider>
            <Sheet component="article" variant="outlined" sx={{
                width: 300,
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                pb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
            >
                <form onSubmit={handleSubmit}>

                    <header>
                        <Typography level="h4" component="h1">
                            Le damos la bienvenida
                        </Typography>
                        <Typography level="body-sm">
                            {name} para continuar
                        </Typography>
                    </header>
                    <FormControl>
                        <FormLabel
                            sx={{
                                mt: 2,

                            }}
                        >{labelCode}</FormLabel>
                        <Input
                            onChange={(e) => setCode(e.target.value)}
                            // html input attribute
                            name={inputName}
                            type={type}
                            placeholder={input}
                            value={code}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel
                            sx={{
                                mt: 2,

                            }}
                        >{labelPassword}</FormLabel>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            type="password"
                            placeholder={pass}
                            value={password}
                            required
                        />
                        {/* <Typography sx={{ alignSelf: 'center' }}>
                <Link href="/login"
                fontSize="sm">
                Olvidé mi contraseña
                </Link></Typography> */}



                        <Button loading={loading} type="submit" sx={{ mt: 2, mb: 1 }}>
                            {submit}
                        </Button>
                        <Link to="/login/recuperar"
                            style={{ textDecoration: 'none', alignSelf: 'center' }}
                        >
                            <Typography
                                level='body-sm'
                                color='primary'
                                sx={{
                                    alignSelf: 'center',
                                    //color: 'primary',
                                    textDecoration: 'none',
                                
                                }}
                            >
                                ¿Olvidó su contraseña?
                            </Typography>
                        </Link>
                    </FormControl>
                </form>
                <SimpleSnackbar
                    reason="Error"
                    description={description}
                    onOpen={open}
                />
            </Sheet>
        </CssVarsProvider>
    );
}
