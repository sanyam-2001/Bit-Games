import React, { useEffect, useRef, useState } from 'react';
import './ParticleBackground.css';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let isMouseDown = false;
        let mousePosition = { x: 0, y: 0 };

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Initialize particles
        const initParticles = () => {
            particles = [];
            const particleCount = 500;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speed: Math.random() * 0.4 + 0.1,
                    directionX: Math.random() * 2 - 1,
                    directionY: Math.random() * 2 - 1,
                    opacity: Math.random() * 0.4 + 0.1
                });
            }
        };

        // Event listeners
        const handleMouseDown = (e) => {
            isMouseDown = true;
            updateMousePosition(e);
        };

        const handleMouseUp = () => {
            isMouseDown = false;
        };

        const handleMouseMove = (e) => {
            updateMousePosition(e);
            setIsActive(true);
            canvas.classList.add('active');
        };

        const handleMouseLeave = () => {
            if (!isMouseDown) {
                setIsActive(false);
                canvas.classList.remove('active');
            }
        };

        const handleTouchStart = (e) => {
            isMouseDown = true;
            updateTouchPosition(e);
        };

        const handleTouchEnd = () => {
            isMouseDown = false;
            setIsActive(false);
            canvas.classList.remove('active');
        };

        const handleTouchMove = (e) => {
            updateTouchPosition(e);
            setIsActive(true);
            canvas.classList.add('active');
            if (isMouseDown) {
                e.preventDefault();
            }
        };

        const updateTouchPosition = (e) => {
            if (e.touches && e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mousePosition = {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
        };

        const updateMousePosition = (e) => {
            const rect = canvas.getBoundingClientRect();
            mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        // Drawing functions
        const drawParticle = (particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        };

        const drawConnections = () => {
            const radius = 150; // Connection radius

            // Only draw connections if mouse is on the canvas
            if (mousePosition.x === 0 && mousePosition.y === 0) return;

            for (let i = 0; i < particles.length; i++) {
                const dx = mousePosition.x - particles[i].x;
                const dy = mousePosition.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    const opacity = (1 - distance / radius) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(mousePosition.x, mousePosition.y);
                    ctx.lineTo(particles[i].x, particles[i].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();

                    // Draw connections between nearby particles
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx2 = particles[i].x - particles[j].x;
                        const dy2 = particles[i].y - particles[j].y;
                        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (distance2 < radius * 0.7 &&
                            Math.sqrt(Math.pow(mousePosition.x - particles[j].x, 2) +
                                Math.pow(mousePosition.y - particles[j].y, 2)) < radius) {
                            const opacity2 = (1 - distance2 / (radius * 0.7)) * 0.3;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity2})`;
                            ctx.lineWidth = 0.2;
                            ctx.stroke();
                        }
                    }
                }
            }
        };

        const updateParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                // Update position
                particles[i].x += particles[i].directionX * particles[i].speed;
                particles[i].y += particles[i].directionY * particles[i].speed;

                // Boundary check with a small buffer to prevent sticking to edges
                if (particles[i].x < 5) {
                    particles[i].x = 5;
                    particles[i].directionX *= -1;
                } else if (particles[i].x > canvas.width - 5) {
                    particles[i].x = canvas.width - 5;
                    particles[i].directionX *= -1;
                }

                if (particles[i].y < 5) {
                    particles[i].y = 5;
                    particles[i].directionY *= -1;
                } else if (particles[i].y > canvas.height - 5) {
                    particles[i].y = canvas.height - 5;
                    particles[i].directionY *= -1;
                }

                // Apply subtle attraction on mouse movement (no need to click)
                // Only apply if mouse is on the canvas
                if (mousePosition.x !== 0 || mousePosition.y !== 0) {
                    const dx = mousePosition.x - particles[i].x;
                    const dy = mousePosition.y - particles[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 200) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        // Reduced force for subtle effect on mouse move
                        const force = (1 - distance / 200) * (isMouseDown ? 0.5 : 0.2);

                        particles[i].x += forceDirectionX * force;
                        particles[i].y += forceDirectionY * force;
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            updateParticles();
            for (let i = 0; i < particles.length; i++) {
                drawParticle(particles[i]);
            }

            // Draw connections
            drawConnections();

            animationFrameId = requestAnimationFrame(animate);
        };

        // Initialize
        handleResize();

        // Add event listeners
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Start animation
        animate();

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`particle-canvas ${isActive ? 'active' : ''}`}
        />
    );
};

export default ParticleBackground; 