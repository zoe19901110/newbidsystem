import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  FolderPlus, 
  Shield, 
  Key, 
  Search, 
  MoreHorizontal, 
  ChevronRight,
  ChevronDown,
  Plus,
  UserCheck,
  Building,
  Mail,
  Phone,
  Edit2,
  Trash2,
  X,
  GripVertical,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import Pagination from './Pagination';

interface Department {
  id: string;
  name: string;
  count: number;
}

interface User {
  id: string;
  name: string;
  depts: string[]; // 支持多个部门
  position: string;
  roleId: string; // Link to Role
  email: string;
  phone: string;
  status: string;
  username?: string;
  hasAccount: boolean;
  enterprises: string[];
}

interface Role {
  id: string;
  name: string;
  desc: string;
  userCount: number;
  isDefault?: boolean;
}

interface Enterprise {
  id: string;
  name: string;
}

interface OrgStructureProps {
  enterprisesList: Enterprise[];
  currentEnterprise?: Enterprise;
}

const OrgStructure: React.FC<OrgStructureProps> = ({ enterprisesList, currentEnterprise }) => {
  const [activeSubTab, setActiveSubTab] = useState('dept');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modals
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form States
  const [deptForm, setDeptForm] = useState({ name: '' });
  const [roleForm, setRoleForm] = useState({ name: '', desc: '查看自己创建的数据' });
  const [userForm, setUserForm] = useState({
    name: '',
    depts: [] as string[], // 修改为数组
    position: '',
    roleId: '3', // Default to '普通员工'
    email: '',
    phone: '',
    status: '正常',
    createAccount: false,
    username: '',
    password: '',
    enterprises: [] as string[]
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('departments');
    const initialDepts = [
      { id: '1', name: '总经办', count: 0 },
      { id: '2', name: '市场部', count: 0 },
      { id: '3', name: '技术部', count: 0 },
      { id: '4', name: '财务部', count: 0 },
      { id: '5', name: '法务部', count: 0 },
    ];
    if (!saved) return initialDepts;
    const parsed = JSON.parse(saved);
    // 确保初始部门都在列表中
    let mergedDepts = [...parsed];
    initialDepts.forEach(initialDept => {
      if (!mergedDepts.find(d => d.name === initialDept.name)) {
        mergedDepts.push(initialDept);
      }
    });
    return mergedDepts;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    const demoEnterprises = ['中建八局第三建设有限公司', '中铁建工集团有限公司', '陈经理'];
    const initialUsers = [
      { id: '1', name: '陈经理', depts: ['总经办'], position: '项目总监', roleId: '1', email: 'chen@example.com', phone: '13800008888', status: '正常', hasAccount: true, username: '13800138000', enterprises: ['中建八局第三建设有限公司', '中铁建工集团有限公司', '陈经理'] },
      { id: '1-2', name: '李助理', depts: ['总经办'], position: '行政助理', roleId: '3', email: 'li_asst@example.com', phone: '13800001111', status: '正常', hasAccount: true, username: '13800001111', enterprises: ['中建八局第三建设有限公司', '陈经理'] },
      { id: '2', name: '王志强', depts: ['市场部'], position: '市场经理', roleId: '2', email: 'wang@example.com', phone: '13900007777', status: '正常', hasAccount: true, username: '13900007777', enterprises: ['中铁建工集团有限公司', '陈经理'] },
      { id: '2-2', name: '赵敏', depts: ['市场部'], position: '商务专员', roleId: '3', email: 'zhao@example.com', phone: '13900002222', status: '正常', hasAccount: true, username: '13900002222', enterprises: ['中建八局第三建设有限公司'] },
      { id: '3', name: '李晓明', depts: ['技术部'], position: '技术专家', roleId: '3', email: 'li@example.com', phone: '13700006666', status: '正常', hasAccount: true, username: '13700006666', enterprises: ['中铁建工集团有限公司'] },
      { id: '3-2', name: '周工', depts: ['技术部'], position: '高级工程师', roleId: '3', email: 'zhou@example.com', phone: '13700003333', status: '正常', hasAccount: true, username: '13700003333', enterprises: ['中建八局第三建设有限公司', '陈经理'] },
      { id: '3-3', name: '吴工', depts: ['技术部'], position: '研发工程师', roleId: '3', email: 'wu@example.com', phone: '13700004444', status: '正常', hasAccount: true, username: '13700004444', enterprises: ['中铁建工集团有限公司'] },
      { id: '4', name: '张美玲', depts: ['财务部'], position: '财务主管', roleId: '4', email: 'zhang@example.com', phone: '13600005555', status: '正常', hasAccount: true, username: '13600005555', enterprises: ['中建八局第三建设有限公司'] },
      { id: '4-2', name: '孙会计', depts: ['财务部'], position: '出纳', roleId: '3', email: 'sun@example.com', phone: '13600006666', status: '正常', hasAccount: true, username: '13600006666', enterprises: ['中铁建工集团有限公司', '陈经理'] },
      { id: '5', name: '郑律师', depts: ['法务部'], position: '法务顾问', roleId: '3', email: 'zheng@example.com', phone: '13500009999', status: '正常', hasAccount: true, username: '13500009999', enterprises: ['中建八局第三建设有限公司'] },
    ];
    if (!saved) return initialUsers;
    const parsed = JSON.parse(saved);
    
    // 确保所有初始演示人员都在列表中
    let mergedUsers = [...parsed];
    initialUsers.forEach(initialUser => {
      if (!mergedUsers.find(u => u.id === initialUser.id || u.phone === initialUser.phone)) {
        mergedUsers.push(initialUser);
      }
    });

    // 迁移数据：转换部门格式
    return mergedUsers.map((u: any) => {
      const depts = u.depts || (u.dept ? [u.dept] : []);
      const enterprises = u.enterprises || [];
      return { ...u, depts, enterprises };
    });
  });

  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const departmentsWithCounts = React.useMemo(() => {
    return departments.map(dept => {
      const count = users.filter(u => {
        const matchesEnterprise = currentEnterprise ? u.enterprises.includes(currentEnterprise.name) : true;
        return matchesEnterprise && u.depts.includes(dept.name);
      }).length;
      return { ...dept, count };
    });
  }, [departments, users, currentEnterprise]);

  const [rolesData, setRolesData] = useState<Role[]>(() => {
    const saved = localStorage.getItem('roles');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((r: Role) => {
        if (['1', '2', '3', '4'].includes(r.id)) {
          return { ...r, isDefault: true };
        }
        return r;
      });
    }
    return [
      { id: '1', name: '超级管理员', desc: '拥有全部数据查看权限', userCount: 0, isDefault: true },
      { id: '2', name: '部门经理', desc: '拥有本部门数据查看权限', userCount: 0, isDefault: true },
      { id: '3', name: '普通员工', desc: '查看自己创建的数据', userCount: 0, isDefault: true },
      { id: '4', name: '财务审计', desc: '仅拥有财务查看相关权限', userCount: 0, isDefault: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(rolesData));
  }, [rolesData]);

  const roles: Role[] = rolesData.map(role => ({
    ...role,
    userCount: users.filter(u => u.roleId === role.id).length
  }));

  const tabs = [
    { id: 'dept', label: '部门与人员', icon: Users },
    { id: 'role', label: '角色管理', icon: Shield },
    { id: 'permission', label: '权限管理', icon: Key },
  ];

  const [selectedRoleId, setSelectedRoleId] = useState('1');
  const [permissions, setPermissions] = useState<Record<string, Record<string, { view: boolean; edit: boolean }>>>({
    '1': { // 超级管理员
      'leads': { view: true, edit: true },
      'projects': { view: true, edit: true },
      'parsing': { view: true, edit: true },
      'ai-prep': { view: true, edit: true },
      'inspection': { view: true, edit: true },
      'simulation': { view: true, edit: true },
      'deposit': { view: true, edit: true },
      'opening': { view: true, edit: true },
      'org': { view: true, edit: true },
    },
    '2': { // 部门经理
      'leads': { view: true, edit: true },
      'projects': { view: true, edit: true },
      'parsing': { view: true, edit: false },
      'ai-prep': { view: true, edit: false },
      'inspection': { view: true, edit: false },
      'simulation': { view: true, edit: true },
      'deposit': { view: true, edit: true },
      'opening': { view: true, edit: true },
      'org': { view: true, edit: false },
    },
    '3': { // 普通员工
      'leads': { view: true, edit: false },
      'projects': { view: true, edit: false },
      'parsing': { view: true, edit: false },
      'ai-prep': { view: true, edit: false },
      'inspection': { view: true, edit: false },
      'simulation': { view: true, edit: false },
      'deposit': { view: false, edit: false },
      'opening': { view: true, edit: false },
      'org': { view: false, edit: false },
    }
  });

  const modules = [
    { id: 'leads', name: '商机线索管理' },
    { id: 'projects', name: '投标项目登记' },
    { id: 'parsing', name: '招标文件解析' },
    { id: 'ai-prep', name: 'AI编标工作台' },
    { id: 'inspection', name: '标书合规性检查' },
    { id: 'simulation', name: '模拟开标系统' },
    { id: 'deposit', name: '保证金管理' },
    { id: 'opening', name: '开标情况管理' },
    { id: 'org', name: '组织架构管理' },
  ];

  const handlePermissionChange = (moduleId: string, type: 'view' | 'edit', value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        [moduleId]: {
          ...prev[selectedRoleId]?.[moduleId] || { view: false, edit: false },
          [type]: value
        }
      }
    }));
  };

  // Handlers
  const handleAddDept = () => {
    setEditingDept(null);
    setDeptForm({ name: '' });
    setShowDeptModal(true);
  };

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm({ name: dept.name });
    setShowDeptModal(true);
  };

  const handleSaveDept = () => {
    if (!deptForm.name) return;
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, name: deptForm.name } : d));
    } else {
      const newDept = {
        id: Math.random().toString(36).substr(2, 9),
        name: deptForm.name,
        count: 0
      };
      setDepartments([...departments, newDept]);
    }
    setShowDeptModal(false);
  };

  const handleDeleteDept = (id: string) => {
    setConfirmDialog({
      message: '确定要删除该部门吗？',
      onConfirm: () => {
        setDepartments(departments.filter(d => d.id !== id));
        if (selectedDeptId === id) setSelectedDeptId(null);
      }
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    const selectedDeptName = selectedDeptId ? departments.find(d => d.id === selectedDeptId)?.name : null;
    setUserForm({
      name: '',
      depts: selectedDeptName ? [selectedDeptName] : [],
      position: '',
      roleId: '3',
      email: '',
      phone: '',
      status: '正常',
      createAccount: false,
      username: '',
      password: '',
      enterprises: currentEnterprise ? [currentEnterprise.name] : []
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ 
      ...user,
      depts: user.depts || [],
      createAccount: user.hasAccount,
      username: user.username || '',
      password: '',
      enterprises: user.enterprises || []
    });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    // 修复：部门选择框的值为空数组时，不应触发保存
    if (!userForm.name || !userForm.depts || userForm.depts.length === 0 || !userForm.phone) {
      showToast("请填写完整姓名、联系电话，并至少选择一个部门");
      return;
    }
    
    // Check if account exists globally by phone
    const existingUser = users.find(u => u.phone === userForm.phone);

    let updatedUsers;
    let isNewAccount = false;
    let savedUserId = '';

    if (existingUser) {
      // 如果账号已存在，合并部门
      isNewAccount = !existingUser.hasAccount;
      savedUserId = existingUser.id;
      
      // 合并部门列表，去重
      const mergedDepts = Array.from(new Set([...existingUser.depts, ...userForm.depts]));
      
      updatedUsers = users.map(u => u.id === existingUser.id ? { 
        ...u, 
        ...userForm,
        depts: mergedDepts, // 使用合并后的部门
        id: existingUser.id, // Ensure we keep the original ID
        hasAccount: true,
        username: userForm.phone
      } : u);

      // If we were editing a DIFFERENT user and changed their phone to an existing one,
      // we remove the "old" user record to avoid duplicates
      if (editingUser && editingUser.id !== existingUser.id) {
        updatedUsers = updatedUsers.filter(u => u.id !== editingUser.id);
      }
      
      if (!isNewAccount) {
        showToast(`账号 ${userForm.phone} 已存在，已将其关联到选定的部门。`);
      }
    } else if (editingUser) {
      // Standard edit for non-conflicting phone
      isNewAccount = !editingUser.hasAccount;
      savedUserId = editingUser.id;
      updatedUsers = users.map(u => u.id === editingUser.id ? { 
        ...u, 
        ...userForm,
        hasAccount: true,
        username: userForm.phone
      } : u);
    } else {
      // Standard add for new phone
      isNewAccount = true;
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userForm,
        hasAccount: true,
        username: userForm.phone
      };
      savedUserId = newUser.id;
      updatedUsers = [...users, newUser];
    }

    setUsers(updatedUsers);
    setHighlightedUserId(savedUserId);
    setTimeout(() => setHighlightedUserId(null), 3000);

    // Update dept counts
    setDepartments(updatedUsers.length > 0 ? departments : departments); // Dummy to trigger re-render if needed, but useMemo handles it
    
    if (!editingUser) {
      showToast('新增成功，初始密码6个1');
    }

    setShowUserModal(false);
  };

  const handleSaveRole = () => {
    if (!roleForm.name) {
      showToast("请填写角色名称");
      return;
    }
    
    if (editingRole) {
      setRolesData(rolesData.map(r => r.id === editingRole.id ? { ...r, name: roleForm.name, desc: roleForm.desc } : r));
      showToast("角色修改成功");
    } else {
      const newRole = {
        id: Math.random().toString(36).substr(2, 9),
        name: roleForm.name,
        desc: roleForm.desc,
        userCount: 0,
        isDefault: false
      };
      setRolesData([...rolesData, newRole]);
      showToast("角色新增成功");
    }
    
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handleResetPassword = () => {
    showToast('重置成功，初始密码6个1');
  };

  const handleRemoveUser = (id: string) => {
    setConfirmDialog({
      message: '确定要将该人员从企业中移除吗？移除后该账号将无法登录且在企业中消失。',
      onConfirm: () => {
        const updatedUsers = users.filter(u => u.id !== id);
        setUsers(updatedUsers);
        setSelectedUserIds(prev => prev.filter(selectedId => selectedId !== id));
      }
    });
  };

  const handleBulkDeleteUsers = () => {
    if (selectedUserIds.length === 0) return;
    setConfirmDialog({
      message: `确定要将这 ${selectedUserIds.length} 名人员从企业中批量移除吗？移除后这些账号将无法登录且在企业中消失。`,
      onConfirm: () => {
        const updatedUsers = users.filter(u => !selectedUserIds.includes(u.id));
        setUsers(updatedUsers);
        setSelectedUserIds([]);
        showToast('批量移除成功');
      }
    });
  };

  const handleToggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === '正常' ? '禁用' : '正常';
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
  };

  const filteredUsers = users.filter(user => {
    const matchesEnterprise = currentEnterprise ? user.enterprises.includes(currentEnterprise.name) : true;
    const selectedDeptName = departments.find(d => d.id === selectedDeptId)?.name;
    const matchesDept = selectedDeptName ? user.depts.includes(selectedDeptName) : true;
    const matchesSearch = user.name.includes(searchQuery) || user.email.includes(searchQuery) || user.position.includes(searchQuery);
    return matchesEnterprise && matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex gap-3">
          
          {activeSubTab === 'role' && (
            <button 
              onClick={() => {
                setEditingRole(null);
                setRoleForm({ name: '', desc: '查看自己创建的数据' });
                setShowRoleModal(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Shield size={16} /> 新增角色
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeSubTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <tab.icon size={18} />
              {tab.label}
            </div>
            {activeSubTab === tab.id && (
              <motion.div 
                layoutId="activeSubTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052CC]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {activeSubTab === 'dept' && (
          <>
            {/* Dept List */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h4 className="font-bold text-sm">部门列表</h4>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedDeptId(null)}
                      className={`text-xs font-bold ${!selectedDeptId ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      全部
                    </button>
                    <button 
                      onClick={handleAddDept}
                      className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
                      title="新增部门"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <Reorder.Group 
                  axis="y" 
                  values={departments} 
                  onReorder={setDepartments}
                  className="p-2 space-y-1 max-h-[600px] overflow-y-auto"
                >
                  {departmentsWithCounts.map((dept) => (
                    <Reorder.Item 
                      key={dept.id} 
                      value={departments.find(d => d.id === dept.id)!}
                      className="group relative"
                    >
                      <div className="flex items-center">
                        <div className="p-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-opacity">
                          <GripVertical size={14} />
                        </div>
                        <button 
                          onClick={() => setSelectedDeptId(dept.id)}
                          className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                            selectedDeptId === dept.id ? 'bg-blue-50 text-[#0052CC]' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Building size={16} className={selectedDeptId === dept.id ? 'text-[#0052CC]' : 'text-slate-400'} />
                            <span className="text-sm font-medium">{dept.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              selectedDeptId === dept.id ? 'bg-blue-100 text-[#0052CC]' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {dept.count}
                            </span>
                          </div>
                        </button>
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditDept(dept); }}
                          className="p-1 text-slate-400 hover:text-[#0052CC] hover:bg-white rounded shadow-sm"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteDept(dept.id); }}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded shadow-sm"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h5 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                  <Users size={14} /> 组织概况
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 rounded-lg p-2">
                    <p className="text-[10px] text-blue-600 mb-0.5">总人数</p>
                    <p className="text-lg font-bold text-blue-900">
                      {users.filter(u => currentEnterprise ? u.enterprises.includes(currentEnterprise.name) : true).length}
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2">
                    <p className="text-[10px] text-blue-600 mb-0.5">部门数</p>
                    <p className="text-lg font-bold text-blue-900">{departments.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="col-span-9 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-4">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索姓名、角色或手机号..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    {selectedDeptId && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-[#0052CC]/10 text-[#0052CC] rounded-md text-xs font-bold">
                        {departments.find(d => d.id === selectedDeptId)?.name}
                        <button onClick={() => setSelectedDeptId(null)}><X size={12} /></button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-400">
                      共 <span className="font-bold text-slate-600">{filteredUsers.length}</span> 位成员
                    </div>
                    <button 
                      onClick={handleAddUser}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0052CC] text-white rounded-lg text-xs font-bold hover:bg-[#0052CC]/90 transition-all shadow-sm"
                    >
                      <UserPlus size={14} /> 新增人员
                    </button>
                    <button
                      onClick={handleBulkDeleteUsers}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC]/5"
                      disabled={selectedUserIds.length === 0}
                    >
                      <Trash2 size={14} /> 删除人员 {selectedUserIds.length > 0 ? `(${selectedUserIds.length})` : ''}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                          checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserIds(filteredUsers.map(u => u.id));
                            } else {
                              setSelectedUserIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-4">姓名</th>
                      <th className="px-6 py-4">部门/职位</th>
                      <th className="px-6 py-4">系统角色</th>
                      <th className="px-6 py-4">联系方式/账号</th>
                      <th className="px-6 py-4">账号状态</th>
                      <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? filteredUsers
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((user) => (
                      <tr key={user.id} className={`${user.id === highlightedUserId ? 'bg-primary/20' : 'hover:bg-slate-50/50'} transition-colors group`}>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUserIds([...selectedUserIds, user.id]);
                              } else {
                                setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-700 truncate" title={user.depts.join(', ')}>{user.depts.join(', ')}</p>
                            <p className="text-[10px] text-slate-400 truncate" title={user.position}>{user.position}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#0052CC]/5 text-[#0052CC] text-[10px] font-bold border border-[#0052CC]/10">
                            {roles.find(r => r.id === user.roleId)?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Phone size={12} className="text-primary" /> 
                            <span className="font-mono font-bold text-slate-700">{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                            title={`点击${user.status === '正常' ? '禁用' : '启用'}账号`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit cursor-pointer transition-all active:scale-95 ${
                              user.status === '正常' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <span className={`size-1.5 rounded-full ${user.status === '正常' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {user.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 transition-opacity">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-slate-400 hover:text-[#0052CC] hover:bg-[#0052CC]/5 rounded-lg transition-colors"
                              title="编辑"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      )) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                              <Users size={40} className="opacity-20" />
                              <p className="text-sm">暂无匹配人员</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredUsers.length / pageSize)}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  totalItems={filteredUsers.length}
                />
              </div>
            </div>
          </>
        )}

        {activeSubTab === 'role' && (
          <div className="col-span-12">
            <div className="grid grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-[#0052CC]/10 rounded-xl flex items-center justify-center text-[#0052CC]">
                        <Shield size={20} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{role.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingRole(role);
                          setRoleForm({ name: role.name, desc: role.desc });
                          setShowRoleModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-[#0052CC] hover:bg-[#0052CC]/5 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={16} />
                      </button>
                      {!role.isDefault && (
                        <button 
                          onClick={() => {
                            setConfirmDialog({
                              message: `确定要删除角色“${role.name}”吗？关联的用户将被重置为“普通员工”。`,
                              onConfirm: () => {
                                setRolesData(rolesData.filter(r => r.id !== role.id));
                                setUsers(users.map(u => u.roleId === role.id ? { ...u, roleId: '3' } : u));
                                if (selectedRoleId === role.id) {
                                  setSelectedRoleId('1');
                                }
                                showToast('角色删除成功');
                              }
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed h-10 line-clamp-2">{role.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400">关联用户: <span className="font-bold text-slate-700">{role.userCount}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'permission' && (
          <div className="col-span-12 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 min-h-[600px]">
                {/* Role Selector Sidebar */}
                <div className="col-span-3 border-r border-slate-100 bg-slate-50/30">
                  <div className="p-4 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">选择角色</h4>
                  </div>
                  <div className="p-2 space-y-1">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left ${
                          selectedRoleId === role.id ? 'bg-[#0052CC] text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span className="text-sm font-bold">{role.name}</span>
                        <ChevronRight size={16} className={selectedRoleId === role.id ? 'text-white' : 'text-slate-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Permission Matrix */}
                <div className="col-span-9 flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        权限配置: <span className="text-primary ml-1">{roles.find(r => r.id === selectedRoleId)?.name}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">勾选对应的功能模块权限，即时生效</p>
                    </div>
                    <button 
                      onClick={() => alert('权限配置已保存')}
                      className="px-4 py-2 bg-[#0052CC] text-white rounded-lg text-xs font-bold hover:bg-[#0052CC]/90 shadow-md shadow-blue-500/20"
                    >
                      保存配置
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <th className="px-8 py-4">功能模块</th>
                          <th className="px-8 py-4 text-center">查看权限</th>
                          <th className="px-8 py-4 text-center">编辑权限</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {modules.map((module) => (
                          <tr key={module.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-5">
                              <span className="text-sm font-medium text-slate-700">{module.name}</span>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={permissions[selectedRoleId]?.[module.id]?.view || false}
                                  onChange={(e) => handlePermissionChange(module.id, 'view', e.target.checked)}
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0052CC]"></div>
                              </label>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <label className="inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={permissions[selectedRoleId]?.[module.id]?.edit || false}
                                  onChange={(e) => handlePermissionChange(module.id, 'edit', e.target.checked)}
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0052CC]"></div>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dept Modal */}
      <AnimatePresence>
        {showDeptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold">{editingDept ? '编辑部门' : '新增部门'}</h4>
                <button onClick={() => setShowDeptModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">部门名称</label>
                  <input 
                    type="text" 
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ name: e.target.value })}
                    placeholder="请输入部门名称"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowDeptModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveDept}
                  className="flex-1 px-4 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold">{editingUser ? '编辑人员' : '新增人员'}</h4>
                <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">姓名</label>
                    <input 
                      type="text" 
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">职位</label>
                    <input 
                      type="text" 
                      value={userForm.position}
                      onChange={(e) => setUserForm({ ...userForm, position: e.target.value })}
                      placeholder="如：项目经理"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">账号状态</label>
                    <select 
                      value={userForm.status}
                      onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                    >
                      <option value="正常">正常</option>
                      <option value="禁用">禁用</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                  <div className="relative" ref={deptDropdownRef}>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">部门 (可多选)</label>
                    <div 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm cursor-pointer flex items-center justify-between hover:bg-slate-100 transition-colors"
                      onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                    >
                      <span className={`truncate mr-2 ${userForm.depts.length === 0 ? "text-slate-400" : "text-slate-900"}`}>
                        {userForm.depts.length === 0 
                          ? "请选择部门" 
                          : userForm.depts.length <= 2 
                            ? userForm.depts.join(', ') 
                            : `已选择 ${userForm.depts.length} 个部门`}
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform flex-shrink-0 ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <AnimatePresence>
                      {isDeptDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                        >
                          <div className="p-2 space-y-1">
                            {departments.map(d => (
                              <label key={d.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
                                <input 
                                  type="checkbox"
                                  checked={userForm.depts.includes(d.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setUserForm({ ...userForm, depts: [...userForm.depts, d.name] });
                                    } else {
                                      setUserForm({ ...userForm, depts: userForm.depts.filter(name => name !== d.name) });
                                    }
                                  }}
                                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4"
                                />
                                <span className="text-sm text-slate-700">{d.name}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">系统角色 (关联权限)</label>
                    <select 
                      value={userForm.roleId}
                      onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">联系电话 (即系统登录账号)</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={userForm.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserForm({ ...userForm, phone: val });
                        
                        // Auto-search and link if 11 digits
                        if (val.length === 11) {
                          const match = users.find(u => u.phone === val);
                          if (match) {
                            setUserForm(prev => ({
                              ...prev,
                              phone: val,
                              name: match.name,
                              position: match.position,
                              roleId: match.roleId,
                              status: match.status
                            }));
                          }
                        }
                      }}
                      placeholder="请输入手机号"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {userForm.phone.length >= 11 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {(() => {
                          const existingUser = users.find(u => u.phone === userForm.phone && (!editingUser || u.id !== editingUser.id));
                          if (existingUser) {
                            return (
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                                  <UserCheck size={10} /> 已匹配到账号
                                </span>
                                <span className="text-[8px] text-slate-400 mt-0.5">已自动同步: {existingUser.name}</span>
                              </div>
                            );
                          } else if (!editingUser) {
                            return (
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Plus size={10} /> 将自动创建账号
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Settings Section */}
                <div className="col-span-2 pt-4 border-t border-slate-100 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key size={16} className="text-primary" />
                      <span className="text-sm font-bold text-slate-900">账号安全设置</span>
                    </div>
                    {editingUser && (
                      <button 
                        onClick={handleResetPassword}
                        className="text-[10px] font-bold text-[#0052CC] hover:bg-[#0052CC]/5 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Key size={10} /> 重置密码
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveUser}
                  className="flex-1 px-4 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{editingRole ? '编辑角色' : '新增角色'}</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">角色名称</label>
                  <input 
                    type="text" 
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="请输入角色名称"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">权限级别</label>
                  <select 
                    value={roleForm.desc}
                    onChange={(e) => setRoleForm({ ...roleForm, desc: e.target.value })}
                    disabled={!!editingRole}
                    className={`w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
                      editingRole ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <option value="拥有全部数据查看权限">查看全部数据</option>
                    <option value="拥有本部门数据查看权限">查看本部门数据</option>
                    <option value="查看自己创建的数据">查看自己数据</option>
                    <option value="仅拥有财务查看相关权限">查看财务数据</option>
                  </select>
                  {editingRole && (
                    <p className="text-[10px] text-slate-400 mt-1.5">提示：现有角色的权限级别不可修改</p>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => {
                    setShowRoleModal(false);
                    setEditingRole(null);
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveRole}
                  className="flex-1 px-4 py-2.5 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="text-green-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认操作</h3>
              <p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    setConfirmDialog(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0052CC] text-white rounded-xl text-sm font-bold hover:bg-[#0052CC]/90 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrgStructure;
