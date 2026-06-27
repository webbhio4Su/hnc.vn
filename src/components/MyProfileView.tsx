import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Post } from "../types";
import { 
  Trophy, 
  Star, 
  Calendar, 
  GraduationCap, 
  TrendingUp, 
  Award,
  Clock,
  ChevronRight,
  BookOpen,
  PieChart,
  Send,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  UserPlus
} from "lucide-react";

interface MyProfileViewProps {
  user: UserProfile;
  onUpdate?: (user: UserProfile) => void;
}

export default function MyProfileView({ user, onUpdate }: MyProfileViewProps) {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`posts_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newPostContent, setNewPostContent] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  const avatarSeeds = ['Felix', 'Aneka', 'Caleb', 'Cookie', 'Bear', 'Daisy', 'Leo', 'Mia', 'Oliver', 'Zoe', 'Shadow', 'Spark'];

  const handleUpdateAvatar = (newAvatar: string) => {
    if (onUpdate) {
      onUpdate({ ...user, avatar: newAvatar });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dung lượng ảnh phải dưới 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    localStorage.setItem(`posts_${user.email}`, JSON.stringify(posts));
  }, [posts, user.email]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user.email,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: newPostContent,
      timestamp: Date.now(),
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  const stats = [
    { label: "Số sao tích lũy", value: user.points?.toLocaleString() || "0", icon: <Star size={20} />, color: "text-yellow-600 bg-yellow-50" },
    { label: "Bài học đã xong", value: "12", icon: <BookOpen size={20} />, color: "text-green-600 bg-green-50" },
    { label: "Hạng thế giới", value: `#${user.points && user.points > 100000 ? "1" : "1,425"}`, icon: <Trophy size={20} />, color: "text-blue-600 bg-blue-50" },
    { label: "Tỉ lệ đúng", value: "85%", icon: <PieChart size={20} />, color: "text-purple-600 bg-purple-50" },
  ];

  const recentBadges = [
    { id: 1, name: "Chăm chỉ", icon: <Clock />, color: "bg-orange-100 text-orange-600", active: true },
    { id: 2, name: "Siêu sao", icon: <Star />, color: "bg-yellow-100 text-yellow-600", active: (user.points || 0) > 1000 },
    { id: 3, name: "Vô địch", icon: <Award />, color: "bg-blue-100 text-blue-600", active: (user.points || 0) > 5000 },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      {/* Header Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 transition-colors duration-300">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border-8 border-slate-50 dark:border-slate-950 shadow-inner overflow-hidden relative">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            <button 
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                <ImageIcon size={24} />
              </div>
            </button>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-950">
            <Star size={18} />
          </div>

          <AnimatePresence>
            {isEditingAvatar && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-2xl z-50 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {avatarSeeds.map(seed => {
                    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                    return (
                      <button
                        key={seed}
                        onClick={() => {
                          handleUpdateAvatar(url);
                          setIsEditingAvatar(false);
                        }}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                          user.avatar === url ? "border-blue-600 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={seed} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                  <label className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-900/50">
                    <UserPlus size={16} className="text-slate-400" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      handleFileUpload(e);
                      setIsEditingAvatar(false);
                    }} />
                  </label>
                </div>
                <button 
                  onClick={() => setIsEditingAvatar(false)}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl"
                >
                  Đóng
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1">Thành viên học tập</p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 truncate">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <GraduationCap size={18} />
              Lớp {user.className}
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm">
              <Calendar size={18} />
              Gia nhập từ T4/2026
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-2">
          <button className="px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
            Chia sẻ hồ sơ
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex flex-col items-center text-center group hover:border-blue-500 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color} dark:bg-opacity-20 transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Posts & Feed */}
        <div className="md:col-span-2 space-y-8">
          {/* Create Post */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Bạn đang nghĩ gì thế? Chia sẻ bài học hôm nay nào!"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[100px] dark:text-white dark:placeholder:text-slate-600"
                />
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all">
                      <Award size={20} />
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send size={18} />
                    Đăng tin
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white px-2 flex items-center gap-2">
              <TrendingUp className="text-blue-600 dark:text-blue-400" />
              Bảng tin của bạn
            </h3>
            
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{post.authorName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                          {new Date(post.timestamp).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-medium">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group">
                      <div className="p-2 rounded-xl group-hover:bg-red-50 dark:group-hover:bg-red-900/30 transition-colors">
                        <Heart size={18} />
                      </div>
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group">
                      <div className="p-2 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                        <MessageCircle size={18} />
                      </div>
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group ml-auto">
                      <div className="p-2 rounded-xl group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
                        <Share2 size={18} />
                      </div>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length === 0 && (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600 shadow-sm">
                  <BookOpen size={32} />
                </div>
                <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">Chưa có bài đăng nào</p>
                <p className="text-slate-400 dark:text-slate-600 font-medium text-xs mt-2 px-6">Hãy chia sẻ bài học đầu tiên của bạn để kết nối với mọi người!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Achievements */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white px-2 flex items-center gap-2">
              <Award className="text-blue-600 dark:text-blue-400" />
              Huy hiệu
            </h3>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              {recentBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all ${
                    !badge.active ? 'opacity-40 grayscale scale-95' : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${badge.color} dark:bg-opacity-20 flex items-center justify-center shadow-lg transform rotate-3`}>
                    {badge.icon}
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white px-2 flex items-center gap-2">
              <Clock className="text-blue-600 dark:text-blue-400" />
              Hoạt động
            </h3>
            <div className="space-y-3">
              {[
                { text: "Học bài Toán học", time: "2 giờ trước" },
                { text: "Lên hạng Bạch kim", time: "Hôm qua" },
                { text: "Thêm bạn mới", time: "3 ngày trước" },
              ].map((activity, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-default transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <div className="text-left">
                      <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{activity.text}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{activity.time}</p>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
