import React, { useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GuidesDetail.module.css';

interface TocItem { id: string; label: string; }
interface GuideData {
  title: string; category: string; time: string; level: string;
  author: string; lastUpdated: string; toc: TocItem[]; content: ReactNode;
}

const DownloadIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const ClockIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const ArrowLeftIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>);

const guideContent: Record<string, GuideData> = {
  'gsm-handbook': {
    title: 'The GSM Handbook: Mastering Fabric Weight', category: 'Fabrics', time: '5 min read', level: 'Beginner', author: 'Brutige Textile Lab', lastUpdated: 'October 24, 2024',
    toc: [{ id: 'intro', label: '1. What is GSM?' }, { id: 'impact', label: '2. Impact on Drape & Durability' }, { id: 'seasonality', label: '3. Seasonality Guide' }, { id: 'conversion', label: '4. GSM vs. Oz/yd²' }, { id: 'selection', label: '5. How to Choose' }],
    content: (<>
      <section id="intro" className={styles.section}><h2>1. What is GSM?</h2><p><strong>GSM</strong> stands for <strong>Grams per Square Meter</strong>. It is the metric measurement of the weight and density of a fabric.</p></section>
      <section id="impact" className={styles.section}><h2>2. Impact on Drape & Durability</h2><p>The weight of your fabric dictates how the garment hangs on the body.</p></section>
      <section id="seasonality" className={styles.section}><h2>3. Seasonality Guide</h2><p>Choosing the wrong GSM for the season can lead to customer returns.</p></section>
      <section id="conversion" className={styles.section}><h2>4. GSM vs. Oz/yd²</h2><p>If you are sourcing from the US or UK, you will often see weight measured in ounces.</p></section>
      <section id="selection" className={styles.section}><h2>5. How to Choose for Your Brand</h2><p>Don't just pick a number; pick a <strong>feeling</strong>.</p></section>
    </>)
  },
  // ... (Assuming the rest of the guideContent object is pasted here exactly as you provided, just typed as GuideData)
};

const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('');

  const data = slug ? guideContent[slug] : undefined;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      if (data && data.toc) {
        for (let section of data.toc) {
          const element = document.getElementById(section.id);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(section.id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Guide Not Found</h2>
          <p>The resource you are looking for doesn't exist.</p>
          <button type="button" onClick={() => navigate('/hub/guides')} className={styles.backBtn}>Back to Library</button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    alert(`Downloading PDF for: ${data.title}\n\n(In production, this would fetch /guides/${slug}.pdf)`);
  };

  return (
    <article className={styles.articleContainer}>
      <header className={styles.articleHeader}>
        <button type="button" onClick={() => navigate('/hub/guides')} className={styles.backButton}><ArrowLeftIcon /> Back to Guides</button>
        <div className={styles.headerMeta}>
          <span className={styles.categoryBadge}>{data.category}</span>
          <span className={styles.levelBadge}>{data.level}</span>
        </div>
        <h1 className={styles.articleTitle}>{data.title}</h1>
        <div className={styles.articleMeta}>
          <div className={styles.metaItem}><ClockIcon /><span>{data.time}</span></div>
          <div className={styles.metaItem}><span>By {data.author}</span></div>
          <div className={styles.metaItem}><span>Updated: {data.lastUpdated}</span></div>
        </div>
        <button type="button" onClick={handleDownload} className={styles.downloadHeaderBtn}><DownloadIcon /> Download PDF</button>
      </header>

      <div className={styles.contentLayout}>
        <aside className={styles.tocSidebar}>
          <h4 className={styles.tocTitle}>Contents</h4>
          <nav className={styles.tocList}>
            {data.toc.map((item) => (
              <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className={`${styles.tocLink} ${activeSection === item.id ? styles.active : ''}`}>{item.label}</button>
            ))}
          </nav>
        </aside>

        <div className={styles.mainContent}>
          {data.content}
          <div className={styles.articleFooter}>
            <div className={styles.feedbackSection}>
              <h4>Was this guide helpful?</h4>
              <div className={styles.feedbackButtons}>
                <button type="button" className={styles.feedbackBtn}>Yes</button>
                <button type="button" className={styles.feedbackBtn}>No</button>
              </div>
            </div>
            <div className={styles.navButtons}>
              <button type="button" onClick={() => navigate('/hub/guides')} className={styles.secondaryBtn}>Back to Library</button>
              <button type="button" onClick={() => navigate('/hub/support')} className={styles.primaryBtn}>Ask a Question</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default GuideDetail;