import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, Image as ImageIcon, Sparkles, AlertTriangle, ShieldCheck, Check, Share2, Download, ArrowRight, Loader, Info } from 'lucide-react';
import { AppSettings, FileMetadata } from '../types';
import { formatBytes } from './FileCard';
import { TranslationSchema } from '../lib/translations';

interface UploadFormProps {
  settings: AppSettings;
  onUploadSuccess: (file: FileMetadata) => void;
  onViewProjects: () => void;
  uploaderId: string;
  addNotification: (title: string, message: string, type: 'upload_start' | 'upload_progress' | 'upload_success' | 'upload_error' | 'download_start' | 'reported' | 'scanned' | 'deleted' | 'info') => void;
  addActivity: (action: string, details: string) => void;
  t: TranslationSchema;
}

export default function UploadForm({
  settings,
  onUploadSuccess,
  onViewProjects,
  uploaderId,
  addNotification,
  addActivity,
  t
}: UploadFormProps) {
  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [versionInput, setVersionInput] = useState('1.0.0');

  // Version update toggles
  const [isVersionUpdate, setIsVersionUpdate] = useState(false);
  const [existingFiles, setExistingFiles] = useState<FileMetadata[]>([]);
  const [selectedFileToUpdate, setSelectedFileToUpdate] = useState('');

  // Cover image states
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Upload progress states
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanStatus, setScanStatus] = useState<'uploading' | 'scanning' | 'completed'>('uploading');

  // Success result state
  const [uploadedResult, setUploadedResult] = useState<FileMetadata | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Theme Accent
  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  // Fetch uploader's existing files for version updates
  useEffect(() => {
    if (isVersionUpdate && uploaderId) {
      fetch(`/api/files?uploaderId=${encodeURIComponent(uploaderId)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setExistingFiles(data);
            if (data.length > 0) {
              setSelectedFileToUpdate(data[0].id);
              // auto populate description and tags
              setDescription(data[0].description || '');
              setTagsInput(data[0].tags ? data[0].tags.join(', ') : '');
              const prevVer = data[0].version || '1.0.0';
              // suggest next patch version if possible
              const parts = prevVer.split('.');
              if (parts.length === 3 && !isNaN(Number(parts[2]))) {
                parts[2] = String(Number(parts[2]) + 1);
                setVersionInput(parts.join('.'));
              } else {
                setVersionInput(prevVer + '.1');
              }
            }
          }
        })
        .catch(err => console.error('Error fetching user files:', err));
    }
  }, [isVersionUpdate, uploaderId]);

  // Handle main file choice
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    // Use original name as default (removing extension first)
    const lastDot = file.name.lastIndexOf('.');
    const baseName = lastDot !== -1 ? file.name.substring(0, lastDot) : file.name;
    setCustomName(baseName);
  };

  // Handle cover image choice
  const handleCoverChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      const lang = settings.language || 'es';
      const alertMsg = lang === 'en' ? 'Please select a valid cover image (PNG, JPG, WEBP).' :
                       lang === 'pt' ? 'Por favor, selecione uma imagem de capa válida (PNG, JPG, WEBP).' :
                       lang === 'fr' ? 'Veuillez sélectionner une image de couverture valide (PNG, JPG, WEBP).' :
                       lang === 'de' ? 'Bitte wählen Sie ein gültiges Cover-Bild (PNG, JPG, WEBP).' :
                       lang === 'it' ? 'Seleziona un’immagine di copertina valida (PNG, JPG, WEBP).' :
                       lang === 'ja' ? '有効なカバー画像を選択してください（PNG、JPG、WEBP）。' :
                       lang === 'ko' ? '올바른 커버 이미지(PNG, JPG, WEBP)를 선택하십시오.' :
                       lang === 'zh' ? '请选择有效的封面图片（PNG、JPG、WEBP）。' :
                       lang === 'ru' ? 'Пожалуйста, выберите допустимое изображение обложки (PNG, JPG, WEBP).' : 'Por favor selecciona una imagen de portada válida (PNG, JPG, WEBP).';
      alert(alertMsg);
      return;
    }
    setSelectedCover(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Upload function using real XMLHttpRequest for true percentage tracking
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setScanStatus('uploading');
    setScanLogs(['[Info] Iniciando subida del archivo al servidor...']);
    setUploadedResult(null);

    const formData = new FormData();
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
    const finalName = customName.trim() ? `${customName.trim()}${ext}` : selectedFile.name;

    formData.append('file', selectedFile);
    formData.append('name', finalName);
    formData.append('description', description);
    formData.append('uploaderId', uploaderId);
    formData.append('tags', tagsInput);
    formData.append('version', versionInput);

    if (isVersionUpdate && selectedFileToUpdate) {
      formData.append('updateFileId', selectedFileToUpdate);
    }

    if (selectedCover) {
      formData.append('cover', selectedCover);
    }

    // Trigger Notification for Upload Start
    const isEn = settings.language === 'en';
    const isPt = settings.language === 'pt';
    const isFr = settings.language === 'fr';
    const isDe = settings.language === 'de';
    const isIt = settings.language === 'it';
    const isJa = settings.language === 'ja';
    const isKo = settings.language === 'ko';
    const isZh = settings.language === 'zh';
    const isRu = settings.language === 'ru';

    const t_upload_started = isEn ? 'Upload started 📤' :
                             isPt ? 'Upload iniciado 📤' :
                             isFr ? 'Téléchargement démarré 📤' :
                             isDe ? 'Upload gestartet 📤' :
                             isIt ? 'Caricamento iniziato 📤' :
                             isJa ? 'アップロード開始 📤' :
                             isKo ? '업로드 시작 📤' :
                             isZh ? '上传已开始 📤' :
                             isRu ? 'Загрузка началась 📤' : 'Subida iniciada 📤';

    const t_upload_started_msg = isEn ? `Upload of "${finalName}" has started on the server.` :
                                 isPt ? `O envio de "${finalName}" foi iniciado no servidor.` :
                                 isFr ? `Le téléchargement de "${finalName}" a commencé sur le serveur.` :
                                 isDe ? `Der Upload von "${finalName}" auf den Server wurde gestartet.` :
                                 isIt ? `Il caricamento di "${finalName}" è iniziato sul server.` :
                                 isJa ? `"${finalName}" のサーバーへのアップロードが開始されました。` :
                                 isKo ? `"${finalName}"의 서버 업로드가 시작되었습니다.` :
                                 isZh ? `"${finalName}" 已开始向服务器上传。` :
                                 isRu ? `Загрузка "${finalName}" на сервер запущена.` : `Se ha iniciado la subida de "${finalName}" al servidor.`;

    const t_upload_started_act = isEn ? `Started uploading: ${finalName}` :
                                 isPt ? `Iniciou o envio de: ${finalName}` :
                                 isFr ? `Début du téléchargement de : ${finalName}` :
                                 isDe ? `Upload gestartet für: ${finalName}` :
                                 isIt ? `Caricamento avviato per: ${finalName}` :
                                 isJa ? `アップロードを開始しました: ${finalName}` :
                                 isKo ? `업로드 시작됨: ${finalName}` :
                                 isZh ? `已开始上传：${finalName}` :
                                 isRu ? `Начата загрузка: ${finalName}` : `Iniciaste la subida de: ${finalName}`;

    addNotification(
      t_upload_started,
      t_upload_started_msg,
      'upload_start'
    );
    addActivity('upload_start', t_upload_started_act);

    const xhr = new XMLHttpRequest();
    const startTime = Date.now();

    let notified25 = false;
    let notified50 = false;
    let notified75 = false;

    const getProgressNotifTitle = (pct: number) => {
      if (isEn) return `Progress ${pct}% 📊`;
      if (isPt) return `Progresso ${pct}% 📊`;
      if (isFr) return `Progression ${pct}% 📊`;
      if (isDe) return `Fortschritt ${pct}% 📊`;
      if (isIt) return `Progresso ${pct}% 📊`;
      if (isJa) return `進捗 ${pct}% 📊`;
      if (isKo) return `진행률 ${pct}% 📊`;
      if (isZh) return `进度 ${pct}% 📊`;
      if (isRu) return `Прогресс ${pct}% 📊`;
      return `Lleva ${pct}% 📊`;
    };

    const getProgressNotifMsg = (pct: number, name: string) => {
      if (isEn) {
        if (pct === 25) return `Your file "${name}" is 25% uploaded.`;
        if (pct === 50) return `Your file "${name}" is half uploaded (50%).`;
        return `Your file "${name}" is almost done (75%).`;
      }
      if (isPt) {
        if (pct === 25) return `Seu arquivo "${name}" está com 25% enviado.`;
        if (pct === 50) return `Seu arquivo "${name}" está na metade (50%).`;
        return `Seu arquivo "${name}" está quase no fim (75%).`;
      }
      if (isFr) {
        if (pct === 25) return `Votre fichier "${name}" est téléchargé à 25%.`;
        if (pct === 50) return `Votre fichier "${name}" est à moitié téléchargé (50%).`;
        return `Votre fichier "${name}" est presque terminé (75%).`;
      }
      if (isDe) {
        if (pct === 25) return `Deine Datei "${name}" ist zu 25% hochgeladen.`;
        if (pct === 50) return `Deine Datei "${name}" ist zur Hälfte hochgeladen (50%).`;
        return `Deine Datei "${name}" ist fast fertig (75%).`;
      }
      if (isIt) {
        if (pct === 25) return `Il tuo file "${name}" è caricato al 25%.`;
        if (pct === 50) return `Il tuo file "${name}" è a metà del caricamento (50%).`;
        return `Il tuo file "${name}" è quasi completo (75%).`;
      }
      if (isJa) {
        if (pct === 25) return `ファイル "${name}" の25%がアップロードされました。`;
        if (pct === 50) return `ファイル "${name}" の半分（50%）がアップロードされました。`;
        return `ファイル "${name}" のアップロードが間もなく完了します（75%）。`;
      }
      if (isKo) {
        if (pct === 25) return `파일 "${name}"이(가) 25% 업로드되었습니다.`;
        if (pct === 50) return `파일 "${name}"이(가) 절반(50%) 업로드되었습니다.`;
        return `파일 "${name}"이(가) 거의 다 되었습니다(75%).`;
      }
      if (isZh) {
        if (pct === 25) return `您的文件 "${name}" 已上传 25%。`;
        if (pct === 50) return `您的文件 "${name}" 已上传过半 (50%)。`;
        return `您的文件 "${name}" 即将上传完成 (75%)。`;
      }
      if (isRu) {
        if (pct === 25) return `Ваш файл "${name}" загружен на 25%.`;
        if (pct === 50) return `Ваш файл "${name}" загружен наполовину (50%).`;
        return `Ваш файл "${name}" почти загружен (75%).`;
      }
      if (pct === 25) return `Tu archivo "${name}" va por el 25% de subida.`;
      if (pct === 50) return `Tu archivo "${name}" va por la mitad (50%).`;
      return `Tu archivo "${name}" ya casi termina (75%).`;
    };

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);

        // Progress threshold notifications
        if (percentComplete >= 25 && !notified25) {
          notified25 = true;
          addNotification(getProgressNotifTitle(25), getProgressNotifMsg(25, finalName), 'upload_progress');
        }
        if (percentComplete >= 50 && !notified50) {
          notified50 = true;
          addNotification(getProgressNotifTitle(50), getProgressNotifMsg(50, finalName), 'upload_progress');
        }
        if (percentComplete >= 75 && !notified75) {
          notified75 = true;
          addNotification(getProgressNotifTitle(75), getProgressNotifMsg(75, finalName), 'upload_progress');
        }

        // Speed and remaining computation
        const elapsedTimeMs = Date.now() - startTime;
        const elapsedSeconds = elapsedTimeMs / 1000;
        
        if (elapsedSeconds > 0) {
          const bytesPerSecond = event.loaded / elapsedSeconds;
          setUploadSpeed(`${formatBytes(bytesPerSecond)}/s`);

          const remainingBytes = event.total - event.loaded;
          const remainingSeconds = Math.round(remainingBytes / bytesPerSecond);
          
          if (remainingSeconds > 60) {
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            const text_remaining = isEn ? `${minutes}m ${seconds}s remaining` :
                                   isPt ? `${minutes}m ${seconds}s restantes` :
                                   isFr ? `${minutes}m ${seconds}s restants` :
                                   isDe ? `noch ${minutes}m ${seconds}s` :
                                   isIt ? `${minutes}m ${seconds}s rimanenti` :
                                   isJa ? `残り ${minutes}分 ${seconds}秒` :
                                   isKo ? `${minutes}분 ${seconds}초 남음` :
                                   isZh ? `剩余 ${minutes}分 ${seconds}秒` :
                                   isRu ? `осталось ${minutes}м ${seconds}с` : `${minutes}m ${seconds}s restantes`;
            setTimeRemaining(text_remaining);
          } else {
            const text_remaining_sec = isEn ? `${remainingSeconds}s remaining` :
                                       isPt ? `${remainingSeconds}s restantes` :
                                       isFr ? `${remainingSeconds}s restants` :
                                       isDe ? `noch ${remainingSeconds}s` :
                                       isIt ? `${remainingSeconds}s rimanenti` :
                                       isJa ? `残り ${remainingSeconds}秒` :
                                       isKo ? `${remainingSeconds}초 남음` :
                                       isZh ? `剩余 ${remainingSeconds}秒` :
                                       isRu ? `осталось ${remainingSeconds}с` : `${remainingSeconds}s restantes`;
            setTimeRemaining(text_remaining_sec);
          }
        }
      }
    });

    xhr.onload = () => {
      if (xhr.status === 201 || xhr.status === 200) {
        try {
          const resData: FileMetadata = JSON.parse(xhr.responseText);
          
          // Switch to scanning view
          setScanStatus('scanning');
          
          const stepInfo = isEn ? `[Info] File successfully transferred (${formatBytes(selectedFile.size)}).` :
                           isPt ? `[Info] Arquivo transferido com sucesso (${formatBytes(selectedFile.size)}).` :
                           isFr ? `[Info] Fichier transféré avec succès (${formatBytes(selectedFile.size)}).` :
                           isDe ? `[Info] Datei erfolgreich übertragen (${formatBytes(selectedFile.size)}).` :
                           isIt ? `[Info] File trasferito con successo (${formatBytes(selectedFile.size)}).` :
                           isJa ? `[情報] ファイルが正常に転送されました (${formatBytes(selectedFile.size)})。` :
                           isKo ? `[정보] 파일이 성공적으로 전송되었습니다 (${formatBytes(selectedFile.size)})。` :
                           isZh ? `[信息] 文件传输成功 (${formatBytes(selectedFile.size)})。` :
                           isRu ? `[Информация] Файл успешно передан (${formatBytes(selectedFile.size)}).` :
                           `[Info] Archivo transferido con éxito (${formatBytes(selectedFile.size)}).`;

          const stepSec = isEn ? `[Security] Starting real-time malware scanner...` :
                          isPt ? `[Segurança] Iniciando escaneamento de malware em tempo real...` :
                          isFr ? `[Sécurité] Lancement du scanner de logiciels malveillants en temps réel...` :
                          isDe ? `[Sicherheit] Echtzeit-Malware-Scanner wird gestartet...` :
                          isIt ? `[Sicurezza] Avvio dello scanner malware in tempo real...` :
                          isJa ? `[セキュリティ] リアルタイムマルウェアスキャナーを開始しています...` :
                          isKo ? `[보안] 실시간 악성코드 검사기를 시작하는 중...` :
                          isZh ? `[安全] 正在启动实时恶意软件扫描...` :
                          isRu ? `[Безопасность] Запуск сканера вредоносных программ в реальном времени...` :
                          `[Seguridad] Iniciando escáner de malware en tiempo real...`;

          setScanLogs(prev => [
            ...prev,
            stepInfo,
            stepSec
          ]);

          // Trigger scan start notification
          const t_scan_started_title = isEn ? 'Scanning file 🛡️' :
                                       isPt ? 'Analisando arquivo 🛡️' :
                                       isFr ? 'Analyse du fichier 🛡️' :
                                       isDe ? 'Datei wird analysiert 🛡️' :
                                       isIt ? 'Scansione file 🛡️' :
                                       isJa ? 'ファイルをスキャン中 🛡️' :
                                       isKo ? '파일 스캔 중 🛡️' :
                                       isZh ? '正在扫描文件 🛡️' :
                                       isRu ? 'Сканирование файла 🛡️' : 'Analizando archivo 🛡️';

          const t_scan_started_msg = isEn ? `Your file "${finalName}" is being audited for security threats.` :
                                     isPt ? `Seu arquivo "${finalName}" está sendo auditado contra ameaças de segurança.` :
                                     isFr ? `Votre fichier "${finalName}" est en cours de vérification de sécurité.` :
                                     isDe ? `Deine Datei "${finalName}" wird auf Sicherheitsbedrohungen überprüft.` :
                                     isIt ? `Il tuo file "${finalName}" è in fase di verifica di sicurezza.` :
                                     isJa ? `ファイル "${finalName}" がセキュリティ脅威のスキャン対象となっています。` :
                                     isKo ? `"${finalName}" 파일의 보안 위협 스캔을 시작합니다.` :
                                     isZh ? `正在对您的文件 "${finalName}" 进行安全威胁审计。` :
                                     isRu ? `Ваш файл "${finalName}" проверяется на наличие угроз безопасности.` : `Tu archivo "${finalName}" se está auditando contra amenazas de seguridad.`;

          addNotification(
            t_scan_started_title,
            t_scan_started_msg,
            'scanned'
          );

          // Simulate scanning steps
          let step = 0;
          const scanSteps = isEn ? [
            'Calculating file MD5 hash signature...',
            'Comparing signatures with ClamAV database...',
            'Scanning for hidden code heuristics...',
            'Generating final security report...'
          ] : isPt ? [
            'Calculando assinatura hash MD5 do arquivo...',
            'Contrastando assinaturas com banco de dados ClamAV...',
            'Escaneando heurística de código oculto...',
            'Gerando relatório de segurança final...'
          ] : isFr ? [
            'Calcul de la signature de hachage MD5 du fichier...',
            'Comparaison des signatures avec la base de données ClamAV...',
            'Analyse heuristique du code caché...',
            'Génération du rapport de sécurité final...'
          ] : isDe ? [
            'Berechnung der MD5-Hash-Signatur der Datei...',
            'Abgleich der Signaturen mit der ClamAV-Datenbank...',
            'Scannen nach verstecktem Code (Heuristik)...',
            'Sicherheitsbericht wird erstellt...'
          ] : isIt ? [
            'Calcolo della firma hash MD5 del file...',
            'Confronto delle firme con il database ClamAV...',
            'Scansione euristica del codice nascosto...',
            'Generazione del rapporto di sicurezza finale...'
          ] : isJa ? [
            'ファイルのMD5ハッシュシグネチャを計算中...',
            'ClamAVデータベースとシグネチャを比較中...',
            '隠しコードのヒューリスティックをスキャン中...',
            '最終セキュリティレポートを作成中...'
          ] : isKo ? [
            '파일 MD5 해시 서명 계산 중...',
            'ClamAV 데이터베이스와 서명 비교 중...',
            '숨겨진 코드 휴리스틱 스캔 중...',
            '최종 보안 보고서 생성 중...'
          ] : isZh ? [
            '正在计算文件的 MD5 哈希特征...',
            '正在与 ClamAV 数据库比对特征...',
            '正在扫描隐藏代码启发式...',
            '正在生成最终安全报告...'
          ] : isRu ? [
            'Вычисление подписи MD5-хэша файла...',
            'Сравнение подписей с базой данных ClamAV...',
            'Эвристическое сканирование скрытого кода...',
            'Создание финального отчета по безопасности...'
          ] : [
            'Calculando firma hash MD5 del archivo...',
            'Contrastando firmas con base de datos ClamAV...',
            'Escaneando heurístico de código oculto...',
            'Generando reporte final de seguridad...'
          ];

          const scanInterval = setInterval(() => {
            if (step < scanSteps.length) {
              const labelScan = isEn ? '[Scanner]' : isPt ? '[Scanner]' : '[Analizador]';
              setScanLogs(prev => [...prev, `${labelScan} ${scanSteps[step]}`]);
              step++;
            } else {
              clearInterval(scanInterval);
              setScanStatus('completed');
              
              // Push backend logs
              setScanLogs(prev => [...prev, ...resData.securityScanLog]);
              setUploadedResult(resData);
              onUploadSuccess(resData);

              // Notify Scan complete & Success
              const t_scan_ok_title = isEn ? 'File scanned successfully 🛡__' :
                                      isPt ? 'Arquivo analisado corretamente 🛡__' :
                                      isFr ? 'Fichier analysé avec succès 🛡__' :
                                      isDe ? 'Datei erfolgreich analysiert 🛡__' :
                                      isIt ? 'File scansionato correttamente 🛡__' :
                                      isJa ? 'ファイルの検証が正常に完了しました 🛡__' :
                                      isKo ? '파일 스캔 완료 🛡__' :
                                      isZh ? '文件成功通过安全审核 🛡__' :
                                      isRu ? 'Файл успешно проверен 🛡__' : 'Archivo analizado correctamente 🛡️';

              const t_scan_ok_msg = isEn ? `Antivirus completed audit for "${finalName}". Status: ${resData.status}.` :
                                    isPt ? `O antivírus completou a auditoria de "${finalName}". Estado: ${resData.status}.` :
                                    isFr ? `L'antivirus a terminé l'analyse de "${finalName}". Statut : ${resData.status}.` :
                                    isDe ? `Antiviren-Überprüfung für "${finalName}" abgeschlossen. Status: ${resData.status}.` :
                                    isIt ? `L'antivirus ha completato la scansione di "${finalName}". Stato: ${resData.status}.` :
                                    isJa ? `"${finalName}" のセキュリティスキャンが終了しました。ステータス: ${resData.status}` :
                                    isKo ? `"${finalName}" 파일의 백신 검사가 완료되었습니다. 상태: ${resData.status}` :
                                    isZh ? `反病毒程序已完成对 "${finalName}" 的审核。状态：${resData.status}。` :
                                    isRu ? `Антивирус завершил проверку "${finalName}". Статус: ${resData.status}.` : `El antivirus completó la auditoría de "${finalName}". Estado: ${resData.status}.`;

              const t_upload_ok_title = isEn ? 'File uploaded successfully ✅' :
                                        isPt ? 'Arquivo enviado corretamente ✅' :
                                        isFr ? 'Fichier téléchargé avec succès ✅' :
                                        isDe ? 'Datei erfolgreich hochgeladen ✅' :
                                        isIt ? 'File caricato con successo ✅' :
                                        isJa ? 'ファイルのアップロードが成功しました ✅' :
                                        isKo ? '파일 업로드 성공 ✅' :
                                        isZh ? '文件上传成功 ✅' :
                                        isRu ? 'Файл успешно загружен ✅' : 'Archivo subido correctamente ✅';

              const t_upload_ok_msg = isEn ? `Your file "${finalName}" is now publicly available!` :
                                      isPt ? `Seu arquivo "${finalName}" já está disponível publicamente!` :
                                      isFr ? `Votre fichier "${finalName}" est maintenant disponible publiquement !` :
                                      isDe ? `Deine Datei "${finalName}" ist jetzt öffentlich verfügbar!` :
                                      isIt ? `Il tuo file "${finalName}" è ora disponibile pubblicamente!` :
                                      isJa ? `ファイル "${finalName}" が公開されました！` :
                                      isKo ? `"${finalName}" 파일이 이제 공개되었습니다!` :
                                      isZh ? `您的文件 "${finalName}" 现已向公众开放！` :
                                      isRu ? `Ваш файл "${finalName}" теперь доступен для скачивания!` : `¡Tu archivo "${finalName}" ya está disponible públicamente!`;

              const t_upload_ok_act = isEn ? `Successfully uploaded: ${finalName} (v${resData.version})` :
                                      isPt ? `Enviou com sucesso o arquivo: ${finalName} (v${resData.version})` :
                                      isFr ? `Fichier téléchargé avec succès : ${finalName} (v${resData.version})` :
                                      isDe ? `Datei erfolgreich hochgeladen: ${finalName} (v${resData.version})` :
                                      isIt ? `Caricato correttamente il file: ${finalName} (v${resData.version})` :
                                      isJa ? `ファイルをアップロードしました: ${finalName} (v${resData.version})` :
                                      isKo ? `파일 업로드 완료: ${finalName} (v${resData.version})` :
                                      isZh ? `成功上传文件：${finalName} (v${resData.version})` :
                                      isRu ? `Успешно загружен файл: ${finalName} (v${resData.version})` : `Subiste con éxito el archivo: ${finalName} (v${resData.version})`;

              addNotification(
                t_scan_ok_title,
                t_scan_ok_msg,
                'scanned'
              );
              addNotification(
                t_upload_ok_title,
                t_upload_ok_msg,
                'upload_success'
              );
              addActivity('upload_success', t_upload_ok_act);
            }
          }, 600);

        } catch (err) {
          const t_parse_err_log = isEn ? '[Error] Failed to parse security scanner response.' : '[Error] No se pudo procesar la respuesta del antivirus.';
          const t_err_title = isEn ? 'Upload failed ❌' : 'Error al subir ❌';
          const t_parse_err_msg = isEn ? `Parsing error while uploading "${finalName}".` : `Error de parseo al subir "${finalName}".`;

          setScanLogs(prev => [...prev, t_parse_err_log]);
          setUploading(false);
          addNotification(t_err_title, t_parse_err_msg, 'upload_error');
        }
      } else {
        const t_err_title = isEn ? 'Upload failed ❌' : 'Error al subir ❌';
        const t_err_server_msg = isEn ? `Server returned status code ${xhr.status} for "${finalName}".` : `Servidor devolvió código ${xhr.status} para "${finalName}".`;
        const t_err_alert = isEn ? 'Error uploading file. Please try again.' : 'Error al subir el archivo. Inténtalo de nuevo.';

        alert(t_err_alert);
        setUploading(false);
        addNotification(t_err_title, t_err_server_msg, 'upload_error');
      }
    };

    xhr.onerror = () => {
      const t_err_title = isEn ? 'Upload failed ❌' : 'Error al subir ❌';
      const t_network_msg = isEn ? `Network error while uploading "${finalName}".` : `Error de red al subir "${finalName}".`;
      const t_network_alert = isEn ? 'Connection error with the server.' : 'Error de conexión con el servidor.';

      alert(t_network_alert);
      setUploading(false);
      addNotification(t_err_title, t_network_msg, 'upload_error');
    };

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const handleShare = (file: FileMetadata) => {
    const shareUrl = `${window.location.origin}/file/${file.id}`;
    navigator.clipboard.writeText(shareUrl);
    const lang = settings.language || 'es';
    const alertMsg = lang === 'en' ? 'Link copied to clipboard!' :
                     lang === 'pt' ? 'Link copiado para a área de transferência!' :
                     lang === 'fr' ? 'Lien copié dans le presse-papiers !' :
                     lang === 'de' ? 'Link in die Zwischenablage kopiert!' :
                     lang === 'it' ? 'Link copiato negli appunti!' :
                     lang === 'ja' ? 'リンクがクリップボードにコピーされました！' :
                     lang === 'ko' ? '링크가 클립보드에 복사되었습니다!' :
                     lang === 'zh' ? '链接已复制到剪贴板！' :
                     lang === 'ru' ? 'Ссылка скопирована в буфер обмена!' : '¡Enlace copiado al portapapeles!';
    alert(alertMsg);
  };

  const handleDownload = (file: FileMetadata) => {
    window.open(`/api/download/${file.id}`, '_blank');
  };

  const isLiquid = settings.style === 'liquid-glass';
  const isDark = settings.theme === 'dark';

  const panelBg = isLiquid
    ? isDark
      ? 'bg-neutral-900/40 backdrop-blur-md border border-white/10 text-white'
      : 'bg-white/40 backdrop-blur-md border border-neutral-200 text-neutral-800'
    : isDark
    ? 'bg-neutral-900 border border-neutral-800 text-white'
    : 'bg-white border border-neutral-200 text-neutral-800';

  const boxBg = isDark ? 'bg-neutral-800/40' : 'bg-neutral-50';
  const inputClass = isDark 
    ? 'bg-neutral-800/80 border-neutral-700/80 text-white focus:ring-sky-500' 
    : 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:ring-sky-500';

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`p-6 md:p-8 rounded-3xl ${panelBg}`}>
        
        {/* State 1: Upload Form */}
        {!uploading && !uploadedResult && (
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <Upload className="w-6 h-6" style={{ color: themeAccentColor }} />
                {t.uploadNewFile}
              </h2>
              <p className="text-xs text-neutral-500">
                {t.uploadDesc}
              </p>
            </div>

            {/* Drag and Drop Box */}
            {!selectedFile ? (
              <div
                id="file-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 ${
                  isDragging
                    ? 'border-sky-500 bg-sky-500/5'
                    : isDark
                    ? 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/20'
                    : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100/50'
                }`}
              >
                <input
                  id="main-file-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {t.dragDropText}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {t.dragDropSub}
                  </p>
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl flex items-center justify-between border ${isDark ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
                    <File className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate pr-4 text-neutral-800 dark:text-neutral-100">{selectedFile.name}</div>
                    <div className="text-xs text-neutral-500 font-mono">{formatBytes(selectedFile.size)}</div>
                  </div>
                </div>
                <button
                  id="remove-selected-file-btn"
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setIsVersionUpdate(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  {t.changeBtn}
                </button>
              </div>
            )}

            {/* Version Update Switch */}
            {selectedFile && (
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'} space-y-3`}>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                      {t.isVersionUpdate}
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      {settings.language === 'en' ? 'Upload a new version for a file you already shared' :
                       settings.language === 'pt' ? 'Envie uma nova versão de um arquivo que você já compartilhou' :
                       settings.language === 'fr' ? 'Téléchargez une nouvelle version d\'un fichier déjà partagé' :
                       settings.language === 'de' ? 'Lade eine neue Version für eine bereits geteilte Datei hoch' :
                       settings.language === 'it' ? 'Carica una nuova versione di un file che hai già condiviso' :
                       settings.language === 'ja' ? '共有済みのファイルの新しいバージョンをアップロードする' :
                       settings.language === 'ko' ? '이미 공유한 파일의 새 버전을 업로드합니다' :
                       settings.language === 'zh' ? '为您已分享的文件上传一个新版本' :
                       settings.language === 'ru' ? 'Загрузить новую версию файла, которым вы уже поделились' : 'Sube una nueva versión para un archivo que ya compartiste'}
                    </span>
                  </div>
                  <input
                    id="is-version-switch"
                    type="checkbox"
                    checked={isVersionUpdate}
                    onChange={(e) => setIsVersionUpdate(e.target.checked)}
                    className="w-4 h-4 text-sky-500 rounded cursor-pointer"
                  />
                </div>

                {isVersionUpdate && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase font-mono">
                      {t.selectExistingFile}
                    </label>
                    {existingFiles.length === 0 ? (
                      <div className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        {settings.language === 'en' ? 'You haven\'t uploaded any files previously in this browser.' :
                         settings.language === 'pt' ? 'Você não enviou nenhum arquivo anteriormente neste navegador.' :
                         settings.language === 'fr' ? 'Vous n\'avez téléchargé aucun fichier auparavant sur ce navigateur.' :
                         settings.language === 'de' ? 'Du hast in diesem Browser bisher noch keine Dateien hochgeladen.' :
                         settings.language === 'it' ? 'Non hai caricato alcun file in precedenza in questo browser.' :
                         settings.language === 'ja' ? 'このブラウザで以前にアップロードしたファイルはありません。' :
                         settings.language === 'ko' ? '이 브라우저에서 이전에 업로드한 파일이 없습니다.' :
                         settings.language === 'zh' ? '您此前未在此浏览器中上传过任何文件。' :
                         settings.language === 'ru' ? 'Ранее вы не загружали файлы в этом браузере.' : 'No has subido ningún archivo previamente en este navegador.'}
                      </div>
                    ) : (
                      <select
                        id="update-file-selector"
                        value={selectedFileToUpdate}
                        onChange={(e) => {
                          const fileId = e.target.value;
                          setSelectedFileToUpdate(fileId);
                          const chosen = existingFiles.find(f => f.id === fileId);
                          if (chosen) {
                            setDescription(chosen.description || '');
                            setTagsInput(chosen.tags ? chosen.tags.join(', ') : '');
                          }
                        }}
                        className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none ${inputClass}`}
                      >
                        {existingFiles.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} (v{f.version || '1.0.0'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Editable Metadata Fields */}
            {selectedFile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Inputs Columns */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase font-mono">
                      {t.fileNameLabel}
                    </label>
                    <input
                      id="file-name-input"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder={settings.language === 'en' ? 'e.g. My Awesome Project' :
                                   settings.language === 'pt' ? 'Ex: Meu Projeto Incrível' :
                                   settings.language === 'fr' ? 'Ex. Mon projet incroyable' :
                                   settings.language === 'de' ? 'z. B. Mein fantastisches Projekt' :
                                   settings.language === 'it' ? 'Es. Il mio fantastico progetto' :
                                   settings.language === 'ja' ? '例：私の素晴らしいプロジェクト' :
                                   settings.language === 'ko' ? '예: 나의 멋진 프로젝트' :
                                   settings.language === 'zh' ? '例如：我的超赞项目' :
                                   settings.language === 'ru' ? 'Например: Мой потрясающий проект' : 'Ej. Mi Proyecto Increíble'}
                      className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ${inputClass}`}
                      required
                    />
                    <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                      {settings.language === 'en' ? 'Original extension' :
                       settings.language === 'pt' ? 'Extensão original' :
                       settings.language === 'fr' ? 'Extension originale' :
                       settings.language === 'de' ? 'Originale Dateiendung' :
                       settings.language === 'it' ? 'Estensione originale' :
                       settings.language === 'ja' ? '元の拡張子' :
                       settings.language === 'ko' ? '원래 확장자' :
                       settings.language === 'zh' ? '原始后缀' :
                       settings.language === 'ru' ? 'Исходное расширение' : 'Extensión original'}: {selectedFile.name.substring(selectedFile.name.lastIndexOf('.'))}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase font-mono">
                      {t.fileDescLabel}
                    </label>
                    <textarea
                      id="file-desc-input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={settings.language === 'en' ? 'Write file details, version notes, installation instructions or changes...' :
                                   settings.language === 'pt' ? 'Escreva detalhes do arquivo, notas de versão, instruções de instalação ou alterações...' :
                                   settings.language === 'fr' ? 'Écrivez des détails sur le fichier, des notes de version, des instructions d\'installation ou des modifications...' :
                                   settings.language === 'de' ? 'Schreiben Sie Dateidetails, Versionshinweise, Installationsanweisungen oder Änderungen...' :
                                   settings.language === 'it' ? 'Scrivi dettagli del file, note sulla versione, istruzioni di installazione o modifiche...' :
                                   settings.language === 'ja' ? 'ファイルの詳細、バージョンの注意書き、インストール手順、または変更点を入力してください...' :
                                   settings.language === 'ko' ? '파일 상세 내용, 버전 노트, 설치 지침 또는 변경 사항을 작성하십시오...' :
                                   settings.language === 'zh' ? '编写文件详细信息、版本说明、安装指南或变更记录...' :
                                   settings.language === 'ru' ? 'Опишите детали файла, примечания к версии, инструкции по установке или изменения...' : 'Escribe detalles del archivo, versión, notas de instalación o cambios...'}
                      rows={4}
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 resize-none ${inputClass}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase font-mono">
                        {t.tagsLabel}
                      </label>
                      <input
                        id="file-tags-input"
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder={t.tagsPlaceholder}
                        className={`w-full rounded-xl border px-3 py-2.5 text-xs outline-none ${inputClass}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase font-mono">
                        {t.versionLabel}
                      </label>
                      <input
                        id="file-version-input"
                        type="text"
                        value={versionInput}
                        onChange={(e) => setVersionInput(e.target.value)}
                        placeholder={t.versionPlaceholder}
                        className={`w-full rounded-xl border px-3 py-2.5 text-xs outline-none ${inputClass}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Image Column */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase font-mono">
                    {t.coverImageLabel}
                  </label>
                  
                  <div
                    id="cover-dropzone"
                    onClick={() => coverInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed aspect-square flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden transition-all ${
                      isDark 
                        ? 'border-neutral-800 bg-neutral-800/20 hover:bg-neutral-800/30' 
                        : 'border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      id="cover-file-input"
                      type="file"
                      ref={coverInputRef}
                      onChange={(e) => e.target.files && handleCoverChange(e.target.files[0])}
                      accept="image/*"
                      className="hidden"
                    />

                    {coverPreview ? (
                      <>
                        <img
                          src={coverPreview}
                          alt="Preview Cover"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">{t.changeBtn}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                          {settings.language === 'en' ? 'Add Cover' :
                           settings.language === 'pt' ? 'Adicionar Capa' :
                           settings.language === 'fr' ? 'Ajouter une couverture' :
                           settings.language === 'de' ? 'Cover hinzufügen' :
                           settings.language === 'it' ? 'Aggiungi Copertina' :
                           settings.language === 'ja' ? 'カバーを追加' :
                           settings.language === 'ko' ? '커버 이미지 추가' :
                           settings.language === 'zh' ? '添加封面' :
                           settings.language === 'ru' ? 'Добавить обложку' : 'Añadir portada'}
                        </span>
                        <span className="text-[10px] text-neutral-500 mt-1">{t.coverImageDesc}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Buttons Row */}
            {selectedFile && (
              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800/80 pt-6">
                <button
                  id="cancel-upload-btn"
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setSelectedCover(null);
                    setCoverPreview(null);
                    setIsVersionUpdate(false);
                  }}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  id="start-upload-btn"
                  type="submit"
                  style={{ backgroundColor: themeAccentColor }}
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  {t.startUploadBtn}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        )}

        {/* State 2: Upload Progress & Antivirus Scan */}
        {uploading && !uploadedResult && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white">
                {scanStatus === 'uploading' ? t.statusUploading : t.statusScanning}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {scanStatus === 'uploading' 
                  ? (settings.language === 'en' ? 'Transferring metadata to server' :
                     settings.language === 'pt' ? 'Transferindo metadados para o servidor' :
                     settings.language === 'fr' ? 'Transfert des métadonnées vers le serveur' :
                     settings.language === 'de' ? 'Metadaten werden an den Server übertragen' :
                     settings.language === 'it' ? 'Trasferimento dei metadati al server' :
                     settings.language === 'ja' ? 'メタデータをサーバーに転送中' :
                     settings.language === 'ko' ? '메타데이터를 서버로 전송 중' :
                     settings.language === 'zh' ? '正在向服务器传输元数据' :
                     settings.language === 'ru' ? 'Передача метаданных на сервер' : 'Transfiriendo metadatos al servidor')
                  : (settings.language === 'en' ? 'Checking integrity and virus signatures' :
                     settings.language === 'pt' ? 'Verificando integridade e assinaturas de vírus' :
                     settings.language === 'fr' ? 'Vérification de l\'intégrité et des signatures de virus' :
                     settings.language === 'de' ? 'Überprüfung der Integrität und Virensignaturen' :
                     settings.language === 'it' ? 'Verifica dell\'integrità e delle firme dei virus' :
                     settings.language === 'ja' ? '整合性とウイルスシグネチャを検証中' :
                     settings.language === 'ko' ? '무결성 및 바이러스 서명 확인 중' :
                     settings.language === 'zh' ? '正在检查完整性和病毒特征码' :
                     settings.language === 'ru' ? 'Проверка целостности и сигнатур вирусов' : 'Comprobando integridad y firmas de virus')}
              </p>
            </div>

            {/* Dynamic visual slider */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-bold font-mono text-neutral-400">
                <span>
                  {scanStatus === 'uploading'
                    ? (settings.language === 'en' ? 'UPLOADING' :
                       settings.language === 'pt' ? 'ENVIANDO' :
                       settings.language === 'fr' ? 'TÉLÉCHARGEMENT' :
                       settings.language === 'de' ? 'UPLOADE' :
                       settings.language === 'it' ? 'CARICAMENTO' :
                       settings.language === 'ja' ? 'アップロード中' :
                       settings.language === 'ko' ? '업로드 중' :
                       settings.language === 'zh' ? '正在上传' :
                       settings.language === 'ru' ? 'ЗАГРУЗКА' : 'SUBIDA')
                    : (settings.language === 'en' ? 'SCANNING' :
                       settings.language === 'pt' ? 'ANALISANDO' :
                       settings.language === 'fr' ? 'ANALYSE' :
                       settings.language === 'de' ? 'SCANNEN' :
                       settings.language === 'it' ? 'SCANSIONE' :
                       settings.language === 'ja' ? 'スキャン中' :
                       settings.language === 'ko' ? '검사 중' :
                       settings.language === 'zh' ? '正在扫描' :
                       settings.language === 'ru' ? 'АНАЛИЗ' : 'ANÁLISIS')}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, backgroundColor: themeAccentColor }}
                />
              </div>

              {scanStatus === 'uploading' && (
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>{t.uploadSpeedLabel}: {uploadSpeed || 'Calculando...'}</span>
                  <span>{t.timeRemainingLabel}: {timeRemaining || 'Calculando...'}</span>
                </div>
              )}
            </div>

            {/* Antivirus Live Console */}
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 text-white text-[10px] font-mono font-bold rounded-t-xl border-b border-neutral-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  SHELL: CLAMAV_ENGINE_SCANNER
                </span>
                <span>ID: {selectedFile?.name.substring(selectedFile.name.lastIndexOf('.')) || 'FILE'}</span>
              </div>
              <div className="p-4 bg-neutral-950 rounded-b-xl max-h-[160px] overflow-y-auto font-mono text-xs text-neutral-400 space-y-1.5 border border-neutral-800 shadow-inner">
                {scanLogs.map((log, i) => (
                  <div key={i} className={log.includes('ALERTA') || log.includes('Amenaza') ? 'text-red-400' : log.includes('limpio') || log.includes('🟢') ? 'text-emerald-400' : ''}>
                    {log}
                  </div>
                ))}
                <div className="flex items-center gap-1 text-sky-500 text-[11px] font-semibold animate-pulse pt-1">
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Upload Complete Results Card */}
        {uploadedResult && (
          <div className="space-y-6 py-2">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                  {settings.language === 'en' ? 'File Uploaded Successfully!' :
                   settings.language === 'pt' ? 'Arquivo Enviado com Sucesso!' :
                   settings.language === 'fr' ? 'Fichier téléchargé avec succès !' :
                   settings.language === 'de' ? 'Datei erfolgreich hochgeladen!' :
                   settings.language === 'it' ? 'File caricato con successo!' :
                   settings.language === 'ja' ? 'ファイルのアップロードが成功しました！' :
                   settings.language === 'ko' ? '파일이 성공적으로 업로드되었습니다!' :
                   settings.language === 'zh' ? '文件上传成功！' :
                   settings.language === 'ru' ? 'Файл успешно загружен!' : '¡Archivo Subido Exitosamente!'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {settings.language === 'en' ? 'The file has passed security filters and is now live.' :
                   settings.language === 'pt' ? 'O arquivo passou pelos filtros de segurança e já está online.' :
                   settings.language === 'fr' ? 'Le fichier a passé les filtres de sécurité et est maintenant en ligne.' :
                   settings.language === 'de' ? 'Die Datei hat die Sicherheitsfilter bestanden und ist jetzt online.' :
                   settings.language === 'it' ? 'Il file ha superato i filtri di sicurezza ed è ora disponibile.' :
                   settings.language === 'ja' ? 'ファイルはセキュリティフィルターを通過し、現在オンラインです。' :
                   settings.language === 'ko' ? '파일이 보안 필터를 통과하여 현재 사용 가능합니다.' :
                   settings.language === 'zh' ? '该文件已通过安全过滤，现已正式发布。' :
                   settings.language === 'ru' ? 'Файл прошел фильтры безопасности и теперь доступен.' : 'El archivo ha superado los filtros de seguridad y ya está en producción.'}
                </p>
              </div>
            </div>

            {/* Results Box */}
            <div className={`p-6 rounded-3xl max-w-xl mx-auto border ${
              isDark ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                  {uploadedResult.coverName ? (
                    <img
                      src={`/data/uploads/${uploadedResult.coverName}`}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <File className="w-12 h-12 text-neutral-400" />
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white truncate">{uploadedResult.name}</h4>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {uploadedResult.description || 
                     (settings.language === 'en' ? 'No additional description.' :
                      settings.language === 'pt' ? 'Sem descrição adicional.' :
                      settings.language === 'fr' ? 'Aucune description supplémentaire.' :
                      settings.language === 'de' ? 'Keine zusätzliche Beschreibung.' :
                      settings.language === 'it' ? 'Nessuna descrizione aggiuntiva.' :
                      settings.language === 'ja' ? '追加の説明はありません。' :
                      settings.language === 'ko' ? '추가 설명이 없습니다.' :
                      settings.language === 'zh' ? '无额外描述。' :
                      settings.language === 'ru' ? 'Без дополнительного описания.' : 'Sin descripción adicional.')}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1 text-[10px] font-mono text-neutral-400 pt-1">
                    <span className="uppercase text-sky-500 font-bold">{uploadedResult.type}</span>
                    <span>•</span>
                    <span>{formatBytes(uploadedResult.size)}</span>
                    <span>•</span>
                    <span className="uppercase">{uploadedResult.extension}</span>
                    {uploadedResult.version && (
                      <>
                        <span>•</span>
                        <span>v{uploadedResult.version}</span>
                      </>
                    )}
                  </div>

                  {/* Security Output */}
                  <div className="pt-1 flex justify-center sm:justify-start">
                    {uploadedResult.status === 'Revisado' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {settings.language === 'en' ? '🟢 Safe & Reviewed' :
                         settings.language === 'pt' ? '🟢 Seguro e Revisado' :
                         settings.language === 'fr' ? '🟢 Sûr et vérifié' :
                         settings.language === 'de' ? '🟢 Sicher & Überprüft' :
                         settings.language === 'it' ? '🟢 Sicuro e verificato' :
                         settings.language === 'ja' ? '🟢 安全・検証済み' :
                         settings.language === 'ko' ? '🟢 안전 및 검토 완료' :
                         settings.language === 'zh' ? '🟢 安全并已审核' :
                         settings.language === 'ru' ? '🟢 Безопасно и проверено' : '🟢 Seguro y Revisado'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-500 border border-rose-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {settings.language === 'en' ? '🔴 Threat Detected' :
                         settings.language === 'pt' ? '🔴 Ameaça Detectada' :
                         settings.language === 'fr' ? '🔴 Menace détectée' :
                         settings.language === 'de' ? '🔴 Bedrohung erkannt' :
                         settings.language === 'it' ? '🔴 Minaccia rilevata' :
                         settings.language === 'ja' ? '🔴 脅威を検出' :
                         settings.language === 'ko' ? '🔴 위협 감지됨' :
                         settings.language === 'zh' ? '🔴 检测到威胁' :
                         settings.language === 'ru' ? '🔴 Обнаружена угроза' : '🔴 Amenaza Detectada'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Buttons Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="result-view-projects-btn"
                onClick={onViewProjects}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:opacity-90 transition-opacity cursor-pointer"
              >
                {settings.language === 'en' ? 'View all my projects' :
                 settings.language === 'pt' ? 'Ver todos os meus projetos' :
                 settings.language === 'fr' ? 'Voir tous mes projets' :
                 settings.language === 'de' ? 'Alle meine Projekte anzeigen' :
                 settings.language === 'it' ? 'Visualizza tutti i miei progetti' :
                 settings.language === 'ja' ? 'すべてのプロジェクトを表示' :
                 settings.language === 'ko' ? '내 모든 프로젝트 보기' :
                 settings.language === 'zh' ? '查看我的所有项目' :
                 settings.language === 'ru' ? 'Посмотреть все мои проекты' : 'Ver todos mis proyectos'}
              </button>
              <button
                id="result-share-btn"
                onClick={() => handleShare(uploadedResult)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-sky-500/10 text-sky-500 hover:bg-sky-500/15 border border-sky-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                {settings.language === 'en' ? 'Share link' :
                 settings.language === 'pt' ? 'Compartilhar link' :
                 settings.language === 'fr' ? 'Partager le lien' :
                 settings.language === 'de' ? 'Link teilen' :
                 settings.language === 'it' ? 'Condividi link' :
                 settings.language === 'ja' ? 'リンクを共有' :
                 settings.language === 'ko' ? '링크 공유' :
                 settings.language === 'zh' ? '分享链接' :
                 settings.language === 'ru' ? 'Поделиться ссылкой' : 'Compartir enlace'}
              </button>
              {uploadedResult.status === 'Revisado' && (
                <button
                  id="result-download-btn"
                  onClick={() => handleDownload(uploadedResult)}
                  style={{ backgroundColor: themeAccentColor }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {settings.language === 'en' ? 'Download now' :
                   settings.language === 'pt' ? 'Baixar agora' :
                   settings.language === 'fr' ? 'Télécharger maintenant' :
                   settings.language === 'de' ? 'Jetzt herunterladen' :
                   settings.language === 'it' ? 'Scarica ora' :
                   settings.language === 'ja' ? '今すぐダウンロード' :
                   settings.language === 'ko' ? '지금 다운로드' :
                   settings.language === 'zh' ? '立即下载' :
                   settings.language === 'ru' ? 'Скачать сейчас' : 'Descargar ahora'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
