import { useState } from "react";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="w-4 h-4"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PDFIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-4 h-4"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ExamIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-4 h-4"
  >
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

const CurriculumSidebar = ({ CURRICULUM, setPopup ,className=""}) => {
  const [openWeek, setOpenWeek] = useState(0);

  const toggleWeek = (index) => {
    setOpenWeek(openWeek === index ? null : index);
  };

  return (
    <div className= {`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}> 
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-50 to-white ">
        <h3 className="text-base font-semibold text-gray-800">
          Course Curriculum
        </h3>
        <p className="text-xs text-gray-500">
          {CURRICULUM.length} Weeks
        </p>
      </div>

      {/* Weeks */}
      <div className="p-3 space-y-2 max-h-[520px] overflow-y-auto">
        {CURRICULUM.map((week, index) => {
          const isOpen = openWeek === index;

          return (
            <div
              key={week.week}
              className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
            >
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(index)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {week.week}
                  </h4>

                  <p className="text-[11px] text-gray-500">
                    {week.lessons.length} Lessons
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 text-sm font-bold">
                  {isOpen ? "−" : "+"}
                </div>
              </button>

              {/* Lessons */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[600px]" : "max-h-0"
                }`}
              >
                <div className="p-2 space-y-1 border-t border-gray-200 bg-white">
                  {week.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        if (lesson.type === "pdf") setPopup("pdf");
                        if (lesson.type === "exam") setPopup("exam");
                      }}
                      className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 border transition ${
                        lesson.active
                          ? "bg-indigo-50 border-indigo-200"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          lesson.done
                            ? "bg-green-500 text-white"
                            : lesson.active
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {lesson.done ? (
                          <CheckIcon />
                        ) : lesson.type === "pdf" ? (
                          <PDFIcon />
                        ) : lesson.type === "exam" ? (
                          <ExamIcon />
                        ) : (
                          <PlayIcon />
                        )}
                      </div>

                      {/* Title */}
                      <div className="flex-1 text-left overflow-hidden">
                        <p
                          className={`text-sm truncate ${
                            lesson.active
                              ? "font-medium text-indigo-700"
                              : lesson.done
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {lesson.title}
                        </p>

                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          {lesson.type}
                        </span>
                      </div>

                      {lesson.done && (
                        <span className="text-green-500 text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumSidebar;