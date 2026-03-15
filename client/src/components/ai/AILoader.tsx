export function AILoader() {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-[#ffd84d] flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(255,216,77,0.3)]">
        🤖
      </div>
      <div className="flex-1 min-w-0 rounded-[20px] bg-[#3d1560] border-l-4 border-[#ffd84d] overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#ffd84d]"
                style={{
                  animation: 'pulse-dot 1.4s infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-white/80">ALGO думает...</span>
        </div>
      </div>
    </div>
  );
}
