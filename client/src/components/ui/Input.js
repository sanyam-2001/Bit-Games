import styled, { css } from 'styled-components';

const inputVariants = {
  primary: css`
    border: 2px solid ${({ theme }) => theme.colors.neonBlue};
    box-shadow: ${({ theme }) => theme.colors.shadowBlue};
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.neonCyan};
    }
  `,
  secondary: css`
    border: 2px solid ${({ theme }) => theme.colors.neonPink};
    box-shadow: ${({ theme }) => theme.colors.shadowPink};
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.neonCyan};
    }
  `,
  default: css`
    border: 1px solid ${({ theme }) => theme.colors.textSecondary};
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.neonBlue};
      box-shadow: ${({ theme }) => theme.colors.shadowBlue};
    }
  `,
};

const Input = styled.input`
  font-family: ${({ theme }) => theme.fonts.mono};
  background-color: rgba(12, 14, 20, 0.8);
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 100%;
  outline: none;
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  ${({ variant = 'default' }) => inputVariants[variant]};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: 100%;

  label {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.neonPink};
  font-size: 0.8rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default Input; 