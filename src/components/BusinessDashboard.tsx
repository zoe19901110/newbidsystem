import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Plus, FileText, Clock, Briefcase, Search, Filter, Download, Wallet, Tag, Eye, RotateCw, Users } from 'lucide-react';
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
  tenderAgent?: string;
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
  const yearOptions = ['全部', '2026', '2025', '2024'];

  // 1. Calculate Stats
  const stats = useMemo(() => {
    const filteredProjects = selectedYear === '全部' 
      ? projects 
      : projects.filter(p => p.bidOpeningTime.includes(`${selectedYear}年`) || p.bidOpeningTime.startsWith(selectedYear));

    const totalCount = filteredProjects.length;
    const activeCount = filteredProjects.filter(p => p.status === '进行中' || p.status === '投标中').length;
    
    const parseDeposit = (d: string) => parseFloat(d.replace(/[^\d.]/g, '')) || 0;
    
    const totalDeposit = filteredProjects.reduce((sum, p) => sum + parseDeposit(p.deposit), 0);
    const pendingRefund = filteredProjects
      .filter(p => p.status === '进行中' || p.status === '投标中')
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
      '未投标': 0,
      '投标中': 0,
      '已开标': 0,
      '放弃投标': 0,
      '已中标': 0
    };

    filteredProjects.forEach(p => {
      if (p.status === '放弃投标') {
        counts['放弃投标']++;
      } else if (p.status === '已中标') {
        counts['已开标']++;
        counts['已中标']++;
      } else if (p.status === '已完成' || p.status === '已开标') {
        counts['已开标']++;
      } else if (p.status === '进行中' || p.status === '投标中') {
        // 根据进度区分未投标和进行中
        const progress = p.progress || 45;
        if (progress < 40) counts['未投标']++;
        else counts['投标中']++;
      }
    });

    // 为图表提供数据，包含副标题逻辑
    const openedCount = 20;
    const wonCount = 5;
    const winRate = 25;

    const data = [
      { name: '未投标', value: 3, color: '#f59e0b' },
      { name: '投标中', value: 10, color: '#3b82f6' },
      { name: '已开标', value: openedCount, color: '#10b981', info: `中标: ${wonCount}个 | 中标率: ${winRate}%` },
      { name: '放弃投标', value: 2, color: '#94a3b8' },
    ];

    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    return {
      chartData: data.map(item => ({
        ...item,
        percentage: total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'
      })),
      wonCount,
      winRate
    };
  }, [projects, selectedYear]);

  const { chartData, wonCount, winRate } = statusDistribution;

  // 3. Trend Data
  const trendData = useMemo(() => {
    if (trendViewType === 'year') {
      const years = ['2024', '2025', '2026'];
      return years.map(y => ({
        name: y,
        count: projects.filter(p => p.bidOpeningTime.includes(`${y}年`) || p.bidOpeningTime.startsWith(y)).length + (y === '2024' ? 5 : 0), // Mock 2024
        amount: Math.floor(Math.random() * 5000) + 1500 // Mock amount in millions
      }));
    } else {
      const year = selectedYear !== '全部' ? selectedYear : (trendSelectedYear === '全部' ? '2026' : trendSelectedYear);
      return Array.from({ length: 12 }, (_, i) => {
        const monthNum = (i + 1).toString().padStart(2, '0');
        const monthStrZH = `${year}年${monthNum}月`;
        const monthStrISO = `${year}-${monthNum}`;
        return {
          name: `${i + 1}月`,
          count: projects.filter(p => p.bidOpeningTime.includes(monthStrZH) || p.bidOpeningTime.startsWith(monthStrISO)).length,
          amount: Math.floor(Math.random() * 800) + 200 // Mock amount in millions
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

  // 5. Top Tenderers
  const topTenderers = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProjects.forEach(p => {
      counts[p.tenderer] = (counts[p.tenderer] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredProjects]);

  // 6. In-progress Projects for Detail Table
  const inProgressProjects = useMemo(() => {
    return filteredProjects.filter(p => {
      const progress = (p.status === '已完成' || p.status === '已开标' || p.status === '已中标') ? 100 : (p.progress || 45);
      const displayStatus = (p.status === '进行中' || p.status === '投标中') 
                            ? (progress < 40 ? '未投标' : '投标中')
                            : (p.status === '已完成' || p.status === '已中标') ? '已开标' : p.status;
      return displayStatus === '投标中';
    });
  }, [filteredProjects]);

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
                  onClick={() => {
                    setSelectedYear(year);
                    if (year !== '全部') setTrendViewType('month');
                  }}
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
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold text-slate-700">投标状态分布</h4>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm shrink-0">
                <TrendingUp size={12} />
                <span className="text-[9px] font-black whitespace-nowrap">中标率 {winRate}%</span>
              </div>
              <Tag size={14} className="text-slate-300" />
            </div>
          </div>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
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
                {chartData.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">总投标数</span>
            </div>
          </div>
          
          <div className="sm:hidden flex items-center justify-center mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <TrendingUp size={12} />
              <span className="text-[10px] font-bold whitespace-nowrap">中标: {wonCount}个 | 中标率: {winRate}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            {chartData.map((item, i) => {
              const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
              const percentage = Math.round((item.value / totalValue) * 100);
              return (
                <div key={i} className="flex flex-col p-2.5 rounded-lg bg-slate-50/50 border border-slate-100/50 group/legend relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover/legend:text-slate-600 transition-colors">
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{item.value}个项目</span>
                    {item.name === '已开标' && (
                      <span className="text-[9px] font-bold text-emerald-500 tracking-tighter">中标{wonCount}</span>
                    )}
                  </div>
                </div>
              );
            })}
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
              {selectedYear === '全部' && (
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
              )}
              {selectedYear === '全部' && trendViewType === 'month' && (
                <select
                  value={trendSelectedYear}
                  onChange={(e) => setTrendSelectedYear(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:ring-1 focus:ring-primary/20"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year === '全部' ? '选择年份' : year + '年'}</option>
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

      {/* In-progress Projects Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              投标中的项目明细
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 italic">当前正在进行中的投标项目清单 ({inProgressProjects.length}个)</p>
          </div>

        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">项目编号</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">项目名称</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">招标人</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">招标代理</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">开标时间</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">项目状态</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inProgressProjects.length > 0 ? inProgressProjects.map((project, i) => {
                const progress = project.progress || 45;
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono whitespace-nowrap">{project.code}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700 group-hover:text-primary transition-colors max-w-[200px] truncate">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 truncate max-w-[150px]">{project.tenderer}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">
                      {project.tenderAgent || '华伦中建建设股份有限公司'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {project.bidOpeningTime}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary whitespace-nowrap">投标中</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-bold border border-primary/10 transition-all group/btn">
                          <RotateCw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                          进入工作台
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                    暂无处于“投标中”状态的项目
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessDashboard;
