import React, { useState } from 'react';
import { Heart, Search, Grid, List, HelpCircle, ArrowUpDown } from 'lucide-react';
import { FileMetadata, AppSettings } from '../types';
import FileCard from './FileCard';

interface LikesPanelProps {
  settings: AppSettings;
  t: any;
  allFiles: FileMetadata[];
  likedFiles: string[];
  favorites: string[];
  selectedFileIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleLike: (id: string) => void;
  onDownload: (file: FileMetadata) => void;
  onShare: (file: FileMetadata) => void;
  onEdit: (file: FileMetadata) => void;
  onDelete: (file: FileMetadata) => void;
  onOpenDetails: (file: FileMetadata) => void;
  onGoToExplore: () => void;
}

export default function LikesPanel({
  settings,
  t,
  allFiles,
  likedFiles,
  favorites,
  selectedFileIds,
  onToggleSelect,
  onToggleFavorite,
  onToggleLike,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onOpenDetails,
  onGoToExplore
}: LikesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'likes'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const isDark = settings.theme === 'dark' || settings.theme === 'custom';
  const lang = settings.language;
  const isEn = lang === 'en';
  const isPt = lang === 'pt';

  // Language variables
  const titleText = isEn ? 'Liked Files' : isPt ? 'Arquivos Curtidos' : 'Mis Me Gusta';
  const subtitleText = isEn 
    ? 'Files you have liked. Clicking the heart removes a file from this list.' 
    : isPt 
    ? 'Arquivos que você curtiu. Clicar no coração remove o arquivo desta lista.' 
    : 'Archivos a los que les has dado me gusta. Haz clic en el corazón para quitarlos de esta lista.';
  const searchPlaceholder = isEn ? 'Search liked files...' : isPt ? 'Buscar arquivos curtidos...' : 'Buscar archivos que me gustan...';
  const totalLikesText = isEn ? 'Total Likes' : isPt ? 'Total de Curtidas' : 'Total de Me Gusta';
  const emptyTitle = isEn ? 'No liked files yet' : isPt ? 'Nenhum arquivo curtido ainda' : 'No hay archivos que te gusten';
  const emptyDesc = isEn 
    ? 'Explore files and click the heart icon to add them to this list.' 
    : isPt 
    ? 'Explore os arquivos e clique no ícone de coração para adicioná-los a esta lista.' 
    : 'Explora los archivos y haz clic en el corazón para añadirlos a esta lista.';
  const exploreBtnText = isEn ? 'Explore Files' : isPt ? 'Explorar Arquivos' : 'Explorar Archivos';
  const noMatchesText = isEn ? 'No matches found.' : isPt ? 'Nenhum resultado encontrado.' : 'No se encontraron coincidencias.';

  // Filter out any deleted files and keep only files in likedFiles
  const likedList = allFiles.filter(f => {
    const isFileDeleted = f.isDeleted === true || (f.isDeleted as any) === 'true';
    return !isFileDeleted && likedFiles.includes(f.id);
  });

  // Filter based on search query
  const filteredList = likedList.filter(file => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      file.name.toLowerCase().includes(q) ||
      (file.description && file.description.toLowerCase().includes(q)) ||
      file.extension.toLowerCase().includes(q) ||
      (file.tags && file.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  // Sort
  const sortedList = [...filteredList].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      comparison = a.size - b.size;
    } else if (sortBy === 'likes') {
      comparison = (a.likes || 0) - (b.likes || 0);
    } else {
      // Date (uploadDate)
      comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div id="likes-panel-container" className="space-y-6">
      {/* 1. Header Section */}
      <div className={`p-6 rounded-3xl border ${
        isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
      } flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-red-500/10 text-red-500">
            <Heart className="w-7 h-7 fill-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-neutral-800 dark:text-neutral-50 flex items-center gap-2">
              {titleText}
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-mono">
                {likedList.length}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-xl leading-relaxed">
              {subtitleText}
            </p>
          </div>
        </div>
        
        {/* Stats card */}
        <div className="p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/40 border border-neutral-200/20 text-right self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end gap-2">
          <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">{totalLikesText}</span>
          <span className="text-lg font-black text-red-500 font-mono">{likedList.length}</span>
        </div>
      </div>

      {/* 2. Controls & Search bar */}
      {likedList.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="likes-search-input"
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-2xl border outline-none transition-all ${
                isDark 
                  ? 'border-neutral-800 bg-neutral-900/50 text-white focus:border-red-500' 
                  : 'border-neutral-200 bg-white text-neutral-800 focus:border-red-500 focus:shadow-sm'
              }`}
            />
          </div>

          {/* Sorter and Layout toggle */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                id="likes-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border outline-none cursor-pointer transition-colors ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950 text-neutral-300 focus:border-red-500' 
                    : 'border-neutral-200 bg-white text-neutral-700 focus:border-red-500'
                }`}
              >
                <option value="date">{isEn ? 'Upload Date' : isPt ? 'Data de envio' : 'Fecha de subida'}</option>
                <option value="name">{isEn ? 'Name' : isPt ? 'Nome' : 'Nombre'}</option>
                <option value="size">{isEn ? 'Size' : isPt ? 'Tamanho' : 'Tamaño'}</option>
                <option value="likes">{isEn ? 'Likes Count' : isPt ? 'Quantidade de curtidas' : 'Popularidad (Likes)'}</option>
              </select>
              
              <button
                id="likes-sort-order-btn"
                onClick={toggleSortOrder}
                className={`p-1.5 rounded-xl border cursor-pointer transition-colors ${
                  isDark ? 'border-neutral-800 hover:bg-neutral-800 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
                }`}
                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* View Grid/List Selector */}
            <div className="flex items-center bg-neutral-200/55 dark:bg-neutral-800/60 p-1 rounded-xl">
              <button
                id="likes-view-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-neutral-700 shadow text-red-500' 
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                id="likes-view-list-btn"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-neutral-700 shadow text-red-500' 
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Render Area */}
      {likedList.length === 0 ? (
        /* Entirely Empty State */
        <div className={`p-12 text-center rounded-3xl border border-dashed ${
          isDark ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-200 bg-neutral-50/50'
        } max-w-md mx-auto space-y-4 py-16`}>
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/30 text-red-500 flex items-center justify-center mx-auto animate-pulse">
            <Heart className="w-6 h-6 fill-red-500/10" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-neutral-800 dark:text-neutral-200 text-sm">
              {emptyTitle}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
              {emptyDesc}
            </p>
          </div>
          <button
            id="likes-empty-explore-btn"
            onClick={onGoToExplore}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            {exploreBtnText}
          </button>
        </div>
      ) : sortedList.length === 0 ? (
        /* Search has no results state */
        <div className="p-12 text-center text-neutral-500 italic text-xs font-semibold">
          {noMatchesText}
        </div>
      ) : (
        /* Catalog rendering */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedList.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                settings={settings}
                viewMode="grid"
                isSelected={selectedFileIds.includes(file.id)}
                isFavorite={favorites.includes(file.id)}
                isLiked={true}
                onToggleSelect={onToggleSelect}
                onToggleFavorite={onToggleFavorite}
                onToggleLike={onToggleLike}
                onDownload={onDownload}
                onShare={onShare}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenDetails={onOpenDetails}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedList.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                settings={settings}
                viewMode="list"
                isSelected={selectedFileIds.includes(file.id)}
                isFavorite={favorites.includes(file.id)}
                isLiked={true}
                onToggleSelect={onToggleSelect}
                onToggleFavorite={onToggleFavorite}
                onToggleLike={onToggleLike}
                onDownload={onDownload}
                onShare={onShare}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenDetails={onOpenDetails}
                t={t}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
