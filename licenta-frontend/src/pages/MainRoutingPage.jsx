import {Col, Row} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContextProvider";
import { useNavigate} from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();
    const {
        isLoggedIn,
    } = useContext(UserContext);

    useEffect(() => {
        console.log("Main");
        if (isLoggedIn) {
            navigate("/home-page-parent");
        }
    },[]);

    return (
        <Row>
            <Col md={2} style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                Main routing page
            </Col>
        </Row>
    );
};

export default MainPage;