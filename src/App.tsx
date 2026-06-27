/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TheoryView from "./components/TheoryView";
import ExerciseView from "./components/ExerciseView";
import GeminiTutor from "./components/GeminiTutor";
import AuthView from "./components/AuthView";
import ProfileView from "./components/ProfileView";
import HomeView from "./components/HomeView";
import SocialView from "./components/SocialView";
import CompetitionView from "./components/CompetitionView";
import MyProfileView from "./components/MyProfileView";
import NotificationView from "./components/NotificationView";
import HncoiBank from "./components/HncoiBank";
import ParentDashboard from "./components/ParentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SuperDashboard from "./components/SuperDashboard";
import { lessons, Lesson, getRandomQuiz } from "./data/lessons";
import { UserProfile, Notification } from "./types";
import { BookMarked, GraduationCap, Menu, X, Sparkles, Settings, BookOpen, Home, Trophy, Users, User as UserIcon, ShieldCheck, Baby, ShieldAlert, Loader2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, onSnapshot, query, setDoc, serverTimestamp, getDocs, where, limit } from "firebase/firestore";

 export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_accounts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeLesson, setActiveLesson] = useState<Lesson>(lessons[0]);
  const [view, setView] = useState<"theory" | "exercises" | "social" | "competition" | "profile" | "teacher_dashboard" | "parent_dashboard" | "admin_dashboard" | "super_dashboard" | "notifications" | "bank">("theory");
  const [isHome, setIsHome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMusicOn, setIsMusicOn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('music_on') === 'true';
    }
    return false;
  });
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const q = query(collection(db, "users"), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setAllUsers(users);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set up real-time listener for current user
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Thành viên mới',
            email: firebaseUser.email!,
            role: firebaseUser.email === 'sftcdpcute@gmail.com' ? 'admin' : 'student',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
            className: '5A1',
            gender: 'other',
            points: 0,
            hncoi: 0,
            password: firebaseUser.email === 'sftcdpcute@gmail.com' ? undefined : '35790HV'
          };
          await setDoc(userDocRef, {
            ...newUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }

        // Real-time listener for user data
        const unsubUser = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser(doc.data() as UserProfile);
          }
        });
        
        setLoading(false);
        return () => unsubUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data() as UserProfile);
        });
        setAllUsers(users);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "notifications"),
        where("isRead", "==", false)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let count = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data() as any;
          if (!data.recipientId || data.recipientId === user.uid) {
            count++;
          }
        });
        setUnreadCount(count);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('music_on', isMusicOn.toString());
  }, [isMusicOn]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user && isHome) {
      if (user.role === 'admin') setView("admin_dashboard");
      else if (user.role === 'user') setView("super_dashboard");
      else if (user.role === 'teacher') setView("teacher_dashboard");
      else if (user.role === 'parent') setView("parent_dashboard");
    }
  }, [user, isHome]);

  const handleAuthSuccess = (userData: UserProfile) => {
    setUser(userData);
    setIsHome(true);
    
    // Save account to local storage
    setSavedAccounts(prev => {
      const exists = prev.some(acc => acc.email === userData.email);
      if (!exists) {
        const updated = [...prev, userData];
        localStorage.setItem('saved_accounts', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });

    if (userData.role === 'admin') setView("admin_dashboard");
    else if (userData.role === 'user') setView("super_dashboard");
    else if (userData.role === 'teacher') setView("teacher_dashboard");
    else if (userData.role === 'parent') setView("parent_dashboard");
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    if (user?.uid) {
      await setDoc(doc(db, 'users', user.uid), {
        ...updated,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setUser(updated);

      // Also update saved accounts list
      setSavedAccounts(prev => {
        const updatedList = prev.map(acc => acc.email === updated.email ? updated : acc);
        localStorage.setItem('saved_accounts', JSON.stringify(updatedList));
        return updatedList;
      });
    }
  };

  const handleGoProfile = () => {
    setView("profile");
    setIsHome(false);
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setIsHome(false);
    setIsSidebarOpen(false);
    setView(lesson.id === "kiem-tra-tong-hop" ? "exercises" : "theory");
  };

  const handleGoHome = () => {
    setIsHome(true);
    if (user?.role === 'admin') setView("admin_dashboard");
    else if (user?.role === 'user') setView("super_dashboard");
    else if (user?.role === 'teacher') setView("teacher_dashboard");
    else if (user?.role === 'parent') setView("parent_dashboard");
    else setView("theory");
    setIsSidebarOpen(false);
  };

  const handleGoSocial = () => {
    setView("social");
    setIsHome(false);
    setIsSidebarOpen(false);
  };

  const handleGoCompetition = () => {
    setView("competition");
    setIsHome(false);
    setIsSidebarOpen(false);
  };

  const handleGoNotifications = () => {
    setView("notifications");
    setIsHome(false);
    setIsSidebarOpen(false);
  };

  const handleGoBank = () => {
    setView("bank");
    setIsHome(false);
    setIsSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : (user?.background || 'bg-white')}`}>
      {/* Auth Guard */}
      {!user && (
        <AuthView 
          onAuthSuccess={handleAuthSuccess} 
          savedAccounts={savedAccounts}
        />
      )}

      {/* Profile/Settings Modal */}
      <AnimatePresence>
        {user && isProfileOpen && (
          <ProfileView 
            user={user} 
            onUpdate={handleUpdateProfile} 
            onLogout={handleLogout} 
            onClose={() => setIsProfileOpen(false)}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isMusicOn={isMusicOn}
            setIsMusicOn={setIsMusicOn}
            isPrivateMode={isPrivateMode}
            setIsPrivateMode={setIsPrivateMode}
            isGuestMode={isGuestMode}
            setIsGuestMode={setIsGuestMode}
            accounts={savedAccounts}
            onSwitchAccount={(acc) => {
              // Sign out and let user log in with the other account
              auth.signOut().then(() => setUser(null));
            }}
            onAddAccount={() => {
              auth.signOut().then(() => setUser(null));
            }}
            onDeleteAccount={(email) => {
              setSavedAccounts(prev => {
                const updated = prev.filter(acc => acc.email !== email);
                localStorage.setItem('saved_accounts', JSON.stringify(updated));
                return updated;
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Hidden Audio Player */}
      {isMusicOn && (
        <audio
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          autoPlay
          loop
          className="hidden"
        />
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}>
        <Sidebar 
          activeLessonId={isHome ? "home" : (view === "social" ? "social" : (view === "competition" ? "competition" : (view === "profile" ? "profile" : (view === "notifications" ? "notifications" : (view === "bank" ? "bank" : (view === "teacher_dashboard" || view === "parent_dashboard" || view === "admin_dashboard" || view === "super_dashboard" ? "home" : activeLesson.id))))))} 
          onSelectLesson={handleSelectLesson}
          onGoHome={handleGoHome}
          onGoSocial={handleGoSocial}
          onGoCompetition={handleGoCompetition}
          onGoProfile={handleGoProfile}
          onGoNotifications={handleGoNotifications}
          onGoBank={handleGoBank}
          user={user}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
            >
              <Menu size={24} className="dark:text-white" />
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={handleGoHome}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  isHome ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Home size={16} />
                <span className="hidden sm:inline">Trang chủ</span>
              </button>
              <button
                onClick={handleGoSocial}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  view === "social" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Users size={16} />
                <span className="hidden sm:inline">Bạn bè</span>
              </button>
              <button
                onClick={handleGoCompetition}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  view === "competition" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Trophy size={16} />
                <span className="hidden sm:inline">Cuộc thi</span>
              </button>
              <button
                onClick={handleGoProfile}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  view === "profile" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <UserIcon size={16} />
                <span className="hidden sm:inline">Trang cá nhân</span>
              </button>
              <button
                onClick={handleGoNotifications}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  view === "notifications" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Bell size={16} />
                <span className="hidden sm:inline">Thông báo</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {!isHome && view !== "social" && view !== "competition" && view !== "profile" && (
                <>
                  <button
                    onClick={() => setView("theory")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      view === "theory" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <BookMarked size={16} />
                    Lý thuyết
                  </button>
                  <button
                    onClick={() => setView("exercises")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      view === "exercises" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <GraduationCap size={16} />
                    Luyện tập
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAIOpen(!isAIOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isAIOpen 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none" 
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
              }`}
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline text-[13px]">Hỏi Gia sư AI</span>
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200/20 dark:shadow-none"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isHome ? "home" : (view === "social" ? "social" : (view === "competition" ? "competition" : (view === "profile" ? "profile" : `${activeLesson.id}-${view}`)))}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {isHome ? (
                (user?.role === 'student' || !user?.role) ? (
                  <HomeView 
                    user={user!} 
                    onSelectLesson={handleSelectLesson} 
                    onStartQuiz={() => handleSelectLesson(getRandomQuiz())} 
                  />
                ) : user?.role === 'user' ? (
                  <SuperDashboard user={user!} allUsers={allUsers} onSelectLesson={handleSelectLesson} />
                ) : user?.role === 'admin' ? (
                  <AdminDashboard user={user} allUsers={allUsers} />
                ) : user?.role === 'teacher' ? (
                  <TeacherDashboard user={user} allUsers={allUsers} />
                ) : (
                  <ParentDashboard user={user} allUsers={allUsers} />
                )
              ) : view === "social" ? (
                <SocialView accounts={allUsers} user={user!} />
              ) : view === "bank" ? (
                user && <HncoiBank user={user} />
              ) : view === "competition" ? (
                <CompetitionView user={user!} />
              ) : view === "profile" ? (
                user && <MyProfileView user={user} onUpdate={handleUpdateProfile} />
              ) : view === "notifications" ? (
                user && <NotificationView user={user} />
              ) : view === "admin_dashboard" ? (
                user && <AdminDashboard user={user} allUsers={allUsers} />
              ) : view === "super_dashboard" ? (
                user && <SuperDashboard user={user} allUsers={allUsers} onSelectLesson={handleSelectLesson} />
              ) : view === "teacher_dashboard" ? (
                user && <TeacherDashboard user={user} allUsers={allUsers} />
              ) : view === "parent_dashboard" ? (
                user && <ParentDashboard user={user} allUsers={allUsers} />
              ) : view === "theory" ? (
                <TheoryView lesson={activeLesson} />
              ) : (
                <ExerciseView lesson={activeLesson} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* AI Tutor Sidebar (Collapsible) */}
      <AnimatePresence>
        {isAIOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 lg:relative lg:translate-x-0 w-full sm:w-80 lg:w-96 shrink-0 shadow-2xl lg:shadow-none"
          >
            <div className="absolute top-4 left-4 z-50 lg:hidden">
              <button 
                onClick={() => setIsAIOpen(false)}
                className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-500 dark:text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <GeminiTutor currentLesson={activeLesson.title} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Website Logo Watermark */}
      <div className="fixed bottom-6 right-6 z-[60] pointer-events-none select-none opacity-20 group hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-800">
          <BookOpen className="text-blue-600 dark:text-blue-400" size={16} />
          <span className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase whitespace-nowrap">
            HocVui.vn
          </span>
        </div>
      </div>
    </div>
  );
}

