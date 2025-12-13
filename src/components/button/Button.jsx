import './Button.css';
import React from "react";

function Button({text, fetchCountry, loading}) {
    return (
        <button type="button"
                onClick={fetchCountry}
                disabled={loading}
        >{text}
        </button>
    );
}

export default Button;