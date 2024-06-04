import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import DownloadIcon from '@mui/icons-material/Download';
import { Box } from "@mui/joy"

const data = [
  { title: 'TrabajoEnEquipo.pdf ', description: '120 Kb' },
  { title: 'LakeView.pdf', description: '120 Kb' },
  { title: 'MountainView.pdf', description: '148 Kb' },
  { title: 'Matriz.pdf', description: '148 Kb' },
];

export default function FilesFeedBack() {
  return (
    <Card variant="outlined" sx={{ width: '100%', p: 0 }}>
      <List sx={{ py: 'var(--ListDivider-gap)', display: 'flex', flexDirection: 'column' }}>
        {data.map((item, index) => (
          <React.Fragment key={item.title}>
            <ListItem>
              <ListItemButton sx={{ gap: 2 }}>
                <ListItemContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography fontWeight="md" fontSize="0.9rem">{item.title}</Typography>
                    <Typography level="body-sm" fontSize="0.8rem">{item.description}</Typography>
                  </Box>
                  <DownloadIcon color="primary" sx={{ marginRight: '16px' }} />
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            {index !== data.length - 1 && <ListDivider />}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}