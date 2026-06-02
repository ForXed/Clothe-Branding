import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './BackgroundObjects.module.css';

const BackgroundObjects = () => {
    const container = useRef();

    useGSAP(() => {
        // Find all elements with the 'shape' class inside this container
        const shapes = gsap.utils.toArray(`.${styles.shape}`);
        
        if (shapes.length === 0) {
            console.warn("GSAP: No shapes found. Check your CSS Module classes.");
            return;
        }

        shapes.forEach((shape, i) => {
            // 1. OBVIOUS FLOATING MOVEMENT
            gsap.to(shape, {
                x: "random(-200, 200)", // Increased range to make it obvious
                y: "random(-200, 200)",
                rotation: "random(-360, 360)",
                duration: gsap.utils.random(10, 15),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2
            });
        });

        // 2. OBVIOUS MOUSE INTERACTION
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xMove = (clientX / window.innerWidth - 0.5) * 100;
            const yMove = (clientY / window.innerHeight - 0.5) * 100;

            gsap.to(shapes, {
                xPercent: xMove,
                yPercent: yMove,
                stagger: 0.05,
                duration: 1.5,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, { scope: container });

    return (
        <div ref={container} className={styles.bgWrapper}>
            {/* Added more shapes and made them bigger */}
            <div className={`${styles.shape} ${styles.circle}`} style={{top: '10%', left: '10%'}} />
            <div className={`${styles.shape} ${styles.line}`} style={{top: '40%', right: '15%', transform: 'rotate(20deg)'}} />
            <div className={`${styles.shape} ${styles.circle} ${styles.large}`} style={{top: '60%', left: '30%'}} />
            <div className={`${styles.shape} ${styles.line}`} style={{bottom: '20%', left: '10%', width: '400px'}} />
            <div className={`${styles.shape} ${styles.circle}`} style={{bottom: '10%', right: '10%'}} />
        </div>
    );
};

export default BackgroundObjects;