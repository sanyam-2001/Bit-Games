import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    background: ${({ theme }) => theme.colors.backgroundGradient};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: ${({ theme }) => theme.colors.neonBlue};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.neonCyan};
    }
  }

  button, input, textarea {
    font-family: ${({ theme }) => theme.fonts.main};
    font-size: 1rem;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
    line-height: 1.2;
  }

  h1 {
    font-size: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  /* Grid overlay effect for the entire app */
  #root {
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    
    &:before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(to bottom, transparent 98%, ${({ theme }) => theme.colors.gridLines} 100%),
        linear-gradient(to right, transparent 98%, ${({ theme }) => theme.colors.gridLines} 100%);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: -1;
    }
  }
`;

export default GlobalStyles; 