export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null

  const items = []
  for (let i = 1; i <= pages; i++) items.push(i)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg glass border border-white/10 text-white/50 hover:text-white hover:border-violet-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        ‹
      </button>

      {items.map(i => (
        <button
          key={i}
          onClick={() => onPage(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 border
            ${i === page
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-lg shadow-violet-500/30'
              : 'glass border-white/10 text-white/50 hover:text-white hover:border-violet-500/50'
            }`}
        >
          {i}
        </button>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center rounded-lg glass border border-white/10 text-white/50 hover:text-white hover:border-violet-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
      >
        ›
      </button>
    </div>
  )
}
