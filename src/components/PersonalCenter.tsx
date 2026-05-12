import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  MessageSquare,
  Bell,
  Clock,
  Settings2,
  Users,
  ShoppingBag,
  FileText,
  History,
  ArrowRightLeft,
  AlertTriangle,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PersonalCenterProps {
  currentEnterprise?: { id: string; name: string; role?: string };
  initialSection?: 'profile' | 'password' | 'notifications' | 'agent' | 'orders' | 'invoices';
  profile: { name: string; nickname: string; email: string; phone: string };
  setProfile: (profile: any) => void;
}

const PersonalCenter: React.FC<PersonalCenterProps> = ({ currentEnterprise, initialSection = 'profile', profile, setProfile }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'notifications' | 'agent' | 'orders' | 'invoices'>(initialSection);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | false>(false);

  const [passwordData, setPasswordData] = useState({
    code: '',
    new: '',
    confirm: ''
  });
  const [countdown, setCountdown] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    system: true,
    project: true,
    margin: true,
    reminderTime: '09:00',
    advanceRemindDays: 1
  });

  // Transfer states
  const [isSelectTargetUserModalOpen, setIsSelectTargetUserModalOpen] = useState(false);
  const [transferSearchQuery, setTransferSearchQuery] = useState('');
  const [isSearchingTransfer, setIsSearchingTransfer] = useState(false);
  const [transferSearchResults, setTransferSearchResults] = useState<any[]>([]);
  const [selectedTargetUser, setSelectedTargetUser] = useState<any>(null);
  const [isConfirmTransferOpen, setIsConfirmTransferOpen] = useState(false);

  // Managed user states
  const [managedUserSearchQuery, setManagedUserSearchQuery] = useState('');
  const [isSearchingManagedUser, setIsSearchingManagedUser] = useState(false);
  const [managedSearchResults, setManagedSearchResults] = useState<any[]>([]);
  const [managedUser, setManagedUser] = useState<any>(null);

  // Log states
  const [logSearch, setLogSearch] = useState('');
  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    setLogPage(1);
    setLogSearch('');
  }, [managedUser]);

  const mockLogs = [
    { id: 1, userId: 'user-managed-1', action: "登录系统", time: "2024-03-12 09:00:00", ip: "192.168.1.1" },
    { id: 2, userId: 'user-managed-1', action: "修改个人资料", time: "2024-03-11 14:30:00", ip: "192.168.1.1" },
    { id: 3, userId: 'user-managed-2', action: "修改密码", time: "2024-03-10 16:20:00", ip: "192.168.1.2" },
    { id: 4, userId: 'user-managed-2', action: "加入新企业", time: "2024-03-09 10:15:00", ip: "192.168.1.5" },
    { id: 5, userId: 'user-managed-1', action: "登录系统", time: "2024-03-08 09:00:00", ip: "192.168.1.1" },
    { id: 6, userId: 'user-managed-1', action: "修改个人资料", time: "2024-03-07 14:30:00", ip: "192.168.1.1" },
    { id: 7, userId: 'user-managed-1', action: "修改密码", time: "2024-03-06 16:20:00", ip: "192.168.1.2" },
    { id: 8, userId: 'user-managed-1', action: "加入新企业", time: "2024-03-05 10:15:00", ip: "192.168.1.5" },
    { id: 9, userId: 'user-managed-1', action: "修改密码", time: "2024-03-04 16:20:00", ip: "192.168.1.2" },
    { id: 10, userId: 'user-managed-1', action: "加入新企业", time: "2024-03-03 10:15:00", ip: "192.168.1.5" },
    { id: 11, userId: 'user-managed-1', action: "修改密码", time: "2024-03-02 16:20:00", ip: "192.168.1.2" },
  ];

  const filteredLogs = mockLogs.filter(log => 
    log.userId === managedUser?.id && (
      log.time.includes(logSearch) || 
      log.action.includes(logSearch) || 
      log.ip.includes(logSearch)
    )
  );
  
  const paginatedLogs = filteredLogs.slice((logPage - 1) * logsPerPage, logPage * logsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Determine user role and access
  const isSuperAdmin = currentEnterprise?.role === '超级管理员';
  const showAgentMenu = isSuperAdmin;
  const showOrdersAndInvoicesMenu = currentEnterprise?.id === 'personal' || (currentEnterprise?.role && currentEnterprise.role !== '普通员工');

  const handleSearchManagedUser = () => {
    if (!managedUserSearchQuery.trim()) return;
    setIsSearchingManagedUser(true);
    // Simulate API search
    setTimeout(() => {
      setIsSearchingManagedUser(false);
      setManagedSearchResults([
        { id: `user-managed-1`, name: `张三（${managedUserSearchQuery}）`, phone: '138****0001', department: '技术部' },
        { id: `user-managed-2`, name: `李四（${managedUserSearchQuery}）`, phone: '139****0002', department: '产品部' }
      ]);
    }, 800);
  };

  const handleSearchTargetUser = () => {
    if (!transferSearchQuery.trim()) return;
    setIsSearchingTransfer(true);
    // Simulate API search
    setTimeout(() => {
      setIsSearchingTransfer(false);
      setTransferSearchResults([
        { id: `user-target-1`, name: `张三（${transferSearchQuery}）`, phone: '138****0001', department: '技术部' },
        { id: `user-target-2`, name: `李四（${transferSearchQuery}）`, phone: '139****0002', department: '产品部' }
      ]);
    }, 800);
  };

  const handleTransfer = () => {
    if (!selectedTransferUser) return;
    setIsConfirmTransferOpen(true);
  };

  const handleConfirmTransfer = () => {
    setIsConfirmTransferOpen(false);
    setIsSelectTargetUserModalOpen(false);
    setSuccessMsg(`账号 ${managedUser?.name || ''} 的权限已成功转移至 ${selectedTargetUser?.name || ''}。`);
    setTimeout(() => setSuccessMsg(false), 5000);
  };

  const handleSendCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    // Simulate sending code
    console.log('Sending verification code to:', profile.phone);
  };

  const handleSave = () => {
    if (activeSection === 'profile') {
      if (!profile.name.trim() || !profile.nickname.trim() || !profile.email.trim() || !profile.phone.trim()) {
        alert('请填写所有必填项');
        return;
      }
    } else if (activeSection === 'password') {
      if (!passwordData.code.trim() || !passwordData.new.trim() || !passwordData.confirm.trim()) {
        alert('请填写所有必填项');
        return;
      }
      if (passwordData.code.length !== 6) {
        alert('请输入正确的6位验证码');
        return;
      }
      if (passwordData.new !== passwordData.confirm) {
        alert('新密码与确认密码不一致');
        return;
      }
      if (passwordData.new.length < 8) {
        alert('新密码长度不能少于8位');
        return;
      }
    }
    setSuccessMsg('设置已成功保存');
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const renderProfile = () => (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-8">
        <div className="relative group">
          <div className="size-24 rounded-3xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
            <img 
              src="https://i.pravatar.cc/150?u=chen" 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 size-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {currentEnterprise?.id === 'personal' ? profile.nickname : profile.name}
          </h3>
          <p className="text-sm text-slate-500 font-medium">项目总监 · {currentEnterprise?.name || '数字化招采部'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">真实姓名</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-1">
            登录昵称
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={profile.nickname}
              onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
              placeholder="请输入登录昵称"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">电子邮箱</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">手机号码（登录账号）</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="tel" 
              value={profile.phone}
              readOnly
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
            />
          </div>
        </div>
        {currentEnterprise?.id !== 'personal' && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">所属部门</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                defaultValue="数字化招采部"
                disabled
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Save size={18} />
          保存个人资料
        </button>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="space-y-8 max-w-md">
      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3">
        <ShieldCheck className="text-blue-600 shrink-0" size={20} />
        <p className="text-xs text-blue-700 leading-relaxed font-medium">
          为了您的账号安全，改密码前需短信验证。验证码将发送至您的绑定手机号 <span className="font-bold">{profile.phone}</span>。
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">验证码</label>
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={passwordData.code}
                onChange={(e) => setPasswordData({ ...passwordData, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                placeholder="请输入6位验证码"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleSendCode}
              disabled={countdown > 0}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 min-w-[120px] ${
                countdown > 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">新密码</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type={showNewPassword ? "text" : "password"} 
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              placeholder="请输入新密码"
              className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <button 
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">确认新密码</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              placeholder="请再次输入新密码"
              className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <button 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Lock size={18} />
          更新密码
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-3">
        <Bell className="text-primary shrink-0" size={20} />
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          开启提醒功能，我们将及时通知您最新的项目动态、投标结果及保证金退还状态。
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Settings2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">系统消息提醒</p>
              <p className="text-[11px] text-slate-500 font-medium">接收系统维护、公告等重要信息</p>
            </div>
          </div>
          <button 
            onClick={() => setNotificationSettings({ ...notificationSettings, system: !notificationSettings.system })}
            className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings.system ? 'bg-primary' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${notificationSettings.system ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">开标提醒</p>
              <p className="text-[11px] text-slate-500 font-medium">包括项目开标时间等重要变动的实时通知</p>
            </div>
          </div>
          <button 
            onClick={() => setNotificationSettings({ ...notificationSettings, project: !notificationSettings.project })}
            className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings.project ? 'bg-primary' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${notificationSettings.project ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">保证金到期提醒</p>
              <p className="text-[11px] text-slate-500 font-medium">在保证金截止日期前提醒您进行处理</p>
            </div>
          </div>
          <button 
            onClick={() => setNotificationSettings({ ...notificationSettings, margin: !notificationSettings.margin })}
            className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings.margin ? 'bg-primary' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${notificationSettings.margin ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-primary" size={18} />
            <span className="text-sm font-bold text-slate-700">开始提醒的时间</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">每日汇总推送时间</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="time" 
                  value={notificationSettings.reminderTime}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, reminderTime: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">提前预警项 (天)</label>
              <div className="relative">
                <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  value={notificationSettings.advanceRemindDays}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, advanceRemindDays: parseInt(e.target.value) })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value={1}>提前 1 天</option>
                  <option value={3}>提前 3 天</option>
                  <option value={7}>提前 7 天</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Save size={18} />
          保存提醒设置
        </button>
      </div>
    </div>
  );

  const renderAgent = () => (
    <div className="space-y-8 max-w-7xl">
      <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg h-fit">
          <Settings2 size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 mb-1">账号权限转交说明</p>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            该功能用于进行账号权限的转交处理。包括原账号下的所有数据记录和权限。
            <br />
            <span className="text-red-500 font-bold">请注意：转交完成后，原账号将无法再登录系统操作及查看任何数据。</span>
          </p>
        </div>
      </div>
      
      <div className="flex gap-8 items-start">
        <div className="flex-1 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="搜索要管理的账号姓名或手机号"
              value={managedUserSearchQuery}
              onChange={(e) => setManagedUserSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchManagedUser()}
              className="w-full max-w-sm pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <button
              onClick={handleSearchManagedUser}
              className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90"
            >
              搜索账号
            </button>
          </div>

          {managedSearchResults.length > 0 && (
            <div className="space-y-4">
              {managedSearchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => setManagedUser(user)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${managedUser?.id === user.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}
                  style={{ width: '384px' /* Matching max-w-sm */ }}
                >
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.phone}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setManagedUser(user);
                      setIsSelectTargetUserModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    权限转移
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {managedUser && (
          <div className="flex-1 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <History size={20} />
                </div>
                <h4 className="font-bold text-slate-900">操作日志 - {managedUser.name}</h4>
              </div>
              <input
                type="text"
                placeholder="搜索时间、操作内容或IP"
                value={logSearch}
                onChange={(e) => { setLogSearch(e.target.value); setLogPage(1); }}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">操作时间</th>
                    <th className="px-4 py-3">操作内容</th>
                    <th className="px-4 py-3 rounded-r-lg">IP地址</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLogs.map(log => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 font-mono text-xs">{log.time}</td>
                      <td className="px-4 py-3 font-medium">{log.action}</td>
                      <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-bold flex-shrink-0 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <select 
                    value={logsPerPage}
                    onChange={(e) => {
                      // Note: This needs logic to update logsPerPage, but in the simplified mock,
                      // we just show the structure as requested in the screenshot.
                      // For simplicity in this mock, we are keeping logsPerPage fixed.
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span>|</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setLogPage(1)} disabled={logPage === 1} className="hover:text-primary transition-colors disabled:opacity-50">««</button>
                  <button onClick={() => setLogPage(p => Math.max(1, p - 1))} disabled={logPage === 1} className="hover:text-primary transition-colors disabled:opacity-50">‹</button>
                  <input 
                    type="number" 
                    value={logPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= totalPages) setLogPage(val);
                    }}
                    className="w-10 text-center border border-slate-200 rounded-md py-1"
                  />
                  <span>/ {totalPages}</span>
                  <button onClick={() => setLogPage(p => Math.min(totalPages, p + 1))} disabled={logPage === totalPages} className="hover:text-primary transition-colors disabled:opacity-50">›</button>
                  <button onClick={() => setLogPage(totalPages)} disabled={logPage === totalPages} className="hover:text-primary transition-colors disabled:opacity-50">»»</button>
                  <span>|</span>
                  <button onClick={() => { setLogSearch(''); setLogPage(1); }} className="hover:text-primary transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  </button>
                </div>
                <div>每页 {logsPerPage} 条，共 {filteredLogs.length} 条</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
      <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center">
        <ShoppingBag size={32} />
      </div>
      <p className="font-medium">我的订单正在开发中...</p>
    </div>
  );

  const renderInvoices = () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-4">
      <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center">
        <FileText size={32} />
      </div>
      <p className="font-medium">我的发票正在开发中...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">个人中心</h2>
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100"
            >
              <CheckCircle2 size={18} />
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Topbar Tabs */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex gap-3 overflow-x-auto custom-scrollbar shrink-0">
          <button 
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'profile' 
                ? 'bg-white text-primary shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-200 border border-transparent'
            }`}
          >
            <User size={18} />
            个人资料
          </button>
          <button 
            onClick={() => setActiveSection('password')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'password' 
                ? 'bg-white text-primary shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-200 border border-transparent'
            }`}
          >
            <Lock size={18} />
            修改密码
          </button>
          <button 
            onClick={() => setActiveSection('notifications')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeSection === 'notifications' 
                ? 'bg-white text-primary shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-200 border border-transparent'
            }`}
          >
            <Bell size={18} />
            消息提醒设置
          </button>
          
          {showAgentMenu && (
            <button 
              onClick={() => setActiveSection('agent')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeSection === 'agent' 
                  ? 'bg-white text-primary shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:bg-slate-200 border border-transparent'
              }`}
            >
              <Users size={18} />
              代理人配置
            </button>
          )}

          {showOrdersAndInvoicesMenu && (
            <>
              <button 
                onClick={() => setActiveSection('orders')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeSection === 'orders' 
                    ? 'bg-white text-primary shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-200 border border-transparent'
                }`}
              >
                <ShoppingBag size={18} />
                我的订单
              </button>
              <button 
                onClick={() => setActiveSection('invoices')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeSection === 'invoices' 
                    ? 'bg-white text-primary shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:bg-slate-200 border border-transparent'
                }`}
              >
                <FileText size={18} />
                我的发票
              </button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-10 pl-32 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'profile' ? renderProfile() : 
               activeSection === 'password' ? renderPassword() : 
               activeSection === 'notifications' ? renderNotifications() :
               activeSection === 'agent' ? renderAgent() :
               activeSection === 'orders' ? renderOrders() : renderInvoices()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isSelectTargetUserModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSelectTargetUserModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-slate-900">账号转移</h3>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">
                    将账号 <span className="font-bold text-slate-800">{managedUser?.name}</span> 的权限转移至以下目标账号
                  </p>
                </div>
                <button
                  onClick={() => setIsSelectTargetUserModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  &#x2715;
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="搜索姓名或手机号"
                      value={transferSearchQuery}
                      onChange={(e) => setTransferSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchTargetUser()}
                      className="flex-1 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <button
                      onClick={handleSearchTargetUser}
                      disabled={isSearchingTransfer || !transferSearchQuery.trim()}
                      className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 disabled:bg-slate-100 disabled:text-slate-400 transition-all whitespace-nowrap"
                    >
                      {isSearchingTransfer ? '搜索中...' : '搜索'}
                    </button>
                  </div>
                </div>

                {transferSearchResults.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">搜索结果</label>
                    <div className="space-y-2">
                      {transferSearchResults.map(user => (
                        <button
                          key={user.id}
                          onClick={() => setSelectedTargetUser(user)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                            selectedTargetUser?.id === user.id
                              ? 'bg-primary/5 border-primary shadow-sm shadow-primary/10'
                              : 'bg-white border-slate-100 hover:border-primary/30 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                              selectedTargetUser?.id === user.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <User size={18} />
                            </div>
                            <div>
                              <p className={`font-bold ${selectedTargetUser?.id === user.id ? 'text-primary' : 'text-slate-900'}`}>
                                {user.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs">
                                <span className="text-slate-500">{user.phone}</span>
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] scale-90 origin-left">
                                  {user.department}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedTargetUser?.id === user.id ? 'border-primary bg-primary' : 'border-slate-300'
                          }`}>
                            {selectedTargetUser?.id === user.id && <div className="size-2 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {transferSearchResults.length === 0 && transferSearchQuery && !isSearchingTransfer && (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">未查找到匹配的人员</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setIsSelectTargetUserModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!selectedTargetUser}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-primary disabled:bg-slate-300 disabled:text-slate-50 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
                >
                  确认转移
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmTransferOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsConfirmTransferOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="size-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                  <AlertTriangle size={28} />
                </div>
                 <h3 className="text-xl font-bold text-slate-900">确认转移账号权限？</h3>
                <p className="text-sm text-slate-600">
                  确认将账号 <span className="font-bold text-slate-900">{managedUser?.name}</span> 的权限转移给 <span className="font-bold text-slate-900">{selectedTargetUser?.name}</span> 吗？<br/>此操作不可逆！
                </p>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsConfirmTransferOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmTransfer}
                  className="flex-1 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-sm rounded-xl transition-all active:scale-95"
                >
                  确认转移
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PersonalCenter;
