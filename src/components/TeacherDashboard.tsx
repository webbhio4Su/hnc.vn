import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  GraduationCap, 
  Plus, 
  BookOpen, 
  BarChart2, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Award,
  ExternalLink,
  Send,
  RefreshCcw,
  Bell,
  X
} from "lucide-react";
import { UserProfile } from "../types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface TeacherDashboardProps {
  user: UserProfile;
  allUsers: UserProfile[];
}

interface StudentInClass {
  name: string;
  email: string;
  avatar: string;
  progress: number;
  lastActivity: string;
}

export default function TeacherDashboard({ user, allUsers }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'classes' | 'stats' | 'announcements'>('students');
  const [searchQuery, setSearchQuery] = useState("");
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    type: 'announcement' as 'announcement' | 'system' | 'assignment'
  });
  const [isSending, setIsSending] = useState(false);

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.title || !announcement.content) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        ...announcement,
        senderId: user.uid,
        senderName: `GV. ${user.name}`,
        timestamp: serverTimestamp(),
        isRead: false
      });
      setAnnouncement({ title: '', content: '', type: announcement.type });
      alert("Thông báo đã được gửi đến cả lớp!");
    } catch (error) {
      console.error("Error sending announcement:", error);
      alert("Không thể gửi thông báo. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [memberStudents, setMemberStudents] = useState<StudentInClass[]>([]);

  useEffect(() => {
    // Initial load from allUsers based on class
    const classStudents = allUsers
      .filter(u => (u.role === 'student' || !u.role) && u.className === user.className)
      .map(u => ({
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        progress: Math.floor(Math.random() * 60 + 40),
        lastActivity: "Vừa mới đây"
      }));
    setMemberStudents(classStudents);
  }, [allUsers, user.className]);

  const handleAddStudent = (student: UserProfile) => {
    if (memberStudents.some(s => s.email === student.email)) {
      alert("Học sinh này đã có trong danh sách!");
      return;
    }
    const newStudent: StudentInClass = {
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      progress: Math.floor(Math.random() * 50 + 20),
      lastActivity: "Mới gia nhập"
    };
    setMemberStudents([...memberStudents, newStudent]);
    setShowAddStudent(false);
    setSearchQuery("");
  };

  const filteredPossibleStudents = allUsers
    .filter(u => u.role === 'student' || !u.role)
    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const filteredStudents = memberStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Xin chào, Giáo viên {user?.name}!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Quản lý lớp học {user?.className} và theo dõi kết quả của các học sinh.</p>
        </div>
        <div className="flex gap-4">
          <a 
            href="https://vuihoc.vn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold rounded-2xl shadow-sm hover:border-blue-600 dark:hover:border-blue-400 transition-all flex items-center gap-2"
          >
            <ExternalLink size={18} />
            Bài giảng Vuihoc.vn
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tổng số học sinh", value: "32", icon: <Users size={20} />, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" },
          { label: "Lớp đang dạy", value: "2", icon: <GraduationCap size={20} />, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30" },
          { label: "Tỉ lệ hoàn thành", value: "78%", icon: <TrendingUp size={20} />, color: "text-green-600 bg-green-50 dark:bg-green-900/30" },
          { label: "Huy hiệu đã cấp", value: "124", icon: <Award size={20} />, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] w-fit mb-8 shadow-inner transition-colors duration-300">
        <button 
          onClick={() => setActiveTab('students')}
          className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'students' ? "bg-white dark:bg-slate-700 shadow-lg dark:shadow-none text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
        >
          Danh sách học sinh
        </button>
        <button 
          onClick={() => setActiveTab('classes')}
          className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'classes' ? "bg-white dark:bg-slate-700 shadow-lg dark:shadow-none text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
        >
          Lớp học & Bài tập
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'stats' ? "bg-white dark:bg-slate-700 shadow-lg dark:shadow-none text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
        >
          Báo cáo chi tiết
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all ${activeTab === 'announcements' ? "bg-white dark:bg-slate-700 shadow-lg dark:shadow-none text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
        >
          Gửi thông báo
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'students' && (
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm học sinh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={20} />
                Thêm học sinh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, idx) => (
                <motion.div
                  key={student.email}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 overflow-hidden border border-blue-100 dark:border-blue-900/50">
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{student.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{student.email}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tiến độ</span>
                        <span className="text-blue-600 dark:text-blue-400">{student.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${student.progress}%` }}
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <Clock size={12} />
                        {student.lastActivity}
                      </div>
                      <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'classes' && (
          <motion.div
            key="classes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-[2.5rem] flex items-center justify-center mb-6">
              <BookOpen size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Quản lý lớp học & Bài tập</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium">Tính năng đang được phát triển để giúp bạn dễ dàng giao bài và kiểm tra kiến thức!</p>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-[2.5rem] flex items-center justify-center mb-6">
              <BarChart2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Báo cáo chi tiết</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium">Theo dõi sát sao từng bước tiến của các học sinh để có chiến lược giảng dạy phù hợp nhất.</p>
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div
            key="announcements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
                  <Bell className="text-amber-500" />
                  Gửi thông báo cho lớp {user.className}
                </h3>
              </div>
              <form onSubmit={handleSendAnnouncement} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Tiêu đề</label>
                    <input 
                      type="text" 
                      value={announcement.title}
                      onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                      placeholder="VD: Cập nhật bài tập về nhà ngày mai..."
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium dark:text-white dark:placeholder:text-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Loại tin</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['announcement', 'assignment', 'system'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAnnouncement({...announcement, type})}
                          className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                            announcement.type === type 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {type === 'announcement' ? 'Loa tin' : type === 'assignment' ? 'Bài tập' : 'Hệ thống'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Nội dung</label>
                    <textarea 
                      value={announcement.content}
                      onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                      placeholder="Lời nhắc nhở hoặc nội dung bài tập..."
                      rows={4}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium dark:text-white dark:placeholder:text-slate-600 resize-none"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSending ? <RefreshCcw className="animate-spin" /> : <Send size={20} />}
                  GỬI THÔNG BÁO NGAY
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddStudent && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative border border-slate-100 dark:border-slate-800"
            >
              <button 
                onClick={() => {
                  setShowAddStudent(false);
                  setSearchQuery("");
                }} 
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={24} className="" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Thêm học sinh</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Tìm và chọn học sinh để thêm vào lớp quản lý của bạn.</p>
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
                      onClick={() => handleAddStudent(student)}
                      className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-500 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 overflow-hidden">
                        <img src={student.avatar} className="w-full h-full object-cover" />
                      </div>
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
                  {searchQuery.length > 0 && searchQuery.length < 2 && (
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
