import HomeView from './views/HomeView/HomeView';
import Navbar from './layouts/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './providers/UserProvider';
import SavedServicesView from './views/SavedServicesView/SavedServicesView';
import ErrorView from './views/ErrorView/ErrorView';
import MyPostsView from './views/MyPostsView/MyPostsView';
import PostView from './views/PostView/PostView';
import FilterPostsProvider from './providers/FilterPostsProvider';
import BrowseAllView from './views/BrowseAll/BrowseAllView';
import SellerProfileView from './views/SellerProfileView/SellerProfileView';
import MyOrdersView from './views/MyOrdersView/MyOrdersView';
import ClientOrdersView from './views/ClientOrdersView/ClientOrdersView';

function App() {
    return (
        <div className="bg-bg-light">
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomeView />} />
                            <Route path="sellers/:username" element={<SellerProfileView />} />
                            <Route path=":username?/saved/posts" element={
                                <FilterPostsProvider key={`saved`} urlPrefix="/users">
                                    <SavedServicesView />
                                </FilterPostsProvider>} 
                            />
                            <Route path="posts/all" element={
                                <FilterPostsProvider key={`posts`} urlPrefix="">
                                    <BrowseAllView />
                                </FilterPostsProvider>} 
                            />
                            <Route path=":username?/posts" element={
                                <FilterPostsProvider key={`my-posts`} urlPrefix="/users">
                                    <MyPostsView />
                                </FilterPostsProvider>} 
                            />
                            <Route path=":username?/orders" element={<MyOrdersView />} />
                            <Route path=":username?/client-orders" element={<ClientOrdersView />} />
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