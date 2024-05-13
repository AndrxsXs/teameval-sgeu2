
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';

export default function CardGrade(props) {

  return (
    <Card sx={{ minHeight: '200px', width: 280 }}>
      <CardCover>
        <img
          src={props.src}
          
          /*loading="lazy"*/
          alt="imagen en representación del curso"
        />
      </CardCover>
      <CardCover
        sx={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
        }}
      />
      <CardContent sx={{ justifyContent: 'flex-end' }}>
        <Typography level="title-lg" textColor="#fff" sx={{ textDecoration: 'none' }}>
          {props.name}
        </Typography>
      </CardContent>
    </Card>
  );
}