// TYPE_ID: T_PRODUCT_SPECIFICATION
export interface ProductSpecification {
  readonly label: string;      // CONSTRAINTS: Non-empty, Max 30 chars
  value: string;      // CONSTRAINTS: Non-empty, Max 100 chars
}

// TYPE_ID: T_PRODUCT
export interface Product {
  readonly id: string;                     // FORMAT: 'prod-' + 3-digit number (e.g., 'prod-001'), IMMUTABLE, UNIQUE
  name: string;                   // CONSTRAINTS: Non-empty, Max 100 chars
  price: number;                  // CONSTRAINTS: Positive integer (税込)
  categoryIds: readonly string[]; // ARRAY_OF: T_CATEGORY.id, CONSTRAINTS: Non-empty array
  maker?: string;                 // (OPTIONAL) CONSTRAINTS: Max 50 chars
  sku: string;                    // Stock Keeping Unit (型番), CONSTRAINTS: Non-empty, UNIQUE, Max 50 chars
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ON_ORDER'; // ENUM
  images: readonly string[];      // ARRAY_OF: URL_PATH (e.g., '/images/products/image.jpg'), CONSTRAINTS: At least one image
  description: string;            // CONSTRAINTS: Non-empty, Max 1000 chars (Plain text or simple Markdown)
  usage?: readonly string[];      // (OPTIONAL) ARRAY_OF: String, Max 50 chars per item
  specifications?: readonly ProductSpecification[]; // (OPTIONAL) ARRAY_OF: T_PRODUCT_SPECIFICATION
  relatedProductIds?: readonly string[]; // (OPTIONAL) ARRAY_OF: T_PRODUCT.id
}

// DATA_EXAMPLE_ID: D_PRODUCTS_SAMPLE
export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'マキタ 充電式インパクトドライバ 18V',
    price: 24800,
    categoryIds: ['cat-001'],
    maker: 'マキタ',
    sku: 'TD173DRGX',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/impact-driver-1.jpg', '/images/products/impact-driver-2.jpg'],
    description: '高トルクと軽量コンパクトボディを両立した18Vコードレスインパクトドライバです。4段階のパワーモード切替機能搭載で様々な作業に対応します。',
    usage: ['木工', '金属加工', '建築'],
    specifications: [
      { label: '電圧', value: '18V' },
      { label: '最大トルク', value: '180N・m' },
      { label: '本体サイズ', value: '全長117mm×全高237mm×全幅83mm' },
      { label: '質量', value: '1.7kg (バッテリ含む)' }
    ],
    relatedProductIds: ['prod-002', 'prod-003']
  },
  {
    id: 'prod-002',
    name: 'HiKOKI 18V コードレスドリルドライバ',
    price: 22000,
    categoryIds: ['cat-001'],
    maker: 'HiKOKI',
    sku: 'DS18DBSL',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/drill-driver-1.jpg', '/images/products/drill-driver-2.jpg'],
    description: '高性能ブラシレスモーター搭載の18Vコードレスドリルドライバです。高いトルクとスピードで木材や金属の穴あけ作業を効率化します。',
    usage: ['木工', '金属加工', 'DIY'],
    specifications: [
      { label: '電圧', value: '18V' },
      { label: '最大トルク', value: '70N・m' },
      { label: '本体サイズ', value: '全長204mm×全高243mm×全幅86mm' },
      { label: '質量', value: '1.6kg (バッテリ含む)' }
    ],
    relatedProductIds: ['prod-001', 'prod-004']
  },
  {
    id: 'prod-003',
    name: 'パナソニック 充電角穴カッター 14.4V',
    price: 45980,
    categoryIds: ['cat-001'],
    maker: 'パナソニック',
    sku: 'EZ45A3LS2G-B',
    stockStatus: 'LOW_STOCK',
    images: ['/images/products/hole-cutter-1.jpg', '/images/products/hole-cutter-2.jpg'],
    description: '木材への角穴加工に最適な充電式角穴カッターです。コードレスで持ち運びが便利で、様々な現場で活躍します。',
    usage: ['木工', '建築', '内装工事'],
    specifications: [
      { label: '電圧', value: '14.4V' },
      { label: '最大切断能力', value: '30mm' },
      { label: '本体サイズ', value: '全長283mm×全高271mm×全幅100mm' },
      { label: '質量', value: '2.9kg (バッテリ含む)' }
    ],
    relatedProductIds: ['prod-001', 'prod-005']
  },
  {
    id: 'prod-004',
    name: 'ボッシュ レーザー距離計',
    price: 12800,
    categoryIds: ['cat-004'],
    maker: 'BOSCH',
    sku: 'GLM50C',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/laser-measure-1.jpg', '/images/products/laser-measure-2.jpg'],
    description: '最大測定距離50mのレーザー距離計です。面積・体積測定機能、ピタゴラス測定など多彩な機能を搭載しています。',
    usage: ['建築', '内装工事', '不動産'],
    specifications: [
      { label: '最大測定距離', value: '50m' },
      { label: '測定精度', value: '±1.5mm' },
      { label: '防塵・防水等級', value: 'IP54' },
      { label: '電源', value: '単4電池×2本' }
    ],
    relatedProductIds: ['prod-009', 'prod-010']
  },
  {
    id: 'prod-005',
    name: 'シンワ測定 ステンレス直尺 60cm',
    price: 1500,
    categoryIds: ['cat-004'],
    maker: 'シンワ測定',
    sku: '13075',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/ruler-1.jpg'],
    description: '耐久性に優れたステンレス製の直尺です。目盛は読み取りやすく、シンプルな構造で使いやすさを重視しています。',
    usage: ['建築', '木工', 'DIY'],
    specifications: [
      { label: '長さ', value: '60cm' },
      { label: '材質', value: 'ステンレス' },
      { label: '目盛', value: 'mm/cm/inch' }
    ],
    relatedProductIds: ['prod-004', 'prod-009']
  },
  {
    id: 'prod-006',
    name: 'タジマ コンベックス 5.5m',
    price: 2800,
    categoryIds: ['cat-004'],
    maker: 'タジマ',
    sku: 'GASFG3-55',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/tape-measure-1.jpg', '/images/products/tape-measure-2.jpg'],
    description: '耐久性・視認性・操作性を追求したプロ仕様のコンベックスです。テープの剛性が高く、最大5.5mまで自立します。',
    usage: ['建築', '内装工事', 'DIY'],
    specifications: [
      { label: '長さ', value: '5.5m' },
      { label: 'テープ幅', value: '25mm' },
      { label: '目盛', value: 'mm/cm' },
      { label: '質量', value: '320g' }
    ],
    relatedProductIds: ['prod-005', 'prod-004']
  },
  {
    id: 'prod-007',
    name: 'SK11 両口メガネレンチセット 8本組',
    price: 3600,
    categoryIds: ['cat-002'],
    maker: 'SK11',
    sku: 'S-8SET',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/wrench-set-1.jpg', '/images/products/wrench-set-2.jpg'],
    description: '高品質のクロムバナジウム鋼を使用した両口メガネレンチ8本セットです。サイズは8mm～24mmをカバーしています。',
    usage: ['自動車整備', '機械修理', '建築'],
    specifications: [
      { label: 'サイズ', value: '8×10、10×12、11×13、12×14、14×17、17×19、19×21、22×24mm' },
      { label: '材質', value: 'クロムバナジウム鋼' },
      { label: '表面処理', value: 'クロームメッキ' }
    ],
    relatedProductIds: ['prod-008', 'prod-015']
  },
  {
    id: 'prod-008',
    name: 'トネ ソケットレンチセット 12角 12点',
    price: 15800,
    categoryIds: ['cat-002'],
    maker: 'TONE',
    sku: '230M',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/socket-set-1.jpg', '/images/products/socket-set-2.jpg'],
    description: 'プロフェッショナル向けの高品質ソケットレンチセットです。12角タイプで、狭い場所での作業にも適しています。',
    usage: ['自動車整備', '機械修理', '建設'],
    specifications: [
      { label: 'サイズ', value: '10～32mm 12点' },
      { label: '差込角', value: '12.7mm (1/2インチ)' },
      { label: '材質', value: 'クロムバナジウム鋼' },
      { label: 'ケース寸法', value: '幅290mm×奥行170mm×高さ55mm' }
    ],
    relatedProductIds: ['prod-007', 'prod-015']
  },
  {
    id: 'prod-009',
    name: 'エビス 水平器 600mm',
    price: 2980,
    categoryIds: ['cat-004'],
    maker: 'エビス',
    sku: 'ED-60KMLB',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/level-1.jpg', '/images/products/level-2.jpg'],
    description: '高精度で耐久性に優れたアルミ製水平器です。垂直・水平・45度の3方向の測定が可能で、磁石付きで金属面への固定もできます。',
    usage: ['建築', '内装工事', 'DIY'],
    specifications: [
      { label: '長さ', value: '600mm' },
      { label: '精度', value: '±0.5mm/m' },
      { label: '気泡管数', value: '3' },
      { label: '材質', value: 'アルミ合金' }
    ],
    relatedProductIds: ['prod-004', 'prod-005']
  },
  {
    id: 'prod-010',
    name: 'シリコンシーラント 330ml',
    price: 780,
    categoryIds: ['cat-003'],
    maker: 'コニシ',
    sku: '04929',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/silicone-sealant-1.jpg'],
    description: '耐候性・耐水性に優れた一般用シリコンシーラントです。屋内外の多用途シール材として幅広く使用できます。',
    usage: ['水回り', '窓枠', '浴室', 'キッチン'],
    specifications: [
      { label: '容量', value: '330ml' },
      { label: '色', value: '透明' },
      { label: '硬化時間', value: '表面乾燥2～3時間、完全硬化24時間' },
      { label: '耐熱温度', value: '-40℃～120℃' }
    ],
    relatedProductIds: ['prod-011', 'prod-012']
  },
  {
    id: 'prod-011',
    name: '耐水ペーパー #240 100枚入',
    price: 2200,
    categoryIds: ['cat-003'],
    maker: '3M',
    sku: 'YWT-240',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/sandpaper-1.jpg'],
    description: '水研ぎ用の高品質耐水ペーパーです。木工から金属、自動車塗装の研磨まで幅広く使用できます。',
    usage: ['木工', '金属加工', '塗装'],
    specifications: [
      { label: '粒度', value: '#240' },
      { label: 'サイズ', value: '230mm×280mm' },
      { label: '数量', value: '100枚' }
    ],
    relatedProductIds: ['prod-010', 'prod-012']
  },
  {
    id: 'prod-012',
    name: 'アサヒペン 水性塗料 2L',
    price: 3600,
    categoryIds: ['cat-003'],
    maker: 'アサヒペン',
    sku: 'AP9016223',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/water-paint-1.jpg', '/images/products/water-paint-2.jpg'],
    description: '臭いが少なく、乾きが早い水性多用途塗料です。屋内外の木部、鉄部、コンクリート、モルタルなど幅広い素材に使用できます。',
    usage: ['内装', '外装', 'DIY'],
    specifications: [
      { label: '容量', value: '2L' },
      { label: '色', value: 'ツヤ消し白' },
      { label: '塗り面積', value: '約12〜14平方メートル（2回塗り）' },
      { label: '乾燥時間', value: '1時間（指触乾燥）' }
    ],
    relatedProductIds: ['prod-010', 'prod-011']
  },
  {
    id: 'prod-013',
    name: 'ミドリ安全 ヘルメット',
    price: 1980,
    categoryIds: ['cat-005'],
    maker: 'ミドリ安全',
    sku: 'SC-11B',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/helmet-1.jpg', '/images/products/helmet-2.jpg'],
    description: '作業現場での頭部保護に最適な安全ヘルメットです。衝撃吸収性に優れ、軽量で長時間使用しても疲れにくい設計です。',
    usage: ['建設', '土木', '工事現場'],
    specifications: [
      { label: '規格', value: 'JIS T 8131:2015 飛来・落下物用' },
      { label: '材質', value: 'ABS樹脂' },
      { label: '重量', value: '約390g' },
      { label: 'サイズ', value: '頭囲 53cm～62cm (調節可能)' }
    ],
    relatedProductIds: ['prod-014', 'prod-019']
  },
  {
    id: 'prod-014',
    name: '3M 防塵マスク 10枚入',
    price: 980,
    categoryIds: ['cat-005'],
    maker: '3M',
    sku: '8210J-DS2',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/dust-mask-1.jpg'],
    description: '微粒子用マスクで、粉塵や花粉などから呼吸器を守ります。快適な装着感と高い防塵性能を両立しています。',
    usage: ['建設', '木工', 'DIY'],
    specifications: [
      { label: '規格', value: 'DS2/N95同等' },
      { label: '数量', value: '10枚入' },
      { label: '捕集効率', value: '0.3μmの粒子を95%以上捕集' }
    ],
    relatedProductIds: ['prod-013', 'prod-019']
  },
  {
    id: 'prod-015',
    name: 'VESSEL ボールグリップドライバー 6本セット',
    price: 3200,
    categoryIds: ['cat-002'],
    maker: 'VESSEL',
    sku: 'TD-6500',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/screwdriver-set-1.jpg', '/images/products/screwdriver-set-2.jpg'],
    description: '人間工学に基づいたボールグリップで握りやすく、トルクが伝わりやすいドライバーセットです。特殊合金鋼の刃先で耐久性に優れています。',
    usage: ['電気工事', '機械組立', 'DIY'],
    specifications: [
      { label: 'セット内容', value: 'プラス(+)：No.0、No.1、No.2、マイナス(-)：3mm、5mm、6mm' },
      { label: '材質', value: '特殊合金鋼 (クロムバナジウム鋼)' },
      { label: 'グリップ', value: 'エラストマー樹脂' }
    ],
    relatedProductIds: ['prod-007', 'prod-008']
  },
  {
    id: 'prod-016',
    name: 'パナソニック 充電式LED投光器',
    price: 12800,
    categoryIds: ['cat-001', 'cat-006'],
    maker: 'パナソニック',
    sku: 'EZ37C3',
    stockStatus: 'LOW_STOCK',
    images: ['/images/products/led-light-1.jpg', '/images/products/led-light-2.jpg'],
    description: '明るさ3段階切替可能な充電式LED投光器です。バッテリ駆動で配線不要、防塵・防水設計で屋外でも安心して使用できます。',
    usage: ['建設', '土木', '夜間作業'],
    specifications: [
      { label: '光束', value: '最大2100lm' },
      { label: '使用可能時間', value: '約3.5〜14時間（バッテリ容量による）' },
      { label: '防塵・防水等級', value: 'IP54' },
      { label: '照射角度', value: '上下方向120度' }
    ],
    relatedProductIds: ['prod-001', 'prod-003']
  },
  {
    id: 'prod-017',
    name: 'サンワサプライ 電工ペンチ',
    price: 1980,
    categoryIds: ['cat-002', 'cat-006'],
    maker: 'サンワサプライ',
    sku: 'TK-TEP1',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/pliers-1.jpg'],
    description: '電気工事に最適な多機能ペンチです。切断、圧着、ワイヤーストリップなど様々な作業に対応します。',
    usage: ['電気工事', 'DIY', 'ケーブル加工'],
    specifications: [
      { label: '全長', value: '200mm' },
      { label: '材質', value: 'クロムバナジウム鋼' },
      { label: '切断能力', value: '軟線：φ4.0mm、硬線：φ2.0mm' },
      { label: '重量', value: '約270g' }
    ],
    relatedProductIds: ['prod-015', 'prod-007']
  },
  {
    id: 'prod-018',
    name: 'カクダイ 銅管用パイプカッター',
    price: 2400,
    categoryIds: ['cat-002', 'cat-007'],
    maker: 'カクダイ',
    sku: '608-001',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/pipe-cutter-1.jpg', '/images/products/pipe-cutter-2.jpg'],
    description: '銅管を簡単・キレイに切断できるパイプカッターです。替刃式で長期間使用可能、3～35mmの銅管に対応します。',
    usage: ['配管工事', '設備工事', 'DIY'],
    specifications: [
      { label: '切断能力', value: '外径3～35mm' },
      { label: '適応パイプ', value: '銅管、真鍮管、アルミ管、薄肉ステンレス管' },
      { label: '全長', value: '175mm' },
      { label: '重量', value: '約390g' }
    ],
    relatedProductIds: ['prod-020', 'prod-007']
  },
  {
    id: 'prod-019',
    name: 'ショーワグローブ 耐切創手袋 Mサイズ',
    price: 1280,
    categoryIds: ['cat-005'],
    maker: 'ショーワグローブ',
    sku: 'S-TEX581',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/gloves-1.jpg'],
    description: '高い切創耐性と優れたグリップ力を持つ作業用手袋です。手の平にウレタンコーティングを施し、繊細な作業にも対応します。',
    usage: ['建設', '金属加工', '倉庫作業'],
    specifications: [
      { label: 'サイズ', value: 'Mサイズ' },
      { label: '切創レベル', value: 'JIS T 8114 レベル4' },
      { label: '材質', value: 'ポリエチレン・ナイロン混紡/ウレタンコーティング' },
      { label: '洗濯', value: '可能（手洗い推奨）' }
    ],
    relatedProductIds: ['prod-013', 'prod-014']
  },
  {
    id: 'prod-020',
    name: 'KVK シングルレバー式混合栓',
    price: 8600,
    categoryIds: ['cat-007'],
    maker: 'KVK',
    sku: 'KM5011T',
    stockStatus: 'IN_STOCK',
    images: ['/images/products/faucet-1.jpg', '/images/products/faucet-2.jpg'],
    description: 'キッチンシンク用のシングルレバー混合栓です。節水性能と使いやすさを両立したデザインで、取り付けも簡単です。',
    usage: ['キッチン', '洗面所', '住宅設備'],
    specifications: [
      { label: '取付穴径', value: 'φ36～40mm' },
      { label: '吐水口高さ', value: '235mm' },
      { label: '材質', value: '本体：黄銅、ハンドル：ABS樹脂' },
      { label: '保証期間', value: '2年' }
    ],
    relatedProductIds: ['prod-018']
  }
]; 