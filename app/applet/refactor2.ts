import * as fs from 'fs';

const filePath = 'src/components/EnterpriseInfo.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const returnStart = content.indexOf('  return (\n    <div className="flex flex-col h-full">');
if (returnStart === -1) {
    console.error("Return start not found");
    process.exit(1);
}

const searchBarStart = content.indexOf('        {/* Search Bar - Integrated */}');
if (searchBarStart === -1) {
    console.error("Search bar start not found");
    process.exit(1);
}

const newHeaderAndTabs = `  return (
    <div className="flex flex-col h-full">
      {/* Tabs and Content Container */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6 flex-1">
        {/* Tabs and Actions Row */}
        <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 pr-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidePanel(null);
                }}
                className={\`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 \${
                  activeTab === tab.id && !sidePanel
                    ? 'border-blue-600 text-blue-600 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }\`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pl-4 flex-shrink-0">
            <button 
              onClick={() => {
                if (activeTab === 'personnel') {
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
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all"
            >
              {activeTab === 'basic' ? <Edit2 size={16} /> : <Plus size={16} />}
              {sidePanel === 'certificates' ? '上传证照' : 
               activeTab === 'personnel' ? '新增人员' :
               activeTab === 'qualification' ? '新增资质' :
               activeTab === 'performance' ? '新增业绩' :
               activeTab === 'finance' ? '新增财务数据' :
               activeTab === 'rewards' ? '新增奖惩' :
               activeTab === 'honors' ? '新增荣誉' :
               activeTab === 'materials-list' ? '上传材料' :
               activeTab === 'disclosure' ? '新增披露' :
               activeTab === 'credit' ? '新增评价' : '编辑信息'}
            </button>
            
            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            
            <button 
              onClick={() => setSidePanel('certificates')}
              className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border \${
                sidePanel === 'certificates' 
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                  : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
              }\`}
            >
              <Archive size={16} /> 电子证照库
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={16} /> 导出企业档案
            </button>
          </div>
        </div>

`;

content = content.substring(0, returnStart) + newHeaderAndTabs + content.substring(searchBarStart);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Refactoring complete");
