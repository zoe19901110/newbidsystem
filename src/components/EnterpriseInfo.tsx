import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Building2, 
  FileText, 
  Award, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Wallet,
  Archive,
  Calendar, 
  MapPin, 
  Globe, 
  Plus, 
  Search, 
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  User,
  Image,
  Handshake,
  HeartPulse,
  Paperclip,
  RotateCcw,
  Eye,
  Upload,
  ImageIcon,
  File,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Certificates from './Certificates';
import Pagination from './Pagination';

interface EnterpriseInfoProps {
  initialTab?: string;
  currentEnterprise?: { id: string; name: string };
}

const EnterpriseInfo: React.FC<EnterpriseInfoProps> = ({ initialTab, currentEnterprise }) => {
  const [activeTab, setActiveTab] = useState(initialTab && !['certificates'].includes(initialTab) ? initialTab : 'basic');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sidePanel, setSidePanel] = useState<'certificates' | null>(
    initialTab === 'certificates' ? initialTab : null
  );

  const [showAddPersonnelModal, setShowAddPersonnelModal] = useState(false);
  const [personnelMode, setPersonnelMode] = useState<'add' | 'edit'>('add');
  const [personnelTab, setPersonnelTab] = useState('basic');
  const [showPerformanceDetail, setShowPerformanceDetail] = useState(false);
  const [showQualificationDetail, setShowQualificationDetail] = useState(false);
  const [editingQualificationIndex, setEditingQualificationIndex] = useState<number | null>(null);
  const [qualificationFormData, setQualificationFormData] = useState<any>({
    employer: '上线运维测试有限公司',
    name: '',
    registrationNumber: '',
    qualificationSequence: '',
    startDate: '',
    endDate: '',
    sequences: [] as any[],
    attachments: [] as any[]
  });
  const [editingPerformanceIndex, setEditingPerformanceIndex] = useState<number | null>(null);
  const [performanceDetailTab, setPerformanceDetailTab] = useState('notification');
  const [performanceFormData, setPerformanceFormData] = useState<any>({
    packageName: '',
    packageCode: '',
    client: '',
    clientContact: '',
    projectLeader: '',
    leaderLeftCompany: '否',
    winningAmount: '',
    amountUnit: '元',
    winningDate: '',
    constructionLocation: '',
    contractAmount: '',
    settlementAmount: '',
    contractPeriod: '',
    signingDate: '',
    actualPerformancePeriod: '',
    completionAcceptanceLeader: '',
    completionFilingNumber: '',
    actualCost: '',
    actualArea: '',
    otherEngineeringFeatures: '',
    projectQuality: '',
    actualCommencementDate: '',
    actualCompletionDate: '',
    attachments: {
      notification: [] as any[],
      contract: [] as any[],
      completion: [] as any[]
    }
  });
  const [personnelFormData, setPersonnelFormData] = useState<any>({
    // 基本信息
    name: '',
    isForeigner: '否',
    gender: '男',
    birthDate: '',
    idCard: '',
    region: '',
    phone: '',
    workPhone: '',
    postalCode: '',
    techTitle: '高级工程师',
    position: '',
    isEmployed: '是',
    careerStartDate: '',
    careerYears: '',
    education: '博士',
    major: '',
    address: '',
    experience: '',
    unitCode: '91999779974015331P',
    unitName: '上线运维测试有限公司',
    graduationDate: '',
    graduationSchool: '',
    unitPosition: '',
    email: '',
    dept: '',
    entryDate: '',
    
    // 职称证信息
    titleNumber: '',
    titleMajor: '',
    titleAuthority: '',
    titleLevel: '高级',
    titleIssueDate: '',

    // 附件
    attachments: {
      socialSecurity: [] as any[],
      contract: [] as any[],
      photo: [] as any[],
      titleCert: [] as any[],
      others: [] as any[]
    },

    // 人员业绩
    performance: [] as any[],
    // 职业资格
    qualifications: [] as any[]
  });
  const [performanceSearch, setPerformanceSearch] = useState('');
  const [qualificationSearch, setQualificationSearch] = useState('');
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showGenericForm, setShowGenericForm] = useState(false);
  const [genericFormMode, setGenericFormMode] = useState<'add' | 'edit'>('add');
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingPersonnel, setIsEditingPersonnel] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentUploadField, setCurrentUploadField] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadField) return;

    setUploadingField(currentUploadField);
    setUploadProgress(0);

    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 30) + 10;
      if (progress >= 100) {
        progress = 100;
        setUploadProgress(100);
        clearInterval(interval);

        setTimeout(() => {
          const newFile = { 
            name: file.name, 
            url: URL.createObjectURL(file),
            size: (file.size / 1024).toFixed(2) + ' KB',
            uploadDate: new Date().toISOString().split('T')[0]
          };

          // 更新基本信息表单中的附件
          setBasicInfoForm(prev => ({
            ...prev,
            attachments: {
              ...prev.attachments,
              [currentUploadField]: [newFile]
            }
          }));

          // 同步到电子证照库 (Certificates)
          // 这里我们假设有一个全局状态或通过某种方式通知 Certificates 组件
          // 由于 Certificates 是独立组件，我们通过 console 模拟同步逻辑，
          // 实际项目中可能需要通过 context 或 redux
          console.log(`文件 ${file.name} 已同步到电子证照库`);

          setUploadingField(null);
          setUploadProgress(0);
          setCurrentUploadField(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 500);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
  };

  const triggerUpload = (field: string) => {
    setCurrentUploadField(field);
    fileInputRef.current?.click();
  };

  const [basicInfoForm, setBasicInfoForm] = useState({
    enterpriseName: '上线运维测试有限公司',
    creditCode: '91999779974015331P',
    legalPerson: '',
    unitNature: '国有全资',
    registeredCapital: '100 万元',
    currency: '人民币',
    businessPeriod: '2026-02-09至2026-02-25',
    registrationAuthority: '登记机关',
    country: '老挝',
    region: '江苏省/苏州市/张家港市',
    businessScope: '经营范围',
    bankName: '农业引导',
    bankAccount: '1234567890',
    bankAddress: '',
    bankPhone: '',
    bankFax: '',
    bankContact: '',
    accountName: '上线运维测试有限公司',
    safetyLicense: '皖JZ安许证字2019012250',
    economicType: '',
    unitAddress: '安徽省铜陵市枞阳县汤沟镇中心商贸城',
    licenseScope: '建筑施工',
    mainPerson: '',
    safetyEnterpriseName: '上线运维测试有限公司',
    safetyExpiry: '2016-10-03至2023-10-18',
    legalName: '',
    legalId: '',
    gender: '',
    legalPhone: '18911111111',
    legalTitle: '',
    legalPosition: '',
    englishName: '',
    unitAttribute: '制造商',
    industryCategory: '农、林、牧、渔业·农业·谷物种植',
    email: '',
    postalCode: '',
    manager: '',
    contactPhone: '',
    projectManagerCount: '',
    seniorTitleCount: '',
    middleTitleCount: '',
    juniorTitleCount: '',
    technicianCount: '',
    totalEmployees: '',
    fax: '',
    website: '',
    detailedAddress: '',
    serviceRegion: '',
    introduction: '',
    attachments: {
      license: [] as any[],
      account: [] as any[],
      safety: [] as any[],
      legal: [] as any[],
      other: [] as any[],
      promise: [{ name: '诚信承诺书.pdf', url: '#' }],
      authorization: [{ name: '法人授权委托书.pdf', url: '#' }]
    }
  });

  const enterpriseName = currentEnterprise?.name || 'XX建设集团有限公司';
  const enterpriseId = currentEnterprise?.id || 'ent-1';

  React.useEffect(() => {
    if (initialTab) {
      if (initialTab === 'certificates') {
        setSidePanel('certificates');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  const tabs = [
    { id: 'basic', label: '基本信息', icon: Building2 },
    { id: 'personnel', label: '职业人员', icon: Users },
    { id: 'qualification', label: '经营资质', icon: FileText },
    { id: 'performance', label: '投标业绩', icon: Briefcase },
    { id: 'finance', label: '企业财务', icon: Wallet },
    { id: 'rewards', label: '奖惩信息', icon: Award },
    { id: 'honors', label: '荣誉奖项', icon: Award },
    { id: 'materials-list', label: '投标所需材料', icon: Archive },
    { id: 'disclosure', label: '信息披露', icon: Globe },
    { id: 'credit', label: '信用评价', icon: ShieldCheck },
  ];

  const renderSearchAndFilter = (placeholder: string) => (
    <div className="flex flex-wrap items-center gap-8 justify-start">
      {/* Text Input */}
      <div className="w-56 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
        <input 
          type="text" 
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
        />
      </div>

      {/* Dropdown for Certificate */}
      <div className="w-40 relative group">
        <select className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-slate-600 font-medium">
          <option value="">所有证书/类型</option>
          <option value="1">一级建造师</option>
          <option value="2">二级建造师</option>
          <option value="3">高级工程师</option>
          <option value="4">注册会计师</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
      </div>

      {/* Date Picker */}
      <div className="w-40 relative group">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
        <input 
          type="date" 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-600 font-medium"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-auto">
        <button className="px-8 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-sm hover:shadow-md transition-all active:scale-95">
          查询
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95">
          <Filter size={16} /> 重置
        </button>
      </div>
    </div>
  );

  const getEnterpriseData = () => {
    const data: Record<string, any> = {
      'personal': {
        basicInfo: [
          { label: '姓名', value: '张三' },
          { label: '职业', value: '项目经理' },
          { label: '联系方式', value: '13800138000' },
          { label: '电子邮箱', value: 'zhangsan@example.com' },
          { label: '擅长领域', value: '房建工程、市政工程' },
          { label: '工作年限', value: '12年' },
        ],
        personnel: [
          { name: '张三', title: '高级工程师', cert: '一级建造师', code: '京111060800001', date: '2025-12-31' },
        ],
        qualification: [
          { name: '一级建造师执业资格', code: '京111060800001', date: '2025-12-31', status: 'valid' },
        ],
        performance: [
          { name: '个人参与：某市中心医院项目', amount: '4.2 亿元', date: '2023-08-15', manager: '张三', location: '江苏省南京市' },
        ]
      },
      'ent-1': {
        basicInfo: [
          { label: '法定代表人', value: '张建国' },
          { label: '注册资本', value: '50,000.00 万人民币' },
          { label: '成立日期', value: '2008-05-18' },
          { label: '企业类型', value: '有限责任公司(国有独资)' },
          { label: '所属行业', value: '房屋建筑业' },
          { label: '登记机关', value: '北京市市场监督管理局' },
          { label: '注册地址', value: '北京市朝阳区某某路某某大厦 18 层' },
          { label: '经营范围', value: '各类房屋建筑工程施工总承包；市政公用工程施工总承包等。' },
        ],
        personnel: [
          { name: '张建国', title: '高级工程师', cert: '一级建造师', code: '京111060800001', date: '2025-12-31' },
          { name: '李晓明', title: '工程师', cert: '二级建造师', code: '京211060800002', date: '2024-06-15' },
        ],
        qualification: [
          { name: '建筑工程施工总承包特级', code: 'A1011011000101', date: '2028-12-31', status: 'valid' },
          { name: '市政公用工程施工总承包一级', code: 'A2021022000202', date: '2027-06-15', status: 'valid' },
        ],
        performance: [
          { name: '某市中心医院综合大楼建设项目', amount: '4.2 亿元', date: '2023-08-15', manager: '王志强', location: '江苏省南京市' },
          { name: '某新区市政道路及管网配套工程', amount: '8,500 万元', date: '2023-05-20', manager: '李晓明', location: '浙江省杭州市' },
        ]
      },
      'ent-2': {
        basicInfo: [
          { label: '法定代表人', value: '李市政' },
          { label: '注册资本', value: '20,000.00 万人民币' },
          { label: '成立日期', value: '2012-10-22' },
          { label: '企业类型', value: '有限责任公司' },
          { label: '所属行业', value: '土木工程建筑业' },
          { label: '登记机关', value: '上海市市场监督管理局' },
          { label: '注册地址', value: '上海市浦东新区某某路 88 号' },
          { label: '经营范围', value: '市政公用工程施工总承包；公路工程施工总承包等。' },
        ],
        personnel: [
          { name: '李市政', title: '高级工程师', cert: '一级建造师', code: '沪111060800003', date: '2026-05-18' },
          { name: '王路桥', title: '高级工程师', cert: '一级建造师', code: '沪111060800004', date: '2025-09-12' },
        ],
        qualification: [
          { name: '市政公用工程施工总承包特级', code: 'S1011011000101', date: '2029-01-10', status: 'valid' },
          { name: '公路工程施工总承包一级', code: 'G2021022000202', date: '2027-11-30', status: 'valid' },
        ],
        performance: [
          { name: '上海市某跨海大桥建设项目', amount: '15.6 亿元', date: '2023-11-10', manager: '李市政', location: '上海市' },
          { name: '某省高速公路扩建工程', amount: '8.2 亿元', date: '2023-04-05', manager: '王路桥', location: '浙江省' },
        ]
      },
      'ent-3': {
        basicInfo: [
          { label: '院长', value: '王设计' },
          { label: '注册资本', value: '10,000.00 万人民币' },
          { label: '成立日期', value: '1995-03-15' },
          { label: '企业类型', value: '事业单位' },
          { label: '所属行业', value: '专业技术服务业' },
          { label: '登记机关', value: '广东省市场监督管理局' },
          { label: '注册地址', value: '广州市天天河区某某路 1 号' },
          { label: '经营范围', value: '工程设计；工程勘察；工程咨询等。' },
        ],
        personnel: [
          { name: '王设计', title: '国家一级注册建筑师', cert: '一级注册建筑师', code: '粤111060800005', date: '2027-03-15' },
          { name: '陈结构', title: '国家一级注册结构工程师', cert: '一级注册结构工程师', code: '粤111060800006', date: '2026-12-20' },
        ],
        qualification: [
          { name: '工程设计综合资质甲级', code: 'SJ1011011000101', date: '2030-05-18', status: 'valid' },
          { name: '工程勘察综合资质甲级', code: 'KC2021022000202', date: '2028-09-12', status: 'valid' },
        ],
        performance: [
          { name: '广州某地标性超高层建筑设计', amount: '2,800 万元', date: '2023-12-01', manager: '王设计', location: '广东省广州市' },
          { name: '深圳某大型体育场馆方案设计', amount: '1,500 万元', date: '2023-06-20', manager: '陈结构', location: '广东省深圳市' },
        ]
      }
    };
    return data[enterpriseId] || data['ent-1'];
  };

  const currentData = getEnterpriseData();

  const renderPersonnelForm = () => (
    <AnimatePresence>
      {showAddPersonnelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden w-[1100px] h-[800px] max-w-[95vw] max-h-[95vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">职业人员详情</h3>
              </div>
              <button 
                onClick={() => setShowAddPersonnelModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-slate-100 bg-slate-50/50 px-8 shrink-0">
              <div className="flex">
                {[
                  { id: 'basic', label: '基本信息', icon: User },
                  { id: 'performance', label: '人员业绩', icon: Briefcase },
                  { id: 'qualifications', label: '职业资格', icon: ShieldCheck },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPersonnelTab(tab.id)}
                    className={`px-6 py-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
                      personnelTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {personnelTab === tab.id && (
                      <motion.div 
                        layoutId="personnelTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052CC]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 relative">
              {personnelTab === 'basic' && (
                <div className="relative">
                  {/* Tab-level Sticky Header */}
                  <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-8 py-5 border-b border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          if (isEditingPersonnel) {
                            console.log('Saving personnel:', personnelFormData);
                            setIsEditingPersonnel(false);
                          } else {
                            setIsEditingPersonnel(true);
                          }
                        }}
                        className={`min-w-[110px] h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 ${
                          isEditingPersonnel 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                            : 'bg-[#0052CC] text-white hover:bg-[#0052CC]/90'
                        }`}
                      >
                        {isEditingPersonnel ? (
                          <>
                            <CheckCircle2 size={16} />
                            确认保存
                          </>
                        ) : (
                          <>
                            <Edit2 size={16} />
                            编辑信息
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-8 space-y-12 pb-12">
                    {/* 1. 个人基本信息 */}
                    <section>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-5 bg-[#0052CC] rounded-full" />
                        <h4 className="text-base font-bold text-slate-900">个人基本信息</h4>
                      </div>

                      <div className={`grid grid-cols-2 gap-x-12 gap-y-8 ${!isEditingPersonnel ? 'opacity-90' : ''}`}>
                        {/* Row 1 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            姓名 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入姓名"
                              value={personnelFormData.name}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, name: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.name || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            是否为外籍人员 <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-8 h-[46px]">
                            {['是', '否'].map(option => (
                              <label key={option} className={`flex items-center gap-2.5 ${isEditingPersonnel ? 'cursor-pointer group' : 'cursor-default'}`}>
                                <div className="relative flex items-center justify-center">
                                  <input 
                                    type="radio" 
                                    className="peer appearance-none size-5 border-2 border-slate-300 rounded-full checked:border-[#0052CC] transition-all disabled:opacity-50"
                                    checked={personnelFormData.isForeigner === option}
                                    disabled={!isEditingPersonnel}
                                    onChange={() => setPersonnelFormData({...personnelFormData, isForeigner: option})}
                                  />
                                  <div className="absolute size-2.5 bg-[#0052CC] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                </div>
                                <span className={`text-sm font-bold transition-colors ${personnelFormData.isForeigner === option ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            性别 <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-8 h-[46px]">
                            {['男', '女'].map(option => (
                              <label key={option} className={`flex items-center gap-2.5 ${isEditingPersonnel ? 'cursor-pointer group' : 'cursor-default'}`}>
                                <div className="relative flex items-center justify-center">
                                  <input 
                                    type="radio" 
                                    className="peer appearance-none size-5 border-2 border-slate-300 rounded-full checked:border-[#0052CC] transition-all disabled:opacity-50"
                                    checked={personnelFormData.gender === option}
                                    disabled={!isEditingPersonnel}
                                    onChange={() => setPersonnelFormData({...personnelFormData, gender: option})}
                                  />
                                  <div className="absolute size-2.5 bg-[#0052CC] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                </div>
                                <span className={`text-sm font-bold transition-colors ${personnelFormData.gender === option ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            出生年月 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <input 
                                type="date" 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all"
                                value={personnelFormData.birthDate}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, birthDate: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.birthDate || '-'}</div>
                          )}
                        </div>

                        {/* Row 3 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            身份证号码 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入身份证号码"
                              value={personnelFormData.idCard}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, idCard: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.idCard || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            所在行政区域 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <select 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all appearance-none"
                                value={personnelFormData.region}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, region: e.target.value})}
                              >
                                <option value="">请选择行政区域</option>
                                <option value="北京市">北京市</option>
                                <option value="上海市">上海市</option>
                                <option value="广州市">广州市</option>
                                <option value="深圳市">深圳市</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.region || '-'}</div>
                          )}
                        </div>

                        {/* Row 4 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            联系手机 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入手机号"
                              value={personnelFormData.phone}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, phone: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.phone || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">单位电话</label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入单位电话"
                              value={personnelFormData.workPhone}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, workPhone: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.workPhone || '-'}</div>
                          )}
                        </div>

                        {/* Row 5 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">邮政编码</label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入邮政编码"
                              value={personnelFormData.postalCode}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, postalCode: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.postalCode || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            技术职称 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <select 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all appearance-none"
                                value={personnelFormData.techTitle}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, techTitle: e.target.value})}
                              >
                                <option value="高级工程师">高级工程师</option>
                                <option value="中级工程师">中级工程师</option>
                                <option value="助理工程师">助理工程师</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.techTitle || '-'}</div>
                          )}
                        </div>

                        {/* Row 6 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            职务 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入职务"
                              value={personnelFormData.position}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, position: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.position || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">是否在职</label>
                          <div className="flex items-center gap-8 h-[46px]">
                            {['是', '否'].map(option => (
                              <label key={option} className={`flex items-center gap-2.5 ${isEditingPersonnel ? 'cursor-pointer group' : 'cursor-default'}`}>
                                <div className="relative flex items-center justify-center">
                                  <input 
                                    type="radio" 
                                    className="peer appearance-none size-5 border-2 border-slate-300 rounded-full checked:border-[#0052CC] transition-all disabled:opacity-50"
                                    checked={personnelFormData.isEmployed === option}
                                    disabled={!isEditingPersonnel}
                                    onChange={() => setPersonnelFormData({...personnelFormData, isEmployed: option})}
                                  />
                                  <div className="absolute size-2.5 bg-[#0052CC] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                </div>
                                <span className={`text-sm font-bold transition-colors ${personnelFormData.isEmployed === option ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Row 7 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">从业开始时间</label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <input 
                                type="date" 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all"
                                value={personnelFormData.careerStartDate}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, careerStartDate: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.careerStartDate || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">从业年限</label>
                          <div className="relative">
                            {isEditingPersonnel ? (
                              <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                <input 
                                  type="text" 
                                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                                  placeholder="请输入年限"
                                  value={personnelFormData.careerYears}
                                  onChange={(e) => setPersonnelFormData({...personnelFormData, careerYears: e.target.value})}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">年</span>
                              </div>
                            ) : (
                              <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.careerYears ? `${personnelFormData.careerYears} 年` : '-'}</div>
                            )}
                          </div>
                        </div>

                        {/* Row 8 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            学历 <span className="text-red-500">*</span>
                          </label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <select 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all appearance-none"
                                value={personnelFormData.education}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, education: e.target.value})}
                              >
                                <option value="博士">博士</option>
                                <option value="硕士">硕士</option>
                                <option value="本科">本科</option>
                                <option value="大专">大专</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.education || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">毕业专业</label>
                          {isEditingPersonnel ? (
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                              placeholder="请输入毕业专业"
                              value={personnelFormData.major}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, major: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.major || '-'}</div>
                          )}
                        </div>

                        {/* Row 9 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">毕业时间</label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <input 
                                type="date" 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all"
                                value={personnelFormData.graduationDate}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, graduationDate: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.graduationDate || '-'}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">毕业学校</label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <input 
                                type="text" 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                                placeholder="请输入毕业学校"
                                value={personnelFormData.graduationSchool}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, graduationSchool: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.graduationSchool || '-'}</div>
                          )}
                        </div>

                        {/* Full Width Rows */}
                        <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">通讯地址</label>
                          {isEditingPersonnel ? (
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              <input 
                                type="text" 
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                                placeholder="请输入通讯地址"
                                value={personnelFormData.address}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, address: e.target.value})}
                              />
                            </div>
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.address || '-'}</div>
                          )}
                        </div>

                        <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">从业经历</label>
                          {isEditingPersonnel ? (
                            <textarea 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-300"
                              placeholder="请输入从业经历描述..."
                              value={personnelFormData.experience}
                              onChange={(e) => setPersonnelFormData({...personnelFormData, experience: e.target.value})}
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent min-h-[120px] whitespace-pre-wrap">{personnelFormData.experience || '-'}</div>
                          )}
                        </div>
                      </div>
                    </section>

                      {/* 2. 职称证信息 */}
                      <section>
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-1.5 h-5 bg-[#0052CC] rounded-full" />
                          <h4 className="text-base font-bold text-slate-900">职称证信息</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">职称编号</label>
                            {isEditingPersonnel ? (
                              <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                                placeholder="请输入职称编号"
                                value={personnelFormData.titleNumber}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, titleNumber: e.target.value})}
                              />
                            ) : (
                              <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.titleNumber || '-'}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">职称专业</label>
                            {isEditingPersonnel ? (
                              <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                                placeholder="请输入职称专业"
                                value={personnelFormData.titleMajor}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, titleMajor: e.target.value})}
                              />
                            ) : (
                              <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.titleMajor || '-'}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">职称级别</label>
                            {isEditingPersonnel ? (
                              <div className="relative">
                                <select 
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all appearance-none"
                                  value={personnelFormData.titleLevel}
                                  onChange={(e) => setPersonnelFormData({...personnelFormData, titleLevel: e.target.value})}
                                >
                                  <option>高级</option>
                                  <option>中级</option>
                                  <option>初级</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                              </div>
                            ) : (
                              <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.titleLevel || '-'}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">职称发证机关</label>
                            {isEditingPersonnel ? (
                              <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-[#0052CC]/10 focus:border-[#0052CC] outline-none transition-all placeholder:text-slate-300"
                                placeholder="请输入发证机关"
                                value={personnelFormData.titleAuthority}
                                onChange={(e) => setPersonnelFormData({...personnelFormData, titleAuthority: e.target.value})}
                              />
                            ) : (
                              <div className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-100/50 rounded-xl border border-transparent">{personnelFormData.titleAuthority || '-'}</div>
                            )}
                          </div>
                        </div>
                      </section>

                      {/* 3. 附件 */}
                      <section>
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-1.5 h-5 bg-[#0052CC] rounded-full" />
                          <h4 className="text-base font-bold text-slate-900">附件材料</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          {[
                            { id: 'photo', label: '个人照片', icon: ImageIcon },
                            { id: 'titleCert', label: '职称证', icon: Award },
                            { id: 'socialSecurity', label: '社保证明', icon: ShieldCheck },
                            { id: 'contract', label: '劳动合同', icon: FileText },
                            { id: 'others', label: '其他材料', icon: Archive },
                          ].map((item) => (
                            <div key={item.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="size-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <item.icon size={16} />
                                  </div>
                                  <label className="text-sm font-bold text-slate-700">{item.label}</label>
                                </div>
                                {isEditingPersonnel && (
                                  <button className="px-3 py-1.5 bg-blue-50 text-[#0052CC] hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all">
                                    <Upload size={14} /> 上传文件
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2.5">
                                {personnelFormData.attachments[item.id].length === 0 ? (
                                  <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    <span className="text-xs text-slate-400 font-medium">暂无附件</span>
                                  </div>
                                ) : (
                                  personnelFormData.attachments[item.id].map((file: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm group/file">
                                      <div className="flex items-center gap-2 truncate">
                                        <File size={14} className="text-slate-400 shrink-0" />
                                        <span className="text-slate-600 truncate font-medium">{file.name}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-blue-50 rounded-lg transition-all"><Eye size={14} /></button>
                                        {isEditingPersonnel && (
                                          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                )}

                  {personnelTab === 'performance' && (
                    <div className="flex flex-col">
                      <AnimatePresence mode="wait">
                        {!showPerformanceDetail ? (
                          <motion.div 
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col h-full pt-6"
                          >
                            {/* Action & Search Header */}
                            <div className="px-5 space-y-4 mb-6">
                              {/* Top Row: Action Buttons */}
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => {
                                    setPerformanceFormData({
                                      packageName: '',
                                      packageCode: '',
                                      client: '',
                                      clientContact: '',
                                      projectLeader: personnelFormData.name || '',
                                      leaderLeftCompany: '否',
                                      winningAmount: '',
                                      amountUnit: '元',
                                      winningDate: '',
                                      constructionLocation: '',
                                      attachments: {
                                        notification: [],
                                        contract: [],
                                        completion: []
                                      }
                                    });
                                    setEditingPerformanceIndex(null);
                                    setShowPerformanceDetail(true);
                                  }}
                                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm hover:shadow-md"
                                >
                                  <Plus size={16} /> 新增业绩
                                </button>
                                <button 
                                  onClick={() => {
                                    if (selectedItems.size > 0) {
                                      const newList = personnelFormData.performance.filter((_: any, i: number) => !selectedItems.has(i));
                                      setPersonnelFormData({...personnelFormData, performance: newList});
                                      setSelectedItems(new Set());
                                    }
                                  }}
                                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#0052CC] border border-[#0052CC] rounded-xl text-sm font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-sm hover:shadow-md"
                                >
                                  <Trash2 size={16} /> 删除投标业绩
                                </button>
                              </div>

                              {/* Bottom Row: Search & Filters */}
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {/* Search Input */}
                                  <div className="relative w-[220px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                      type="text"
                                      placeholder="搜索投标业绩..."
                                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                      value={performanceSearch}
                                      onChange={(e) => setPerformanceSearch(e.target.value)}
                                    />
                                  </div>

                                  {/* Date Picker */}
                                  <div className="relative w-[160px]">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                      type="text"
                                      placeholder="yyyy-mm"
                                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 outline-none focus:border-blue-500 transition-all"
                                    />
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  <button className="px-8 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm hover:shadow-md">
                                    查询
                                  </button>
                                  <button className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md">
                                    <Filter size={16} />
                                    重置
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mx-5 flex-1 overflow-hidden border border-slate-200 rounded-2xl bg-white">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-3 w-10 text-center">
                                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-4 py-3">项目名称</th>
                                    <th className="px-4 py-3">合同金额</th>
                                    <th className="px-4 py-3">竣工日期</th>
                                    <th className="px-4 py-3">项目负责人</th>
                                    <th className="px-4 py-3">项目所在地</th>
                                    <th className="px-4 py-3 text-center">操作</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(personnelFormData.performance || [])
                                    .filter((p: any) => 
                                      !performanceSearch || 
                                      p.packageName?.toLowerCase().includes(performanceSearch.toLowerCase()) ||
                                      p.client?.toLowerCase().includes(performanceSearch.toLowerCase())
                                    )
                                    .map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                      <td className="px-4 py-3 text-center">
                                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <div className="size-8 bg-slate-50 text-slate-400 rounded flex items-center justify-center shrink-0">
                                            <Briefcase size={16} />
                                          </div>
                                          <span className="text-xs font-bold text-slate-700">{item.packageName || '-'}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-xs font-bold text-blue-600">{item.winningAmount} {item.amountUnit}</span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-xs text-slate-500">{item.winningDate || '-'}</span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-xs text-slate-600">{item.projectLeader || '-'}</span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-slate-500">
                                          <MapPin size={12} />
                                          <span className="text-xs">{item.constructionLocation || '-'}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <button 
                                          onClick={() => {
                                            setPerformanceFormData({...item});
                                            setEditingPerformanceIndex(idx);
                                            setShowPerformanceDetail(true);
                                          }}
                                          className="p-2 text-[#0052CC] hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                                          title="编辑"
                                        >
                                          <Edit2 size={16} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {(personnelFormData.performance || []).length === 0 && (
                                    <tr>
                                      <td colSpan={7} className="px-4 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                          <Briefcase size={40} className="mb-2 opacity-20" />
                                          <p className="text-xs">暂无业绩记录，点击右上角新增</p>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        ) : (
                            <motion.div 
                              key="form"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="absolute inset-0 z-20 bg-white flex flex-col"
                            >
                              {/* Form Header */}
                              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                  <button 
                                    onClick={() => setPerformanceDetailTab('notification')}
                                    className={`text-sm font-bold pb-1 border-b-2 transition-all ${performanceDetailTab === 'notification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                  >
                                    业绩中标通知书
                                  </button>
                                  <button 
                                    onClick={() => setPerformanceDetailTab('contract')}
                                    className={`text-sm font-bold pb-1 border-b-2 transition-all ${performanceDetailTab === 'contract' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                  >
                                    业绩合同协议书
                                  </button>
                                  <button 
                                    onClick={() => setPerformanceDetailTab('completion')}
                                    className={`text-sm font-bold pb-1 border-b-2 transition-all ${performanceDetailTab === 'completion' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                  >
                                    工程竣工验收证明
                                  </button>
                                </div>
                              </div>

                              {/* Form Content */}
                              <div className="flex-1 flex overflow-y-auto custom-scrollbar">
                                {/* Left: Upload Actions */}
                                <div className="w-48 p-6 border-r border-slate-100 bg-white space-y-6 shrink-0">
                                  <div className="space-y-4">
                                    <div className="aspect-square border border-slate-200 border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 transition-colors cursor-pointer">
                                      <Plus size={24} className="text-blue-600 mb-1" />
                                      <span className="text-[11px] font-bold text-blue-600">上传图片</span>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-xs font-bold text-slate-500">证照照片要求</p>
                                      <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 leading-relaxed">支持格式：jpg、jpeg、bmp、png</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">文件大小上限：5M</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Center: Image Preview Area */}
                                <div className="flex-1 bg-slate-50/30 flex items-center justify-center p-12">
                                  <div className="w-full max-w-md aspect-[4/3] border border-slate-200 border-dashed rounded-xl bg-white flex flex-col items-center justify-center text-slate-300">
                                    <Image size={64} className="mb-4 opacity-20" />
                                    <p className="text-xs font-bold text-slate-400">请上传证照照片</p>
                                  </div>
                                </div>
                                {/* Right: Fields */}
                                <div className="w-[420px] p-8 border-l border-slate-100 overflow-y-auto bg-white shrink-0">
                                  <div className="space-y-6">
                                    {performanceDetailTab === 'notification' ? (
                                      <>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <span className="text-red-500">*</span> 标段（包）名称
                                          </label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.packageName}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, packageName: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <span className="text-red-500">*</span> 标段（包）编号
                                          </label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.packageCode}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, packageCode: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">交易甲方</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.client}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, client: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">交易甲方联系人/电话</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.clientContact}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, clientContact: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <span className="text-red-500">*</span> 项目负责人
                                          </label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs outline-none text-slate-500 cursor-not-allowed"
                                            value={performanceFormData.projectLeader}
                                            readOnly
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">原项目负责人已不在公司</label>
                                          <div className="flex items-center gap-6 pt-1">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                              <input 
                                                type="radio" 
                                                name="leaderLeft" 
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                                checked={performanceFormData.leaderLeftCompany === '是'}
                                                onChange={() => setPerformanceFormData({...performanceFormData, leaderLeftCompany: '是'})}
                                              />
                                              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">是</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                              <input 
                                                type="radio" 
                                                name="leaderLeft" 
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                                checked={performanceFormData.leaderLeftCompany === '否'}
                                                onChange={() => setPerformanceFormData({...performanceFormData, leaderLeftCompany: '否'})}
                                              />
                                              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">否</span>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                              <span className="text-red-500">*</span> 中标金额
                                            </label>
                                            <input 
                                              type="text"
                                              placeholder="请输入"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.winningAmount}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, winningAmount: e.target.value})}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                              <span className="text-red-500">*</span> 中标单位
                                            </label>
                                            <div className="relative">
                                              <select 
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all appearance-none"
                                                value={performanceFormData.amountUnit}
                                                onChange={(e) => setPerformanceFormData({...performanceFormData, amountUnit: e.target.value})}
                                              >
                                                <option value="元">元</option>
                                                <option value="万元">万元</option>
                                              </select>
                                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">中标时间</label>
                                          <div className="relative">
                                            <input 
                                              type="date"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.winningDate}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, winningDate: e.target.value})}
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">建设地点</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.constructionLocation}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, constructionLocation: e.target.value})}
                                          />
                                        </div>
                                      </>
                                    ) : performanceDetailTab === 'contract' ? (
                                      <>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">合同金额（元）</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.contractAmount}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, contractAmount: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">合同结算金额（元）</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.settlementAmount}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, settlementAmount: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">合同期限</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.contractPeriod}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, contractPeriod: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">合同签署时间</label>
                                          <div className="relative">
                                            <input 
                                              type="date"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.signingDate}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, signingDate: e.target.value})}
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">原项目负责人已不在公司</label>
                                          <div className="flex items-center gap-6 pt-1">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                              <input 
                                                type="radio" 
                                                name="leaderLeftCompletion" 
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                                checked={performanceFormData.leaderLeftCompany === '是'}
                                                onChange={() => setPerformanceFormData({...performanceFormData, leaderLeftCompany: '是'})}
                                              />
                                              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">是</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                              <input 
                                                type="radio" 
                                                name="leaderLeftCompletion" 
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                                                checked={performanceFormData.leaderLeftCompany === '否'}
                                                onChange={() => setPerformanceFormData({...performanceFormData, leaderLeftCompany: '否'})}
                                              />
                                              <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">否</span>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">实际履行期限</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.actualPerformancePeriod}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, actualPerformancePeriod: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">竣工验收项目负责人</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入/选择竣工验收项目负责人"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.completionAcceptanceLeader}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, completionAcceptanceLeader: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">竣工备案编号</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.completionFilingNumber}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, completionFilingNumber: e.target.value})}
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500">实际造价（万元）</label>
                                            <input 
                                              type="text"
                                              placeholder="请输入"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.actualCost}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, actualCost: e.target.value})}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500">实际面积（平方米）</label>
                                            <input 
                                              type="text"
                                              placeholder="请输入"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.actualArea}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, actualArea: e.target.value})}
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">其他工程特征指标</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.otherEngineeringFeatures}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, otherEngineeringFeatures: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">工程质量</label>
                                          <input 
                                            type="text"
                                            placeholder="请输入"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={performanceFormData.projectQuality}
                                            onChange={(e) => setPerformanceFormData({...performanceFormData, projectQuality: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">实际开工日期</label>
                                          <div className="relative">
                                            <input 
                                              type="date"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.actualCommencementDate}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, actualCommencementDate: e.target.value})}
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500">实际竣工验收日期</label>
                                          <div className="relative">
                                            <input 
                                              type="date"
                                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                              value={performanceFormData.actualCompletionDate}
                                              onChange={(e) => setPerformanceFormData({...performanceFormData, actualCompletionDate: e.target.value})}
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Form Footer */}
                            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-center gap-4">
                              <button 
                                onClick={() => {
                                  const newList = [...(personnelFormData.performance || [])];
                                  if (editingPerformanceIndex !== null) {
                                    newList[editingPerformanceIndex] = {...performanceFormData};
                                  } else {
                                    newList.push({...performanceFormData});
                                  }
                                  setPersonnelFormData({...personnelFormData, performance: newList});
                                  setShowPerformanceDetail(false);
                                }}
                                className="px-8 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all shadow-sm hover:shadow-md active:scale-95"
                              >
                                保存
                              </button>
                              <button 
                                onClick={() => setShowPerformanceDetail(false)}
                                className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                              >
                                取消
                              </button>
                            </div>
                        </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {personnelTab === 'qualifications' && (
                    <div className="flex flex-col h-full">
                      <AnimatePresence mode="wait">
                        {!showQualificationDetail ? (
                          <motion.div 
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 flex flex-col h-full"
                          >

                            <div className="mx-5 flex-1 overflow-hidden border border-slate-200 rounded-2xl bg-white">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-4 py-3 w-10 text-center">
                                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-4 py-3">姓名</th>
                                    <th className="px-4 py-3">资格序列</th>
                                    <th className="px-4 py-3">有效期</th>
                                    <th className="px-4 py-3">资格证书编号</th>
                                    <th className="px-4 py-3 text-center">操作</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(personnelFormData.qualifications || [])
                                    .filter((q: any) => 
                                      !qualificationSearch || 
                                      q.personName?.toLowerCase().includes(qualificationSearch.toLowerCase()) ||
                                      q.qualificationName?.toLowerCase().includes(qualificationSearch.toLowerCase())
                                    )
                                    .map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                      <td className="px-4 py-3 text-center">
                                        <input 
                                          type="checkbox" 
                                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                          checked={item.selected}
                                          onChange={(e) => {
                                            const newList = [...personnelFormData.qualifications];
                                            newList[idx].selected = e.target.checked;
                                            setPersonnelFormData({...personnelFormData, qualifications: newList});
                                          }}
                                        />
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <div className="size-8 bg-slate-50 text-slate-400 rounded flex items-center justify-center shrink-0">
                                            <User size={16} />
                                          </div>
                                          <span className="text-xs font-bold text-slate-700">{item.personName || '-'}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-xs font-bold text-blue-600">{item.qualificationName || '-'}</span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-xs text-slate-500">
                                          {item.startDate || '-'} 至 {item.endDate || '-'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="text-xs font-mono text-slate-500">{item.certificateNumber || '-'}</span>
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <button 
                                            onClick={() => {
                                              setQualificationFormData({
                                                employer: '上线运维测试有限公司',
                                                name: item.personName,
                                                registrationNumber: item.certificateNumber,
                                                qualificationSequence: item.qualificationName,
                                                startDate: item.startDate,
                                                endDate: item.endDate,
                                                sequences: item.sequences || [],
                                                attachments: item.attachments || []
                                              });
                                              setEditingQualificationIndex(idx);
                                              setShowQualificationDetail(true);
                                            }}
                                            className="p-2 text-[#0052CC] hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                                            title="编辑"
                                          >
                                            <Edit2 size={16} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {(personnelFormData.qualifications || []).length === 0 && (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                          <ShieldCheck size={40} className="mb-2 opacity-20" />
                                          <p className="text-sm font-medium">暂无职业资格信息</p>
                                          <p className="text-xs opacity-60">点击上方“新增职业资格”按钮添加</p>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col h-full bg-white"
                          >
                            <div className="flex-1 overflow-y-auto">
                              <div className="flex h-full">
                                {/* Left: Image Upload Actions */}
                                <div className="w-48 p-6 border-r border-slate-100 space-y-6">
                                  <div className="space-y-4">
                                    <div className="aspect-square border border-slate-200 border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 transition-colors cursor-pointer">
                                      <Plus size={24} className="text-blue-600 mb-1" />
                                      <span className="text-[11px] font-bold text-blue-600">上传图片</span>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-xs font-bold text-slate-500">证照照片要求</p>
                                      <div className="space-y-1">
                                        <p className="text-[10px] text-slate-400 leading-relaxed">支持格式：jpg、jpeg、bmp、png</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">文件大小上限：5M</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Center: Image Preview Area */}
                                <div className="flex-1 bg-slate-50/30 flex items-center justify-center p-12">
                                  <div className="w-full max-w-md aspect-[4/3] border border-slate-200 border-dashed rounded-xl bg-white flex flex-col items-center justify-center text-slate-300">
                                    <Image size={64} className="mb-4 opacity-20" />
                                    <p className="text-xs font-bold text-slate-400">请上传证照照片</p>
                                  </div>
                                </div>

                                {/* Right: Form Fields */}
                                <div className="w-[420px] p-8 border-l border-slate-100 overflow-y-auto bg-white">
                                  <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-base font-bold text-slate-800">职业和注册证</h4>
                                    </div>

                                    <div className="space-y-6">
                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                          <span className="text-red-500">*</span> 聘用企业
                                        </label>
                                        <input 
                                          type="text"
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none cursor-not-allowed"
                                          value={qualificationFormData.employer}
                                          readOnly
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                          <span className="text-red-500">*</span> 姓名
                                        </label>
                                        <input 
                                          type="text"
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none cursor-not-allowed"
                                          value={qualificationFormData.name}
                                          readOnly
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                          <span className="text-red-500">*</span> 注册编号
                                        </label>
                                        <input 
                                          type="text"
                                          placeholder="请输入"
                                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                          value={qualificationFormData.registrationNumber}
                                          onChange={(e) => setQualificationFormData({...qualificationFormData, registrationNumber: e.target.value})}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">资格序列</label>
                                        <div className="relative">
                                          <select 
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all appearance-none"
                                            value={qualificationFormData.qualificationSequence}
                                            onChange={(e) => setQualificationFormData({...qualificationFormData, qualificationSequence: e.target.value})}
                                          >
                                            <option value="">请选择</option>
                                            <option value="一级建造师">一级建造师</option>
                                            <option value="二级建造师">二级建造师</option>
                                            <option value="高级工程师">高级工程师</option>
                                          </select>
                                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">开始日期</label>
                                        <div className="relative">
                                          <input 
                                            type="date"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={qualificationFormData.startDate}
                                            onChange={(e) => setQualificationFormData({...qualificationFormData, startDate: e.target.value})}
                                          />
                                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">截止日期</label>
                                        <div className="relative">
                                          <input 
                                            type="date"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition-all"
                                            value={qualificationFormData.endDate}
                                            onChange={(e) => setQualificationFormData({...qualificationFormData, endDate: e.target.value})}
                                          />
                                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Sequence Table Section */}
                                    <div className="space-y-4 pt-4">
                                      <div className="flex justify-end">
                                        <button className="px-3 py-1.5 bg-white text-blue-600 border border-blue-600 rounded text-[11px] font-medium hover:bg-blue-50 transition-all">
                                          新增资格序列
                                        </button>
                                      </div>
                                      <div className="border border-slate-100 rounded overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                          <thead>
                                            <tr className="bg-[#F5F7FA] text-slate-600 text-[11px] font-bold border-b border-slate-100">
                                              <th className="px-3 py-2.5 w-10">序</th>
                                              <th className="px-3 py-2.5">资格序列</th>
                                              <th className="px-3 py-2.5">开始日期</th>
                                              <th className="px-3 py-2.5">截止日期</th>
                                              <th className="px-3 py-2.5 text-center">操作</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50">
                                            <tr className="text-[11px] text-slate-600">
                                              <td className="px-3 py-2.5">1</td>
                                              <td className="px-3 py-2.5">{qualificationFormData.qualificationSequence || '-'}</td>
                                              <td className="px-3 py-2.5">{qualificationFormData.startDate || '-'}</td>
                                              <td className="px-3 py-2.5">{qualificationFormData.endDate || '-'}</td>
                                              <td className="px-3 py-2.5 text-center">
                                                <button className="text-blue-600 hover:underline">编辑</button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-3 bg-slate-50/30">
                              <button 
                                onClick={() => {
                                  const newQualification = {
                                    personName: qualificationFormData.name,
                                    qualificationName: qualificationFormData.qualificationSequence,
                                    startDate: qualificationFormData.startDate,
                                    endDate: qualificationFormData.endDate,
                                    certificateNumber: qualificationFormData.registrationNumber,
                                    selected: false,
                                    isEditing: false
                                  };

                                  const newList = [...(personnelFormData.qualifications || [])];
                                  if (editingQualificationIndex !== null) {
                                    newList[editingQualificationIndex] = newQualification;
                                  } else {
                                    newList.push(newQualification);
                                  }

                                  setPersonnelFormData({...personnelFormData, qualifications: newList});
                                  setShowQualificationDetail(false);
                                }}
                                className="px-10 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all active:scale-95 shadow-sm"
                              >
                                保存
                              </button>
                              <button 
                                onClick={() => setShowQualificationDetail(false)}
                                className="px-10 py-2.5 bg-white text-[#0052CC] border border-[#0052CC] rounded-xl text-sm font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
                              >
                                取消
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      );

  const renderPersonnel = () => {
    const personnelData = currentData.personnel.map((p: any) => ({ ...p, name: `${p.name} (${enterpriseName})` }));
    const currentPagePersonnel = personnelData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPagePersonnel.forEach((item: any) => newSelected.add(item.name)); // Using name as ID for now since there's no id field
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPagePersonnel.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectPersonnel = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(pName => pName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPagePersonnel.length > 0 && currentPagePersonnel.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPagePersonnel.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  checked={isAllCurrentPageSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4">姓名</th>
              <th className="px-6 py-4">职位/职称</th>
              <th className="px-6 py-4">持有证书</th>
              <th className="px-6 py-4">证书编号</th>
              <th className="px-6 py-4">有效期</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {personnelData
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((item: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={selectedItems.includes(item.name)}
                    onChange={() => handleSelectPersonnel(item.name)}
                  />
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
                    {item.cert}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.code}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => {
                        setPersonnelMode('edit');
                        const personName = item.name.split(' (')[0];
                        setPersonnelFormData({
                          ...personnelFormData,
                          name: personName,
                          position: item.title,
                          techTitle: item.title.includes('工程师') ? item.title : '高级工程师',
                          certificates: [{ name: item.cert, code: item.code, expiryDate: item.date, attachments: [] }],
                          // Mocking other data for edit mode
                          isForeigner: '否',
                          gender: '男',
                          birthDate: '1985-06-15',
                          idCard: '44010619850615XXXX',
                          region: '广州市',
                          phone: '13800138000',
                          education: '硕士',
                          isEmployed: '是',
                          performance: [
                            { packageName: 'XX市中心医院建设项目', client: 'XX市卫生局', winningDate: '2023-05-20', winningAmount: '1500.00', amountUnit: '万元', projectLeader: personName, isEditing: false }
                          ],
                          qualifications: [
                            { personName: personName, qualificationName: item.cert, startDate: '2021-01-01', endDate: item.date, certificateNumber: item.code, isEditing: false }
                          ],
                        });
                        setPerformanceSearch('');
                        setQualificationSearch('');
                        setPersonnelTab('basic');
                        setShowAddPersonnelModal(true);
                      }}
                      className="text-primary hover:text-blue-700 transition-colors" 
                      title="编辑"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={Math.ceil(personnelData.length / pageSize)}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        totalItems={personnelData.length}
      />
    </div>
    </div>
  );
};

  const renderFinance = () => {
    const financeData = [
      { name: '2023年度财务审计报告', year: '2023', revenue: '12.8 亿元', profit: '8,500 万元', status: '已审计' },
      { name: '2022年度财务审计报告', year: '2022', revenue: '11.1 亿元', profit: '7,800 万元', status: '已审计' },
      { name: '2021年度财务审计报告', year: '2021', revenue: '9.5 亿元', profit: '6,200 万元', status: '已审计' },
    ].map(f => ({ ...f, name: `${enterpriseName} - ${f.name}` }));
    const currentPageData = financeData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.name));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(itemName => itemName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">报表名称</th>
                <th className="px-6 py-4">年度</th>
                <th className="px-6 py-4">营收金额</th>
                <th className="px-6 py-4">净利润</th>
                <th className="px-6 py-4">审计状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleSelectItem(item.name)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.year}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.revenue}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.profit}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(financeData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={financeData.length}
        />
      </div>
    </div>
  );
};

  const renderRewards = () => {
    const rewardsData = [
      { type: '奖励', title: '2023年度建筑业纳税百强企业', org: '某市人民政府', date: '2024-01-10', status: 'active' },
      { type: '奖励', title: '抗洪救灾突出贡献奖', org: '某省应急管理厅', date: '2023-08-20', status: 'active' },
      { type: '处罚', title: '某工地扬尘治理不力通报批评', org: '某市住建局', date: '2023-03-15', status: 'expired' },
    ].map(r => ({ ...r, title: `${enterpriseName} - ${r.title}` }));
    const currentPageData = rewardsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.title));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.title));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (title: string) => {
      if (selectedItems.includes(title)) {
        setSelectedItems(selectedItems.filter(itemTitle => itemTitle !== title));
      } else {
        setSelectedItems([...selectedItems, title]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.title));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.title));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">类别</th>
                <th className="px-6 py-4">事由</th>
                <th className="px-6 py-4">决定机关</th>
                <th className="px-6 py-4">日期</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.title)}
                      onChange={() => handleSelectItem(item.title)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.type === '奖励' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.org}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold ${item.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {item.status === 'active' ? '生效中' : '已失效'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(rewardsData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={rewardsData.length}
        />
      </div>
    </div>
  );
};

  const renderMaterials = () => {
    const materialsData = [
      { name: '营业执照副本', type: '证照类', count: 1 },
      { name: '开户许可证', type: '证照类', count: 1 },
      { name: '安全生产许可证', type: '证照类', count: 1 },
      { name: '法人身份证复印件', type: '人员类', count: 2 },
      { name: '近三年财务审计报告', type: '财务类', count: 3 },
      { name: '社保缴纳证明', type: '人员类', count: 12 },
      { name: '纳税证明', type: '财务类', count: 6 },
      { name: '诚信承诺书', type: '通用类', count: 1 },
    ].map(m => ({ ...m, name: `${enterpriseName} - ${m.name}` }));
    const currentPageData = materialsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.name));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(itemName => itemName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">材料名称</th>
                <th className="px-6 py-4">材料类别</th>
                <th className="px-6 py-4">文件数量</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleSelectItem(item.name)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Archive size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">共 {item.count} 份文件</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(materialsData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={materialsData.length}
        />
      </div>
    </div>
  );
};

  const renderBasicInfo = () => {
    const SectionHeader = ({ title, attachmentField }: { title: string; attachmentField?: keyof typeof basicInfoForm.attachments }) => {
      const files = attachmentField ? basicInfoForm.attachments[attachmentField] : null;
      const hasFile = files && files.length > 0;
      const isUploading = attachmentField === uploadingField;

      return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center gap-4">
            {attachmentField && (
              isEditingBasicInfo ? (
                <button 
                  disabled={isUploading}
                  onClick={() => triggerUpload(attachmentField as string)}
                  className={`text-xs font-bold flex items-center gap-1 transition-all ${
                    isUploading ? 'text-slate-400 cursor-not-allowed' : 'text-primary hover:underline'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      上传中 {uploadProgress}%
                    </>
                  ) : (
                    <>
                      {hasFile ? <Clock size={12} /> : <Plus size={12} />}
                      {hasFile ? '重新上传' : '上传附件'}
                    </>
                  )}
                </button>
              ) : (
                hasFile ? (
                  <button 
                    onClick={() => setPreviewImage({ url: files[0].url, name: files[0].name })}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    查看附件
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">未上传附件</span>
                )
              )
            )}
          </div>
        </div>
      );
    };

    const InfoItem = ({ label, value, field }: { label: string; value: string; field: keyof typeof basicInfoForm }) => (
      <div className="flex flex-col gap-1 px-6 py-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {isEditingBasicInfo ? (
          <input
            type="text"
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={basicInfoForm[field]}
            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, [field]: e.target.value })}
          />
        ) : (
          <span className="text-sm text-slate-700 font-medium">{value || '-'}</span>
        )}
      </div>
    );

    const InfoTextArea = ({ label, value, field }: { label: string; value: string; field: keyof typeof basicInfoForm }) => (
      <div className="flex flex-col gap-1 px-6 py-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {isEditingBasicInfo ? (
          <textarea
            rows={3}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            value={basicInfoForm[field]}
            onChange={(e) => setBasicInfoForm({ ...basicInfoForm, [field]: e.target.value })}
          />
        ) : (
          <span className="text-sm text-slate-700 font-medium">{value || '-'}</span>
        )}
      </div>
    );

    const AttachmentItem = ({ label, field }: { label: string; field: 'promise' | 'authorization' }) => {
      const files = basicInfoForm.attachments[field];
      const hasFile = files && files.length > 0;
      const isUploading = field === uploadingField;

      return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white rounded border border-slate-200 flex items-center justify-center text-primary">
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700">{label}</div>
              <div className="text-[10px] text-slate-400">支持格式: jpg、jpeg bmp、png 文件大小上限: 50M</div>
              {hasFile && !isEditingBasicInfo && (
                <div className="text-[10px] text-blue-600 mt-1 flex items-center gap-1 cursor-pointer hover:underline">
                  <ExternalLink size={10} /> {files[0].name}
                </div>
              )}
              {isUploading && (
                <div className="w-48 h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditingBasicInfo ? (
              isUploading ? (
                <span className="text-xs font-bold text-slate-400">{uploadProgress}%</span>
              ) : hasFile ? (
                <button 
                  onClick={() => {
                    const newAttachments = { ...basicInfoForm.attachments, [field]: [] };
                    setBasicInfoForm({ ...basicInfoForm, attachments: newAttachments });
                  }}
                  className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={12} /> 删除
                </button>
              ) : (
                <button 
                  onClick={() => triggerUpload(field)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> 上传附件
                </button>
              )
            ) : (
              hasFile ? (
                <button 
                  onClick={() => setPreviewImage({ url: files[0].url, name: files[0].name })}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  查看
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-400">未上传附件</span>
              )
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-6 p-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
        {/* 营业执照信息 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <SectionHeader title="营业执照信息" attachmentField="license" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-2">
            <InfoItem label="企业名称" value={basicInfoForm.enterpriseName} field="enterpriseName" />
            <InfoItem label="统一社会信用代码" value={basicInfoForm.creditCode} field="creditCode" />
            <InfoItem label="法定代表人" value={basicInfoForm.legalPerson} field="legalPerson" />
            <InfoItem label="单位性质" value={basicInfoForm.unitNature} field="unitNature" />
            <InfoItem label="注册资本" value={basicInfoForm.registeredCapital} field="registeredCapital" />
            <InfoItem label="注册资本币种" value={basicInfoForm.currency} field="currency" />
            <InfoItem label="营业期限" value={basicInfoForm.businessPeriod} field="businessPeriod" />
            <InfoItem label="登记机关" value={basicInfoForm.registrationAuthority} field="registrationAuthority" />
            <InfoItem label="国别/地区" value={basicInfoForm.country} field="country" />
            <div className="md:col-span-3">
              <InfoItem label="注册地区" value={basicInfoForm.region} field="region" />
            </div>
            <div className="md:col-span-3">
              <InfoTextArea label="经营范围" value={basicInfoForm.businessScope} field="businessScope" />
            </div>
          </div>
        </div>

        {/* 基本户信息 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <SectionHeader title="基本户信息" attachmentField="account" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-2">
            <InfoItem label="开户银行" value={basicInfoForm.bankName} field="bankName" />
            <InfoItem label="开户账号(基本账号)" value={basicInfoForm.bankAccount} field="bankAccount" />
            <InfoItem label="开户银行地址" value={basicInfoForm.bankAddress} field="bankAddress" />
            <InfoItem label="开户银行电话" value={basicInfoForm.bankPhone} field="bankPhone" />
            <InfoItem label="开户银行传真" value={basicInfoForm.bankFax} field="bankFax" />
            <InfoItem label="开户银行联系人及职务" value={basicInfoForm.bankContact} field="bankContact" />
            <div className="md:col-span-3">
              <InfoItem label="基本户名称" value={basicInfoForm.accountName} field="accountName" />
            </div>
          </div>
        </div>

        {/* 安全许可证信息 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <SectionHeader title="安全许可证信息" attachmentField="safety" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-2">
            <InfoItem label="安全生产许可证编号" value={basicInfoForm.safetyLicense} field="safetyLicense" />
            <InfoItem label="经济类型" value={basicInfoForm.economicType} field="economicType" />
            <InfoItem label="单位地址" value={basicInfoForm.unitAddress} field="unitAddress" />
            <InfoItem label="许可范围" value={basicInfoForm.licenseScope} field="licenseScope" />
            <InfoItem label="主要负责人" value={basicInfoForm.mainPerson} field="mainPerson" />
            <InfoItem label="企业名称" value={basicInfoForm.safetyEnterpriseName} field="safetyEnterpriseName" />
            <InfoItem label="有效期" value={basicInfoForm.safetyExpiry} field="safetyExpiry" />
          </div>
        </div>

        {/* 法人信息 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <SectionHeader title="法人信息" attachmentField="legal" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-2">
            <InfoItem label="法人姓名" value={basicInfoForm.legalName} field="legalName" />
            <InfoItem label="法人身份证号码" value={basicInfoForm.legalId} field="legalId" />
            <InfoItem label="性别" value={basicInfoForm.gender} field="gender" />
            <InfoItem label="法定代表人电话" value={basicInfoForm.legalPhone} field="legalPhone" />
            <InfoItem label="法定代表人技术职称" value={basicInfoForm.legalTitle} field="legalTitle" />
            <InfoItem label="法定代表人公司职务" value={basicInfoForm.legalPosition} field="legalPosition" />
          </div>
        </div>

        {/* 其他信息 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <SectionHeader title="其他信息" attachmentField="other" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-2">
            <InfoItem label="企业英文名称" value={basicInfoForm.englishName} field="englishName" />
            <InfoItem label="单位属性" value={basicInfoForm.unitAttribute} field="unitAttribute" />
            <InfoItem label="国民经济行业分类" value={basicInfoForm.industryCategory} field="industryCategory" />
            <InfoItem label="电子邮箱" value={basicInfoForm.email} field="email" />
            <InfoItem label="邮政编码" value={basicInfoForm.postalCode} field="postalCode" />
            <InfoItem label="负责人" value={basicInfoForm.manager} field="manager" />
            <InfoItem label="联系电话" value={basicInfoForm.contactPhone} field="contactPhone" />
            <InfoItem label="单位项目经理人数" value={basicInfoForm.projectManagerCount} field="projectManagerCount" />
            <InfoItem label="单位高级职称人数" value={basicInfoForm.seniorTitleCount} field="seniorTitleCount" />
            <InfoItem label="单位中级职称人数" value={basicInfoForm.middleTitleCount} field="middleTitleCount" />
            <InfoItem label="单位初级职称人数" value={basicInfoForm.juniorTitleCount} field="juniorTitleCount" />
            <InfoItem label="单位技工人数" value={basicInfoForm.technicianCount} field="technicianCount" />
            <InfoItem label="员工总人数" value={basicInfoForm.totalEmployees} field="totalEmployees" />
            <InfoItem label="单位传真" value={basicInfoForm.fax} field="fax" />
            <InfoItem label="企业网址" value={basicInfoForm.website} field="website" />
            <div className="md:col-span-3">
              <InfoItem label="详细地址" value={basicInfoForm.detailedAddress} field="detailedAddress" />
            </div>
            <div className="md:col-span-3">
              <InfoItem label="主要供货/服务区域" value={basicInfoForm.serviceRegion} field="serviceRegion" />
            </div>
            <div className="md:col-span-3">
              <InfoTextArea label="单位简介" value={basicInfoForm.introduction} field="introduction" />
            </div>
          </div>
        </div>

        {/* 相关附件 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <SectionHeader title="相关附件" />
          <div className="p-6">
            <div className="flex flex-col gap-4">
              <AttachmentItem label="诚信承诺书" field="promise" />
              <AttachmentItem label="法人授权委托书" field="authorization" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQualification = () => {
    const qualificationData = currentData.qualification.map((q: any) => ({ ...q, name: `${enterpriseName} - ${q.name}` }));
    const currentPageData = qualificationData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.name));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(itemName => itemName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">资质名称</th>
                <th className="px-6 py-4">资质编号</th>
                <th className="px-6 py-4">有效期至</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleSelectItem(item.name)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-lg flex items-center justify-center ${
                        item.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-primary/5 text-primary'
                      }`}>
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.code}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className={item.status === 'warning' ? 'text-amber-500' : 'text-slate-400'} />
                      <span className={`text-xs font-bold ${item.status === 'warning' ? 'text-amber-600' : 'text-slate-500'}`}>
                        {item.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === 'warning' ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-100">
                        即将到期
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                        正常
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(qualificationData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={qualificationData.length}
        />
      </div>
    </div>
  );
};

  const renderPerformance = () => {
    const performanceData = currentData.performance.map((p: any) => ({ ...p, name: `${enterpriseName} - ${p.name}` }));
    const currentPageData = performanceData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.name));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(itemName => itemName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">项目名称</th>
                <th className="px-6 py-4">合同金额</th>
                <th className="px-6 py-4">竣工日期</th>
                <th className="px-6 py-4">项目负责人</th>
                <th className="px-6 py-4">项目所在地</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleSelectItem(item.name)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Briefcase size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-primary">{item.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-medium">{item.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{item.manager}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={12} />
                      <span className="text-xs">{item.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(performanceData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={performanceData.length}
        />
      </div>
    </div>
  );
};

  const renderHonors = () => {
    const honorsData = [
      { name: '中国建筑工程鲁班奖', year: '2023', level: '国家级', icon: Award, color: 'text-amber-500 bg-amber-50' },
      { name: '全国优秀施工企业', year: '2022', level: '国家级', icon: ShieldCheck, color: 'text-blue-500 bg-blue-50' },
      { name: '省优质工程“扬子杯”', year: '2023', level: '省级', icon: Award, color: 'text-emerald-500 bg-emerald-50' },
      { name: '市建筑业先进单位', year: '2022', level: '市级', icon: Award, color: 'text-purple-500 bg-purple-50' },
      { name: 'AAA 级信用企业', year: '2023', level: '国家级', icon: ShieldCheck, color: 'text-rose-500 bg-rose-50' },
      { name: '安全生产文明工地', year: '2021', level: '省级', icon: CheckCircle2, color: 'text-cyan-500 bg-cyan-50' },
    ].map(h => ({ ...h, name: `${enterpriseName} - ${h.name}` }));
    const currentPageData = honorsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.name));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(itemName => itemName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">荣誉奖项名称</th>
                <th className="px-6 py-4">级别</th>
                <th className="px-6 py-4">年度</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleSelectItem(item.name)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold border border-slate-100">
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.year}年度</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(honorsData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={honorsData.length}
        />
      </div>
    </div>
  );
};

  const renderDisclosure = () => {
    const disclosureData = [
      { title: '关于公司 2023 年度利润分配预案的公告', date: '2024-03-20', type: '定期报告' },
      { title: '关于中标重大工程项目的公告', date: '2024-02-15', type: '临时公告' },
      { title: '关于公司法定代表人变更的公告', date: '2023-12-10', type: '临时公告' },
    ].map(d => ({ ...d, title: `${enterpriseName} - ${d.title}` }));
    const currentPageData = disclosureData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.title));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.title));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (title: string) => {
      if (selectedItems.includes(title)) {
        setSelectedItems(selectedItems.filter(itemTitle => itemTitle !== title));
      } else {
        setSelectedItems([...selectedItems, title]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.title));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.title));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">公告标题</th>
                <th className="px-6 py-4">类型</th>
                <th className="px-6 py-4">发布日期</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.title)}
                      onChange={() => handleSelectItem(item.title)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold border border-slate-100">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(disclosureData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={disclosureData.length}
        />
      </div>
    </div>
  );
};

  const renderCredit = () => {
    const creditData = [
      { name: '企业信用等级', value: 'AAA', org: '中国建筑业协会', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-500' },
      { name: '荣誉称号', value: '守合同重信用', org: '国家工商行政管理总局', icon: CheckCircle2, color: 'bg-blue-50 text-blue-500' },
      { name: '售后服务评价', value: '五星级', org: 'GB/T 27922-2011', icon: Award, color: 'bg-purple-50 text-purple-500' },
    ].map(c => ({ ...c, name: `${enterpriseName} - ${c.name}` }));
    const currentPageData = creditData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.add(item.name));
        setSelectedItems(Array.from(newSelected));
      } else {
        const newSelected = new Set(selectedItems);
        currentPageData.forEach((item: any) => newSelected.delete(item.name));
        setSelectedItems(Array.from(newSelected));
      }
    };

    const handleSelectItem = (name: string) => {
      if (selectedItems.includes(name)) {
        setSelectedItems(selectedItems.filter(itemName => itemName !== name));
      } else {
        setSelectedItems([...selectedItems, name]);
      }
    };

    const isAllCurrentPageSelected = currentPageData.length > 0 && currentPageData.every((item: any) => selectedItems.includes(item.name));
    const isSomeCurrentPageSelected = currentPageData.some((item: any) => selectedItems.includes(item.name));

    return (
    <div className="flex flex-col">
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={isAllCurrentPageSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeCurrentPageSelected && !isAllCurrentPageSelected;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">评价项</th>
                <th className="px-6 py-4">等级/称号</th>
                <th className="px-6 py-4">颁发/评级机构</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      checked={selectedItems.includes(item.name)}
                      onChange={() => handleSelectItem(item.name)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.org}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="text-primary hover:text-blue-700 transition-colors" 
                        title="编辑"
                        onClick={() => {
                          setGenericFormMode('edit');
                          setShowGenericForm(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(creditData.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={creditData.length}
        />
      </div>
    </div>
  );
};

  return (
    <div className="flex flex-col h-full">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-[#0052CC]/10 rounded-xl flex items-center justify-center text-[#0052CC] border border-[#0052CC]/20">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{enterpriseName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">统一社会信用代码：91110000100001234X</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidePanel('certificates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
              sidePanel === 'certificates' 
                ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Archive size={16} /> 电子证照库
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} /> 导出企业档案
          </button>
        </div>
      </div>

      {/* Tabs and Content Container */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6 flex-1">
        {/* Tabs Row */}
        <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidePanel(null);
                setSelectedItems([]);
                setShowGenericForm(false);
                setShowAddPersonnelModal(false);
                setIsEditingBasicInfo(false);
              }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id && !sidePanel
                  ? 'border-blue-600 text-blue-600 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar Below Tabs */}
        {(!sidePanel && (!showAddPersonnelModal || activeTab !== 'personnel')) && (
          <div className="flex flex-col">
            <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center">
              <button 
                onClick={() => {
                  if (activeTab === 'basic') {
                    setIsEditingBasicInfo(!isEditingBasicInfo);
                  } else if (activeTab === 'personnel') {
                    setPersonnelMode('add');
                    setPersonnelFormData({
                      name: '',
                      isForeigner: '否',
                      gender: '男',
                      birthDate: '',
                      idCard: '',
                      region: '',
                      phone: '',
                      workPhone: '',
                      postalCode: '',
                      techTitle: '高级工程师',
                      position: '',
                      isEmployed: '是',
                      careerStartDate: '',
                      careerYears: '',
                      education: '博士',
                      major: '',
                      address: '',
                      experience: '',
                      unitCode: '91999779974015331P',
                      unitName: '上线运维测试有限公司',
                      graduationDate: '',
                      graduationSchool: '',
                      unitPosition: '',
                      email: '',
                      dept: '',
                      entryDate: '',
                      titleNumber: '',
                      titleMajor: '',
                      titleAuthority: '',
                      titleLevel: '高级',
                      titleIssueDate: '',
                      attachments: {
                        socialSecurity: [],
                        contract: [],
                        photo: [],
                        titleCert: [],
                        others: []
                      },
                      performance: [],
                      qualifications: []
                    });
                    setPerformanceSearch('');
                    setQualificationSearch('');
                    setPersonnelTab('basic');
                    setShowAddPersonnelModal(true);
                  } else if (activeTab !== 'basic') {
                    setGenericFormMode('add');
                    setShowGenericForm(true);
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                {activeTab === 'basic' ? (isEditingBasicInfo ? <CheckCircle2 size={16} /> : <Edit2 size={16} />) : <Plus size={16} />}
                {sidePanel === 'certificates' ? '上传证照' : 
                 activeTab === 'personnel' ? '新增人员' :
                 activeTab === 'qualification' ? '新增资质' :
                 activeTab === 'performance' ? '新增业绩' :
                 activeTab === 'finance' ? '新增财务数据' :
                 activeTab === 'rewards' ? '新增奖惩' :
                 activeTab === 'honors' ? '新增荣誉' :
                 activeTab === 'materials-list' ? '上传材料' :
                 activeTab === 'disclosure' ? '新增披露' :
                 activeTab === 'credit' ? '新增评价' : (isEditingBasicInfo ? '保存信息' : '编辑信息')}
              </button>
              
              {activeTab !== 'basic' && (
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#0052CC] text-[#0052CC] rounded-xl text-sm font-bold hover:bg-blue-50 transition-all ml-3 shadow-sm hover:shadow-md active:scale-95">
                  <Trash2 size={16} />
                  删除{tabs.find(t => t.id === activeTab)?.label.replace('新增', '')}
                </button>
              )}
            </div>
            
            {activeTab !== 'basic' && (
              <div className="bg-white border-b border-slate-100 px-6 py-3">
                {renderSearchAndFilter(`搜索${tabs.find(t => t.id === activeTab)?.label}...`)}
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'basic' && renderBasicInfo()}
              {activeTab === 'personnel' && renderPersonnel()}
              {activeTab === 'qualification' && renderQualification()}
              {activeTab === 'performance' && renderPerformance()}
              {activeTab === 'finance' && renderFinance()}
              {activeTab === 'rewards' && renderRewards()}
              {activeTab === 'honors' && renderHonors()}
              {activeTab === 'materials-list' && renderMaterials()}
              {activeTab === 'disclosure' && renderDisclosure()}
              {activeTab === 'credit' && renderCredit()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Personnel Form Modal */}
      {renderPersonnelForm()}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {(previewFile || previewImage) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => {
              setPreviewFile(null);
              setPreviewImage(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <ImageIcon size={18} />
                  </div>
                  <h3 className="font-bold text-slate-800">{previewImage?.name || '文件预览'}</h3>
                </div>
                <button 
                  onClick={() => {
                    setPreviewFile(null);
                    setPreviewImage(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center bg-slate-50 min-h-[400px] max-h-[80vh] overflow-auto">
                {(() => {
                  const url = previewFile || previewImage?.url;
                  const name = previewImage?.name || '预览文件';
                  
                  if (!url) return null;

                  // Check if it's likely an image
                  const isImage = url.startsWith('blob:') || 
                                 url.includes('picsum.photos') || 
                                 url === '#' ||
                                 /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name);

                  if (isImage) {
                    return (
                      <img 
                        src={url === '#' ? `https://picsum.photos/seed/${name}/1200/800` : url} 
                        alt={name}
                        className="max-w-full max-h-[70vh] object-contain shadow-lg rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    );
                  }

                  return (
                    <div className="flex flex-col items-center gap-4 py-12">
                      <div className="size-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300">
                        <FileText size={40} />
                      </div>
                      <div className="text-center">
                        <p className="text-slate-800 font-bold">{name}</p>
                        <p className="text-slate-500 text-sm mt-1">该文件类型暂不支持直接预览</p>
                      </div>
                      <a 
                        href={url} 
                        download={name}
                        className="mt-2 px-6 py-2.5 bg-[#0052CC] text-white rounded-xl font-bold text-sm hover:bg-[#0052CC]/90 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
                      >
                        <Download size={16} />
                        下载文件查看
                      </a>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Panel Drawer */}
      <AnimatePresence>
        {sidePanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidePanel(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[900px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${
                    sidePanel === 'certificates' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'
                  }`}>
                    <Archive size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      电子证照库
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">管理企业投标所需的各类电子证明与素材文件</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidePanel(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <Certificates />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnterpriseInfo;
