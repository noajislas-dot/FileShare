import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, RefreshCw, Box, Eye, Download, Info } from 'lucide-react';
import { FileMetadata, AppSettings } from '../types';
import { formatBytes, getFileTypeIcon } from './FileCard';

interface TrashPanelProps {
  settings: AppSettings;
  t: any;
  refreshCounter: number;
  onRefresh: () => void;
  addNotification: (title: string, message: string, type: any) => void;
  addActivity: (action: string, details: string) => void;
  onDelete: (file: FileMetadata) => void;
}

export default function TrashPanel({
  settings,
  t,
  refreshCounter,
  onRefresh,
  addNotification,
  addActivity,
  onDelete
}: TrashPanelProps) {
  const [trashedFiles, setTrashedFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [emptying, setEmptying] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);

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

  const isDark = settings.theme === 'dark' || settings.theme === 'custom';

  useEffect(() => {
    async function fetchTrashed() {
      try {
        setLoading(true);
        const res = await fetch('/api/files?deleted=true');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTrashedFiles(data);
          }
        }
      } catch (err) {
        console.error('Error fetching trashed files:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrashed();
  }, [refreshCounter, localRefresh]);

  const handleRecover = async (file: FileMetadata) => {
    try {
      const res = await fetch(`/api/files/${file.id}/recover`, { method: 'POST' });
      if (res.ok) {
        addNotification(
          isEn ? 'File recovered' : isPt ? 'Arquivo recuperado' : 'Archivo recuperado',
          isEn ? `"${file.name}" was restored to your projects.` : isPt ? `"${file.name}" foi restaurado para seus projetos.` : `"${file.name}" se restauró en tus proyectos.`,
          'info'
        );
        addActivity(
          'recover_file',
          isEn ? `Restored file from trash: ${file.name}` : isPt ? `Restaurou o arquivo da lixeira: ${file.name}` : `Restauró el archivo de la papelera: ${file.name}`
        );
        onRefresh();
        setLocalRefresh(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmptyTrash = async () => {
    const confirmMsg = isEn 
      ? 'Are you sure you want to permanently delete all files in the Trash? This action cannot be undone!' 
      : isPt 
      ? 'Tem certeza de que deseja excluir permanentemente todos os arquivos da lixeira? Esta ação não pode ser desfeita!' 
      : '¿Estás seguro de que deseas eliminar permanentemente todos los archivos de la papelera? ¡Esta acción es irreversible!';

    if (!window.confirm(confirmMsg)) return;

    try {
      setEmptying(true);
      for (const file of trashedFiles) {
        await fetch(`/api/files/${file.id}`, { method: 'DELETE' });
      }
      addNotification(
        isEn ? 'Trash emptied' : isPt ? 'Lixeira esvaziada' : 'Papelera vaciada',
        isEn ? 'All trashed files were permanently deleted.' : isPt ? 'Todos os arquivos da lixeira foram excluídos permanentemente.' : 'Todos los archivos de la papelera se eliminaron de forma permanente.',
        'deleted'
      );
      addActivity(
        'empty_trash',
        isEn ? 'Emptied Trash bin permanently.' : isPt ? 'Esvaziou a lixeira permanentemente.' : 'Vació la papelera permanentemente.'
      );
      onRefresh();
      setLocalRefresh(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setEmptying(false);
    }
  };

  return (
    <div className={`p-6 rounded-3xl ${isDark ? 'bg-neutral-900/40 border border-neutral-800' : 'bg-white border border-neutral-200'} space-y-6`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <span>{isEn ? 'Trash Bin' : isPt ? 'Lixeira' : isFr ? 'Corbeille' : isDe ? 'Papierkorb' : isIt ? 'Cestino' : isJa ? 'ゴミ箱' : isKo ? '휴지통' : isZh ? '回收站' : isRu ? 'Корзина' : 'Papelera'}</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            {isEn 
              ? 'Deleted files are saved here for 30 days before automatic permanent removal.' 
              : isPt 
              ? 'Arquivos excluídos são salvos aqui por 30 dias antes da remoção permanente automática.' 
              : 'Los archivos borrados se guardan aquí durante 30 días antes de su eliminación permanente automática.'}
          </p>
        </div>

        {trashedFiles.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            disabled={emptying}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-colors cursor-pointer"
          >
            {emptying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{isEn ? 'Empty Trash' : isPt ? 'Esvaziar Lixeira' : isFr ? 'Vider la corbeille' : isDe ? 'Papierkorb leeren' : isIt ? 'Svuota cestino' : isJa ? 'ゴミ箱を空にする' : isKo ? '휴지통 비우기' : isZh ? '清空回收站' : isRu ? 'Очистить корзину' : 'Vaciar papelera'}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-neutral-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <span>{isEn ? 'Loading deleted files...' : isPt ? 'Carregando arquivos excluídos...' : 'Cargando archivos eliminados...'}</span>
        </div>
      ) : trashedFiles.length === 0 ? (
        <div className="py-16 text-center text-neutral-400 font-semibold italic flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500">
            <Trash2 className="w-6 h-6" />
          </div>
          <span className="text-xs">
            {isEn ? 'The Trash bin is empty.' : isPt ? 'A lixeira está vazia.' : isFr ? 'La corbeille est vide.' : isDe ? 'Der Papierkorb ist leer.' : isIt ? 'Il cestino è vuoto.' : isJa ? 'ゴミ箱は空です。' : isKo ? '휴지통이 비어 있습니다.' : isZh ? '回收站已清空。' : isRu ? 'Корзина пуста.' : 'La papelera está vacía.'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trashedFiles.map((file) => (
            <div
              key={file.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                isDark 
                  ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700' 
                  : 'bg-white border-neutral-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 shrink-0">
                  {getFileTypeIcon(file.type, 'w-6 h-6')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-neutral-800 dark:text-neutral-100 truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                    {file.originalName}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 font-semibold">
                    {formatBytes(file.size)} • <span className="uppercase">{file.extension}</span>
                  </div>
                  {file.deletedAt && (
                    <div className="text-[9px] text-rose-500 mt-2 font-mono">
                      {isEn ? 'Deleted on: ' : isPt ? 'Excluído em: ' : 'Borrado el: '}
                      {new Date(file.deletedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                <button
                  onClick={() => handleRecover(file)}
                  className="flex-1 py-1.5 text-xs font-bold text-sky-500 bg-sky-500/10 hover:bg-sky-500/20 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Restore' : isPt ? 'Restaurar' : isFr ? 'Restaurer' : isDe ? 'Wiederherstellen' : isIt ? 'Ripristina' : isJa ? '復元' : isKo ? '복원' : isZh ? '还原' : isRu ? 'Восстановить' : 'Recuperar'}</span>
                </button>
                <button
                  onClick={() => onDelete(file)}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title={isEn ? 'Delete permanently' : isPt ? 'Excluir permanentemente' : 'Eliminar permanentemente'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
