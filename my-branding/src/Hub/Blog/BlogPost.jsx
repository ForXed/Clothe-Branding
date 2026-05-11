import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './BlogPost.module.css';

// In a real app, this would come from an API/CMS. 
// For now, we expand our local data to include full content.
const allPosts = [
  {
    id: 0,
    slug: "death-of-fast-fashion",
    title: "The Death of Fast Fashion: Building Infrastructure for Longevity",
    excerpt: "Why the future of clothing isn't about speed, but about precision, durability, and transparent supply chains.",
    content: `
      <p>The fashion industry is at a crossroads. For decades, the mandate was simple: faster, cheaper, more. But as brands scale and consumers become more conscious, the cracks in this model are showing. The future isn't about speed; it's about <strong>precision</strong>.</p>
      
      <h3>The Cost of Speed</h3>
      <p>Fast fashion relies on opacity. When you don't know where your clothes come from, you can't verify the conditions under which they were made. Brutige was built on the opposite principle: radical transparency.</p>
      
      <p>We've seen brands reduce waste by 40% simply by switching to on-demand production models enabled by digital infrastructure. This isn't just good ethics; it's good business.</p>

      <h3>Building for Longevity</h3>
      <p>Longevity requires durable materials, yes, but it also requires durable relationships between brands and makers. Our platform facilitates these connections, ensuring that every stakeholder in the supply chain is valued and visible.</p>
      
      <blockquote>"The best garment is the one that lasts ten years, not ten weeks."</blockquote>
      
      <p>As we move forward, the brands that win will be those that treat their supply chain as a partner, not a commodity.</p>
    `,
    author: "Elena Rostova",
    date: "Oct 24, 2024",
    readTime: "8 min read",
    category: "Industry",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
  },
  {
    id: 1,
    slug: "tech-packs-101",
    title: "Tech Packs 101: How to Speak Maker",
    excerpt: "Stop guessing. Learn the universal language of production.",
    content: `
      <p>A tech pack is the blueprint of your garment. Without it, you are building a house without a plan. It communicates every detail—from stitch type to button placement—to your manufacturer.</p>
      
      <h3>Key Components</h3>
      <ul>
        <li><strong>Flat Sketches:</strong> Technical drawings of the front, back, and side views.</li>
        <li><strong>Measurements:</strong> Precise specs for every size.</li>
        <li><strong>BOM (Bill of Materials):</strong> A list of every fabric, thread, and trim needed.</li>
      </ul>
      
      <p>Investing time in a comprehensive tech pack saves money and headaches later in production.</p>
    `,
    author: "Marcus Chen",
    date: "Oct 20, 2024",
    readTime: "5 min read",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200"
  },
  // Add other posts with dummy content for testing navigation
  { id: 2, slug: "sustainable-fibers", title: "Sustainable Fibers", excerpt: "...", content: "<p>Content coming soon...</p>", author: "Sarah Jenkins", date: "Oct 15, 2024", readTime: "6 min read", category: "Materials", image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=1200" },
  { id: 3, slug: "void-case-study", title: "Case Study: Void", excerpt: "...", content: "<p>Content coming soon...</p>", author: "Editorial Team", date: "Oct 10, 2024", readTime: "7 min read", category: "Case Study", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200" },
];

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Find the post
    const foundPost = allPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      // Find 2 related posts from the same category (excluding current)
      const related = allPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 2);
      setRelatedPosts(related);
      
      // Scroll to top
      window.scrollTo(0, 0);
    } else {
      // Handle 404 or redirect
      navigate('/hub/blog');
    }
  }, [slug, navigate]);

  if (!post) return null;

  return (
    <article className={styles.postContainer}>
      {/* Back Button */}
      <button onClick={() => navigate('/hub/blog')} className={styles.backBtn}>
        ← Back to Journal
      </button>

      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <img src={post.image} alt={post.title} className={styles.heroImage} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{post.category}</span>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <div className={styles.metaRow}>
            <span>By <strong>{post.author}</strong></span>
            <span className={styles.divider}>•</span>
            <span>{post.date}</span>
            <span className={styles.divider}>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div 
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Author Bio Box */}
        <div className={styles.authorBio}>
          <div className={styles.bioAvatar}>
            {post.author.charAt(0)}
          </div>
          <div className={styles.bioText}>
            <h4>Written by {post.author}</h4>
            <p>Contributing editor at Brutige, covering supply chain innovation and sustainable manufacturing practices.</p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection}>
          <h3 className={styles.relatedTitle}>Read Next</h3>
          <div className={styles.relatedGrid}>
            {relatedPosts.map(related => (
              <Link to={`/hub/blog/${related.slug}`} key={related.id} className={styles.relatedCard}>
                <div className={styles.relatedImageWrapper}>
                  <img src={related.image} alt={related.title} loading="lazy" />
                </div>
                <div className={styles.relatedContent}>
                  <span className={styles.relatedCategory}>{related.category}</span>
                  <h4 className={styles.relatedTitleSmall}>{related.title}</h4>
                  <span className={styles.relatedRead}>Read Article →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default BlogPost;