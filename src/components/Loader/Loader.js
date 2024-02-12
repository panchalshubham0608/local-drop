import React from "react";
import './Loader.css';

export default function Loader(props) {
    const size = parseInt(props.size) || 25;
    return (
        <div className="loader" style={{
            padding: `${size}px`,
        }}>
        </div>
    );
};
