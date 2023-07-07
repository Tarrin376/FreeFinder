import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from "react";

interface TextEditorProps {
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    limit: number
}

const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "image", "align", "size",
];

const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" }
        ],
        [{ "color": [
            "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", 
            "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", 
            "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", 
            "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", 
            "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", 
            "#663d00", "#666600", "#003700", "#002966", "#3d1466"
        ]}],
    ]
};

function TextEditor({ value, setValue, limit }: TextEditorProps) {
    const reactQuillRef = useRef<ReactQuill>(null);

    function updateValue(content: string): void {
        setValue(content);
    }

    function checkCharacterCount(e: React.KeyboardEvent<ReactQuill>): void {
        if (!reactQuillRef.current) {
            return;
        }

        const unprivilegedEditor = reactQuillRef.current.unprivilegedEditor;
        const length = unprivilegedEditor?.getLength() || 0;
        
        if (length > limit && e.key !== "Backspace") {
            e.preventDefault();
        }
    }

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={updateValue}
            onKeyDown={checkCharacterCount}
            formats={formats}
            modules={modules}
            style={{ backgroundColor: "#fefefe", borderRadius: "8px" }}
            ref={reactQuillRef}
        />
    )
}

export default TextEditor;