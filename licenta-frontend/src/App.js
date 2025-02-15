import {Container} from "react-bootstrap";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider";
import MainRoutingPage from "./pages/MainRoutingPage";
import {HomePageParent} from "./pages/HomePageParent";

const App = () => {
  return (
    <Container>
      <BrowserRouter>
        <Switch>
          <UserContextProvider>
             <Route exact path="/" component={MainRoutingPage} />
              <Route exact path="/home-page-parent" component={HomePageParent} />
              {/*<Route exact path="/home-page-trainer" component={HomePage} />*/}
          </UserContextProvider>
        </Switch>
      </BrowserRouter>
    </Container>
  );
};

export default App;
