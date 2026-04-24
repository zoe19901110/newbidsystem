import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trophy, 
  Frown, 
  Calendar, 
  Users, 
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  BarChart3,
  X,
  ClipboardList,
  Receipt,
  Download,
  Edit3,
  Check,
  ArrowRight,
  ExternalLink,
  Paperclip,
  File,
  Image as ImageIcon,
  Trash2,
  Upload,
  Eye,
  ChevronDown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';
import { useTableResizer } from '../hooks/useTableResizer';

interface TenderOpeningStatusManagementProps {
  currentEnterprise?: { id: string; name: string };
  projects?: any[];
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image';
  date: string;
  category?: '中标通知书' | '合同' | '其他材料' | '开标记录' | '投标文件';
}

const TenderOpeningStatusManagement: React.FC<TenderOpeningStatusManagementProps> = ({ currentEnterprise, projects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('全部');
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    startDate: '',
    endDate: '',
    statusFilter: '全部',
    fulfillmentFilter: '全部'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [tenderPersonnel, setTenderPersonnel] = useState<string[]>(['陈经理', '王志强']);
  const [tenderFiles, setTenderFiles] = useState<Attachment[]>([
    { id: 'tf-1', name: '技术标书-最终版.pdf', size: '15.5MB', type: 'pdf', date: '2026-03-19' },
    { id: 'tf-2', name: '商务标书-最终版.pdf', size: '8.2MB', type: 'pdf', date: '2026-03-19' }
  ]);
  const [personnelInput, setPersonnelInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTenderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: File, index) => ({
        id: `tf-new-${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      }));
      setTenderFiles([...tenderFiles, ...newFiles]);
    }
  };
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { widths, onMouseDown } = useTableResizer([
    250,    // 项目名称
    120,    // 开标日期
    150,    // 投标报价
    150,    // 单位数量
    150,    // 合同履行状态
    160     // 操作
  ]);

  const departments = React.useMemo(() => {
    const depts = new Set<string>();
    allUsers.forEach(u => {
      if (u.dept) depts.add(u.dept);
      else if (u.department) depts.add(u.department);
    });
    const list = Array.from(depts);
    return list.length > 0 ? list : ['工程部', '商务部', '财务部', '综合部', '技术部'];
  }, [allUsers]);

  React.useEffect(() => {
    if (departments.length > 0 && !selectedDept) {
      setSelectedDept(departments[0]);
    }
  }, [departments, selectedDept]);

  React.useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      setAllUsers(users);
    }
  }, []);

  const [currentEditingRecord, setCurrentEditingRecord] = useState<any>(null);

  const handleOpenModal = (record?: any) => {
    setHasAttemptedSave(false);
    // Check if the project is paused
    const project = projects.find(p => p.code === record?.projectCode || p.name === record?.projectName);
    if (project?.status === '放弃投标') {
      alert('此项目已暂停');
      return;
    }
    
    setCurrentEditingRecord(record || null);

    if (record) {
      if (!record.hasOpeningInfo) {
        setIsNewRecord(true);
        setIsEditing(true);
      } else {
        setIsNewRecord(false);
        setIsEditing(true); // Or false, depending on if we want to view or edit by default
      }
    } else {
      setIsNewRecord(true);
      setIsEditing(true);
    }
    setShowAddModal(true);
  };

  // Modal State
  const [isEditing, setIsEditing] = useState(true);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [openingRecords, setOpeningRecords] = useLocalStorage('tenderStatus_openingRecords', [
    { units: '某某建设集团有限公司', price: 12105000, rank: '1', isWinner: true, isSelf: true },
    { units: '中建某局有限公司', price: 12500000, rank: '2', isWinner: false, isSelf: false },
    { units: '省建工集团', price: 12800000, rank: '3', isWinner: false, isSelf: false },
  ]);
  const [winningRecords, setWinningRecords] = useLocalStorage('tenderStatus_winningRecords', [
    { unit: '某某建设集团有限公司', amount: 12105000, date: '2026-03-25', url: 'http://ggzy.example.com/...' },
  ]);
  const [contractRecords, setContractRecords] = useLocalStorage('tenderStatus_contractRecords', [
    { id: 'HT-2026-001', name: '城市基础设施施工合同', date: '2026-04-05', amount: 11800000, owner: '陈经理', duration: '30', status: '履行中', fulfillmentDate: '2026-04-10', expectedCompletionDate: '2026-05-10' },
  ]);
  const [unsuccessfulReason, setUnsuccessfulReason] = useLocalStorage('tenderStatus_unsuccessfulReason', '由于竞争对手报价更具优势，且在同类项目中有更丰富的实施经验，本次未能中标。后续需加强成本控制和案例积累。');
  const [contractAttachments, setContractAttachments] = useLocalStorage<Attachment[]>('tenderStatus_contractAttachments', [
    { id: '1', name: '中标通知书.pdf', size: '1.2MB', type: 'pdf', date: '2026-03-25', category: '中标通知书' },
    { id: '2', name: '施工合同扫描件.jpg', size: '2.4MB', type: 'image', date: '2026-04-05', category: '合同' },
  ]);
  const [openingRecordFiles, setOpeningRecordFiles] = useLocalStorage<Attachment[]>('tenderStatus_openingRecordFiles', [
    { id: 'orf-1', name: '开标记录表-20260320.pdf', size: '1.5MB', type: 'pdf', date: '2026-03-20', category: '开标记录' }
  ]);

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
    // Mock export functionality
    const data = {
      opening: openingRecords,
      winning: winningRecords,
      contract: contractRecords,
      attachments: contractAttachments
    };
    console.log('Exporting data:', data);
    alert('详情数据已准备好导出（包含附件列表，模拟导出成功）');
  };

  const [records, setRecords] = useLocalStorage<any[]>('tenderStatus_records', []);

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  React.useEffect(() => {
    if (records.length > 0) return; // Only set rawRecords if empty

    const rawRecords = [
      {
        id: '1',
        projectCode: 'ZB-2026-001',
        projectName: `2026年智慧交通管理平台建设项目`,
        openingDate: '2026-03-20',
        result: '中标',
        bidPrice: 4450000.00,
        competitors: 5,
        ranking: 1,
        remarks: '技术分第一，商务分第二',
        fulfillmentStatus: '履行中',
        fulfillmentStartDate: '2026-04-01',
        refundStatus: '待退还',
        hasOpeningInfo: true
      },
      {
        id: '2',
        projectCode: 'ZB-2026-005',
        projectName: `政务云扩容采购项目`,
        openingDate: '2026-02-28',
        result: '未中标',
        bidPrice: 2750000.00,
        competitors: 8,
        ranking: 3,
        remarks: '价格偏高，技术方案获优',
        fulfillmentStatus: '无需履行',
        refundStatus: '已退还',
        hasOpeningInfo: true
      },
      {
        id: '3',
        projectCode: 'ZB-2026-008',
        projectName: `XX市智慧医疗信息系统`,
        openingDate: '2026-03-15',
        result: '中标',
        bidPrice: 8200000.00,
        competitors: 4,
        ranking: 1,
        remarks: '方案优势明显，价格适中',
        fulfillmentStatus: '未开始',
        refundStatus: '待退还',
        hasOpeningInfo: true
      },
      {
        id: '4',
        projectCode: 'ZB-2026-012',
        projectName: `工业园区污水处理自动化改造`,
        openingDate: '2026-03-05',
        result: '未中标',
        bidPrice: 1500000.00,
        competitors: 12,
        ranking: 5,
        remarks: '竞争激烈，价格分较低',
        fulfillmentStatus: '无需履行',
        refundStatus: '已退还',
        hasOpeningInfo: true
      },
      {
        id: '5',
        projectCode: 'ZB-2026-015',
        projectName: `省图书馆数字化二期工程`,
        openingDate: '2026-01-25',
        result: '中标',
        bidPrice: 3100000.00,
        competitors: 3,
        ranking: 1,
        remarks: '唯一通过技术初审的单位',
        fulfillmentStatus: '已完成',
        refundStatus: '待退还',
        hasOpeningInfo: true
      },
      {
        id: '6',
        projectCode: 'ZB-2026-020',
        projectName: `智慧园区二期弱电工程`,
        openingDate: '2026-04-10',
        result: '',
        bidPrice: 0,
        competitors: 0,
        ranking: 0,
        remarks: '',
        fulfillmentStatus: '',
        refundStatus: '待退还',
        hasOpeningInfo: false
      }
    ];

    // Sort: Won first, then by date descending
    const sortedRecords = [...rawRecords].sort((a, b) => {
      if (a.hasOpeningInfo && !b.hasOpeningInfo) return -1;
      if (!a.hasOpeningInfo && b.hasOpeningInfo) return 1;
      if (a.result === '中标' && b.result !== '中标') return -1;
      if (a.result !== '中标' && b.result === '中标') return 1;
      return new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime();
    });

    setRecords(sortedRecords);
  }, [currentEnterprise]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '已开标数量', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '中标项目', value: '6', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '中标率', value: '50%', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
          { label: '平均竞争对手', value: '6.5', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`size-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-slate-500 text-xs font-medium mb-1">{stat.label}</p>
            <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 flex-1">
          <div className="w-64 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目名称..."
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
          
          <div className="w-48 relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="全部">项目状态</option>
              <option value="中标">中标</option>
              <option value="未中标">未中标</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
          </div>
          
          <div className="w-48 relative group">
            <select 
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="全部">合同履行状态</option>
              <option value="未开始">未开始</option>
              <option value="履行中">履行中</option>
              <option value="已完成">已完成</option>
              <option value="无需履行">无需履行</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
          </div>
        </div>
        
        <div className="flex gap-4 shrink-0">
          <button 
            onClick={() => {
              if ((startDate && !endDate) || (!startDate && endDate)) {
                alert('请选择完整的时间范围（开始日期和结束日期）');
                return;
              }
              setAppliedFilters({
                searchTerm,
                startDate,
                endDate,
                statusFilter,
                fulfillmentFilter
              });
              setCurrentPage(1);
            }}
            className="px-8 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
          >
            查询
          </button>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStartDate('');
              setEndDate('');
              setStatusFilter('全部');
              setFulfillmentFilter('全部');
              setAppliedFilters({
                searchTerm: '',
                startDate: '',
                endDate: '',
                statusFilter: '全部',
                fulfillmentFilter: '全部'
              });
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Filter size={16} /> 重置
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {[
                  { label: '项目名称', key: 'name' },
                  { label: '开标日期', key: 'date' },
                  { label: '投标报价（元）', key: 'price' },
                  { label: '单位数量', key: 'units' },
                  { label: '合同履行状态', key: 'status' },
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
              {records.filter(r => {
                const matchesSearch = r.projectName.includes(appliedFilters.searchTerm) || r.projectCode.includes(appliedFilters.searchTerm);
                const matchesStartDate = !appliedFilters.startDate || r.openingDate >= appliedFilters.startDate;
                const matchesEndDate = !appliedFilters.endDate || r.openingDate <= appliedFilters.endDate;
                const matchesStatus = appliedFilters.statusFilter === '全部' || r.result === appliedFilters.statusFilter;
                const matchesFulfillment = appliedFilters.fulfillmentFilter === '全部' || r.fulfillmentStatus === appliedFilters.fulfillmentFilter;
                return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus && matchesFulfillment;
              })
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((record) => (
                <tr 
                  key={record.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 overflow-hidden">
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`text-[10px] text-slate-400 shrink-0`}>{record.projectCode}</span>
                        {record.hasOpeningInfo && (
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            record.result === '中标' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {record.result}
                          </span>
                        )}
                        {projects.find(p => p.code === record.projectCode || p.name === record.projectName)?.status === '放弃投标' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 shrink-0">
                            已暂停
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm truncate" title={record.projectName}>{record.projectName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 overflow-hidden">
                    <div className="truncate" title={record.openingDate}>{record.openingDate}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 overflow-hidden">
                    <div className="truncate" title={record.hasOpeningInfo ? formatCurrency(record.bidPrice) : '--'}>
                      {record.hasOpeningInfo ? formatCurrency(record.bidPrice) : '--'}
                    </div>
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    {record.hasOpeningInfo ? (
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <p className="text-sm text-slate-600 truncate">{record.competitors} 家单位</p>
                        <p className="text-xs text-slate-400 truncate">排名: 第 {record.ranking} 名</p>
                      </div>
                    ) : '--'}
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    {record.hasOpeningInfo ? (
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <p className="text-xs font-bold text-slate-600 truncate">
                          {record.fulfillmentStatus}
                        </p>
                        {record.fulfillmentStatus === '履行中' && record.fulfillmentStartDate && (
                          <p className="text-[10px] text-slate-400 truncate">开始: {record.fulfillmentStartDate}</p>
                        )}
                      </div>
                    ) : '--'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenModal(record)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                        projects.find(p => p.code === record.projectCode || p.name === record.projectName)?.status === '放弃投标'
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : record.hasOpeningInfo 
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/10' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {record.hasOpeningInfo ? <Edit3 size={14} className="shrink-0" /> : <Plus size={14} className="shrink-0" />}
                      {record.hasOpeningInfo ? '修改记录' : '新增记录'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(records.filter(r => {
          const matchesSearch = r.projectName.includes(appliedFilters.searchTerm) || r.projectCode.includes(appliedFilters.searchTerm);
          const matchesStartDate = !appliedFilters.startDate || r.openingDate >= appliedFilters.startDate;
          const matchesEndDate = !appliedFilters.endDate || r.openingDate <= appliedFilters.endDate;
          const matchesStatus = appliedFilters.statusFilter === '全部' || r.result === appliedFilters.statusFilter;
          const matchesFulfillment = appliedFilters.fulfillmentFilter === '全部' || r.fulfillmentStatus === appliedFilters.fulfillmentFilter;
          return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus && matchesFulfillment;
        }).length / pageSize)}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        totalItems={records.filter(r => {
          const matchesSearch = r.projectName.includes(appliedFilters.searchTerm) || r.projectCode.includes(appliedFilters.searchTerm);
          const matchesStartDate = !appliedFilters.startDate || r.openingDate >= appliedFilters.startDate;
          const matchesEndDate = !appliedFilters.endDate || r.openingDate <= appliedFilters.endDate;
          const matchesStatus = appliedFilters.statusFilter === '全部' || r.result === appliedFilters.statusFilter;
          const matchesFulfillment = appliedFilters.fulfillmentFilter === '全部' || r.fulfillmentStatus === appliedFilters.fulfillmentFilter;
          return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus && matchesFulfillment;
        }).length}
      />

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
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
                      onClick={handleExport}
                      className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-all flex items-center gap-2"
                    >
                      <Download size={16} />
                      导出详情
                    </button>
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                    <div className="p-8 flex-1 flex flex-col overflow-hidden">
                  <div className="space-y-10 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    {/* Project Info Display */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">关联项目 <span className="text-red-500">*</span></p>
                          <p className="text-sm font-bold text-slate-900">2026年智慧交通管理平台建设项目</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">开标日期 <span className="text-red-500">*</span></p>
                          <p className="text-sm font-bold text-slate-900">2026-03-20</p>
                        </div>
                      </div>
                    </div>

                    {/* Tender Registration Section (Combined) */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <ClipboardList size={20} className="text-primary" />
                          <h4 className="text-lg">投标登记</h4>
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-10">
                        {/* File Upload Area */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <Upload size={16} className="text-primary" />
                              投标文件
                            </h5>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tenderFiles.map(file => (
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
                                  {isEditing && (
                                    <button 
                                      onClick={() => setTenderFiles(tenderFiles.filter(f => f.id !== file.id))}
                                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
                            <div className="relative w-full">
                              <input 
                                type="file" 
                                multiple 
                                onChange={handleTenderFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                              />
                              <div className="w-full py-4 bg-primary/5 border border-primary/20 rounded-2xl text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm group">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 点击上传投标文件
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Personnel Selection Area - Single Line with Dropdown */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <Users size={16} className="text-primary" />
                              投标人员
                            </h5>
                          </div>
                          
                          <div className="relative">
                            <div className={`flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[56px] ${!isEditing ? 'opacity-90' : ''}`}>
                              <div className="flex-1 flex flex-wrap gap-2">
                                <AnimatePresence mode="popLayout">
                                  {tenderPersonnel.map(name => (
                                    <motion.span 
                                      layout
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.8, opacity: 0 }}
                                      key={name} 
                                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold shadow-sm group"
                                    >
                                      <div className="size-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px]">
                                        {name.charAt(0)}
                                      </div>
                                      {name}
                                      {isEditing && (
                                        <button 
                                          onClick={() => setTenderPersonnel(tenderPersonnel.filter(n => n !== name))}
                                          className="p-0.5 hover:bg-red-50 rounded-md text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                          <X size={12} />
                                        </button>
                                      )}
                                    </motion.span>
                                  ))}
                                </AnimatePresence>
                                {tenderPersonnel.length === 0 && (
                                  <span className="text-xs text-slate-400 italic ml-2 py-1.5">尚未选择投标人员</span>
                                )}
                              </div>
                              
                              {isEditing && (
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
                              )}
                            </div>

                            {/* Dropdown Selector Widget */}
                            <AnimatePresence>
                              {isEditing && showPersonnelDropdown && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-[60]" 
                                    onClick={() => setShowPersonnelDropdown(false)}
                                  />
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-full md:w-[560px] h-[420px] bg-white rounded-3xl border border-slate-200 shadow-2xl z-[70] flex flex-col overflow-hidden"
                                  >
                                    {/* Search Header */}
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                                      <div className="relative group">
                                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input 
                                          type="text"
                                          value={personnelInput}
                                          onChange={(e) => setPersonnelInput(e.target.value)}
                                          placeholder="请输入人员姓名"
                                          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                                          autoFocus
                                        />
                                      </div>
                                    </div>

                                    <div className="flex-1 flex overflow-hidden">
                                      {/* Department List */}
                                      <div className="w-32 border-r border-slate-100 bg-slate-50/50 overflow-y-auto custom-scrollbar">
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

                                      {/* Personnel List */}
                                      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-white">
                                        <div className="space-y-1">
                                          <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {selectedDept} - 人员
                                          </p>
                                          {allUsers
                                            .filter(u => {
                                              const isAlreadySelected = tenderPersonnel.includes(u.name);
                                              if (isAlreadySelected) return false;
                                              const matchesSearch = u.name.toLowerCase().includes(personnelInput.toLowerCase()) || 
                                                                  (u.position || '').toLowerCase().includes(personnelInput.toLowerCase());
                                              const matchesDept = selectedDept ? (u.dept === selectedDept || u.department === selectedDept) : true;
                                              return matchesSearch && matchesDept;
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
                                          {allUsers.filter(u => {
                                            const isAlreadySelected = tenderPersonnel.includes(u.name);
                                            if (isAlreadySelected) return false;
                                            const matchesSearch = u.name.toLowerCase().includes(personnelInput.toLowerCase()) || 
                                                                (u.position || '').toLowerCase().includes(personnelInput.toLowerCase());
                                            const matchesDept = selectedDept ? (u.dept === selectedDept || u.department === selectedDept) : true;
                                            return matchesSearch && matchesDept;
                                          }).length === 0 && (
                                            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                              <Search size={20} className="opacity-20 mb-2" />
                                              <p className="text-[10px] font-medium">未找到可选择的人员</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400">已选 {tenderPersonnel.length} 人</span>
                                      <button 
                                        onClick={() => setShowPersonnelDropdown(false)}
                                        className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                                      >
                                        完成
                                      </button>
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
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
                              onClick={() => setOpeningRecords([...openingRecords, { units: '', price: '', rank: '', isWinner: false, isSelf: false }])}
                              className="text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
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
                                      <div className="relative flex items-center">
                                        <input 
                                          value={row.units} 
                                          onChange={(e) => updateOpening(i, 'units', e.target.value)}
                                          className={`w-full border rounded px-2 py-1 text-sm focus:border-primary outline-none transition-all ${hasAttemptedSave && !row.units ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`}
                                          placeholder="请输入参标单位"
                                        />
                                        {hasAttemptedSave && !row.units && (
                                          <div className="absolute -right-6 text-red-500">
                                            <AlertCircle size={16} className="fill-red-500 text-white" />
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className={`text-sm font-bold ${row.isWinner ? 'text-emerald-700' : 'text-slate-600'}`}>
                                        {row.units || '--'}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {isEditing ? (
                                      <div className="relative flex items-center">
                                        <input 
                                          type="number"
                                          value={row.price} 
                                          onChange={(e) => updateOpening(i, 'price', parseFloat(e.target.value) || 0)}
                                          className={`w-full border rounded px-2 py-1 text-sm font-mono focus:border-primary outline-none transition-all ${hasAttemptedSave && (!row.price && row.price !== 0) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`}
                                          placeholder="0.00"
                                        />
                                        {hasAttemptedSave && (!row.price && row.price !== 0) && (
                                          <div className="absolute -right-6 text-red-500">
                                            <AlertCircle size={16} className="fill-red-500 text-white" />
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="font-mono text-sm text-primary font-bold">{formatCurrency(row.price)}</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {isEditing ? (
                                      <div className="relative flex items-center">
                                        <input 
                                          value={row.rank} 
                                          onChange={(e) => updateOpening(i, 'rank', e.target.value)}
                                          className={`w-16 border rounded px-2 py-1 text-sm focus:border-primary outline-none transition-all ${hasAttemptedSave && !row.rank ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`}
                                          placeholder="排名"
                                        />
                                        {hasAttemptedSave && !row.rank && (
                                          <div className="absolute -right-6 text-red-500">
                                            <AlertCircle size={16} className="fill-red-500 text-white" />
                                          </div>
                                        )}
                                      </div>
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
                                        name="isWinner"
                                        checked={row.isWinner}
                                        onChange={() => updateOpening(i, 'isWinner', true)}
                                        className="size-4 rounded-full border-slate-300 text-primary focus:ring-primary"
                                      />
                                    ) : (
                                      row.isWinner && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold">中标单位</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {isEditing ? (
                                      <div className="relative flex items-center justify-center">
                                        <input 
                                          type="radio"
                                          name="isSelf"
                                          checked={row.isSelf || false}
                                          onChange={() => updateOpening(i, 'isSelf', true)}
                                          className={`size-4 rounded-full border-slate-300 text-primary focus:ring-primary ${hasAttemptedSave && !openingRecords.some(r => r.isSelf) ? 'ring-2 ring-red-500 ring-offset-1' : ''}`}
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
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
                      </div>

                      {/* Opening Record Attachments Section - New Feature */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
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
                                className="absolute inset-0 opacity-0 cursor-pointer" 
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
                              <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg transition-colors">
                                <Plus size={14} /> 上传附件
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {openingRecordFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 group hover:bg-white hover:border-primary/20 hover:shadow-md transition-all">
                              <div className="flex items-center gap-3">
                                <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                                  <FileText size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{file.size} · {file.date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="预览" onClick={() => setPreviewImage('https://picsum.photos/seed/opening/800/1200')}><Eye size={14} /></button>
                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="下载"><Download size={14} /></button>
                                {isEditing && (
                                  <button 
                                    onClick={() => setOpeningRecordFiles(openingRecordFiles.filter(f => f.id !== file.id))}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="删除"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {openingRecordFiles.length === 0 && (
                            <div className="col-span-full py-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                              <Paperclip size={24} className="text-slate-200 mb-2" />
                              <p className="text-xs text-slate-400 font-medium">暂无开标记录附件</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
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
                                      <input 
                                        value={row.unit} 
                                        onChange={(e) => updateWinning(i, 'unit', e.target.value)}
                                        className="w-full border border-slate-200 rounded px-2 py-1 text-sm"
                                        placeholder="请输入中标单位"
                                      />
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
                                        onChange={(e) => updateWinning(i, 'amount', parseFloat(e.target.value) || 0)}
                                        className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono"
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
                                        className="w-full border border-slate-200 rounded px-2 py-1 text-sm"
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
                                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-primary"
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
                              placeholder="请输入未中标原因分析..."
                              className="w-full h-32 border border-slate-200 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-all resize-none shadow-inner bg-slate-50/30"
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
                            onClick={() => setContractRecords([...contractRecords, { id: '', name: '', date: '', amount: '', owner: '', duration: '', status: '待定', fulfillmentDate: '', expectedCompletionDate: '' }])}
                            className="text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
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
                              {isEditing && <th className="px-3 py-3 min-w-[60px] whitespace-nowrap text-right">操作</th>}
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
                                  ) : (
                                    <>
                                      <p className="text-sm font-bold text-slate-900">{row.name || '--'}</p>
                                      <p className="text-[10px] text-slate-400">{row.id || '--'}</p>
                                    </>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  {isEditing ? (
                                    <input 
                                      type="date"
                                      value={row.date} 
                                      onChange={(e) => updateContract(i, 'date', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600">{row.date || '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  {isEditing ? (
                                    <input 
                                      type="number"
                                      value={row.amount} 
                                      onChange={(e) => updateContract(i, 'amount', parseFloat(e.target.value) || 0)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono font-bold outline-none focus:border-primary"
                                      placeholder="0.00"
                                    />
                                  ) : (
                                    <span className="font-mono text-sm text-slate-900 font-bold">{formatCurrency(row.amount)}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  {isEditing ? (
                                    <input 
                                      value={row.owner} 
                                      onChange={(e) => updateContract(i, 'owner', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                      placeholder="负责人"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600">{row.owner || '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  {isEditing ? (
                                    <input 
                                      type="number"
                                      value={row.duration} 
                                      onChange={(e) => updateContract(i, 'duration', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                      placeholder="天数"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600">{row.duration ? `${row.duration}天` : '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  {isEditing ? (
                                    <input 
                                      type="date"
                                      value={row.fulfillmentDate} 
                                      onChange={(e) => updateContract(i, 'fulfillmentDate', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600">{row.fulfillmentDate || '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  <span className="text-sm text-slate-600">{row.expectedCompletionDate || '--'}</span>
                                </td>
                                <td className="px-3 py-3">
                                  {isEditing ? (
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
                                  ) : (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                      row.status === '已完成' ? 'bg-green-50 text-green-600' : 
                                      row.status === '已终止' ? 'bg-red-50 text-red-600' : 
                                      row.status === '逾期' ? 'bg-orange-50 text-orange-600' :
                                      row.status === '未开始' ? 'bg-slate-50 text-slate-500' :
                                      'bg-blue-50 text-blue-600'
                                    }`}>
                                      {row.status}
                                    </span>
                                  )}
                                </td>
                                {isEditing && (
                                  <td className="px-3 py-3 text-right">
                                    <button 
                                      onClick={() => deleteContract(i)}
                                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
                                  className="absolute inset-0 opacity-0 cursor-pointer"
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
                                <button className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-[10px] font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 border border-primary/20">
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
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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

                  <div className="flex gap-4 pt-8 shrink-0 bg-white">
                    <button 
                      onClick={() => {
                        setHasAttemptedSave(true);
                        // Validate opening records
                        let isValid = true;
                        let hasSelf = false;
                        for (let i = 0; i < openingRecords.length; i++) {
                          const record = openingRecords[i];
                          if (!record.units || record.price === '' || record.price === null || record.price === undefined || !record.rank) {
                            isValid = false;
                          }
                          if (record.isSelf) {
                            hasSelf = true;
                          }
                        }

                        if (!hasSelf && openingRecords.length > 0) {
                          isValid = false;
                        }

                        if (!isValid) {
                          alert('请填写所有必填项，并选择本单位');
                          return;
                        }

                        if (currentEditingRecord) {
                          setRecords(prevRecords => prevRecords.map(r => {
                            if (r.id === currentEditingRecord.id) {
                              const selfRecord = openingRecords.find(or => or.isSelf);
                              const isSelfWinner = selfRecord ? selfRecord.isWinner : false;
                              return {
                                ...r,
                                hasOpeningInfo: true,
                                bidPrice: selfRecord ? parseFloat(selfRecord.price as any) : r.bidPrice,
                                result: selfRecord ? (isSelfWinner ? '中标' : '未中标') : r.result,
                                competitors: openingRecords.length,
                                ranking: selfRecord ? parseInt(selfRecord.rank as any) || r.ranking : r.ranking,
                                fulfillmentStatus: !isSelfWinner ? '无需履行' : (r.fulfillmentStatus === '无需履行' ? '未开始' : r.fulfillmentStatus),
                              };
                            }
                            return r;
                          }));
                        }

                        setShowAddModal(false);
                      }} 
                      className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                    >
                      {isNewRecord ? '保存' : '保存修改'}
                    </button>
                    <button 
                      onClick={() => setShowAddModal(false)} 
                      className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

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
    </motion.div>
  );
};

export default TenderOpeningStatusManagement;
