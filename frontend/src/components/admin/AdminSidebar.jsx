import Sidebar from '../Sidebar';

import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function AdminSidebar() {

    const menuItems = [
        {
            text: 'Administradores',
            route: '/admin/manage/admin',
            icon: <SupervisorAccountRoundedIcon key="admin" />,
        },
        {
            text: 'Profesores',
            route: '/admin/manage/teachers',
            icon: <PersonRoundedIcon key="teachers" />,
        },
        {
            text: 'Cursos',
            route: '/admin/manage/courses',
            icon: <AutoStoriesRoundedIcon key="courses" />,
        },
        {
            text: 'Escalas y criterios',
            route: '/admin/manage/scales',
            icon: <EditNoteRoundedIcon key="scales" />,
        },
    ];
    const settingsRoute = '/admin/settings';

    return (
        <Sidebar
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
        />
    )
}