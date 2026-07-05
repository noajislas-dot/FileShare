import React, { useEffect, useState } from 'react';
import { SearchHistoryItem, AppSettings } from '../types';
import { Search, Trash2, Calendar, ArrowUpDown, ChevronRight, Sparkles } from 'lucide-react';

interface HistoryPanelProps {
  settings: AppSettings;
  onSelectQuery: (query: string) => void;
  onRefreshHistoryTrigger?: number; // to trigger reload
}

export default function HistoryPanel({ settings, onSelectQuery, onRefreshHistoryTrigger }: HistoryPanelProps) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('recent');
  const [loading, setLoading] = useState(true);

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
    title: isEn ? 'Search History' : isPt ? 'Histórico de Pesquisas' : isFr ? 'Historique des recherches' : isDe ? 'Suchverlauf' : isIt ? 'Cronologia delle Ricerche' : isJa ? '検索履歴' : isKo ? '검색 기록' : isZh ? '搜索历史' : isRu ? 'История поиска' : 'Historial de Búsquedas',
    desc: isEn ? 'File queries and searches saved automatically.' : isPt ? 'Consultas de arquivos e pesquisas salvas automaticamente.' : isFr ? 'Requêtes de fichiers et recherches enregistrées automatiquement.' : isDe ? 'Dateianfragen und Suchen werden automatisch gespeichert.' : isIt ? 'Ricerche di file salvate automaticamente.' : isJa ? 'ファイル検索やクエリが自動的に保存されます。' : isKo ? '파일 검색 및 쿼리가 자동으로 저장됩니다.' : isZh ? '自动保存的文件查询和搜索。' : isRu ? 'Запросы файлов и результаты поиска сохраняются автоматически.' : 'Consultas de archivos y búsquedas guardadas automáticamente.',
    clearAll: isEn ? 'Clear all history' : isPt ? 'Limpar todo o histórico' : isFr ? 'Effacer tout l\'historique' : isDe ? 'Suchverlauf löschen' : isIt ? 'Cancella cronologia' : isJa ? '履歴をすべてクリア' : isKo ? '전체 기록 지우기' : isZh ? '清除全部历史' : isRu ? 'Очистить всю историю' : 'Borrar todo el historial',
    confirmClear: isEn ? 'Are you sure you want to delete all search history?' : isPt ? 'Tem certeza de que deseja excluir todo o histórico de pesquisas?' : isFr ? 'Êtes-vous sûr de vouloir supprimer tout l\'historique des recherches ?' : isDe ? 'Sind Sie sicher, dass Sie den gesamten Suchverlauf löschen möchten?' : isIt ? 'Sei sicuro di voler eliminare tutta la cronologia delle ricerche?' : isJa ? 'すべての検索履歴を削除してもよろしいですか？' : isKo ? '모든 검색 기록을 삭제하시겠습니까?' : isZh ? '您确定要删除所有搜索历史吗？' : isRu ? 'Вы уверены, что хотите удалить всю историю поиска?' : '¿Estás seguro de que deseas eliminar todo el historial de búsquedas?',
    singleRegistered: isEn ? 'search recorded' : isPt ? 'pesquisa registrada' : isFr ? 'recherche enregistrée' : isDe ? 'Suchanfrage registriert' : isIt ? 'ricerca registrata' : isJa ? '件의 검색을 기록' : isKo ? '개 검색 기록됨' : isZh ? '条记录的搜索' : isRu ? 'поиск записан' : 'búsqueda registrada',
    pluralRegistered: isEn ? 'searches recorded' : isPt ? 'pesquisas registradas' : isFr ? 'recherches enregistrées' : isDe ? 'Suchanfragen registriert' : isIt ? 'ricerche registrate' : isJa ? '件의 검색を記録' : isKo ? '개 검색 기록됨' : isZh ? '条记录的搜索' : isRu ? 'поисков записано' : 'búsquedas registradas',
    loading: isEn ? 'Loading search history...' : isPt ? 'Carregando histórico de pesquisas...' : isFr ? 'Chargement de l\'historique...' : isDe ? 'Suchverlauf wird geladen...' : isIt ? 'Caricamento cronologia...' : isJa ? '検索履歴を読み込み中...' : isKo ? '검색 기록을 불러오는 중...' : isZh ? '正在加载搜索历史...' : isRu ? 'Загрузка истории поиска...' : 'Cargando historial de búsquedas...',
    empty: isEn ? 'No searches saved' : isPt ? 'Nenhuma pesquisa salva' : isFr ? 'Aucune recherche enregistrée' : isDe ? 'Keine Suchen gespeichert' : isIt ? 'Nessuna ricerca salvata' : isJa ? '保存された検索はありません' : isKo ? '저장된 검색 기록이 없습니다' : isZh ? '无保存的搜索' : isRu ? 'Нет сохраненных поисков' : 'No hay búsquedas guardadas',
    emptyDesc: isEn ? 'The file searches you perform in the search bar will be saved here automatically.' : isPt ? 'As pesquisas de arquivos que você fizer na barra de busca serão salvas aqui automaticamente.' : isFr ? 'Les recherches de fichiers que vous effectuez dans la barre de recherche seront enregistrées ici automatiquement.' : isDe ? 'Die Dateisuchen, die Sie in der Suchleiste durchführen, werden hier automatisch gespeichert.' : isIt ? 'Le ricerche di file eseguite nella barra di ricerca verranno salvate qui automaticamente.' : isJa ? '検索バーで実行したファイル検索は、自動的にここに保存されます。' : isKo ? '검색창에서 수행한 파일 검색이 여기에 자동으로 저장됩니다.' : isZh ? '您在搜索栏中进行的文件搜索将自动保存在此处。' : isRu ? 'Результаты поиска файлов в строке поиска будут автоматически сохраняться здесь.' : 'Las búsquedas de archivos que realices en la barra de búsqueda se guardarán aquí automáticamente.',
    atTime: isEn ? 'at' : isPt ? 'às' : isFr ? 'à' : isDe ? 'um' : isIt ? 'alle' : isJa ? ' ' : isKo ? ' ' : isZh ? ' ' : isRu ? 'в' : 'a las',
    sortRecent: isEn ? 'Most recent first' : isPt ? 'Mais recentes primeiro' : isFr ? 'Plus récents en premier' : isDe ? 'Neueste zuerst' : isIt ? 'Più recenti prima' : isJa ? '新しい順' : isKo ? '최신순' : isZh ? '最新优先' : isRu ? 'Сначала новые' : 'Más recientes primero',
    sortOldest: isEn ? 'Oldest first' : isPt ? 'Mais antigos primeiro' : isFr ? 'Plus anciens en premier' : isDe ? 'Älteste zuerst' : isIt ? 'Meno recenti prima' : isJa ? '古い順' : isKo ? '오래된순' : isZh ? '最早优先' : isRu ? 'Сначала старые' : 'Más antiguos primero',
    sortAZ: isEn ? 'Alphabetical A-Z' : isPt ? 'Ordem alfabética A-Z' : isFr ? 'Ordre alphabétique A-Z' : isDe ? 'Alphabetisch A-Z' : isIt ? 'Ordine alfabetico A-Z' : isJa ? 'アルファベット順 A-Z' : isKo ? '알파벳순 A-Z' : isZh ? '按字母顺序 A-Z' : isRu ? 'По алфавиту А-Я' : 'Orden alfabético A-Z',
    sortZA: isEn ? 'Alphabetical Z-A' : isPt ? 'Ordem alfabética Z-A' : isFr ? 'Ordre alphabétique Z-A' : isDe ? 'Alphabetisch Z-A' : isIt ? 'Ordine alfabetico Z-A' : isJa ? 'アルファベット順 Z-A' : isKo ? '알파벳순 Z-A' : isZh ? '按字母顺序 Z-A' : isRu ? 'По алфавиту Я-А' : 'Orden alfabético Z-A',
    deleteSearchTooltip: isEn ? 'Delete this search' : isPt ? 'Excluir esta pesquisa' : isFr ? 'Supprimer cette recherche' : isDe ? 'Diese Suche löschen' : isIt ? 'Elimina questa ricerca' : isJa ? 'この検索を削除' : isKo ? '이 검색 삭제' : isZh ? '删除此搜索' : isRu ? 'Удалить этот поиск' : 'Eliminar esta búsqueda'
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/history?sort=${sortOrder}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [sortOrder, onRefreshHistoryTrigger]);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      // Update local state directly for speedy feedback
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm(texts.confirmClear)) {
      return;
    }
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
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

  const rowBg = isDark ? 'bg-neutral-800/40 hover:bg-neutral-800/70' : 'bg-neutral-50 hover:bg-neutral-100/80';
  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString(lang || 'es')} ${texts.atTime} ${d.toLocaleTimeString(lang || 'es', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className={`p-6 md:p-8 rounded-3xl ${panelBg} w-full max-w-4xl mx-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <Search className="w-6 h-6" style={{ color: themeAccentColor }} />
            {texts.title}
          </h2>
          <p className="text-xs text-neutral-500">
            {texts.desc}
          </p>
        </div>

        {history.length > 0 && (
          <button
            id="clear-all-history-btn"
            onClick={handleClearAll}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {texts.clearAll}
          </button>
        )}
      </div>

      {/* Toolbar / Sort */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800/80 pb-4 mb-4">
        <span className="text-xs font-medium text-neutral-500">
          {history.length} {history.length === 1 ? texts.singleRegistered : texts.pluralRegistered}
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
          <select
            id="history-sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-xs bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg px-2.5 py-1.5 font-medium outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-neutral-800 dark:text-neutral-100"
          >
            <option value="recent">{texts.sortRecent}</option>
            <option value="oldest">{texts.sortOldest}</option>
            <option value="a-z">{texts.sortAZ}</option>
            <option value="z-a">{texts.sortZA}</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-sm text-neutral-400">
          {texts.loading}
        </div>
      ) : history.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <Search className="w-5 h-5" />
          </div>
          <div className="text-sm font-semibold text-neutral-400">{texts.empty}</div>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            {texts.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectQuery(item.query)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors ${rowBg} group`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-500 group-hover:bg-sky-500/10 group-hover:text-sky-500 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate pr-4 text-neutral-900 dark:text-neutral-100">
                    {item.query}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id={`delete-history-btn-${item.id}`}
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className="p-2 text-neutral-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                  title={texts.deleteSearchTooltip}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
