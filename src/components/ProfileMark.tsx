export default function ProfileMark() {
  return (
    <div className="profile-mark" aria-hidden="true">
      <svg viewBox="0 0 320 240" fill="none">
        <path
          className="profile-mark-grid"
          d="M20 60h280M20 120h280M20 180h280M80 20v200M160 20v200M240 20v200"
        />
        <circle cx="160" cy="120" r="92" className="profile-mark-orbit" />
        <circle cx="160" cy="120" r="72" className="profile-mark-inner" />
        <path
          className="profile-mark-trace"
          d="M20 180h50l20-20h36m68-80h36l20-20h50M160 20v28m0 144v28"
        />
        <g fill="currentColor">
          <circle cx="20" cy="180" r="3" />
          <circle cx="300" cy="60" r="3" />
          <circle cx="160" cy="28" r="3" />
        </g>
        <text x="160" y="140" textAnchor="middle">
          J<tspan>I</tspan>B
        </text>
        <path
          className="profile-mark-corners"
          d="M32 44V28h16m224 0h16v16M32 196v16h16m224 0h16v-16"
        />
      </svg>
    </div>
  )
}
