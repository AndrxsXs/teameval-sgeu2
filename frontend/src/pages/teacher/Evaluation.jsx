import { Box } from "@mui/joy"
import { Typography } from "@mui/joy"
import CreateEvaluation from "../../components/teacher/CreateEvaluation";
import { useParams } from 'react-router-dom';

export default function Evaluation(){

    
    return(
        <>
            <Box component="header"
                sx={{
                    display: 'flex',
                    mt: 2,
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Typography level="h2" component="h1">
                    Evaluaciones
                </Typography>

                <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <CreateEvaluation/>
        </Box>

            </Box>
         </>
    );
}