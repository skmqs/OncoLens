import React from "react";

export default function LoadingSpinner({ text = "Loading…", size = "md" }) {
  const sz = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-10 h-10" }[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <div className={`${sz} border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin`} />
      <span className="text-sm">{text}</span>
    </div>
  );
}
