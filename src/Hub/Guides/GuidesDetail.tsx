import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './GuidesDetail.module.css';

// Icon Components
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const GuideDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  // Comprehensive Content Database
  const guideContent = {
    'gsm-handbook': {
      title: 'The GSM Handbook: Mastering Fabric Weight',
      category: 'Fabrics',
      time: '5 min read',
      level: 'Beginner',
      author: 'Brutige Textile Lab',
      lastUpdated: 'October 24, 2024',
      toc: [
        { id: 'intro', label: '1. What is GSM?' },
        { id: 'impact', label: '2. Impact on Drape & Durability' },
        { id: 'seasonality', label: '3. Seasonality Guide' },
        { id: 'conversion', label: '4. GSM vs. Oz/yd²' },
        { id: 'selection', label: '5. How to Choose' }
      ],
      content: (
        <>
          <section id="intro" className={styles.section}>
            <h2>1. What is GSM?</h2>
            <p><strong>GSM</strong> stands for <strong>Grams per Square Meter</strong>. It is the metric measurement of the weight and density of a fabric. It is the single most important metric when determining the "heaviness" or "substantiality" of a garment.</p>
            <p>Unlike thread count, which only measures density, GSM measures the actual mass of the fabric. A higher GSM indicates a heavier, thicker, and usually more durable fabric, while a lower GSM indicates a lighter, more breathable, and often more delicate fabric.</p>
            <div className={styles.infoBox}>
              <strong>Technical Note:</strong> GSM is measured by cutting a precise circular sample from the fabric using a GSM cutter (usually 100cm²) and weighing it on a precision scale. The result is then multiplied to represent a full square meter.
            </div>
          </section>

          <section id="impact" className={styles.section}>
            <h2>2. Impact on Drape & Durability</h2>
            <p>The weight of your fabric dictates how the garment hangs on the body (drape) and how long it will last (durability).</p>
            
            <h3>Low GSM (100-150 GSM)</h3>
            <ul>
              <li><strong>Drape:</strong> Fluid, clingy, and soft. Ideal for loose fits or layering pieces.</li>
              <li><strong>Durability:</strong> Lower. Prone to tearing under high stress and may become translucent (see-through) when stretched.</li>
              <li><strong>Best For:</strong> Summer t-shirts, underwear, lightweight linings, and women's fitted tops.</li>
            </ul>

            <h3>Medium GSM (160-220 GSM)</h3>
            <ul>
              <li><strong>Drape:</strong> Structured but comfortable. Holds its shape well without being stiff.</li>
              <li><strong>Durability:</strong> High. The standard for high-quality streetwear and daily wear.</li>
              <li><strong>Best For:</strong> Premium t-shirts, polo shirts, lightweight hoodies, and dresses.</li>
            </ul>

            <h3>High GSM (230-400+ GSM)</h3>
            <ul>
              <li><strong>Drape:</strong> Stiff, boxy, and architectural. Creates a silhouette that stands away from the body.</li>
              <li><strong>Durability:</strong> Very High. Resists pilling, tearing, and deformation after washing.</li>
              <li><strong>Best For:</strong> Heavyweight hoodies, sweatpants, winter jackets, and workwear.</li>
            </ul>
          </section>

          <section id="seasonality" className={styles.section}>
            <h2>3. Seasonality Guide</h2>
            <p>Choosing the wrong GSM for the season can lead to customer returns due to discomfort. Use this matrix for production planning:</p>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Season</th>
                    <th>Recommended GSM (Knits)</th>
                    <th>Recommended GSM (Wovens)</th>
                    <th>Fabric Types</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Spring / Summer</strong></td>
                    <td>140 - 180 GSM</td>
                    <td>100 - 160 GSM</td>
                    <td>Single Jersey, Linen, Poplin, Voile</td>
                  </tr>
                  <tr>
                    <td><strong>Fall / Winter</strong></td>
                    <td>220 - 350+ GSM</td>
                    <td>200 - 300+ GSM</td>
                    <td>French Terry, Fleece, Denim, Canvas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="conversion" className={styles.section}>
            <h2>4. GSM vs. Oz/yd² (Ounces per Square Yard)</h2>
            <p>If you are sourcing from the US or UK, you will often see weight measured in ounces (<strong>oz</strong>). Here is the conversion logic:</p>
            <p><code>1 oz/yd² ≈ 33.9 GSM</code></p>
            <p><strong>Common Conversions:</strong></p>
            <ul>
              <li><strong>4.5 oz</strong> ≈ 153 GSM (Light Tee)</li>
              <li><strong>5.5 oz</strong> ≈ 186 GSM (Standard Premium Tee)</li>
              <li><strong>6.5 oz</strong> ≈ 220 GSM (Heavy Tee)</li>
              <li><strong>10 oz</strong> ≈ 340 GSM (Light Hoodie)</li>
              <li><strong>12 oz</strong> ≈ 400 GSM (Heavy Hoodie)</li>
            </ul>
          </section>

          <section id="selection" className={styles.section}>
            <h2>5. How to Choose for Your Brand</h2>
            <p>Don't just pick a number; pick a <strong>feeling</strong>.</p>
            <ol>
              <li><strong>Define Your Silhouette:</strong> Do you want an oversized, boxy look? Go for <strong>240+ GSM</strong>. Do you want a slim, tailored fit? Stick to <strong>160-180 GSM</strong>.</li>
              <li><strong>Consider the Print:</strong> Large, heavy plastisol prints can crack on very stiff, high-GSM fabrics if not cured properly. Conversely, light fabrics may pucker under heavy embroidery.</li>
              <li><strong>Cost Implication:</strong> Higher GSM means more raw material (cotton/polyester) used per yard. Expect a <strong>20-40% cost increase</strong> when moving from 160 GSM to 240 GSM.</li>
            </ol>
          </section>
        </>
      )
    },
    'tech-pack-essentials': {
      title: 'Tech Pack Essentials: The Blueprint of Production',
      category: 'Production',
      time: '12 min read',
      level: 'Intermediate',
      author: 'Brutige Production Team',
      lastUpdated: 'October 20, 2024',
      toc: [
        { id: 'definition', label: '1. What is a Tech Pack?' },
        { id: 'components', label: '2. Core Components' },
        { id: 'measurements', label: '3. Measurement Specs' },
        { id: 'bom', label: '4. The BOM (Bill of Materials)' },
        { id: 'common-errors', label: '5. Common Errors to Avoid' }
      ],
      content: (
        <>
          <section id="definition" className={styles.section}>
            <h2>1. What is a Tech Pack?</h2>
            <p>A <strong>Tech Pack</strong> (Technical Package) is the blueprint of your garment. It is a comprehensive document that communicates every single detail of your design to the factory. Without a tech pack, you are relying on verbal instructions, which inevitably leads to errors, wasted money, and delayed timelines.</p>
            <p>Think of it like an architectural plan for a house. You wouldn't build a skyscraper based on a napkin sketch; don't produce 500 units of clothing without a tech pack.</p>
          </section>

          <section id="components" className={styles.section}>
            <h2>2. Core Components</h2>
            <p>A professional tech pack must include the following sections:</p>
            <ul>
              <li><strong>Technical Flats:</strong> Black and white vector sketches of the front and back of the garment. These must be drawn flat (as if laid on a table), not on a model. They should include stitching details, pocket placement, and seam types.</li>
              <li><strong>Callouts:</strong> Arrows pointing to specific areas of the flat sketch with instructions (e.g., "Double needle stitch here," "Reinforced bar tack," "Fold over hem").</li>
              <li><strong>Colorways:</strong> Digital representations of the garment in every color you intend to produce, including Pantone codes (TPX/TCX) for dye matching.</li>
              <li><strong>Print/Embroidery Artwork:</strong> Vector files (AI/EPS) with exact dimensions and placement coordinates relative to a fixed point (e.g., "Center chest, 3 inches down from HPS").</li>
            </ul>
          </section>

          <section id="measurements" className={styles.section}>
            <h2>3. Measurement Specs (POM)</h2>
            <p>The <strong>Point of Measure (POM)</strong> sheet is the heart of the tech pack. It defines the exact dimensions for every size you are producing (S, M, L, XL).</p>
            <div className={styles.warningBox}>
              <strong>Critical Rule:</strong> Always specify <strong>"Finished Garment Measurements"</strong>, not body measurements. If you want a shirt to fit a 40" chest comfortably, the garment measurement should be 44"-46" to allow for ease of movement.
            </div>
            <p><strong>Key Measurement Points:</strong></p>
            <ol>
              <li><strong>HPS (High Point Shoulder):</strong> The top of the shoulder where the collar meets the sleeve.</li>
              <li><strong>Chest Width:</strong> Measured 1 inch below the armhole, across the front.</li>
              <li><strong>Sweep (Hem):</strong> The width of the bottom opening.</li>
              <li><strong>Sleeve Length:</strong> From the shoulder seam to the cuff edge.</li>
              <li><strong>Neck Width/Depth:</strong> Crucial for fit around the collarbone.</li>
            </ol>
          </section>

          <section id="bom" className={styles.section}>
            <h2>4. The BOM (Bill of Materials)</h2>
            <p>The BOM lists every single physical component required to make the garment. Factories use this to calculate the exact cost per unit.</p>
            <p><strong>Example BOM Entry:</strong></p>
            <div className={styles.codeBlock}>
              Item: Main Body Fabric<br/>
              Composition: 100% Cotton Ring-Spun Jersey<br/>
              Weight: 180 GSM<br/>
              Supplier: [Name]<br/>
              Consumption: 1.2 meters per unit + 5% waste
            </div>
            <p>Do not forget "invisible" items like: Interfacing, fusible tape, hangtags, polybags, care labels, main labels, and buttons/zippers.</p>
          </section>

          <section id="common-errors" className={styles.section}>
            <h2>5. Common Errors to Avoid</h2>
            <ul>
              <li><strong>Vague Instructions:</strong> Never say "Make it look vintage." Say "Use enzyme wash for 45 mins to achieve slight fading."</li>
              <li><strong>Inconsistent POM:</strong> Ensure your measurement points match industry standards. If you measure the sleeve from the center back neck, tell the factory explicitly.</li>
              <li><strong>Missing Tolerance:</strong> Every factory has a margin of error. Specify your tolerance (e.g., ±1cm for length, ±0.5cm for width). Anything outside this range is a reject.</li>
              <li><strong>Low-Res Artwork:</strong> Always send vector files for prints. Raster images (JPG/PNG) will result in pixelated prints.</li>
            </ul>
          </section>
        </>
      )
    },
    'grading-rules': {
      title: 'Grading Rules 101: Scaling Patterns Perfectly',
      category: 'Measurements',
      time: '8 min read',
      level: 'Advanced',
      author: 'Brutige Pattern Department',
      lastUpdated: 'October 15, 2024',
      toc: [
        { id: 'what-is-grading', label: '1. What is Grading?' },
        { id: 'methods', label: '2. Grading Methods' },
        { id: 'rules-of-thumb', label: '3. Standard Grading Rules' },
        { id: 'fit-consistency', label: '4. Maintaining Fit Consistency' }
      ],
      content: (
        <>
          <section id="what-is-grading" className={styles.section}>
            <h2>1. What is Grading?</h2>
            <p><strong>Grading</strong> is the process of increasing or decreasing the size of a master pattern (usually size M) to create a full range of sizes (XS to XXL). It is <strong>not</strong> simply multiplying the dimensions by a percentage. Human bodies do not scale up uniformly; a size XXL person does not have arms exactly 20% longer than a size M person in proportion to their chest.</p>
            <p>Poor grading results in garments that fit well in the chest but have sleeves that are too short, or pants that fit the waist but are too tight in the thigh.</p>
          </section>

          <section id="methods" className={styles.section}>
            <h2>2. Grading Methods</h2>
            <p><strong>Cut and Spread (Manual):</strong> The traditional method where the paper pattern is physically cut and spread apart to add volume. Highly accurate but slow.</p>
            <p><strong>Pattern Shifting (CAD):</strong> Using software (like Gerber Accumark or Optitex) to digitally shift pattern points along X and Y axes based on a set of grading rules. This is the industry standard for modern production.</p>
          </section>

          <section id="rules-of-thumb" className={styles.section}>
            <h2>3. Standard Grading Rules (Unisex T-Shirt Example)</h2>
            <p>While every brand has unique blocks, here are the industry standard increments between sizes (e.g., M to L):</p>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Measurement Point</th>
                    <th>Grade Increment (per size)</th>
                    <th>Direction</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Chest Width</strong></td>
                    <td>+2 inches (5 cm)</td>
                    <td>Horizontal (1" each side)</td>
                  </tr>
                  <tr>
                    <td><strong>Body Length</strong></td>
                    <td>+1 inch (2.5 cm)</td>
                    <td>Vertical (Down from HPS)</td>
                  </tr>
                  <tr>
                    <td><strong>Sleeve Length</strong></td>
                    <td>+0.5 inch (1.25 cm)</td>
                    <td>Vertical (Out from cuff)</td>
                  </tr>
                  <tr>
                    <td><strong>Sleeve Width (Bicep)</strong></td>
                    <td>+0.5 inch (1.25 cm)</td>
                    <td>Horizontal</td>
                  </tr>
                  <tr>
                    <td><strong>Neck Width</strong></td>
                    <td>+0.25 inch (0.6 cm)</td>
                    <td>Horizontal</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p><em>Note: For Plus Size grading (XL and up), the increments often increase (e.g., +3 inches for chest) to accommodate different body proportions.</em></p>
          </section>

          <section id="fit-consistency" className={styles.section}>
            <h2>4. Maintaining Fit Consistency</h2>
            <p>The goal of grading is <strong>proportional consistency</strong>. A customer who wears a Medium in your brand should feel confident buying a Large without trying it on, knowing it will fit them exactly as expected, just bigger.</p>
            <p><strong>The "Golden Sample" Rule:</strong> Always grade from a perfected "Gold Seal" sample. If your Medium doesn't fit perfectly, grading it will only multiply the errors across the rest of the size run.</p>
          </section>
        </>
      )
    },
    'sustainable-dyeing': {
      title: 'Sustainable Dyeing: Eco-Friendly Processes',
      category: 'Sustainability',
      time: '10 min read',
      level: 'Intermediate',
      author: 'Brutige Sustainability Lead',
      lastUpdated: 'October 10, 2024',
      toc: [
        { id: 'impact', label: '1. The Environmental Impact' },
        { id: 'low-impact-dyes', label: '2. Low-Impact Fiber Reactive Dyes' },
        { id: 'natural-dyes', label: '3. Natural Dyes: Pros & Cons' },
        { id: 'water-management', label: '4. Water Management Systems' }
      ],
      content: (
        <>
          <section id="impact" className={styles.section}>
            <h2>1. The Environmental Impact</h2>
            <p>The textile dyeing industry is the second largest polluter of clean water globally. Traditional dyeing processes use toxic heavy metals (chrome, copper, zinc) and fixatives that are often dumped into local waterways, destroying ecosystems and harming local communities.</p>
            <p>As a brand, switching to sustainable dyeing isn't just marketing; it's a moral imperative and increasingly a legal requirement in the EU and US.</p>
          </section>

          <section id="low-impact-dyes" className={styles.section}>
            <h2>2. Low-Impact Fiber Reactive Dyes</h2>
            <p>This is the current industry standard for sustainable cotton production.</p>
            <ul>
              <li><strong>How it works:</strong> These dyes form a covalent bond with the cellulose fiber, meaning the color becomes part of the fabric molecule. This results in excellent wash fastness.</li>
              <li><strong>Why it's better:</strong> They require no toxic mordants (fixatives), have a high absorption rate (less dye runoff), and are free from heavy metals and AZO compounds (carcinogens).</li>
              <li><strong>Certification:</strong> Look for <strong>GOTS (Global Organic Textile Standard)</strong> certified dyes. GOTS strictly bans toxic inputs and requires wastewater treatment.</li>
            </ul>
          </section>

          <section id="natural-dyes" className={styles.section}>
            <h2>3. Natural Dyes: Pros & Cons</h2>
            <p>Natural dyes are derived from plants (indigo, madder root), insects (cochineal), or minerals.</p>
            <p><strong>Pros:</strong> Biodegradable, non-toxic, unique aesthetic variations that appeal to luxury markets.</p>
            <p><strong>Cons:</strong> 
              <br/>- <strong>Inconsistency:</strong> Crop variations mean batch-to-batch color matching is nearly impossible.
              <br/>- <strong>Land Use:</strong> Growing dye plants requires massive amounts of land and water, sometimes more than synthetic dyes.
              <br/>- <strong>Mordants:</strong> Many natural dyes still require metallic mordants to bind to fabric, which can be toxic if not managed.
            </p>
            <div className={styles.infoBox}>
              <strong>Verdict:</strong> Natural dyes are excellent for small-batch, artisanal collections where variation is a feature, not a bug. They are difficult to scale for mass production.
            </div>
          </section>

          <section id="water-management" className={styles.section}>
            <h2>4. Water Management Systems</h2>
            <p>Even with eco-friendly dyes, water usage is high. Sustainable factories employ:</p>
            <ol>
              <li><strong>Closed-Loop Systems:</strong> Water used in dyeing is treated and recycled back into the system, reducing freshwater extraction by up to 90%.</li>
              <li><strong>Effluent Treatment Plants (ETP):</strong> On-site facilities that neutralize pH, remove solids, and break down chemicals before water is released.</li>
              <li><strong>Air Dyeing:</strong> An emerging technology that uses air instead of water to penetrate fabric with disperse dyes (mostly for synthetics), reducing water use by 95% and energy by 85%.</li>
            </ol>
          </section>
        </>
      )
    },
    'fabric-sourcing': {
      title: 'Fabric Sourcing Guide: Global Markets',
      category: 'Fabrics',
      time: '15 min read',
      level: 'Beginner',
      author: 'Brutige Sourcing Director',
      lastUpdated: 'October 05, 2024',
      toc: [
        { id: 'where-to-source', label: '1. Where to Source?' },
        { id: 'moq-strategies', label: '2. Navigating MOQs' },
        { id: 'quality-checks', label: '3. Quality Checks Before Buying' },
        { id: 'incoterms', label: '4. Understanding Incoterms' }
      ],
      content: (
        <>
          <section id="where-to-source" className={styles.section}>
            <h2>1. Where to Source?</h2>
            <p>Your location and budget dictate your sourcing hub:</p>
            <ul>
              <li><strong>China:</strong> Best for synthetic blends, technical fabrics, and massive scale. Lowest cost, highest MOQs. (Hubs: Guangzhou, Shaoxing)</li>
              <li><strong>India:</strong> Best for organic cotton, hand-block prints, and embroidery. Great balance of cost and craftsmanship. (Hubs: Tirupur, Delhi)</li>
              <li><strong>Pakistan:</strong> Excellent for denim and heavy knits. Very competitive pricing. (Hub: Karachi, Lahore)</li>
              <li><strong>Portugal/Turkey:</strong> Best for high-end European quality, quick turnaround, and lower MOQs. Higher cost, but closer to US/EU markets. (Hub: Braga, Istanbul)</li>
              <li><strong>USA:</strong> Best for "Made in USA" marketing, rapid prototyping, and niche deadstock fabrics. Highest cost. (Hub: Los Angeles, New York)</li>
            </ul>
          </section>

          <section id="moq-strategies" className={styles.section}>
            <h2>2. Navigating MOQs (Minimum Order Quantities)</h2>
            <p>Mill MOQs are usually based on weight (e.g., 500kg per color) or length (e.g., 1000 meters).</p>
            <p><strong>Strategy for Startups:</strong></p>
            <ol>
              <li><strong>Stock Fabric:</strong> Buy from the mill's existing inventory of colors/weights. No dyeing required = Low MOQ.</li>
              <li><strong>Groupage:</strong> Partner with other brands to combine orders and hit the mill's MOQ together.</li>
              <li><strong>Pay the Surcharge:</strong> Many mills will accept lower quantities if you pay a "small lot fee" (often 20-30% extra).</li>
            </ol>
          </section>

          <section id="quality-checks" className={styles.section}>
            <h2>3. Quality Checks Before Buying</h2>
            <p>Never order bulk without approving a <strong>Lab Dip</strong> (color swatch) and a <strong>Handloom</strong> (fabric swatch).</p>
            <p><strong>Checklist:</strong></p>
            <ul>
              <li><strong>Shrinkage Test:</strong> Wash and dry the swatch. Does it shrink more than 5%? If so, the factory needs to pre-shrink it.</li>
              <li><strong>Torque/Spirality:</strong> Twist the fabric. Does the side seam twist to the front after washing? This indicates poor yarn quality.</li>
              <li><strong>Pilling Test:</strong> Rub the fabric vigorously. Does it fuzz up? High pilling = low quality fibers.</li>
              <li><strong>GSM Verification:</strong> Weigh the swatch yourself. Mills often under-deliver on weight to save costs.</li>
            </ul>
          </section>

          <section id="incoterms" className={styles.section}>
            <h2>4. Understanding Incoterms</h2>
            <p>Who pays for shipping? Who owns the risk?</p>
            <ul>
              <li><strong>EXW (Ex Works):</strong> You pick up from the factory door. You handle everything. Highest risk for you.</li>
              <li><strong>FOB (Free on Board):</strong> Factory gets it to the port and clears export customs. You handle ocean freight and import. <strong>(Industry Standard)</strong></li>
              <li><strong>DDP (Delivered Duty Paid):</strong> Factory delivers to your door, taxes paid. Easiest for you, but most expensive.</li>
            </ul>
          </section>
        </>
      )
    },
    'quality-control': {
      title: 'Quality Control Checklist: Zero Defects',
      category: 'Production',
      time: '6 min read',
      level: 'Advanced',
      author: 'Brutige QA Manager',
      lastUpdated: 'September 28, 2024',
      toc: [
        { id: 'stages', label: '1. The 3 Stages of QC' },
        { id: 'inspection-points', label: '2. Critical Inspection Points' },
        { id: 'aql-standard', label: '3. Understanding AQL' },
        { id: 'reject-policy', label: '4. Reject Policy' }
      ],
      content: (
        <>
          <section id="stages" className={styles.section}>
            <h2>1. The 3 Stages of QC</h2>
            <p>Quality Control is not just checking the final box. It happens in three phases:</p>
            <ol>
              <li><strong>Pre-Production (PPC):</strong> Checking raw materials (fabric, zippers, threads) <em>before</em> cutting begins. Catching a bad fabric roll here saves thousands of dollars.</li>
              <li><strong>During Production (DUPRO):</strong> Inspecting the first 10-20% of output while the line is running. Allows for immediate correction of machine settings or operator errors.</li>
              <li><strong>Final Random Inspection (FRI):</strong> Checking finished goods once 100% are packed. This is the gatekeeper before shipment.</li>
            </ol>
          </section>

          <section id="inspection-points" className={styles.section}>
            <h2>2. Critical Inspection Points</h2>
            <p>Use this checklist for every garment:</p>
            <ul>
              <li><strong>Seams:</strong> Are they straight? Any skipped stitches? Is the SPI (Stitches Per Inch) consistent (usually 10-12 SPI for knits)?</li>
              <li><strong>Measurements:</strong> Measure 5 random garments against the tech pack. Are they within tolerance (±1cm)?</li>
              <li><strong>Visual Defects:</strong> Holes, stains, oil marks, slubs (thick spots in yarn), or shading differences between panels.</li>
              <li><strong>Trims:</strong> Do buttons snap securely? Do zippers glide smoothly? Are care labels legible and attached correctly?</li>
              <li><strong>Packaging:</strong> Are polybags sealed with suffocation warnings? Are fold patterns consistent? Is the carton strength sufficient?</li>
            </ul>
          </section>

          <section id="aql-standard" className={styles.section}>
            <h2>3. Understanding AQL (Acceptable Quality Limit)</h2>
            <p>You cannot expect 100% perfection in mass production. The industry standard is <strong>AQL 2.5</strong>.</p>
            <p><strong>What AQL 2.5 Means:</strong> You accept a maximum of 2.5% defective units in a batch. If you order 1,000 shirts, you can reject the whole batch if more than 25 shirts have major defects.</p>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Defect Type</th>
                    <th>Definition</th>
                    <th>AQL Standard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Critical</strong></td>
                    <td>Dangerous to user (e.g., broken needle found inside).</td>
                    <td>0 (Zero Tolerance)</td>
                  </tr>
                  <tr>
                    <td><strong>Major</strong></td>
                    <td>Affects saleability (e.g., hole, wrong size, big stain).</td>
                    <td>2.5</td>
                  </tr>
                  <tr>
                    <td><strong>Minor</strong></td>
                    <td>Does not affect function (e.g., loose thread, slight shading).</td>
                    <td>4.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="reject-policy" className={styles.section}>
            <h2>4. Reject Policy</h2>
            <p>If a batch fails AQL inspection:</p>
            <ol>
              <li><strong>100% Sorting:</strong> Require the factory to sort every single unit and repair minor defects.</li>
              <li><strong>Re-inspection:</strong> You (or your third-party inspector) must re-inspect the sorted batch. The factory bears the cost of this second inspection.</li>
              <li><strong>Discount or Return:</strong> For major unfixable defects, negotiate a discount proportional to the defect rate, or return the goods at the factory's expense.</li>
            </ol>
          </section>
        </>
      )
    }
  };

  const data = guideContent[slug];

  // Scroll to section handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Handle scroll spy to update active TOC
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
          <button onClick={() => navigate('/hub/guides')} className={styles.backBtn}>
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // In a real app, this would trigger a PDF download
    alert(`Downloading PDF for: ${data.title}\n\n(In production, this would fetch /guides/${slug}.pdf)`);
  };

  return (
    <article className={styles.articleContainer}>
      {/* Header */}
      <header className={styles.articleHeader}>
        <button onClick={() => navigate('/hub/guides')} className={styles.backButton}>
          <ArrowLeftIcon /> Back to Guides
        </button>
        
        <div className={styles.headerMeta}>
          <span className={styles.categoryBadge}>{data.category}</span>
          <span className={styles.levelBadge}>{data.level}</span>
        </div>

        <h1 className={styles.articleTitle}>{data.title}</h1>
        
        <div className={styles.articleMeta}>
          <div className={styles.metaItem}>
            <ClockIcon />
            <span>{data.time}</span>
          </div>
          <div className={styles.metaItem}>
            <span>By {data.author}</span>
          </div>
          <div className={styles.metaItem}>
            <span>Updated: {data.lastUpdated}</span>
          </div>
        </div>

        <button onClick={handleDownload} className={styles.downloadHeaderBtn}>
          <DownloadIcon /> Download PDF
        </button>
      </header>

      <div className={styles.contentLayout}>
        {/* Sticky Table of Contents */}
        <aside className={styles.tocSidebar}>
          <h4 className={styles.tocTitle}>Contents</h4>
          <nav className={styles.tocList}>
            {data.toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`${styles.tocLink} ${activeSection === item.id ? styles.active : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {data.content}
          
          {/* Footer Actions */}
          <div className={styles.articleFooter}>
            <div className={styles.feedbackSection}>
              <h4>Was this guide helpful?</h4>
              <div className={styles.feedbackButtons}>
                <button className={styles.feedbackBtn}>Yes</button>
                <button className={styles.feedbackBtn}>No</button>
              </div>
            </div>
            <div className={styles.navButtons}>
              <button onClick={() => navigate('/hub/guides')} className={styles.secondaryBtn}>
                Back to Library
              </button>
              <button onClick={() => navigate('/hub/support')} className={styles.primaryBtn}>
                Ask a Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default GuideDetail;