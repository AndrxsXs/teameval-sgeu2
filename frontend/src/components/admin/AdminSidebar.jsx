import Sidebar from '../Sidebar';

import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function AdminSidebar() {

    const menuItems = ['Administradores', 'Profesores', 'Cursos', 'Escalas y criterios'];
    const routes = ['/admin/manage/admin', '/admin/manage/teachers', '/admin/manage/courses', '/admin/manage/scales'];
    const menuIcons = [
        <SupervisorAccountRoundedIcon key="admin" />,
        <PersonRoundedIcon key="teachers" />,
        <AutoStoriesRoundedIcon key="courses" />,
        <EditNoteRoundedIcon key="scales" />,
    ];
    const settingsRoute = '/admin/settings';

    return (
        <Sidebar
            firstHeader="Gestión"
            MenuItems={menuItems}
            routes={routes}
            MenuIcons={menuIcons}
            settingsRoute={settingsRoute}
        />
    )
}