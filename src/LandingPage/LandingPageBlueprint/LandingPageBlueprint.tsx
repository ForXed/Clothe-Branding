import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LandingPageBlueprint.module.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    title: "Infrastructure Hoodie",
    category: "Layering",
    // In a real app, these would be actual SVG paths vs Real Images
    // For demo, we use CSS filters to simulate "blueprint" vs "real"
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    specs: ["450GSM French Terry", "Double-Needle Stitch", "Hidden Pocket"]
  },
  {
    id: 2,
    title: "Architectural Coat",
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
    specs: ["Wool-Blend", "Hidden Hardware", "Laser Cut"]
  },
  {
    id: 3,
    title: "Tech Cargo V2",
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
    specs: ["Ripstop Nylon", "Articulated Knee", "Water Resistant"]
  }
];

const LandingPageBlueprint = () => {
  const sectionRef = useRef();
  const cardsRef = useRef([]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        const blueprintLayer = card.querySelector(`.${styles.blueprintLayer}`);
        const realLayer = card.querySelector(`.${styles.realLayer}`);
        const svgLines = card.querySelectorAll(`.${styles.svgLine}`);

        // Initial State
        gsap.set(blueprintLayer, { opacity: 1 });
        gsap.set(realLayer, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(svgLines, { strokeDasharray: 1000, strokeDashoffset: 1000 });

        // Scroll Animation
        ScrollTrigger.create({
          trigger: card,
          start: "top 75%",
          end: "top 40%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // 1. Draw SVG Lines first (0% to 50% of scroll)
            if (progress < 0.5) {
              const drawProgress = progress * 2; // Normalize to 0-1
              gsap.to(svgLines, {
                strokeDashoffset: 1000 * (1 - drawProgress),
                duration: 0.1,
                overwrite: true
              });
              gsap.set(realLayer, { clipPath: "inset(100% 0 0 0)" });
            } 
            // 2. Reveal Real Image (50% to 100% of scroll)
            else {
              const revealProgress = (progress - 0.5) * 2; // Normalize 0.5-1.0 to 0-1
              const insetVal = 100 * (1 - revealProgress);
              gsap.set(realLayer, { clipPath: `inset(${insetVal}% 0 0 0)` });
              
              // Fade out blueprint lines slightly at the end
              gsap.to(blueprintLayer, {
                opacity: 1 - (revealProgress * 0.8),
                duration: 0.1
              });
            }
          }
        });
      });
    }, { scope: sectionRef });

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>From <span className={styles.highlight}>Blueprint</span> to Reality</h2>
        <p className={styles.subtitle}>
          Upload your tech pack. We generate the pattern, source the fabric, and manufacture the final unit.
        </p>
      </div>

      <div className={styles.grid}>
        {products.map((product, index) => (
          <div 
            key={product.id} 
            ref={el => cardsRef.current[index] = el}
            className={styles.card}
          >
            {/* 1. The Blueprint Layer (Simulated with CSS Filter + SVG Overlay) */}
            <div className={styles.blueprintLayer}>
              <img src={product.image} alt={product.title} className={styles.blueprintImg} />
              <div className={styles.overlayGrid}></div>
              
              {/* Decorative SVG Lines that "draw" themselves */}
              <svg className={styles.svgOverlay} viewBox="0 0 400 500" fill="none">
                <rect x="50" y="50" width="300" height="400" stroke="#00ffff" strokeWidth="1" className={styles.svgLine} />
                <line x1="50" y1="150" x2="350" y2="150" stroke="#00ffff" strokeWidth="1" className={styles.svgLine} />
                <circle cx="200" cy="100" r="40" stroke="#00ffff" strokeWidth="1" className={styles.svgLine} />
                <path d="M100 300 L300 300 L300 400 L100 400 Z" stroke="#00ffff" strokeWidth="1" className={styles.svgLine} />
                {/* Measurement Lines */}
                <line x1="40" y1="50" x2="40" y2="450" stroke="#00ffff" strokeWidth="0.5" strokeDasharray="4 4" className={styles.svgLine} />
                <line x1="360" y1="50" x2="360" y2="450" stroke="#00ffff" strokeWidth="0.5" strokeDasharray="4 4" className={styles.svgLine} />
              </svg>
              
              <div className={styles.techData}>
                <span>DWG-00{index + 1}</span>
                <span>SCALE 1:1</span>
              </div>
            </div>

            {/* 2. The Real Reality Layer */}
            <div className={styles.realLayer}>
              <img src={product.image} alt={product.title} className={styles.realImg} />
              <div className={styles.cardContent}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <ul className={styles.specs}>
                  {product.specs.map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPageBlueprint;