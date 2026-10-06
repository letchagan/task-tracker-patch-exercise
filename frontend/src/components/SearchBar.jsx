export default function SearchBar({ value, onChange }) {
  return (
    <label className="search">
      <svg className="search-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title or description"
        aria-label="Search tasks"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
