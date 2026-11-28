import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Navigation
import StudioSideBar from "./StudioSideBar/StudioSideBar";
import StudioHeader from "./StudioHeader/StudioHeader";
import StudioMobileNav from "./StudioMobileNav/StudioMobileNav";

// ✅ KEEP: Existing Studio Components
import OverView from "./OverView/OverView";
import Messages from "./Messages/Messages";
import { CHAT_ENABLED } from "../config/features";
import ChatUnavailable from "../pages/ChatUnavailable";
import Transaction from "./Transaction/Transaction";
import StudioSettings from "./StudioSettings/StudioSettings";
import Analytics from "./Analytics/Analytics";
import ProModal from "./ProModal/ProModal";

// ✅ NEW: Maker-side B2B flow (incoming briefs + quote/decline in one screen)
import IncomingBriefs from "../Transform/MakerBriefs/IncomingBriefs";
import ProductionOrdersView from "../Transform/Orders/ProductionOrdersView";

import useMakerStudio from "../hooks/useMakerStudio";
import styles from "./MakerStudio.module.css";
import OrderView from "./Order/OrderView";

const MakerStudio: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => document.documentElement.getAttribute("data-theme") === "dark",
  );
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [hideMobileNav, setHideMobileNav] = useState<boolean>(false);

  const pathSegments = location.pathname.split("/");
  const currentTab = pathSegments[2] || "overview";

  const studio = useMakerStudio();

  const showStudioHeader = currentTab !== "messages";

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleTabChange = (tabId: string) => {
    const proFeatures = ["transactions", "analytics"];
    if (proFeatures.includes(tabId) && !isPro) {
      setShowProModal(true);
      return;
    }
    navigate(`/studio/${tabId}`);
  };

  const goToPlatform = () => navigate("/platform/discovery");

  useEffect(() => {
    if (currentTab !== "messages") setHideMobileNav(false);
  }, [currentTab]);

  return (
    <div
      className={styles.studioWrapper}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      <StudioSideBar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        goToPlatform={goToPlatform}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isPro={isPro}
        onUpgradeClick={() => setShowProModal(true)}
      />

      <main
        className={`${styles.mainContent} ${isCollapsed ? styles.contentExpanded : styles.contentContracted}`}
      >
        {showStudioHeader && (
          <StudioHeader
            activeTab={currentTab}
            goToPlatform={goToPlatform}
            isPro={isPro}
          />
        )}

        <div className={styles.viewport}>
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />

            {/* ✅ KEEP: Existing routes (maker's production view) */}
            <Route
          path="overview"
          element={
            <OverView
              dashboard={studio.dashboard}
              orders={studio.orders}
              maker={studio.maker}
              loading={studio.loading}
              error={studio.error}
              onReload={studio.reload}
            />
          }
        />
            <Route path="orders" element={<ProductionOrdersView />} />
            <Route path="orders/:orderId" element={<OrderView />} />
            <Route
              path="messages"
              element={
                CHAT_ENABLED ? (
                  <Messages
                    onMobileNavChange={setHideMobileNav}
                    isCollapsed={isCollapsed}
                  />
                ) : (
                  <ChatUnavailable
                    backTo="/studio/orders"
                    backLabel="Back to orders"
                  />
                )
              }
            />
            <Route
              path="transactions"
              element={<Transaction />}
            />
            <Route path="analytics" element={<Analytics />} />
            <Route
              path="settings"
              element={
                <StudioSettings
                  isPro={isPro}
                  onUpgradeClick={() => setShowProModal(true)}
                />
              }
            />

            {/* ✅ NEW: Maker incoming-briefs queue (P3.2.14).
                Quote + decline happen here via the in-screen modal,
                so there is intentionally NO standalone /studio/quotes route. */}
            <Route path="briefs" element={<IncomingBriefs />} />

            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </div>
      </main>

      {!hideMobileNav && (
        <StudioMobileNav
          activeTab={currentTab}
          setActiveTab={handleTabChange}
          goToPlatform={goToPlatform}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          isPro={isPro}
          onUpgradeClick={() => setShowProModal(true)}
        />
      )}

      {showProModal && (
        <ProModal
          onClose={() => setShowProModal(false)}
          onUpgrade={(planId) => {
            setIsPro(true);
            setShowProModal(false);
          }}
        />
      )}
    </div>
  );
};

export default MakerStudio;
