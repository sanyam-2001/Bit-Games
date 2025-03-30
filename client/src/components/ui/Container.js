import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: ${({ maxWidth = '1200px' }) => maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'stretch' }) => align};
  flex-wrap: ${({ wrap = 'nowrap' }) => wrap};
  gap: ${({ gap = '0' }) => gap};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

export const Card = styled.div`
  background-color: rgba(12, 14, 20, 0.7);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.neonBlue};
  box-shadow: ${({ theme }) => theme.colors.shadowBlue};
  backdrop-filter: blur(5px);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ cols = 1 }) => cols}, 1fr);
  gap: ${({ gap = theme => theme.spacing.md }) => gap};
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(${({ colsTablet, cols = 1 }) => colsTablet || cols}, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(${({ colsDesktop, colsTablet, cols = 1 }) => colsDesktop || colsTablet || cols}, 1fr);
  }
`;

export default Container; 