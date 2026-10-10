import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  BookmarkPlus,
  Layers,
  Palette,
  UserCheck,
  Camera,
  Upload,
  CheckCircle2,
  Sliders,
  X,
  Compass,
  BookOpen,
  Info,
  Download,
  Share2,
  Check,
  Eye,
  EyeOff,
  Flame,
  Award,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import {
  OutfitConfiguration,
  VIET_PHUC_CATALOG,
  TRADITIONAL_COLORS,
  FABRIC_OPTIONS,
  MANNEQUIN_POSES,
  CulturalEvaluationResult,
  evaluateOutfitCulturalIntegrity,
  CORE_EIGHT_GARMENTS,
  CoreGarmentDef,
  createHeritageSvgImage,
} from '../data/vietPhucData';
import { soundEngine } from '../utils/soundEngine';
import { Mannequin3DCanvas } from './Mannequin3DCanvas';
import { CornerOrnament } from './HeritageBackdrop';

interface FittingRoomViewProps {
  currentConfig: OutfitConfiguration;
  onChangeConfig: (newConfig: OutfitConfiguration) => void;
  onSaveToLookbook: (config: OutfitConfiguration) => void;
  lang?: 'vi' | 'en';
  initialTab?: 'context' | 'needs' | 'styling' | 'culture';
  initialContextId?: string;
}

export interface CulturalContextPreset {
  id: string;
  title: string;
  occasion: string;
  garmentName: string;
  garmentModel: string;
  dynasty: string;
  vibe: string;
  icon: string;
  tag: string;
  description: string;
  historicalLore: string;
  defaultColors: {
    outer: string;
    inner: string;
    bottom: string;
    trim: string;
    accessory: string;
  };
  headwear: string;
  footwear: string;
  handAcc: string;
  modernItem: string;
  remixLevel: number;
}

export const CULTURAL_CONTEXTS: CulturalContextPreset[] = [
  {
    id: 'cung-dinh-hoang-gia',
    title: 'Cung Đình & Hoàng Gia Huế',
    occasion: 'Lễ cưới truyền thống, Đại lễ di sản, Festival cung đình',
    garmentName: 'Áo Nhật Bình Cung Đình',
    garmentModel: 'ao-nhat-binh',
    dynasty: 'Triều Nguyễn (Lễ phục Hoàng tộc & Mệnh phụ)',
    vibe: 'Vương giả quyền quý · Đỏ son & Vàng hoàng thổ',
    icon: '🏛️',
    tag: 'Quyền quý đoan trang',
    description: 'Lễ phục trang trọng nhất của phụ nữ quý tộc thời Nguyễn với dải cổ áo chữ nhật thêu hoa văn ngũ sắc Thủy ba dập dềnh sóng nước non sông.',
    historicalLore: 'Áo Nhật Bình có vạt áo đóng lại tạo hình chữ Nhật nơi cổ, ngực áo thêu phượng, tay áo ngũ sắc đại diện ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ). Khi phối với Khăn Vấn đỏ hoặc mạ vàng, bộ trang phục toát lên vẻ vương quyền đoan trang của phụ nữ Việt Nam xưa.',
    defaultColors: {
      outer: '#B3261E',
      inner: '#F5EBE0',
      bottom: '#1E3A5F',
      trim: '#DFB85C',
      accessory: '#B3261E',
    },
    headwear: 'khan-van',
    footwear: 'hai-theu',
    handAcc: 'quat-giay',
    modernItem: 'Quạt trầm hương thêu tay',
    remixLevel: 15,
  },
  {
    id: 'hoc-duong-ky-yeu',
    title: 'Học Đường & Kỷ Yếu Gen Z',
    occasion: 'Chụp kỷ yếu tốt nghiệp, Ngày hội trường, Triển lãm sinh viên',
    garmentName: 'Áo Ngũ Thân Tay Chẽn',
    garmentModel: 'ao-ngu-than-tay-chen',
    dynasty: 'Thời Nguyễn (Tiền thân Áo Dài hiện đại)',
    vibe: 'Thanh lịch học đường · Xanh ngọc bích & Trắng ngà',
    icon: '🎓',
    tag: 'Gen Z ưa chuộng nhất',
    description: 'Năm thân áo tượng trưng cho tứ thân phụ mẫu và người mặc, 5 hạt cúc ngọc tượng trưng ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín).',
    historicalLore: 'Định hình dưới thời Chúa Nguyễn Phúc Khoát và Vua Minh Mạng nhằm thống nhất y phục Đại Nam. Cổ đứng kín đáo, đường may trung phùng giữa lưng thể hiện lòng chính trực của bậc quân tử và nét đoan trang của người thanh niên hiếu học.',
    defaultColors: {
      outer: '#2F6F6A',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#C9A24B',
      accessory: '#E7A1B0',
    },
    headwear: 'non-la',
    footwear: 'sneaker-trang',
    handAcc: 'tui-gam',
    modernItem: 'Sneaker trắng tối giản & Túi gấm rút dây',
    remixLevel: 35,
  },
  {
    id: 'dan-gian-quan-ho',
    title: 'Dân Gian Quan Họ Kinh Bắc',
    occasion: 'Hội làng mùa xuân, Giao lưu văn hóa dân tộc, Trình diễn ca dao',
    garmentName: 'Áo Tứ Thân & Nón Quai Thao',
    garmentModel: 'ao-tu-than',
    dynasty: 'Thời Lê - Nguyễn (Đồng bằng Bắc Bộ)',
    vibe: 'Mộc mạc trữ tình · Nâu gụ & Yếm đào sen',
    icon: '🌸',
    tag: 'Hội làng Kinh Bắc',
    description: 'Bốn vạt áo buông lơi tự nhiên, kết hợp áo yếm đào thắm và chiếc nón quai thao tròn rộng vành nghiêng che nụ cười duyên.',
    historicalLore: 'Áo Tứ Thân gắn liền với các liền chị quan họ Kinh Bắc, tượng trưng cho bốn thân phụ mẫu nội ngoại bao bọc lấy người con gái hiền thục. Nón quai thao với quai thao đỏ rủ hai bên ngực là biểu tượng bất hủ của vẻ đẹp duyên dáng Bắc Bộ.',
    defaultColors: {
      outer: '#5A3A22',
      inner: '#E7A1B0',
      bottom: '#1F1D1B',
      trim: '#2F6F6A',
      accessory: '#B3261E',
    },
    headwear: 'non-quai-thao',
    footwear: 'guoc-moc',
    handAcc: 'none',
    modernItem: 'Đai lụa hồng cánh sen buông tà',
    remixLevel: 20,
  },
  {
    id: 'mien-tay-song-nuoc',
    title: 'Nam Bộ Sông Nước & Nón Lá',
    occasion: 'Dạo phố hoài cổ, Du lịch miệt vườn, Check-in cà phê phố cổ',
    garmentName: 'Áo Bà Ba & Nón Lá Bài Thơ',
    garmentModel: 'ao-ba-ba',
    dynasty: 'Cuối TK XIX – Nam Bộ hào sảng',
    vibe: 'Phóng khoáng bình dị · Vàng hoàng cúc & Đen tuyền',
    icon: '🚣',
    tag: 'Retro dân dã',
    description: 'Cổ tròn xẻ giữa, hai túi tiện dụng, kết hợp chiếc nón lá chóp nhọn che nắng mưa tạo nên hình ảnh thân thương của đất phương Nam.',
    historicalLore: 'Áo Bà Ba là trang phục lao động và lễ nghi dân dã đặc sắc của cư dân Nam Bộ, phản ánh tính cách bộc trực, nghĩa hiệp và gần gũi thiên nhiên. Khi kết hợp nón lá nan cọ và khăn rằn, bộ trang phục trở thành biểu tượng quốc hồn quốc túy của người phụ nữ Việt Nam.',
    defaultColors: {
      outer: '#C9A24B',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#5A3A22',
      accessory: '#E7A1B0',
    },
    headwear: 'non-la',
    footwear: 'guoc-moc',
    handAcc: 'tui-tote',
    modernItem: 'Nón lá truyền thống & Túi canvas mộc',
    remixLevel: 30,
  },
  {
    id: 'dai-viet-co-phong',
    title: 'Cổ Phong Đại Việt (Lý - Trần - Lê)',
    occasion: 'Festival di sản quốc gia, Lễ tế văn miếu, Triển lãm lịch sử',
    garmentName: 'Áo Giao Lĩnh & Khăn Đóng',
    garmentModel: 'ao-giao-linh',
    dynasty: 'Thời Lý – Trần – Hậu Lê (Thế kỷ XI - XVIII)',
    vibe: 'Thâm trầm uy nghiêm · Xanh chàm cổ & Vàng kim',
    icon: '📜',
    tag: 'Nghìn năm văn hiến',
    description: 'Cổ áo vắt chéo (giao lĩnh), tay thụng rộng rãi mang âm hưởng mỹ thuật cung đình Thăng Long nghìn năm văn vật.',
    historicalLore: 'Áo Giao Lĩnh là một trong những dạng thức y phục cổ xưa nhất của người Việt từ thời Lý - Trần qua thời Lê Sơ. Cổ áo giao nhau bên phải, đai lưng thắt gọn gàng phản ánh tinh thần tự chủ, văn hiến và hào khí Đông A oai hùng của Đại Việt.',
    defaultColors: {
      outer: '#1E3A5F',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#DFB85C',
      accessory: '#1F1D1B',
    },
    headwear: 'khan-dong',
    footwear: 'hai-theu',
    handAcc: 'quat-giay',
    modernItem: 'Đai thêu chỉ vàng & Quạt gỗ nan tiêu',
    remixLevel: 10,
  },
];

export const FittingRoomView: React.FC<FittingRoomViewProps> = ({
  currentConfig,
  onChangeConfig,
  onSaveToLookbook,
  initialTab,
  initialContextId,
}) => {
  // Undo / Redo history
  const [history, setHistory] = useState<OutfitConfiguration[]>([currentConfig]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // 4 Tab cốt lõi theo đúng đề bài của Người Dùng
  const [activeTab, setActiveTab] = useState<'context' | 'needs' | 'styling' | 'culture'>(
    initialTab || 'context'
  );

  // Modal hiển thị Thẻ Gợi Ý Phối Đồ Mockup
  const [showCardModal, setShowCardModal] = useState<boolean>(false);

  // Chế độ chọn ở Bước 1: 'garments' (8 bộ trang phục) hoặc 'contexts' (5 bối cảnh văn hóa)
  const [step1Mode, setStep1Mode] = useState<'garments' | 'contexts'>('garments');

  // Bối cảnh đang chọn
  const [selectedContextId, setSelectedContextId] = useState<string>(
    initialContextId || 'hoc-duong-ky-yeu'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialContextId) {
      setSelectedContextId(initialContextId);
      const found = CULTURAL_CONTEXTS.find((c) => c.id === initialContextId);
      if (found) {
        handleSelectContext(found);
      }
    }
  }, [initialContextId]);

  // Snapshot capture function ref from 3D Canvas
  const captureFnRef = useRef<((mode: 'transparent' | 'framed') => string) | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [capturedSnapshotUrl, setCapturedSnapshotUrl] = useState<string | null>(null);

  // Cultural Guard Evaluation
  const culturalEval: CulturalEvaluationResult = evaluateOutfitCulturalIntegrity(currentConfig);

  const currentContext = CULTURAL_CONTEXTS.find((c) => c.id === selectedContextId) || CULTURAL_CONTEXTS[0];

  // Thông tin bộ trang phục hiện tại trong 8 bộ cốt lõi
  const currentGarmentDef =
    CORE_EIGHT_GARMENTS.find((g) => g.model === currentConfig.garmentModel) ||
    CORE_EIGHT_GARMENTS[0];

  const currentCatalogItem =
    VIET_PHUC_CATALOG.find(
      (c) => c.id === currentConfig.garmentModel || c.default3D.garmentModel === currentConfig.garmentModel
    ) || VIET_PHUC_CATALOG[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Chọn nhanh 1 trong 8 bộ cổ phục cốt lõi
  const handleSelectCoreGarment = (g: CoreGarmentDef) => {
    soundEngine.playZitherPluck(2);
    // Tự động tìm bối cảnh tương ứng nếu có
    const matchedCtx = CULTURAL_CONTEXTS.find((c) => c.garmentModel === g.model);
    if (matchedCtx) {
      setSelectedContextId(matchedCtx.id);
    }

    updateConfig((prev) => ({
      ...prev,
      title: g.name,
      garmentModel: g.model,
      colors: {
        outerRobe: g.defaultColors.outer,
        innerShirt: g.defaultColors.inner,
        bottomWear: g.defaultColors.bottom,
        collarAndTrim: g.defaultColors.trim,
        accessory: prev.colors.accessory || '#C9A24B',
      },
      bottomType: g.bottomType,
      headwear: g.defaultHeadwear,
      footwear: g.defaultFootwear,
      handAccessory: g.defaultHandAcc,
      stylistAnswers: {
        ...prev.stylistAnswers,
        occasion: g.badge,
        vibeAndColor: `${g.dynasty} · ${g.name}`,
      },
      layersVisible: {
        ...prev.layersVisible,
        outerRobe: true,
        innerShirt: true,
        bottomWear: true,
        collarAndTrim: true,
        headwear: g.defaultHeadwear !== 'none',
        handAccessory: g.defaultHandAcc !== 'none',
        footwear: true,
      },
    }));
    showToast(`Đã chọn: ${g.name}`);
  };

  const updateConfig = (updater: (prev: OutfitConfiguration) => OutfitConfiguration) => {
    const updated = updater(currentConfig);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(updated);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    onChangeConfig(updated);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChangeConfig(prev);
      soundEngine.playZitherPluck(2);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChangeConfig(next);
      soundEngine.playZitherPluck(3);
    }
  };

  const handleReset = () => {
    const defaultCtx = CULTURAL_CONTEXTS[1]; // Kỷ yếu
    updateConfig((prev) => ({
      ...prev,
      garmentModel: defaultCtx.garmentModel as any,
      colors: {
        outerRobe: defaultCtx.defaultColors.outer,
        innerShirt: defaultCtx.defaultColors.inner,
        bottomWear: defaultCtx.defaultColors.bottom,
        collarAndTrim: defaultCtx.defaultColors.trim,
        accessory: defaultCtx.defaultColors.accessory,
      },
      headwear: 'non-la',
      layersVisible: {
        outerRobe: true,
        innerShirt: true,
        bottomWear: true,
        collarAndTrim: true,
        headwear: true,
        handAccessory: true,
        footwear: true,
        modernOuter: false,
      },
    }));
    soundEngine.playZitherPluck(0);
    showToast('Đã khôi phục cài đặt gốc di sản chuẩn mực!');
  };

  // Áp dụng nhanh một bối cảnh văn hóa
  const handleSelectContext = (ctx: CulturalContextPreset) => {
    soundEngine.playZitherPluck(1);
    setSelectedContextId(ctx.id);
    updateConfig((prev) => ({
      ...prev,
      title: ctx.garmentName,
      garmentModel: ctx.garmentModel as any,
      colors: {
        outerRobe: ctx.defaultColors.outer,
        innerShirt: ctx.defaultColors.inner,
        bottomWear: ctx.defaultColors.bottom,
        collarAndTrim: ctx.defaultColors.trim,
        accessory: ctx.defaultColors.accessory,
      },
      headwear: ctx.headwear as any,
      footwear: ctx.footwear as any,
      handAccessory: ctx.handAcc as any,
      remixLevel: ctx.remixLevel,
      stylistAnswers: {
        ...prev.stylistAnswers,
        occasion: ctx.occasion,
        vibeAndColor: ctx.vibe,
        modernItem: ctx.modernItem,
      },
      layersVisible: {
        ...prev.layersVisible,
        headwear: ctx.headwear !== 'none',
        handAccessory: ctx.handAcc !== 'none',
      },
    }));
    showToast(`Đã áp dụng bối cảnh: ${ctx.title}`);
  };

  // Mở modal Thẻ Gợi Ý Mockup
  const handleOpenMockupCard = () => {
    soundEngine.playCameraClick();
    if (captureFnRef.current) {
      try {
        const snap = captureFnRef.current('framed');
        setCapturedSnapshotUrl(snap);
      } catch {
        // fallback
      }
    }
    setShowCardModal(true);
  };

  // Tính BMI & Phân loại vóc dáng
  const bmi = +(
    currentConfig.bodyMetrics.weightKg /
    Math.pow(currentConfig.bodyMetrics.heightCm / 100, 2)
  ).toFixed(1);

  const getBodyShapeLabel = () => {
    if (currentConfig.bodyMetrics.weightKg < 46) return 'Thanh mảnh / Mảnh khảnh';
    if (currentConfig.bodyMetrics.weightKg <= 58) return 'Cân đối / Tiêu chuẩn';
    if (currentConfig.bodyMetrics.weightKg <= 75) return 'Đầy đặn / Tròn trịa';
    return 'To lớn / Đậm người';
  };

  // Tự động sửa lỗi văn hóa (1 chạm)
  const handleAutoFixCulturalIssues = () => {
    soundEngine.playZitherPluck(6);
    updateConfig((prev) => {
      const fixed = { ...prev };
      fixed.layersVisible = {
        ...fixed.layersVisible,
        innerShirt: true,
        bottomWear: true,
      };
      if (fixed.garmentModel === 'ao-yem' && fixed.modernOuter === 'none') {
        fixed.modernOuter = 'blazer';
      }
      return fixed;
    });
    showToast('Đã tự động căn chỉnh chuẩn mực di sản 100%!');
  };

  // Xuất ảnh PNG
  const handleDownloadSnapshot = (mode: 'transparent' | 'framed') => {
    soundEngine.playCameraClick();
    if (captureFnRef.current) {
      const dataUri = captureFnRef.current(mode);
      const link = document.createElement('a');
      link.download = `VLINE_${currentConfig.garmentModel}_${Date.now()}.png`;
      link.href = dataUri;
      link.click();
      showToast('Đã xuất ảnh trang phục 3D thành công!');
    }
  };

  // Lưu vào lookbook
  const handleSave = () => {
    soundEngine.playZitherPluck(5);
    onSaveToLookbook(currentConfig);
    setSavedSuccess(true);
    showToast('Đã lưu outfit vào Lookbook cá nhân của bạn!');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* Toast thông báo */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#382214] border border-[#C9A24B] text-[#F5EBE0] px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#C9A24B] animate-spin" />
          {toastMsg}
        </div>
      )}

      {/* THANH CÔNG CỤ TRÊN CÙNG: 4 TRỤ CỘT & NÚT HÀNH ĐỘNG */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#FAF4EB]/90 dark:bg-[#1E140C]/95 border-b border-[#C9A24B]/35 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <span className="font-['SVN-Rosalinda'] text-xl font-bold text-emboss-gold">
            VLINE PHÒNG THỬ ĐỒ
          </span>
          <span className="hidden md:inline text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic">
            “Nối mạch ngàn năm, vẽ nét thời đại”
          </span>
        </div>

        {/* Nút hành động nhanh: Undo, Redo, Reset, THẺ MOCKUP, Lưu */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Hoàn tác (Undo)"
            className="p-1.5 rounded bg-[#FAF4EB] dark:bg-[#2C1C11] border border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#E8D3B5] disabled:opacity-40 hover:bg-[#EFE0CC] transition"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Làm lại (Redo)"
            className="p-1.5 rounded bg-[#FAF4EB] dark:bg-[#2C1C11] border border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#E8D3B5] disabled:opacity-40 hover:bg-[#EFE0CC] transition"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Khôi phục nguyên bản di sản"
            className="p-1.5 rounded bg-[#FAF4EB] dark:bg-[#2C1C11] border border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#E8D3B5] hover:bg-[#EFE0CC] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-[#C9A24B]/30 mx-1" />

          {/* NÚT XEM THẺ GỢI Ý MOCKUP NỔI BẬT NHẤT */}
          <button
            onClick={handleOpenMockupCard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1F1206] shadow-md hover:brightness-110 transition cursor-pointer animate-pulse"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thẻ Gợi Ý Mockup</span>
          </button>

          {/* Nút Chụp ảnh 3D */}
          <button
            onClick={() => handleDownloadSnapshot('framed')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[#FAF4EB] dark:bg-[#2C1C11] border border-[#C9A24B] text-[#5A3A22] dark:text-[#F8E2A8] hover:bg-[#EFE0CC] transition"
          >
            <Camera className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span className="hidden sm:inline">Chụp Ảnh 3D</span>
          </button>

          {/* Nút Lưu vào Lookbook */}
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-md transition ${
              savedSuccess
                ? 'bg-[#2F6F6A] text-white'
                : 'bg-gradient-to-r from-[#B3261E] to-[#8C1B14] text-white hover:brightness-110'
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã lưu!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Lưu Lookbook</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* THANH CHỌN NHANH 8 BỘ TRANG PHỤC CỔ TRUYỀN (CHỌN 1 CHẠM ĐỔI MẪU 3D TỨC THÌ) */}
      <div className="bg-[#FAF4EB] dark:bg-[#1C120B] border-b border-[#C9A24B]/35 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar z-15 shadow-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-black text-[#B3261E] dark:text-[#DFB85C] uppercase tracking-wider flex items-center gap-1">
            <span>👘</span>
            <span className="hidden md:inline">Chọn Trang Phục:</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B3261E]/15 text-[#B3261E] dark:text-[#DFB85C] font-semibold hidden sm:inline">
            8 Bộ Cổ Phục Chuẩn
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-nowrap">
          {CORE_EIGHT_GARMENTS.map((g) => {
            const isSelected = currentConfig.garmentModel === g.model;
            return (
              <button
                key={g.id}
                onClick={() => handleSelectCoreGarment(g)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-[#B3261E] text-white shadow-md font-bold ring-2 ring-[#DFB85C]'
                    : 'bg-[#FAF4EB] dark:bg-[#28170D] text-[#5A3A22] dark:text-[#E8D3B5] border border-[#C9A24B]/30 hover:border-[#C9A24B] hover:bg-[#EFE0CC]/50'
                }`}
              >
                <span>{g.icon}</span>
                <span>{g.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#DFB85C]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* NỘI DUNG CHÍNH: 2 CỘT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* CỘT ĐIỀU KHIỂN TRÁI: 4 TRỤ CỘT THEO ĐÚNG ĐỀ BÀI */}
        <div className="w-full lg:w-[460px] xl:w-[500px] bg-[#FAF4EB]/95 dark:bg-[#1A120C]/95 border-r border-[#C9A24B]/30 flex flex-col overflow-hidden z-10">
          {/* THANH TAB 4 BƯỚC CỐT LÕI */}
          <div className="grid grid-cols-4 border-b border-[#C9A24B]/30 bg-[#EFE0CC]/60 dark:bg-[#241409]/90 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('context')}
              className={`py-2.5 px-1.5 text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'context'
                  ? 'border-b-2 border-[#B3261E] text-[#B3261E] dark:text-[#DFB85C] bg-[#FAF4EB] dark:bg-[#1A120C]'
                  : 'text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 hover:text-[#5A3A22]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[11px] leading-tight">1. Trang Phục</span>
            </button>
            <button
              onClick={() => setActiveTab('needs')}
              className={`py-2.5 px-1.5 text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'needs'
                  ? 'border-b-2 border-[#B3261E] text-[#B3261E] dark:text-[#DFB85C] bg-[#FAF4EB] dark:bg-[#1A120C]'
                  : 'text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 hover:text-[#5A3A22]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] leading-tight">2. Nhu Cầu & Dáng</span>
            </button>
            <button
              onClick={() => setActiveTab('styling')}
              className={`py-2.5 px-1.5 text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'styling'
                  ? 'border-b-2 border-[#B3261E] text-[#B3261E] dark:text-[#DFB85C] bg-[#FAF4EB] dark:bg-[#1A120C]'
                  : 'text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 hover:text-[#5A3A22]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="text-[11px] leading-tight">3. Phối & Đổi Màu</span>
            </button>
            <button
              onClick={() => setActiveTab('culture')}
              className={`py-2.5 px-1.5 text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'culture'
                  ? 'border-b-2 border-[#B3261E] text-[#B3261E] dark:text-[#DFB85C] bg-[#FAF4EB] dark:bg-[#1A120C]'
                  : 'text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 hover:text-[#5A3A22]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] leading-tight">4. Thẩm Định & Ý Nghĩa</span>
            </button>
          </div>

          {/* VÙNG CUỘN NỘI DUNG TỪNG TAB */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* ======================================================= */}
            {/* TAB 1: CHỌN NHÓM TRANG PHỤC HOẶC BỐI CẢNH VĂN HÓA      */}
            {/* ======================================================= */}
            {activeTab === 'context' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-gradient-to-r from-[#DFB85C]/15 to-[#B3261E]/10 rounded-xl border border-[#C9A24B]/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                    <Compass className="w-4 h-4" />
                    <span>Yêu Cầu 1: Chọn Bộ Trang Phục Hoặc Bối Cảnh Văn Hóa</span>
                  </div>
                  <p className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 leading-relaxed">
                    Khám phá 8 bộ cổ phục tiêu biểu nhất của người Việt. Chọn một bộ để tự động nạp cấu trúc phom dáng, hoa văn và màu sắc di sản lên Mannequin 3D.
                  </p>
                </div>

                {/* THANH CHUYỂN ĐỔI CHẾ ĐỘ: 8 BỘ TRANG PHỤC vs 5 BỐI CẢNH */}
                <div className="grid grid-cols-2 p-1 bg-[#EFE0CC]/70 dark:bg-[#2A180E] rounded-xl border border-[#C9A24B]/30 text-xs">
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(1);
                      setStep1Mode('garments');
                    }}
                    className={`py-2 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      step1Mode === 'garments'
                        ? 'bg-[#B3261E] text-white shadow-sm'
                        : 'text-[#5A3A22] dark:text-[#E8D3B5] hover:text-[#B3261E]'
                    }`}
                  >
                    <span>👘</span>
                    <span>8 Bộ Cổ Phục Chuẩn</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(1);
                      setStep1Mode('contexts');
                    }}
                    className={`py-2 px-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      step1Mode === 'contexts'
                        ? 'bg-[#B3261E] text-white shadow-sm'
                        : 'text-[#5A3A22] dark:text-[#E8D3B5] hover:text-[#B3261E]'
                    }`}
                  >
                    <span>🏛️</span>
                    <span>5 Bối Cảnh & Sự Kiện</span>
                  </button>
                </div>

                {/* CHẾ ĐỘ 1: DANH SÁCH 8 BỘ TRANG PHỤC CỐT LÕI */}
                {step1Mode === 'garments' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C]">
                        Chọn 1 trong 8 bộ trang phục truyền thống:
                      </label>
                      <span className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic">
                        Đang thử: <strong>{currentGarmentDef.name}</strong>
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {CORE_EIGHT_GARMENTS.map((g) => {
                        const isSelected = currentConfig.garmentModel === g.model;
                        const svgThumb = createHeritageSvgImage(
                          g.name,
                          g.defaultColors.outer,
                          g.defaultColors.inner,
                          g.badge,
                          g.model
                        );

                        return (
                          <div
                            key={g.id}
                            onClick={() => handleSelectCoreGarment(g)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition flex gap-3 relative ${
                              isSelected
                                ? 'bg-[#B3261E]/10 border-[#B3261E] ring-2 ring-[#B3261E] shadow-sm'
                                : 'bg-[#FAF4EB] dark:bg-[#241409] border-[#C9A24B]/30 hover:border-[#C9A24B] hover:shadow-xs'
                            }`}
                          >
                            {/* Thumbnail SVG */}
                            <div className="w-16 h-20 rounded-lg overflow-hidden border border-[#C9A24B]/50 shrink-0 bg-[#1A1008] shadow-xs relative">
                              <img
                                src={svgThumb}
                                alt={g.name}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B3261E] text-white flex items-center justify-center text-[10px] shadow">
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Thông tin trang phục */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8] truncate flex items-center gap-1">
                                    <span>{g.icon}</span>
                                    <span>{g.name}</span>
                                  </h4>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C9A24B]/20 text-[#5A3A22] dark:text-[#E8D3B5] whitespace-nowrap">
                                    {g.dynasty}
                                  </span>
                                </div>

                                <div className="text-[10px] text-[#B3261E] dark:text-[#DFB85C] font-semibold mt-0.5">
                                  {g.badge}
                                </div>

                                <p className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 line-clamp-2 mt-1 leading-snug">
                                  {g.shortDesc}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#C9A24B]/20 text-[10px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">Màu chuẩn:</span>
                                  <div className="flex items-center gap-1">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: g.defaultColors.outer }}
                                      title="Áo ngoài"
                                    />
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: g.defaultColors.inner }}
                                      title="Áo lót / trong"
                                    />
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: g.defaultColors.bottom }}
                                      title="Quần / váy"
                                    />
                                  </div>
                                </div>

                                <span
                                  className={`font-bold ${
                                    isSelected
                                      ? 'text-[#B3261E] dark:text-[#DFB85C]'
                                      : 'text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 hover:text-[#B3261E]'
                                  }`}
                                >
                                  {isSelected ? '✓ Đang mặc trên mẫu' : 'Mặc thử áo này →'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CHẾ ĐỘ 2: 5 BỐI CẢNH VĂN HÓA TIÊU BIỂU */}
                {step1Mode === 'contexts' && (
                  <div className="space-y-2">
                    <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C] block">
                      5 Bối cảnh không gian & sự kiện văn hóa:
                    </label>
                    <div className="space-y-2">
                      {CULTURAL_CONTEXTS.map((ctx) => (
                        <div
                          key={ctx.id}
                          onClick={() => handleSelectContext(ctx)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col gap-1.5 relative ${
                            selectedContextId === ctx.id
                              ? 'bg-[#B3261E]/10 border-[#B3261E] ring-2 ring-[#B3261E]'
                              : 'bg-[#FAF4EB] dark:bg-[#241409] border-[#C9A24B]/30 hover:border-[#C9A24B]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{ctx.icon}</span>
                              <div>
                                <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">
                                  {ctx.title}
                                </div>
                                <div className="text-[10px] text-[#B3261E] dark:text-[#DFB85C] font-semibold">
                                  {ctx.garmentName} · {ctx.dynasty}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#C9A24B]/20 text-[#5A3A22] dark:text-[#E8D3B5]">
                              {ctx.tag}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 line-clamp-2">
                            {ctx.description}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-[#C9A24B]/20 text-[10px]">
                            <span className="text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic">
                              Phù hợp: {ctx.occasion}
                            </span>
                            <span className="font-bold text-[#B3261E] dark:text-[#DFB85C]">
                              Chọn bối cảnh này →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chuyển bước 2 */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(2);
                      setActiveTab('needs');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1A120C] hover:brightness-110 shadow flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <span>Tiếp Tục: Xác Định Nhu Cầu & Số Đo Vóc Dáng (Bước 2)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB 2: XÁC ĐỊNH NHU CẦU NGƯỜI DÙNG & VÓC DÁNG (CÂN NẶNG)*/}
            {/* ======================================================= */}
            {activeTab === 'needs' && (
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-[#DFB85C]/15 to-[#B3261E]/10 rounded-xl border border-[#C9A24B]/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                    <UserCheck className="w-4 h-4" />
                    <span>Yêu Cầu 2: Xác Định Nhu Cầu & Tùy Biến Vóc Dáng Thực Tế</span>
                  </div>
                  <p className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80">
                    Cá nhân hóa theo sự kiện bạn tham dự và kích thước cơ thể. Mannequin 3D co giãn tức thì theo cân nặng thực tế!
                  </p>
                </div>

                {/* 1. Chọn Sự Kiện */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C] block">
                    Sự kiện tham gia:
                  </label>
                  <select
                    value={currentConfig.stylistAnswers.occasion}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        stylistAnswers: { ...prev.stylistAnswers, occasion: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 rounded-lg bg-white dark:bg-[#241409] border border-[#C9A24B]/40 text-xs"
                  >
                    <option value="Chụp kỷ yếu tốt nghiệp học sinh - sinh viên">Chụp kỷ yếu tốt nghiệp học sinh - sinh viên</option>
                    <option value="Lễ cưới truyền thống & Hỷ sự gia đình">Lễ cưới truyền thống & Hỷ sự gia đình</option>
                    <option value="Dạo phố, Check-in quán cà phê cổ phong">Dạo phố, Check-in quán cà phê cổ phong</option>
                    <option value="Đi lễ chùa, Tham quan di tích lịch sử & Hội làng">Đi lễ chùa, Tham quan di tích & Hội làng</option>
                    <option value="Biểu diễn nghệ thuật & Sân khấu âm nhạc">Biểu diễn nghệ thuật & Sân khấu âm nhạc</option>
                  </select>
                </div>

                {/* 2. Chọn Phong Cách Phối (Remix Level) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C]">
                      Phong cách mong muốn:
                    </label>
                    <span className="font-bold text-[#B3261E] dark:text-[#DFB85C]">
                      {currentConfig.remixLevel <= 15
                        ? 'Truyền thống 100%'
                        : currentConfig.remixLevel <= 40
                        ? 'Giao thoa tinh tế'
                        : 'Gen Z Phóng khoáng'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { level: 10, label: 'Cổ Phục 100%', desc: 'Nguyên bản di sản' },
                      { level: 30, label: 'Giao Thoa', desc: 'Sneaker & Túi gấm' },
                      { level: 50, label: 'Gen Z Remix', desc: 'Blazer & Y2K' },
                    ].map((st) => (
                      <button
                        key={st.level}
                        onClick={() => updateConfig((prev) => ({ ...prev, remixLevel: st.level }))}
                        className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                          Math.abs(currentConfig.remixLevel - st.level) <= 12
                            ? 'bg-[#B3261E] text-white border-[#B3261E] font-bold'
                            : 'bg-white dark:bg-[#241409] border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#E8D3B5]'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{st.label}</div>
                        <div className="text-[9px] opacity-80">{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. THANH TRƯỢT CÂN NẶNG & VÓC DÁNG (ĐỔI KÍCH THƯỚC MANNEQUIN NGAY LẬP TỨC) */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#DFB85C]/15 to-[#B3261E]/10 border-2 border-[#C9A24B] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8] flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#B3261E]" />
                        <span>Cân Nặng (Thân người co giãn 3D rõ nét):</span>
                      </div>
                      <div className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                        Vóc dáng: <strong className="text-[#B3261E]">{getBodyShapeLabel()}</strong> (BMI {bmi})
                      </div>
                    </div>
                    <span className="font-black text-lg text-[#B3261E] dark:text-[#F8E2A8] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#1A120C] border border-[#C9A24B]/40">
                      {currentConfig.bodyMetrics.weightKg} kg
                    </span>
                  </div>

                  <input
                    type="range"
                    min={38}
                    max={110}
                    step={1}
                    value={currentConfig.bodyMetrics.weightKg}
                    onChange={(e) => {
                      const newKg = +e.target.value;
                      updateConfig((prev) => ({
                        ...prev,
                        bodyMetrics: { ...prev.bodyMetrics, weightKg: newKg },
                      }));
                    }}
                    className="w-full accent-[#B3261E] cursor-pointer h-2"
                  />

                  {/* 4 Nút preset cân nặng nhanh */}
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    {[
                      { kg: 42, label: '42kg (Gầy)' },
                      { kg: 52, label: '52kg (Chuẩn)' },
                      { kg: 68, label: '68kg (Đầy đặn)' },
                      { kg: 88, label: '88kg (To lớn)' },
                    ].map((p) => (
                      <button
                        key={p.kg}
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            bodyMetrics: { ...prev.bodyMetrics, weightKg: p.kg },
                          }));
                          showToast(`Đã chỉnh vóc dáng sang ${p.label}`);
                        }}
                        className={`py-1 rounded border text-center transition cursor-pointer ${
                          currentConfig.bodyMetrics.weightKg === p.kg
                            ? 'bg-[#B3261E] text-white border-[#B3261E] font-bold'
                            : 'bg-white dark:bg-[#241409] border-[#C9A24B]/30 hover:border-[#C9A24B]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Chiều cao & Số đo 3 vòng */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9A24B]/20 text-[11px]">
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>Chiều cao:</span>
                        <strong>{currentConfig.bodyMetrics.heightCm} cm</strong>
                      </div>
                      <input
                        type="range"
                        min={145}
                        max={195}
                        value={currentConfig.bodyMetrics.heightCm}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            bodyMetrics: { ...prev.bodyMetrics, heightCm: +e.target.value },
                          }))
                        }
                        className="w-full accent-[#B3261E]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>Vòng eo:</span>
                        <strong>{currentConfig.bodyMetrics.waistCm} cm</strong>
                      </div>
                      <input
                        type="range"
                        min={55}
                        max={105}
                        value={currentConfig.bodyMetrics.waistCm}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            bodyMetrics: { ...prev.bodyMetrics, waistCm: +e.target.value },
                          }))
                        }
                        className="w-full accent-[#B3261E]"
                      />
                    </div>
                  </div>
                </div>

                {/* Chọn dáng đứng Mannequin */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C] block">
                    Dáng đứng Mannequin (6 tư thế):
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {MANNEQUIN_POSES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => updateConfig((prev) => ({ ...prev, poseId: p.id }))}
                        className={`p-2 text-left rounded-lg border transition cursor-pointer ${
                          currentConfig.poseId === p.id
                            ? 'bg-[#C9A24B]/20 border-[#C9A24B] text-[#5A3A22] dark:text-[#F8E2A8] font-bold ring-1 ring-[#C9A24B]'
                            : 'bg-white dark:bg-[#241409] border-[#C9A24B]/20 text-[#5A3A22]/80 dark:text-[#E8D3B5]/80'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Điều hướng bước */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(1);
                      setActiveTab('context');
                    }}
                    className="py-2.5 px-3 rounded-xl border border-[#C9A24B]/40 text-xs font-semibold hover:bg-[#C9A24B]/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Bước 1</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(3);
                      setActiveTab('styling');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1A120C] hover:brightness-110 shadow flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <span>Tiếp Tục: Phối Đồ & Đổi Màu RGB (Bước 3)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB 3: PHÁC THẢO PHỐI ĐỒ & ĐỔI MÀU RGB TỰ DO TỪNG LAYER */}
            {/* ======================================================= */}
            {activeTab === 'styling' && (
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-[#DFB85C]/15 to-[#B3261E]/10 rounded-xl border border-[#C9A24B]/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                    <Palette className="w-4 h-4" />
                    <span>Yêu Cầu 3: Phối Đồ Nhiều Lớp & Đổi Màu RGB Tự Do</span>
                  </div>
                  <p className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80">
                    Bóc tách từng lớp trang phục (Layer Visibility) và tùy biến 16 triệu màu RGB cho từng chi tiết riêng biệt!
                  </p>
                </div>

                {/* 1. MỤC NÓN LÁ & PHỤ KIỆN ĐỘI ĐẦU - HIỂN THỊ TRỰC TIẾP TRÊN ĐẦU */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#DFB85C]/20 to-[#B3261E]/10 border-2 border-[#C9A24B] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#5A3A22] dark:text-[#DFB85C] flex items-center gap-1.5">
                      <span>👒</span>
                      <span>Phụ kiện Đội Đầu (Nón Lá & Khăn Vấn):</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B3261E] text-white font-bold">
                      {currentConfig.headwear === 'non-la'
                        ? 'Nón Lá Bài Thơ'
                        : currentConfig.headwear === 'khan-van'
                        ? 'Khăn Vấn Cung Đình'
                        : currentConfig.headwear === 'non-quai-thao'
                        ? 'Nón Quai Thao'
                        : currentConfig.headwear === 'khan-dong'
                        ? 'Khăn Đóng'
                        : 'Không đội'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'non-la', name: 'Nón Lá Bài Thơ', icon: '👒', tag: 'Duyên dáng thanh tú' },
                      { id: 'khan-van', name: 'Khăn Vấn Cung Đình', icon: '👑', tag: 'Quý phái triều Nguyễn' },
                      { id: 'non-quai-thao', name: 'Nón Quai Thao', icon: '🌸', tag: 'Kinh Bắc quan họ' },
                      { id: 'khan-dong', name: 'Khăn Đóng Truyền Thống', icon: '🎩', tag: 'Trang nghiêm mẫu mực' },
                      { id: 'none', name: 'Không đội nón/khăn', icon: '💇', tag: 'Để tóc tự nhiên' },
                    ].map((h) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          soundEngine.playZitherPluck(2);
                          updateConfig((prev) => ({
                            ...prev,
                            headwear: h.id as any,
                            layersVisible: {
                              ...prev.layersVisible,
                              headwear: h.id !== 'none',
                            },
                          }));
                          showToast(h.id === 'none' ? 'Đã gỡ nón/khăn' : `Đã đội ${h.name} lên đầu mẫu 3D!`);
                        }}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          currentConfig.headwear === h.id
                            ? 'bg-[#B3261E] text-white border-[#B3261E] font-bold ring-2 ring-[#B3261E]'
                            : 'bg-white dark:bg-[#241409] border-[#C9A24B]/30 hover:border-[#C9A24B]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-xs">
                          <span>{h.icon}</span>
                          <span>{h.name}</span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${currentConfig.headwear === h.id ? 'text-white/80' : 'opacity-70'}`}>
                          {h.tag}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. BẢNG ĐỔI MÀU RGB 16 TRIỆU MÀU TỪNG LAYER */}
                <div className="p-3.5 bg-white dark:bg-[#241409] border border-[#C9A24B]/40 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[#C9A24B]/20 pb-1.5">
                    <span className="font-bold text-xs text-[#5A3A22] dark:text-[#DFB85C] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#B3261E]" />
                      <span>Đổi Màu RGB Tự Do Từng Lớp (16 Triệu Màu):</span>
                    </span>
                    <span className="text-[10px] text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic">Bấm ô màu để chỉnh</span>
                  </div>

                  {/* Lớp 1: Áo ngoài */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B]/20">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={currentConfig.layersVisible.outerRobe}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            layersVisible: { ...prev.layersVisible, outerRobe: e.target.checked },
                          }))
                        }
                        title="Bật/Tắt hiển thị Áo ngoài"
                        className="accent-[#B3261E]"
                      />
                      <input
                        type="color"
                        value={currentConfig.colors.outerRobe}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, outerRobe: e.target.value },
                          }))
                        }
                        className="w-8 h-8 rounded-lg border border-[#C9A24B] cursor-pointer bg-transparent"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">Áo Khoác Ngoài</div>
                        <div className="text-[10px] font-mono text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                          {currentConfig.colors.outerRobe.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={currentConfig.colors.outerRobe}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, outerRobe: e.target.value },
                        }))
                      }
                      className="w-20 px-2 py-1 text-center font-mono text-[11px] rounded border border-[#C9A24B]/30 bg-white dark:bg-[#241409]"
                    />
                  </div>

                  {/* Lớp 2: Áo lót trong / Yếm */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B]/20">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={currentConfig.layersVisible.innerShirt}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            layersVisible: { ...prev.layersVisible, innerShirt: e.target.checked },
                          }))
                        }
                        title="Bật/Tắt hiển thị Áo lót trong / Yếm"
                        className="accent-[#B3261E]"
                      />
                      <input
                        type="color"
                        value={currentConfig.colors.innerShirt}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, innerShirt: e.target.value },
                          }))
                        }
                        className="w-8 h-8 rounded-lg border border-[#C9A24B] cursor-pointer bg-transparent"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">Áo Lót Trong / Yếm</div>
                        <div className="text-[10px] font-mono text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                          {currentConfig.colors.innerShirt.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={currentConfig.colors.innerShirt}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, innerShirt: e.target.value },
                        }))
                      }
                      className="w-20 px-2 py-1 text-center font-mono text-[11px] rounded border border-[#C9A24B]/30 bg-white dark:bg-[#241409]"
                    />
                  </div>

                  {/* Lớp 3: Quần lụa / Váy đụp */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B]/20">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={currentConfig.layersVisible.bottomWear}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            layersVisible: { ...prev.layersVisible, bottomWear: e.target.checked },
                          }))
                        }
                        title="Bật/Tắt hiển thị Quần / Váy"
                        className="accent-[#B3261E]"
                      />
                      <input
                        type="color"
                        value={currentConfig.colors.bottomWear}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, bottomWear: e.target.value },
                          }))
                        }
                        className="w-8 h-8 rounded-lg border border-[#C9A24B] cursor-pointer bg-transparent"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">Quần Lụa / Váy Đụp</div>
                        <div className="text-[10px] font-mono text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                          {currentConfig.colors.bottomWear.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={currentConfig.colors.bottomWear}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, bottomWear: e.target.value },
                        }))
                      }
                      className="w-20 px-2 py-1 text-center font-mono text-[11px] rounded border border-[#C9A24B]/30 bg-white dark:bg-[#241409]"
                    />
                  </div>

                  {/* Lớp 4: Cổ áo & Nẹp viền cúc */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B]/20">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={currentConfig.layersVisible.collarAndTrim}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            layersVisible: { ...prev.layersVisible, collarAndTrim: e.target.checked },
                          }))
                        }
                        title="Bật/Tắt hiển thị Cổ áo & Cúc"
                        className="accent-[#B3261E]"
                      />
                      <input
                        type="color"
                        value={currentConfig.colors.collarAndTrim}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, collarAndTrim: e.target.value },
                          }))
                        }
                        className="w-8 h-8 rounded-lg border border-[#C9A24B] cursor-pointer bg-transparent"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">Viền Cổ & Cúc Nẹp</div>
                        <div className="text-[10px] font-mono text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                          {currentConfig.colors.collarAndTrim.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={currentConfig.colors.collarAndTrim}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, collarAndTrim: e.target.value },
                        }))
                      }
                      className="w-20 px-2 py-1 text-center font-mono text-[11px] rounded border border-[#C9A24B]/30 bg-white dark:bg-[#241409]"
                    />
                  </div>

                  {/* Lớp 5: Phụ kiện & Quai nón */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B]/20">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={currentConfig.layersVisible.headwear}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            layersVisible: { ...prev.layersVisible, headwear: e.target.checked },
                          }))
                        }
                        title="Bật/Tắt hiển thị Phụ kiện đội đầu"
                        className="accent-[#B3261E]"
                      />
                      <input
                        type="color"
                        value={currentConfig.colors.accessory || '#E7A1B0'}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, accessory: e.target.value },
                          }))
                        }
                        className="w-8 h-8 rounded-lg border border-[#C9A24B] cursor-pointer bg-transparent"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">Quai Nón & Phụ Kiện</div>
                        <div className="text-[10px] font-mono text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                          {(currentConfig.colors.accessory || '#E7A1B0').toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={currentConfig.colors.accessory || '#E7A1B0'}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, accessory: e.target.value },
                        }))
                      }
                      className="w-20 px-2 py-1 text-center font-mono text-[11px] rounded border border-[#C9A24B]/30 bg-white dark:bg-[#241409]"
                    />
                  </div>
                </div>

                {/* BẢNG MÀU CỔ PHONG NGŨ HÀNH NHANH */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C] block">
                    Gợi ý Bảng màu Cổ phong Ngũ Hành (Áp dụng nhanh cho Áo ngoài):
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TRADITIONAL_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          soundEngine.playZitherPluck(1);
                          updateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, outerRobe: c.hex },
                          }));
                          showToast(`Đã chọn màu ${c.name}`);
                        }}
                        className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition cursor-pointer ${
                          currentConfig.colors.outerRobe.toLowerCase() === c.hex.toLowerCase()
                            ? 'ring-2 ring-[#B3261E] font-bold border-transparent'
                            : 'border-[#C9A24B]/30 bg-white dark:bg-[#241409] hover:border-[#C9A24B]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[11px] font-semibold">{c.name.split(' ')[0]}</span>
                        </div>
                        <span className="text-[9px] opacity-70">Hành {c.element}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CHẤT LIỆU VẢI PBR */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-xs text-[#5A3A22] dark:text-[#DFB85C] block">
                    Chất liệu vải PBR (Vật lý phản quang):
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FABRIC_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => updateConfig((prev) => ({ ...prev, fabricId: f.id }))}
                        className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                          currentConfig.fabricId === f.id
                            ? 'bg-[#C9A24B]/20 border-[#C9A24B] font-bold text-[#5A3A22] dark:text-[#F8E2A8] ring-1 ring-[#C9A24B]'
                            : 'bg-white dark:bg-[#241409] border-[#C9A24B]/30 text-[#5A3A22]/80 dark:text-[#E8D3B5]/80'
                        }`}
                      >
                        <div className="font-semibold text-xs">{f.name}</div>
                        <div className="text-[10px] opacity-70">{f.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Điều hướng bước */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(2);
                      setActiveTab('needs');
                    }}
                    className="py-2.5 px-3 rounded-xl border border-[#C9A24B]/40 text-xs font-semibold hover:bg-[#C9A24B]/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Bước 2</span>
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playZitherPluck(4);
                      setActiveTab('culture');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1A120C] hover:brightness-110 shadow flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <span>Tiếp Tục: Thẩm Định Di Sản & Thẻ Mockup (Bước 4)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* TAB 4: BẢO ĐẢM THÔNG TIN VĂN HÓA & Ý NGHĨA TRANG PHỤC    */}
            {/* ======================================================= */}
            {activeTab === 'culture' && (
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-[#DFB85C]/15 to-[#B3261E]/10 rounded-xl border border-[#C9A24B]/40 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Yêu Cầu 4: Đề Xuất Cách Bảo Đảm Thông Tin Văn Hóa Phù Hợp</span>
                  </div>
                  <p className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80">
                    Cơ chế bảo chứng di sản kép: Bộ quy tắc Cultural Guard kiểm định chuẩn mực thời trang, cùng kho thông tin ngắn về nguồn gốc lịch sử & ý nghĩa trang phục.
                  </p>
                </div>

                {/* THẺ ĐIỂM CULTURAL GUARD */}
                <div className="p-3.5 bg-white dark:bg-[#241409] border border-[#C9A24B]/40 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#5A3A22] dark:text-[#DFB85C]">
                      <ShieldCheck
                        className={`w-4 h-4 ${
                          culturalEval.culturalScore >= 80 ? 'text-[#2F6F6A]' : 'text-[#B3261E]'
                        }`}
                      />
                      <span>Điểm Chuẩn Mực Văn Hóa:</span>
                    </div>
                    <span
                      className={`font-black text-sm px-2.5 py-0.5 rounded-full ${
                        culturalEval.culturalScore >= 80
                          ? 'bg-[#2F6F6A]/20 text-[#2F6F6A]'
                          : 'bg-[#B3261E]/20 text-[#B3261E]'
                      }`}
                    >
                      {culturalEval.culturalScore}/100
                    </span>
                  </div>

                  <div className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80">
                    Phân loại: <strong>{culturalEval.remixClassification}</strong>
                  </div>

                  {culturalEval.warnings.length > 0 ? (
                    <div className="p-2.5 bg-[#B3261E]/10 border border-[#B3261E]/30 rounded-lg text-xs text-[#B3261E] dark:text-[#FF8A80] space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{culturalEval.warnings[0].title}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {culturalEval.warnings[0].suggestion}
                      </p>
                      <button
                        onClick={handleAutoFixCulturalIssues}
                        className="w-full mt-1 py-1.5 rounded-lg bg-[#B3261E] text-white font-bold text-xs hover:bg-[#8C1B14] transition shadow cursor-pointer"
                      >
                        Tự động căn chỉnh chuẩn mực (1 chạm)
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#2F6F6A]/10 border border-[#2F6F6A]/30 rounded-lg text-[11px] text-[#2F6F6A] font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Bộ trang phục tuân thủ trọn vẹn quy cách truyền thống và tôn trọng di sản.</span>
                    </div>
                  )}
                </div>

                {/* HỘP NGUỒN GỐC & Ý NGHĨA VĂN HÓA CỦA TRANG PHỤC ĐANG CHỌN */}
                <div className="p-3.5 bg-white dark:bg-[#241409] border border-[#C9A24B]/40 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                    <BookOpen className="w-4 h-4" />
                    <span>Nguồn Gốc & Ý Nghĩa Văn Hóa Của Trang Phục:</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B]/20 space-y-1.5 text-[11px] leading-relaxed text-[#5A3A22] dark:text-[#E8D3B5]">
                    <div className="font-bold text-xs text-[#5A3A22] dark:text-[#F8E2A8]">
                      {currentContext.garmentName} ({currentContext.dynasty})
                    </div>
                    <p>{currentContext.historicalLore}</p>
                  </div>
                </div>

                {/* NÚT MỞ THẺ MOCKUP HOÀN CHỈNH */}
                <div className="space-y-2">
                  <button
                    onClick={handleOpenMockupCard}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B3261E] via-[#C9A24B] to-[#B3261E] text-white font-bold text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Xem Kết Quả Dưới Dạng Thẻ Gợi Ý Mockup</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playZitherPluck(3);
                        setActiveTab('styling');
                      }}
                      className="py-2.5 px-3 rounded-xl border border-[#C9A24B]/40 text-xs font-semibold hover:bg-[#C9A24B]/10 cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Bước 3</span>
                    </button>
                    <button
                      onClick={() => {
                        onSaveToLookbook(currentConfig);
                        setSavedSuccess(true);
                        showToast('Đã lưu thành công vào Lookbook cá nhân!');
                        setTimeout(() => setSavedSuccess(false), 2500);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-white dark:bg-[#241409] border border-[#C9A24B] text-[#5A3A22] dark:text-[#DFB85C] hover:bg-[#C9A24B]/10 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <span>Lưu vào Lookbook</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CHÂN BẢNG ĐIỀU KHIỂN DƯỚI CÙNG: NÚT THẺ GỢI Ý MOCKUP LUÔN HIỂN THỊ */}
          <div className="p-3 bg-[#FAF4EB] dark:bg-[#201309] border-t border-[#C9A24B]/30 flex items-center justify-between gap-2">
            <button
              onClick={handleOpenMockupCard}
              className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1F1206] font-bold text-xs shadow hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Xem Thẻ Mockup</span>
            </button>
            <button
              onClick={() => handleDownloadSnapshot('framed')}
              className="py-2 px-3 rounded-lg bg-white dark:bg-[#2C1C11] border border-[#C9A24B] text-[#5A3A22] dark:text-[#F8E2A8] font-semibold text-xs hover:bg-[#EFE0CC] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Xuất PNG 3D</span>
            </button>
          </div>
        </div>

        {/* KHÔNG GIAN MANNEQUIN 3D PHẢI */}
        <div className="flex-1 h-full relative bg-[#EFE0CC]/30 dark:bg-[#120B06]">
          <Mannequin3DCanvas
            config={currentConfig}
            onPoseChange={(pId) => updateConfig((prev) => ({ ...prev, poseId: pId }))}
            onCaptureReady={(fn) => {
              captureFnRef.current = fn;
            }}
          />
        </div>
      </div>

      {/* ======================================================= */}
      {/* MODAL THẺ GỢI Ý PHỐI ĐỒ MOCKUP (OUTFIT LOOK CARD)       */}
      {/* ======================================================= */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF4EB] dark:bg-[#1A120C] border-2 border-[#C9A24B] rounded-2xl max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl animate-fade-in max-h-[92vh] overflow-y-auto relative">
            <CornerOrnament position="tl" />
            <CornerOrnament position="tr" />
            <CornerOrnament position="bl" />
            <CornerOrnament position="br" />

            <div className="flex justify-between items-start border-b border-[#C9A24B]/30 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#B3261E] text-white uppercase tracking-wider">
                  THẺ GỢI Ý PHỐI ĐỒ MOCKUP
                </span>
                <h3 className="font-['SVN-Rosalinda'] text-2xl font-black text-emboss-gold mt-1.5">
                  {currentConfig.title || currentContext.garmentName}
                </h3>
                <p className="text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic">
                  Bối cảnh: {currentContext.title} · {currentContext.dynasty}
                </p>
              </div>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-1 rounded-full text-[#5A3A22] dark:text-[#E8D3B5] hover:bg-[#C9A24B]/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung Thẻ Mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hình ảnh Mockup trang phục */}
              <div className="rounded-xl overflow-hidden border-2 border-[#C9A24B]/60 bg-[#241409] flex items-center justify-center min-h-[260px] relative shadow-inner">
                {capturedSnapshotUrl ? (
                  <img
                    src={capturedSnapshotUrl}
                    alt="Mockup phối đồ"
                    className="w-full h-full object-contain max-h-[300px]"
                  />
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <span className="text-4xl">{currentContext.icon}</span>
                    <div className="font-bold text-xs text-[#F8E2A8]">{currentContext.garmentName}</div>
                    <div className="text-[10px] text-[#DEC5A4]/70">Dựng 3D theo số đo {currentConfig.bodyMetrics.weightKg}kg</div>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[10px] text-[#F8E2A8] px-2 py-0.5 rounded border border-[#C9A24B]/40">
                  {currentConfig.headwear === 'non-la' ? '👒 Có Nón Lá' : 'Khăn/Nón Di Sản'}
                </div>
              </div>

              {/* Thông số phối đồ & Bảng màu RGB */}
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#241409]/80 border border-[#C9A24B]/30 space-y-1.5">
                  <div className="font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                    Bảng màu phối thực tế (Mã RGB/Hex):
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border" style={{ backgroundColor: currentConfig.colors.outerRobe }} />
                      <span>Áo ngoài: {currentConfig.colors.outerRobe}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border" style={{ backgroundColor: currentConfig.colors.innerShirt }} />
                      <span>Áo lót: {currentConfig.colors.innerShirt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border" style={{ backgroundColor: currentConfig.colors.bottomWear }} />
                      <span>Quần/Váy: {currentConfig.colors.bottomWear}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border" style={{ backgroundColor: currentConfig.colors.collarAndTrim }} />
                      <span>Cổ viền: {currentConfig.colors.collarAndTrim}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#241409]/80 border border-[#C9A24B]/30 space-y-1">
                  <div className="font-bold text-xs text-[#5A3A22] dark:text-[#DFB85C]">
                    Phụ kiện & Điểm nhấn:
                  </div>
                  <div className="text-[11px] text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 space-y-0.5">
                    <div>• Đội đầu: <strong>{currentConfig.headwear === 'non-la' ? 'Nón Lá Bài Thơ (Nan cọ vàng)' : currentConfig.headwear}</strong></div>
                    <div>• Giày dép: <strong>{currentConfig.footwear}</strong></div>
                    <div>• Điểm nhấn Gen Z: <strong>{currentContext.modernItem}</strong></div>
                    <div>• Vóc dáng: <strong>{currentConfig.bodyMetrics.weightKg}kg · {currentConfig.bodyMetrics.heightCm}cm</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#2F6F6A]/10 border border-[#2F6F6A]/30 text-[11px]">
                  <span className="font-semibold text-[#2F6F6A]">Điểm Cultural Guard:</span>
                  <strong className="text-sm font-bold text-[#2F6F6A]">{culturalEval.culturalScore}/100</strong>
                </div>
              </div>
            </div>

            {/* ĐOẠN THÔNG TIN NGẮN VỀ NGUỒN GỐC HOẶC Ý NGHĨA CỦA TRANG PHỤC */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#DFB85C]/15 to-[#B3261E]/10 border border-[#C9A24B] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#B3261E] dark:text-[#DFB85C]">
                <BookOpen className="w-4 h-4" />
                <span>Nguồn Gốc & Ý Nghĩa Văn Hóa Cốt Lõi:</span>
              </div>
              <p className="text-xs leading-relaxed text-[#5A3A22] dark:text-[#F5EBE0]">
                {currentContext.historicalLore}
              </p>
            </div>

            {/* Nút thao tác trong Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-[#C9A24B]/30">
              <button
                onClick={() => handleDownloadSnapshot('framed')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#1F1206] font-bold text-xs shadow hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải Thẻ Gợi Ý Mockup (PNG)</span>
              </button>
              <button
                onClick={() => {
                  handleSave();
                  setShowCardModal(false);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#B3261E] text-white font-bold text-xs shadow hover:bg-[#8C1B14] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Lưu Vào Lookbook Cá Nhân</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
