import {Container} from "react-bootstrap";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider";
import MainRoutingPage from "./pages/MainRoutingPage";
import {HomePageParent} from "./pages/HomePageParent";

const App = () => {
    return (
        <Container>
            <BrowserRouter>
                <UserContextProvider>
                    <Routes>
                        <Route exact path="/" element={<MainRoutingPage/>}/>
                        <Route exact path="/home-page-parent" element={<HomePageParent/>}/>
                        {/*<Route exact path="/home-page-trainer" component={HomePage} />*/}
                    </Routes>
                </UserContextProvider>
            </BrowserRouter>
        </Container>
    );
};

export default App;
