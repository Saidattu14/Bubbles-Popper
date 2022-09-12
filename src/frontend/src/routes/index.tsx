import { Game } from '../components/Game';
import {
  Route,
  Routes,
} from "react-router-dom";
import { Home } from '../components/Home';

const routes = (
    <Routes>
       
      <Route path="/game" element={<Game></Game>}>
      <Route path=":gametype" element={<Game />} />
      </Route>
      <Route path='/' element= {<Home></Home>}></Route>
    </Routes>
   
  
)

export default routes
