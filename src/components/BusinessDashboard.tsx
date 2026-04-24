import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Plus, FileText, Clock, Briefcase, Search, Filter, Download, Wallet, Tag, Eye, RotateCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import Pagination from './Pagination';

interface Project {
  id: string;
  name: string;
  code: string;
  tenderer: string;
  bidOpeningTime: string;
  status: string;
  deposit: string;
  tenderControlPrice?: string;
  [key: string]: any;
}

interface BusinessDashboardProps {
  currentEnterprise: { id: string; name: string };
  projects: Project[];
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ currentEnterprise, projects }) => {
  const [selectedYear, setSelectedYear] = useState<string>('全部');
  const [trendViewType, setTrendViewType] = useState<'month' | 'year'>('month');
  const [trendSelectedYear, setTrendSelectedYear] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const yearOptions = ['全部', '2028', '2027', '2026'];

  // 1. Calculate Stats
  const stats = useMemo(() => {
    const filteredProjects = selectedYear === '全部' 
      ? projects 
      : projects.filter(p => p.bidOpeningTime.includes(`${selectedYear}年`) || p.bidOpeningTime.startsWith(selectedYear));

    const totalCount = filteredProjects.length;
    const activeCount = filteredProjects.filter(p => p.status === '进行中').length;
    
    const parseDeposit = (d: string) => parseFloat(d.replace(/[^\d.]/g, '')) || 0;
    
    const totalDeposit = filteredProjects.reduce((sum, p) => sum + parseDeposit(p.deposit), 0);
    const pendingRefund = filteredProjects
      .filter(p => p.status === '进行中')
      .reduce((sum, p) => sum + parseDeposit(p.deposit), 0);

    return [
      { label: '项目总数', value: totalCount.toString(), unit: '个' },
      { label: '在投项目数', value: activeCount.toString(), unit: '个' },
      { label: '投标保证金总额', value: totalDeposit.toLocaleString('zh-CN', { minimumFractionDigits: 2 }), unit: '元' },
      { label: '待退还保证金金额', value: pendingRefund.toLocaleString('zh-CN', { minimumFractionDigits: 2 }), unit: '元' },
    ];
  }, [projects, selectedYear]);

  // 2. Status Distribution for Chart
  const statusDistribution = useMemo(() => {
    const filteredProjects = selectedYear === '全部' 
      ? projects 
      : projects.filter(p => p.bidOpeningTime.includes(`${selectedYear}年`) || p.bidOpeningTime.startsWith(selectedYear));

    const counts = {
      '进行中': 0,
      '已完成': 0,
      '已中标': 0, // Mocking some for variety if not present
      '未中标': 0
    };

    filteredProjects.forEach(p => {
      if (p.status === '进行中') counts['进行中']++;
      else if (p.status === '已完成') counts['已完成']++;
    });

    // Add some mock variety for the chart if real data is sparse
    const data = [
      { name: '进行中', value: counts['进行中'], color: '#3b82f6' },
      { name: '已完成', value: counts['已完成'], color: '#10b981' },
      { name: '已中标', value: Math.floor(counts['已完成'] * 0.4), color: '#ef4444' },
      { name: '未中标', value: Math.floor(counts['已完成'] * 0.6), color: '#94a3b8' },
    ];

    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    return data.map(item => ({
      ...item,
      percentage: total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'
    }));
  }, [projects, selectedYear]);

  // 3. Trend Data
  const trendData = useMemo(() => {
    if (trendViewType === 'year') {
      const years = ['2025', '2026', '2027', '2028'];
      return years.map(y => ({
        name: y,
        count: projects.filter(p => p.bidOpeningTime.includes(`${y}年`) || p.bidOpeningTime.startsWith(y)).length + (y === '2025' ? 5 : 0) // Mock 2025
      }));
    } else {
      const year = trendSelectedYear === '全部' ? '2026' : trendSelectedYear;
      return Array.from({ length: 12 }, (_, i) => {
        const monthNum = (i + 1).toString().padStart(2, '0');
        const monthStrZH = `${year}年${monthNum}月`;
        const monthStrISO = `${year}-${monthNum}`;
        return {
          name: `${i + 1}月`,
          count: projects.filter(p => p.bidOpeningTime.includes(monthStrZH) || p.bidOpeningTime.startsWith(monthStrISO)).length
        };
      });
    }
  }, [projects, trendViewType, trendSelectedYear]);

  // 4. Filtered and Sorted Projects List
  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => {
      const matchesYear = selectedYear === '全部' || p.bidOpeningTime.startsWith(selectedYear);
      const matchesSearch = p.name.includes(searchQuery) || p.code.includes(searchQuery) || p.tenderer.includes(searchQuery);
      return matchesYear && matchesSearch;
    });

    // Sort by bidOpeningTime descending
    return result.sort((a, b) => new Date(b.bidOpeningTime).getTime() - new Date(a.bidOpeningTime).getTime());
  }, [projects, selectedYear, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-primary" size={24} />
            业务数据仪表盘
          </h3>
          <p className="text-xs text-slate-400 mt-1">监控企业投标动态与核心业务指标</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500">年度筛选:</span>
            <div className="flex items-center gap-1">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                    selectedYear === year
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">{stat.value}</span>
              <span className="text-xs font-bold text-slate-400">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold text-slate-700">投标状态分布</h4>
            <Tag size={14} className="text-slate-300" />
          </div>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                {statusDistribution.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">总投标数</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {statusDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-700">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-700">投标趋势分析</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">查看不同时间维度的投标活跃度</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button
                  onClick={() => setTrendViewType('month')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                    trendViewType === 'month'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  月度
                </button>
                <button
                  onClick={() => setTrendViewType('year')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                    trendViewType === 'year'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  年度
                </button>
              </div>
              {trendViewType === 'month' && (
                <select
                  value={trendSelectedYear}
                  onChange={(e) => setTrendSelectedYear(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:ring-1 focus:ring-primary/20"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year === '全部' ? '全部年份' : year + '年'}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorTrend)" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bid Details */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              投标明细
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 italic">查看并管理所有投标项目的详细信息</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索项目名称、编号或招标人..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">项目编号</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">项目名称</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">招标人</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">招标控制价</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">项目进度</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">开标时间</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.length > 0 ? filteredProjects
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((project, i) => {
                const progress = project.status === '已完成' ? 100 : (project.progress || 45 + (i * 7) % 40);
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{project.code}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700 group-hover:text-primary transition-colors">{project.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{project.tenderer}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600 font-mono">{project.tenderControlPrice || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 font-mono">{progress}%</span>
                          <span className={`text-[9px] font-bold ${project.status === '已完成' ? 'text-emerald-500' : 'text-primary'}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className={`h-full rounded-full ${
                              project.status === '已完成' ? 'bg-emerald-500' : 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      {project.bidOpeningTime}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                          title="查看招标文件"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                          title="下载招标文件"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                    暂无匹配的项目数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProjects.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={filteredProjects.length}
        />
      </div>
    </motion.div>
  );
};

export default BusinessDashboard;
