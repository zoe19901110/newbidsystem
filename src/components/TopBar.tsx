import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LogOut, Building2, Plus, X, CheckCircle2, Network, Search, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  setActiveTab: (tab: string) => void;
  enterprises: { id: string; name: string; role?: string }[];
  currentEnterprise: { id: string; name: string; role?: string };
  setCurrentEnterprise: (enterprise: { id: string; name: string; role?: string }) => void;
  onLogout: () => void;
  onAddEnterprise?: (name: string) => string; // Returns the new ID
  onRemoveEnterprise?: (id: string) => void;
  profile?: { name: string; nickname: string; email: string; phone: string };
}

const TopBar: React.FC<TopBarProps> = ({ setActiveTab, enterprises, currentEnterprise, setCurrentEnterprise, onLogout, onAddEnterprise, onRemoveEnterprise, profile }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEntSelect, setShowEntSelect] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDissolveModalOpen, setIsDissolveModalOpen] = useState(false);
  const [joinSearchQuery, setJoinSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{id: string, name: string}[] | null>(null);
  const [newEntName, setNewEntName] = useState('');
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowEntSelect(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSearchEnterprise = () => {
    if (!joinSearchQuery.trim()) return;
    setIsSearching(true);
    // Simulate API search
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        { id: `search-1`, name: `${joinSearchQuery}分公司` },
        { id: `search-2`, name: `${joinSearchQuery}科技有限公司` }
      ]);
    }, 800);
  };

  const handleApplyJoin = (entName: string) => {
    if (onAddEnterprise) {
      // Reusing onAddEnterprise for demo purpose to create a new entry
      const newId = onAddEnterprise(entName);
      setNewlyCreatedId(newId);
      setIsJoinModalOpen(false);
      setShowSuccessPrompt(true); // Reusing success prompt
    }
  };

  const handleAddEnterprise = () => {
    if (!newEntName.trim()) return;
    
    if (onAddEnterprise) {
      const newId = onAddEnterprise(newEntName);
      setNewlyCreatedId(newId);
      setIsAddModalOpen(false);
      setShowSuccessPrompt(true);
    }
  };

  const handleSwitchToNew = () => {
    if (newlyCreatedId) {
      const newEnt = enterprises.find(e => e.id === newlyCreatedId);
      if (newEnt) {
        setCurrentEnterprise(newEnt);
      }
    }
    setShowSuccessPrompt(false);
    setNewEntName('');
    setNewlyCreatedId(null);
    setShowDropdown(false);
  };

  const handleStayWithCurrent = () => {
    setShowSuccessPrompt(false);
    setNewEntName('');
    setNewlyCreatedId(null);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-900">
            {currentEnterprise.id === 'personal' ? (
              <User size={16} className="text-primary" />
            ) : (
              <Building2 size={16} className="text-primary" />
            )}
            {currentEnterprise.name}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col items-end justify-center">
            <p className="text-sm font-semibold">
              {currentEnterprise.id === 'personal' ? (profile?.nickname || '个人账户') : (profile?.name || '陈经理')}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {currentEnterprise.id === 'personal' ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500">
                  个人身份
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500">
                  {currentEnterprise.role || '普通员工'}
                </span>
              )}
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
              className="flex items-center gap-2"
            >
              <img 
                className="size-10 rounded-full object-cover border-2 border-primary/10" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                alt="User avatar"
              />
              <ChevronDown size={16} className="text-slate-500" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-30">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <img 
                    className="size-12 rounded-full object-cover border-2 border-primary/10" 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                    alt="User avatar"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      {currentEnterprise.id === 'personal' ? (profile?.nickname || '个人账户') : (profile?.name || '陈经理')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">登录账号: {profile?.phone || '13800138000'}</p>
                  </div>
                </div>

                <div className="p-2 border-b border-slate-100">
                  <button
                    onClick={() => { setActiveTab('personal-center'); setShowDropdown(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                  >
                    <User size={16} />
                    个人中心
                  </button>
                  <button
                    onClick={() => { setActiveTab('org'); setShowDropdown(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                  >
                    <Network size={16} />
                    组织架构
                  </button>
                </div>

                {/* Restore Enterprise Selection */}
                {/* Enterprise Selection Dropdown Pattern */}
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">切换企业</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsJoinModalOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                      >
                        <Search size={12} />
                        加入企业
                      </button>
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                      >
                        <Plus size={12} />
                        新增企业
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative px-2">
                    {/* Current Selection Display (Click to open list) */}
                    <div
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all bg-primary/10 text-primary border border-primary/20 sticky top-0 z-10`}
                    >
                      <div className={`flex items-center gap-2 overflow-hidden font-bold`}>
                        <div className={`shrink-0 size-7 rounded-md flex items-center justify-center bg-primary text-white`}>
                          {currentEnterprise.id === 'personal' ? <User size={14} /> : <Building2 size={14} />}
                        </div>
                        <div className="flex-1 flex flex-col items-start justify-center overflow-hidden">
                          <span className="truncate text-xs w-full leading-tight">{currentEnterprise.name}</span>
                          {currentEnterprise.id === 'personal' && (
                            <div className="flex items-center gap-1 mt-1 w-full flex-wrap">
                              <span className="shrink-0 text-[9px] leading-none px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500">
                                个人身份
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowEntSelect(!showEntSelect)}
                        className="text-[10px] px-2 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-all font-bold shrink-0 shadow-sm"
                      >
                        {showEntSelect ? '取消' : '切换'}
                      </button>
                    </div>

                    {/* Dropdown list of OTHER enterprises */}
                    <AnimatePresence>
                      {showEntSelect && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="mt-1.5 space-y-1 bg-white border border-slate-100 rounded-lg shadow-inner overflow-hidden max-h-48 overflow-y-auto custom-scrollbar"
                        >
                          {enterprises.filter(ent => ent.id !== currentEnterprise.id).map((ent) => (
                            <div
                              key={ent.id}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left group"
                            >
                              <div className="shrink-0 size-6 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors mt-0.5">
                                {ent.id === 'personal' ? <User size={12} /> : <Building2 size={12} />}
                              </div>
                              <div className="flex-1 flex flex-col items-start justify-center overflow-hidden">
                                <span className="truncate text-xs w-full">{ent.name}</span>
                                {ent.id === 'personal' && (
                                  <div className="flex items-center gap-1 mt-1 w-full flex-wrap">
                                    <span className="shrink-0 text-[9px] leading-none px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500">
                                      个人身份
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentEnterprise(ent);
                                  setShowEntSelect(false);
                                  setShowDropdown(false);
                                }}
                                className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-primary text-white rounded text-[10px] font-bold transition-opacity shrink-0 shadow-sm"
                              >
                                切换
                              </button>
                            </div>
                          ))}
                          {enterprises.length <= 1 && (
                            <p className="px-4 py-3 text-xs text-slate-400 italic text-center">暂无其他企业</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="border-t border-slate-100 p-2 flex flex-col gap-1">
                  {currentEnterprise.role === '超级管理员' && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setIsDissolveModalOpen(true);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                    >
                      <ShieldAlert size={16} />
                      解散当前企业
                    </button>
                  )}
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Enterprise Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">新增企业</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">企业名称</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newEntName}
                    onChange={(e) => setNewEntName(e.target.value)}
                    placeholder="请输入新的企业名称"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddEnterprise}
                  disabled={!newEntName.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认新增
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Join Enterprise Modal */}
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsJoinModalOpen(false);
                setSearchResults(null);
                setJoinSearchQuery('');
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">加入企业</h3>
                <button 
                  onClick={() => {
                    setIsJoinModalOpen(false);
                    setSearchResults(null);
                    setJoinSearchQuery('');
                  }}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                <div className="relative">
                  <input 
                    autoFocus
                    type="text" 
                    value={joinSearchQuery}
                    onChange={(e) => setJoinSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchEnterprise()}
                    placeholder="请输入想要加入的企业名称或信用代码"
                    className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  />
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button 
                    onClick={handleSearchEnterprise}
                    disabled={!joinSearchQuery.trim() || isSearching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isSearching ? '搜索中...' : '搜索'}
                  </button>
                </div>

                {searchResults && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs font-bold text-slate-400 mb-3">搜索结果 ({searchResults.length})</p>
                    {searchResults.length > 0 ? (
                      searchResults.map((result, idx) => (
                        <div key={idx} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all group">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-800">{result.name}</span>
                            <span className="text-xs text-slate-400">信用代码: 91440300{Math.floor(Math.random() * 100000000)}</span>
                          </div>
                          <button 
                            onClick={() => handleApplyJoin(result.name)}
                            className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            申请加入
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        未找到相关企业
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Prompt */}
        {showSuccessPrompt && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="size-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">新增成功</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                企业 <span className="text-slate-900 font-bold">"{enterprises.find(e => e.id === newlyCreatedId)?.name}"</span> 已成功创建。<br/>是否立即切换到该企业？
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSwitchToNew}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  是，立即切换
                </button>
                <button 
                  onClick={handleStayWithCurrent}
                  className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all"
                >
                  否，留在当前企业
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Dissolve Modal */}
        {isDissolveModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDissolveModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">确定解散吗？</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                解散后<span className="text-primary font-bold px-1">所有数据将清空</span>且无法恢复！
              </p>
              <div className="flex flex-col gap-3">
                <button 
                   onClick={() => {
                     if (onRemoveEnterprise) {
                       onRemoveEnterprise(currentEnterprise.id);
                     }
                     setIsDissolveModalOpen(false);
                   }}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  确定解散
                </button>
                <button 
                  onClick={() => setIsDissolveModalOpen(false)}
                  className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopBar;
