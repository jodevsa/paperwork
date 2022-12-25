import React from 'react'
import styled from 'styled-components'
import {BsHeartFill} from 'react-icons/bs'
import {AppBar, Button, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import {useAuth0} from "@auth0/auth0-react";
import {AccountCircle} from "@material-ui/icons";
import { RootState } from './reducers';
import { useSelector } from 'react-redux';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
    background-color: #101010;
    padding: 20px;

    a {
        color: #da3084;
    }
`

const Link: React.FC<{href: string}> = ({href, children = 'here'}) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
)

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appbar: {
        backgroundColor: theme.palette.primary.main
    }
}));


const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <Button color="inherit" onClick={() => loginWithRedirect()}>Log In</Button>;
};


const UserButton = () => {
    const jwtToken = useSelector((state:RootState) => state.appSlice.jwtToken);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        //logout({ returnTo: window.location.origin })

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return jwtToken && <div>
        <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
        >
            <AccountCircle/>
        </IconButton>
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </div>
}


export const TopBanner: React.FC = () => {
    const classes = useStyles();
    const jwtToken = useSelector((state:RootState) => state.appSlice.jwtToken);

        return (<AppBar position="static" className = {classes.appbar}>
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    PDF template designer
                </Typography>
                { jwtToken && <UserButton/> }
                { !jwtToken && <LoginButton/> }
            </Toolbar>
        </AppBar>)
}