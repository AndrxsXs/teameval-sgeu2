import LogoTeameval from '../assets/logo_teameval.svg';
import PropTypes from 'prop-types';
import '../styles/components/TopNavbar.css'

export default function TopNavbar(props) {

    const session = props.session ? 'session' : 'top-navbar';

    return (
        <header className={session}>
            <a href="/"><img src={LogoTeameval} alt="Logo de TeamEval" /></a>
        </header>
    );
}

TopNavbar.propTypes = {
    session: PropTypes.bool
};