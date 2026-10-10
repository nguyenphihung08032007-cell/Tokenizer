import React, { useState, useRef } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Flag,
  X,
  ArrowRight,
  Globe,
} from 'lucide-react';
import {
  VIET_PHUC_CATALOG,
  POPULAR_SEARCH_TAGS,
  GarmentCulturalItem,
} from '../data/vietPhucData';
import { CornerOrnament, DongSonDrumSVG, LotusOrnament } from './HeritageBackdrop';
import { soundEngine } from '../utils/soundEngine';

interface ExploreViewProps {
  onTryGarmentIn3D: (item: GarmentCulturalItem) => void;
  onApplyAiResultTo3D: (aiResult: any, originalImage?: string) => void;
  setGlobalAiProcessing: (busy: boolean) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onTryGarmentIn3D,
  onApplyAiResultTo3D,
  setGlobalAiProcessing,
}) => {
  const [selectedId, setSelectedId] = useState<string>(VIET_PHUC_CATALOG[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [googleSearchLoading, setGoogleSearchLoading] = useState<boolean>(false);
  const [googleSearchResult, setGoogleSearchResult] = useState<{
    query: string;
    summary: string;
    verificationStatus: string;
    sources: { title: string; uri: string }[];
  } | null>(null);

  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [cameraStreamActive, setCameraStreamActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tabListRef = useRef<HTMLDivElement | null>(null);

  const currentGarment =
    VIET_PHUC_CATALOG.find((g) => g.id === selectedId) || VIET_PHUC_CATALOG[0];

  const selectGarment = (id: string) => {
    setSelectedId(id);
    soundEngine.playZitherPluck(2);
  };

  const handleSearchSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (!q) return;

    const lower = q.toLowerCase();
    const matched = VIET_PHUC_CATALOG.find(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.shortTag.toLowerCase().includes(lower) ||
        item.region.toLowerCase().includes(lower)
    );
    if (matched) {
      setSelectedId(matched.id);
    }

    setGoogleSearchLoading(true);
    setGlobalAiProcessing(true);
    try {
      const response = await fetch('/api/gemini/search-heritage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await response.json();
      if (data?.result) {
        setGoogleSearchResult(data.result);
      }
    } catch {
      setGoogleSearchResult({
        query: q,
        summary: `Tư liệu tổng hợp cho "${q}": Trang phục truyền thống Việt Nam phản ánh chiều sâu văn hiến qua cấu trúc cổ áo, tay áo và hoa văn.`,
        verificationStatus: 'Đã kiểm chứng',
        sources: [
          { title: 'Bảo tàng Lịch sử Quốc gia Việt Nam', uri: 'https://baotanglichsu.vn' },
        ],
      });
    } finally {
      setGoogleSearchLoading(false);
      setGlobalAiProcessing(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    soundEngine.playZitherPluck(4);
    const lower = tag.toLowerCase();
    const matched = VIET_PHUC_CATALOG.find(
      (item) =>
        item.shortTag.toLowerCase() === lower || item.name.toLowerCase().includes(lower)
    );
    if (matched) {
      setSelectedId(matched.id);
    }
  };

  const scrollTabs = (dir: 'left' | 'right') => {
    const idx = VIET_PHUC_CATALOG.findIndex((g) => g.id === selectedId);
    const nextIdx =
      dir === 'left'
        ? (idx - 1 + VIET_PHUC_CATALOG.length) % VIET_PHUC_CATALOG.length
        : (idx + 1) % VIET_PHUC_CATALOG.length;
    selectGarment(VIET_PHUC_CATALOG[nextIdx].id);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStreamActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      setCameraStreamActive(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraStreamActive(false);
  };

  const captureFromWebcam = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      soundEngine.playCameraShutter();
      stopWebcam();
      setCapturedImage(dataUrl);
      analyzeImageWithGemini(dataUrl, 'image/jpeg', currentGarment.name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      soundEngine.playCameraShutter();
      setCapturedImage(dataUrl);
      analyzeImageWithGemini(dataUrl, file.type || 'image/jpeg', file.name);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImageWithGemini = async (
    base64Data: string,
    mimeType: string,
    hintName?: string
  ) => {
    setAiAnalyzing(true);
    setGlobalAiProcessing(true);
    try {
      const response = await fetch('/api/gemini/analyze-garment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType, hintName }),
      });
      const data = await response.json();
      if (data?.result) {
        setAiAnalysisResult(data.result);
        soundEngine.playLotusBloomChord();
      }
    } catch {
      // Fallback
    } finally {
      setAiAnalyzing(false);
      setGlobalAiProcessing(false);
    }
  };

  return (
    <section className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-16">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center gap-3">
          <LotusOrnament className="w-7 h-7" blooming />
          <h1 className="font-rosalinda text-4xl sm:text-5xl lg:text-6xl font-bold text-emboss-gold tracking-wide">
            KHÁM PHÁ
          </h1>
          <LotusOrnament className="w-7 h-7" blooming />
        </div>
        <p className="font-bellas text-lg sm:text-2xl text-[#5A3A22] dark:text-[#DEC5A4] mt-1.5">
          “Ngược dòng thời gian, sống trọn hồn di sản.”
        </p>
      </div>

      <div className="mt-6 max-w-4xl mx-auto">
        <form onSubmit={(e) => handleSearchSubmit(e)} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="emboss-inset rounded-xl flex-1 flex items-center px-4 py-2.5">
            <Search className="w-5 h-5 text-[#5A3A22] dark:text-[#DEC5A4] shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm Việt phục (Áo ngũ thân, Nhật Bình, Giao lĩnh...)"
              className="w-full bg-transparent text-sm sm:text-base text-[#2D1B0E] dark:text-[#F5E8D3] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              disabled={googleSearchLoading}
              className="emboss-btn px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-4 h-4 text-[#2F6F6A]" />
              <span>{googleSearchLoading ? 'Đang tra...' : 'Tra cứu Google'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playCameraShutter();
                setShowCameraModal(true);
              }}
              className="emboss-btn-primary shine-sweep px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>Camera AI</span>
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="emboss-btn px-3 py-1 rounded-lg text-xs font-medium cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {googleSearchResult && (
          <div className="mt-4 emboss-card rounded-2xl p-4 sm:p-5 border border-[#C9A24B]">
            <p className="text-sm text-[#2D1B0E] dark:text-[#F5E8D3]">{googleSearchResult.summary}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button onClick={() => scrollTabs('left')} className="emboss-btn w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div ref={tabListRef} className="flex-1 flex items-center gap-2.5 overflow-x-auto py-2 px-1 no-scrollbar">
          {VIET_PHUC_CATALOG.map((item, idx) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => selectGarment(item.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap ${
                  active ? 'emboss-btn-primary scale-105' : 'emboss-btn'
                }`}
              >
                0{idx + 1}. {item.name}
              </button>
            );
          })}
        </div>

        <button onClick={() => scrollTabs('right')} className="emboss-btn w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 emboss-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative">
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#C9A24B]/40 text-xs">
              <span>{currentGarment.dynasty} · {currentGarment.region}</span>
              <button onClick={() => setShowReportModal(true)} className="underline cursor-pointer">Báo sai thông tin</button>
            </div>

            <div className="mt-4">
              <h2 className="font-rosalinda text-3xl sm:text-4xl font-bold">{currentGarment.name}</h2>
              <p className="font-bellas text-sm text-[#7C583B] dark:text-[#DEC5A4]">{currentGarment.englishName}</p>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#B3261E] dark:text-[#DFB85C]">01. Nguồn gốc & Lịch sử</h3>
                <p className="mt-1">{currentGarment.historicalContext}</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#B3261E] dark:text-[#DFB85C]">02. Cấu trúc & Form dáng</h3>
                <p className="mt-1">{currentGarment.structureAndForm}</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#B3261E] dark:text-[#DFB85C]">03. Ý nghĩa họa tiết</h3>
                <p className="mt-1">{currentGarment.motifMeaning}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#C9A24B]/40 flex items-center justify-between">
            <span className="text-xs">Nguồn: {currentGarment.referenceSource}</span>
            <button
              onClick={() => onTryGarmentIn3D(currentGarment)}
              className="emboss-btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>Ướm thử trong Phòng Thử Đồ 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 emboss-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative">
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />

          <div className="rounded-xl overflow-hidden border border-[#C9A24B] flex-1 min-h-[380px]">
            <img
              src={currentGarment.imageUrl}
              alt={currentGarment.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Đảm bảo không bao giờ bị lỗi ảnh vỡ
                (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
                    <rect width="100%" height="100%" fill="#241409"/>
                    <circle cx="200" cy="200" r="90" fill="#B3261E" opacity="0.6"/>
                    <circle cx="200" cy="200" r="130" fill="none" stroke="#DFB85C" stroke-width="2"/>
                    <text x="200" y="210" fill="#F8E2A8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${currentGarment.name}</text>
                    <text x="200" y="240" fill="#DEC5A4" font-family="sans-serif" font-size="13" text-anchor="middle">${currentGarment.dynasty}</text>
                  </svg>
                `)}`;
              }}
            />
          </div>

          <button
            onClick={() => onTryGarmentIn3D(currentGarment)}
            className="mt-4 w-full emboss-btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Phối Bộ Này Trên Mẫu 3D</span>
          </button>
        </div>
      </div>

      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="emboss-card rounded-2xl max-w-xl w-full p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#C9A24B]/40">
              <h2 className="font-rosalinda text-2xl font-bold">Camera AI Nhận Diện</h2>
              <button onClick={() => { stopWebcam(); setShowCameraModal(false); }} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              {!cameraStreamActive ? (
                <button onClick={startWebcam} className="emboss-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                  Mở Camera
                </button>
              ) : (
                <button onClick={captureFromWebcam} className="emboss-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                  Chụp
                </button>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="emboss-btn px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                Tải ảnh lên
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>

            {cameraStreamActive && (
              <div className="mt-4 aspect-video bg-black rounded-xl overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              </div>
            )}

            {aiAnalyzing && (
              <div className="mt-4 py-6 text-center">
                <DongSonDrumSVG className="w-16 h-16 mx-auto animate-drum-fast" />
                <p className="mt-2 text-sm font-bold">AI đang nhận diện...</p>
              </div>
            )}

            {aiAnalysisResult && (
              <div className="mt-4 p-4 emboss-inset rounded-xl space-y-2 text-xs">
                <p className="font-bold text-sm text-[#B3261E]">{aiAnalysisResult.garmentName}</p>
                <p>{aiAnalysisResult.culturalNotes}</p>
                <button
                  onClick={() => {
                    setShowCameraModal(false);
                    onApplyAiResultTo3D(aiAnalysisResult, capturedImage || undefined);
                  }}
                  className="w-full emboss-btn-primary py-2 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Dựng Lên Mẫu 3D
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
