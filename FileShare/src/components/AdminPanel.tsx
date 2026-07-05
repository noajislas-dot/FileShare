import React, { useState, useEffect } from 'react';
import { FileMetadata, AppSettings } from '../types';
import { Shield, ShieldAlert, Trash2, CheckCircle, Flag, AlertTriangle, ChevronRight, Terminal, RefreshCw, Key } from 'lucide-react';
import { formatBytes } from './FileCard';

interface AdminPanelProps {
  settings: AppSettings;
  onRefreshTrigger: () => void;
}

export default function AdminPanel({ settings, onRefreshTrigger }: AdminPanelProps) {
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'reported' | 'threats'>('all');
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

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
    loginTitle: isEn ? 'Moderator Control Panel' : isPt ? 'Painel de Controle do Moderador' : isFr ? 'Panneau de contrôle du modérateur' : isDe ? 'Moderatoren-Bedienfeld' : isIt ? 'Pannello di Controllo Moderatore' : isJa ? 'モデレーターコントロールパネル' : isKo ? '모더레이터 제어판' : isZh ? '协管员控制面板' : isRu ? 'Панель управления модератора' : 'Panel de Control Moderador',
    loginDesc: isEn ? 'Space for threat review and resolution of security reports.' : isPt ? 'Espaço para revisão de ameaças e resolução de relatórios de segurança.' : isFr ? 'Espace d\'examen des menaces et de résolution des rapports de sécurité.' : isDe ? 'Bereich zur Überprüfung von Bedrohungen und zur Behebung von Sicherheitsberichten.' : isIt ? 'Spazio per la revisione delle minacce e la risoluzione delle segnalazioni di sicurezza.' : isJa ? '脅威の確認およびセキュリティレポートの解決スペース。' : isKo ? '위협 검토 및 보안 보고서 해결 공간.' : isZh ? '威胁审查与安全报告解决空间。' : isRu ? 'Пространство для анализа угроз и обработки жалоб на безопасность.' : 'Espacio de revisión de amenazas y resolución de reportes de seguridad.',
    passcodeLabel: isEn ? 'Access Key (Administrator)' : isPt ? 'Chave de Acesso (Administrador)' : isFr ? 'Clé d\'accès (Administrateur)' : isDe ? 'Zugangsschlüssel (Administrator)' : isIt ? 'Chiave di Accesso (Amministratore)' : isJa ? 'アクセスキー（管理者）' : isKo ? '액세스 키 (관리자)' : isZh ? '访问密钥 (管理员)' : isRu ? 'Ключ доступа (Администратор)' : 'Clave de Acceso (Administrador)',
    passcodePlaceholder: isEn ? 'Enter simulation key...' : isPt ? 'Digite a chave de simulação...' : isFr ? 'Entrez la clé de simulation...' : isDe ? 'Simulationsschlüssel eingeben...' : isIt ? 'Inserisci chiave di simulazione...' : isJa ? 'シミュレーションキーを入力してください...' : isKo ? '시뮬레이션 키를 입력하세요...' : isZh ? '输入模拟密钥...' : isRu ? 'Введите ключ симуляции...' : 'Ingresa clave de simulación...',
    passcodeNote: isEn ? '*For development, any key is valid. Click Access.' : isPt ? '*Para desenvolvimento, qualquer chave é válida. Clique em Acessar.' : isFr ? '*Pour le développement, n\'importe quelle clé est valide. Cliquez sur Accéder.' : isDe ? '*Für die Entwicklung ist jeder Schlüssel gültig. Klicken Sie auf Zugang.' : isIt ? '*Per lo sviluppo, qualsiasi chave é valida. Clicca su Accedi.' : isJa ? '※開発用のため、任意のキーが有効です。「アクセス」をクリックしてください。' : isKo ? '*개발용으로 모든 키가 유효합니다. 액세스를 클릭하세요.' : isZh ? '*用于开发，任何密钥均有效。点击访问。' : isRu ? '*Для разработки подходит любой ключ. Нажмите «Войти».' : '*Para desarrollo, cualquier clave es válida. Presiona Acceder.',
    accessBtn: isEn ? 'Access Panel' : isPt ? 'Acessar o Painel' : isFr ? 'Accéder au panneau' : isDe ? 'Bedienfeld aufrufen' : isIt ? 'Accedi al Pannello' : isJa ? 'パネルにアクセス' : isKo ? '패널 액세스' : isZh ? '访问面板' : isRu ? 'Войти в панель' : 'Acceder al Panel',
    panelTitle: isEn ? 'FileShare Moderation Panel' : isPt ? 'Painel de Moderação do FileShare' : isFr ? 'Panneau de modération FileShare' : isDe ? 'FileShare-Moderationspanel' : isIt ? 'Pannello di Moderazione FileShare' : isJa ? 'FileShareモデレーションパネル' : isKo ? 'FileShare 모더레이션 패널' : isZh ? 'FileShare 审核面板' : isRu ? 'Панель модерации FileShare' : 'Panel de Moderación FileShare',
    panelDesc: isEn ? 'Real-time review of community-reported or preemptively blocked files.' : isPt ? 'Revisão em tempo real de arquivos denunciados pela comunidade ou bloqueados preventivamente.' : isFr ? 'Examen en temps réel des fichiers signalés par la communauté ou bloqués préventivement.' : isDe ? 'Echtzeit-Überprüfung von durch die Community gemeldeten oder präventiv blockierten Dateien.' : isIt ? 'Revisione in tempo reale dei file segnalati dalla comunità o bloccati preventivamente.' : isJa ? 'コミュニティから通報されたファイルや予防的にブロックされたファイルのリアルタイム確認。' : isKo ? '커뮤니티에서 신고했거나 예방 조치로 차단된 파일에 대한 실시간 검토.' : isZh ? '实时审查社区举报或预防性拦截的文件。' : isRu ? 'Анализ в реальном времени файлов, на которые пожаловались пользователи, или превентивно заблокированных.' : 'Revisión en tiempo real de archivos reportados por la comunidad o bloqueados preventivamente.',
    reloadTooltip: isEn ? 'Refresh data' : isPt ? 'Atualizar dados' : isFr ? 'Actualiser les données' : isDe ? 'Daten aktualisieren' : isIt ? 'Ricarica dati' : isJa ? 'データを更新' : isKo ? '데이터 새로고침' : isZh ? '刷新数据' : isRu ? 'Обновить данные' : 'Refrescar datos',
    logoutBtn: isEn ? 'Exit Admin Mode' : isPt ? 'Sair do Modo Admin' : isFr ? 'Quitter le mode admin' : isDe ? 'Admin-Modus verlassen' : isIt ? 'Esci da Admin' : isJa ? '管理者モードを終了' : isKo ? '관리자 모드 종료' : isZh ? '退出管理员模式' : isRu ? 'Выйти из режима админа' : 'Salir Modo Admin',
    statTotal: isEn ? 'Total files' : isPt ? 'Total de arquivos' : isFr ? 'Total de fichiers' : isDe ? 'Dateien insgesamt' : isIt ? 'File totali' : isJa ? '合計ファイル数' : isKo ? '전체 파일 수' : isZh ? '文件总数' : isRu ? 'Всего файлов' : 'Total archivos',
    statActiveReports: isEn ? 'With active reports' : isPt ? 'Com denúncias ativas' : isFr ? 'Avec rapports actifs' : isDe ? 'Mit aktiven Meldungen' : isIt ? 'Con segnalazioni attive' : isJa ? 'アクティブな通報あり' : isKo ? '활성 신고 있음' : isZh ? '有活动举报' : isRu ? 'С активными жалобами' : 'Con reportes activos',
    statBlockedThreats: isEn ? 'Blocked threats' : isPt ? 'Ameaças bloqueadas' : isFr ? 'Menaces bloquées' : isDe ? 'Blockierte Bedrohungen' : isIt ? 'Minacce bloccate' : isJa ? 'ブロックされた脅威' : isKo ? '차단된 위협' : isZh ? '已拦截威胁' : isRu ? 'Заблокированные угрозы' : 'Amenazas bloqueadas',
    underReview: isEn ? 'Files under review' : isPt ? 'Arquivos sob revisão' : isFr ? 'Fichiers en cours d\'examen' : isDe ? 'Dateien unter Überprüfung' : isIt ? 'File in esame' : isJa ? '確認中のファイル' : isKo ? '검색 중인 파일' : isZh ? '正在审查的文件' : isRu ? 'Файлы на проверке' : 'Archivos bajo revisión',
    refreshingDb: isEn ? 'Refreshing database...' : isPt ? 'Atualizando banco de dados...' : isFr ? 'Actualisation de la base de données...' : isDe ? 'Datenbank wird aktualisiert...' : isIt ? 'Aggiornamento database...' : isJa ? 'データベースを更新中...' : isKo ? '데이터베이스 새로고침 중...' : isZh ? '正在刷新数据库...' : isRu ? 'Обновление базы данных...' : 'Refrescando base de datos...',
    noMatches: isEn ? 'No files match the moderator filter.' : isPt ? 'Nenhum arquivo corresponde ao filtro de moderador.' : isFr ? 'Aucun fichier ne correspond au filtro de modérateur.' : isDe ? 'Keine Dateien entsprechen dem Moderatorenfilter.' : isIt ? 'Nessun file corrisponde al filtro del moderatore.' : isJa ? 'モデレーターフィルターに一致するファイルはありません。' : isKo ? '모더레이터 필터와 일치하는 파일이 없습니다.' : isZh ? '没有符合审核器过滤条件的文件。' : isRu ? 'Нет файлов, соответствующих фильтрам модератора.' : 'No hay archivos coincidiendo con el filtro de moderador.',
    reportsLabel: isEn ? 'reports' : isPt ? 'denúncias' : isFr ? 'rapports' : isDe ? 'Meldungen' : isIt ? 'segnalazioni' : isJa ? '件の通報' : isKo ? '건의 신고' : isZh ? '个举报' : isRu ? 'жалоб' : 'reportes',
    detailsTitle: isEn ? 'Moderation Inspection Detail' : isPt ? 'Detalhe da Inspeção de Moderação' : isFr ? 'Détail de l\'inspection de modération' : isDe ? 'Details der Moderationsprüfung' : isIt ? 'Dettagli Ispezione Moderazione' : isJa ? 'モデレーションインスペクションの詳細' : isKo ? '모더레이터 세부 검사' : isZh ? '审核检查详情' : isRu ? 'Детали модераторской проверки' : 'Detalle de Inspección de Moderación',
    detailsPlaceholder: isEn ? 'Select a file from the left list to moderate its safety parameters.' : isPt ? 'Selecione um arquivo na lista à esquerda para moderar seus parâmetros de segurança.' : isFr ? 'Sélectionnez un fichier dans la liste de gauche pour modérer ses paramètres de sécurité.' : isDe ? 'Wählen Sie ein Datei aus der linken Liste aus, um deren Sicherheitsparameter zu moderieren.' : isIt ? 'Seleziona un file dall\'elenco a sinistra per moderare i suoi parametri di sicurezza.' : isJa ? '左側のリストからファイルを選択して、そのセキュリティパラメータをモデレーションします。' : isKo ? '왼쪽 목록에서 파일을 선택하여 보안 파라미터를 모더레이션하십시오.' : isZh ? '从左侧列表中选择一个文件来审核其安全参数。' : isRu ? 'Выберите файл из списка слева, чтобы настроить параметры безопасности.' : 'Selecciona un archivo de la lista de la izquierda para moderar sus parámetros de seguridad.',
    antivirusStatus: isEn ? 'Antivirus status:' : isPt ? 'Status do antivírus:' : isFr ? 'Statut de l\'antivirus :' : isDe ? 'Antivirenstatus:' : isIt ? 'Stato antivirus:' : isJa ? 'ウイルス対策ステータス：' : isKo ? '백신 상태:' : isZh ? '杀毒软件状态：' : isRu ? 'Статус антивируса:' : 'Antivirus status:',
    userReportsLabel: isEn ? 'User reports:' : isPt ? 'Denúncias de usuários:' : isFr ? 'Signalements des utilisateurs :' : isDe ? 'Benutzermeldungen:' : isIt ? 'Segnalazioni utenti:' : isJa ? 'ユーザーからの通報：' : isKo ? '사용자 신고:' : isZh ? '用户举报数：' : isRu ? 'Жалобы пользователей:' : 'Denuncias de usuarios:',
    communityReportsHeader: isEn ? 'Community Reports:' : isPt ? 'Denúncias da Comunidade:' : isFr ? 'Signalements de la communauté :' : isDe ? 'Community-Meldungen:' : isIt ? 'Segnalazioni della Comunità:' : isJa ? 'コミュニティ通報履歴：' : isKo ? '커뮤니티 신고 내역:' : isZh ? '社区举报详情：' : isRu ? 'Жалобы сообщества:' : 'Reportes de la Comunidad:',
    btnApprove: isEn ? 'Mark as Safe (Approve)' : isPt ? 'Marcar como Seguro (Aprovar)' : isFr ? 'Marquer comme sûr (Approuver)' : isDe ? 'Als sicher markieren (Genehmigen)' : isIt ? 'Segna come Sicuro (Approva)' : isJa ? '安全とマーク（承認）' : isKo ? '안전 파일로 표시 (승인)' : isZh ? '标记为安全（批准）' : isRu ? 'Пометить как безопасный (Одобрить)' : 'Marcar como Seguro (Aprobar)',
    btnDismiss: isEn ? 'Dismiss Reports (Reset)' : isPt ? 'Descartar Denúncias (Resetar)' : isFr ? 'Rejeter les signalements (Réinitialiser)' : isDe ? 'Meldungen verwerfen (Zurücksetzen)' : isIt ? 'Respingi Segnalazioni (Ripristina)' : isJa ? '通報を却下（リセット）' : isKo ? '신고 기각 (재설정)' : isZh ? '驳回举报（重置）' : isRu ? 'Отклонить жалобы (Сбросить)' : 'Desestimar Reportes (Resetear)',
    btnDelete: isEn ? 'Permanently Delete File' : isPt ? 'Excluir Arquivo Permanentemente' : isFr ? 'Supprimer définitivement le fichier' : isDe ? 'Datei dauerhaft löschen' : isIt ? 'Elimina file in modo permanente' : isJa ? 'ファイルを永久に削除' : isKo ? '파일 영구 삭제' : isZh ? '永久删除文件' : isRu ? 'Удалить файл навсегда' : 'Eliminar archivo permanentemente',
    
    // Confirms
    confirmDelete: isEn ? 'Are you sure you want to PERMANENTLY DELETE this file from the server?' : isPt ? 'Tem certeza de que deseja EXCLUIR permanentemente este arquivo do servidor?' : isFr ? 'Êtes-vous sûr de vouloir SUPPRIMER définitivement ce fichier du serveur ?' : isDe ? 'Sind Sie sicher, dass Sie diese Datei DAUERHAFT vom Server LÖSCHEN möchten?' : isIt ? 'Sei sicuro di voler ELIMINARE permanentemente questo file dal server?' : isJa ? 'このファイルをサーバーから【永久に削除】してもよろしいですか？' : isKo ? '이 파일을 서버에서 [영구 삭제]하시겠습니까?' : isZh ? '您确定要从服务器【永久删除】此文件吗？' : isRu ? 'Вы уверены, что хотите НАВСЕГДА УДАЛИТЬ этот файл с сервера?' : '¿Estás seguro de que deseas ELIMINAR permanentemente este archivo del servidor?',
    confirmApprove: isEn ? 'Do you confirm marking this file as safe (Reviewed)?' : isPt ? 'Confirma marcar este arquivo como seguro (Revisado)?' : isFr ? 'Confirmez-vous le marquage de ce fichier comme sûr (Révisé) ?' : isDe ? 'Bestätigen Sie die Markierung dieser Datei als sicher (Überprüft)?' : isIt ? 'Confermi di contrassegnare questo file como sicuro (Revisionato)?' : isJa ? 'このファイルを安全（確認済み）としてマークしますか？' : isKo ? '이 파일을 안전 파일(검토됨)로 표시하시겠습니까?' : isZh ? '您确认将此文件标记为安全（已审核）吗？' : isRu ? 'Вы подтверждаете, что этот файл безопасен (Проверено)?' : '¿Confirmas marcar este archivo como seguro (Revisado)?',
    confirmClear: isEn ? 'Do you want to clear all user reports for this file?' : isPt ? 'Deseja limpar todas as denúncias de usuários sobre este arquivo?' : isFr ? 'Voulez-vous effacer tous les signalements d\'utilisateurs pour ce fichier ?' : isDe ? 'Möchten Sie alle Benutzermeldungen für diese Datei löschen?' : isIt ? 'Vuoi cancellare tutte le segnalazioni degli utenti per questo file?' : isJa ? 'このファイルに対するユーザーからの通報をすべて削除しますか？' : isKo ? '이 파일에 대한 모든 사용자 신고를 삭제하시겠습니까?' : isZh ? '您想清除该文件的所有用户举报吗？' : isRu ? 'Вы хотите удалить все жалобы пользователей на этот файл?' : '¿Deseas borrar todos los reportes de usuarios sobre este archivo?',
    errorMod: isEn ? 'Error during file moderation.' : isPt ? 'Erro na moderação do arquivo.' : isFr ? 'Erreur lors de la modération du fichier.' : isDe ? 'Fehler bei der Dateimoderation.' : isIt ? 'Errore durante la moderazione del file.' : isJa ? 'ファイルのモデレーション中にエラーが発生しました。' : isKo ? '파일 모더레이션 중 오류가 발생했습니다.' : isZh ? '文件审核过程中出错。' : isRu ? 'Ошибка при модерации файла.' : 'Error en la moderación del archivo.',
    errorConn: isEn ? 'Connection error.' : isPt ? 'Erro de conexão.' : isFr ? 'Erreur de connexion.' : isDe ? 'Verbindungsfehler.' : isIt ? 'Errore di connessione.' : isJa ? '接続エラー。' : isKo ? '연결 오류.' : isZh ? '连接错误。' : isRu ? 'Ошибка соединения.' : 'Error de conexión.',
    
    // Statuses
    threatDetected: isEn ? 'Threat detected' : isPt ? 'Ameaça detectada' : isFr ? 'Menace détectée' : isDe ? 'Bedrohung erkannt' : isIt ? 'Minaccia rilevata' : isJa ? '脅威を検出' : isKo ? '위협 감지됨' : isZh ? '检测到威胁' : isRu ? 'Обнаружена угроза' : 'Amenaza detectada',
    reviewed: isEn ? 'Reviewed' : isPt ? 'Revisado' : isFr ? 'Révisé' : isDe ? 'Überprüft' : isIt ? 'Revisionato' : isJa ? '確認済み' : isKo ? '검토됨' : isZh ? '已审核' : isRu ? 'Проверено' : 'Revisado',
    pending: isEn ? 'Pending' : isPt ? 'Pendente' : isFr ? 'En attente' : isDe ? 'Ausstehend' : isIt ? 'In attesa' : isJa ? '保留中' : isKo ? '대기 중' : isZh ? '待定' : isRu ? 'Ожидание' : 'Pendiente'
  };

  const getStatusLabel = (status: string) => {
    if (status === 'Revisado') return texts.reviewed;
    if (status === 'Amenaza detectada') return texts.threatDetected;
    return texts.pending;
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/files');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthorized) {
      fetchFiles();
    }
  }, [isAdminAuthorized]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use simple predefined passcode or allow empty/simulation
    setIsAdminAuthorized(true);
  };

  const handleModerateAction = async (id: string, action: 'approve' | 'delete' | 'clear_reports') => {
    const confirmationMsg = action === 'delete' 
      ? texts.confirmDelete 
      : action === 'approve'
      ? texts.confirmApprove
      : texts.confirmClear;

    if (!window.confirm(confirmationMsg)) return;

    try {
      const res = await fetch(`/api/admin/moderate/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (res.ok) {
        const updatedFile = await res.json();
        
        if (action === 'delete') {
          setFiles(files.filter(f => f.id !== id));
          if (selectedFile?.id === id) setSelectedFile(null);
        } else {
          setFiles(files.map(f => f.id === id ? updatedFile : f));
          if (selectedFile?.id === id) setSelectedFile(updatedFile);
        }
        
        onRefreshTrigger(); // Sync projects metrics on main screen
      } else {
        alert(texts.errorMod);
      }
    } catch (err) {
      console.error(err);
      alert(texts.errorConn);
    }
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

  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  // Filters math
  const filteredFiles = files.filter(f => {
    if (filterMode === 'reported') return f.reports.length > 0;
    if (filterMode === 'threats') return f.status === 'Amenaza detectada';
    return true;
  });

  // Authorize Form View
  if (!isAdminAuthorized) {
    return (
      <div className={`p-6 md:p-8 rounded-3xl ${panelBg} w-full max-w-md mx-auto text-center space-y-6`}>
        <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
        
        <div>
          <h3 className="text-lg font-bold">{texts.loginTitle}</h3>
          <p className="text-xs text-neutral-500 mt-1">
            {texts.loginDesc}
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono mb-1">
              {texts.passcodeLabel}
            </label>
            <input
              id="admin-passcode-input"
              type="password"
              placeholder={texts.passcodePlaceholder}
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className={`w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:ring-2 ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-sky-500' 
                  : 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:ring-sky-500'
              }`}
            />
            <p className="text-[10px] text-neutral-500 mt-1 font-mono">
              {texts.passcodeNote}
            </p>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            style={{ backgroundColor: themeAccentColor }}
            className="w-full py-2.5 rounded-xl font-bold text-white text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            {texts.accessBtn}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`p-6 md:p-8 rounded-3xl ${panelBg} w-full max-w-6xl mx-auto space-y-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            {texts.panelTitle}
          </h2>
          <p className="text-xs text-neutral-500">
            {texts.panelDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="admin-reload-btn"
            onClick={fetchFiles}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-sky-500 cursor-pointer"
            title={texts.reloadTooltip}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="admin-logout-btn"
            onClick={() => setIsAdminAuthorized(false)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer"
          >
            {texts.logoutBtn}
          </button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          id="admin-filter-all"
          onClick={() => setFilterMode('all')}
          className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
            filterMode === 'all' 
              ? 'border-sky-500 bg-sky-500/5' 
              : isDark ? 'border-neutral-800 bg-neutral-800/25' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-neutral-500">{texts.statTotal}</div>
          <div className="text-xl font-bold mt-1 font-mono text-neutral-800 dark:text-neutral-100">
            {files.length}
          </div>
        </button>

        <button
          id="admin-filter-reported"
          onClick={() => setFilterMode('reported')}
          className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
            filterMode === 'reported' 
              ? 'border-amber-500 bg-amber-500/5' 
              : isDark ? 'border-neutral-800 bg-neutral-800/25' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-neutral-500">{texts.statActiveReports}</div>
          <div className="text-xl font-bold mt-1 font-mono text-amber-500">
            {files.filter(f => f.reports.length > 0).length}
          </div>
        </button>

        <button
          id="admin-filter-threats"
          onClick={() => setFilterMode('threats')}
          className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
            filterMode === 'threats' 
              ? 'border-red-500 bg-red-500/5' 
              : isDark ? 'border-neutral-800 bg-neutral-800/25' : 'border-neutral-200 bg-neutral-50'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-neutral-500">{texts.statBlockedThreats}</div>
          <div className="text-xl font-bold mt-1 font-mono text-red-500">
            {files.filter(f => f.status === 'Amenaza detectada').length}
          </div>
        </button>
      </div>

      {/* Table split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Table of files */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-semibold uppercase text-neutral-400 font-mono tracking-wider">
            {texts.underReview} ({filteredFiles.length})
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono">
              {texts.refreshingDb}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400 font-mono bg-neutral-50 dark:bg-neutral-800/25 border rounded-2xl">
              {texts.noMatches}
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredFiles.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFile(f)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedFile?.id === f.id
                      ? 'border-sky-500 bg-sky-500/5'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-800/30 hover:bg-neutral-800/50'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate pr-2 max-w-xs md:max-w-md">
                        {f.name}
                      </span>
                      {f.reports.length > 0 && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-500 flex items-center gap-0.5">
                          <Flag className="w-2.5 h-2.5" />
                          {f.reports.length} {texts.reportsLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-1">
                      <span>{f.extension.toUpperCase()}</span>
                      <span>•</span>
                      <span>{formatBytes(f.size)}</span>
                      <span>•</span>
                      <span className={
                        f.status === 'Revisado' ? 'text-emerald-500' : f.status === 'Amenaza detectada' ? 'text-red-500 font-bold' : 'text-amber-500'
                      }>
                        {getStatusLabel(f.status)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Detailed Moderator Inspection Panel */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase text-neutral-400 font-mono tracking-wider">
            {texts.detailsTitle}
          </div>

          {selectedFile ? (
            <div className={`p-5 rounded-2xl border space-y-5 ${
              isDark ? 'bg-neutral-800/40 border-neutral-700/60' : 'bg-neutral-50 border-neutral-200'
            }`}>
              {/* Header inspect */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-2">{selectedFile.name}</h4>
                <p className="text-[10px] font-mono text-neutral-500 mt-1 uppercase">ID: {selectedFile.id} • Original: {selectedFile.originalName}</p>
              </div>

              {/* Status indicators */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>{texts.antivirusStatus}</span>
                  <span className={`font-bold font-mono ${
                    selectedFile.status === 'Revisado' ? 'text-emerald-500' : selectedFile.status === 'Amenaza detectada' ? 'text-red-500' : 'text-amber-500'
                  }`}>{getStatusLabel(selectedFile.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{texts.userReportsLabel}</span>
                  <span className="font-bold font-mono text-amber-500">{selectedFile.reports.length} {texts.reportsLabel}</span>
                </div>
              </div>

              {/* Report entries list */}
              {selectedFile.reports.length > 0 && (
                <div className="space-y-2 border-t pt-3 border-neutral-200 dark:border-neutral-800">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase font-mono">{texts.communityReportsHeader}</div>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {selectedFile.reports.map((rep) => (
                      <div key={rep.id} className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-[11px] space-y-1">
                        <div className="font-bold text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {rep.reason}
                        </div>
                        {rep.comments && (
                          <div className="text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
                            "{rep.comments}"
                          </div>
                        )}
                        <div className="text-[9px] text-neutral-400 font-mono text-right">
                          {new Date(rep.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons list */}
              <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                {selectedFile.status !== 'Revisado' && (
                  <button
                    id={`admin-approve-${selectedFile.id}`}
                    onClick={() => handleModerateAction(selectedFile.id, 'approve')}
                    className="w-full py-2.5 rounded-xl font-semibold bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {texts.btnApprove}
                  </button>
                )}

                {selectedFile.reports.length > 0 && (
                  <button
                    id={`admin-clear-reports-${selectedFile.id}`}
                    onClick={() => handleModerateAction(selectedFile.id, 'clear_reports')}
                    className="w-full py-2.5 rounded-xl font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500/15 border border-amber-500/20 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {texts.btnDismiss}
                  </button>
                )}

                <button
                  id={`admin-delete-${selectedFile.id}`}
                  onClick={() => handleModerateAction(selectedFile.id, 'delete')}
                  className="w-full py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {texts.btnDelete}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800/10 border border-dashed rounded-2xl">
              {texts.detailsPlaceholder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
