# NOTES

## Summary of changes
1. **SQL precedence bug (highest value).** `A AND B OR C AND D` meant archived tasks leaked into search via description matches, and the status filter was ignored for title matches. Parenthesised the match in the repository, `db/queries/search_tasks.sql` and both queries in the Oracle package.
2. **Removed `Thread.sleep`** that made short/empty queries take up to 1s (the default page load).
3. **Validation:** bad `status` returned 500, now 400; `page`/`pageSize` are clamped (page 0 or negative size used to throw).
4. **DB-side pagination** (`Page` + `Pageable`) instead of loading every row and calling `subList`; added `id` as sort tie-breaker for stable pages.
5. **Frontend:** 300ms debounce, `AbortController` to stop stale responses overwriting newer ones, page resets to 1 on new search/filter, errors clear and `loading` resets on failure (it used to hang on "Loading..."), page size constant instead of hard-coded 10 twice.

## Not changed
- LIKE wildcard escaping (`%`, `_` typed by users): low impact.
- No auth, tests, or error-boundary/UI redesign: out of scope for a patch.
- Oracle ROWNUM pagination left as is (works; `OFFSET/FETCH` is 12c+ only).

## Biggest remaining risk
No automated tests, and `status`/`priority` are free-form strings with no DB constraint. Also `LIKE '%x%'` can't use an index, so search will degrade on large tables.

## Tools / AI
Used Claude to review the repo, draft the fixes and reproduce the SQL bug against the seed data in SQLite. I read and adjusted every change. [EDIT: state what you personally ran/changed and how you tested it in the real app.]
