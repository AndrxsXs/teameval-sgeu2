import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';
import TopNavbar from './TopNavbar';


export default function ForgotPassword() {
  return (
    <>
      <TopNavbar />
      <main>

        <CssBaseline />
        <Sheet
          sx={{
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
          variant="outlined"
        >
          <form action="">
            <div>
              <Typography level="h4" component="h1">
                <b>Recuperación de contraseña</b>
              </Typography>
              <Typography level="body-sm">Digite su correo para enviar el código de verificación</Typography>
            </div>
            <FormControl>
              <FormLabel
              sx={{
                mt: 2,
              
              }}
              
              >Correo</FormLabel>
              <Input
                // html input attribute
                name="email"
                type="email"
                placeholder="user@email.com"
                required
              />
            </FormControl>

            <Sheet
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                gap: 2,
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Button sx={{ alignSelf: 'center', color: 'white' }} type='submit' >
                <Link to="/login/recuperar/codigo/"
                  style={{ textDecoration: 'none', color:'white', alignSelf: 'center' }}
                >
                  Enviar
                </Link>
              </Button>
              <Link to="/login/"
                style={{ textDecoration: 'none', alignSelf: 'center' }}
              >
                <Button variant='outlined' color='neutral' sx={{ alignSelf: 'center' }}>Cancelar</Button>
              </Link>
            </Sheet>
          </form>
        </Sheet>
      </main>
    </>
  );
}
