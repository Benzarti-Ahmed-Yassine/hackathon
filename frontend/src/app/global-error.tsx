'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
          <p className="text-slate-500 text-sm font-mono">{error.message}</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
