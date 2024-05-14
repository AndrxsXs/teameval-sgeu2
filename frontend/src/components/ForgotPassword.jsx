import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';



export default function ForgotPassword() {
  return (
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
        <div>
          <Typography level="h4" component="h1">
            <b>Recuperación de contraseña</b>
          </Typography>
          <Typography level="body-sm">Digite su correo para enviar el código de verificación</Typography>
        </div>
        <FormControl>
          <FormLabel>Correo</FormLabel>
          <Input
            // html input attribute
            name="email"
            type="email"
            placeholder="user@email.com"
          />
        </FormControl>

        <Link to="codigo">
        <Button sx={{ mt: 1  }}>Enviar</Button>
        </Link>

        
                            
        
      </Sheet>
    </main>
  );
}
