import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import { Link } from 'react-router-dom';
import fondo from '../../assets/Fondo.png'
import fondoCard from '../../assets/FondoCardDefecto.png'
import fondoCiber from '../../assets/FondoCiber.png'
import { useEffect } from 'react';
import CardGrade from "../../components/student/CardGrade";

export default function Result() {
  useEffect(() => {
    // Prevenir el scroll en el montaje
    document.body.style.overflow = 'hidden';

    // Restaurar el scroll al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <Box component="header" sx={{ display: 'flex', mt: 2, mb: 1, gap: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'start', sm: 'center' }, flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', overflow: 'hidden', }}>
        <Typography level="h2" component="h1">
          Resultados disponibles
        </Typography>
      </Box>
      <Box className="contenedor-curso" sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', minWidth: 0, height: '100%', alignSelf: 'center', gap: 2, justifyContent: 'flex-start', overflow: 'hidden',rowGap: '0.5rem' }}>
        <Link to="calificación">
          <CardGrade name="Desarrollo de software" src={fondoCard} />
        </Link>
        <Link to="calificación">
          <CardGrade name="Base de datos" src={fondo} />
        </Link>
        <Link to="calificación">
          <CardGrade name="Ciberseguridad" src={fondoCiber} />
        </Link>
        <Link to="calificación" sx={{ gridColumn: '1 / 2' }}>
          <CardGrade name="Programación" src={fondoCiber} />
        </Link>
        <Link to="calificación" >
          <CardGrade name="Diseño de interfaces" src={fondoCard} />
        </Link>
      </Box>
    </>
  )
}