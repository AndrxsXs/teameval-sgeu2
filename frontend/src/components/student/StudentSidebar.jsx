import Sidebar from '../Sidebar';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function StudentSidebar() {

    const menuItems = [
        {
            text: 'Evaluaciones',
            route: '/student',
            icon: <SupervisorAccountRoundedIcon key="student" />,
        },
        {
            text: 'Profesores',
            route: '/student/result',
            icon: <PersonRoundedIcon key="result" />,
        },
        {
            text: 'Cursos',
            route: '/student/feedback',
            icon: <AutoStoriesRoundedIcon key="feedback" />,
        },
    ];
    const settingsRoute = '/student/settings';

    return (
        <Sidebar
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
        />
    )
}