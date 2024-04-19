import imagen_404 from '../images/404..png'
import Button from '@mui/joy/Button';

function NotFound() {
    return (
        <>
        <img style={{width:"100%", aspectRatio:"1500/511"}}
         src={imagen_404} alt="Error 404: pagina no encontrada"/>  

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="outlined">Volver a la página principal</Button>
        </div>
      </>
    );
}

export default NotFound
