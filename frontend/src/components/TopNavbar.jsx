import LogoTeameval from '../assets/logo_teameval.svg';
import '../styles/components/TopNavbar.css'

export default function TopNavbar(props) {
    return (
        <header className='top-navbar'>
            <img src={LogoTeameval} alt="Logo de TeamEval" />
        </header>
    );
}