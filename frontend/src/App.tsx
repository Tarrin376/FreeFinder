import HomeView from './views/HomeView/HomeView';
import Navbar from './layouts/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './context/UserContext';
import SavedServicesView from './views/SavedServicesView/SavedServicesView';
import ErrorView from './views/ErrorView/ErrorView';
import MyPostsView from './views/MyPostsView/MyPostsView';
import PostView from './views/PostView/PostView';

function App() {
    return (
        <div className="bg-[#fafbfd]">
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomeView />} />
                            <Route path=":username?/saved-posts" element={<SavedServicesView />} />
                            <Route path=":username?/posts" element={<MyPostsView />} />
                            <Route path="posts/:id" element={<PostView />} />
                            <Route path="*" element={<ErrorView />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
}

export default App;