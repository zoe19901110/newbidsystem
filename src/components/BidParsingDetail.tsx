import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTableResizer } from '../hooks/useTableResizer';

interface BidParsingDetailProps {
  project: any;
  onBack: () => void;
  onViewReport?: () => void;
  currentEnterprise?: { id: string; name: string };
  isPaused?: boolean;
}

const BidParsingDetail: React.FC<BidParsingDetailProps> = ({ project, onBack, onViewReport, currentEnterprise, isPaused = false }) => {
  const enterpriseName = currentEnterprise?.name || '杭州某某科技有限公司';

  const { widths, onMouseDown } = useTableResizer([
    'auto', // 文件名
    180,    // 上传时间
    120,    // 分析状态
    150     // 操作
  ]);
  
  // Initialize files based on project
  const [files, setFiles] = useState([
    { name: project.latestFile || `2026年${enterpriseName}智慧校园建设项目招标文件.pdf`, time: project.updateTime || '2025-11-20 14:30', type: 'pdf', status: '进行中' },
    { name: `${enterpriseName}配套网络设备采购需求清单.docx`, time: '2025-11-19 10:15', type: 'doc', status: '已完成' }
  ]);

  const [isImported, setIsImported] = useState(!!project.latestFile);
  const [isParsed, setIsParsed] = useState(false); // Always start as not parsed in this view
  const [isParsing, setIsParsing] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [useClarification, setUseClarification] = useState(false);

  useEffect(() => {
    if (isImported && !isParsed && !useClarification) {
      const hasClarification = Object.keys(project.uploadedFiles || {}).some(key => key.startsWith('clar-doc-') && project.uploadedFiles[key]);
      if (hasClarification) {
        setShowClarificationModal(true);
      }
    }
  }, [isImported, isParsed, project.uploadedFiles, useClarification]);

  // Determine which file is "latest"
  const latestFileDisplay = useClarification ? `最新答疑文件_${project.name}.pdf` : (project.latestFile || `2026年${enterpriseName}智慧交通管理平台建设项目招标文件.pdf`);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className={`flex items-center justify-between ${isPaused ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="size-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-primary hover:text-primary transition-all shadow-sm group"
            title="返回"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              招标文件解析
              {isPaused && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-bold">已暂停</span>
              )}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className={`bg-white rounded-xl p-8 border border-slate-100 shadow-sm ${isPaused ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <h3 className="text-lg font-bold mb-6">招标文件解析</h3>
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setIsImported(true);
                  setFiles(prev => {
                    const newFiles = [...prev];
                    if (newFiles.length > 0) {
                      newFiles[0].name = e.target.files![0].name;
                      newFiles[0].status = '进行中';
                    }
                    return newFiles;
                  });
                }
              }} 
            />
            {isImported ? (
              isParsed ? (
                <div className="border-2 border-green-100 bg-green-50/30 rounded-xl p-12 flex flex-col items-center justify-center">
                  <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="font-black text-lg text-slate-900 mb-2">招标文件解析成功</p>
                  <p className="text-slate-500 text-sm mb-6">{latestFileDisplay}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        if (isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        onViewReport?.();
                      }} 
                      className={`bg-primary text-white font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-primary/20 ${isPaused ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                    >
                      查看文件详情
                    </button>
                    <button 
                      onClick={() => { 
                        if (isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        setIsImported(false); 
                        setIsParsed(false); 
                        setTimeout(() => {
                          document.getElementById('file-upload')?.click();
                        }, 0);
                      }}
                      className={`bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-8 rounded-lg transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                    >
                      重新上传
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-blue-100 bg-blue-50/30 rounded-xl p-12 flex flex-col items-center justify-center">
                  <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    {useClarification ? <MessageSquare size={32} /> : <FileText size={32} />}
                  </div>
                  <p className="font-black text-lg text-slate-900 mb-2">{useClarification ? '答疑文件已就绪' : '招标文件已就绪'}</p>
                  <p className="text-slate-500 text-sm mb-6">{latestFileDisplay}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        if (isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        setIsParsing(true);
                        setTimeout(() => {
                          setIsParsing(false);
                          setIsParsed(true);
                          setFiles(prev => {
                            const newFiles = [...prev];
                            if (newFiles.length > 0) {
                              newFiles[0].status = '已完成';
                            }
                            return newFiles;
                          });
                        }, 1000);
                      }}
                      disabled={isParsing || isPaused}
                      className={`bg-primary text-white font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ${isPaused ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                    >
                      {isParsing ? <><RefreshCw className="animate-spin" size={18} /> 正在解析...</> : '确认解析'}
                    </button>
                    <button 
                      onClick={() => {
                        if (isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        setIsImported(false);
                        setIsParsed(false);
                        setTimeout(() => {
                          document.getElementById('file-upload')?.click();
                        }, 0);
                      }}
                      className={`bg-white border border-slate-200 text-slate-600 font-bold py-2.5 px-8 rounded-lg transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                    >
                      重新上传
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div 
                className={`border-2 border-dashed border-slate-100 rounded-xl p-16 flex flex-col items-center justify-center transition-colors group ${isPaused ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 cursor-pointer'}`} 
                onClick={() => {
                  if (isPaused) {
                    alert('此项目已暂停');
                    return;
                  }
                  document.getElementById('file-upload')?.click();
                }}
              >
                <div className="size-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-primary" size={28} />
                </div>
                <p className="font-bold mb-1">点击或拖拽招标文件至此处解析</p>
                <p className="text-slate-400 text-sm mb-8">支持 PDF、Word、ZF、CF 格式，解析后可直接查看文件内容</p>
                <button className={`bg-primary text-white font-bold py-3 px-10 rounded-lg transition-all shadow-lg shadow-primary/20 ${isPaused ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}>
                  立即解析文件
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold">分析历史</h3>
              <button className="text-primary text-sm font-medium hover:underline">查看全部</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="text-slate-400 text-xs font-medium bg-slate-50/30 border-b border-slate-50">
                    {[
                      { label: '文件名', key: 'name' },
                      { label: '上传时间', key: 'time' },
                      { label: '分析状态', key: 'status' },
                      { label: '操作', key: 'action', align: 'right' }
                    ].map((col, idx) => (
                      <th 
                        key={col.key} 
                        style={{ width: widths[idx] }}
                        className={`px-6 py-4 relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                      >
                        <span className="truncate">{col.label}</span>
                        {idx < 3 && (
                          <div 
                            onMouseDown={(e) => onMouseDown(idx, e)}
                            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary transition-colors z-10"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {files.map((file, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 overflow-hidden">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className={`${file.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} shrink-0`} size={20} />
                          <span className="text-sm font-medium truncate" title={file.name}>{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400 overflow-hidden">
                        <div className="truncate" title={file.time}>{file.time}</div>
                      </td>
                      <td className="px-6 py-5 overflow-hidden">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${file.status === '已完成' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                          <span className={`size-1.5 rounded-full ${file.status === '已完成' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                          {file.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-4">
                          <button 
                            onClick={() => {
                              if (isPaused) {
                                alert('此项目已暂停');
                                return;
                              }
                            }}
                            className={`text-sm font-bold transition-all shrink-0 ${isPaused ? 'text-slate-300 cursor-not-allowed' : 'text-primary hover:text-primary/80'}`}
                          >
                            查看
                          </button>
                          <button 
                            onClick={() => {
                              if (isPaused) {
                                alert('此项目已暂停');
                                return;
                              }
                            }}
                            className={`text-sm font-bold transition-all shrink-0 ${isPaused ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-500'}`}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {showClarificationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="size-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">检测到新的答疑文件</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">系统检测到您已上传最新的答疑文件，是否上传并使用该文件？</p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (isPaused) {
                    alert('此项目已暂停');
                    return;
                  }
                  setUseClarification(true);
                  setShowClarificationModal(false);
                }}
                className={`flex-1 font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 ${isPaused ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white'}`}
              >
                是，解析答疑文件
              </button>
              <button 
                onClick={() => {
                  if (isPaused) {
                    alert('此项目已暂停');
                    return;
                  }
                  setShowClarificationModal(false);
                }}
                className={`flex-1 font-bold py-3 rounded-xl transition-all ${isPaused ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                否，维持原文件
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BidParsingDetail;
