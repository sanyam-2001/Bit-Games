import React from 'react';
import styles from './Container.module.css';

const Container = ({
    children,
    maxWidth = '1200px',
    ...props
}) => {
    return (
        <div
            className={styles.container}
            style={{ maxWidth }}
            {...props}
        >
            {children}
        </div>
    );
};

export const PageContainer = ({ children, ...props }) => {
    return (
        <div className={styles.pageContainer} {...props}>
            {children}
        </div>
    );
};

export const FlexContainer = ({
    children,
    direction = 'row',
    justify = 'flex-start',
    align = 'stretch',
    wrap = 'nowrap',
    gap = '0',
    fullWidth = false,
    ...props
}) => {
    return (
        <div
            className={`${styles.flexContainer} ${fullWidth ? styles.fullWidth : ''}`}
            style={{
                flexDirection: direction,
                justifyContent: justify,
                alignItems: align,
                flexWrap: wrap,
                gap
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const Card = ({ children, ...props }) => {
    return (
        <div className={styles.card} {...props}>
            {children}
        </div>
    );
};

export const Grid = ({
    children,
    cols = 1,
    colsTablet,
    colsDesktop,
    gap,
    ...props
}) => {
    return (
        <div
            className={styles.grid}
            style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: gap || "var(--spacing-md, 16px)"
            }}
            data-cols-tablet={colsTablet || cols}
            data-cols-desktop={colsDesktop || colsTablet || cols}
            {...props}
        >
            {children}
        </div>
    );
};

export default Container; 