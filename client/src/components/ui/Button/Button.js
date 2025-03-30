import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        fullWidth ? styles.fullWidth : '',
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button; 