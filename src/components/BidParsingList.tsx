import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  Calendar, 
  Clock,
  CheckCircle2,
  Edit,
  Trash2,
  ExternalLink,
  ChevronDown,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTableResizer } from '../hooks/useTableResizer';

interface Project {
  id: string;
  name: string;
  code: string;
  tenderer: string;
  updateTime: string;
  status: '未解析' | '解析中' | '已解析';
  latestFile?: string;
  uploadedFiles?: Record<string, boolean>;
}

interface BidParsingListProps {
  onEnterDetail: (project: Project) => void;
  currentEnterprise?: { id: string; name: string };
  isPaused?: boolean;
}

const BidParsingList: React.FC<BidParsingListProps> = ({ onEnterDetail, currentEnterprise, isPaused = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const { widths, onMouseDown } = useTableResizer([
    250,    // 项目名称
    150,    // 项目编号
    200,    // 招标人
    150,    // 更新时间
    100,    // 状态
    200     // 操作
  ]);
  
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: `2026年智慧交通管理平台建设项目`,
      code: 'ZB-2026-001',
      tenderer: 'XX市交通运输局',
      updateTime: '2025-11-20 14:30',
      status: '已解析',
      latestFile: '2026年智慧交通管理平台建设项目招标文件.pdf',
      uploadedFiles: { 'tender-doc': true }
    },
    {
      id: '2',
      name: `政务云扩容采购项目`,
      code: 'ZB-2026-005',
      tenderer: 'XX市大数据局',
      updateTime: '2025-11-19 10:15',
      status: '未解析',
      latestFile: '政务云扩容采购项目招标文件.pdf',
      uploadedFiles: { 'tender-doc': true, 'clar-doc-0': true }
    },
    {
      id: '3',
      name: `城市绿化带自动灌溉系统`,
      code: 'ZB-2026-008',
      tenderer: 'XX市园林局',
      updateTime: '2025-11-18 09:00',
      status: '未解析',
      uploadedFiles: {}
    }
  ]);

  const handleDelete = (id: string) => {
    if (isPaused) {
      alert('此项目已暂停');
      return;
    }
    setConfirmDialog({
      message: '确定要删除该项目吗？',
      onConfirm: () => {
        setProjects(projects.filter(p => p.id !== id));
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`space-y-6 ${isPaused ? 'opacity-75 grayscale-[0.2]' : ''}`}
    >
      <div className="flex items-center">
        <button 
          onClick={() => {
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
          }}
          className={`flex items-center gap-2 px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm hover:shadow-md ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus size={20} />
          新增解析项目
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">已解析项目</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">24 个</h3>
          <p className="text-xs text-slate-400 mt-2">累计解析文件 86 份</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">本月新增</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Plus size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">8 个</h3>
          <p className="text-xs text-slate-400 mt-2">较上月 +15%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">解析中</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">2 个</h3>
          <p className="text-xs text-slate-400 mt-2">预计 10 分钟内完成</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-64 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目名称、编号..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-40 relative group">
            <select 
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="全部">全部状态</option>
              <option value="已解析">已解析</option>
              <option value="解析中">解析中</option>
              <option value="未解析">未解析</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm hover:shadow-md transition-all">
            查询
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> 重置
          </button>
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {[
                  { label: '项目名称', key: 'name' },
                  { label: '项目编号', key: 'code' },
                  { label: '招标人', key: 'tenderer' },
                  { label: '更新时间', key: 'updateTime' },
                  { label: '状态', key: 'status' },
                  { label: '操作', key: 'action', align: 'right' }
                ].map((col, idx) => (
                  <th 
                    key={col.key} 
                    style={{ width: widths[idx] }}
                    className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    <span className="truncate">{col.label}</span>
                    {idx < 5 && (
                      <div 
                        onMouseDown={(e) => onMouseDown(idx, e)}
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary transition-colors z-10"
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.filter(p => p.name.includes(searchTerm) || p.code.includes(searchTerm)).map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 overflow-hidden">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="size-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm truncate" title={project.name}>{project.name}</p>
                        {project.latestFile && (
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 truncate" title={project.latestFile}>
                            <FileText size={10} className="shrink-0" /> {project.latestFile}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 overflow-hidden">
                    <div className="truncate" title={project.code}>{project.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 overflow-hidden">
                    <div className="truncate" title={project.tenderer}>{project.tenderer}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 overflow-hidden">
                    <div className="truncate" title={project.updateTime}>{project.updateTime}</div>
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      project.status === '已解析' ? 'bg-green-50 text-green-600' : 
                      project.status === '解析中' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {project.status === '已解析' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          if (isPaused) {
                            alert('此项目已暂停');
                            return;
                          }
                          onEnterDetail(project);
                        }}
                        className={`px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all text-xs font-bold flex items-center gap-1 shrink-0 whitespace-nowrap ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        开始解析
                      </button>
                      <button 
                        onClick={() => {
                          if (isPaused) {
                            alert('此项目已暂停');
                            return;
                          }
                        }}
                        className={`p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shrink-0 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认操作</h3>
              <p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BidParsingList;
