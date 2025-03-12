import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getParentId, getTrainerId} from "../helpers/localStorageHelper";
import {AuthContext} from "../context/AuthContextProvider";

const MainPage = () => {
    const navigate = useNavigate();
    const {getValidAccessToken} = useContext(AuthContext);

    const reroute = async () => {
        if ((getTrainerId() || getParentId()) && await getValidAccessToken()) {
            if (getTrainerId()) {
                navigate("/home-page-trainer");
            } else {
                navigate("/home-page-parent");
            }
        } else {
            navigate("/login");
        }
    }

    useEffect(() => {
        reroute();
    }, []);
};

export default MainPage;