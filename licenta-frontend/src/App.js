import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import {BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import MainRoutingPage from "./pages/MainRoutingPage";
import {HomePageParent} from "./pages/parent/HomePageParent";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {AuthContext, AuthContextProvider, isTrainer} from "./context/AuthContextProvider";
import theme from "./theme";
import {useContext, useEffect} from "react";
import {Navbar} from "./components/Navbar";
import {MyChildren} from "./pages/parent/MyChildren";
import {ViewAdPage} from "./pages/ViewAdPage";
import {MyGroupsPage} from "./pages/trainer/MyGroupsPage";
import {MyAdsPage} from "./pages/trainer/MyAdsPage";
import {MyActivitiesPage} from "./pages/trainer/MyActivitiesPage";
import {ViewGroupPage} from "./pages/ViewGroupPage";
import {FirebaseMessagingContext, FirebaseMessagingProvider} from "./context/FirebaseMessagingProvider";

import {getParentId, getTrainerId} from "./helpers/localStorageHelper";
import {ViewSessionPage} from "./pages/trainer/ViewSessionPage";
import { ViewSessionCommentsPage } from "./pages/ViewSessionCommentsPage";


const PrivateRoute = ({customProps}) => {
    const {isRefreshTokenValid, logout} = useContext(AuthContext);

    return isRefreshTokenValid() ? <Outlet context={customProps}/> : <Navigate to="/" replace/>;
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container maxWidth="lg">
                <BrowserRouter>
                    <AuthContextProvider>
                        <FirebaseMessagingProvider>
                        <AuthWrapper/>
                        </FirebaseMessagingProvider>
                    </AuthContextProvider>
                </BrowserRouter>
            </Container>
        </ThemeProvider>
    );
};

const AuthWrapper = () => {
    const {isRefreshTokenValid, logout} = useContext(AuthContext);
    const {clearMessaging} = useContext(FirebaseMessagingContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearMessaging(isTrainer() ? getTrainerId() : getParentId(), isTrainer());
        logout();
        navigate("/login");
    };

    return (
        <>
            {isRefreshTokenValid() &&
                <Navbar onLogout={handleLogout}/>}
            <Routes>
                <Route exact path="/" element={<MainRoutingPage/>}/>
                <Route exact path="/login" element={<LoginPage/>}/>
                <Route exact path="/register" element={<RegisterPage/>}/>
                <Route element={<PrivateRoute/>}>
                    {/*common routes*/}
                    <Route exact path="/view-ad/:id" element={<ViewAdPage/>} />
                    <Route exact path="/view-group/:id" element={<ViewGroupPage/>} />
                    <Route path="/view-session/:sessionId/:groupId" element={<ViewSessionPage />} />
                    <Route path="/view-session-comments/:sessionId/:groupId" element={<ViewSessionCommentsPage />} />
                    {/*parent routes*/}
                    <Route exact path="/home-page-parent" element={<HomePageParent/>}/>
                    <Route exact path='/my-children' element={<MyChildren/>}/>
                    {/*trainer routes*/}
                    <Route exact path="/my-groups/:activityId" element={<MyGroupsPage/>}/>
                    <Route exact path="/my-groups/" element={<MyGroupsPage/>}/>
                    <Route exact path="/my-activities" element={<MyActivitiesPage/>}/>
                    <Route exact path="/my-ads" element={<MyAdsPage/>}/>
                    {/*<Route exact path="/home-page-trainer" element={<HomePageTrainer/>}/>*/}
                </Route>
            </Routes>
        </>
    );
};


export default App;
