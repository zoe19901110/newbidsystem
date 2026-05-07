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
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PersonalCenterProps {
  currentEnterprise?: { id: string; name: string };
  initialSection?: 'profile' | 'password' | 'notifications';
  profile: { name: string; nickname: string; email: string; phone: string };
  setProfile: (profile: any) => void;
}

const PersonalCenter: React.FC<PersonalCenterProps> = ({ currentEnterprise, initialSection = 'profile', profile, setProfile }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'notifications'>(initialSection);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">个人中心</h2>
        <AnimatePresence>
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100"
            >
              <CheckCircle2 size={18} />
              设置已成功保存
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-slate-100 bg-slate-50/30 p-6 space-y-2 shrink-0">
          <button 
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeSection === 'profile' 
                ? 'bg-white text-primary shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <User size={18} />
            个人资料
          </button>
          <button 
            onClick={() => setActiveSection('password')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeSection === 'password' 
                ? 'bg-white text-primary shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Lock size={18} />
            修改密码
          </button>
          <button 
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeSection === 'notifications' 
                ? 'bg-white text-primary shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Bell size={18} />
            消息提醒设置
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">
                  {activeSection === 'profile' ? '个人资料' : 
                   activeSection === 'password' ? '修改密码' : '消息提醒设置'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {activeSection === 'profile' 
                    ? '管理您的个人信息、联系方式及头像设置' 
                    : activeSection === 'password'
                    ? '为了您的账号安全，请定期更新您的登录密码'
                    : '管理您的消息推送偏好及提醒频率'}
                </p>
              </div>

              {activeSection === 'profile' ? renderProfile() : 
               activeSection === 'password' ? renderPassword() : renderNotifications()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalCenter;
