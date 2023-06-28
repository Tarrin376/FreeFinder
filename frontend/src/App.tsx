import HomeView from './views/HomeView/HomeView';
import Navbar from './layouts/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './providers/UserContext';
import SavedServicesView from './views/SavedServicesView/SavedServicesView';
import ErrorView from './views/ErrorView/ErrorView';
import MyPostsView from './views/MyPostsView/MyPostsView';
import PostView from './views/PostView/PostView';
import FilterPostsProvider from './providers/FilterPostsContext';

function App() {
    return (
        <div className="bg-[#fafbfd]">
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomeView />} />
                            <Route path=":username?/saved-posts" element={
                                <FilterPostsProvider>
                                    <SavedServicesView />
                                </FilterPostsProvider>} 
                            />
                            <Route path=":username?/posts" element={
                                <FilterPostsProvider>
                                    <MyPostsView />
                                </FilterPostsProvider>} 
                            />
                            <Route path="posts/:id" element={<PostView />} />
                            <Route path="*" element={
                                <ErrorView 
                                    title="404" 
                                    errorMessage="This is not the page you are looking for..." 
                                />} 
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    );
}

export default App;