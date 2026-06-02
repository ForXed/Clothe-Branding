import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ConceptManifesto.module.css';

gsap.registerPlugin(ScrollTrigger);

const ConceptManifesto = () => {
    const sectionRef = useRef();

    useGSAP(() => {
        gsap.from(`.${styles.text} span`, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1,
            },
            opacity: 0.1,
            stagger: 0.1,
            y: 20,
            ease: "power2.out"
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className={styles.container}>
                <span className={styles.label}>// BRAND CONCEPT</span>
                <h2 className={styles.text}>
                    <span>Brutige</span> <span>is</span> <span>the</span> <span>architectural</span> <span>bridge</span> <span>between</span> <span>raw</span> <span>creative</span> <span>vision</span> <span>and</span> <span>premium</span> <span>reality.</span> 
                    <br /><br />
                    <span>We</span> <span>provide</span> <span>the</span> <span>unapologetic</span> <span>infrastructure</span> <span>for</span> <span>those</span> <span>who</span> <span>design</span> <span>without</span> <span>limits.</span>
                </h2>
            </div>
        </section>
    );
};

export default ConceptManifesto;