import { useEffect } from "react";
import { IUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export function useScrollEvent(userContext: IUserContext, pageRef: React.RefObject<HTMLDivElement>, loading: boolean, 
    reachedBottom: boolean, setNextPage: React.Dispatch<React.SetStateAction<boolean>>) {
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
}