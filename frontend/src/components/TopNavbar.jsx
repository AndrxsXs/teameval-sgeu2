import { Link } from 'react-router-dom';
import LogoTeamevalLight from '../assets/logo_teameval_light.svg';
import LogoTeamevalDark from '../assets/logo_teameval_dark.svg';
import PropTypes from 'prop-types';
import '../styles/components/TopNavbar.css'
import { useColorScheme } from '@mui/joy/styles';
import {
    Button
} from "@mui/joy"

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


export default function TopNavbar(props) {

    const { mode } = useColorScheme();
    const logo = mode === 'dark' ? LogoTeamevalDark : LogoTeamevalLight;

    const session = props.session ? 'session' : 'top-navbar';

    return (
        <header id='teameval-logo-header' className={session}>
            <Link to="/">
                <img src={logo} alt="Logo de TeamEval" />
            </Link>
            <Button
            className='cerrar-sesión-button'
            variant="plain"
            color="neutral"
            onClick={() => navigate("/logout")}
            endDecorator={<LogoutRoundedIcon />}
            sx={{
                alignSelf: "flex-end"
            }}
            >
                Cerrar sesión
            </Button>
        </header>
    );
}

TopNavbar.propTypes = {
    session: PropTypes.bool,
    dark: PropTypes.bool
};