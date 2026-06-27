import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Swords, Trophy, Loader2, Play, Check, X, ShieldAlert, Sparkles, Brain, Timer } from 'lucide-react';
import { UserProfile, VersusMatch } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, serverTimestamp, deleteDoc, getDoc } from 'firebase/firestore';

interface VersusLobbyProps {
  user: UserProfile;
}

const VERSUS_QUESTIONS = [
  { q: "Số chẵn nhỏ nhất có 2 chữ số là?", options: ["10", "12", "11", "00"], a: 0 },
  { q: "Ai là tác giả của 'Lịch triều hiến chương loại chí'?", options: ["Phan Huy Chú", "Lê Quý Đôn", "Nguyễn Trãi", "Ngô Sĩ Liên"], a: 0 },
  { q: "Trong tiếng Anh, 'Blue' là màu gì?", options: ["Vàng", "Xanh lá", "Xanh dương", "Đỏ"], a: 2 },
  { q: "Ngôi sao nào là ngôi sao trung tâm của Hệ Mặt Trời?", options: ["Mặt Trăng", "Mặt Trời", "Sao Mộc", "Sao Kim"], a: 1 },
  { q: "Phân số 3/4 đổi ra số thập phân là bao nhiêu?", options: ["0.75", "0.5", "0.25", "0.8"], a: 0 },
];

export default function VersusLobby({ user }: VersusLobbyProps) {
  const [matches, setMatches] = useState<VersusMatch[]>([]);
  const [currentMatch, setCurrentMatch] = useState<VersusMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'matches'), where('status', '!=', 'finished'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VersusMatch));
      setMatches(list);
      
      // If user is in a match, update their currentMatch state
      const myMatch = list.find(m => m.players[user.uid!] !== undefined);
      if (myMatch) {
          setCurrentMatch(myMatch);
          if (myMatch.status === 'playing' && !playing && !finished) {
              setPlaying(true);
          }
      } else {
          setCurrentMatch(null);
          setPlaying(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid, playing, finished]);

  useEffect(() => {
    let timer: any;
    if (playing && timeLeft > 0 && !finished) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && playing && !finished) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [playing, timeLeft, finished]);

  const createMatch = async () => {
    try {
      await addDoc(collection(db, 'matches'), {
        players: {
          [user.uid!]: {
            name: user.name,
            avatar: user.avatar,
            score: 0,
            joined: true
          }
        },
        status: 'waiting',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const joinMatch = async (matchId: string) => {
    try {
      const matchRef = doc(db, 'matches', matchId);
      const matchDoc = await getDoc(matchRef);
      if (matchDoc.exists()) {
        const data = matchDoc.data() as VersusMatch;
        await updateDoc(matchRef, {
          [`players.${user.uid!}`]: {
            name: user.name,
            avatar: user.avatar,
            score: 0,
            joined: true
          },
          status: 'playing'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswer = (idx: number) => {
    if (idx === VERSUS_QUESTIONS[currentQ].a) {
      setScore(s => s + 100 + timeLeft * 5);
    }
    handleNext();
  };

  const handleNext = async () => {
    if (currentQ < VERSUS_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setTimeLeft(10);
    } else {
      setFinished(true);
      setPlaying(false);
      // Update score in match doc
      if (currentMatch) {
         const matchRef = doc(db, 'matches', currentMatch.id);
         await updateDoc(matchRef, {
           [`players.${user.uid!}.score`]: score
         });
         
         // Check if both Finished (in a real app we'd wait for both)
         // For now just mark as finished if we are the second one or something
         // Simple logic: if other player has score > 0, set status to finished
         const players = Object.values(currentMatch.players);
         if (players.length > 1) {
             const otherPlayer = players.find(p => p.name !== user.name);
             if (otherPlayer && otherPlayer.score >= 0) {
                 // Wait a bit to let other finish or just close it
                 // Let's just keep it simple
             }
         }
      }
    }
  };

  const leaveMatch = async () => {
      if (currentMatch) {
          if (currentMatch.status === 'waiting') {
              await deleteDoc(doc(db, 'matches', currentMatch.id));
          }
          setCurrentMatch(null);
          setFinished(false);
          setCurrentQ(0);
          setScore(0);
      }
  };

  if (playing) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
             <img src={user.avatar} className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-500" />
             <p className="font-black text-blue-600">BẠN: {score}</p>
          </div>
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black ${timeLeft < 3 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
            <Timer size={20} />
            {timeLeft}s
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Câu hỏi {currentQ + 1}/{VERSUS_QUESTIONS.length}</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{VERSUS_QUESTIONS[currentQ].q}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VERSUS_QUESTIONS[currentQ].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 hover:text-white rounded-[2rem] border-2 border-transparent hover:border-blue-400 text-left font-bold transition-all hover:scale-[1.02] active:scale-95 group"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Trophy size={48} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">HOÀN THÀNH!</h3>
        <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">Số điểm của bạn: {score}</p>
        
        <div className="space-y-4 mb-8">
           {currentMatch && Object.entries(currentMatch.players).map(([uid, p]) => (
               <div key={uid} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                   <div className="flex items-center gap-3">
                       <img src={p.avatar} className="w-10 h-10 rounded-xl" />
                       <p className="font-bold">{p.name}</p>
                   </div>
                   <p className="font-black text-blue-600">{p.score} Điểm</p>
               </div>
           ))}
        </div>

        <button 
          onClick={leaveMatch}
          className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all"
        >
          XÁC NHẬN & RỜI PHÒNG
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Swords className="text-red-500" size={32} />
            Đấu Trường 1v1
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Thách đấu bạn bè và giành lấy Hncoi!</p>
        </div>
        <button 
          onClick={createMatch}
          disabled={!!currentMatch}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          TẠO PHÒNG MỚI
        </button>
      </div>

      {currentMatch && currentMatch.status === 'waiting' && (
        <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
              <Swords size={120} />
           </div>
           <div className="relative z-10">
              <Loader2 className="animate-spin mx-auto mb-6 opacity-50" size={48} />
              <h3 className="text-3xl font-black mb-2">Đang chờ đối thủ...</h3>
              <p className="text-blue-100 font-bold mb-8">Chia sẻ mã phòng hoặc đợi người khác tham gia</p>
              <button 
                onClick={leaveMatch}
                className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl font-black transition-all"
              >
                HỦY PHÒNG
              </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.filter(m => m.status === 'waiting' && !m.players[user.uid!]).map(match => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none group hover:border-blue-500 transition-all"
          >
            <div className="flex items-center gap-4 mb-6">
               <div className="relative">
                  <img src={Object.values(match.players)[0].avatar} className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-white dark:border-slate-800 shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900" />
               </div>
               <div>
                  <p className="font-black text-slate-900 dark:text-white text-lg">{Object.values(match.players)[0].name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Đang chờ</p>
               </div>
            </div>
            <button 
              onClick={() => joinMatch(match.id)}
              className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600"
            >
               THÁCH ĐẤU
               <Play size={18} />
            </button>
          </motion.div>
        ))}
        {matches.filter(m => m.status === 'waiting' && !m.players[user.uid!]).length === 0 && !currentMatch && (
           <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Users className="mx-auto mb-4 text-slate-300" size={48} />
              <p className="text-slate-400 font-bold">Hiện không có phòng nào đang chờ.</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Hãy tạo phòng và mời bạn bè!</p>
           </div>
        )}
      </div>
    </div>
  );
}
