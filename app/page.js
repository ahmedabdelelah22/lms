"use client";

import Comments from "@/components/CommentsSection";
import CourseMaterials from "@/components/CourseMaterials";
import CurriculumSidebar from "@/components/CurriculumSidebar";
import Nav from "@/components/Nav";
import VideoPlayer from "@/components/VideoPlayer";
import { FileQuestionIcon } from "lucide-react";
import { useState, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────
const COURSE = {
  title: "Starting SEO as your Home ",
  instructor: "Ahmed Hassan",
  totalLessons: 24,
  completedLessons: 9,
};

const CURRICULUM = [
  {
    week: "Week 1–4",
    lessons: [
      { id: 1, title: "Course Introduction",    duration: "5:20",  done: true,  type: "video" },
      { id: 2, title: "SEO Fundamentals",        duration: "12:40", done: true,  type: "video" },
      { id: 3, title: "Keyword Research Basics", duration: "18:15", done: true,  type: "video" },
      { id: 4, title: "On-Page SEO",             duration: "22:10", done: false, type: "video", active: true },
      { id: 5, title: "Module Quiz",             duration: "10:00", done: false, type: "exam" },
    ],
  },
  {
    week: "Week 5–8",
    lessons: [
      { id: 6, title: "Link Building Strategies", duration: "25:00", done: false, type: "video" },
      { id: 7, title: "Technical SEO",            duration: "30:00", done: false, type: "video" },
      { id: 8, title: "Week 5–8 Resources",       duration: "",      done: false, type: "pdf"   },
      { id: 9, title: "Selling a business",       duration: "14:00", done: false, type: "video" },
    ],
  },
  {
    week: "Week 5–6",
    lessons: [
      { id: 6, title: "Link Building Strategies", duration: "25:00", done: false, type: "video" },
      { id: 7, title: "Technical SEO",            duration: "30:00", done: false, type: "video" },
      { id: 8, title: "Week 5–8 Resources",       duration: "",      done: false, type: "pdf"   },
      { id: 9, title: "Selling a business",       duration: "14:00", done: false, type: "video" },
    ],
  },
];

const MATERIALS_TABS = ["Overview", "Curriculum", "Leaders", "Ask Question"];

const LEADERBOARD = [
  { rank: 1, name: "Ahmed Rashad",  score: 980, avatar: "A", badge: "🥇" },
  { rank: 2, name: "Sara Hassan",   score: 940, avatar: "S", badge: "🥈" },
  { rank: 3, name: "Mohamed Ali",   score: 910, avatar: "M", badge: "🥉" },
  { rank: 4, name: "Nour Ibrahim",  score: 870, avatar: "N", badge: ""   },
  { rank: 5, name: "Yasmin Kamal",  score: 850, avatar: "Y", badge: ""   },
];

// ─── Icons ────────────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8 5v14l11-7z" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
);
const PDFIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const ExamIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="18" y1="6" x2="6"  y2="18" />
    <line x1="6"  y1="6" x2="18" y2="18" />
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4" />
    <path d="M12 17v4M8 21h8M6 9a6 6 0 0 0 12 0V3H6v6z" />
  </svg>
);

// ─── Progress Ring ────────────────────────────────────────────────────────
function ProgressRing({ percent, size = 56 }) {
  const r    = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke="#6366F1" strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={circ - (circ * percent) / 100}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={size/2} y={size/2}
        textAnchor="middle" dominantBaseline="central"
        style={{
          fontSize: 11, fontWeight: 700, fill: "#1f2937",
          transform: `rotate(90deg)`,
          transformOrigin: `${size/2}px ${size/2}px`,
        }}
      >
        {percent}%
      </text>
    </svg>
  );
}

// ─── Ask Question Popup — persists text in session ────────────────────────
function AskQuestionPopup({ onClose, savedText, onSaveText }) {
  const [text, setText] = useState(savedText || "");

  const handleChange = (e) => {
    setText(e.target.value);
    onSaveText(e.target.value); // persist on every keystroke
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSaveText(""); // clear after submit
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileQuestionIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Ask a Question</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            Have a question about this lesson? Ask below and the instructor or community will help.
          </p>
          <textarea
            rows={5}
            value={text}
            onChange={handleChange}
            placeholder="Write your question here..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          />
        </div>

        <div className="px-5 py-4 flex gap-3 justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Question
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Popup ────────────────────────────────────────────────────────────
function PDFPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Week 5–8 Resources.pdf</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><XIcon /></button>
        </div>
        <div className="bg-gray-50 h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><PDFIcon /></div>
            <p className="text-gray-500 text-sm">PDF Preview</p>
          </div>
        </div>
        <div className="px-5 py-4 flex gap-3 justify-end border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Close</button>
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Download PDF</button>
        </div>
      </div>
    </div>
  );
}

// ─── Exam Popup ───────────────────────────────────────────────────────────
function ExamPopup({ onClose }) {
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const q = {
    question: "What is the primary purpose of keyword research in SEO?",
    options: ["To increase website loading speed","To find terms users search for","To improve website security","To reduce bounce rate"],
    correct: 1,
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2"><ExamIcon /><h3 className="font-semibold text-gray-800">Module Quiz</h3></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><XIcon /></button>
        </div>
        <div className="p-5">
          <p className="text-sm text-indigo-600 font-medium mb-3">Question 1 of 5</p>
          <p className="text-gray-800 font-medium mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => !submitted && setSelected(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  submitted
                    ? i===q.correct ? "border-green-500 bg-green-50 text-green-700" : selected===i ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 text-gray-500"
                    : selected===i ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 hover:border-indigo-300 text-gray-700"
                }`}>
                <span className="font-medium mr-2">{String.fromCharCode(65+i)}.</span>{opt}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 flex gap-3 justify-end border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Close</button>
          {!submitted
            ? <button onClick={() => selected!==null && setSubmitted(true)} disabled={selected===null}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40">Submit</button>
            : <button onClick={onClose} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Finish</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard Popup ────────────────────────────────────────────────────
function LeaderboardPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2"><TrophyIcon /><h3 className="font-semibold text-gray-800">Leaderboard</h3></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><XIcon /></button>
        </div>
        <div className="p-4 space-y-2">
          {LEADERBOARD.map((u) => (
            <div key={u.rank} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${u.rank===1?"bg-yellow-50 border border-yellow-200":"bg-gray-50"}`}>
              <span className="text-lg w-6 text-center">{u.badge||`#${u.rank}`}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{u.avatar}</div>
              <span className="flex-1 text-sm font-medium text-gray-800">{u.name}</span>
              <span className="text-sm font-bold text-indigo-600">{u.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function CoursePlayer() {
  const [activeTab, setActiveTab]   = useState("Curriculum");
  const [popup,     setPopup]       = useState(null);
  const [isWideMode, setIsWideMode] = useState(false);

  // ✅ Ask Question — text persists across open/close in same session
  const [savedQuestionText, setSavedQuestionText] = useState("");

  const playerRef = useRef(null);
  const progress  = Math.round((COURSE.completedLessons / COURSE.totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Popups ── */}
      {popup === "pdf"          && <PDFPopup          onClose={() => setPopup(null)} />}
      {popup === "exam"         && <ExamPopup         onClose={() => setPopup(null)} />}
      {popup === "leaderboard"  && <LeaderboardPopup  onClose={() => setPopup(null)} />}
      {popup === "ask-question" && (
        <AskQuestionPopup
          onClose={() => setPopup(null)}
          savedText={savedQuestionText}
          onSaveText={setSavedQuestionText}
        />
      )}

      {/* ── Top Nav ── */}
      <Nav title={COURSE.title} />

      {/* Wide-mode player */}
      {isWideMode && (
        <VideoPlayer
          lessonTitle="On-Page SEO · Lesson 4"
          isWideMode={isWideMode}
          setIsWideMode={setIsWideMode}
        />
      )}

      {/* ── Layout ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* ════ LEFT ════ */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Normal player */}
          {!isWideMode && (
            <VideoPlayer
              lessonTitle="On-Page SEO · Lesson 4"
              isWideMode={isWideMode}
              setIsWideMode={setIsWideMode}
            />
          )}

          {/* Mobile tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sm:hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {MATERIALS_TABS.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab===tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab==="Overview" && (
                <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                  <p>This course teaches you everything you need to start an SEO-based business from home.</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[["24","Lessons"],["8","Weeks"],["3","Quizzes"],["1","Certificate"]].map(([n,l])=>(
                      <div key={l} className="bg-indigo-50 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-indigo-600">{n}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab==="Curriculum" && <CurriculumSidebar CURRICULUM={CURRICULUM} setPopup={setPopup} />}
              {activeTab==="Leaders" && (
                <div className="space-y-2">
                  {LEADERBOARD.map((u)=>(
                    <div key={u.rank} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${u.rank===1?"bg-yellow-50 border border-yellow-200":"bg-gray-50"}`}>
                      <span className="text-lg w-6 text-center">{u.badge||`#${u.rank}`}</span>
                      <span className="flex-1 text-sm font-medium text-gray-800">{u.name}</span>
                      <span className="text-sm font-bold text-indigo-600">{u.score} pts</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==="Ask Question" && <div className="text-center py-6 text-gray-400 text-sm"> {/* ✅ Ask Question button — replaces social icons (Leandro) */}
            <button
              onClick={() => setPopup("ask-question")}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-semibold text-sm transition-colors shadow-sm"
            >
              <FileQuestionIcon className="w-5 h-5" />
              Ask a Question
            </button>
            </div>}
            </div>
          </div>

          <CourseMaterials />
          <Comments />
        </div>

        {/* ════ RIGHT SIDEBAR ════ */}
        <div className="w-full lg:w-80 xl:w-88 shrink-0">
          <div className="lg:sticky lg:top-20 space-y-4">

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <ProgressRing percent={progress} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Course Progress</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {COURSE.completedLessons} of {COURSE.totalLessons} lessons
                  </p>
                </div>
              </div>
            </div>

           

            {/* Curriculum sidebar */}
            <CurriculumSidebar
              CURRICULUM={CURRICULUM}
              className="hidden lg:block"
              setPopup={setPopup}
            />

          </div>
        </div>

      </div>
    </div>
  );
}