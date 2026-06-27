import { motion } from "motion/react";
import { lessons, getRandomQuiz, Lesson } from "../data/lessons";
import { UserProfile } from "../types";
import { 
  Calculator, 
  Languages, 
  Beaker, 
  Globe, 
  Laptop,
  ChevronRight,
  BookOpen,
  FolderOpen,
  Trophy,
  Sparkles,
  GraduationCap,
  User as UserIcon,
  Home,
  Users,
  ShieldCheck,
  Baby,
  ShieldAlert,
  Bell,
  Banknote
} from "lucide-react";

interface SidebarProps {
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  onGoHome: () => void;
  onGoSocial: () => void;
  onGoCompetition: () => void;
  onGoProfile: () => void;
  onGoNotifications: () => void;
  onGoBank: () => void;
  user: UserProfile | null;
}

const iconMap: Record<string, any> = {
  Fraction: Calculator,
  Languages: Languages,
  Beaker: Beaker,
  Globe: Globe,
  Laptop: Laptop,
  Trophy: Trophy
};

export default function Sidebar({ 
  activeLessonId, 
  onSelectLesson, 
  onGoHome, 
  onGoSocial, 
  onGoCompetition, 
  onGoProfile,
  onGoNotifications,
  onGoBank,
  user 
}: SidebarProps) {
  const categories = Array.from(new Set(lessons.map(l => l.category)));

  const getDashboardIcon = () => {
    if (user?.role === 'admin') return <ShieldAlert size={20} />;
    if (user?.role === 'user') return <Sparkles size={20} />;
    if (user?.role === 'teacher') return <ShieldCheck size={20} />;
    if (user?.role === 'parent') return <Baby size={20} />;
    return <Home size={20} />;
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return "Bảng Quản trị";
    if (user?.role === 'user') return "Bảng Tổng hợp";
    return "Trang chủ";
  };

  return (
    <aside className="w-full lg:w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 h-screen overflow-y-auto shrink-0 flex flex-col transition-colors duration-300">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={onGoHome}>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 ring-4 ring-white dark:ring-slate-900 transform group-hover:rotate-6 transition-transform duration-300">
              <GraduationCap size={28} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-bounce-slow">
              <Sparkles size={10} className="text-white fill-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-black text-slate-900 dark:text-white leading-none text-2xl tracking-tighter">HọcVui</h1>
              <span className="text-blue-600 dark:text-blue-400 font-black text-2xl">.vn</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] whitespace-nowrap">
                {user?.role === 'admin' ? 'Hệ thống Quản trị' : user?.role === 'user' ? 'Toàn quyền truy cập' : user?.role === 'teacher' ? 'Cổng Giáo viên' : user?.role === 'parent' ? 'Cổng Phụ huynh' : 'Nền tảng Học tập'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <button
            onClick={onGoHome}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
              activeLessonId === "home" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            {getDashboardIcon()}
            {getDashboardLabel()}
          </button>

          <button
            onClick={onGoSocial}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
              activeLessonId === "social" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            <Users size={20} />
            Bạn bè & Trò chuyện
          </button>

          <button
            onClick={onGoCompetition}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
              activeLessonId === "competition" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            <Trophy size={20} />
            Cuộc thi & Bảng xếp hạng
          </button>

          <button
            onClick={onGoBank}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
              activeLessonId === "bank" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            <Banknote size={20} className="text-yellow-500" />
            Ngân hàng Hncoi
          </button>

          <button
            onClick={onGoProfile}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
              activeLessonId === "profile" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            <UserIcon size={20} />
            Hồ sơ cá nhân
          </button>

          <button
            onClick={onGoNotifications}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
              activeLessonId === "notifications" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none font-bold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            <Bell size={20} />
            Thông báo
          </button>
          
          <button
            onClick={() => onSelectLesson(getRandomQuiz())}
            className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 ${
              activeLessonId === "kiem-tra-tong-hop"
              ? "bg-purple-600 text-white shadow-xl shadow-purple-100 dark:shadow-none"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-200 dark:shadow-none"
            }`}
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <Trophy size={20} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Siêu thử thách</p>
              <p className="font-bold text-sm">30 Câu hỏi ngẫu nhiên</p>
            </div>
            <Sparkles size={16} className="absolute top-2 right-2 opacity-50 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        <nav className="space-y-6">
          <div className="flex items-center gap-2 px-3 mb-1">
            <BookOpen size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Học tập nhanh</h2>
          </div>
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2 px-3 mb-1">
                <FolderOpen size={14} className="text-slate-400" />
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{category}</h2>
              </div>
              <div className="space-y-1">
                {lessons
                  .filter((l) => l.category === category)
                  .map((lesson) => {
                    const Icon = iconMap[lesson.icon] || BookOpen;
                    const isActive = activeLessonId === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold" 
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg transition-colors ${
                            isActive ? "bg-blue-100 dark:bg-blue-800" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700"
                          }`}>
                            <Icon size={16} />
                          </div>
                          <span className="text-sm text-left line-clamp-1">{lesson.title}</span>
                        </div>
                        {isActive && (
                          <motion.div layoutId="active-indicator">
                            <ChevronRight size={14} className="text-blue-500 dark:text-blue-400" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden shadow-inner p-1">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name || "Người học"}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">
              {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'user' ? 'Siêu người dùng' : user?.role === 'teacher' ? 'Giáo viên' : user?.role === 'parent' ? 'Phụ huynh' : `Lớp ${user?.className}`}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
