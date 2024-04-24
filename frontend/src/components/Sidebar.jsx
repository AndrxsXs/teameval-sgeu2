// import LogoTeamEval from '../assets/LogoTeamEval.png';
import TopNavbar from './TopNavbar';
import '../styles/components/Sidebar.css';

export default function Sidebar() {
    return (
        <aside>
            <TopNavbar session/>
                {/* <header>
                <img src={LogoTeamEval} alt="Logo de TeamEval" />
            </header> */}

                <nav>
                    <ul>
                        <li><a href="/admin">Admin Page</a></li>
                        <li><a href="/admin/users">Users</a></li>
                        <li><a href="/admin/products">Products</a></li>
                    </ul>
                </nav>
        </aside>
    )
}