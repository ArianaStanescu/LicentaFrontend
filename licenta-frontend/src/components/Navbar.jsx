import React, {useState} from "react";
import {AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery, Box} from "@mui/material";
import {Menu as MenuIcon, Logout} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export const Navbar = ({onLogout}) => {
    const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
    const [desktopAnchorEl, setDesktopAnchorEl] = useState(null);
    const isMobile = useMediaQuery("(max-width:600px)");
    const navigate = useNavigate();

    const handleMobileMenuOpen = (event) => {
        setMobileAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileAnchorEl(null);
    };

    const handleDesktopMenuOpen = (event) => {
        setDesktopAnchorEl(event.currentTarget);
    };

    const handleDesktopMenuClose = () => {
        setDesktopAnchorEl(null);
    };


    return (
        <AppBar position="static">
            <Toolbar>
                {isMobile ? (
                    <>
                        <IconButton edge="start" color="inherit" onClick={handleMobileMenuOpen}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu anchorEl={mobileAnchorEl} open={Boolean(mobileAnchorEl)} onClose={handleMobileMenuClose}>
                            <MenuItem onClick= {() => { handleDesktopMenuClose(); navigate('/my-children'); }}>Vizualizare copii</MenuItem>
                            <MenuItem onClick={onLogout}><Logout/> Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Box>
                            <Button variant={'navigation-bar'} onClick={handleDesktopMenuOpen}>Meniu</Button>
                            <Menu anchorEl={desktopAnchorEl} open={Boolean(desktopAnchorEl)} onClose={handleDesktopMenuClose}>
                                <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/home-page-parent'); }}>Acasă</MenuItem>
                                <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/my-children'); }}>Vizualizare copii</MenuItem>
                            </Menu>
                        </Box>
                        <Typography variant="h6" sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                            My App
                        </Typography>
                        <Button variant={'navigation-bar'} startIcon={<Logout/>} onClick={onLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};