import React from "react";
import Loader from "../Loader/Loader";

export default function Connecting() {
    return (
        <div className='centered theme-bg theme-size'>
            <div className="d-flex flex-col align-center">
                <div><Loader size={40} /></div>
                <div className="mt-3">Attempting to connect to the server...</div>
            </div>
        </div>
    );
};
