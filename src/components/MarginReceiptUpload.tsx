import React, { useState } from 'react';
import { 
  ChevronLeft, 
  UploadCloud, 
  FileText, 
  AlertTriangle,
  Trash2,
  Eye,
  Paperclip,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

interface MarginReceiptUploadProps {
  onBack: () => void;
  isPaused?: boolean;
  projectData?: any;
}

const MarginReceiptUpload: React.FC<MarginReceiptUploadProps> = ({ onBack, isPaused = false, projectData }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: '现金转账',
    bank: '',
    date: '',
    remarks: '',
    refundStatus: '待退还',
    refundDate: '',
    vouchers: [] as any[]
  });

  const [isUploading, setIsUploading] = useState(false);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = {
        name: e.target.files[0].name,
        size: (e.target.files[0].size / 1024 / 1024).toFixed(2) + ' MB',
        time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: '上传成功',
      };
      
      setIsUploading(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          vouchers: [...prev.vouchers, newFile]
        }));
        setIsUploading(false);
      }, 1000);
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vouchers: prev.vouchers.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    setHasAttemptedSave(true);
    if (!formData.amount || !formData.type || !formData.bank || !formData.date || !formData.refundStatus) {
      alert('请填写所有必填项');
      return;
    }
    alert('提交成功');
    onBack();
  };

  return (
    <div className="p-10 flex-1 flex flex-col overflow-hidden">
      <div className="space-y-8 flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">关联投标项目</label>
            <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
              {projectData?.name || '未关联项目'}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">缴纳金额 <span className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={formData.amount}
                disabled={isPaused}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.amount ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'} ${isPaused ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`} 
                placeholder="¥ 0.00" 
              />
              {hasAttemptedSave && !formData.amount && (
                <div className="absolute right-4 text-red-500">
                  <AlertTriangle size={16} className="fill-red-500 text-white" />
                </div>
              )}
            </div>
          </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">缴纳方式 <span className="text-red-500">*</span></label>
                <select 
                  value={formData.type}
                  disabled={isPaused}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.type ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'} ${isPaused ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                >
                  <option value="">请选择</option>
                  <option>现金转账</option>
                  <option>银行保函</option>
                  <option>保险保函</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">缴纳银行 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.bank}
                    disabled={isPaused}
                    onChange={(e) => setFormData({...formData, bank: e.target.value})}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.bank ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'} ${isPaused ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`} 
                    placeholder="请输入缴纳银行名称" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">缴纳时间 <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.date}
                  disabled={isPaused}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm ${hasAttemptedSave && !formData.date ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-slate-200'} ${isPaused ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`} 
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">退还状态 <span className="text-red-500">*</span></label>
                <div className="flex gap-8 px-2 py-2">
                  {['待退还', '已退还'].map((status) => (
                    <label key={status} className={`flex items-center gap-2 cursor-pointer group ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="refundStatus"
                          disabled={isPaused}
                          checked={formData.refundStatus === status}
                          onChange={() => setFormData({...formData, refundStatus: status})}
                          className="sr-only"
                        />
                        <div className={`size-5 rounded-full border-2 transition-all ${formData.refundStatus === status ? 'border-primary bg-primary' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                          {formData.refundStatus === status && <div className="size-2 bg-white rounded-full" />}
                        </div>
                      </div>
                      <span className={`text-sm font-bold transition-colors ${formData.refundStatus === status ? 'text-slate-900' : 'text-slate-500'}`}>
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.refundStatus === '已退还' && (
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">退还时间 <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formData.refundDate}
                    disabled={isPaused}
                    onChange={(e) => setFormData({...formData, refundDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" 
                  />
                </div>
              )}

              {/* Attachments */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Paperclip size={18} className="text-primary" />
                    <label className="text-sm">缴纳凭证附件 <span className="text-red-500">*</span></label>
                  </div>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="receipt-upload" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept=".pdf,image/*"
                      disabled={isPaused || isUploading}
                      onChange={handleFileUpload}
                    />
                    <button className={`px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-2 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <UploadCloud size={14} /> {isUploading ? '上传中...' : '上传附件'}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {formData.vouchers.map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${v.name.toLowerCase().endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                          {v.name.toLowerCase().endsWith('.pdf') ? <FileText size={20} /> : <ImageIcon size={20} />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 truncate">{v.name}</p>
                          <p className="text-[10px] text-slate-400">{v.size} • {v.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Eye size={16} /></button>
                        <button onClick={() => removeFile(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}

                  {formData.vouchers.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <Paperclip size={32} className="text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400 font-medium">暂无附件</p>
                      <p className="text-[10px] text-slate-400 mt-1">点击右上角按钮上传缴纳凭证</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">备注</label>
                <textarea 
                  value={formData.remarks}
                  disabled={isPaused}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  rows={3}
                  placeholder="请输入其他备注信息..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 mt-auto shrink-0 sticky bottom-0 bg-white pb-2">
              <button 
                onClick={handleSave} 
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                确认提交
              </button>
              <button 
                onClick={onBack} 
                className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                取消
              </button>
            </div>
        </div>
      </div>
  );
};

export default MarginReceiptUpload;
