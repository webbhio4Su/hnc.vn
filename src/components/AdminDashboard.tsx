import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldAlert, 
  RefreshCcw, 
  Users as UsersIcon, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Settings,
  Database,
  Send,
  Bell,
  Coins,
  Check,
  Plus,
  Minus
} from "lucide-react";
import { UserProfile } from "../types";
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

interface AdminDashboardProps {
  user: UserProfile;
  allUsers: UserProfile[];
}

export default function AdminDashboard({ user, allUsers }: AdminDashboardProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    type: 'announcement' as 'announcement' | 'system' | 'assignment'
  });
  const [isSending, setIsSending] = useState(false);
  const [adminCustomAmount, setAdminCustomAmount] = useState<string>('');
  const [customAmounts, setCustomAmounts] = useState<{[uid: string]: string}>({});
  const [isUpdatingSelf, setIsUpdatingSelf] = useState(false);

  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.title || !announcement.content) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        ...announcement,
        senderId: user.uid,
        senderName: user.name,
        timestamp: serverTimestamp(),
        isRead: false
      });
      setAnnouncement({ title: '', content: '', type: announcement.type });
      alert("Thông báo đã được gửi thành công!");
    } catch (error) {
      console.error("Error sending announcement:", error);
      alert("Không thể gửi thông báo. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const handleRefillSelf = async (amount: number) => {
    if (isNaN(amount) || amount === 0) return;
    setIsUpdatingSelf(true);
    try {
      const userRef = doc(db, 'users', user.uid!);
      const batch = writeBatch(db);
      
      const prevHncoi = user.hncoi || 0;
      const newHncoi = Math.max(0, prevHncoi + amount);
      const diff = newHncoi - prevHncoi;
      
      batch.update(userRef, {
        hncoi: newHncoi,
        updatedAt: serverTimestamp()
      });

      if (diff !== 0) {
        const txRef = doc(collection(db, 'transactions'));
        batch.set(txRef, {
          senderId: 'system',
          senderName: 'Đặc quyền Admin',
          senderAvatar: '',
          recipientId: user.uid,
          recipientName: user.name,
          recipientAvatar: user.avatar || '',
          amount: Math.abs(diff),
          type: diff > 0 ? 'mining' : 'admin_deduct',
          timestamp: serverTimestamp()
        });
      }

      await batch.commit();
      setAdminCustomAmount('');
    } catch (error) {
      console.error("Error refilling admin Hncoi:", error);
      alert("Lỗi nạp Hncoi!");
    } finally {
      setIsUpdatingSelf(false);
    }
  };

  const handleModifyUserHncoi = async (targetUser: UserProfile, value: number, isSetExact: boolean) => {
    if (isNaN(value)) {
      alert("Vui lòng nhập số Hncoi hợp lệ!");
      return;
    }
    if (isSetExact && value < 0) {
      alert("Số lượng Hncoi cài đặt không thể nhỏ hơn 0!");
      return;
    }
    
    try {
      const targetRef = doc(db, 'users', targetUser.uid!);
      const batch = writeBatch(db);
      
      const prevHncoi = targetUser.hncoi || 0;
      const newHncoi = Math.max(0, isSetExact ? value : prevHncoi + value);
      const changeAmount = newHncoi - prevHncoi;

      batch.update(targetRef, {
        hncoi: newHncoi,
        updatedAt: serverTimestamp()
      });

      if (changeAmount !== 0) {
        // Add transaction
        const txRef = doc(collection(db, 'transactions'));
        batch.set(txRef, {
          senderId: 'system',
          senderName: 'Admin Hệ Thống',
          senderAvatar: user.avatar || '',
          recipientId: targetUser.uid,
          recipientName: targetUser.name,
          recipientAvatar: targetUser.avatar || '',
          amount: Math.abs(changeAmount),
          type: changeAmount > 0 ? 'admin_grant' : 'admin_deduct',
          timestamp: serverTimestamp()
        });

        // Add notification
        const notiRef = doc(collection(db, 'notifications'));
        batch.set(notiRef, {
          title: changeAmount > 0 ? 'Nhận Hncoi từ Admin 👑' : 'Hncoi bị điều chỉnh 📉',
          content: changeAmount > 0 
            ? `Tài khoản của bạn đã được Admin cấp thêm ${changeAmount.toLocaleString()} Hncoi.`
            : `Tài khoản của bạn đã bị Admin khấu trừ ${Math.abs(changeAmount).toLocaleString()} Hncoi.`,
          type: 'system',
          senderId: 'system',
          senderName: 'Ban Quản Trị',
          recipientId: targetUser.uid,
          timestamp: serverTimestamp(),
          isRead: false
        });
      }

      await batch.commit();
      // Clear input
      setCustomAmounts(prev => ({ ...prev, [targetUser.uid!]: '' }));
    } catch (err) {
      console.error("Error modifying user Hncoi:", err);
      alert("Không thể thay đổi Hncoi!");
    }
  };

  const handleResetSystem = async () => {
    setIsResetting(true);
    // In a real Firebase app, you'd call a cloud function or delete collections carefully.
    // For now, we simulate success message
    setTimeout(() => {
      setIsResetting(false);
      setShowConfirm(false);
      alert("Hệ thống đã được reset (Mô phỏng). Trong ứng dụng thực tế, tất cả tài liệu Firestore sẽ được xóa.");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 dark:bg-slate-950/50 p-6 rounded-[3rem] transition-colors duration-500">
      <header className="mb-10 text-center">
        <div className="w-24 h-24 bg-red-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20 ring-8 ring-red-600/10">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hệ thống Quản trị tối cao</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Chào mừng trở lại, <span className="text-red-500 font-bold">{user.name}</span>. Quyền năng tuyệt đối đang nằm trong tay bạn.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Statistics */}
        <div className="bg-white dark:bg-slate-900 dark:bg-opacity-40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6">
          <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
            <Database className="text-blue-600 dark:text-blue-500" />
            Trạng thái dữ liệu
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent dark:border-slate-800/50">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Tổng tài khoản</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{allUsers.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent dark:border-slate-800/50">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Giáo viên</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400">{allUsers.filter(u => u.role === 'teacher').length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-transparent dark:border-slate-800/50">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Học sinh</span>
              <span className="text-xl font-black text-green-600 dark:text-green-400">{allUsers.filter(u => u.role === 'student').length}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2.5rem] border-2 border-dashed border-red-200 dark:border-red-900/30 space-y-6">
          <h3 className="font-black text-xl text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertTriangle />
            Khu vực nguy hiểm
          </h3>
          <p className="text-sm text-red-500 dark:text-red-400 font-medium leading-relaxed">
            Hành động này sẽ xóa sạch tất cả học sinh, giáo viên, phụ huynh và bài đăng của họ trên toàn hệ thống. CHỈ để lại tài khoản Quản trị của bạn.
          </p>
          
          {!showConfirm ? (
            <button 
              onClick={() => setShowConfirm(true)}
              className="w-full py-5 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCcw size={20} />
              RESET TOÀN BỘ HỆ THỐNG
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center font-black text-red-600 text-sm animate-pulse">BẠN CÓ CHẮC CHẮN KHÔNG?</p>
              <div className="flex gap-3">
                <button 
                   onClick={handleResetSystem}
                  disabled={isResetting}
                  className="flex-[2] py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  {isResetting ? <RefreshCcw className="animate-spin" /> : <Trash2 size={18} />}
                  Xác nhận Xóa
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Special Hncoi Privileges */}
      <div className="mt-12 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-8 rounded-[3rem] border border-blue-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-2xl flex items-center justify-center">
              <Coins size={28} />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white tracking-tight">Quyền Năng Cấp Hncoi Vô Hạn</h3>
              <p className="text-slate-300 text-sm font-medium">Bơm Hncoi trực tiếp vào ví của bạn mà không cần bất kỳ giới hạn nào.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Số dư Admin hiện tại của bạn</p>
                <p className="text-3xl font-black text-yellow-400">{(user.hncoi || 0).toLocaleString()} <span className="text-sm text-yellow-400/80 font-bold">Hncoi</span></p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  disabled={isUpdatingSelf}
                  onClick={() => handleRefillSelf(10000)}
                  className="px-4 py-2 bg-yellow-500 text-slate-900 font-black text-xs rounded-xl hover:bg-yellow-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  +10K Hncoi
                </button>
                <button 
                  disabled={isUpdatingSelf}
                  onClick={() => handleRefillSelf(1000000)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-black text-xs rounded-xl hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  +1M Hncoi
                </button>
                <button 
                  disabled={isUpdatingSelf}
                  onClick={() => handleRefillSelf(99999999)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs rounded-xl hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  ✨ Đầy Ví (99M)
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3 items-end">
              <div className="flex-grow">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tự nhập số lượng mong muốn</label>
                <input 
                  type="number" 
                  value={adminCustomAmount}
                  onChange={(e) => setAdminCustomAmount(e.target.value)}
                  placeholder="Nhập số lượng..."
                  className="w-full px-5 py-3 bg-slate-900/60 border border-white/10 rounded-xl outline-none focus:border-yellow-500/50 font-bold text-white text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={isUpdatingSelf || !adminCustomAmount || isNaN(parseInt(adminCustomAmount)) || parseInt(adminCustomAmount) === 0}
                  onClick={() => handleRefillSelf(Math.abs(parseInt(adminCustomAmount)))}
                  className="py-3 px-4 bg-yellow-500 text-slate-900 hover:bg-yellow-400 disabled:opacity-50 disabled:grayscale font-black text-xs rounded-xl transition-all shadow-lg flex items-center gap-1 h-[46px] shrink-0"
                >
                  <Plus size={14} />
                  NHẬN NGAY
                </button>
                <button 
                  disabled={isUpdatingSelf || !adminCustomAmount || isNaN(parseInt(adminCustomAmount)) || parseInt(adminCustomAmount) === 0}
                  onClick={() => handleRefillSelf(-Math.abs(parseInt(adminCustomAmount)))}
                  className="py-3 px-4 bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 disabled:grayscale font-black text-xs rounded-xl transition-all shadow-lg flex items-center gap-1 h-[46px] shrink-0"
                >
                  <Minus size={14} />
                  GIẢM BỚT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Announcement Section */}
      <div className="mt-12 bg-white dark:bg-slate-900 dark:bg-opacity-40 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
            <Bell className="text-amber-500" />
            Gửi thông báo toàn hệ thống
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
                placeholder="Nhập tiêu đề thông báo..."
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium dark:text-white dark:placeholder:text-slate-600"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Loại thông báo</label>
                <select 
                  value={announcement.type}
                  onChange={(e) => setAnnouncement({...announcement, type: e.target.value as any})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold dark:text-white appearance-none"
                >
                  <option value="announcement">📢 Thông báo</option>
                  <option value="assignment">📚 Bài tập mới</option>
                  <option value="system">⚠️ Hệ thống</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Nội dung</label>
              <textarea 
                value={announcement.content}
                onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                placeholder="Nội dung thông báo chi tiết..."
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

      {/* User List with Admin Hncoi editor */}
      <div className="mt-12 bg-white dark:bg-slate-900 dark:bg-opacity-40 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
            <UsersIcon className="text-blue-600 dark:text-blue-400" />
            Danh sách người dùng
          </h3>
          <span className="px-4 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest">Toàn cầu</span>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {allUsers.map((u, idx) => (
            <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shadow-inner ring-1 ring-slate-200 dark:ring-slate-800 shrink-0">
                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">{u.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">{u.email}</p>
                </div>
              </div>

              {/* Hncoi manager widget per user */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex-1 md:max-w-md justify-between">
                <div className="flex items-center gap-1.5 shrink-0 px-1">
                  <Coins className="text-yellow-500" size={16} />
                  <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300">
                    {(u.hncoi || 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-400">Hncoi</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    placeholder="S.lượng"
                    value={customAmounts[u.uid!] || ''}
                    onChange={(e) => setCustomAmounts({ ...customAmounts, [u.uid!]: e.target.value })}
                    className="w-16 px-1.5 py-1.5 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                  <button
                    disabled={!customAmounts[u.uid!] || isNaN(parseFloat(customAmounts[u.uid!])) || parseFloat(customAmounts[u.uid!]) === 0}
                    onClick={() => handleModifyUserHncoi(u, Math.abs(parseFloat(customAmounts[u.uid!])), false)}
                    className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-0.5 disabled:opacity-40"
                    title="Cộng thêm Hncoi"
                  >
                    <Plus size={10} />
                    Cộng
                  </button>
                  <button
                    disabled={!customAmounts[u.uid!] || isNaN(parseFloat(customAmounts[u.uid!])) || parseFloat(customAmounts[u.uid!]) === 0}
                    onClick={() => handleModifyUserHncoi(u, -Math.abs(parseFloat(customAmounts[u.uid!])), false)}
                    className="px-2 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-0.5 disabled:opacity-40"
                    title="Trừ bớt Hncoi"
                  >
                    <Minus size={10} />
                    Trừ
                  </button>
                  <button
                    disabled={!customAmounts[u.uid!] || isNaN(parseFloat(customAmounts[u.uid!])) || Math.abs(parseFloat(customAmounts[u.uid!])) < 0}
                    onClick={() => handleModifyUserHncoi(u, Math.abs(parseFloat(customAmounts[u.uid!])), true)}
                    className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center gap-0.5 disabled:opacity-40"
                    title="Đặt số lượng chính xác"
                  >
                    <Check size={10} />
                    Đặt
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest">Vai trò</p>
                  <p className={`text-xs font-bold ${
                    u.role === 'admin' ? 'text-red-600 dark:text-red-400' : 
                    u.role === 'teacher' ? 'text-blue-600 dark:text-blue-400' : 
                    u.role === 'parent' ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {u.role.toUpperCase()}
                  </p>
                </div>
                <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
