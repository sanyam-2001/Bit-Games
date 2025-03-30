import React from 'react';
import styles from './PrimaryButton.module.css';

const PrimaryButton = ({ children, onClick, type = 'button', disabled = false }) => {
    return (
        <button
            className={styles.primaryButton}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default PrimaryButton; 