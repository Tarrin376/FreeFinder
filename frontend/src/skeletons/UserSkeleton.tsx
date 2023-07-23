function UserSkeleton() {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="loading rounded-full w-[41px] h-[41px]"></div>
                <p className="h-[16px] loading w-[80px]"></p>
            </div>
            <div className="loading w-[80px] h-[33px]"></div>
        </div>
    )
}

export default UserSkeleton;