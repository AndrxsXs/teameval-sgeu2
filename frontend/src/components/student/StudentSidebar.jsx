import Sidebar from '../Sidebar';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
// import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function StudentSidebar() {

    const menuItems = [
        {
            text: 'Evaluaciones',
            route: '',
            icon: <SupervisorAccountRoundedIcon key="student" />,
        },
        {
            text: 'Resultados',
            route: 'resultados',
            icon: <PersonRoundedIcon key="result" />,
        },
        {
            text: 'Retroalimentaciones',
            route: 'materiales',
            icon: <AutoStoriesRoundedIcon key="feedback" />,
        },
    ];
    const settingsRoute = 'settings';

    return (
        <Sidebar
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
        />
    )
}