import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, MessageSquare, Search, Send, X, Circle, MoreVertical, UserPlus, GraduationCap, Calendar, Star, ChevronLeft, Check, Sparkles, Loader2 } from "lucide-react";
import { Friend, Message, UserProfile } from "../types";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy, 
  limit, 
  setDoc, 
  doc, 
  deleteDoc,
  getDocs 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

interface SocialViewProps {
  accounts: UserProfile[]; // Now treated as all available users to connect with
  user: UserProfile;
}

export default function SocialView({ accounts, user }: SocialViewProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'chat' | 'profile' | 'add'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Friends
  useEffect(() => {
    if (!user.uid) return;
    const q = query(collection(db, "users", user.uid, "friends"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const friendsList: Friend[] = [];
      snapshot.forEach((doc) => {
        friendsList.push({ id: doc.id, ...doc.data() } as Friend);
      });
      setFriends(friendsList);
      setLoadingFriends(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/friends`));

    return () => unsubscribe();
  }, [user.uid]);

  // Fetch Messages for selected conversation
  useEffect(() => {
    if (!user.uid || !selectedFriend) {
      setChatMessages([]);
      return;
    }

    // Simple one-on-one chat logic: unique ID based on sorted UIDs
    const chatId = [user.uid, selectedFriend.id].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setChatMessages(msgs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, `chats/${chatId}/messages`));

    return () => unsubscribe();
  }, [user.uid, selectedFriend]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, selectedFriend, activeTab]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !user.uid) return;

    const chatId = [user.uid, selectedFriend.id].sort().join("_");
    const content = newMessage;
    setNewMessage("");

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: user.uid,
        content: content,
        timestamp: Date.now() // For sorting, using performance.now or Date.now is faster than serverTimestamp for immediate UI
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `chats/${chatId}/messages`);
    }
  };

  const handleAddFriend = async (acc: UserProfile) => {
    if (!user.uid || !acc.uid) return;
    
    if (friends.some(f => f.id === acc.uid)) return;

    const newFriend: Partial<Friend> = {
      name: acc.name,
      avatar: acc.avatar,
      status: 'online',
      className: acc.className || '5A1'
    };

    try {
      await setDoc(doc(db, "users", user.uid, "friends", acc.uid), newFriend);
      // Also add current user to their friends list for mutual connection
      await setDoc(doc(db, "users", acc.uid, "friends", user.uid), {
        name: user.name,
        avatar: user.avatar,
        status: 'online',
        className: user.className || '5A1'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/friends/${acc.uid}`);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user.uid) return;
    if (window.confirm("Bạn có chắc chắn muốn hủy kết nối với người này?")) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "friends", friendId));
        setSelectedFriend(null);
        setActiveTab('friends');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/friends/${friendId}`);
      }
    }
  };

  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStranger = accounts.filter(acc => 
    acc.uid !== user.uid && 
    !friends.some(f => f.id === acc.uid) &&
    acc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto h-[70vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 flex overflow-hidden transition-all duration-300">
      {/* Sidebar Social */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/30 shrink-0 select-none">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">KẾT NỐI</h2>
            <button 
              onClick={() => setActiveTab('add')}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              <UserPlus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bạn bè..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold dark:text-white dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {filteredFriends.length === 0 && (
            <div className="py-20 text-center px-6">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Users size={24} />
              </div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                {searchQuery ? "Không tìm thấy bạn" : "Chưa có bạn bè nào. Hãy kết bạn ngay!"}
              </p>
            </div>
          )}
          
          {filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => {
                setSelectedFriend(friend);
                setActiveTab('chat');
              }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                selectedFriend?.id === friend.id 
                  ? "bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 ring-4 ring-blue-500/5 group" 
                  : "hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="relative" onClick={(e) => {
                e.stopPropagation();
                setSelectedFriend(friend);
                setActiveTab('profile');
              }}>
                <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-[1.25rem] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-800 shadow-sm" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${friend.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`} />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-black text-sm truncate ${selectedFriend?.id === friend.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-300'}`}>{friend.name}</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Lớp {friend.className}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {activeTab === 'chat' && selectedFriend ? (
          <>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                  <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-full h-full object-cover" />
                </button>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm">{selectedFriend.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedFriend.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {selectedFriend.status === 'online' ? 'Đang bật' : 'Ngoại tuyến'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/20 dark:bg-slate-950/20 custom-scrollbar">
              {chatMessages.map((msg) => (
                <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   key={msg.id} 
                   className={`flex gap-3 ${msg.senderId === user.uid ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.senderId !== user.uid && (
                    <img src={selectedFriend.avatar} className="w-8 h-8 rounded-lg mt-1 shrink-0" alt="Avatar" />
                  )}
                  <div className={`max-w-[80%] px-5 py-3.5 rounded-[1.75rem] shadow-sm ${
                    msg.senderId === user.uid 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-slate-200/20'
                  }`}>
                    <p className="text-[13px] font-bold leading-relaxed">{msg.content}</p>
                    <div className={`flex items-center gap-1.5 mt-1.5 opacity-40 font-black text-[9px] ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                      {msg.senderId === user.uid && <Check size={10} />}
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30 select-none">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare size={40} className="text-slate-400" />
                  </div>
                  <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500 mb-2">Bắt đầu trò chuyện</h4>
                  <p className="text-xs font-bold text-slate-400">Hãy là người đầu tiên nhắn tin cho bạn ấy nhé!</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1 pl-6 pr-4 py-3 bg-transparent border-none text-sm outline-none font-bold dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : activeTab === 'add' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 p-10 bg-slate-50/50 dark:bg-slate-900 custom-scrollbar overflow-y-auto"
          >
            <div className="flex items-center gap-4 mb-10">
              <button 
                onClick={() => setActiveTab('friends')}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none text-slate-400 hover:text-blue-600 transition-colors"
                >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">KẾT BẠN MỚI</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredStranger.length > 0 && (
                <div className="col-span-full mb-2">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Check size={12} className="text-green-500" />
                    Người dùng trên hệ thống
                  </h4>
                </div>
              )}
              {filteredStranger.map((acc) => (
                <div key={acc.uid || acc.email} className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-100/50 dark:shadow-none group hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={acc.avatar} 
                      className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 ring-4 ring-slate-50 dark:ring-slate-800 shadow-sm" 
                    />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{acc.name}</p>
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded flex items-center gap-1">
                        <GraduationCap size={10} />
                        Lớp {acc.className}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddFriend(acc)}
                    className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-900 dark:bg-black text-white hover:bg-blue-600 shadow-xl shadow-slate-200 dark:shadow-none"
                  >
                    <UserPlus size={16} />
                    THÊM BẠN
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <Sparkles size={28} className="text-yellow-400" />
                  Tìm bạn bè AI
                </h4>
                <p className="text-blue-100 font-bold mb-6 text-sm">Gợi ý bạn học có cùng sở thích học tập với bạn</p>
                <button className="px-8 py-3.5 bg-white text-blue-600 font-black text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-800/20 hover:scale-105 active:scale-95 transition-all">
                  QUÉT NGAY
                </button>
              </div>
              <Users size={120} className="absolute -bottom-8 -right-8 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
          </motion.div>
        ) : activeTab === 'profile' && selectedFriend ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col overflow-y-auto dark:bg-slate-900 custom-scrollbar"
          >
            <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative shrink-0">
              <button 
                onClick={() => setActiveTab('friends')}
                className="absolute top-6 left-6 p-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="px-10 pb-10">
              <div className="relative -mt-16 mb-8 flex items-end gap-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-800 p-1 border-8 border-white dark:border-slate-900 shadow-2xl overflow-hidden aspect-square">
                  <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-full h-full object-cover" />
                </div>
                <div className="pb-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{selectedFriend.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Học sinh giỏi Lớp {selectedFriend.className}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2 text-slate-400">
                    <Calendar size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tham gia</span>
                  </div>
                  <p className="font-black text-slate-800 dark:text-slate-200">2026</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2 text-slate-400">
                    <Star size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Xếp hạng</span>
                  </div>
                  <p className="font-black text-slate-800 dark:text-slate-200">Kim cương</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-widest"
                  >
                    <MessageSquare size={20} />
                    TRÒ CHUYỆN
                  </button>
                  <button className="flex-1 py-4 bg-slate-900 dark:bg-black text-white font-black rounded-[1.5rem] shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-widest">
                    <Check size={20} />
                    BẠN BÈ
                  </button>
                </div>
                
                <button 
                  onClick={() => handleRemoveFriend(selectedFriend.id)}
                  className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all text-[11px] uppercase tracking-widest mt-2"
                >
                  <X size={16} />
                  HỦY KẾT NỐI VỚI NGƯỜI NÀY
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 dark:bg-slate-900 bg-slate-50/20">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-100 dark:shadow-none transform -rotate-6">
              <Users size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">CỘNG ĐỒNG HỌC TỐT</h3>
            <p className="text-slate-400 dark:text-slate-500 max-w-xs font-bold leading-relaxed text-sm">
              Tìm kiếm bạn học, kết bạn và cùng nhau chinh phục những bài toán khó!
            </p>
            <button 
              onClick={() => setActiveTab('add')}
              className="mt-10 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all text-xs tracking-[0.2em]"
            >
              KẾT BẠN NGAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
