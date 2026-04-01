import React, { useState } from 'react';

import ReactiveTextArea from './reactiveTextArea';

export default function EditableInputText({originalText, inputType, name}){
    const[text, setText] = useState(originalText)
    const[isEditing, setIsEditing] = useState(false)

    const toggleEditing = () =>{
        setIsEditing(!isEditing)
    }

    const handleChange = (e) => {
        setText(e.target.value);
    }

    const handleDoubleClick = () => {
        setIsEditing(true);
      };
    
    const handleBlur = () => {
        setIsEditing(false);
    };
    
    const InputToRender = inputType
    return (
        isEditing ? (
            <InputToRender value={text} name={name} onBlur={handleBlur}
            onChange={handleChange}
            autoFocus />
        ) : 
        <span onDoubleClick={handleDoubleClick}>
            {text}
        </span>
    )


}