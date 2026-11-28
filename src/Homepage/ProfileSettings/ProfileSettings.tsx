import React, { useState } from 'react';
import ChangePasswordForm from '../../Form/ChangePasswordForm';
import { useAuth } from '../../auth/AuthContext';

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  avatar?: string | null;
}

interface ProfileSettingsProps {
  userProfile?: UserProfile | null;
  setUserProfile?: (data: Partial<UserProfile>) => void;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type SectionId = 'account' | 'security' | 'notifications' | 'payments' | 'sessions';

/**
 * Settings for v1, written to be honest about what exists.
 *
 * The API exposes exactly one thing this page can change: the password (through the
 * two-step OTP reset flow). There is no update-profile, notification, payment-method or
 * session endpoint, so those panels explain what is missing instead of faking a save.
 */
const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile }) => {
  const { user } = useAuth();
  const [section, setSection] = useState<SectionId>('account');

  const firstName = user?.firstName ?? userProfile?.firstName ?? '';
  const lastName = user?.lastName ?? userProfile?.lastName ?? '';
  const email = user?.email ?? userProfile?.email ?? '';

  const sections: { id: SectionId; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Password' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'payments', label: 'Payments' },
    { id: 'sessions', label: 'Sessions' },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          What your account can change today. Anything that would only pretend to save is called
          out below instead.
        </p>
      </header>

      <div style={styles.layout}>
        <nav style={styles.nav} aria-label="Settings sections">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              style={item.id === section ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}
              aria-current={item.id === section ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <section style={styles.panel}>
          {section === 'account' && (
            <>
              <h2 style={styles.panelTitle}>Account</h2>
              <p style={styles.panelHint}>
                These come from your session (<code style={styles.code}>GET /authentication/me</code>).
                Editing your name or email is not available yet — v1 has no update-profile endpoint.
              </p>
              <dl style={styles.dl}>
                <div style={styles.dlRow}>
                  <dt style={styles.dt}>First name</dt>
                  <dd style={styles.dd}>{firstName || '—'}</dd>
                </div>
                <div style={styles.dlRow}>
                  <dt style={styles.dt}>Last name</dt>
                  <dd style={styles.dd}>{lastName || '—'}</dd>
                </div>
                <div style={styles.dlRow}>
                  <dt style={styles.dt}>Email</dt>
                  <dd style={styles.dd}>
                    {email || '—'}
                    {user && (
                      <span style={user.emailVerified ? styles.badgeOk : styles.badgeWarn}>
                        {user.emailVerified ? 'verified' : 'not verified'}
                      </span>
                    )}
                  </dd>
                </div>
                <div style={styles.dlRow}>
                  <dt style={styles.dt}>Role</dt>
                  <dd style={styles.dd}>{user?.role ?? '—'}</dd>
                </div>
                {user?.role === 'MAKER' && (
                  <div style={styles.dlRow}>
                    <dt style={styles.dt}>Maker profile</dt>
                    <dd style={styles.dd}>
                      {user.makerProfile ? 'created' : 'not created yet — apply from the studio'}
                    </dd>
                  </div>
                )}
                <div style={styles.dlRow}>
                  <dt style={styles.dt}>Sign-in method</dt>
                  <dd style={styles.dd}>
                    {user?.googleAccount ? 'Google' : 'Email and password'}
                    {user?.hasPassword && user?.googleAccount ? ' (both)' : ''}
                  </dd>
                </div>
              </dl>
            </>
          )}

          {section === 'security' && (
            <>
              <h2 style={styles.panelTitle}>Change your password</h2>
              <p style={styles.panelHint}>
                The API has no direct "change password" call. It emails a six-digit code to your
                address and then resets with that code, so this form does exactly that.
              </p>
              <ChangePasswordForm onClose={() => setSection('account')} />
            </>
          )}

          {section === 'notifications' && (
            <NotBuilt
              title="Notifications"
              what="Email, in-app and browser notification preferences"
              why="The API sends transactional email only and stores no notification preferences."
              consequence="Nobody can fine-tune alerts yet, and there is no in-app notification feed to tune."
            />
          )}

          {section === 'payments' && (
            <NotBuilt
              title="Payments"
              what="Saved cards, payout accounts and billing history"
              why="Escrow in v1 is simulated inside the platform: paying an order marks the escrow HELD, with no card involved."
              consequence="There is nothing to store. When a payment provider is wired in, this is where cards and payouts would live."
            />
          )}

          {section === 'sessions' && (
            <NotBuilt
              title="Sessions"
              what="A list of devices signed in to your account, with a way to sign one out"
              why="Tokens are short-lived HttpOnly cookies and the API does not record per-device sessions."
              consequence="You can sign out of this browser from the account badge, but not from another device."
            />
          )}
        </section>
      </div>
    </div>
  );
};

const NotBuilt: React.FC<{ title: string; what: string; why: string; consequence: string }> = ({
  title,
  what,
  why,
  consequence,
}) => (
  <>
    <h2 style={styles.panelTitle}>{title}</h2>
    <div style={styles.notice}>
      <p style={styles.noticeLead}>Not built in v1.</p>
      <p style={styles.noticeLine}>
        <strong>What is missing:</strong> {what}.
      </p>
      <p style={styles.noticeLine}>
        <strong>Why:</strong> {why}
      </p>
      <p style={styles.noticeLine}>
        <strong>What that means for you:</strong> {consequence}
      </p>
    </div>
  </>
);

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
  header: { marginBottom: '20px' },
  title: { fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: 'var(--brut-text, #0f172a)' },
  subtitle: { margin: 0, color: '#64748b', fontSize: '14px', maxWidth: '620px', lineHeight: 1.5 },
  layout: { display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', flex: '0 0 auto' },
  navItem: {
    textAlign: 'left',
    padding: '10px 12px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#475569',
    fontSize: '14px',
    cursor: 'pointer',
  },
  navItemActive: { background: '#6c47ff', color: '#fff', fontWeight: 600 },
  panel: {
    flex: '1 1 420px',
    minWidth: 0,
    border: '1.5px solid #e2e8f0',
    borderRadius: '14px',
    padding: '20px',
    background: 'var(--brut-card, #fff)',
  },
  panelTitle: { fontSize: '17px', fontWeight: 600, margin: '0 0 8px', color: 'var(--brut-text, #0f172a)' },
  panelHint: { margin: '0 0 16px', color: '#64748b', fontSize: '13px', lineHeight: 1.55 },
  code: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '12px' },
  dl: { margin: 0 },
  dlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  dt: { color: '#94a3b8', fontSize: '13px', margin: 0 },
  dd: { margin: 0, fontSize: '14px', color: 'var(--brut-text, #0f172a)', textAlign: 'right' },
  badgeOk: {
    marginLeft: '8px',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '999px',
    background: '#dcfce7',
    color: '#15803d',
  },
  badgeWarn: {
    marginLeft: '8px',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '999px',
    background: '#fef3c7',
    color: '#b45309',
  },
  notice: { border: '1.5px dashed #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fafafa' },
  noticeLead: { margin: '0 0 10px', fontWeight: 600, color: '#b45309', fontSize: '14px' },
  noticeLine: { margin: '0 0 8px', color: '#475569', fontSize: '13px', lineHeight: 1.55 },
};

export default ProfileSettings;
