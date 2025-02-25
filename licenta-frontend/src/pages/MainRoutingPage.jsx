import {Col, Row} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContextProvider";
import { useNavigate} from "react-router-dom";
import {Typography} from "@mui/material";

const MainPage = () => {
    const navigate = useNavigate();
    const {
        isLoggedIn,
    } = useContext(UserContext);

    useEffect(() => {
        console.log("Main");
        // if (isLoggedIn) {
        //     navigate("/home-page-parent");
        // }
        navigate("/login");
    },[]);

    return (
        <Typography> Main routing page </Typography>
    );
};

export default MainPage;