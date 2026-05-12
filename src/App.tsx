import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import BusinessDashboard from './components/BusinessDashboard';
import Workbench from './components/Workbench';
import BidParsing from './components/BidParsing';
import BidInspection from './components/BidInspection';
import OrgStructure from './components/OrgStructure';
import TenderProjectRegistration from './components/TenderProjectRegistration';
import SecurityDepositManagement from './components/SecurityDepositManagement';
import TenderOpeningStatusManagement from './components/TenderOpeningStatusManagement';
import OtherProjectMaterials from './components/OtherProjectMaterials';
import PersonalCenter from './components/PersonalCenter';
import EnterpriseInfo from './components/EnterpriseInfo';
import Certificates from './components/Certificates';
import Materials from './components/Materials';
import Login from './components/Login';

import { motion, AnimatePresence } from 'motion/react';
import { User, Building2, FileText, CheckCircle2, AlertTriangle, Search, RotateCcw, ZoomIn, ZoomOut, ChevronUp, ChevronDown, Menu, Info, ShieldAlert, ListChecks, ArrowLeft, Loader2, Maximize2, Home, Zap, UploadCloud, ChevronRight, Edit3 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';

const BidCreationView: React.FC<{ projects: any[] }> = ({ projects }) => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('projectId');
  const project = projects.find(p => p.id === projectId) || (projectId ? { name: projectId } : null);

  const [step, setStep] = useState(1);
  const [isPreloaded, setIsPreloaded] = useState(true); // Auto-fill 招标文件

  return (
    <div className="min-h-screen bg-[#F3F6F9] flex flex-col overflow-hidden">
       {/* Top Bar */}
       <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => window.close()}
                className="size-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
             >
                <Home size={18} />
             </button>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">资信标文件</span>
                <span className="text-[10px] text-slate-400 font-bold">最近修改：-</span>
             </div>
          </div>

          <div className="flex items-center gap-12">
             {[
               { num: 1, label: '创建投标项目', active: step === 1 },
               { num: 2, label: '填写投标信息', active: step === 2 },
               { num: 3, label: '生成文件内容', active: step === 3 },
             ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                   <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${s.active ? 'bg-[#0052CC] text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                      {s.num}
                   </div>
                   <span className={`text-xs font-bold ${s.active ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                   {s.num < 3 && <div className="w-10 h-px border-t border-dashed border-slate-300 ml-2" />}
                </div>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">剩余</span>
                <span className="text-sm font-black text-amber-600">2523110</span>
                <span className="text-[10px] font-bold text-slate-400">字</span>
             </div>
             <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <RotateCcw size={14} />
             </button>
             <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black flex items-center gap-1 cursor-pointer hover:bg-amber-200 transition-colors">
                <Zap size={10} fill="currentColor" />
                充值
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Left Panel: 招标文件 */}
          <div className="w-1/3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
             <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-1 h-3 bg-[#0052CC] rounded-full" />
                <h2 className="text-xs font-black text-slate-800">招标文件</h2>
             </div>
             <div className="flex-1 flex flex-col items-center justify-center p-8">
                {isPreloaded ? (
                   <div className="w-full h-full flex flex-col">
                      <div className="flex-1 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 group hover:border-[#0052CC]/50 transition-all cursor-pointer">
                         <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-[#0052CC]">
                            <FileText size={32} />
                         </div>
                         <p className="text-xs font-black text-slate-800 mb-1 leading-relaxed text-center">{project?.name || '招标文件.pdf'}</p>
                         <p className="text-[10px] font-bold text-slate-400">文件大小：4.2MB</p>
                         <button className="mt-6 px-6 py-2 bg-[#0052CC] text-white rounded-lg text-xs font-bold shadow-md shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                            重新上传
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="flex flex-col items-center">
                      <div className="size-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                         <UploadCloud size={32} />
                      </div>
                      <p className="text-xs font-bold text-slate-400 mb-4">导入招标文件</p>
                      <p className="text-[10px] text-slate-300 font-bold mb-8 text-center leading-relaxed">支持*Zf,*CF,pdf,docx,doc格式的招标文件</p>
                      <button className="px-6 py-2 bg-[#0052CC] text-white rounded-lg text-xs font-bold shadow-md shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                         导入文件
                      </button>
                   </div>
                )}
             </div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-y-auto custom-scrollbar shadow-sm">
             <div className="p-6 space-y-8">
                {/* 资信标组成部分模板 */}
                <section>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-3 bg-[#0052CC] rounded-full" />
                      <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide">资信标组成部分模板</h2>
                   </div>
                   <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-6">
                      <div className="flex items-center gap-8">
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="size-4 rounded-full border-2 border-[#0052CC] flex items-center justify-center">
                               <div className="size-2 bg-[#0052CC] rounded-full" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">手动导入商务标组成模板</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="size-4 rounded-full border-2 border-slate-200" />
                            <span className="text-xs font-bold text-slate-400 transition-colors group-hover:text-slate-500">根据招标文件页码获取</span>
                         </label>
                      </div>
                      <div className="bg-white border-2 border-dashed border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center group hover:border-[#0052CC]/30 transition-all cursor-pointer">
                         <div className="size-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-3">
                            <UploadCloud size={24} />
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 mb-4">支持doc、docx、PDF格式的文件，文件不超过50页</p>
                         <button className="px-4 py-1.5 bg-[#0052CC] text-white rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95">导入文件</button>
                      </div>
                   </div>
                </section>

                {/* 选择企业 */}
                <section>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                         <div className="w-1 h-3 bg-[#0052CC] rounded-full" />
                         <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide">选择企业</h2>
                      </div>
                      <button className="px-4 py-1.5 bg-[#0052CC] text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all">加入企业</button>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-[#0052CC]/30 bg-blue-50/10 flex items-center justify-between group cursor-pointer hover:bg-blue-50/20 transition-all">
                         <div className="flex flex-col gap-1">
                            <div className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-sm w-fit mb-1">上次使用</div>
                            <h3 className="text-sm font-black text-slate-800">111测试</h3>
                            <p className="text-[10px] font-bold text-slate-400">社会信用代码：</p>
                         </div>
                         <div className="size-5 rounded-full border-2 border-[#0052CC] flex items-center justify-center shadow-lg shadow-blue-100 bg-white">
                            <div className="size-2.5 bg-[#0052CC] rounded-full" />
                         </div>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-[#0052CC]/30 transition-all">
                         <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-black text-slate-800 mt-5">上线运维测试有限公司</h3>
                            <p className="text-[10px] font-bold text-slate-400">社会信用代码：91999779974015331P</p>
                         </div>
                         <div className="size-5 rounded-full border-2 border-slate-200 bg-white group-hover:border-slate-300" />
                      </div>
                   </div>
                </section>

                {/* 招标项目信息 */}
                <section>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-3 bg-[#0052CC] rounded-full" />
                      <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide">招标项目信息</h2>
                   </div>
                   <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-1.5">
                         <label className="text-[10px] font-black text-slate-700">
                            <span className="text-rose-500 mr-1">*</span>招标项目名称
                         </label>
                         <input 
                            type="text" 
                            defaultValue={project?.name || ''}
                            placeholder="请输入"
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0052CC]/30 focus:bg-white transition-all"
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="grid grid-cols-1 gap-1.5">
                            <label className="text-[10px] font-black text-slate-700">
                               <span className="text-rose-500 mr-1">*</span>项目编号
                            </label>
                            <input 
                               type="text" 
                               defaultValue={project?.code || 'E4502002821021082'}
                               placeholder="请输入"
                               className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0052CC]/30 focus:bg-white transition-all"
                            />
                         </div>
                         <div className="grid grid-cols-1 gap-1.5">
                            <label className="text-[10px] font-black text-slate-700">
                               <span className="text-rose-500 mr-1">*</span>招标人
                            </label>
                            <input 
                               type="text" 
                               defaultValue={project?.tenderer || '柳州市龙杯水库管理所'}
                               placeholder="请输入"
                               className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#0052CC]/30 focus:bg-white transition-all"
                            />
                         </div>
                      </div>
                   </div>
                </section>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-center shrink-0">
          <button 
            onClick={() => setStep(2)}
            className="px-12 py-2 bg-[#0052CC] text-white rounded-lg text-sm font-black shadow-lg shadow-blue-200 flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
          >
             下一步
             <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
       </div>
    </div>
  );
};

const BidRewriteView: React.FC<{ projects: any[] }> = ({ projects }) => {
  const [step, setStep] = useState(1);
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
       {/* Top Bar */}
       <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => window.close()}
                className="size-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
             >
                <Home size={18} />
             </button>
             <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800">标书改写</span>
                  <Edit3 size={12} className="text-blue-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">最近修改：-</span>
             </div>
          </div>

          <div className="flex items-center gap-8">
             {[
               { num: 1, label: '上传文件', active: step === 1 },
               { num: 2, label: '选择方向', active: step === 2 },
               { num: 3, label: '改写中', active: step === 3 },
               { num: 4, label: '完成', active: step === 4 },
             ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                   <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${s.active ? 'bg-[#0052CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                      {s.num}
                   </div>
                   <span className={`text-[11px] font-bold ${s.active ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                   {s.num < 4 && <div className="w-6 h-px border-t border-dashed border-slate-300 ml-1" />}
                </div>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">剩余</span>
                <span className="text-sm font-black text-[#FF8A00]">2523110</span>
                <span className="text-[10px] font-bold text-slate-400">字</span>
             </div>
             <button className="text-slate-300 hover:text-slate-500 transition-colors">
                <RotateCcw size={14} />
             </button>
             <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black flex items-center gap-1 cursor-pointer hover:bg-amber-200 transition-colors">
                <Zap size={10} fill="currentColor" />
                充值
             </div>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center bg-[#F8FAFC]">
          <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">上传原始文件</h2>
          
          <div className="w-full max-w-4xl px-8">
             <div className="bg-white rounded-3xl border-2 border-dashed border-blue-500/50 p-12 flex flex-col items-center justify-center gap-6 group hover:border-blue-500 transition-all cursor-pointer shadow-2xl shadow-blue-500/5">
                <div className="size-24 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                   <UploadCloud size={48} />
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                   <span className="text-slate-400">拖拽文件至此处或</span>
                   <span className="text-blue-500 hover:underline">点击上传</span>
                </div>
                <p className="text-xs font-bold text-slate-300">支持格式: Word (.doc/.docx) , 最大20MB</p>
             </div>
          </div>
          
          {/* Footer controls inside main for centering */}
          <div className="mt-16">
             <button 
               disabled={step === 1}
               className={`px-16 py-3 rounded-xl text-sm font-black transition-all ${step === 1 ? 'bg-blue-200 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-xl shadow-blue-200'}`}
             >
                下一步
             </button>
          </div>
       </div>
    </div>
  );
};

const TechnicalBidCreationView: React.FC<{ projects: any[] }> = ({ projects }) => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('projectId');
  const project = projects.find(p => p.id === projectId) || (projectId ? { name: projectId } : null);

  const [step, setStep] = useState(1);
  const [isPreloaded, setIsPreloaded] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-hidden font-sans">
       {/* Top Bar */}
       <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => window.close()}
                className="size-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
             >
                <Home size={18} />
             </button>
             <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800">技术标文件</span>
                  <FileText size={12} className="text-blue-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">最近修改：-</span>
             </div>
          </div>

          <div className="flex items-center gap-8">
             {[
               { num: 1, label: '创建投标方案', active: step === 1 },
               { num: 2, label: '确认招标要求', active: step === 2 },
               { num: 3, label: '生成目录', active: step === 3 },
               { num: 4, label: '生成正文', active: step === 4 },
             ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                   <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${s.active ? 'bg-primary text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                      {s.num}
                   </div>
                   <span className={`text-[11px] font-bold ${s.active ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                   {s.num < 4 && <div className="w-6 h-px border-t border-dashed border-slate-300 ml-1" />}
                </div>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">剩余</span>
                <span className="text-sm font-black text-slate-800">2523110</span>
                <span className="text-[10px] font-bold text-slate-400">字</span>
             </div>
             <button className="text-slate-300 hover:text-slate-500 transition-colors">
                <RotateCcw size={14} />
             </button>
             <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black flex items-center gap-1 cursor-pointer hover:bg-amber-200 transition-colors">
                <Zap size={10} fill="currentColor" />
                充值
             </div>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/30 to-white">
          <div className="max-w-5xl mx-auto py-12 px-8">
             <div className="flex items-baseline gap-4 mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">标桥AI编标</h1>
                <p className="text-xl font-bold text-blue-500/80">上传项目文件，即刻开启AI编标之旅</p>
             </div>

             <div className="space-y-10">
                {/* File Upload Section */}
                <section>
                   <p className="text-sm font-bold text-slate-500 mb-4">导入招标文件</p>
                   <div className="relative group w-[320px]">
                      <div className="absolute -top-12 left-0 right-0 h-40 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-white rounded-2xl border-2 border-slate-100 p-1 shadow-xl shadow-slate-200/50">
                         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white flex flex-col items-center justify-center">
                            <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                               <FileText size={32} />
                            </div>
                            <span className="text-xs font-black mb-1">招标文件</span>
                         </div>
                         <div className="p-4 bg-blue-50/50 rounded-b-xl border-t border-slate-50">
                            <div className="flex items-center justify-between mb-4">
                               <p className="text-[10px] font-bold text-slate-400">支持doc、docx、pdf、zf格式的招标文件</p>
                               <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-[10px] font-bold">
                                  工程类 <ChevronDown size={10} />
                               </div>
                            </div>
                            <button className="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-200">
                               <UploadCloud size={16} /> 导入文件
                            </button>
                         </div>
                      </div>
                   </div>
                </section>

                {/* Scheme Name */}
                <section className="space-y-4">
                   <h2 className="text-sm font-bold text-slate-700">方案名称</h2>
                   <input 
                      type="text" 
                      placeholder="请输入方案名称" 
                      defaultValue={project?.name ? `${project.name}-技术标方案` : ''}
                      className="w-full bg-white border-2 border-slate-100 rounded-xl px-6 py-3 text-sm font-bold outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-300"
                   />
                </section>

                {/* Style Settings */}
                <section className="space-y-4">
                   <div className="flex items-center gap-3">
                      <h2 className="text-sm font-bold text-slate-700">文件样式设置</h2>
                      <button className="px-2 py-0.5 border border-blue-500 text-blue-500 rounded text-[10px] font-bold hover:bg-blue-50 transition-colors">
                         AI提取暗标格式
                      </button>
                   </div>
                   
                   <div className="bg-blue-50/50 rounded-2xl border border-blue-100/50 overflow-hidden">
                      <div className="flex items-center gap-4 px-6 py-3 border-b border-blue-100/30">
                         <span className="text-[11px] font-bold text-slate-500 w-20">文件样式方案</span>
                         <div className="flex-1 flex items-center justify-between">
                            <div className="relative flex-1 max-w-sm">
                               <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 text-[11px] font-bold text-slate-700 outline-none">
                                  <option>请选择样式方案</option>
                               </select>
                               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                            <button className="text-[11px] font-bold text-blue-500 hover:underline flex items-center gap-1">
                               保存方案 <Menu size={10} />
                            </button>
                         </div>
                      </div>
                      
                      <div className="p-8 grid grid-cols-2 gap-20 bg-white">
                         <div className="space-y-6">
                            <h3 className="text-[11px] font-bold text-slate-900 border-l-4 border-blue-500 pl-3">正文类型</h3>
                            <div className="flex items-center gap-12">
                               <div className="flex items-center gap-4">
                                  <span className="text-[11px] font-bold text-slate-500">生成表格</span>
                                  <div className="w-10 h-5 bg-blue-500 rounded-full relative p-1 cursor-pointer">
                                     <div className="size-3 bg-white rounded-full translate-x-5" />
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <span className="text-[11px] font-bold text-slate-500">图文并茂</span>
                                  <div className="w-10 h-5 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                                     <div className="size-3 bg-white rounded-full" />
                                  </div>
                               </div>
                            </div>
                         </div>
                         
                         <div className="space-y-6">
                            <h3 className="text-[11px] font-bold text-slate-900 border-l-4 border-blue-500 pl-3">正文文字</h3>
                            <div className="grid grid-cols-1 gap-4">
                               <div className="flex items-center gap-8">
                                  <div className="flex items-center gap-3">
                                     <span className="text-[11px] font-bold text-slate-500">字体</span>
                                     <div className="relative w-32">
                                        <select className="w-full appearance-none border border-slate-100 rounded bg-slate-50 px-3 py-1 text-[11px] font-bold outline-none">
                                           <option>宋体</option>
                                        </select>
                                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <span className="text-[11px] font-bold text-slate-500">字号</span>
                                     <div className="relative w-32">
                                        <select className="w-full appearance-none border border-slate-100 rounded bg-slate-50 px-3 py-1 text-[11px] font-bold outline-none">
                                           <option>小四</option>
                                        </select>
                                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                     </div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <span className="text-[11px] font-bold text-slate-500">加粗</span>
                                  <div className="flex items-center gap-6">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="size-4 rounded-full border-2 border-slate-200" />
                                        <span className="text-[11px] font-bold text-slate-400">是</span>
                                     </label>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="size-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                           <div className="size-2 bg-blue-500 rounded-full" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-800">否</span>
                                     </label>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </section>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="h-20 bg-white border-t border-slate-200 flex items-center justify-center shrink-0">
          <button 
            disabled 
            className="px-12 py-3 bg-slate-200 text-white rounded-lg text-sm font-black transition-all cursor-not-allowed"
          >
             下一步
          </button>
       </div>
    </div>
  );
};

const ParsingReportView: React.FC<{ projects: any[] }> = ({ projects }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  const [activeSubTab, setActiveSubTab] = useState('programmatic');

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('projectId');
  const project = projects.find(p => p.id === projectId) || projects[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-primary mb-6"
        >
          <Loader2 size={48} />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">正在深度解析招标文件...</h2>
        <p className="text-slate-400 font-bold animate-pulse">利用 AI 提取核心要素并进行合规性审查</p>
        
        {/* Fake progress bar */}
        <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F3F6F9] overflow-hidden">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.close()}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors pr-6 border-r border-slate-200"
          >
            <ArrowLeft size={14} />
            返回首页
          </button>
          <div className="flex items-center gap-8 overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">项目名称</span>
              <h1 className="text-xs font-black text-slate-800 truncate max-w-[300px]">{project?.name || '柳州市龙坏灌区续建配套与现代化改造项目'}</h1>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">项目编号</span>
              <span className="text-xs font-bold text-slate-600">{project?.code || 'E4502002821021082'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">招标人</span>
              <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{project?.tenderer || '柳州市龙杯水库管理所'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">招标代理</span>
              <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{project?.agent || '广西恒盛工程造价咨询有限公司'}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
          <RotateCcw size={14} />
          重新检查
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Tabs (Primary) */}
        <div className="w-auto bg-[#F3F6F9] border-r border-slate-200 flex flex-col py-4 gap-2 shrink-0 overflow-y-auto no-scrollbar px-3">
          {[
            { id: 'core', label: '核心内容', icon: Info },
            { id: 'risk', label: '风险分析', icon: ShieldAlert },
            { id: 'check', label: '自定义检查项', icon: ListChecks },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Detailed Left Panel */}
        <div className="w-[450px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          {/* Sub Navigation (Sidebar style) */}
          <div className="flex flex-1 overflow-hidden">
            <div className="w-24 bg-slate-50 border-r border-slate-100 flex flex-col py-4 gap-4 px-2 shrink-0">
              {[
                { id: 'programmatic', label: '程序性条款' },
                { id: 'commercial', label: '商务条款' },
                { id: 'technical', label: '技术要求' },
                { id: 'contract', label: '合同条款' },
                { id: 'evaluation', label: '评标标准' },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id)}
                  className={`py-2 px-1 rounded-md text-[10px] font-black leading-tight text-center transition-all ${
                    activeSubTab === subTab.id
                      ? 'bg-white text-primary shadow-sm border border-slate-100'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* List/Details Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-white">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded transition-colors">
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                      项目基本信息
                    </h3>
                    <ChevronUp size={14} className="text-slate-300" />
                  </div>
                  <div className="mt-4 space-y-px">
                     {[
                       { label: '关键词信息', value: '(必选)', isHeader: true },
                       { label: '项目名称', value: project?.name || '柳州市龙坏灌区续建配套与现代化改造项目' },
                       { label: '项目编号', value: project?.code || 'E4502002821021082' },
                       { label: '招标人', value: project?.tenderer || '柳州市龙杯水库管理所' },
                       { label: '招标代理', value: project?.agent || '广西恒盛工程造价咨询有限公司' },
                     ].map((item, i) => (
                       <div key={i} className={`flex items-stretch border border-slate-100 ${item.isHeader ? 'bg-blue-50/30' : ''}`}>
                         <div className={`w-32 px-3 py-2 text-[10px] font-bold text-slate-500 border-r border-slate-100 shrink-0 ${item.isHeader ? 'text-blue-600' : ''}`}>
                           {item.isHeader && <span className="mr-1 text-blue-500">●</span>}
                           {item.label}
                         </div>
                         <div className="flex-1 px-3 py-2 text-[10px] font-medium text-slate-700 break-all leading-relaxed">
                           {item.value}
                         </div>
                       </div>
                     ))}
                  </div>
                </div>

                <div>
                   <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded transition-colors">
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                      招标人联系信息
                    </h3>
                    <ChevronUp size={14} className="text-slate-300" />
                  </div>
                  <div className="mt-4 space-y-px">
                     {[
                       { label: '关键词信息', value: '(必选)', isHeader: true },
                       { label: '招标人', value: project?.tenderer || '柳州市龙杯水库管理所' },
                       { label: '地址', value: '柳州市柳南区洛满镇福塘街83号' },
                       { label: '联系人', value: '韦工' },
                       { label: '电话', value: '07722488185' },
                       { label: '邮箱', value: 'lzslhsk@163.com' },
                     ].map((item, i) => (
                       <div key={i} className={`flex items-stretch border border-slate-100 ${item.isHeader ? 'bg-blue-50/30' : ''}`}>
                         <div className={`w-32 px-3 py-2 text-[10px] font-bold text-slate-500 border-r border-slate-100 shrink-0 ${item.isHeader ? 'text-blue-600' : ''}`}>
                           {item.isHeader && <span className="mr-1 text-blue-500">●</span>}
                           {item.label}
                         </div>
                         <div className="flex-1 px-3 py-2 text-[10px] font-medium text-slate-700 break-all leading-relaxed">
                           {item.value}
                         </div>
                       </div>
                     ))}
                  </div>
                </div>

                <div>
                   <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded transition-colors">
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                      招标条件与范围
                    </h3>
                    <ChevronUp size={14} className="text-slate-300" />
                  </div>
                  <div className="mt-4 space-y-px">
                     {[
                       { label: '关键词信息', value: '(必选)', isHeader: true },
                       { label: '建设规模', value: '本项目总投资约5.2亿元，建设内容包括干渠、支渠及现代化水利设施改造。' },
                     ].map((item, i) => (
                       <div key={i} className={`flex items-stretch border border-slate-100 ${item.isHeader ? 'bg-blue-50/30' : ''}`}>
                         <div className={`w-32 px-3 py-2 text-[10px] font-bold text-slate-500 border-r border-slate-100 shrink-0 ${item.isHeader ? 'text-blue-600' : ''}`}>
                           {item.isHeader && <span className="mr-1 text-blue-500">●</span>}
                           {item.label}
                         </div>
                         <div className="flex-1 px-3 py-2 text-[10px] font-medium text-slate-700 break-all leading-relaxed">
                           {item.value}
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right PDF View Panel */}
        <div className="flex-1 bg-slate-100 p-4 flex flex-col gap-3 relative">
          {/* PDF Tools Bar */}
          <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
            <div className="flex flex-col bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-1.5 gap-1.5">
               <button className="p-2 rounded-lg text-slate-600 hover:bg-primary/10 hover:text-primary transition-all">
                 <Menu size={18} />
               </button>
               <div className="w-6 h-px bg-slate-200 mx-auto" />
               <button className="p-2 rounded-lg text-slate-600 hover:bg-primary/10 hover:text-primary transition-all">
                 <Building2 size={18} />
               </button>
               <button className="p-2 rounded-lg text-slate-600 hover:bg-primary/10 hover:text-primary transition-all">
                 <Maximize2 size={18} />
               </button>
               <button className="p-2 bg-primary text-white rounded-lg shadow-md shadow-primary/20">
                 <Search size={18} />
               </button>
            </div>
          </div>

          {/* Search/Filter in PDF */}
          <div className="absolute left-20 top-6 z-10 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4">
             <div className="relative mb-4">
               <input 
                 type="text" 
                 placeholder="您要搜索哪些字或词组?"
                 className="w-full bg-slate-100 border-none rounded-xl px-4 py-2 text-[10px] font-medium text-slate-800 outline-none pr-10"
               />
               <button className="absolute right-2 top-1.5 p-1 bg-primary text-white rounded-lg">
                 <Search size={14} />
               </button>
             </div>
             <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                   <div className="size-4 rounded-md border-2 border-primary/20 bg-primary/10 flex items-center justify-center transition-all group-hover:border-primary/40">
                      <div className="size-2 bg-primary rounded-sm" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-600">全部高亮显示</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                   <div className="size-4 rounded-md border-2 border-slate-200 transition-all group-hover:border-primary/40" />
                   <span className="text-[10px] font-bold text-slate-600">区分大小写</span>
                </label>
             </div>
          </div>

          {/* Main PDF Content (Fake) */}
          <div className="flex-1 bg-[#8F96A1] shadow-inner overflow-hidden flex justify-center p-8 overflow-y-auto custom-scrollbar">
            <div className="w-[800px] h-[3000px] bg-white shadow-2xl relative p-20 flex flex-col items-center">
              <div className="w-full text-center mb-16">
                 <h2 className="text-xl font-bold text-black mb-10">确定方式见投标人须知前附表。</h2>
                 <div className="space-y-8 text-left text-sm text-slate-800 leading-relaxed font-serif max-w-2xl mx-auto">
                    <p>6.1.2 评标委员会成员有下列情形之一的，应当回避：</p>
                    <p className="pl-6">(1) 投标人或投标人的主要负责人的近亲属；</p>
                    <p className="pl-6">(2) 招标项目主管部门或者招标投标行政监督部门的工作人员；</p>
                    <p className="pl-6">(3) 与投标人有经济利益关系，可能影响对投标公正评审的人员；</p>
                    <p className="pl-6">(4) 与投标人有其他利害关系的人员。</p>
                    <p>6.1.3 评标过程中，评标委员会成员有回避事宜的，应向招标人或有关单位报告，并视情节予以回避。被更换的评标委员会成员作出的评审结论无效，由更换后的评价委员会重新进行评审。</p>
                    <h3 className="text-lg font-bold mt-12 mb-4">6.2 评标原则</h3>
                    <p>评标活动遵循公平、公正、科学和择优的原则。</p>
                    <h3 className="text-lg font-bold mt-12 mb-4">6.3 评标</h3>
                    <p>6.3.1 评标委员会根据第3章“评标办法”规定的评审因素、标准和程序对投标文件进行评审。评审依据投标文件、本招标文件、有关规定和标准进行。</p>
                    <p>6.3.2 评标完成后，评标委员会应当向招标人提交书面评标报告和中标候选人名单。评标委员会推荐中标候选人的人数见投标人须知前附表。</p>
                 </div>
                 <div className="mt-20 text-slate-400 text-xs">- 24 -</div>
              </div>
            </div>
          </div>

          {/* PDF Footer Controls */}
          <div className="h-10 bg-white border border-slate-200 rounded-xl px-4 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-slate-500">页码:</span>
                   <div className="flex items-center gap-1">
                      <input type="text" defaultValue="28" className="w-8 h-6 bg-slate-50 border border-slate-200 rounded text-center text-[10px] font-black outline-none" />
                      <span className="text-[10px] font-bold text-slate-400">/ 195</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                   <button className="p-1 px-2 hover:bg-white rounded transition-all text-slate-500">
                     <ZoomOut size={14} />
                   </button>
                   <div className="w-px h-3 bg-slate-200 mx-1" />
                   <button className="p-1 px-2 hover:bg-white rounded transition-all text-slate-500">
                     <ZoomIn size={14} />
                   </button>
                </div>
                <select className="bg-transparent text-[10px] font-bold text-slate-600 outline-none">
                   <option>自动缩放</option>
                   <option>适应宽度</option>
                   <option>适应高度</option>
                </select>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'dashboard');
  const [workbenchStage, setWorkbenchStage] = useLocalStorage<string | undefined>('workbenchStage', undefined);
  const [projectData, setProjectData] = useLocalStorage<any>('projectData', null);
  const [projects, setProjects] = useLocalStorage<any[]>('tender-projects', []);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useLocalStorage('user-profile', {
    name: '陈经理',
    nickname: 'ProManager_Chen',
    email: 'chen.manager@enterprise.com',
    phone: '138 0000 8888'
  });
  const [enterprises, setEnterprises] = useLocalStorage('enterprises', [
    { id: 'personal', name: profile?.nickname || '陈经理', status: '13800138000', role: '个人身份' },
    { id: '1', name: '中建八局第三建设有限公司', status: '已加入', role: '超级管理员' },
    { id: '2', name: '中铁建工集团有限公司', status: '已加入', role: '普通员工' },
    { id: '3', name: '中国建筑第一局(集团)有限公司', status: '审核中', role: '普通员工' },
  ]);

  // Sync personal identity name with nickname
  React.useEffect(() => {
    setEnterprises(prev => prev.map(ent => 
      ent.id === 'personal' ? { ...ent, name: profile.nickname } : ent
    ));
  }, [profile.nickname, setEnterprises]);
  const [currentEnterpriseId, setCurrentEnterpriseId] = useLocalStorage('currentEnterpriseId', '1');
  
  useEffect(() => {
    // Scroll progress listener or other global setups
  }, []);

  const isReportMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'report';
  }, []);

  const isBidCreationMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'bid-creation';
  }, []);

  const isTechBidCreationMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'tech-bid-creation';
  }, []);

  const isBidRewriteMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'bid-rewrite';
  }, []);

  const handleOpenReportInTab = (id?: string) => {
    // Simple state update to trigger report mode in current tab (but requested to open in new tab usually for these reports)
    // For this prototype, we handle the view=report in URL
    const url = window.location.origin + `?view=report&projectId=${id || 'default'}`;
    window.open(url, '_blank');
  };

  const currentEnterprise = React.useMemo(() => 
    enterprises.find(e => e.id === currentEnterpriseId) || enterprises[1],
    [enterprises, currentEnterpriseId]
  );

  const handleLogin = (enterpriseId: string) => {
    const selected = enterprises.find(e => e.id === enterpriseId);
    if (selected) {
      setCurrentEnterpriseId(selected.id);
    } else if (enterpriseId === 'personal') {
      setCurrentEnterpriseId(enterprises[0].id);
    }
    setIsLoggedIn(true);
  };

  const handleSwitchEnterprise = (ent: any) => {
    setCurrentEnterpriseId(ent.id);
  };

  const [uploadedFilesMapping, setUploadedFilesMapping] = useLocalStorage<Record<string, Record<string, boolean>>>('uploadedFilesMapping', {});
  const activeProjectId = projectData?.id || 'default';
  const uploadedFiles = uploadedFilesMapping[activeProjectId] || {};

  const setUploadedFiles = React.useCallback((value: React.SetStateAction<Record<string, boolean>>) => {
    setUploadedFilesMapping(prev => ({
      ...prev,
      [activeProjectId]: typeof value === 'function' ? value(prev[activeProjectId] || {}) : value
    }));
  }, [activeProjectId, setUploadedFilesMapping]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(prev => {
            if (prev.length > 0) return prev;
            return data;
          });
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateProject = async (updatedProject: any) => {
    try {
      // In a real app we'd have a PUT endpoint, for now we can mock it or just update state 
      // but let's assume we want persistence. I'll add a save endpoint if needed.
      const mappedProjectToSave = {
        ...updatedProject,
        name: updatedProject.projectName || updatedProject.name,
        code: updatedProject.projectNumber || updatedProject.code,
        tenderer: updatedProject.tendererAndContact || updatedProject.tenderer,
        agent: updatedProject.tenderAgentAndContact || updatedProject.agent,
        bidOpeningTime: updatedProject.openingTime || updatedProject.bidOpeningTime,
        deposit: updatedProject.depositAmount || updatedProject.deposit,
      };

      setProjects(prev => prev.map(p => p.id === updatedProject.id ? { ...p, ...mappedProjectToSave } : p));
      setProjectData(updatedProject);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleEnterWorkbench = (stage: string, data?: any) => {
    // Map status string to Phase type
    const stageMap: Record<string, string> = {
      '准备阶段': 'preparation',
      '制作阶段': 'production',
      '检查阶段': 'inspection',
      '标后归档': 'archiving'
    };
    if (data) {
      if (!data.id && data.projectName) {
        // Find existing project by name
        const existingProject = projects.find(p => p.name === data.projectName);
        let finalData = data;
        if (existingProject) {
          finalData = { ...existingProject, ...data };
        } else {
          finalData = {
            id: `PROJ-${Date.now()}`,
            name: data.projectName,
            code: data.projectNumber || `ZB-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            status: stage === '准备阶段' ? '投标中' : '进行中',
            tenderer: data.tenderer || data.tendererAndContact || 'XX招标人',
            tendererContact: data.tendererContact || '--',
            agent: data.tenderAgent || data.tenderAgentAndContact || 'XX代理机构',
            agentContact: data.agentContact || '--',
            bidOpeningTime: data.openingTime || data.deadline || '--',
            deposit: data.depositAmount || '--',
            depositDeadline: data.depositDeadline || '--',
            openingLocation: data.openingLocation || '--',
            collectionTime: data.collectionTime || '--',
            requirements: data.tenderRequirements || '',
            otherRemarks: data.otherRemarks || '',
            tenderControlPrice: data.tenderControlPrice || '--',
            ...data
          };
          setProjects(prev => [finalData, ...prev]);
        }
        setProjectData(finalData);
      } else {
        setProjectData(data);
      }
    }
    setWorkbenchStage(stageMap[stage] || 'preparation');
    setActiveTab('workbench');
  };

  const renderContent = () => {
    // Handle enterprise sub-tabs
    if (activeTab.startsWith('ent-')) {
      const subTab = activeTab.replace('ent-', '');
      return <EnterpriseInfo initialTab={subTab} currentEnterprise={currentEnterprise} />;
    }

    if (activeTab === 'certificates' || activeTab === 'materials') {
      return <EnterpriseInfo initialTab={activeTab} currentEnterprise={currentEnterprise} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onEnterWorkbench={handleEnterWorkbench} 
            setActiveTab={setActiveTab} 
            currentEnterprise={currentEnterprise} 
            projects={projects}
          />
        );
      case 'business-dashboard':
        return <BusinessDashboard currentEnterprise={currentEnterprise} projects={projects} />;
      case 'workbench':
        return (
          <Workbench 
            onExit={() => setActiveTab('dashboard')} 
            initialPhase={workbenchStage as any} 
            initialProjectData={projectData}
            currentEnterprise={currentEnterprise}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'parsing':
        return <BidParsing onEnterWorkbench={handleEnterWorkbench} currentEnterprise={currentEnterprise} />;
      case 'inspection':
        return <BidInspection currentEnterprise={currentEnterprise} uploadedFilesMapping={uploadedFilesMapping} projects={projects} />;
      case 'org':
        return <OrgStructure enterprisesList={enterprises} currentEnterprise={currentEnterprise} />;
      case 'enterprise':
        return <EnterpriseInfo currentEnterprise={currentEnterprise} />;
      case 'knowledge-base':
        return <Materials currentEnterprise={currentEnterprise} />;
      case 'project-registration':
        return <TenderProjectRegistration 
          onEnterWorkbench={handleEnterWorkbench} 
          currentEnterprise={currentEnterprise} 
          projects={projects}
          setProjects={setProjects}
          uploadedFilesMapping={uploadedFilesMapping}
          setUploadedFilesMapping={setUploadedFilesMapping}
        />;
      case 'deposit-management':
        return <SecurityDepositManagement currentEnterprise={currentEnterprise} projects={projects} />;
      case 'opening-management':
        return <TenderOpeningStatusManagement currentEnterprise={currentEnterprise} projects={projects} />;
      case 'other-materials':
        return <OtherProjectMaterials currentEnterprise={currentEnterprise} projects={projects} />;
      case 'personal-center':
        return <PersonalCenter currentEnterprise={currentEnterprise} profile={profile} setProfile={setProfile} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">?</span>
            </div>
            <p className="text-lg font-medium">该模块正在开发中...</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-[#0052CC] font-bold hover:underline"
            >
              返回首页
            </button>
          </div>
        );
    }
  };

  const handleAddEnterprise = (name: string) => {
    const newId = (enterprises.length + 1).toString();
    const newEnterprise = { id: newId, name, status: '已加入', role: '超级管理员' };
    setEnterprises(prev => [...prev, newEnterprise]);
    return newId;
  };

  const handleRemoveEnterprise = (id: string) => {
    setEnterprises(prev => prev.filter(e => e.id !== id));
    setCurrentEnterpriseId('personal');
  };

  if (isReportMode) {
    return <ParsingReportView projects={projects} />;
  }

  if (isBidCreationMode) {
    return <BidCreationView projects={projects} />;
  }

  if (isTechBidCreationMode) {
    return <TechnicalBidCreationView projects={projects} />;
  }

  if (isBidRewriteMode) {
    return <BidRewriteView projects={projects} />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light">
      {activeTab !== 'workbench' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          enterprises={enterprises}
          currentEnterprise={currentEnterprise}
          setCurrentEnterprise={handleSwitchEnterprise}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar 
          setActiveTab={setActiveTab} 
          enterprises={enterprises}
          currentEnterprise={currentEnterprise}
          setCurrentEnterprise={handleSwitchEnterprise}
          onLogout={() => {
            setIsLoggedIn(false);
            localStorage.removeItem('isLoggedIn');
          }}
          onAddEnterprise={handleAddEnterprise}
          onRemoveEnterprise={handleRemoveEnterprise}
          profile={profile}
        />
        <main className="flex-1 overflow-y-auto p-8 [scrollbar-gutter:stable]">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

        </main>
      </div>
    </div>
  );
}

