import Sidebar from '../Sidebar';

import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SummarizeIcon from '@mui/icons-material/Summarize';

export default function AdminSidebar() {

    const menuItems = ['Curso', 'Grupos', 'Escalas y criterios', 'Informes'];
    const routes = ['/teacher/courses', '/teacher/groups', '/teacher/scales', '/teacher/reports'];
    const menuIcons = [
        <AutoStoriesRoundedIcon key="course" />,
        <SupervisorAccountRoundedIcon key="groups" />,
        <EditNoteRoundedIcon key="scales" />,
        <SummarizeIcon key="reports" />,
    ];
    const settingsRoute = '/teacher/settings';

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