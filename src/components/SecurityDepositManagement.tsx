import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Wallet, 
  Calendar, 
  Building2, 
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Upload,
  RefreshCcw,
  FileText,
  History,
  X,
  Edit3,
  Eye,
  Trash2,
  Paperclip,
  File,
  Image as ImageIcon,
  Download,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Pagination from './Pagination';
import { useTableResizer } from '../hooks/useTableResizer';

interface SecurityDepositManagementProps {
  currentEnterprise?: { id: string; name: string };
  projects?: any[];
}

const SecurityDepositManagement: React.FC<SecurityDepositManagementProps> = ({ currentEnterprise, projects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refundStatusFilter, setRefundStatusFilter] = useState('全部');
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    startDate: '',
    endDate: '',
    refundStatusFilter: '全部'
  });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { widths, onMouseDown } = useTableResizer([
    250,    // 项目编号/名称
    150,    // 金额/方式
    200,    // 缴纳银行/日期
    150,    // 退还状态
    160     // 操作
  ]);

  const [deposits, setDeposits] = useState<any[]>([
    {
      id: 'DEP-2024-001',
      projectName: '2024年智慧交通管理平台建设项目',
      projectCode: 'ZB-2024-001',
      amount: '¥ 200,000.00',
      type: '现金转账',
      bank: '中国工商银行北京分行',
      date: '2024-03-15',
      status: '已缴纳',
      refundStatus: '待退还',
      refundDate: '',
      vouchers: ['payment_voucher_01.pdf'],
      hasDepositInfo: true
    },
    {
      id: 'DEP-2024-002',
      projectName: '政务云扩容采购项目',
      projectCode: 'ZB-2024-005',
      amount: '¥ 150,000.00',
      type: '银行保函',
      bank: '招商银行上海支行',
      date: '2024-03-10',
      status: '已缴纳',
      refundStatus: '已退还',
      refundDate: '2024-03-20',
      vouchers: ['guarantee_letter.jpg'],
      hasDepositInfo: true
    },
    {
      id: 'DEP-2024-003',
      projectName: 'XX市智慧医疗信息系统',
      projectCode: 'ZB-2024-008',
      amount: '',
      type: '',
      bank: '',
      date: '',
      status: '',
      refundStatus: '',
      refundDate: '',
      vouchers: [],
      hasDepositInfo: false
    }
  ]);

  const [formData, setFormData] = useState({
    projectName: '',
    amount: '',
    type: '现金转账',
    bank: '',
    date: '',
    remarks: '',
    refundStatus: '待退还',
    refundDate: '',
    vouchers: [] as string[]
  });

  const handleOpenModal = (deposit?: any) => {
    // Check if the project is paused
    const project = projects.find(p => p.code === deposit?.projectCode || p.name === deposit?.projectName);
    if (project?.status === '放弃投标') {
      alert('项目已放弃投标，无法操作');
      return;
    }

    if (deposit) {
      setSelectedDeposit(deposit);
      setFormData({
        projectName: deposit.projectName,
        amount: deposit.amount,
        type: deposit.type || '现金转账',
        bank: deposit.bank,
        date: deposit.date,
        remarks: deposit.remarks || '',
        refundStatus: deposit.refundStatus || '待退还',
        refundDate: deposit.refundDate || '',
        vouchers: deposit.vouchers || [deposit.voucher].filter(Boolean)
      });
      setIsEditing(true);
    } else {
      setSelectedDeposit(null);
      setFormData({
        projectName: '',
        amount: '',
        type: '现金转账',
        bank: '',
        date: '',
        remarks: '',
        refundStatus: '待退还',
        refundDate: '',
        vouchers: []
      });
      setIsEditing(false);
    }
    setHasAttemptedSave(false);
    setShowDepositModal(true);
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!formData.amount || !formData.type || !formData.bank || !formData.date || !formData.refundStatus) {
      alert('请填写所有必填项');
      return;
    }

    if (isEditing && selectedDeposit) {
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, ...formData } : d));
    } else {
      const newDeposit = {
        id: `DEP-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...formData,
        status: '已缴纳'
      };
      setDeposits([newDeposit, ...deposits]);
    }
    setShowDepositModal(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">累计缴纳金额</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            ¥{deposits.reduce((acc, d) => acc + parseFloat(d.amount.replace(/[^\d.]/g, '') || '0'), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-slate-400 mt-2">涉及 {deposits.length} 个项目</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">待退还金额</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            ¥{deposits.filter(d => d.refundStatus === '待退还').reduce((acc, d) => acc + parseFloat(d.amount.replace(/[^\d.]/g, '') || '0'), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-slate-400 mt-2">涉及 {deposits.filter(d => d.refundStatus === '待退还').length} 个项目</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">已退还金额</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            ¥{deposits.filter(d => d.refundStatus === '已退还').reduce((acc, d) => acc + parseFloat(d.amount.replace(/[^\d.]/g, '') || '0'), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-slate-400 mt-2">退还率 {deposits.length > 0 ? Math.round((deposits.filter(d => d.refundStatus === '已退还').length / deposits.length) * 100) : 0}%</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-56 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目名称、银行、项目编号..."
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
              value={refundStatusFilter}
              onChange={(e) => setRefundStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="全部">退还状态</option>
              <option value="已退还">已退还</option>
              <option value="待退还">待退还</option>
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
                startDate,
                endDate,
                refundStatusFilter
              });
              setCurrentPage(1); // Reset to first page on new query
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
              setRefundStatusFilter('全部');
              setAppliedFilters({
                searchTerm: '',
                startDate: '',
                endDate: '',
                refundStatusFilter: '全部'
              });
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Filter size={16} /> 重置
          </button>
        </div>
      </div>

      {/* Deposit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {[
                  { label: '项目编号/名称', key: 'project' },
                  { label: '金额/方式', key: 'amount' },
                  { label: '缴纳银行/日期', key: 'bank' },
                  { label: '退还状态', key: 'refund' },
                  { label: '操作', key: 'action', align: 'right' }
                ].map((col, idx) => (
                  <th 
                    key={col.key} 
                    style={{ width: widths[idx] }}
                    className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    <span className="truncate">{col.label}</span>
                    {idx < 4 && (
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
              {deposits.filter(d => {
                const matchesSearch = d.projectName.includes(appliedFilters.searchTerm) || d.projectCode.includes(appliedFilters.searchTerm) || d.bank.includes(appliedFilters.searchTerm);
                const matchesStartDate = !appliedFilters.startDate || d.date >= appliedFilters.startDate;
                const matchesEndDate = !appliedFilters.endDate || d.date <= appliedFilters.endDate;
                const matchesRefundStatus = appliedFilters.refundStatusFilter === '全部' || d.refundStatus === appliedFilters.refundStatusFilter;
                return matchesSearch && matchesStartDate && matchesEndDate && matchesRefundStatus;
              })
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((deposit) => {
                const project = projects.find(p => p.code === deposit.projectCode || p.name === deposit.projectName);
                const isPaused = project?.status === '放弃投标';

                return (
                  <tr key={deposit.id} className={`hover:bg-slate-50/50 transition-colors group ${isPaused ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 overflow-hidden">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1 overflow-hidden">
                          <p className="text-xs font-bold text-primary shrink-0">{deposit.id}</p>
                          {deposit.hasDepositInfo && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 shrink-0`}>
                              {deposit.status}
                            </span>
                          )}
                          {isPaused && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 shrink-0">
                              已暂停
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate" title={deposit.projectName}>{deposit.projectName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 overflow-hidden">
                      {deposit.hasDepositInfo ? (
                        <div className="space-y-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-700 truncate" title={deposit.amount}>{deposit.amount}</p>
                          <p className="text-xs text-slate-400 truncate" title={deposit.type}>{deposit.type}</p>
                        </div>
                      ) : '--'}
                    </td>
                    <td className="px-6 py-4 overflow-hidden">
                      {deposit.hasDepositInfo ? (
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2 text-sm text-slate-600 overflow-hidden">
                            <Building2 size={14} className="text-slate-400 shrink-0" />
                            <span className="truncate" title={deposit.bank}>{deposit.bank}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate" title={deposit.date}>{deposit.date}</p>
                        </div>
                      ) : '--'}
                    </td>
                    <td className="px-6 py-4 overflow-hidden">
                      {deposit.hasDepositInfo ? (
                        <div className="flex flex-col gap-1.5 overflow-hidden">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit shrink-0 ${
                            deposit.refundStatus === '已退还' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {deposit.refundStatus === '已退还' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {deposit.refundStatus}
                          </span>
                          {deposit.refundStatus === '已退还' && deposit.refundDate && (
                            <p className="text-[10px] text-slate-400 truncate">退还: {deposit.refundDate}</p>
                          )}
                        </div>
                      ) : '--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(deposit)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                            isPaused 
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : deposit.hasDepositInfo 
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/10' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {deposit.hasDepositInfo ? <Edit3 size={14} className="shrink-0" /> : <Plus size={14} className="shrink-0" />}
                          {deposit.hasDepositInfo ? '修改记录' : '新增记录'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(deposits.filter(d => {
          const matchesSearch = d.projectName.includes(appliedFilters.searchTerm) || d.projectCode.includes(appliedFilters.searchTerm) || d.bank.includes(appliedFilters.searchTerm);
          const matchesStartDate = !appliedFilters.startDate || d.date >= appliedFilters.startDate;
          const matchesEndDate = !appliedFilters.endDate || d.date <= appliedFilters.endDate;
          const matchesRefundStatus = appliedFilters.refundStatusFilter === '全部' || d.refundStatus === appliedFilters.refundStatusFilter;
          return matchesSearch && matchesStartDate && matchesEndDate && matchesRefundStatus;
        }).length / pageSize)}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        totalItems={deposits.filter(d => {
          const matchesSearch = d.projectName.includes(appliedFilters.searchTerm) || d.projectCode.includes(appliedFilters.searchTerm) || d.bank.includes(appliedFilters.searchTerm);
          const matchesStartDate = !appliedFilters.startDate || d.date >= appliedFilters.startDate;
          const matchesEndDate = !appliedFilters.endDate || d.date <= appliedFilters.endDate;
          const matchesRefundStatus = appliedFilters.refundStatusFilter === '全部' || d.refundStatus === appliedFilters.refundStatusFilter;
          return matchesSearch && matchesStartDate && matchesEndDate && matchesRefundStatus;
        }).length}
      />

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
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
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                      <Wallet size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{isEditing ? '修改保证金信息' : '登记保证金'}</h3>
                  </div>
                  <button 
                    onClick={() => setShowDepositModal(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="p-10 flex-1 flex flex-col overflow-hidden">
                  <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">关联投标项目</label>
                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                          {formData.projectName || '未关联项目'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">缴纳金额 <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.amount ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`} 
                            placeholder="¥ 0.00" 
                          />
                          {hasAttemptedSave && !formData.amount && (
                            <div className="absolute right-4 text-red-500">
                              <AlertCircle size={16} className="fill-red-500 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">缴纳方式 <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center">
                          <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.type ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`}
                          >
                            <option value="">请选择</option>
                            <option>现金转账</option>
                            <option>银行保函</option>
                            <option>保险保函</option>
                          </select>
                          {hasAttemptedSave && !formData.type && (
                            <div className="absolute right-8 text-red-500">
                              <AlertCircle size={16} className="fill-red-500 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">缴纳银行 <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            value={formData.bank}
                            onChange={(e) => setFormData({...formData, bank: e.target.value})}
                            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.bank ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`} 
                            placeholder="请输入缴纳银行名称" 
                          />
                          {hasAttemptedSave && !formData.bank && (
                            <div className="absolute right-4 text-red-500">
                              <AlertCircle size={16} className="fill-red-500 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">缴纳时间 <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center">
                          <input 
                            type="date" 
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.date ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'}`} 
                          />
                          {hasAttemptedSave && !formData.date && (
                            <div className="absolute right-10 text-red-500">
                              <AlertCircle size={16} className="fill-red-500 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">退还状态 <span className="text-red-500">*</span></label>
                        <div className="flex gap-8 px-2 py-2">
                          {['待退还', '已退还'].map((status) => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="refundStatus"
                                  checked={formData.refundStatus === status}
                                  onChange={() => setFormData({...formData, refundStatus: status})}
                                  className="sr-only"
                                />
                                <div className={`size-5 rounded-full border-2 transition-all ${
                                  formData.refundStatus === status 
                                    ? 'border-primary bg-primary' 
                                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                                }`}>
                                  {formData.refundStatus === status && (
                                    <div className="size-2 bg-white rounded-full" />
                                  )}
                                </div>
                              </div>
                              <span className={`text-sm font-bold transition-colors ${
                                formData.refundStatus === status ? 'text-slate-900' : 'text-slate-500'
                              }`}>
                                {status}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {formData.refundStatus === '已退还' && (
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 ml-1">退还时间 <span className="text-red-500">*</span></label>
                          <input 
                            type="date" 
                            value={formData.refundDate}
                            onChange={(e) => setFormData({...formData, refundDate: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" 
                          />
                        </div>
                      )}

                      <div className="col-span-2 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2 text-slate-900 font-bold">
                            <Paperclip size={18} className="text-primary" />
                            <label className="text-sm">缴纳凭证附件 <span className="text-red-500">*</span></label>
                          </div>
                          <div className="relative">
                            <input 
                              type="file" 
                              multiple 
                              accept=".pdf,image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files) {
                                  const newVouchers = Array.from(files).map((f: any) => f.name);
                                  setFormData({...formData, vouchers: [...formData.vouchers, ...newVouchers]});
                                }
                              }}
                            />
                            <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-2">
                              <Upload size={14} /> 上传附件
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {formData.vouchers.map((v, idx) => (
                            <div key={idx} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  v.toLowerCase().endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                }`}>
                                  {v.toLowerCase().endsWith('.pdf') ? <File size={20} /> : <ImageIcon size={20} />}
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-sm font-bold text-slate-900 truncate" title={v}>{v}</p>
                                  <p className="text-[10px] text-slate-400 flex items-center gap-2">
                                    <span>2.4 MB</span>
                                    <span className="size-1 bg-slate-200 rounded-full" />
                                    <span>2024-03-24</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  onClick={() => setPreviewImage('https://picsum.photos/seed/voucher/800/1200')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                                >
                                  <Eye size={14} />
                                  查看
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData({
                                      ...formData,
                                      vouchers: formData.vouchers.filter((_, i) => i !== idx)
                                    });
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="删除"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          {formData.vouchers.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                              <Paperclip size={32} className="text-slate-300 mb-3" />
                              <p className="text-sm text-slate-400">暂无附件</p>
                              <p className="text-[10px] text-slate-400 mt-1">点击右上角按钮上传缴纳凭证</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">备注</label>
                        <textarea 
                          value={formData.remarks}
                          onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                          rows={3}
                          placeholder="请输入其他备注信息..."
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-8 mt-auto shrink-0 sticky bottom-0 bg-white pb-2">
                      <button 
                        onClick={handleSave} 
                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                      >
                        确认提交
                      </button>
                      <button 
                        onClick={() => setShowDepositModal(false)} 
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
                alt="Voucher Preview" 
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

export default SecurityDepositManagement;
