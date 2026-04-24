import React, { useState } from 'react';
import { 
  Building2, 
  Network, 
  User, 
  Phone, 
  Clock, 
  Calendar, 
  FolderOpen, 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  AlertTriangle, 
  History, 
  Trash2,
  MoreHorizontal, 
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  BrainCircuit,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BidInspectionProps {
  currentEnterprise?: { id: string; name: string };
  uploadedFiles: Record<string, boolean>;
  projects?: any[];
}

const BidInspection: React.FC<BidInspectionProps> = ({ currentEnterprise, uploadedFiles, projects = [] }) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleProjectClick = (project: any) => {
    const globalProject = projects.find(p => p.name === project.name);
    if (globalProject?.status === '放弃投标') {
      alert('此项目已暂停');
      return;
    }
    setSelectedProject(project);
    setView('detail');
  };

  if (view === 'detail') {
    return <BidInspectionDetail onBack={() => setView('list')} project={selectedProject} uploadedFiles={uploadedFiles} projects={projects} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} />
          新建检查项目
        </button>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">AI标书检查平台</h2>
            <p className="text-slate-400 text-sm">自动识别标书风险，降低废标概率，提高投标质量。</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { title: 'AI技术标评审', desc: '自动解析评分标准，模拟评审生成报告', icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: '标书合规检查', desc: '识别否决性条款，提前发现废标风险', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
              { title: '多维风险识别', desc: '检测格式、内容及逻辑问题', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
              { title: '一键优化重评', desc: '提供优化建议，支持修改后重新评分', icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-50 hover:border-primary/20 hover:bg-slate-50/50 transition-all cursor-pointer group">
                <div className={`size-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main List */}
        <div className="col-span-9 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">我的项目</h3>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <select className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>进行中</option>
                  <option>已完成</option>
                  <option>全部</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索项目名称" 
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { name: `${currentEnterprise?.name || '某'}金融中心二期总承包工程`, status: '进行中', time: '6小时前', deadline: '2026-03-15 17:00', deadlineLabel: '投标截止', countdown: '剩3天', checkStatus: [1, 3, 0] },
              { name: `${currentEnterprise?.name || '某'}轨道交通13号线土建工程`, status: '检查中', time: '1天前', deadline: '2026-03-23 09:00', deadlineLabel: '投标截止', checkStatus: [1, 1, 3] },
              { name: `${currentEnterprise?.name || '某'}枢纽配套设施建设项目`, status: '未开始', time: '2天前', deadline: '2026-03-28 09:00', deadlineLabel: '投标截止', checkStatus: [0, 0, 0] },
              { name: `${currentEnterprise?.name || '某'}机场三期扩建工程`, status: '已完成', time: '5天前', deadline: '2026-03-14 10:00', deadlineLabel: '开标时间', checkStatus: [1, 1, 1] },
              { name: `${currentEnterprise?.name || '某'}智慧城市基础设施项目`, status: '已开标', time: '2026-03-03', checkStatus: [1, 1, 1] },
            ].map((project, i) => {
              const globalProject = projects.find(p => p.name === project.name);
              const isPaused = globalProject?.status === '放弃投标';

              return (
                <div 
                  key={i} 
                  onClick={() => handleProjectClick(project)}
                  className={`px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group ${isPaused ? 'opacity-60' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{project.name}</h4>
                      {isPaused && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                          已暂停
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        project.status === '进行中' ? 'bg-blue-50 text-blue-500' :
                        project.status === '检查中' ? 'bg-orange-50 text-orange-500' :
                        project.status === '已完成' ? 'bg-green-50 text-green-500' :
                        project.status === '已开标' ? 'bg-purple-50 text-purple-500' :
                        'bg-slate-100 text-slate-400'
                      }`}>{project.status}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> 更新于 {project.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    {project.deadline && (
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 mb-0.5">
                          {project.deadlineLabel} {project.countdown && <span className="bg-red-50 text-red-500 px-1 rounded ml-1">{project.countdown}</span>}
                        </p>
                        <p className={`text-sm font-bold ${project.countdown ? 'text-red-500' : 'text-slate-700'}`}>{project.deadline}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {['资信', '技术', '经济'].map((tag, idx) => {
                        const s = project.checkStatus[idx];
                        return (
                          <div key={tag} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-slate-400">{tag}</span>
                            {s === 1 ? <CheckCircle2 size={16} className="text-green-500" /> :
                             s === 3 ? <AlertTriangle size={16} className="text-orange-500" /> :
                             <div className="size-4 rounded-full border border-slate-200" />}
                          </div>
                        );
                      })}
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="text-orange-500" size={18} />
              <h3 className="font-bold text-slate-900">风险概览</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">高风险项目</p>
              {[
                { name: `${currentEnterprise?.name || '某'}金融中心二期总承包工程`, risk: '风险' },
                { name: `${currentEnterprise?.name || '某'}轨道交通13号线土建工程`, risk: '风险' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 group cursor-pointer hover:bg-orange-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold text-slate-900 truncate flex-1">{item.name}</p>
                    <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] rounded font-bold ml-2">{item.risk}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-orange-600/70">检查发现潜在风险点</p>
                    <ChevronRight size={14} className="text-orange-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">最近检查完成</p>
              {[
                { name: `${currentEnterprise?.name || '某'}金融中心二期总承包...`, date: '2026-03-13' },
                { name: `${currentEnterprise?.name || '某'}轨道交通13号线土建工程`, date: '2026-03-12' },
                { name: `${currentEnterprise?.name || '某'}机场三期扩建工程`, date: '2026-03-08' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-700 truncate group-hover:text-primary transition-colors">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> 更新于 {item.date}
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[9px] rounded font-bold ml-2 shrink-0">已完成</span>
                  <ChevronRight size={14} className="text-slate-200 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[720px] max-h-[90vh] flex flex-col overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                      <BrainCircuit size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">新建检查项目</h3>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="p-10 flex-1 flex flex-col overflow-hidden">
                  <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">项目名称</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" 
                          placeholder="请输入项目全称" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1 uppercase">招标人</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" 
                            placeholder="建设单位名称" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1 uppercase">项目类型</label>
                          <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm">
                            <option>工程类</option>
                            <option>服务类</option>
                            <option>货物类</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1 uppercase">投标截止时间</label>
                          <input 
                            type="datetime-local" 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1 uppercase">开标时间</label>
                          <input 
                            type="datetime-local" 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">解析招标文件</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group">
                          <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <UploadCloud size={32} />
                          </div>
                          <p className="text-sm text-slate-600 font-bold">点击或拖拽招标文件至此处解析</p>
                          <p className="text-[11px] text-slate-400">支持 PDF、Word、ZF、CF 格式，AI将自动识别关键信息并填充表单</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8 mt-auto shrink-0 sticky bottom-0 bg-white pb-2">
                      <button 
                        onClick={() => setShowAddModal(false)} 
                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                      >
                        创建并开始AI解析
                      </button>
                      <button 
                        onClick={() => setShowAddModal(false)} 
                        className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface BidInspectionDetailProps {
  onBack: () => void;
  project: any;
  uploadedFiles: Record<string, boolean>;
  projects?: any[];
}

const BidInspectionDetail: React.FC<BidInspectionDetailProps> = ({ onBack, project, uploadedFiles, projects = [] }) => {
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [useClarification, setUseClarification] = useState(false);
  const [checkingVersion, setCheckingVersion] = useState<any>(null);

  const globalProject = projects.find(p => p.name === project?.name);
  const isPaused = globalProject?.status === '放弃投标';

  const hasClarification = Object.keys(uploadedFiles).some(key => key.startsWith('clar-doc-') && uploadedFiles[key]);

  const handleStartCheck = (version: any) => {
    if (isPaused) {
      alert('此项目已暂停');
      return;
    }
    if (hasClarification && !useClarification) {
      setCheckingVersion(version);
      setShowClarificationModal(true);
    } else {
      // Proceed with normal check
      alert(`正在检查：${version.name}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* Clarification Prompt Modal */}
      <AnimatePresence>
        {showClarificationModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-8">
                <div className="size-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">发现最新答疑文件</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  系统检测到该项目已上传最新的答疑/澄清文件。是否导入最新答疑内容进行标书检查？这能确保检查结果更符合最新的招标要求。
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setUseClarification(true);
                      setShowClarificationModal(false);
                      alert(`已导入最新答疑文件，正在重新检查：${checkingVersion?.name}`);
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={20} /> 是的，导入最新答疑
                  </button>
                  <button
                    onClick={() => {
                      setShowClarificationModal(false);
                      alert(`正在按原招标文件检查：${checkingVersion?.name}`);
                    }}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                  >
                    不，按原文件检查
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="size-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-primary hover:text-primary transition-all shadow-sm group"
            title="返回"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            标书检查详情：{project?.name || '项目详情'}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-y-8">
            {[
              { label: '招标人', value: '上海浦东开发集团', icon: Building2 },
              { label: '项目类型', value: '工程类', icon: Network },
              { label: '联系人', value: '王经理', icon: User },
              { label: '联系方式', value: '13800138000', icon: Phone },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <item.icon size={16} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="text-sm font-bold ml-6">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-12 pt-8 border-t border-slate-50 mt-8">
            <div className="flex items-center gap-3">
              <Clock className="text-slate-400" size={20} />
              <div className="text-xs">
                <span className="text-slate-400 block mb-0.5">投标截止</span>
                <span className="text-red-600 font-bold">{project?.deadline || '2026-03-15 17:00'}</span>
                {project?.countdown && <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[10px] ml-1">{project.countdown}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-slate-400" size={20} />
              <div className="text-xs">
                <span className="text-slate-400 block mb-0.5">开标时间</span>
                <span className="font-bold">2026-03-18 09:30</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="text-primary" size={20} />
            <h3 className="text-sm font-bold">招标相关文件</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
            <div className="size-10 bg-white border border-slate-200 rounded flex items-center justify-center text-primary">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold truncate">XX市政道路...招标文件.pdf</p>
                <CheckCircle2 className="text-green-500" size={16} />
              </div>
              <p className="text-[11px] text-slate-400">招标文件 • 11.9 MB</p>
            </div>
          </div>
          <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50/50 transition-colors">
            <UploadCloud className="text-primary" size={24} />
            <div className="text-center">
              <p className="text-[13px] text-primary font-bold">点击上传控制价文件</p>
              <p className="text-[11px] text-slate-400">支持 PDF、Word、ZF、CF 格式</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
          <h3 className="font-bold text-sm">投标文件版本</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-xs font-medium hover:bg-slate-50">+ 添加版本</button>
            <button className="px-3 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 flex items-center gap-1">
              <CheckCircle2 size={14} /> 全部检查
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: '投标文件-最终版', time: '2026-03-01 10:00', desc: '最终确认版本，准备递交', status: [0, 0, 0] },
            { name: '投标文件-修订版2', time: '2026-02-20 15:30', desc: '针对技术响应点进行了优化', status: [1, 2, 0] },
            { name: '投标文件-修订版1', time: '2026-02-10 09:15', desc: '补充了部分业绩证明材料', status: [1, 3, 1] },
          ].map((v, i) => (
            <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{v.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{v.time} | {v.desc}</p>
              </div>
              <div className="flex items-center gap-3 mr-8">
                {['资信', '技术', '经济'].map((tag, idx) => {
                  const s = v.status[idx];
                  return (
                    <span key={tag} className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] ${
                      s === 1 ? 'border-green-100 bg-green-50 text-green-600' :
                      s === 2 ? 'border-blue-100 bg-blue-50 text-blue-600' :
                      s === 3 ? 'border-orange-100 bg-orange-50 text-orange-600' :
                      'border-slate-200 text-slate-400'
                    }`}>
                      {s === 1 && <CheckCircle2 size={12} />}
                      {s === 2 && <History size={12} className="animate-spin" />}
                      {s === 3 && <AlertTriangle size={12} />}
                      {s === 0 && <span className="size-1.5 rounded-full border border-slate-300"></span>}
                      {tag}
                    </span>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleStartCheck(v)}
                  className={`px-4 py-1.5 border text-xs font-bold rounded transition-all ${
                    isPaused 
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  开始检查
                </button>
                <button 
                  onClick={() => isPaused ? alert('此项目已暂停') : null}
                  className={`p-1 transition-colors ${isPaused ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600'}`} 
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight className="text-slate-300" size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BidInspection;
