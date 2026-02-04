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
import Footer from './LandingFooter/LandPageFooter';

// Background & Concept Components
import BackgroundObjects from './BackgroundObjects';
import ConceptManifesto from './ConceptManifesto/ConceptManifesto';

import styles from './LandingPage.module.css';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {

    useEffect(() => {
        // 1. Initialize Lenis Smooth Scroll (The secret to professional TikTok-style sites)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time) {
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
            {/* SECTION 1: Fixed Background Animation */}
            <BackgroundObjects />

            {/* SECTION 2: Navigation */}
            <Navbar />

            <main>
                {/* SECTION 3: The Entrance Hero */}
                <MasonryHero />

                {/* SECTION 4: Concept Explanation (Manifesto) */}
                <ConceptManifesto />

                {/* SECTION 5: The 4-Step Process */}
                <HowItWorks />

                {/* SECTION 6: The Infrastructure (Black Section) */}
                <Community /> 

                {/* SECTION 7: Identity Branding Hero */}
                <InfrastructureHero />

                {/* SECTION 8: Professional Maker Network */}
                <DesignerSection />

                {/* SECTION 9: Selected Works Bento Grid */}
                <ShowcaseGrid />

                {/* SECTION 10: Client Testimonials (or a Marquee) */}
                {/* Add a Marquee component here if desired */}

                {/* SECTION 11: Professional FAQ */}
                <FAQSection />

                {/* SECTION 12: Contact / Footer */}
                <Footer />
            </main>
        </div>
    );
}

export default LandingPage;