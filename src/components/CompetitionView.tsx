import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Clock, Users, Star, ArrowRight, Medal, Sparkles, X, Check, Brain, Timer, Swords } from "lucide-react";
import { Competition, UserProfile } from "../types";
import VersusLobby from "./VersusLobby";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface CompetitionViewProps {
  user: UserProfile;
}

const QUESTIONS_BANK = [
  { q: "Từ nào sau đây viết đúng chính tả?", options: ["Sử lý", "Xử lý", "Sử lí", "Xử lí"], a: 1 },
  { q: "Hình vuông có cạnh 5cm thì diện tích là bao nhiêu?", options: ["20cm²", "25cm", "25cm²", "10cm²"], a: 2 },
  { q: "Hành tinh nào gần Mặt Trời nhất?", options: ["Sao Kim", "Sao Hỏa", "Sao Thủy", "Trái Đất"], a: 2 },
  { q: "Năm 938 gắn liền với chiến thắng nào?", options: ["Bạch Đằng", "Chi Lăng", "Đống Đa", "Điện Biên Phủ"], a: 0 },
  { q: "Con vật nào sau đây là thú có túi?", options: ["Gấu Trúc", "Chuột Túi", "Hà Mã", "Hươu Cao Cổ"], a: 1 },
  { q: "Sông nào dài nhất thế giới?", options: ["Sông Mê Kông", "Sông Nile", "Sông Amazon", "Sông Hồng"], a: 1 },
  { q: "Số lớn nhất có 3 chữ số khác nhau là?", options: ["999", "987", "900", "978"], a: 1 },
  { q: "Bác Hồ đọc Bản Tuyên ngôn Độc lập vào ngày nào?", options: ["2/9/1945", "19/8/1945", "30/4/1975", "7/5/1954"], a: 0 },
  { q: "Trong tiếng Anh, 'Apple' nghĩa là gì?", options: ["Quả Cam", "Quả Táo", "Quả Chuối", "Quả Nho"], a: 1 },
  { q: "Đơn vị đo cường độ dòng điện là?", options: ["Vôn", "Watt", "Ampe", "Ôm"], a: 2 },
  { q: "Truyện Kiều là kiệt tác của ai?", options: ["Nguyễn Khuyến", "Nguyễn Du", "Nguyễn Trãi", "Lê Thánh Tông"], a: 1 },
  { q: "Đại dương nào rộng nhất hành tinh?", options: ["Đại Tây Dương", "Ấn Độ Dương", "Thái Bình Dương", "Bắc Băng Dương"], a: 2 },
  { q: "Thế vận hội Olympic đầu tiên diễn ra ở đâu?", options: ["Pháp", "Hy Lạp", "Mỹ", "Anh"], a: 1 },
  { q: "Phân số 1/2 bằng phân số nào?", options: ["2/3", "4/8", "3/5", "1/4"], a: 1 },
  { q: "Công thức hóa học của nước là?", options: ["H2O", "CO2", "O2", "NaCl"], a: 0 },
  { q: "Ai là người đầu tiên đặt chân lên Mặt Trăng?", options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Michael Collins"], a: 1 },
  { q: "Tác phẩm 'Lorca' của ai?", options: ["Thanh Thảo", "Nguyễn Khoa Điềm", "Xuân Quỳnh", "Hữu Thỉnh"], a: 0 },
  { q: "Tính (10 + 5) * 2 = ?", options: ["20", "30", "25", "15"], a: 1 },
  { q: "Quốc gia nào có diện tích lớn nhất thế giới?", options: ["Trung Quốc", "Canada", "Nga", "Mỹ"], a: 2 },
  { q: "Con vật nào được mệnh danh là 'Chúa tể sơn lâm'?", options: ["Sư tử", "Hổ", "Báo", "Gấu"], a: 1 },
];

const BOT_NAMES = [
  'Nguyễn Minh Anh', 'Trần Bích Phương', 'Lê Hoàng Nam', 'Phạm Thu Thủy', 'Đặng Quốc Bảo',
  'Vũ Thùy Linh', 'Hoàng Văn Đức', 'Mai Tuyết Nhi', 'Ngô Quang Huy', 'Bùi Gia Bảo',
  'Trịnh Công Sơn', 'Lương Thế Vinh', 'Nguyễn Hiền', 'Võ Thị Sáu', 'Phan Bội Châu'
];

const GENERATED_BOTS: UserProfile[] = Array.from({ length: 1200 }).map((_, i) => {
  const name = i < BOT_NAMES.length ? BOT_NAMES[i] : `Thành viên ${2000 + i}`;
  const points = Math.max(100, Math.floor(15000 - i * 12 + Math.random() * 80));
  return {
    uid: `bot_gen_${i}`,
    name,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=ArtBot${i}`,
    points,
    role: 'student',
    email: '',
    className: `5A${(i % 5) + 1}`,
    gender: i % 2 === 0 ? 'male' : 'female'
  } as UserProfile;
});

const MOCK_COMPETITIONS: Competition[] = [
  { id: '1', title: 'Thách thức Toán học Tuần 2', participants: 1240, timeLeft: 'Mở sau 2 ngày', reward: 'Huy hiệu Hiệp sĩ Toán học' },
  { id: '2', title: 'Siêu trí tuệ Tiếng Việt', participants: 850, timeLeft: 'Mở sau 1 ngày', reward: 'Thẻ bài AI đặc biệt' },
  { id: '3', title: 'Nhà thám hiểm Lịch sử', participants: 2100, timeLeft: 'Mở sau 14 ngày', reward: 'Cup Vàng Lịch sử' },
];

export default function CompetitionView({ user }: CompetitionViewProps) {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [activeTab, setActiveTab] = useState<'arena' | 'versus'>('arena');
  const [currentQuestions, setCurrentQuestions] = useState(QUESTIONS_BANK);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isWrong, setIsWrong] = useState(false);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loadingLB, setLoadingLB] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("points", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      
      // Combine with bots and sort
      const combined = [...users, ...GENERATED_BOTS]
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .filter((v, i, a) => a.findIndex(t => t.uid === v.uid) === i) // Deduplicate
        .slice(0, 100);

      setLeaderboard(combined);
      setLoadingLB(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNext(0);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStart = () => {
    // Shuffle questions
    const shuffled = [...QUESTIONS_BANK].sort(() => Math.random() - 0.5).slice(0, 6);
    setCurrentQuestions(shuffled);
    setGameState('playing');
    setCurrentQ(0);
    setScore(0);
    setTimeLeft(15);
  };

  const handleAnswer = (idx: number) => {
    let bonusScore = 0;
    if (idx === currentQuestions[currentQ].a) {
      bonusScore = 100 + timeLeft * 10;
      setScore(s => s + bonusScore);
      handleNext(bonusScore);
    } else {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        handleNext(0);
      }, 500);
    }
  };

  const handleNext = async (addedPoints: number) => {
    if (currentQ < currentQuestions.length - 1) {
      setCurrentQ(c => c + 1);
      setTimeLeft(15);
    } else {
      setGameState('result');
      // Update real points in Firebase when finishing
      if (user?.uid) {
        try {
          const userRef = doc(db, 'users', user.uid);
          // Use current score + newly added points
          // to ensure the last correct answer is included
          // We apply the points we just added to the state
          const pointsToIncrement = score + addedPoints;
          
          await updateDoc(userRef, {
            points: increment(pointsToIncrement),
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error updating score:", error);
        }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-12">
      {gameState === 'lobby' && (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit mx-auto mb-8 shadow-inner">
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'arena' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Trophy size={18} />
            ĐẤU TRƯỜNG CHUNG
          </button>
          <button
            onClick={() => setActiveTab('versus')}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === 'versus' ? "bg-white dark:bg-slate-700 shadow-sm text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Swords size={18} />
            THÁCH ĐẤU 1V1
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'lobby' ? (
          activeTab === 'arena' ? (
            <motion.div 
              key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-12"
          >
            {/* Hero Banner */}
            <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl dark:shadow-none border border-white/5 dark:border-white/10">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30 text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles size={14} />
                  Đang diễn ra
                </div>
                <h2 className="text-4xl font-black mb-4 leading-tight">Đấu trường Tri thức<br />Mùa xuân 2026</h2>
                <p className="text-slate-400 text-lg font-medium max-w-sm mb-8">Tranh tài cùng hàng ngàn bạn học trên toàn quốc. Khẳng định đẳng cấp học tập của bạn!</p>
                <button 
                  onClick={handleStart}
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-3xl shadow-xl shadow-blue-500/20 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                  THAM GIA NGAY
                </button>
              </div>
              <div className="w-full md:w-1/3 relative">
                <Trophy size={200} className="text-yellow-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="relative p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <Medal className="text-yellow-500" size={32} />
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Phần thưởng Top 1</p>
                      <p className="font-bold text-lg">Laptop Học Tập AI</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-white/10 rounded-full">
                      <div className="h-full w-3/4 bg-yellow-500 rounded-full" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tiến trình mùa giải: 75%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 px-2">
                  <Trophy className="text-yellow-600 dark:text-yellow-500" size={24} />
                  Cuộc thi sắp tới
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_COMPETITIONS.map((comp) => (
                    <div key={comp.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-blue-500 transition-all">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-4">{comp.title}</h4>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                          <Users size={16} />
                          <span>{comp.participants} người tham gia</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-bold">
                          <Clock size={16} />
                          <span>Còn {comp.timeLeft}</span>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-slate-900 dark:bg-slate-800 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                        Đăng ký ngay
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 px-2">
                  <Medal className="text-blue-600 dark:text-blue-400" size={24} />
                  Bảng xếp hạng
                </h3>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[400px]">
                  {loadingLB ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {leaderboard.map((lbUser, index) => (
                          <div key={lbUser.uid || index} className="flex items-center gap-4 group">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                              index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                              index === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' :
                              index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                              'text-slate-400 bg-slate-50 dark:bg-slate-800/50'
                            }`}>
                              {index + 1}
                            </div>
                            <img 
                              src={lbUser.avatar} 
                              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 shrink-0" 
                              alt={lbUser.name}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{lbUser.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lbUser.points?.toLocaleString() || 0} sao</p>
                            </div>
                            {lbUser.uid === user.uid && (
                              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg shrink-0">BẠN</div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Show current user rank if not in top 100 */}
                      {!leaderboard.find(u => u.uid === user.uid) && (
                        <div className="p-6 pt-0 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                          <div className="mt-4 flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-blue-100 dark:border-blue-900/30">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white bg-blue-600 shrink-0 shadow-lg shadow-blue-200 dark:shadow-none">
                              {Math.floor(Math.random() * 50 + 101)}+
                            </div>
                            <img src={user.avatar} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.name}</p>
                              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">{user.points?.toLocaleString() || 0} sao (Hạng của bạn)</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          ) : (
            <motion.div 
              key="versus"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <VersusLobby user={user} />
            </motion.div>
          )
        ) : gameState === 'playing' ? (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Câu hỏi {currentQ + 1}/{currentQuestions.length}</p>
                <div className="flex gap-1">
                  {currentQuestions.map((_, i) => (
                    <div key={i} className={`h-1.5 w-12 rounded-full transition-all ${i < currentQ ? 'bg-blue-600' : i === currentQ ? 'bg-blue-400' : 'bg-slate-100 dark:bg-slate-800'}`} />
                  ))}
                </div>
              </div>
              <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black ${timeLeft < 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                <Timer size={20} />
                {timeLeft}s
              </div>
            </div>

            <div className={`transition-transform`}>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 leading-relaxed">
                {currentQuestions[currentQ].q}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white rounded-[2rem] border-2 border-transparent hover:border-blue-400 text-left font-bold transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white shadow-sm font-black">
                        {String.fromCharCode(65 + i)}
                      </div>
                      {opt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-1000" style={{ width: `${(timeLeft / 15) * 100}%` }} />
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-32 h-32 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transform rotate-12">
              <Trophy size={64} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">CHÚC MỪNG BẠN!</h3>
            <p className="text-slate-400 font-bold mb-10 uppercase tracking-widest text-xs">Bạn đã hoàn thành thử thách</p>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 mb-10">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Điểm đạt được</p>
                  <p className="text-4xl font-black text-blue-600">+{score}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xếp hạng</p>
                  <p className="text-4xl font-black text-green-600">Top 5%</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Số sao hiện tại: {(user?.points || 0).toLocaleString()}
                  </div>
                  <ArrowRight size={14} className="text-slate-300" />
                  <div className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    Mới: {((user?.points || 0) + score).toLocaleString()} sao
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleStart}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 transition-all"
              >
                THI LẠI
              </button>
              <button 
                onClick={() => setGameState('lobby')}
                className="w-full py-5 bg-slate-900 dark:bg-black text-white font-black rounded-2xl hover:scale-105 transition-all"
              >
                VỀ ĐẤU TRƯỜNG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
