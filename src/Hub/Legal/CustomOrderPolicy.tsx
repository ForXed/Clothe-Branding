import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './CustomOrderPolicy.module.css';

interface Section { id: string; label: string; }

const CustomOrderPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections: Section[] = [
    { id: 'overview', label: '1. Overview' },
    { id: 'process', label: '2. How It Works' },
    { id: 'cancellation', label: '3. Cancellation Policy' },
    { id: 'refunds', label: '4. Refund Policy' },
    { id: 'disputes', label: '5. Dispute Resolution' },
    { id: 'maker-obligations', label: '6. Maker Obligations' },
    { id: 'customer-obligations', label: '7. Customer Obligations' },
    { id: 'timelines', label: '8. Timelines & Delays' },
    { id: 'quality', label: '9. Quality Guarantee' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-20% 0px -60% 0px' });
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = (elementRect - bodyRect) - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.tocNavMobile}>
        {sections.map((section) => (
          <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className={`${styles.tocLinkMobile} ${activeSection === section.id ? styles.active : ''}`}>{section.label}</button>
        ))}
      </nav>

      <article className={styles.content}>
        <aside className={styles.tocDesktop}>
          <h4 className={styles.tocTitle}>Table of Contents</h4>
          <div className={styles.tocList}>
            {sections.map((section) => (
              <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className={`${styles.tocLink} ${activeSection === section.id ? styles.active : ''}`}>{section.label}</button>
            ))}
          </div>
        </aside>

        <div className={styles.mainText}>
          <header className={styles.header}>
            <h1 className={styles.title}>Custom Order Policy</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <p>By placing a custom order, you agree to these specific terms in addition to our general Terms of Service.</p>
            </div>
          </header>

          <section id="overview" ref={(el) => { sectionRefs.current.overview = el; }} className={styles.section}>
            <h2>1. Overview</h2>
            <p>Custom orders allow you to work directly with makers to create unique pieces tailored to your specifications. This policy outlines the specific terms, cancellation rules, and dispute resolution process for custom orders.</p>
            <div className={styles.highlightBox}>
              <strong>Important:</strong> Custom orders involve a collaborative process between you and the maker. Clear communication and mutual understanding are essential for success.
            </div>
          </section>

          <section id="process" ref={(el) => { sectionRefs.current.process = el; }} className={styles.section}>
            <h2>2. How Custom Orders Work</h2>
            <div className={styles.processSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>Submit Request</h3>
                  <p>Provide detailed specifications including size, color, material, reference images, and any special requirements.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>Maker Review & Quote</h3>
                  <p>The maker reviews your request within 48 hours and provides a quote with price, timeline, and specifications.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>Approve & Pay Deposit</h3>
                  <p>Review the quote and approve. Pay a deposit (30-50% of total) to begin production.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3>Production</h3>
                  <p>The maker creates your custom piece with weekly progress updates. You can request minor adjustments during this phase.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  <h3>Final Payment & Delivery</h3>
                  <p>Pay the remaining balance. The maker ships your order. Confirm receipt within 7 days.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="cancellation" ref={(el) => { sectionRefs.current.cancellation = el; }} className={styles.section}>
            <h2>3. Cancellation Policy</h2>
            <p>Custom orders can be cancelled at different stages with varying penalties:</p>
            
            <div className={styles.cancellationTable}>
              <div className={styles.cancellationRow}>
                <div className={styles.cancellationStage}>Before Quote</div>
                <div className={styles.cancellationPenalty}>No penalty</div>
                <div className={styles.cancellationNote}>Full refund if deposit was paid</div>
              </div>
              <div className={styles.cancellationRow}>
                <div className={styles.cancellationStage}>After Quote, Before Deposit</div>
                <div className={styles.cancellationPenalty}>No penalty</div>
                <div className={styles.cancellationNote}>Simply reject the quote</div>
              </div>
              <div className={styles.cancellationRow}>
                <div className={styles.cancellationStage}>After Deposit, Before Production</div>
                <div className={styles.cancellationPenalty}>Forfeit deposit (30-50%)</div>
                <div className={styles.cancellationNote}>Compensates maker for time spent</div>
              </div>
              <div className={styles.cancellationRow}>
                <div className={styles.cancellationStage}>During Production</div>
                <div className={styles.cancellationPenalty}>Forfeit deposit + 20% of total</div>
                <div className={styles.cancellationNote}>Maker has invested significant labor</div>
              </div>
              <div className={styles.cancellationRow}>
                <div className={styles.cancellationStage}>After Shipping</div>
                <div className={styles.cancellationPenalty}>No cancellation allowed</div>
                <div className={styles.cancellationNote}>Must go through return process</div>
              </div>
            </div>

            <div className={styles.warningBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p><strong>Important:</strong> Once production has started, cancellation becomes increasingly costly. Please ensure your specifications are clear before approving the quote.</p>
            </div>
          </section>

          <section id="refunds" ref={(el) => { sectionRefs.current.refunds = el; }} className={styles.section}>
            <h2>4. Refund Policy</h2>
            
            <h3>When Refunds Apply</h3>
            <div className={styles.refundScenarios}>
              <div className={styles.refundCard}>
                <h4>Maker Doesn't Deliver</h4>
                <p>If the maker fails to deliver within the agreed timeline (plus 2-week grace period), you receive a <strong>full refund</strong> and the maker receives a platform penalty.</p>
              </div>
              <div className={styles.refundCard}>
                <h4>Quality Doesn't Match Specs</h4>
                <p>If the delivered item significantly differs from approved specifications, platform mediation will determine if a <strong>remake or partial refund</strong> is appropriate.</p>
              </div>
              <div className={styles.refundCard}>
                <h4>Late Delivery</h4>
                <p>For each week the delivery is late (beyond the quoted timeline), you receive a <strong>10% discount</strong> on the final price (maximum 50%).</p>
              </div>
              <div className={styles.refundCard}>
                <h4>Customer Changes Mind</h4>
                <p>See the <strong>Cancellation Policy</strong> above. Refunds are subject to the stage-based penalty structure.</p>
              </div>
            </div>

            <h3>Refund Timeline</h3>
            <p>All approved refunds are processed within <strong>7-14 business days</strong> to your original payment method.</p>
          </section>

          <section id="disputes" ref={(el) => { sectionRefs.current.disputes = el; }} className={styles.section}>
            <h2>5. Dispute Resolution</h2>
            
            <div className={styles.disputeSteps}>
              <div className={styles.disputeStep}>
                <h3>Step 1: Direct Communication</h3>
                <p>First, attempt to resolve the issue directly with the maker through our messaging system. Most issues can be resolved through clear communication.</p>
                <p><strong>Timeline:</strong> 7 days</p>
              </div>
              <div className={styles.disputeStep}>
                <h3>Step 2: Platform Mediation</h3>
                <p>If direct communication fails, escalate to Brutige support. Provide evidence (photos, messages, specifications). Our team will review and mediate.</p>
                <p><strong>Timeline:</strong> 14 days</p>
              </div>
              <div className={styles.disputeStep}>
                <h3>Step 3: Platform Decision</h3>
                <p>Brutige will make a final, binding decision based on the evidence provided. This decision is final and cannot be appealed.</p>
                <p><strong>Timeline:</strong> 7 days after mediation</p>
              </div>
            </div>

            <div className={styles.highlightBox}>
              <strong>Tip:</strong> Document everything. Take photos at each stage, save all messages, and keep detailed records of specifications and approvals.
            </div>
          </section>

          <section id="maker-obligations" ref={(el) => { sectionRefs.current['maker-obligations'] = el; }} className={styles.section}>
            <h2>6. Maker Obligations</h2>
            
            <div className={styles.obligationsList}>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Respond within 48 hours</strong>
                  <p>Acknowledge custom order requests promptly, even if just to say you're reviewing.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Provide weekly progress updates</strong>
                  <p>Keep customers informed with photos and status updates during production.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Deliver within quoted timeline</strong>
                  <p>Honor the delivery date you provided. If delays occur, communicate immediately.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Maintain quality standards</strong>
                  <p>Deliver items that match the approved specifications and quality expectations.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Professional communication</strong>
                  <p>Respond to customer questions promptly and maintain professional conduct.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="customer-obligations" ref={(el) => { sectionRefs.current['customer-obligations'] = el; }} className={styles.section}>
            <h2>7. Customer Obligations</h2>
            
            <div className={styles.obligationsList}>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Provide clear specifications</strong>
                  <p>Be as detailed as possible. Include measurements, colors, materials, and reference images.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Respond to maker questions promptly</strong>
                  <p>If the maker needs clarification, respond within 48 hours to avoid delays.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Approve/reject quotes within 7 days</strong>
                  <p>Don't leave makers waiting. Review quotes promptly and make a decision.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Make payments on time</strong>
                  <p>Pay deposits and final payments within the specified timeframes.</p>
                </div>
              </div>
              <div className={styles.obligation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Confirm receipt within 7 days</strong>
                  <p>Once delivered, confirm receipt to release final payment to the maker.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="timelines" ref={(el) => { sectionRefs.current.timelines = el; }} className={styles.section}>
            <h2>8. Timelines & Delays</h2>
            
            <h3>Expected Timelines</h3>
            <div className={styles.timelineTable}>
              <div className={styles.timelineRow}>
                <div className={styles.timelinePhase}>Maker Response</div>
                <div className={styles.timelineDuration}>48 hours</div>
              </div>
              <div className={styles.timelineRow}>
                <div className={styles.timelinePhase}>Quote Approval</div>
                <div className={styles.timelineDuration}>7 days</div>
              </div>
              <div className={styles.timelineRow}>
                <div className={styles.timelinePhase}>Production</div>
                <div className={styles.timelineDuration}>As quoted by maker</div>
              </div>
              <div className={styles.timelineRow}>
                <div className={styles.timelinePhase}>Shipping</div>
                <div className={styles.timelineDuration}>3-7 business days</div>
              </div>
              <div className={styles.timelineRow}>
                <div className={styles.timelinePhase}>Receipt Confirmation</div>
                <div className={styles.timelineDuration}>7 days after delivery</div>
              </div>
            </div>

            <h3>Late Delivery Compensation</h3>
            <p>If the maker delivers late (beyond the quoted timeline), you receive automatic compensation:</p>
            <ul className={styles.compensationList}>
              <li><strong>1 week late:</strong> 10% discount on final price</li>
              <li><strong>2 weeks late:</strong> 20% discount on final price</li>
              <li><strong>3 weeks late:</strong> 30% discount on final price</li>
              <li><strong>4+ weeks late:</strong> You may cancel with full refund</li>
            </ul>

            <div className={styles.highlightBox}>
              <strong>Note:</strong> Delays caused by customer (late responses, specification changes) do not qualify for compensation.
            </div>
          </section>

          <section id="quality" ref={(el) => { sectionRefs.current.quality = el; }} className={styles.section}>
            <h2>9. Quality Guarantee</h2>
            
            <h3>What Constitutes a Quality Issue</h3>
            <ul className={styles.qualityList}>
              <li>Item doesn't match approved specifications (size, color, material)</li>
              <li>Visible defects (stains, tears, incorrect stitching)</li>
              <li>Item is unusable for its intended purpose</li>
              <li>Significant deviation from reference images provided</li>
            </ul>

            <h3>What Doesn't Constitute a Quality Issue</h3>
            <ul className={styles.qualityList}>
              <li>Minor variations inherent to handmade/custom items</li>
              <li>Customer changed mind about design after approval</li>
              <li>Sizing issues when customer provided incorrect measurements</li>
              <li>Color variations due to screen display differences</li>
            </ul>

            <h3>Resolution Process</h3>
            <p>If you believe your item has a quality issue:</p>
            <ol className={styles.resolutionSteps}>
              <li>Document the issue with clear photos</li>
              <li>Contact the maker directly through our messaging system</li>
              <li>If unresolved within 7 days, escalate to Brutige support</li>
              <li>Provide all evidence (photos, messages, specifications)</li>
              <li>Platform will mediate and determine appropriate resolution</li>
            </ol>

            <div className={styles.highlightBox}>
              <strong>Possible Resolutions:</strong> Remake, partial refund, or full refund depending on the severity of the issue and evidence provided.
            </div>
          </section>

          <div className={styles.actionArea}>
            <h3>Questions About Custom Orders?</h3>
            <div className={styles.btnGroup}>
              <Link to="/hub/support" className={styles.btnPrimary}>Contact Support</Link>
              <Link to="/hub/terms" className={styles.btnSecondary}>Read Terms of Service</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default CustomOrderPolicy;