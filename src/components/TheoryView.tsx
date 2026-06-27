import { motion, AnimatePresence } from "motion/react";
import { Lesson } from "../data/lessons";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface TheoryViewProps {
  lesson: Lesson;
}

export default function TheoryView({ lesson }: TheoryViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8 pb-20"
    >
      <header>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase tracking-wide">
          {lesson.category}
        </span>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 leading-tight">
          {lesson.title}
        </h2>
      </header>

      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-6">
        <p className="text-lg">
          {lesson.theory.content}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
            <Lightbulb className="text-yellow-500" size={20} />
            <h3>Kiến thức trọng tâm</h3>
          </div>
          <ul className="space-y-4">
            {lesson.theory.keyPoints.map((point, index) => (
              <li key={index} className="flex gap-3">
                <CheckCircle2 className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                <span className="text-slate-600 dark:text-slate-400">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-white mb-2">💡 Mẹo học nhanh</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            Hãy thuộc lòng công thức trước khi bắt đầu làm bài tập nhé!
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-2">🎯 Mục tiêu</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Hiểu rõ bản chất và vận dụng linh hoạt vào thực tiễn.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
