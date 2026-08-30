export default function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4">
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col gap-3">
          <div className="skeleton h-5 w-28 rounded-md" />
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex gap-3 rounded-2xl p-3"
              style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="skeleton h-4 w-2/3 rounded-md" />
                <div className="skeleton h-3 w-full rounded-md" />
                <div className="skeleton h-4 w-14 rounded-md mt-1" />
              </div>
              <div className="skeleton shrink-0 w-20 h-20 rounded-xl" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
