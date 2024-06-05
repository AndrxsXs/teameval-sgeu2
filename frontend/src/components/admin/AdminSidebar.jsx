/* eslint-disable react/prop-types */
import Sidebar from '../Sidebar';

import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function AdminSidebar({ userData }) {

    const menuItems = [
        {
            text: 'Administradores',
            route: './manage',
            icon: <SupervisorAccountRoundedIcon key="admin" />,
        },
        {
            text: 'Docentes',
            route: './manage/teachers',
            icon: <PersonRoundedIcon key="teachers" />,
        },
        {
            text: 'Cursos',
            route: './manage/courses',
            icon: <AutoStoriesRoundedIcon key="courses" />,
        },
        {
            text: 'Escalas y criterios',
            route: './manage/scales',
            icon: <EditNoteRoundedIcon key="scales" />,
        },
    ];
    const settingsRoute = '/admin/settings';

    return (
        <Sidebar
            userData={userData}
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
        />
    )
}