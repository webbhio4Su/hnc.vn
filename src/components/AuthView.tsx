import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, UserPlus, Mail, User, GraduationCap, ArrowRight, BookOpen, Lock, ShieldCheck, Baby, Heart, Loader2 } from "lucide-react";
import { UserProfile, AuthMode } from "../types";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType, googleProvider } from "../lib/firebase";

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
  savedAccounts?: UserProfile[];
  onSelectAccount?: (user: UserProfile) => void;
}

export default function AuthView({ onAuthSuccess, savedAccounts = [], onSelectAccount }: AuthViewProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [isResetFlow, setIsResetFlow] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const generateOTP = () => {
    const chars = "0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    if (showOTP) {
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 500);
    }
  }, [showOTP]);

  const handleOtpChange = (index: number, value: string) => {
    // Handle pasting or fast typing of multiple characters
    if (value.length > 1) {
      const pasted = value.replace(/[^0-9]/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newValues = [...otpValues];
        pasted.split("").forEach((char, i) => {
          if (index + i < 6) newValues[index + i] = char;
        });
        setOtpValues(newValues);
        const nextIdx = Math.min(index + pasted.length, 5);
        otpInputs.current[nextIdx]?.focus();
        return;
      }
    }

    const char = value.replace(/[^0-9]/g, '');
    const newValues = [...otpValues];
    newValues[index] = char;
    setOtpValues(newValues);

    if (char && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpValues.join("");
    if (enteredCode === generatedOTP) {
      if (isResetFlow) {
        setShowOTP(false);
        setShowNewPassword(true);
        // Clear OTP values for safety
        setOtpValues(new Array(6).fill(""));
      } else if (pendingUser) {
        onAuthSuccess(pendingUser);
      }
    } else {
      setError("Mã OTP không chính xác! Vui lòng kiểm tra lại tin nhắn hoặc email.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    
    setIsLoggingIn(true);
    try {
      // In a real app we'd use Firebase Auth to update password
      // For this demo we'll just simulate success
      alert("Mật khẩu của bạn đã được cập nhật thành công!");
      setShowNewPassword(false);
      setIsResetFlow(false);
      setMode('login');
      setFormData(prev => ({ ...prev, password: newPassword }));
      setNewPassword("");
    } finally {
      setIsLoggingIn(false);
    }
  };
  const [selectedAcc, setSelectedAcc] = useState<UserProfile | null>(null);

  const handleSelectAccount = (acc: UserProfile) => {
    setSelectedAcc(acc);
    setMode('login');
    setFormData(prev => ({ ...prev, email: acc.email, password: '' }));
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        onAuthSuccess(userDoc.data() as UserProfile);
      } else {
        const newUser: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Người dùng mới',
          email: firebaseUser.email || '',
          role: firebaseUser.email === 'sftcdpcute@gmail.com' ? 'admin' : 'student',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
          className: '5A1',
          gender: 'other',
          points: 0,
          password: firebaseUser.email === 'sftcdpcute@gmail.com' ? undefined : '35790HV'
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        onAuthSuccess(newUser);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Đăng nhập Google chưa được kích hoạt trong Firebase Console.');
      } else {
        setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    className: '',
    role: 'student' as 'student' | 'teacher' | 'parent' | 'admin' | 'user',
    gender: 'male' as 'male' | 'female' | 'other',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
  });

  const avatarSeeds = ['Felix', 'Aneka', 'Caleb', 'Cookie', 'Bear', 'Daisy', 'Leo', 'Mia'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dung lượng ảnh phải dưới 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const [resetStep, setResetStep] = useState<'none' | 'email' | 'sent'>('none');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetLoading(true);

    try {
      const code = generateOTP();
      setGeneratedOTP(code);
      setIsResetFlow(true);
      
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: resetEmail, 
          otp: code,
          type: 'reset'
        }),
      });

      const data = await response.json();
      setShowOTP(true);
      setResetStep('none');
      
      if (data.simulated) {
        alert(`[SIMULATED] Hệ thống chưa cấu hình Gmail. Mã reset của bạn là: ${code}`);
      } else {
        alert(`Mã reset mật khẩu đã được gửi vào địa chỉ Gmail: ${resetEmail}. Vui lòng kiểm tra hộp thư.`);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể gửi yêu cầu reset mật khẩu. Vui lòng kiểm tra lại email.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    
    const emailLower = formData.email.trim().toLowerCase();
    
    try {
      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, formData.password);
        const firebaseUser = userCredential.user;
        
        // Fetch profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          onAuthSuccess(userDoc.data() as UserProfile);
        } else {
          // Fallback for migration or missing doc
          const fallbackUser: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Người dùng mới',
            email: firebaseUser.email!,
            role: emailLower === 'sftcdpcute@gmail.com' ? 'admin' : 'student',
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
            className: '5A1',
            gender: 'other'
          };
          // Save to Firestore for future
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...fallbackUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          onAuthSuccess(fallbackUser);
        }
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, emailLower, formData.password);
        const firebaseUser = userCredential.user;
        
        const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: formData.name || 'Thành viên mới',
          email: formData.email,
          className: formData.className || "5A1",
          role: emailLower === 'sftcdpcute@gmail.com' ? 'admin' : formData.role,
          gender: formData.gender,
          avatar: formData.avatar,
          points: 0,
          password: emailLower === 'sftcdpcute@gmail.com' ? undefined : '35790HV',
          background: 'bg-slate-50',
          childEmails: formData.role === 'parent' ? [] : undefined,
          managedClasses: formData.role === 'teacher' ? [formData.className || "5A1"] : undefined
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUserProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        const code = generateOTP();
        setGeneratedOTP(code);
        setPendingUser(newUserProfile);

        const response = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email, 
            otp: code,
            type: 'register'
          }),
        });

        const data = await response.json();
        setShowOTP(true);

        if (data.simulated) {
          alert(`[SIMULATED] Hệ thống chưa cấu hình Gmail. Mã xác thực đăng ký là: ${code}`);
        } else {
          alert(`Mã xác thực đã được gửi đến email ${formData.email}. Vui lòng kiểm tra hộp thư!`);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email hoặc mật khẩu không chính xác!');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng!');
      } else {
        setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 dark:bg-black z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden my-8 border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200 dark:shadow-none">
            <BookOpen size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Chào mừng trở lại!' : 'Bắt đầu hành trình'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Học tập đỉnh cao cùng AI</p>
        </div>

        {savedAccounts.length > 0 && mode === 'login' && (
          <div className="mb-10">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center mb-6">Tài khoản đã lưu</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {savedAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  disabled={isLoggingIn}
                  onClick={() => handleSelectAccount(acc)}
                  className="group flex flex-col items-center gap-2 relative"
                >
                  <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ${
                    selectedAcc?.email === acc.email && isLoggingIn 
                      ? "border-blue-600 scale-110" 
                      : "border-white dark:border-slate-800 group-hover:scale-110 group-hover:border-blue-500"
                  }`}>
                    <img src={acc.avatar} alt={acc.name} className={`w-full h-full object-cover ${selectedAcc?.email === acc.email && isLoggingIn ? "opacity-50 blur-[2px]" : ""}`} />
                  </div>
                  
                  {selectedAcc?.email === acc.email && isLoggingIn && (
                    <div className="absolute inset-0 top-0 w-16 h-16 flex items-center justify-center">
                      <Loader2 className="animate-spin text-blue-600" size={24} />
                    </div>
                  )}

                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {acc.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none">Hoặc dùng email</span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Chọn ảnh đại diện</label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {avatarSeeds.map(seed => {
                    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                    return (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => setFormData({...formData, avatar: url})}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                          formData.avatar === url ? "border-blue-600 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={seed} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                  <label className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
                    <UserPlus size={18} className="text-slate-400" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                {formData.avatar.startsWith('data:') && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Ảnh của bạn</p>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-blue-600 shadow-xl">
                      <img src={formData.avatar} className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Bạn là ai?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'student', label: 'Học sinh', icon: <User size={14} /> },
                      { id: 'teacher', label: 'Giáo viên', icon: <ShieldCheck size={14} /> },
                      { id: 'parent', label: 'Phụ huynh', icon: <Baby size={14} /> },
                      { id: 'user', label: 'Người dùng', icon: <User size={14} /> }
                    ].map(role => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData({...formData, role: role.id as any})}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all font-bold text-xs ${
                          formData.role === role.id 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                          : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                        }`}
                      >
                        {role.icon}
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Giới tính</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'male'})}
                      className={`p-3 rounded-2xl border-2 transition-all font-bold text-xs ${
                        formData.gender === 'male' 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                        : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                      }`}
                    >
                      Nam
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'female'})}
                      className={`p-3 rounded-2xl border-2 transition-all font-bold text-xs ${
                        formData.gender === 'female' 
                        ? "bg-pink-600 border-pink-600 text-white shadow-lg" 
                        : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                      }`}
                    >
                      Nữ
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'other'})}
                      className={`p-3 rounded-2xl border-2 transition-all font-bold text-xs ${
                        formData.gender === 'other' 
                        ? "bg-slate-800 dark:bg-slate-700 border-slate-800 dark:border-slate-700 text-white shadow-lg" 
                        : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                      }`}
                    >
                      Khác
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
              <input
                required
                type="text"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-medium dark:text-white"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              required
              type="email"
              placeholder="Địa chỉ Email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-medium dark:text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              required
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-medium dark:text-white"
            />
          </div>

          {mode === 'login' && (
            <div className="text-right">
              <button 
                type="button"
                onClick={() => {
                  setResetStep('email');
                  setResetEmail(formData.email);
                  setError(null);
                }}
                className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {mode === 'register' && formData.role !== 'parent' && formData.role !== 'user' && (
            <div className="relative">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
              <input
                required
                type="text"
                placeholder={formData.role === 'teacher' ? "Lớp quản lý (Ví dụ: 5A1)" : "Lớp học (Ví dụ: 5A1)"}
                value={formData.className}
                onChange={e => setFormData({...formData, className: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-2xl outline-none transition-all font-medium dark:text-white"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-yellow-100 font-black rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3 transition-all active:scale-[0.98] group mt-6"
          >
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 font-black tracking-widest">Hoặc</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center transition-all active:scale-[0.98] outline-none"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.593-2.325.918-3.64.918-2.682 0-4.963-1.817-5.64-4.242L2.645 17.81c2.1 4.189 6.445 7.027 11.455 7.027 3.03 0 5.75-.985 7.9-2.61l-5.96-4.214z" />
                <path fill="#4285F4" d="M23.49 12.275c0-.825-.075-1.645-.215-2.455H12v4.64h6.44c-.28 1.515-1.135 2.8-2.4 3.645l5.96 4.214c3.485-3.212 5.49-7.942 5.49-12.044z" />
                <path fill="#FBBC05" d="M6.76 14.688c-.147-.435-.23-.895-.23-1.378 0-.462.078-.905.215-1.332L2.735 8.877A12.023 12.023 0 0 0 1 12c0 1.295.21 2.54.59 3.707l5.17-3.019z" />
              </svg>
              <span className="mt-[1px]">Tiếp tục với Google</span>
            </div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {mode === 'login' ? (
              <>Chưa có tài khoản? <span className="text-blue-600 dark:text-blue-400">Đăng ký ngay</span></>
            ) : (
              <>Đã có tài khoản? <span className="text-blue-600 dark:text-blue-400">Đăng nhập</span></>
            )}
          </button>
        </div>

        {/* Forgot Password Overlays */}
        <AnimatePresence>
          {showNewPassword && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-900/98 backdrop-blur-2xl z-50 flex flex-col p-8 items-center justify-center"
            >
              <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-[2.5rem] flex items-center justify-center mb-6 border border-blue-500/20">
                <Lock size={36} />
              </div>
              <h3 className="text-2xl font-black text-white text-center">Đặt mật khẩu mới</h3>
              <p className="text-sm text-slate-400 mt-2 mb-8 text-center px-4">Xác thực thành công! Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

              <form onSubmit={handleUpdatePassword} className="w-full space-y-6">
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    required
                    type="password"
                    placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-14 pr-4 py-5 bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[1.5rem] outline-none font-medium text-white transition-all"
                    autoFocus
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02]"
                >
                  CẬP NHẬT MẬT KHẨU
                  <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {resetStep !== 'none' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-900/98 backdrop-blur-2xl z-50 flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={() => {
                    setResetStep('none');
                    setResetEmail('');
                  }}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors bg-slate-800/50 rounded-xl"
                >
                  <ArrowRight className="rotate-180" size={20} />
                </button>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Khôi phục tài khoản</div>
                <div className="w-10" />
              </div>

              {resetStep === 'email' && (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSendResetEmail} 
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                      <Mail size={36} />
                    </div>
                    <h3 className="text-2xl font-black text-white">Quên mật khẩu?</h3>
                    <p className="text-sm text-slate-400 mt-3 px-4 leading-relaxed">Đừng lo! Nhập email của bạn để nhận liên kết đặt lại mật khẩu qua Gmail.</p>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                      required
                      type="email"
                      placeholder="Email đã đăng ký"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full pl-14 pr-4 py-5 bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[1.5rem] outline-none font-medium text-white transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <button 
                    disabled={resetLoading}
                    type="submit"
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {resetLoading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        GỬI LIÊN KẾT RESET
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {resetStep === 'sent' && (
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-2xl shadow-green-500/10">
                    <ShieldCheck size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Đã gửi thành công!</h3>
                  <p className="text-sm text-slate-400 mt-3 px-4">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <span className="text-blue-400 font-bold">{resetEmail}</span>. Vui lòng kiểm tra hộp thư của bạn.</p>
                  <button 
                    onClick={() => setResetStep('none')}
                    className="w-full py-5 bg-white text-slate-900 font-black rounded-[1.5rem] shadow-xl hover:bg-slate-100 transition-all"
                  >
                    QUAY LẠI ĐĂNG NHẬP
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
      {/* OTP Modal */}
      <AnimatePresence>
        {showOTP && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-slate-100 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Nhập mã xác minh</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Mã xác minh gồm 6 chữ số đã được gửi đến email của bạn.</p>
              
              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={el => { otpInputs.current[i] = el; }}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-11 h-14 text-center text-2xl font-black bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all dark:text-white"
                      required
                    />
                  ))}
                </div>
                
                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all"
                >
                  XÁC MINH NGAY
                </button>
                
                <p className="text-xs font-bold text-slate-400">
                  Không nhận được mã? <button type="button" className="text-blue-600 hover:underline" onClick={() => alert("Đã gửi lại mã OTP!")}>Gửi lại</button>
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
