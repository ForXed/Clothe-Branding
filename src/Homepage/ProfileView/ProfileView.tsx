import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProfileView.module.css";

// --- TypeScript Interfaces ---
export interface ProfileProduct {
  id: number | string;
  title: string;
  price: string;
  category: string;
  stock: number;
  img: string;
}

interface MakerStats {
  products: number;
  rating: number;
  sales: number;
  responseTime?: string;
}

interface MakerProfile {
  id: string;
  name: string;
  bio: string;
  location: string;
  established: string;
  stats: MakerStats;
  avatar: string | null;
  cover: string;
  verified: boolean;
  products: ProfileProduct[];
}

interface ProfileViewProps {
  makerId?: string;
  userAvatar: string | null;
  setUserAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  onProductClick: (product: ProfileProduct) => void;
  onMessageMaker?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  makerId: propMakerId,
  userAvatar,
  setUserAvatar,
  onProductClick,
  onMessageMaker,
}) => {
  const params = useParams<{ makerId: string }>();
  const navigate = useNavigate();

  const currentMakerId = params.makerId || propMakerId || "me";

  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<MakerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"infrastructure" | "specs">(
    "infrastructure",
  );
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterBy, setFilterBy] = useState<string>("all");

  // Mock Database - In real app, this comes from maker's settings
  const MAKERS_DB: Record<string, MakerProfile> = {
    "julian-v-studio": {
      id: "julian-v-studio",
      name: "Julian V. Studio",
      bio: "Creative direction specializing in heavyweight blanks & techwear architecture. Based in Berlin. Available for custom production runs ranging from 50-500 units.",
      location: "Berlin, DE",
      established: "2023",
      stats: { products: 6, rating: 4.9, sales: 128, responseTime: "< 2h" },
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      cover:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      verified: true,
      products: [
        {
          id: 101,
          title: "450GSM Heavyweight Tee",
          price: "$89",
          category: "Tees",
          stock: 45,
          img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        },
        {
          id: 102,
          title: "Techwear Cargo V2",
          price: "$145",
          category: "Bottoms",
          stock: 12,
          img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400",
        },
        {
          id: 103,
          title: "Oversized Hoodie - Black",
          price: "$120",
          category: "Layering",
          stock: 8,
          img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        },
        {
          id: 104,
          title: "Structured Cap",
          price: "$45",
          category: "Accessories",
          stock: 120,
          img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
        },
        {
          id: 105,
          title: "Minimalist Crewneck",
          price: "$95",
          category: "Layering",
          stock: 25,
          img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        },
        {
          id: 106,
          title: "Wide Leg Trousers",
          price: "$165",
          category: "Bottoms",
          stock: 18,
          img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
        },
      ],
    },
    me: {
      id: "me",
      name: "My Atelier",
      bio: "You haven't set up your maker profile yet. Go to Settings to upgrade.",
      location: "Unknown",
      established: "2024",
      stats: { products: 0, rating: 0, sales: 0 },
      avatar: userAvatar,
      cover:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      verified: false,
      products: [],
    },
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data = MAKERS_DB[currentMakerId] || MAKERS_DB["julian-v-studio"];
      setProfileData(data);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentMakerId, userAvatar]);

  const handleProductClick = (product: ProfileProduct) => {
    if (onProductClick) onProductClick(product);
  };

  const handleContactMaker = () => {
    if (!profileData) return;

    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

    setTimeout(() => {
      if (onMessageMaker) {
        onMessageMaker();
      } else {
        navigate("/platform/chat", {
          state: {
            newConversation: {
              id: profileData.id,
              name: profileData.name,
              avatar: profileData.avatar,
              role: profileData.location,
              initialMessage: `Hi ${profileData.name.split(" ")[0]}, I'm interested in discussing a production run.`,
            },
          },
        });
      }
    }, 50);
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          textTransform: "uppercase",
          letterSpacing: "2px",
          fontWeight: 700,
        }}
      >
        <p>Initializing Infrastructure...</p>
      </div>
    );
  }

  if (!profileData) return null;

  const isOwnProfile = currentMakerId === "me";
  const catalog = profileData.products;

  return (
    <div className={styles.profileContainer}>
      {/* --- COVER & AVATAR --- */}
      <div className={styles.coverWrapper}>
        <img
          src={profileData.cover}
          alt="Cover"
          className={styles.coverImage}
        />
        <div className={styles.coverGradient} />
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className={styles.avatar}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eee",
                }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>
          {!isOwnProfile && profileData.verified && (
            <div className={styles.verifiedBadge} title="Verified Atelier">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className={styles.contentContainer}>
        {/* --- HEADER INFO --- */}
        <div className={styles.profileHeader}>
          <div className={styles.nameRow}>
            <h1 className={styles.makerName}>{profileData.name}</h1>
            {!isOwnProfile && profileData.verified && (
              <span className={styles.verifiedText}>Verified</span>
            )}
          </div>

          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {profileData.location}
            </span>
            <span className={styles.metaItem}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Est. {profileData.established}
            </span>
          </div>

          <p className={styles.makerBio}>{profileData.bio}</p>

          {!isOwnProfile && (
            <div className={styles.headerActions}>
              <button
                type="button"
                className={`${styles.actionBtn} ${shareCopied ? styles.copiedState : ""}`}
                onClick={handleShareProfile}
              >
                {shareCopied ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share Profile
                  </>
                )}
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.primaryBtn}`}
                onClick={handleContactMaker}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z" />
                </svg>
                Inquire for Production
              </button>
            </div>
          )}
        </div>

        {/* --- STATS CARDS --- */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className={styles.statValue}>{profileData.stats.products}</div>
            <div className={styles.statLabel}>Active Templates</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.statValue}>
              {profileData.stats.rating > 0 ? profileData.stats.rating : "-"}
            </div>
            <div className={styles.statLabel}>Quality Index</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div className={styles.statValue}>{profileData.stats.sales}</div>
            <div className={styles.statLabel}>Units Produced</div>
          </div>

          {!isOwnProfile && profileData.stats.responseTime && (
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className={styles.statValue}>
                {profileData.stats.responseTime}
              </div>
              <div className={styles.statLabel}>Atelier Response</div>
            </div>
          )}
        </div>

        {/* --- TABS --- */}
        <div className={styles.tabsContainer}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "infrastructure" ? styles.active : ""}`}
            onClick={() => setActiveTab("infrastructure")}
          >
            Infrastructure
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "specs" ? styles.active : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Atelier Specs
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        {activeTab === "infrastructure" && (
          <>
            {catalog.length === 0 ? (
              <div className={styles.emptyCatalog}>
                <p>No infrastructure templates available yet.</p>
                {isOwnProfile && (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                    onClick={() => navigate("/studio")}
                  >
                    Setup Your Studio
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Sort/Filter Bar */}
                <div className={styles.filterBar}>
                  <div className={styles.filterLeft}>
                    <span className={styles.filterLabel}>Sort:</span>
                    <select
                      className={styles.filterSelect}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  <div className={styles.filterLeft}>
                    <span className={styles.filterLabel}>Filter:</span>
                    <select
                      className={styles.filterSelect}
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="tees">Tees</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="layering">Layering</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Masonry Grid */}
                <div className={styles.masonryGrid}>
                  {catalog.map((product) => (
                    <div
                      key={product.id}
                      className={styles.productCard}
                      onClick={() => handleProductClick(product)}
                    >
                      <div className={styles.productImage}>
                        <img
                          src={product.img}
                          alt={product.title}
                          loading="lazy"
                        />
                        {product.stock < 20 && (
                          <span className={styles.stockBadge}>
                            Low Stock ({product.stock})
                          </span>
                        )}
                      </div>
                      <div className={styles.productDetails}>
                        <div className={styles.productCategory}>
                          {product.category}
                        </div>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <span className={styles.productPrice}>
                          {product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "specs" && (
          <div className={styles.specsSection}>
            <div className={styles.specBlock}>
              <div className={styles.specBlockHeader}>
                <div className={styles.specIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3>Production Capabilities</h3>
              </div>
              <p>
                Specializing in heavyweight blanks and techwear architecture. We
                handle everything from initial tech pack review to final quality
                control. Minimum order quantities start at 50 units for custom
                branding, with turnaround times of 3-4 weeks depending on
                complexity.
              </p>
            </div>

            <div className={styles.specBlock}>
              <div className={styles.specBlockHeader}>
                <div className={styles.specIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3>Logistics & Fulfillment</h3>
              </div>
              <p>
                Based in {profileData.location}. We ship globally via DHL and
                FedEx, with automated customs documentation and HS codes
                generated directly from our studio dashboard. All funds are held
                in secure escrow until delivery confirmation.
              </p>
            </div>

            <div className={styles.specBlock}>
              <div className={styles.specBlockHeader}>
                <div className={styles.specIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Quality Assurance</h3>
              </div>
              <p>
                Every production run undergoes a 5-point inspection process. We
                maintain a 99.2% quality approval rate across all active
                templates.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Actions */}
      {!isOwnProfile && (
        <div className={styles.mobileActions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${shareCopied ? styles.copiedState : ""}`}
            onClick={handleShareProfile}
          >
            {shareCopied ? "Copied" : "Share"}
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.primaryBtn}`}
            onClick={handleContactMaker}
          >
            Inquire
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
