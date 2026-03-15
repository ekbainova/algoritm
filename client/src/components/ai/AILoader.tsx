export function AILoader() {
  return (
    <div className="flex items-center gap-3 p-5 rounded-[20px] bg-[#3d1560] border-l-4 border-[#ffd84d]">
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
  );
}
