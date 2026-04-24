import React, { useState } from 'react';
import { Search, Plus, FolderPlus, FileText, Image as ImageIcon, File, MoreVertical, Download, Trash2, Filter, Edit2, ChevronRight, ChevronDown, Folder, FolderOpen, Upload, X, Edit3, AlertCircle, Eye, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';
import { useTableResizer } from '../hooks/useTableResizer';

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const initialFolders: FolderNode[] = [
  {
    id: '1',
    name: '产品介绍与折页',
    children: [
      { id: '1-1', name: '企业宣传册' },
      { id: '1-2', name: '产品单页' },
      { id: '1-3', name: '推介PPT' }
    ]
  },
  {
    id: '2',
    name: '通用技术标模板',
    children: [
      { id: '2-1', name: '房建类模板' },
      { id: '2-2', name: '市政类模板' },
      { id: '2-3', name: '装饰装修类' }
    ]
  },
  {
    id: '3',
    name: '报价单模板',
    children: [
      { id: '3-1', name: '标准报价单' },
      { id: '3-2', name: '分包报价表' }
    ]
  },
  {
    id: '4',
    name: '合同模板',
    children: [
      { id: '4-1', name: '施工合同' },
      { id: '4-2', name: '采购合同' },
      { id: '4-3', name: '劳务合同' }
    ]
  },
  {
    id: '5',
    name: '企业资质文件',
    children: [
      { id: '5-1', name: '营业执照' },
      { id: '5-2', name: '资质证书' },
      { id: '5-3', name: '体系认证' }
    ]
  },
  { id: '6', name: '业绩证明材料' }
];



interface MaterialsProps {
  currentEnterprise?: { id: string; name: string };
}

const Materials: React.FC<MaterialsProps> = ({ currentEnterprise }) => {
  const enterpriseName = currentEnterprise?.name || '杭州某某科技有限公司';
  const enterpriseId = currentEnterprise?.id || 'ent-1';

  const getMockFiles = () => {
    const baseFiles = [
      { id: 'f1', name: `企业宣传册-2026版.pdf`, type: 'pdf', size: '12.5MB', date: '2026-03-18' },
      { id: 'f2', name: `产品介绍PPT-通用版.pptx`, type: 'ppt', size: '8.2MB', date: '2026-03-15' },
      { id: 'f3', name: `技术标通用模板-V3.0.docx`, type: 'word', size: '2.1MB', date: '2026-03-12' },
      { id: 'f4', name: `标准报价单模板.xlsx`, type: 'excel', size: '1.4MB', date: '2026-03-10' },
      { id: 'f5', name: `施工合同通用模板.docx`, type: 'word', size: '1.8MB', date: '2026-03-05' },
      { id: 'f6', name: `营业执照副本扫描件.pdf`, type: 'pdf', size: '3.2MB', date: '2026-02-28' },
      { id: 'f7', name: `质量管理体系认证证书.pdf`, type: 'pdf', size: '2.8MB', date: '2026-02-25' },
    ];

    if (enterpriseId === 'personal') {
      return [
        { id: 'p1', name: '个人简历.pdf', type: 'pdf', size: '1.2MB', date: '2026-01-10' },
        { id: 'p2', name: '作品集.zip', type: 'zip', size: '45MB', date: '2026-02-15' },
      ];
    }

    return baseFiles;
  };

  const mockFiles = getMockFiles();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['1', '2', '5']);
  const [selectedFolder, setSelectedFolder] = useState<string>('1-1');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; folderId: string } | null>(null);

  const { widths, onMouseDown } = useTableResizer([
    48,     // Checkbox
    'auto', // 文件名
    120,    // 类型
    100,    // 大小
    150,    // 上传人
    150,    // 最后更新日期
    80      // 操作
  ]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingFile, setEditingFile] = useState<any>(null);
  const [materialName, setMaterialName] = useState('');
  const [uploadType, setUploadType] = useState('技术材料');
  const [remark, setRemark] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<any[]>([]);

  const handleOpenModal = (mode: 'add' | 'edit', file?: any) => {
    setModalMode(mode);
    setHasAttemptedSave(false);
    if (mode === 'edit' && file) {
      setEditingFile(file);
      setMaterialName(file.name.split('.')[0]);
      setUploadType(file.type === 'ppt' ? '技术材料' : file.type === 'pdf' ? '商务材料' : '其它');
      setRemark('');
      setUploadFiles([{ ...file, id: 'existing-' + file.id }]);
    } else {
      setEditingFile(null);
      setMaterialName('');
      setUploadType('技术材料');
      setRemark('');
      setUploadFiles([]);
    }
    setShowModal(true);
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!materialName.trim()) return;
    
    // Mock save
    console.log('Saving material:', { materialName, uploadType, remark, uploadFiles });
    setShowModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: any, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        date: new Date().toISOString().split('T')[0]
      }));
      setUploadFiles([...uploadFiles, ...newFiles]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, folderId });
  };

  const closeContextMenu = () => setContextMenu(null);

  React.useEffect(() => {
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, []);

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = selectedFolder === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    const handleRename = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newName = prompt('请输入新的目录名称:', folder.name);
      if (newName && newName.trim()) {
        console.log(`Renaming folder ${folder.id} to ${newName}`);
        // In a real app, you would update the state here
      }
    };

    const handleAddSub = (e: React.MouseEvent) => {
      e.stopPropagation();
      const subName = prompt('请输入子目录名称:');
      if (subName && subName.trim()) {
        console.log(`Adding subfolder to ${folder.id}: ${subName}`);
        // In a real app, you would update the state here
      }
    };

    return (
      <div key={folder.id}>
        <div 
          className={`group/folder flex items-center justify-between py-2 px-2 rounded-xl cursor-pointer transition-all mb-0.5 ${
            isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedFolder(folder.id)}
          onContextMenu={(e) => handleContextMenu(e, folder.id)}
        >
          <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
            <div 
              className="w-4 h-4 flex items-center justify-center shrink-0 hover:bg-slate-200 rounded transition-colors"
              onClick={(e) => {
                if (hasChildren) {
                  e.stopPropagation();
                  setExpandedFolders(prev => 
                    prev.includes(folder.id) ? prev.filter(id => id !== folder.id) : [...prev, folder.id]
                  );
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? <ChevronDown size={14} className={isSelected ? "text-blue-600" : "text-slate-400"} /> : <ChevronRight size={14} className={isSelected ? "text-blue-600" : "text-slate-400"} />
              ) : <span className="w-4" />}
            </div>
            
            {isExpanded && hasChildren ? (
              <FolderOpen size={16} className={isSelected ? "text-blue-600" : "text-slate-400"} />
            ) : (
              <Folder size={16} className={isSelected ? "text-blue-600" : "text-slate-400"} />
            )}
            
            <div className="flex items-center gap-1 truncate">
              <span className={`text-sm truncate select-none ${isSelected ? 'font-bold' : 'font-medium'}`}>
                {folder.name}
              </span>
              <button 
                className={`p-0.5 text-slate-400 hover:text-blue-600 transition-opacity opacity-0 ${isSelected ? 'group-hover/folder:opacity-100' : ''}`} 
                title="重命名"
                onClick={handleRename}
              >
                <Edit2 size={12} />
              </button>
            </div>
          </div>

          <button 
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all shrink-0" 
            title="新增子目录"
            onClick={handleAddSub}
          >
            <Plus size={14} />
          </button>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {folder.children!.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[calc(100vh-120px)] flex overflow-hidden">
      {/* Left: Folder Tree */}
      <div className="w-80 border-r border-slate-100 p-6 flex flex-col shrink-0">
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 text-lg">企业素材</h3>
        </div>
        
        <div className="mb-6">
          <button 
            onClick={() => {
              const name = prompt('请输入新目录名称:');
              if (name && name.trim()) {
                console.log(`Adding new root folder: ${name}`);
              }
            }}
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition-all group"
          >
            <Plus size={18} className="group-hover:scale-110 transition-transform" /> 新增目录
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {initialFolders.map(folder => renderFolder(folder))}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[100] bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 min-w-[140px] animate-in fade-in zoom-in duration-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
            onClick={() => {
              // In a real app, update state here to delete folder
              console.log(`Deleting folder ${contextMenu.folderId}`);
              closeContextMenu();
            }}
          >
            <Trash2 size={14} />
            删除目录
          </button>
        </div>
      )}

      {/* Right: File List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8 flex-1">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2 shrink-0">
              <FolderOpen size={20} className="text-[#0052CC]" />
              全部文档
            </h4>
            
            <div className="max-w-md w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0052CC] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="搜索文档名称..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:bg-white transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenModal('add')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={18} />
              上传材料
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Trash2 size={18} className="text-slate-400" />
              删除资料
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">
              <Download size={16} />
              导出数据
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                {[
                  { label: 'Checkbox', key: 'checkbox', type: 'checkbox' },
                  { label: '文件名', key: 'name' },
                  { label: '类型', key: 'type' },
                  { label: '大小', key: 'size' },
                  { label: '上传人', key: 'uploader' },
                  { label: '最后更新日期', key: 'date' },
                  { label: '操作', key: 'action', align: 'right' }
                ].map((col, idx) => (
                  <th 
                    key={col.key} 
                    style={{ width: widths[idx] }}
                    className={`px-8 py-4 relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    {col.type === 'checkbox' ? (
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        checked={selectedFiles.length === mockFiles.length && mockFiles.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(mockFiles.map(f => f.id));
                          } else {
                            setSelectedFiles([]);
                          }
                        }}
                      />
                    ) : (
                      <span className="truncate">{col.label}</span>
                    )}
                    {idx < 6 && (
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
              {mockFiles
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(prev => [...prev, file.id]);
                        } else {
                          setSelectedFiles(prev => prev.filter(id => id !== file.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-8 py-4 overflow-hidden">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`size-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                        file.type === 'ppt' ? 'bg-orange-50 text-orange-500' :
                        file.type === 'pdf' ? 'bg-rose-50 text-rose-500' :
                        file.type === 'image' ? 'bg-blue-50 text-blue-500' :
                        file.type === 'zip' ? 'bg-purple-50 text-purple-500' :
                        'bg-indigo-50 text-indigo-500'
                      }`}>
                        {file.type === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors cursor-pointer truncate" title={file.name}>{file.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 overflow-hidden">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold truncate block w-fit" title={file.type === 'ppt' ? '技术材料' : file.type === 'pdf' ? '商务材料' : '其它'}>
                      {file.type === 'ppt' ? '技术材料' : file.type === 'pdf' ? '商务材料' : '其它'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500 font-medium overflow-hidden">
                    <div className="truncate" title={file.size}>{file.size}</div>
                  </td>
                  <td className="px-8 py-4 overflow-hidden">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="size-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${file.id}`} alt="avatar" className="size-full object-cover" />
                      </div>
                      <span className="text-sm text-slate-600 font-medium truncate">管理员</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500 overflow-hidden">
                    <div className="truncate" title={file.date}>{file.date}</div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => handleOpenModal('edit', file)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" 
                      title="编辑"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/30">
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(mockFiles.length / pageSize)}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            totalItems={mockFiles.length}
          />
        </div>
      </div>

      {/* Edit/Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    {modalMode === 'add' ? <Upload size={24} /> : <Edit3 size={24} />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{modalMode === 'add' ? '上传材料' : '修改材料'}</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-10 flex-1 flex flex-col overflow-hidden">
                <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">企业名称</label>
                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                          {enterpriseName}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">材料类型</label>
                        <div className="relative">
                          <div 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all shadow-sm"
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                          >
                            <span>{uploadType}</span>
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                          </div>
                          
                          {showCategoryDropdown && (
                            <>
                              <div className="fixed inset-0 z-[60]" onClick={() => setShowCategoryDropdown(false)} />
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[70] max-h-60 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                                {(() => {
                                  const renderNodes = (nodes: FolderNode[], level = 0) => {
                                    return nodes.map(node => {
                                      const isLeaf = !node.children || node.children.length === 0;
                                      return (
                                        <div key={node.id}>
                                          <div 
                                            className={`px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                                              isLeaf 
                                                ? `cursor-pointer hover:bg-slate-50 ${uploadType === node.name ? 'text-primary font-bold bg-primary/5' : 'text-slate-600'}` 
                                                : 'cursor-default text-slate-400 font-medium bg-slate-50/30'
                                            }`}
                                            style={{ paddingLeft: `${level * 20 + 16}px` }}
                                            onClick={() => {
                                              if (isLeaf) {
                                                setUploadType(node.name);
                                                setShowCategoryDropdown(false);
                                              }
                                            }}
                                          >
                                            {node.children && node.children.length > 0 ? (
                                              <FolderOpen size={14} className="text-slate-400 shrink-0" />
                                            ) : (
                                              <Folder size={14} className="text-primary/60 shrink-0" />
                                            )}
                                            <span className="truncate">{node.name}</span>
                                          </div>
                                          {node.children && node.children.length > 0 && renderNodes(node.children, level + 1)}
                                        </div>
                                      );
                                    });
                                  };
                                  return renderNodes(initialFolders);
                                })()}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase">材料名称 <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          value={materialName}
                          onChange={(e) => setMaterialName(e.target.value)}
                          placeholder="请输入材料名称..."
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !materialName.trim() ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                        {hasAttemptedSave && !materialName.trim() && (
                          <div className="absolute right-4 text-red-500">
                            <AlertCircle size={16} className="fill-red-500 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase">选择文件 (支持多选)</label>
                      <div className="relative group/upload">
                        <input 
                          type="file" 
                          multiple 
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        />
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/30 group-hover/upload:bg-primary/5 group-hover/upload:border-primary/30 transition-all">
                          <div className="size-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover/upload:text-primary group-hover/upload:scale-110 transition-all mb-4">
                            <Paperclip size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-600 mb-1">点击或拖拽文件上传</p>
                          <p className="text-xs text-slate-400">支持 PDF、图片、Word、Excel、压缩包等格式</p>
                        </div>
                      </div>
                    </div>

                    {uploadFiles.length > 0 && (
                      <div className="space-y-3">
                        {uploadFiles.map((file, idx) => (
                          <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                              <div className={`size-10 rounded-xl flex items-center justify-center ${
                                file.type === 'pdf' ? 'bg-rose-50 text-rose-500' :
                                file.type === 'image' || file.type === 'jpg' || file.type === 'png' ? 'bg-blue-50 text-blue-500' :
                                'bg-indigo-50 text-indigo-500'
                              }`}>
                                <FileText size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">{file.name}</span>
                                <span className="text-[11px] text-slate-400 font-medium">{file.size} · {file.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== idx))}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase">备注信息</label>
                      <textarea 
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="请输入材料相关说明..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-auto flex items-center gap-4 shrink-0">
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl text-base font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    {modalMode === 'add' ? '立即上传' : '修改保存'}
                  </button>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-base font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Materials;
