export default function Spinner({ className = '', size = 'md' }) {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${dim} relative`}>
        <div className={`${dim} rounded-full border-2 border-transparent border-t-violet-400 border-r-fuchsia-400 animate-spin`} />
        <div className={`${dim} rounded-full border-2 border-transparent border-b-cyan-400 animate-spin-slow absolute inset-0`} style={{ animationDirection: 'reverse' }} />
      </div>
    </div>
  )
}
