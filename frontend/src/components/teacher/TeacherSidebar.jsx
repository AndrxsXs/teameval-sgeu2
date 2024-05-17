import Sidebar from '../Sidebar';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export default function TeacherSidebar({ userData }) {

    const menuItems = [
        {},
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
            icon: <SummarizeIcon key="reports" />,
        },
    ];
    const settingsRoute = '/profesor/settings';

    const showDropdownMenu = true;
    const dropdownMenuPosition = 0; // Posición en la que se mostrará el menú desplegable (0 para la primera posición, 1 para la segunda, etc.)
    const dropdownMenuProps = {
        icon: <AutoStoriesRoundedIcon key="course" />,
        text: 'Curso',
        items: [
            { itemText: 'Importar estudiantes', itemIcon: <FileUploadIcon />, itemRoute: '/profesor/curso/importar-estudiante' },
            { itemText: 'Deshabilitar estudiantes', itemIcon: <PersonRemoveRoundedIcon />, itemRoute: '/profesor/curso/deshabilitar-estudiante' },
        ],
    };

    return (
        <Sidebar
            userData={userData}
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
            showDropdownMenu={showDropdownMenu}
            dropdownMenuProps={dropdownMenuProps}
            dropdownMenuPosition={dropdownMenuPosition}
        />
    )
}