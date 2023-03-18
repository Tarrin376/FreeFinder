import { useEffect, useState, useRef } from 'react';
import { IUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from '../utils/fetchPosts';
import { IPost } from '../models/IPost';

export function useFetchPosts(pageRef: React.RefObject<HTMLDivElement>, userContext: IUserContext, url: string) {
    const [reachedBottom, setReachedBottom] = useState<boolean>(false);
    const [nextPage, setNextPage] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [posts, setPosts] = useState<IPost[]>([]);
    const cursor = useRef<string>("HEAD");
    const navigate = useNavigate();

    function loadMoreContent(): void {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;

        if (currentScroll >= documentHeight && !reachedBottom && !loading) {
            setNextPage((state) => !state);
        }
    }

    useEffect(() => {
        if (userContext.userData.username === "") {
            navigate("/");
        }

        if (pageRef && pageRef.current) {
            pageRef.current.addEventListener('wheel', loadMoreContent);
        }

        const cur = pageRef.current;
        return () => {
            if (pageRef && cur) {
                cur.removeEventListener('wheel', loadMoreContent);
            }
        }
    });

    useEffect(() => {
        try {
            setLoading(true);
            setTimeout(() => {
                fetchPosts(url, setPosts)
                .then((next) => {
                    if (next === cursor.current) setReachedBottom(true);
                    else cursor.current = next;
                    setErrorMessage("");
                    setLoading(false);
                }).catch((err: any) => { 
                    setErrorMessage(err.message);
                    setLoading(false);
                });
            }, 2000);
        }
        catch(err: any) {
            setErrorMessage(err.message);
        }
    }, [nextPage, url]);

    return { posts, errorMessage, loading };
}