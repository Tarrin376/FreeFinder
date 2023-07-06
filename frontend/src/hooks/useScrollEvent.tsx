import { useEffect } from "react";

export const MOD = 5;

export function useScrollEvent(pageRef: React.RefObject<HTMLDivElement>, loading: boolean, reachedBottom: boolean, 
    goToNextPage: () => void, page: number) {

    function loadMoreContent(): void {
        let documentHeight = document.body.scrollHeight;
        let currentScroll = window.scrollY + window.innerHeight;

        if (currentScroll + 200 >= documentHeight && !reachedBottom && !loading && page % MOD !== 0) {
            goToNextPage();
        }
    }

    useEffect(() => {
        if (pageRef && pageRef.current) {
            pageRef.current.addEventListener('wheel', loadMoreContent, { passive: true });
        }

        const cur = pageRef.current;
        return () => {
            if (pageRef && cur) {
                cur.removeEventListener('wheel', loadMoreContent);
            }
        }
    });
}