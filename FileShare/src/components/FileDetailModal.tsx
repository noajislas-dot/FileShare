import React, { useState } from 'react';
import { 
  FileMetadata, AppSettings, Comment 
} from '../types';
import { 
  X, Download, Share2, AlertTriangle, ShieldCheck, ShieldAlert, Calendar, Eye, FileText, 
  ChevronDown, ChevronUp, Terminal, Flag, Send, Check, Star, RefreshCw, MessageSquare, History, QrCode
} from 'lucide-react';
import { formatBytes, getFileTypeIcon } from './FileCard';
import { TranslationSchema } from '../lib/translations';

interface FileDetailModalProps {
  file: FileMetadata;
  settings: AppSettings;
  onClose: () => void;
  onRefreshTrigger: () => void;
  t: TranslationSchema;
  addNotification?: (title: string, message: string, type: 'upload_start' | 'upload_progress' | 'upload_success' | 'upload_error' | 'download_start' | 'reported' | 'scanned' | 'deleted' | 'info') => void;
  addActivity?: (action: string, details: string) => void;
}

const getReportReasons = (lang: string) => {
  if (lang === 'en') {
    return [
      'Virus or malware',
      'Fake file',
      'Corrupted file',
      'Illegal content',
      'Adult content',
      'Spam',
      'Phishing',
      'Copyright violation',
      'Other reason'
    ];
  }
  if (lang === 'pt') {
    return [
      'Vírus ou malware',
      'Arquivo falso',
      'Arquivo corrompido',
      'Conteúdo ilegal',
      'Conteúdo adulto',
      'Spam',
      'Phishing',
      'Direitos autorais (Copyright)',
      'Outro motivo'
    ];
  }
  if (lang === 'fr') {
    return [
      'Virus ou malware',
      'Faux fichier',
      'Fichier corrompu',
      'Contenu illégal',
      'Contenu pour adultes',
      'Spam',
      'Hameçonnage (Phishing)',
      'Droits d\'auteur (Copyright)',
      'Autre motif'
    ];
  }
  if (lang === 'de') {
    return [
      'Virus oder Malware',
      'Gefälschte Datei',
      'Beschädigte Datei',
      'Illegaler Inhalt',
      'Inhalte für Erwachsene',
      'Spam',
      'Phishing',
      'Urheberrechtsverletzung',
      'Anderer Grund'
    ];
  }
  if (lang === 'it') {
    return [
      'Virus o malware',
      'File falso',
      'File danneggiato',
      'Contenuto illegale',
      'Contenuto per adulti',
      'Spam',
      'Phishing',
      'Violazione del copyright',
      'Altro motivo'
    ];
  }
  if (lang === 'ja') {
    return [
      'ウイルスまたはマルウェア',
      '偽装ファイル',
      '破損したファイル',
      '違法なコンテンツ',
      '成人向けコンテンツ',
      'スパム',
      'フィッシング',
      '著作権侵害',
      'その他の理由'
    ];
  }
  if (lang === 'ko') {
    return [
      '바이러스 또는 악성코드',
      '가짜 파일',
      '손상된 파일',
      '불법 콘텐츠',
      '성인용 콘텐츠',
      '스팸',
      '피싱',
      '저작권 침해',
      '기타 이유'
    ];
  }
  if (lang === 'zh') {
    return [
      '病毒或恶意软件',
      '虚假文件',
      '损坏的文件',
      '非法内容',
      '成人内容',
      '垃圾邮件',
      '网络钓鱼',
      '侵犯版权',
      '其他原因'
    ];
  }
  if (lang === 'ru') {
    return [
      'Вирус или вредоносное ПО',
      'Поддельный файл',
      'Поврежденный файл',
      'Незаконный контент',
      'Контент для взрослых',
      'Спам',
      'Фисинг',
      'Нарушение авторских прав',
      'Другая причина'
    ];
  }
  return [
    'Virus o malware',
    'Archivo falso',
    'Archivo corrupto',
    'Contenido ilegal',
    'Contenido para adultos',
    'Spam',
    'Phishing',
    'Derechos de autor (Copyright)',
    'Otro motivo'
  ];
};

const getDetailT = (lang: string) => {
  const isEs = lang === 'es';
  const isPt = lang === 'pt';
  const isFr = lang === 'fr';
  const isDe = lang === 'de';
  const isIt = lang === 'it';
  const isJa = lang === 'ja';
  const isKo = lang === 'ko';
  const isZh = lang === 'zh';
  const isRu = lang === 'ru';

  return {
    uploadedBy: isPt ? 'Enviado por:' : isFr ? 'Téléchargé par :' : isDe ? 'Hochgeladen von:' : isIt ? 'Caricato da:' : isJa ? 'アップロード元:' : isKo ? '업로드한 사용자:' : isZh ? '上传者:' : isRu ? 'Загружено:' : isEs ? 'Subido por:' : 'Uploaded by:',
    generateQr: isPt ? 'Gerar código QR' : isFr ? 'Générer un code QR' : isDe ? 'QR-Code generieren' : isIt ? 'Genera codice QR' : isJa ? 'QRコードを生成' : isKo ? 'QR 코드 생성' : isZh ? '生成二维码' : isRu ? 'Создать QR-код' : isEs ? 'Generar código QR' : 'Generate QR Code',
    projectRating: isPt ? 'Avaliação do Projeto' : isFr ? 'Évaluation du projet' : isDe ? 'Projektbewertung' : isIt ? 'Valutazione del progetto' : isJa ? 'プロジェクトの評価' : isKo ? '프로젝트 평가' : isZh ? '项目评分' : isRu ? 'Рейтинг проекта' : isEs ? 'Calificación del Proyecto' : 'Project Rating',
    ratingDesc: isPt ? 'Ajude outros usuários votando na qualidade deste arquivo.' : isFr ? 'Aidez d\'autres utilisateurs en votant sur la qualité de ce fichier.' : isDe ? 'Helfen Sie anderen Benutzern, indem Sie über die Qualität dieser Datei abstimmen.' : isIt ? 'Aiuta altri utenti votando sulla qualità di questo file.' : isJa ? 'このファイルの品質に投票して、他のユーザーを助けましょう。' : isKo ? '이 파일의 품질에 투표하여 다른 사용자를 도우십시오.' : isZh ? '通过对该文件质量进行投票来帮助其他用户。' : isRu ? 'Помогите другим пользователям, проголосовав за качество этого файла.' : isEs ? 'Ayuda a otros usuarios votando sobre la calidad de este archivo.' : 'Help other users by voting on the quality of this file.',
    yourRating: isPt ? 'Sua avaliação' : isFr ? 'Votre évaluation' : isDe ? 'Ihre Bewertung' : isIt ? 'La tua valutazione' : isJa ? 'あなたの評価' : isKo ? '내 평가' : isZh ? '您的评分' : isRu ? 'Ваша оценка' : isEs ? 'Tu calificación' : 'Your Rating',
    size: isPt ? 'Tamanho' : isFr ? 'Taille' : isDe ? 'Größe' : isIt ? 'Dimensione' : isJa ? 'サイズ' : isKo ? '크기' : isZh ? '大小' : isRu ? 'Размер' : isEs ? 'Tamaño' : 'Size',
    views: isPt ? 'Visualizações' : isFr ? 'Vues' : isDe ? 'Aufrufe' : isIt ? 'Visualizzazioni' : isJa ? '表示回数' : isKo ? '조회수' : isZh ? '浏览量' : isRu ? 'Просмотры' : isEs ? 'Vistas' : 'Views',
    downloads: isPt ? 'Downloads' : isFr ? 'Téléchargements' : isDe ? 'Downloads' : isIt ? 'Download' : isJa ? 'ダウンロード数' : isKo ? '다운로드수' : isZh ? '下载量' : isRu ? 'Загрузки' : isEs ? 'Descargas' : 'Downloads',
    reports: isPt ? 'Denúncias' : isFr ? 'Signalements' : isDe ? 'Meldungen' : isIt ? 'Segnalazioni' : isJa ? '通報数' : isKo ? '신고수' : isZh ? '举报数' : isRu ? 'Жалобы' : isEs ? 'Reportes' : 'Reports',
    tags: isPt ? 'Tags' : isFr ? 'Étiquettes' : isDe ? 'Tags' : isIt ? 'Tag' : isJa ? 'タグ' : isKo ? '태그' : isZh ? '标签' : isRu ? 'Теги' : isEs ? 'Etiquetas' : 'Tags',
    fileDescription: isPt ? 'Descrição do arquivo' : isFr ? 'Description du fichier' : isDe ? 'Dateibeschreibung' : isIt ? 'Descrizione del file' : isJa ? 'ファイルの説明' : isKo ? '파일 설명' : isZh ? '文件描述' : isRu ? 'Описание файла' : isEs ? 'Descripción del archivo' : 'File Description',
    noDescription: isPt ? 'Nenhuma descrição detalhada fornecida.' : isFr ? 'Aucune description détaillée fournie.' : isDe ? 'Keine detaillierte Beschreibung angegeben.' : isIt ? 'Nessuna descrizione dettagliata fornita.' : isJa ? '詳細な説明はありません。' : isKo ? '상세 설명이 제공되지 않았습니다.' : isZh ? '未提供详细描述。' : isRu ? 'Подробное описание не предоставлено.' : isEs ? 'El cargador no ha ingresado descripción detallada para este archivo.' : 'No detailed description provided by the uploader.',
    originalName: isPt ? 'Nome original:' : isFr ? 'Nom d\'origine :' : isDe ? 'Originalname:' : isIt ? 'Nome originale:' : isJa ? '元のファイル名:' : isKo ? '원본 파일명:' : isZh ? '原始名称:' : isRu ? 'Оригинальное имя:' : isEs ? 'Nombre original:' : 'Original name:',
    uploadDate: isPt ? 'Data de envio:' : isFr ? 'Date de téléchargement :' : isDe ? 'Hochgeladedatum:' : isIt ? 'Data di caricamento:' : isJa ? 'アップロード日:' : isKo ? '업로드 날짜:' : isZh ? '上传日期:' : isRu ? 'Дата загрузки:' : isEs ? 'Fecha de subida:' : 'Upload date:',
    formatCategory: isPt ? 'Categoria do formato:' : isFr ? 'Catégorie de format :' : isDe ? 'Formatkategorie:' : isIt ? 'Categoria formato:' : isJa ? 'フォーマットカテゴリ:' : isKo ? '형식 카테고리:' : isZh ? '格式类别:' : isRu ? 'Категория формата:' : isEs ? 'Categoría de formato:' : 'Format category:',
    statusSafe: isPt ? 'Status: Seguro e Escaneado' : isFr ? 'Statut : Sûr et vérifié' : isDe ? 'Status: Sicher & Überprüft' : isIt ? 'Stato: Sicuro e verificato' : isJa ? 'ステータス: 安全・スキャン済み' : isKo ? '상태: 안전 및 검사 완료' : isZh ? '状态：安全并已扫描' : isRu ? 'Статус: Безопасно и проверено' : isEs ? 'Estado: Seguro y Escaneado' : 'Status: Safe & Scanned',
    statusPending: isPt ? 'Status: Análise Pendente' : isFr ? 'Statut : Analyse en attente' : isDe ? 'Status: Ausstehender Scan' : isIt ? 'Stato: Scansione in sospeso' : isJa ? 'ステータス: スキャン待機中' : isKo ? '상태: 검사 대기 중' : isZh ? '状态：等待扫描' : isRu ? 'Статус: Ожидает проверки' : isEs ? 'Estado: Pendiente de Escaneo' : 'Status: Pending Scan',
    statusThreat: isPt ? 'Status: Ameaça Detectada!' : isFr ? 'Statut : Menace détectée !' : isDe ? 'Status: Bedrohung erkannt!' : isIt ? 'Stato: Minaccia rilevata!' : isJa ? 'ステータス: 脅威を検出！' : isKo ? '상태: 위협 감지됨!' : isZh ? '状态：检测到威胁！' : isRu ? 'Статус: Обнаружена угроза!' : isEs ? 'Estado: ¡Amenaza Detectada!' : 'Status: Threat Detected!',
    safeDesc: isPt ? 'Nosso scanner de antivírus ClamAV concluiu uma verificação de assinatura de malware e integridade de código. Arquivo verificado.' : isFr ? 'Notre scanner antivirus ClamAV a effectué une recherche de signatures de logiciels malveillants et un contrôle d\'intégrité du code. Fichier vérifié.' : isDe ? 'Unser ClamAV-Antivirenscanner hat eine Überprüfung auf Malware-Signaturen und Code-Integrität durchgeführt. Datei verifiziert.' : isIt ? 'Il nostro scanner antivirus ClamAV ha completato un controllo delle firme dei malware e dell\'integrità del codice. File verificato.' : isJa ? 'ClamAVアンチウイルススキャナーがマルウェアシグネチャとコード整合性のチェックを完了しました。ファイルは検証済みです。' : isKo ? 'ClamAV 백신 스캐너가 악성코드 서명 및 코드 무결성 검사를 완료했습니다. 확인된 파일입니다.' : isZh ? '我们的 ClamAV 病毒扫描程序已完成恶意软件特征码和代码完整性检查。文件已验证。' : isRu ? 'Наш антивирусный сканер ClamAV завершил проверку сигнатур вредоносного ПО и целостности кода. Файл проверен.' : isEs ? 'Nuestro escáner antivirus ClamAV completó un escaneo de firmas de malware e integridad de código. Archivo verificado.' : 'Our ClamAV antivirus scanner completed a malware signature and code integrity check. File verified.',
    pendingDesc: isPt ? 'O arquivo está na fila de revisão heurística do sistema. Tenha cuidado ao executá-lo.' : isFr ? 'Le fichier est dans la file d\'attente pour l\'examen heuristique du système. Soyez prudent lors de son exécution.' : isDe ? 'Die Datei befindet sich in der Warteschlange für die heuristische Systemüberprüfung. Seien Sie vorsichtig beim Ausführen.' : isIt ? 'Il file è in coda per la revisione euristica del sistema. Prestare attenzione durante l\'esecuzione.' : isJa ? 'ファイルはシステムのヒューリスティック検査의待機列にあります。実行する際は注意してください。' : isKo ? '파일이 시스템 휴리스틱 검사 대기열에 있습니다. 실행 시 주의하십시오.' : isZh ? '文件正在等待系统启发式评估。请在运行它时保持警惕。' : isRu ? 'Файл находится в очереди на эвристическую проверку системы. Будьте осторожны при его запуске.' : isEs ? 'El archivo está en la cola de revisión heurística del sistema. Ten precaución al ejecutarlo.' : 'The file is in the queue for system heuristic review. Exercise caution when running it.',
    threatDesc: isPt ? 'AVISO CRÍTICO: Este arquivo correspondeu a assinaturas de vírus conhecidas ou possui várias denúncias. O download foi suspenso.' : isFr ? 'AVERTISSEMENT CRITIQUE : Ce fichier correspond à des signatures de virus connues ou a fait l\'objet de plusieurs signalements. Le téléchargement a été suspendu.' : isDe ? 'KRITISCHER WARNHINWEIS: Diese Datei stimmt mit bekannten Virensignaturen überein oder wurde mehrfach gemeldet. Der Download wurde gesperrt.' : isIt ? 'AVVISO CRITICO: Questo file corrisponde a firme di virus note o ha ricevuto più segnalazioni. Il download è stato sospeso.' : isJa ? '重大な警告: このファイルは既知のウイルスシグネチャと一致したか、複数の通報があります。ダウンロードは停止されました。' : isKo ? '최고 수준 경고: 이 파일은 알려진 바이러스 서명과 일치하거나 여러 차례 신고되었습니다. 다운로드가 중단되었습니다.' : isZh ? '严重警告：此文件与已知的病毒特征码匹配，或收到多次举报。下载已被暂停。' : isRu ? 'КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ: Этот файл совпал с известными вирусными сигнатурами или имеет много жалоб. Загрузка приостановлена.' : isEs ? 'AVISO CRÍTICO: Este archivo coincidió con firmas de virus conocidas o tiene múltiples reportes. La descarga ha sido suspendida.' : 'CRITICAL WARNING: This file matched known virus signatures or has multiple reports. Download suspended.',
    inspectLogs: isPt ? 'Inspecionar Log Técnico ClamAV' : isFr ? 'Inspecter le journal technique ClamAV' : isDe ? 'Technisches ClamAV-Protokoll einsehen' : isIt ? 'Ispeziona registro tecnico ClamAV' : isJa ? 'ClamAV技術ログを検査' : isKo ? 'ClamAV 기술 로그 검사' : isZh ? '检查 ClamAV 技术日志' : isRu ? 'Проверить технический журнал ClamAV' : isEs ? 'Inspeccionar Registro Técnico ClamAV' : 'Inspect Technical ClamAV Log',
    howSecurityWorks: isPt ? 'Como funciona a segurança no FileShare?' : isFr ? 'Comment fonctionne la sécurité sur FileShare ?' : isDe ? 'Wie funktioniert die Sicherheit bei FileShare?' : isIt ? 'Come funziona la sicurezza su FileShare?' : isJa ? 'FileShareのセキュリティの仕組み' : isKo ? 'FileShare 보안 작동 방식은 무엇인가요?' : isZh ? 'FileShare 的安全机制是如何运作的？' : isRu ? 'Как работает безопасность в FileShare?' : isEs ? '¿Cómo funciona la seguridad en FileShare?' : 'How does security work on FileShare?',
    secStep1: isPt ? '1. Cada arquivo enviado é analisado em tempo real por um scanner estático que examina o cabeçalho binário.' : isFr ? '1. Chaque fichier téléchargé est analysé en temps réel par un scanner statique qui examine l\'en-tête binaire.' : isDe ? '1. Jede hochgeladene Datei wird in Echtzeit von einem statischen Scanner analysiert, der den binären Header untersucht.' : isIt ? '1. Ogni file caricato viene analizzato in tempo real da uno scanner statico che esamina l\'intestazione del file.' : isJa ? '1. アップロードされたすべてのファイルは、バイナリヘッダーを調べる静的スキャナーによってリアルタイムで分析されます。' : isKo ? '1. 업로드된 모든 파일은 바이너리 헤더를 검사하는 정적 스캐너에 의해 실시간으로 분석됩니다.' : isZh ? '1. 每个上传的文件都会由静态扫描程序进行实时分析，检查其二进制文件头。' : isRu ? '1. Каждый загруженный файл анализируется в реальном времени статическим сканером, который изучает двоичный заголовок.' : isEs ? '1. Cada archivo subido es analizado en tiempo real por un escáner estático que examina la cabecera del binario.' : '1. Each uploaded file is analyzed in real-time by a static scanner that examines the binary header.',
    secStep2: isPt ? '2. Buscamos assinaturas padronizadas de trojans, keyloggers, scripts maliciosos de download automático e simuladores de teste (EICAR).' : isFr ? '2. Nous recherchons des signatures standardisées de chevaux de Troie, keyloggers, scripts malveillants d\'auto-téléchargement et simulateurs de test (EICAR).' : isDe ? '2. Wir suchen nach standardisierten Signaturen von Trojanern, Keyloggern, bösartigen Skripten und Testsimulatoren (EICAR).' : isIt ? '2. Cerchiamo firme standardizzate di trojan, keylogger, script dannosi di download automatico e simulatori di test (EICAR).' : isJa ? '2. トロイの木馬、キーロガー、悪意のある自己ダウンロードスクリプト、およびテストシミュレーター（EICAR）の標準化されたシグネチャをスキャンします。' : isKo ? '2. 트로이 목마, 키로거, 악성 자동 다운로드 스크립트 및 테스트 시뮬레이터(EICAR)의 표준화된 서명을 검사합니다.' : isZh ? '2. 我们扫描木马、键盘记录器、自动下载恶意脚本和测试模拟器（EICAR）的标准特征码。' : isRu ? '2. Мы ищем стандартизированные сигнатуры троянов, кейлоггеров, вредоносных скриптов автозагрузки и тестовых симуляторов (EICAR).' : isEs ? '2. Buscamos firmas estandarizadas de virus troyanos, keyloggers, scripts maliciosos de auto-descarga y simuladores de test (EICAR).' : '2. We scan for standardized signatures of trojans, keyloggers, auto-download malicious scripts, and test simulators (EICAR).',
    secStep3: isPt ? '3. Arquivos suspeitos são instantaneamente marcados como Ameaça e desativados.' : isFr ? '3. Les fichiers suspects sont instantanément marqués comme Menaces et désactivés.' : isDe ? '3. Verdächtige Dateien werden sofort als Bedrohung markiert und deaktiviert.' : isIt ? '3. I file sospetti vengono immediatamente contrassegnati come minaccia e disabilitati.' : isJa ? '3. 不審なファイルは即座に「脅威」としてマークされ、無効化されます。' : isKo ? '3. 의심스러운 파일은 즉시 위협으로 표시되고 비활성화됩니다.' : isZh ? '3. 可疑文件会被立即标记为威胁并禁用。' : isRu ? '3. Подозрительные файлы немедленно помечаются как угроза и отключаются.' : isEs ? '3. Los archivos sospechosos se marcan inmediatamente como Amenaza y quedan deshabilitados.' : '3. Suspicious files are instantly marked as a Threat and disabled.',
    commentsAndFeedback: isPt ? 'Comentários e Avaliações' : isFr ? 'Commentaires et avis' : isDe ? 'Kommentare & Feedback' : isIt ? 'Commenti e opinioni' : isJa ? 'コメントとフィードバック' : isKo ? '의견 및 피드백' : isZh ? '评论与意见' : isRu ? 'Комментарии и отзывы' : isEs ? 'Comentarios y Opiniones' : 'Comments & Feedback',
    aliasPlaceholder: isPt ? 'Seu apelido (Ex: DevX)' : isFr ? 'Votre pseudo (Ex. DevX)' : isDe ? 'Ihr Name (z. B. DevX)' : isIt ? 'Il tuo alias (Es. DevX)' : isJa ? 'エイリアス（例：DevX）' : isKo ? '닉네임 (예: DevX)' : isZh ? '您的别名（例如：DevX）' : isRu ? 'Ваш псевдоним (например, DevX)' : isEs ? 'Tu alias (Ej. DevX)' : 'Your alias (e.g. DevX)',
    commentPlaceholder: isPt ? 'Escreva sua opinião ou relate problemas...' : isFr ? 'Écrivez votre avis ou signalez des bogues...' : isDe ? 'Schreiben Sie Ihr Feedback oder melden Sie Fehler...' : isIt ? 'Scrivi la tua opinione o segnala bug...' : isJa ? '意見やバグ報告を入力してください...' : isKo ? '파일에 대한 의견이나 오류 보고를 작성하십시오...' : isZh ? '写下您对该文件的意见或反馈错误...' : isRu ? 'Напишите свой отзыв о файле или отчет об ошибке...' : isEs ? 'Escribe tu opinión sobre el archivo o reporte de fallas...' : 'Write your feedback on the file or bug reports...',
    noComments: isPt ? 'Sem comentários ainda. Seja o primeiro!' : isFr ? 'Aucun commentaire pour l\'instant. Soyez le premier !' : isDe ? 'Noch keine Kommentare. Schreiben Sie den ersten!' : isIt ? 'Nessun commento ancora. Scrivi il primo!' : isJa ? 'コメントはまだありません。最初の意見を投稿しましょう！' : isKo ? '의견이 아직 없습니다. 첫 의견을 작성해 보세요!' : isZh ? '暂无评论。来发表第一条意见吧！' : isRu ? 'Комментариев пока нет. Будьте первым, кто оставит отзыв!' : isEs ? 'No hay comentarios todavía. ¡Sé el primero en dar tu opinión!' : 'No comments yet. Be the first to share your opinion!',
    versionHistory: isPt ? 'Histórico de Versões' : isFr ? 'Historique des versions' : isDe ? 'Versionsverlauf' : isIt ? 'Cronologia versioni' : isJa ? 'バージョン履歴' : isKo ? '버전 기록' : isZh ? '版本历史记录' : isRu ? 'История версий' : isEs ? 'Historial de Versiones' : 'Version History',
    currentVersion: isPt ? 'Atual:' : isFr ? 'Actuel :' : isDe ? 'Aktuell:' : isIt ? 'Attuale:' : isJa ? '現在:' : isKo ? '현재:' : isZh ? '当前版本:' : isRu ? 'Текущая:' : isEs ? 'Actual:' : 'Current:',
    activeVersionTag: isPt ? 'Versão Ativa' : isFr ? 'Version active' : isDe ? 'Aktive Version' : isIt ? 'Versione attiva' : isJa ? 'アクティブなバージョン' : isKo ? '활성 버전' : isZh ? '当前处于活动状态的版本' : isRu ? 'Активная версия' : isEs ? 'Versión Activa' : 'Active Version',
    previousTag: isPt ? 'Anterior' : isFr ? 'Précédent' : isDe ? 'Vorherige' : isIt ? 'Precedente' : isJa ? '以前' : isKo ? '이전 버전' : isZh ? '历史版本' : isRu ? 'Предыдущая' : isEs ? 'Anterior' : 'Previous',
    noPreviousVersions: isPt ? 'Nenhuma versão anterior foi registrada.' : isFr ? 'Aucune version précédente n\'a été enregistrée.' : isDe ? 'Es wurden keine vorherigen Versionen registriert.' : isIt ? 'Nessuna versione precedente registrata.' : isJa ? 'このファイルの以前のバージョンは登録されていません。' : isKo ? '이 파일의 이전 버전이 등록되지 않았습니다.' : isZh ? '未注册该文件的历史版本。' : isRu ? 'Предыдущие версии этого файла не зарегистрированы.' : isEs ? 'No se han registrado versiones anteriores de este archivo.' : 'No previous versions have been registered for this file.',
    reportSuspicious: isPt ? 'Denunciar arquivo suspeito ou prejudicial' : isFr ? 'Signaler un fichier suspect ou nuisible' : isDe ? 'Verdächtige oder schädliche Datei melden' : isIt ? 'Segnala file sospetto o dannoso' : isJa ? '不審なファイルまたは有害なファイルを報告' : isKo ? '의심스럽거나 유해한 파일 신고' : isZh ? '举报可疑或有害文件' : isRu ? 'Пожаловаться на подозрительный или вредоносный файл' : isEs ? 'Reportar archivo sospechoso o dañino' : 'Report suspicious or harmful file',
    reportDesc: isPt ? 'Se este arquivo contiver malware, violar direitos autorais, estiver corrompido ou quebrar os termos de uso, notifique-nos.' : isFr ? 'Si ce fichier contient du code malveillant, enfreint des droits d\'auteur, est corrompu ou enfreint les conditions d\'utilisation, signalez-le.' : isDe ? 'Wenn diese Datei Schadcode enthält, Urheberrechte verletzt, beschädigt ist oder die Nutzungsbedingungen verletzt, benachrichtigen Sie uns.' : isIt ? 'Se questo file contiene codice malizioso, viola il copyright, è danneggiato o viola i termini d\'uso, segnalalo.' : isJa ? 'このファイルに悪意のあるコードが含まれている、著作権を侵害している、破損している、または利用規約に違反している場合は、管理者に通知してください。' : isKo ? '이 파일에 악성 코드가 포함되어 있거나, 저작권을 침해하거나, 손상되었거나, 이용 약관을 위배하는 경우 중재자에게 알리십시오.' : isZh ? '如果此文件包含恶意代码、侵犯知识产权、文件已损坏 or 违反使用条款，请通知管理员。' : isRu ? 'Если этот файл содержит вредоносный код, нарушает авторские права, поврежден или нарушает правила использования, сообщите модераторам.' : isEs ? 'Si este archivo contiene código malicioso, viola derechos de propiedad intelectual, está corrupto o rompe los términos de uso, notifica a los moderadores.' : 'If this file contains malicious code, violates intellectual property rights, is corrupted, or breaks terms of use, notify the moderators.',
    reportSuccess: isPt ? 'Denúncia Enviada com Sucesso!' : isFr ? 'Signalement envoyé avec succès !' : isDe ? 'Meldung erfolgreich gesendet!' : isIt ? 'Segnalazione inviata con successo!' : isJa ? '報告が正常に送信されました！' : isKo ? '신고가 성공적으로 접수되었습니다!' : isZh ? '举报提交成功！' : isRu ? 'Жалоба успешно отправлена!' : isEs ? '¡Reporte Enviado Exitosamente!' : 'Report Submitted Successfully!',
    reportSuccessSub: isPt ? 'Um moderador revisará os detalhes. Retornando...' : isFr ? 'Un modérateur examinera les détails. Retour...' : isDe ? 'Ein Moderator wird die Details prüfen. Zurück...' : isIt ? 'Un moderatore esaminerà i dettagli. Ritorno...' : isJa ? 'モデレーターが詳細を確認します。詳細画面に戻ります...' : isKo ? '중재자가 세부 사항을 검토할 예정입니다. 상세 화면으로 이동합니다...' : isZh ? '管理员将审核这些详细信息。正在返回详细信息屏幕...' : isRu ? 'Модератор рассмотрит детали. Возврат к экрану деталей...' : isEs ? 'Un moderador revisará los detalles. Volviendo a la pantalla principal de detalles...' : 'A moderator will review the details. Returning to details screen...',
    selectMainReason: isPt ? 'Selecione o motivo principal:' : isFr ? 'Sélectionnez le motif principal :' : isDe ? 'Wählen Sie den Hauptgrund aus:' : isIt ? 'Seleziona il motivo principale:' : isJa ? '主な理由を選択してください:' : isKo ? '주요 이유를 선택하십시오:' : isZh ? '选择主要原因：' : isRu ? 'Выберите основную причину:' : isEs ? 'Selecciona el motivo principal:' : 'Select the main reason:',
    addDetailsOptional: isPt ? 'Comentários adicionais (opcional):' : isFr ? 'Commentaires supplémentaires (facultatif) :' : isDe ? 'Zusätzliche Kommentare (optional):' : isIt ? 'Commenti aggiuntivi (facoltativo):' : isJa ? '追加のコメント（任意）:' : isKo ? '추가 의견 (선택 사항):' : isZh ? '其他意见或详细信息（可选）：' : isRu ? 'Дополнительные комментарии (необязательно):' : isEs ? 'Comentarios o detalles adicionales (opcional):' : 'Additional comments or details (optional):',
    reportPlaceholder: isPt ? 'Indique como ele viola as regras...' : isFr ? 'Indiquez de quelle manière il enfreint les règles...' : isDe ? 'Geben Sie an, wie die Datei gegen die Regeln verstößt...' : isIt ? 'Indica come viola le regole...' : isJa ? 'どのようにルールに違反しているかを説明してください...' : isKo ? '규정 위반 사항을 자세히 설명하십시오...' : isZh ? '请指出该文件如何违反规定...' : isRu ? 'Укажите, каким образом файл нарушает правила...' : isEs ? 'Indica de qué manera incumple las normas de FileShare...' : 'Indicate how it violates FileShare rules...',
    sending: isPt ? 'Enviando...' : isFr ? 'Envoi...' : isDe ? 'Wird gesendet...' : isIt ? 'Invio in corso...' : isJa ? '送信中...' : isKo ? '전송 중...' : isZh ? '正在发送...' : isRu ? 'Отправка...' : isEs ? 'Enviando...' : 'Sending...',
    sendReport: isPt ? 'Enviar Denúncia' : isFr ? 'Envoyer le signalement' : isDe ? 'Meldung senden' : isIt ? 'Invia segnalazione' : isJa ? '報告を送信' : isKo ? '신고하기' : isZh ? '提交举报' : isRu ? 'Отправить жалобу' : isEs ? 'Enviar Reporte al Equipo' : 'Send Report to Team',
    reportBtn: isPt ? 'Denunciar arquivo' : isFr ? 'Signaler le fichier' : isDe ? 'Datei melden' : isIt ? 'Segnala file' : isJa ? 'ファイルを報告' : isKo ? '파일 신고' : isZh ? '举报文件' : isRu ? 'Пожаловаться на файл' : isEs ? 'Reportar archivo' : 'Report file',
    shareBtn: isPt ? 'Compartilhar' : isFr ? 'Partager' : isDe ? 'Teilen' : isIt ? 'Condividi' : isJa ? '共有' : isKo ? '공유' : isZh ? '分享' : isRu ? 'Поделиться' : isEs ? 'Compartir' : 'Share',
    downloadFileBtn: isPt ? 'Baixar arquivo' : isFr ? 'Télécharger' : isDe ? 'Datei herunterladen' : isIt ? 'Scarica file' : isJa ? 'ファイルをダウンロード' : isKo ? '파일 다운로드' : isZh ? '下载文件' : isRu ? 'Скачать файл' : isEs ? 'Descargar archivo' : 'Download file',
    shareQrTitle: isPt ? 'Compartilhar via Código QR' : isFr ? 'Partager par code QR' : isDe ? 'Per QR-Code teilen' : isIt ? 'Condividi tramite codice QR' : isJa ? 'QRコードで共有' : isKo ? 'QR 코드로 공유' : isZh ? '通过二维码分享' : isRu ? 'Поделиться через QR-код' : isEs ? 'Compartir por Código QR' : 'Share via QR Code',
    shareQrDesc: isPt ? 'Escaneie o código para baixar ou ver imediatamente.' : isFr ? 'Scannez le code pour télécharger ou voir immédiatement.' : isDe ? 'Scannen Sie den Code, um die Datei sofort herunterzuladen oder anzuzeigen.' : isIt ? 'Scansiona il codice per scaricare o visualizzare immediatamente.' : isJa ? '携帯電話でコードをスキャンして、すぐにダウンロードまたは閲覧します。' : isKo ? '휴대폰으로 코드를 스캔하여 즉시 다운로드하거나 확인하십시오.' : isZh ? '用手机扫描二维码即可立即下载 or 查看文件。' : isRu ? 'Отсканируйте код телефоном, чтобы мгновенно скачать или просмотреть файл.' : isEs ? 'Escanea el código con tu celular para descargar o ver el archivo inmediatamente.' : 'Scan the code with your phone to download or view the file immediately.',
    gotIt: isPt ? 'Entendido' : isFr ? 'Compris' : isDe ? 'Verstanden' : isIt ? 'Ho capito' : isJa ? '了解' : isKo ? '확인' : isZh ? '确定' : isRu ? 'Понятно' : isEs ? 'Entendido' : 'Got it',
    apkWarningTitle: isPt ? 'Aviso de segurança APK' : isFr ? 'Avertissement de sécurité APK' : isDe ? 'APK-Sicherheitswarnung' : isIt ? 'Avviso di sicurezza APK' : isJa ? 'APKセキュリティ警告' : isKo ? 'APK 보안 경고' : isZh ? 'APK 安全警告' : isRu ? 'Предупреждение безопасности APK' : isEs ? 'Aviso de seguridad APK' : 'APK Security Warning',
    apkWarning1: isPt ? 'Este arquivo é um instalador do Android (APK) enviado por um usuário.' : isFr ? 'Ce fichier est un programme d\'installation Android (APK) téléchargé par un utilisateur.' : isDe ? 'Diese Datei ist ein Android-Installationsprogramm (APK), das von einem Benutzer hochgeladen wurde.' : isIt ? 'Questo file è un programma di installazione Android (APK) caricato da un utente.' : isJa ? 'このファイルはユーザーによってアップロードされたAndroidインストーラー（APK）です。' : isKo ? '이 파일은 사용자가 업로드한 Android 설치 파일(APK)입니다.' : isZh ? '此文件是用户上传的 Android 安装包 (APK)。' : isRu ? 'Этот файл является установочным пакетом Android (APK), загруженным пользователем.' : isEs ? 'Este archivo es un instalador ejecutable de Android (APK) subido por un usuario.' : 'This file is an Android executable installer (APK) uploaded by a user.',
    apkWarning2: isPt ? 'FileShare não garante que seja 100% seguro. Verifique sua procedência antes de instalar.' : isFr ? 'FileShare ne garantit pas qu\'il soit sûr à 100 %. Vérifiez sa provenance avant de l\'installer.' : isDe ? 'FileShare garantiert nicht, dass die Datei zu 100 % sicher ist. Überprüfen Sie die Quelle vor der Installation.' : isIt ? 'FileShare non garantisce che sia sicuro al 100%. Verifica l\'origine prima di installare.' : isJa ? 'FileShareはこれが100%安全であることを保証しません。インストールする前に発信元を確認してください。' : isKo ? 'FileShare는 이 파일이 100% 안전하다고 보증하지 않습니다. 설치 전에 출처를 확인하십시오.' : isZh ? 'FileShare 无法保证其 100% 安全。安装前请核实其来源。' : isRu ? 'FileShare не гарантирует стопроцентную безопасность файла. Перед установкой проверьте его источник.' : isEs ? 'FileShare no garantiza que sea 100% seguro para tu celular. Verifica su procedencia antes de instalarlo.' : 'FileShare does not guarantee it is 100% safe for your phone. Verify its origin before installing.',
    apkWarning3: isPt ? 'Baixe e instale este APK por sua própria responsabilidade.' : isFr ? 'Téléchargez et installez cet APK à vos propres risques.' : isDe ? 'Laden Sie diese APK auf eigene Gefahr herunter und installieren Sie sie.' : isIt ? 'Scarica e installa questo APK a tuo rischio e pericolo.' : isJa ? '自己責任でこのAPKをダウンロードしてインストールしてください。' : isKo ? '본인 책임 하에 이 APK를 다운로드하고 설치하십시오.' : isZh ? '请自行承担风险下载并安装此 APK。' : isRu ? 'Загружайте и устанавливайте этот APK на свой страх и риск.' : isEs ? 'Descarga e instala este APK bajo tu propia responsabilidad.' : 'Download and install this APK at your own risk.',
    downloadAnyway: isPt ? 'Baixar de qualquer maneira' : isFr ? 'Télécharger quand même' : isDe ? 'Trotzdem herunterladen' : isIt ? 'Scarica comunque' : isJa ? 'とにかくダウンロード' : isKo ? '무시하고 다운로드' : isZh ? '仍要下载' : isRu ? 'Всё равно скачать' : isEs ? 'Descargar de todos modos' : 'Download anyway',
    downloadBlockedTitle: isPt ? 'Download Bloqueado' : isFr ? 'Téléchargement bloqué' : isDe ? 'Download blockiert' : isIt ? 'Download bloccato' : isJa ? 'ダウンロードがブロックされました' : isKo ? '다운로드 차단됨' : isZh ? '下载已拦截' : isRu ? 'Загрузка заблокирована' : isEs ? 'Descarga de archivo bloqueada' : 'File Download Blocked',
    downloadBlockedDesc1: isPt ? 'Este arquivo foi identificado como uma Ameaça Potencial de Segurança pelo scanner ClamAV ou foi denunciado várias vezes.' : isFr ? 'Ce fichier a été identifié comme une menace potentielle pour la sécurité par notre scanner ClamAV ou a été signalé plusieurs fois.' : isDe ? 'Diese Datei wurde von unserem automatischen ClamAV-Scanner als potenzielle Bedrohung eingestuft oder mehrfach gemeldet.' : isIt ? 'Questo file è stato identificato come potenziale minaccia dal nostro scanner ClamAV o ha ricevuto più segnalazioni.' : isJa ? 'このファイルは、自動ClamAVスキャナーによって潜在的なセキュリティ脅威として特定されたか、ユーザーから複数回通報されています。' : isKo ? '이 파일은 자동 ClamAV 스캐너에 의해 잠재적인 보안 위협으로 식별되었거나 사용자에 의해 여러 번 신고되었습니다.' : isZh ? '该文件已被我们的 ClamAV 自动扫描程序识别为潜在的安全威胁，或者已被用户多次举报。' : isRu ? 'Этот файл был определен автоматическим сканером ClamAV как потенциальная угроза безопасности или на него поступило много жалоб.' : isEs ? 'Este archivo ha sido identificado como una Amenaza Potencial de Seguridad por nuestro antivirus ClamAV automático o ha sido reportado múltiples veces por usuarios.' : 'This file has been identified as a Potential Security Threat by our ClamAV automatic scanner or has been reported multiple times by users.',
    downloadBlockedDesc2: isPt ? 'Por segurança, downloads diretos estão suspensos temporariamente até avaliação de um moderador.' : isFr ? 'Pour des raisons de sécurité, les téléchargements directs sont suspendus en attendant l\'examen d\'un modérateur.' : isDe ? 'Aus Sicherheitsgründen wurden direkte Downloads vorübergehend gesperrt, bis ein administrator die Datei überprüft.' : isIt ? 'Per motivi di sicurezza, i download diretti sono sospesi in attesa di moderazione.' : isJa ? '安全上の理由から、管理者が手動でファイルをモデレートするまで、直接ダウンロードは一時的に停止されています。' : isKo ? '보안상의 이유로 관리자가 수동으로 파일을 중재할 때까지 직접 다운로드가 일시적으로 중단되었습니다.' : isZh ? '出于安全原因，直接下载已被暂时挂起，直到管理员手动审核该文件。' : isRu ? 'В целях безопасности прямые загрузки были временно приостановлены до ручной модерации администратором.' : isEs ? 'Por razones de seguridad de la plataforma, las descargas directas han sido suspendidas temporalmente hasta que un administrador modere manualmente el archivo.' : 'For safety reasons, direct downloads have been temporarily suspended until an administrator reviews the file.',
    lines: isPt ? 'linhas' : isFr ? 'lignes' : isDe ? 'Zeilen' : isIt ? 'righe' : isJa ? '行' : isKo ? '줄' : isZh ? '行' : isRu ? 'строк' : isEs ? 'líneas' : 'lines',
    downloadVersion: isPt ? 'Baixar esta versão' : isFr ? 'Télécharger cette version' : isDe ? 'Diese Version herunterladen' : isIt ? 'Scarica questa versione' : isJa ? 'このバージョンをダウンロード' : isKo ? '이 버전 다운로드' : isZh ? '下载此版本' : isRu ? 'Скачать эту версию' : isEs ? 'Descargar esta versión' : 'Download this version'
  };
};

export default function FileDetailModal({ 
  file: initialFile, 
  settings, 
  onClose, 
  onRefreshTrigger, 
  t,
  addNotification,
  addActivity
}: FileDetailModalProps) {
  const [file, setFile] = useState<FileMetadata>(initialFile);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'comments' | 'versions' | 'report'>('info');
  const [showApkWarning, setShowApkWarning] = useState(false);
  const [showThreatWarning, setShowThreatWarning] = useState(false);

  // Initialize dynamic translation helpers
  const dt = getDetailT(settings.language || 'es');
  const reportReasons = getReportReasons(settings.language || 'es');

  // Rating and feedback
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  // Comments state
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  // Report fields
  const [reportReason, setReportReason] = useState('');
  const [reportComments, setReportComments] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Log dropdown & QR Modal state
  const [showSecurityLogs, setShowSecurityLogs] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const isLiquid = settings.style === 'liquid-glass';
  const isDark = settings.theme === 'dark';

  const modalBg = isLiquid
    ? isDark
      ? 'bg-neutral-900/80 backdrop-blur-xl border border-white/10 text-white'
      : 'bg-white/80 backdrop-blur-xl border border-neutral-200 text-neutral-800'
    : isDark
    ? 'bg-neutral-900 border border-neutral-800 text-white shadow-2xl'
    : 'bg-white border border-neutral-200 text-neutral-800 shadow-2xl';

  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const lang = settings.language || 'es';
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Helper to re-fetch single file state to get new comments and rating
  const refreshFileDetails = async () => {
    try {
      const res = await fetch(`/api/files`);
      if (res.ok) {
        const list: FileMetadata[] = await res.json();
        const found = list.find(f => f.id === file.id);
        if (found) {
          setFile(found);
        }
      }
    } catch (err) {
      console.error('Error refreshing details:', err);
    }
  };

  // Handle Download trigger with safety popups
  const handleDownloadClick = () => {
    if (file.status === 'Amenaza detectada') {
      setShowThreatWarning(true);
      return;
    }
    if (file.extension.toLowerCase() === 'apk') {
      setShowApkWarning(true);
      return;
    }
    triggerDownload();
  };

  const triggerDownload = (versionQuery?: string) => {
    let downloadUrl = `/api/download/${file.id}`;
    if (versionQuery) {
      downloadUrl += `?version=${encodeURIComponent(versionQuery)}`;
    }
    window.open(downloadUrl, '_blank');

    if (addNotification) {
      addNotification(
        t.downloadStartAlert || 'Descarga iniciada ⬇️',
        `Tu archivo "${file.name}" comenzó a descargarse.`,
        'download_start'
      );
    }
    if (addActivity) {
      addActivity('download_start', `Descargaste el archivo: ${file.name} ${versionQuery ? '(v' + versionQuery + ')' : ''}`);
    }

    setShowApkWarning(false);
    setShowThreatWarning(false);
    onRefreshTrigger(); // refresh download counts
    setTimeout(refreshFileDetails, 1000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/file/${file.id}`;
    navigator.clipboard.writeText(shareUrl);
    const lang = settings.language || 'es';
    const alertMsg = lang === 'en' ? 'FileShare link copied to clipboard!' :
                     lang === 'pt' ? 'Link do FileShare copiado para a área de transferência!' :
                     lang === 'fr' ? 'Lien FileShare copié dans le presse-papiers !' :
                     lang === 'de' ? 'FileShare-Link in die Zwischenablage kopiert!' :
                     lang === 'it' ? 'Link FileShare copiato negli appunti!' :
                     lang === 'ja' ? 'FileShareリンクがクリップボードにコピーされました！' :
                     lang === 'ko' ? 'FileShare 링크가 클립보드에 복사되었습니다!' :
                     lang === 'zh' ? 'FileShare 链接已复制到剪贴板！' :
                     lang === 'ru' ? 'Ссылка FileShare скопирована в буфер обмена!' : '¡Enlace de FileShare copiado al portapapeles!';
    alert(alertMsg);
  };

  // Submit report to server
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lang = settings.language || 'es';
    if (!reportReason) {
      const alertMsg = lang === 'en' ? 'Please select a reason to report the file.' :
                       lang === 'pt' ? 'Por favor, selecione um motivo para denunciar o arquivo.' :
                       lang === 'fr' ? 'Veuillez sélectionner un motif pour signaler le fichier.' :
                       lang === 'de' ? 'Bitte wählen Sie einen Grund für die Meldung der Datei aus.' :
                       lang === 'it' ? 'Seleziona un motivo per segnalare il file.' :
                       lang === 'ja' ? 'ファイルを報告する理由を選択してください。' :
                       lang === 'ko' ? '파일을 신고할 이유를 선택하십시오.' :
                       lang === 'zh' ? '请选择举报该文件的原因。' :
                       lang === 'ru' ? 'Пожалуйста, выберите причину жалобы на файл.' : 'Por favor selecciona un motivo para reportar el archivo.';
      alert(alertMsg);
      return;
    }

    try {
      setSubmittingReport(true);
      const res = await fetch(`/api/files/${file.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          comments: reportComments
        })
      });

      if (res.ok) {
        setReportSuccess(true);
        if (addNotification) {
          addNotification(
            t.fileReportedAlert || 'Tu archivo fue reportado 🚩',
            `El archivo "${file.name}" fue reportado por "${reportReason}".`,
            'reported'
          );
        }
        if (addActivity) {
          addActivity('report', `Reportaste el archivo: ${file.name} por ${reportReason}`);
        }
        setTimeout(() => {
          setActiveTab('info');
          setReportSuccess(false);
          setReportReason('');
          setReportComments('');
          onRefreshTrigger(); // updates report metrics
          refreshFileDetails();
        }, 2500);
      } else {
        const alertMsg = lang === 'en' ? 'Error submitting report.' :
                         lang === 'pt' ? 'Erro ao enviar a denúncia.' :
                         lang === 'fr' ? 'Erreur lors de l’envoi du rapport.' :
                         lang === 'de' ? 'Fehler beim Senden der Meldung.' :
                         lang === 'it' ? 'Errore durante l’invio della segnalazione.' :
                         lang === 'ja' ? '通報の送信中にエラーが発生しました。' :
                         lang === 'ko' ? '신고 접수 중 오류가 발생했습니다.' :
                         lang === 'zh' ? '提交举报时出错。' :
                         lang === 'ru' ? 'Ошибка при отправке жалобы.' : 'Error al registrar el reporte.';
        alert(alertMsg);
      }
    } catch (error) {
      console.error(error);
      const alertMsg = lang === 'en' ? 'Connection error with server.' :
                       lang === 'pt' ? 'Erro de conexão com o servidor.' :
                       lang === 'fr' ? 'Erreur de connexion avec le serveur.' :
                       lang === 'de' ? 'Verbindungsfehler mit dem Server.' :
                       lang === 'it' ? 'Errore di connessione con il server.' :
                       lang === 'ja' ? 'サーバーとの接続エラー。' :
                       lang === 'ko' ? '서버 연결 오류가 발생했습니다.' :
                       lang === 'zh' ? '与服务器连接出错。' :
                       lang === 'ru' ? 'Ошибка соединения с сервером.' : 'Error de conexión con el servidor.';
      alert(alertMsg);
    } finally {
      setSubmittingReport(false);
    }
  };

  // Submit star rating to server
  const handleRatingSubmit = async (ratingVal: number) => {
    const lang = settings.language || 'es';
    try {
      setIsRatingSubmitting(true);
      const res = await fetch(`/api/files/${file.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingVal })
      });

      if (res.ok) {
        setUserRating(ratingVal);
        if (addNotification) {
          addNotification(
            t.rateSuccessAlert || 'Calificación registrada ⭐',
            `Calificaste "${file.name}" con ${ratingVal} estrellas.`,
            'info'
          );
        }
        if (addActivity) {
          addActivity('rate', `Calificaste el archivo "${file.name}" con ${ratingVal} estrellas`);
        }
        refreshFileDetails();
        onRefreshTrigger();
      } else {
        const alertMsg = lang === 'en' ? 'Error submitting your rating.' :
                         lang === 'pt' ? 'Erro ao enviar sua avaliação.' :
                         lang === 'fr' ? 'Erreur lors de l’envoi de votre évaluation.' :
                         lang === 'de' ? 'Fehler beim Senden Ihrer Bewertung.' :
                         lang === 'it' ? 'Errore durante l’invio della valutazione.' :
                         lang === 'ja' ? '評価の送信中にエラーが発生しました。' :
                         lang === 'ko' ? '평가 등록 중 오류가 발생했습니다.' :
                         lang === 'zh' ? '提交您的评分时出错。' :
                         lang === 'ru' ? 'Ошибка при отправке вашей оценки.' : 'Error al registrar tu calificación.';
        alert(alertMsg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  // Submit comment to server
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const lang = settings.language || 'es';

    try {
      setIsCommentSubmitting(true);
      const res = await fetch(`/api/files/${file.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor.trim() || (lang === 'en' ? 'Anonymous' : lang === 'pt' ? 'Anônimo' : lang === 'fr' ? 'Anonyme' : lang === 'de' ? 'Anonym' : lang === 'it' ? 'Anonimo' : lang === 'ja' ? '匿名' : lang === 'ko' ? '익명' : lang === 'zh' ? '匿名' : lang === 'ru' ? 'Аноним' : 'Anónimo'),
          text: commentText.trim()
        })
      });

      if (res.ok) {
        setCommentText('');
        if (addNotification) {
          addNotification(
            t.commentSuccessAlert || 'Comentario publicado 💬',
            `Publicaste un comentario en "${file.name}".`,
            'info'
          );
        }
        if (addActivity) {
          addActivity('comment', `Comentaste en "${file.name}": "${commentText.substring(0, 30)}..."`);
        }
        refreshFileDetails();
        onRefreshTrigger();
      } else {
        const alertMsg = lang === 'en' ? 'Error posting comment.' :
                         lang === 'pt' ? 'Erro ao publicar comentário.' :
                         lang === 'fr' ? 'Erreur lors de la publication du commentaire.' :
                         lang === 'de' ? 'Fehler beim Veröffentlichen des Kommentars.' :
                         lang === 'it' ? 'Errore durante la pubblicazione del commento.' :
                         lang === 'ja' ? 'コメントの投稿中にエラーが発生しました。' :
                         lang === 'ko' ? '댓글 등록 중 오류가 발생했습니다.' :
                         lang === 'zh' ? '发布评论时出错。' :
                         lang === 'ru' ? 'Ошибка при публикации комментария.' : 'Error al publicar comentario.';
        alert(alertMsg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const fileShareUrl = `${window.location.origin}/file/${file.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(fileShareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        id={`file-details-modal-${file.id}`}
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 transform scale-100 flex flex-col max-h-[90vh] ${modalBg}`}
      >
        
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              {getFileTypeIcon(file.type, 'w-5 h-5')}
            </div>
            <div>
              <h3 className="text-base font-bold truncate max-w-[240px] md:max-w-md text-neutral-900 dark:text-neutral-100">
                {file.name}
              </h3>
              <p className="text-[10px] font-mono text-neutral-500 uppercase">
                v{file.version || '1.0.0'} • {file.extension} • {formatBytes(file.size)}
              </p>
            </div>
          </div>
          <button
            id="close-file-details-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800/60 text-xs font-semibold shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            id="tab-info-btn"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'info' 
                ? 'text-sky-500 border-sky-500' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            {t.tabDetails}
          </button>
          <button
            id="tab-security-btn"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'security' 
                ? 'text-sky-500 border-sky-500' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            {t.tabSecurity}
          </button>
          <button
            id="tab-comments-btn"
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'comments' 
                ? 'text-sky-500 border-sky-500' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {t.tabComments} ({file.comments ? file.comments.length : 0})
          </button>
          <button
            id="tab-versions-btn"
            onClick={() => setActiveTab('versions')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'versions' 
                ? 'text-sky-500 border-sky-500' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            {t.tabVersions} ({file.previousVersions ? file.previousVersions.length : 0})
          </button>
          <button
            id="tab-report-btn"
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all cursor-pointer ${
              activeTab === 'report' 
                ? 'text-red-500 border-red-500' 
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-white'
            }`}
          >
            {t.tabReport}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: FILE DETAILS */}
          {activeTab === 'info' && (
            <div className="space-y-6 animate-fade-in">
              {/* Cover view */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                {file.coverName ? (
                  <img
                    src={`/data/uploads/${file.coverName}`}
                    alt="File Cover"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                    {getFileTypeIcon(file.type, 'w-16 h-16 mb-2')}
                    <span className="text-xs uppercase font-semibold font-mono tracking-widest">{file.extension}</span>
                  </div>
                )}

                {/* Float tag */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {file.status === 'Revisado' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {settings.language === 'en' ? 'Verified' : settings.language === 'pt' ? 'Verificado' : settings.language === 'fr' ? 'Vérifié' : settings.language === 'de' ? 'Verifiziert' : settings.language === 'it' ? 'Verificato' : settings.language === 'ja' ? '検証済み' : settings.language === 'ko' ? '확인됨' : settings.language === 'zh' ? '已验证' : settings.language === 'ru' ? 'Проверено' : 'Revisado'}
                    </span>
                  )}
                  {file.status === 'Pendiente' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-lg flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {settings.language === 'en' ? 'Pending Analysis' : settings.language === 'pt' ? 'Análise Pendente' : settings.language === 'fr' ? 'Analyse en attente' : settings.language === 'de' ? 'Ausstehende Analyse' : settings.language === 'it' ? 'Analisi in corso' : settings.language === 'ja' ? '分析待ち' : settings.language === 'ko' ? '분석 대기 중' : settings.language === 'zh' ? '等待分析' : settings.language === 'ru' ? 'Ожидает анализа' : 'Análisis Pendiente'}
                    </span>
                  )}
                  {file.status === 'Amenaza detectada' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {settings.language === 'en' ? 'Threat Detected' : settings.language === 'pt' ? 'Ameaça Detectada' : settings.language === 'fr' ? 'Menace détectée' : settings.language === 'de' ? 'Bedrohung erkannt' : settings.language === 'it' ? 'Minaccia rilevata' : settings.language === 'ja' ? '脅威を検出' : settings.language === 'ko' ? '위협 감지됨' : settings.language === 'zh' ? '检测到威胁' : settings.language === 'ru' ? 'Угроза обнаружена' : 'Amenaza Detectada'}
                    </span>
                  )}
                </div>
              </div>

              {/* Title, rating summary & QR action */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white leading-snug">{file.name}</h2>
                    {file.uploaderId && (
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">{dt.uploadedBy} {file.uploaderId}</p>
                    )}
                  </div>

                  <button
                    id="open-qr-btn"
                    onClick={() => setShowQrModal(true)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:opacity-90 transition-opacity flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700 cursor-pointer self-start"
                  >
                    <QrCode className="w-4 h-4 text-sky-500" />
                    {dt.generateQr}
                  </button>
                </div>

                {/* Google Play style Rating selector */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-neutral-800/20 border-neutral-700/40' : 'bg-neutral-50 border-neutral-200'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className="text-center shrink-0 pr-4 border-r border-neutral-200 dark:border-neutral-700">
                      <div className="text-3xl font-black text-neutral-900 dark:text-white">
                        {typeof file.rating === 'number' ? file.rating.toFixed(1) : '0.0'}
                      </div>
                      <div className="flex justify-center text-amber-500 my-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                      <div className="text-[10px] font-bold text-neutral-400">
                        {typeof file.votesCount === 'number' ? file.votesCount : 0} {t.votesSuffix}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide">{dt.projectRating}</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{dt.ratingDesc}</p>
                    </div>
                  </div>

                  {/* interactive stars */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase">{dt.yourRating}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingSubmit(star)}
                          disabled={isRatingSubmitting}
                          className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              (userRating || Math.round(file.rating ?? 0)) >= star
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-300 dark:text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Statistics Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-50'}`}>
                    <div className="text-[10px] font-semibold text-neutral-500 uppercase font-mono mb-0.5">{dt.size}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100 font-mono">{formatBytes(file.size)}</div>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-50'}`}>
                    <div className="text-[10px] font-semibold text-neutral-500 uppercase font-mono mb-0.5">{dt.views}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100 font-mono flex items-center justify-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      {file.views}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-50'}`}>
                    <div className="text-[10px] font-semibold text-neutral-500 uppercase font-mono mb-0.5">{dt.downloads}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100 font-mono flex items-center justify-center gap-1">
                      <Download className="w-3.5 h-3.5 text-neutral-400" />
                      {file.downloads}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-neutral-800/50' : 'bg-neutral-50'}`}>
                    <div className="text-[10px] font-semibold text-neutral-500 uppercase font-mono mb-0.5">{dt.reports}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-100 font-mono flex items-center justify-center gap-1">
                      <Flag className="w-3.5 h-3.5 text-red-400" />
                      {file.reports ? file.reports.length : 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags block */}
              {file.tags && file.tags.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{dt.tags}</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold bg-sky-500/10 text-sky-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">{dt.fileDescription}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/35 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/40 whitespace-pre-wrap">
                  {file.description || dt.noDescription}
                </p>
              </div>

              {/* Extra Metadata */}
              <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800/60 pt-4 text-xs space-y-1.5 font-mono text-neutral-500">
                <div className="flex justify-between">
                  <span>{dt.originalName}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{file.originalName}</span>
                </div>
                <div className="flex justify-between">
                  <span>{dt.uploadDate}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{formatDate(file.uploadDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{dt.formatCategory}</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 uppercase">{file.type} ({file.extension})</span>
                </div>
              </div>
            </div>
          )}


          {/* TAB 2: ANTIVIRUS SECURITY SCAN */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              {/* Security Health status box */}
              <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
                file.status === 'Revisado' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : file.status === 'Amenaza detectada'
                  ? 'bg-red-500/10 border-red-500/20 text-red-500'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
              }`}>
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 shadow">
                  {file.status === 'Revisado' && <ShieldCheck className="w-8 h-8" />}
                  {file.status === 'Pendiente' && <AlertTriangle className="w-8 h-8" />}
                  {file.status === 'Amenaza detectada' && <ShieldAlert className="w-8 h-8" />}
                </div>

                <div>
                  <h4 className="font-bold text-base">
                    {file.status === 'Revisado' && dt.statusSafe}
                    {file.status === 'Pendiente' && dt.statusPending}
                    {file.status === 'Amenaza detectada' && dt.statusThreat}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {file.status === 'Revisado' && dt.safeDesc}
                    {file.status === 'Pendiente' && dt.pendingDesc}
                    {file.status === 'Amenaza detectada' && dt.threatDesc}
                  </p>
                </div>
              </div>

              {/* Antivirus log breakdown */}
              <div className="space-y-3">
                <button
                  id="toggle-security-logs-btn"
                  onClick={() => setShowSecurityLogs(!showSecurityLogs)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-xs font-semibold cursor-pointer ${
                    isDark ? 'bg-neutral-800/60' : 'bg-neutral-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-mono">
                    <Terminal className="w-4 h-4 text-sky-500" />
                    {dt.inspectLogs} ({file.securityScanLog.length} {dt.lines})
                  </span>
                  {showSecurityLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showSecurityLogs && (
                  <div className="p-4 bg-neutral-950 text-neutral-400 rounded-xl font-mono text-[11px] leading-relaxed space-y-1.5 border border-neutral-800 shadow-inner">
                    {file.securityScanLog.map((log, i) => (
                      <div key={i} className={log.includes('ALERTA') || log.includes('Amenaza') ? 'text-red-400 font-bold' : log.includes('🟢') || log.includes('limpio') ? 'text-emerald-400' : ''}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick warning tips */}
              <div className="text-xs text-neutral-500 space-y-2 border-t pt-4 border-neutral-100 dark:border-neutral-800/60 leading-relaxed">
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">{dt.howSecurityWorks}</p>
                <p>{dt.secStep1}</p>
                <p>{dt.secStep2}</p>
                <p>{dt.secStep3}</p>
              </div>
            </div>
          )}


          {/* TAB 3: COMMENTS FEED */}
          {activeTab === 'comments' && (
            <div className="space-y-6 animate-fade-in">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-wider font-mono">
                {dt.commentsAndFeedback} ({file.comments ? file.comments.length : 0})
              </h4>

              {/* Comment submission form */}
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <input
                    id="comment-author-input"
                    type="text"
                    placeholder={dt.aliasPlaceholder}
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold outline-none border focus:ring-2 focus:ring-sky-500 w-1/3 ${
                      isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  />
                  <input
                    id="comment-text-input"
                    type="text"
                    placeholder={dt.commentPlaceholder}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-xs outline-none border focus:ring-2 focus:ring-sky-500 flex-1 ${
                      isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                    required
                  />
                  <button
                    id="submit-comment-btn"
                    type="submit"
                    disabled={isCommentSubmitting || !commentText.trim()}
                    style={{ backgroundColor: themeAccentColor }}
                    className="px-4 py-2.5 rounded-xl text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Comments Feed List */}
              <div className="space-y-3.5">
                {!file.comments || file.comments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-neutral-500">
                    {dt.noComments}
                  </div>
                ) : (
                  [...file.comments].reverse().map((comment) => (
                    <div 
                      key={comment.id} 
                      className={`p-3.5 rounded-2xl border flex items-start gap-3.5 ${
                        isDark ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm uppercase">
                        {comment.author.substring(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">{comment.author}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}


          {/* TAB 4: FILE VERSIONS */}
          {activeTab === 'versions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-wider font-mono">
                  {dt.versionHistory}
                </h4>
                <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] font-bold text-neutral-500">
                  {dt.currentVersion} v{file.version || '1.0.0'}
                </span>
              </div>

              <div className="space-y-3">
                {/* Current / Active version row */}
                <div className={`p-4 rounded-2xl border-2 border-emerald-500/20 flex items-center justify-between ${
                  isDark ? 'bg-emerald-500/5' : 'bg-emerald-50/20'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">{dt.activeVersionTag}</span>
                    <h5 className="text-sm font-bold text-neutral-800 dark:text-white">v{file.version || '1.0.0'}</h5>
                    <p className="text-[10px] text-neutral-400 font-mono">{formatDate(file.uploadDate)} • {formatBytes(file.size)}</p>
                  </div>
                  <button
                    id="download-active-ver-btn"
                    onClick={() => triggerDownload()}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-white hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {dt.downloadVersion}
                  </button>
                </div>

                {/* Previous versions list */}
                {!file.previousVersions || file.previousVersions.length === 0 ? (
                  <div className="text-center py-6 text-xs text-neutral-500 border border-dashed rounded-2xl border-neutral-200 dark:border-neutral-800">
                    {dt.noPreviousVersions}
                  </div>
                ) : (
                  [...file.previousVersions].reverse().map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        isDark ? 'bg-neutral-800/20 border-neutral-700/40' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h6 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">v{item.version}</h6>
                          <span className="text-[9px] font-mono text-neutral-400">{dt.previousTag}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{formatDate(item.uploadDate)} • {formatBytes(item.size)}</p>
                      </div>

                      <button
                        id={`download-prev-ver-${i}`}
                        onClick={() => triggerDownload(item.version)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        {dt.downloadVersion}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}


          {/* TAB 5: REPORT FILE */}
          {activeTab === 'report' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-2 mb-4">
                <h4 className="text-base font-bold text-neutral-800 dark:text-white">{dt.reportSuspicious}</h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  {dt.reportDesc}
                </p>
              </div>

              {reportSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h5 className="font-semibold text-sm text-neutral-800 dark:text-white">{dt.reportSuccess}</h5>
                  <p className="text-xs text-neutral-500">{dt.reportSuccessSub}</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  {/* Reasons Options Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase font-mono mb-2">
                      {dt.selectMainReason}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {reportReasons.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setReportReason(reason)}
                          className={`px-3 py-2 text-left text-xs font-semibold rounded-xl border transition-all cursor-pointer truncate ${
                            reportReason === reason
                              ? 'border-red-500 bg-red-500/10 text-red-500'
                              : isDark
                              ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-800/40'
                              : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase font-mono mb-2">
                      {dt.addDetailsOptional}
                    </label>
                    <textarea
                      id="report-comments-input"
                      value={reportComments}
                      onChange={(e) => setReportComments(e.target.value)}
                      placeholder={dt.reportPlaceholder}
                      rows={3}
                      className={`w-full rounded-xl border px-4 py-3 text-xs outline-none focus:ring-2 resize-none ${
                        isDark 
                          ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-red-500' 
                          : 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:ring-red-500'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      id="submit-report-btn"
                      type="submit"
                      disabled={submittingReport}
                      className="px-5 py-3 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-colors shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {submittingReport ? dt.sending : dt.sendReport}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Actions Footer Bar */}
        {activeTab === 'info' && (
          <div className="p-5 border-t border-neutral-100 dark:border-neutral-800/60 shrink-0 flex items-center justify-between gap-3">
            <button
              id="report-shortcut-btn"
              onClick={() => setActiveTab('report')}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              {dt.reportBtn}
            </button>

            <div className="flex items-center gap-2">
              <button
                id="modal-share-btn"
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                {dt.shareBtn}
              </button>

              <button
                id="modal-download-btn"
                onClick={handleDownloadClick}
                style={{ backgroundColor: file.status === 'Amenaza detectada' ? '#ef4444' : themeAccentColor }}
                className="px-5 py-2.5 rounded-xl font-bold text-white text-xs hover:opacity-90 transition-opacity shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {dt.downloadFileBtn}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* --- QR CODE GENERATED VIEW POPUP --- */}
      {showQrModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl p-6 text-center ${
            isDark ? 'bg-neutral-900 border border-neutral-800 text-white' : 'bg-white border border-neutral-200 text-neutral-800'
          } shadow-2xl space-y-4`}>
            <div>
              <h4 className="font-bold text-base md:text-lg">{dt.shareQrTitle}</h4>
              <p className="text-[11px] text-neutral-500 mt-1">{dt.shareQrDesc}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl flex items-center justify-center border border-neutral-200 max-w-[200px] mx-auto shadow-inner">
              <img
                src={qrCodeUrl}
                alt="FileShare Link QR Code"
                className="w-[180px] h-[180px]"
              />
            </div>

            <p className="text-[10px] font-mono text-neutral-400 select-all truncate bg-neutral-100 dark:bg-neutral-800/80 p-2 rounded-lg">
              {fileShareUrl}
            </p>

            <div className="flex items-center justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
              <button
                id="close-qr-modal-btn"
                onClick={() => setShowQrModal(false)}
                className="w-full px-5 py-2.5 text-xs font-bold bg-sky-500 text-white hover:opacity-95 rounded-xl cursor-pointer"
              >
                {dt.gotIt}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- APK WARNING POPUP DIALOG --- */}
      {showApkWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 ${
            isDark ? 'bg-neutral-900 border border-neutral-800 text-white' : 'bg-white border border-neutral-200 text-neutral-800'
          } shadow-2xl space-y-4`}>
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-base md:text-lg">{dt.apkWarningTitle}</h4>
            </div>

            <div className="text-xs leading-relaxed space-y-2 text-neutral-500 dark:text-neutral-400">
              <p>{dt.apkWarning1}</p>
              <p>{dt.apkWarning2}</p>
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">{dt.apkWarning3}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
              <button
                id="cancel-apk-download-btn"
                onClick={() => setShowApkWarning(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 rounded-lg cursor-pointer"
              >
                {settings.language === 'en' ? 'Cancel' : settings.language === 'pt' ? 'Cancelar' : settings.language === 'fr' ? 'Annuler' : settings.language === 'de' ? 'Abbrechen' : settings.language === 'it' ? 'Annulla' : settings.language === 'ja' ? 'キャンセル' : settings.language === 'ko' ? '취소' : settings.language === 'zh' ? '取消' : settings.language === 'ru' ? 'Отмена' : 'Cancelar'}
              </button>
              <button
                id="confirm-apk-download-btn"
                onClick={() => triggerDownload()}
                style={{ backgroundColor: themeAccentColor }}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow"
              >
                {dt.downloadAnyway}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTIVE THREAT / MULTIPLE REPORTS WARNING POPUP DIALOG --- */}
      {showThreatWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 ${
            isDark ? 'bg-neutral-900 border border-red-900/40 text-white' : 'bg-white border border-red-200 text-neutral-800'
          } shadow-2xl space-y-4`}>
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-base md:text-lg">{dt.downloadBlockedTitle}</h4>
            </div>

            <div className="text-xs leading-relaxed space-y-2 text-neutral-500 dark:text-neutral-400">
              <p>{dt.downloadBlockedDesc1}</p>
              <p>{dt.downloadBlockedDesc2}</p>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
              <button
                id="close-threat-warning-btn"
                onClick={() => setShowThreatWarning(false)}
                className="px-5 py-2.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 rounded-lg cursor-pointer"
              >
                {dt.gotIt}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
