import React from 'react';
import styles from './MakerStudio.module.css';

const MakerStudio = () => (
  <div className={styles.studioContainer}>
    <header className={styles.header}>
      <h1 className={styles.title}>Maker Dashboard</h1>
      <div className={styles.statsRow}>
        <div className={styles.statCard}><span>Live Templates</span><strong>24</strong></div>
        <div className={styles.statCard}><span>Total Brandings</span><strong>1.2k</strong></div>
        <div className={styles.statCard}><span>Inquiries</span><strong>08</strong></div>
      </div>
    </header>

    <div className={styles.mainGrid}>
      {/* SECTION: POST NEW CLOTH */}
      <section className={styles.postSection}>
        <h3>Post New Infrastructure</h3>
        <form className={styles.form}>
          <div className={styles.dropzone}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
             <p>Upload Full Color Template</p>
          </div>
          <div className={styles.inputGrid}>
            <div className={styles.field}><label>Title</label><input type="text" placeholder="Heavyweight Boxy Tee" /></div>
            <div className={styles.field}><label>Base Price ($)</label><input type="number" placeholder="45.00" /></div>
            <div className={styles.field}><label>Fabric Details</label><input type="text" placeholder="100% Organic Cotton" /></div>
            <div className={styles.field}><label>GSM Weight</label><input type="text" placeholder="300 GSM" /></div>
          </div>
          <div className={styles.sizes}>
            <label>Available Sizes</label>
            <div className={styles.sizeOptions}>
                {['S', 'M', 'L', 'XL', 'XXL'].map(s => <label key={s}><input type="checkbox" /> {s}</label>)}
            </div>
          </div>
          <button className={styles.submitBtn}>Publish to Shop</button>
        </form>
      </section>

      {/* SECTION: RECENTLY POSTED */}
      <section className={styles.recentSection}>
        <h3>Recently Posted</h3>
        <div className={styles.templateList}>
            <div className={styles.item}>
                <div className={styles.miniImg}></div>
                <div><h4>Minimalist Hoodie</h4><span>$85.00 • Active</span></div>
            </div>
            <div className={styles.item}>
                <div className={styles.miniImg}></div>
                <div><h4>Couture Shell</h4><span>$210.00 • Active</span></div>
            </div>
        </div>
      </section>
    </div>
  </div>
);

export default MakerStudio;