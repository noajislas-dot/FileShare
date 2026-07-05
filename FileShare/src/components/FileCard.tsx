import React from 'react';
import { FileMetadata, AppSettings } from '../types';
import { 
  FileText, Archive, Play, Music, Image as ImageIcon, Box, FileCode, File, 
  Download, Eye, Share2, Edit2, Trash2, Calendar, ShieldCheck, ShieldAlert, AlertTriangle, Heart, Star, Bookmark
} from 'lucide-react';
import { TranslationSchema } from '../lib/translations';

interface FileCardProps {
  key?: string | number;
  file: FileMetadata;
  settings: AppSettings;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  isFavorite: boolean;
  isLiked?: boolean;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleLike?: (id: string) => void;
  onDownload: (file: FileMetadata) => void;
  onShare: (file: FileMetadata) => void;
  onEdit: (file: FileMetadata) => any;
  onDelete: (file: FileMetadata) => any;
  onOpenDetails: (file: FileMetadata) => void;
  t: TranslationSchema;
}

// Convert bytes to clean representation
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Map file types to beautiful icons
export function getFileTypeIcon(type: string, className = 'w-5 h-5') {
  const t = type.toLowerCase();
  if (t.includes('apk')) return <Box className={`${className} text-emerald-500`} />;
  if (t.includes('comprimido') || t.includes('archive') || t.includes('zip') || t.includes('rar') || t.includes('7z')) {
    return <Archive className={`${className} text-amber-500`} />;
  }
  if (t.includes('documento') || t.includes('pdf') || t.includes('txt') || t.includes('doc')) {
    return <FileText className={`${className} text-blue-500`} />;
  }
  if (t.includes('imagen') || t.includes('png') || t.includes('jpg') || t.includes('gif') || t.includes('webp')) {
    return <ImageIcon className={`${className} text-indigo-500`} />;
  }
  if (t.includes('video') || t.includes('mp4') || t.includes('avi')) {
    return <Play className={`${className} text-rose-500`} />;
  }
  if (t.includes('audio') || t.includes('mp3') || t.includes('wav')) {
    return <Music className={`${className} text-violet-500`} />;
  }
  if (t.includes('ejecutable') || t.includes('exe') || t.includes('dll')) {
    return <FileCode className={`${className} text-orange-500`} />;
  }
  return <File className={`${className} text-neutral-500`} />;
}

export default function FileCard({
  file,
  settings,
  viewMode,
  isSelected,
  isFavorite,
  isLiked = false,
  onToggleSelect,
  onToggleFavorite,
  onToggleLike,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onOpenDetails,
  t
}: FileCardProps) {
  const isLiquid = settings.style === 'liquid-glass';
  const isDark = settings.theme === 'dark';

  const formatLikes = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  };

  // Format dates nicely
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const lang = settings.language || 'es';
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const textTitle = isDark ? 'text-neutral-100 hover:text-white' : 'text-neutral-800 hover:text-black';
  const textDesc = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const themeAccentColor = settings.theme === 'custom' ? settings.customColor : '#00a3ff';

  // Verification Seals
  const getVerificationSeals = () => {
    const seals = [];
    if (file.status === 'Revisado') {
      seals.push(
        <span key="reviewed" className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
          <ShieldCheck className="w-2.5 h-2.5" />
          {t.sealReviewed}
        </span>
      );
    } else if (file.status === 'Amenaza detectada') {
      seals.push(
        <span key="threat" className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/20">
          <ShieldAlert className="w-2.5 h-2.5" />
          {t.sealReported}
        </span>
      );
    }

    if (file.downloads >= 15 || file.isPopular) {
      seals.push(
        <span key="popular" className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/15 text-sky-500 border border-sky-500/20">
          <Star className="w-2.5 h-2.5 fill-sky-500" />
          {t.sealPopular}
        </span>
      );
    }

    if (file.isFeatured) {
      seals.push(
        <span key="featured" className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/20">
          🔥 {t.sealFeatured}
        </span>
      );
    }

    if (file.reports && file.reports.length > 0) {
      seals.push(
        <span key="reported" className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/20">
          ⚠️ {file.reports.length} {settings.language === 'en' ? 'reports' :
                                  settings.language === 'pt' ? 'denúncias' :
                                  settings.language === 'fr' ? 'signalements' :
                                  settings.language === 'de' ? 'Meldungen' :
                                  settings.language === 'it' ? 'segnalazioni' :
                                  settings.language === 'ja' ? '通報' :
                                  settings.language === 'ko' ? '신고' :
                                  settings.language === 'zh' ? '举报' :
                                  settings.language === 'ru' ? 'жалобы' : 'reportes'}
        </span>
      );
    }

    return seals;
  };

  // 1. GRID LAYOUT
  if (viewMode === 'grid') {
    return (
      <div
        className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
          isLiquid
            ? isDark
              ? 'bg-neutral-900/40 backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-2xl'
              : 'bg-white/40 backdrop-blur-md border border-neutral-200 hover:border-neutral-300 hover:shadow-xl'
            : isDark
            ? 'bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 hover:shadow-2xl'
            : 'bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl'
        }`}
      >
        {/* Checkbox & Favorite button */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(file.id)}
            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
          />
          <button
            onClick={() => onToggleFavorite(file.id)}
            className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'}`} />
          </button>
        </div>

        {/* Verification badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
          {getVerificationSeals().slice(0, 2)}
        </div>

        {/* Cover Image or Placeholder */}
        <div 
          onClick={() => onOpenDetails(file)}
          className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 cursor-pointer"
        >
          {file.coverName ? (
            <img
              src={`/data/uploads/${file.coverName}`}
              alt={file.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-neutral-400 dark:text-neutral-500">
              {getFileTypeIcon(file.type, 'w-12 h-12 mb-2')}
              <span className="text-[10px] font-semibold font-mono tracking-widest uppercase opacity-75">{file.extension}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                {getFileTypeIcon(file.type, 'w-4 h-4')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 
                  onClick={() => onOpenDetails(file)}
                  className={`text-sm font-bold leading-tight line-clamp-1 cursor-pointer ${textTitle}`}
                >
                  {file.name}
                </h3>
                {file.uploaderId && (
                  <span className="text-[9px] font-mono text-neutral-500">{file.uploaderId}</span>
                )}
              </div>
            </div>

            <p className={`text-xs line-clamp-2 min-h-[2rem] ${textDesc}`}>
              {file.description || 
               (settings.language === 'en' ? 'No description added by the user.' :
                settings.language === 'pt' ? 'Nenhuma descrição adicionada pelo usuário.' :
                settings.language === 'fr' ? 'Aucune description ajoutée par l\'utilisateur.' :
                settings.language === 'de' ? 'Keine Beschreibung vom Benutzer hinzugefügt.' :
                settings.language === 'it' ? 'Nessuna descrizione aggiunta dall\'utente.' :
                settings.language === 'ja' ? 'ユーザーによる説明はありません。' :
                settings.language === 'ko' ? '사용자가 작성한 설명이 없습니다.' :
                settings.language === 'zh' ? '用户未添加任何描述。' :
                settings.language === 'ru' ? 'Описание не добавлено пользователем.' : 'Sin descripción añadida por el usuario.')}
            </p>

            {/* Tags preview */}
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {file.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sky-500/10 text-sky-500 truncate max-w-[80px]">
                    #{tag}
                  </span>
                ))}
                {file.tags.length > 3 && (
                  <span className="text-[9px] text-neutral-500 font-mono">+{file.tags.length - 3}</span>
                )}
              </div>
            )}

            {/* Ratings and votes */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span className="ml-1 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {typeof file.rating === 'number' ? file.rating.toFixed(1) : '0.0'}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">
                ({typeof file.votesCount === 'number' ? file.votesCount : 0} {t.votesSuffix})
              </span>
              {file.version && (
                <span className="ml-auto text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">
                  v{file.version}
                </span>
              )}
            </div>

            {/* Tags and Metadata */}
            <div className="flex flex-wrap gap-1.5 pt-1.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/60">{formatBytes(file.size)}</span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/60 uppercase">{file.extension || 'FILE'}</span>
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/60 flex items-center gap-0.5">
                <Calendar className="w-2.5 h-2.5" />
                {formatDate(file.uploadDate)}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3 py-3 border-t border-b border-neutral-100 dark:border-neutral-800/50 my-4 text-[11px] font-semibold text-neutral-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {file.views} {file.views === 1 
                ? (settings.language === 'en' ? 'view' :
                   settings.language === 'pt' ? 'visualização' :
                   settings.language === 'fr' ? 'vue' :
                   settings.language === 'de' ? 'Aufruf' :
                   settings.language === 'it' ? 'vista' :
                   settings.language === 'ja' ? 'ビュー' :
                   settings.language === 'ko' ? '조회' :
                   settings.language === 'zh' ? '次浏览' :
                   settings.language === 'ru' ? 'просмотр' : 'vista')
                : (settings.language === 'en' ? 'views' :
                   settings.language === 'pt' ? 'visualizações' :
                   settings.language === 'fr' ? 'vues' :
                   settings.language === 'de' ? 'Aufrufe' :
                   settings.language === 'it' ? 'viste' :
                   settings.language === 'ja' ? 'ビュー' :
                   settings.language === 'ko' ? '조회수' :
                   settings.language === 'zh' ? '次浏览' :
                   settings.language === 'ru' ? 'просмотров' : 'vistas')}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {file.downloads} {file.downloads === 1 
                ? (settings.language === 'en' ? 'download' :
                   settings.language === 'pt' ? 'download' :
                   settings.language === 'fr' ? 'téléchargement' :
                   settings.language === 'de' ? 'Download' :
                   settings.language === 'it' ? 'download' :
                   settings.language === 'ja' ? 'ダウンロード' :
                   settings.language === 'ko' ? '다운로드' :
                   settings.language === 'zh' ? '次下载' :
                   settings.language === 'ru' ? 'скачивание' : 'descarga')
                : (settings.language === 'en' ? 'downloads' :
                   settings.language === 'pt' ? 'downloads' :
                   settings.language === 'fr' ? 'téléchargements' :
                   settings.language === 'de' ? 'Downloads' :
                   settings.language === 'it' ? 'download' :
                   settings.language === 'ja' ? 'ダウンロード数' :
                   settings.language === 'ko' ? '다운로드수' :
                   settings.language === 'zh' ? '次下载' :
                   settings.language === 'ru' ? 'скачиваний' : 'descargas')}
            </span>

            <button
              id={`like-btn-grid-${file.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleLike) onToggleLike(file.id);
              }}
              className="ml-auto flex items-center gap-1 p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all cursor-pointer animate-pulse-once"
              title={isLiked ? 'Quitar me gusta' : 'Dar me gusta'}
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-all ${
                  isLiked 
                    ? 'text-red-500 fill-red-500 scale-110' 
                    : 'text-neutral-950 dark:text-neutral-50 fill-neutral-950 dark:fill-neutral-50'
                }`} 
              />
              <span className={`text-[11px] font-extrabold ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-neutral-950 dark:text-neutral-50'
              }`}>
                {formatLikes(file.likes || 0)}
              </span>
            </button>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1">
              <button
                id={`share-btn-grid-${file.id}`}
                onClick={() => onShare(file)}
                className="p-2 text-neutral-400 hover:text-sky-500 hover:bg-sky-500/10 rounded-xl transition-colors cursor-pointer"
                title={settings.language === 'en' ? 'Share link' :
                       settings.language === 'pt' ? 'Compartilhar link' :
                       settings.language === 'fr' ? 'Partager le lien' :
                       settings.language === 'de' ? 'Link teilen' :
                       settings.language === 'it' ? 'Condividi link' :
                       settings.language === 'ja' ? 'リンクを共有' :
                       settings.language === 'ko' ? '링크 공유' :
                       settings.language === 'zh' ? '分享链接' :
                       settings.language === 'ru' ? 'Поделиться ссылкой' : 'Compartir enlace'}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                id={`edit-btn-grid-${file.id}`}
                onClick={() => onEdit(file)}
                className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
                title={settings.language === 'en' ? 'Edit metadata' :
                       settings.language === 'pt' ? 'Editar metadados' :
                       settings.language === 'fr' ? 'Modifier les métadonnées' :
                       settings.language === 'de' ? 'Metadaten bearbeiten' :
                       settings.language === 'it' ? 'Modifica metadati' :
                       settings.language === 'ja' ? 'メタデータを編集' :
                       settings.language === 'ko' ? '메타데이터 편집' :
                       settings.language === 'zh' ? '编辑元数据' :
                       settings.language === 'ru' ? 'Редактировать метаданные' : 'Editar metadatos'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                id={`delete-btn-grid-${file.id}`}
                onClick={() => onDelete(file)}
                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                title={settings.language === 'en' ? 'Delete file' :
                       settings.language === 'pt' ? 'Excluir arquivo' :
                       settings.language === 'fr' ? 'Supprimer le fichier' :
                       settings.language === 'de' ? 'Datei löschen' :
                       settings.language === 'it' ? 'Elimina file' :
                       settings.language === 'ja' ? 'ファイルを削除' :
                       settings.language === 'ko' ? '파일 삭제' :
                       settings.language === 'zh' ? '删除文件' :
                       settings.language === 'ru' ? 'Удалить файл' : 'Eliminar archivo'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              id={`download-btn-grid-${file.id}`}
              onClick={() => onDownload(file)}
              style={{ backgroundColor: file.status === 'Amenaza detectada' ? '#ef4444' : themeAccentColor }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {t.downloadBtn || 'Descargar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. LIST LAYOUT
  return (
    <div
      className={`group relative flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 rounded-2xl gap-4 transition-all duration-300 ${
        isLiquid
          ? isDark
            ? 'bg-neutral-900/40 backdrop-blur-md border border-white/10 hover:border-white/20'
            : 'bg-white/40 backdrop-blur-md border border-neutral-200 hover:border-neutral-300'
          : isDark
          ? 'bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80'
          : 'bg-white border border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(file.id)}
          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-sky-500 focus:ring-sky-500 cursor-pointer shrink-0"
        />

        <button
          onClick={() => onToggleFavorite(file.id)}
          className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
          title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
        >
          <Bookmark className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
        </button>

        {/* Small thumbnail preview */}
        <div 
          onClick={() => onOpenDetails(file)}
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-800 cursor-pointer"
        >
          {file.coverName ? (
            <img
              src={`/data/uploads/${file.coverName}`}
              alt={file.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              {getFileTypeIcon(file.type, 'w-6 h-6')}
            </div>
          )}
        </div>

        {/* Details text */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 
              onClick={() => onOpenDetails(file)}
              className={`text-sm md:text-base font-bold truncate cursor-pointer max-w-[280px] md:max-w-md ${textTitle}`}
            >
              {file.name}
            </h3>
            {getVerificationSeals().slice(0, 2)}
          </div>
          
          <p className={`text-xs truncate max-w-sm mt-0.5 hidden md:block ${textDesc}`}>
            {file.description || 
             (settings.language === 'en' ? 'No description added.' :
              settings.language === 'pt' ? 'Nenhuma descrição adicionada.' :
              settings.language === 'fr' ? 'Aucune description ajoutée.' :
              settings.language === 'de' ? 'Keine Beschreibung hinzugefügt.' :
              settings.language === 'it' ? 'Nessuna descrizione aggiunta.' :
              settings.language === 'ja' ? '説明はありません。' :
              settings.language === 'ko' ? '추가된 설명이 없습니다.' :
              settings.language === 'zh' ? '未添加描述。' :
              settings.language === 'ru' ? 'Описание не добавлено.' : 'Sin descripción añadida.')}
          </p>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-mono text-neutral-500 mt-1">
            <span className="font-semibold uppercase text-sky-500">{file.type}</span>
            <span>•</span>
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span className="uppercase">{file.extension}</span>
            {file.version && (
              <>
                <span>•</span>
                <span>v{file.version}</span>
              </>
            )}
            {file.uploaderId && (
              <>
                <span>•</span>
                <span>{file.uploaderId}</span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              {typeof file.rating === 'number' ? file.rating.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats and Action Controls */}
      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none border-neutral-100 dark:border-neutral-800/50 pt-3 md:pt-0">
        <div className="flex items-center gap-3 text-[11px] font-semibold text-neutral-500 pr-2">
          <span className="flex items-center gap-1" title={settings.language === 'en' ? 'Views' : 'Visualizaciones'}>
            <Eye className="w-3.5 h-3.5" />
            {file.views}
          </span>
          <span className="flex items-center gap-1" title={settings.language === 'en' ? 'Downloads' : 'Descargas'}>
            <Download className="w-3.5 h-3.5" />
            {file.downloads}
          </span>
          <button
            id={`like-btn-list-${file.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleLike) onToggleLike(file.id);
            }}
            className="flex items-center gap-1 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all cursor-pointer animate-pulse-once"
            title={isLiked ? 'Quitar me gusta' : 'Dar me gusta'}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-all ${
                isLiked 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-neutral-950 dark:text-neutral-50 fill-neutral-950 dark:fill-neutral-50'
              }`} 
            />
            <span className={`text-[11px] font-extrabold ${
              isLiked 
                ? 'text-red-500' 
                : 'text-neutral-950 dark:text-neutral-50'
            }`}>
              {formatLikes(file.likes || 0)}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id={`share-btn-list-${file.id}`}
            onClick={() => onShare(file)}
            className="p-2 text-neutral-400 hover:text-sky-500 hover:bg-sky-500/10 rounded-xl transition-colors cursor-pointer"
            title={settings.language === 'en' ? 'Share link' :
                   settings.language === 'pt' ? 'Compartilhar link' :
                   settings.language === 'fr' ? 'Partager le lien' :
                   settings.language === 'de' ? 'Link teilen' :
                   settings.language === 'it' ? 'Condividi link' :
                   settings.language === 'ja' ? 'リンクを共有' :
                   settings.language === 'ko' ? 'リンク 공유' :
                   settings.language === 'zh' ? '分享链接' :
                   settings.language === 'ru' ? 'Поделиться ссылкой' : 'Compartir enlace'}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            id={`edit-btn-list-${file.id}`}
            onClick={() => onEdit(file)}
            className="p-2 text-neutral-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
            title={settings.language === 'en' ? 'Edit metadata' :
                   settings.language === 'pt' ? 'Editar metadados' :
                   settings.language === 'fr' ? 'Modifier les métadonnées' :
                   settings.language === 'de' ? 'Metadaten bearbeiten' :
                   settings.language === 'it' ? 'Modifica metadati' :
                   settings.language === 'ja' ? 'メタデータを編集' :
                   settings.language === 'ko' ? '메타데이터 편집' :
                   settings.language === 'zh' ? '编辑元数据' :
                   settings.language === 'ru' ? 'Редактировать метаданные' : 'Editar metadatos'}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            id={`delete-btn-list-${file.id}`}
            onClick={() => onDelete(file)}
            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            title={settings.language === 'en' ? 'Delete file' :
                   settings.language === 'pt' ? 'Excluir arquivo' :
                   settings.language === 'fr' ? 'Supprimer le fichier' :
                   settings.language === 'de' ? 'Datei löschen' :
                   settings.language === 'it' ? 'Elimina file' :
                   settings.language === 'ja' ? 'ファイルを削除' :
                   settings.language === 'ko' ? '파일 삭제' :
                   settings.language === 'zh' ? '删除文件' :
                   settings.language === 'ru' ? 'Удалить файл' : 'Eliminar archivo'}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            id={`download-btn-list-${file.id}`}
            onClick={() => onDownload(file)}
            style={{ backgroundColor: file.status === 'Amenaza detectada' ? '#ef4444' : themeAccentColor }}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white rounded-xl shadow hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t.downloadBtn || 'Descargar'}
          </button>
        </div>
      </div>
    </div>
  );
}
