import React from 'react';
import styles from './SecondaryButton.module.css';

const SecondaryButton = ({ children, onClick, type = 'button', disabled = false, customStyle = {} }) => {
    return (
        <button
            className={styles.secondaryButton}
            onClick={onClick}
            type={type}
            disabled={disabled}
            style={customStyle}
        >
            {children}
        </button>
    );
};

export default SecondaryButton; 