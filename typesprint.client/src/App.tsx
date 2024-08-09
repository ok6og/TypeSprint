import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.tsx';
import Login from './Pages/Login.tsx';
import Register from './Pages/Register.tsx';
//import LandingPage from './Components/Landing.tsx';
//import TypingRace from './Components/TypingRace';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<LandingPage />} />*/}
                {/*<Route path="/login" element={<Login />} />*/}
                {/*<Route path="/register" element={<Register />} />*/}
                {/*<Route path="/typing-race" element={<TypingRace />} />*/}
                

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );

}
export default App;