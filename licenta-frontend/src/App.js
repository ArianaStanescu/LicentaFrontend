import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider";
import MainRoutingPage from "./pages/MainRoutingPage";
import {HomePageParent} from "./pages/HomePageParent";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {AuthContextProvider} from "./context/AuthContextProvider";
import {HomePageTrainer} from "./pages/HomePageTrainer";
import theme from "./theme";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <BrowserRouter>
                    <UserContextProvider>
                        <AuthContextProvider>
                            <Routes>
                                <Route exact path="/" element={<MainRoutingPage />} />
                                <Route exact path="/login" element={<LoginPage />} />
                                <Route exact path="/register" element={<RegisterPage />} />
                                <Route exact path="/home-page-parent" element={<HomePageParent />} />
                                <Route exact path="/home-page-trainer" element={<HomePageTrainer />} />
                            </Routes>
                        </AuthContextProvider>
                    </UserContextProvider>
                </BrowserRouter>
            </Container>
        </ThemeProvider>
    );
};

export default App;
