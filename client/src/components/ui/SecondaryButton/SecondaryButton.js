import React from 'react';
import styles from './SecondaryButton.module.css';

const SecondaryButton = ({ children, onClick, type = 'button', disabled = false }) => {
    return (
        <button
            className={styles.secondaryButton}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default SecondaryButton; 