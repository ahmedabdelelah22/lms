"use client";
import { useState } from "react";

const COMMENTS_DATA = [
  {
    id: 1,
    name: "Student Name Goes Here",
    date: "Oct 10, 2021",
    avatar: "https://i.pravatar.cc/80?img=11",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    name: "Student Name Goes Here",
    date: "Oct 15, 2021",
    avatar: "https://i.pravatar.cc/80?img=47",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    name: "Student Name Goes Here",
    date: "Oct 19, 2021",
    avatar: "https://i.pravatar.cc/80?img=53",
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const Comments = ({ comments = COMMENTS_DATA }) => {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) return;
    setSubmitted(true);
    setValue("");
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

      {/* Comment list */}
      <div className="divide-y divide-gray-100">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4 py-6 first:pt-0">
            {/* Avatar */}
            <img
              src={c.avatar}
              alt={c.name}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-gray-100"
            />
            {/* Body */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
              <p className="text-gray-400 text-xs mt-0.5 mb-2">{c.date}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Write comment */}
      <div className="mt-4">
        <div
          className="w-full border border-gray-200 rounded-lg overflow-hidden"
          style={{ boxShadow: "0 0 0 0 transparent" }}
        >
          <textarea
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a comment"
            className="w-full px-4 pt-4 pb-2 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent border-none"
          />
        </div>

        {/* Submit button */}
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {submitted ? "Submitted ✓" : "Submit Review"}
            {!submitted && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Comments;