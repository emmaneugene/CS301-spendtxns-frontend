import { useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import NavBar from "./components/NavBar";
import Authentication from "./pages/Authentication"
import Rewards from "./pages/Rewards"

const NavBarWithRouter = withRouter(NavBar)

function App() {
  const [authed, setAuthed] = useState(true)

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login"><Authentication authed={authed} setAuthed={setAuthed} /></Route>
        <PrivateRoute authed={authed} setAuthed={setAuthed}   ><MainContainer authed={authed} setAuthed={setAuthed} /></PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}


const MainContainer = ({ authed, setAuthed }) => (
  <div className="app-container">
    <NavBarWithRouter />
    <Route exact path="/" >
      <Rewards authed={authed} setAuthed={setAuthed} />
    </Route>
  </div>
)
export default App;
