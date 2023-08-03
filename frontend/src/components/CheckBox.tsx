interface CheckBoxProps {
    labelName: string,
    text: string,
    styles?: string,
    setChecked: React.Dispatch<React.SetStateAction<boolean>>
}

function CheckBox({ labelName, text, styles, setChecked }: CheckBoxProps) {
    return (
        <div className={`flex items-center gap-2 ${styles}`}>
            <input type="checkbox" name={labelName} onChange={() => setChecked((cur) => !cur)} />
            <label htmlFor={labelName} className="text-sm text-side-text-gray">
                {text}
            </label>
        </div>
    )
}

export default CheckBox;