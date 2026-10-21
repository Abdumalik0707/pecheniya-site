export type Category = "pechenye";

export type CustomerType = "individual" | "shop";

export interface Product {
  id: string;
  _id?: string;
  name: string;
  brand: string;
  category: Category;
  categoryLabel: string;
  price: number;
  weight: string;
  netWeight: string;
  unit: string;
  image: string;
  images: string[];
  description: string;
  descriptionFull: string;
  tags: string[];
  isNew?: boolean;
  isPremium?: boolean;
  minOrder?: number;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (data.success && data.products) {
      return data.products.map((p: Record<string, unknown>) => ({
        ...p,
        id: (p._id as string) || (p.id as string),
      }));
    }
  } catch {
    /* fallback to static */
  }
  return PRODUCTS;
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (data.success && data.product) {
      const p = data.product;
      return { ...p, id: p._id || p.id };
    }
  } catch {
    /* fallback */
  }
  return PRODUCTS.find((p) => p.id === id);
}

// Barcha mahsulotlar, narxlar va rasmlar "SMAG" (KWIT GROUP OOO) rasmiy
// optom-narxlar katalogidan olingan (2026, Toshkent viloyati).
// SMAG mahsulotlari FAQAT quti (box) bilan sotiladi — dona narxi mavjud emas,
// shuning uchun narx har doim to'liq quti narxi hisoblanadi.
export const PRODUCTS: Product[] = [
  // ═══════════════════════════════════════════════
  //  LOCHIRA seriyasi
  // ═══════════════════════════════════════════════
  {
    id: "pp001-kunjut-lochira",
    name: "Кунжут лочира",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Lochira seriyasi",
    price: 82000,
    weight: "3.5 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp001-kunjut-lochira.jpg",
    images: ["/products/smag/pp001-kunjut-lochira.jpg"],
    description: "Kunjut lochira — xrustall to'r naqshli, yumshoq shirin pechene",
    descriptionFull: "SmaG brendining Lochira seriyasidan kunjut lochira pechenesi. Xrustall to'r naqshli, yengil va shirin ta'mga ega. Kod: ПП-001.",
    tags: ["lochira", "xrustall"],
  },
  {
    id: "pp002-lochira",
    name: "Лочира",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Lochira seriyasi",
    price: 90000,
    weight: "3.5 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp002-lochira.jpg",
    images: ["/products/smag/pp002-lochira.jpg"],
    description: "Kunjut donachalari bilan bezatilgan klassik lochira pechenesi",
    descriptionFull: "SmaG Lochira — kunjut donachalari sepilgan, xrustall va yengil pechene. Choy dasturxoni uchun ideal. Kod: ПП-002.",
    tags: ["lochira", "kunjut"],
    isNew: true,
  },
  {
    id: "pp003-kunjut-lochira-choko",
    name: "Кунжут лочира чоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Lochira seriyasi",
    price: 105000,
    weight: "3.5 kg",
    netWeight: "25g",
    unit: "quti",
    image: "/products/smag/pp003-kunjut-lochira-choko.jpg",
    images: ["/products/smag/pp003-kunjut-lochira-choko.jpg"],
    description: "Shokolad bilan bezatilgan kunjut lochira pechenesi",
    descriptionFull: "Xrustall lochira pechenesi ustidan mazali shokolad chiziqlari bilan bezatilgan. SmaG Lochira seriyasining premium varianti. Kod: ПП-003.",
    tags: ["lochira", "shokolad"],
    isPremium: true,
  },
  {
    id: "pp004-lochira-choko",
    name: "Лочира чоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Lochira seriyasi",
    price: 106000,
    weight: "3.5 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp004-lochira-choko.jpg",
    images: ["/products/smag/pp004-lochira-choko.jpg"],
    description: "Kunjut va shokolad bilan bezatilgan xrustall lochira pechenesi",
    descriptionFull: "Kunjut donachalari va shokolad chiziqlari bilan bezatilgan xrustall Lochira pechenesi. Boy va to'yimli ta'm. Kod: ПП-004.",
    tags: ["lochira", "shokolad", "kunjut"],
    isPremium: true,
  },

  // ═══════════════════════════════════════════════
  //  SASHA-MASHA seriyasi
  // ═══════════════════════════════════════════════
  {
    id: "pp005-sasha-masha-choko",
    name: "Саша Маша чоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sasha-Masha seriyasi",
    price: 90000,
    weight: "3 kg",
    netWeight: "25g",
    unit: "quti",
    image: "/products/smag/pp005-sasha-masha-choko.jpg",
    images: ["/products/smag/pp005-sasha-masha-choko.jpg"],
    description: "Ikki yurak shaklidagi shokoladli vafli-pechene",
    descriptionFull: "\"Саша Маша\" — ikkita bir-biriga ulangan yurak shaklidagi, to'liq shokoladga botirilgan vafli-pechene. Bolalar va kattalar sevimli shirinligi. Kod: ПП-005.",
    tags: ["shokolad", "yurak shakli"],
    isNew: true,
  },
  {
    id: "pp006-sasha-masha",
    name: "Саша Маша",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sasha-Masha seriyasi",
    price: 70000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp006-sasha-masha.jpg",
    images: ["/products/smag/pp006-sasha-masha.jpg"],
    description: "Ikki yurak shaklidagi klassik vafli-pechene",
    descriptionFull: "\"Саша Маша\" — ikkita bir-biriga ulangan yurak shaklidagi klassik vafli-pechene, shokoladsiz variant. Kod: ПП-006.",
    tags: ["klassik", "yurak shakli"],
  },

  // ═══════════════════════════════════════════════
  //  SHARQONA KUNJUT
  // ═══════════════════════════════════════════════
  {
    id: "pp007-vostochny-kunjut-choko",
    name: "Восточный кунжут чоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sharqona kunjut",
    price: 91000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp007-vostochny-kunjut-choko.jpg",
    images: ["/products/smag/pp007-vostochny-kunjut-choko.jpg"],
    description: "Kunjut va shokolad bilan qoplangan sharqona kvadrat pechene",
    descriptionFull: "\"Sharqona kunjut\" — kunjut donachalari bilan qoplangan va shokolad bilan bezatilgan kvadrat shakldagi xrustall pechene. Kod: ПП-007.",
    tags: ["kunjut", "shokolad", "sharqona"],
    isNew: true,
  },
  {
    id: "pp008-vostochny-kunjut",
    name: "Восточный кунжут",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sharqona kunjut",
    price: 77200,
    weight: "3 kg",
    netWeight: "15g",
    unit: "quti",
    image: "/products/smag/pp008-vostochny-kunjut.jpg",
    images: ["/products/smag/pp008-vostochny-kunjut.jpg"],
    description: "To'liq kunjut bilan qoplangan sharqona kvadrat pechene",
    descriptionFull: "\"Sharqona kunjut\" — yuzasi to'liq oq kunjut donachalari bilan qoplangan, xrustall va boy ta'mli kvadrat pechene. Kod: ПП-008.",
    tags: ["kunjut", "sharqona"],
  },

  // ═══════════════════════════════════════════════
  //  YUBILEYNOE seriyasi
  // ═══════════════════════════════════════════════
  {
    id: "pp009-yubileynoe-kichik",
    name: "Юбилейное кичик",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Yubileynoe seriyasi",
    price: 107000,
    weight: "6 kg",
    netWeight: "15g",
    unit: "quti",
    image: "/products/smag/pp009-yubileynoe-kichik.jpg",
    images: ["/products/smag/pp009-yubileynoe-kichik.jpg"],
    description: "Qandolat pechene, mashhur \"Yubileynoe\" ning kichik formati",
    descriptionFull: "Qandolat (pesochnoe) pechene. Mashhur \"Юбилейное\" retseptining kichik, qulay formati — katta qadoqda (6kg quti) do'konlar uchun. Kod: ПП-009.",
    tags: ["yubileynoe", "qandolat", "mini"],
    isPremium: true,
  },
  {
    id: "pp010-yubileynoe-elita",
    name: "Юбилейное элита",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Yubileynoe seriyasi",
    price: 64000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp010-yubileynoe-elita.jpg",
    images: ["/products/smag/pp010-yubileynoe-elita.jpg"],
    description: "Qandolat pechene, \"Yubileynoe\" ning elita formati",
    descriptionFull: "Qandolat (pesochnoe) pechene. \"Юбилейное элита\" — klassik retsept, standart o'lchamdagi kvadrat pechene. Kod: ПП-010.",
    tags: ["yubileynoe", "qandolat"],
  },
  {
    id: "pp011-yubileynoe-moskva",
    name: "Юбилейное москва",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Yubileynoe seriyasi",
    price: 113000,
    weight: "6 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp011-yubileynoe-moskva.jpg",
    images: ["/products/smag/pp011-yubileynoe-moskva.jpg"],
    description: "Bargli naqshli qandolat pechene, \"Yubileynoe\" ning Moskva formati",
    descriptionFull: "Qandolat (pesochnoe) pechene. \"Юбилейное москва\" — bargli naqsh bilan bezatilgan, katta 6kg quti formatida, do'konlar uchun ulgurji buyurtmaga mos. Kod: ПП-011.",
    tags: ["yubileynoe", "qandolat"],
    isPremium: true,
  },

  // ═══════════════════════════════════════════════
  //  SELFI SMAG
  // ═══════════════════════════════════════════════
  {
    id: "pp012-selfi-smag-choko",
    name: "Селфи Смаг чоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Selfi SmaG",
    price: 90000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp012-selfi-smag-choko.jpg",
    images: ["/products/smag/pp012-selfi-smag-choko.jpg"],
    description: "Pastki qismi shokoladga botirilgan \"Selfi SMAG\" pechenesi",
    descriptionFull: "\"Selfi SMAG\" — SmaG brendining o'ziga xos naqshli pechenesi, pastki qismi shokoladga botirilgan. Kod: ПП-012.",
    tags: ["selfi", "shokolad"],
    isNew: true,
  },
  {
    id: "pp013-selfi-smag",
    name: "Селфи Смаг",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Selfi SmaG",
    price: 71300,
    weight: "3 kg",
    netWeight: "15g",
    unit: "quti",
    image: "/products/smag/pp013-selfi-smag.jpg",
    images: ["/products/smag/pp013-selfi-smag.jpg"],
    description: "SmaG brendining o'ziga xos naqshli klassik pechenesi",
    descriptionFull: "\"Selfi SMAG\" — SmaG brendining o'ziga xos naqshli, yumshoq va yengil klassik pechenesi. Kod: ПП-013.",
    tags: ["selfi", "klassik"],
    isNew: true,
  },

  // ═══════════════════════════════════════════════
  //  BOSHQA MAZALI TURLAR
  // ═══════════════════════════════════════════════
  {
    id: "pp014-yabloko",
    name: "Яблоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Mevali pechene",
    price: 85100,
    weight: "4 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp014-yabloko.jpg",
    images: ["/products/smag/pp014-yabloko.jpg"],
    description: "Olma ta'mli davra shaklidagi yumshoq pechene",
    descriptionFull: "\"Яблоко\" — olma ta'mi bilan boyitilgan, davra shaklidagi yumshoq pechene. Kod: ПП-014.",
    tags: ["meva", "olma"],
    isNew: true,
  },
  {
    id: "pp015-vkusnoe",
    name: "Вкусное",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Klassik pechene",
    price: 71000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp015-vkusnoe.jpg",
    images: ["/products/smag/pp015-vkusnoe.jpg"],
    description: "Qandolat pechene, oddiy va mazali klassika",
    descriptionFull: "Qandolat (pesochnoe) pechene. \"Вкусное\" — SmaG ning eng oddiy va mazali klassik pechenesi, har kungi choy dasturxoni uchun. Kod: ПП-015.",
    tags: ["klassik", "qandolat"],
  },
  {
    id: "pp016-chayku",
    name: "Чайку",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Choy uchun pechene",
    price: 71300,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp016-chayku.jpg",
    images: ["/products/smag/pp016-chayku.jpg"],
    description: "Choynak va piyola tasviri bilan bezatilgan choy pechenesi",
    descriptionFull: "\"Чайку!\" — choynak va piyola tasviri bilan bezatilgan, maxsus choy damlash lahzalari uchun yaratilgan pechene. Kod: ПП-016.",
    tags: ["choy uchun", "klassik"],
  },
  {
    id: "pp017-popkorn",
    name: "Попкорн",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Popkorn shaklidagi",
    price: 82000,
    weight: "4 kg",
    netWeight: "4g",
    unit: "quti",
    image: "/products/smag/pp017-popkorn.jpg",
    images: ["/products/smag/pp017-popkorn.jpg"],
    description: "Popkorn shaklidagi mini qandolat pechene",
    descriptionFull: "Qandolat (pesochnoe) pechene. \"Попкорн\" — popkorn donasiga o'xshash qiziqarli shakldagi, juda mayda va mazali mini pechene. Kod: ПП-017.",
    tags: ["mini", "qandolat"],
    isNew: true,
  },
  {
    id: "pp018-toplyonoe-moloko",
    name: "Топлёное молоко",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sut ta'mli",
    price: 64000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp018-toplyonoe-moloko.jpg",
    images: ["/products/smag/pp018-toplyonoe-moloko.jpg"],
    description: "Suzma sut ta'mli to'rtburchak pechene",
    descriptionFull: "\"Топлёное молоко\" — yumshoq suzma sut ta'mi bilan tayyorlangan, jilvador tishli chetli to'rtburchak pechene. Kod: ПП-018.",
    tags: ["sut ta'mli", "klassik"],
  },
  {
    id: "pp019-toplyonoe-moloko-temny",
    name: "Топлёное молоко тёмный",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sut ta'mli",
    price: 56700,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp019-toplyonoe-moloko-temny.jpg",
    images: ["/products/smag/pp019-toplyonoe-moloko-temny.jpg"],
    description: "Suzma sut ta'mli to'rtburchak pechenening to'q rangli varianti",
    descriptionFull: "\"Топлёное молоко тёмный\" — \"Топлёное молоко\" pechenesining quyuqroq pishirilgan, to'q rangli va boyroq ta'mli varianti. Kod: ПП-019.",
    tags: ["sut ta'mli", "klassik"],
  },

  // ═══════════════════════════════════════════════
  //  SENDVICH PECHENE
  // ═══════════════════════════════════════════════
  {
    id: "pp020-essen",
    name: "Эссен",
    brand: "SmaG",
    category: "pechenye",
    categoryLabel: "Sendvich pechene",
    price: 118000,
    weight: "3 kg",
    netWeight: "20g",
    unit: "quti",
    image: "/products/smag/pp020-essen.jpg",
    images: ["/products/smag/pp020-essen.jpg"],
    description: "Ikki qavatli romb shaklidagi sendvich pechene, ochiq va to'q shokolad variantlari",
    descriptionFull: "\"Эссен\" — ikki qatlamli, romb/kvadrat shaklidagi sendvich pechene. Ochiq (klassik) va to'q (kakao) variantlarida ishlab chiqariladi. Katalogdagi eng yuqori narxli mahsulot. Kod: ПП-018 (katalogda ko'rsatilgan).",
    tags: ["sendvich", "premium"],
    isPremium: true,
  },
];

export const OPERATOR = {
  name: "SmaG (KWIT GROUP OOO)",
  phone: "+998 95 839 19 19",
  telegram: "@smag_pechenie",
  telegramUrl: "https://t.me/smag_pechenie",
  address: "Toshkent viloyati, Toshkent tumani, Diydor MFY, Shifobaxshsuvlar ko'chasi",
  website: "t.me/smag_pechenie",
};

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
