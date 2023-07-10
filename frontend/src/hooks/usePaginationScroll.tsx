import { useEffect } from "react";

export const MOD = 5;

export function usePaginationScroll(pageRef: React.RefObject<HTMLDivElement>, loading: boolean, 
    reachedBottom: boolean, goToNextPage: () => void, page: number) {

    function loadMoreContent(): void {
        if (!pageRef.current) {
            return;
        }

        let scrollTop = pageRef.current.scrollTop;
        let scrollHeight = pageRef.current.scrollHeight;
        let offsetHeight = pageRef.current.offsetHeight;

        if (scrollHeight - offsetHeight - 200 <= scrollTop && !reachedBottom && !loading && page % MOD !== 0) {
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