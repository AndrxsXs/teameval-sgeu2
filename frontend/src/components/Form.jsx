import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import PropTypes from "prop-types"
import { jwtDecode } from "jwt-decode";

export default function Form({ route }) {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { code, password })

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                
                const decoded = jwtDecode(res.data.access);
                const userRole = decoded.role;

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
                } else {
                    navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
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
                            Inicie sesión para continuar
                        </Typography>
                    </header>
                    <FormControl>
                        <FormLabel>Código</FormLabel>
                        <Input
                            onChange={(e) => setCode(e.target.value)}
                            // html input attribute
                            name="username"
                            type="number"
                            placeholder="Ingresa tu código"
                            value={code}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Contraseña</FormLabel>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            required
                        />
                        {/* <Typography sx={{ alignSelf: 'center' }}>
                <Link href="/login"
                fontSize="sm">
                Olvidé mi contraseña
                </Link></Typography> */}

                        {loading && <LoadingIndicator />}
                        <Button type="submit" sx={{ my: 1 }}>
                            Continuar
                        </Button>
                    </FormControl>
                </form>
            </Sheet>
        </CssVarsProvider>
    );
}

Form.propTypes = {
    route: PropTypes.string.isRequired
}