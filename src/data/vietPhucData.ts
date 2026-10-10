// Cơ sở dữ liệu Văn hóa Việt phục & Bộ quy tắc Cultural Guard

// Helper tạo ảnh minh họa trang phục cổ phong bằng SVG Data URI chuẩn mực 100% không bao giờ lỗi
export function createHeritageSvgImage(
  title: string,
  color1: string,
  color2: string,
  motif: string,
  garmentType: string = 'ao-tac'
): string {
  // Biểu tượng đặc trưng theo từng loại trang phục
  let specificMotifs = '';
  let collarPath = '<path d="M 185 120 L 215 120 L 218 145 L 182 145 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>';
  let hatMotif = '';

  if (garmentType === 'ao-nhat-binh') {
    // Cổ áo hình chữ nhật đặc trưng & dải Thủy ba ngũ sắc
    collarPath = `
      <rect x="175" y="118" width="50" height="90" fill="none" stroke="#DFB85C" stroke-width="4"/>
      <rect x="180" y="122" width="40" height="82" fill="none" stroke="#B3261E" stroke-width="2.5"/>
      <line x1="170" y1="210" x2="230" y2="210" stroke="#DFB85C" stroke-width="3"/>
    `;
    specificMotifs = `
      <!-- Ngũ sắc thủy ba ở gấu áo và cổ tay -->
      <g opacity="0.9">
        <line x1="85" y1="230" x2="105" y2="210" stroke="#3A75C4" stroke-width="3"/>
        <line x1="90" y1="235" x2="110" y2="215" stroke="#F1C40F" stroke-width="3"/>
        <line x1="95" y1="240" x2="115" y2="220" stroke="#E74C3C" stroke-width="3"/>
        <line x1="100" y1="245" x2="120" y2="225" stroke="#2ECC71" stroke-width="3"/>
        <line x1="295" y1="210" x2="315" y2="230" stroke="#3A75C4" stroke-width="3"/>
        <line x1="290" y1="215" x2="310" y2="235" stroke="#F1C40F" stroke-width="3"/>
        <line x1="285" y1="220" x2="305" y2="240" stroke="#E74C3C" stroke-width="3"/>
        <line x1="280" y1="225" x2="300" y2="245" stroke="#2ECC71" stroke-width="3"/>
      </g>
    `;
    hatMotif = `
      <!-- Khăn Vấn Cung Đình -->
      <ellipse cx="200" cy="88" rx="36" ry="14" fill="#B3261E" stroke="#DFB85C" stroke-width="2.5"/>
      <ellipse cx="200" cy="86" rx="30" ry="10" fill="#8C1B14" stroke="#DFB85C" stroke-width="1.5"/>
    `;
  } else if (garmentType === 'ao-dai') {
    // Áo dài thướt tha + Nón lá
    collarPath = '<path d="M 188 116 L 212 116 L 214 140 L 186 140 Z" fill="none" stroke="url(#gold)" stroke-width="2.5"/>';
    hatMotif = `
      <!-- Nón Lá Truyền Thống -->
      <polygon points="200,52 145,86 255,86" fill="#F0E3CA" stroke="#C9A24B" stroke-width="2"/>
      <ellipse cx="200" cy="86" rx="55" ry="6" fill="#DEC5A4" stroke="#C9A24B" stroke-width="1.5"/>
      <line x1="168" y1="86" x2="190" y2="108" stroke="#E7A1B0" stroke-width="2"/>
      <line x1="232" y1="86" x2="210" y2="108" stroke="#E7A1B0" stroke-width="2"/>
    `;
  } else if (garmentType === 'ao-tu-than') {
    // Nón quai thao Kinh Bắc + Yếm đào
    collarPath = `
      <polygon points="200,135 180,180 220,180" fill="#E7A1B0" stroke="#C9A24B" stroke-width="1.5"/>
      <line x1="175" y1="135" x2="195" y2="200" stroke="#DFB85C" stroke-width="2"/>
      <line x1="225" y1="135" x2="205" y2="200" stroke="#DFB85C" stroke-width="2"/>
    `;
    hatMotif = `
      <!-- Nón Quai Thao -->
      <ellipse cx="200" cy="78" rx="65" ry="15" fill="#E8D5B5" stroke="#8C6622" stroke-width="2.5"/>
      <ellipse cx="200" cy="78" rx="28" ry="7" fill="#C9A24B" stroke="#5A3A22" stroke-width="1.5"/>
      <line x1="150" y1="84" x2="180" y2="135" stroke="#B3261E" stroke-width="2"/>
      <line x1="250" y1="84" x2="220" y2="135" stroke="#B3261E" stroke-width="2"/>
    `;
  } else if (garmentType === 'ao-giao-linh') {
    // Cổ áo giao vạt chéo chữ Y (hữu nhẫm)
    collarPath = `
      <path d="M 172 120 L 225 185 M 228 120 L 195 160" stroke="#DFB85C" stroke-width="3.5" fill="none"/>
      <line x1="160" y1="210" x2="240" y2="210" stroke="#DFB85C" stroke-width="4"/>
    `;
    hatMotif = `
      <!-- Khăn quấn Đại Việt -->
      <ellipse cx="200" cy="85" rx="34" ry="12" fill="#1E3A5F" stroke="#DFB85C" stroke-width="2"/>
    `;
  } else if (garmentType === 'ao-truc-linh') {
    // Đối khâm nẹp thẳng song song
    collarPath = `
      <line x1="188" y1="120" x2="188" y2="380" stroke="#DFB85C" stroke-width="3"/>
      <line x1="212" y1="120" x2="212" y2="380" stroke="#DFB85C" stroke-width="3"/>
    `;
    hatMotif = `
      <ellipse cx="200" cy="86" rx="30" ry="11" fill="#3D2614" stroke="#DFB85C" stroke-width="1.8"/>
    `;
  } else if (garmentType === 'ao-ba-ba') {
    // Cổ tròn không bâu + cúc giữa + 2 túi
    collarPath = `
      <path d="M 185 125 Q 200 142 215 125" fill="none" stroke="#DFB85C" stroke-width="3"/>
      <line x1="200" y1="135" x2="200" y2="340" stroke="#DFB85C" stroke-width="2"/>
    `;
    specificMotifs = `
      <!-- 2 túi áo bà ba -->
      <rect x="160" y="270" width="28" height="32" rx="4" fill="none" stroke="#DFB85C" stroke-width="2"/>
      <rect x="212" y="270" width="28" height="32" rx="4" fill="none" stroke="#DFB85C" stroke-width="2"/>
    `;
    hatMotif = `
      <!-- Nón Lá Nam Bộ -->
      <polygon points="200,55 145,86 255,86" fill="#F0E3CA" stroke="#C9A24B" stroke-width="2"/>
      <ellipse cx="200" cy="86" rx="55" ry="6" fill="#DEC5A4" stroke="#C9A24B" stroke-width="1.5"/>
    `;
  } else if (garmentType === 'ao-tac') {
    // Áo tấc tay thụng rộng
    collarPath = '<path d="M 185 118 L 215 118 L 217 145 L 183 145 Z" fill="none" stroke="url(#gold)" stroke-width="3.5"/>';
    hatMotif = `
      <!-- Khăn Đóng Lễ Phục -->
      <ellipse cx="200" cy="85" rx="34" ry="12" fill="#1E3A5F" stroke="#DFB85C" stroke-width="2"/>
      <path d="M 172 85 Q 200 70 228 85" fill="none" stroke="#DFB85C" stroke-width="1.5"/>
    `;
  } else {
    // ao-ngu-than / ao-ngu-than-tay-chen mặc định
    hatMotif = `
      <!-- Khăn Đóng -->
      <ellipse cx="200" cy="85" rx="34" ry="12" fill="#1F1D1B" stroke="#C9A24B" stroke-width="2"/>
      <path d="M 172 85 Q 200 70 228 85" fill="none" stroke="#DFB85C" stroke-width="1.5"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_${title.replace(/\\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D1A0E"/>
        <stop offset="50%" stop-color="#1E1007"/>
        <stop offset="100%" stop-color="#140A04"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#DFB85C"/>
        <stop offset="50%" stop-color="#C9A24B"/>
        <stop offset="100%" stop-color="#8C6622"/>
      </linearGradient>
      <radialGradient id="aura" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#C9A24B" stop-opacity="0.35"/>
        <stop offset="60%" stop-color="#B3261E" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#1E1007" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg_${title.replace(/\\s+/g, '')})"/>
    <circle cx="200" cy="220" r="160" fill="url(#aura)"/>
    <circle cx="200" cy="220" r="140" fill="none" stroke="#C9A24B" stroke-width="1.5" opacity="0.3"/>
    <circle cx="200" cy="220" r="100" fill="none" stroke="#B3261E" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.5"/>
    
    <!-- Hoa sen hoặc nón trên đầu -->
    ${hatMotif}
    
    <!-- Dáng áo chính -->
    <path d="M 170 120 L 230 120 L 250 170 L 320 220 L 290 250 L 240 210 L 255 420 L 145 420 L 160 210 L 110 250 L 80 220 L 150 170 Z" fill="${color1}" stroke="#C9A24B" stroke-width="2.5" opacity="0.95"/>
    
    <!-- Vạt áo / Lớp trong -->
    <path d="M 185 120 L 215 120 L 225 180 L 200 420 L 175 180 Z" fill="${color2}" stroke="#DFB85C" stroke-width="1.5" opacity="0.85"/>
    
    <!-- Viền cổ áo & Hạt khuy -->
    ${collarPath}
    <circle cx="216" cy="160" r="3.5" fill="#DFB85C"/>
    <circle cx="218" cy="180" r="3.5" fill="#DFB85C"/>
    <circle cx="218" cy="205" r="3.5" fill="#DFB85C"/>
    <circle cx="216" cy="235" r="3.5" fill="#DFB85C"/>
    <circle cx="212" cy="265" r="3.5" fill="#DFB85C"/>
    
    ${specificMotifs}
    
    <!-- Họa tiết mây / sóng nước dưới gấu -->
    <path d="M 150 405 Q 175 390 200 405 T 250 405" fill="none" stroke="#DFB85C" stroke-width="2"/>
    <text x="200" y="475" fill="#F8E2A8" font-family="Georgia, serif" font-size="20" font-weight="bold" text-anchor="middle">${title}</text>
    <text x="200" y="498" fill="#C9A24B" font-family="Georgia, serif" font-size="12" font-style="italic" text-anchor="middle">${motif}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface GarmentCulturalItem {
  id: string;
  name: string;
  englishName: string;
  shortTag: string;
  dynasty: string;
  region: string;
  imageUrl: string;
  historicalContext: string;
  structureAndForm: string;
  motifMeaning: string;
  suitableOccasions: string[];
  accessories: string[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
  commonMistakes: string;
  referenceSource: string;
  verificationStatus: 'Đã kiểm chứng' | 'Cần xác minh';
  isEthnicMinority?: boolean;
  ethnicCommunityNote?: string;
  default3D: {
    garmentModel: 'ao-nhat-binh' | 'ao-tac' | 'ao-ngu-than-tay-chen' | 'ao-tu-than' | 'ao-giao-linh' | 'ao-truc-linh' | 'ao-dai' | 'ao-ba-ba' | 'ao-yem';
    primaryColor: string;
    secondaryColor: string;
    bottomColor: string;
    trimColor: string;
    fabricId: string;
    patternId: string;
    bottomType: 'quan-lua' | 'vay-dup' | 'quan-jeans';
    headwear: 'none' | 'non-la' | 'non-quai-thao' | 'khan-van' | 'khan-dong';
    handAccessory: 'none' | 'quat-giay' | 'tui-gam' | 'tui-tote';
    footwear: 'guoc-moc' | 'hai-theu' | 'sneaker-trang';
    modernOuter: 'none' | 'blazer';
    sunglasses: boolean;
    remixLevel: number;
  };
}

export const POPULAR_SEARCH_TAGS = [
  'Áo ngũ thân tay chẽn',
  'Áo tấc',
  'Áo Nhật Bình',
  'Áo giao lĩnh',
  'Áo trực lĩnh',
  'Áo tứ thân',
  'Áo dài',
  'Áo bà ba',
];

export interface CoreGarmentDef {
  id: string;
  model: 'ao-ngu-than-tay-chen' | 'ao-tac' | 'ao-nhat-binh' | 'ao-giao-linh' | 'ao-truc-linh' | 'ao-tu-than' | 'ao-dai' | 'ao-ba-ba';
  name: string;
  englishName: string;
  icon: string;
  dynasty: string;
  badge: string;
  shortDesc: string;
  defaultColors: {
    outer: string;
    inner: string;
    bottom: string;
    trim: string;
  };
  defaultHeadwear: 'none' | 'non-la' | 'non-quai-thao' | 'khan-van' | 'khan-dong';
  defaultFootwear: 'guoc-moc' | 'hai-theu' | 'sneaker-trang';
  defaultHandAcc: 'none' | 'quat-giay' | 'tui-gam' | 'tui-tote';
  bottomType: 'quan-lua' | 'vay-dup' | 'quan-jeans';
}

export const CORE_EIGHT_GARMENTS: CoreGarmentDef[] = [
  {
    id: 'ao-ngu-than-tay-chen',
    model: 'ao-ngu-than-tay-chen',
    name: 'Áo ngũ thân tay chẽn',
    englishName: 'Five-Panel Tight-Sleeved Tunic',
    icon: '👘',
    dynasty: 'Triều Nguyễn (1744 – 1945)',
    badge: 'Tiền thân Áo Dài · Cổ đứng 5 khuy',
    shortDesc: 'Gồm 5 thân vải tượng trưng tứ thân phụ mẫu và người mặc, 5 hạt khuy ngọc cài bên phải biểu thị Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín), tay áo chẽn gọn gàng.',
    defaultColors: {
      outer: '#2F6F6A',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#C9A24B',
    },
    defaultHeadwear: 'khan-dong',
    defaultFootwear: 'sneaker-trang',
    defaultHandAcc: 'tui-gam',
    bottomType: 'quan-lua',
  },
  {
    id: 'ao-tac',
    model: 'ao-tac',
    name: 'Áo tấc',
    englishName: 'Five-Panel Wide-Sleeved Ceremonial Robe',
    icon: '👘',
    dynasty: 'Triều Nguyễn · Đại lễ phục',
    badge: 'Tay thụng rộng · Lễ nghi trang trọng',
    shortDesc: 'Đại lễ phục cổ truyền thời Nguyễn, tay áo may thụng dài vuông góc che kín hai bàn tay khi chắp trước bụng, toát lên phong thái khoan hòa, đĩnh đạc.',
    defaultColors: {
      outer: '#1E3A5F',
      inner: '#F5EBE0',
      bottom: '#F5EBE0',
      trim: '#C9A24B',
    },
    defaultHeadwear: 'khan-dong',
    defaultFootwear: 'hai-theu',
    defaultHandAcc: 'quat-giay',
    bottomType: 'quan-lua',
  },
  {
    id: 'ao-nhat-binh',
    model: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    englishName: 'Imperial Rectangular-Collar Robe',
    icon: '👑',
    dynasty: 'Triều Nguyễn · Cung đình & Mệnh phụ',
    badge: 'Cổ chữ Nhật · Thủy ba ngũ sắc',
    shortDesc: 'Lễ phục quý phái của Hoàng hậu, Công chúa và Mệnh phụ triều Nguyễn, dải cổ áo to bản khép thành chữ Nhật (日), gấu áo và tay áo dệt thêu Thủy ba ngũ sắc rực rỡ.',
    defaultColors: {
      outer: '#B3261E',
      inner: '#F5EBE0',
      bottom: '#1E3A5F',
      trim: '#DFB85C',
    },
    defaultHeadwear: 'khan-van',
    defaultFootwear: 'hai-theu',
    defaultHandAcc: 'quat-giay',
    bottomType: 'vay-dup',
  },
  {
    id: 'ao-giao-linh',
    model: 'ao-giao-linh',
    name: 'Áo giao lĩnh',
    englishName: 'Cross-Collared Historical Robe',
    icon: '📜',
    dynasty: 'Thời Lý – Trần – Hậu Lê',
    badge: 'Cổ giao chéo chữ Y · Cổ phong Đại Việt',
    shortDesc: 'Dạng thức y phục cổ xưa nhất của người Việt với cổ áo vắt chéo (hữu nhẫm – vạt trái đè vạt phải tạo hình chữ Y), thắt đai lưng gấm, hào khí nghìn năm Thăng Long.',
    defaultColors: {
      outer: '#1E3A5F',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#DFB85C',
    },
    defaultHeadwear: 'khan-dong',
    defaultFootwear: 'hai-theu',
    defaultHandAcc: 'quat-giay',
    bottomType: 'vay-dup',
  },
  {
    id: 'ao-truc-linh',
    model: 'ao-truc-linh',
    name: 'Áo trực lĩnh',
    englishName: 'Straight-Collared Open Robe',
    icon: '🎋',
    dynasty: 'Thời Lý – Trần – Lê',
    badge: 'Đối khâm tự tại · Nẹp cổ thẳng song song',
    shortDesc: 'Áo đối khâm với hai nẹp cổ thẳng buông dọc hai bên ngực, dáng suông phóng khoáng, rất được giới trẻ Gen Z yêu thích khi phối khoác ngoài (outerwear).',
    defaultColors: {
      outer: '#5A3A22',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#C9A24B',
    },
    defaultHeadwear: 'none',
    defaultFootwear: 'sneaker-trang',
    defaultHandAcc: 'tui-tote',
    bottomType: 'quan-jeans',
  },
  {
    id: 'ao-tu-than',
    model: 'ao-tu-than',
    name: 'Áo tứ thân',
    englishName: 'Four-Panel Flowing Folk Robe',
    icon: '🌸',
    dynasty: 'Thời Lê – Nguyễn · Bắc Bộ',
    badge: 'Bốn vạt buông lơi · Yếm đào & Nón quai thao',
    shortDesc: 'Biểu tượng của các liền chị Quan họ Kinh Bắc với bốn vạt áo thướt tha, lớp yếm đào sen bên trong và chiếc nón quai thao tròn rộng vành duyên dáng.',
    defaultColors: {
      outer: '#5A3A22',
      inner: '#E7A1B0',
      bottom: '#1F1D1B',
      trim: '#2F6F6A',
    },
    defaultHeadwear: 'non-quai-thao',
    defaultFootwear: 'guoc-moc',
    defaultHandAcc: 'none',
    bottomType: 'vay-dup',
  },
  {
    id: 'ao-dai',
    model: 'ao-dai',
    name: 'Áo dài',
    englishName: 'Vietnamese Ao Dai',
    icon: '🌺',
    dynasty: 'Thế kỷ XX – Đương đại',
    badge: 'Quốc phục Việt Nam · Hai tà thướt tha',
    shortDesc: 'Quốc phục thanh lịch kế thừa từ áo ngũ thân truyền thống, xẻ hai tà ở eo buông dài chấm gót, mặc cùng quần lụa ống rộng và nón lá bài thơ duyên dáng.',
    defaultColors: {
      outer: '#B3261E',
      inner: '#F5EBE0',
      bottom: '#F5EBE0',
      trim: '#C9A24B',
    },
    defaultHeadwear: 'non-la',
    defaultFootwear: 'guoc-moc',
    defaultHandAcc: 'tui-gam',
    bottomType: 'quan-lua',
  },
  {
    id: 'ao-ba-ba',
    model: 'ao-ba-ba',
    name: 'Áo bà ba',
    englishName: 'Southern Ao Ba Ba',
    icon: '🚣',
    dynasty: 'Cuối TK XIX – Đương đại',
    badge: 'Nam Bộ sông nước · Cổ tròn & Khăn rằn',
    shortDesc: 'Trang phục mộc mạc, phóng khoáng của cư dân Nam Bộ với cổ tròn xẻ giữa, hai túi tiện dụng ở vạt trước, thường kết hợp khăn rằn rủ vai và nón lá chóp nhọn.',
    defaultColors: {
      outer: '#C9A24B',
      inner: '#F5EBE0',
      bottom: '#1F1D1B',
      trim: '#5A3A22',
    },
    defaultHeadwear: 'non-la',
    defaultFootwear: 'guoc-moc',
    defaultHandAcc: 'tui-tote',
    bottomType: 'quan-lua',
  },
];

export const VIET_PHUC_CATALOG: GarmentCulturalItem[] = [
  {
    id: 'ao-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    englishName: 'Five-Panel Tight-Sleeved Tunic',
    shortTag: 'Áo ngũ thân tay chẽn',
    dynasty: 'Thời Chúa Nguyễn – Triều Nguyễn (Thế kỷ XVIII – XX)',
    region: 'Phổ biến toàn quốc (Bắc – Trung – Nam)',
    imageUrl: createHeritageSvgImage('Áo Ngũ Thân Tay Chẽn', '#2F6F6A', '#F5EBE0', 'Họa tiết Hoa Cúc Dây & Chữ Thọ', 'ao-ngu-than'),
    historicalContext:
      'Ra đời từ cuộc cải cách trang phục của Chúa Nguyễn Phúc Khoát năm 1744 tại Đàng Trong và được vua Minh Mạng định chế thống nhất trên cả nước. Đây là tiền thân trực tiếp của tà áo dài Việt Nam hiện đại.',
    structureAndForm:
      'Gồm 5 thân vải ghép lại (2 thân trước, 2 thân sau ghép qua đường sống lưng trung phùng, và 1 thân con nằm khuất phía trước bên phải). Cổ áo đứng cao vừa phải, cài 5 hạt khuy bên phải. Tay áo chẽn gọn gàng.',
    motifMeaning:
      'Năm thân áo tượng trưng cho tứ thân phụ mẫu và chính bản thân. Năm hạt khuy đại diện cho Ngũ thường: Nhân – Nghĩa – Lễ – Trí – Tín. Đường sống lưng thẳng đứng nhắc nhở đạo lý ngay thẳng.',
    suitableOccasions: [
      'Chụp kỷ yếu học sinh – sinh viên',
      'Dạo phố, cà phê cuối tuần',
      'Tham quan bảo tàng, di tích lịch sử',
      'Lễ Tết, sum họp gia đình',
    ],
    accessories: [
      'Khăn đóng / Khăn xếp',
      'Quần lĩnh trắng hoặc đen ống rộng',
      'Guốc mộc hoặc Sneaker trắng tối giản (Remix)',
      'Túi gấm rút dây hoặc Túi tote canvas',
    ],
    dosAndDonts: {
      dos: [
        'Luôn mặc kèm áo lót trắng bên trong để giữ vệ sinh và tạo điểm nhấn cổ trắng.',
        'Giữ phom áo suông tự nhiên ở phần eo, tôn trọng cấu trúc 5 hạt nút cài bên phải.',
      ],
      donts: [
        'Không may khóa kéo sau lưng hoặc chiết eo bó sát làm mất phom cổ phục ngũ thân.',
        'Tránh mặc quần ngắn bên trong tà áo ngũ thân.',
      ],
    },
    commonMistakes: 'Nhầm lẫn Áo Ngũ Thân với áo dài chiết eo hiện đại; bỏ lớp áo lót trắng bên trong.',
    referenceSource: 'Sách "Ngàn Năm Áo Mũ" (Trần Quang Đức) & Bảo tàng Lịch sử Quốc gia',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-ngu-than-tay-chen',
      primaryColor: '#2F6F6A',
      secondaryColor: '#F5EBE0',
      bottomColor: '#1F1D1B',
      trimColor: '#C9A24B',
      fabricId: 'gam',
      patternId: 'hoa-cuc',
      bottomType: 'quan-lua',
      headwear: 'none',
      handAccessory: 'tui-gam',
      footwear: 'sneaker-trang',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 35,
    },
  },
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Ngũ Thân Tay Thụng)',
    englishName: 'Five-Panel Wide-Sleeved Ceremonial Robe',
    shortTag: 'Áo tấc',
    dynasty: 'Thời Chúa Nguyễn – Triều Nguyễn (Thế kỷ XVIII – XX)',
    region: 'Toàn quốc (Đại lễ phục dân gian & quan viên)',
    imageUrl: createHeritageSvgImage('Áo Tấc Cổ Lễ', '#1E3A5F', '#F5EBE0', 'Tay Thụng Rộng & Chữ Thọ Triện'),
    historicalContext:
      'Áo Tấc (còn gọi là áo lễ, áo thụng) là lễ phục truyền thống quan trọng của người Việt thời Nguyễn dùng trong các dịp trọng đại như lễ cưới, tế lễ gia tiên, mừng thọ hay lễ hội đình làng.',
    structureAndForm:
      'Cấu trúc 5 thân nhưng phần tay áo dài và thụng rộng, khi chắp tay trước ngực phần ống tay rủ xuống che kín bàn tay tạo vẻ uy nghi, đĩnh đạc.',
    motifMeaning:
      'Thường dệt hoa văn chữ Thọ, chữ Phúc, vân mây Tường vân hoặc hoa cúc dây. Độ rộng của tay áo thể hiện sự sung túc, khoan hòa và tôn kính.',
    suitableOccasions: [
      'Lễ cưới truyền thống',
      'Chụp ảnh kỷ yếu tốt nghiệp',
      'Lễ Tết, lễ giỗ tổ, lễ hội văn hóa',
    ],
    accessories: [
      'Khăn đóng / Khăn vấn',
      'Quạt giấy / Quạt trầm hương',
      'Hài thêu hoặc Guốc mộc',
    ],
    dosAndDonts: {
      dos: [
        'Tư thế chắp hai tay trước bụng giúp phô diễn trọn vẹn vẻ đẹp của đôi tay áo thụng.',
        'Chọn chất liệu gấm hoặc lụa có độ đứng phom vừa phải.',
      ],
      donts: [
        'Không xắn tay áo tấc lên cao khi đang ở khu vực hành lễ trang nghiêm.',
        'Tránh khoác blazer chật làm nhăn gãy tay áo thụng.',
      ],
    },
    commonMistakes: 'May tay áo quá ngắn hoặc nách áo quá hẹp kiểu Tây phục.',
    referenceSource: 'Bảo tàng Cổ vật Cung đình Huế & Trung tâm Di tích Cố đô Huế',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-tac',
      primaryColor: '#1E3A5F',
      secondaryColor: '#F5EBE0',
      bottomColor: '#F5EBE0',
      trimColor: '#C9A24B',
      fabricId: 'gam',
      patternId: 'chu-tho',
      bottomType: 'quan-lua',
      headwear: 'khan-dong',
      handAccessory: 'quat-giay',
      footwear: 'hai-theu',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 15,
    },
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    englishName: 'Nhat Binh Imperial Collar Robe',
    shortTag: 'Áo Nhật Bình',
    dynasty: 'Triều Nguyễn (1802 – 1945)',
    region: 'Kinh đô Huế & Toàn quốc',
    imageUrl: createHeritageSvgImage('Áo Nhật Bình', '#B3261E', '#F5EBE0', 'Cổ Áo Chữ Nhật & Thủy Ba Ngũ Sắc', 'ao-nhat-binh'),
    historicalContext:
      'Thường phục của bậc Hậu, Phi, Công chúa và mệnh phụ phu nhân triều Nguyễn. Sau năm 1945, áo Nhật Bình lan tỏa ra dân gian, trở thành lễ phục cưới hỏi trang trọng của phụ nữ Huế và Việt Nam.',
    structureAndForm:
      'Áo dáng đối khâm, cổ áo to bản hình chữ nhật chạy dọc trước ngực ghép lại thành chữ Nhật (日). Cổ tay và gấu áo trang trí dải ngũ sắc Thủy ba rực rỡ.',
    motifMeaning:
      'Họa tiết Loan Phượng, hoa sen, mẫu đơn kết hợp Bát Bửu và sóng nước Thủy ba biểu trưng cho vẻ đẹp cao quý, phúc khí và trường tồn.',
    suitableOccasions: [
      'Lễ cưới hỏi truyền thống',
      'Sự kiện văn hóa, triển lãm nghệ thuật',
      'Chụp ảnh concept Cung đình',
    ],
    accessories: [
      'Khăn vấn (Khăn vành dây)',
      'Trâm cài tóc phượng',
      'Kiềng vàng / Vòng ngọc',
      'Hài thêu',
    ],
    dosAndDonts: {
      dos: [
        'Mặc kèm áo ngũ thân lót trắng bên trong và quần lĩnh hoặc váy mã diện.',
        'Giữ nguyên tỷ lệ cổ áo chữ Nhật và dải ngũ sắc.',
      ],
      donts: [
        'Không mặc áo Nhật Bình đỏ thêu lộng lẫy tới các nghi lễ tang sự.',
        'Không cắt ngắn áo Nhật Bình thành dạng croptop.',
      ],
    },
    commonMistakes: 'Mặc áo Nhật Bình trực tiếp không có áo lót cổ đứng bên trong.',
    referenceSource: 'Bảo tàng Cổ vật Cung đình Huế',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-nhat-binh',
      primaryColor: '#B3261E',
      secondaryColor: '#F5EBE0',
      bottomColor: '#F5EBE0',
      trimColor: '#C9A24B',
      fabricId: 'gam',
      patternId: 'van-may',
      bottomType: 'vay-dup',
      headwear: 'khan-van',
      handAccessory: 'quat-giay',
      footwear: 'hai-theu',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 20,
    },
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân & Yếm Đào',
    englishName: 'Four-Panel Flowing Folk Robe',
    shortTag: 'Áo tứ thân',
    dynasty: 'Thời Lê Trung Hưng – Nguyễn (Thế kỷ XVII – XX)',
    region: 'Đồng bằng Bắc Bộ & Kinh Bắc',
    imageUrl: createHeritageSvgImage('Áo Tứ Thân Kinh Bắc', '#5A3A22', '#E7A1B0', 'Bốn Vạt Áo & Yếm Đào Sen', 'ao-tu-than'),
    historicalContext:
      'Trang phục dân gian tiêu biểu của phụ nữ miền Bắc Việt Nam xưa, gắn liền với văn hóa hát Quan họ Bắc Ninh và hội làng mùa xuân.',
    structureAndForm:
      'Áo gồm 4 vạt dài (hai vạt sau khâu liền, hai vạt trước tách rời). Bên trong mặc áo Yếm, thắt đai lụa và váy đụp đen mềm mại.',
    motifMeaning:
      'Bốn vạt tượng trưng cho tứ thân phụ mẫu. Sự phối hợp "mớ ba mớ bảy" (ngoài trầm, trong tươi sáng) thể hiện vẻ đẹp kín đáo mà duyên dáng.',
    suitableOccasions: [
      'Lễ hội mùa xuân, hội làng truyền thống',
      'Biểu diễn văn nghệ, múa dân gian',
      'Lookbook thời trang lấy cảm hứng Bắc Bộ',
    ],
    accessories: ['Nón quai thao', 'Khăn mỏ quạ', 'Đai lụa hồng sen', 'Guốc mộc'],
    dosAndDonts: {
      dos: [
        'Phối lớp tương phản giữa áo khoác ngoài trầm và yếm trong tươi sáng.',
      ],
      donts: [
        'Tránh biến tấu yếm quá hở hang tại không gian đền chùa linh thiêng.',
      ],
    },
    commonMistakes: 'Buộc hai vạt trước quá cao hoặc dùng vải kim tuyến sặc sỡ.',
    referenceSource: 'Bảo tàng Phụ nữ Việt Nam',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-tu-than',
      primaryColor: '#5A3A22',
      secondaryColor: '#E7A1B0',
      bottomColor: '#1F1D1B',
      trimColor: '#2F6F6A',
      fabricId: 'lua',
      patternId: 'hoa-sen',
      bottomType: 'vay-dup',
      headwear: 'non-quai-thao',
      handAccessory: 'none',
      footwear: 'guoc-moc',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 25,
    },
  },
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh',
    englishName: 'Cross-Collared Historical Robe',
    shortTag: 'Áo giao lĩnh',
    dynasty: 'Thời Lý – Trần – Lê (Thế kỷ XI – XVIII)',
    region: 'Đại Việt',
    imageUrl: createHeritageSvgImage('Áo Giao Lĩnh Cổ Phong', '#1E3A5F', '#F5EBE0', 'Cổ Áo Chéo Vạt Chữ Y'),
    historicalContext:
      'Dạng thức cổ phục lâu đời nhất của người Việt qua các triều đại Lý, Trần, Lê trước khi Chúa Nguyễn cải cách sang áo ngũ thân cổ đứng.',
    structureAndForm:
      'Cổ áo giao nhau (vạt trái vắt chéo đè lên vạt phải tạo hình chữ Y), thắt đai lưng gấm hoặc lụa.',
    motifMeaning: 'Mỹ thuật Lý – Trần – Lê với hoa cúc dây, rồng thời Lý biểu thị văn hiến Đại Việt.',
    suitableOccasions: ['Lễ hội cổ phục', 'Triển lãm bảo tàng', 'Chụp ảnh cổ phong'],
    accessories: ['Đai lưng gấm', 'Quạt xếp gỗ đàn hương', 'Khăn quấn đầu', 'Hài vải'],
    dosAndDonts: {
      dos: ['Luôn vắt vạt trái đè lên vạt phải (hữu nhẫm).'],
      donts: ['Không vắt ngược vạt phải đè vạt trái (tả nhẫm).'],
    },
    commonMistakes: 'Mặc ngược vạt áo khi chụp ảnh.',
    referenceSource: 'Ngàn Năm Áo Mũ & Bảo tàng Lịch sử Quốc gia',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-giao-linh',
      primaryColor: '#1E3A5F',
      secondaryColor: '#F5EBE0',
      bottomColor: '#1F1D1B',
      trimColor: '#C9A24B',
      fabricId: 'gam',
      patternId: 'trong-dong',
      bottomType: 'vay-dup',
      headwear: 'khan-dong',
      handAccessory: 'quat-giay',
      footwear: 'hai-theu',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 15,
    },
  },
  {
    id: 'ao-truc-linh',
    name: 'Áo Trực Lĩnh',
    englishName: 'Straight-Collared Open Robe',
    shortTag: 'Áo trực lĩnh',
    dynasty: 'Thời Lý – Trần – Lê',
    region: 'Đại Việt',
    imageUrl: createHeritageSvgImage('Áo Trực Lĩnh Đối Khâm', '#5A3A22', '#F5EBE0', 'Nẹp Cổ Thẳng & Tre Trúc'),
    historicalContext:
      'Áo có hai nẹp cổ thẳng buông dọc hai bên ngực, thường dùng làm áo khoác ngoài thanh nhã.',
    structureAndForm: 'Dáng suông phóng khoáng, rất hợp làm áo khoác ngoài (outerwear) phong cách Gen Z.',
    motifMeaning: 'Họa tiết tre trúc, sóng nước biểu trưng cho cốt cách tự tại.',
    suitableOccasions: ['Dạo phố Gen Z', 'Sự kiện sáng tạo', 'Du lịch phố cổ'],
    accessories: ['Túi tote canvas', 'Sneaker trắng', 'Kính râm gọng mảnh'],
    dosAndDonts: {
      dos: ['Rất thích hợp để Remix Gen Z khoác ngoài sơ mi/áo thun.'],
      donts: ['Tránh in slogan phản cảm lên nẹp cổ.'],
    },
    commonMistakes: 'Nhầm lẫn với cardigan hiện đại mà bỏ nẹp cổ bản rộng.',
    referenceSource: 'Khảo cứu Cổ phục Đại Việt',
    verificationStatus: 'Cần xác minh',
    default3D: {
      garmentModel: 'ao-truc-linh',
      primaryColor: '#5A3A22',
      secondaryColor: '#F5EBE0',
      bottomColor: '#1F1D1B',
      trimColor: '#C9A24B',
      fabricId: 'linen',
      patternId: 'tre-truc',
      bottomType: 'quan-jeans',
      headwear: 'none',
      handAccessory: 'tui-tote',
      footwear: 'sneaker-trang',
      modernOuter: 'none',
      sunglasses: true,
      remixLevel: 65,
    },
  },
  {
    id: 'ao-dai',
    name: 'Áo Dài Việt Nam',
    englishName: 'Vietnamese Ao Dai',
    shortTag: 'Áo dài',
    dynasty: 'Thế kỷ XX – Đương đại',
    region: 'Toàn quốc',
    imageUrl: createHeritageSvgImage('Áo Dài Việt Nam', '#B3261E', '#F5EBE0', 'Hai Tà Dài & Hoa Sen', 'ao-dai'),
    historicalContext: 'Kế thừa trực tiếp từ áo ngũ thân, trở thành quốc phục biểu tượng của người Việt.',
    structureAndForm: 'Xẻ hai tà ở eo, mặc cùng quần lụa ống rộng dài chấm gót.',
    motifMeaning: 'Hoa sen, chim én mùa xuân tôn vinh sự thanh thoát.',
    suitableOccasions: ['Kỷ yếu', 'Lễ Tết', 'Sự kiện trang trọng'],
    accessories: ['Nón lá bài thơ', 'Khăn đóng', 'Guốc mộc hoặc Sneaker'],
    dosAndDonts: {
      dos: ['Luôn mặc kèm quần dài ống rộng hoặc chân váy dài.'],
      donts: ['Tuyệt đối không mặc áo dài không kèm quần.'],
    },
    commonMistakes: 'Chọn vải voan quá mỏng không có lớp lót.',
    referenceSource: 'Bảo tàng Áo Dài Việt Nam',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-dai',
      primaryColor: '#B3261E',
      secondaryColor: '#F5EBE0',
      bottomColor: '#F5EBE0',
      trimColor: '#C9A24B',
      fabricId: 'lua',
      patternId: 'hoa-sen',
      bottomType: 'quan-lua',
      headwear: 'non-la',
      handAccessory: 'tui-gam',
      footwear: 'guoc-moc',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 30,
    },
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba & Khăn Rằn',
    englishName: 'Southern Ao Ba Ba',
    shortTag: 'Áo bà ba',
    dynasty: 'Cuối Thế kỷ XIX – Đương đại',
    region: 'Nam Bộ',
    imageUrl: createHeritageSvgImage('Áo Bà Ba Nam Bộ', '#C9A24B', '#F5EBE0', 'Hàng Khuy Giữa & Khăn Rằn'),
    historicalContext: 'Gắn liền với hình ảnh hào sảng, chất phác của người dân vùng sông nước miền Tây.',
    structureAndForm: 'Áo không cổ, xẻ tà vừa phải, hai túi lớn phía trước vạt.',
    motifMeaning: 'Mộc mạc, phóng khoáng, kiên cường.',
    suitableOccasions: ['Du lịch miền Tây', 'Dã ngoại', 'Phong cách Retro'],
    accessories: ['Khăn rằn', 'Nón lá', 'Guốc mộc'],
    dosAndDonts: {
      dos: ['Chọn vải lụa hoặc đũi thoáng mát.'],
      donts: ['Tránh may quá chật gây co kéo hàng cúc.'],
    },
    commonMistakes: 'Bỏ đi hai chiếc túi đặc trưng ở vạt trước.',
    referenceSource: 'Bảo tàng Phụ nữ Nam Bộ',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-ba-ba',
      primaryColor: '#C9A24B',
      secondaryColor: '#F5EBE0',
      bottomColor: '#1F1D1B',
      trimColor: '#5A3A22',
      fabricId: 'lua',
      patternId: 'tre-truc',
      bottomType: 'quan-lua',
      headwear: 'non-la',
      handAccessory: 'tui-tote',
      footwear: 'guoc-moc',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 25,
    },
  },
  {
    id: 'ao-yem',
    name: 'Áo Yếm Đào',
    englishName: 'Traditional Yem Bodice',
    shortTag: 'Áo yếm',
    dynasty: 'Lý – Trần – Lê – Nguyễn',
    region: 'Bắc Bộ & Trung Bộ',
    imageUrl: createHeritageSvgImage('Áo Yếm Đào', '#E7A1B0', '#5A3A22', 'Yếm Đào Sen & Dây Buộc Lưng', 'ao-yem'),
    historicalContext: 'Nội y truyền thống của phụ nữ Việt, thường mặc bên trong áo tứ thân hoặc áo ngũ thân.',
    structureAndForm: 'Hình thoi vắt chéo trước ngực, buộc dây sau gáy và ngang lưng.',
    motifMeaning: 'Thanh tân, e ấp, duyên dáng.',
    suitableOccasions: ['Nghệ thuật sen mùa hạ', 'Prom (phối Blazer)', 'Biểu diễn múa'],
    accessories: ['Kiềng bạc', 'Nón quai thao', 'Áo khoác Blazer'],
    dosAndDonts: {
      dos: ['Khoác thêm áo the hoặc blazer khi ra ngoài.'],
      donts: ['Không mặc riêng áo yếm vào nơi thờ tự, tôn nghiêm.'],
    },
    commonMistakes: 'Mặc độc chiếc yếm mỏng đi lễ chùa.',
    referenceSource: 'Bảo tàng Phụ nữ Việt Nam',
    verificationStatus: 'Đã kiểm chứng',
    default3D: {
      garmentModel: 'ao-yem',
      primaryColor: '#E7A1B0',
      secondaryColor: '#5A3A22',
      bottomColor: '#1F1D1B',
      trimColor: '#C9A24B',
      fabricId: 'lua',
      patternId: 'hoa-sen',
      bottomType: 'vay-dup',
      headwear: 'non-la',
      handAccessory: 'quat-giay',
      footwear: 'guoc-moc',
      modernOuter: 'blazer',
      sunglasses: false,
      remixLevel: 50,
    },
  },
  {
    id: 'trang-phuc-dan-toc',
    name: 'Trang Phục Các Dân Tộc',
    englishName: 'Ethnic Minority Heritage',
    shortTag: 'Trang phục các dân tộc',
    dynasty: 'Di sản truyền đời',
    region: 'Tây Bắc & Tây Nguyên',
    imageUrl: createHeritageSvgImage('Thổ Cẩm Dân Tộc', '#1E3A5F', '#C9A24B', 'Thổ Cẩm Nhuộm Chàm Tày Thái'),
    historicalContext: 'Kho tàng trang phục rực rỡ của 54 dân tộc anh em như Tày, Thái, H\'Mông.',
    structureAndForm: 'Kỹ thuật dệt thổ cẩm, nhuộm chàm, thêu tay thủ công.',
    motifMeaning: 'Sử thi trên vải ghi lại quan niệm vũ trụ và núi rừng.',
    suitableOccasions: ['Giao lưu văn hóa', 'Bảo tàng Dân tộc học'],
    accessories: ['Kiềng bạc', 'Túi thổ cẩm'],
    dosAndDonts: {
      dos: ['Nêu rõ cộng đồng sở hữu trang phục.'],
      donts: ['Không dùng khăn thiêng (Khăn Piêu) làm thắt lưng hay váy.'],
    },
    commonMistakes: 'Trộn lẫn các dân tộc khác nhau thành một bộ đồ lai tạp.',
    referenceSource: 'Bảo tàng Dân tộc học Việt Nam',
    verificationStatus: 'Đã kiểm chứng',
    isEthnicMinority: true,
    ethnicCommunityNote: 'Tôn trọng bản sắc: Dữ liệu được trưng bày nhằm tôn vinh di sản của cộng đồng sở hữu.',
    default3D: {
      garmentModel: 'ao-ngu-than-tay-chen',
      primaryColor: '#1E3A5F',
      secondaryColor: '#F5EBE0',
      bottomColor: '#1F1D1B',
      trimColor: '#C9A24B',
      fabricId: 'tho-cam',
      patternId: 'trong-dong',
      bottomType: 'vay-dup',
      headwear: 'khan-dong',
      handAccessory: 'tui-gam',
      footwear: 'hai-theu',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 10,
    },
  },
];

export interface TraditionalColor {
  id: string;
  name: string;
  hex: string;
  element: 'Hỏa' | 'Thổ' | 'Thủy' | 'Mộc' | 'Kim';
  meaning: string;
}

export const TRADITIONAL_COLORS: TraditionalColor[] = [
  { id: 'do-son', name: 'Đỏ Son Cung Đình', hex: '#B3261E', element: 'Hỏa', meaning: 'Hỷ sự, cát tường' },
  { id: 'vang-hoang-tho', name: 'Vàng Hoàng Thổ', hex: '#C9A24B', element: 'Thổ', meaning: 'Vương giả, thịnh vượng' },
  { id: 'xanh-ngoc-co', name: 'Xanh Ngọc Cổ', hex: '#2F6F6A', element: 'Mộc', meaning: 'Thanh tao, trí tuệ' },
  { id: 'xanh-cham', name: 'Xanh Chàm Đại Việt', hex: '#1E3A5F', element: 'Thủy', meaning: 'Điềm đạm, bền bỉ' },
  { id: 'nau-gu', name: 'Nâu Gụ Kinh Bắc', hex: '#5A3A22', element: 'Thổ', meaning: 'Mộc mạc, hiếu nghĩa' },
  { id: 'hong-sen', name: 'Hồng Sen Tịnh Đế', hex: '#E7A1B0', element: 'Hỏa', meaning: 'Duyên dáng, thuần khiết' },
  { id: 'trang-nga', name: 'Trắng Ngà Tơ Tằm', hex: '#F5EBE0', element: 'Kim', meaning: 'Tinh khôi, nho nhã' },
  { id: 'tim-hue', name: 'Tím Trầm Cố Đô', hex: '#5B3256', element: 'Hỏa', meaning: 'Thủy chung, trầm mặc' },
  { id: 'den-huyen', name: 'Đen Huyền Lĩnh Bưởi', hex: '#1F1D1B', element: 'Thủy', meaning: 'Trang nghiêm, chuẩn mực' },
];

export interface FabricMaterialOption {
  id: string;
  name: string;
  roughness: number;
  metalness: number;
  bumpScale: number;
  description: string;
}

export const FABRIC_OPTIONS: FabricMaterialOption[] = [
  { id: 'lua', name: 'Lụa Hà Đông', roughness: 0.32, metalness: 0.08, bumpScale: 0.015, description: 'Bóng mịn tự nhiên, rủ mềm' },
  { id: 'gam', name: 'Gấm Cung Đình', roughness: 0.42, metalness: 0.22, bumpScale: 0.045, description: 'Dệt nổi kim tuyến, đứng phom' },
  { id: 'nhung', name: 'Nhung Cổ Điển', roughness: 0.78, metalness: 0.04, bumpScale: 0.03, description: 'Bề mặt trầm ấm sang trọng' },
  { id: 'voan', name: 'Voan Tơ (The)', roughness: 0.25, metalness: 0.02, bumpScale: 0.01, description: 'Mỏng nhẹ, bay bổng' },
  { id: 'tho-cam', name: 'Thổ Cẩm Dệt Tay', roughness: 0.85, metalness: 0.05, bumpScale: 0.06, description: 'Vân sợi dệt thủ công' },
  { id: 'linen', name: 'Linen / Đũi Mộc', roughness: 0.72, metalness: 0.02, bumpScale: 0.04, description: 'Thoáng mát phong cách Gen Z' },
];

export interface PatternMotifOption {
  id: string;
  name: string;
  era: string;
  description: string;
}

export const PATTERN_OPTIONS: PatternMotifOption[] = [
  { id: 'trong-dong', name: 'Trống Đồng Đông Sơn', era: 'Văn hóa Đông Sơn', description: 'Ngôi sao 14 cánh & đàn chim Lạc' },
  { id: 'hoa-sen', name: 'Hoa Sen Tịnh Đế', era: 'Lý – Trần – Nguyễn', description: 'Quốc hoa thanh khiết' },
  { id: 'chim-lac', name: 'Chim Lạc & Mây', era: 'Đông Sơn', description: 'Khát vọng vươn cao' },
  { id: 'van-may', name: 'Vân Mây Huế', era: 'Triều Nguyễn', description: 'Mây cát tường Tường vân' },
  { id: 'song-nuoc', name: 'Sóng Nước Thủy Ba', era: 'Lê – Nguyễn', description: 'Dải sóng nước uyển chuyển nơi gấu áo' },
  { id: 'chu-tho', name: 'Chữ Thọ Triện', era: 'Lê – Nguyễn', description: 'Biểu tượng bình an, trường thọ' },
  { id: 'hoa-cuc', name: 'Hoa Cúc Đại Đóa', era: 'Lý – Trần', description: 'Hoa cúc dây mềm mại thanh nhã' },
  { id: 'tre-truc', name: 'Tre Trúc Quân Tử', era: 'Truyền thống', description: 'Ngay thẳng, kiên cường' },
];

export interface MannequinPose {
  id: string;
  name: string;
  description: string;
}

export const MANNEQUIN_POSES: MannequinPose[] = [
  { id: 'standing-elegant', name: '1. Đứng thẳng thanh lịch', description: 'Tôn phom 5 thân và sống áo trung phùng' },
  { id: 'holding-hat-fan', name: '2. Nghiêng người cầm nón/quạt', description: 'Dáng nghiêng duyên dáng' },
  { id: 'clasped-hands', name: '3. Chắp tay trước bụng', description: 'Tư thế cung kính truyền thống' },
  { id: 'catwalk-stride', name: '4. Bước đi Catwalk', description: 'Bước chân tự tin làm tà áo bay nhẹ' },
  { id: 'twirl-robe', name: '5. Xoay vạt áo', description: 'Xoay nhẹ thân người' },
  { id: 'seated-grace', name: '6. Ngồi nghiêng thưởng trà', description: 'Dáng ngồi tĩnh tại trên đôn gỗ' },
];

export interface OutfitConfiguration {
  id: string;
  title: string;
  gender: 'female' | 'male';
  bodyMetrics: {
    heightCm: number;
    weightKg: number;
    bustCm: number;
    waistCm: number;
    hipCm: number;
  };
  stylistAnswers: {
    occasion: string;
    weatherAndCity: string;
    vibeAndColor: string;
    modernItem: string;
  };
  garmentModel: 'ao-nhat-binh' | 'ao-tac' | 'ao-ngu-than-tay-chen' | 'ao-tu-than' | 'ao-giao-linh' | 'ao-truc-linh' | 'ao-dai' | 'ao-ba-ba' | 'ao-yem';
  layersVisible: {
    outerRobe: boolean;
    innerShirt: boolean;
    bottomWear: boolean;
    collarAndTrim: boolean;
    headwear: boolean;
    handAccessory: boolean;
    footwear: boolean;
    modernOuter: boolean;
  };
  colors: {
    outerRobe: string;
    innerShirt: string;
    bottomWear: string;
    collarAndTrim: string;
    accessory: string;
  };
  fabricId: string;
  patternId: string;
  patternDensity: number;
  patternOffsetY: number;
  embossIntensity: number;
  bottomType: 'quan-lua' | 'vay-dup' | 'quan-jeans';
  headwear: 'none' | 'non-la' | 'non-quai-thao' | 'khan-van' | 'khan-dong';
  handAccessory: 'none' | 'quat-giay' | 'tui-gam' | 'tui-tote';
  footwear: 'guoc-moc' | 'hai-theu' | 'sneaker-trang';
  modernOuter: 'none' | 'blazer';
  sunglasses: boolean;
  remixLevel: number;
  poseId: string;
}

export interface CulturalWarningItem {
  id: string;
  severity: 'warning' | 'advisory';
  title: string;
  reason: string;
  suggestion: string;
  verificationTag: 'Quy tắc có cơ sở' | 'Gợi ý tham khảo';
}

export interface CulturalEvaluationResult {
  culturalScore: number;
  colorHarmonyScore: number;
  colorHarmonyLabel: string;
  remixClassification: 'Truyền thống nguyên bản' | 'Cách tân tôn trọng' | 'Remix tự do';
  warnings: CulturalWarningItem[];
  weatherAdvice: string;
  autoFixAvailable: boolean;
}

export function evaluateOutfitCulturalIntegrity(config: OutfitConfiguration): CulturalEvaluationResult {
  let culturalScore = 96;
  const warnings: CulturalWarningItem[] = [];
  const occasionLower = config.stylistAnswers.occasion.toLowerCase();
  const weatherLower = config.stylistAnswers.weatherAndCity.toLowerCase();

  // Kiểm tra lớp áo lót ngũ thân
  if (
    (config.garmentModel === 'ao-ngu-than-tay-chen' ||
      config.garmentModel === 'ao-tac' ||
      config.garmentModel === 'ao-nhat-binh') &&
    !config.layersVisible.innerShirt
  ) {
    culturalScore -= 18;
    warnings.push({
      id: 'missing-inner-shirt',
      severity: 'warning',
      title: 'Thiếu lớp áo lót trắng bên trong (Áo cánh / Áo lương)',
      reason: 'Quy chuẩn cổ phục luôn mặc kèm lớp áo lót trắng bên trong để lộ viền cổ trắng thanh lịch.',
      suggestion: 'Bật công tắc "Lớp áo trong / Yếm" và chọn tông Trắng Ngà.',
      verificationTag: 'Quy tắc có cơ sở',
    });
  }

  // Kiểm tra mặc độc chiếc áo yếm
  if (
    config.garmentModel === 'ao-yem' &&
    config.modernOuter === 'none' &&
    (occasionLower.includes('chùa') || occasionLower.includes('đền') || occasionLower.includes('kỷ yếu'))
  ) {
    culturalScore -= 25;
    warnings.push({
      id: 'yem-in-sacred-space',
      severity: 'warning',
      title: 'Mặc độc chiếc Áo Yếm tại không gian trang nghiêm / trường học',
      reason: 'Áo Yếm là nội y truyền thống, cần khoác thêm áo ngoài khi đến nơi tôn nghiêm.',
      suggestion: 'Chuyển sang Áo Tứ Thân hoặc bật Áo khoác Blazer ngoài.',
      verificationTag: 'Quy tắc có cơ sở',
    });
  }

  // Kiểm tra không mặc quần/váy
  if (!config.layersVisible.bottomWear) {
    culturalScore -= 35;
    warnings.push({
      id: 'missing-bottom-wear',
      severity: 'warning',
      title: 'Đang tắt lớp Quần / Váy bên dưới',
      reason: 'Trang phục truyền thống xẻ tà bắt buộc phải mặc kèm quần lụa hoặc váy dài.',
      suggestion: 'Bật lại lớp Quần / Váy ngay.',
      verificationTag: 'Quy tắc có cơ sở',
    });
  }

  culturalScore = Math.max(35, Math.min(100, culturalScore));

  let remixClassification: 'Truyền thống nguyên bản' | 'Cách tân tôn trọng' | 'Remix tự do' = 'Cách tân tôn trọng';
  if (config.remixLevel <= 25 && config.bottomType !== 'quan-jeans' && config.modernOuter === 'none' && !config.sunglasses) {
    remixClassification = 'Truyền thống nguyên bản';
  } else if (config.remixLevel > 65 || config.bottomType === 'quan-jeans' || config.modernOuter === 'blazer') {
    remixClassification = 'Remix tự do';
  }

  let weatherAdvice = 'Thời tiết lý tưởng: Chất liệu Gấm hoặc Lụa đều giữ phom rất đẹp.';
  if (weatherLower.includes('nắng') || weatherLower.includes('32')) {
    weatherAdvice = 'Thời tiết nắng ấm: Ưu tiên chất liệu Lụa tơ tằm hoặc Linen mộc thoáng mát.';
  } else if (weatherLower.includes('lạnh') || weatherLower.includes('mưa')) {
    weatherAdvice = 'Thời tiết se lạnh: Ưu tiên chất liệu Gấm hoặc Nhung cổ điển.';
  }

  return {
    culturalScore,
    colorHarmonyScore: 92,
    colorHarmonyLabel: 'Hài hòa Ngũ Hành — Tương sinh cát tường',
    remixClassification,
    warnings,
    weatherAdvice,
    autoFixAvailable: warnings.length > 0,
  };
}

export interface LookbookEntry {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  createdAt: string;
  imageUrl: string;
  styleTag: string;
  occasion: string;
  description: string;
  culturalMeaning: string;
  culturalScore: number;
  likes: number;
  isPublic: boolean;
  isVerified: boolean;
  outfitConfig: OutfitConfiguration;
}

export const INITIAL_LOOKBOOK_ITEMS: LookbookEntry[] = [
  {
    id: 'lb-1',
    title: 'Thanh Ngọc Kỷ Yếu — Ngũ Thân Tay Chẽn & Sneaker',
    author: 'Khánh Linh & Minh Quân',
    authorRole: 'Sinh viên ĐH Mỹ thuật',
    createdAt: 'Mùa Thu 2026',
    imageUrl: createHeritageSvgImage('Thanh Ngọc Kỷ Yếu', '#2F6F6A', '#F5EBE0', 'Ngũ Thân Tay Chẽn & Sneaker Trắng', 'ao-ngu-than'),
    styleTag: 'Cách tân tôn trọng · Học đường Gen Z',
    occasion: 'Chụp ảnh kỷ yếu tốt nghiệp',
    description: 'Áo Ngũ Thân Tay Chẽn gấm xanh ngọc cổ phối lớp áo lót trắng ngà, quần lĩnh ống rộng và sneaker trắng.',
    culturalMeaning: 'Giữ trọn cấu trúc 5 thân tượng trưng Ngũ thường và đường trung phùng ngay thẳng.',
    culturalScore: 96,
    likes: 342,
    isPublic: true,
    isVerified: true,
    outfitConfig: {
      id: 'lb-config-1',
      title: 'Thanh Ngọc Kỷ Yếu',
      gender: 'female',
      bodyMetrics: { heightCm: 163, weightKg: 51, bustCm: 84, waistCm: 64, hipCm: 90 },
      stylistAnswers: {
        occasion: 'Chụp kỷ yếu học sinh - sinh viên',
        weatherAndCity: 'Nắng ráo 25°C · Hà Nội',
        vibeAndColor: 'Thanh lịch cổ điển · Xanh ngọc cổ',
        modernItem: 'Sneaker trắng & Túi gấm rút dây',
      },
      garmentModel: 'ao-ngu-than-tay-chen',
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
      colors: {
        outerRobe: '#2F6F6A',
        innerShirt: '#F5EBE0',
        bottomWear: '#1F1D1B',
        collarAndTrim: '#C9A24B',
        accessory: '#E7A1B0',
      },
      fabricId: 'gam',
      patternId: 'hoa-cuc',
      patternDensity: 1.2,
      patternOffsetY: 0,
      embossIntensity: 0.65,
      bottomType: 'quan-lua',
      headwear: 'non-la',
      handAccessory: 'tui-gam',
      footwear: 'sneaker-trang',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 35,
      poseId: 'standing-elegant',
    },
  },
  {
    id: 'lb-2',
    title: 'Kim Phượng Cố Đô — Nhật Bình Đỏ Son Vương Giả',
    author: 'Bảo Trân (Huế)',
    authorRole: 'Nhà sáng tạo Di sản',
    createdAt: 'Mùa Xuân 2026',
    imageUrl: createHeritageSvgImage('Kim Phượng Cố Đô', '#B3261E', '#DFB85C', 'Áo Nhật Bình & Khăn Vấn Đỏ', 'ao-nhat-binh'),
    styleTag: 'Truyền thống nguyên bản · Cung đình Huế',
    occasion: 'Lễ hội Áo dài Huế',
    description: 'Phục dựng chuẩn mực Áo Nhật Bình sắc đỏ son thêu Loan Phượng và dải ngũ sắc Thủy ba.',
    culturalMeaning: 'Tôn vinh kỹ nghệ thêu cung đình triều Nguyễn với bố cục cổ áo chữ Nhật đoan trang.',
    culturalScore: 99,
    likes: 518,
    isPublic: true,
    isVerified: true,
    outfitConfig: {
      id: 'lb-config-2',
      title: 'Kim Phượng Cố Đô',
      gender: 'female',
      bodyMetrics: { heightCm: 165, weightKg: 53, bustCm: 85, waistCm: 65, hipCm: 91 },
      stylistAnswers: {
        occasion: 'Lễ hội truyền thống',
        weatherAndCity: 'Se lạnh 20°C · Huế',
        vibeAndColor: 'Hoài cổ điện ảnh · Đỏ son',
        modernItem: 'Nguyên bản',
      },
      garmentModel: 'ao-nhat-binh',
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
      colors: {
        outerRobe: '#B3261E',
        innerShirt: '#F5EBE0',
        bottomWear: '#1E3A5F',
        collarAndTrim: '#C9A24B',
        accessory: '#B3261E',
      },
      fabricId: 'gam',
      patternId: 'van-may',
      patternDensity: 1.4,
      patternOffsetY: 0,
      embossIntensity: 0.85,
      bottomType: 'vay-dup',
      headwear: 'khan-van',
      handAccessory: 'quat-giay',
      footwear: 'hai-theu',
      modernOuter: 'none',
      sunglasses: false,
      remixLevel: 15,
      poseId: 'clasped-hands',
    },
  },
];
