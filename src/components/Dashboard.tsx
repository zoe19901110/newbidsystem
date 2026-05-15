import React, { useState, useEffect } from 'react';
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
  Zap,
  Edit3,
  Plus,
  Calculator,
  List,
  BrainCircuit,
  ChevronDown,
  Ban,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onEnterWorkbench: (stage: string) => void;
  currentEnterprise: { id: string; name: string };
  projects: any[];
}

const formatCountdown = (openingTime: string, now: Date) => {
  if (!openingTime || openingTime === '--') return '待定';
  
  try {
    const target = new Date(openingTime).getTime();
    const current = now.getTime();
    const diff = target - current;
    
    if (isNaN(target)) return '待定';
    if (diff <= 0) return '已结束';
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${d.toString().padStart(2, '0')}天 ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  } catch (e) {
    return '待定';
  }
};

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onEnterWorkbench, currentEnterprise, projects }) => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isTenderUploaded, setIsTenderUploaded] = useState(false);
  const [now, setNow] = useState(new Date());
  const [reminders, setReminders] = useState<Record<number, { text: string; type: 'system' | 'manual' }[]>>({
    22: [{ text: '招标文件最终评审会议', type: 'system' }],
    25: [{ text: '智慧城市管理平台开标', type: 'system' }]
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(22);
  const [newReminderText, setNewReminderText] = useState('');
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(4);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // 周一为0，周日为6
  };
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddReminder = () => {
    if (!newReminderText.trim()) return;
    setReminders(prev => ({
      ...prev,
      [selectedCalendarDate]: [...(prev[selectedCalendarDate] || []), { text: newReminderText, type: 'manual' }]
    }));
    setNewReminderText('');
    setIsAddingReminder(false);
  };

  const [taskAlerts, setTaskAlerts] = useState([
    { id: 1, title: '2026年新能源充电桩部署规划咨询及配套设施建设项目', time: '2026-04-10 17:00', type: '保证金', daysLeft: 1 },
    { id: 2, title: '公共图书馆数字化二期项目及馆藏资源扩容方案', time: '2026-04-11 09:30', type: '投标截止', daysLeft: 2 },
    { id: 3, title: '城市轨道交通信号维护服务年度框架协议', time: '2026-04-12 16:00', type: '保证金', daysLeft: 3 },
    { id: 4, title: '社区养老服务平台开发与智慧医疗集成项目', time: '2026-04-12 10:00', type: '投标截止', daysLeft: 3 },
  ]);

  useEffect(() => {
    // Test connection or fetch user projects if using external backend...
  }, []);

  const handleOpenReport = (id?: string, type: string = 'report') => {
    let view = 'report';
    if (type === 'bid') view = 'bid-creation';
    if (type === 'tech-bid') view = 'tech-bid-creation';
    if (type === 'bid-rewrite') view = 'bid-rewrite';
    
    const url = window.location.origin + `?view=${view}&projectId=${id || 'default'}`;
    window.open(url, '_blank');
  };

  const [parsingHistory, setParsingHistory] = useState([
    { id: 'h1', name: '原始招标文件解析', date: '2026-05-01', project: '智慧校园建设项目', type: 'report' },
    { id: 'h2', name: '第一次答疑文件解析', date: '2026-05-03', project: '轨道交通五号线', type: 'report' },
    { id: 'h3', name: '第二次答疑文件解析', date: '2026-05-05', project: '新能源充电桩项目', type: 'report' },
    { id: 'r1', name: '技术标方案-改写优化', date: '2026-05-10', project: '柳州市水利局项目', type: 'bid-rewrite' },
    { id: 't1', name: '技术标-智能起草初稿', date: '2026-05-08', project: '水利枢纽建设工程', type: 'tech-bid' },
    { id: 'b1', name: '资信标-智能起草初稿', date: '2026-05-07', project: '公共服务平台项目', type: 'bid' },
    { id: 'h4', name: '技术参数对比报告', date: '2026-05-06', project: '智慧医疗集成项目', type: 'report' },
    { id: 'h5', name: '商务风险识别报告', date: '2026-05-07', project: '公共图书馆数字化', type: 'report' },
    { id: 'h6', name: '招标文件深度全解析', date: '2026-05-08', project: '数字化二期方案', type: 'report' },
    { id: 'h7', name: '关键条款提取列表', date: '2026-05-09', project: '城市轨道交通信号', type: 'report' },
  ]);
  const [historyPage, setHistoryPage] = useState(1);
  const historyItemsPerPage = 5;

  const dismissAlert = (id: number) => {
    setTaskAlerts(prev => prev.filter(alert => alert.id !== id));
  };
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

  const sortedProjects = [...projects].sort((a, b) => {
    const getProjectInfo = (p: any) => {
      const timeStr = p.bidOpeningTime || p.deadline || p.openingTime;
      const openingDate = (timeStr && timeStr !== '--') ? new Date(timeStr) : null;
      const isActuallyOpened = openingDate && openingDate.getTime() <= now.getTime();
      const status = p.status === '放弃投标' ? '已暂停' : (p.status === '已完成' || isActuallyOpened ? '已开标' : '投标中');
      
      // Priority: Bidding (0) > Paused (1) > Opened (2)
      let priority = 0;
      if (status === '已暂停') priority = 1;
      if (status === '已开标') priority = 2;
      
      const timeScore = (openingDate && !isNaN(openingDate.getTime())) ? openingDate.getTime() : 2e15;
      
      return { priority, timeScore, diff: openingDate ? openingDate.getTime() - now.getTime() : 0 };
    };

    const infoA = getProjectInfo(a);
    const infoB = getProjectInfo(b);

    if (infoA.priority !== infoB.priority) {
      return infoA.priority - infoB.priority;
    }

    // Within same priority, sort by proximity to opening time
    if (infoA.priority === 0) {
      // Bidding: soonest opening first
      return infoA.timeScore - infoB.timeScore;
    } else {
      // Opened/Paused: most recent first
      return infoB.timeScore - infoA.timeScore;
    }
  });

  const displayProjects = sortedProjects.map(p => {
    const openingTimeStr = p.bidOpeningTime || p.deadline || p.openingTime;
    const isActuallyOpened = openingTimeStr && openingTimeStr !== '--' && new Date(openingTimeStr).getTime() <= now.getTime();
    const status = p.status === '放弃投标' ? '已暂停' : (p.status === '已完成' || isActuallyOpened ? '已开标' : '投标中');
    
    return {
      id: p.id,
      name: p.name,
      status: status,
      statusColor: p.status === '放弃投标' ? 'bg-red-50 text-red-600' : (status === '已开标' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-primary'),
      deadline: openingTimeStr || '--',
      countdown: status === '已开标' ? '已结束' : formatCountdown(openingTimeStr, now),
      icon: p.status === '放弃投标' ? Ban : (status === '已开标' ? CheckCircle2 : Briefcase),
      iconBg: p.status === '放弃投标' ? 'bg-red-50 text-red-600' : (status === '已开标' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-primary'),
      isPaused: p.status === '放弃投标'
    };
  });

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
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors break-all line-clamp-2 w-[400px]" title={project.name}>{project.name}</h4>
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
                          {project.deadline && project.deadline !== '--' ? `${project.deadline} 开标` : '开标时间：待定'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 self-center">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">开标倒计时</p>
                      <p className={`text-lg font-bold tabular-nums ${project.countdown !== '已结束' && project.countdown !== '待定' && project.countdown.startsWith('00') ? 'text-red-500' : 'text-slate-700'}`}>{project.countdown}</p>
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
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">投标日历</h3>
                <button 
                  onClick={() => setIsAddingReminder(!isAddingReminder)}
                  className="p-1 hover:bg-slate-100 rounded-full text-primary transition-colors"
                  title="添加提醒"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={() => setShowCalendarPicker(!showCalendarPicker)}
                className="flex items-center gap-1 text-sm font-bold text-primary hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors group"
              >
                <span>{calendarYear}年{calendarMonth.toString().padStart(2, '0')}月</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showCalendarPicker ? 'rotate-180' : ''}`} />
              </button>

              {showCalendarPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-4 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 min-w-[240px]"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">选择年份</p>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar pr-1">
                        {[2024, 2025, 2026, 2027, 2028].map(year => (
                          <button
                            key={year}
                            onClick={() => {
                              setCalendarYear(year);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors mb-1 ${calendarYear === year ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                          >
                            {year}年
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">选择月份</p>
                      <div className="grid grid-cols-2 gap-1">
                        {[...Array(12)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => {
                              setCalendarMonth(i + 1);
                              setShowCalendarPicker(false);
                            }}
                            className={`text-center py-1.5 rounded-lg text-xs font-bold transition-colors ${calendarMonth === i + 1 ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                          >
                            {i + 1}月
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {isAddingReminder && (
              <div className="px-6 pt-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">为 {selectedCalendarDate}日 添加提醒</span>
                    <button onClick={() => setIsAddingReminder(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  </div>
                  <input 
                    type="text"
                    placeholder="输入提醒内容..."
                    autoFocus
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddReminder();
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleAddReminder}
                      className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      保存提醒
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
                  <span key={day} className={`text-[10px] font-bold uppercase ${i >= 5 ? 'text-red-400' : 'text-slate-400'}`}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(getFirstDayOfMonth(calendarYear, calendarMonth))].map((_, i) => (
                  <div key={`empty-${i}`} className="h-10"></div>
                ))}
                {[...Array(getDaysInMonth(calendarYear, calendarMonth))].map((_, i) => {
                  const day = i + 1;
                  const isToday = calendarYear === 2026 && calendarMonth === 4 && day === 22;
                  const hasReminders = reminders[day] && reminders[day].length > 0;
                  const hasManualReminders = reminders[day]?.some(r => r.type === 'manual');
                  const isSelected = selectedCalendarDate === day;

                  return (
                    <div 
                      key={day} 
                      onClick={() => setSelectedCalendarDate(day)}
                      className={`h-10 flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all relative
                        ${isToday ? (isSelected ? 'bg-[#0052CC] text-white shadow-lg font-black scale-110' : 'bg-blue-50 text-[#0052CC]') : (isSelected ? 'bg-slate-100 text-primary border border-primary/20 font-black' : 'hover:bg-slate-50')}
                        ${((getFirstDayOfMonth(calendarYear, calendarMonth) + i) % 7 === 5 || (getFirstDayOfMonth(calendarYear, calendarMonth) + i) % 7 === 6) ? 'text-red-400' : ''}
                      `}
                    >
                      {day}
                      {hasReminders && !isToday && !isSelected && (
                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${hasManualReminders ? 'bg-yellow-400' : 'bg-primary'}`}></span>
                      )}
                      {hasReminders && isToday && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{selectedCalendarDate}日 提醒事项</span>
                </div>
                
                {reminders[selectedCalendarDate] && reminders[selectedCalendarDate].length > 0 ? (
                  reminders[selectedCalendarDate].map((rem, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx} 
                      className="flex items-start gap-3 group"
                    >
                      <div className={`w-1 h-10 ${rem.type === 'manual' ? 'bg-yellow-400' : (selectedCalendarDate === 22 ? 'bg-yellow-400' : 'bg-primary')} rounded-full shrink-0`}></div>
                      <div className="flex-1">
                        <p className="text-xs font-bold">{selectedCalendarDate === 22 ? `4月${selectedCalendarDate}日 今天` : `4月${selectedCalendarDate}日`}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{rem.text}</p>
                      </div>
                      {rem.type === 'manual' && (
                        <button 
                          onClick={() => {
                            setReminders(prev => ({
                              ...prev,
                              [selectedCalendarDate]: prev[selectedCalendarDate].filter((_, i) => i !== idx)
                            }));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="py-4 text-center border border-dashed border-slate-100 rounded-xl">
                    <p className="text-[10px] text-slate-400 italic">当日暂无提醒项目</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 rounded-xl select-none group-hover:bg-slate-100 transition-colors">
                  <Bell size={20} className="text-slate-500" />
                </div>
                <h3 className="text-lg font-bold">关键任务提醒</h3>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">最近3天内到期</span>
              </div>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {taskAlerts.length > 0 ? (
                    taskAlerts.map((task, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        layout
                        key={task.id} 
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all group relative"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="size-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${task.type === '保证金' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                  {task.type}
                                </span>
                                <p className="text-sm font-black text-slate-700 truncate leading-snug" title={task.title}>
                                  {task.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                  <CalendarIcon size={12} />
                                  截止日期: {task.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <button 
                              onClick={() => dismissAlert(task.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-all text-slate-300"
                              title="关闭提醒"
                            >
                              <X size={14} />
                            </button>
                            <div className="text-right">
                              <p className="text-xs font-black text-slate-600 tracking-tight">剩余 <span className="text-rose-500">{task.daysLeft}</span> 天</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                        <Bell size={20} className="text-slate-200" />
                      </div>
                      <p className="text-xs font-medium">暂无紧急任务提醒</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Analysis History Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-8 h-[580px]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Database className="text-primary" size={20} />
                <h3 className="text-lg font-bold">解析历史记录</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-50 flex-1 overflow-y-auto custom-scrollbar">
              {parsingHistory
                .slice((historyPage - 1) * historyItemsPerPage, historyPage * historyItemsPerPage)
                .map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleOpenReport(item.project, item.type)}
                    className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                        item.type === 'bid' 
                        ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' 
                        : item.type === 'tech-bid'
                        ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                        : item.type === 'bid-rewrite'
                        ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        {item.type === 'bid' ? <ShieldCheck size={20} /> : item.type === 'tech-bid' ? <Zap size={20} /> : item.type === 'bid-rewrite' ? <Edit3 size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                          <span className="text-[10px] font-bold text-slate-300">•</span>
                          <span className="text-[10px] font-bold text-slate-400 italic">{item.project}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">解析日期</p>
                        <p className="text-sm font-bold text-slate-700">{item.date}</p>
                      </div>
                      <button className="p-2 hover:bg-primary/10 hover:text-primary text-slate-300 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {parsingHistory.length > historyItemsPerPage && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                   第 {historyPage} 页 / 共 {Math.ceil(parsingHistory.length / historyItemsPerPage)} 页
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all font-bold text-xs"
                  >
                    上一页
                  </button>
                  <button 
                    onClick={() => setHistoryPage(p => Math.min(Math.ceil(parsingHistory.length / historyItemsPerPage), p + 1))}
                    disabled={historyPage === Math.ceil(parsingHistory.length / historyItemsPerPage)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all font-bold text-xs"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
