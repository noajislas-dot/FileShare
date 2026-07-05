import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckSquare, Square, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface WelcomeModalProps {
  settings: AppSettings;
  onClose: () => void;
}

export default function WelcomeModal({ settings, onClose }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem('fileshare_welcome_hidden');
    if (!hidden) {
      // Small timeout for smooth entry animation
      const timer = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleUnderstood = () => {
    if (dontShowAgain) {
      localStorage.setItem('fileshare_welcome_hidden', 'true');
    }
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  const isLiquid = settings.style === 'liquid-glass';
  const isDark = settings.theme === 'dark';

  // Styles based on settings
  const modalClass = isLiquid
    ? isDark
      ? 'bg-neutral-900/75 backdrop-blur-xl border border-white/15 text-white shadow-2xl'
      : 'bg-white/75 backdrop-blur-xl border border-black/10 text-neutral-800 shadow-xl'
    : isDark
    ? 'bg-neutral-900 border border-neutral-800 text-white shadow-2xl'
    : 'bg-white border border-neutral-200 text-neutral-800 shadow-xl';

  const overlayClass = isLiquid
    ? 'bg-black/40 backdrop-blur-sm'
    : 'bg-black/60';

  const btnColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

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
    title: isEn ? 'Important Information' : isPt ? 'Informação Importante' : isFr ? 'Informations importantes' : isDe ? 'Wichtige Information' : isIt ? 'Informazioni Importanti' : isJa ? '重要な情報' : isKo ? '중요한 정보' : isZh ? '重要信息' : isRu ? 'Важная информация' : 'Información Importante',
    subtitle: isEn ? 'FileShare Security & Terms' : isPt ? 'Segurança e Termos do FileShare' : isFr ? 'Sécurité et Conditions de FileShare' : isDe ? 'Sicherheit und Bedingungen von FileShare' : isIt ? 'Sicurezza e Termini di FileShare' : isJa ? 'FileShare のセキュリティと規約' : isKo ? 'FileShare 보안 및 약관' : isZh ? 'FileShare 安全与条款' : isRu ? 'Безопасность и Условия FileShare' : 'Seguridad y Términos de FileShare',
    p1: isEn ? 'Files available on FileShare are uploaded by users themselves.' : isPt ? 'Os arquivos disponíveis no FileShare são enviados pelos próprios usuários.' : isFr ? 'Les fichiers disponibles sur FileShare sont téléversés par les utilisateurs eux-mêmes.' : isDe ? 'Die auf FileShare verfügbaren Dateien werden von den Benutzern selbst hochgeladen.' : isIt ? 'I file disponibili su FileShare sono caricati dagli utenti stessi.' : isJa ? 'FileShareで利用可能なファイルは、ユーザー自身によってアップロードされたものです。' : isKo ? 'FileShare에서 다운로드할 수 있는 파일은 사용자가 직접 업로드한 것입니다.' : isZh ? 'FileShare 上的文件是由用户自行上传的。' : isRu ? 'Файлы, доступные на FileShare, загружаются самими пользователями.' : 'Los archivos disponibles en FileShare son subidos por los propios usuarios.',
    p2: isEn ? 'Although FileShare tries to keep the platform secure with automatic virus scans, it cannot guarantee that all files are 100% free of viruses, malware, or unwanted content.' : isPt ? 'Embora o FileShare tente manter a plataforma segura por meio de varreduras automáticas de antivírus, ele não pode garantir que todos os arquivos estejam 100% livres de vírus, malware ou conteúdo indesejado.' : isFr ? 'Bien que FileShare s\'efforce de maintenir la plate-forme sécurisée grâce à des analyses antivirus automatiques, il ne peut garantir que tous les fichiers sont exempts à 100% de virus, de logiciels malveillants ou de contenus indésirables.' : isDe ? 'Obwohl FileShare versucht, die Plattform durch automatische Antiviren-Scans sicher zu halten, kann nicht garantiert werden, dass alle Dateien zu 100 % frei von Viren, Malware oder unerwünschten Inhalten sind.' : isIt ? 'Sebbene FileShare cerchi di mantenere la piattaforma sicura tramite scansioni antivirus automatiche, non può garantire che tutti i file siano privi al 100% di virus, malware o contenuti indesiderati.' : isJa ? 'FileShareは自動ウイルススキャンでプラットフォームの安全性を維持するよう努めていますが、すべてのファイルがウイルス、マルウェア、または不要なコンテンツから100％含まれていないことを保証することはできません。' : isKo ? 'FileShare는 자동 바이러스 검사를 통해 플랫폼을 안전하게 유지하려고 노력하지만 모든 파일이 바이러스, 악성코드 또는 원치 않는 콘텐츠로부터 100% 안전함을 보장할 수는 없습니다.' : isZh ? '虽然 FileShare 尝试通过自动病毒扫描来保持平台安全，但无法保证所有文件都 100% 不含病毒、恶意软件或不良内容。' : isRu ? 'Хотя FileShare пытается поддерживать безопасность платформы с помощью автоматического сканирования на вирусы, компания не может гарантировать, что все файлы на 100% не содержат вирусов, вредоносного ПО или нежелательного контента.' : 'Aunque FileShare intenta mantener la plataforma segura mediante análisis antivirus automáticos, no puede garantizar que todos los archivos estén 100% libres de virus, malware o contenido no deseado.',
    recTitle: isEn ? 'Security recommendations:' : isPt ? 'Recomendações de segurança:' : isFr ? 'Recommandations de sécurité :' : isDe ? 'Sicherheitsempfehlungen:' : isIt ? 'Raccomandazioni di sicurezza:' : isJa ? 'セキュリティ推奨事項:' : isKo ? '보안 권장 사항:' : isZh ? '安全建议：' : isRu ? 'Рекомендации по безопасности:' : 'Recomendaciones de seguridad:',
    rec1: isEn ? 'Only download files from sources you trust.' : isPt ? 'Baixe apenas arquivos de fontes em que confia.' : isFr ? 'Téléchargez uniquement des fichiers provenant de sources de confiance.' : isDe ? 'Laden Sie nur Dateien aus Quellen herunter, denen Sie vertrauen.' : isIt ? 'Scarica solo file da fonti di cui ti fidi.' : isJa ? '信頼できるソースからのみファイルをダウンロードしてください。' : isKo ? '신뢰할 수 있는 소스에서만 파일을 다운로드하십시오.' : isZh ? '仅下载信任来源的文件。' : isRu ? 'Скачивайте файлы только из надежных источников.' : 'Descarga únicamente archivos de fuentes en las que confíes.',
    rec2: isEn ? 'Always scan files with an antivirus before opening them.' : isPt ? 'Sempre analise os arquivos com um antivírus antes de abri-los.' : isFr ? 'Analysez toujours les fichiers avec un antivirus avant de les ouvrir.' : isDe ? 'Scannen Sie Dateien immer mit einem Antivirenprogramm, bevor Sie sie öffnen.' : isIt ? 'Scansiona sempre i file con un antivirus prima di aprirli.' : isJa ? 'ファイルを開く前に、必ずウイルス対策ソフトでスキャンしてください。' : isKo ? '파일을 열기 전에 항상 백신 프로그램으로 검사하십시오.' : isZh ? '在打开文件之前，请始终使用杀毒软件进行扫描。' : isRu ? 'Всегда сканируйте файлы антивирусом перед открытием.' : 'Analiza siempre los archivos con un antivirus antes de abrirlos.',
    rec3: isEn ? 'If you find a malicious, fake, or illegal file, use the "Report file" button.' : isPt ? 'Se encontrar um arquivo malicioso, falso ou ilegal, use o botão "Denunciar arquivo".' : isFr ? 'Si vous trouvez un fichier malveillant, faux ou illégal, utilisez le bouton "Signaler le fichier".' : isDe ? 'Wenn Sie eine schädliche, gefälschte oder illegale Datei finden, verwenden Sie die Schaltfläche "Datei melden".' : isIt ? 'Se trovi un file dannoso, falso o illegale, usa il pulsante "Segnala file".' : isJa ? '悪意のあるファイル、偽ファイル、または違法ファイルを見つけた場合は、「ファイルを通報」ボタンを使用してください。' : isKo ? '악성, 가짜 또는 불법 파일을 발견하면 "파일 신고" 버튼을 사용하십시오.' : isZh ? '如果您发现恶意、虚假或非法文件，请使用“举报文件”按钮。' : isRu ? 'Если вы обнаружили вредоносный, поддельный или незаконный файл, нажмите кнопку «Пожаловаться на файл».' : 'Si encuentras un archivo malicioso, falso o ilegal utiliza el botón Reportar archivo.',
    p3: isEn ? 'The FileShare team is not responsible for files uploaded by third parties. All reports will be reviewed, and if a file violates the rules or poses a safety risk, it will be permanently deleted immediately.' : isPt ? 'A equipe do FileShare não se responsabiliza por arquivos enviados por terceiros. Todas as denúncias serão revisadas e, se um arquivo violar as regras ou representar um risco de segurança, será excluído permanentemente de imediato.' : isFr ? 'L\'équipe de FileShare n\'est pas responsable des fichiers téléversés par des tiers. Tous les signalements seront examinés et, si un fichier enfreint les règles ou présente un risque pour la sécurité, il sera immédiatement supprimé définitivement.' : isDe ? 'Das FileShare-Team ist nicht für von Dritten hochgeladene Dateien verantwortlich. Alle Meldungen werden überprüft, und wenn eine Datei gegen die Regeln verstoßt oder ein Sicherheitsrisiko darstellt, wird sie sofort dauerhaft gelöscht.' : isIt ? 'Il team di FileShare non è responsabile per i file caricati da terze parti. Tutte le segnalazioni verranno esaminate e, se un file viola le regole o rappresenta un rischio per la sicurezza, verrà eliminato definitivamente e immediatamente.' : isJa ? 'FileShareチームは、第三者によってアップロードされたファイルについて一切の責任を負いません。すべての通報は確認され、ファイルが規則に違反しているかセキュリティリスクをもたらす場合、直ちに完全に削除されます。' : isKo ? 'FileShare 팀은 제3자가 업로드한 파일에 대해 책임을 지지 않습니다. 모든 신고 내용은 검토되며, 규칙을 위반하거나 보안 위험을 초래하는 파일은 즉시 영구 삭제됩니다.' : isZh ? 'FileShare 团队不对第三方上传的文件承担责任。所有举报均将受到审查，如果文件违反规则或带来安全风险，将立即被永久删除。' : isRu ? 'Команда FileShare не несет ответственности за файлы, загруженные третьими лицами. Все жалобы будут рассмотрены, и если файл нарушает правила или представляет угрозу безопасности, он будет немедленно удален навсегда.' : 'El equipo de FileShare no se hace responsable de los archivos subidos por terceros. Todos los reportes serán revisados y, si un archivo incumple las normas o representa un riesgo para la seguridad, será eliminado permanentemente de inmediato.',
    p4: isEn ? 'By continuing, you accept that you download and use files at your own risk.' : isPt ? 'Ao continuar, você aceita que baixa e usa os arquivos por sua conta e risco.' : isFr ? 'En continuant, vous acceptez de télécharger et d\'utiliser les fichiers sous votre propre responsabilité.' : isDe ? 'Indem Sie fortfahren, akzeptieren Sie, dass Sie die Dateien auf eigene Gefahr herunterladen und verwenden.' : isIt ? 'Continuando, accetti di scaricare e utilizzare i file a tuo rischio e pericolo.' : isJa ? '続行すると、ご自身の責任でファイルをダウンロードして使用することに同意したことになります。' : isKo ? '계속 진행하면 본인 책임 하에 파일을 다운로드하고 사용하는 것에 동의하는 것입니다.' : isZh ? '继续操作即表示您同意自行承担下载和使用文件的风险。' : isRu ? 'Продолжая, вы соглашаетесь с тем, что скачиваете и используете файлы на свой страх и риск.' : 'Al continuar aceptas descargar y usar los archivos bajo tu propia responsabilidad.',
    dontShow: isEn ? 'Do not show this warning again' : isPt ? 'Não mostrar este aviso novamente' : isFr ? 'Ne plus afficher cet avertissement' : isDe ? 'Diese Warnung nicht mehr anzeigen' : isIt ? 'Non mostrare più questo avviso' : isJa ? 'この警告を再表示しない' : isKo ? '이 경고를 다시 표시하지 않음' : isZh ? '不再显示此警告' : isRu ? 'Больше не показывать это предупреждение' : 'No volver a mostrar esta advertencia',
    confirmBtn: isEn ? 'Understood, accept and continue' : isPt ? 'Entendido, aceitar e continuar' : isFr ? 'Compris, accepter et continuer' : isDe ? 'Verstanden, akzeptieren und fortfahren' : isIt ? 'Capito, accetta e continua' : isJa ? '了解しました。同意して続行' : isKo ? '이해했습니다. 수락하고 계속하기' : isZh ? '已了解，接受并继续' : isRu ? 'Понятно, принять и продолжить' : 'Entendido, aceptar y continuar'
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${overlayClass}`}>
      <div 
        id="welcome-modal"
        className={`w-full max-w-2xl rounded-3xl p-6 md:p-8 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto ${modalClass}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{texts.title}</h2>
            <p className="text-xs text-neutral-400">{texts.subtitle}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed mb-6">
          <p>
            {texts.p1}
          </p>
          <p>
            {texts.p2}
          </p>
          
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-neutral-800/50 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'}`}>
            <h4 className="font-semibold flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" /> {texts.recTitle}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
              <li>{texts.rec1}</li>
              <li>{texts.rec2}</li>
              <li>{texts.rec3}</li>
            </ul>
          </div>

          <p className="text-xs text-neutral-500">
            {texts.p3}
          </p>
          <p className="font-medium text-xs border-t pt-3 border-neutral-200 dark:border-neutral-800">
            {texts.p4}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button 
            id="welcome-dont-show-again-btn"
            onClick={() => setDontShowAgain(!dontShowAgain)}
            className="flex items-center gap-2 text-left cursor-pointer select-none py-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition-colors"
          >
            {dontShowAgain ? (
              <CheckSquare className="w-5 h-5 text-sky-500" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            <span className="text-xs">{texts.dontShow}</span>
          </button>

          <button
            id="welcome-understood-btn"
            onClick={handleUnderstood}
            style={{ backgroundColor: btnColor }}
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {texts.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
