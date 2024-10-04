import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className='loader'>
        <div className="loader-container">
            <div className='ball'></div>
            <div className='ball'></div>
            <div className='ball'></div>
            <div className='ball'></div>
            <div className='ball'></div>
        </div>
        </div>
    );
};

export default Loader;
