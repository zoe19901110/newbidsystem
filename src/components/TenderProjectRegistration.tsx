import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Briefcase, 
  Calendar, 
  User, 
  DollarSign,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Building2,
  FileText,
  Tag,
  X,
  Loader2,
  Edit,
  ExternalLink,
  ChevronDown,
  Ban,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';
import { useTableResizer } from '../hooks/useTableResizer';

interface TenderProjectRegistrationProps {
  onEnterWorkbench?: (stage: string, data?: any) => void;
  currentEnterprise?: { id: string; name: string };
  projects: any[];
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
}

const TenderProjectRegistration: React.FC<TenderProjectRegistrationProps> = ({ 
  onEnterWorkbench, 
  currentEnterprise,
  projects,
  setProjects
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isTenderUploaded, setIsTenderUploaded] = useState(false);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const handleFileUpload = (file: File) => {
    setIsAnalyzing(true);
    
    // Check if it's a ZF or CF file
    const fileName = file.name.toLowerCase();
    const isSpecialFormat = fileName.endsWith('.zf') || fileName.endsWith('.cf');

    // Simulate AI Analysis
    setTimeout(() => {
      setAnalyzedData({
        projectName: '2026年智慧交通管理平台建设项目',
        projectNumber: 'T2026-ZHJT-001',
        tenderer: 'XX市交通运输局',
        tendererContact: '010-88888888',
        tenderAgent: 'XX招标代理有限公司',
        tenderAgentContact: '010-66666666',
        openingTime: '2026-01-15 09:30',
        depositDeadline: '2026-01-12 17:00',
        openingLocation: 'XX市公共资源交易中心 301 会议室',
        depositAmount: '¥ 500,000.00',
        collectionTime: '2025-12-25',
        tenderRequirements: '1. 资质要求：具备市政公用工程施工总承包一级及以上资质；\n2. 业绩要求：近三年内具有类似智慧交通项目业绩；\n3. 技术要求：支持国产化适配。',
        otherRemarks: ''
      });
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      setIsTenderUploaded(isSpecialFormat); // Only auto-fill if ZF or CF
    }, 2500);
  };

  const handleDataChange = (field: keyof typeof analyzedData, value: string) => {
    setAnalyzedData({ ...analyzedData, [field]: value });
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(false);
      setIsTenderUploaded(false);
      setIsEditing(false);
      setEditingId(null);
      setHasAttemptedSave(false);
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
  const [statusFilter, setStatusFilter] = useState('全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    statusFilter: '全部',
    startDate: '',
    endDate: ''
  });

  const { widths, onMouseDown } = useTableResizer([
    250,    // 项目名称
    150,    // 项目编号
    150,    // 招标人
    150,    // 招标代理
    180,    // 开标时间
    100,    // 状态
    180     // 操作
  ]);

  const handleEditProject = (project: any) => {
    setIsEditing(true);
    setEditingId(project.id);
    setHasAttemptedSave(false);
    setAnalyzedData({
      projectName: project.name,
      projectNumber: project.code,
      tenderer: project.tenderer,
      tendererContact: project.tendererContact || '',
      tenderAgent: project.agent,
      tenderAgentContact: project.agentContact || '',
      openingTime: project.bidOpeningTime.replace(' ', 'T'),
      depositDeadline: (project.depositDeadline || '').replace(' ', 'T'),
      openingLocation: project.openingLocation || '',
      depositAmount: project.deposit,
      collectionTime: project.collectionTime,
      tenderRequirements: project.requirements,
      otherRemarks: project.otherRemarks || ''
    });
    setIsAnalyzed(true);
    setShowAddModal(true);
  };

  const handleGiveUpProject = (id: string) => {
    setConfirmDialog({
      message: '请再次确认是否作废？',
      onConfirm: async () => {
        const project = projects.find(p => p.id === id);
        if (project) {
          const updated = { ...project, status: '放弃投标' };
          await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
          });
          setProjects(projects.map(p => p.id === id ? updated : p));
        }
      }
    });
  };

  const handleRestartProject = (id: string) => {
    setConfirmDialog({
      message: '确定要重启该项目的投标吗？',
      onConfirm: async () => {
        const project = projects.find(p => p.id === id);
        if (project) {
          const updated = { ...project, status: '投标中' };
          await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
          });
          setProjects(projects.map(p => p.id === id ? updated : p));
        }
      }
    });
  };

  const handleSaveProject = async () => {
    setHasAttemptedSave(true);
    if (!analyzedData.projectName.trim()) {
      alert('请填写所有必填项');
      return;
    }
    
    const newProjectData = {
      id: isEditing ? editingId! : Date.now().toString(),
      name: analyzedData.projectName,
      code: analyzedData.projectNumber,
      tenderer: analyzedData.tenderer,
      tendererContact: analyzedData.tendererContact,
      agent: analyzedData.tenderAgent,
      agentContact: analyzedData.tenderAgentContact,
      bidOpeningTime: analyzedData.openingTime.replace('T', ' '),
      status: isEditing ? projects.find(p => p.id === editingId)?.status || '投标中' : '投标中',
      deposit: analyzedData.depositAmount,
      depositDeadline: analyzedData.openingTime.replace('T', ' '),
      openingLocation: analyzedData.openingLocation,
      collectionTime: analyzedData.collectionTime,
      requirements: analyzedData.tenderRequirements,
      otherRemarks: analyzedData.otherRemarks,
      tenderControlPrice: analyzedData.depositAmount // Assuming this for now or leaving empty
    };

    try {
      if (isEditing) {
        await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProjectData)
        });
        setProjects(projects.map(p => p.id === editingId ? newProjectData : p));
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProjectData)
        });
        setProjects([newProjectData, ...projects]);
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    }
    resetAddModal();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards with Action Button */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Add Project Card Style Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="h-[160px] bg-gradient-to-br from-[#0052CC] to-[#0065FF] rounded-2xl p-6 flex flex-col justify-between items-start text-white shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all active:scale-[0.98] group"
        >
          <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="text-lg font-bold">新增项目登记</span>
        </button>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[160px] flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium">投标中项目</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">{projects.filter(p => p.status === '投标中').length} 个</h3>
            <div className="space-y-1.5 border-t border-slate-50 pt-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">7天内开标</span>
                <span className="font-bold text-slate-600">3 个</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">今日开标</span>
                <span className="font-bold text-orange-600">1 个</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[160px] flex flex-col justify-between group hover:shadow-md transition-shadow uppercase">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium uppercase">本月新增项目</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">8 个</h3>
            <p className="text-xs text-slate-400 mt-2">较上月 <span className="text-emerald-500 font-bold">+15%</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[160px] flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium">本月投标成功</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">3 个</h3>
            <p className="text-xs text-slate-400 mt-2">成功率 <span className="text-primary font-bold">37.5%</span></p>
          </div>
        </div>
      </div>


      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-56 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目名称、编号..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Calendar className="text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-600 font-medium py-1 w-32"
            />
            <span className="text-slate-400 text-xs">至</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-600 font-medium py-1 w-32"
            />
          </div>

          <div className="w-40 relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="全部">全部状态</option>
              <option value="投标中">投标中</option>
              <option value="已完成">已完成</option>
              <option value="放弃投标">放弃投标</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              // Ensure both dates are selected if ANY date is selected
              if ((startDate && !endDate) || (!startDate && endDate)) {
                alert('请选择完整的时间范围（开始日期和结束日期）');
                return;
              }
              setAppliedFilters({
                searchTerm,
                statusFilter,
                startDate,
                endDate
              });
              setCurrentPage(1); // Reset to first page on new query
            }}
            className="px-8 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            查询
          </button>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('全部');
              setStartDate('');
              setEndDate('');
              setAppliedFilters({
                searchTerm: '',
                statusFilter: '全部',
                startDate: '',
                endDate: ''
              });
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
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
                  { label: '招标代理', key: 'agent' },
                  { label: '开标时间', key: 'time' },
                  { label: '状态', key: 'status' },
                  { label: '操作', key: 'action', align: 'right' }
                ].map((col, idx) => (
                  <th 
                    key={col.key} 
                    style={{ width: widths[idx] }}
                    className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{col.label}</span>
                    </div>
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
              {projects.filter(p => {
                const matchesSearch = p.name.includes(appliedFilters.searchTerm) || p.code.includes(appliedFilters.searchTerm);
                const matchesStatus = appliedFilters.statusFilter === '全部' || p.status === appliedFilters.statusFilter;
                
                const projectDate = p.bidOpeningTime.split(' ')[0]; // Extract YYYY-MM-DD
                const matchesStartDate = !appliedFilters.startDate || projectDate >= appliedFilters.startDate;
                const matchesEndDate = !appliedFilters.endDate || projectDate <= appliedFilters.endDate;
                
                return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
              })
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 overflow-hidden">
                    <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm truncate" title={project.name}>{project.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 overflow-hidden">
                    <div className="truncate" title={project.code}>{project.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 overflow-hidden">
                    <div className="truncate" title={project.tenderer}>{project.tenderer}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 overflow-hidden">
                    <div className="truncate" title={project.agent}>{project.agent}</div>
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    <span className="text-sm text-slate-600 truncate block" title={project.bidOpeningTime}>{project.bidOpeningTime}</span>
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold truncate ${
                      project.status === '投标中' 
                        ? 'bg-blue-50 text-blue-600' 
                        : project.status === '已完成' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : project.status === '放弃投标'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-slate-50 text-slate-600'
                    }`}>
                      {project.status === '投标中' ? '投标中' : (project.status === '已完成' ? '已开标' : project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => {
                        if (project.status === '放弃投标') {
                          alert('此项目已暂停');
                          return;
                        }
                        onEnterWorkbench?.('preparation', { 
                          ...project,
                          projectName: project.name, 
                          projectNumber: project.code,
                          isTenderUploaded: true 
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 group/btn whitespace-nowrap ${
                        project.status === '放弃投标' 
                          ? 'text-slate-300 cursor-not-allowed' 
                          : 'text-[#0052CC] hover:bg-[#0052CC]/5'
                      }`}
                      title={project.status === '放弃投标' ? '此项目已暂停' : '进入工作台'}
                    >
                      <ExternalLink size={14} className={project.status === '放弃投标' ? '' : 'group-hover/btn:scale-110 transition-transform'} />
                      <span className="text-xs font-bold whitespace-nowrap">进入工作台</span>
                    </button>
                    
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    
                    <button 
                      onClick={() => {
                        if (project.status === '放弃投标') {
                          alert('此项目已暂停');
                          return;
                        }
                        handleEditProject(project);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        project.status === '放弃投标'
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title={project.status === '放弃投标' ? '此项目已暂停' : '修改'}
                    >
                      <Edit size={14} />
                    </button>

                    {project.status === '放弃投标' ? (
                      <button 
                        onClick={() => handleRestartProject(project.id)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="重启投标"
                      >
                        <RefreshCw size={14} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleGiveUpProject(project.id)}
                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        title="放弃投标"
                      >
                        <Ban size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(projects.filter(p => {
            const matchesSearch = p.name.includes(appliedFilters.searchTerm) || p.code.includes(appliedFilters.searchTerm);
            const matchesStatus = appliedFilters.statusFilter === '全部' || p.status === appliedFilters.statusFilter;
            
            const projectDate = p.bidOpeningTime.split(' ')[0];
            const matchesStartDate = !appliedFilters.startDate || projectDate >= appliedFilters.startDate;
            const matchesEndDate = !appliedFilters.endDate || projectDate <= appliedFilters.endDate;
            
            return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
          }).length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={projects.filter(p => {
            const matchesSearch = p.name.includes(appliedFilters.searchTerm) || p.code.includes(appliedFilters.searchTerm);
            const matchesStatus = appliedFilters.statusFilter === '全部' || p.status === appliedFilters.statusFilter;
            
            const projectDate = p.bidOpeningTime.split(' ')[0];
            const matchesStartDate = !appliedFilters.startDate || projectDate >= appliedFilters.startDate;
            const matchesEndDate = !appliedFilters.endDate || projectDate <= appliedFilters.endDate;
            
            return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
          }).length}
        />
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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden"
              >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#0052CC] rounded-xl flex items-center justify-center text-white">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{isEditing ? '编辑投标项目' : '新增投标项目'}</h3>
                </div>
                <button 
                  onClick={resetAddModal}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-10 flex-1 flex flex-col overflow-hidden">
                <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">
                  
                  {/* Import Section */}
                  {!isAnalyzed && !isAnalyzing && !isEditing && (
                    <div 
                      className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-[#0052CC]/5 hover:border-[#0052CC]/30 transition-all cursor-pointer group shrink-0"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input 
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.zf,.cf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                      />
                      <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Upload size={32} />
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

                  {isAnalyzed && !isEditing && (
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
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          value={analyzedData.projectName || ''}
                          onChange={(e) => handleDataChange('projectName', e.target.value)}
                          placeholder="请输入项目名称"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !analyzedData.projectName.trim() ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                        {hasAttemptedSave && !analyzedData.projectName.trim() && (
                          <div className="absolute right-4 text-red-500">
                            <AlertCircle size={16} className="fill-red-500 text-white" />
                          </div>
                        )}
                      </div>
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
                        value={analyzedData.collectionTime || ''}
                        onChange={(e) => handleDataChange('collectionTime', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">保证金金额</label>
                      <input 
                        type="text" 
                        value={analyzedData.depositAmount || ''}
                        onChange={(e) => handleDataChange('depositAmount', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">招标要求</label>
                      <textarea 
                        value={analyzedData.tenderRequirements || ''}
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
                      <Upload size={18} className="text-primary" />
                      文件附件上传
                    </h5>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: '招标文件', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: '招标清单', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: '控制价清单', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
                      onClick={handleSaveProject}
                      disabled={!analyzedData.projectName.trim()}
                      className="flex-1 py-4 bg-[#0052CC] text-white rounded-2xl font-bold hover:bg-[#0052CC]/90 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEditing ? '保存修改' : '确认新增'}
                    </button>
                    <button 
                      onClick={resetAddModal}
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

export default TenderProjectRegistration;
