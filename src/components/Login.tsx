import React, { useState } from 'react';
import { 
  AlertCircle,
  BrainCircuit, 
  ShieldCheck, 
  LayoutDashboard, 
  Bell, 
  FileCheck, 
  Database,
  Smartphone,
  User,
  Lock,
  ArrowLeft,
  ChevronRight,
  Search,
  Building2,
  QrCode,
  Monitor,
  Eye,
  EyeOff,
  ShieldCheck as ShieldIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLogin: (enterpriseId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'forgot' | 'select-enterprise' | 'register'>('login');
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account');
  const [loginMode, setLoginMode] = useState<'form' | 'qr'>('form');
  const [selectedEnterprise, setSelectedEnterprise] = useState<string | null>(null);
  const [rememberDefault, setRememberDefault] = useState(false);
  const [showOnlyDefault, setShowOnlyDefault] = useState(false);
  const [selectionTab, setSelectionTab] = useState<'personal' | 'enterprise'>('enterprise');
  const [searchQuery, setSearchQuery] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  // Registration state
  const [regPhone, setRegPhone] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  React.useEffect(() => {
    const savedUsername = localStorage.getItem('saved_username');
    const savedPassword = localStorage.getItem('saved_password');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberPassword(true);
    }
  }, []);

  const enterprises = [
    { id: 'personal', name: '陈经理', status: '13800138000', isPersonal: true },
    { id: '1', name: '中建八局第三建设有限公司', status: '已加入' },
    { id: '2', name: '中铁建工集团有限公司', status: '已加入' },
    { id: '3', name: '中国建筑第一局(集团)有限公司', status: '审核中' },
  ];

  const filteredEnterprises = enterprises.filter(e => 
    !e.isPersonal && e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerError = (msg: string) => {
    setError(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const handleInitialLogin = () => {
    if (!agreed) {
      triggerError('请阅读并勾选同意服务条款和隐私政策');
      return;
    }
    if (loginType === 'account') {
      // Test credentials: 13800138000 / 888888
      if (username === '13800138000' && password === '888888') {
        setError('');
        
        if (rememberPassword) {
          localStorage.setItem('saved_username', username);
          localStorage.setItem('saved_password', password);
        } else {
          localStorage.removeItem('saved_username');
          localStorage.removeItem('saved_password');
        }

        if (selectionTab === 'personal') {
          onLogin('personal');
          return;
        }

        const defaultId = localStorage.getItem('default_login_id');
        if (defaultId) {
          setSelectedEnterprise(defaultId);
          setRememberDefault(true);
          setShowOnlyDefault(true);
        } else {
          setShowOnlyDefault(false);
        }
        setView('select-enterprise');
      } else {
        triggerError('手机号或密码错误');
      }
    } else {
      // Phone login: any 11-digit number + simulated code 123456
      if (phone.length === 11 && code === '123456') {
        setError('');
        if (selectionTab === 'personal') {
          onLogin('personal');
          return;
        }

        const defaultId = localStorage.getItem('default_login_id');
        if (defaultId) {
          setSelectedEnterprise(defaultId);
          setRememberDefault(true);
          setShowOnlyDefault(true);
        } else {
          setShowOnlyDefault(false);
        }
        setView('select-enterprise');
      } else {
        triggerError('请输入正确的手机号和验证码(123456)');
      }
    }
  };

  const handleFinalLogin = () => {
    if (selectedEnterprise) {
      if (rememberDefault) {
        localStorage.setItem('default_login_id', selectedEnterprise);
      } else {
        localStorage.removeItem('default_login_id');
      }
      onLogin(selectedEnterprise);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    setSimulatedCode('123456');
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const features = [
    {
      icon: <BrainCircuit className="text-white/80" size={24} />,
      title: "AI 编标",
      desc: "智能辅助标书编写，大幅提升编标效率与质量"
    },
    {
      icon: <FileCheck className="text-white/80" size={24} />,
      title: "标书检查",
      desc: "自动化合规性检查，规避投标风险，提高中标率"
    },
    {
      icon: <LayoutDashboard className="text-white/80" size={24} />,
      title: "项目管理",
      desc: "全流程投标项目跟踪，团队协作高效有序"
    },
    {
      icon: <Bell className="text-white/80" size={24} />,
      title: "标讯",
      desc: "实时推送全网招标信息，精准匹配业务机会"
    },
    {
      icon: <ShieldCheck className="text-white/80" size={24} />,
      title: "电子证照库",
      desc: "企业资质证照统一管理，投标引用安全便捷"
    },
    {
      icon: <Database className="text-white/80" size={24} />,
      title: "我的素材",
      desc: "沉淀投标核心素材，实现知识资产复用"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-auto">
      <div className="bg-white rounded-[40px] shadow-2xl flex overflow-hidden w-[1060px] h-[720px] shrink-0">
        {/* Left Sidebar */}
        <div className="w-[520px] bg-primary px-14 flex flex-col justify-center relative overflow-hidden shrink-0 hidden md:flex">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold text-white mb-16 tracking-tight whitespace-nowrap">
              投标协同管理平台
            </h1>

            <div className="space-y-12">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="mt-1 p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                    {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 whitespace-nowrap">{feature.title}</h3>
                    <p className="text-base text-white/60 leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-[540px] flex flex-col items-center justify-center px-16 py-16 bg-white relative shrink-0">
          {/* QR Code Login Indicator (Top Right) */}
          {selectionTab === 'enterprise' && view === 'login' && (
            <div 
              className="absolute top-0 right-0 size-28 cursor-pointer z-20 group"
              onClick={() => setLoginMode(loginMode === 'form' ? 'qr' : 'form')}
            >
              <div 
                className={`absolute inset-0 transition-all duration-300 origin-top-right ${
                  loginMode === 'form' ? 'hover:scale-105' : 'hover:scale-105'
                }`}
              >
                {/* Custom Triangle Backing - Curved to match Login Card border */}
                <svg viewBox="0 0 100 100" className="size-full fill-primary drop-shadow-md">
                  <path d="M 0 0 L 100 0 L 100 100 Z" />
                </svg>
                {/* QR/Computer Icon in corner */}
                <div className="absolute top-5 right-5 text-white">
                  {loginMode === 'form' ? (
                    <QrCode size={40} strokeWidth={2.5} />
                  ) : (
                    <Monitor size={40} strokeWidth={2.5} />
                  )}
                </div>
                {/* Hover Tooltip/Label */}
                <div className="absolute top-4 right-28 bg-primary text-white text-xs px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold pointer-events-none">
                  {loginMode === 'form' ? '扫码登录' : '账号登录'}
                </div>
              </div>
            </div>
          )}

          {/* Floating Error Toast */}
          <AnimatePresence>
            {showError && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className="absolute top-10 left-1/2 z-50 w-full max-w-[400px]"
              >
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-500 shadow-xl shadow-red-500/10">
                  <AlertCircle size={24} />
                  <span className="text-base font-bold">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.div 
                key={loginMode === 'form' ? "login-form" : "login-qr"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-[440px] flex flex-col items-center"
              >
                {loginMode === 'form' ? (
                  <>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight text-center whitespace-nowrap">
                      欢迎登录
                    </h2>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 mb-10 justify-center gap-8 w-full">
                      <button 
                        onClick={() => setLoginType('account')}
                        className={`pb-4 px-2 text-lg font-bold transition-all relative whitespace-nowrap ${
                          loginType === 'account' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        账号登录
                        {loginType === 'account' && (
                          <motion.div 
                            layoutId="activeTab" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          />
                        )}
                      </button>
                      <button 
                        onClick={() => setLoginType('phone')}
                        className={`pb-4 px-2 text-lg font-bold transition-all relative whitespace-nowrap ${
                          loginType === 'phone' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        手机号登录
                        {loginType === 'phone' && (
                          <motion.div 
                            layoutId="activeTab" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          />
                        )}
                      </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-8 w-full">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                          {loginType === 'account' ? <User size={28} /> : <Smartphone size={28} />}
                        </div>
                        <input 
                          type="text" 
                          value={loginType === 'account' ? username : phone}
                          onChange={(e) => loginType === 'account' ? setUsername(e.target.value) : setPhone(e.target.value)}
                          placeholder="请输入手机号"
                          className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                          {loginType === 'account' ? <Lock size={28} /> : <ShieldIcon size={28} />}
                        </div>
                        {loginType === 'account' ? (
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入登录密码"
                            className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                          />
                        ) : (
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                              <input 
                                type="text" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="请输入验证码"
                                className="flex-1 pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                              />
                              <button 
                                onClick={startCountdown}
                                disabled={countdown > 0}
                                className="px-8 bg-slate-50 border border-slate-200 rounded-[24px] text-lg font-bold text-primary hover:bg-slate-100 disabled:text-slate-400 transition-all min-w-[140px]"
                              >
                                {countdown > 0 ? `${countdown}s` : '获取验证码'}
                              </button>
                            </div>
                            {simulatedCode && (
                              <motion.div 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-primary text-sm font-bold px-2"
                              >
                                [模拟短信] 您的验证码是：{simulatedCode}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 px-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            {loginType === 'account' && (
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={rememberPassword}
                                  onChange={(e) => setRememberPassword(e.target.checked)}
                                  className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors whitespace-nowrap">
                                  记住密码
                                </span>
                              </label>
                            )}
                            {loginType === 'phone' && selectionTab === 'personal' && (
                              <span className="text-xs text-slate-400">
                                未注册的手机号验证后将自动创建新账号
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            {selectionTab === 'personal' && loginType === 'account' && (
                              <button 
                                onClick={() => setView('register')}
                                className="text-sm text-primary font-bold hover:underline whitespace-nowrap"
                              >
                                立即注册
                              </button>
                            )}
                            <button 
                              onClick={() => setView('forgot')}
                              className="text-sm text-primary font-bold hover:underline whitespace-nowrap"
                            >
                              忘记密码?
                            </button>
                          </div>
                        </div>

                        <label className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                          />
                          <span className="group-hover:text-slate-600 transition-colors">
                            登录视为您已阅读并同意 <span className="text-primary hover:underline cursor-pointer">服务条款</span> 和 <span className="text-primary hover:underline cursor-pointer">隐私政策</span>
                          </span>
                        </label>
                      </div>

                      <button 
                        onClick={handleInitialLogin}
                        className="w-full py-5 bg-primary text-white rounded-[12px] font-bold text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-primary/90 active:scale-[0.98] transition-all mt-6"
                      >
                        确认登录
                      </button>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => {
                            setSelectionTab(selectionTab === 'personal' ? 'enterprise' : 'personal');
                          }}
                          className="text-slate-400 text-sm hover:text-primary transition-colors flex items-center gap-0.5 group"
                        >
                          <span className="font-medium group-hover:underline underline-offset-4 decoration-1">
                            {selectionTab === 'personal' ? '使用企业账号登录' : '使用个人账号登录'}
                          </span>
                          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight text-center">
                      标证通扫码登录
                    </h2>
                    <p className="text-slate-400 text-sm mb-10">请使用标证通手机APP扫描二维码登录</p>

                    <div className="relative p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm mb-10">
                      <div className="size-52 bg-slate-50 flex items-center justify-center rounded-xl overflow-hidden relative">
                        {/* Simulated QR Code with dynamic elements */}
                        <div className="absolute inset-0 flex flex-wrap p-2 opacity-80">
                          {Array.from({ length: 400 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`size-[10px] ${Math.random() > 0.7 ? 'bg-slate-800' : 'bg-transparent'} ${
                                // Squares in corners
                                (i < 50 && i % 20 < 5) || (i > 350 && i % 20 < 5) || (i % 20 > 15 && i < 50) ? 'bg-slate-900' : ''
                              }`}
                            />
                          ))}
                        </div>
                        {/* Logo in center */}
                        <div className="size-14 bg-white rounded-2xl shadow-md z-10 flex items-center justify-center">
                          <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="text-primary" size={24} />
                          </div>
                        </div>
                        
                        {/* Expired / Refresh Overlay (Hidden by default) */}
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-center p-4">
                          <div className="size-12 bg-primary rounded-full flex items-center justify-center text-white mb-3">
                            <ArrowLeft className="rotate-180" size={24} />
                          </div>
                          <p className="font-bold text-slate-900">二维码已过期</p>
                          <p className="text-xs text-primary mt-1">点此刷新</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Smartphone size={20} />
                        <span className="text-sm font-medium">打开 [标证通APP] 首页扫一扫</span>
                      </div>
                      <div className="flex gap-10 mt-4 border-t border-slate-100 pt-8 w-full justify-center">
                        <div className="flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                          <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">免密登录</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                          <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <ShieldIcon size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">CA验证</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setLoginMode('form')}
                      className="mt-12 text-sm font-bold text-primary hover:underline"
                    >
                      返回账号登录
                    </button>
                  </div>
                )}
              </motion.div>
            ) : view === 'forgot' ? (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-[440px]"
              >
                <button 
                  onClick={() => setView('login')}
                  className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group"
                >
                  <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xl font-bold">返回登录</span>
                </button>

                <h2 className="text-5xl font-extrabold text-slate-900 mb-14 tracking-tight whitespace-nowrap">
                  重置密码
                </h2>

                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                      <Smartphone size={28} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="请输入手机号码"
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                        <ShieldIcon size={28} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="验证码"
                        className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                      />
                    </div>
                    <button 
                      onClick={startCountdown}
                      disabled={countdown > 0}
                      className="px-8 bg-slate-50 border border-slate-200 rounded-[24px] text-lg font-bold text-primary hover:bg-slate-100 disabled:text-slate-400 transition-all min-w-[140px]"
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                      <Lock size={28} />
                    </div>
                    <input 
                      type="password" 
                      placeholder="设置新密码"
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                      <Lock size={28} />
                    </div>
                    <input 
                      type="password" 
                      placeholder="确认新密码"
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[24px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-medium"
                    />
                  </div>

                  <button 
                    onClick={() => setView('login')}
                    className="w-full py-6 bg-primary text-white rounded-[24px] font-bold text-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-primary/90 active:scale-[0.98] transition-all mt-8"
                  >
                    确认重置
                  </button>
                </div>
              </motion.div>
            ) : view === 'register' ? (
              <motion.div 
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-[440px] flex flex-col items-center"
              >
                <h2 className="text-4xl font-extrabold text-slate-900 mb-12 tracking-tight text-center whitespace-nowrap">
                  个人用户注册
                </h2>

                <div className="space-y-6 w-full">
                  <div>
                    <input 
                      type="text" 
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="手机号"
                      className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[8px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium"
                    />
                  </div>

                  <div className="flex gap-0 border border-slate-200 rounded-[8px] overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <input 
                      type="text" 
                      value={regCode}
                      onChange={(e) => setRegCode(e.target.value)}
                      placeholder="请输入验证码"
                      className="flex-1 px-6 py-5 bg-white outline-none text-lg font-medium"
                    />
                    <div className="w-px bg-slate-200 my-4"></div>
                    <button 
                      onClick={startCountdown}
                      disabled={countdown > 0}
                      className="px-6 bg-white text-primary font-bold hover:text-primary/80 disabled:text-slate-400 transition-colors whitespace-nowrap"
                    >
                      发送验证码
                    </button>
                  </div>

                  <div className="relative">
                    <input 
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="密码"
                      className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[8px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium"
                    />
                    <button 
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showRegPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      triggerError('注册成功，请登录');
                      setView('login');
                    }}
                    className="w-full py-5 bg-primary text-white rounded-[8px] font-bold text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-primary/90 active:scale-[0.98] transition-all mt-4"
                  >
                    注册
                  </button>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-500">
                      注册即代表同意 <span className="text-primary cursor-pointer hover:underline">《用户协议》</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      已有账号，<button onClick={() => setView('login')} className="text-primary font-bold hover:underline">立即登录</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="select-enterprise"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-[480px]"
              >
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight whitespace-nowrap">
                    {selectionTab === 'personal' ? '确认登录账号' : '选择进入企业'}
                  </h2>
                  <p className="text-slate-500 text-lg whitespace-nowrap">
                    {selectionTab === 'personal' ? '您正在以个人身份登录' : '请选择您要登录的企业账号'}
                  </p>
                </div>

                {!showOnlyDefault && selectionTab === 'enterprise' && (
                  <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                      <Search size={20} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="搜索企业名称..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[16px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
                    />
                  </div>
                )}

                <div className="space-y-4 mb-10 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                  {showOnlyDefault ? (
                    // Only show the default enterprise
                    enterprises.filter(e => e.id === selectedEnterprise).map((enterprise) => (
                      <div
                        key={enterprise.id}
                        className="w-full flex items-center gap-4 p-5 rounded-[20px] border-2 border-primary bg-primary/5 shadow-lg shadow-primary/10 text-left"
                      >
                        <div className="p-3 rounded-xl bg-primary text-white">
                          <Building2 size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg whitespace-nowrap">{enterprise.name}</h4>
                          </div>
                          <span className={`text-sm font-medium whitespace-nowrap ${
                            enterprise.status === '已加入' ? 'text-emerald-500' : 'text-orange-500'
                          }`}>
                            {enterprise.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : selectionTab === 'personal' ? (
                    // Show personal account card
                    enterprises.filter(e => e.id === 'personal').map((enterprise) => (
                      <div
                        key={enterprise.id}
                        className="w-full flex items-center gap-4 p-5 rounded-[20px] border-2 border-primary bg-primary/5 shadow-lg shadow-primary/10 text-left"
                      >
                        <div className="p-3 rounded-xl bg-primary text-white">
                          <User size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg whitespace-nowrap">{enterprise.name}</h4>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full whitespace-nowrap">个人账号</span>
                          </div>
                          <span className="text-sm font-medium text-orange-500 whitespace-nowrap">
                            {enterprise.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show full enterprise list (excluding personal)
                    filteredEnterprises.map((enterprise) => (
                      <button
                        key={enterprise.id}
                        onClick={() => {
                          setSelectedEnterprise(enterprise.id);
                        }}
                        className={`w-full flex items-center gap-4 p-5 rounded-[20px] border-2 transition-all text-left group ${
                          selectedEnterprise === enterprise.id 
                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-3 rounded-xl transition-colors ${
                          selectedEnterprise === enterprise.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}>
                          <Building2 size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-lg whitespace-nowrap">{enterprise.name}</h4>
                          </div>
                          <span className={`text-sm font-medium whitespace-nowrap ${
                            enterprise.status === '已加入' ? 'text-emerald-500' : 'text-orange-500'
                          }`}>
                            {enterprise.status}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    {!showOnlyDefault && selectionTab === 'enterprise' && (
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={rememberDefault}
                          onChange={(e) => setRememberDefault(e.target.checked)}
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors whitespace-nowrap">
                          下次默认登录此企业
                        </span>
                      </label>
                    )}

                    {showOnlyDefault && (
                      <button 
                        onClick={() => {
                          setShowOnlyDefault(false);
                          setSelectedEnterprise(null);
                        }}
                        className="text-sm text-primary font-bold hover:underline whitespace-nowrap"
                      >
                        切换企业
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={handleFinalLogin}
                    disabled={!selectedEnterprise}
                    className="w-full py-5 bg-primary text-white rounded-[20px] font-bold text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    确认进入
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </button>
                  <button 
                    onClick={() => setView('login')}
                    className="w-full py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-[20px] font-bold text-xl hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    返回登录
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
