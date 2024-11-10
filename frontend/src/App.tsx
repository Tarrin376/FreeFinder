import HomeView from './views/Home/HomeView';
import Navbar from './components/layout/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProvider from './providers/UserProvider';
import SavedServices from './views/SavedServices/SavedServices';
import ErrorView from './views/Error/ErrorView';
import MyPosts from './views/MyPosts/MyPosts';
import Post from './views/Post/Post';
import FilterPostsProvider from './providers/FilterPostsProvider';
import BrowseAllView from './views/BrowseAll/BrowseAllView';
import SellerProfile from './views/SellerProfile/SellerProfile';
import MyOrders from './views/MyOrders/MyOrders';
import ClientOrdersView from './views/ClientOrders/ClientOrdersView';

function App() {
    return (
        <div className="bg-bg-light">
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navbar />}>
                            <Route index element={<HomeView />} />
                            <Route path="sellers/:username" element={<SellerProfile />} />
                            <Route path=":username?/saved/posts" element={
                                <FilterPostsProvider key={`saved`} urlPrefix="/users">
                                    <SavedServices />
                                </FilterPostsProvider>} 
                            />
                            <Route path="posts/all" element={
                                <FilterPostsProvider key={`posts`} urlPrefix="">
                                    <BrowseAllView />
                                </FilterPostsProvider>} 
                            />
                            <Route path=":username?/posts" element={
                                <FilterPostsProvider key={`my-posts`} urlPrefix="/users">
                                    <MyPosts />
                                </FilterPostsProvider>} 
                            />
                            <Route path=":username?/orders" element={<MyOrders />} />
                            <Route path=":username?/client-orders" element={<ClientOrdersView />} />
                            <Route path="posts/:id" element={<Post />} />
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