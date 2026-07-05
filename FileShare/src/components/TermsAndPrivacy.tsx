import { useState } from 'react';
import { AppSettings } from '../types';
import { FileText, Shield, Scale, Info, CheckSquare } from 'lucide-react';

interface TermsAndPrivacyProps {
  settings: AppSettings;
}

export default function TermsAndPrivacy({ settings }: TermsAndPrivacyProps) {
  const [activeSubTab, setActiveSubTab] = useState<'terms' | 'privacy'>('terms');

  const isLiquid = settings.style === 'liquid-glass';
  const isDark = settings.theme === 'dark';

  const panelBg = isLiquid
    ? isDark
      ? 'bg-neutral-900/40 backdrop-blur-md border border-white/10 text-white'
      : 'bg-white/40 backdrop-blur-md border border-neutral-200 text-neutral-800'
    : isDark
    ? 'bg-neutral-900 border border-neutral-800 text-white'
    : 'bg-white border border-neutral-200 text-neutral-800';

  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  const lang = settings.language;
  const isEn = lang === 'en';
  const isPt = lang === 'pt';
  const isFr = lang === 'fr';
  const isDe = lang === 'de';
  const isIt = lang === 'it';
  const isJa = lang === 'ja';
  const isKo = lang === 'ko';
  const isZh = lang === 'zh';
  const isRu = lang === 'ru';

  const texts = {
    title: isEn ? 'Legal & Privacy' : isPt ? 'Legais e Privacidade' : isFr ? 'Légal & Confidentialité' : isDe ? 'Rechtliches & Datenschutz' : isIt ? 'Legale & Privacy' : isJa ? '法的情報とプライバシー' : isKo ? '법률 및 개인정보 보호' : isZh ? '法律与隐私' : isRu ? 'Юридическая информация и конфиденциальность' : 'Legales y Privacidad',
    lastUpdate: isEn ? 'Last update: July 3, 2026. FileShare legal compliance.' : isPt ? 'Última atualização: 3 de julho de 2026. Conformidade legal do FileShare.' : isFr ? 'Dernière mise à jour : 3 juillet 2026. Conformité légale de FileShare.' : isDe ? 'Letzte Aktualisierung: 3. Juli 2026. Rechtliche Konformität von FileShare.' : isIt ? 'Ultimo aggiornamento: 3 Luglio 2026. Conformità legale di FileShare.' : isJa ? '最終更新日：2026年7月3日。FileShareの法的準拠。' : isKo ? '최근 업데이트: 2026년 7월 3일. FileShare 법적 준수.' : isZh ? '最后更新：2026年7月3日。FileShare 法律合规性。' : isRu ? 'Последнее обновление: 3 июля 2026 г. Соответствие требованиям законодательства FileShare.' : 'Última actualización: 3 de Julio de 2026. Cumplimiento legal de FileShare.',
    tabTerms: isEn ? 'Terms of Use' : isPt ? 'Termos de Uso' : isFr ? 'Conditions d\'utilisation' : isDe ? 'Nutzungsbedingungen' : isIt ? 'Termini di Utilizzo' : isJa ? '利用規約' : isKo ? '이용 약관' : isZh ? '使用条款' : isRu ? 'Условия использования' : 'Términos de Uso',
    tabPrivacy: isEn ? 'Privacy Policy' : isPt ? 'Política de Privacidade' : isFr ? 'Politique de confidentialité' : isDe ? 'Datenschutzerklärung' : isIt ? 'Informativa sulla Privacy' : isJa ? 'プライバシーポリシー' : isKo ? '개인정보 처리방침' : isZh ? '隐私政策' : isRu ? 'Политика конфиденциальности' : 'Política de Privacidad',
    
    // Terms
    t1_title: isEn ? '1. Acceptance of Terms' : isPt ? '1. Aceitação dos Termos' : isFr ? '1. Acceptation des conditions' : isDe ? '1. Akzeptanz der Bedingungen' : isIt ? '1. Accettazione dei Termini' : isJa ? '1. 規約の同意' : isKo ? '1. 약관의 동의' : isZh ? '1. 接受条款' : isRu ? '1. Согласие с условиями' : '1. Aceptación de los Términos',
    t1_desc: isEn ? 'By accessing or using FileShare\'s file-sharing service, you unconditionally agree to be bound by these terms of use and all applicable laws in your jurisdiction.' : isPt ? 'Ao acessar ou utilizar o servicio de compartilhamento de arquivos do FileShare, você aceita incondicionalmente estar sujeito a estes termos de uso e a todas as leis aplicáveis em sua jurisdição.' : isFr ? 'En accédant au service de partage de fichiers de FileShare ou en l\'utilisant, vous acceptez sans réserve d\'être lié par ces conditions d\'utilisation et par toutes les lois applicables dans votre juridiction.' : isDe ? 'Durch den Zugriff auf oder die Nutzung des File-Sharing-Dienstes von FileShare erklären Sie sich bedingungslos damit einverstanden, an diese Nutzungsbedingungen und alle geltenden Gesetze in Ihrer Gerichtsbarkeit gebunden zu sein.' : isIt ? 'Accedendo o utilizando il servizio di condivisione file di FileShare, accetti incondizionatamente di essere vincolato da questi termini di utilizzo e da tutte le leggi applicabili nella tua giurisdizione.' : isJa ? 'FileShareのファイル共有サービスにアクセスまたは使用することにより、これらの利用規約および管轄区域のすべての適用法に無条件で拘束されることに同意したことになります。' : isKo ? 'FileShare의 파일 공유 서비스에 액세스하거나 이를 이용함으로써 귀하는 본 이용 약관 및 해당 관할권의 모든 적용 법률에 무조건 동의하게 됩니다.' : isZh ? '通过访问或使用 FileShare 的文件共享服务，即表示您无条件同意接受这些使用条款以及您所在司法管辖区所有适用法律 of 的约束。' : isRu ? 'Получая доступ к службе обмена файлами FileShare или используя ее, вы безоговорочно соглашаетесь соблюдать настоящие условия использования и все применимые законы вашей юрисдикции.' : 'Al acceder o utilizar el servicio de intercambio de archivos de FileShare, aceptas de manera incondicional estar sujeto a estos términos de uso y a todas las leyes aplicables en tu jurisdicción.',
    
    t2_title: isEn ? '2. Responsibility for Uploaded Content' : isPt ? '2. Responsabilidade sobre o Conteúdo Enviado' : isFr ? '2. Responsabilité du contenu téléversé' : isDe ? '2. Verantwortung für hochgeladene Inhalte' : isIt ? '2. Responsabilità per i Contenuti Caricati' : isJa ? '2. アップロードされたコンテンツの責任' : isKo ? '2. 업로드된 콘텐츠에 대한 책임' : isZh ? '2. 对上传内容的责任' : isRu ? '2. Ответственность за загруженный контент' : '2. Responsabilidad sobre el Contenido Subido',
    t2_desc1: isEn ? 'All files and metadata (including titles, covers, descriptions, and executable binaries) are the sole and exclusive responsibility of the user who uploads them.' : isPt ? 'Todos os arquivos e metadatos (incluindo títulos, capas, descrições e binários executáveis) são de responsabilidade única e exclusiva do usuário que realiza o envio.' : isFr ? 'Tous les fichiers et métadonnées (y compris les titres, les couvertures, les descriptions et les binaires exécutables) relèvent de la seule et unique responsabilité de l\'utilisateur qui effectue le téléversement.' : isDe ? 'Alle Dateien und Metadaten (einschließlich Titel, Cover, Beschreibungen und ausführbare Binärdateien) liegen in der alleinigen und ausschließlichen Verantwortung des Benutzers, der sie hochlädt.' : isIt ? 'Tutti i file e i metadati (inclusi titoli, copertine, descrizioni e binari eseguibili) sono di esclusiva responsabilità dell\'utente che effettua il caricamento.' : isJa ? 'すべてのファイルおよびメタデータ（タイトル、カバー、説明、実行可能バイナリを含む）は、アップロードしたユーザーの単独かつ排тического責任となります。' : isKo ? '모든 파일 및 메타데이터(제목, 커버 이미지, 설명, 실행 가능한 바이너리 파일 포함)는 업로드하는 사용자의 전적인 책임입니다.' : isZh ? '所有文件和元数据（包括标题、封面、描述和可执行二进制文件）完全由上传它们的用户承担。' : isRu ? 'Все файлы и метаданные (включая заголовки, обложки, описания и исполняемые двоичные файлы) находятся под единоличной и исключительной ответственностью загрузившего их пользователя.' : 'Todos los archivos y metadatos (incluidos títulos, portadas, descripciones y binarios ejecutables) son responsabilidad única y exclusiva del usuario que realiza la carga.',
    t2_desc2: isEn ? 'It is strictly forbidden to upload any files containing viruses, malware, trojans, ransomware, destructive hacking tools, copyrighted material without express authorization, or illegal content.' : isPt ? 'É estritamente proibido enviar arquivos contendo vírus, malware, trojans, ransomware, ferramentas de hacking destrutivas, material protegido por direitos autorais sem autorização expressa ou conteúdo ilegal.' : isFr ? 'Il est strictement interdit de téléverser des fichiers contenant des virus, des logiciels malveillants, des chevaux de Troie, des rançongiciels, des outils de piratage destructeurs, des documents protégés par le droit d\'auteur sans autorisation expresse ou tout contenu illégal.' : isDe ? 'Es ist strengstens verboten, Dateien hochzuladen, die Viren, Malware, Trojaner, Ransomware, destruktive Hacking-Tools, urheberrechtlich geschütztes Material ohne ausdrückliche Genehmigung oder illegale Inhalte enthalten.' : isIt ? 'È severamente vietato caricare file contenenti virus, malware, trojan, ransomware, strumenti di hacking distruttivi, materiale protetto da copyright senza espressa autorizzazione o contenuti illegali.' : isJa ? 'ウイルス、マルウェア、トロイの木馬、ランサムウェア、破壊的なハッキングツール、明示的な許可のない著作権で保護された素材、または違法なコンテンツを含むファイルのアップロードは厳重に禁止されています。' : isKo ? '바이러스, 악성코드, 트로이 목마, 랜섬웨어, 파괴적인 해킹 도구, 명시적인 권한이 없는 저작권 보호 자료 또는 불법 콘텐츠를 포함하는 파일을 업로드하는 것은 엄격히 금지됩니다.' : isZh ? '严禁上传任何含有病毒、恶意软件、木马、勒索软件、破坏性黑客工具、未经明确授权的受版权保护材料或非法内容的文件。' : isRu ? 'Строго запрещено загружать любые файлы, содержащие вирусы, вредоносное ПО, трояны, программы-вымогатели, разрушительные хакерские инструменты, материалы, защищенные авторским правом без явного разрешения, или незаконный контент.' : 'Queda estrictamente prohibido subir cualquier archivo que contenga virus, malware, troyanos, ransomware, herramientas de hacking destructivas, material protegido por derechos de autor sin autorización expresa, o contenido de carácter ilegal.',
    
    t3_title: isEn ? '3. Scanning and Moderation System' : isPt ? '3. Sistema de Varredura e Moderação' : isFr ? '3. Système d\'analyse et de modération' : isDe ? '3. Scan- und Moderationssystem' : isIt ? '3. Sistema di Scansione e Moderazione' : isJa ? '3. スキャンおよびモデレーションシステム' : isKo ? '3. 스캔 및 모더레이션 시스템' : isZh ? '3. 扫描与审核系统' : isRu ? '3. Система сканирования и модерации' : '3. Sistema de Escaneo y Moderación',
    t3_desc: isEn ? 'FileShare implements an automated ClamAV-based virus scanner to safeguard community safety. However, this scanner does not replace the use of your own antivirus. The FileShare team reserves the right to permanently remove any content with active reports or flagging filters without prior notice.' : isPt ? 'O FileShare implementa um motor de varredura automatizada baseado no ClamAV para proteger a segurança da comunidade. No entanto, tal análise heurística não substitui o uso de antivírus próprios. A equipe do FileShare reserva-se o direito de remover permanentemente qualquer conteúdo que acumule denúncias ou ative filtros de vírus sem aviso prévio.' : isFr ? 'FileShare implémente un moteur d\'analyse automatisé basé sur ClamAV pour préserver la sécurité de la communauté. Cependant, cette analyse heuristique ne remplace pas l\'utilisation de vos propres antivirus. L\'équipe de FileShare se réserve le droit de retirer définitivement tout contenu accumulant des signalements ou activant des filtres de virus, sans préavis.' : isDe ? 'FileShare implementiert einen automatisierten Virenscanner auf ClamAV-Basis, um die Sicherheit der Community zu gewährleisten. Diese heuristische Analyse ersetzt jedoch nicht die Verwendung eigener Antivirenprogramme. Das FileShare-Team behält sich das Recht vor, Inhalte mit aktiven Meldungen oder Kennzeichnungsfiltern ohne vorherige Ankündigung dauerhaft zu entfernen.' : isIt ? 'FileShare implementa un motore di scansione automatizzato basato su ClamAV para salvaguardare la sicurezza della comunità. Tuttavia, tale analisi euristica non sostituisce l\'uso di propri antivirus. Il team di FileShare si riserva il diritto di rimuovere in modo permanente qualsiasi contenuto che accumuli segnalazioni o attivi i filtri antivirus senza preavviso.' : isJa ? 'FileShareはコミュニティの安全を守るため、自動化されたClamAVベースのウイルススキャナーを実装しています。ただし、このスキャンはあなた自身のウイルス対策ソフトの代わりにはなりません。FileShareチームは、事前の通知なしに通報が蓄積されたコンテンツやフィルタで検知されたコンテンツを完全に削除する権利を留保します。' : isKo ? 'FileShare는 커뮤니티의 안전을 지키기 위해 ClamAV 기반의 자동 백신 스캔 엔진을 운영하고 있습니다. 그러나 이 휴리스틱 분석이 귀하의 백신 프로그램 사용을 대체할 수는 없습니다. FileShare 팀은 신고가 누적되거나 바이러스 필터가 작동하는 모든 콘텐츠를 사전 예고 없이 영구 삭제할 수 있는 권리를 보유합니다.' : isZh ? 'FileShare 实施了基于 ClamAV 的自动化病毒扫描，以维护社区安全。然而，此启发式分析并不能代替您使用自己的杀毒软件。FileShare 团队保留在不事先通知的情况下，永久删除任何累积举报或激活病毒过滤器的内容的权利。' : isRu ? 'FileShare внедряет автоматический сканер вирусов на базе ClamAV для обеспечения безопасности сообщества. Однако данный эвристический анализ не заменяет использование ваших собственных антивирусов. Команда FileShare оставляет за собой право навсегда удалять любой контент с активными жалобами или фильтрами вирусов без предварительного уведомления.' : 'FileShare implementa un motor de escaneo de firmas automatizado basado en ClamAV para salvaguardar la seguridad de la comunidad. No obstante, dicho análisis heurístico no reemplaza el uso de antivirus propios. El equipo de FileShare se reserva el derecho de retirar permanentemente cualquier contenido que acumule denuncias o active los filtros de virus sin necesidad de notificación previa.',
    
    t4_title: isEn ? '4. Limitation of Liability' : isPt ? '4. Limitação de Responsabilidade' : isFr ? '4. Limitation de responsabilité' : isDe ? '4. Haftungsbeschränkung' : isIt ? '4. Limitazione di Responsabilità' : isJa ? '4. 免責事項' : isKo ? '4. 책임의 한계' : isZh ? '4. 责任限制' : isRu ? '4. Ограничение ответственности' : '4. Limitación de Responsabilidad',
    t4_desc: isEn ? 'FileShare is provided "as is" and "as available" without warranties of any kind regarding continuous availability, absolute file integrity, or absence of third-party harmful uploads. You download and run files at your own risk.' : isPt ? 'O serviço do FileShare é oferecido "como está" ("as is"), sem garantias de qualquer tipo sobre disponibilidade contínua, integridade absoluta dos arquivos ou ausência de software prejudicial enviado por terceiros. Você baixa e executa os arquivos por sua conta e risco.' : isFr ? 'Le service de FileShare est fourni « tel quel » (« as is »), sans aucune garantie quant à la disponibilité continue, l\'intégrité absolue des fichiers ou l\'absence de logiciels malveillants téléversés par des tiers. Vous téléchargez et exécutez les fichiers à vos propres risques.' : isDe ? 'Der Dienst von FileShare wird ohne Mängelgewähr („as is“) angeboten, ohne jegliche Gewährleistung hinsichtlich der kontinuierlichen Verfügbarkeit, der absoluten Integrität der Dateien oder des Fehlens von schädlicher Software, die von Dritten hochgeladen wurde. Das Herunterladen und Ausführen von Dateien erfolgt auf eigene Gefahr.' : isIt ? 'Il servicio di FileShare viene offerto "così com\'è" ("as is"), senza garanzie di alcun tipo in merito alla disponibilità continua, all\'integrità assoluta dei file o all\'assenza di software dannoso caricato da terzi. Scarichi ed esegui i file a tuo rischio e pericolo.' : isJa ? 'FileShareのサービスは「現状有姿」（as is）で提供され、継続的な可用性、ファイルの完全性、または第三者による有害なアップロードの不在に関する一切の保証はありません。ファイルのダウンロードおよび実行はご自身の責任で行ってください。' : isKo ? 'FileShare 서비스는 상시 접속 가능성, 파일의 절대적 무결성, 제3자가 업로드한 유해 소프트웨어의 부존재 등에 대해 어떠한 종류의 보증도 없이 "있는 그대로(as is)" 제공됩니다. 귀하의 책임 하에 파일을 다운로드하고 실행하십시오.' : isZh ? 'FileShare 服务按“现状”（“as is”）提供，不提供关于持续可用性、文件绝对完整性或不含第三方上传的有害软件的任何保证。您下载并运行文件的风险由您自行承担。' : isRu ? 'Услуги FileShare предоставляются на условиях «как есть» («as is»), без каких-либо гарантий относительно непрерывной доступности, абсолютной целостности файлов или отсутствия вредоносного ПО, загруженного третьими лицами. Вы скачиваете и запускаете файлы на свой страх и риск.' : 'El servicio de FileShare se ofrece "tal cual es" ("as is"), sin garantías de ningún tipo respecto a la disponibilidad continua, la integridad absoluta de los archivos o la ausencia de software dañino subido por terceros. Descargas y ejecutas archivos bajo tu propio riesgo.',

    // Privacy
    p1_title: isEn ? '1. Collection of Data Without Accounts' : isPt ? '1. Coleta de Dados Sem Conta' : isFr ? '1. Collecte de données sans compte' : isDe ? '1. Datenerhebung ohne Konto' : isIt ? '1. Raccolta Dati Senza Account' : isJa ? '1. アカウントなしでのデータ収集' : isKo ? '1. 계정 없는 데이터 수집' : isZh ? '1. 无账户数据收集' : isRu ? '1. Сбор данных без учетных записей' : '1. Recopilación de Datos Sin Cuenta',
    p1_desc: isEn ? 'FileShare is designed with privacy by default. No user account creation, login credentials, or email collection is required.' : isPt ? 'O FileShare foi projetado para operar com privacidade por padrão. Não é necessária a criação de conta de usuário, credenciais de login ou coleta de e-mails.' : isFr ? 'FileShare est conçu pour fonctionner avec la confidentialité par défaut. Aucune création de compte d\'utilisateur, identifiant de connexion ou collecte d\'e-mails n\'est requise.' : isDe ? 'FileShare ist standardmäßig auf Datenschutz ausgelegt. Es ist keine Erstellung eines Benutzerkontos, Anmeldeinformationen oder die Erfassung von E-Mail-Adressen erforderlich.' : isIt ? 'FileShare è progettato con privacy di default. Non è richiesta la creazione di un account utente, credenziali di accesso o raccolta di e-mail.' : isJa ? 'FileShareはデフォルトでプライバシーを重視した設計になっています。ユーザーアカウントの作成、ログイン資格情報、またはメールアドレスの収集は必要ありません。' : isKo ? 'FileShare는 기본적으로 개인정보 보호를 지향하도록 설계되었습니다. 사용자 계정 생성, 로그인 자격 증명 또는 이메일 수집을 요구하지 않습니다.' : isZh ? 'FileShare 默认采用隐私保护设计。无需创建用户帐户、登录凭据，也不收集电子邮件。' : isRu ? 'FileShare по умолчанию разработан с учетом конфиденциальности. Не требуется создавать учетную запись пользователя, вводить учетные данные или собирать адреса электронной почты.' : 'FileShare está diseñado para operar con privacidad por defecto. No se requiere la creación de una cuenta de usuario, credenciales de inicio de sesión o recopilación de correos electrónicos.',
    
    p2_title: isEn ? '2. Local Storage of Preferences (LocalStorage)' : isPt ? '2. Armazenamento Local de Preferências (LocalStorage)' : isFr ? '2. Stockage local des préférences (LocalStorage)' : isDe ? '2. Lokale Speicherung von Einstellungen (LocalStorage)' : isIt ? '2. Memorizzazione Locale delle Preferenze (LocalStorage)' : isJa ? '2. 設定のローカルストレージ（LocalStorage）' : isKo ? '2. 환경 설정의 로컬 저장 (LocalStorage)' : isZh ? '2. 首选项的本地存储 (LocalStorage)' : isRu ? '2. Локальное хранение настроек (LocalStorage)' : '2. Almacenamiento Local de Preferencias (LocalStorage)',
    p2_desc: isEn ? 'Visual preferences such as color theme selection, premium styles (Liquid Glass), acceptance of initial terms, and animations are saved exclusively in your browser\'s storage (localStorage) without transmission to external databases.' : isPt ? 'As configurações visuais, como a seleção de temas de cores, estilos premium (Liquid Glass), o histórico de aceitação dos termos iniciais e as animações, são salvas exclusivamente no armazenamento do seu navegador (localStorage), sem serem transmitidas para bancos de dados externos.' : isFr ? 'Les configurations visuelles telles que la sélection des thèmes de couleur, les styles premium (Liquid Glass), l\'historique d\'acceptation des conditions initiales et les animations sont enregistrées exclusivement dans le stockage de votre navigateur (localStorage), sans être transmises à des bases de données externes.' : isDe ? 'Visuelle Einstellungen wie die Auswahl von Farbthemen, Premium-Styles (Liquid Glass), der Verlauf der Akzeptanz der anfänglichen Bedingungen und Animationen werden ausschließlich im Speicher Ihres Browsers (localStorage) gespeichert, ohne an externe Datenbanken übertragen zu werden.' : isIt ? 'Le preferenze visive come la selezione del tema di colore, gli stili premium (Liquid Glass), l\'accettazione dei termini iniziali e le animazioni sono memorizzate esclusivamente nella memoria del tuo browser (localStorage), senza trasmissione a database esterni.' : isJa ? 'カラーテーマの選択、プレミアムスタイル（Liquid Glass）、初期規約の同意履歴、アニメーションなどの視覚的な設定は、外部のデータベースに送信されることなく、ブラウザのストレージ（localStorage）にのみ保存されます。' : isKo ? '색상 테마 선택, 프리미엄 스타일(Liquid Glass), 초기 이용 약관 동의 이력 및 애니메이션 등의 시각적 환경 설정은 외부 데이터베이스로 전송되지 않고 브라우저 저장소(localStorage)에만 저장됩니다.' : isZh ? '颜色主题选择、高级视觉效果（流体玻璃）、接受初始条款的历史记录以及动画效果等视觉首选项均保存在您的浏览器本地存储 (localStorage) 中，绝不会传输到外部数据库。' : isRu ? 'Визуальные настройки, такие как выбор цветовой темы, премиум-стили (Liquid Glass), принятие первоначальных условий и анимации, сохраняются исключительно в хранилище вашего браузера (localStorage) без передачи во внешние базы данных.' : 'Las configuraciones visuales como la selección de temas de color, modos de estilo premium (Liquid Glass), el historial de aceptación del aviso inicial de responsabilidad y las animaciones se guardan exclusivamente en el almacenamiento de tu navegador (localStorage), sin transmitirse a bases de datos corporativas externas.',
    
    p3_title: isEn ? '3. File Metadata and Auditing' : isPt ? '3. Metadados de Arquivos e Auditoria' : isFr ? '3. Métadonnées des fichiers et audit' : isDe ? '3. Dateimetadaten und Prüfung' : isIt ? '3. Metadati dei File e Audit' : isJa ? '3. ファイルのメタデータと監査' : isKo ? '3. 파일 메타데이터 및 감사' : isZh ? '3. 文件元数据与审计' : isRu ? '3. Метаданные файлов и аудит' : '3. Metadatos de Archivos y Auditoria',
    p3_desc: isEn ? 'When you upload a file, we store the binary for download purposes, along with fields you enter (name, description, optional cover), size, and upload date. We also aggregate view and download counts to classify and rank files.' : isPt ? 'Quando você envia um arquivo, nós armazenamos o binário para possibilitar downloads, juntamente com os campos inseridos (nome, descrição, capa opcional), tamanho e data de envio. Também registramos contagens agregadas de visualizações e downloads para classificar os arquivos.' : isFr ? 'Lorsque vous téléversez un fichier, nous stockons le binaire à des fins de téléchargement, ainsi que les champs que vous saisissez (nom, description, couverture facultative), sa taille et sa date de téléversement. Nous agrégons également les statistiques de vues et de téléchargements pour classer le catalogue.' : isDe ? 'Wenn Sie eine Datei hochladen, speichern wir die Binärdatei für Download-Zwecke, zusammen mit den von Ihnen eingegebenen Feldern (Name, Beschreibung, optionales Cover), der Größe und dem Upload-Datum. Wir erfassen auch aggregierte Aufruf- und Downloadzahlen, um den Katalog zu sortieren.' : isIt ? 'Quando carichi un file, memorizziamo il binario per consentire i download, insieme ai campi che inserisci (Nome, descrizione, copertina opzionale), alle dimensioni e alla data di caricamento. Inoltre, registriamo le statistiche aggregate di visualizzazioni e download per ordinare il catalogo.' : isJa ? 'ファイルをアップロードすると、ダウンロード目的でバイナリを保存するほか、入力されたフィールド（名前、説明、オプションのカバー画像）、サイズ、アップロード日が保存されます。また、カタログを分類してランク付けするために、閲覧数やダウンロード数の集計も記録します。' : isKo ? '파일을 업로드하면 다운로드 서비스를 위해 파일 자체와 함께 입력한 필드(이름, 설명, 선택적 커버 이미지), 크기 및 업로드 날짜를 저장합니다. 아울러 목록을 정렬하기 위해 누적 조회수 및 다운로드수 통계를 기록합니다.' : isZh ? '当您上传文件时，我们存储二进制文件以供下载，以及您输入的字段（名称、描述、可选封面）、大小和上传日期。我们还会统计汇总浏览量和下载量，以对目录进行分类和排序。' : isRu ? 'Когда вы загружаете файл, мы сохраняем его двоичные данные, чтобы сделать возможным его скачивание, а также введенные вами поля (имя, описание, необязательную обложку), размер и дату загрузки. Мы также собираем сводную статистику просмотров и загрузок для ранжирования файлов.' : 'Cuando subes un archivo, guardamos el binario para posibilitar descargas, junto con los campos que ingresas (Nombre, descripción, portada opcional), tamaño y fecha de carga. Adicionalmente, registramos estadísticas de vistas y descargas agregadas para clasificar y ordenar el catálogo.',
    
    p4_title: isEn ? '4. Cookies & Third Parties' : isPt ? '4. Cookies e Terceiros' : isFr ? '4. Cookies & Tiers' : isDe ? '4. Cookies & Drittanbieter' : isIt ? '4. Cookie e Terze Parti' : isJa ? '4. クッキーとサードパーティ' : isKo ? '4. 쿠키 및 제3자' : isZh ? '4. Cookies 与第三方' : isRu ? '4. Файлы cookie и третьи стороны' : '4. Cookies y Terceros',
    p4_desc: isEn ? 'FileShare does not use commercial tracking cookies or integrate intrusive advertising scripts that track your browsing habits across different domains.' : isPt ? 'O FileShare não utiliza cookies de rastreamento comercial nem integra scripts publicitários invasivos de terceiros para rastrear seus hábitos de navegação.' : isFr ? 'FileShare n\'utilise pas de cookies de suivi commercial et n\'intègre pas de scripts publicitaires intrusifs de tiers qui suivraient vos habitudes de navigation.' : isDe ? 'FileShare verwendet keine kommerziellen Tracking-Cookies oder aufdringliche Werbeskripte von Drittanbietern, um Ihre Surfgewohnheiten zu verfolgen.' : isIt ? 'FileShare non utilizza cookie di tracciamento commerciale né integra script pubblicitari invasivi di terze parti per tracciare le tue abitudini di navigazione.' : isJa ? 'FileShareは、商業的な追跡クッキーを使用せず、ドメイン外での閲覧習慣を追跡するサードパーティの侵入型広告スクリプトも統合していません。' : isKo ? 'FileShare는 상업적 추적 쿠키를 사용하지 않으며 다른 도메인에서 귀하의 브라우징 활동을 추적하는 침해적인 제3자 광고 스크립트를 통합하지 않습니다.' : isZh ? 'FileShare 不使用商业跟踪 Cookies，也不集成会跨网域跟踪您浏览习惯的第三方侵入式广告脚本。' : isRu ? 'Файлы cookie и сторонние ресурсы для отслеживания ваших действий в сети.' : 'FileShare no utiliza cookies de rastreo comercial ni integra scripts publicitarios intrusivos de terceros que rastreen tus hábitos de navegación fuera del dominio.'
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl ${panelBg} w-full max-w-4xl mx-auto space-y-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <Scale className="w-6 h-6" style={{ color: themeAccentColor }} />
            {texts.title}
          </h2>
          <p className="text-xs text-neutral-500">
            {texts.lastUpdate}
          </p>
        </div>

        {/* Inner Navigation Tabs */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto shrink-0">
          <button
            id="subtab-terms-btn"
            onClick={() => setActiveSubTab('terms')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSubTab === 'terms' 
                ? 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-800 dark:text-white font-bold' 
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            {texts.tabTerms}
          </button>
          <button
            id="subtab-privacy-btn"
            onClick={() => setActiveSubTab('privacy')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSubTab === 'privacy' 
                ? 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-800 dark:text-white font-bold' 
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            {texts.tabPrivacy}
          </button>
        </div>
      </div>

      {/* TERMS CONTENT */}
      {activeSubTab === 'terms' && (
        <div className="space-y-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <Info className="w-4 h-4 text-sky-500" />
              {texts.t1_title}
            </h3>
            <p>
              {texts.t1_desc}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <Shield className="w-4 h-4 text-sky-500" />
              {texts.t2_title}
            </h3>
            <p>
              {texts.t2_desc1}
            </p>
            <p className="font-semibold text-red-500">
              {texts.t2_desc2}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <FileText className="w-4 h-4 text-sky-500" />
              {texts.t3_title}
            </h3>
            <p>
              {texts.t3_desc}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <CheckSquare className="w-4 h-4 text-sky-500" />
              {texts.t4_title}
            </h3>
            <p>
              {texts.t4_desc}
            </p>
          </section>
        </div>
      )}

      {/* PRIVACY CONTENT */}
      {activeSubTab === 'privacy' && (
        <div className="space-y-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <Shield className="w-4 h-4 text-sky-500" />
              {texts.p1_title}
            </h3>
            <p>
              {texts.p1_desc}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <FileText className="w-4 h-4 text-sky-500" />
              {texts.p2_title}
            </h3>
            <p>
              {texts.p2_desc}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <Scale className="w-4 h-4 text-sky-500" />
              {texts.p3_title}
            </h3>
            <p>
              {texts.p3_desc}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 text-base">
              <Info className="w-4 h-4 text-sky-500" />
              {texts.p4_title}
            </h3>
            <p>
              {texts.p4_desc}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
