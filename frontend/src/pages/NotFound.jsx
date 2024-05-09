import imagen_404 from '../assets/404..png'
import Button from '@mui/joy/Button';
import TopNavbar from '../components/TopNavbar';

function NotFound() {
    return (
        <>
        <TopNavbar />
        <img style={{width:"100%", aspectRatio:"1500/511"}}
         src={imagen_404} alt="Error 404: pagina no encontrada"/>  

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="outlined" component="a" href='/'>Volver a la página principal</Button>
        </div>
      </>
    );
}

export default NotFound
