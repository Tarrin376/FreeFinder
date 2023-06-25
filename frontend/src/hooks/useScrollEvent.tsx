import { useEffect } from "react";

export function useScrollEvent(pageRef: React.RefObject<HTMLDivElement>, loading: boolean, 
    reachedBottom: boolean, setNextPage: React.Dispatch<React.SetStateAction<boolean>>) {

    function loadMoreContent(): void {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;

        if (currentScroll + 200 >= documentHeight && !reachedBottom && !loading) {
            setNextPage((state) => !state);
        }
    }

    useEffect(() => {
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