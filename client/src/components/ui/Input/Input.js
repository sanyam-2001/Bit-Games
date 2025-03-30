import React from 'react';
import styles from './Input.module.css';

const Input = ({
    variant = 'default',
    disabled = false,
    ...props
}) => {
    const inputClasses = [
        styles.input,
        styles[`variant_${variant}`],
    ].filter(Boolean).join(' ');

    return (
        <input
            className={inputClasses}
            disabled={disabled}
            {...props}
        />
    );
};

export const InputGroup = ({
    children,
    label,
    error,
    ...props
}) => {
    return (
        <div className={styles.inputGroup} {...props}>
            {label && <label className={styles.label}>{label}</label>}
            {children}
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export const ErrorText = ({ children, ...props }) => {
    return (
        <span className={styles.errorText} {...props}>
            {children}
        </span>
    );
};

export default Input; 