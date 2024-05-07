import LogoTeamevalLight from '../assets/logo_teameval_light.svg';
import LogoTeamevalDark from '../assets/logo_teameval_dark.svg';
import PropTypes from 'prop-types';
import '../styles/components/TopNavbar.css'
import { useColorScheme } from '@mui/joy/styles';

export default function TopNavbar(onSession = false) {

    const { mode } = useColorScheme();
    const logo = mode === 'dark' ? LogoTeamevalDark : LogoTeamevalLight;

    const session = onSession ? 'session' : 'top-navbar';

    return (
        <header id='teameval-logo-header' className={session}>
            <a href="/"><img src={logo} alt="Logo de TeamEval" /></a>
        </header>
    );
}

TopNavbar.propTypes = {
    onSession: PropTypes.bool,
    dark: PropTypes.bool
};