import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading, please wait...</p>
        </div>
    );
};

export default Loader;
