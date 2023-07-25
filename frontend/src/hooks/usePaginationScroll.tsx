import { useEffect } from "react";

export const MOD = 5;

export function usePaginationScroll(pageRef: React.RefObject<HTMLDivElement>, loading: boolean, 
    reachedBottom: boolean, goToNextPage: () => void, page: number, reverseScroll?: boolean): void {

    function loadMoreContent(): void {
        if (!pageRef.current) {
            return;
        }

        const scrollTop = pageRef.current.scrollTop;
        const scrollHeight = pageRef.current.scrollHeight;
        const offsetHeight = pageRef.current.offsetHeight;

        const hitScrollBottom = scrollHeight - offsetHeight - 200 <= scrollTop && !reverseScroll;
        const hitScrollTop = scrollHeight - offsetHeight - 200 <= Math.abs(scrollTop) && reverseScroll;

        if ((hitScrollBottom || hitScrollTop) && !reachedBottom && !loading && page % MOD !== 0) {
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