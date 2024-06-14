import React, { useState } from "react";
import { X } from "react-feather";

import Wrapper from "../assets/wrappers/CustomInput";

const CustomInput = (props) => {
    const {
        text,
        onSubmit,
        displayClass,
        editClass,
        placeholder,
        defaultValue,
        buttonText,
        master,
    } = props;

    console.log(props,"inside custom input -- 28")
    const [isCustomInput, setIsCustomInput] = useState(false);
    const [inputText, setInputText] = useState(defaultValue || "");

    const submission = (e) => {
        e.preventDefault();
        if (inputText && onSubmit) {
            onSubmit(inputText);
            setInputText("");
        }
        setIsCustomInput(false);
    };

    function handleClick() {
        if (master) setIsCustomInput(true);
    }

    console.log(isCustomInput,"isCustomInput --- 45")

    return (
        <Wrapper>
        <div className="custom-input">
            {isCustomInput ? (
                <form
                    className={`custom-input-edit ${editClass ? editClass : ""}`}
                    onSubmit={submission}
                >
                    <input
                        type="text"
                        value={inputText}
                        placeholder={placeholder || text}
                        onChange={(event) => setInputText(event.target.value)}
                        autoFocus
                    />
                    <div className="custom-input-edit-footer">
                        <button type="submit">{buttonText || "Add"}</button>
                        <X onClick={() => setIsCustomInput(false)} className="closeIcon" />
                    </div>
                </form>
            ) : (
                <p
                    className={`custom-input-display ${displayClass ? displayClass : ""}`}
                    onClick={handleClick}
                >
                    {text}
                </p>
            )}
        </div>
        </Wrapper>
    );
};

export default CustomInput;
