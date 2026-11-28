// src/auth/homePath.ts
// One place that decides where a signed-in account belongs, so the login screen,
// the OAuth callback and the route guards cannot disagree.
import type { CurrentUser, UserRole } from '../types/auth';

/** Where a BUYER starts the One Loop. */
export const BUYER_HOME = '/platform/discovery';
export const MAKER_HOME = '/studio';
export const ADMIN_HOME = '/admin';

export function homePathFor(
  user: Pick<CurrentUser, 'role'> | null | undefined,
): string {
  switch (user?.role) {
    case 'MAKER':
      return MAKER_HOME;
    case 'ADMIN':
      return ADMIN_HOME;
    case 'BUYER':
      return BUYER_HOME;
    default:
      // A half-created account has no role yet; send it somewhere safe that
      // does not assume an identity.
      return '/platform';
  }
}

/** `/studio` is for makers (admins may look in), `/admin` is admins only. */
export const STUDIO_ROLES: UserRole[] = ['MAKER', 'ADMIN'];
export const ADMIN_ROLES: UserRole[] = ['ADMIN'];
