import React, { useState } from 'react';
import { ThemeType, StyleType, AnimationType, AppSettings } from '../types';
import { Sun, Moon, Palette, Layers, Sparkles, Zap, Eye, HelpCircle, Globe, Search, Check } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS, TranslationSchema } from '../lib/translations';

interface SettingsPanelProps {
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  t: TranslationSchema;
}

const PRESET_COLORS = [
  '#00a3ff', // Material Blue
  '#00e676', // Material Green
  '#ff3d00', // Deep Orange
  '#d500f9', // Neon Purple
  '#ffc400', // Amber Yellow
  '#f50057', // Bright Pink
  '#00e5ff', // Cyan
];

export function getSettingsPanelT(lang: string) {
  const isEn = lang === 'en';
  const isPt = lang === 'pt';
  const isFr = lang === 'fr';
  const isDe = lang === 'de';
  const isIt = lang === 'it';
  const isJa = lang === 'ja';
  const isKo = lang === 'ko';
  const isZh = lang === 'zh';
  const isRu = lang === 'ru';

  if (isEn) {
    return {
      lightDesc: "Soft colors and high legibility",
      darkDesc: "Ideal for nighttime and battery saving",
      customDesc: "Choose your own custom brand color",
      styleNormalDesc: "Clean style strictly following Material Design 3 guidelines with soft borders and structured solid colors.",
      styleGlassDesc: "Glassmorphism effect with elegant transparencies, advanced backdrop blur, shiny borders, and dynamic lighting.",
      animActivatedDesc: "Fluid effects, scaling, and full 3D transitions",
      animReducedDesc: "Simple fades and minimal scaling, ideal for performance",
      animDisabledDesc: "Instant state changes without any transitions or loading",
      faqsTitle: "Frequently Asked Questions",
      faqQ1: "Where are my files stored?",
      faqA1: "In the server's persistent storage folder. FileShare performs immediate malware scans on every uploaded file.",
      faqQ2: "Is there a file size limit?",
      faqA2: "No limits in the UI. The maximum supported size is up to 500MB by default for fast development uploads.",
      faqQ3: "What is Liquid Glass mode?",
      faqA3: "An advanced visual style inspired by next-generation operating systems that overlays translucent elements with refracting borders for full immersion."
    };
  }

  if (isPt) {
    return {
      lightDesc: "Cores suaves e alta legibilidade",
      darkDesc: "Ideal para a noite e economia de bateria",
      customDesc: "Escolha sua própria cor de marca personalizada",
      styleNormalDesc: "Estilo limpo seguindo rigorosamente as diretrizes do Material Design 3 com bordas suaves e cores sólidas estruturadas.",
      styleGlassDesc: "Efeito Glassmorphism com transparências elegantes, desfoque de fundo avançado, bordas brilhantes e iluminação dinâmica.",
      animActivatedDesc: "Efeitos fluidos, escalas e transições 3D completas",
      animReducedDesc: "Desvanecimentos simples e escalas mínimas, ideal para desempenho",
      animDisabledDesc: "Mudanças instantâneas de estado sem transições ou carregamentos",
      faqsTitle: "Perguntas Frequentes",
      faqQ1: "Onde meus arquivos são guardados?",
      faqA1: "Na pasta de armazenamento persistente do servidor. O FileShare realiza análises imediatas de malware em cada arquivo enviado.",
      faqQ2: "Existe algum limite de tamanho de arquivo?",
      faqA2: "Sem limites na interface. O tamanho máximo suportado é de até 500MB por padrão para envios rápidos de desenvolvimento.",
      faqQ3: "O que é o modo Liquid Glass?",
      faqA3: "Um estilo visual avançado inspirado em sistemas de última geração que sobrepõe elementos translúcidos com bordas refratárias para imersão total."
    };
  }

  if (isFr) {
    return {
      lightDesc: "Couleurs douces et grande lisibilité",
      darkDesc: "Idéal pour la nuit et l'économie de batterie",
      customDesc: "Choisissez votre propre couleur de marque",
      styleNormalDesc: "Style épuré suivant rigoureusement les directives Material Design 3 avec des bordures douces et des couleurs solides structurées.",
      styleGlassDesc: "Effet de morphisme de verre avec des transparences élégantes, un flou d'arrière-plan avancé, des bordures brillantes et un éclairage dynamique.",
      animActivatedDesc: "Effets fluides, mise à l'échelle et transitions 3D complètes",
      animReducedDesc: "Fondus simples et mise à l'échelle minimale, idéal pour les performances",
      animDisabledDesc: "Changements d'état instantanés sans transitions ni chargement",
      faqsTitle: "Questions Fréquemment Posées",
      faqQ1: "Où sont stockés mes fichiers ?",
      faqA1: "Dans le dossier de stockage persistant du serveur. FileShare effectue des analyses immédiates de logiciels malveillants sur chaque fichier téléchargé.",
      faqQ2: "Y a-t-il une limite de taille de fichier ?",
      faqA2: "Aucune limite dans l'interface. La taille maximale prise en charge est de 500 Mo par défaut pour des téléchargements rapides en développement.",
      faqQ3: "Qu'est-ce que le mode Liquid Glass ?",
      faqA3: "Un style visuel avancé inspiré des systèmes de nouvelle génération qui superpose des éléments translucides avec des bordures réfractantes pour une immersion totale."
    };
  }

  if (isDe) {
    return {
      lightDesc: "Sanfte Farben und hohe Lesbarkeit",
      darkDesc: "Ideal für die Nacht und zur Akkueinsparung",
      customDesc: "Wählen Sie Ihre eigene Markenfarbe",
      styleNormalDesc: "Ein sauberer Stil, der sich strikt an die Richtlinien von Material Design 3 hält, mit weichen Kanten und strukturierten Volltonfarben.",
      styleGlassDesc: "Glassmorphismus-Effekt mit eleganten Transparenzen, erweitertem Hintergrund-Weichzeichner, glänzenden Rändern und dynamischer Beleuchtung.",
      animActivatedDesc: "Flüssige Effekte, Skalierungen und vollständige 3D-Übergänge",
      animReducedDesc: "Einfache Ausblendungen und minimale Skalierung, ideal für Leistung",
      animDisabledDesc: "Sofortige Zustandsänderungen ohne Übergänge oder Ladezeiten",
      faqsTitle: "Häufig gestellte Fragen",
      faqQ1: "Wo werden meine Dateien gespeichert?",
      faqA1: "Im persistenten Speicherordner des Servers. FileShare führt bei jeder hochgeladenen Datei sofortige Malware-Scans durch.",
      faqQ2: "Gibt es ein Dateigrößenlimit?",
      faqA2: "Keine Limits in der Benutzeroberfläche. Die standardmäßig unterstützte maximale Größe beträgt bis zu 500 MB für schnelle Entwicklungs-Uploads.",
      faqQ3: "Was ist der Liquid-Glass-Modus?",
      faqA3: "Ein fortschrittlicher visueller Stil, der von Betriebssystemen der nächsten Generation inspiriert ist. Er überlagert transluzente Elemente mit lichtbrechenden Rändern für vollständiges Eintauchen."
    };
  }

  if (isIt) {
    return {
      lightDesc: "Colori tenui ed elevata leggibilità",
      darkDesc: "Ideale per la notte e il risparmio energetico",
      customDesc: "Scegli il colore del tuo marchio personalizzato",
      styleNormalDesc: "Stile pulito che segue rigorosamente le linee guida Material Design 3 con bordi morbidi e colori solidi strutturati.",
      styleGlassDesc: "Effet Glassmorphism con trasparenze eleganti, sfocatura dello sfondo avanzata, bordi lucidi e illuminazione dinamica.",
      animActivatedDesc: "Effetti fluidi, ridimensionamento e transizioni 3D complete",
      animReducedDesc: "Dissolvenze semplici e ridimensionamento minimo, ideale per le prestazioni",
      animDisabledDesc: "Cambi di stato istantanei senza transizioni né caricamenti",
      faqsTitle: "Domande Frequenti",
      faqQ1: "Dove vengono salvati i miei file?",
      faqA1: "Nella cartella di archiviazione persistente del server. FileShare esegue scansioni malware immediate su ogni file caricato.",
      faqQ2: "Esiste un limite alla dimensione dei file?",
      faqA2: "Nessun limite nell'interfaccia. La dimensione massima supportata è di 500 MB per impostazione predefinita per caricamenti rapidi di sviluppo.",
      faqQ3: "Cos'è la modalità Liquid Glass?",
      faqA3: "Uno stile visivo avanzato ispirato ai sistemi operativi di nuova generazione che sovrappone elementi traslucidi con bordi rifrangenti per un'immersione completa."
    };
  }

  if (isJa) {
    return {
      lightDesc: "目に優しい色合いと高い視認性",
      darkDesc: "夜間使用とバッテリー節約に最適",
      customDesc: "独自のブランドカラーを選択可能",
      styleNormalDesc: "Material Design 3のガイドラインに厳密に従い、柔らかい角と構造化されたソリッドカラーを備えたクリーンなスタイル。",
      styleGlassDesc: "エレガントな透明感、高度な背景ぼかし、光沢のある境界、動的なライティングを備えたグラスモーフィズム効果。",
      animActivatedDesc: "滑らかな効果、スケーリング、フル3Dトランジション",
      animReducedDesc: "シンプルなフェードと最小限のスケーリング、パフォーマンス重視",
      animDisabledDesc: "トランジションや読み込みのない瞬時の状態切り替え",
      faqsTitle: "よくある質問",
      faqQ1: "ファイルはどこに保存されますか？",
      faqA1: "サーバーの永続的なストレージフォルダに保存されます。FileShareはアップロードされたすべてのファイルに対して即座にマルウェアスキャンを実行します。",
      faqQ2: "ファイルサイズに制限はありますか？",
      faqA2: "UI上に制限はありません。迅速な開発アップロードのために、デフォルトで最大500MBまでサポートされています。",
      faqQ3: "Liquid Glassモードとは何ですか？",
      faqA3: "次世代OSにインスパイアされた高度なビジュアルスタイルで、半透明の要素と光を屈折させる輪郭を重ね合わせることで、完全な没入感を実現します。"
    };
  }

  if (isKo) {
    return {
      lightDesc: "부드러운 색상과 높은 가독성",
      darkDesc: "야간 사용 및 배터리 절약에 최적",
      customDesc: "나만의 맞춤형 브랜드 색상 선택",
      styleNormalDesc: "부드러운 테두리와 구조화된 솔리드 컬러를 갖춘 Material Design 3 가이드라인을 엄격히 따르는 깔끔한 스타일.",
      styleGlassDesc: "우아한 투명도, 고급 배경 흐림, 빛나는 테두리 및 동적 조명을 특징으로 하는 글래스모피즘 효과.",
      animActivatedDesc: "부드러운 효과, 크기 조정 및 완전한 3D 전환",
      animReducedDesc: "간단한 페이드 및 최소 크기 조정, 성능에 적합",
      animDisabledDesc: "전환이나 로딩 없이 즉각적인 상태 변경",
      faqsTitle: "자주 묻는 질문",
      faqQ1: "내 파일은 어디에 저장되나요?",
      faqA1: "서버의 영구 저장 폴더에 저장됩니다. FileShare는 업로드된 모든 파일에 대해 실시간 악성코드 검사를 수행합니다.",
      faqQ2: "파일 크기 제한이 있습니까?",
      faqA2: "인터페이스에는 제한이 없습니다. 원활한 개발 업로드를 위해 기본적으로 최대 500MB까지 지원됩니다.",
      faqQ3: "Liquid Glass 모드란 무엇입니까?",
      faqA3: "차세대 운영체제에서 영감을 얻은 고급 시각 스타일로, 반투명한 요소와 빛을 굴절시키는 테두리를 레이어링하여 완전한 몰입감을 제공합니다."
    };
  }

  if (isZh) {
    return {
      lightDesc: "色彩温和，清晰易读",
      darkDesc: "夜间使用及节省电量的理想选择",
      customDesc: "选择您专属的品牌主题色",
      styleNormalDesc: "严格遵循 Material Design 3 规范的干练风格，具有平滑的边框和结构化纯色。",
      styleGlassDesc: "具有优雅透明度、先进背景模糊、发光边框和动态照明的毛玻璃效果。",
      animActivatedDesc: "流畅效果、缩放和完整的 3D 过渡",
      animReducedDesc: "简单的渐变和最小程度的缩放，适合极致性能",
      animDisabledDesc: "没有任何过渡或加载，状态即时切换",
      faqsTitle: "常见问题解答",
      faqQ1: "我的文件保存在哪里？",
      faqA1: "保存在服务器的持久存储文件夹中。FileShare 在每次上传文件时都会立即进行恶意软件扫描。",
      faqQ2: "是否有文件大小限制？",
      faqA2: "界面中没有限制。出于快速开发上传的需要，默认支持最大 500MB 的文件。",
      faqQ3: "什么是 Liquid Glass（流体玻璃）模式？",
      faqA3: "灵感来自下一代操作系统的先进视觉风格，将半透明元素与折射边框相叠加，营造出完全沉浸的观感。"
    };
  }

  if (isRu) {
    return {
      lightDesc: "Мягкие цвета и высокая читаемость",
      darkDesc: "Идеально для ночи и экономии заряда батареи",
      customDesc: "Выберите свой собственный цвет бренда",
      styleNormalDesc: "Чистый стиль, строго соответствующий рекомендациям Material Design 3, с мягкими границами и структурированными сплошными цветами.",
      styleGlassDesc: "Эффект Glassmorphism с элегантной прозрачностью, расширенным размытием фона, глянцевыми краями и динамическим освещением.",
      animActivatedDesc: "Плавные эффекты, масштабирование и полные 3D-переходы",
      animReducedDesc: "Простые затухания и минимальное масштабирование, идеально для производительности",
      animDisabledDesc: "Мгновенное изменение состояний без переходов и загрузок",
      faqsTitle: "Часто задаваемые вопросы",
      faqQ1: "Где хранятся мои файлы?",
      faqA1: "В папке постоянного хранилища сервера. FileShare выполняет немедленное сканирование каждого загруженного файла на наличие вредоносного ПО.",
      faqQ2: "Есть ли ограничение на размер файла?",
      faqA2: "Ограничений в интерфейсе нет. По умолчанию поддерживается размер до 500 МБ для быстрой загрузки при разработке.",
      faqQ3: "Что такое режим Liquid Glass?",
      faqA3: "Передовой визуальный стиль, вдохновленный операционными системами следующего поколения. Он накладывает полупрозрачные элементы с преломляющими границами для полного погружения."
    };
  }

  return {
    lightDesc: "Colores suaves y alta legibilidad",
    darkDesc: "Ideal para la noche y ahorro de batería",
    customDesc: "Elige tu propio color de marca",
    styleNormalDesc: "Estilo limpio siguiendo rigurosamente las pautas de Material Design 3 con bordes suaves y colores sólidos estructurados.",
    styleGlassDesc: "Efecto Glassmorphism con transparencias elegantes, desenfoque de fondo avanzado, bordes brillantes e iluminación dinámica.",
    animActivatedDesc: "Efectos fluidos, escalados y transiciones 3D completas",
    animReducedDesc: "Desvanecimientos simples y escalados mínimos, ideal para rendimiento",
    animDisabledDesc: "Cambios instantáneos de estados sin transiciones ni cargas",
    faqsTitle: "Preguntas frecuentes",
    faqQ1: "¿Dónde se guardan mis archivos?",
    faqA1: "En la carpeta de almacenamiento persistente del servidor. FileShare realiza análisis inmediatos de malware en cada archivo subido.",
    faqQ2: "¿Existe algún límite de tamaño de archivo?",
    faqA2: "No límites en la interfaz. El tamaño máximo admitido es de hasta 500MB de manera predeterminada para cargas rápidas de desarrollo.",
    faqQ3: "¿Qué es el modo Liquid Glass?",
    faqA3: "Un estilo visual avanzado inspirado en sistemas de última generación que superpone elementos traslúcidos con bordes refractantes para una inmersión completa."
  };
}

export default function SettingsPanel({ settings, onChangeSettings, t }: SettingsPanelProps) {
  const [langSearch, setLangSearch] = useState('');

  const isLiquid = settings.style === 'liquid-glass';
  const isDark = settings.theme === 'dark';

  const selectTheme = (theme: ThemeType) => {
    onChangeSettings({ ...settings, theme });
  };

  const selectStyle = (style: StyleType) => {
    onChangeSettings({ ...settings, style });
  };

  const selectAnimations = (animations: AnimationType) => {
    onChangeSettings({ ...settings, animations });
  };

  const selectCustomColor = (color: string) => {
    onChangeSettings({ ...settings, theme: 'custom', customColor: color });
  };

  const selectLanguage = (code: string) => {
    onChangeSettings({ ...settings, language: code });
  };

  const panelBg = isLiquid
    ? isDark
      ? 'bg-neutral-900/40 backdrop-blur-md border border-white/10 text-white'
      : 'bg-white/40 backdrop-blur-md border border-neutral-200 text-neutral-800'
    : isDark
    ? 'bg-neutral-900 border border-neutral-800 text-white'
    : 'bg-white border border-neutral-200 text-neutral-800';

  const optionBg = isDark ? 'bg-neutral-800/60 hover:bg-neutral-800' : 'bg-neutral-100 hover:bg-neutral-200/75';
  
  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  // Filter languages by search query
  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    lang.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const st = getSettingsPanelT(settings.language || 'es');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className={`p-6 md:p-8 rounded-3xl ${panelBg}`}>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Palette className="w-6 h-6" style={{ color: themeAccentColor }} />
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          {t.settingsDesc}
        </p>

        {/* --- LANGUAGE SECTION (Idiomas) --- */}
        <div className="space-y-4 mb-8 border-b border-neutral-200/10 pb-8">
          <h3 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
            <Globe className="w-4 h-4" /> {t.languageLabel}
          </h3>
          
          {/* Language Search */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border max-w-sm transition-all ${
            isDark 
              ? 'bg-neutral-800/60 border-neutral-700/80 focus-within:border-sky-500' 
              : 'bg-neutral-100 border-neutral-200 focus-within:border-sky-500 focus-within:bg-white'
          }`}>
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              id="language-search-input"
              type="text"
              placeholder={t.searchLanguagePlaceholder}
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              className="w-full bg-transparent text-xs outline-none text-neutral-800 dark:text-neutral-100"
            />
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
            {filteredLanguages.map((lang) => {
              const isSelected = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`settings-lang-${lang.code}`}
                  onClick={() => selectLanguage(lang.code)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-sky-500 bg-sky-500/10 text-sky-500'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{lang.flag}</span>
                    <span className="text-xs font-semibold truncate">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-sky-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- THEME SECTION --- */}
        <div className="space-y-4 mb-8 border-b border-neutral-200/10 pb-8">
          <h3 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
            <Sun className="w-4 h-4" /> {t.themeLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              id="settings-theme-light"
              onClick={() => selectTheme('light')}
              className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${optionBg} ${
                settings.theme === 'light' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.theme === 'light' ? '0 0 0 2px #00a3ff' : 'none' }}
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{t.themeLight}</div>
                <div className="text-xs text-neutral-500">{st.lightDesc}</div>
              </div>
            </button>

            <button
              id="settings-theme-dark"
              onClick={() => selectTheme('dark')}
              className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${optionBg} ${
                settings.theme === 'dark' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.theme === 'dark' ? '0 0 0 2px #00a3ff' : 'none' }}
            >
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{t.themeDark}</div>
                <div className="text-xs text-neutral-500">{st.darkDesc}</div>
              </div>
            </button>

            <button
              id="settings-theme-custom"
              onClick={() => selectTheme('custom')}
              className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${optionBg} ${
                settings.theme === 'custom' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.theme === 'custom' ? `0 0 0 2px ${themeAccentColor}` : 'none' }}
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10" style={{ color: themeAccentColor }}>
                <Palette className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{t.themeCustom}</div>
                <div className="text-xs text-neutral-500">{st.customDesc}</div>
              </div>
            </button>
          </div>

          {/* Color palette selector for Custom Theme */}
          {settings.theme === 'custom' && (
            <div className={`p-4 rounded-2xl space-y-3 ${isDark ? 'bg-neutral-900/60' : 'bg-neutral-50'}`}>
              <div className="text-xs font-semibold text-neutral-400">{t.customColorLabel}:</div>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => selectCustomColor(color)}
                    className="w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow border-2"
                    style={{
                      backgroundColor: color,
                      borderColor: settings.customColor === color ? '#ffffff' : 'transparent',
                    }}
                  />
                ))}

                {/* Custom Color Picker Input */}
                <div className="flex items-center gap-2 ml-2">
                  <div className="relative w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 overflow-hidden cursor-pointer">
                    <input
                      id="custom-color-picker"
                      type="color"
                      value={settings.customColor}
                      onChange={(e) => selectCustomColor(e.target.value)}
                      className="absolute inset-[-4px] w-[50px] h-[50px] cursor-pointer"
                    />
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{settings.customColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- STYLE SECTION (Liquid Glass vs Normal) --- */}
        <div className="space-y-4 mb-8 border-b border-neutral-200/10 pb-8">
          <h3 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
            <Layers className="w-4 h-4" /> {t.styleLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              id="settings-style-normal"
              onClick={() => selectStyle('normal')}
              className={`flex items-start gap-4 p-5 rounded-2xl text-left cursor-pointer transition-all ${optionBg} ${
                settings.style === 'normal' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.style === 'normal' ? `0 0 0 2px ${themeAccentColor}` : 'none' }}
            >
              <div className="p-3 rounded-xl bg-neutral-500/10 text-neutral-500 dark:text-neutral-400 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t.styleNormal}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {st.styleNormalDesc}
                </div>
              </div>
            </button>

            <button
              id="settings-style-glass"
              onClick={() => selectStyle('liquid-glass')}
              className={`flex items-start gap-4 p-5 rounded-2xl text-left cursor-pointer transition-all ${optionBg} ${
                settings.style === 'liquid-glass' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.style === 'liquid-glass' ? `0 0 0 2px ${themeAccentColor}` : 'none' }}
            >
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  {t.styleLiquidGlass}
                  <span className="text-[10px] bg-sky-500/25 text-sky-500 px-1.5 py-0.5 rounded-full font-bold">Premium</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {st.styleGlassDesc}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* --- ANIMATIONS SECTION --- */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> {t.animationsLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              id="settings-anim-activated"
              onClick={() => selectAnimations('activated')}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl cursor-pointer text-center transition-all ${optionBg} ${
                settings.animations === 'activated' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.animations === 'activated' ? `0 0 0 2px ${themeAccentColor}` : 'none' }}
            >
              <Zap className="w-6 h-6 text-sky-500 mb-2" />
              <div className="font-semibold text-sm">{t.animationsActivated}</div>
              <div className="text-[11px] text-neutral-500 mt-1">{st.animActivatedDesc}</div>
            </button>

            <button
              id="settings-anim-reduced"
              onClick={() => selectAnimations('reduced')}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl cursor-pointer text-center transition-all ${optionBg} ${
                settings.animations === 'reduced' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.animations === 'reduced' ? `0 0 0 2px ${themeAccentColor}` : 'none' }}
            >
              <Eye className="w-6 h-6 text-amber-500 mb-2" />
              <div className="font-semibold text-sm">{t.animationsReduced}</div>
              <div className="text-[11px] text-neutral-500 mt-1">{st.animReducedDesc}</div>
            </button>

            <button
              id="settings-anim-disabled"
              onClick={() => selectAnimations('disabled')}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl cursor-pointer text-center transition-all ${optionBg} ${
                settings.animations === 'disabled' ? 'ring-2' : ''
              }`}
              style={{ boxShadow: settings.animations === 'disabled' ? `0 0 0 2px ${themeAccentColor}` : 'none' }}
            >
              <Layers className="w-6 h-6 text-neutral-500 mb-2" />
              <div className="font-semibold text-sm">{t.animationsDisabled}</div>
              <div className="text-[11px] text-neutral-500 mt-1">{st.animDisabledDesc}</div>
            </button>
          </div>
        </div>
      </div>

      {/* FAQs Panel for modern context */}
      <div className={`p-6 rounded-3xl ${panelBg} text-xs space-y-3`}>
        <div className="flex items-center gap-2 font-semibold text-sm mb-1">
          <HelpCircle className="w-4 h-4 text-neutral-400" />
          {st.faqsTitle}
        </div>
        <div>
          <span className="font-semibold">{st.faqQ1}</span> {st.faqA1}
        </div>
        <div>
          <span className="font-semibold">{st.faqQ2}</span> {st.faqA2}
        </div>
        <div>
          <span className="font-semibold">{st.faqQ3}</span> {st.faqA3}
        </div>
      </div>
    </div>
  );
}
