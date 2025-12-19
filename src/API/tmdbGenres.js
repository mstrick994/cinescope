/**
 * ============================================================
 * TMDB GENRE CONSTANTS
 * ============================================================
 * Source: TMDB official genre IDs
 * Purpose:
 * - Keep genre logic readable
 * - Prevent “wrong shelf” titles (talk shows in sitcoms, etc.)
 */

/* =========================
   MOVIE GENRES
========================= */
export const MOVIE_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

/* =========================
   TV GENRES
========================= */
export const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37,
};

/* =========================
   COMMON EXCLUSION PRESETS
========================= */

/**
 * Use this for:
 * - Sitcoms
 * - Dramas
 * - Crime
 * - Sci-Fi
 *
 * Prevents:
 * - Talk shows
 * - News
 * - Reality TV
 */
export const EXCLUDE_TV_NON_SERIES = [
  TV_GENRES.TALK,
  TV_GENRES.NEWS,
  TV_GENRES.REALITY,
];

/**
 * Extra strict (if you need it later)
 */
export const EXCLUDE_TV_NON_FICTION = [
  TV_GENRES.TALK,
  TV_GENRES.NEWS,
  TV_GENRES.REALITY,
  TV_GENRES.DOCUMENTARY,
];

/* =========================
   HELPER (OPTIONAL)
========================= */

/**
 * Checks if a title’s PRIMARY genre matches what we expect.
 * Use this only as a final client-side safety net.
 */
export const hasPrimaryGenre = (item, genreId) => {
  if (!Array.isArray(item?.genre_ids)) return false;
  return item.genre_ids[0] === genreId;
};
