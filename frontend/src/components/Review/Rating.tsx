import StarSvg from "./StarSvg";

interface RatingProps {
    rating: number,
    setRating?: React.Dispatch<React.SetStateAction<number>>,
    size: number,
}

function Rating({ rating, setRating, size }: RatingProps) {
    function handleClick(newRating: number) {
        if (setRating) {
            setRating(newRating);
        }
    }

    return (
        <div className="flex items-center" style={{ gap: `${size / 20}px`}}>
            {new Array(5).fill(0).map((_, index: number) => {
                return (
                    <div key={index}>
                        {rating % 1 !== 0 && index + 1 - rating > 0 && index + 1 - rating < 1 ?
                        <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
                            <div className="overflow-hidden absolute top-0 left-0 z-10" 
                            style={{ width: `${size / 2}px`, height: `${size}px` }}>
                                <StarSvg
                                    backgroundColour="#EEB424"
                                    size={size}
                                />
                            </div>
                            <StarSvg
                                backgroundColour="#11111128"
                                size={size}
                                wrapperStyles="absolute top-0 left-0"
                            />
                        </div> :
                        <StarSvg
                            backgroundColour={index + 1 <= rating ? "#EEB424" : "#11111128"}
                            size={size}
                            action={() => handleClick(index + 1)}
                            styles={setRating && "cursor-pointer"}
                        />}
                    </div>
                )
            })}
        </div>
    )
}

export default Rating;