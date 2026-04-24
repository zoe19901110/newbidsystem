import React, { useState } from 'react';
import BidParsingList from './BidParsingList';
import BidParsingDetail from './BidParsingDetail';

interface BidParsingProps {
  onEnterWorkbench?: (project: any) => void;
  currentEnterprise?: { id: string; name: string };
  isPaused?: boolean;
  onBack?: () => void;
  autoImported?: boolean;
  uploadedFiles?: Record<string, boolean>;
}

const BidParsing: React.FC<BidParsingProps> = ({ onEnterWorkbench, currentEnterprise, isPaused = false, onBack }) => {
  const defaultProject = {
    id: '1',
    name: `2026年智慧交通管理平台建设项目`,
    code: 'ZB-2026-001',
    tenderer: 'XX市交通运输局',
    updateTime: '2025-11-20 14:30',
    status: '已解析',
    latestFile: '2026年智慧交通管理平台建设项目招标文件.pdf',
    uploadedFiles: { 'tender-doc': true }
  };

  const [view, setView] = useState<'list' | 'detail'>('detail');
  const [selectedProject, setSelectedProject] = useState<any>(defaultProject);

  const handleEnterDetail = (project: any) => {
    setSelectedProject(project);
    setView('detail');
  };

  const handleBackToList = () => {
    if (onBack) {
      onBack();
    } else {
      setView('list');
      setSelectedProject(null);
    }
  };

  const handleViewReport = () => {
    if (selectedProject) {
      if (onEnterWorkbench) {
        onEnterWorkbench(selectedProject);
      } else if (onBack) {
        onBack();
      }
    }
  };

  return (
    <div className="w-full h-full">
      {view === 'list' ? (
        <BidParsingList 
          onEnterDetail={handleEnterDetail} 
          currentEnterprise={currentEnterprise}
          isPaused={isPaused}
        />
      ) : (
        <BidParsingDetail 
          project={selectedProject} 
          onBack={handleBackToList}
          onViewReport={handleViewReport}
          currentEnterprise={currentEnterprise}
          isPaused={isPaused}
        />
      )}
    </div>
  );
};

export default BidParsing;
