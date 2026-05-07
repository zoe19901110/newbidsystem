import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2,
  Clock,
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  History,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import BidParsingDetail from './BidParsingDetail';

interface BidParsingProps {
  onEnterWorkbench?: (project: any) => void;
  currentEnterprise?: { id: string; name: string };
}

const BidParsing: React.FC<BidParsingProps> = ({ onEnterWorkbench, currentEnterprise }) => {
  const [view, setView] = useState<'main' | 'detail'>('main');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [quota, setQuota] = useLocalStorage('parsing-quota', { total: 10, remaining: 5 });
  
  const [history] = useState([
    {
      id: '1',
      name: `2026年智慧交通管理平台建设项目`,
      code: 'ZB-2026-001',
      tenderer: 'XX市交通运输局',
      updateTime: '2025-11-20 14:30',
      status: '已解析',
      latestFile: '2026年智慧交通管理平台建设项目招标文件.pdf',
    },
    {
      id: '2',
      name: `政务云扩容采购项目`,
      code: 'ZB-2026-005',
      tenderer: 'XX市大数据局',
      updateTime: '2025-11-19 10:15',
      status: '已解析',
      latestFile: '政务云扩容采购项目招标文件.pdf',
    }
  ]);

  const handleStartNewParsing = () => {
    if (quota.remaining <= 0) {
      alert('您的解析机会已用完，请联系管理员增加额度');
      return;
    }
    setSelectedProject({ id: 'new', name: '新解析项目', uploadedFiles: {} });
    setView('detail');
  };

  const handleEnterDetail = (project: any) => {
    setSelectedProject(project);
    setView('detail');
  };

  const renderMainView = () => (
    <div className="space-y-8">
      {/* Quota & Welcome Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">招标文件智能解析</h2>
            <p className="text-slate-500 mb-8 max-w-lg">利用 AI 技术深度解析招标文件，自动提取关键要素、风险点及投标要求，助您快速掌握项目核心信息。</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 min-w-[140px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">总解析额度</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">{quota.total}</span>
                  <span className="text-xs font-medium text-slate-500">次</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-primary/5 rounded-2xl border border-primary/10 min-w-[140px]">
                <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">剩余解析机会</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary">{quota.remaining}</span>
                  <span className="text-xs font-medium text-primary/60">次</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          onClick={handleStartNewParsing}
          className="md:w-1/3 bg-primary rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-primary/95 transition-all shadow-lg shadow-primary/20"
        >
          <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">立即开始解析</h3>
          <p className="text-white/70 text-sm mb-6">点击上传招标文件，开启智能分析</p>
          <div className="px-6 py-2 bg-white text-primary rounded-xl text-sm font-bold shadow-sm group-hover:shadow-md transition-all">
            开始解析
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <History size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">解析历史记录</h3>
          </div>
          <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            查看更多 <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer"
              onClick={() => handleEnterDetail(item)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="size-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {item.updateTime}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Briefcase size={12} /> {item.tenderer}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[11px] font-bold">
                  <CheckCircle2 size={12} /> 已解析
                </span>
                <div className="p-2 text-slate-400 group-hover:text-primary transition-colors">
                  <ExternalLink size={18} />
                </div>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 italic">
              <AlertCircle size={32} className="mb-2 opacity-20" />
              暂无解析历史
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full pb-10">
      <AnimatePresence mode="wait">
        {view === 'main' ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderMainView()}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BidParsingDetail 
              project={selectedProject} 
              onBack={() => setView('main')}
              onViewReport={() => {
                if (selectedProject?.id === 'new') {
                  setQuota(prev => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
                }
                onEnterWorkbench?.(selectedProject);
              }}
              currentEnterprise={currentEnterprise}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BidParsing;
