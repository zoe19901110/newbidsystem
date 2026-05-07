import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Network, 
  Building2, 
  Lightbulb, 
  Briefcase,
  FileSearch,
  BrainCircuit,
  ShieldCheck,
  PlayCircle,
  Wallet, 
  Archive, 
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Database,
  Search,
  BookOpen,
  ClipboardList,
  FileCheck,
  History,
  Copy
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  enterprises: { id: string; name: string }[];
  currentEnterprise: { id: string; name: string };
  setCurrentEnterprise: (enterprise: { id: string; name: string }) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  children?: { id: string; label: string; icon: any }[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentEnterprise }) => {
  const [openSections, setOpenSections] = useState<string[]>(['tender-lifecycle']);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard },
    { 
      id: 'tender-lifecycle', 
      label: '投标项目管理', 
      icon: Briefcase,
      children: [
        { id: 'business-dashboard', label: '业务仪表盘', icon: BarChart3 },
        { id: 'project-registration', label: '投标项目登记', icon: ClipboardList },
        { id: 'deposit-management', label: '保证金管理', icon: Wallet },
        { id: 'opening-management', label: '投标/开标情况管理', icon: History },
        { id: 'other-materials', label: '项目其他材料', icon: Archive },
      ]
    },
    { 
      id: 'knowledge-asset', 
      label: '知识资产管理', 
      icon: Database,
      children: [
        { id: 'knowledge-base', label: '企业知识库', icon: BookOpen },
        { id: 'enterprise', label: '企业资料', icon: Building2 },
      ]
    },
    { 
      id: 'smart-tender', 
      label: '标书编制管控', 
      icon: BrainCircuit,
      children: [
        { id: 'parsing', label: '招标文件解析', icon: FileSearch },
        { id: 'ai-prep', label: 'AI编标', icon: Lightbulb },
      ]
    },
    { 
      id: 'compliance-risk', 
      label: '合规风控审查', 
      icon: ShieldCheck,
      children: [
        { id: 'inspection', label: '标书检查', icon: FileCheck },
        { id: 'version-comparison', label: '多版本比对', icon: Copy },
      ]
    },
  ];

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Auto-open sections if a child is active
  useEffect(() => {
    const parent = menuItems.find(item => 
      item.children?.some(child => child.id === activeTab)
    );
    if (parent && !openSections.includes(parent.id)) {
      setOpenSections(prev => [...prev, parent.id]);
    }
  }, [activeTab]);

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-96 bg-slate-50/50 border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Archive size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none tracking-tight text-slate-800">投标管理系统</h1>
        </div>
      </div>

      <nav className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-2 space-y-1.5">
          {menuItems.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.children ? (
                <>
                  <button
                    onClick={() => {
                      const isOpen = openSections.includes(item.id);
                      toggleSection(item.id);
                      
                      // Only select first child if we are OPENING the section
                      if (!isOpen && item.children && item.children.length > 0) {
                        const firstChild = item.children[0];
                        if (firstChild.id === 'inspection') {
                          window.open('https://biaoshujiancha.graybruce.cn', '_blank');
                        } else if (firstChild.id === 'ai-prep') {
                          window.open('https://bqpoint.com/AIbianbiao/dist/index.html', '_blank');
                        } else {
                          setActiveTab(firstChild.id);
                        }
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                      openSections.includes(item.id) || item.children.some(c => c.id === activeTab)
                        ? 'bg-slate-200/50 text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={
                        openSections.includes(item.id) || item.children.some(c => c.id === activeTab)
                          ? 'text-slate-900'
                          : 'text-slate-500 group-hover:text-slate-900'
                      } />
                      <span className="text-[14px] font-bold text-left">{item.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openSections.includes(item.id) ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={14} className="text-slate-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openSections.includes(item.id) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden relative ml-6"
                      >
                        {/* Vertical line connecting sub-items */}
                        <div className="absolute left-4 top-0 bottom-4 w-px bg-slate-200" />
                        
                        <div className="mt-1 space-y-1 py-1">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                if (child.id === 'inspection') {
                                  window.open('https://biaoshujiancha.graybruce.cn', '_blank');
                                  return;
                                }
                                if (child.id === 'ai-prep') {
                                  window.open('https://bqpoint.com/AIbianbiao/dist/index.html', '_blank');
                                  return;
                                }
                                setActiveTab(child.id);
                              }}
                              className={`w-full flex items-center gap-3 px-8 py-2.5 rounded-xl transition-all group relative ${
                                activeTab === child.id 
                                  ? 'text-primary' 
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              <child.icon size={18} className={
                                activeTab === child.id ? 'text-primary' : 'text-slate-400 group-hover:text-slate-700'
                              } />
                              <span className="text-[14px] font-medium text-left">
                                {child.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                    activeTab === item.id
                      ? 'bg-slate-200/50 text-slate-900' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={
                      activeTab === item.id
                        ? 'text-slate-900'
                        : 'text-slate-500 group-hover:text-slate-900'
                    } />
                    <span className="text-[14px] font-bold">{item.label}</span>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
