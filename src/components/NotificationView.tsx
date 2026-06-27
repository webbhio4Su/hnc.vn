import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle2, MessageSquare, AlertTriangle, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Notification, UserProfile } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface NotificationViewProps {
  user: UserProfile;
}

export default function NotificationView({ user }: NotificationViewProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!user) return;

    // We might want to filter notifications based on the user's role or class
    // For now, let's fetch all relevant announcements
    const q = query(
      collection(db, 'notifications'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as any;
        // Broadcast notifications don't have recipientId, show them to all.
        // Direct notifications have recipientId, only show if matched with current user's UID.
        if (!data.recipientId || data.recipientId === user.uid) {
          notes.push({ id: doc.id, ...data } as Notification);
        }
      });
      setNotifications(notes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      const noteRef = doc(db, 'notifications', id);
      await updateDoc(noteRef, { isRead: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotes = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const getIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Bell className="text-blue-500" size={20} />;
      case 'assignment': return <Calendar className="text-purple-500" size={20} />;
      case 'system': return <AlertTriangle className="text-amber-500" size={20} />;
      default: return <MessageSquare className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Thông báo</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cập nhật tin tức và bài tập mới nhất</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === 'all' 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === 'unread' 
              ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Chưa đọc
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
            >
              <Bell size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-bold">Không có thông báo nào</p>
            </motion.div>
          ) : (
            <div className="space-y-4 pb-8">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative p-6 rounded-2xl border-2 transition-all ${
                    note.isRead 
                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-500/10'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      note.isRead ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-100 dark:bg-blue-900/50'
                    }`}>
                      {getIcon(note.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-black tracking-tight truncate ${
                          note.isRead ? 'text-slate-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'
                        }`}>
                          {note.title}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {note.timestamp?.toDate ? formatDistanceToNow(note.timestamp.toDate(), { addSuffix: true, locale: vi }) : 'Vừa xong'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {note.content}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Từ: {note.senderName}
                        </span>
                        {!note.isRead && (
                          <button
                            onClick={() => markAsRead(note.id)}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700"
                          >
                            <CheckCircle2 size={12} />
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                    {(user.role === 'admin' || user.role === 'teacher') && (
                      <button
                        onClick={() => deleteNotification(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
