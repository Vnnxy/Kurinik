import { useState, useRef, useEffect } from 'react';

export default function ReactiveTextArea({ name, value, disabled }) {
  const [text, setText] = useState(value || "");
  const [rows, setRows] = useState(4);
  const textareaRef = useRef(null);
  const maxRows = 10;
  const lineHeight = 20;

  // ✅ Sync prop `value` to internal state if it changes
  useEffect(() => {
    setText(value || "");
    const lineCount = (value || "").split('\n').length;
    setRows(Math.min(maxRows, Math.max(4, lineCount)));
  }, [value]);

  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText);

    const lineCount = newText.split('\n').length;
    if (lineCount <= maxRows) {
      setRows(Math.max(4, lineCount));
    }
  };

  useEffect(() => {
    if (rows >= maxRows && textareaRef.current) {
      textareaRef.current.style.overflowY = 'auto';
    } else if (textareaRef.current) {
      textareaRef.current.style.overflowY = 'hidden';
    }
  }, [rows]);

  return (
    <textarea
      name={name}
      ref={textareaRef}
      value={text}
      onChange={handleChange}
      rows={rows}
      className="w-full border rounded py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 resize-none"
      style={{ maxHeight: `${maxRows * lineHeight}px` }}
      disabled={disabled}
    />
  );
}
