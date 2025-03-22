import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Button,
    useMediaQuery,
    Box
} from "@mui/material";
import { Menu as MenuIcon, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { isTrainer } from "../context/AuthContextProvider";

export const Navbar = ({ onLogout }) => {
    const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
    const [desktopAnchorEl, setDesktopAnchorEl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const isMobile = useMediaQuery("(max-width:600px)");
    const navigate = useNavigate();

    useEffect(() => {
        setUserRole(isTrainer() ? "trainer" : "parent");
    }, []);

    const handleMobileMenuOpen = (event) => setMobileAnchorEl(event.currentTarget);
    const handleMobileMenuClose = () => setMobileAnchorEl(null);

    const handleDesktopMenuOpen = (event) => setDesktopAnchorEl(event.currentTarget);
    const handleDesktopMenuClose = () => setDesktopAnchorEl(null);

    const handleNavigate = (path, closeFn) => {
        closeFn();
        navigate(path);
    };

    const renderMenuItems = (closeFn, isMobileMenu) => {
        const items = [];

        if (userRole === "parent") {
            items.push(
                <MenuItem key="home-parent" onClick={() => handleNavigate('/home-page-parent', closeFn)}>Acasă</MenuItem>,
                <MenuItem key="my-children" onClick={() => handleNavigate('/my-children', closeFn)}>Vizualizare copii</MenuItem>,
                <MenuItem key="parent-profile" onClick={() => handleNavigate('/parent-profile', closeFn)}>Profilul meu</MenuItem>
            );
        }

        if (userRole === "trainer") {
            items.push(
                <MenuItem key="trainer-courses" onClick={() => handleNavigate('/trainer-courses', closeFn)}>Activitățile mele</MenuItem>,
                <MenuItem key="my-ads" onClick={() => handleNavigate('/my-ads', closeFn)}>Anunțurile mele</MenuItem>,
                <MenuItem key="my-groups" onClick={() => handleNavigate('/my-groups', closeFn)}>Grupele mele</MenuItem>,
                <MenuItem key="trainer-profile" onClick={() => handleNavigate('/trainer-profile', closeFn)}>Profilul meu</MenuItem>
            );
        }

        if (isMobileMenu) {
            items.push(
                <MenuItem key="logout" onClick={onLogout}>
                    <Logout /> Logout
                </MenuItem>
            );
        }

        return items;
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {isMobile ? (
                    <>
                        <IconButton edge="start" color="inherit" onClick={handleMobileMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={mobileAnchorEl}
                            open={Boolean(mobileAnchorEl)}
                            onClose={handleMobileMenuClose}
                        >
                            {renderMenuItems(handleMobileMenuClose, true)}
                        </Menu>
                    </>
                ) : (
                    <>
                        <Box>
                            <Button variant="navigation-bar" onClick={handleDesktopMenuOpen}>Meniu</Button>
                            <Menu
                                anchorEl={desktopAnchorEl}
                                open={Boolean(desktopAnchorEl)}
                                onClose={handleDesktopMenuClose}
                            >
                                {renderMenuItems(handleDesktopMenuClose)}
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
