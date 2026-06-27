import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Banknote, Send, ArrowRight, Zap, Target, Search, X, Loader2, Coins, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment, serverTimestamp, collection, query, where, getDocs, limit, writeBatch, orderBy, onSnapshot } from 'firebase/firestore';

interface HncoiBankProps {
  user: UserProfile;
}

export default function HncoiBank({ user }: HncoiBankProps) {
  const [clicks, setClicks] = useState(0);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [recipient, setRecipient] = useState<UserProfile | null>(null);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [transferStatus, setTransferStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    if (!user || !user.uid) return;

    const q = query(
      collection(db, 'transactions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.senderId === user.uid || data.recipientId === user.uid) {
          list.push({ id: doc.id, ...data });
        }
      });
      setTransactions(list);
      setLoadingTransactions(false);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setLoadingTransactions(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetTransferState = () => {
    setShowTransfer(false);
    setTransferAmount('');
    setRecipient(null);
    setSearchEmail('');
    setTransferStatus('idle');
    setError('');
  };

  const handleBanknoteClick = async () => {
    const nextClicks = clicks + 1;
    if (nextClicks >= 100) {
      setClicks(0);
      try {
        const userRef = doc(db, 'users', user.uid!);
        const batch = writeBatch(db);
        batch.update(userRef, {
          hncoi: increment(1),
          updatedAt: serverTimestamp()
        });

        // Add transaction log
        const txRef = doc(collection(db, 'transactions'));
        batch.set(txRef, {
          senderId: 'system',
          senderName: 'Vòng quay / Đào Hncoi',
          recipientId: user.uid,
          recipientName: user.name,
          recipientAvatar: user.avatar || '',
          amount: 1,
          type: 'mining',
          timestamp: serverTimestamp()
        });

        await batch.commit();
      } catch (err) {
        console.error("Failed to earn Hncoi:", err);
      }
    } else {
      setClicks(nextClicks);
    }
  };

  const findRecipient = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    setError('');
    try {
      const q = query(collection(db, 'users'), where('email', '==', searchEmail.trim().toLowerCase()), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setError('Không tìm thấy người dùng này!');
        setRecipient(null);
      } else {
        const data = snapshot.docs[0].data() as UserProfile;
        if (data.email === user.email) {
          setError('Bạn không thể gửi tiền cho chính mình!');
          setRecipient(null);
        } else {
          setRecipient(data);
        }
      }
    } catch (err) {
      setError('Lỗi khi tìm kiếm người dùng.');
    } finally {
      setSearching(false);
    }
  };

  const handleTransfer = async () => {
    const amount = parseInt(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Vui lòng nhập số lượng Hncoi hợp lệ!');
      return;
    }
    if (amount > (user.hncoi || 0)) {
      setError('Số dư không đủ Hncoi!');
      return;
    }

    setSending(true);
    setError('');
    try {
      let targetRecipient = recipient;

      if (!targetRecipient) {
        if (!searchEmail.trim()) {
          setError('Vui lòng nhập email người nhận!');
          setSending(false);
          return;
        }

        const q = query(collection(db, 'users'), where('email', '==', searchEmail.trim().toLowerCase()), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setError('Không tìm thấy tài khoản với email này!');
          setSending(false);
          return;
        }

        const data = snapshot.docs[0].data() as UserProfile;
        if (data.email === user.email) {
          setError('Bạn không thể gửi tiền cho chính mình!');
          setSending(false);
          return;
        }
        targetRecipient = data;
        setRecipient(data);
      }

      if (!targetRecipient) {
        setError('Hãy điền email người nhận hợp lệ!');
        setSending(false);
        return;
      }

      const senderRef = doc(db, 'users', user.uid!);
      const recipientRef = doc(db, 'users', targetRecipient.uid!);

      const batch = writeBatch(db);
      batch.update(senderRef, {
        hncoi: increment(-amount),
        updatedAt: serverTimestamp()
      });
      batch.update(recipientRef, {
        hncoi: increment(amount),
        updatedAt: serverTimestamp()
      });

      // 1. Log transaction in transactions collection
      const txRef = doc(collection(db, 'transactions'));
      batch.set(txRef, {
        senderId: user.uid,
        senderName: user.name,
        senderAvatar: user.avatar || '',
        recipientId: targetRecipient.uid,
        recipientName: targetRecipient.name,
        recipientAvatar: targetRecipient.avatar || '',
        amount: amount,
        type: 'transfer',
        timestamp: serverTimestamp()
      });

      // 2. Add real-time notification for the recipient
      const notiRef = doc(collection(db, 'notifications'));
      batch.set(notiRef, {
        title: 'Nhận được Hncoi 💸',
        content: `Bạn đã nhận được ${amount.toLocaleString()} Hncoi từ ${user.name} (${user.email}).`,
        type: 'system',
        senderId: user.uid,
        senderName: user.name,
        recipientId: targetRecipient.uid,
        timestamp: serverTimestamp(),
        isRead: false
      });

      // 3. Add transactional system notification for the sender
      const senderNotiRef = doc(collection(db, 'notifications'));
      batch.set(senderNotiRef, {
        title: 'Gửi Hncoi thành công ✅',
        content: `Bạn đã chuyển thành công ${amount.toLocaleString()} Hncoi cho ${targetRecipient.name} (${targetRecipient.email}).`,
        type: 'system',
        senderId: 'system',
        senderName: 'Ngân hàng Hncoi',
        recipientId: user.uid,
        timestamp: serverTimestamp(),
        isRead: false
      });

      await batch.commit();
      setTransferStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Giao dịch bị từ chối hoặc lỗi bảo mật.');
      setTransferStatus('failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Banknote size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Coins size={20} className="text-yellow-100" />
            <p className="text-yellow-100 font-bold uppercase tracking-widest text-[10px]">Tài khoản Hncoi</p>
          </div>
          <h2 className="text-5xl font-black mb-6">{(user.hncoi || 0).toLocaleString()} <span className="text-2xl opacity-70">Hncoi</span></h2>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowTransfer(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-95"
            >
              <Send size={18} />
              CHUYỂN KHOẢN
            </button>
            <div className="bg-black/10 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black">
              <Zap size={18} className="text-yellow-200" />
              TOP 1%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <Target size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Đào Hncoi Miễn Phí</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Nhấn vào tờ tiền vàng 100 lần để nhận ngay 1 Hncoi vào tài khoản.</p>
          
          <div className="relative mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBanknoteClick}
              className="w-32 h-32 bg-yellow-400 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-yellow-200 dark:shadow-none hover:rotate-6 transition-all group"
            >
              <Banknote size={64} className="group-hover:scale-110 transition-transform" />
            </motion.button>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border-2 border-yellow-400 px-4 py-1 rounded-full text-xs font-black text-yellow-600 dark:text-yellow-400 shadow-md">
              {clicks} / 100
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${clicks}%` }}
              className="h-full bg-yellow-400"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Lịch sử giao dịch</h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-1">
            {loadingTransactions ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                <p className="text-xs text-slate-400 font-bold">Đang tải lịch sử...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-400">Không có giao dịch gần đây</p>
              </div>
            ) : (
              transactions.map((tx) => {
                const isSent = tx.senderId === user.uid;
                const isMining = tx.type === 'mining';
                
                let title = '';
                let amountStr = '';
                let amountClass = '';
                let iconBg = '';
                let avatarUrl = '';

                if (isMining) {
                  title = 'Đào Hncoi miễn phí';
                  amountStr = `+${tx.amount.toLocaleString()}`;
                  amountClass = 'text-green-600 dark:text-green-400 font-black';
                  iconBg = 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400';
                } else if (tx.type === 'admin_deduct') {
                  title = 'Admin thu hồi Hncoi 📉';
                  amountStr = `-${tx.amount.toLocaleString()}`;
                  amountClass = 'text-red-600 dark:text-red-400 font-black';
                  iconBg = 'bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400';
                } else if (tx.type === 'admin_grant') {
                  title = 'Nhận Hncoi từ Admin 👑';
                  amountStr = `+${tx.amount.toLocaleString()}`;
                  amountClass = 'text-emerald-600 dark:text-emerald-400 font-black';
                  iconBg = 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
                } else if (isSent) {
                  title = `Chuyển tới ${tx.recipientName}`;
                  amountStr = `-${tx.amount.toLocaleString()}`;
                  amountClass = 'text-red-600 dark:text-red-400 font-black';
                  iconBg = 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400';
                  avatarUrl = tx.recipientAvatar;
                } else {
                  title = `Nhận từ ${tx.senderName}`;
                  amountStr = `+${tx.amount.toLocaleString()}`;
                  amountClass = 'text-green-600 dark:text-green-400 font-black';
                  iconBg = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
                  avatarUrl = tx.senderAvatar;
                }

                const dateStr = tx.timestamp?.toDate 
                  ? tx.timestamp.toDate().toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  : 'Đang xử lý';

                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-xl bg-white border border-slate-100 object-cover shrink-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                          {isMining ? <Zap size={20} /> : <Coins size={20} />}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">{dateStr}</p>
                      </div>
                    </div>
                    <p className={`text-md ${amountClass}`}>{amountStr}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTransfer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetTransferState}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Chuyển khoản Hncoi</h3>
                    <p className="text-slate-400 text-sm font-bold opacity-70">Gửi tiền cho bạn bè cực nhanh</p>
                  </div>
                  <button onClick={resetTransferState} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                {transferStatus === 'success' ? (
                  <div className="text-center py-4 space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100 dark:shadow-none animate-bounce">
                      <Check size={40} className="stroke-[3]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white">Gửi Thành Công!</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Đã chuyển thành công <span className="font-extrabold text-[#f1c40f]">{parseInt(transferAmount).toLocaleString()} Hncoi</span> tới <span className="font-extrabold text-blue-600 dark:text-blue-400">{recipient?.name}</span>.
                      </p>
                    </div>
                    {recipient && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl flex items-center gap-4 border border-slate-100 dark:border-slate-850 max-w-sm mx-auto">
                        <img src={recipient.avatar} className="w-12 h-12 rounded-2xl bg-white border border-slate-100" />
                        <div className="text-left">
                          <p className="font-black text-slate-900 dark:text-white">{recipient.name}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{recipient.className}</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={resetTransferState}
                      className="w-full py-4.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 hover:dark:bg-slate-705 text-white font-black rounded-2xl transition-all"
                    >
                      HOÀN TẤT GIAO DỊCH
                    </button>
                  </div>
                ) : transferStatus === 'failed' ? (
                  <div className="text-center py-4 space-y-6">
                    <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-100 dark:shadow-none">
                      <X size={40} className="stroke-[3]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white">Giao Dịch Thất Bại</h4>
                      <p className="text-rose-500 text-sm font-bold px-4">{error || 'Có lỗi xảy ra trong quá trình chuyển tiền.'}</p>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={() => setTransferStatus('idle')}
                        className="flex-1 py-4.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black rounded-2xl transition-all"
                      >
                        THỬ LẠI
                      </button>
                      <button
                        onClick={resetTransferState}
                        className="flex-1 py-4.5 bg-slate-900 dark:bg-slate-800 text-white font-black rounded-2xl transition-all"
                      >
                        ĐÓNG
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Địa chỉ Email người nhận</label>
                      <div className="relative">
                        <input 
                          type="email"
                          placeholder="example@gmail.com"
                          value={searchEmail}
                          onChange={e => {
                            setSearchEmail(e.target.value);
                            if (recipient) setRecipient(null);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-4 py-4 outline-none font-bold text-slate-900 dark:text-white transition-all pl-12"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <button 
                          onClick={findRecipient}
                          disabled={searching || !searchEmail}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
                        >
                          {searching ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                        </button>
                      </div>
                    </div>

                    {recipient && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4 animate-fade-in"
                      >
                        <img src={recipient.avatar} className="w-12 h-12 rounded-xl bg-white border border-emerald-100" />
                        <div>
                          <p className="font-black text-slate-900 dark:text-white">{recipient.name} ✓</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Lớp {recipient.className || "Chưa rõ"}</p>
                        </div>
                      </motion.div>
                    )}

                    {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Số lượng Hncoi muốn gửi</label>
                      <div className="relative">
                        <input 
                          type="number"
                          placeholder="0"
                          value={transferAmount}
                          onChange={e => setTransferAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-4 py-4 outline-none font-black text-3xl text-slate-900 dark:text-white transition-all text-center"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">Hncoi</div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold mt-2 text-center">Số dư hiện tại: {(user.hncoi || 0).toLocaleString()}</p>
                    </div>

                    <button
                      disabled={!searchEmail || !transferAmount || sending}
                      onClick={handleTransfer}
                      className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-3xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                    >
                      {sending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                      XÁC NHẬN CHUYỂN KHOẢN
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
