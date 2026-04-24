import * as fs from 'fs';

const filePath = 'src/components/EnterpriseInfo.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const modalStartMatch = content.indexOf('      {/* Add Personnel Modal */}');
const modalEndMatch = content.indexOf('      {/* File Preview Modal */}');

if (modalStartMatch === -1 || modalEndMatch === -1) {
    console.error("Modal bounds not found");
    process.exit(1);
}

const modalContent = content.substring(modalStartMatch, modalEndMatch);
content = content.substring(0, modalStartMatch) + content.substring(modalEndMatch);

const innerStart = modalContent.indexOf('<div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">');
const innerEnd = modalContent.lastIndexOf('</motion.div>');

if (innerStart === -1 || innerEnd === -1) {
    console.error("Inner bounds not found");
    process.exit(1);
}

let innerContent = modalContent.substring(innerStart, innerEnd);

const headerOriginal = `<div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{personnelMode === 'add' ? '新增人员资料' : '修改人员资料'}</h3>
                  </div>
                  <button 
                    onClick={() => setShowAddPersonnelModal(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>`;

const headerNew = `<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowAddPersonnelModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-slate-500 font-bold text-sm"
                    >
                      <ArrowLeft size={18} /> 返回列表
                    </button>
                    <div className="h-4 w-px bg-slate-200 mx-2"></div>
                    <h3 className="text-lg font-bold text-slate-900">{personnelMode === 'add' ? '新增人员资料' : '修改人员资料'}</h3>
                  </div>
                </div>`;

innerContent = innerContent.replace(headerOriginal, headerNew);
innerContent = innerContent.replace(
    'className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4"',
    'className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4"'
);

const renderFormFunc = `  const renderPersonnelForm = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[600px]">
      ${innerContent}
    </div>
  );\n\n`;

const renderPersonnelIdx = content.indexOf('  const renderPersonnel = () => {');
content = content.substring(0, renderPersonnelIdx) + renderFormFunc + content.substring(renderPersonnelIdx);

const newBody = `    if (showAddPersonnelModal) {
      return renderPersonnelForm();
    }

    const personnelData = currentData.personnel.map((p: any) => ({ ...p, name: \`\${p.name} (\${enterpriseName})\` }));`;

content = content.replace('    const personnelData = currentData.personnel.map((p: any) => ({ ...p, name: `${p.name} (${enterpriseName})` }));', newBody);

const searchBarOriginal = "{!sidePanel && activeTab !== 'basic' && renderSearchAndFilter(`搜索${tabs.find(t => t.id === activeTab)?.label}...`)}";
const searchBarNew = "{!sidePanel && activeTab !== 'basic' && (!showAddPersonnelModal || activeTab !== 'personnel') && renderSearchAndFilter(`搜索${tabs.find(t => t.id === activeTab)?.label}...`)}";
content = content.replace(searchBarOriginal, searchBarNew);

if (!content.includes('ArrowLeft')) {
    content = content.replace('import { ', 'import { ArrowLeft, ');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Refactoring complete");
