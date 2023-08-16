interface ProfileSummaryItemProps {
    image: string,
    itemKey: string,
    itemValue: string
}

function ProfileSummaryItem({ image, itemKey, itemValue }: ProfileSummaryItemProps) {
    return (
        <div className="flex gap-2 items-center">
            <img src={image} width="20px" height="20px" alt="location" />
            <p className="text-side-text-gray">{itemKey}</p>
            <p className="ml-auto">{itemValue}</p>
        </div>
    )
}

export default ProfileSummaryItem;