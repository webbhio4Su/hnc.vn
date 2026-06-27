import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Mic, Square, Trash2, Check, Video, Volume2, X } from "lucide-react";

interface MediaToolsProps {
  onCapture?: (blob: Blob) => void;
  onRecord?: (blob: Blob) => void;
}

export default function MediaTools({ onCapture, onRecord }: MediaToolsProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setCapturedImage(imageUrl);
          onCapture?.(blob);
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudio(audioUrl);
        onRecord?.(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {!isCameraOpen ? (
          <button 
            onClick={startCamera}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
          >
            <Camera size={16} />
            Mở Camera
          </button>
        ) : (
          <button 
            onClick={stopCamera}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all text-sm"
          >
            <X size={16} />
            Đóng Camera
          </button>
        )}

        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-xl font-bold hover:bg-purple-200 transition-all text-sm"
          >
            <Mic size={16} />
            Ghi âm bài đọc
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold animate-pulse transition-all text-sm"
          >
            <Square size={16} />
            Dừng ghi âm
          </button>
        )}
      </div>

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-sm"
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button 
                onClick={takePhoto}
                className="w-12 h-12 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full" />
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-4">
        {capturedImage && (
          <div className="relative group">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-32 h-32 object-cover rounded-2xl border-4 border-white dark:border-slate-800 shadow-md" 
            />
            <button 
              onClick={() => setCapturedImage(null)}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {recordedAudio && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 flex items-center gap-3">
            <Volume2 className="text-purple-600" />
            <audio src={recordedAudio} controls className="h-8 max-w-[200px]" />
            <button 
              onClick={() => setRecordedAudio(null)}
              className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
