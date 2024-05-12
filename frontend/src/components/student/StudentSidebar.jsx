import Sidebar from '../Sidebar';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function StudentSidebar() {

    const menuItems = [
        {
            text: 'Evaluaciones',
            route: '/estudiante',
            icon: <SupervisorAccountRoundedIcon key="student" />,
        },
        {
            text: 'Resultados',
            route: '/estudiante/result',
            icon: <PersonRoundedIcon key="result" />,
        },
        {
            text: 'Retroalimentaciones',
            route: '/estudiante/feedback',
            icon: <AutoStoriesRoundedIcon key="feedback" />,
        },
    ];
    const settingsRoute = '/estudiante/settings';

    return (
        <Sidebar
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
        />
    )
}