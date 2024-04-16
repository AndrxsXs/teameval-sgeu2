import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import ModeToggle from '../components/ModeToggle';

function App() {

  return (
    <main>
      <CssBaseline/>
      <CssVarsProvider>
        <Sheet variant="outlined" sx={{
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
          <div>
            <Typography level="h4" component="h1">
              Hola!
            </Typography>
            <Typography level="body-sm">
              Inicia sesión para continuar
            </Typography>
            <ModeToggle />
          </div>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              // html input attribute
              name="email"
              type="email"
              placeholder="johndoe@email.com"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
            />
            <Button type="submit" sx={{ my: 1 }}>
              Iniciar sesión
            </Button>
            <Typography
              endDecorator={<Link href="/#">Regístrate</Link>}
              fontSize="sm"
              sx={{ alignSelf: 'center' }}
            >
              ¿No tienes una cuenta?
            </Typography>
          </FormControl>

        </Sheet>
      </CssVarsProvider>
    </main>
  )
}

export default App