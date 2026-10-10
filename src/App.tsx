import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Award,
  Play,
  Square,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { HeritageBackdrop, CornerOrnament, LotusOrnament } from './components/HeritageBackdrop';
import { HomeView, AppPage } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { FittingRoomView } from './components/FittingRoomView';
import { LookbookView } from './components/LookbookView';
import {
  OutfitConfiguration,
  LookbookEntry,
  INITIAL_LOOKBOOK_ITEMS,
  GarmentCulturalItem,
} from './data/vietPhucData';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);

  // Outfit hiện tại trong Phòng Thử Đồ
  const [currentOutfit, setCurrentOutfit] = useState<OutfitConfiguration>(
    INITIAL_LOOKBOOK_ITEMS[0].outfitConfig
  );

  // Lookbook cá nhân
  const [personalLookbook, setPersonalLookbook] = useState<LookbookEntry[]>([
    INITIAL_LOOKBOOK_ITEMS[0],
  ]);

  // Modal 5 Luận điểm khác biệt đoạt giải
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);

  // Tab & Bối cảnh ban đầu cho Phòng Thử Đồ khi điều hướng từ Trang Chủ
  const [initialFittingTab, setInitialFittingTab] = useState<'context' | 'needs' | 'styling' | 'culture'>('context');
  const [initialContextId, setInitialContextId] = useState<string>('hoc-duong-ky-yeu');

  // Tour thuyết trình 90s tự động
  const [demoTourActive, setDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(0);

  // Quản lý chế độ tối trên HTML body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Điều khiển âm thanh
  const toggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    soundEngine.enabled = nextState;
    if (nextState) {
      soundEngine.playZitherPluck(0);
    }
  };

  // Chuyển trang và gảy đàn tranh
  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    soundEngine.playZitherPluck(
      page === 'home' ? 0 : page === 'explore' ? 1 : page === 'fitting-room' ? 2 : 3
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nhận yêu cầu thử đồ 3D từ trang Khám Phá
  const handleTryIn3DFromExplore = (item: GarmentCulturalItem) => {
    setCurrentOutfit((prev) => ({
      ...prev,
      title: item.name,
      garmentModel: item.default3D.garmentModel as any,
      colors: {
        ...prev.colors,
        outerRobe: item.default3D.primaryColor,
        innerShirt: item.default3D.secondaryColor,
        bottomWear: item.default3D.bottomColor,
        collarAndTrim: item.default3D.trimColor,
        accessory: item.default3D.trimColor,
      },
      fabricId: item.default3D.fabricId,
      patternId: item.default3D.patternId,
      bottomType: item.default3D.bottomType as any,
      headwear: item.default3D.headwear as any,
      handAccessory: item.default3D.handAccessory as any,
      footwear: item.default3D.footwear as any,
      remixLevel: item.default3D.remixLevel,
    }));
    navigateTo('fitting-room');
  };

  // Lưu trang phục từ Phòng Thử Đồ vào Lookbook cá nhân
  const handleSaveToLookbook = (outfit: OutfitConfiguration) => {
    const newEntry: LookbookEntry = {
      id: `personal-lb-${Date.now()}`,
      title: outfit.title || 'Việt Phục Remix Cá Nhân',
      author: 'Tôi',
      authorRole: 'Nhà thiết kế Trẻ',
      createdAt: 'Hôm nay',
      imageUrl: INITIAL_LOOKBOOK_ITEMS[0].imageUrl,
      styleTag: `Remix ${outfit.remixLevel}%`,
      occasion: outfit.stylistAnswers.occasion || 'Dạo phố',
      description: `Phối ${outfit.garmentModel} cùng phong cách Gen Z đương đại.`,
      culturalMeaning: 'Nối mạch truyền thống, hòa nhịp cùng cá tính thời trang trẻ.',
      culturalScore: 95,
      likes: 1,
      isPublic: false,
      isVerified: true,
      outfitConfig: outfit,
    };
    setPersonalLookbook((prev) => [newEntry, ...prev]);
  };

  // Bắt đầu Tour Trình Chiếu Demo 90s
  const startDemoTour = () => {
    setDemoTourActive(true);
    setDemoTourStep(0);
    navigateTo('home');
    soundEngine.playZitherPluck(0);
  };

  // Hiệu ứng bước chạy của Demo Tour
  useEffect(() => {
    if (!demoTourActive) return;

    const tourSteps: { page: AppPage; duration: number }[] = [
      { page: 'home', duration: 8000 },
      { page: 'explore', duration: 12000 },
      { page: 'fitting-room', duration: 18000 },
      { page: 'lookbook', duration: 12000 },
    ];

    const currentTour = tourSteps[demoTourStep];
    if (currentTour) {
      navigateTo(currentTour.page);
      const timer = setTimeout(() => {
        if (demoTourStep < tourSteps.length - 1) {
          setDemoTourStep((prev) => prev + 1);
        } else {
          setDemoTourActive(false);
          setDemoTourStep(0);
        }
      }, currentTour.duration);
      return () => clearTimeout(timer);
    }
  }, [demoTourActive, demoTourStep]);

  return (
    <div
      className={`relative min-h-screen text-[#5A3A22] dark:text-[#F5EBE0] transition-colors duration-500 font-sans selection:bg-[#B3261E] selection:text-white ${
        darkMode ? 'bg-[#1A120C]' : 'bg-[#EFE0CC]'
      }`}
    >
      {/* Phông nền di sản: Giấy Dó, Trống Đồng, Rồng Thời Lý-Trần, Mưa Cánh Hoa Đào */}
      <HeritageBackdrop isAiProcessing={isAiProcessing} darkMode={darkMode} />

      {/* Hoa văn góc di sản */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG (TOP BAR 3 KHU VỰC) */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF4EB]/85 dark:bg-[#1A120C]/90 backdrop-blur-md border-b border-[#C9A24B]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* KHU VỰC 1: BRAND LOGO */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B3261E] to-[#C9A24B] flex items-center justify-center text-white shadow-md border border-[#F8E2A8]/50 group-hover:scale-105 transition-transform">
              <span className="font-['SVN-Rosalinda'] font-bold text-lg">V</span>
            </div>
            <div>
              <div className="font-['SVN-Rosalinda'] text-xl font-black text-emboss-gold leading-none tracking-wider">
                VLINE
              </div>
              <div className="font-['SVN-Bellas'] text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic leading-tight">
                Nối mạch ngàn năm, vẽ nét thời đại
              </div>
            </div>
          </div>

          {/* KHU VỰC 2: MENU ĐIỀU HƯỚNG */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {[
              { id: 'home', label: 'Trang Chủ' },
              { id: 'explore', label: 'Khám Phá' },
              { id: 'fitting-room', label: 'Phòng Thử Đồ' },
              { id: 'lookbook', label: 'Lookbook' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id as AppPage)}
                className={`relative px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  currentPage === tab.id
                    ? 'text-[#B3261E] dark:text-[#DFB85C] font-bold bg-[#C9A24B]/15'
                    : 'text-[#5A3A22] dark:text-[#E8D3B5] hover:text-[#B3261E] hover:bg-[#C9A24B]/10'
                }`}
              >
                {tab.label}
                {currentPage === tab.id && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#B3261E] dark:via-[#DFB85C] to-transparent" />
                )}
              </button>
            ))}
          </nav>

          {/* KHU VỰC 3: CÔNG CỤ & HỒ SƠ DỰ THI */}
          <div className="flex items-center gap-2">
            {/* Nút Demo Tour */}
            <button
              onClick={demoTourActive ? () => setDemoTourActive(false) : startDemoTour}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs border transition ${
                demoTourActive
                  ? 'bg-[#B3261E] text-white border-[#B3261E] animate-pulse'
                  : 'bg-gradient-to-r from-[#DFB85C]/20 to-[#C9A24B]/20 text-[#5A3A22] dark:text-[#F8E2A8] border-[#C9A24B] hover:shadow'
              }`}
            >
              {demoTourActive ? (
                <>
                  <Square className="w-3 h-3 fill-white" />
                  <span>Dừng Demo</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-[#C9A24B]" />
                  <span className="hidden sm:inline">Demo 90s</span>
                </>
              )}
            </button>

            {/* Nút Hồ Sơ Thuyết Trình */}
            <button
              onClick={() => {
                soundEngine.playZitherPluck(4);
                setIsPitchModalOpen(true);
              }}
              title="Hồ sơ thuyết trình: 5 Điểm Khác Biệt Đột Phá"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2F6F6A] text-white hover:bg-[#255753] shadow-xs transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">5 Điểm Wow</span>
            </button>

            {/* Nút Âm Thanh */}
            <button
              onClick={toggleSound}
              title={soundActive ? 'Tắt nhạc cụ dân tộc' : 'Bật nhạc cụ dân tộc'}
              className="p-2 rounded-full border border-[#C9A24B]/30 hover:bg-[#C9A24B]/20 text-[#5A3A22] dark:text-[#E8D3B5] transition"
            >
              {soundActive ? (
                <Volume2 className="w-4 h-4 text-[#C9A24B]" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-50" />
              )}
            </button>

            {/* Nút Chế Độ Sáng/Tối */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                soundEngine.playZitherPluck(2);
              }}
              title={darkMode ? 'Chuyển sang nền Giấy Dó Sáng' : 'Chuyển sang nền Hoàng Thành Tối'}
              className="p-2 rounded-full border border-[#C9A24B]/30 hover:bg-[#C9A24B]/20 text-[#5A3A22] dark:text-[#E8D3B5] transition"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-[#DFB85C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5A3A22]" />
              )}
            </button>
          </div>
        </div>

        {/* Thanh trạng thái khi đang chạy Tour thuyết trình tự động */}
        {demoTourActive && (
          <div className="bg-[#B3261E] text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>
              Đang trình chiếu tự động cho Ban Giám khảo — Chặng {demoTourStep + 1}/4:{' '}
              {demoTourStep === 0
                ? 'Đoàn tàu Di sản & Điểm chạm Văn hóa'
                : demoTourStep === 1
                ? 'Bách khoa toàn thư & Google Search Grounding'
                : demoTourStep === 2
                ? 'Phòng Thử Đồ 3D Parametric & Cultural Guard'
                : 'Lookbook & Kiểm duyệt đăng tải cộng đồng'}
            </span>
          </div>
        )}
      </header>

      {/* NỘI DUNG CHÍNH (THEO TRANG ĐƯỢC CHỌN) */}
      <main className="relative z-10 w-full min-h-[calc(100vh-64px)] flex flex-col items-center">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={navigateTo}
            lang="vi"
            onStartDemoTour={startDemoTour}
            onSelectFittingStep={(step, ctxId) => {
              setInitialFittingTab(step);
              if (ctxId) {
                setInitialContextId(ctxId);
              }
              navigateTo('fitting-room');
            }}
          />
        )}

        {currentPage === 'explore' && (
          <ExploreView
            onTryGarmentIn3D={handleTryIn3DFromExplore}
            onApplyAiResultTo3D={(aiRes) => {
              if (aiRes.matchedGarmentId) {
                setCurrentOutfit((prev) => ({
                  ...prev,
                  garmentModel: aiRes.matchedGarmentId,
                }));
                navigateTo('fitting-room');
              }
            }}
            setGlobalAiProcessing={setIsAiProcessing}
          />
        )}

        {currentPage === 'fitting-room' && (
          <FittingRoomView
            currentConfig={currentOutfit}
            onChangeConfig={setCurrentOutfit}
            onSaveToLookbook={handleSaveToLookbook}
            lang="vi"
            initialTab={initialFittingTab}
            initialContextId={initialContextId}
          />
        )}

        {currentPage === 'lookbook' && (
          <LookbookView
            personalLookbook={personalLookbook}
            onSelectOutfitToFit={(cfg) => {
              setCurrentOutfit(cfg);
              navigateTo('fitting-room');
            }}
            onPublishToCommunity={(entry) => {
              setPersonalLookbook((prev) =>
                prev.map((e) => (e.id === entry.id ? { ...e, isPublic: true } : e))
              );
            }}
            lang="vi"
          />
        )}
      </main>

      {/* FOOTER TINH TẾ */}
      <footer className="w-full py-6 px-4 bg-[#FAF4EB]/60 dark:bg-[#120B06]/80 border-t border-[#C9A24B]/30 text-center text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 backdrop-blur-xs relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-['SVN-Rosalinda'] font-bold text-emboss-gold">VLINE</span>
            <span>— Dự án tham dự Cuộc thi AI Arena Vietnam 2026 (Audition Round)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Đề tài: “Việt phục Remix — Phối trang phục truyền thống theo phong cách Gen Z”</span>
            <span className="text-[#C9A24B]">✦</span>
            <span>Google AI Studio Build</span>
          </div>
        </div>
      </footer>

      {/* MODAL HỒ SƠ THUYẾT TRÌNH (5 ĐIỂM WOW ĐOẠT GIẢI) */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF4EB] dark:bg-[#1A120C] border-2 border-[#C9A24B] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#C9A24B]/30 pb-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B3261E] text-white">
                  HỒ SƠ THUYẾT TRÌNH DỰ THI
                </span>
                <h2 className="font-['SVN-Rosalinda'] text-2xl font-black text-emboss-gold mt-2">
                  5 ĐIỂM KHÁC BIỆT ĐỘT PHÁ CỦA VLINE
                </h2>
                <p className="text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic mt-0.5">
                  Bản đệ trình Ban Giám khảo AI Arena Vietnam 2026
                </p>
              </div>
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="p-1 rounded-full text-[#5A3A22] dark:text-[#E8D3B5] hover:bg-[#C9A24B]/20"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#5A3A22] dark:text-[#F5EBE0]">
              {/* Điểm 1 */}
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#B3261E] dark:text-[#DFB85C]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Mannequin 3D Tham Số Hóa (Parametric) & Vật Lý Vải PBR Realtime</span>
                </div>
                <p>
                  Không chỉ là mockup 2D tĩnh, VLINE xây dựng mô hình Mannequin 3D tương tác bằng Three.js tùy biến theo đúng số đo cơ thể thực tế (chiều cao, cân nặng, vòng 1-2-3), mô phỏng độ rủ của tà áo năm thân và phản xạ vật lý của Lụa Hà Đông, Gấm Cung Đình.
                </p>
              </div>

              {/* Điểm 2 */}
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#B3261E] dark:text-[#DFB85C]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Bộ Quy Tắc Cultural Guard & Tự Động Sửa Lỗi 1-Chạm</span>
                </div>
                <p>
                  Bảo đảm tính tôn nghiêm văn hóa: Hệ thống tự động phát hiện các vi phạm (như mặc độc chiếc Áo Yếm tại nơi tôn nghiêm, thiếu lớp áo lót ngũ thân) và cung cấp nút “Tự động căn chỉnh chuẩn mực” trong tích tắc.
                </p>
              </div>

              {/* Điểm 3 */}
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#B3261E] dark:text-[#DFB85C]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3. Trợ Lý AI Stylist Tiếng Việt Đa Phương Thức</span>
                </div>
                <p>
                  Hỗ trợ giọng nói tiếng Việt qua Web Speech API và thị giác máy tính với Gemini Vision để quét trang phục thực tế người dùng tải lên, nhận diện phom dáng và ánh xạ ngay lập tức sang mô hình 3D.
                </p>
              </div>

              {/* Điểm 4 */}
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#B3261E] dark:text-[#DFB85C]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>4. Mỹ Cảm Giao Thoa: Cung Đình Huế Gặp Gen Z</span>
                </div>
                <p>
                  Nền giấy Dó, vân mây Thủy Ba, Trống Đồng Đông Sơn, hoa văn Rồng thời Lý–Trần kết hợp hiệu ứng dập nổi 3D (embossed) cùng đoàn tàu điện Hà Nội leng keng và âm hưởng đàn Tranh ngũ cung tạo ấn tượng sâu đậm.
                </p>
              </div>

              {/* Điểm 5 */}
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#241409]/70 border border-[#C9A24B]/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#B3261E] dark:text-[#DFB85C]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>5. Quy Trình Xuất Bản Cộng Đồng Có Kiểm Duyệt Di Sản</span>
                </div>
                <p>
                  Khép kín trải nghiệm: Người dùng khám phá, phối đồ theo vóc dáng, xuất ảnh kỷ yếu có triện vàng, chia sẻ bằng mã QR và đăng tải lên cộng đồng sau khi vượt qua bài kiểm tra chất lượng văn hóa tự động.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#C9A24B]/30">
              <button
                onClick={() => setIsPitchModalOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1A120C] font-bold text-xs hover:brightness-110 shadow"
              >
                Đã Rõ — Trở Lại Trải Nghiệm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
