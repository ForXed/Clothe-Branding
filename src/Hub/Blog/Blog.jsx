import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Blog.module.css';

const featuredPost = {
  id: 0,
  slug: "death-of-fast-fashion",
  title: "The Death of Fast Fashion: Building Infrastructure for Longevity",
  excerpt: "Why the future of clothing isn't about speed, but about precision, durability, and transparent supply chains.",
  author: "Elena Rostova",
  date: "Oct 24, 2024",
  readTime: "8 min read",
  category: "Industry",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
};

const posts = [
  { id: 1, slug: "tech-packs-101", title: "Tech Packs 101: How to Speak Maker", excerpt: "Stop guessing. Learn the universal language of production.", author: "Marcus Chen", date: "Oct 20, 2024", readTime: "5 min read", category: "Guides", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600" },
  { id: 2, slug: "sustainable-fibers", title: "Sustainable Fibers: Beyond Organic Cotton", excerpt: "Exploring hemp, tencel, and recycled blends for modern streetwear.", author: "Sarah Jenkins", date: "Oct 15, 2024", readTime: "6 min read", category: "Materials", image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=600" },
  { id: 3, slug: "void-case-study", title: "Case Study: How 'Void' Scaled to 10k Units", excerpt: "From garage startup to global brand in 12 months using Brutige.", author: "Editorial Team", date: "Oct 10, 2024", readTime: "7 min read", category: "Case Study", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600" },
  { id: 4, slug: "color-theory", title: "Color Theory for Streetwear", excerpt: "Choosing palettes that resonate with the urban landscape.", author: "Davide Russo", date: "Oct 05, 2024", readTime: "4 min read", category: "Design", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600" },
  { id: 5, slug: "understanding-gsm", title: "Understanding GSM: Weight vs. Drape", excerpt: "Why heavy isn't always better, and how to choose the right fabric weight.", author: "Marcus Chen", date: "Sep 28, 2024", readTime: "5 min read", category: "Guides", image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=600" },
  { id: 6, slug: "rise-of-micro-brands", title: "The Rise of Micro-Brands", excerpt: "Why small batches and high quality are winning over mass market.", author: "Elena Rostova", date: "Sep 20, 2024", readTime: "6 min read", category: "Industry", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" },
];

const categories = ["All", "Industry", "Guides", "Materials", "Design", "Case Study"];

const Blog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Newsletter State
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const handleReadArticle = (slug) => {
    navigate(`/hub/blog/${slug}`);
  };

  const validateEmail = (email) => {
    // Simple regex for email validation
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setEmail("");
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Journal</h1>
        <p className={styles.subtitle}>Insights on design, production, and the future of fashion infrastructure.</p>
        
        <div className={styles.filterBar}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Featured Post */}
      <article className={styles.featuredCard}>
        <div className={styles.featuredImage} onClick={() => handleReadArticle(featuredPost.slug)}>
          <img src={featuredPost.image} alt={featuredPost.title} />
          <span className={styles.featuredTag}>Featured • {featuredPost.category}</span>
        </div>
        <div className={styles.featuredContent}>
          <div className={styles.meta}>
            <span>{featuredPost.date}</span>
            <span>•</span>
            <span>{featuredPost.readTime}</span>
          </div>
          <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
          <p className={styles.excerpt}>{featuredPost.excerpt}</p>
          <div className={styles.authorRow}>
            <span className={styles.author}>By {featuredPost.author}</span>
            <button className={styles.readMoreBtn} onClick={() => handleReadArticle(featuredPost.slug)}>
              Read Article →
            </button>
          </div>
        </div>
      </article>

      {/* Posts Grid */}
      <div className={styles.grid}>
        {filteredPosts.map(post => (
          <article key={post.id} className={styles.card}>
            <div className={styles.imageWrapper} onClick={() => handleReadArticle(post.slug)}>
              <img src={post.image} alt={post.title} loading="lazy" />
              <span className={styles.categoryTag}>{post.category}</span>
            </div>
            <div className={styles.content}>
              <div className={styles.metaSmall}>
                {post.date} • {post.readTime}
              </div>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>
              <div className={styles.footer}>
                <span className={styles.authorSmall}>By {post.author}</span>
                <button className={styles.iconBtn} onClick={() => handleReadArticle(post.slug)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className={styles.emptyState}>
          <p>No articles found in this category.</p>
        </div>
      )}
      
      {/* Newsletter Section */}
      <div className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <h3>Stay in the Loop</h3>
          <p>Weekly insights on production, design trends, and maker stories.</p>
        </div>
        
        <form className={styles.newsletterForm} onSubmit={handleSubscribe} noValidate>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Enter your email" 
              className={`${styles.input} ${error ? styles.inputError : ''} ${success ? styles.inputSuccess : ''}`} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || success}
            />
            {/* Custom Error Message */}
            {error && <span className={styles.errorMessage}>{error}</span>}
            {success && <span className={styles.successMessage}>Thanks for subscribing!</span>}
          </div>
          
          <button 
            type="submit" 
            className={styles.subscribeBtn}
            disabled={isLoading || success}
          >
            {isLoading ? "Processing..." : success ? "Subscribed" : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blog;