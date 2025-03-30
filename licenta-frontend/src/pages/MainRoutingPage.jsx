import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getParentId, getTrainerId} from "../helpers/localStorageHelper";
import {AuthContext, isTrainer} from "../context/AuthContextProvider";
import {FirebaseMessagingContext} from "../context/FirebaseMessagingProvider";

const MainPage = () => {
    const navigate = useNavigate();
    const {getValidAccessToken} = useContext(AuthContext);
    const {initializeMessaging} = useContext(FirebaseMessagingContext);

    const reroute = async () => {
        if ((getTrainerId() || getParentId()) && await getValidAccessToken()) {
            if (getTrainerId()) {
                // navigate("/home-page-trainer");
                initializeMessaging(isTrainer() ? getTrainerId() : getParentId(), isTrainer());
                navigate("/my-groups");
            } else {
                initializeMessaging(isTrainer() ? getTrainerId() : getParentId(), isTrainer());
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