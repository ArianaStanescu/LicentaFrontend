import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider";
import MainRoutingPage from "./pages/MainRoutingPage";
import { HomePageParent } from "./pages/HomePageParent";
import { LoginPage } from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";

const App = () => {
    return (
        <Container maxWidth="lg"> {/* Material UI Container */}
            <BrowserRouter>
                <UserContextProvider>
                    <Routes>
                        <Route exact path="/" element={<MainRoutingPage />} />
                        <Route exact path="/login" element={<LoginPage />} />
                        <Route exact path="/register" element={<RegisterPage />} />
                         <Route exact path="/home-page-parent" element={<HomePageParent />} />
                        {/* <Route exact path="/home-page-trainer" component={HomePage} /> */}
                    </Routes>
                </UserContextProvider>
            </BrowserRouter>
        </Container>
    );
};

export default App;
