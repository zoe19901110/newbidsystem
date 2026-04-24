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
  Database
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  enterprises: { id: string; name: string }[];
  currentEnterprise: { id: string; name: string };
  setCurrentEnterprise: (enterprise: { id: string; name: string }) => void;
}

interface SubItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentEnterprise }) => {
  const [isBusinessOpen, setIsBusinessOpen] = useState(true);
  const [expandedSubItems, setExpandedSubItems] = useState<string[]>([]);

  const isPersonal = currentEnterprise.id === 'personal';

  const navItems = [
    { id: 'dashboard', label: '首页', icon: LayoutDashboard },
    { id: 'business-dashboard', label: '业务仪表盘', icon: BarChart3 },
    ...(!isPersonal ? [
      { id: 'org', label: '组织架构', icon: Network },
      { id: 'enterprise', label: '企业资料', icon: Building2 },
      { id: 'knowledge-base', label: '企业知识库', icon: Database },
    ] : [
      { id: 'knowledge-base', label: '个人知识库', icon: Database },
    ]),
  ];

  const businessItems: SubItem[] = [
    { id: 'leads', label: '商机线索' },
    { id: 'project-registration', label: '投标项目登记' },
    { id: 'parsing', label: '招标文件解析' },
    { id: 'ai-prep', label: 'AI编标' },
    { id: 'inspection', label: '标书检查' },
    { id: 'simulation', label: '模拟开标' },
    { id: 'deposit-management', label: '保证金管理' },
    { 
      id: 'opening-management', 
      label: '投标/开标情况管理'
    },
    { id: 'other-materials', label: '项目其他材料' },
  ];

  const toggleSubItem = (id: string) => {
    setExpandedSubItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Auto-open business menu and sub-items if active
  useEffect(() => {
    const isBusinessSub = businessItems.some(item => 
      item.id === activeTab || item.children?.some(child => child.id === activeTab)
    );
    if (isBusinessSub) {
      setIsBusinessOpen(true);
      const parent = businessItems.find(item => 
        item.children?.some(child => child.id === activeTab)
      );
      if (parent && !expandedSubItems.includes(parent.id)) {
        setExpandedSubItems(prev => [...prev, parent.id]);
      }
    }
  }, [activeTab]);

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <Archive size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none tracking-tight">投标管理系统</h1>
        </div>
      </div>

      <nav className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'sidebar-item-active shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1 px-4 py-2 min-h-0 space-y-2">
          {/* Business Management Menu */}
          <div>
            <div
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-primary bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <Layers size={18} />
                <span className="text-sm font-bold">业务管理</span>
              </div>
            </div>

            <div className="mt-1 ml-4 pl-2 border-l border-slate-100 space-y-1 py-1">
              {businessItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (item.id === 'inspection') {
                        window.open('https://biaoshujiancha.graybruce.cn', '_blank');
                        return;
                      }
                      if (item.id === 'ai-prep') {
                        window.open('https://bqpoint.com/AIbianbiao/dist/index.html', '_blank');
                        return;
                      }
                      if (item.children) {
                        toggleSubItem(item.id);
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                      activeTab === item.id || item.children?.some(c => c.id === activeTab)
                        ? 'text-primary bg-primary/5 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <span className="text-[12px] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.children && (
                      expandedSubItems.includes(item.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                    )}
                  </button>

                  {item.children && expandedSubItems.includes(item.id) && (
                    <div className="ml-3 pl-3 border-l border-slate-100 space-y-1 py-1 max-h-40 overflow-y-auto custom-scrollbar">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setActiveTab(child.id)}
                          className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-all ${
                            activeTab === child.id 
                              ? 'text-primary bg-primary/5 font-bold' 
                              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                          }`}
                        >
                          <span className="text-[11px] font-medium whitespace-nowrap">
                            {child.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
