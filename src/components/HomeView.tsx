import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Play,
  Layers,
  Palette,
  ShieldCheck,
  UserCheck,
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkle,
} from 'lucide-react';
import { CornerOrnament, LotusOrnament } from './HeritageBackdrop';
import { soundEngine } from '../utils/soundEngine';
import { createHeritageSvgImage } from '../data/vietPhucData';
import { CULTURAL_CONTEXTS, CulturalContextPreset } from './FittingRoomView';

export type AppPage = 'home' | 'explore' | 'fitting-room' | 'lookbook';

interface HomeViewProps {
  onNavigate: (page: AppPage) => void;
  lang: 'vi' | 'en';
  onStartDemoTour: () => void;
  onSelectFittingStep?: (step: 'context' | 'needs' | 'styling' | 'culture', contextId?: string) => void;
}

interface TramCarData {
  id: AppPage;
  number: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  previewImg: string;
  icon: React.ReactNode;
}

const TRAM_CARS: TramCarData[] = [
  {
    id: 'explore',
    number: 'TOA 01',
    titleVi: 'KHÁM PHÁ',
    titleEn: 'HERITAGE ARCHIVE',
    subtitleVi: 'Ngược dòng thời gian, sống trọn hồn di sản',
    subtitleEn: 'Journey through dynasties of Vietnamese attire',
    descriptionVi:
      'Bách khoa toàn thư thị giác đưa người trẻ chu du qua các triều đại lịch sử để tra cứu nguồn gốc, phom dáng và ý nghĩa văn hóa của từng tà áo Việt cùng AI Gemini Vision.',
    descriptionEn:
      'A visual encyclopedia guiding youth through historical eras to discover the origins, silhouettes, and cultural meanings of traditional garments with AI Gemini Vision.',
    previewImg: createHeritageSvgImage('Bách Khoa Di Sản', '#1E3A5F', '#C9A24B', 'Thủy Ba Cổ Phong', 'ao-giao-linh'),
    icon: <Compass className="w-5 h-5" />,
  },
  {
    id: 'fitting-room',
    number: 'TOA 02',
    titleVi: 'PHÒNG THỬ ĐỒ 3D',
    titleEn: '3D PARAMETRIC STUDIO',
    subtitleVi: 'Ướm nét xưa, tỏ chất riêng',
    subtitleEn: 'Parametric 3D try-on & AI Cultural Remix',
    descriptionVi:
      'Quy trình 4 bước hoàn chỉnh: Chọn bối cảnh văn hóa → Nhập số đo cơ thể thực tế (chiều cao, cân nặng biến đổi 3D trực tiếp) → Phối nhiều lớp áo với bảng màu RGB tự do → Bảo đảm tính tôn nghiêm di sản & Xuất thẻ gợi ý mockup.',
    descriptionEn:
      'Complete 4-step workflow: Cultural Context → Parametric Body Metrics (live 3D weight scaling) → Multi-layer RGB Styling → Cultural Guard & Mockup Look Card.',
    previewImg: createHeritageSvgImage('Thử Đồ 3D Parametric', '#B3261E', '#DFB85C', 'Ngũ Thân & Nón Lá', 'ao-nhat-binh'),
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 'lookbook',
    number: 'TOA 03',
    titleVi: 'LOOKBOOK VIỆT PHỤC',
    titleEn: 'HERITAGE LOOKBOOK',
    subtitleVi: 'Lưu giữ bản phối, lan tỏa sắc y',
    subtitleEn: 'Curate & share your Vietnamese fashion lookbook',
    descriptionVi:
      'Tập san phong cách số lật trang tương tác (Flipbook) lưu giữ những bản phối tâm đắc nhất, gắn triện vàng di sản và xuất bản lên cộng đồng sau khi vượt qua bộ lọc văn hóa.',
    descriptionEn:
      'A digital interactive flipbook preserving your favorite remixes, certified with golden heritage seals and shared with the community through cultural moderation.',
    previewImg: createHeritageSvgImage('Lookbook Lật Tập San', '#2F6F6A', '#E7A1B0', 'Kinh Bắc Duyên Dáng', 'ao-tu-than'),
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  lang,
  onStartDemoTour,
  onSelectFittingStep,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);

  const activeCar = TRAM_CARS[activeIndex];

  const selectCar = (newIndex: number) => {
    const normalized = (newIndex + TRAM_CARS.length) % TRAM_CARS.length;
    if (normalized === activeIndex) return;
    const direction = normalized > activeIndex ? 1 : -1;
    setWheelRotation((prev) => prev + direction * 180);
    setActiveIndex(normalized);
    soundEngine.playZitherPluck(normalized + 1);
  };

  const handlePrev = () => selectCar(activeIndex - 1);
  const handleNext = () => selectCar(activeIndex + 1);

  const handleEnterCar = (carId: AppPage) => {
    soundEngine.playLotusBloomChord();
    onNavigate(carId);
  };

  const handleStepClick = (step: 'context' | 'needs' | 'styling' | 'culture', contextId?: string) => {
    soundEngine.playLotusBloomChord();
    if (onSelectFittingStep) {
      onSelectFittingStep(step, contextId);
    } else {
      onNavigate('fitting-room');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        selectCar(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        selectCar(activeIndex + 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEnterCar(TRAM_CARS[activeIndex].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
    touchStartX.current = null;
  };

  const getRelativeOffset = (idx: number) => {
    const diff = idx - activeIndex;
    if (diff === 0) return 0;
    if (diff === -1 || diff === 2) return -1;
    return 1;
  };

  return (
    <div
      className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-16 flex flex-col gap-10"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* PHẦN 1: HERO & TOA XE DI SẢN */}
      <section className="flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 relative pt-1">
            <div className="relative inline-block">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#B3261E]/15 text-[#B3261E] dark:bg-[#DFB85C]/20 dark:text-[#DFB85C] border border-[#B3261E]/30 mb-2">
                <Sparkle className="w-3.5 h-3.5 fill-current" />
                Nền tảng Việt phục 3D & AI Cultural Remix hàng đầu
              </span>
              <h1 className="font-rosalinda text-6xl sm:text-7xl lg:text-8xl font-bold tracking-wider text-emboss-gold select-none leading-none">
                VLINE
              </h1>
            </div>

            <p className="font-bellas text-xl sm:text-2xl lg:text-[26px] text-[#5A3A22] dark:text-[#DEC5A4] mt-2 text-emboss-heritage">
              {lang === 'vi'
                ? '“Nối mạch ngàn năm, vẽ nét thời đại”'
                : '“Bridging millennia of heritage, sketching the spirit of Gen Z”'}
            </p>

            <p className="mt-3 text-sm sm:text-base text-[#5A3A22]/90 dark:text-[#DEC5A4]/85 max-w-xl leading-relaxed">
              {lang === 'vi'
                ? 'Không gian văn hóa số đưa người trẻ chu du qua các triều đại lịch sử, trải nghiệm phối đồ 3D tương tác theo số đo cơ thể thực tế, tự do đổi màu RGB đa tầng và lưu giữ các bản phối di sản đạt chuẩn mực.'
                : 'A digital cultural studio empowering Vietnamese students to explore traditional garments, try on 3D outfits by parametric body metrics, and remix heritage attire respectfully.'}
            </p>

            {/* CÁC NÚT ĐIỀU HƯỚNG NHANH */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleEnterCar(activeCar.id)}
                className="emboss-btn-primary shine-sweep px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition"
              >
                <span>{lang === 'vi' ? `Lên ${activeCar.titleVi}` : `Enter ${activeCar.titleEn}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleStepClick('context')}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#2F6F6A] text-white hover:bg-[#255753] shadow flex items-center gap-2 transition"
              >
                <Sliders className="w-4 h-4" />
                <span>Bắt đầu Phối đồ 4 Bước</span>
              </button>

              <button
                onClick={onStartDemoTour}
                className="emboss-btn shine-sweep px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A3A22] dark:text-[#F5E8D3] flex items-center gap-2 cursor-pointer transition"
              >
                <Play className="w-4 h-4 text-[#B3261E] dark:text-[#DFB85C]" />
                <span>{lang === 'vi' ? 'Trình chiếu Demo (90s)' : 'Judge Demo Mode (90s)'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-end">
            <div className="wood-plaque rounded-2xl p-5 sm:p-6 w-full max-w-xl relative transition-all duration-300 shadow-xl border border-[#C9A24B]/40">
              <CornerOrnament position="tl" />
              <CornerOrnament position="tr" />
              <CornerOrnament position="bl" />
              <CornerOrnament position="br" />

              <div className="flex items-center justify-between border-b border-[#C9A24B]/35 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <LotusOrnament className="w-6 h-6" blooming />
                  <span className="font-mono-num text-xs tracking-widest text-[#DFB85C] uppercase font-bold">
                    {activeCar.number} · {lang === 'vi' ? 'CHỈ DẪN HÀNH TRÌNH' : 'DISPATCH'}
                  </span>
                </div>
                <span className="text-xs text-[#E8D3B5]/80 font-bellas">
                  {lang === 'vi' ? 'Bấm Enter hoặc nhấp để vào' : 'Press Enter'}
                </span>
              </div>

              <h2 className="font-rosalinda text-2xl sm:text-3xl font-bold text-[#F8E2A8] tracking-wide">
                {lang === 'vi' ? activeCar.titleVi : activeCar.titleEn}
              </h2>
              <p className="font-bellas text-sm text-[#E7A1B0] mt-0.5">
                {lang === 'vi' ? activeCar.subtitleVi : activeCar.subtitleEn}
              </p>

              <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-[#F7EBDA]/95">
                {lang === 'vi' ? activeCar.descriptionVi : activeCar.descriptionEn}
              </p>

              <div className="mt-5 pt-3 border-t border-[#C9A24B]/25 flex items-center justify-between text-xs text-[#DFB85C]">
                <div className="flex items-center gap-2">
                  {TRAM_CARS.map((car, i) => (
                    <button
                      key={car.id}
                      onClick={() => selectCar(i)}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap font-medium ${
                        i === activeIndex
                          ? 'bg-[#C9A24B] text-[#2D1B0E] font-bold shadow-xs'
                          : 'text-[#E8D3B5]/75 hover:text-[#F8E2A8]'
                      }`}
                    >
                      {lang === 'vi' ? car.titleVi : car.titleEn}
                    </button>
                  ))}
                </div>
                <span className="font-mono-num font-bold">0{activeIndex + 1} / 03</span>
              </div>
            </div>
          </div>
        </div>

        {/* BĂNG CHUYỀN XE ĐIỆN DI SẢN */}
        <div className="relative mt-8 pt-2 pb-6 flex flex-col items-center justify-center min-h-[380px]">
          <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center min-h-[320px]">
            <button
              onClick={handlePrev}
              aria-label="Toa trước"
              className="emboss-btn shine-sweep z-30 absolute left-1 sm:left-4 w-11 h-11 rounded-full flex items-center justify-center text-[#5A3A22] dark:text-[#F5E8D3] cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative w-full flex items-center justify-center">
              {TRAM_CARS.map((car, index) => {
                const offset = getRelativeOffset(index);
                const isCenter = offset === 0;

                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      if (isCenter) handleEnterCar(car.id);
                      else selectCar(index);
                    }}
                    className={`transition-all duration-500 ease-out cursor-pointer select-none w-[300px] sm:w-[430px] lg:w-[490px] ${
                      offset === 0
                        ? 'relative z-20 scale-100 opacity-100 translate-x-0'
                        : offset === -1
                        ? 'absolute z-10 scale-[0.78] opacity-60 -translate-x-[58%] sm:-translate-x-[72%]'
                        : 'absolute z-10 scale-[0.78] opacity-60 translate-x-[58%] sm:translate-x-[72%]'
                    }`}
                  >
                    <div className="mx-auto w-[86%] h-6 rounded-t-2xl bg-gradient-to-r from-[#5A3A22] via-[#8E1B15] to-[#5A3A22] border-t-2 border-x-2 border-[#C9A24B] flex items-center justify-center gap-3 shadow-md">
                      <span className="font-mono-num text-[11px] tracking-widest text-[#F8E2A8] font-semibold">
                        {car.number}
                      </span>
                    </div>

                    <div
                      className={`emboss-card shine-sweep rounded-2xl p-4 sm:p-5 border-2 ${
                        isCenter ? 'border-[#C9A24B] ring-2 ring-[#C9A24B]/40' : 'border-[#C9A24B]/50'
                      }`}
                    >
                      <CornerOrnament position="tl" />
                      <CornerOrnament position="tr" />
                      <CornerOrnament position="bl" />
                      <CornerOrnament position="br" />

                      <div className="text-center pb-3 border-b border-[#C9A24B]/40">
                        <div className="inline-flex items-center gap-2 text-[#B3261E] dark:text-[#DFB85C]">
                          {car.icon}
                          <h3 className="font-rosalinda text-2xl sm:text-3xl font-bold tracking-wide text-[#2D1B0E] dark:text-[#F5E8D3]">
                            {lang === 'vi' ? car.titleVi : car.titleEn}
                          </h3>
                        </div>
                        <p className="font-bellas text-xs sm:text-sm text-[#5A3A22] dark:text-[#DEC5A4] mt-0.5">
                          {lang === 'vi' ? car.subtitleVi : car.subtitleEn}
                        </p>
                      </div>

                      {/* KHUNG MINH HỌA SẮC NÉT KHÔNG LỖI */}
                      <div className="my-3 flex items-center justify-center h-36 bg-[#382214]/10 dark:bg-black/20 rounded-xl border border-[#C9A24B]/30 overflow-hidden relative group">
                        <img
                          src={car.previewImg}
                          alt={car.titleVi}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                          <span className="font-rosalinda text-sm text-[#F8E2A8] font-bold">
                            {car.titleVi} — {car.subtitleVi}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#C9A24B]/40 flex items-center justify-between">
                        <span className="text-xs text-[#5A3A22] dark:text-[#DEC5A4]">
                          {isCenter ? 'Nhấn để mở ngay' : 'Nhấn để chọn toa'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
                            isCenter ? 'bg-[#B3261E] text-white shadow-xs' : 'bg-[#E8D3B5] dark:bg-[#382214]'
                          }`}
                        >
                          <span>{isCenter ? 'Bước lên toa' : 'Xem toa này'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    <div className="mx-auto w-[92%] h-3 bg-[#3E2513] border-x border-b border-[#C9A24B] rounded-b-lg flex items-center justify-between px-8 relative">
                      {[0, 1].map((wIdx) => (
                        <div
                          key={wIdx}
                          style={{ transform: `rotate(${wheelRotation}deg)` }}
                          className="w-8 h-8 -bottom-3.5 relative rounded-full bg-[#2D1B0E] border-2 border-[#C9A24B] shadow-md flex items-center justify-center transition-transform duration-700"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#B3261E]" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              aria-label="Toa tiếp theo"
              className="emboss-btn shine-sweep z-30 absolute right-1 sm:right-4 w-11 h-11 rounded-full flex items-center justify-center text-[#5A3A22] dark:text-[#F5E8D3] cursor-pointer shadow-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* PHẦN 2: QUY TRÌNH 4 BƯỚC PHỐI ĐỒ CỐT LÕI (TRỌNG TÂM ĐỀ BÀI) */}
      <section className="bg-white/80 dark:bg-[#1A120C]/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-[#C9A24B]/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#C9A24B]/30 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#B3261E] text-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KHUNG TRẢI NGHIỆM ĐỒNG BỘ 4 BƯỚC</span>
            </div>
            <h2 className="font-rosalinda text-2xl sm:text-3xl font-black text-emboss-gold mt-2">
              Hành Trình Phối Việt Phục Chuẩn Di Sản
            </h2>
            <p className="text-xs sm:text-sm text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 mt-1">
              Đáp ứng trọn vẹn yêu cầu cốt lõi: Chọn bối cảnh → Xác định nhu cầu → Phác thảo phối lớp & Đổi màu RGB → Bảo đảm văn hóa & Xuất mockup.
            </p>
          </div>

          <button
            onClick={() => handleStepClick('context')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1A120C] hover:brightness-110 shadow flex items-center gap-2 self-start sm:self-auto shrink-0 transition"
          >
            <span>Mở Phòng Thử Đồ Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 THẺ BƯỚC INTERACTIVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BƯỚC 1 */}
          <div
            onClick={() => handleStepClick('context')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 hover:border-[#B3261E] dark:hover:border-[#DFB85C] hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#B3261E] text-white flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B3261E] dark:text-[#DFB85C]">
                  Khởi nguyên
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-base text-[#5A3A22] dark:text-[#F5E8D3] group-hover:text-[#B3261E] dark:group-hover:text-[#DFB85C] transition">
                <Compass className="w-5 h-5 text-[#C9A24B]" />
                <h3>Bối Cảnh & Nhóm Y Phục</h3>
              </div>
              <p className="text-xs text-[#5A3A22]/75 dark:text-[#E8D3B5]/75 leading-relaxed">
                Chọn 1 trong 5 bối cảnh văn hóa tiêu biểu: Hoàng Gia Huế, Học Đường Kỷ Yếu, Hội Làng Kinh Bắc, Nam Bộ Miệt Vườn hoặc Cổ Phong Đại Việt.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-semibold text-[#B3261E] dark:text-[#DFB85C]">
              <span>5 Bối cảnh mẫu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* BƯỚC 2 */}
          <div
            onClick={() => handleStepClick('needs')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 hover:border-[#B3261E] dark:hover:border-[#DFB85C] hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#2F6F6A] text-white flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6F6A] dark:text-[#DFB85C]">
                  Cá nhân hóa
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-base text-[#5A3A22] dark:text-[#F5E8D3] group-hover:text-[#2F6F6A] dark:group-hover:text-[#DFB85C] transition">
                <UserCheck className="w-5 h-5 text-[#2F6F6A]" />
                <h3>Nhu Cầu & Số Đo Vóc Dáng</h3>
              </div>
              <p className="text-xs text-[#5A3A22]/75 dark:text-[#E8D3B5]/75 leading-relaxed">
                Tùy biến vóc dáng Mannequin 3D với thanh trượt cân nặng (38-110kg) và chiều cao (140-195cm) biến dạng hình thể tức thì theo thời gian thực.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-semibold text-[#2F6F6A] dark:text-[#DFB85C]">
              <span>Biến dạng 3D trực tiếp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* BƯỚC 3 */}
          <div
            onClick={() => handleStepClick('styling')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 hover:border-[#B3261E] dark:hover:border-[#DFB85C] hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#C9A24B] text-[#1A120C] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24B]">
                  Sáng tạo
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-base text-[#5A3A22] dark:text-[#F5E8D3] group-hover:text-[#C9A24B] transition">
                <Palette className="w-5 h-5 text-[#C9A24B]" />
                <h3>Phối Lớp & Đổi Màu RGB</h3>
              </div>
              <p className="text-xs text-[#5A3A22]/75 dark:text-[#E8D3B5]/75 leading-relaxed">
                Bóc tách từng lớp (áo ngoài, áo trong, quần/váy, viền cổ). Chọn màu RGB tùy ý, gắn Nón lá, Khăn vấn, Nón quai thao, Hài thêu hay Sneaker trẻ trung.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-semibold text-[#C9A24B]">
              <span>Bảng màu RGB tự do</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* BƯỚC 4 */}
          <div
            onClick={() => handleStepClick('culture')}
            className="group cursor-pointer p-5 rounded-2xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 hover:border-[#B3261E] dark:hover:border-[#DFB85C] hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#8E1B15] text-white flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E1B15] dark:text-[#DFB85C]">
                  Chuẩn mực
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-base text-[#5A3A22] dark:text-[#F5E8D3] group-hover:text-[#8E1B15] dark:group-hover:text-[#DFB85C] transition">
                <ShieldCheck className="w-5 h-5 text-[#8E1B15] dark:text-[#DFB85C]" />
                <h3>Cultural Guard & Mockup</h3>
              </div>
              <p className="text-xs text-[#5A3A22]/75 dark:text-[#E8D3B5]/75 leading-relaxed">
                Đánh giá chuẩn di sản 100/100, đọc tóm tắt nguồn gốc ý nghĩa trang phục, tự động sửa lỗi 1-chạm và xuất Thẻ Gợi Ý Mockup kèm mã QR tải về máy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs font-semibold text-[#8E1B15] dark:text-[#DFB85C]">
              <span>Xuất Thẻ Mockup PNG</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* DẢI 5 BỐI CẢNH VĂN HÓA TIÊU BIỂU CLICK-TO-TRY TRỰC TIẾP */}
        <div className="pt-4 border-t border-[#C9A24B]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A3A22] dark:text-[#DFB85C] flex items-center gap-1.5">
              <span>✦</span>
              <span>Chọn nhanh bối cảnh để ướm thử tức thì lên Mannequin 3D:</span>
            </h4>
            <span className="text-[11px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic hidden sm:inline">
              Nhấp vào thẻ để tự động kích hoạt bối cảnh và bộ y phục tương ứng
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CULTURAL_CONTEXTS.map((ctx) => (
              <button
                key={ctx.id}
                onClick={() => handleStepClick('context', ctx.id)}
                className="p-3 rounded-xl bg-white/60 dark:bg-black/30 border border-[#C9A24B]/30 hover:border-[#B3261E] dark:hover:border-[#DFB85C] text-left hover:shadow transition group cursor-pointer"
              >
                <div className="text-xl mb-1">{ctx.icon}</div>
                <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F5E8D3] group-hover:text-[#B3261E] dark:group-hover:text-[#DFB85C] line-clamp-1">
                  {ctx.title}
                </div>
                <div className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 line-clamp-1">
                  {ctx.garmentName}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C9A24B]/15 text-[#5A3A22] dark:text-[#DFB85C]">
                  <span>{ctx.tag}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PHẦN 3: BẢNG CHỈ SỐ DI SẢN & CAM KẾT VĂN HÓA */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-[#C9A24B]/30">
          <div className="font-rosalinda text-3xl font-bold text-emboss-gold">8+</div>
          <div className="text-xs text-[#5A3A22] dark:text-[#E8D3B5] font-semibold mt-0.5">Triều Đại & Vùng Miền</div>
          <div className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">Lý · Trần · Lê · Nguyễn · Nam Bộ</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-[#C9A24B]/30">
          <div className="font-rosalinda text-3xl font-bold text-[#B3261E] dark:text-[#DFB85C]">38 - 110 kg</div>
          <div className="text-xs text-[#5A3A22] dark:text-[#E8D3B5] font-semibold mt-0.5">Dáng Người Parametric</div>
          <div className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">Thu nhỏ / phóng to tỷ lệ chuẩn xác</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-[#C9A24B]/30">
          <div className="font-rosalinda text-3xl font-bold text-[#2F6F6A] dark:text-[#DFB85C]">16.7 Triệu</div>
          <div className="text-xs text-[#5A3A22] dark:text-[#E8D3B5] font-semibold mt-0.5">Màu Sắc RGB Tự Do</div>
          <div className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">Tùy biến từng lớp vải & phụ kiện</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-[#C9A24B]/30">
          <div className="font-rosalinda text-3xl font-bold text-[#DFB85C]">100%</div>
          <div className="text-xs text-[#5A3A22] dark:text-[#E8D3B5] font-semibold mt-0.5">Chuẩn Mực Cultural Guard</div>
          <div className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">Kiểm duyệt di sản & Thẻ Mockup</div>
        </div>
      </section>
    </div>
  );
};
