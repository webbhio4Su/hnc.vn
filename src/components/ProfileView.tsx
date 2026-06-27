import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, GraduationCap, X, Save, LogOut, Camera, Palette, Trash2, Settings, Music, Moon, Sun, Sparkles, Check, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import { UserProfile } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (updated: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isMusicOn: boolean;
  setIsMusicOn: (val: boolean) => void;
  isPrivateMode: boolean;
  setIsPrivateMode: (val: boolean) => void;
  isGuestMode: boolean;
  setIsGuestMode: (val: boolean) => void;
  accounts: UserProfile[];
  onSwitchAccount: (acc: UserProfile) => void;
  onAddAccount: (acc: UserProfile) => void;
  onDeleteAccount: (email: string) => void;
}

const systemAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Felix',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
];

export default function ProfileView({ 
  user, onUpdate, onLogout, onClose, 
  isDarkMode, setIsDarkMode, 
  isMusicOn, setIsMusicOn,
  isPrivateMode, setIsPrivateMode,
  isGuestMode, setIsGuestMode,
  accounts, onSwitchAccount, onAddAccount,
  onDeleteAccount
}: ProfileViewProps) {
  const [formData, setFormData] = useState({...user});
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'settings' | 'security' | 'accounts'>('info');
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  const handleSwitch = (acc: UserProfile) => {
    setSwitchingTo(acc.email);
    setTimeout(() => {
      onSwitchAccount(acc);
      setSwitchingTo(null);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In this demo, we assume the old password must match if it exists, 
    // or just allow if no password is set yet
    if (user.password && passwordForm.oldPassword !== user.password) {
      alert("Mật khẩu cũ không chính xác!");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    // Update the password in user profile
    const updatedUser = { ...user, password: passwordForm.newPassword };
    onUpdate(updatedUser);
    
    alert("Đổi mật khẩu thành công!");
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100 dark:border-slate-800"
      >
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 inline-block">
            <div className="w-24 h-24 rounded-[1.8rem] bg-white dark:bg-slate-800 p-1 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden">
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-800 hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
            {(['info', 'avatar', 'settings', 'accounts', 'security'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[70px] py-2 text-[10px] font-black uppercase rounded-xl transition-all ${
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {tab === 'info' ? 'Hồ sơ' : tab === 'avatar' ? 'Ảnh đại diện' : tab === 'settings' ? 'Cài đặt' : tab === 'accounts' ? 'Tài khoản' : 'Bảo mật'}
              </button>
            ))}
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'info' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1 tracking-widest">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1 tracking-widest">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/20 border-2 border-transparent text-slate-400 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
                  >
                    <Save size={18} />
                    LƯU THAY ĐỔI
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-6 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all active:scale-95"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                {[
                  { id: 'dark', title: 'Chế độ tối', desc: isDarkMode ? 'Bật' : 'Tắt', icon: isDarkMode ? Moon : Sun, color: 'indigo', state: isDarkMode, setter: setIsDarkMode },
                  { id: 'music', title: 'Nhạc nền', desc: isMusicOn ? 'Có âm nhạc' : 'Yên tĩnh', icon: Music, color: 'purple', state: isMusicOn, setter: setIsMusicOn },
                  { id: 'private', title: 'Chế độ ẩn danh', desc: 'Riêng tư', icon: Trash2, color: 'red', state: isPrivateMode, setter: setIsPrivateMode },
                  { id: 'guest', title: 'Chế độ khách', desc: 'Sử dụng ẩn', icon: User, color: 'green', state: isGuestMode, setter: setIsGuestMode },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl group hover:bg-slate-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-2xl bg-white dark:bg-slate-700 shadow-sm text-${item.color}-600`}>
                        <item.icon size={22} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => item.setter(!item.state)}
                      className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${item.state ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <motion.div 
                        animate={{ x: item.state ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'avatar' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {systemAvatars.map((url) => (
                    <button 
                      key={url}
                      onClick={() => setFormData({...formData, avatar: url})}
                      className={`p-1 rounded-2xl border-4 transition-all ${formData.avatar === url ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                      <img src={url} alt="Av" className="w-full rounded-xl" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                    <UserPlus size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Tải ảnh từ máy</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">DUNG LƯỢNG TỐI ĐA 2MB</p>
                  </div>
                  <label className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg cursor-pointer hover:bg-blue-700 transition-all uppercase tracking-widest">
                    CHỌN FILE
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert('Dung lượng ảnh phải dưới 2MB!');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({...formData, avatar: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-4">
                <div className="p-5 border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} className="w-12 h-12 rounded-2xl" />
                    <div>
                      <p className="font-black text-blue-900 dark:text-blue-300">{user.name}</p>
                      <p className="text-[10px] font-black text-blue-600 uppercase">ĐANG SỬ DỤNG</p>
                    </div>
                  </div>
                  <Check className="text-blue-600" />
                </div>

                {accounts
                  .filter(acc => acc.email !== user.email)
                  .map((acc, i) => (
                  <button 
                    key={i}
                    disabled={!!switchingTo}
                    onClick={() => handleSwitch(acc)}
                    className={`w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-between hover:bg-slate-100 transition-all text-left ${switchingTo === acc.email ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={acc.avatar} className={`w-12 h-12 rounded-2xl ${switchingTo === acc.email ? 'opacity-30 blur-[1px]' : 'opacity-70'}`} />
                        {switchingTo === acc.email && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 size={16} className="animate-spin text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{acc.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">NHẤN ĐỂ CHUYỂN ĐỔI</p>
                      </div>
                    </div>
                  </button>
                ))}

                <button 
                  onClick={() => {
                    // Save current user to accounts if not already there, then logout to show Auth screen
                    onAddAccount(user);
                    onLogout();
                    onClose();
                  }}
                  className="w-full p-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-black flex items-center justify-center gap-3 hover:text-blue-600 hover:border-blue-200"
                >
                  <UserPlus size={20} />
                  THÊM TÀI KHOẢN MỚI
                </button>
              </div>
            )}

            {activeTab === 'security' && (
               <form onSubmit={handleChangePassword} className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                   <input 
                     type="password" 
                     required 
                     value={passwordForm.oldPassword}
                     onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold dark:text-white" 
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                   <input 
                     type="password" 
                     required 
                     value={passwordForm.newPassword}
                     onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold dark:text-white" 
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                   <input 
                     type="password" 
                     required 
                     value={passwordForm.confirmPassword}
                     onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                     className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold dark:text-white" 
                   />
                 </div>
                 <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-blue-600 transition-all active:scale-95">
                   ĐỔI MẬT KHẨU
                 </button>

                 <div className="pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                     <Sparkles size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Chia sẻ ứng dụng</span>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Đường dẫn web của bạn:</p>
                     <div className="flex bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-800 gap-2">
                       <input 
                         readOnly 
                         value={window.location.origin} 
                         className="flex-1 bg-transparent border-none text-[10px] font-mono font-bold text-slate-500 outline-none px-2"
                       />
                       <button 
                         onClick={() => {
                           navigator.clipboard.writeText(window.location.origin);
                           alert("Đã sao chép liên kết!");
                         }}
                         className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded-lg hover:bg-blue-700 transition-all uppercase"
                       >
                         Sao chép
                       </button>
                     </div>
                   </div>

                   <div className="flex items-center gap-2 mb-4 text-red-600">
                     <ShieldAlert size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Khu vực nguy hiểm</span>
                   </div>
                   
                   {!showDeleteConfirm ? (
                     <button 
                       type="button"
                       onClick={() => setShowDeleteConfirm(true)}
                       className="w-full py-4 border-2 border-red-50 dark:border-red-900/10 text-red-600 font-black rounded-2xl hover:bg-red-50 transition-all text-[10px] tracking-widest uppercase"
                     >
                       XÓA TÀI KHOẢN VĨNH VIỄN
                     </button>
                   ) : (
                     <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-3xl border border-red-100 dark:border-red-900/20 text-center">
                       <p className="text-[10px] font-bold text-red-700 dark:text-red-400 mb-4 leading-relaxed uppercase tracking-tight">
                         Bạn có chắc chắn muốn xóa tài khoản này? Mọi dữ liệu (bao gồm bài học đã lưu, tin nhắn bạn bè) sẽ bị hủy vĩnh viễn và không thể khôi phục!
                       </p>
                       <div className="flex gap-3">
                         <button 
                           type="button"
                           onClick={() => setShowDeleteConfirm(false)}
                           className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-600 font-bold rounded-xl text-[10px] uppercase shadow-sm"
                         >
                           QUAY LẠI
                         </button>
                         <button 
                           type="button"
                           onClick={() => {
                             onDeleteAccount(user.email);
                             onLogout();
                             onClose();
                           }}
                           className="flex-1 py-3 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase shadow-lg shadow-red-200 dark:shadow-none"
                         >
                           TÔI ĐỒNG Ý XÓA
                         </button>
                       </div>
                     </div>
                   )}
                 </div>
               </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
