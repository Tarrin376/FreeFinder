import HomePage from './views/Home/HomePage';
import Navbar from './layouts/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './context/UserContext';
import SavedServicesPage from './views/SavedServices/SavedServicesPage';
import ErrorPage from './views/Error/ErrorPage';

function App() {
    return (
        <UserProvider>
            <div className="bg-[#F6F6F6] min-h-screen">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomePage />} />
                            <Route path="saved/:username?" element={<SavedServicesPage />} />
                            <Route path="*" element={<ErrorPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </UserProvider>
    );
}

export default App;