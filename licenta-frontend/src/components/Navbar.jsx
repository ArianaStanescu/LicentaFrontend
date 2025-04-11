import React, {useContext, useEffect, useState} from "react";
import {
    AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery, Box, Badge
} from "@mui/material";
import {Menu as MenuIcon, Logout, Notifications, DoneAll, Check} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {isTrainer} from "../context/AuthContextProvider";
import {getLatestNotifications} from "../api/notifications/getLatestNotifications";
import {getParentId, getTrainerId} from "../helpers/localStorageHelper";
import {markNotificationsAsSeen} from "../api/notifications/markAsRead";
import {FirebaseMessagingContext} from "../context/FirebaseMessagingProvider";

export const Navbar = ({onLogout}) => {
    const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
    const [desktopAnchorEl, setDesktopAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const isMobile = useMediaQuery("(max-width:600px)");
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [nrOfUnreadNotifications, setNrOfUnreadNotifications] = useState(0);
    const {refreshNotifications} = useContext(FirebaseMessagingContext);

    useEffect(() => {
        setUserRole(isTrainer() ? "trainer" : "parent");
    }, []);

    useEffect(() => {
        getNotifications();
    }, []);

    useEffect(() => {
        getNotifications();
    }, [refreshNotifications]);

    const getNotifications = async () => {
        const response = await getLatestNotifications(isTrainer() ? getTrainerId() : getParentId(), isTrainer());
        setNotifications(response);
        const unread = response.filter(notification => !notification?.seen).length;
        setNrOfUnreadNotifications(unread);
    }

    const handleMobileMenuOpen = (event) => setMobileAnchorEl(event.currentTarget);
    const handleMobileMenuClose = () => setMobileAnchorEl(null);

    const handleDesktopMenuOpen = (event) => setDesktopAnchorEl(event.currentTarget);
    const handleDesktopMenuClose = () => setDesktopAnchorEl(null);

    const handleNotificationsOpen = (event) => setNotificationsAnchorEl(event.currentTarget);
    const handleNotificationsClose = () => setNotificationsAnchorEl(null);

    const handleNavigate = (path, closeFn) => {
        closeFn();
        navigate(path);
    };

    const markAsSeen = async (notificationIds) => {
        await markNotificationsAsSeen(notificationIds);
        await getNotifications();
    }

    const renderNotifications = () => {
        if (notifications?.length === 0) {
            return <MenuItem>No new notifications</MenuItem>;
        }

        return <Box>
            {notifications.filter(notification => !notification.seen).length > 0 &&
                <Box sx={{display: "flex", justifyContent: "center", mb: 1}}>
                    <Button startIcon={<DoneAll/>} variant="notification"
                            onClick={() => markAsSeen(notifications.filter(notification => !notification.seen).map(notification => notification.id))}>
                        Mark all as seen
                    </Button>
                </Box>}
            {notifications?.map((notification, index) => (
                <MenuItem key={index} sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1}}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}
                                color={notification.seen ? "success.main" : "error.main"}>
                        {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {notification.body}
                    </Typography>
                    {!notification?.seen && (<Button startIcon={<Check/>} variant="notification"
                                                     onClick={() => markAsSeen([notification.id])}>
                        Mark as seen
                    </Button>)}
                </MenuItem>))}
        </Box>
    };

    const renderMenuItems = (closeFn, isMobileMenu) => {
        const items = [];

        if (userRole === "parent") {
            // const parentId = getParentId();
            items.push(
                <MenuItem key="home-parent" onClick={() => handleNavigate('/home-page-parent', closeFn)}>Acasă</MenuItem>,
                <MenuItem key="my-children" onClick={() => handleNavigate('/my-children', closeFn)}>Vizualizare copii</MenuItem>,
                <MenuItem key="my-favorite-trainers" onClick={() => handleNavigate(`/my-favorite-trainers`, closeFn)}>Vizualizare traineri favoriți</MenuItem>,
                <MenuItem key="parent-profile" onClick={() => handleNavigate('/parent-profile', closeFn)}>Profilul meu</MenuItem>);
        }

        if (userRole === "trainer") {
            items.push(
                <MenuItem key="my-activities" onClick={() => handleNavigate('/my-activities', closeFn)}>Activitățile mele</MenuItem>,
                <MenuItem key="my-ads" onClick={() => handleNavigate('/my-ads', closeFn)}>Anunțurile mele</MenuItem>,
                <MenuItem key="my-groups" onClick={() => handleNavigate('/my-groups', closeFn)}>Grupele mele</MenuItem>,
                <MenuItem key="trainer-profile" onClick={() => handleNavigate('/trainer-profile', closeFn)}>Profilul meu</MenuItem>);
        }

        if (isMobileMenu) {
            items.push(<MenuItem key="logout" onClick={onLogout}>
                <Logout/> Logout
            </MenuItem>);
        }

        return items;
    };

    return (<AppBar position="static">
        <Toolbar>
            {isMobile ? (<>
                <IconButton edge="start" color="inherit" onClick={handleMobileMenuOpen}>
                    <MenuIcon/>
                </IconButton>
                <Menu
                    anchorEl={mobileAnchorEl}
                    open={Boolean(mobileAnchorEl)}
                    onClose={handleMobileMenuClose}
                >
                    {renderMenuItems(handleMobileMenuClose, true)}
                </Menu>
                <IconButton color="inherit" onClick={handleNotificationsOpen}>
                    <Badge badgeContent={nrOfUnreadNotifications} color="error">
                        <Notifications/>
                    </Badge>
                </IconButton>
                <Menu
                    anchorEl={notificationsAnchorEl}
                    open={Boolean(notificationsAnchorEl)}
                    onClose={handleNotificationsClose}
                >
                    {renderNotifications()}
                </Menu>
            </>) : (<>
                <Box>
                    <Button variant="navigation-bar" onClick={handleDesktopMenuOpen}>Meniu</Button>
                    <Menu
                        anchorEl={desktopAnchorEl}
                        open={Boolean(desktopAnchorEl)}
                        onClose={handleDesktopMenuClose}
                    >
                        {renderMenuItems(handleDesktopMenuClose)}
                    </Menu>
                    <IconButton color="inherit" onClick={handleNotificationsOpen}>
                        <Badge badgeContent={nrOfUnreadNotifications} color="error">
                            <Notifications/>
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={notificationsAnchorEl}
                        open={Boolean(notificationsAnchorEl)}
                        onClose={handleNotificationsClose}
                    >
                        {renderNotifications()}
                    </Menu>
                </Box>
                <Typography variant="h6" sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                    KidSphere
                </Typography>
                <Button variant={'navigation-bar'} startIcon={<Logout/>} onClick={onLogout}>
                    Logout
                </Button>
            </>)}
        </Toolbar>
    </AppBar>);
};
