import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import {BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import MainRoutingPage from "./pages/MainRoutingPage";
import {HomePageParent} from "./pages/HomePageParent";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {AuthContext, AuthContextProvider} from "./context/AuthContextProvider";
import {HomePageTrainer} from "./pages/HomePageTrainer";
import theme from "./theme";
import {useContext} from "react";
import {Navbar} from "./components/Navbar";
import {MyChildren} from "./pages/MyChildren";
import {ViewAdPage} from "./pages/ViewAdPage";
import {MyGroupsPage} from "./pages/MyGroupsPage";
import {MyAdsPage} from "./pages/MyAdsPage";

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
                        <AuthWrapper/>
                    </AuthContextProvider>
                </BrowserRouter>
            </Container>
        </ThemeProvider>
    );
};

const AuthWrapper = () => {
    const {isRefreshTokenValid, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
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
                    <Route exact path="/home-page-parent" element={<HomePageParent/>}/>
                    <Route exact path="/view-ad/:id" element={<ViewAdPage/>} />
                    <Route exact path='/my-children' element={<MyChildren/>}/>
                    {/*trainer router*/}
                    <Route exact path="/my-groups" element={<MyGroupsPage/>}/>
                    <Route exact path="/my-ads" element={<MyAdsPage/>}/>
                    {/*<Route exact path="/home-page-trainer" element={<HomePageTrainer/>}/>*/}
                </Route>
            </Routes>
        </>
    );
};


export default App;
