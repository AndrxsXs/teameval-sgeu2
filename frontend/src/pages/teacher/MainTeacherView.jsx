import CardCurso from "../../components/teacher/CardCurso"
import TopNavbar from "../../components/TopNavbar"
import Box from '@mui/material/Box'
import "../../styles/pages/teacher/MainTeacherView.css"
import Typography from '@mui/joy/Typography'
import fondo from '../../assets/Fondo.png'
import fondoCard from '../../assets/FondoCardDefecto.png'
import fondoCiber from '../../assets/FondoCiber.png'


export default function MainTeacherView() {

    return (
        <Box 
        sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, justifyContent: 'center' }}
        >
        <TopNavbar />

        <Box className="contenedor"
            sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column', // Cambia a columna para que "Mis cursos" esté arriba
            minWidth: 0,
            height: '100%',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'flex-start', // Alinea a la izquierda
        }}
        >
            <Typography level="h2" component="h1" sx={{ marginBottom: '30px', marginTop: '20px' }} >
                Mis cursos
            </Typography>

        <Box
            className="contenedor-curso"
            sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            minWidth: 0,
            height: '100%',
            alignSelf: 'center',
            gap: 2,
            justifyContent: 'center',
            }}>

            <a href="/profesor/curso"> <CardCurso name="Desarrollo de software" src={fondoCard} /></a>
            <a href="/profesor/curso"> <CardCurso name="Base de datos" src={fondo} /></a>
            <a href="/profesor/curso"> <CardCurso name="Ciberseguridad" src={fondoCiber} /></a>
            
        </Box>
        </Box>
        </Box>
    )
}