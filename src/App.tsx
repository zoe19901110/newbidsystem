import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import BusinessDashboard from './components/BusinessDashboard';
import Workbench from './components/Workbench';
import BidParsing from './components/BidParsing';
import BidInspection from './components/BidInspection';
import OrgStructure from './components/OrgStructure';
import TenderProjectRegistration from './components/TenderProjectRegistration';
import SecurityDepositManagement from './components/SecurityDepositManagement';
import TenderOpeningStatusManagement from './components/TenderOpeningStatusManagement';
import OtherProjectMaterials from './components/OtherProjectMaterials';
import PersonalCenter from './components/PersonalCenter';
import EnterpriseInfo from './components/EnterpriseInfo';
import Certificates from './components/Certificates';
import Materials from './components/Materials';
import Login from './components/Login';

import { motion, AnimatePresence } from 'motion/react';
import { User, Building2 } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'dashboard');
  const [workbenchStage, setWorkbenchStage] = useLocalStorage<string | undefined>('workbenchStage', undefined);
  const [projectData, setProjectData] = useLocalStorage<any>('projectData', null);
  const [projects, setProjects] = useLocalStorage<any[]>('tender-projects', []);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useLocalStorage('user-profile', {
    name: '陈经理',
    nickname: 'ProManager_Chen',
    email: 'chen.manager@enterprise.com',
    phone: '138 0000 8888'
  });
  const [enterprises, setEnterprises] = useLocalStorage('enterprises', [
    { id: 'personal', name: profile?.nickname || '陈经理', status: '13800138000' },
    { id: '1', name: '中建八局第三建设有限公司', status: '已加入' },
    { id: '2', name: '中铁建工集团有限公司', status: '已加入' },
    { id: '3', name: '中国建筑第一局(集团)有限公司', status: '审核中' },
  ]);

  // Sync personal identity name with nickname
  React.useEffect(() => {
    setEnterprises(prev => prev.map(ent => 
      ent.id === 'personal' ? { ...ent, name: profile.nickname } : ent
    ));
  }, [profile.nickname, setEnterprises]);
  const [currentEnterpriseId, setCurrentEnterpriseId] = useLocalStorage('currentEnterpriseId', '1');
  const currentEnterprise = React.useMemo(() => 
    enterprises.find(e => e.id === currentEnterpriseId) || enterprises[1],
    [enterprises, currentEnterpriseId]
  );

  const handleLogin = (enterpriseId: string) => {
    const selected = enterprises.find(e => e.id === enterpriseId);
    if (selected) {
      setCurrentEnterpriseId(selected.id);
    } else if (enterpriseId === 'personal') {
      setCurrentEnterpriseId(enterprises[0].id);
    }
    setIsLoggedIn(true);
  };

  const handleSwitchEnterprise = (ent: any) => {
    setCurrentEnterpriseId(ent.id);
  };

  const [uploadedFilesMapping, setUploadedFilesMapping] = useLocalStorage<Record<string, Record<string, boolean>>>('uploadedFilesMapping', {});
  const activeProjectId = projectData?.id || 'default';
  const uploadedFiles = uploadedFilesMapping[activeProjectId] || {};

  const setUploadedFiles = React.useCallback((value: React.SetStateAction<Record<string, boolean>>) => {
    setUploadedFilesMapping(prev => ({
      ...prev,
      [activeProjectId]: typeof value === 'function' ? value(prev[activeProjectId] || {}) : value
    }));
  }, [activeProjectId, setUploadedFilesMapping]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(prev => {
            if (prev.length > 0) return prev;
            return data;
          });
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateProject = async (updatedProject: any) => {
    try {
      // In a real app we'd have a PUT endpoint, for now we can mock it or just update state 
      // but let's assume we want persistence. I'll add a save endpoint if needed.
      const mappedProjectToSave = {
        ...updatedProject,
        name: updatedProject.projectName || updatedProject.name,
        code: updatedProject.projectNumber || updatedProject.code,
        tenderer: updatedProject.tendererAndContact || updatedProject.tenderer,
        agent: updatedProject.tenderAgentAndContact || updatedProject.agent,
        bidOpeningTime: updatedProject.openingTime || updatedProject.bidOpeningTime,
        deposit: updatedProject.depositAmount || updatedProject.deposit,
      };

      setProjects(prev => prev.map(p => p.id === updatedProject.id ? { ...p, ...mappedProjectToSave } : p));
      setProjectData(updatedProject);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleEnterWorkbench = (stage: string, data?: any) => {
    // Map status string to Phase type
    const stageMap: Record<string, string> = {
      '准备阶段': 'preparation',
      '制作阶段': 'production',
      '检查阶段': 'inspection',
      '标后归档': 'archiving'
    };
    if (data) {
      if (!data.id && data.projectName) {
        // Find existing project by name
        const existingProject = projects.find(p => p.name === data.projectName);
        let finalData = data;
        if (existingProject) {
          finalData = { ...existingProject, ...data };
        } else {
          finalData = {
            id: `PROJ-${Date.now()}`,
            name: data.projectName,
            code: data.projectNumber || `ZB-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            status: stage === '准备阶段' ? '投标中' : '进行中',
            tenderer: data.tenderer || data.tendererAndContact || 'XX招标人',
            tendererContact: data.tendererContact || '--',
            agent: data.tenderAgent || data.tenderAgentAndContact || 'XX代理机构',
            agentContact: data.agentContact || '--',
            bidOpeningTime: data.openingTime || data.deadline || '--',
            deposit: data.depositAmount || '--',
            depositDeadline: data.depositDeadline || '--',
            openingLocation: data.openingLocation || '--',
            collectionTime: data.collectionTime || '--',
            requirements: data.tenderRequirements || '',
            otherRemarks: data.otherRemarks || '',
            tenderControlPrice: data.tenderControlPrice || '--',
            ...data
          };
          setProjects(prev => [finalData, ...prev]);
        }
        setProjectData(finalData);
      } else {
        setProjectData(data);
      }
    }
    setWorkbenchStage(stageMap[stage] || 'preparation');
    setActiveTab('workbench');
  };

  const renderContent = () => {
    // Handle enterprise sub-tabs
    if (activeTab.startsWith('ent-')) {
      const subTab = activeTab.replace('ent-', '');
      return <EnterpriseInfo initialTab={subTab} currentEnterprise={currentEnterprise} />;
    }

    if (activeTab === 'certificates' || activeTab === 'materials') {
      return <EnterpriseInfo initialTab={activeTab} currentEnterprise={currentEnterprise} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onEnterWorkbench={handleEnterWorkbench} 
            setActiveTab={setActiveTab} 
            currentEnterprise={currentEnterprise} 
            projects={projects}
          />
        );
      case 'business-dashboard':
        return <BusinessDashboard currentEnterprise={currentEnterprise} projects={projects} />;
      case 'workbench':
        return (
          <Workbench 
            onExit={() => setActiveTab('dashboard')} 
            initialPhase={workbenchStage as any} 
            initialProjectData={projectData}
            currentEnterprise={currentEnterprise}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'parsing':
        return <BidParsing onEnterWorkbench={handleEnterWorkbench} currentEnterprise={currentEnterprise} />;
      case 'inspection':
        return <BidInspection currentEnterprise={currentEnterprise} uploadedFilesMapping={uploadedFilesMapping} projects={projects} />;
      case 'org':
        return <OrgStructure enterprisesList={enterprises} currentEnterprise={currentEnterprise} />;
      case 'enterprise':
        return <EnterpriseInfo currentEnterprise={currentEnterprise} />;
      case 'knowledge-base':
        return <Materials currentEnterprise={currentEnterprise} />;
      case 'project-registration':
        return <TenderProjectRegistration 
          onEnterWorkbench={handleEnterWorkbench} 
          currentEnterprise={currentEnterprise} 
          projects={projects}
          setProjects={setProjects}
          uploadedFilesMapping={uploadedFilesMapping}
          setUploadedFilesMapping={setUploadedFilesMapping}
        />;
      case 'deposit-management':
        return <SecurityDepositManagement currentEnterprise={currentEnterprise} projects={projects} />;
      case 'opening-management':
        return <TenderOpeningStatusManagement currentEnterprise={currentEnterprise} projects={projects} />;
      case 'other-materials':
        return <OtherProjectMaterials currentEnterprise={currentEnterprise} projects={projects} />;
      case 'personal-center':
        return <PersonalCenter currentEnterprise={currentEnterprise} profile={profile} setProfile={setProfile} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">?</span>
            </div>
            <p className="text-lg font-medium">该模块正在开发中...</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-[#0052CC] font-bold hover:underline"
            >
              返回首页
            </button>
          </div>
        );
    }
  };

  const handleAddEnterprise = (name: string) => {
    const newId = (enterprises.length + 1).toString();
    const newEnterprise = { id: newId, name, status: '已加入' };
    setEnterprises(prev => [...prev, newEnterprise]);
    return newId;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light">
      {activeTab !== 'workbench' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          enterprises={enterprises}
          currentEnterprise={currentEnterprise}
          setCurrentEnterprise={handleSwitchEnterprise}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar 
          setActiveTab={setActiveTab} 
          enterprises={enterprises}
          currentEnterprise={currentEnterprise}
          setCurrentEnterprise={handleSwitchEnterprise}
          onLogout={() => {
            setIsLoggedIn(false);
            localStorage.removeItem('isLoggedIn');
          }}
          onAddEnterprise={handleAddEnterprise}
          profile={profile}
        />
        <main className="flex-1 overflow-y-auto p-8 [scrollbar-gutter:stable]">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

        </main>
      </div>
    </div>
  );
}

