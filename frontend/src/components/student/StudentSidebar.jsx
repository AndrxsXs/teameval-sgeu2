/* eslint-disable react/prop-types */
import Sidebar from '../Sidebar';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
// import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
// import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function StudentSidebar({ userData }) {

    const menuItems = [
        {
            text: 'Evaluaciones',
            route: './',
            icon: <SupervisorAccountRoundedIcon key="evaluations" />,
        },
        {
            text: 'Resultados',
            route: './resultados',
            icon: <PersonRoundedIcon key="results" />,
        },
        // {
        //     text: 'Retroalimentaciones',
        //     route: './estudiante/retroalimentacion',
        //     icon: <AutoStoriesRoundedIcon key="feedback" />,
        // },
    ];
    const settingsRoute = 'settings';

    return (
        <Sidebar
            userData={userData}
            firstHeader="Gestión"
            menuItems={menuItems}
            settingsRoute={settingsRoute}
        />
    )
}