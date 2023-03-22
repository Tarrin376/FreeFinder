
function Review({ styles }: { styles?: string }) {
    return (
        <div className={`w-[50%] flex items-center gap-4 p-4 ${styles}`}>
            <div className="min-w-[60px] min-h-[60px] rounded-full bg-black"></div>
            <div className="">
                <p className="text-main-purple">Jason Fried <span className="text-side-text-gray ml-2">Nov 10, 2020</span></p>
                <p className="text-paragraph-text">
                    sfg indfjg ndfgh ndfg hnjdg jdig jdfgjndfg jbdnh fdgng dfjg dfnjg fdn hdfg sfg 
                    ndfg jndfg jndf gjdfng jd nh dg jsg jndfg jndfgd fjngsfk jsd f kmsdf sdnf djfnhdfjg
                    sdjnf dfg
                </p>
            </div>
        </div>
    )
}

export default Review;