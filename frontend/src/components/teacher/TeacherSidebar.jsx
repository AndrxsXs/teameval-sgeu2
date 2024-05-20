import Sidebar from '../Sidebar';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

export default function TeacherSidebar({ userData }) {
    const menuItems = [
      {
        text: 'Curso',
        route: '/profesor/curso/importar-estudiante',
        icon: <AutoStoriesRoundedIcon key="course" />,
      },
      {
        text: 'Grupos',
        route: '/profesor/curso/grupos',
        icon: <SupervisorAccountRoundedIcon key="groups" />,
      },
      {
        text: 'Escalas y criterios',
        route: '/profesor/curso/escalas',
        icon: <EditNoteRoundedIcon key="scales" />,
      },
      {
        text: 'Informes',
        route: '/profesor/curso/informes',
        icon: < ContentPasteIcon key="reports" />,
      },
      {
        text: 'Recursos',
        route: '/profesor/curso/recursos',
        icon: <UploadFileIcon key="resource" />,
      },
    ];
  
    const settingsRoute = '/profesor/settings';
  
    return (
      <Sidebar
        userData={userData}
        firstHeader="Gestión"
        menuItems={menuItems}
        settingsRoute={settingsRoute}
      />
    );
  }