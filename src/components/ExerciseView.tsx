import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lesson } from "../data/lessons";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Clock, AlertCircle, Volume2, Mic, Camera } from "lucide-react";
import MediaTools from "./MediaTools";

interface ExerciseViewProps {
  lesson: Lesson;
}

export default function ExerciseView({ lesson }: ExerciseViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question

  const currentExercise = lesson.exercises[currentIdx];

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentExercise.question);
    utterance.lang = lesson.category === "Tiếng Anh" ? "en-US" : "vi-VN";
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentExercise.correctAnswer) {
      setScore(s => s + 1);
    }
  }, [isSubmitted, selectedOption, currentExercise.correctAnswer]);

  // Timer logic
  useEffect(() => {
    if (showResult || isSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, isSubmitted, handleSubmit]);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleNext = () => {
    if (currentIdx < lesson.exercises.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeLeft(60);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
    setTimeLeft(60);
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center py-20"
      >
        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-100 dark:shadow-none">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Hoàn thành bài tập!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-10 text-xl">
          Sắc bén lắm! Bạn đã trả lời đúng <span className="font-bold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">{score}/{lesson.exercises.length}</span> câu hỏi.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={reset}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
          >
            <RotateCcw size={20} />
            Thử thách lại
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Bài tập vận dụng</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Chọn câu trả lời đúng nhất</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${
            timeLeft < 10 
            ? "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse" 
            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
          }`}>
            <Clock size={18} />
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
          </div>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl">
            Câu {currentIdx + 1} / {lesson.exercises.length}
          </span>
        </div>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-start justify-between gap-4 mb-10">
            <p className="text-xl text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              {currentExercise.question}
            </p>
            <button 
              onClick={playAudio}
              className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 transition-all shrink-0"
              title="Nghe câu hỏi"
            >
              <Volume2 size={24} />
            </button>
          </div>

          {/* Always show Media Tools as requested */}
          <div className="mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">Công cụ hỗ trợ học tập</label>
            <MediaTools />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentExercise.correctAnswer;
              
              let variant = "default";
              if (isSubmitted) {
                if (isCorrect) variant = "correct";
                else if (isSelected) variant = "wrong";
              } else if (isSelected) {
                variant = "selected";
              }

              const classes = {
                default: "border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-slate-600 dark:text-slate-400",
                selected: "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold shadow-lg shadow-blue-100 dark:shadow-none",
                correct: "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-bold shadow-lg shadow-green-100 dark:shadow-none",
                wrong: "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-bold shadow-lg shadow-red-100 dark:shadow-none"
              };

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isSubmitted}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${classes[variant as keyof typeof classes]}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                      isSelected 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg">{option}</span>
                  </div>
                  {isSubmitted && isCorrect && <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle size={24} className="text-red-600 dark:text-red-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-3xl border-2 ${
                selectedOption === currentExercise.correctAnswer 
                ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-900 dark:text-green-300" 
                : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${selectedOption === currentExercise.correctAnswer ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                  {selectedOption === currentExercise.correctAnswer ? <Trophy size={24} /> : <AlertCircle size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    {selectedOption === currentExercise.correctAnswer ? "Tuyệt vời! Chính xác." : "Tiếc quá! Chưa đúng rồi."}
                  </h4>
                  <p className="opacity-80 font-medium leading-relaxed">{currentExercise.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end pt-4">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-12 py-4 bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white font-bold rounded-2xl shadow-xl dark:shadow-none transition-all active:scale-95"
            >
              {currentIdx === lesson.exercises.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
