import React, { useState } from 'react';
import { 
  PlusCircle, 
  Briefcase, 
  Cloud, 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Bell, 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Timer,
  Network,
  Minimize2,
  FileStack,
  ArrowRightLeft,
  MonitorCheck,
  Archive,
  FileSearch,
  PlayCircle,
  Database,
  BookOpen,
  ShieldCheck,
  Plus,
  Calculator,
  List,
  BrainCircuit,
  ChevronDown,
  Ban,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onEnterWorkbench: (stage: string) => void;
  currentEnterprise: { id: string; name: string };
  projects: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onEnterWorkbench, currentEnterprise, projects }) => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isTenderUploaded, setIsTenderUploaded] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [analyzedData, setAnalyzedData] = useState({
    projectName: '',
    projectNumber: '',
    tenderer: '',
    tendererContact: '',
    tenderAgent: '',
    tenderAgentContact: '',
    openingTime: '',
    depositDeadline: '',
    openingLocation: '',
    depositAmount: '',
    collectionTime: '',
    tenderRequirements: '',
    otherRemarks: ''
  });

  const displayProjects = projects.map(p => ({
    id: p.id,
    name: p.name,
    status: p.status === '放弃投标' ? '已暂停' : (p.status === '已完成' ? '已开标' : '投标中'),
    statusColor: p.status === '放弃投标' ? 'bg-red-50 text-red-600' : (p.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-primary'),
    deadline: p.bidOpeningTime,
    countdown: p.countdown || '08天 04:12:05', // 确保显示详细倒计时
    icon: p.status === '放弃投标' ? Ban : (p.status === '已完成' ? CheckCircle2 : Briefcase),
    iconBg: p.status === '放弃投标' ? 'bg-red-50 text-red-600' : (p.status === '已完成' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-primary'),
    isPaused: p.status === '放弃投标'
  }));

  const handleFileUpload = () => {
    setIsAnalyzing(true);
    // Simulate AI Analysis
    setTimeout(() => {
      setAnalyzedData({
        projectName: '2026年XX市智慧交通管理平台建设项目',
        projectNumber: 'T2026-ZHJT-001',
        tenderer: 'XX市交通运输局',
        tendererContact: '张工 010-88888888',
        tenderAgent: 'XX招标代理有限公司',
        tenderAgentContact: '李经理 010-66666666',
        openingTime: '2026-01-15T09:30',
        depositDeadline: '2026-01-12T17:00',
        openingLocation: 'XX市公共资源交易中心 301 会育室',
        depositAmount: '¥ 500,000.00',
        collectionTime: '2025-12-25',
        tenderRequirements: '1. 资质要求：具备市政公用工程施工总承包一级及以上资质；\n2. 业绩要求：近三年内具有类似智慧交通项目业绩；\n3. 技术要求：支持国产化适配。',
        otherRemarks: ''
      });
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      setIsTenderUploaded(true);
    }, 2500);
  };

  const handleDataChange = (field: keyof typeof analyzedData, value: string) => {
    setAnalyzedData({ ...analyzedData, [field]: value });
  };

  const resetModal = () => {
    setShowNewProjectModal(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(false);
      setIsTenderUploaded(false);
      setAnalyzedData({
        projectName: '',
        projectNumber: '',
        tenderer: '',
        tendererContact: '',
        tenderAgent: '',
        tenderAgentContact: '',
        openingTime: '',
        depositDeadline: '',
        openingLocation: '',
        depositAmount: '',
        collectionTime: '',
        tenderRequirements: '',
        otherRemarks: ''
      });
    }, 300);
  };

  const alerts = [
    {
      id: '1',
      title: `${currentEnterprise.name} - 城市基础设施项目 招标文件解析 需在今天 18:00 前完成`,
      priority: '高优先级',
      time: '今天 18:00',
      type: 'urgent'
    },
    {
      id: '2',
      title: `${currentEnterprise.name} - 项目经理 王志强 发起了政务云项目的价格审核流程`,
      priority: '中优先级',
      time: '明天 09:00',
      type: 'info'
    },
    {
      id: '3',
      title: `${currentEnterprise.name} - 完成 年度业绩台账 的季度数据校验`,
      priority: '低优先级',
      time: '11月27日 15:00',
      type: 'success'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Hero Section - Card Layout */}
      <section className="grid grid-cols-8 gap-6 pb-4">
        {/* Primary Action Card */}
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="col-span-2 h-[160px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 flex flex-col justify-between items-start text-white shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all active:scale-[0.98] group"
        >
          <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={36} strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold tracking-wide">创建项目</span>
        </button>

        {/* Utility Cards */}
        {[
          { label: 'AI编标', icon: BrainCircuit, color: 'text-blue-500', bg: 'bg-blue-50/80', hover: 'group-hover:bg-blue-100 group-hover:text-blue-600', href: 'https://bqpoint.com/AIbianbiao/dist/index.html' },
          { label: '清标工具', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50/80', hover: 'group-hover:bg-emerald-100 group-hover:text-emerald-600', href: 'https://www.bqpoint.com/tool/qingbiaotooldownloadindex.html' },
          { label: '素材市场', icon: Archive, color: 'text-orange-500', bg: 'bg-orange-50/80', hover: 'group-hover:bg-orange-100 group-hover:text-orange-600', href: 'https://www.bqpoint.com/materialmarket/vue/dist/index.html?platform=DesktopApp#/application-center-home' },
          { label: '招标文件解析', icon: FileSearch, color: 'text-purple-500', bg: 'bg-purple-50/80', hover: 'group-hover:bg-purple-100 group-hover:text-purple-600', href: 'https://www.bqpoint.com/bqdesktop/fileanalysis/before_analysis.html?prefectureguid=0325df6d-b4c9-4a60-b35e-096659ba3a3c&platformquyu=320000&platformcode=tool320000022&applicationguid=34d5ebfb-25e6-4d1b-9abc-d3f00b7f6ce6&danweiguid=undefined&winformtype=jsob&prefectureno=tool320000022&redirect_token=MGU4MjU4M2UtODk1ZS00YzU5LWE4MmEtNmFmMDA1OTM1OGM2&p=prefecturetool' },
          { label: '交易智库', icon: Bell, color: 'text-indigo-500', bg: 'bg-indigo-50/80', hover: 'group-hover:bg-indigo-100 group-hover:text-indigo-600', href: 'https://ai.ebpu.com/' },
          { label: 'AI工具集', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50/80', hover: 'group-hover:bg-cyan-100 group-hover:text-cyan-600', href: 'https://www.bqpoint.com/bqdesktop/navigation/AI_navigation.html' },
        ].map((tool, i) => (
          <button 
            key={i}
            onClick={() => {
              if (tool.href) {
                window.open(tool.href, '_blank');
              }
            }}
            className="col-span-1 h-[160px] bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.1)] hover:border-slate-200 transition-all duration-300 flex flex-col items-center justify-center gap-5 group active:scale-[0.98]"
          >
            <div className={`size-16 rounded-2xl ${tool.bg} ${tool.color} ${tool.hover} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
              <tool.icon size={34} strokeWidth={1.5} />
            </div>
            <span className="text-[15px] font-semibold text-slate-700 tracking-wide text-center px-2 group-hover:text-slate-900 transition-colors">{tool.label}</span>
          </button>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="col-span-8 space-y-8 h-full">
          {/* Projects List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary" size={20} />
                <h3 className="text-lg font-bold">投标项目登记列表</h3>
              </div>
              <button 
                onClick={() => setActiveTab('project-registration')}
                className="text-primary text-sm font-medium hover:underline"
              >
                查看全部
              </button>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
              {displayProjects
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => {
                    if (project.isPaused) {
                      alert('此项目已暂停');
                    } else {
                      onEnterWorkbench('preparation');
                    }
                  }}
                  className={`p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer ${project.isPaused ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`size-12 rounded-xl ${project.iconBg} flex items-center justify-center shrink-0`}>
                      <project.icon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{project.name}</h4>
                        {project.status && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            project.status === '进行中' ? 'bg-blue-50 text-blue-600' : 
                            project.status === '已完成' ? 'bg-green-50 text-green-600' : 
                            project.status === '放弃投标' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {project.status === '进行中' ? '投标中' : project.status === '已完成' ? '已开标' : project.status}
                          </span>
                        )}
                        {project.isPaused && !project.status && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider">
                            已暂停
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                          <Clock size={14} />
                          {project.deadline} 开标
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 self-center">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">开标倒计时</p>
                      <p className={`text-lg font-bold tabular-nums ${['1', '2', '3'].includes(project.id) ? 'text-red-500' : 'text-slate-700'}`}>{project.countdown || '08天 04:12:05'}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (project.isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        onEnterWorkbench(project.status, {
                          projectName: project.name,
                          projectNumber: `PROJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                          tenderer: 'XX市城市建设投资集团有限公司',
                          tenderAgent: 'XX国际招标有限公司',
                          openingTime: project.deadline,
                          depositDeadline: '2026-05-19 17:00'
                        });
                      }}
                      className={`bg-[#0052CC] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-[#0052CC]/90 transition-all active:scale-95 ${project.isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      进入工作台
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(displayProjects.length / pageSize)}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              totalItems={displayProjects.length}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-8">
          {/* Calendar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">投标日历</h3>
              <p className="text-sm font-medium text-primary">2026年04月</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
                  <span key={day} className={`text-[10px] font-bold uppercase ${i >= 5 ? 'text-red-400' : 'text-slate-400'}`}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 22;
                  const hasEvent = day === 25;
                  return (
                    <div 
                      key={day} 
                      className={`h-10 flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-colors relative
                        ${isToday ? 'bg-[#0052CC] text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-50'}
                        ${day > 30 ? 'text-slate-300' : ''}
                        ${(day === 4 || day === 5 || day === 11 || day === 12 || day === 18 || day === 19 || day === 25 || day === 26) ? 'text-red-400' : ''}
                      `}
                    >
                      {day}
                      {hasEvent && !isToday && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#0052CC] rounded-full"></span>}
                      {isToday && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full border border-white"></span>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-10 bg-yellow-400 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold">11月22日 今天</p>
                    <p className="text-xs text-slate-500">招标文件最终评审会议</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-10 bg-[#0052CC] rounded-full shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-primary">11月25日 关键节点</p>
                    <p className="text-xs text-slate-500">智慧城市管理平台开标</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
              <Bell className="text-orange-500" size={20} />
              <h3 className="text-lg font-bold">关键任务提醒 <span className="ml-2 text-xs font-normal text-slate-400 underline cursor-pointer">最近3天内</span></h3>
            </div>
            <div className="p-6 space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-center gap-4 p-4 rounded-xl border ${alert.type === 'urgent' ? 'border-orange-100 bg-orange-50/30' : 'border-slate-100'}`}>
                  <div className={`size-2 rounded-full ${alert.type === 'urgent' ? 'bg-orange-500 animate-pulse' : alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <p className="flex-1 text-sm font-medium text-slate-700">
                    {alert.title}
                  </p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${alert.type === 'urgent' ? 'text-orange-600 bg-white' : 'text-slate-400 italic'}`}>
                    {alert.priority || alert.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden"
              >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#0052CC] rounded-xl flex items-center justify-center text-white">
                    <PlusCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">新增投标项目</h3>
                </div>
                <button 
                  onClick={resetModal}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-10 flex-1 flex flex-col overflow-hidden">
                <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">
                  
                  {/* Import Section */}
                  {!isAnalyzed && !isAnalyzing && (
                    <div 
                      onClick={handleFileUpload}
                      className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-[#0052CC]/5 hover:border-[#0052CC]/30 transition-all cursor-pointer group shrink-0"
                    >
                      <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <UploadCloud size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-slate-600 font-bold">点击或拖拽招标文件至此处上传</p>
                        <p className="text-slate-400 text-xs mt-1">支持 PDF、Word、ZF、CF 格式，AI将自动识别关键信息并填充表单</p>
                      </div>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="border-2 border-blue-100 bg-blue-50/30 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 text-center shrink-0">
                      <Loader2 size={40} className="text-primary animate-spin" />
                      <div>
                        <h4 className="font-bold text-slate-900">AI 正在深度解析招标文件...</h4>
                        <p className="text-slate-500 text-sm mt-1">正在识别关键时间节点、技术要求及商务条款</p>
                      </div>
                    </div>
                  )}

                  {isAnalyzed && (
                    <div className="flex items-center justify-between p-5 bg-green-50 rounded-2xl border border-green-100 shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-green-900">解析成功！</h4>
                          <p className="text-green-700/70 text-sm">已自动识别出关键信息，请核对并完善以下项目详情</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setIsAnalyzed(false);
                          setAnalyzedData({
                            projectName: '',
                            projectNumber: '',
                            tenderer: '',
                            tendererContact: '',
                            tenderAgent: '',
                            tenderAgentContact: '',
                            openingTime: '',
                            depositDeadline: '',
                            openingLocation: '',
                            depositAmount: '',
                            collectionTime: '',
                            tenderRequirements: '',
                            otherRemarks: ''
                          });
                        }}
                        className="text-sm font-bold text-slate-500 hover:text-slate-700 underline"
                      >
                        重新导入
                      </button>
                    </div>
                  )}

                  {/* Form Section */}
                  <div className="grid grid-cols-3 gap-6 shrink-0">
                    <div className="col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1">
                        项目名称 <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={analyzedData.projectName || ''}
                        onChange={(e) => handleDataChange('projectName', e.target.value)}
                        placeholder="请输入项目名称"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">项目编号</label>
                      <input 
                        type="text" 
                        value={analyzedData.projectNumber || ''}
                        onChange={(e) => handleDataChange('projectNumber', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">招标人</label>
                      <input 
                        type="text" 
                        value={analyzedData.tenderer || ''}
                        onChange={(e) => handleDataChange('tenderer', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">招标人联系方式</label>
                      <input 
                        type="text" 
                        value={analyzedData.tendererContact || ''}
                        onChange={(e) => handleDataChange('tendererContact', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">招标代理</label>
                      <input 
                        type="text" 
                        value={analyzedData.tenderAgent || ''}
                        onChange={(e) => handleDataChange('tenderAgent', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">招标代理联系方式</label>
                      <input 
                        type="text" 
                        value={analyzedData.tenderAgentContact || ''}
                        onChange={(e) => handleDataChange('tenderAgentContact', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1">
                        开标时间
                      </label>
                      <input 
                        type="datetime-local" 
                        value={analyzedData.openingTime || ''}
                        onChange={(e) => handleDataChange('openingTime', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">保证金缴纳截止时间</label>
                      <input 
                        type="datetime-local" 
                        value={analyzedData.depositDeadline || ''}
                        onChange={(e) => handleDataChange('depositDeadline', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">开标地点</label>
                      <input 
                        type="text" 
                        value={analyzedData.openingLocation || ''}
                        onChange={(e) => handleDataChange('openingLocation', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">文件领取截止时间</label>
                      <input 
                        type="date" 
                        value={analyzedData.collectionTime}
                        onChange={(e) => handleDataChange('collectionTime', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">保证金金额</label>
                      <input 
                        type="text" 
                        value={analyzedData.depositAmount}
                        onChange={(e) => handleDataChange('depositAmount', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">招标要求</label>
                      <textarea 
                        value={analyzedData.tenderRequirements}
                        onChange={(e) => handleDataChange('tenderRequirements', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                      />
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">其他备注</label>
                      <textarea 
                        value={analyzedData.otherRemarks || ''}
                        onChange={(e) => handleDataChange('otherRemarks', e.target.value)}
                        rows={3}
                        placeholder="请输入其他备注信息..."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 shrink-0">
                    <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <UploadCloud size={18} className="text-primary" />
                      文件附件上传
                    </h5>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: '招标文件', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: '招标清单', icon: List, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: '控制价清单', icon: Calculator, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      ].map((file, i) => (
                        <div key={i} className={`p-4 rounded-2xl border border-slate-100 transition-all group cursor-pointer border-dashed border-2 ${
                          file.label === '招标文件' && isTenderUploaded ? 'bg-green-50 border-green-200' : 'bg-slate-50 hover:border-primary/30 hover:bg-white'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`size-10 rounded-xl flex items-center justify-center ${
                              file.label === '招标文件' && isTenderUploaded ? 'bg-green-100 text-green-600' : `${file.bg} ${file.color}`
                            } shadow-sm group-hover:scale-110 transition-transform`}>
                              <file.icon size={20} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{file.label}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-medium italic">
                              {file.label === '招标文件' && isTenderUploaded ? '招标文件已自动导入' : '点击上传附件'}
                            </span>
                            {!(file.label === '招标文件' && isTenderUploaded) && <Plus size={14} className="text-primary" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8 mt-auto shrink-0 sticky bottom-0 bg-white pb-2">
                    <button 
                      onClick={() => {
                        onEnterWorkbench('准备阶段', { ...analyzedData, isTenderUploaded });
                        resetModal();
                      }}
                      disabled={!analyzedData.projectName.trim()}
                      className="flex-1 py-4 bg-[#0052CC] text-white rounded-2xl font-bold hover:bg-[#0052CC]/90 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      确认并进入工作台
                    </button>
                    <button 
                      onClick={resetModal}
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

export default Dashboard;
