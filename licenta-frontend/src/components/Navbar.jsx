import React, {useState} from "react";
import {AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery} from "@mui/material";
import {Menu as MenuIcon, Logout} from "@mui/icons-material";

export const Navbar = ({onLogout}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useMediaQuery("(max-width:600px)");

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {isMobile ? (
                    <>
                        <IconButton edge="start" color="inherit" onClick={handleMenuOpen}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={onLogout}><Logout/> Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" sx={{flexGrow: 1}}>
                            My App
                        </Typography>
                        <Button color="inherit" startIcon={<Logout/>} onClick={onLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};