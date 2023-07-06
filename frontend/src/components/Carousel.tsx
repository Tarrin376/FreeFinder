import { IPostImage } from "../models/IPostImage";
import BackIcon from "../assets/back.png";
import NextIcon from "../assets/next.png";

interface CarouselProps {
    selectedImage: number,
    setSelectedImage: React.Dispatch<React.SetStateAction<number>>,
    images: IPostImage[],
    btnSize: number,
    wrapperStyles: string,
    imageStyles?: string,
}

function Carousel({ selectedImage, setSelectedImage, images, btnSize, wrapperStyles, imageStyles }: CarouselProps) {
    return (
        <div className={`${wrapperStyles} relative`}>
            <img 
                src={images[selectedImage].url} 
                alt="" 
                className={imageStyles} 
            />
            {selectedImage > 0 &&
            <button className="carousel-btn absolute top-1/2 translate-y-[-50%] left-3"
            onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))} 
            style={{width: btnSize, height: btnSize}}>
                <img src={BackIcon} alt="" style={{width: 0.55 * btnSize, height: 0.55 * btnSize}} />
            </button>}
            {selectedImage < images.length - 1 && 
            <button className="carousel-btn absolute top-1/2 translate-y-[-50%] right-3"
            onClick={() => setSelectedImage(Math.min(selectedImage + 1, images.length - 1))}
            style={{width: btnSize, height: btnSize}}>
                <img src={NextIcon} alt="" style={{width: 0.55 * btnSize, height: 0.55 * btnSize}} />
            </button>}
        </div>
    )
}

export default Carousel;