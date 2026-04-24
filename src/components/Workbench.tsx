import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import BidParsing from './BidParsing';
import MarginReceiptUpload from './MarginReceiptUpload';
import { 
  Fingerprint, 
  ClipboardList, 
  ClipboardCheck,
  Share2, 
  Check, 
  UploadCloud, 
  FileText, 
  Download, 
  Eye, 
  Trash2,
  Info,
  Network,
  AlertTriangle,
  FileSearch,
  ShieldCheck,
  BrainCircuit,
  History,
  ArrowRight,
  User,
  Phone,
  Calendar,
  FolderOpen,
  CheckCircle2,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Layers,
  Trophy,
  Receipt,
  Users,
  Copy,
  Languages,
  Building2,
  Clock,
  BarChart3,
  PenTool,
  Scan,
  Activity,
  TrendingUp,
  Search,
  Maximize2,
  ChevronUp,
  Minus,
  List,
  LayoutGrid,
  Edit3,
  LogOut,
  X,
  Monitor,
  Bell,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
  Plus,
  PlusCircle,
  Award,
  MessageSquare,
  Printer,
  MousePointer2,
  Highlighter,
  Type,
  Square,
  Circle,
  Eraser,
  Play,
  Ban,
  Wallet,
  Medal,
  Archive,
  Globe,
  Paperclip,
  Upload,
  Frown,
  Sparkles,
  Library,
  Lightbulb,
  Lock,
  EyeOff,
  File,
  FileText as FileTextIcon,
  Image as ImageIcon,
  FileCheck,
  Tag,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'preparation' | 'production' | 'inspection' | 'archiving';
type SubView = 'main' | 'annotation-view' | 'key-info-view' | 'qualification-view' | 'risk-view' | 'file-production' | 'inspection-detail' | 'archive-register' | 'resource-center' | 'parsing-report' | 'margin-receipt';

interface WorkbenchProps {
  onExit: () => void;
  initialPhase?: Phase;
  initialProjectData?: any;
  currentEnterprise: { id: string; name: string };
  uploadedFiles: Record<string, boolean>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onUpdateProject?: (updatedProject: any) => void;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image';
  date: string;
  category?: '中标通知书' | '合同' | '其他材料' | '开标记录' | '投标文件' | '招标文件' | '答疑文件' | '验收报告';
}

const ParsingReportView = ({ onBack, projectData, isPaused }: { onBack: () => void, projectData: any, isPaused: boolean }) => (
  <div className={`bg-white p-8 rounded-xl shadow-sm border border-slate-100 ${isPaused ? 'opacity-75' : ''}`}>
    <button onClick={onBack} className="mb-4 flex items-center gap-2 text-slate-500 hover:text-primary">
      <ChevronLeft size={16} /> 返回
    </button>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">解析报告</h2>
      {isPaused && (
        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
          <Ban size={14} /> 此项目已暂停
        </span>
      )}
    </div>
    <div className="mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
      <h3 className="font-bold text-lg mb-4">项目核心信息</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded border border-slate-100">
          <p className="text-sm text-slate-500">项目名称</p>
          <p className="font-bold">{projectData.projectName}</p>
        </div>
        <div className="p-4 bg-white rounded border border-slate-100">
          <p className="text-sm text-slate-500">招标编号</p>
          <p className="font-bold">{projectData.projectNumber}</p>
        </div>
      </div>
    </div>
  </div>
);

const Workbench: React.FC<WorkbenchProps> = ({ 
  onExit, 
  initialPhase, 
  initialProjectData, 
  currentEnterprise,
  uploadedFiles,
  setUploadedFiles,
  onUpdateProject
}) => {
  const [currentPhase, setCurrentPhase] = useState<Phase>(() => {
    const saved = localStorage.getItem('workbench-phase');
    return saved ? JSON.parse(saved) : (initialPhase || 'preparation');
  });
  const [subView, setSubView] = useState<SubView>('main');
  const [showToolModal, setShowToolModal] = useState(false);
  const [isToolInstalled, setIsToolInstalled] = useState(false); // Mock state
  const [activeRightTab, setActiveRightTab] = useState<string | null>(null);
  const [showOperationLog, setShowOperationLog] = useState(false);
  const [showCollaborativeSharing, setShowCollaborativeSharing] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [activeViewerTab, setActiveViewerTab] = useState<'core' | 'risk' | 'custom'>('risk');

  const [insights, setInsights] = useState(() => {
    const saved = localStorage.getItem('workbench-insights');
    return saved ? JSON.parse(saved) : [
      { id: '1', content: '本项目对大跨度钢结构有特殊要求，建议在技术标中重点突出我们在同类项目中的施工经验。', isPublic: false, author: '我', date: '2026-03-25', type: 'idea', deadline: '', status: 'active' },
      { id: '2', content: '注意甲方对环保要求的敏感度，材料选择上要优先考虑绿色建材。', isPublic: true, author: '我', date: '2026-03-26', type: 'task', deadline: '2026-04-10', status: 'active' },
      { id: '3', content: '今天下午3点与设计院进行图纸会审，请各专业负责人准时参加。', isPublic: true, author: '李茂盛', date: '2026-03-27', type: 'meeting', deadline: '', status: 'active' },
      { id: '4', content: '更新了BIM模型，解决了地下室管线碰撞问题，请大家查看最新版本。', isPublic: true, author: '王志远', date: '2026-03-28', type: 'task', deadline: '2026-03-30', status: 'active' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('workbench-insights', JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    localStorage.setItem('workbench-phase', JSON.stringify(currentPhase));
  }, [currentPhase]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMarginUploadModal, setShowMarginUploadModal] = useState(false);
  const [showArchivingModal, setShowArchivingModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [showDocDropdown, setShowDocDropdown] = useState(false);
  
  // Archiving States
  const [openingRecords, setOpeningRecords] = useLocalStorage('workbench_openingRecords', [
    { units: '某某建设集团有限公司', price: 12105000, rank: '1', isWinner: true, isSelf: true },
    { units: '中建某局有限公司', price: 12500000, rank: '2', isWinner: false, isSelf: false },
    { units: '省建工集团', price: 12800000, rank: '3', isWinner: false, isSelf: false },
  ]);
  const [winningRecords, setWinningRecords] = useLocalStorage('workbench_winningRecords', [
    { unit: '某某建设集团有限公司', amount: 12105000, date: '2024-03-25', url: 'http://ggzy.example.com/...' },
  ]);
  const [contractRecords, setContractRecords] = useLocalStorage('workbench_contractRecords_main', [
    { id: 'HT-2024-001', name: '城市基础设施施工合同', date: '2024-04-05', amount: 11800000, owner: '陈经理', duration: '30', status: '履行中', fulfillmentDate: '2024-04-10', expectedCompletionDate: '2024-05-10' },
  ]);
  const [contractAttachments, setContractAttachments] = useLocalStorage<Attachment[]>('workbench_contractAttachments_main', [
    { id: '1', name: '中标通知书.pdf', size: '1.2MB', type: 'pdf', date: '2024-03-25', category: '中标通知书' },
    { id: '2', name: '施工合同扫描件.jpg', size: '2.4MB', type: 'image', date: '2024-04-05', category: '合同' },
  ]);
  const [openingRecordFiles, setOpeningRecordFiles] = useLocalStorage<Attachment[]>('workbench_openingRecordFiles', [
    { id: 'orf-1', name: '开标记录表-20240320.pdf', size: '1.5MB', type: 'pdf', date: '2024-03-20', category: '开标记录' }
  ]);
  const [tenderFiles, setTenderFiles] = useLocalStorage<Attachment[]>('workbench_tenderFiles', [
    { id: '0', name: '投标文件_技术标.pdf', size: '4.5MB', type: 'pdf', date: '2024-03-15', category: '投标文件' },
    { id: '01', name: '投标文件_商务标.pdf', size: '2.8MB', type: 'pdf', date: '2024-03-15', category: '投标文件' },
  ]);
  const [acceptanceReports, setAcceptanceReports] = useLocalStorage<Attachment[]>('workbench_acceptanceReports', [
    { id: 'ar-1', name: '工程竣工验收报告-克东小区.pdf', size: '3.2MB', type: 'pdf', date: '2024-11-20', category: '验收报告' }
  ]);
  const [otherMaterialAttachments, setOtherMaterialAttachments] = useLocalStorage<Record<string, Attachment[]>>('workbench_otherMaterialAttachments', {
    'filing': [],
    'other': []
  });
  const [unsuccessfulReason, setUnsuccessfulReason] = useLocalStorage('workbench_unsuccessfulReason', '投标报价略高于中标单位，且在技术方案的细节描述上不够详尽，未能充分体现我司在同类项目中的核心竞争优势。');
  const [tenderPersonnel, setTenderPersonnel] = useLocalStorage<string[]>('workbench_tenderPersonnel', ['陈经理', '王志强']);

  const [viewingDoc, setViewingDoc] = useState<string>('tender-doc');
  const [notifIndex, setNotifIndex] = useState(0);

  const isTenderUploaded = !!uploadedFiles?.['tender-doc'];

  const clarDocs = Object.keys(uploadedFiles || {})
    .filter(key => key.startsWith('clar-doc-') && uploadedFiles[key])
    .sort((a, b) => {
      const numA = parseInt(a.split('-')[2]);
      const numB = parseInt(b.split('-')[2]);
      return numB - numA; // Latest first
    });

  const hasAnyDoc = isTenderUploaded || clarDocs.length > 0;
  const hasMultipleDocs = (isTenderUploaded && clarDocs.length > 0) || clarDocs.length > 1;
  const latestDocKey = clarDocs.length > 0 ? clarDocs[0] : (isTenderUploaded ? 'tender-doc' : null);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Dummy state for forcing re-render
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);
  const [projectData, setProjectData] = useState(initialProjectData || {
    projectName: `城市基础设施二期项目 (${currentEnterprise.name})`,
    projectNumber: 'BID-2025-00892',
    tenderer: 'XX市交通运输局',
    tendererContact: '张工 010-88888888',
    tenderAgent: 'XX招标代理有限公司',
    tenderAgentContact: '李经理 010-66666666',
    openingTime: '2026-01-15 09:30',
    depositDeadline: '2026-01-12 17:00',
    openingLocation: 'XX市公共资源交易中心 301 会议室',
    filingInfo: '已完成网上备案',
    depositAmount: '¥ 500,000.00',
    collectionTime: '2025-12-25',
    tenderRequirements: '1. 资质要求：具备市政公用工程施工总承包一级及以上资质；\n2. 业绩要求：近三年内具有类似智慧交通项目业绩；\n3. 技术要求：支持国产化适配。',
    otherRemarks: '',
    status: '进行中'
  });

  const isPaused = projectData.status === '放弃投标';

  const handlePauseProject = () => {
    setConfirmDialog({
      message: '确定要放弃该项目的投标吗？',
      onConfirm: () => {
        const newData = { ...projectData, status: '放弃投标' };
        setProjectData(newData);
        onUpdateProject?.(newData);
      }
    });
  };

  const handleRestartProject = () => {
    setConfirmDialog({
      message: '确定要重启该项目的投标吗？',
      onConfirm: () => {
        const newData = { ...projectData, status: '进行中' };
        setProjectData(newData);
        onUpdateProject?.(newData);
      }
    });
  };

  useEffect(() => {
    if (!initialProjectData) {
      setProjectData(prev => ({
        ...prev,
        projectName: `城市基础设施二期项目 (${currentEnterprise.name})`
      }));
    }
  }, [currentEnterprise.name, initialProjectData]);

  const handleProjectDataChange = (field: string, value: string) => {
    if (isPaused) {
      alert('此项目已暂停');
      return;
    }
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const analysisResults = {
    riskAnalysis: [
      {
        title: '资格审查潜在废标项',
        original: '17.4.3 在第1.1.4.5目约定的缺陷责任期（工程质量保修期）满时，承包人没有完成缺陷责任的，发包人有权扣留与未履行责任剩余工作所需金额相应的质量保证金余额，并有权根据第19.3款约定要求延长缺陷责任期（工程质量保修期），直至完成剩余工作为止。',
        analysis: '合同条款及格式章节出现缺陷责任期/工程质量保修期，请注意检查。',
        suggestion: '投标附录函中，质量缺陷责任期限响应被废标，其要求在合同条款中：https://ggzyjy.huzhou.gov.cn/art/2026/7/18/art_1229670649_65527.html'
      },
      {
        title: '资格审查潜在废标项',
        original: '（5）承包人在缺陷责任期（工程质量保修期）内，未能对工程接收证书所列的缺陷清单的内容或缺陷责任期（工程质量保修期）内发生的缺陷进行修复，而又拒绝按监理人指示再进行修复；',
        analysis: '合同条款及格式章节出现缺陷责任期/工程质量保修期，请注意检查。',
        suggestion: '投标附录函中，质量缺陷责任期限响应被废标，其要求在合同条款中：https://ggzyjy.huzhou.gov.cn/art/2026/7/18/art_1229670649_65527.html'
      }
    ],
    coreContent: [
      { label: '项目名称', value: '克东县 2021 年老旧小区改造建设项目' },
      { label: '招标编号', value: 'T2300000001003033' },
      { label: '预算金额', value: '¥1,250.0万' },
      { label: '开标时间', value: '2026-12-20 09:30' },
    ]
  };

  const baseNotifications = [
    { id: 1, type: 'warning', text: '保证金缴纳截止时间提醒：2026-11-25 17:00', time: '2小时前', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 2, type: 'info', text: '开标时间提醒：2026-12-20 09:30', time: '5小时前', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, type: 'alert', text: '文件领取截止时间提醒：2026-04-15', time: '1天前', icon: Info, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const insightNotifications = insights
    .filter(i => (i.type === 'task' || i.type === 'meeting') && i.status === 'active')
    .map(i => ({
      id: `insight-${i.id}`,
      type: i.type === 'task' ? 'warning' : 'info',
      text: `${i.type === 'task' ? '任务' : '会议'}提醒：${i.content}${i.deadline ? ` (截止: ${i.deadline})` : ''}`,
      time: i.date,
      icon: i.type === 'task' ? CheckSquare : FileTextIcon,
      color: i.type === 'task' ? 'text-amber-500' : 'text-indigo-500',
      bg: i.type === 'task' ? 'bg-amber-50' : 'bg-indigo-50'
    }));

  const notifications = [...baseNotifications, ...insightNotifications];

  useEffect(() => {
    const timer = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const phases = [
    { id: 'preparation', label: '准备阶段' },
    { id: 'production', label: '制作阶段' },
    { id: 'inspection', label: '检查阶段' },
    { id: 'archiving', label: '标后归档' },
  ];

  const handleStartProduction = () => {
    setShowToolModal(true);
  };

  return (
    <>
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      {/* Top Navigation / Exit Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Monitor size={16} />
            <span>工作台模式</span>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
        >
          <LogOut size={16} />
          退出工作台
        </button>
      </div>

      <div className="flex gap-6 relative">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">

      {/* Project Header */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 relative">
              <h2 className="text-2xl font-bold text-slate-900">{projectData.projectName}</h2>
              
              <div className="relative flex items-center gap-0">
                <button 
                  onClick={() => {
                    if (hasAnyDoc) {
                      setViewingDoc(latestDocKey!);
                      setActiveRightTab('annotation');
                    }
                  }}
                  className={`ml-4 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                    hasAnyDoc 
                      ? "bg-slate-100 text-slate-600 hover:bg-primary hover:text-white border-slate-200" 
                      : "bg-red-50 text-red-500 border-red-100"
                  } ${hasMultipleDocs ? 'rounded-r-none border-r-0' : ''}`}
                >
                  <FileText size={14} /> 
                  {!hasAnyDoc && "未上传招标文件"}
                  {hasAnyDoc && !hasMultipleDocs && (isTenderUploaded ? "查看招标文件" : `查看第${parseInt(clarDocs[0].split('-')[2]) + 1}次答疑文件`)}
                  {hasMultipleDocs && (clarDocs.length > 0 ? `查看第${parseInt(clarDocs[0].split('-')[2]) + 1}次答疑文件` : "查看招标文件")}
                </button>
                
                {hasMultipleDocs && (
                  <button
                    onClick={() => setShowDocDropdown(!showDocDropdown)}
                    onBlur={() => setTimeout(() => setShowDocDropdown(false), 200)}
                    className="px-1.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-primary hover:text-white border border-slate-200 rounded-r-lg transition-all"
                  >
                    <ChevronDown size={12} className={`transition-transform ${showDocDropdown ? 'rotate-180' : ''}`} />
                  </button>
                )}

                <AnimatePresence>
                  {showDocDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-4 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="py-1">
                        {isTenderUploaded && (
                          <>
                            <button
                              onClick={() => {
                                setViewingDoc('tender-doc');
                                setActiveRightTab('annotation');
                                setShowDocDropdown(false);
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2 group"
                            >
                              <FileText size={14} className="text-slate-400 group-hover:text-primary" />
                              <span>原始招标文件</span>
                            </button>
                            <div className="h-px bg-slate-50 my-1 mx-2" />
                          </>
                        )}
                        {clarDocs.map((doc, idx) => (
                          <button
                            key={doc}
                            onClick={() => {
                              setViewingDoc(doc);
                              setActiveRightTab('annotation');
                              setShowDocDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-slate-400 group-hover:text-primary" />
                              <span>第{parseInt(doc.split('-')[2]) + 1}次答疑文件</span>
                            </div>
                            {idx === 0 && <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 text-[10px]">最新</span>}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5">
                <Fingerprint size={18} /> 项目编号：{projectData.projectNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
                setActiveRightTab(activeRightTab === 'resource-center' ? null : 'resource-center');
              }}
              className={`px-6 py-2 border rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                isPaused ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' :
                activeRightTab === 'resource-center' 
                  ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' 
                  : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
              }`}
            >
              <FolderOpen size={16} /> 资源中心
            </button>
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
                setActiveRightTab(activeRightTab === 'operation-log' ? null : 'operation-log');
              }}
              className={`px-6 py-2 border rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                isPaused ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' :
                activeRightTab === 'operation-log' 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-800/20' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <History size={16} /> 操作日志
            </button>
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
                setShowCollaborativeSharing(true);
              }}
              className={`px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm hover:shadow-md flex items-center gap-2 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Share2 size={16} /> 协作分享
            </button>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-50">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">招标人</p>
                <p className="text-sm font-bold text-slate-900">{projectData.tenderer || '--'}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User size={12} /> {projectData.tendererContact ? projectData.tendererContact.split(' ')[0] : '--'} <Phone size={12} className="ml-1" /> {projectData.tendererContact ? projectData.tendererContact.split(' ')[1] || '--' : '--'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Network size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">招标代理</p>
                <p className="text-sm font-bold text-slate-900">{projectData.tenderAgent || '--'}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User size={12} /> {projectData.tenderAgentContact ? projectData.tenderAgentContact.split(' ')[0] : '--'} <Phone size={12} className="ml-1" /> {projectData.tenderAgentContact ? projectData.tenderAgentContact.split(' ')[1] || '--' : '--'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">关键时间节点</p>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>开标时间：</span>
                    <span className="text-primary">{projectData.openingTime || '--'}</span>
                  </p>
                  <p className="text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>领取截止：</span>
                    <span>{projectData.collectionTime || '--'}</span>
                  </p>
                  <p className="text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>保证金截止：</span>
                    <span className="text-orange-500">{projectData.depositDeadline || '--'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Scan size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">开标地点</p>
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{projectData.openingLocation || '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Ticker */}
        <div 
          onClick={() => setShowNotifications(true)}
          className="bg-orange-50/50 border border-orange-100 rounded-lg px-4 py-4 flex items-center gap-3 overflow-hidden group cursor-pointer hover:bg-orange-50 transition-colors"
        >
          <div className="relative">
            <Bell size={18} className="text-orange-500 shrink-0" />
            <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1 overflow-hidden relative h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={notifIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm text-orange-700 font-medium truncate"
              >
                {notifications[notifIndex].text}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold uppercase tracking-wider">
            查看全部
            <ChevronRight size={12} />
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl py-8 px-12 shadow-sm border border-slate-100">
        <div className="flex items-center justify-center gap-4 max-w-5xl mx-auto">
          {phases.map((phase, idx) => {
            const isActive = currentPhase === phase.id;
            
            return (
              <React.Fragment key={phase.id}>
                <div 
                  onClick={() => {
                    if (isPaused) {
                      alert('此项目已暂停');
                      return;
                    }
                    setCurrentPhase(phase.id as Phase);
                    setSubView('main');
                  }}
                  className={`flex flex-col items-center cursor-pointer group px-4 ${isPaused ? 'opacity-50' : ''}`}
                >
                  <span className={`text-sm font-bold transition-all duration-300 mb-2 ${
                    isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {phase.label}
                  </span>
                  <div className={`h-1 w-12 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-primary' : 'bg-transparent'
                  }`} />
                </div>
                {idx < phases.length - 1 && (
                  <div className="flex items-center px-4 text-slate-200 tracking-[4px] font-light select-none">
                    --------
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPhase}-${subView}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          {subView === 'main' ? (
            <div className="space-y-8">
              {currentPhase === 'preparation' && (
                <PreparationPhase 
                  onNavigate={(view) => setSubView(view)} 
                  onSelect={setSelectedCard} 
                  setActiveRightTab={setActiveRightTab}
                  activeRightTab={activeRightTab}
                  initialProjectData={initialProjectData}
                  isTenderUploaded={isTenderUploaded}
                  projectData={projectData}
                  handleProjectDataChange={handleProjectDataChange}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  otherMaterialAttachments={otherMaterialAttachments}
                  setOtherMaterialAttachments={setOtherMaterialAttachments}
                  isPaused={isPaused}
                  setConfirmDialog={setConfirmDialog}
                />
              )}
              {currentPhase === 'production' && <ProductionPhase onNavigate={handleStartProduction} onSelect={setSelectedCard} isPaused={isPaused} />}
              {currentPhase === 'inspection' && <InspectionPhase onUploadMargin={() => setShowMarginUploadModal(true)} onSelect={setSelectedCard} isPaused={isPaused} />}
              {currentPhase === 'archiving' && <ArchivingPhase onOpenArchiving={() => setShowArchivingModal(true)} onOpenAttachments={() => setShowAttachmentsModal(true)} isPaused={isPaused} />}
            </div>
          ) : (
            <>
              {subView === 'annotation-view' && <AnnotationView onBack={() => setSubView('main')} isPaused={isPaused} />}
              {subView === 'key-info-view' && <KeyInfoView onBack={() => setSubView('main')} isPaused={isPaused} />}
              {subView === 'qualification-view' && <QualificationView onBack={() => setSubView('main')} isPaused={isPaused} />}
              {subView === 'risk-view' && <RiskView onBack={() => setSubView('main')} isPaused={isPaused} />}
              {subView === 'file-production' && (
                <FileProductionView 
                  onBack={() => setSubView('main')} 
                  isPaused={isPaused} 
                  onShare={() => setShowCollaborativeSharing(true)}
                />
              )}
              {subView === 'inspection-detail' && <InspectionDetailView onBack={() => setSubView('main')} uploadedFiles={uploadedFiles} isPaused={isPaused} />}
              {subView === 'archive-register' && <ArchiveRegisterView onBack={() => setSubView('main')} isPaused={isPaused} />}
              {subView === 'parsing-report' && <ParsingReportView onBack={() => setSubView('main')} projectData={projectData} isPaused={isPaused} />}
              {subView === 'margin-receipt' && <MarginReceiptUpload onBack={() => setSubView('main')} isPaused={isPaused} projectData={projectData} />}
              {subView === 'bid-parsing' && (
                <BidParsing 
                  onBack={() => setSubView('main')} 
                  onViewReport={() => setSubView('parsing-report')}
                  autoImported={isTenderUploaded}
                />
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
        </div>
      </div>

      {/* Right Sliding Panel */}
      <AnimatePresence>
        {activeRightTab && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRightTab(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[70]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bottom-0 ${activeRightTab === 'annotation' || activeRightTab === 'material-market' ? 'w-[1200px]' : activeRightTab === 'resource-center' ? 'w-[600px]' : 'w-[450px]'} bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[80] flex flex-col border-l border-slate-100 transition-all duration-500`}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                    activeRightTab === 'annotation' ? 'bg-blue-500' :
                    activeRightTab === 'key-info' ? 'bg-indigo-500' :
                    activeRightTab === 'qualification' ? 'bg-emerald-500' :
                    activeRightTab === 'disqualification' ? 'bg-rose-500' : 
                    activeRightTab === 'material-market' ? 'bg-amber-500' :
                    activeRightTab === 'resource-center' ? 'bg-amber-500' : 
                    activeRightTab === 'operation-log' ? 'bg-slate-800' : 'bg-purple-500'
                  }`}>
                    {activeRightTab === 'annotation' && <PenTool size={20} />}
                    {activeRightTab === 'key-info' && <BrainCircuit size={20} />}
                    {activeRightTab === 'qualification' && <ShieldCheck size={20} />}
                    {activeRightTab === 'disqualification' && <ShieldAlert size={20} />}
                    {activeRightTab === 'material-market' && <LayoutGrid size={20} />}
                    {activeRightTab === 'resource-center' && <FolderOpen size={20} />}
                    {activeRightTab === 'operation-log' && <History size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {activeRightTab === 'annotation' && '在线批注'}
                      {activeRightTab === 'key-info' && '关键信息提取'}
                      {activeRightTab === 'qualification' && '资格审查'}
                      {activeRightTab === 'disqualification' && '风险建议'}
                      {activeRightTab === 'material-market' && '素材市场'}
                      {activeRightTab === 'resource-center' && '资源中心'}
                      {activeRightTab === 'operation-log' && '操作日志'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      {activeRightTab === 'material-market' ? '素材市场' : 
                       activeRightTab === 'resource-center' ? '资源管理' : 
                       activeRightTab === 'operation-log' ? '操作日志' : '招标文件分析'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveRightTab(null)}
                  className="size-8 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className={`flex-1 overflow-y-auto ${activeRightTab === 'annotation' || activeRightTab === 'resource-center' ? 'p-0' : 'p-8'}`}>
                {activeRightTab === 'annotation' && (
                  <div className="flex h-full bg-slate-50">
                    {/* Document Viewer Area */}
                    <div className="flex-1 overflow-y-auto p-12 bg-slate-200/50 shadow-inner">
                      <div className="max-w-4xl mx-auto bg-white shadow-2xl p-20 min-h-[1500px] relative border border-slate-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                        
                        <div className="text-center mb-16">
                          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">城市基础设施二期项目</h1>
                          <h2 className="text-2xl font-bold text-slate-500">
                            {viewingDoc === 'tender-doc' ? '招标文件' : `第${viewingDoc.split('-')[2]}次答疑文件`}
                          </h2>
                          <div className="mt-8 flex justify-center gap-8 text-sm text-slate-400 font-medium">
                            <span>项目编号：BID-2025-00892</span>
                            <span>发布日期：{viewingDoc === 'tender-doc' ? '2025-11-15' : '2025-12-05'}</span>
                          </div>
                        </div>

                        <div className="space-y-12 text-slate-800 leading-relaxed text-lg">
                          <section>
                            <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-3">
                              <span className="size-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm">01</span>
                              第一章 招标公告
                            </h3>
                            <p className="mb-4">受招标人委托，对城市基础设施二期项目进行公开招标。本项目已具备招标条件，现欢迎符合条件的投标人参加投标。</p>
                            <p>1.1 项目概况：本项目主要包含城市道路绿化、照明系统升级及智慧交通设施建设。</p>
                          </section>

                          <section className="relative">
                            <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-3">
                              <span className="size-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm">02</span>
                              第二章 投标人须知
                            </h3>
                            <div className="relative group">
                              <p className="bg-blue-50 border-l-4 border-blue-500 pl-6 py-4 rounded-r-lg shadow-sm transition-all hover:bg-blue-100/50">
                                <span className="font-bold text-blue-700 block mb-1">2.1 技术参数要求：</span>
                                本项目涉及的所有智慧交通感应设备必须符合国家 GB/T 12345-2023 标准，且具备行业领先水平，支持 5G 毫秒级响应。
                              </p>
                              <div className="absolute -right-3 top-1/2 -translate-y-1/2 size-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-xl border-4 border-white cursor-pointer hover:scale-125 transition-all animate-pulse">
                                1
                              </div>
                            </div>
                            <p className="mt-6">2.2 投标有效期：自投标截止之日起 90 个日历天内有效。</p>
                          </section>

                          <section className="relative">
                            <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-3">
                              <span className="size-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm">03</span>
                              第三章 商务条款
                            </h3>
                            <div className="relative group">
                              <p className="bg-orange-50 border-l-4 border-orange-500 pl-6 py-4 rounded-r-lg shadow-sm transition-all hover:bg-orange-100/50">
                                <span className="font-bold text-orange-700 block mb-1">3.1 交付周期：</span>
                                中标人须在合同签订后 30 个日历天内完成所有设备的交付与安装调试，并确保系统上线运行。
                              </p>
                              <div className="absolute -right-3 top-1/2 -translate-y-1/2 size-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-xl border-4 border-white cursor-pointer hover:scale-125 transition-all animate-pulse">
                                2
                              </div>
                            </div>
                            <p className="mt-6 italic text-slate-400 text-base">注：逾期交付将面临每日合同总额 0.5% 的违约金处罚。</p>
                          </section>

                          <section>
                            <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-3">
                              <span className="size-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm">04</span>
                              第四章 评标办法
                            </h3>
                            <p>本项目采用综合评估法。其中技术标权重 60%，商务标权重 40%。</p>
                          </section>
                        </div>

                        <div className="mt-24 pt-12 border-t border-slate-100 text-center text-slate-300 text-sm italic">
                          --- 招标文件正文结束 ---
                        </div>
                      </div>
                    </div>

                    {/* Annotations Sidebar */}
                    <div className="w-96 border-l border-slate-200 bg-white flex flex-col">
                      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="font-black text-slate-900 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <PenTool size={18} className="text-primary" />
                            批注列表
                          </span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">2 条记录</span>
                        </h4>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {[
                          { id: 1, user: '张工', role: '技术专家', time: '10:30', content: '此处技术参数需进一步核实，GB/T 标准可能有更新版本，需确认是否适用最新标准。', type: 'technical' },
                          { id: 2, user: '李经理', role: '商务总监', time: '昨天', content: '30天的交付周期对于目前的供应链情况来说极具挑战，建议在答疑环节申请延长至45天。', type: 'business' },
                        ].map((note, i) => (
                          <div key={i} className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-black">
                                  {note.user[0]}
                                </div>
                                <div>
                                  <p className="text-xs font-black text-slate-900">{note.user}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{note.role}</p>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">{note.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{note.content}</p>
                            
                            <div className={`absolute -left-px top-6 w-1 h-12 rounded-r-full ${note.type === 'technical' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                            
                            <div className="absolute -right-2 -top-2 size-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                              {note.id}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  if (isPaused) {
                                    alert('此项目已暂停');
                                    return;
                                  }
                                }}
                                className={`text-[10px] font-bold text-primary hover:underline ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                回复
                              </button>
                              <button 
                                onClick={() => {
                                  if (isPaused) {
                                    alert('此项目已暂停');
                                    return;
                                  }
                                }}
                                className={`text-[10px] font-bold text-slate-400 hover:text-red-500 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            if (isPaused) {
                              alert('此项目已暂停');
                              return;
                            }
                          }}
                          className={`w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-black hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Plus size={16} /> 添加新批注
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === 'resource-center' && (
                  <div className="h-full flex flex-col bg-slate-50">
                    <ResourceCenterView onBack={() => setActiveRightTab(null)} isPaused={isPaused} insights={insights} setInsights={setInsights} />
                  </div>
                )}

                {activeRightTab === 'operation-log' && (
                  <div className="h-full flex flex-col bg-white">
                    <OperationLogPanel onClose={() => setActiveRightTab(null)} />
                  </div>
                )}

                {activeRightTab === 'key-info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: '项目名称', value: '城市基础设施二期项目', icon: FileText },
                        { label: '招标编号', value: 'BID-2023-00892', icon: Fingerprint },
                        { label: '预算金额', value: '¥12,500,000.00', icon: Receipt },
                        { label: '开标时间', value: '2023-12-20 09:30', icon: Calendar },
                        { label: '建设地点', value: '某市高新区核心区', icon: Building2 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="size-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-slate-900">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeRightTab === 'qualification' && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                        <ShieldCheck size={16} />
                        资格要求概览
                      </div>
                      <p className="text-xs text-emerald-600 leading-relaxed">系统已自动识别出 5 项核心资格要求，请确保企业资料库中相关证件在有效期内。</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: '营业执照', status: '已匹配', desc: '具备独立法人资格，营业执照在有效期内。' },
                        { title: '资质等级', status: '已匹配', desc: '具备市政公用工程施工总承包二级及以上资质。' },
                        { title: '安全生产许可证', status: '待核验', desc: '具备有效的安全生产许可证。' },
                        { title: '项目经理资格', status: '已匹配', desc: '拟派项目经理须具备二级及以上注册建造师。' },
                        { title: '财务要求', status: '已匹配', desc: '近三年财务状况良好，无亏损。' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900">{item.title}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              item.status === '已匹配' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>{item.status}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeRightTab === 'material-market' && (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                        <LayoutGrid size={16} />
                        素材市场
                      </div>
                      <p className="text-xs text-amber-600 leading-relaxed">提供丰富的投标素材，包括往期优秀方案、人员简历、企业业绩等，点击可快速复用。</p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { title: '优秀技术方案', count: 12, icon: FileText, color: 'text-blue-500' },
                        { title: '人员简历库', count: 45, icon: User, color: 'text-emerald-500' },
                        { title: '企业业绩库', count: 28, icon: Award, color: 'text-amber-500' },
                        { title: '常见问题答疑', count: 150, icon: MessageSquare, color: 'text-indigo-500' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`size-8 rounded-lg bg-slate-50 flex items-center justify-center ${item.color}`}>
                                <item.icon size={18} />
                              </div>
                              <span className="text-sm font-bold text-slate-900">{item.title}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">{item.count} 条</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">推荐素材</h5>
                      <div className="space-y-3">
                        {[
                          '2023年市政公用工程优秀施工组织设计',
                          '智慧交通系统集成方案模板',
                          '项目经理张工个人业绩汇总',
                        ].map((text, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2">
                            <div className="size-1.5 bg-primary rounded-full"></div>
                            {text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeRightTab === 'disqualification' && (
                  <div className="space-y-6">
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
                        <ShieldAlert size={16} />
                        高风险废标项提醒
                      </div>
                      <p className="text-xs text-rose-600 leading-relaxed">请务必仔细核对以下内容，任何一项不符合都将导致直接废标。</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: '投标保证金', risk: '极高', desc: '未按要求缴纳保证金或金额不足。' },
                        { title: '签字盖章', risk: '极高', desc: '投标文件未按要求签字或加盖公章。' },
                        { title: '报价超限', risk: '极高', desc: '投标报价超过最高投标限价。' },
                        { title: '工期响应', risk: '高', desc: '投标工期超过招标文件规定的最长工期。' },
                        { title: '质量承诺', risk: '高', desc: '质量标准未响应招标文件要求。' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 border-l-4 border-rose-500 bg-slate-50 rounded-r-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{item.title}</span>
                            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">风险: {item.risk}</span>
                          </div>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {activeRightTab !== 'resource-center' && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  <button className="w-full py-3 bg-[#0052CC] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-[#0052CC]/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Download size={18} />
                    导出分析报告
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    <AnimatePresence>
      {showToolModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">启动投标工具</h3>
                <button 
                  onClick={() => setShowToolModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="size-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Monitor size={40} />
                </div>
                
                {isToolInstalled ? (
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">正在打开投标工具...</h4>
                    <p className="text-slate-500">请稍候，系统正在为您调起本地客户端</p>
                    <div className="pt-4">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2 }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">未检测到投标工具</h4>
                    <p className="text-slate-500 text-sm">您尚未安装或启动投标工具客户端，无法直接进行文件制作。建议您下载并安装以获得最佳体验。</p>
                    <div className="flex flex-col gap-3 pt-6">
                      <button 
                        onClick={() => {
                          setIsToolInstalled(true);
                          // In a real app, this would trigger a download
                        }}
                        className="w-full py-3 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                      >
                        立即下载安装包
                      </button>
                      <button 
                        onClick={() => setShowToolModal(false)}
                        className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        稍后再说
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Bell className="text-primary" size={20} />
                  项目提醒事项
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all group">
                      <div className={`size-10 rounded-lg ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
                        <notif.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{notif.text}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          这是系统根据招标文件自动生成的关键节点提醒，请务必在截止日期前完成相关操作。
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* File Viewer Modal */}
      <AnimatePresence>
        {showFileViewer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="w-[98vw] h-[96vh] bg-white shadow-2xl flex flex-col overflow-hidden rounded-lg"
            >
              {/* Top Header with Tabs */}
              <div className="h-12 border-b border-slate-200 flex items-center px-4 bg-white shrink-0">
                <div className="flex gap-4 h-full">
                  {[
                    { id: 'core', label: '核心内容', icon: Info },
                    { id: 'risk', label: '风险分析', icon: AlertTriangle },
                    { id: 'custom', label: '自定义检查项', icon: Search },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveViewerTab(tab.id as any)}
                      className={`px-4 flex items-center gap-2 text-sm font-medium transition-all relative h-full ${
                        activeViewerTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <div className={`size-5 rounded-full flex items-center justify-center ${activeViewerTab === tab.id ? 'bg-primary/10' : 'bg-slate-100'}`}>
                        <tab.icon size={12} />
                      </div>
                      {tab.label}
                      {activeViewerTab === tab.id && (
                        <motion.div layoutId="viewerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <button onClick={() => setShowFileViewer(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden bg-slate-50">
                {/* Left Analysis Panel */}
                <div className="w-[450px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                    <h4 className="font-bold text-slate-900 text-sm">{activeViewerTab === 'risk' ? '风险分析' : activeViewerTab === 'core' ? '核心内容' : '自定义检查项'}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {activeViewerTab === 'risk' ? '风险点分析主要针对招标文件三类条款内容，一是表述不够明确、具体，容易出现歧义纠纷的模糊条款；二是条款之间前后矛盾，或者需要相互配合才能够理解的关联条款；三是违反公平性审查要求的潜在条款。' : '系统自动提取的招标文件关键信息。'}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                    {activeViewerTab === 'risk' && analysisResults.riskAnalysis.map((item, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-white">
                          <span className="text-xs font-bold text-slate-700">{item.title}</span>
                          <ChevronUp size={14} className="text-slate-400" />
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary">
                              <List size={14} /> 原文
                            </div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                              <span className="text-slate-400 mr-2">原文</span>
                              {item.original}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-red-500">
                              <AlertTriangle size={14} /> 风险分析
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed pl-1">{item.analysis}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                              <Edit3 size={14} /> 建议
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed pl-1">{item.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {activeViewerTab === 'core' && (
                      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-sm">
                        {analysisResults.coreContent.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                            <span className="text-xs text-slate-400">{item.label}</span>
                            <span className="text-xs font-bold text-slate-700">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Toolbar */}
                <div className="w-12 border-r border-slate-200 bg-white flex flex-col items-center py-4 gap-4 shrink-0">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors"><List size={20} /></button>
                  <button className="p-2 bg-primary/10 text-primary rounded-lg"><LayoutGrid size={20} /></button>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Monitor size={20} /></button>
                  <button className="p-2 text-orange-400 hover:bg-orange-50 rounded-lg transition-colors"><Edit3 size={20} /></button>
                  <button className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"><Search size={20} /></button>
                </div>

                {/* Right Document Viewer */}
                <div className="flex-1 bg-slate-200 overflow-y-auto p-12 relative">
                  <div className="max-w-4xl mx-auto bg-white shadow-2xl p-20 min-h-[1400px] flex flex-col items-center">
                    <div className="mt-40 space-y-20 text-center">
                      <h1 className="text-6xl font-bold tracking-[0.2em] text-slate-900 leading-tight">黑龙江省建设工程</h1>
                      <h1 className="text-6xl font-bold tracking-[0.2em] text-slate-900 leading-tight">标准施工招标文件</h1>
                    </div>
                    
                    <div className="mt-auto mb-20 w-full max-w-lg space-y-6 text-left">
                      <div className="flex gap-4 text-xl">
                        <span className="font-bold text-slate-900 shrink-0">项目名称：</span>
                        <span className="text-slate-700">克东县 2021 年老旧小区改造建设项目</span>
                      </div>
                      <div className="flex gap-4 text-xl">
                        <span className="font-bold text-slate-900 shrink-0">招标编号：</span>
                        <span className="text-slate-700 font-mono">T2300000001003033</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="h-10 border-t border-slate-200 bg-white flex items-center px-4 shrink-0 text-[11px] text-slate-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>页码:</span>
                    <input type="text" defaultValue="1" className="w-8 h-6 border border-slate-200 rounded text-center" />
                    <span>/ 123</span>
                  </div>
                </div>
                <div className="mx-auto flex items-center gap-2">
                  <button className="p-1 hover:bg-slate-100 rounded"><ChevronUp size={14} className="rotate-180" /></button>
                  <button className="p-1 hover:bg-slate-100 rounded"><ChevronUp size={14} /></button>
                  <button className="p-1 hover:bg-slate-100 rounded"><ChevronDown size={14} /></button>
                  <button className="p-1 hover:bg-slate-100 rounded rotate-180"><ChevronDown size={14} /></button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-slate-100 rounded"><Copy size={14} /></button>
                    <button className="p-1 hover:bg-slate-100 rounded"><LayoutGrid size={14} /></button>
                    <button className="p-1 hover:bg-slate-100 rounded"><Maximize2 size={14} /></button>
                  </div>
                  <div className="h-4 w-px bg-slate-200 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <select className="bg-transparent border-none outline-none">
                      <option>自动缩放</option>
                      <option>100%</option>
                      <option>150%</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {showCollaborativeSharing && (
          <CollaborativeSharingModal onClose={() => setShowCollaborativeSharing(false)} />
        )}
      </AnimatePresence>

      <MarginReceiptUploadModal 
        isOpen={showMarginUploadModal} 
        onClose={() => setShowMarginUploadModal(false)} 
        projectData={projectData}
        isPaused={isPaused}
      />

      <ArchivingManagementModal
        isOpen={showArchivingModal}
        onClose={() => setShowArchivingModal(false)}
        isPaused={isPaused}
        openingRecords={openingRecords}
        setOpeningRecords={setOpeningRecords}
        winningRecords={winningRecords}
        setWinningRecords={setWinningRecords}
        contractRecords={contractRecords}
        setContractRecords={setContractRecords}
        contractAttachments={contractAttachments}
        setContractAttachments={setContractAttachments}
        openingRecordFiles={openingRecordFiles}
        setOpeningRecordFiles={setOpeningRecordFiles}
        tenderFiles={tenderFiles}
        setTenderFiles={setTenderFiles}
        acceptanceReports={acceptanceReports}
        setAcceptanceReports={setAcceptanceReports}
        unsuccessfulReason={unsuccessfulReason}
        setUnsuccessfulReason={setUnsuccessfulReason}
        tenderPersonnel={tenderPersonnel}
        setTenderPersonnel={setTenderPersonnel}
      />

      <ProjectAttachmentsModal
        isOpen={showAttachmentsModal}
        onClose={() => setShowAttachmentsModal(false)}
        uploadedFiles={uploadedFiles}
        tenderFiles={tenderFiles}
        openingRecordFiles={openingRecordFiles}
        contractAttachments={contractAttachments}
        acceptanceReports={acceptanceReports}
      />

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
  </>
);
};

const FileProductionView = ({ onBack, isPaused, onShare }: { onBack: () => void, isPaused: boolean, onShare: () => void }) => (
  <div className={`space-y-8 ${isPaused ? 'opacity-75' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="size-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-primary hover:text-primary transition-all shadow-sm group"
          title="返回"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          投标文件在线制作
        </h3>
      </div>
      <div className="flex gap-3">
        {isPaused && (
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1 mr-2">
            <Ban size={14} /> 此项目已暂停
          </span>
        )}
        <button 
          onClick={() => {
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
            onShare();
          }}
          className={`px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          多人协作
        </button>
        <button 
          onClick={() => {
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
          }}
          className={`px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm hover:shadow-md ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          导出标书
        </button>
      </div>
    </div>
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm h-[600px] flex items-center justify-center text-slate-400">
      <div className="text-center">
        <PenTool size={48} className="mx-auto mb-4 opacity-20" />
        <p>在线编辑器加载中...</p>
      </div>
    </div>
  </div>
);

const InspectionDetailView = ({ onBack, uploadedFiles, isPaused }: { onBack: () => void, uploadedFiles: Record<string, boolean>, isPaused: boolean }) => {
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [useClarification, setUseClarification] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const hasClarification = Object.keys(uploadedFiles || {}).some(key => key.startsWith('clar-doc-') && uploadedFiles[key]);

  const handleStartCheck = (version: any) => {
    if (isPaused) {
      alert('此项目已暂停');
      return;
    }
    setSelectedVersion(version);
    if (hasClarification && !useClarification) {
      setShowClarificationModal(true);
    } else {
      // Proceed with check
      console.log('Starting check for:', version.name, useClarification ? 'with clarification' : 'original');
    }
  };

  return (
    <div className={`space-y-8 ${isPaused ? 'opacity-75' : ''}`}>
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
            标书检查
          </h3>
        </div>
        {isPaused && (
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
            <Ban size={14} /> 此项目已暂停
          </span>
        )}
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
                <span className="text-red-600 font-bold">2026-03-15 17:00</span>
                <span className="bg-red-50 text-red-500 px-1.5 py-0.5 rounded text-[10px] ml-1">剩 3 天</span>
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
          <div 
            onClick={() => {
              if (isPaused) {
                alert('此项目已暂停');
                return;
              }
            }}
            className={`p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-blue-50/50 transition-colors ${isPaused ? 'opacity-60 grayscale-[0.5]' : ''}`}
          >
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
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
              }}
              className={`px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-xs font-medium hover:bg-slate-50 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              + 添加版本
            </button>
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
              }}
              className={`px-3 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 flex items-center gap-1 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
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
                  className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50"
                >
                  开始检查
                </button>
                <button className="p-1 text-slate-400 hover:text-red-600 transition-colors" title="删除"><Trash2 size={18} /></button>
                <ChevronRight className="text-slate-300" size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showClarificationModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowClarificationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileSearch size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">发现最新答疑文件</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  系统检测到该项目已上传最新的答疑/澄清文件。为了确保检查结果的准确性，建议导入最新答疑内容进行比对检查。
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setUseClarification(true);
                      setShowClarificationModal(false);
                      // Proceed with check
                      console.log('Starting check with clarification for:', selectedVersion?.name);
                    }}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> 导入最新答疑文件检查
                  </button>
                  <button
                    onClick={() => {
                      setUseClarification(false);
                      setShowClarificationModal(false);
                      // Proceed with check
                      console.log('Starting check with original for:', selectedVersion?.name);
                    }}
                    className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all"
                  >
                    暂不导入，按原招标文件检查
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

const OperationLogPanel = ({ onClose }: { onClose: () => void }) => {
  const logs = [
    { id: 1, user: '张三', action: '修改了项目基本信息', time: '2024-03-20 14:30:22', type: 'update' },
    { id: 2, user: '李四', action: '上传了投标文件', time: '2024-03-20 11:15:45', type: 'upload' },
    { id: 3, user: '王五', action: '解析了招标文件', time: '2024-03-19 16:40:10', type: 'process' },
    { id: 4, user: '张三', action: '创建了项目', time: '2024-03-18 09:00:00', type: 'create' },
    { id: 5, user: '系统', action: '自动备份完成', time: '2024-03-17 23:59:59', type: 'system' },
    { id: 6, user: '李四', action: '删除了一个附件', time: '2024-03-17 15:20:33', type: 'delete' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">操作日志</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operation Log</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X size={20} className="text-slate-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-8">
          {logs.map((log) => (
            <div key={log.id} className="relative pl-8">
              <div className={`absolute -left-[9px] top-1 size-4 rounded-full border-2 border-white shadow-sm ${
                log.type === 'create' ? 'bg-green-500' :
                log.type === 'update' ? 'bg-blue-500' :
                log.type === 'delete' ? 'bg-red-500' :
                log.type === 'upload' ? 'bg-amber-500' :
                log.type === 'process' ? 'bg-purple-500' : 'bg-slate-400'
              }`} />
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">{log.user}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{log.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CollaborativeSharingModal = ({ onClose }: { onClose: () => void }) => {
  const [modalTab, setModalTab] = useState<'add' | 'manage'>('add');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Record<number, 'view' | 'edit'>>({});
  const [existingCollaborators, setExistingCollaborators] = useState([
    { id: 401, name: '孙七', role: '项目经理', permission: 'edit' },
    { id: 402, name: '周八', role: '技术顾问', permission: 'view' },
  ]);

  const orgData = [
    { id: 1, name: '技术部', children: [
      { id: 101, name: '张三', role: '高级工程师' },
      { id: 102, name: '李四', role: '结构设计师' },
    ]},
    { id: 2, name: '商务部', children: [
      { id: 201, name: '王五', role: '商务经理' },
      { id: 202, name: '赵六', role: '造价师' },
    ]},
    { id: 3, name: '管理层', children: [
      { id: 301, name: '钱七', role: '项目总监' },
    ]},
  ];

  const toggleUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      const newPerms = { ...permissions };
      delete newPerms[userId];
      setPermissions(newPerms);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      setPermissions({ ...permissions, [userId]: 'view' });
    }
  };

  const setPermission = (userId: number, perm: 'view' | 'edit') => {
    setPermissions({ ...permissions, [userId]: perm });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">协作分享</h2>
              <div className="flex gap-4 mt-1">
                <button 
                  onClick={() => setModalTab('add')}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${modalTab === 'add' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  添加成员
                </button>
                <button 
                  onClick={() => setModalTab('manage')}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${modalTab === 'manage' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  管理成员 ({existingCollaborators.length})
                </button>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {modalTab === 'add' ? (
            <>
              {/* Org structure */}
              <div className="w-1/2 border-r border-slate-100 overflow-y-auto p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">组织架构</h3>
                <div className="space-y-4">
                  {orgData.map(dept => (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Building2 size={16} className="text-slate-400" />
                        {dept.name}
                      </div>
                      <div className="pl-6 space-y-1">
                        {dept.children.map(user => (
                          <div 
                            key={user.id}
                            onClick={() => toggleUser(user.id)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                              selectedUsers.includes(user.id) ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50 border-transparent'
                            } border`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                selectedUsers.includes(user.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                                <p className="text-[10px] text-slate-400">{user.role}</p>
                              </div>
                            </div>
                            {selectedUsers.includes(user.id) && <CheckCircle2 size={16} className="text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected users & permissions */}
              <div className="w-1/2 overflow-y-auto p-4 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">已选人员及权限</h3>
                {selectedUsers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">请从左侧选择人员</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedUsers.map(userId => {
                      const user = orgData.flatMap(d => d.children).find(u => u.id === userId);
                      return (
                        <div key={userId} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="size-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                              {user?.name[0]}
                            </div>
                            <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                          </div>
                          <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                              onClick={() => setPermission(userId, 'view')}
                              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                permissions[userId] === 'view' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              查看
                            </button>
                            <button 
                              onClick={() => setPermission(userId, 'edit')}
                              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                permissions[userId] === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              编辑
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">现有协作成员</h3>
              <div className="space-y-3">
                {existingCollaborators.map(user => (
                  <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${user.permission === 'edit' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                        {user.permission === 'edit' ? '可编辑' : '仅查看'}
                      </span>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
            取消
          </button>
          <button 
            onClick={() => {
              // Logic to add collaborators
              onClose();
            }}
            className="px-8 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            确认添加
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ResourceCenterView = ({ onBack, isPaused, insights, setInsights }: { onBack: () => void, isPaused: boolean, insights: any[], setInsights: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [activeMainTab, setActiveMainTab] = useState('recommend'); // 'recommend', 'library', 'insights'
  const [activeTab, setActiveTab] = useState('enterprise'); // 'enterprise', 'license', 'material'
  const [activeFilter, setActiveFilter] = useState('personnel');
  const [activeLicenseFilter, setActiveLicenseFilter] = useState('business_license');
  const [activeMaterialFilter, setActiveMaterialFilter] = useState('tech');
  const [expandedCard, setExpandedCard] = useState<string | null>('li');
  const [innerTab, setInnerTab] = useState('basic');
  const [materialSearch, setMaterialSearch] = useState('');
  
  const [preSelectedIds, setPreSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<any>(null);

  const [newInsight, setNewInsight] = useState('');
  const [newInsightType, setNewInsightType] = useState('task');
  const [newInsightDeadline, setNewInsightDeadline] = useState('');
  const [insightFilter, setInsightFilter] = useState('all');

  const handleAddInsight = () => {
    if (!newInsight.trim()) return;
    const insight = {
      id: Date.now().toString(),
      content: newInsight,
      isPublic: newInsightType !== 'idea',
      author: '我',
      date: new Date().toISOString().split('T')[0],
      type: newInsightType,
      deadline: newInsightType === 'task' ? newInsightDeadline : '',
      status: 'active'
    };
    setInsights([insight, ...insights]);
    setNewInsight('');
    setNewInsightType('task');
    setNewInsightDeadline('');
  };

  const toggleInsightStatus = (id: string) => {
    setInsights(insights.map(i => 
      i.id === id ? { ...i, status: i.status === 'void' ? 'active' : 'void' } : i
    ));
  };

  const togglePreSelect = (id: string) => {
    setPreSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const recommendations = {
    personnel: [
      { 
        id: 'p1', 
        name: '李茂盛', 
        role: '高级结构工程师', 
        reason: '拥有3个同类大跨度公建项目经验', 
        match: 95,
        details: {
          basic: '15年从业经验，国家一级注册结构工程师，曾主导多个地标性建筑结构设计。',
          performance: [
            { title: '上海中心大厦结构顾问', date: '2018-2020' },
            { title: '北京大兴机场航站楼结构设计', date: '2015-2017' }
          ],
          qualifications: ['一级注册结构工程师', '高级工程师职称']
        }
      },
      { 
        id: 'p2', 
        name: '王志远', 
        role: '机电负责人', 
        reason: '擅长超高层机电系统优化', 
        match: 88,
        details: {
          basic: '机电工程专家，精通BIM技术在复杂机电系统中的应用。',
          performance: [
            { title: '深圳平安金融中心机电总监', date: '2019-2021' },
            { title: '广州周大福中心机电优化项目', date: '2017-2018' }
          ],
          qualifications: ['注册机电工程师', 'BIM高级应用师']
        }
      },
    ],
    performance: [
      { id: 'perf1', title: '大都会CBD二期综合体', amount: '1.25亿', reason: '结构体系与本项目高度相似', match: 92 },
      { id: 'perf2', title: '滨江大道景观提升工程', amount: '8900万', reason: '包含类似的软土基坑处理', match: 85 },
    ],
    qualification: [
      { id: 'qual1', title: '建筑工程施工总承包壹级', reason: '本项目必备资质', match: 100, attachment: 'https://picsum.photos/seed/qual1/800/1200' },
      { id: 'qual2', title: '钢结构工程专业承包壹级', reason: '针对大跨度钢结构加分项', match: 100, attachment: 'https://picsum.photos/seed/qual2/800/1200' },
    ]
  };



  return (
    <div className={`flex h-full w-full bg-white ${isPaused ? 'opacity-75' : ''}`}>
      {/* Left Navigation Rail - Redesigned to be lighter and more modern */}
      <div className="w-20 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-8 gap-8 shrink-0">
        {[
          { id: 'recommend', icon: Sparkles, label: '推荐' },
          { id: 'library', icon: Library, label: '库' },
          { id: 'insights', icon: Lightbulb, label: '想法' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMainTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all group ${
              activeMainTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-3 rounded-2xl transition-all ${
              activeMainTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-200 group-hover:border-primary group-hover:text-primary'
            }`}>
              <tab.icon size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
        
        <div className="mt-auto">
          <button 
            onClick={onBack}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {activeMainTab === 'recommend' && '智能推荐资源'}
              {activeMainTab === 'library' && '全局资产全库'}
              {activeMainTab === 'insights' && '我的灵感想法'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">针对当前项目：某高速公路工程施工项目</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* 1. Smart Recommendation */}
          {activeMainTab === 'recommend' && (
            <div className="space-y-10">
              {/* Personnel Recommendations */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      推荐人员
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium ml-2">基于项目规模与技术要求匹配</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveMainTab('library');
                      setActiveTab('enterprise');
                      setActiveFilter('personnel');
                    }}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    查看更多 <ChevronRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {recommendations.personnel.map((p, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all group relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                            {p.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-500">{p.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-primary font-black text-lg leading-none">{p.match}%</div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">匹配度</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100 mb-4">{p.reason}</p>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setDetailItem({ type: 'personnel', ...p })}
                          className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1"
                        >
                          <Eye size={14} /> 查看
                        </button>
                        <button 
                          onClick={() => togglePreSelect(p.id)}
                          className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            preSelectedIds.has(p.id) 
                              ? 'bg-primary/10 border-primary text-primary' 
                              : 'bg-primary text-white border-primary hover:bg-primary/90'
                          }`}
                        >
                          {preSelectedIds.has(p.id) ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                          {preSelectedIds.has(p.id) ? '已预选' : '预选'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance Recommendations */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Trophy size={16} className="text-emerald-500" />
                    推荐业绩
                  </h3>
                  <button 
                    onClick={() => {
                      setActiveMainTab('library');
                      setActiveTab('enterprise');
                      setActiveFilter('performance');
                    }}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    查看更多 <ChevronRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {recommendations.performance.map((p, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-slate-900">{p.title}</div>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">{p.match}% 相似</div>
                      </div>
                      <div className="text-[10px] text-slate-500 mb-3">合同金额：{p.amount}</div>
                      <p className="text-xs text-slate-600 italic mb-4">“{p.reason}”</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setDetailItem({ type: 'performance', ...p })}
                          className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1"
                        >
                          <Eye size={14} /> 查看
                        </button>
                        <button 
                          onClick={() => togglePreSelect(p.id)}
                          className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            preSelectedIds.has(p.id) 
                              ? 'bg-primary/10 border-primary text-primary' 
                              : 'bg-primary text-white border-primary hover:bg-primary/90'
                          }`}
                        >
                          {preSelectedIds.has(p.id) ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                          {preSelectedIds.has(p.id) ? '已预选' : '预选'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Qualification Recommendations */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-500" />
                    推荐资质
                  </h3>
                  <button 
                    onClick={() => {
                      setActiveMainTab('library');
                      setActiveTab('enterprise');
                      setActiveFilter('qualification');
                    }}
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    查看更多 <ChevronRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {recommendations.qualification.map((q, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Receipt size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{q.title}</div>
                          <div className="text-[10px] text-slate-500">{q.reason}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setDetailItem({ type: 'qualification', ...q })}
                          className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1"
                        >
                          <Eye size={14} /> 查看
                        </button>
                        <button 
                          onClick={() => togglePreSelect(q.id)}
                          className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            preSelectedIds.has(q.id) 
                              ? 'bg-primary/10 border-primary text-primary' 
                              : 'bg-primary text-white border-primary hover:bg-primary/90'
                          }`}
                        >
                          {preSelectedIds.has(q.id) ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                          {preSelectedIds.has(q.id) ? '已预选' : '预选'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 2. Asset Library (View All) */}
          {activeMainTab === 'library' && (
            <div className="flex flex-col h-full">
              <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex gap-6 shrink-0">
                {[
                  { id: 'enterprise', label: '企业信息' },
                  { id: 'license', label: '证照库' },
                  { id: 'material', label: '素材库' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm font-bold transition-all ${
                      activeTab === tab.id ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                <div className="w-40 bg-white border-r border-slate-100 py-6 px-4 space-y-2 overflow-y-auto">
                  {activeTab === 'enterprise' && [
                    { id: 'personnel', label: '人员选择' },
                    { id: 'performance', label: '业绩选择' },
                    { id: 'finance', label: '财务报表' },
                    { id: 'qualification', label: '企业资质' }
                  ].map(f => (
                    <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === f.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>{f.label}</button>
                  ))}
                  {activeTab === 'license' && [
                    { id: 'business_license', label: '营业执照' },
                    { id: 'qualification', label: '资质' },
                    { id: 'permit', label: '许可证' },
                    { id: 'honor', label: '荣誉' }
                  ].map(f => (
                    <button key={f.id} onClick={() => setActiveLicenseFilter(f.id)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeLicenseFilter === f.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>{f.label}</button>
                  ))}
                  {activeTab === 'material' && [
                    { id: 'tech', label: '技术素材' },
                    { id: 'business', label: '商务素材' }
                  ].map(f => (
                    <button key={f.id} onClick={() => setActiveMaterialFilter(f.id)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeMaterialFilter === f.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>{f.label}</button>
                  ))}
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto">
                  {activeTab === 'material' && (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3].map(i => {
                        const id = `lib-mat-${i}`;
                        const isPreSelected = preSelectedIds.has(id);
                        return (
                          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              <FileTextIcon size={20} className="text-primary" />
                              <span className="text-sm font-bold text-slate-700">素材文件 {i}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-1 whitespace-nowrap">
                                <Eye size={14} /> 查看
                              </button>
                              <button 
                                onClick={() => togglePreSelect(id)}
                                className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                                  isPreSelected 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-primary text-white border-primary hover:bg-primary/90'
                                }`}
                              >
                                {isPreSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                                {isPreSelected ? '已预选' : '预选'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {activeTab === 'license' && (
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:border-primary transition-all relative">
                          <div className="aspect-video bg-slate-100 relative">
                            <img src={`https://picsum.photos/seed/lic${i}/400/300`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => setDetailItem({ type: 'license', title: `证照名称 ${i}`, attachment: `https://picsum.photos/seed/lic${i}/800/1200` })}
                                className="p-2 bg-white rounded-full text-primary shadow-lg"
                              >
                                <Eye size={20} />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 text-xs font-bold text-slate-700">证照名称 {i}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'enterprise' && activeFilter === 'personnel' && (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => {
                        const id = `lib-p-${i}`;
                        const isPreSelected = preSelectedIds.has(id);
                        const p = {
                          id,
                          name: `人员姓名 ${i}`,
                          role: '专业职称 / 经验年限',
                          details: {
                            basic: `人员姓名 ${i} 的基本背景介绍，拥有丰富的行业经验。`,
                            performance: [{ title: '某大型公建项目', date: '2022' }],
                            qualifications: ['高级工程师']
                          }
                        };
                        return (
                          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">人</div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">{p.name}</div>
                                <div className="text-[10px] text-slate-500">{p.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setDetailItem({ type: 'personnel', ...p })}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-1 whitespace-nowrap"
                              >
                                <Eye size={14} /> 查看
                              </button>
                              <button 
                                onClick={() => togglePreSelect(id)}
                                className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                                  isPreSelected 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-primary text-white border-primary hover:bg-primary/90'
                                }`}
                              >
                                {isPreSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                                {isPreSelected ? '已预选' : '预选'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {activeTab === 'enterprise' && activeFilter === 'performance' && (
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => {
                        const id = `lib-perf-${i}`;
                        const isPreSelected = preSelectedIds.has(id);
                        return (
                          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-primary/30 transition-all group">
                            <div className="text-sm font-bold text-slate-900 mb-2">业绩项目名称 {i}</div>
                            <div className="text-[10px] text-slate-500 mb-4">合同金额：5000万 | 竣工日期：2023-12</div>
                            <div className="flex gap-2 shrink-0 mt-4">
                              <button 
                                onClick={() => setDetailItem({ type: 'performance', id, title: `业绩项目名称 ${i}`, amount: '5000万' })}
                                className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1 whitespace-nowrap"
                              >
                                <Eye size={14} /> 查看
                              </button>
                              <button 
                                onClick={() => togglePreSelect(id)}
                                className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                                  isPreSelected 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-primary text-white border-primary hover:bg-primary/90'
                                }`}
                              >
                                {isPreSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                                {isPreSelected ? '已预选' : '预选'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {activeTab === 'enterprise' && activeFilter === 'qualification' && (
                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3].map(i => {
                        const id = `lib-qual-${i}`;
                        const isPreSelected = preSelectedIds.has(id);
                        return (
                          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="size-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">企业资质证书 {i}</div>
                                <div className="text-[10px] text-slate-400">有效期至：2028-12-31</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setDetailItem({ type: 'qualification', id, title: `企业资质证书 ${i}`, reason: '有效期至：2028-12-31', attachment: `https://picsum.photos/seed/qual${i}/800/1200` })}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-1 whitespace-nowrap"
                              >
                                <Eye size={14} /> 查看
                              </button>
                              <button 
                                onClick={() => togglePreSelect(id)}
                                className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                                  isPreSelected 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-primary text-white border-primary hover:bg-primary/90'
                                }`}
                              >
                                {isPreSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                                {isPreSelected ? '已预选' : '预选'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. My Insights */}
          {activeMainTab === 'insights' && (
            <div className="space-y-8">
              {/* New Insight Input */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <textarea
                  value={newInsight}
                  onChange={(e) => setNewInsight(e.target.value)}
                  placeholder="记录下你对这个项目的想法、灵感或注意事项..."
                  className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
                
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Tag size={14} /> 标签:</span>
                    <select
                      value={newInsightType}
                      onChange={(e) => setNewInsightType(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white text-slate-700 font-medium cursor-pointer"
                    >
                      <option value="task">任务</option>
                      <option value="meeting">会议纪要</option>
                      <option value="idea">想法</option>
                    </select>
                  </div>

                  {newInsightType === 'task' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Calendar size={14} /> 截止时间:</span>
                      <input 
                        type="date" 
                        value={newInsightDeadline}
                        onChange={(e) => setNewInsightDeadline(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    {newInsightType === 'idea' ? (
                      <><Lock size={12} /> 发布后仅自己可见</>
                    ) : (
                      <><Globe size={12} /> 发布后全员可见</>
                    )}
                  </div>
                  <button 
                    onClick={handleAddInsight}
                    className="px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                  >
                    发布
                  </button>
                </div>
              </div>

              {/* Insights List */}
              <div className="space-y-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                  {[
                    { id: 'all', label: '全部' },
                    { id: 'task', label: '任务' },
                    { id: 'meeting', label: '会议纪要' },
                    { id: 'idea', label: '想法' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setInsightFilter(f.id)}
                      className={`pb-3 text-sm font-bold transition-all relative ${
                        insightFilter === f.id 
                          ? 'text-primary' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {f.label}
                      {insightFilter === f.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {insights.filter(i => insightFilter === 'all' || i.type === insightFilter).map(i => (
                  <div key={i.id} className={`bg-white border rounded-2xl p-6 hover:shadow-md transition-all relative group ${i.status === 'void' ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${i.author === '我' ? 'bg-slate-100 text-slate-600' : 'bg-primary/10 text-primary'}`}>
                          {i.author === '我' ? '我' : i.author[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            {i.author !== '我' && <span>{i.author}</span>}
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 ${
                              i.type === 'task' ? 'bg-amber-100 text-amber-700' :
                              i.type === 'meeting' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {i.type === 'task' && <CheckSquare size={10} />}
                              {i.type === 'meeting' && <FileTextIcon size={10} />}
                              {i.type === 'idea' && <Lightbulb size={10} />}
                              {i.type === 'task' ? '任务' : i.type === 'meeting' ? '会议纪要' : '想法'}
                            </span>
                            {i.status === 'void' && (
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[9px] font-bold flex items-center gap-1">
                                <Ban size={10} /> 已作废
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{i.date}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                          {i.author === '我' && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <button 
                                onClick={() => toggleInsightStatus(i.id)}
                                className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                                title={i.status === 'void' ? '恢复' : '作废'}
                              >
                                {i.status === 'void' ? <RefreshCw size={14} /> : <Ban size={14} />}
                              </button>
                              <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                          <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${i.isPublic ? 'text-primary' : 'text-slate-400'}`}>
                            {i.isPublic ? <Globe size={10} /> : <Lock size={10} />}
                            {i.isPublic ? '公开' : '私密'}
                          </div>
                        </div>
                        {i.type === 'task' && i.deadline && (
                          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${i.status === 'void' ? 'text-slate-500 bg-slate-200/50' : 'text-amber-600 bg-amber-50'}`}>
                            <Calendar size={10} /> 截止: {i.deadline}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed mt-2 ${i.status === 'void' ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{i.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

      {/* Detail Modal */}
      <AnimatePresence>
        {detailItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                    {detailItem.name ? detailItem.name[0] : (detailItem.type === 'qualification' || detailItem.type === 'license' ? <ShieldCheck /> : <Trophy />)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{detailItem.name || detailItem.title}</h3>
                    <p className="text-xs text-slate-500">{detailItem.role || detailItem.reason || detailItem.amount}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDetailItem(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {detailItem.type === 'personnel' && (
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">基本信息</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{detailItem.details?.basic}</p>
                    </section>
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">过往业绩</h4>
                      <div className="space-y-3">
                        {detailItem.details?.performance.map((perf: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-800">{perf.title}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{perf.date}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">相关资质</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailItem.details?.qualifications.map((q: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">{q}</span>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {(detailItem.type === 'qualification' || detailItem.type === 'license') && (
                  <div className="space-y-6">
                    <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                      <img src={detailItem.attachment} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Info size={14} />
                        <span className="text-xs font-bold">资质说明</span>
                      </div>
                      <p className="text-[10px] text-indigo-500 leading-relaxed">{detailItem.reason || '该资质已通过平台审核，真实有效。'}</p>
                    </div>
                  </div>
                )}

                {detailItem.type === 'performance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">合同金额</div>
                        <div className="text-lg font-black text-slate-900">{detailItem.amount}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">匹配度</div>
                        <div className="text-lg font-black text-emerald-500">{detailItem.match}%</div>
                      </div>
                    </div>
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">推荐理由</h4>
                      <p className="text-sm text-slate-600 italic">“{detailItem.reason}”</p>
                    </section>
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">项目概况</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">该项目在结构形式、施工工艺及环境条件上与当前项目具有极高的相似性，可作为重点业绩支撑。</p>
                    </section>
                  </div>
                )}
              </div>

              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setDetailItem(null)}
                  className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    togglePreSelect(detailItem.id);
                    setDetailItem(null);
                  }}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg ${
                    preSelectedIds.has(detailItem.id)
                      ? 'bg-primary/10 text-primary border border-primary'
                      : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90'
                  }`}
                >
                  {preSelectedIds.has(detailItem.id) ? '取消预选' : '立即预选'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ArchiveRegisterView = ({ onBack, isPaused }: { onBack: () => void, isPaused: boolean }) => {
  const [openingRecords, setOpeningRecords] = useLocalStorage('workbench_archive_openingRecords', [
    { units: '中铁一局集团有限公司', price: 125608800, rank: '1', isWinner: true, isSelf: true },
    { units: '中建三局集团有限公司', price: 128905000, rank: '2', isWinner: false, isSelf: false },
    { units: '中交第二公路工程局有限公司', price: 131002000, rank: '3', isWinner: false, isSelf: false },
  ]);

  const [contractRecords, setContractRecords] = useLocalStorage('workbench_archive_contractRecords', [
    { id: 'HT-2024-001', name: '某高速公路工程施工合同', date: '2024-03-15', amount: 125608800, owner: '张三', duration: '30', status: '履行中', fulfillmentDate: '2024-03-15', expectedCompletionDate: '2024-04-14' },
  ]);

  const [bidFiles, setBidFiles] = useLocalStorage('workbench_archive_bidFiles', [
    { id: '1', name: '投标文件_技术标.pdf', size: '15.2MB', date: '2024-03-01' },
    { id: '2', name: '投标文件_商务标.pdf', size: '8.5MB', date: '2024-03-01' },
  ]);

  const [openingFiles, setOpeningFiles] = useLocalStorage('workbench_archive_openingFiles', [
    { id: '1', name: '开标记录表.pdf', size: '2.1MB', date: '2024-03-10' },
  ]);

  const [contractAttachments, setContractAttachments] = useLocalStorage('workbench_archive_contractAttachments', [
    { id: '1', name: '施工合同扫描件.pdf', size: '25.6MB', date: '2024-03-20', category: '合同' },
    { id: '2', name: '中标通知书.pdf', size: '1.2MB', date: '2024-03-12', category: '中标通知书' },
  ]);

  const [unsuccessfulReason, setUnsuccessfulReason] = useState('');

  const updateContract = (index: number, field: string, value: any) => {
    const newRecords = [...contractRecords];
    (newRecords[index] as any)[field] = value;
    
    if (field === 'fulfillmentDate' || field === 'duration') {
      const record = newRecords[index];
      const durationVal = parseInt(record.duration as any);
      if (record.fulfillmentDate && !isNaN(durationVal)) {
        const start = new Date(record.fulfillmentDate);
        const end = new Date(start);
        end.setDate(start.getDate() + durationVal);
        record.expectedCompletionDate = end.toISOString().split('T')[0];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Only auto-update status if it's not manually set to 'Terminated'
        if (record.status !== '已终止') {
          if (today < start) {
            record.status = '未开始';
          } else if (today > end) {
            // If it's past the expected completion date and not marked as 'Completed', it's 'Overdue'
            if (record.status !== '已完成') {
              record.status = '逾期';
            }
          } else {
            record.status = '履行中';
          }
        }
      }
    }
    
    setContractRecords(newRecords);
  };

  const deleteContract = (index: number) => {
    const newRecords = [...contractRecords];
    newRecords.splice(index, 1);
    setContractRecords(newRecords);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(val);
  };

  return (
    <div className={`bg-white min-h-screen -m-8 flex flex-col ${isPaused ? 'opacity-75' : ''}`}>
      {/* Header - Exactly matching TenderOpeningStatusManagement */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Archive size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">项目归档登记详情</h3>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-all flex items-center gap-2">
            <Download size={16} />
            导出详情
          </button>
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-10 flex-1 overflow-y-auto pr-4 custom-scrollbar">
          
          {/* Project Info Block */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">关联项目 <span className="text-red-500">*</span></p>
                <p className="text-sm font-bold text-slate-900">某高速公路工程施工项目</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">开标日期 <span className="text-red-500">*</span></p>
                <input 
                  type="date" 
                  defaultValue="2024-03-10" 
                  className="text-sm font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                  disabled={isPaused}
                />
              </div>
            </div>
          </div>

          {/* Tender Registration Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ClipboardCheck size={20} className="text-primary" />
                <h4 className="text-lg">投标登记</h4>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
              {/* Bid Files */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Upload size={16} className="text-slate-400" />
                    投标附件
                  </h5>
                  <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg transition-colors">
                    <Plus size={14} /> 上传附件
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bidFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{file.size} · {file.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="下载"><Download size={16} /></button>
                        <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="删除"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bid Personnel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    参标人员
                  </h5>
                  <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg transition-colors">
                    <Plus size={14} /> 添加人员
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['张三 (项目经理)', '李四 (技术负责人)', '王五 (商务负责人)'].map((person, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-700 hover:border-primary/30 hover:bg-white hover:shadow-md transition-all cursor-default">
                      <div className="size-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[10px]">
                        {person[0]}
                      </div>
                      {person}
                      <button className="text-slate-300 hover:text-red-500 transition-colors ml-1"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Opening & Winning Records Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Trophy size={20} className="text-primary" />
                <h4 className="text-lg">开标与中标记录</h4>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
              {/* Opening Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ClipboardList size={16} className="text-slate-400" />
                    开标详情
                  </h5>
                  <button 
                    onClick={() => setOpeningRecords([...openingRecords, { units: '', price: 0, rank: '', isWinner: false, isSelf: false }])}
                    className="text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
                  >
                    <Plus size={18} /> 添加参标单位
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4">参标单位 <span className="text-red-500">*</span></th>
                        <th className="px-6 py-4">投标报价（元） <span className="text-red-500">*</span></th>
                        <th className="px-6 py-4">排名 <span className="text-red-500">*</span></th>
                        <th className="px-6 py-4 text-center">是否中标 <span className="text-red-500">*</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {openingRecords.map((row, i) => (
                        <tr key={i} className={`hover:bg-slate-50/50 transition-colors ${row.isWinner ? 'bg-emerald-50/30' : ''}`}>
                          <td className="px-6 py-4">
                            <input 
                              value={row.units} 
                              onChange={(e) => {
                                const newRecords = [...openingRecords];
                                newRecords[i].units = e.target.value;
                                setOpeningRecords(newRecords);
                              }}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:border-primary outline-none"
                              placeholder="请输入参标单位"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number"
                              value={row.price} 
                              onChange={(e) => {
                                const newRecords = [...openingRecords];
                                newRecords[i].price = parseFloat(e.target.value) || 0;
                                setOpeningRecords(newRecords);
                              }}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono font-bold text-primary"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              value={row.rank} 
                              onChange={(e) => {
                                const newRecords = [...openingRecords];
                                newRecords[i].rank = e.target.value;
                                setOpeningRecords(newRecords);
                              }}
                              className="w-16 border border-slate-200 rounded px-2 py-1 text-sm"
                              placeholder="排名"
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <input 
                              type="radio"
                              name="isWinner"
                              checked={row.isWinner}
                              onChange={() => {
                                const newRecords = openingRecords.map((r, idx) => ({ ...r, isWinner: idx === i }));
                                setOpeningRecords(newRecords);
                              }}
                              className="size-4 rounded-full border-slate-300 text-primary focus:ring-primary"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Opening Attachments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Paperclip size={16} className="text-slate-400" />
                    开标记录附件
                  </h5>
                  <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg transition-colors">
                    <Plus size={14} /> 上传附件
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {openingFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{file.size} · {file.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="下载"><Download size={16} /></button>
                        <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="删除"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Winning Details */}
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Trophy size={16} className="text-emerald-500" />
                  中标详情
                </h5>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4">中标单位</th>
                        <th className="px-6 py-4">是否本单位 <span className="text-red-500">*</span></th>
                        <th className="px-6 py-4">中标金额（元）</th>
                        <th className="px-6 py-4">通知书日期</th>
                        <th className="px-6 py-4">公示链接</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input 
                            defaultValue="中铁一局集团有限公司"
                            className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-bold text-slate-900"
                            placeholder="请输入中标单位"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:border-primary outline-none">
                            <option value="true">是</option>
                            <option value="false">否</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number"
                            defaultValue="125608800"
                            className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono font-bold text-emerald-600"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input type="date" defaultValue="2024-03-12" className="w-full border border-slate-200 rounded px-2 py-1 text-sm" />
                        </td>
                        <td className="px-6 py-4">
                          <input className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-primary" placeholder="http://..." />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Unsuccessful Bid Reason Analysis - Conditional */}
          {openingRecords.some(r => r.isSelf && !r.isWinner) && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-4">
                <Frown size={20} className="text-primary" />
                <h4 className="text-lg">未中标原因分析</h4>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <textarea 
                  value={unsuccessfulReason}
                  onChange={(e) => setUnsuccessfulReason(e.target.value)}
                  placeholder="请输入未中标原因分析..."
                  className="w-full h-32 border border-slate-200 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-all resize-none shadow-inner bg-slate-50/30 font-medium"
                />
              </div>
            </section>
          )}

          {/* Contract Registration Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Receipt size={20} className="text-primary" />
                <h4 className="text-lg">合同归档</h4>
              </div>
              <button 
                onClick={() => setContractRecords([...contractRecords, { id: '', name: '', date: '', amount: 0, owner: '', duration: '', status: '未开始', fulfillmentDate: '', expectedCompletionDate: '' }])}
                className="text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                <Plus size={18} /> 添加合同
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
              {/* Contract Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ClipboardList size={16} className="text-slate-400" />
                    合同详情
                  </h5>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                        <th className="px-3 py-4 min-w-[220px] whitespace-nowrap">合同编号/名称</th>
                        <th className="px-3 py-4 min-w-[140px] whitespace-nowrap">签署日期</th>
                        <th className="px-3 py-4 min-w-[130px] whitespace-nowrap">合同金额（元）</th>
                        <th className="px-3 py-4 min-w-[100px] whitespace-nowrap">负责人</th>
                        <th className="px-3 py-4 min-w-[80px] whitespace-nowrap">工期（天）</th>
                        <th className="px-3 py-4 min-w-[140px] whitespace-nowrap">履行时间</th>
                        <th className="px-3 py-4 min-w-[140px] whitespace-nowrap">应当完成时间</th>
                        <th className="px-3 py-4 min-w-[110px] whitespace-nowrap">履行状态</th>
                        <th className="px-3 py-4 min-w-[60px] whitespace-nowrap text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contractRecords.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 py-4">
                            <div className="space-y-1">
                              <input 
                                value={row.name} 
                                onChange={(e) => updateContract(i, 'name', e.target.value)}
                                placeholder="合同名称"
                                className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-bold outline-none focus:border-primary"
                              />
                              <input 
                                value={row.id} 
                                onChange={(e) => updateContract(i, 'id', e.target.value)}
                                placeholder="合同编号"
                                className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] outline-none focus:border-primary"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <input 
                              type="date"
                              value={row.date} 
                              onChange={(e) => updateContract(i, 'date', e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                            />
                          </td>
                          <td className="px-3 py-4">
                            <input 
                              type="number"
                              value={row.amount} 
                              onChange={(e) => updateContract(i, 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono font-bold outline-none focus:border-primary"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-3 py-4">
                            <input 
                              value={row.owner} 
                              onChange={(e) => updateContract(i, 'owner', e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                              placeholder="负责人"
                            />
                          </td>
                          <td className="px-3 py-4">
                            <input 
                              type="number"
                              value={row.duration} 
                              onChange={(e) => updateContract(i, 'duration', e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                              placeholder="天数"
                            />
                          </td>
                          <td className="px-3 py-4">
                            <input 
                              type="date"
                              value={row.fulfillmentDate} 
                              onChange={(e) => updateContract(i, 'fulfillmentDate', e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                            />
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-sm text-slate-600">{row.expectedCompletionDate || '--'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <select 
                              value={row.status}
                              onChange={(e) => updateContract(i, 'status', e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] font-bold outline-none focus:border-primary cursor-pointer"
                            >
                              <option value="未开始">未开始</option>
                              <option value="履行中">履行中</option>
                              <option value="已完成">已完成</option>
                              <option value="逾期">逾期</option>
                              <option value="已终止">已终止</option>
                            </select>
                          </td>
                          <td className="px-3 py-4 text-right">
                            <button 
                              onClick={() => deleteContract(i)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="删除合同"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contract Attachments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Paperclip size={16} className="text-slate-400" />
                    合同附件
                  </h5>
                  <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg transition-colors">
                    <Plus size={14} /> 上传附件
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contractAttachments.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded text-[9px] font-bold">{file.category}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">{file.size} · {file.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="下载"><Download size={16} /></button>
                        <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="删除"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100 mt-8 shrink-0 bg-white">
          <button 
            onClick={onBack} 
            className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            取消
          </button>
          <button 
            onClick={onBack} 
            className="px-8 py-2.5 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            保存全部
          </button>
        </div>
      </div>
    </div>
  );
};

const PreparationPhase = ({ 
  onNavigate, 
  onSelect, 
  setActiveRightTab, 
  activeRightTab, 
  initialProjectData, 
  isTenderUploaded, 
  projectData, 
  handleProjectDataChange, 
  uploadedFiles, 
  setUploadedFiles, 
  otherMaterialAttachments,
  setOtherMaterialAttachments,
  isPaused,
  setConfirmDialog
}: { 
  onNavigate: (view: SubView) => void, 
  onSelect: (id: string | null) => void,
  setActiveRightTab: (id: string | null) => void,
  activeRightTab: string | null,
  initialProjectData?: any,
  isTenderUploaded: boolean,
  projectData: any,
  handleProjectDataChange: (field: string, value: string) => void,
  uploadedFiles: Record<string, boolean>,
  setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  otherMaterialAttachments: Record<string, Attachment[]>,
  setOtherMaterialAttachments: React.Dispatch<React.SetStateAction<Record<string, Attachment[]>>>,
  isPaused: boolean,
  setConfirmDialog: (dialog: { message: string, onConfirm: () => void } | null) => void
}) => {
  const [isParsed, setIsParsed] = useState(!!initialProjectData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResultPage, setShowResultPage] = useState(false);
  const [showQualificationResult, setShowQualificationResult] = useState(false);
  const [showParsingPage, setShowParsingPage] = useState(false);
  const [clarificationRounds, setClarificationRounds] = useState<number>(0);
  
  const [activeOtherMaterial, setActiveOtherMaterial] = useState<{ id: string; label: string } | null>(null);
  
  // New states for upload parsing
  const [activeUpload, setActiveUpload] = useState<{ id: string; label: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'uploading' | 'parsing' | 'comparing' | 'done'>('uploading');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [diffData, setDiffData] = useState<{ field: string; label: string; oldVal: string; newVal: string }[]>([]);

  const handleToggleUpload = (id: string) => {
    setUploadedFiles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startUploadFlow = (cat: { id: string; label: string }) => {
    // Just toggle the upload status directly for all documents
    handleToggleUpload(cat.id);
    if (cat.id === 'tender-doc') {
      setUploadedFiles(prev => ({ ...prev, 'tender-doc': true }));
    }
  };

  const applyChanges = () => {
    diffData.forEach(diff => {
      handleProjectDataChange(diff.field, diff.newVal);
    });
    if (activeUpload) {
      handleToggleUpload(activeUpload.id);
      if (activeUpload.id === 'tender-doc') {
        setUploadedFiles(prev => ({ ...prev, 'tender-doc': true }));
      }
    }
    setIsUploading(false);
    setActiveUpload(null);
  };

  const skipChanges = () => {
    if (activeUpload) {
      handleToggleUpload(activeUpload.id);
      if (activeUpload.id === 'tender-doc') {
        setUploadedFiles(prev => ({ ...prev, 'tender-doc': true }));
      }
    }
    setIsUploading(false);
    setActiveUpload(null);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResultPage(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  if (showQualificationResult) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 h-[calc(100vh-300px)] overflow-y-auto">
        <h2 className="text-2xl font-black text-slate-900 mb-6">资格审查结果</h2>
        <div className="p-4 bg-emerald-50 rounded-lg text-emerald-700 font-bold">
          审查通过：符合所有投标资格要求。
        </div>
        <button 
          onClick={() => setShowQualificationResult(false)}
          className="mt-6 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200"
        >
          返回解析结果
        </button>
      </div>
    );
  }

  if (showResultPage) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-2"></div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 h-[calc(100vh-300px)] overflow-y-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">解析报告</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg text-blue-700 font-bold">解析完成，已提取项目基本信息。</div>
          <button 
            onClick={() => setShowQualificationResult(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
          >
            执行投标资格审查
          </button>
        </div>
      </div>
    </div>
  );
}

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] bg-white rounded-xl border border-slate-200 shadow-sm p-12">
        <div className="h-2"></div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">正在解析招标文件，请稍候</h2>
        <p className="text-slate-400 mb-8">预计需要5-10分钟，解析过程中可关闭此页面</p>
        <div className="w-full max-w-2xl bg-slate-100 rounded-full h-4 mb-4">
          <div className="bg-primary h-4 rounded-full transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
        </div>
        <p className="text-slate-600 font-bold">{analysisProgress}%</p>
      </div>
    );
  }

  const baseCategories = [
    { id: 'tender-doc', label: '招标文件', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'tender-list', label: '招标清单', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'tender-price', label: '控制价文件', icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const otherCategories = [
    { id: 'filing', label: '项目备案', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'other', label: '其他信息', icon: Info, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  if (!isParsed) {
    return (
      <div className="flex flex-col gap-6 h-[calc(100vh-450px)] min-h-[600px]">
        <div className="h-2"></div>
        <div className="flex gap-6 flex-1">
          {/* Left: Upload & History */}
          <div className="flex-1 flex flex-col gap-6">
          {/* Upload Area */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center flex-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-24 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud size={48} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">点击或拖拽招标文件至此处上传</h3>
            <p className="text-slate-400 text-sm mb-8">支持 PDF、Word、ZF、CF 格式，AI将自动识别关键信息并填充表单</p>
            
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
                handleStartAnalysis();
              }}
              disabled={isAnalyzing}
              className={`px-10 py-4 bg-primary text-white rounded-full font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 ${isAnalyzing || isPaused ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={24} className="animate-spin" />
                  正在解析中...
                </>
              ) : (
                <>
                  开始解析 <ArrowRight size={24} />
                </>
              )}
            </button>
          </div>

          {/* History Record */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="font-black text-slate-900 flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                历史记录
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">文件名称</th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">解析时间</th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: '城市道路绿化工程招标文件.pdf', time: '2023-11-15 10:30', status: '已完成' },
                    { name: '智慧交通系统集成项目招标文件.docx', time: '2023-11-14 15:45', status: '已完成' },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-primary" />
                          <span className="text-sm font-bold text-slate-700">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-slate-400 font-medium">{item.time}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-tighter">{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity">查看详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Quick Start */}
        <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h4 className="font-black text-slate-900 flex items-center gap-2">
              <Scan size={18} className="text-primary" />
              快速入门
            </h4>
          </div>
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="size-48 bg-blue-50 rounded-full flex items-center justify-center relative z-10">
                <img 
                  src="https://picsum.photos/seed/analysis/400/400" 
                  alt="Analysis Illustration" 
                  className="size-32 object-contain rounded-xl shadow-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-4 -right-4 size-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary z-20 animate-bounce">
                <Search size={32} />
              </div>
            </div>
            <h5 className="text-lg font-black text-slate-900 mb-3">检查完成 查看检查结果</h5>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">解析招标文件后，系统将自动进行深度解析，提取关键信息并识别潜在风险。</p>
            
            <div className="w-full space-y-4 text-left">
              {[
                { label: '核心内容', desc: '自动提取项目名称、编号、预算等' },
                { label: '注意事项', desc: '识别工期、质量、支付等关键条款' },
                { label: '自定义检查', desc: '根据企业标准进行合规性审查' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="size-8 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 mb-0.5">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  if (showParsingPage) {
    return <BidParsing autoImported={isTenderUploaded} uploadedFiles={uploadedFiles} onBack={() => setShowParsingPage(false)} isPaused={isPaused} />;
  }

  return (
    <div className="flex flex-col gap-6 min-h-[600px] relative">
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left: Project Info & Uploads */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-y-auto p-8 shadow-sm space-y-8 custom-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Info size={20} className="text-primary" />
            项目基本信息
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium italic">所有字段均可编辑</span>
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
                // Mock save action
                const btn = document.getElementById('save-btn');
                if (btn) {
                  btn.innerHTML = '<span class="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 已保存</span>';
                  btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
                  btn.classList.remove('bg-white', 'text-primary', 'border-primary/20');
                  
                  setTimeout(() => {
                    btn.innerHTML = '保存修改';
                    btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');
                    btn.classList.add('bg-white', 'text-primary', 'border-primary/20');
                  }, 2000);
                }
              }}
              id="save-btn"
              className={`px-4 py-1.5 bg-white border border-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/5 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              保存修改
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">项目名称</label>
            <input 
              type="text" 
              value={projectData.projectName}
              onChange={(e) => handleProjectDataChange('projectName', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">项目编号</label>
            <input 
              type="text" 
              value={projectData.projectNumber}
              onChange={(e) => handleProjectDataChange('projectNumber', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">开标时间</label>
            <input 
              type="text" 
              value={projectData.openingTime}
              onChange={(e) => handleProjectDataChange('openingTime', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">招标人及联系方式</label>
            <input 
              type="text" 
              value={projectData.tendererAndContact || projectData.tenderer}
              onChange={(e) => handleProjectDataChange('tendererAndContact', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">招标代理及联系方式</label>
            <input 
              type="text" 
              value={projectData.tenderAgentAndContact || projectData.tenderAgent}
              onChange={(e) => handleProjectDataChange('tenderAgentAndContact', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">保证金金额</label>
            <input 
              type="text" 
              value={projectData.depositAmount}
              onChange={(e) => handleProjectDataChange('depositAmount', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">文件领取时间</label>
            <input 
              type="text" 
              value={projectData.collectionTime}
              onChange={(e) => handleProjectDataChange('collectionTime', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">保证金缴纳截止时间</label>
            <input 
              type="text" 
              value={projectData.depositDeadline}
              onChange={(e) => handleProjectDataChange('depositDeadline', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">开标地点</label>
            <input 
              type="text" 
              value={projectData.openingLocation}
              onChange={(e) => handleProjectDataChange('openingLocation', e.target.value)}
              disabled={isPaused}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">招标要求</label>
            <textarea 
              value={projectData.tenderRequirements}
              onChange={(e) => handleProjectDataChange('tenderRequirements', e.target.value)}
              disabled={isPaused}
              rows={4}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-wider">其他备注</label>
            <textarea 
              value={projectData.otherRemarks}
              onChange={(e) => handleProjectDataChange('otherRemarks', e.target.value)}
              disabled={isPaused}
              rows={2}
              className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UploadCloud size={20} className="text-primary" />
                准备阶段文件上传
                <span className="text-sm font-medium text-red-400 ml-1">
                  (请注意，招标和答疑文件上传后无法修改)
                </span>
              </h3>
            </div>
            <button 
              onClick={() => {
                if (isPaused) {
                  alert('此项目已暂停');
                  return;
                }
                
                // Check if the previous round's Q&A document has been uploaded
                if (clarificationRounds > 0) {
                  const prevRoundIndex = clarificationRounds - 1;
                  if (!uploadedFiles[`clar-doc-${prevRoundIndex}`]) {
                    setConfirmDialog({
                      message: '请先上传当前环节的“答疑文件”，再添加下一次答疑环节。',
                      onConfirm: () => {}
                    });
                    return;
                  }
                } else if (!isTenderUploaded) {
                  // Additional check: Must upload tender doc before first Q&A round
                  setConfirmDialog({
                    message: '请先完成“招标文件”的上传，再添加答疑环节。',
                    onConfirm: () => {}
                  });
                  return;
                }
                
                setClarificationRounds(prev => prev + 1);
              }}
              className={`px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-1.5 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus size={14} />
              添加答疑环节
            </button>
          </div>
          
          <div className="space-y-8">
            {/* Base Documents Group */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
                招标基础文件
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {baseCategories.map((cat) => {
                  const isUploaded = uploadedFiles[cat.id] || (cat.id === 'tender-doc' && isTenderUploaded);
                  const isLocked = isUploaded && cat.id === 'tender-doc';
                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => {
                        if (isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        if (isLocked) {
                          alert('招标文件上传后无法修改');
                          return;
                        }
                        if (!isUploaded) {
                          startUploadFlow(cat);
                        } else {
                          handleToggleUpload(cat.id);
                          if (cat.id === 'tender-doc') {
                            setUploadedFiles(prev => ({ ...prev, 'tender-doc': !isTenderUploaded }));
                          }
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all group cursor-pointer ${
                        isUploaded 
                          ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300' 
                          : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-md'
                      } ${isPaused || isLocked ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${
                            isUploaded ? 'bg-blue-100 text-blue-600' : `${cat.bg} ${cat.color}`
                          }`}>
                            {isUploaded ? <CheckCircle2 size={20} /> : <cat.icon size={20} />}
                          </div>
                          <span className="text-sm font-black text-slate-700">{cat.label}</span>
                        </div>
                        {isLocked && <Lock size={14} className="text-slate-300" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-medium ${isUploaded ? 'text-blue-500' : 'text-slate-400'}`}>
                          {isUploaded ? '已上传文件' : '未上传文件'}
                        </span>
                        {!isLocked && (
                          <button className={`text-[10px] font-black hover:underline ${isUploaded ? 'text-blue-600' : 'text-primary'}`}>
                            {isUploaded ? '重新上传' : '点击上传'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clarification Rounds */}
            {Array.from({ length: clarificationRounds }).map((_, index) => (
              <div key={index} className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100 relative group/round">
                <button 
                  onClick={() => {
                    if (isPaused) {
                      alert('此项目已暂停');
                      return;
                    }
                    setClarificationRounds(prev => Math.max(0, prev - 1));
                  }}
                  className={`absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-opacity ${isPaused ? 'cursor-not-allowed' : 'opacity-0 group-hover/round:opacity-100'}`}
                >
                  <Trash2 size={16} />
                </button>
                <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-purple-500 rounded-full"></span>
                  第 {index + 1} 次答疑文件
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: `clar-doc-${index}`, label: '答疑文件', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
                    { id: `clar-list-${index}`, label: '答疑清单', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { id: `clar-price-${index}`, label: '答疑控制价', icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-100' },
                  ].map((cat) => {
                    const isUploaded = uploadedFiles[cat.id];
                    const isLocked = isUploaded && cat.label === '答疑文件';
                    return (
                      <div 
                        key={cat.id} 
                        onClick={() => {
                          if (isPaused) {
                            alert('此项目已暂停');
                            return;
                          }
                          if (isLocked) {
                            alert('答疑文件上传后无法修改');
                            return;
                          }
                          if (!isUploaded) {
                            startUploadFlow(cat);
                          } else {
                            handleToggleUpload(cat.id);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all group cursor-pointer ${
                          isUploaded 
                            ? 'bg-purple-100/50 border-purple-200 hover:border-purple-300' 
                            : 'bg-white border-purple-100/50 hover:border-purple-300 hover:shadow-md'
                        } ${isPaused || isLocked ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${
                              isUploaded ? 'bg-purple-200 text-purple-700' : `${cat.bg} ${cat.color}`
                            }`}>
                              {isUploaded ? <CheckCircle2 size={20} /> : <cat.icon size={20} />}
                            </div>
                            <span className="text-sm font-black text-slate-700">{cat.label}</span>
                          </div>
                          {isLocked && <Lock size={14} className="text-slate-300" />}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-medium ${isUploaded ? 'text-purple-600' : 'text-slate-400'}`}>
                            {isUploaded ? '已上传文件' : '未上传文件'}
                          </span>
                          {!isLocked && (
                            <button className={`text-[10px] font-black hover:underline ${isUploaded ? 'text-purple-600' : 'text-primary'}`}>
                              {isUploaded ? '重新上传' : '点击上传'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Other Documents */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-3 bg-slate-400 rounded-full"></span>
                其他材料
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {otherCategories.map((cat) => {
                  const attachments = otherMaterialAttachments[cat.id] || [];
                  const isUploaded = attachments.length > 0;
                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => {
                        if (isPaused) {
                          alert('此项目已暂停');
                          return;
                        }
                        setActiveOtherMaterial(cat);
                      }}
                      className={`p-4 rounded-2xl border transition-all group cursor-pointer ${
                        isUploaded 
                          ? 'bg-slate-100/50 border-slate-200 hover:border-slate-300' 
                          : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-md'
                      } ${isPaused ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${
                          isUploaded ? 'bg-slate-200 text-slate-600' : `${cat.bg} ${cat.color}`
                        }`}>
                          {isUploaded ? <FileCheck size={20} /> : <cat.icon size={20} />}
                        </div>
                        <span className="text-sm font-black text-slate-700">{cat.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-medium ${isUploaded ? 'text-slate-600' : 'text-slate-400'}`}>
                          {isUploaded ? `已上传 ${attachments.length} 份文件` : '未上传文件'}
                        </span>
                        <button className={`text-[10px] font-black hover:underline ${isUploaded ? 'text-slate-700' : 'text-primary'}`}>
                          {isUploaded ? '查看/管理' : '点击上传'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <OtherMaterialsModal 
          isOpen={!!activeOtherMaterial}
          onClose={() => setActiveOtherMaterial(null)}
          category={activeOtherMaterial}
          attachments={activeOtherMaterial ? (otherMaterialAttachments[activeOtherMaterial.id] || []) : []}
          onAdd={(file) => {
            if (activeOtherMaterial) {
              setOtherMaterialAttachments(prev => ({
                ...prev,
                [activeOtherMaterial.id]: [...(prev[activeOtherMaterial.id] || []), file]
              }));
            }
          }}
          onDelete={(id) => {
            if (activeOtherMaterial) {
              setOtherMaterialAttachments(prev => ({
                ...prev,
                [activeOtherMaterial.id]: prev[activeOtherMaterial.id].filter(a => a.id !== id)
              }));
            }
          }}
          isPaused={isPaused}
        />
      </div>

      {/* Upload & Parsing Modal */}
      <AnimatePresence>
        {isUploading && activeUpload && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => {
                if (uploadStep === 'comparing') setIsUploading(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-50 px-8 py-6 border-bottom border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {uploadStep === 'uploading' && '正在上传文件...'}
                      {uploadStep === 'parsing' && 'AI 正在解析文件...'}
                      {uploadStep === 'comparing' && '解析结果对比'}
                    </h3>
                    <p className="text-slate-500 text-sm">{activeUpload.label}</p>
                  </div>
                </div>
                {uploadStep === 'comparing' && (
                  <button 
                    onClick={() => setIsUploading(false)}
                    className="size-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                {(uploadStep === 'uploading' || uploadStep === 'parsing') && (
                  <div className="space-y-8 py-4">
                    <div className="flex justify-between text-sm font-black text-slate-700 mb-2">
                      <span>{uploadStep === 'uploading' ? '上传进度' : 'AI 解析进度'}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm bg-blue-50 p-4 rounded-xl">
                      <RefreshCw size={16} className="animate-spin text-primary" />
                      <span>
                        {uploadStep === 'uploading' ? '正在安全传输文件到服务器...' : 'AI 正在提取项目关键信息，请稍候...'}
                      </span>
                    </div>
                  </div>
                )}

                {uploadStep === 'comparing' && (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="text-sm font-black text-amber-900">检测到项目信息变动</h4>
                        <p className="text-xs text-amber-700 leading-relaxed mt-1">
                          解析出的文件内容与当前项目信息存在差异。请核对以下变动，并选择是否更新项目数据。
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-bottom border-slate-100">
                            <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider text-[10px]">信息项</th>
                            <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider text-[10px]">当前值</th>
                            <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider text-[10px]">解析值</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {diffData.map((diff, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 font-bold text-slate-700">{diff.label}</td>
                              <td className="px-4 py-4 text-slate-500 line-through decoration-slate-300">{diff.oldVal || '未填写'}</td>
                              <td className="px-4 py-4 font-black text-blue-600 bg-blue-50/30">{diff.newVal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={applyChanges}
                        className="flex-1 py-4 bg-[#0052CC] text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Check size={20} /> 确认并替换更新
                      </button>
                      <button 
                        onClick={skipChanges}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                      >
                        维持现状
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Right Sidebar */}
      <div className="w-80 flex flex-col gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl -ml-8 -mb-8 transition-transform group-hover:scale-150"></div>
          
          <div className="relative z-10">
            <div className="size-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 shadow-inner">
              <FileSearch size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-black mb-2">一键解析招标文件</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              快速解析招标文件，系统将自动识别并关联至当前项目，方便后续查阅与管理。
            </p>
            <button 
              onClick={() => setShowParsingPage(true)}
              className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              进入解析页面 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

const ProductionPhase = ({ onNavigate, onSelect, isPaused }: { onNavigate: () => void, onSelect: (id: string | null) => void, isPaused: boolean }) => {
  return (
    <div className="space-y-8 min-h-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div 
        onMouseEnter={() => onSelect('file-production')}
        onMouseLeave={() => onSelect(null)}
        onClick={onNavigate}
        className="bg-white border border-slate-200 rounded-xl p-8 text-slate-900 hover:bg-primary hover:text-white shadow-sm hover:shadow-xl hover:shadow-primary/20 group hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-white/10 group-hover:text-white backdrop-blur-sm w-fit mb-6 transition-colors">
            <FileText size={24} />
          </div>
          <h4 className="text-xl font-bold mb-3">文件制作</h4>
          <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">跳转至在线编辑器，进行投标文件正文编写，支持多人协同实时编辑。</p>
          <button 
            onClick={() => {
              if (isPaused) {
                alert('此项目已暂停');
                return;
              }
              onNavigate();
            }}
            className={`w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            立即开始 <ArrowRight size={16} />
          </button>
        </div>
      </div>
      {[
        { id: 'ai-bid', title: 'AI编标', desc: '利用AI大模型技术自动生成资信、技术等投标文件内容，提升编写效率。', icon: BrainCircuit, btn: '智能生成', color: 'bg-blue-50 text-blue-600' },
        { id: 'material-market', title: '素材市场', desc: '提供丰富的标书素材模板，支持一键引用，快速构建高质量投标文件。', icon: LayoutGrid, btn: '浏览素材', color: 'bg-slate-50 text-slate-600' },
        { id: 'bid-rewrite', title: '标书改写', desc: '智能优化标书语言表达，增强逻辑性与结构性，使内容更符合评委习惯。', icon: Languages, btn: '优化建议', color: 'bg-slate-50 text-slate-600' },
      ].map((card, i) => (
        <div 
          key={i} 
          onMouseEnter={() => card.id !== 'bid-check' && onSelect(card.id)}
          onMouseLeave={() => onSelect(null)}
          className="bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300"
        >
          <div className={`p-3 rounded-lg w-fit mb-6 ${card.color} group-hover:bg-white/10 group-hover:text-white transition-colors`}>
            <card.icon size={24} />
          </div>
          <h4 className="text-xl font-bold mb-3">{card.title}</h4>
          <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">{card.desc}</p>
          <button 
            onClick={() => {
              if (isPaused) {
                alert('此项目已暂停');
                return;
              }
              if (card.id === 'ai-bid') {
                window.open('https://bqpoint.com/AIbianbiao/dist/index.html', '_blank');
              } else {
                onNavigate();
              }
            }}
            className={`mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {card.btn}
          </button>
        </div>
      ))}
    </div>
  </div>
  );
};

const InspectionPhase = ({ onUploadMargin, onSelect, isPaused }: { onUploadMargin: () => void, onSelect: (id: string | null) => void, isPaused: boolean }) => (
  <div className="space-y-8 min-h-[600px]">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
      <div className="bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300">
        <div className="p-3 rounded-lg w-fit mb-6 bg-emerald-50 text-emerald-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <Receipt size={24} />
        </div>
        <h4 className="text-xl font-bold mb-3">保证金回执上传</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">上传保证金缴纳回执，确保投标资格有效性。</p>
        <button 
          onClick={() => {
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
            onUploadMargin();
          }}
          className={`mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          立即上传
        </button>
      </div>

      <div 
        onMouseEnter={() => onSelect('bid-inspection')}
        onMouseLeave={() => onSelect(null)}
        onClick={() => {
          if (!isPaused) {
            window.open('https://biaoshujiancha.graybruce.cn', '_blank');
          }
        }}
        className="bg-white border border-slate-200 rounded-xl p-8 text-slate-900 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 group hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-white/10 group-hover:text-white backdrop-blur-sm transition-colors">
            <FileText size={24} />
          </div>
        </div>
        <h4 className="text-xl font-bold mb-3">标书检查</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">系统将自动扫描标书完整性、雷同性及格式规范，确保投标文件的有效性，降低废标风险。</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (isPaused) {
                alert('此项目已暂停');
                return;
              }
              window.open('https://biaoshujiancha.graybruce.cn', '_blank');
            }}
            className={`mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            开始检查 <ArrowRight size={16} />
          </button>
      </div>

      <div 
        onClick={() => {
          if (!isPaused) {
            window.open('https://newbidui.graybruce.cn/', '_blank');
          }
        }}
        className="bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300"
      >
        <div className="p-3 rounded-lg w-fit mb-6 bg-indigo-50 text-indigo-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <Layers size={24} />
        </div>
        <h4 className="text-xl font-bold mb-3">多版本比对</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">支持对不同版本的标书进行快速比对，自动识别差异内容，提高审核效率。</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
            window.open('https://newbidui.graybruce.cn/', '_blank');
          }}
          className={`mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          开始比对
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300">
        <div className="p-3 rounded-lg w-fit mb-6 bg-slate-50 text-slate-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <Copy size={24} />
        </div>
        <h4 className="text-xl font-bold mb-3">标书查重</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">对标书内容进行深度查重分析，自动识别重复段落，有效降低废标风险。</p>
        <button 
          onClick={() => {
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
          }}
          className={`mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          开始检测
        </button>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300">
        <div className="p-3 rounded-lg w-fit mb-6 bg-slate-50 text-slate-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <Users size={24} />
        </div>
        <h4 className="text-xl font-bold mb-3">模拟开标</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">模拟线上开标流程，提前熟悉系统操作，进行数字证书（CA）验证及加解密测试，确保正式开标顺利进行。</p>
        <button 
          onClick={() => {
            if (isPaused) {
              alert('此项目已暂停');
              return;
            }
          }}
          className={`mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          进入模拟
        </button>
      </div>
    </div>
  </div>
);

const ArchivingPhase = ({ onOpenArchiving, onOpenAttachments, isPaused }: { onOpenArchiving: () => void, onOpenAttachments: () => void, isPaused: boolean }) => (
  <div className="space-y-8 min-h-[600px]">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
      <div 
        onClick={() => !isPaused && onOpenArchiving()}
        className={`bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300 ${isPaused ? 'opacity-70 grayscale' : ''}`}
      >
        <div className="p-3 rounded-lg w-fit mb-6 bg-blue-50 text-blue-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <ClipboardList size={24} />
        </div>
        <h4 className="text-xl font-bold mb-3">投标/开标记录管理</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">管理项目的开标详情、中标状态及合同归档信息。</p>
        <button 
          className="mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all"
        >
          查看/修改
        </button>
      </div>

      <div 
        onClick={() => !isPaused && onOpenAttachments()}
        className={`bg-white border border-slate-200 rounded-xl p-8 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all group cursor-pointer flex flex-col hover:-translate-y-1 duration-300 ${isPaused ? 'opacity-70 grayscale' : ''}`}
      >
        <div className="p-3 rounded-lg w-fit mb-6 bg-indigo-50 text-indigo-600 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <FileCheck size={24} />
        </div>
        <h4 className="text-xl font-bold mb-3">项目附件信息归档</h4>
        <p className="text-slate-400 group-hover:text-blue-100 text-sm mb-10 leading-relaxed min-h-[4.5rem] transition-colors">集中查看并归档项目过程中的所有核心附件资料。</p>
        <button 
          className="mt-auto w-full py-3.5 bg-white border border-slate-200 text-slate-700 group-hover:border-transparent group-hover:text-primary font-bold rounded-lg hover:bg-blue-50 transition-all"
        >
          所有附件归档
        </button>
      </div>
    </div>
  </div>
);

const ArchivingManagement = React.forwardRef(({ 
  isPaused, 
  openingRecords, 
  setOpeningRecords, 
  winningRecords, 
  setWinningRecords,
  contractRecords,
  setContractRecords,
  contractAttachments,
  setContractAttachments,
  openingRecordFiles,
  setOpeningRecordFiles,
  tenderFiles,
  setTenderFiles,
  acceptanceReports,
  setAcceptanceReports,
  unsuccessfulReason,
  setUnsuccessfulReason,
  tenderPersonnel,
  setTenderPersonnel,
  projectData,
  onBack,
  isEditing,
  setIsEditing
}: any, ref) => {
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  React.useImperativeHandle(ref, () => ({
    handleSave: () => {
      handleSave();
    },
    handleExport: () => {
      handleExport();
    }
  }));

  const departments = React.useMemo(() => {
    const depts = new Set<string>();
    allUsers.forEach(u => {
      if (u.dept) depts.add(u.dept);
      else if (u.department) depts.add(u.department);
    });
    const list = Array.from(depts);
    return list.length > 0 ? list : ['工程部', '商务部', '财务部', '综合部', '技术部'];
  }, [allUsers]);

  useEffect(() => {
    if (departments.length > 0 && !selectedDept) {
      setSelectedDept(departments[0]);
    }
  }, [departments, selectedDept]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      setAllUsers(users);
    }
  }, []);

  const handleSave = () => {
    setHasAttemptedSave(true);
    // Validate opening records
    let hasSelf = false;
    for (let i = 0; i < openingRecords.length; i++) {
      const record = openingRecords[i];
      if (!record.units || record.price === '' || record.price === null || record.price === undefined || !record.rank) {
        alert('请填写所有必填项');
        return;
      }
      if (record.isSelf) {
        hasSelf = true;
      }
    }

    if (!hasSelf && openingRecords.length > 0) {
      alert('请选择本单位');
      return;
    }

    setIsEditing(false);
    setHasAttemptedSave(false);
    alert('保存并更新成功！');
  };

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const updateOpening = (index: number, field: string, value: any) => {
    const newRecords = [...openingRecords];
    (newRecords[index] as any)[field] = value;
    
    // If marking as winner, unmark others (assuming single winner)
    if (field === 'isWinner' && value === true) {
      newRecords.forEach((r, i) => {
        if (i !== index) r.isWinner = false;
      });
      // Sync to winning records
      setWinningRecords([{
        unit: newRecords[index].units,
        amount: newRecords[index].price,
        date: winningRecords[0]?.date || '',
        url: winningRecords[0]?.url || ''
      }]);
    } else if (field === 'isWinner' && value === false) {
      // If unmarking the winner, clear winning records
      setWinningRecords([]);
    } else if (field === 'isSelf' && value === true) {
      // If marking as self, unmark others
      newRecords.forEach((r, i) => {
        if (i !== index) r.isSelf = false;
      });
    } else if (newRecords[index].isWinner && (field === 'units' || field === 'price')) {
      // If updating the name or price of the current winner, sync to winning records
      setWinningRecords([{
        unit: newRecords[index].units,
        amount: newRecords[index].price,
        date: winningRecords[0]?.date || '',
        url: winningRecords[0]?.url || ''
      }]);
    }
    
    setOpeningRecords(newRecords);
  };

  const updateWinning = (index: number, field: string, value: any) => {
    const newRecords = [...winningRecords];
    (newRecords[index] as any)[field] = value;
    setWinningRecords(newRecords);
  };

  const updateContract = (index: number, field: string, value: any) => {
    const newRecords = [...contractRecords];
    (newRecords[index] as any)[field] = value;
    
    if (field === 'fulfillmentDate' || field === 'duration') {
      const record = newRecords[index];
      const durationVal = parseInt(record.duration as any);
      if (record.fulfillmentDate && !isNaN(durationVal)) {
        const start = new Date(record.fulfillmentDate);
        const end = new Date(start);
        end.setDate(start.getDate() + durationVal);
        record.expectedCompletionDate = end.toISOString().split('T')[0];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Only auto-update status if it's not manually set to 'Terminated'
        if (record.status !== '已终止') {
          if (today < start) {
            record.status = '未开始';
          } else if (today > end) {
            // If it's past the expected completion date and not marked as 'Completed', it's 'Overdue'
            if (record.status !== '已完成') {
              record.status = '逾期';
            }
          } else {
            record.status = '履行中';
          }
        }
      }
    }
    
    setContractRecords(newRecords);
  };

  const deleteContract = (index: number) => {
    const newRecords = [...contractRecords];
    newRecords.splice(index, 1);
    setContractRecords(newRecords);
  };

  const handleExport = () => {
    const data = {
      opening: openingRecords,
      winning: winningRecords,
      contract: contractRecords,
      attachments: contractAttachments
    };
    console.log('Exporting data:', data);
    alert('详情数据已准备好导出（包含附件列表，模拟导出成功）');
  };

  return (
    <>
      <div className="space-y-10">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">关联项目 <span className="text-red-500">*</span></p>
            <p className="text-sm font-bold text-slate-900">{projectData?.name || '未知项目'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">开标日期 <span className="text-red-500">*</span></p>
            <p className="text-sm font-bold text-slate-900">{projectData?.openingDate || '未知日期'}</p>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ClipboardList size={20} className="text-primary" />
            <h4 className="text-lg">投标登记</h4>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
        {/* Tender Documents Section - Moved here to match Tender Management layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Upload size={16} className="text-primary" />
              投标文件
            </h5>
            {isEditing && (
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,image/*"
                  disabled={isPaused}
                  className={`absolute inset-0 opacity-0 cursor-pointer ${isPaused ? 'cursor-not-allowed' : ''}`}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const newAttachments: Attachment[] = Array.from(files).map((file, idx) => {
                        const f = file as File;
                        return {
                          id: Date.now() + idx + '',
                          name: f.name,
                          size: (f.size / 1024 / 1024).toFixed(1) + 'MB',
                          type: f.type.includes('pdf') ? 'pdf' : 'image',
                          date: new Date().toISOString().split('T')[0],
                          category: '投标文件'
                        };
                      });
                      setTenderFiles([...tenderFiles, ...newAttachments]);
                    }
                  }}
                />
                <button className={`text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg transition-colors ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Plus size={14} /> 批量上传
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenderFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <File size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{file.size} · {file.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setPreviewImage('https://picsum.photos/seed/tender/800/1200')}
                    className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" 
                    title="预览"
                  >
                    <Eye size={16} />
                  </button>
                  <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="下载">
                    <Download size={16} />
                  </button>
                  {isEditing && (
                    <button 
                      onClick={() => setTenderFiles(tenderFiles.filter(f => f.id !== file.id))}
                      disabled={isPaused}
                      className={`p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ${isPaused ? 'cursor-not-allowed' : ''}`}
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {tenderFiles.length === 0 && (
              <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                <Paperclip size={32} className="text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 font-medium">暂无投标文件</p>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="relative">
              <input 
                type="file" 
                multiple 
                accept=".pdf,image/*"
                disabled={isPaused}
                className={`absolute inset-0 opacity-0 cursor-pointer ${isPaused ? 'cursor-not-allowed' : ''}`}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newAttachments: Attachment[] = Array.from(files).map((file, idx) => {
                      const f = file as File;
                      return {
                        id: Date.now() + idx + '',
                        name: f.name,
                        size: (f.size / 1024 / 1024).toFixed(1) + 'MB',
                        type: f.type.includes('pdf') ? 'pdf' : 'image',
                        date: new Date().toISOString().split('T')[0],
                        category: '投标文件'
                      };
                    });
                    setTenderFiles([...tenderFiles, ...newAttachments]);
                  }
                }}
              />
              <button className={`w-full py-4 bg-primary/5 border border-primary/20 rounded-2xl text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm group ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 点击上传投标文件
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-8">
          <div className="flex items-center justify-between pb-4">
            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Users size={16} className="text-primary" />
              参与人员
            </h5>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {tenderPersonnel.length > 0 ? (
                  tenderPersonnel.map((person, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={person} 
                      className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 hover:bg-white hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="size-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {person.charAt(0)}
                      </div>
                      <span className="text-xs font-bold">{person}</span>
                      {isEditing && (
                        <button 
                          onClick={() => setTenderPersonnel(tenderPersonnel.filter(p => p !== person))}
                          className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">暂未选择投标人员</span>
                )}
              </div>
              
              {isEditing && (
                <div className="relative">
                  <button 
                    onClick={() => setShowPersonnelDropdown(!showPersonnelDropdown)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      showPersonnelDropdown 
                        ? 'bg-primary text-white shadow-primary/20' 
                        : 'bg-white border border-slate-200 text-primary hover:bg-primary/5'
                    }`}
                  >
                    <Plus size={14} className={`transition-transform ${showPersonnelDropdown ? 'rotate-45' : ''}`} />
                    {showPersonnelDropdown ? '关闭选择' : '添加人员'}
                  </button>

                  <AnimatePresence>
                    {showPersonnelDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-[60]" 
                          onClick={() => setShowPersonnelDropdown(false)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-[480px] h-[420px] bg-white rounded-3xl border border-slate-200 shadow-2xl z-[70] flex flex-col overflow-hidden"
                        >
                          <div className="flex-1 flex overflow-hidden">
                            <div className="w-28 border-r border-slate-100 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                              <div className="p-2 space-y-1">
                                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">部门</p>
                                {departments.map(dept => (
                                  <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`w-full px-3 py-2.5 text-left text-[11px] font-bold transition-all rounded-xl flex items-center justify-between group ${
                                      selectedDept === dept 
                                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                        : 'text-slate-500 hover:bg-white hover:text-primary'
                                    }`}
                                  >
                                    <span className="truncate">{dept}</span>
                                    <ChevronRight size={12} className={`shrink-0 transition-transform ${selectedDept === dept ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
                              <div className="space-y-1">
                                <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {selectedDept} - 人员
                                </p>
                                {allUsers
                                  .filter(u => {
                                    const isAlreadySelected = tenderPersonnel.includes(u.name);
                                    if (isAlreadySelected) return false;
                                    const matchesDept = selectedDept ? (u.dept === selectedDept || u.department === selectedDept) : true;
                                    return matchesDept;
                                  })
                                  .map(user => (
                                    <motion.div 
                                      layout
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      key={user.id}
                                      onClick={() => {
                                        setTenderPersonnel([...tenderPersonnel, user.name]);
                                      }}
                                      className="px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between group transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                                          {user.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                                            {user.name}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-medium">{user.position || '职员'}</span>
                                        </div>
                                      </div>
                                      <div className="size-5 rounded-full border-2 border-slate-200 flex items-center justify-center transition-all group-hover:border-primary group-hover:bg-primary/10">
                                        <Plus size={12} className="text-slate-300 group-hover:text-primary" />
                                      </div>
                                    </motion.div>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                          
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">已选 {tenderPersonnel.length} 人</span>
                            <button 
                              onClick={() => setShowPersonnelDropdown(false)}
                              className="px-4 py-1.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm"
                            >
                              完成
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Opening & Winning Records Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Trophy size={20} className="text-primary" />
            <h4 className="text-lg">开标与中标记录</h4>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <ClipboardList size={16} className="text-slate-400" />
              开标详情
            </h5>
            {isEditing && (
              <button 
                onClick={() => setOpeningRecords([...openingRecords, { units: '', price: 0, rank: '', isWinner: false, isSelf: false }])}
                disabled={isPaused}
                className={`text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Plus size={18} /> 添加参标单位
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">参标单位 <span className="text-red-500">*</span></th>
                  <th className="px-6 py-4">投标报价（元） <span className="text-red-500">*</span></th>
                  <th className="px-6 py-4">排名 <span className="text-red-500">*</span></th>
                  <th className="px-6 py-4 text-center">是否中标 <span className="text-red-500">*</span></th>
                  <th className="px-6 py-4 text-center">是否本单位 <span className="text-red-500">*</span></th>
                  {isEditing && <th className="px-6 py-4 text-center whitespace-nowrap">操作</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {openingRecords.map((row, i) => (
                  <tr key={i} className={`hover:bg-slate-50/50 transition-colors ${row.isWinner ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          value={row.units} 
                          onChange={(e) => updateOpening(i, 'units', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border rounded px-2 py-1 text-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''} ${hasAttemptedSave && !row.units ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                      ) : (
                        <span className={`text-sm font-bold ${row.isWinner ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {row.units || '--'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          type="number"
                          value={row.price} 
                          onChange={(e) => updateOpening(i, 'price', parseFloat(e.target.value) || 0)}
                          disabled={isPaused}
                          className={`w-full border rounded px-2 py-1 text-sm font-mono ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''} ${hasAttemptedSave && (row.price === '' || row.price === null || row.price === undefined) ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                      ) : (
                        <span className="font-mono text-sm text-primary font-bold">{formatCurrency(row.price)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          value={row.rank} 
                          onChange={(e) => updateOpening(i, 'rank', e.target.value)}
                          disabled={isPaused}
                          className={`w-16 border rounded px-2 py-1 text-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''} ${hasAttemptedSave && !row.rank ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.rank === '1' ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                          {row.rank ? `第${row.rank}名` : '--'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <input 
                          type="radio"
                          name={`isWinner-${i}`}
                          checked={row.isWinner}
                          onChange={() => updateOpening(i, 'isWinner', true)}
                          disabled={isPaused}
                          className={`size-4 cursor-pointer ${isPaused ? 'cursor-not-allowed' : ''}`}
                        />
                      ) : (
                        row.isWinner && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold">中标单位</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className={`relative flex items-center justify-center p-1 rounded ${hasAttemptedSave && !openingRecords.some(r => r.isSelf) ? 'bg-red-50 ring-1 ring-red-500' : ''}`}>
                          <input 
                            type="radio"
                            name="isSelf"
                            checked={row.isSelf || false}
                            onChange={() => updateOpening(i, 'isSelf', true)}
                            disabled={isPaused}
                            className={`size-4 rounded-full border-slate-300 text-primary focus:ring-primary ${isPaused ? 'cursor-not-allowed' : ''}`}
                          />
                        </div>
                      ) : (
                        row.isSelf && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold">本单位</span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setOpeningRecords(openingRecords.filter((_, idx) => idx !== i))}
                          disabled={isPaused}
                          className={`p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${isPaused ? 'cursor-not-allowed opacity-50' : ''}`}
                          title="删除参标单位"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isEditing && (
            <div className="flex justify-end mt-2">
              {/* Button moved to header */}
            </div>
          )}
        </div>

        {/* Opening Record Attachments Section - New Feature */}
        <div className="space-y-4 border-t border-slate-100 pt-8">
          <div className="flex items-center justify-between pb-4">
            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Paperclip size={16} className="text-slate-400" />
              开标记录附件
            </h5>
            {isEditing && (
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,image/*"
                  disabled={isPaused}
                  className={`absolute inset-0 opacity-0 ${isPaused ? 'cursor-not-allowed' : 'cursor-pointer'} z-10`} 
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const newAttachments: Attachment[] = Array.from(files).map((file, idx) => {
                        const f = file as File;
                        return {
                          id: Date.now() + idx + '',
                          name: f.name,
                          size: (f.size / 1024 / 1024).toFixed(1) + 'MB',
                          type: f.type.includes('pdf') ? 'pdf' : 'image',
                          date: new Date().toISOString().split('T')[0],
                          category: '开标记录'
                        };
                      });
                      setOpeningRecordFiles([...openingRecordFiles, ...newAttachments]);
                    }
                  }}
                />
                <button 
                  disabled={isPaused}
                  className={`text-sm font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-xl transition-colors ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Plus size={16} /> 上传附件
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openingRecordFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 group hover:border-primary/20 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-50 rounded-lg flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{file.name}</span>
                    <span className="text-xs text-slate-400 font-medium">{file.size} · {file.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="预览"><Eye size={16} /></button>
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="下载"><Download size={16} /></button>
                  {isEditing && (
                    <button 
                      onClick={() => setOpeningRecordFiles(openingRecordFiles.filter(f => f.id !== file.id))}
                      disabled={isPaused}
                      className={`p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {openingRecordFiles.length === 0 && (
              <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                <Paperclip size={32} className="text-slate-200 mb-2" />
                <p className="text-sm text-slate-400 font-medium">暂无开标记录附件</p>
              </div>
            )}
          </div>
        </div>

        {/* Winning Records Section */}
        <div className="space-y-4 border-t border-slate-100 pt-8">
          <div className="flex items-center gap-6">
            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Trophy size={16} className="text-emerald-500" />
              中标详情
            </h5>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">中标单位</th>
                  <th className="px-6 py-4">中标金额（元）</th>
                  <th className="px-6 py-4">通知书日期</th>
                  <th className="px-6 py-4">公示链接</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {winningRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                          <input 
                            value={row.unit} 
                            readOnly
                            className="w-full border border-slate-200 rounded px-2 py-1 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                            placeholder="自动获取中标单位"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{row.unit || '--'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          type="number"
                          value={row.amount} 
                          readOnly
                          className="w-full border border-slate-200 rounded px-2 py-1 text-sm bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                          placeholder="0.00"
                        />
                      ) : (
                        <span className="font-mono text-sm text-green-600 font-bold">{formatCurrency(row.amount)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          type="date"
                          value={row.date} 
                          onChange={(e) => updateWinning(i, 'date', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-sm ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{row.date || '--'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          value={row.url} 
                          onChange={(e) => updateWinning(i, 'url', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-xs text-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          placeholder="http://..."
                        />
                      ) : (
                        <a href={row.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                          查看公示 <ArrowRight size={12} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Unsuccessful Bid Reason Analysis - Conditional */}
        {winningRecords.length > 0 && !openingRecords.find(r => r.isSelf)?.isWinner && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-4">
              <Frown size={20} className="text-primary" />
              <h4 className="text-lg">未中标原因分析</h4>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              {isEditing ? (
                <textarea 
                  value={unsuccessfulReason}
                  onChange={(e) => setUnsuccessfulReason(e.target.value)}
                  disabled={isPaused}
                  placeholder="请输入未中标原因分析..."
                  className={`w-full h-32 border border-slate-200 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-all resize-none shadow-inner bg-slate-50/30 ${isPaused ? 'cursor-not-allowed' : ''}`}
                />
              ) : (
                <div className="flex gap-4">
                  <div className="size-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <Frown size={20} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pt-2">
                    {unsuccessfulReason || '暂无分析内容'}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contract Archiving Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Receipt size={20} className="text-primary" />
              <h4 className="text-lg">合同归档</h4>
            </div>
            {isEditing && (
              <button 
                onClick={() => setContractRecords([...contractRecords, { id: '', name: '', date: '', amount: 0, owner: '', duration: '', status: '未开始', fulfillmentDate: '', expectedCompletionDate: '' }])}
                disabled={isPaused}
                className={`text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Plus size={18} /> 添加合同
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-3 py-3 min-w-[220px] whitespace-nowrap">合同编号/名称</th>
                  <th className="px-3 py-3 min-w-[140px] whitespace-nowrap">签署日期</th>
                  <th className="px-3 py-3 min-w-[130px] whitespace-nowrap">合同金额（元）</th>
                  <th className="px-3 py-3 min-w-[100px] whitespace-nowrap">负责人</th>
                  <th className="px-3 py-3 min-w-[80px] whitespace-nowrap">工期（天）</th>
                  <th className="px-3 py-3 min-w-[140px] whitespace-nowrap">履行时间</th>
                  <th className="px-3 py-3 min-w-[140px] whitespace-nowrap">应当完成时间</th>
                  <th className="px-3 py-3 min-w-[110px] whitespace-nowrap">履行状态</th>
                  {isEditing && <th className="px-3 py-3 min-w-[60px] whitespace-nowrap text-center">操作</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contractRecords.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input 
                            value={row.name} 
                            onChange={(e) => updateContract(i, 'name', e.target.value)}
                            disabled={isPaused}
                            placeholder="合同名称"
                            className={`w-full border border-slate-200 rounded px-2 py-1 text-sm font-bold outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          />
                          <input 
                            value={row.id} 
                            onChange={(e) => updateContract(i, 'id', e.target.value)}
                            disabled={isPaused}
                            placeholder="合同编号"
                            className={`w-full border border-slate-200 rounded px-2 py-1 text-[10px] outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-slate-900">{row.name || '--'}</p>
                          <p className="text-[10px] text-slate-400">{row.id || '--'}</p>
                        </>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          type="date"
                          value={row.date} 
                          onChange={(e) => updateContract(i, 'date', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{row.date || '--'}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          type="number"
                          value={row.amount} 
                          onChange={(e) => updateContract(i, 'amount', parseFloat(e.target.value) || 0)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono font-bold outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          placeholder="0.00"
                        />
                      ) : (
                        <span className="font-mono text-sm text-slate-900 font-bold">{formatCurrency(row.amount)}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          value={row.owner} 
                          onChange={(e) => updateContract(i, 'owner', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          placeholder="负责人"
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{row.owner || '--'}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          type="number"
                          value={row.duration} 
                          onChange={(e) => updateContract(i, 'duration', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          placeholder="天数"
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{row.duration ? `${row.duration}天` : '--'}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <input 
                          type="date"
                          value={row.fulfillmentDate} 
                          onChange={(e) => updateContract(i, 'fulfillmentDate', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{row.fulfillmentDate || '--'}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{row.expectedCompletionDate || '--'}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {isEditing ? (
                        <select 
                          value={row.status}
                          onChange={(e) => updateContract(i, 'status', e.target.value)}
                          disabled={isPaused}
                          className={`w-full border border-slate-200 rounded px-2 py-1 text-[10px] font-bold outline-none focus:border-primary cursor-pointer ${isPaused ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                        >
                          <option value="未开始">未开始</option>
                          <option value="履行中">履行中</option>
                          <option value="已完成">已完成</option>
                          <option value="逾期">逾期</option>
                          <option value="已终止">已终止</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          row.status === '已完成' ? 'bg-emerald-50 text-emerald-600' :
                          row.status === '履行中' ? 'bg-blue-50 text-blue-600' :
                          row.status === '逾期' ? 'bg-red-50 text-red-600' :
                          row.status === '已终止' ? 'bg-slate-100 text-slate-500' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {row.status}
                        </span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-3 py-3 text-center">
                        <button 
                          onClick={() => deleteContract(i)}
                          disabled={isPaused}
                          className={`p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${isPaused ? 'cursor-not-allowed opacity-50' : ''}`}
                          title="删除合同"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contract Attachments Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Paperclip size={20} className="text-primary" />
              <h4 className="text-lg">合同附件</h4>
            </div>
          </div>

          {(['中标通知书', '合同', '其他材料'] as const).map((category) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h5 className="text-sm font-bold text-slate-700">{category}</h5>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({contractAttachments.filter(a => a.category === category).length})
                  </span>
                </div>
                {isEditing && (
                  <div className="relative">
                    <input 
                      type="file" 
                      multiple 
                      accept=".pdf,image/*"
                      disabled={isPaused}
                      className={`absolute inset-0 opacity-0 cursor-pointer ${isPaused ? 'cursor-not-allowed' : ''}`}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const newAttachments: Attachment[] = Array.from(files).map((file, idx) => {
                            const f = file as File;
                            return {
                              id: Date.now() + idx + '',
                              name: f.name,
                              size: (f.size / 1024 / 1024).toFixed(1) + 'MB',
                              type: f.type.includes('pdf') ? 'pdf' : 'image',
                              date: new Date().toISOString().split('T')[0],
                              category: category
                            };
                          });
                          setContractAttachments([...contractAttachments, ...newAttachments]);
                        }
                      }}
                    />
                    <button className={`px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-[10px] font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 border border-primary/20 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload size={12} /> 上传文件
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contractAttachments
                  .filter(a => a.category === category)
                  .map((file) => (
                    <div 
                      key={file.id} 
                      className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                          file.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                        }`}>
                          {file.type === 'pdf' ? <File size={16} /> : <ImageIcon size={16} />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 truncate" title={file.name}>{file.name}</p>
                          <p className="text-[9px] text-slate-400 flex items-center gap-2">
                            <span>{file.size}</span>
                            <span className="size-0.5 bg-slate-200 rounded-full" />
                            <span>{file.date}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => setPreviewImage('https://picsum.photos/seed/contract/800/1200')}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                          title="预览"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all" title="下载">
                          <Download size={14} />
                        </button>
                        {isEditing && (
                          <button 
                            onClick={() => setContractAttachments(contractAttachments.filter(a => a.id !== file.id))}
                            disabled={isPaused}
                            className={`p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${isPaused ? 'cursor-not-allowed' : ''}`}
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                {contractAttachments.filter(a => a.category === category).length === 0 && (
                  <div className="col-span-full py-6 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                    <p className="text-[10px] text-slate-400 italic">暂无{category}附件</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={previewImage} 
                alt="Attachment Preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X size={32} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

interface Reply { id: string; author: string; content: string; time: string; }
interface Annotation { id: string; author: string; role: string; time: string; content: string; replies: Reply[]; location: string; }

const AnnotationView = ({ onBack, isPaused }: { onBack: () => void, isPaused: boolean }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: '1', author: '张工', role: '技术专家', time: '10:30', content: '此技术参数需进一步核实，GB/T 标准可能有更新版本，需确认是否适用最新标准。', replies: [], location: 'marker-1' },
    { id: '2', author: '李经理', role: '商务总监', time: '昨天', content: '30天的交付周期对于目前的供应链情况来说极具挑战，建议在答疑环节申请延长至45天。', replies: [], location: 'marker-2' },
  ]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [newAnnotation, setNewAnnotation] = useState('');

  const handleAddReply = (annotationId: string) => {
    if (!replyText[annotationId]?.trim()) return;
    setAnnotations(prev => prev.map(ann => ann.id === annotationId ? {
      ...ann,
      replies: [...ann.replies, { id: Date.now().toString(), author: '我', content: replyText[annotationId], time: '刚刚' }]
    } : ann));
    setReplyText(prev => ({ ...prev, [annotationId]: '' }));
  };

  const scrollToMarker = (location: string) => {
    const element = document.getElementById(location);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={`h-[calc(100vh-200px)] flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${isPaused ? 'opacity-75' : ''}`}>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="size-8 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <PenTool size={18} className="text-primary" />
            在线批注模式
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={14} /> 导出批注
          </button>
          <button className="px-3 py-1.5 bg-[#0052CC] text-white rounded-xl text-xs font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Share2 size={14} /> 协作分享
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-12 bg-slate-100/50 shadow-inner">
          <div className="max-w-4xl mx-auto bg-white shadow-2xl p-20 min-h-[1500px] relative border border-slate-200">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            
            <div className="space-y-12 text-slate-800 leading-relaxed text-lg">
              <section>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3">第一章 招标公告</h3>
                <p>1.1 项目概况：本项目主要包含城市道路绿化、照明系统升级及智慧交通设施建设。</p>
              </section>

              <section className="relative">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3">第二章 投标人须知</h3>
                <div className="relative group" id="marker-1">
                  <p className="bg-blue-50 border-l-4 border-blue-500 pl-6 py-4 rounded-r-lg shadow-sm">
                    <span className="font-bold text-blue-700 block mb-1">2.1 技术参数要求：</span>
                    本项目涉及的所有智慧交通感应设备必须符合国家 GB/T 12345-2023 标准。
                  </p>
                  <div 
                    onClick={() => {
                      const el = document.getElementById('annotation-1');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 size-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-xl border-4 border-white cursor-pointer hover:scale-125 transition-all animate-pulse"
                  >
                    1
                  </div>
                </div>
              </section>

              <section className="relative">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 border-b-2 border-slate-100 pb-3">第三章 商务条款</h3>
                <div className="relative group" id="marker-2">
                  <p className="bg-orange-50 border-l-4 border-orange-500 pl-6 py-4 rounded-r-lg shadow-sm">
                    <span className="font-bold text-orange-700 block mb-1">3.1 交付周期：</span>
                    中标人须在合同签订后 30 个日历天内完成所有设备的交付与安装调试。
                  </p>
                  <div 
                    onClick={() => {
                      const el = document.getElementById('annotation-2');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 size-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-xl border-4 border-white cursor-pointer hover:scale-125 transition-all animate-pulse"
                  >
                    2
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="w-80 border-l border-slate-100 bg-white flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h4 className="font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <PenTool size={16} className="text-primary" />
                批注列表
              </span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">{annotations.length} 条记录</span>
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {annotations.map(ann => (
              <div 
                key={ann.id} 
                id={`annotation-${ann.id}`}
                className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/30" 
                onClick={() => scrollToMarker(ann.location)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{ann.author[0]}</div>
                    <span className="text-[10px] font-black text-slate-900">{ann.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{ann.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">{ann.content}</p>
                {ann.replies.map(reply => (
                  <div key={reply.id} className="ml-4 mt-2 pl-3 border-l-2 border-slate-200 text-[10px] text-slate-500">
                    <p className="font-bold text-slate-700">{reply.author}: {reply.content}</p>
                  </div>
                ))}
                <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="text" 
                    placeholder="回复..." 
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] outline-none focus:ring-1 focus:ring-primary/20"
                    value={replyText[ann.id] || ''}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [ann.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddReply(ann.id);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button onClick={(e) => { e.stopPropagation(); handleAddReply(ann.id); }} className="px-2 py-1 bg-primary text-white rounded text-[10px] font-bold">回复</button>
                  <button onClick={(e) => { e.stopPropagation(); setAnnotations(prev => prev.filter(a => a.id !== ann.id)); }} className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-[10px] font-bold hover:bg-rose-100">删除</button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100">
              <input 
                type="text" 
                placeholder="添加新批注..." 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20"
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newAnnotation.trim()) {
                    e.preventDefault();
                    e.stopPropagation();
                    setAnnotations(prev => [...prev, { id: Date.now().toString(), author: '我', role: '用户', time: '刚刚', content: newAnnotation, replies: [], location: 'marker-1' }]);
                    setNewAnnotation('');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KeyInfoView = ({ onBack, isPaused }: { onBack: () => void, isPaused: boolean }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${isPaused ? 'opacity-75' : ''}`}>
    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="size-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-xl font-bold text-slate-900">关键信息提取</h3>
      </div>
      {isPaused && (
        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
          <Ban size={14} /> 此项目已暂停
        </span>
      )}
    </div>
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <BrainCircuit size={20} />
              AI 智能提取结果
            </h4>
            <div className="space-y-4">
              {[
                { label: '项目名称', value: '城市基础设施二期项目', icon: FileText },
                { label: '招标编号', value: 'BID-2023-00892', icon: Fingerprint },
                { label: '预算金额', value: '¥12,500,000.00', icon: Receipt },
                { label: '开标时间', value: '2023-12-20 09:30', icon: Calendar },
                { label: '建设地点', value: '某市高新区核心区', icon: Building2 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-indigo-50 shadow-sm">
                  <div className="size-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4">原文对照</h4>
            <div className="bg-white p-6 rounded-xl border border-slate-100 text-sm text-slate-500 leading-relaxed h-[400px] overflow-y-auto">
              <p className="mb-4 font-bold text-slate-800">第一章 招标公告</p>
              <p className="mb-4 underline decoration-indigo-300 decoration-2 underline-offset-4 bg-indigo-50/50">1. 项目名称：城市基础设施二期项目</p>
              <p className="mb-4 underline decoration-indigo-300 decoration-2 underline-offset-4 bg-indigo-50/50">2. 招标编号：BID-2023-00892</p>
              <p className="mb-4 underline decoration-indigo-300 decoration-2 underline-offset-4 bg-indigo-50/50">3. 预算金额：人民币壹仟贰佰伍拾万元整（¥12,500,000.00）</p>
              <p className="mb-4 underline decoration-indigo-300 decoration-2 underline-offset-4 bg-indigo-50/50">4. 开标时间：2023-12-20 09:30</p>
              <p>...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const QualificationView = ({ onBack, isPaused }: { onBack: () => void, isPaused: boolean }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${isPaused ? 'opacity-75' : ''}`}>
    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="size-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-xl font-bold text-slate-900">资格审查详情</h3>
      </div>
      {isPaused && (
        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
          <Ban size={14} /> 此项目已暂停
        </span>
      )}
    </div>
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: '营业执照', status: '已匹配', desc: '具备独立法人资格，营业执照在有效期内。', match: '企业资料库-营业执照.pdf' },
              { title: '资质等级', status: '已匹配', desc: '具备市政公用工程施工总承包二级及以上资质。', match: '企业资料库-市政二级资质.pdf' },
              { title: '安全生产许可证', status: '待核验', desc: '具备有效的安全生产许可证。', match: '未找到匹配文件' },
              { title: '项目经理资格', status: '已匹配', desc: '拟派项目经理须具备二级及以上注册建造师。', match: '人员库-王工-二级建造师.pdf' },
              { title: '财务要求', status: '已匹配', desc: '近三年财务状况良好，无亏损。', match: '财务库-2022审计报告.pdf' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-slate-900">{item.title}</h5>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === '已匹配' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>{item.status}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 p-3 rounded-lg">
                  <FileText size={14} />
                  匹配依据：{item.match}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} />
              审查总结
            </h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">通过项</span>
                <span className="text-2xl font-black text-emerald-400">4/5</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[80%]"></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                目前尚缺“安全生产许可证”的匹配依据，请尽快从企业资料库中同步或手动上传。
              </p>
              <button 
                onClick={() => {
                  if (isPaused) {
                    alert('此项目已暂停');
                    return;
                  }
                }}
                className={`w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                同步资料库
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RiskView = ({ onBack, isPaused }: { onBack: () => void, isPaused: boolean }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${isPaused ? 'opacity-75' : ''}`}>
    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="size-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-slate-600">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-xl font-bold text-slate-900">风险预警报告</h3>
      </div>
      {isPaused && (
        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
          <Ban size={14} /> 此项目已暂停
        </span>
      )}
    </div>
    <div className="p-8">
      <div className="space-y-8">
        {[
          { title: '重大废标风险', level: '高', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', content: '招标文件第2.1.5条要求提供“近五年同类项目业绩”，且单项合同额不低于1000万。我司目前仅有一项符合要求的业绩，若该业绩被评委质疑，将面临废标风险。' },
          { title: '合同条款风险', level: '中', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', content: '合同第5.2条约定的违约金比例为每日0.5%，高于行业惯例（通常为0.05%-0.1%）。建议在答疑环节提出修改建议，或在成本核算中预留风险金。' },
          { title: '技术参数歧义', level: '低', icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', content: '技术规格书第12页关于“感应器灵敏度”的描述存在歧义，未明确具体数值范围。需通过答疑澄清。' },
        ].map((risk, i) => (
          <div key={i} className={`${risk.bg} ${risk.border} border rounded-2xl p-8`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-xl bg-white flex items-center justify-center ${risk.color} shadow-sm`}>
                  <risk.icon size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{risk.title}</h4>
                  <span className={`text-xs font-black uppercase tracking-widest ${risk.color}`}>风险等级：{risk.level}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (isPaused) {
                    alert('此项目已暂停');
                    return;
                  }
                }}
                className={`px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                生成答疑函
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">{risk.content}</p>
            <div className="mt-6 pt-6 border-t border-slate-200/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">批注</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="添加批注..." 
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Logic to save comment would go here
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MarginReceiptUploadModal = ({ isOpen, onClose, projectData, isPaused }: { isOpen: boolean, onClose: () => void, projectData: any, isPaused: boolean }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <Wallet size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">保证金回执上传</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MarginReceiptUpload onBack={onClose} isPaused={isPaused} projectData={projectData} />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProjectAttachmentsModal = ({ 
  isOpen, 
  onClose, 
  uploadedFiles, 
  tenderFiles, 
  openingRecordFiles, 
  contractAttachments,
  acceptanceReports
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  uploadedFiles: Record<string, boolean>,
  tenderFiles: Attachment[],
  openingRecordFiles: Attachment[],
  contractAttachments: Attachment[],
  acceptanceReports: Attachment[]
}) => {
  const categories = [
    { 
      label: '招标文件', 
      icon: <FileText size={20} />, 
      files: (uploadedFiles['tender-doc'] || true) ? [
        { name: 'XX高速公路施工招标文件.pdf', size: '12.5MB', date: '2024-03-01' }
      ] : [] 
    },
    { 
      label: '答疑文件', 
      icon: <FileSearch size={20} />, 
      files: Object.keys(uploadedFiles).filter(k => k.startsWith('clar-doc-')).length > 0 ? [
        { name: '项目答疑纪要及补遗文件(一).pdf', size: '2.4MB', date: '2024-03-08' }
      ] : []
    },
    { label: '投标文件', icon: <Paperclip size={20} />, files: tenderFiles },
    { label: '开标记录', icon: <FileCheck size={20} />, files: openingRecordFiles },
    { 
      label: '中标通知书', 
      icon: <Award size={20} />, 
      files: contractAttachments.filter(a => a.category === '中标通知书') 
    },
    { 
      label: '合同', 
      icon: <History size={20} />, 
      files: contractAttachments.filter(a => a.category === '合同') 
    },
    { label: '竣工报告', icon: <ClipboardCheck size={20} />, files: acceptanceReports },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[850px] max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <FileCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">项目全周期附件归档</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="space-y-4 relative">
                      <div className="flex items-center gap-3 pb-2 border-b border-slate-100 relative bg-white">
                        <div>
                          <h4 className="font-bold text-slate-900 leading-none">{idx + 1}、{cat.label}</h4>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {cat.files.length > 0 ? (
                          cat.files.map((file: any, fidx: number) => (
                            <div key={fidx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                              <div className="flex items-center gap-3">
                                <div className="size-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                  <FileText size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{file.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono italic">{file.size} • {file.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="查看">
                                  <Eye size={16} />
                                </button>
                                <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors" title="下载">
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
                            <Frown size={32} className="text-slate-200" />
                            <p className="text-sm text-slate-300 font-medium">未上传附件</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button 
                  onClick={() => {
                    alert('正在准备导出所有附件资料...');
                  }}
                  className="px-10 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-blue-200 flex items-center gap-2"
                >
                  <Download size={16} />
                  一键导出归档
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ArchivingManagementModal = ({ isOpen, onClose, ...props }: any) => {
  const [isEditing, setIsEditing] = useState(true);
  const archivingRef = React.useRef<any>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[1300px] max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <ClipboardList size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">投标/开标情况管理详情</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (props.isPaused) {
                        alert('此项目已暂停');
                        return;
                      }
                      archivingRef.current?.handleExport();
                    }}
                    className={`px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-all flex items-center gap-2 ${props.isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Download size={16} />
                    导出详情
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col overflow-hidden">
                <div className="space-y-10 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <ArchivingManagement 
                    {...props} 
                    ref={archivingRef}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onBack={onClose} 
                  />
                  <div className="flex gap-4 pt-8 shrink-0 bg-white">
                    <button 
                      onClick={() => archivingRef.current?.handleSave()}
                      className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                    >
                      修改保存
                    </button>
                    <button 
                      onClick={onClose}
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
  );
};

const OtherMaterialsModal = ({ 
  isOpen, 
  onClose, 
  category, 
  attachments, 
  onAdd, 
  onDelete,
  isPaused
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  category: any, 
  attachments: Attachment[], 
  onAdd: (file: Attachment) => void,
  onDelete: (id: string) => void,
  isPaused: boolean
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    if (isPaused) return;
    setIsUploading(true);
    setTimeout(() => {
      const newFile: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: `补充材料_${new Date().getTime()}.pdf`,
        size: '1.5MB',
        type: 'pdf',
        date: new Date().toISOString().split('T')[0],
      };
      onAdd(newFile);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-[800px] max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-100">
                    <FolderOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{category?.label} - 附件管理</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{category?.label} Attachments Management</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="flex flex-col gap-6">
                  {/* Upload Dropzone */}
                  {!isPaused && (
                    <div 
                      onClick={handleUpload}
                      className={`h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw size={40} className="text-primary animate-spin" />
                          <p className="text-sm font-bold text-primary">正在上传中...</p>
                        </>
                      ) : (
                        <>
                          <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-primary transition-all">
                            <Upload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-700">点击或拖拽文件到这里上传</p>
                            <p className="text-[10px] text-slate-400 mt-1">支持多份文件，PDF、Word、图片等格式</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Files List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      已上传文件 ({attachments.length})
                    </h4>
                    {attachments.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {attachments.map((file) => (
                          <div key={file.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                              <div className="size-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <FileText size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{file.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono italic">{file.size} • {file.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="查看">
                                <Eye size={16} />
                              </button>
                              {!isPaused && (
                                <button 
                                  onClick={() => onDelete(file.id)}
                                  className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" 
                                  title="删除"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                        <Frown size={40} className="text-slate-200" />
                        <p className="text-sm text-slate-300 font-medium font-black italic">暂无上传材料</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Workbench;
