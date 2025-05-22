# **AI開発エージェント向けECサイトモック設計書 (Ver. Cursor-Optimized-Strict)**
# **DOC_ID: KEM_DESIGN_SPEC_V_COS**

## **0. プロジェクトメタデータとAIエージェントへの厳格な指示**
### **0.1. プロジェクト識別情報**
- **PROJECT_ID:** `KEM_2024_Q2`
- **PROJECT_NAME:** 建設・建材業界向けECサイトモック (Project Kensetsu EC Mock)
- **DOCUMENT_VERSION:** `1.0.2`
- **TARGET_COMPLETION_TIMEFRAME:** 14暦日以内 (開始日から起算)

### **0.2. AIエージェントへの実行プロトコル**
1.  **P02_001 (納期絶対厳守):** 本ドキュメント `DOC_ID: KEM_DESIGN_SPEC_V_COS` に記載された全機能・要件は、`TARGET_COMPLETION_TIMEFRAME` 内に実装完了すること。遅延が予測される場合は、直ちに `RISK_FLAG_001` を発し、代替案またはスコープ削減案を要求すること。
2.  **P02_002 (ドキュメント完全準拠):** 本ドキュメントの全てのセクション、特に `SECTION_ID` で識別される要件、データ構造定義 (`SECTION_ID: 3.X`)、UIコンポーネント仕様 (`SECTION_ID: 4.X.X`) に寸分違わず従うこと。解釈に疑義が生じた場合は、`QUERY_FLAG_001` を発し、明確化を要求すること。逸脱は許可されない。
3.  **P02_003 (技術スタック固定):** `SECTION_ID: 2.1` に定義された技術スタックのみを使用すること。他のライブラリやフレームワークの導入は禁止する。
4.  **P02_004 (コンポーネント化原則):** `SECTION_ID: 4.X.X` で定義されるUIコンポーネントは、指定されたPropsと責務を持つ独立したReactコンポーネントとして実装すること。再利用性を最大化すること。
5.  **P02_005 (レスポンシブ実装):** 全てのページとコンポーネントは、`SECTION_ID: 5.1` に定義されたブレークポイントに基づき、スマートフォン表示を最優先としたレスポンシブデザインを実装すること。
6.  **P02_006 (データソース固定):** バックエンドAPIは存在しない。`SECTION_ID: 3.X` で定義されたデータ構造に従い、`PATH: /lib/data/*.ts` に配置される静的ダミーデータを唯一のデータソースとして使用すること。状態永続化は `localStorage` のみを使用し、キー名は `SECTION_ID: 3.6` に従うこと。
7.  **P02_007 (エラー処理規定):** ユーザー入力エラー（例: フォームバリデーション）は、`SECTION_ID: 4.X.X` の各コンポーネント仕様で定義された方法でユーザーにフィードバックすること。アプリケーションクラッシュを引き起こす未処理例外は許容されない。
8.  **P02_008 (コードコメント規約):** 全ての関数、クラス、主要なロジックブロックの先頭には、その目的、引数、返り値を記述したJSDoc形式のコメントを必須とする。
9.  **P02_009 (バージョン管理プロトコル):** 各機能単位の実装完了ごとに、`SECTION_ID: 4.X` の機能IDを含むコミットメッセージ（例: `feat(cart): Implement cart item quantity update (FUNC_ID: 4.2.1.2)`) でGitHubリポジトリにプッシュすること。
10. **P02_010 (テスト容易性):** 各コンポーネントは、ユニットテストが容易なように、副作用を最小限に抑え、純粋な関数に近い形で設計すること（テストコード自体の実装は本スコープ外だが、設計は考慮すること）。
11. **P02_011 (セキュリティ考慮):** ユーザー認証情報などの機密データを扱う際は、適切なセキュリティ対策を考慮すること。`localStorage` の利用制限を理解し、実運用を想定した注意書きをコードコメントに含めること。

---
## **1. ターゲットユーザー定義とコア利用シナリオ**
### **1.1. ペルソナ定義 (最優先ターゲット)**
- **PERSONA_ID:** `P_KENSETSU_001`
- **ATTRIBUTES:**
    - `occupation`: "1人親方 (建設・建材)"
    - `it_literacy`: "スマートフォンネイティブ、EC利用経験限定的（CtoCメイン）"
    - `primary_device`: "スマートフォン (iOS/Android最新版)"
    - `primary_need`: "現場での迅速な資材検索と疑似発注体験"
    - `key_behavior`: "型番検索の多用、短時間での意思決定"

### **1.2. コア利用シナリオ定義**
- **SCENARIO_ID:** `SCN_PRODUCT_FLOW_001` (商品検索から疑似購入まで)
    1.  **STEP_001:** ユーザーは `ROUTE: /` (ホームページ) にスマートフォンでアクセス。
    2.  **STEP_002:** `COMPONENT_ID: C_PRODUCT_FILTER_CATEGORY` (カテゴリフィルター) または `COMPONENT_ID: C_GLOBAL_SEARCH_BAR` (グローバル検索バー) を使用して商品を探索。
    3.  **STEP_003:** `ROUTE: /products` (商品一覧ページ) で商品を閲覧。`COMPONENT_ID: C_PRODUCT_CARD` をタップし `ROUTE: /products/[id]` (商品詳細ページ) へ遷移。
    4.  **STEP_004:** 商品詳細ページで情報を確認し、`COMPONENT_ID: C_ADD_TO_CART_BUTTON` をタップ。
    5.  **STEP_005:** `ROUTE: /cart` (カートページ) へ遷移。`COMPONENT_ID: C_CART_ITEM` の数量を変更または削除。
    6.  **STEP_006:** `COMPONENT_ID: C_PROCEED_TO_CHECKOUT_BUTTON` をタップ。
    7.  **STEP_007:** `ROUTE: /order-complete` (注文完了ページ) が表示され、ダミー注文番号を確認。

- **SCENARIO_ID:** `SCN_AUTH_FLOW_001` (会員登録・ログイン)
    1.  **STEP_001:** ユーザーは `ROUTE: /register` (会員登録ページ) にアクセス。
    2.  **STEP_002:** `COMPONENT_ID: C_REGISTRATION_FORM` にメールアドレスとパスワードを入力し登録。
    3.  **STEP_003:** ユーザーは `ROUTE: /login` (ログインページ) にアクセス。
    4.  **STEP_004:** `COMPONENT_ID: C_LOGIN_FORM` に登録情報を用いてログイン。

- **SCENARIO_ID:** `SCN_USER_FEATURES_FLOW_001` (注文履歴・お気に入り)
    1.  **STEP_001:** ログイン済みユーザーは `ROUTE: /history` (注文履歴ページ) にアクセスし、過去の疑似注文内容を確認。
    2.  **STEP_002:** ログイン済みユーザーは `ROUTE: /favorites` (お気に入りリストページ) にアクセスし、登録商品を確認。
    3.  **STEP_003:** 商品詳細ページまたは注文履歴ページで `COMPONENT_ID: C_TOGGLE_FAVORITE_BUTTON` を使用し、商品をお気に入りに追加/削除。

---
## **2. 技術スタックとプロジェクト構造定義**
### **2.1. 技術スタック定義 (固定)**
- **FRAMEWORK:** Next.js `^14.0.0` (App Router, TypeScript `^5.0.0`)
- **UI_LIBRARY:** Material UI (MUI) `@mui/material` `^5.15.0`, `@mui/icons-material` `^5.15.0`, `@emotion/react` `^11.0.0`, `@emotion/styled` `^11.0.0`
- **STATE_MANAGEMENT_FRONTEND:**
    - `local_state`: React `useState` hook
    - `global_state_auth`: React `useContext` hook (Provider: `AuthContext`)
    - `persistent_state`: `localStorage` (Web Storage API)
- **DATA_SOURCE_STATIC:** TypeScript arrays/objects (詳細は `SECTION_ID: 3.X`)
- **DEPLOYMENT_PLATFORM:** Vercel
- **VERSION_CONTROL_SYSTEM:** Git, GitHub

### **2.2. ディレクトリ構造規定 (Next.js App Router)**
- **ROOT_PATH:** `/`
- **STRUCTURE:**
  ```
  /
  ├── app/                                # APP_DIR
  │   ├── (auth)/                         # AUTH_GROUP_DIR (ROUTE GROUP)
  │   │   ├── login/
  │   │   │   └── page.tsx                # LOGIN_PAGE_FILE
  │   │   └── register/
  │   │       └── page.tsx                # REGISTER_PAGE_FILE
  │   ├── (user)/                         # USER_GROUP_DIR (ROUTE GROUP, REQUIRES AUTH)
  │   │   ├── cart/
  │   │   │   └── page.tsx                # CART_PAGE_FILE
  │   │   ├── favorites/
  │   │   │   └── page.tsx                # FAVORITES_PAGE_FILE
  │   │   ├── history/
  │   │   │   └── page.tsx                # HISTORY_PAGE_FILE
  │   │   └── layout.tsx                  # USER_AREA_LAYOUT_FILE (e.g., with user-specific sidebar)
  │   ├── products/                       # PRODUCTS_DIR
  │   │   ├── [id]/                       # PRODUCT_DETAIL_DIR (DYNAMIC ROUTE)
  │   │   │   └── page.tsx                # PRODUCT_DETAIL_PAGE_FILE
  │   │   └── page.tsx                    # PRODUCT_LIST_PAGE_FILE
  │   ├── layout.tsx                      # ROOT_LAYOUT_FILE (Global providers, MUI Theme)
  │   └── page.tsx                        # HOME_PAGE_FILE
  ├── components/                         # COMPONENTS_DIR
  │   ├── common/                         # COMMON_COMPONENTS_SUBDIR (e.g., buttons, inputs, modals)
  │   ├── layout/                         # LAYOUT_COMPONENTS_SUBDIR (e.g., Header.tsx, Footer.tsx, Navbar.tsx)
  │   ├── products/                       # PRODUCT_COMPONENTS_SUBDIR (e.g., ProductCard.tsx, ProductFilter.tsx)
  │   └── cart/                           # CART_COMPONENTS_SUBDIR (e.g., CartItem.tsx)
  ├── contexts/                           # CONTEXTS_DIR
  │   └── AuthContext.tsx                 # AUTH_CONTEXT_FILE
  ├── lib/                                # LIB_DIR
  │   ├── data/                           # DATA_SUBDIR
  │   │   ├── categories.ts               # CATEGORIES_DATA_FILE
  │   │   ├── products.ts                 # PRODUCTS_DATA_FILE
  │   │   └── users.ts                    # USERS_DATA_FILE (DUMMY)
  │   ├── hooks/                          # HOOKS_SUBDIR (Custom hooks, e.g., useLocalStorage.ts)
  │   └── utils/                          # UTILS_SUBDIR (e.g., stringFormatters.ts, validationRules.ts)
  ├── public/                             # PUBLIC_ASSETS_DIR
  │   └── images/
  │       └── products/                   # PRODUCT_IMAGES_SUBDIR
  ├── styles/                             # STYLES_DIR
  │   └── theme.ts                        # MUI_THEME_CONFIG_FILE
  └── tsconfig.json                       # TS_CONFIG_FILE
  ```

---
## **3. データ構造定義 (厳格)**
### **3.1. `Category` (カテゴリ)**
- **FILE_PATH:** `PATH: /lib/data/categories.ts`
- **TYPE_DEFINITION_ID:** `T_CATEGORY`
  ```typescript
  // TYPE_ID: T_CATEGORY
  export interface Category {
    readonly id: string;         // FORMAT: 'cat-' + 3-digit number (e.g., 'cat-001'), IMMUTABLE, UNIQUE
    name: string;       // CONSTRAINTS: Non-empty, Max 50 chars
    slug: string;       // FORMAT: kebab-case, URL-safe, UNIQUE, Max 50 chars
    // iconName?: string; // (OPTIONAL) MUI Icon component name (e.g., 'BuildCircle')
  }
  ```
- **DATA_EXAMPLE_ID:** `D_CATEGORIES_SAMPLE`
  `export const categories: Category[] = [ { id: 'cat-001', name: '電動工具', slug: 'power-tools' }, ... ];`

### **3.2. `ProductSpecification` (商品仕様)**
- **TYPE_DEFINITION_ID:** `T_PRODUCT_SPECIFICATION`
  ```typescript
  // TYPE_ID: T_PRODUCT_SPECIFICATION
  export interface ProductSpecification {
    readonly label: string;      // CONSTRAINTS: Non-empty, Max 30 chars
    value: string;      // CONSTRAINTS: Non-empty, Max 100 chars
  }
  ```

### **3.3. `Product` (商品)**
- **FILE_PATH:** `PATH: /lib/data/products.ts`
- **TYPE_DEFINITION_ID:** `T_PRODUCT`
  ```typescript
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
  ```
- **DATA_EXAMPLE_ID:** `D_PRODUCTS_SAMPLE`
  `export const products: Product[] = [ { id: 'prod-001', name: '...', sku: 'TD173DRGX', ... }, ... ];` (最低20件、各カテゴリに分散)

### **3.4. `User` (ダミーユーザー)**
- **FILE_PATH:** `PATH: /lib/data/users.ts`
- **TYPE_DEFINITION_ID:** `T_USER`
  ```typescript
  // TYPE_ID: T_USER
  export interface User {
    readonly id: string;         // FORMAT: 'user-' + 3-digit number (e.g., 'user-001'), IMMUTABLE, UNIQUE
    email: string;      // FORMAT: Standard email format, UNIQUE
    password: string;   // CONSTRAINTS: Plain text for mock (DO NOT USE IN PRODUCTION), Min 8 chars
    name?: string;      // (OPTIONAL) CONSTRAINTS: Max 50 chars
    // registeredAt: string; // ISO 8601 DateTime string (e.g., '2024-07-15T10:00:00Z')
  }
  ```
- **DATA_EXAMPLE_ID:** `D_USERS_SAMPLE`
  `export const users: User[] = [ { id: 'user-001', email: 'test@example.com', password: 'password123' }, ... ];`

### **3.5. `CartItem`, `OrderItem` (カート内商品、注文商品)**
- **TYPE_DEFINITION_ID:** `T_CART_ITEM`
  ```typescript
  // TYPE_ID: T_CART_ITEM
  export interface CartItem {
    readonly productId: string; // REFERS_TO: T_PRODUCT.id
    quantity: number;     // CONSTRAINTS: Positive integer, Min 1
  }
  ```
- **TYPE_DEFINITION_ID:** `T_ORDER_ITEM` (CartItemと同一構造で可、または拡張)
  ```typescript
  // TYPE_ID: T_ORDER_ITEM
  export interface OrderItem extends CartItem {
    readonly unitPrice: number; // Price at the time of order, REFERS_TO: T_PRODUCT.price
  }
  ```

### **3.6. `Order` (ダミー注文)**
- **TYPE_DEFINITION_ID:** `T_ORDER`
  ```typescript
  // TYPE_ID: T_ORDER
  export interface Order {
    readonly id: string;         // FORMAT: 'order-' + 6-digit timestamp fragment (e.g., 'order-240715100000'), IMMUTABLE, UNIQUE
    readonly userId: string;     // REFERS_TO: T_USER.id
    readonly items: readonly OrderItem[]; // ARRAY_OF: T_ORDER_ITEM, CONSTRAINTS: Non-empty
    readonly totalPrice: number; // CONSTRAINTS: Sum of (OrderItem.unitPrice * OrderItem.quantity)
    readonly orderedAt: string;  // ISO 8601 DateTime string
    // shippingAddress?: any; // (OPTIONAL, SCOPE_OUT for this mock)
  }
  ```

### **3.7. `localStorage` キー定義 (厳格)**
- **KEY_PREFIX:** `KEM_MOCK_`
- **KEYS:**
    - `KEM_MOCK_USERS`: `T_USER[]` (全ダミーユーザー情報)
    - `KEM_MOCK_CURRENT_USER_ID`: `string | null` (ログイン中ユーザーの `T_USER.id`)
    - `KEM_MOCK_CART_{USER_ID}`: `T_CART_ITEM[]` (ユーザーごとのカート情報、例: `KEM_MOCK_CART_user-001`)
    - `KEM_MOCK_FAVORITES_{USER_ID}`: `string[]` (ユーザーごとのT_PRODUCT.idの配列、例: `KEM_MOCK_FAVORITES_user-001`)
    - `KEM_MOCK_ORDERS_{USER_ID}`: `T_ORDER[]` (ユーザーごとの注文履歴、例: `KEM_MOCK_ORDERS_user-001`)

### **3.8. エラー処理とバリデーション**
- **ERROR_TYPE_DEFINITION_ID:** `T_VALIDATION_ERROR`
  ```typescript
  // TYPE_ID: T_VALIDATION_ERROR
  export interface ValidationError {
    field: string;         // エラーが発生したフィールド名
    message: string;       // ユーザーに表示するエラーメッセージ
    errorCode?: string;    // (オプション) エラーの種類を識別するコード
  }
  ```

- **VALIDATION_UTILITY_FUNCTIONS:**
  ```typescript
  // UTIL_ID: validateEmail
  export const validateEmail = (email: string): ValidationError | null => {
    // 実装
  };
  
  // UTIL_ID: validatePassword
  export const validatePassword = (password: string): ValidationError | null => {
    // 実装
  };
  
  // UTIL_ID: validateQuantity
  export const validateQuantity = (quantity: number): ValidationError | null => {
    // 実装
  };
  ```

---
## **4. 機能・ページ・コンポーネント仕様 (抜粋 - 主要機能)**
*(AIエージェントは、以下のパターンに従い、全機能・ページ・コンポーネントの仕様を推論または要求すること。ここでは主要なものを例示する)*

### **4.1. 商品一覧ページ (`ROUTE: /products`)**
- **PAGE_ID:** `P_PRODUCT_LIST`
- **FUNC_ID_PREFIX:** `FUNC_PLP_`
- **RESPONSIBILITIES:**
    - `FUNC_PLP_001`: `PATH: /lib/data/products.ts` から全商品データを取得し表示。
    - `FUNC_PLP_002`: `COMPONENT_ID: C_PRODUCT_FILTER_CATEGORY` によるカテゴリ絞り込み機能。
    - `FUNC_PLP_003`: `COMPONENT_ID: C_PRODUCT_FILTER_KEYWORD` によるキーワード検索機能（商品名, SKU, メーカー）。
    - `FUNC_PLP_004`: 各商品を `COMPONENT_ID: C_PRODUCT_CARD` で表示。
    - `FUNC_PLP_005`: レスポンシブグリッドレイアウト (スマホ: 1-2列, タブレット: 2-3列, PC: 3-4列)。
- **COMPONENTS_USED:** `C_PRODUCT_FILTER_CATEGORY`, `C_PRODUCT_FILTER_KEYWORD`, `C_PRODUCT_CARD`, `C_PAGINATION` (任意実装)

#### **4.1.1. `ProductCard` コンポーネント**
- **COMPONENT_ID:** `C_PRODUCT_CARD`
- **FILE_PATH:** `PATH: /components/products/ProductCard.tsx`
- **PROPS_TYPE_DEFINITION_ID:** `TP_C_PRODUCT_CARD`
  ```typescript
  // TYPE_ID: TP_C_PRODUCT_CARD
  interface ProductCardProps {
    readonly product: T_PRODUCT; // Product data to display
    readonly onAddToCart: (productId: string) => void; // Callback when "Add to Cart" is clicked (optional, may be on detail page only)
    readonly onToggleFavorite: (productId: string) => void; // Callback to toggle favorite status
    readonly isFavorite: boolean; // Current favorite status of the product
  }
  ```
- **UI_SPEC:**
    - MUI `Card` コンポーネントをベースとする。
    - 表示要素: `Product.images[0]`, `Product.name`, `Product.price`, `Product.sku`, `Product.stockStatus` (バッジ等で視覚的に)。
    - アクション: クリックで商品詳細ページ (`ROUTE: /products/[Product.id]`) へ遷移。お気に入りトグルボタン (`IconButton` with `FavoriteBorderIcon`/`FavoriteIcon`)。
- **BEHAVIOR_SPEC:**
    - `stockStatus` に応じて背景色やテキスト色を一部変更 (例: `OUT_OF_STOCK` は薄いグレーアウト)。

### **4.2. カートページ (`ROUTE: /cart`)**
- **PAGE_ID:** `P_CART`
- **FUNC_ID_PREFIX:** `FUNC_CART_`
- **RESPONSIBILITIES:**
    - `FUNC_CART_001`: `localStorage` (`KEM_MOCK_CART_{USER_ID}`) から現在のユーザーのカート情報を取得し表示。
    - `FUNC_CART_002`: 各カートアイテムを `COMPONENT_ID: C_CART_ITEM` で表示。
    - `FUNC_CART_003`: カート内商品の合計金額を計算し表示。
    - `FUNC_CART_004`: 「購入手続きへ進む」ボタン (`COMPONENT_ID: C_PROCEED_TO_CHECKOUT_BUTTON`) を表示。
- **COMPONENTS_USED:** `C_CART_ITEM`, `C_PROCEED_TO_CHECKOUT_BUTTON`

#### **4.2.1. `CartItem` コンポーネント**
- **COMPONENT_ID:** `C_CART_ITEM`
- **FILE_PATH:** `PATH: /components/cart/CartItem.tsx`
- **PROPS_TYPE_DEFINITION_ID:** `TP_C_CART_ITEM`
  ```typescript
  // TYPE_ID: TP_C_CART_ITEM
  interface CartItemProps {
    readonly item: T_CART_ITEM; // Cart item data
    readonly productDetails: T_PRODUCT; // Corresponding product details for display (name, image, price)
    readonly onUpdateQuantity: (productId: string, newQuantity: number) => void; // Callback to update quantity
    readonly onRemoveItem: (productId: string) => void; // Callback to remove item
  }
  ```
- **UI_SPEC:**
    - MUI `ListItem` または `Card` をベースとする。
    - 表示要素: 商品画像 (`Product.images[0]`), 商品名 (`Product.name`), 単価 (`Product.price`), 数量 (MUI `TextField` type `number` または +/- ボタン), 小計。
    - アクション: 数量変更コントロール、削除ボタン (`IconButton` with `DeleteIcon`)。
- **BEHAVIOR_SPEC:**
    - `FUNC_CART_ITEM_001`: 数量は1未満にできない。
    - `FUNC_CART_ITEM_002`: 数量変更・削除は即座に `localStorage` に反映され、カート合計金額も再計算される。

---
## **5. UI/UXデザイン要件 (厳格)**
### **5.1. レスポンシブブレークポイント (MUIデフォルト準拠)**
- `xs`: 0px+
- `sm`: 600px+
- `md`: 900px+
- `lg`: 1200px+
- `xl`: 1536px+
- **PRIORITY_DEVICE:** `xs` および `sm` (スマートフォン縦・横)

### **5.2. カラーパレット (MUIテーマで設定)**
- **PRIMARY_COLOR:** `#1976D2` (MUI Blue 500)
- **SECONDARY_COLOR:** `#FFA000` (MUI Orange 700 - アクセント用)
- **BACKGROUND_DEFAULT:** `#FFFFFF`
- **BACKGROUND_PAPER:** `#F5F5F5` (MUI Grey 100 - カード背景など)
- **TEXT_PRIMARY:** `rgba(0, 0, 0, 0.87)`
- **TEXT_SECONDARY:** `rgba(0, 0, 0, 0.6)`
- **ERROR_COLOR:** `#D32F2F` (MUI Red 700)

### **5.3. タイポグラフィ (MUIテーマで設定)**
- **FONT_FAMILY:** `'Roboto', 'Helvetica', 'Arial', sans-serif` (MUIデフォルト)
- **H1_VARIANT:** `fontSize: '2.5rem', fontWeight: 600` (ページタイトル)
- **BUTTON_TEXT_TRANSFORM:** `none` (デフォルトの `uppercase` は解除)

### **5.4. 主要コンポーネントのスタイルガイドライン**
- **BUTTONS:** `Contained` ボタンを主要アクションに、`Text` または `Outlined` ボタンを副次アクションに使用。角丸はMUIデフォルト。
- **FORMS:** MUI `TextField` を使用。ラベルは `standard` または `outlined`。入力必須項目にはアスタリスク `(*)` を表示。バリデーションエラーメッセージはヘルパーテキストとして表示。
- **ICONS:** `@mui/icons-material` を使用。サイズは `medium` を基本。

---
## **6. 開発スコープ外 (厳格)**
- `SCOPE_OUT_001`: 管理画面全般。
- `SCOPE_OUT_002`: 実際の決済処理・外部決済API連携。
- `SCOPE_OUT_003`: リアルタイム在庫連携・複雑な価格ロジック。
- `SCOPE_OUT_004`: サーバーサイドレンダリング (SSR) の高度な最適化 (SSG/ISRはNext.jsの基本機能範囲で可)。
- `SCOPE_OUT_005`: パフォーマンス最適化（画像最適化はNext/Imageの基本機能範囲で可）。
- `SCOPE_OUT_006`: アクセシビリティ (ARIA属性等) の網羅的対応 (MUI標準のアクセシビリティは維持)。
- `SCOPE_OUT_007`: 国際化 (i18n) / 多言語対応。
- `SCOPE_OUT_008`: ユニットテスト、E2Eテストコードの実装。

---
## **7. 成果物と評価基準**
### **7.1. 最終成果物**
- `DELIV_001`: Vercelにデプロイされた動作可能なECサイトモックのURL。
- `DELIV_002`: 全ソースコード、設定ファイル、ダミーデータを含むGitHubリポジトリへのアクセス権。
- `DELIV_003`: (任意) 本ドキュメント `DOC_ID: KEM_DESIGN_SPEC_V_COS` の最終版 (開発中に発生した変更点や明確化点を反映)。

### **7.2. 完了判定基準 (2週間後)**
- **CRIT_001 (機能完全性):** `SECTION_ID: 4.X` で定義された全ページおよび主要機能が、指定されたデータ構造とロジックに基づき、エラーなく動作すること。
- **CRIT_002 (UI/UX忠実度):** `SECTION_ID: 5.X` で定義されたUI/UX要件（レスポンシブ、カラー、タイポグラフィ）が概ね実装されていること。
- **CRIT_003 (データ永続性):** カート情報、お気に入り、ユーザー認証情報、注文履歴が `localStorage` を介して正しく永続化・復元されること。
- **CRIT_004 (クロスブラウザ互換性):** 最新版のGoogle Chrome (PC/Android), Safari (iOS) で著しい表示崩れや機能不全がないこと。
- **CRIT_005 (コード品質):** `P02_008` (コメント規約) および `P02_009` (バージョン管理プロトコル) が遵守されていること。

---
## **8. リスク分析と対策**

### **8.1. 技術的リスク**

#### **8.1.1. Next.js App Routerの成熟度**
- **RISK_ID:** `RISK_TECH_001`
- **DESCRIPTION:** Next.js 14のApp Routerは比較的新しい機能であり、一部の機能やライブラリとの互換性に問題が生じる可能性がある。
- **MITIGATION:** 
  - 実装初期段階でApp Routerの基本機能を検証し、互換性問題を早期に特定する。
  - Material UI v5とNext.js 14の統合についての公式ドキュメントやコミュニティガイドを参照する。
  - `QUERY_FLAG_001`を使用して、具体的な実装課題が発生した場合は迅速に報告する。

#### **8.1.2. ローカルストレージの制限**
- **RISK_ID:** `RISK_TECH_002`
- **DESCRIPTION:** `localStorage`はブラウザごとに容量制限（通常5MB）があり、大量のデータや複雑な注文履歴を保存する場合に問題が生じる可能性がある。
- **MITIGATION:**
  - データ構造を最適化し、必要最小限の情報のみを保存する。
  - `localStorage`の使用状況をモニタリングし、容量制限に近づいた場合の対応策（古いデータの削除など）を実装する。
  - 実運用を想定した注意書きをコードに含める。

#### **8.1.3. ブラウザ互換性**
- **RISK_ID:** `RISK_TECH_003`
- **DESCRIPTION:** 異なるブラウザでのレンダリングや機能の挙動に差異が生じる可能性がある。
- **MITIGATION:**
  - MUIコンポーネントを最大限活用し、独自のCSSを最小限に抑える。
  - 開発中に定期的に異なるブラウザでのテストを実施する。
  - フレックスボックスやグリッドなどの標準的なレイアウト技術を優先的に使用する。

### **8.2. プロジェクト管理リスク**

#### **8.2.1. スコープクリープ**
- **RISK_ID:** `RISK_PROJ_001`
- **DESCRIPTION:** 要件が不明確な部分について、実装中に解釈や拡張が発生し、スコープが拡大する可能性がある。
- **MITIGATION:**
  - 不明確な要件については、実装前に `QUERY_FLAG_001` を使用して明確化を求める。
  - スコープの変更が提案された場合は、納期と他の要件への影響を評価し、明示的な承認を得る。
  - `P02_002`に基づき、ドキュメントに明記されていない機能の追加は避ける。

#### **8.2.2. 時間制約**
- **RISK_ID:** `RISK_PROJ_002`
- **DESCRIPTION:** 14日間の開発期間内に全機能を実装するのが困難になる可能性がある。
- **MITIGATION:**
  - 開発初日に詳細なタイムラインと優先順位付けを行う。
  - コア機能（商品一覧、詳細表示、カート機能）を優先的に実装する。
  - 進捗が予定より遅れた場合は、早期に `RISK_FLAG_001` を発して調整を求める。

### **8.3. UX/UIリスク**

#### **8.3.1. モバイルユーザビリティ**
- **RISK_ID:** `RISK_UX_001`
- **DESCRIPTION:** ターゲットユーザーの主要デバイスがスマートフォンであることを考慮すると、複雑な操作や情報表示がモバイル環境で使いにくくなる可能性がある。
- **MITIGATION:**
  - モバイルファーストの設計アプローチを徹底し、全ての機能をまずスマートフォン画面で設計・テストする。
  - タップ領域を十分に大きくし、指での操作を考慮したUIにする。
  - フォームの入力項目を最小限に抑え、ユーザーの入力負担を軽減する。

#### **8.3.2. 商品検索と絞り込み**
- **RISK_ID:** `RISK_UX_002`
- **DESCRIPTION:** ユーザーが必要な商品を素早く見つけられないと、ユーザー体験が低下する。
- **MITIGATION:**
  - 型番検索を最適化し、部分一致でも検索できるようにする。
  - フィルターの組み合わせを直感的に操作できるUIを実装する。
  - 検索結果が0件の場合の代替提案機能を検討する。

### **8.4. セキュリティリスク**

#### **8.4.1. 平文パスワード**
- **RISK_ID:** `RISK_SEC_001`
- **DESCRIPTION:** モックアプリとはいえ、パスワードを平文で保存することはセキュリティリスクとなる。
- **MITIGATION:**
  - パスワードはハッシュ化して`localStorage`に保存する。
  - このアプローチがモックとしての目的を損なわない範囲で実装する。
  - コードコメントに「実運用では適切な認証システムを使用すべき」との注意書きを追加する。

#### **8.4.2. クライアントサイドのみの認証**
- **RISK_ID:** `RISK_SEC_002`
- **DESCRIPTION:** クライアントサイドのみでの認証は、実運用では脆弱性となる。
- **MITIGATION:**
  - 実装コードに「これはモック用の簡易認証であり、実運用には適さない」との明確な注意書きを含める。
  - 将来のAPI連携を容易にするため、認証ロジックは独立したサービスとして実装する。

### **8.5. 拡張性とメンテナンスリスク**

#### **8.5.1. 将来的な拡張性**
- **RISK_ID:** `RISK_MAINT_001`
- **DESCRIPTION:** このモックが将来的に実システムに発展する場合、現在の設計では対応が困難になる可能性がある。
- **MITIGATION:**
  - データアクセスレイヤーを抽象化し、将来的にAPIに置き換えやすい設計にする。
  - コンポーネントを明確に分離し、再利用性と拡張性を高める。
  - 共通のユーティリティ関数や型定義を整理して管理する。

#### **8.5.2. コードメンテナンス**
- **RISK_ID:** `RISK_MAINT_002`
- **DESCRIPTION:** 短期間での開発によりコード品質が低下し、将来的なメンテナンスが困難になる可能性がある。
- **MITIGATION:**
  - コード品質を確保するため、ESLintとPrettierを設定し、一貫したコーディングスタイルを維持する。
  - 関数とコンポーネントの責務を明確に分離し、単一責任の原則に従う。
  - 充実したJSDocコメントを記述し、コードの意図と使用方法を明確にする。

---
## **9. 開発ガイドラインと補足情報**

### **9.1. 基本的なアクセシビリティ対応**
- **GUIDELINE_ID:** `GUIDE_A11Y_001`
- **DESCRIPTION:** 本プロジェクトでは網羅的なアクセシビリティ対応はスコープ外だが、以下の基本的な対応を考慮する。
- **IMPLEMENTATION:**
  - **色のコントラスト:** テキストと背景のコントラスト比はWCAG AA基準（4.5:1）を目指す
  - **キーボード操作:** すべての機能がキーボードのみでも操作可能にする
  - **代替テキスト:** 画像には適切な`alt`属性を設定する
  - **フォームラベル:** すべての入力要素に関連付けられたラベルを設定する
  - **フォーカス表示:** キーボード操作時のフォーカス状態を視覚的に明確にする

### **9.2. パフォーマンス最適化戦略**
- **GUIDELINE_ID:** `GUIDE_PERF_001`
- **DESCRIPTION:** 高度なパフォーマンス最適化はスコープ外だが、以下の基本的な対応を実施する。
- **IMPLEMENTATION:**
  - **画像最適化:** Next.js の `Image` コンポーネントを使用して画像を最適化する
  - **コード分割:** Next.js のページベースの自動コード分割を活用する
  - **LocalStorage最適化:** 
    ```typescript
    // UTIL_ID: getStorageSize
    export const getStorageSize = (): number => {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length * 2; // UTF-16 エンコーディングの各文字は2バイト
        }
      }
      return totalSize;
    }
    
    // UTIL_ID: clearOldOrders
    export const clearOldOrders = (userId: string, maxItems: number = 10): void => {
      const storageKey = `KEM_MOCK_ORDERS_${userId}`;
      const orders = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (orders.length > maxItems) {
        // 日付でソートして古いものを削除
        const sortedOrders = orders.sort((a, b) => 
          new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
        );
        
        localStorage.setItem(storageKey, JSON.stringify(sortedOrders.slice(0, maxItems)));
      }
    }
    ```

### **9.3. エラーハンドリング戦略**
- **GUIDELINE_ID:** `GUIDE_ERROR_001`
- **DESCRIPTION:** ユーザー体験を損なわないエラーハンドリング戦略を実装する。
- **IMPLEMENTATION:**
  - **グローバルエラーハンドリング:**
    ```typescript
    // UTIL_ID: useErrorHandler
    export const useErrorHandler = () => {
      const [error, setError] = useState<Error | null>(null);
      
      const handleError = useCallback((error: Error) => {
        console.error('Application error:', error);
        setError(error);
        
        // 開発環境ではより詳細な情報を表示
        if (process.env.NODE_ENV === 'development') {
          console.debug('Error details:', error.stack);
        }
      }, []);
      
      return {
        error,
        handleError,
        clearError: () => setError(null)
      };
    };
    ```
  - **LocalStorage例外処理:**
    ```typescript
    // UTIL_ID: safeLocalStorage
    export const safeLocalStorage = {
      getItem: (key: string): string | null => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error(`Failed to get item from localStorage: ${key}`, error);
          return null;
        }
      },
      setItem: (key: string, value: string): boolean => {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.error(`Failed to set item in localStorage: ${key}`, error);
          return false;
        }
      }
    };
    ```

### **9.4. テスト可能性を高める設計指針**
- **GUIDELINE_ID:** `GUIDE_TEST_001`
- **DESCRIPTION:** テストコード自体はスコープ外だが、テスト可能性を高める設計を採用する。
- **IMPLEMENTATION:**
  - **データとロジックの分離:** データアクセスとビジネスロジックを明確に分離し、モックが容易な構造にする
  - **純粋関数の優先:** 状態変更や副作用を最小限に抑えた純粋関数を優先的に使用する
  - **依存性の注入:** 外部依存（LocalStorageなど）は注入可能な設計にし、テスト時に置き換えられるようにする
  - **テスト用データ属性:** UIコンポーネントには`data-testid`属性を設定し、テスト時の要素特定を容易にする
  - **設計例:**
    ```typescript
    // UTIL_ID: createCartService
    export const createCartService = (storage = safeLocalStorage) => {
      return {
        getCart: (userId: string): CartItem[] => {
          const storageKey = `KEM_MOCK_CART_${userId}`;
          const cartData = storage.getItem(storageKey);
          return cartData ? JSON.parse(cartData) : [];
        },
        
        addToCart: (userId: string, productId: string, quantity: number): boolean => {
          const cart = getCart(userId);
          // 実装...
          return storage.setItem(`KEM_MOCK_CART_${userId}`, JSON.stringify(cart));
        }
      };
    };
    ```

### **9.5. 開発ワークフロー**
- **GUIDELINE_ID:** `GUIDE_DEV_001`
- **DESCRIPTION:** 効率的な開発を実現するためのワークフローを定義する。
- **IMPLEMENTATION:**
  - **開発フェーズ:**
    1. **環境構築 (Day 1):** プロジェクト初期化、基本設定、ダミーデータ作成
    2. **コアコンポーネント開発 (Day 2-3):** 共通UI要素、レイアウト、ナビゲーション
    3. **ページ実装 (Day 4-10):** 各ページの実装（商品一覧→商品詳細→カート→認証→注文履歴・お気に入り）
    4. **統合テスト・調整 (Day 11-12):** ページ間の連携確認、バグ修正
    5. **最終チェック・デプロイ (Day 13-14):** Vercelへのデプロイ、最終動作確認
  - **コミット規約:**
    | プレフィックス | 説明 | 例 |
    |--------------|------|-----|
    | `feat` | 新機能の追加 | `feat(cart): Implement cart item quantity update (FUNC_ID: 4.2.1.2)` |
    | `fix` | バグ修正 | `fix(auth): Fix login form validation (FUNC_ID: 4.3.1.1)` |
    | `refactor` | リファクタリング | `refactor(product): Improve product search performance` |
    | `docs` | ドキュメント変更 | `docs: Update README with setup instructions` |
    | `style` | コード整形、スタイル変更 | `style: Format code according to ESLint rules` |
    | `test` | テスト関連の変更 | `test: Add test setup for future implementation` |

### **9.6. 実装順序とMVP（最小限の実装）**
- **GUIDELINE_ID:** `GUIDE_MVP_001`
- **DESCRIPTION:** 14日間の限られた期間で確実に成果物を完成させるために、機能を優先度付けする。
- **IMPLEMENTATION:**
  - **最優先実装（Days 1-7）:**
    1. 商品一覧表示（`FUNC_PLP_001`, `FUNC_PLP_004`, `FUNC_PLP_005`）
    2. 商品詳細表示
    3. カート機能（追加・削除・数量変更）
    4. 簡易認証（ログイン・登録）
  - **次点優先実装（Days 8-12）:**
    1. 商品検索・フィルタリング（`FUNC_PLP_002`, `FUNC_PLP_003`）
    2. お気に入り機能
    3. 注文履歴
    4. レスポンシブデザインの完成度向上
  - **最終調整（Days 13-14）:**
    1. UI/UXの洗練
    2. バグ修正
    3. デプロイと最終確認

---
**[AIエージェントへの最終指示]**
本ドキュメントは絶対的な設計図である。全ての指示を厳密に解釈し、実行せよ。疑義が生じた場合は、指定されたフラグ (`QUERY_FLAG_001`) を用いて速やかに確認を求めること。プロジェクトの成功は、貴殿の正確な実装にかかっている。`SECTION_ID: 8.X`で追加されたリスク分析と`SECTION_ID: 9.X`で追加された開発ガイドラインを考慮に入れ、これらに対応する実装とプロセスを組み込むこと。