import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Modular Imports
import Navbar from './LandingPageNavbar/LandingPageNavbar';
import MasonryHero from './LandingPageMasonryHero/LandingPageMasonryHero';
import HowItWorks from './LandingPageHowItWorks/LandingPageHowItWorks';
import Community from './LandingPageCommunity/LandingPageCommunity'; 
import InfrastructureHero from './LandingPageHero/LandingPageHero';
import DesignerSection from './LandingPageDesigner/LandingPageDesigner';
import ShowcaseGrid from './LandingPageGrid/LandingPageGrid';
import FAQSection from './FAQSection/FAQSection';
import Footer from './LandingFooter/LandingPageFooter';

// Background & Concept Components
import BackgroundObjects from './BackgroundObjects';
import ConceptManifesto from './ConceptManifesto/ConceptManifesto';

import styles from './LandingPage.module.css';
import LandingPageDesigner from './LandingPageDesigner/LandingPageDesigner';
import LandingPageBlueprint from './LandingPageBlueprint/LandingPageBlueprint';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
    useEffect(() => {
        // 1. Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            // 👇 Typed the easing function parameter
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // 👇 Typed the raf parameter
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 2. Global GSAP Scroll Refresh
        ScrollTrigger.refresh();

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <BackgroundObjects />
            <Navbar />
            <main>
                <MasonryHero />
                <ConceptManifesto />
                <HowItWorks />
                <Community /> 
                <LandingPageBlueprint />
                <InfrastructureHero />
                <DesignerSection />
                <ShowcaseGrid />
                <FAQSection />
                <Footer />
            </main>
        </div>
    );
};

export default LandingPage;