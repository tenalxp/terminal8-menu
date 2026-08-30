export default function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4">
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col gap-3">
          <div className="skeleton h-5 w-28 rounded-md" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="skeleton aspect-square" />
                <div className="p-2.5 flex flex-col gap-2">
                  <div className="skeleton h-3.5 w-4/5 rounded-md" />
                  <div className="skeleton h-3 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
