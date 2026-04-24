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
  ChevronDown,
  Paperclip,
  File,
  Image as ImageIcon,
  Trash2,
  Upload,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTableResizer } from '../hooks/useTableResizer';

interface PostBidArchivingProps {
  currentEnterprise?: { id: string; name: string };
  projects?: any[];
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image';
  date: string;
}

const PostBidArchiving: React.FC<PostBidArchivingProps> = ({ currentEnterprise, projects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { widths, onMouseDown } = useTableResizer([
    'auto', // 项目名称
    120,    // 开标日期
    150,    // 投标报价
    120,    // 单位数量
    150,    // 合同履行状态
    120     // 操作
  ]);

  const { widths: openingWidths, onMouseDown: onOpeningMouseDown } = useTableResizer([
    'auto', // 参标单位
    180,    // 投标报价
    100,    // 排名
    100,    // 是否中标
    100     // 是否本单位
  ]);

  const { widths: winningWidths, onMouseDown: onWinningMouseDown } = useTableResizer([
    'auto', // 中标单位
    180,    // 中标金额
    150,    // 通知书日期
    200     // 公示链接
  ]);

  const { widths: contractWidths, onMouseDown: onContractMouseDown } = useTableResizer([
    220,    // 合同编号/名称
    140,    // 签署日期
    130,    // 合同金额
    100,    // 负责人
    80,     // 工期
    140,    // 履行时间
    140,    // 应当完成时间
    110,    // 履行状态
    60      // 操作
  ]);

  const handleOpenModal = (record?: any) => {
    // Check if the project is paused
    const project = projects.find(p => p.code === record?.projectCode || p.name === record?.projectName);
    if (project?.status === '放弃投标') {
      alert('此项目已暂停');
      return;
    }
    
    if (record) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    setShowAddModal(true);
  };

  // Modal State
  const [isEditing, setIsEditing] = useState(true);
  const [openingRecords, setOpeningRecords] = useLocalStorage('postBid_openingRecords', [
    { units: '某某建设集团有限公司', price: 12105000, rank: '1', isWinner: true, isSelf: true },
    { units: '中建某局有限公司', price: 12500000, rank: '2', isWinner: false, isSelf: false },
    { units: '省建工集团', price: 12800000, rank: '3', isWinner: false, isSelf: false },
  ]);
  const [winningRecords, setWinningRecords] = useLocalStorage('postBid_winningRecords', [
    { unit: '某某建设集团有限公司', amount: 12105000, date: '2026-03-25', url: 'http://ggzy.example.com/...' },
  ]);
  const [contractRecords, setContractRecords] = useLocalStorage('postBid_contractRecords', [
    { id: 'HT-2026-001', name: '城市基础设施施工合同', date: '2026-04-05', amount: 11800000, owner: '陈经理', duration: '30', status: '履行中', fulfillmentDate: '2026-04-10', expectedCompletionDate: '2026-05-10' },
  ]);
  const [contractAttachments, setContractAttachments] = useLocalStorage<Attachment[]>('postBid_contractAttachments', [
    { id: '1', name: '中标通知书.pdf', size: '1.2MB', type: 'pdf', date: '2026-03-25' },
    { id: '2', name: '施工合同扫描件.jpg', size: '2.4MB', type: 'image', date: '2026-04-05' },
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

  const [records, setRecords] = useLocalStorage<any[]>('postBid_records', []);

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
          { label: '本月需归档项目', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '已归档项目', value: '6', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '归档完成率', value: '50%', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
          { label: '待归档项目', value: '6', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
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
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-56 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索项目名称..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-40 relative group">
            <select 
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium"
            >
              <option value="全部">全部结果</option>
              <option value="中标">中标</option>
              <option value="未中标">未中标</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-8 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 shadow-sm hover:shadow-md transition-all">
            查询
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
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
                    <span className="truncate block">{col.label}</span>
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
              {records.map((record) => (
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
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
                        projects.find(p => p.code === record.projectCode || p.name === record.projectName)?.status === '放弃投标'
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : record.hasOpeningInfo 
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/10' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {record.hasOpeningInfo ? <Edit3 size={14} /> : <Plus size={14} />}
                      {record.hasOpeningInfo ? '修改记录' : '新增记录'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                      <ClipboardList size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">标后归档详情</h3>
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
                      onClick={() => {
                        if (isEditing) {
                          // Validate opening records
                          for (let i = 0; i < openingRecords.length; i++) {
                            const record = openingRecords[i];
                            if (!record.units) {
                              alert(`开标记录第 ${i + 1} 行：请填写参标单位`);
                              return;
                            }
                            if (record.price === '' || record.price === null || record.price === undefined) {
                              alert(`开标记录第 ${i + 1} 行：请填写投标报价`);
                              return;
                            }
                            if (!record.rank) {
                              alert(`开标记录第 ${i + 1} 行：请填写排名`);
                              return;
                            }
                          }
                          
                          if (openingRecords.length > 0 && !openingRecords.some(r => r.isSelf)) {
                             alert('开标记录：请选择本单位');
                             return;
                          }

                          setIsEditing(false);
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        isEditing ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                      {isEditing ? '保存修改' : '修改记录'}
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

                    {/* Opening & Winning Records Section */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Trophy size={20} className="text-primary" />
                          <h4 className="text-lg">开标与中标记录</h4>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between w-full">
                          <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2 whitespace-nowrap">
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
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse table-fixed">
                              <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[12px] font-bold border-b border-slate-200">
                                  {[
                                    { label: '参标单位', key: 'units', required: true },
                                    { label: '投标报价（元）', key: 'price', required: true },
                                    { label: '排名', key: 'rank', required: true },
                                    { label: '是否中标', key: 'isWinner', required: true, align: 'center' },
                                    { label: '是否本单位', key: 'isSelf', required: true, align: 'center' },
                                    ...(isEditing ? [{ label: '操作', key: 'action', align: 'center' }] : [])
                                  ].map((col, idx) => (
                                    <th 
                                      key={col.key} 
                                      style={col.key === 'action' ? { width: '80px' } : { width: openingWidths[idx] }}
                                      className={`px-6 py-4 relative group/th ${col.align === 'center' ? 'text-center' : ''} ${col.key === 'action' ? 'whitespace-nowrap' : ''}`}
                                    >
                                      <span className="truncate block">
                                        {col.label} {col.required && <span className="text-red-500">*</span>}
                                      </span>
                                      {idx < 4 && col.key !== 'action' && (
                                        <div 
                                          onMouseDown={(e) => onOpeningMouseDown(idx, e)}
                                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary transition-colors z-10"
                                        />
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {openingRecords.map((row, i) => (
                                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          value={row.units} 
                                          onChange={(e) => updateOpening(i, 'units', e.target.value)}
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                                        />
                                      ) : (
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <span className={`text-sm font-bold truncate ${row.isWinner ? 'text-emerald-700' : 'text-slate-600'}`} title={row.units}>
                                            {row.units || '--'}
                                          </span>
                                          {row.isSelf && <span className="shrink-0 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px]">本单位</span>}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          type="number"
                                          value={row.price} 
                                          onChange={(e) => updateOpening(i, 'price', parseFloat(e.target.value) || 0)}
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                                        />
                                      ) : (
                                        <div className="truncate font-mono text-sm text-primary font-bold" title={formatCurrency(row.price)}>
                                          {formatCurrency(row.price)}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          value={row.rank} 
                                          onChange={(e) => updateOpening(i, 'rank', e.target.value)}
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                                        />
                                      ) : (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${row.rank === '1' ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                                          {row.rank ? `第${row.rank}名` : '--'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-center overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          type="radio"
                                          name="isWinner"
                                          checked={row.isWinner}
                                          onChange={() => updateOpening(i, 'isWinner', true)}
                                          className="size-4 cursor-pointer"
                                        />
                                      ) : (
                                        row.isWinner && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold shrink-0">中标单位</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-center overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          type="radio"
                                          name="isSelf"
                                          checked={row.isSelf}
                                          onChange={() => updateOpening(i, 'isSelf', true)}
                                          className="size-4 cursor-pointer"
                                        />
                                      ) : (
                                        row.isSelf && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold shrink-0">是</span>
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
                        {/* Removed button from here */}
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Trophy size={16} className="text-emerald-500" />
                          中标详情
                        </h5>
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse table-fixed">
                              <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[12px] font-bold border-b border-slate-200">
                                  {[
                                    { label: '中标单位', key: 'unit' },
                                    { label: '中标金额（元）', key: 'amount' },
                                    { label: '通知书日期', key: 'date' },
                                    { label: '公示链接', key: 'url' }
                                  ].map((col, idx) => (
                                    <th 
                                      key={col.key} 
                                      style={{ width: winningWidths[idx] }}
                                      className="px-6 py-4 relative group/th"
                                    >
                                      <span className="truncate block">{col.label}</span>
                                      {idx < 3 && (
                                        <div 
                                          onMouseDown={(e) => onWinningMouseDown(idx, e)}
                                          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary transition-colors z-10"
                                        />
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {winningRecords.map((row, i) => (
                                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          value={row.unit} 
                                          readOnly
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                                          placeholder="自动获取中标单位"
                                        />
                                      ) : (
                                        <span className="font-bold text-slate-900 text-sm truncate block" title={row.unit}>{row.unit || '--'}</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          type="number"
                                          value={row.amount} 
                                          readOnly
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                                          placeholder="0.00"
                                        />
                                      ) : (
                                        <span className="font-mono text-sm text-green-600 font-bold truncate block" title={formatCurrency(row.amount)}>{formatCurrency(row.amount)}</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          type="date"
                                          value={row.date} 
                                          onChange={(e) => updateWinning(i, 'date', e.target.value)}
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                                        />
                                      ) : (
                                        <span className="text-sm text-slate-600 truncate block" title={row.date}>{row.date || '--'}</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 overflow-hidden">
                                      {isEditing ? (
                                        <input 
                                          value={row.url} 
                                          onChange={(e) => updateWinning(i, 'url', e.target.value)}
                                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs text-primary outline-none focus:border-primary transition-colors"
                                          placeholder="http://..."
                                        />
                                      ) : (
                                        <a href={row.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1 truncate block" title={row.url}>
                                          查看公示 <ArrowRight size={12} className="shrink-0" />
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Contract Archiving Section */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Receipt size={20} className="text-primary" />
                          <h4 className="text-lg">合同归档</h4>
                        </div>
                        {isEditing && (
                          <button 
                            onClick={() => setContractRecords([...contractRecords, { id: '', name: '', date: '', amount: '', owner: '', duration: '', status: '未开始', fulfillmentDate: '', expectedCompletionDate: '' }])}
                            className="text-sm font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
                          >
                            <Plus size={18} /> 添加合同
                          </button>
                        )}
                      </div>
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                              {[
                                { label: '合同编号/名称', key: 'name' },
                                { label: '签署日期', key: 'date' },
                                { label: '合同金额（元）', key: 'amount' },
                                { label: '负责人', key: 'owner' },
                                { label: '工期（天）', key: 'duration' },
                                { label: '履行时间', key: 'fulfillmentDate' },
                                { label: '应当完成时间', key: 'expectedCompletionDate' },
                                { label: '履行状态', key: 'status' },
                                ...(isEditing ? [{ label: '操作', key: 'action', align: 'right' }] : [])
                              ].map((col, idx) => (
                                <th 
                                  key={col.key} 
                                  style={{ width: contractWidths[idx] }}
                                  className={`px-3 py-3 relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                                >
                                  <span className="truncate block">{col.label}</span>
                                  {idx < (isEditing ? 8 : 7) && (
                                    <div 
                                      onMouseDown={(e) => onContractMouseDown(idx, e)}
                                      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary transition-colors z-10"
                                    />
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {contractRecords.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-3 py-3 overflow-hidden">
                                  {isEditing ? (
                                    <div className="space-y-1 overflow-hidden">
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
                                    <div className="overflow-hidden">
                                      <p className="text-sm font-bold text-slate-900 truncate" title={row.name}>{row.name || '--'}</p>
                                      <p className="text-[10px] text-slate-400 truncate" title={row.id}>{row.id || '--'}</p>
                                    </div>
                                  )}
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  {isEditing ? (
                                    <input 
                                      type="date"
                                      value={row.date} 
                                      onChange={(e) => updateContract(i, 'date', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600 truncate block" title={row.date}>{row.date || '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  {isEditing ? (
                                    <input 
                                      type="number"
                                      value={row.amount} 
                                      onChange={(e) => updateContract(i, 'amount', parseFloat(e.target.value) || 0)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm font-mono font-bold outline-none focus:border-primary"
                                      placeholder="0.00"
                                    />
                                  ) : (
                                    <span className="font-mono text-sm text-slate-900 font-bold truncate block" title={formatCurrency(row.amount)}>{formatCurrency(row.amount)}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  {isEditing ? (
                                    <input 
                                      value={row.owner} 
                                      onChange={(e) => updateContract(i, 'owner', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                      placeholder="负责人"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600 truncate block" title={row.owner}>{row.owner || '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  {isEditing ? (
                                    <input 
                                      type="number"
                                      value={row.duration} 
                                      onChange={(e) => updateContract(i, 'duration', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                      placeholder="天数"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600 truncate block" title={row.duration ? `${row.duration}天` : '--'}>{row.duration ? `${row.duration}天` : '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  {isEditing ? (
                                    <input 
                                      type="date"
                                      value={row.fulfillmentDate} 
                                      onChange={(e) => updateContract(i, 'fulfillmentDate', e.target.value)}
                                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary"
                                    />
                                  ) : (
                                    <span className="text-sm text-slate-600 truncate block" title={row.fulfillmentDate}>{row.fulfillmentDate || '--'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
                                  <span className="text-sm text-slate-600 truncate block" title={row.expectedCompletionDate}>{row.expectedCompletionDate || '--'}</span>
                                </td>
                                <td className="px-3 py-3 overflow-hidden">
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
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold truncate block ${
                                      row.status === '已完成' ? 'bg-green-50 text-green-600' : 
                                      row.status === '已终止' ? 'bg-red-50 text-red-600' : 
                                      row.status === '逾期' ? 'bg-orange-50 text-orange-600' :
                                      row.status === '未开始' ? 'bg-slate-50 text-slate-500' :
                                      'bg-blue-50 text-blue-600'
                                    }`} title={row.status}>
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
                    <section className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Paperclip size={20} className="text-primary" />
                          <h4 className="text-lg">合同附件</h4>
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
                                      date: new Date().toISOString().split('T')[0]
                                    };
                                  });
                                  setContractAttachments([...contractAttachments, ...newAttachments]);
                                }
                              }}
                            />
                            <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-2">
                              <Upload size={14} /> 上传附件
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contractAttachments.map((file) => (
                          <div 
                            key={file.id} 
                            className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                                file.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                              }`}>
                                {file.type === 'pdf' ? <File size={20} /> : <ImageIcon size={20} />}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 truncate" title={file.name}>{file.name}</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-2">
                                  <span>{file.size}</span>
                                  <span className="size-1 bg-slate-200 rounded-full" />
                                  <span>{file.date}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => setPreviewImage('https://picsum.photos/seed/contract/800/1200')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                              >
                                <Eye size={14} />
                                查看
                              </button>
                              <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                                <Download size={16} />
                              </button>
                              {isEditing && (
                                <button 
                                  onClick={() => setContractAttachments(contractAttachments.filter(a => a.id !== file.id))}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {contractAttachments.length === 0 && (
                          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <Paperclip size={32} className="text-slate-300 mb-3" />
                            <p className="text-sm text-slate-400">暂无附件</p>
                            {isEditing && <p className="text-[10px] text-slate-400 mt-1">点击右上角按钮上传合同附件</p>}
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  <div className="flex gap-4 pt-8 shrink-0 bg-white">
                    <button 
                      onClick={() => {
                        // Validate opening records
                        for (let i = 0; i < openingRecords.length; i++) {
                          const record = openingRecords[i];
                          if (!record.units) {
                            alert(`开标记录第 ${i + 1} 行：请填写参标单位`);
                            return;
                          }
                          if (record.price === '' || record.price === null || record.price === undefined) {
                            alert(`开标记录第 ${i + 1} 行：请填写投标报价`);
                            return;
                          }
                          if (!record.rank) {
                            alert(`开标记录第 ${i + 1} 行：请填写排名`);
                            return;
                          }
                        }

                        // Validate winning records
                        if (openingRecords.length > 0 && !openingRecords.some(r => r.isSelf)) {
                           alert('开标记录：请选择本单位');
                           return;
                        }

                        setShowAddModal(false);
                      }} 
                      className="flex-1 py-2.5 bg-[#0052d9] text-white rounded-lg font-bold hover:bg-[#0052d9]/90 transition-all"
                    >
                      保存
                    </button>
                    <button 
                      onClick={() => setShowAddModal(false)} 
                      className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-all"
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

export default PostBidArchiving;
