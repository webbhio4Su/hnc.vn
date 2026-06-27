import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Baby, 
  Search, 
  Plus, 
  BarChart2, 
  BookOpen, 
  Award, 
  Calendar, 
  User, 
  Heart,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { UserProfile } from "../types";

interface ParentDashboardProps {
  user: UserProfile;
  allUsers: UserProfile[];
}

interface ChildData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  progress: number;
  averageScore: number;
  rank: number;
  lastLesson: string;
  badges: number;
}

export default function ParentDashboard({ user, allUsers }: ParentDashboardProps) {
  const [activeChild, setActiveChild] = useState<ChildData | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddChild = (child: UserProfile) => {
    const exists = children.find(c => c.email === child.email);
    if (exists) {
      alert("Học sinh này đã được kết nối!");
      return;
    }

    const newChild: ChildData = {
      id: child.uid || Date.now().toString(),
      name: child.name,
      email: child.email,
      avatar: child.avatar,
      progress: Math.floor(Math.random() * 40 + 60),
      averageScore: Number((Math.random() * 2 + 8).toFixed(1)),
      rank: Math.floor(Math.random() * 50 + 1),
      lastLesson: "Toán học: Phân số",
      badges: Math.floor(Math.random() * 10)
    };
    setChildren([...children, newChild]);
    setShowAddChild(false);
    setSearchQuery("");
  };

  const filteredPossibleStudents = allUsers
    .filter(u => u.role === 'student' || !u.role)
    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Xin chào, Phụ huynh {user?.name}!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Theo dõi và đồng hành cùng con trên con đường tri thức.</p>
        </div>
        <button 
          onClick={() => setShowAddChild(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          Kết nối với con
        </button>
      </header>

      {/* Children List */}
      <section className="mb-12">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Baby className="text-blue-600 dark:text-blue-400" />
          Các con của bạn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => setActiveChild(child)}
              className={`p-6 rounded-[2.5rem] border-4 transition-all text-left group ${
                activeChild?.id === child.id 
                ? "bg-white dark:bg-slate-900 border-blue-600 shadow-xl shadow-blue-100 dark:shadow-none" 
                : "bg-slate-50 dark:bg-slate-900/50 border-transparent hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-100 dark:bg-blue-900/30 overflow-hidden border border-blue-200 dark:border-blue-800 shadow-sm transition-transform group-hover:scale-110">
                  <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{child.name}</h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{child.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tiến độ tuần này</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">{child.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${child.progress}%` }}
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {activeChild && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Chi tiết học tập - {activeChild.name}</h2>
            <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Xuất báo cáo PDF</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Điểm trung bình", value: activeChild.averageScore, icon: <BarChart2 />, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" },
              { label: "Xếp hạng lớp", value: `#${activeChild.rank}`, icon: <TrendingUp />, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30" },
              { label: "Bài học hoàn thành", value: "24", icon: <BookOpen />, color: "text-green-600 bg-green-50 dark:bg-green-900/30" },
              { label: "Huy hiệu", value: activeChild.badges, icon: <Award />, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-3">
                <Calendar className="text-blue-600 dark:text-blue-400" />
                Lịch sử học tập
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Toán học: Phân số", score: "9/10", date: "Hôm nay, 10:30" },
                  { title: "Vật lý: Lực hấp dẫn", score: "8.5/10", date: "Hôm qua, 15:45" },
                  { title: "Tiếng Anh: Vocabulary", score: "10/10", date: "2 ngày trước" },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{log.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 dark:text-blue-400 font-black">{log.score}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Xem tất cả lịch sử</button>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[2.5rem] shadow-xl dark:shadow-none text-white space-y-8 relative overflow-hidden border border-slate-800 dark:border-slate-900">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               
               <div>
                 <h3 className="font-black text-xl mb-2">Đánh giá từ Giáo viên</h3>
                 <p className="text-slate-400 font-medium leading-relaxed italic">"An học rất chăm chỉ và có tiến bộ vượt bậc ở môn Toán. Cần chú ý thêm một chút về phần trình bày bài giải!"</p>
               </div>

               <div className="space-y-4">
                 <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em]">Lời nhắn khích lệ con</p>
                 <textarea 
                   placeholder="Nhập lời nhắn yêu thương gửi tới con..."
                   className="w-full bg-white/5 dark:bg-slate-900 border-2 border-white/10 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 transition-all font-medium min-h-[120px] resize-none dark:text-white"
                 />
                 <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                   <Heart size={20} />
                   Gửi cho con
                 </button>
               </div>
            </div>
          </div>
        </motion.section>
      )}

      {!activeChild && (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800">
           <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600 shadow-sm border border-slate-100 dark:border-slate-700">
             <Baby size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Hãy chọn một đứa trẻ</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">Bấm vào con của bạn ở trên để bắt đầu theo dõi tiến độ một cách chi tiết!</p>
        </div>
      )}

      {/* Add Child Modal */}
      <AnimatePresence>
        {showAddChild && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <button onClick={() => setShowAddChild(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200">
                <Plus size={24} className="rotate-45" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Kết nối với con</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Nhập email con bạn đang sử dụng trên hệ thống.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium dark:text-white"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {searchQuery.length >= 2 && filteredPossibleStudents.map(student => (
                    <button
                      key={student.uid}
                      onClick={() => handleAddChild(student)}
                      className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-500 transition-all text-left group"
                    >
                      <img src={student.avatar} className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{student.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{student.email}</p>
                      </div>
                      <Plus size={16} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  {searchQuery.length >= 2 && filteredPossibleStudents.length === 0 && (
                    <p className="text-center py-4 text-xs text-slate-400 font-medium italic">Không tìm thấy học sinh phù hợp</p>
                  )}
                  {searchQuery.length < 2 && (
                    <p className="text-center py-4 text-xs text-slate-400 font-medium italic">Nhập ít nhất 2 ký tự để tìm kiếm</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
