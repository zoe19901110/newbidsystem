import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PersonalCenterProps {
  currentEnterprise?: { id: string; name: string };
  initialSection?: 'profile' | 'password';
}

const PersonalCenter: React.FC<PersonalCenterProps> = ({ currentEnterprise, initialSection = 'profile' }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>(initialSection);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: '陈经理',
    email: 'chen.manager@enterprise.com',
    phone: '138 0000 8888'
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = () => {
    if (activeSection === 'profile') {
      if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim()) {
        alert('请填写所有必填项');
        return;
      }
    } else {
      if (!passwordData.current.trim() || !passwordData.new.trim() || !passwordData.confirm.trim()) {
        alert('请填写所有必填项');
        return;
      }
      if (passwordData.new !== passwordData.confirm) {
        alert('新密码与确认密码不一致');
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
          <h3 className="text-lg font-bold text-slate-900">陈经理</h3>
          <p className="text-sm text-slate-500 font-medium">项目总监 · {currentEnterprise?.name || '数字化招采部'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck size={10} />
              已实名认证
            </span>
          </div>
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
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">手机号码</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
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
          为了您的账号安全，建议定期修改密码。新密码必须包含字母、数字和特殊字符，且长度不少于 8 位。
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">当前密码</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              placeholder="请输入当前使用的密码"
              className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  {activeSection === 'profile' ? '个人资料' : '修改密码'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {activeSection === 'profile' 
                    ? '管理您的个人信息、联系方式及头像设置' 
                    : '为了您的账号安全，请定期更新您的登录密码'}
                </p>
              </div>

              {activeSection === 'profile' ? renderProfile() : renderPassword()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalCenter;
