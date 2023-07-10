import { IPostImage } from "../models/IPostImage";
import BackIcon from "../assets/back.png";
import NextIcon from "../assets/next.png";
import { useRef, useState } from "react";
import React from "react";

interface CarouselProps {
    images: IPostImage[],
    btnSize: number,
    wrapperStyles: string,
    imageStyles?: string,
}

function Carousel({ images, btnSize, wrapperStyles, imageStyles }: CarouselProps) {
    const clickedBtn = useRef<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const imageRefs = useRef<React.RefObject<HTMLDivElement>[]>(new Array(images.length).fill(0).map(_ => React.createRef()));
    const imageClasses = useRef<string[]>(new Array(images.length).fill(0).map((_, i) => i === 0 ? "translate-x-0" : "translate-x-full"));

    function nextSlide(){
        clickedBtn.current = true;
        const currentSlide = imageRefs.current[index];
        const nextSlide = imageRefs.current[index + 1];

        currentSlide!.current!.classList.remove("translate-x-0");
        currentSlide!.current!.classList.add("-translate-x-full");
        imageClasses.current[index] = "-translate-x-full";

        nextSlide!.current!.classList.remove("translate-x-full");
        nextSlide!.current!.classList.add("translate-x-0");
        imageClasses.current[index + 1] = "translate-x-0";
        setIndex(index + 1);
    }
    
    function previousSlide(){
        clickedBtn.current = true;
        const currentSlide = imageRefs.current[index];
        const previousSlide = imageRefs.current[index - 1];

        currentSlide!.current!.classList.remove("translate-x-0");
        currentSlide!.current!.classList.add("translate-x-full");
        imageClasses.current[index] = "translate-x-full";

        previousSlide!.current!.classList.remove("-translate-x-full");
        previousSlide!.current!.classList.add("translate-x-0");
        imageClasses.current[index - 1] = "-translate-x-0";
        setIndex(index - 1);
    }

    return (
        <div className={`${wrapperStyles} overflow-hidden relative`}>
            {images.map((image: IPostImage, curIndex: number) => {
                return (
                    <div className={`w-full h-full absolute transition-all linear duration-200 
                    flex items-center justify-center ${imageClasses.current[curIndex]}`} 
                    key={curIndex} ref={imageRefs.current[curIndex]}>
                        <img 
                            src={image.url} 
                            className={`h-full ${imageStyles}`}
                            alt="" 
                        />
                    </div>
                )
            })}
            {index > 0 &&
            <button className="carousel-btn absolute top-1/2 translate-y-[-50%] left-3"
            onClick={previousSlide} style={{width: btnSize, height: btnSize}}>
                <img src={BackIcon} alt="" style={{width: 0.50 * btnSize, height: 0.50 * btnSize}} />
            </button>}
            {index < images.length - 1 &&
            <button className="carousel-btn absolute top-1/2 translate-y-[-50%] right-3"
            onClick={nextSlide} style={{width: btnSize, height: btnSize}}>
                <img src={NextIcon} alt="" style={{width: 0.50 * btnSize, height: 0.50 * btnSize}} />
            </button>}
        </div>
    )
}

export default Carousel;