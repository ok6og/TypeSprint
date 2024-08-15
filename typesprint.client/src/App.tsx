import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.tsx';
import Login from './Pages/Login.tsx';
import Register from './Pages/Register.tsx';
import Layout from './Components/Layout.tsx';
import AuthorizeView from './Components/AuthorizeView.tsx';
import SourceManagementPage from './Pages/SourceManagementPage.tsx';
import QuoteManagementPage from './Pages/QuoteManagementPage.tsx'



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    {/*<Route path="/add-quote" element={<AddQuote />} />*/}
                    <Route path="/source-management" element={<SourceManagementPage />} />
                    <Route path="/quote-management" element={<QuoteManagementPage /> } />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );

}
export default App;