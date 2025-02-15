import {Col, Row} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContextProvider";
import {useHistory} from "react-router-dom";

const MainPage = () => {
    const history = useHistory();
    // const navigate = useNavigate();
    const {
        isLoggedIn,
    } = useContext(UserContext);

    useEffect(() => {
        if (isLoggedIn) {
            history.push("/home-page-parent");
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