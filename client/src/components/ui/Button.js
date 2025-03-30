import styled, { css } from 'styled-components';

const buttonVariants = {
  primary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.neonBlue};
    border: 2px solid ${({ theme }) => theme.colors.neonBlue};
    box-shadow: ${({ theme }) => theme.colors.shadowBlue};
    
    &:hover, &:focus {
      background-color: rgba(8, 247, 254, 0.1);
    }
    
    &:active {
      background-color: rgba(8, 247, 254, 0.2);
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.neonPink};
    border: 2px solid ${({ theme }) => theme.colors.neonPink};
    box-shadow: ${({ theme }) => theme.colors.shadowPink};
    
    &:hover, &:focus {
      background-color: rgba(254, 83, 187, 0.1);
    }
    
    &:active {
      background-color: rgba(254, 83, 187, 0.2);
    }
  `,
  outlined: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.textSecondary};
    
    &:hover, &:focus {
      border-color: ${({ theme }) => theme.colors.neonBlue};
      color: ${({ theme }) => theme.colors.neonBlue};
    }
  `,
};

const buttonSizes = {
  small: css`
    font-size: 0.85rem;
    padding: 6px 12px;
  `,
  medium: css`
    font-size: 1rem;
    padding: 10px 20px;
  `,
  large: css`
    font-size: 1.1rem;
    padding: 14px 28px;
  `,
};

const Button = styled.button`
  font-family: ${({ theme }) => theme.fonts.mono};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  font-weight: 500;
  outline: none;
  
  ${({ variant = 'primary' }) => buttonVariants[variant]};
  ${({ size = 'medium' }) => buttonSizes[size]};
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default Button; 