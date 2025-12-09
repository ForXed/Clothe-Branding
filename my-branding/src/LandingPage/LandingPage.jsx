import LandingPageFooter from './LandingFooter/LandPageFooter';
import './LandingPage.module.css';
import LandingPageDesigner from './LandingPageDesigner/LandingPageDesigner';
import LandingPageGrid from './LandingPageGrid/LandingPageGrid';
import LandingPageHero from './LandingPageHero/LandingPageHero';
import LandingPageHowItWorks from './LandingPageHowItWorks/LandingPageHowItWorks';
import LandingPageMasonryHero from './LandingPageMasonryHero/LandingPageMasonryHero';
import LandingPageNavbar from './LandingPageNavbar/LandingPageNavbar';
import LandingPageCommunity from './LandingPageCommunity/LandingPageCommunity'; 
import FadeIn from '../FadeIn/FadeIn';

function LandingPage() {

    return(
        <>
      <LandingPageNavbar />

            {/* Top Hero: Added a subtle scale effect for the entrance */}
            <FadeIn direction="scale">
                <LandingPageMasonryHero />
            </FadeIn>

            {/* Sections below will slide up as you scroll */}
            <FadeIn direction="up">
                <LandingPageHowItWorks />
            </FadeIn>

                 {/* The Black Section - Great contrast here */}
            <FadeIn direction="up">
                <LandingPageCommunity /> 
            </FadeIn>

            <FadeIn direction="up">
                <LandingPageHero />
            </FadeIn>

            <FadeIn direction="up">
                <LandingPageDesigner />
            </FadeIn>

            <FadeIn direction="up">
                <LandingPageGrid />
            </FadeIn>

            <FadeIn direction="up">
                <LandingPageFooter />
            </FadeIn>
        </>
    );
}

export default LandingPage;