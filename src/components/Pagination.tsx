import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  RotateCw 
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh?: () => void;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  totalItems
}) => {
  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 border-t border-slate-100 text-slate-600 text-sm">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <select 
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30 transition-all text-xs font-bold"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="w-px h-4 bg-slate-200"></div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
          title="第一页"
        >
          <ChevronsLeft size={16} className="text-primary" />
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
          title="上一页"
        >
          <ChevronLeft size={16} className="text-primary" />
        </button>

        <div className="flex items-center gap-2 mx-2">
          <input 
            type="number" 
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-12 text-center border border-slate-200 rounded py-1 text-xs font-bold outline-none focus:ring-1 focus:ring-primary/30"
          />
          <span className="text-slate-400">/</span>
          <span className="font-bold">{totalPages || 1}</span>
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
          title="下一页"
        >
          <ChevronRight size={16} className="text-primary" />
        </button>
        <button 
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
          title="最后一页"
        >
          <ChevronsRight size={16} className="text-primary" />
        </button>
      </div>

      <div className="w-px h-4 bg-slate-200"></div>

      {/* Refresh Button */}
      <button 
        onClick={onRefresh}
        className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-primary"
        title="刷新"
      >
        <RotateCw size={16} />
      </button>

      {totalItems !== undefined && (
        <div className="ml-auto text-xs text-slate-500 font-medium">
          每页 <span className="text-slate-900">{pageSize}</span> 条, 共 <span className="text-slate-900">{totalItems}</span> 条
        </div>
      )}
    </div>
  );
};

export default Pagination;
