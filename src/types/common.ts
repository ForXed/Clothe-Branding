// src/types/common.ts
// The one list envelope every endpoint returns (see docs/API_HANDOFF.md).
// `page` is 0-based; `size` is 1..100 and defaults to 20 server side.

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageParams {
  page?: number;
  size?: number;
}

/** Reads a paged answer while tolerating a bare array (older shape / mocks). */
export function toPage<T>(data: Page<T> | T[] | null | undefined): Page<T> {
  if (Array.isArray(data)) {
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: data.length > 0 ? 1 : 0,
    };
  }

  return (
    data ?? { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0 }
  );
}
