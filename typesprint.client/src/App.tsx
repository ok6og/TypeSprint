import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.tsx';
import Login from './Pages/Login.tsx';
import Register from './Pages/Register.tsx';
import Layout from './Components/Layout/Layout.tsx';
import AuthorizeView from './Components/Auth/AuthorizeView.tsx';
import SourceManagementPage from './Pages/SourceManagementPage.tsx';
import QuoteManagementPage from './Pages/QuoteManagementPage.tsx';
import ProfilePage from './Pages/Profile.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*NO AUTHORIZATION*/}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/*WITH AUTHORIZATION*/}
                <Route element={<AuthorizeView><Layout /></AuthorizeView>}>
                        <Route path="/" element={<Home />} />
                        <Route path="/source-management" element={<SourceManagementPage />} />
                        <Route path="/quote-management" element={<QuoteManagementPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );

}
export default App;