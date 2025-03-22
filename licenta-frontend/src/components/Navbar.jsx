import React, {useEffect, useState} from "react";
import {AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery, Box} from "@mui/material";
import {Menu as MenuIcon, Logout} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {isTrainer} from "../context/AuthContextProvider";

export const Navbar = ({onLogout}) => {
    const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
    const [desktopAnchorEl, setDesktopAnchorEl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const isMobile = useMediaQuery("(max-width:600px)");
    const navigate = useNavigate();

    useEffect(() => {
        if (isTrainer()) {
            setUserRole("trainer");
        } else{
            setUserRole("parent");
        }
    }, []);


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
                            {userRole === "parent" ? (
                                <>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/home-page-parent'); }}>Acasă</MenuItem>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/my-children'); }}>Vizualizare copii</MenuItem>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/parent-profile'); }}>Profilul meu</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/trainer-courses'); }}>Activitățile mele</MenuItem>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/trainer-courses'); }}>Anunțurile mele</MenuItem>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/trainer-courses'); }}>Grupelee mele</MenuItem>
                                    <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/trainer-profile'); }}>Profilul meu</MenuItem>
                                </>
                            )}
                            <MenuItem onClick={onLogout}><Logout/> Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Box>
                            <Button variant={'navigation-bar'} onClick={handleDesktopMenuOpen}>Meniu</Button>
                            <Menu anchorEl={desktopAnchorEl} open={Boolean(desktopAnchorEl)} onClose={handleDesktopMenuClose}>
                                {userRole === "parent" ? (
                                    <>
                                        <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/home-page-parent'); }}>Acasă</MenuItem>
                                        <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/my-children'); }}>Vizualizare copii</MenuItem>
                                        <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/parent-profile'); }}>Profilul meu</MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/my-groups'); }}>Grupele mele</MenuItem>
                                        <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/my-ads'); }}>Anunțurile mele</MenuItem>
                                        <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/trainer-courses'); }}>Activitățile mele</MenuItem>
                                        <MenuItem onClick={() => { handleDesktopMenuClose(); navigate('/trainer-profile'); }}>Profilul meu</MenuItem>
                                    </>
                                )}
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