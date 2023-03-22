import HomePage from './views/Home/HomePage';
import Navbar from './layouts/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './context/UserContext';
import SavedServicesPage from './views/SavedServices/SavedServicesPage';
import ErrorPage from './views/Error/ErrorPage';
import MyPostsPage from './views/MyPosts/MyPostsPage';
import PostPage from './views/Post/PostPage';

function App() {
    return (
        <div className="bg-[#F6F6F6]">
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomePage />} />
                            <Route path=":username?/saved" element={<SavedServicesPage />} />
                            <Route path=":username?/my-posts" element={<MyPostsPage />} />
                            <Route path=":username/" element={<PostPage />} />
                            <Route path="*" element={<ErrorPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
}

export default App;