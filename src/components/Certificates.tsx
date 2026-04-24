import React, { useState } from 'react';
import { Search, Plus, Download, FileText, ShieldCheck, Calendar, Filter, Edit2, Trash2, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';
import { useTableResizer } from '../hooks/useTableResizer';

interface CertificatesProps {
  currentEnterprise?: { id: string; name: string };
}

const Certificates: React.FC<CertificatesProps> = ({ currentEnterprise }) => {
  const enterpriseId = currentEnterprise?.id || 'ent-1';
  const enterpriseName = currentEnterprise?.name || '杭州某某科技有限公司';

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { widths, onMouseDown } = useTableResizer([
    'auto', // 证照名称
    150,    // 证照编号
    200,    // 颁发机构
    120,    // 有效期至
    100,    // 状态
    150     // 操作
  ]);

  const getCertData = () => {
    const baseCerts = [
      { name: `营业执照`, code: '91110000100001234X', org: '市场监督管理局', date: '长期', status: '正常' },
      { name: `建筑业企业资质证书`, code: 'D211060800', org: '住房和城乡建设部', date: '2028-05-20', status: '正常' },
      { name: `安全生产许可证`, code: '(京)JZ安许证字[2021]000123', org: '住房和城乡建设委员会', date: '2026-04-15', status: 'warning' },
      { name: `质量管理体系认证`, code: '00121Q31000123', org: '中国质量认证中心', date: '2026-03-01', status: 'expired' },
    ];

    if (enterpriseId === 'personal') {
      return [
        { name: '一级建造师执业资格证书', code: '京111060800001', org: '住房和城乡建设部', date: '2027-12-31', status: '正常' },
        { name: '高级工程师职称证书', code: 'GC20230001', org: '某省人力资源和社会保障厅', date: '长期', status: '正常' },
      ];
    }

    return baseCerts.map(c => ({ ...c, name: `${enterpriseName}-${c.name}` }));
  };

  const certs = getCertData();

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">总证照数</p>
          <p className="text-2xl font-bold text-slate-900">{certs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">即将到期 (30天内)</p>
          <p className="text-2xl font-bold text-amber-500">{certs.filter(c => c.status === 'warning').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">已过期</p>
          <p className="text-2xl font-bold text-rose-500">{certs.filter(c => c.status === 'expired').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">待年检</p>
          <p className="text-2xl font-bold text-blue-500">5</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                {[
                  { label: '证照名称', key: 'name' },
                  { label: '证照编号', key: 'code' },
                  { label: '颁发机构', key: 'org' },
                  { label: '有效期至', key: 'date' },
                  { label: '状态', key: 'status' },
                  { label: '操作', key: 'action', align: 'right' }
                ].map((col, idx) => (
                  <th 
                    key={col.key} 
                    style={{ width: widths[idx] }}
                    className={`px-6 py-4 relative group/th ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    <span className="truncate">{col.label}</span>
                    {idx < 5 && (
                      <div 
                        onMouseDown={(e) => onMouseDown(idx, e)}
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 active:bg-primary transition-colors z-10"
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {certs
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 overflow-hidden">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="size-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 truncate" title={item.name}>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400 overflow-hidden">
                    <div className="truncate" title={item.code}>{item.code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 overflow-hidden">
                    <div className="truncate" title={item.org}>{item.org}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 overflow-hidden">
                    <div className="truncate" title={item.date}>{item.date}</div>
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border truncate block w-fit ${
                      item.status === '正常' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`} title={item.status === '正常' ? '正常' : item.status === 'warning' ? '即将到期' : '已过期'}>
                      {item.status === '正常' ? '正常' : item.status === 'warning' ? '即将到期' : '已过期'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-primary transition-colors" title="下载"><Download size={16} /></button>
                      <button className="text-slate-400 hover:text-primary transition-colors" title="编辑"><Edit2 size={16} /></button>
                      <button className="text-slate-400 hover:text-rose-500 transition-colors" title="删除"><Trash2 size={16} /></button>
                      <button className="text-primary text-xs font-bold hover:underline">查看</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(certs.length / pageSize)}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={certs.length}
        />
      </div>
    </div>
  );
};

export default Certificates;
