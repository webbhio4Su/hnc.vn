import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Baby, 
  GraduationCap, 
  ShieldCheck, 
  Layout, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { UserProfile } from "../types";
import HomeView from "./HomeView";
import TeacherDashboard from "./TeacherDashboard";
import ParentDashboard from "./ParentDashboard";
import { getRandomQuiz } from "../data/lessons";

interface SuperDashboardProps {
  user: UserProfile;
  allUsers: UserProfile[];
  onSelectLesson: (lesson: any) => void;
}

export default function SuperDashboard({ user, allUsers, onSelectLesson }: SuperDashboardProps) {
  const [activeMode, setActiveMode] = useState<'student' | 'teacher' | 'parent'>('student');

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 dark:bg-black p-8 rounded-[2.5rem] text-white shadow-2xl dark:shadow-none relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Chế độ Siêu người dùng</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Xin chào, {user.name}!</h1>
          <p className="text-slate-400 font-medium">Bạn có quyền truy cập vào tất cả các tính năng của hệ thống.</p>
        </div>

        <div className="flex bg-white/10 dark:bg-white/5 p-1.5 rounded-[1.5rem] backdrop-blur-md relative z-10 scrollbar-hide overflow-x-auto max-w-full">
          {[
            { id: 'student', label: 'Học sinh', icon: <GraduationCap size={18} /> },
            { id: 'teacher', label: 'Giáo viên', icon: <ShieldCheck size={18} /> },
            { id: 'parent', label: 'Phụ huynh', icon: <Baby size={18} /> }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeMode === mode.id ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      </header>

      <motion.div
        key={activeMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeMode === 'student' && (
          <HomeView 
            user={user} 
            onSelectLesson={onSelectLesson} 
            onStartQuiz={() => onSelectLesson(getRandomQuiz())} 
          />
        )}
        {activeMode === 'teacher' && <TeacherDashboard user={user} allUsers={allUsers} />}
        {activeMode === 'parent' && <ParentDashboard user={user} allUsers={allUsers} />}
      </motion.div>
    </div>
  );
}
