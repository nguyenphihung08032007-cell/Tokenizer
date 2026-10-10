import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Share2,
  BookOpen,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Filter,
  Search,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {
  LookbookEntry,
  INITIAL_LOOKBOOK_ITEMS,
  OutfitConfiguration,
  evaluateOutfitCulturalIntegrity,
} from '../data/vietPhucData';
import { soundEngine } from '../utils/soundEngine';

interface LookbookViewProps {
  personalLookbook: LookbookEntry[];
  onSelectOutfitToFit: (config: OutfitConfiguration) => void;
  onPublishToCommunity: (entry: LookbookEntry) => void;
  lang: 'vi' | 'en';
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  personalLookbook,
  onSelectOutfitToFit,
  onPublishToCommunity,
}) => {
  const [activeTab, setActiveTab] = useState<'community' | 'personal'>('community');
  const [communityItems, setCommunityItems] = useState<LookbookEntry[]>(INITIAL_LOOKBOOK_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');

  // Flipbook Mode
  const [isFlipbookMode, setIsFlipbookMode] = useState<boolean>(false);
  const [flipbookPageIndex, setFlipbookPageIndex] = useState<number>(0);

  // Modal Share
  const [sharingEntry, setSharingEntry] = useState<LookbookEntry | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Modal Publish with Moderation
  const [publishingEntry, setPublishingEntry] = useState<LookbookEntry | null>(null);
  const [publishForm, setPublishForm] = useState({
    title: '',
    author: '',
    inspiration: '',
  });
  const [isModerating, setIsModerating] = useState<boolean>(false);
  const [moderationResult, setModerationResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLike = (id: string) => {
    soundEngine.playZitherPluck(3);
    setCommunityItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const handleCopyShareLink = (entry: LookbookEntry) => {
    const shareUrl = `${window.location.origin}/#lookbook=${entry.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      soundEngine.playZitherPluck(4);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const startPublishWorkflow = (entry: LookbookEntry) => {
    setPublishingEntry(entry);
    setPublishForm({
      title: entry.title,
      author: 'Gen Z Yêu Cổ Phục',
      inspiration: entry.description || 'Lấy cảm hứng từ nét đẹp truyền thống Việt Nam phối phong cách học đường hiện đại.',
    });
    setModerationResult(null);
  };

  const handleRunModerationAndPublish = () => {
    if (!publishingEntry) return;
    setIsModerating(true);
    soundEngine.playZitherPluck(1);

    setTimeout(() => {
      const evalRes = evaluateOutfitCulturalIntegrity(publishingEntry.outfitConfig);
      const passed = evalRes.culturalScore >= 70 && evalRes.warnings.length === 0;

      setIsModerating(false);
      setModerationResult({
        passed,
        score: evalRes.culturalScore,
        feedback: passed
          ? 'Kiểm duyệt chất lượng hoàn tất: Trang phục tôn trọng đầy đủ chuẩn mực văn hóa di sản, màu sắc hài hòa.'
          : `Cảnh báo vi phạm: Điểm văn hóa ${evalRes.culturalScore}/100. Vui lòng khắc phục: ${
              evalRes.warnings[0]?.title || 'Chưa đạt tiêu chuẩn di sản'
            }`,
      });

      if (passed) {
        soundEngine.playZitherPluck(5);
        const newCommunityEntry: LookbookEntry = {
          ...publishingEntry,
          title: publishForm.title,
          author: publishForm.author,
          description: publishForm.inspiration,
          likes: 1,
          isPublic: true,
          isVerified: true,
        };
        onPublishToCommunity(newCommunityEntry);
        setCommunityItems((prev) => [newCommunityEntry, ...prev]);
        showToast('Đã đăng tải thành công lên Khám phá Việt Phục!');
        setTimeout(() => setPublishingEntry(null), 2000);
      }
    }, 1200);
  };

  const displayedCommunity = communityItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.occasion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle =
      selectedStyleFilter === 'all' || item.styleTag.toLowerCase().includes(selectedStyleFilter);
    return matchesSearch && matchesStyle;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] w-full py-8 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
      {/* Toast thông báo */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#382214] border border-[#C9A24B] text-[#F5EBE0] px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#C9A24B]" />
          {toastMsg}
        </div>
      )}

      {/* Tiêu đề trang dập nổi */}
      <div className="text-center max-w-2xl mb-8 space-y-2">
        <h1 className="font-['SVN-Rosalinda'] text-3xl sm:text-4xl font-extrabold text-emboss-gold">
          LOOKBOOK VIỆT PHỤC
        </h1>
        <p className="font-['SVN-Bellas'] text-base sm:text-lg text-[#5A3A22] dark:text-[#E8D3B5] italic">
          “Gìn giữ cốt cách ngàn năm — Lan tỏa nguồn cảm hứng đương đại”
        </p>
      </div>

      {/* Hai Tab chính dập nổi */}
      <div className="flex rounded-xl bg-[#FAF4EB]/80 dark:bg-[#201309]/80 p-1.5 border border-[#C9A24B]/40 shadow-inner mb-8">
        <button
          onClick={() => {
            setActiveTab('community');
            soundEngine.playZitherPluck(0);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
            activeTab === 'community'
              ? 'bg-[#B3261E] text-white shadow-md'
              : 'text-[#5A3A22] dark:text-[#E8D3B5] hover:bg-[#C9A24B]/15'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Khám phá Việt phục ({communityItems.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('personal');
            soundEngine.playZitherPluck(1);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
            activeTab === 'personal'
              ? 'bg-[#B3261E] text-white shadow-md'
              : 'text-[#5A3A22] dark:text-[#E8D3B5] hover:bg-[#C9A24B]/15'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lookbook Cá Nhân ({personalLookbook.length})</span>
        </button>
      </div>

      {/* TAB 1: KHÁM PHÁ VIỆT PHỤC (CỘNG ĐỒNG) */}
      {activeTab === 'community' && (
        <div className="w-full max-w-6xl space-y-6">
          {/* Thanh tìm kiếm & Bộ lọc */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF4EB]/70 dark:bg-[#201309]/70 p-4 rounded-xl border border-[#C9A24B]/30 backdrop-blur-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A3A22]/50 dark:text-[#E8D3B5]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trang phục, sự kiện, tác giả..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/80 dark:bg-[#1A120C]/80 border border-[#C9A24B]/30 text-xs text-[#5A3A22] dark:text-[#F5EBE0] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
              <span className="text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Lọc:
              </span>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'học đường', label: 'Kỷ yếu & Học đường' },
                { id: 'nguyên bản', label: 'Nguyên bản Cung đình' },
                { id: 'cách tân', label: 'Cách tân Gen Z' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStyleFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full border transition shrink-0 ${
                    selectedStyleFilter === filter.id
                      ? 'bg-[#C9A24B] text-[#1A120C] font-bold border-[#C9A24B]'
                      : 'border-[#C9A24B]/30 bg-[#FAF4EB] dark:bg-[#1A120C] text-[#5A3A22] dark:text-[#E8D3B5] hover:border-[#C9A24B]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lưới danh sách Lookbook */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCommunity.map((item) => (
              <div
                key={item.id}
                className="group bg-[#FAF4EB] dark:bg-[#1E140C] rounded-2xl border border-[#C9A24B]/30 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#C9A24B] transition-all flex flex-col"
              >
                {/* Ảnh trang phục */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#241409]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
                          <rect width="100%" height="100%" fill="#241409"/>
                          <circle cx="200" cy="200" r="90" fill="#B3261E" opacity="0.6"/>
                          <circle cx="200" cy="200" r="130" fill="none" stroke="#DFB85C" stroke-width="2"/>
                          <text x="200" y="210" fill="#F8E2A8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${item.title}</text>
                        </svg>
                      `)}`;
                    }}
                  />
                  {/* Tag phong cách & Điểm văn hóa */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FAF4EB]/90 dark:bg-[#1A120C]/90 text-[#B3261E] dark:text-[#DFB85C] border border-[#C9A24B]/40 shadow-xs">
                      {item.styleTag}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#2F6F6A]/90 text-white shadow-xs">
                      Điểm di sản: {item.culturalScore}/100
                    </span>
                  </div>

                  {/* Nút yêu thích & chia sẻ */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="p-2 rounded-full bg-white/80 dark:bg-[#1A120C]/80 backdrop-blur-sm text-[#B3261E] hover:scale-110 transition shadow"
                    >
                      <Heart className="w-4 h-4 fill-[#B3261E]" />
                    </button>
                    <button
                      onClick={() => setSharingEntry(item)}
                      className="p-2 rounded-full bg-white/80 dark:bg-[#1A120C]/80 backdrop-blur-sm text-[#5A3A22] dark:text-[#DFB85C] hover:scale-110 transition shadow"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-['SVN-Rosalinda'] text-lg font-bold text-[#5A3A22] dark:text-[#F8E2A8] line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 italic mt-0.5">
                      Bởi {item.author} ({item.authorRole})
                    </p>
                    <p className="text-xs text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#C9A24B]/20 flex items-center justify-between">
                    <span className="text-xs text-[#5A3A22]/60 dark:text-[#E8D3B5]/60">
                      ❤️ {item.likes} lượt yêu thích
                    </span>
                    <button
                      onClick={() => {
                        soundEngine.playZitherPluck(2);
                        onSelectOutfitToFit(item.outfitConfig);
                        showToast(`Đã chuyển ${item.title} vào Phòng Thử Đồ 3D!`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#241409] font-bold text-xs hover:brightness-110 shadow-xs flex items-center gap-1.5 transition"
                    >
                      <span>Thử Trên 3D</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LOOKBOOK CÁ NHÂN */}
      {activeTab === 'personal' && (
        <div className="w-full max-w-6xl space-y-6">
          <div className="flex items-center justify-between bg-[#FAF4EB]/80 dark:bg-[#201309]/80 p-4 rounded-xl border border-[#C9A24B]/30">
            <div>
              <h2 className="font-semibold text-sm text-[#5A3A22] dark:text-[#DFB85C]">
                Bộ sưu tập của bạn ({personalLookbook.length} trang phục)
              </h2>
              <p className="text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70">
                Các mẫu bạn đã thiết kế và lưu lại trong quá trình thử đồ.
              </p>
            </div>
            {personalLookbook.length > 0 && (
              <button
                onClick={() => setIsFlipbookMode(!isFlipbookMode)}
                className="px-3.5 py-2 rounded-lg bg-[#FAF4EB] dark:bg-[#1A120C] border border-[#C9A24B] text-xs font-semibold text-[#5A3A22] dark:text-[#F8E2A8] hover:bg-[#C9A24B]/15 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#C9A24B]" />
                <span>{isFlipbookMode ? 'Chế độ Lưới' : 'Chế độ Lật Trang 3D'}</span>
              </button>
            )}
          </div>

          {personalLookbook.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF4EB]/50 dark:bg-[#1A120C]/50 rounded-2xl border border-dashed border-[#C9A24B]/40 space-y-3">
              <BookOpen className="w-12 h-12 text-[#C9A24B] mx-auto opacity-50" />
              <h3 className="font-semibold text-base text-[#5A3A22] dark:text-[#E8D3B5]">
                Chưa có trang phục nào trong Lookbook cá nhân
              </h3>
              <p className="text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 max-w-md mx-auto">
                Hãy vào <strong>Phòng Thử Đồ 3D</strong>, phối một bộ trang phục theo phong cách riêng của bạn rồi nhấn nút <strong>Lưu Lookbook</strong>!
              </p>
            </div>
          ) : isFlipbookMode ? (
            /* CHẾ ĐỘ 3D FLIPBOOK */
            <div className="relative max-w-3xl mx-auto bg-[#FAF4EB] dark:bg-[#1A120C] rounded-2xl border-2 border-[#C9A24B] p-8 shadow-2xl flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 text-xs font-semibold text-[#5A3A22] dark:text-[#DFB85C]">
                <span>
                  Trang {flipbookPageIndex + 1} / {personalLookbook.length}
                </span>
                <span className="italic">Hiệu ứng Lật sách Cổ Phong</span>
              </div>

              {personalLookbook[flipbookPageIndex] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-center">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border border-[#C9A24B]/40 bg-[#241409]">
                    <img
                      src={personalLookbook[flipbookPageIndex].imageUrl}
                      alt={personalLookbook[flipbookPageIndex].title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
                            <rect width="100%" height="100%" fill="#241409"/>
                            <circle cx="200" cy="200" r="90" fill="#B3261E" opacity="0.6"/>
                            <circle cx="200" cy="200" r="130" fill="none" stroke="#DFB85C" stroke-width="2"/>
                            <text x="200" y="210" fill="#F8E2A8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${personalLookbook[flipbookPageIndex].title}</text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-['SVN-Rosalinda'] text-2xl font-bold text-[#5A3A22] dark:text-[#F8E2A8]">
                      {personalLookbook[flipbookPageIndex].title}
                    </h3>
                    <p className="text-xs text-[#5A3A22]/80 dark:text-[#E8D3B5]/80 leading-relaxed">
                      {personalLookbook[flipbookPageIndex].description}
                    </p>
                    <div className="p-3 bg-[#EFE0CC]/50 dark:bg-[#241409] rounded-lg border border-[#C9A24B]/30 text-xs space-y-1">
                      <div className="font-semibold text-[#B3261E] dark:text-[#DFB85C]">
                        Ý nghĩa di sản:
                      </div>
                      <div className="text-[11px] opacity-80">
                        {personalLookbook[flipbookPageIndex].culturalMeaning}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          onSelectOutfitToFit(personalLookbook[flipbookPageIndex].outfitConfig);
                          showToast('Đã mở trang phục trong Phòng Thử Đồ 3D!');
                        }}
                        className="flex-1 py-2 rounded-lg bg-[#B3261E] text-white text-xs font-semibold hover:bg-[#8C1B14] transition"
                      >
                        Thử Lại Trên 3D
                      </button>
                      <button
                        onClick={() => startPublishWorkflow(personalLookbook[flipbookPageIndex])}
                        className="flex-1 py-2 rounded-lg bg-[#C9A24B] text-[#1A120C] text-xs font-bold hover:brightness-110 transition"
                      >
                        Đăng Lên Cộng Đồng
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Điều khiển lật trang */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  disabled={flipbookPageIndex === 0}
                  onClick={() => {
                    soundEngine.playZitherPluck(0);
                    setFlipbookPageIndex((p) => Math.max(0, p - 1));
                  }}
                  className="p-2 rounded-full border border-[#C9A24B] disabled:opacity-30 hover:bg-[#C9A24B]/20 transition"
                >
                  <ChevronLeft className="w-5 h-5 text-[#5A3A22] dark:text-[#DFB85C]" />
                </button>
                <button
                  disabled={flipbookPageIndex >= personalLookbook.length - 1}
                  onClick={() => {
                    soundEngine.playZitherPluck(1);
                    setFlipbookPageIndex((p) => Math.min(personalLookbook.length - 1, p + 1));
                  }}
                  className="p-2 rounded-full border border-[#C9A24B] disabled:opacity-30 hover:bg-[#C9A24B]/20 transition"
                >
                  <ChevronRight className="w-5 h-5 text-[#5A3A22] dark:text-[#DFB85C]" />
                </button>
              </div>
            </div>
          ) : (
            /* CHẾ ĐỘ LƯỚI BÌNH THƯỜNG */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalLookbook.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF4EB] dark:bg-[#1E140C] rounded-2xl border border-[#C9A24B]/30 overflow-hidden shadow-lg p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#241409] border border-[#C9A24B]/20">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
                            <rect width="100%" height="100%" fill="#241409"/>
                            <circle cx="200" cy="200" r="90" fill="#B3261E" opacity="0.6"/>
                            <circle cx="200" cy="200" r="130" fill="none" stroke="#DFB85C" stroke-width="2"/>
                            <text x="200" y="210" fill="#F8E2A8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${item.title}</text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-['SVN-Rosalinda'] text-lg font-bold text-[#5A3A22] dark:text-[#F8E2A8]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5A3A22]/70 dark:text-[#E8D3B5]/70 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9A24B]/20">
                    <button
                      onClick={() => {
                        onSelectOutfitToFit(item.outfitConfig);
                        showToast('Đã tải lại vào Phòng Thử Đồ 3D!');
                      }}
                      className="py-2 rounded-lg bg-[#FAF4EB] dark:bg-[#241409] border border-[#C9A24B] text-xs font-semibold text-[#5A3A22] dark:text-[#F8E2A8] hover:bg-[#EFE0CC]"
                    >
                      Mở Trên 3D
                    </button>
                    <button
                      onClick={() => startPublishWorkflow(item)}
                      className="py-2 rounded-lg bg-gradient-to-r from-[#B3261E] to-[#8C1B14] text-white text-xs font-semibold hover:brightness-110 flex items-center justify-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Đăng Tải</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL CHIA SẺ & MÃ QR */}
      {sharingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF4EB] dark:bg-[#1A120C] border-2 border-[#C9A24B] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#C9A24B]/30 pb-3">
              <h3 className="font-['SVN-Rosalinda'] text-lg font-bold text-[#5A3A22] dark:text-[#F8E2A8]">
                Chia sẻ Lookbook Việt Phục
              </h3>
              <button
                onClick={() => setSharingEntry(null)}
                className="text-[#5A3A22] dark:text-[#E8D3B5] hover:opacity-70 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mã QR Mô Phỏng Động */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[#C9A24B]/40 shadow-inner">
              <div className="w-40 h-40 bg-[#FAF4EB] border-2 border-[#5A3A22] p-2 flex flex-col items-center justify-center rounded">
                <QrCode className="w-24 h-24 text-[#5A3A22]" />
                <span className="text-[10px] font-bold text-[#B3261E] mt-1">VLINE · VIỆT PHỤC</span>
              </div>
              <p className="text-[11px] text-[#5A3A22] mt-2 font-medium text-center">
                Quét mã để chiêm ngưỡng tác phẩm “{sharingEntry.title}” trên thiết bị di động
              </p>
            </div>

            {/* Nút Sao chép liên kết */}
            <button
              onClick={() => handleCopyShareLink(sharingEntry)}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#DFB85C] to-[#C9A24B] text-[#241409] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Đã sao chép liên kết!' : 'Sao chép đường dẫn tác phẩm'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG TẢI & KIỂM DUYỆT CHẤT LƯỢNG CỦA CULTURAL GUARD */}
      {publishingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF4EB] dark:bg-[#1A120C] border-2 border-[#C9A24B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#C9A24B]/30 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#B3261E]" />
                <h3 className="font-['SVN-Rosalinda'] text-lg font-bold text-[#5A3A22] dark:text-[#F8E2A8]">
                  Đăng Tải Lên Cộng Đồng
                </h3>
              </div>
              <button
                onClick={() => setPublishingEntry(null)}
                className="text-[#5A3A22] dark:text-[#E8D3B5] hover:opacity-70 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#5A3A22] dark:text-[#DFB85C] block mb-1">
                  Tên bộ trang phục:
                </label>
                <input
                  type="text"
                  value={publishForm.title}
                  onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-[#241409] border border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#F5EBE0]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#5A3A22] dark:text-[#DFB85C] block mb-1">
                  Tên người sáng tạo / Tác giả:
                </label>
                <input
                  type="text"
                  value={publishForm.author}
                  onChange={(e) => setPublishForm({ ...publishForm, author: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-[#241409] border border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#F5EBE0]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#5A3A22] dark:text-[#DFB85C] block mb-1">
                  Cảm hứng văn hóa & Lời bình:
                </label>
                <textarea
                  rows={3}
                  value={publishForm.inspiration}
                  onChange={(e) => setPublishForm({ ...publishForm, inspiration: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-[#241409] border border-[#C9A24B]/30 text-[#5A3A22] dark:text-[#F5EBE0]"
                />
              </div>
            </div>

            {/* Thông báo kết quả kiểm duyệt */}
            {moderationResult && (
              <div
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  moderationResult.passed
                    ? 'bg-[#2F6F6A]/10 border-[#2F6F6A] text-[#2F6F6A]'
                    : 'bg-[#B3261E]/10 border-[#B3261E] text-[#B3261E]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {moderationResult.passed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>
                    {moderationResult.passed
                      ? 'Kiểm Duyệt Thành Công'
                      : 'Không Đạt Tiêu Chuẩn Văn Hóa'}
                  </span>
                </div>
                <p className="leading-relaxed opacity-90">{moderationResult.feedback}</p>
              </div>
            )}

            <button
              onClick={handleRunModerationAndPublish}
              disabled={isModerating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#B3261E] to-[#8C1B14] text-white font-bold text-xs hover:brightness-110 shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isModerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Cultural Guard đang kiểm duyệt di sản...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Kiểm Duyệt & Đăng Tải Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
