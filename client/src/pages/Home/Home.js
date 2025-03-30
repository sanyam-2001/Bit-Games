import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Card, PageContainer, Input, InputGroup, ErrorText, Button } from '../../components/ui/index';

const Home = () => {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const validateUsername = () => {
        if (!username.trim()) {
            setUsernameError('Username is required');
            return false;
        }
        setUsernameError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateUsername()) return;

        console.log('Username submitted:', username);
    };

    return (
        <PageContainer>
            <Container maxWidth="500px">
                <HeaderContainer
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Logo>BitGames</Logo>
                    <Tagline>Connect. Play. Compete.</Tagline>
                </HeaderContainer>

                <Card as={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <form onSubmit={handleSubmit}>
                        <InputGroup>
                            <label htmlFor="username">Username</label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="primary"
                            />
                            {usernameError && <ErrorText>{usernameError}</ErrorText>}
                        </InputGroup>

                        <Button type="submit" fullWidth variant="primary">
                            Continue
                        </Button>
                    </form>
                </Card>

                <FooterText
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Enter your username to start playing!
                </FooterText>
            </Container>
        </PageContainer>
    );
};

// Styled components
const HeaderContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled.h1`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.neonBlue};
  text-shadow: ${({ theme }) => theme.colors.shadowBlue};
  letter-spacing: 2px;
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.neonPink};
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const FooterText = styled(motion.p)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export default Home; 