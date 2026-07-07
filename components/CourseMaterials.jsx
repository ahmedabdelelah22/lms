"use client";

// ─── Icons ─────────────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-gray-400 flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LessonsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-gray-400 flex-shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function EnrolledIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-gray-400 flex-shrink-0">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
    </svg>
  );
}
function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-gray-400 flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Single stat row ────────────────────────────────────────────────────────
function StatRow({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon />
      <span className="text-gray-500 text-sm flex-1">{label}</span>
      <span className="text-gray-900 font-semibold text-sm">{value}</span>
    </div>
  );
}

// ─── Single column of stats ─────────────────────────────────────────────────
function StatsColumn({ stats }) {
  const iconMap = { Duration: ClockIcon, Lessons: LessonsIcon, Enrolled: EnrolledIcon, Language: LanguageIcon };
  return (
    <div className="flex-1 min-w-0 divide-y divide-gray-100">
      {stats.map((s) => {
        const Icon = iconMap[s.label] || ClockIcon;
        return <StatRow key={s.label} Icon={Icon} label={`${s.label}:`} value={s.value} />;
      })}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
const DEFAULT_STATS = [
  { label: "Duration", value: "3 weeks" },
  { label: "Lessons",  value: "8" },
  { label: "Enrolled", value: "65 students" },
  { label: "Language", value: "English" },
];

const CourseMaterials = ({ stats = DEFAULT_STATS, // pass a second column of stats, or leave null to show only one column
  statsRight = DEFAULT_STATS,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Course Materials</h2>

      {/* Card */}
      <div
        className="bg-white rounded-xl px-6 py-2"
        style={{ boxShadow: "0 0 30px 8px rgba(0,0,0,0.05)" }}
      >
        {/* On mobile: single column. On md+: two columns */}
        <div className="flex flex-col md:flex-row md:gap-10">
          <StatsColumn stats={stats} />

          {statsRight && (
            <>
              {/* Vertical divider on desktop */}
              <div className="hidden md:block w-px bg-gray-100 my-2" />
              {/* Horizontal divider on mobile */}
              <div className="block md:hidden border-t border-gray-100 my-1" />
              <StatsColumn stats={statsRight} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default CourseMaterials;