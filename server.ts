import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('app.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    file_name TEXT NOT NULL,
    type TEXT,
    upload_date TEXT,
    size TEXT,
    uploader TEXT
  );

  CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS operation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT DEFAULT (datetime('now','localtime')),
    module TEXT,
    action TEXT,
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    tenderer TEXT,
    tenderer_contact TEXT,
    agent TEXT,
    agent_contact TEXT,
    bid_opening_time TEXT,
    status TEXT,
    deposit TEXT,
    deposit_deadline TEXT,
    opening_location TEXT,
    collection_time TEXT,
    requirements TEXT,
    other_remarks TEXT,
    tender_control_price TEXT,
    material_count INTEGER DEFAULT 0,
    has_materials BOOLEAN DEFAULT 0
  );
`);

// Initial Data Seed if empty
const categoryCount = db.prepare('SELECT count(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const insert = db.prepare('INSERT INTO categories (id, name, parent_id, sort_order) VALUES (?, ?, ?, ?)');
  insert.run('cat-1', '技术材料', null, 0);
  insert.run('cat-2', '商务材料', null, 1);
  insert.run('cat-3', '基础结构', null, 2);
  insert.run('sub-1', '工程量清单', 'cat-3', 0);
}

const projectCount = db.prepare('SELECT count(*) as count FROM projects').get() as { count: number };
if (projectCount.count < 20) {
    const insert = db.prepare('INSERT INTO projects (id, name, code, tenderer, tenderer_contact, agent, agent_contact, bid_opening_time, status, deposit, deposit_deadline, opening_location, collection_time, requirements, other_remarks, tender_control_price, material_count, has_materials) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    
    const existingIds = (db.prepare('SELECT id FROM projects').all() as {id: string}[]).map(r => r.id);
    
    const seedProjects = [
      ['1', '2026年智慧交通管理平台建设项目', 'ZB-2026-001', 'XX市交通运输局', '张工 010-88888888', 'XX招标代理有限公司', '李经理 010-66666666', '2026-05-20 10:00', '投标中', '¥50,000', '2026-05-15 17:00', 'XX市公共资源交易中心 301 会议室', '2026-04-15', '关键招标要求、资质要求等...', '', '¥1,200,000', 5, 1],
      ['2', '政务云扩容采购项目', 'ZB-2026-005', 'XX市大数据局', '王工 010-77777777', 'YY咨询管理公司', '赵经理 010-55555555', '2026-06-15 14:30', '已开标', '¥30,000', '2026-06-10 17:00', 'XX省政务中心 2楼', '2026-05-10', '政务云相关资质要求...', '', '¥850,000', 3, 1],
      ['3', '城市绿化带自动灌溉系统', 'ZB-2026-008', 'XX市园林局', '刘工 010-99999999', 'ZZ工程咨询公司', '孙经理 010-44444444', '2026-07-10 09:00', '进行中', '¥20,000', '2026-07-05 17:00', 'XX市园林局 5楼会议室', '2026-06-01', '自动化灌溉系统技术指标...', '', '¥450,000', 0, 0],
      ['4', '智慧校园安防升级工程', 'ZB-2026-012', 'XX大学', '李老师 010-12345678', 'CC招标代理', '周经理 010-87654321', '2026-08-05 10:00', '投标中', '¥40,000', '2026-07-30 17:00', 'XX大学行政楼 202', '2026-07-01', '安防等级要求、资质要求...', '', '¥1,500,000', 2, 1],
      ['5', '社区养老服务平台开发', 'ZB-2026-015', 'XX市民政局', '吴工 010-11112222', 'DD咨询公司', '郑经理 010-33334444', '2026-08-20 15:00', '已中标', '¥15,000', '2026-08-15 17:00', 'XX市民政局 210会议室', '2026-07-15', '平台功能需求...', '', '¥300,000', 0, 0],
      ['6', '城市轨道交通信号维护服务', 'ZB-2026-020', 'XX地铁公司', '陈工 010-55556666', 'EE招标代理', '冯经理 010-77778888', '2026-09-10 09:30', '投标中', '¥100,000', '2026-09-05 17:00', 'XX地铁公司总部 8楼', '2026-08-01', '维护资质要求...', '', '¥5,000,000', 4, 1],
      ['7', '公共图书馆数字化二期项目', 'ZB-2026-022', 'XX市图书馆', '林馆长 010-99990000', 'FF咨询公司', '蔣经理 010-11119999', '2026-09-25 14:00', '投标中', '¥25,000', '2026-09-20 17:00', 'XX市图书馆 B1层', '2026-08-20', '数字化建设要求...', '', '¥600,000', 1, 1],
      ['8', '新能源充电桩部署规划咨询', 'ZB-2026-025', 'XX发改委', '黄工 010-22228888', 'GG方案评估公司', '吕经理 010-44446666', '2026-10-15 10:30', '进行中', '¥10,000', '2026-10-10 17:00', 'XX市发改委 405室', '2026-09-10', '规划范围、评估指标...', '', '¥200,000', 0, 0],
      ['9', '2026年1月数据中心运维', 'ZB-2026-001-J', '测试单位', '王经理', '代理A', '赵工', '2026-01-15 10:00', '已中标', '¥10,000', '2026-01-10', '中心1F', '2025-12-15', '运维要求', '', '¥500,000', 2, 1],
      ['10', '2026年2月网络安全加固', 'ZB-2026-002-F', '测试单位', '李经理', '代理B', '钱工', '2026-02-12 14:00', '已开标', '¥20,000', '2026-02-08', '中心2F', '2026-01-15', '安全要求', '', '¥800,000', 1, 1],
      ['11', '2026年3月多媒体教室建设', 'ZB-2026-003-M', '测试单位', '张经理', '代理C', '孙工', '2026-03-20 09:00', '进行中', '¥15,000', '2026-03-15', '中心3F', '2026-02-15', '多媒体要求', '', '¥600,000', 5, 1],
      ['12', '2026年4月智能停车场系统', 'ZB-2026-004-A', '测试单位', '刘经理', '代理D', '李工', '2026-04-25 10:30', '投标中', '¥12,000', '2026-04-20', '中心4F', '2026-03-15', '停车场要求', '', '¥400,000', 0, 0],
      ['13', '2026年11月人工智能实验室', 'ZB-2026-011-N', '测试单位', '吴经理', '代理E', '王工', '2026-11-18 15:00', '投标中', '¥50,000', '2026-11-10', '中心5F', '2026-10-15', 'AI要求', '', '¥2,000,000', 3, 1],
      ['14', '2026年12月年度总结系统', 'ZB-2026-012-D', '测试单位', '陈经理', '代理F', '刘工', '2026-12-28 16:00', '投标中', '¥5,000', '2026-12-20', '中心6F', '2026-11-15', '系统要求', '', '¥100,000', 1, 1],
      ['15', '2025年12月回顾项目', 'ZB-2025-099', '测试单位', '孙经理', '代理G', '张工', '2025-12-10 10:00', '已中标', '¥30,000', '2025-12-05', '历史馆', '2025-11-10', '回顾要求', '', '¥900,000', 8, 1],
      ['16', '2025年全年度维保服务', 'ZB-2025-001', '测试单位', '蒋经理', '代理H', '周工', '2025-01-05 09:00', '已中标', '¥100,000', '2024-12-30', '服务大厅', '2024-12-01', '维保要求', '', '¥3,000,000', 12, 1],
      ['17', '2026年5月补充项目', 'ZB-2026-005-B', '测试单位', '郑经理', '代理I', '吴工', '2026-05-30 11:00', '投标中', '¥8,000', '2026-05-25', '在线开标', '2026-04-30', '补充要求', '', '¥250,000', 0, 0],
      ['18', '2026年6月水务监控二期', 'ZB-2026-006-W', '测试单位', '冯经理', '代理J', '陈工', '2026-06-20 14:00', '进行中', '¥45,000', '2026-06-15', '水务局', '2026-05-20', '监控要求', '', '¥1,500,000', 2, 1],
      ['19', '2026年7月园林景观工程', 'ZB-2026-007-L', '测试单位', '褚经理', '代理K', '蒋工', '2026-07-15 09:30', '投标中', '¥22,000', '2026-07-10', '公共空间', '2026-06-15', '景观要求', '', '¥700,000', 4, 1],
      ['20', '2026年8月智慧环卫系统', 'ZB-2026-008-S', '测试单位', '卫经理', '代理L', '沈工', '2026-08-28 10:00', '投标中', '¥18,000', '2026-08-20', '环卫中心', '2026-07-20', '环卫要求', '', '¥550,000', 0, 0]
    ];

    seedProjects.forEach(p => {
      if (!existingIds.includes(p[0].toString())) {
        insert.run(...p);
      }
    });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(body) {
      if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.url.startsWith('/api/')) {
        const module = req.url.split('/')[2] || 'general';
        const action = req.method;
        const details = JSON.stringify({
          url: req.url,
          body: req.body,
          params: req.params
        });
        db.prepare('INSERT INTO operation_logs (module, action, details) VALUES (?, ?, ?)').run(module, action, details);
      }
      return originalJson.call(this, body);
    };
    next();
  });

  // API Routes
  app.get('/api/logs', (req, res) => {
    const logs = db.prepare('SELECT * FROM operation_logs ORDER BY timestamp DESC LIMIT 100').all();
    res.json(logs);
  });

  app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();
    res.json(projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        tenderer: p.tenderer,
        tendererContact: p.tenderer_contact,
        agent: p.agent,
        agentContact: p.agent_contact,
        bidOpeningTime: p.bid_opening_time,
        status: p.status,
        deposit: p.deposit,
        depositDeadline: p.deposit_deadline,
        openingLocation: p.opening_location,
        collectionTime: p.collection_time,
        requirements: p.requirements,
        otherRemarks: p.other_remarks,
        tenderControlPrice: p.tender_control_price,
        materialCount: p.material_count,
        hasMaterials: Boolean(p.has_materials)
    })));
  });

  app.post('/api/projects', (req, res) => {
    const p = req.body;
    db.prepare('INSERT INTO projects (id, name, code, tenderer, tenderer_contact, agent, agent_contact, bid_opening_time, status, deposit, deposit_deadline, opening_location, collection_time, requirements, other_remarks, tender_control_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        p.id, p.name, p.code, p.tenderer, p.tendererContact, p.agent, p.agentContact, p.bidOpeningTime, p.status, p.deposit, p.depositDeadline, p.openingLocation, p.collectionTime, p.requirements, p.otherRemarks, p.tenderControlPrice
    );
    res.json({ success: true });
  });

  app.put('/api/projects/:id', (req, res) => {
    const p = req.body;
    db.prepare('UPDATE projects SET name = ?, code = ?, tenderer = ?, tenderer_contact = ?, agent = ?, agent_contact = ?, bid_opening_time = ?, status = ?, deposit = ?, deposit_deadline = ?, opening_location = ?, collection_time = ?, requirements = ?, other_remarks = ?, tender_control_price = ? WHERE id = ?').run(
      p.name, p.code, p.tenderer, p.tendererContact, p.agent, p.agentContact, p.bidOpeningTime, p.status, p.deposit, p.depositDeadline, p.openingLocation, p.collectionTime, p.requirements, p.otherRemarks, p.tenderControlPrice, req.params.id
    );
    res.json({ success: true });
  });

  app.get('/api/kv/:key', (req, res) => {
    const row = db.prepare('SELECT value FROM kv_store WHERE key = ?').get(req.params.key) as { value: string } | undefined;
    if (row) {
      res.json(JSON.parse(row.value));
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/kv/:key', (req, res) => {
    db.prepare('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)').run(req.params.key, JSON.stringify(req.body));
    res.json({ success: true });
  });

  app.get('/api/categories', (req, res) => {
    const rows = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all() as any[];
    
    const buildTree = (parentId: string | null): any[] => {
      return rows
        .filter(r => r.parent_id === parentId)
        .map(r => ({
          id: r.id,
          name: r.name,
          children: buildTree(r.id)
        }));
    };

    res.json(buildTree(null));
  });

  app.post('/api/categories', (req, res) => {
    const { id, name, parentId, sortOrder } = req.body;
    db.prepare('INSERT INTO categories (id, name, parent_id, sort_order) VALUES (?, ?, ?, ?)').run(id, name, parentId || null, sortOrder || 0);
    res.json({ success: true });
  });

  app.put('/api/categories/:id', (req, res) => {
    const { name } = req.body;
    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, req.params.id);
    res.json({ success: true });
  });

  app.put('/api/categories/reorder', (req, res) => {
    const { categories } = req.body;
    const update = db.prepare('UPDATE categories SET parent_id = ?, sort_order = ? WHERE id = ?');
    const transaction = db.transaction((items) => {
      for (const item of items) {
        update.run(item.parentId || null, item.sortOrder, item.id);
      }
    });
    transaction(categories);
    res.json({ success: true });
  });

  app.delete('/api/categories/:id', (req, res) => {
    const deleteRecursive = (id: string) => {
        const children = db.prepare('SELECT id FROM categories WHERE parent_id = ?').all() as {id: string}[];
        children.forEach(c => deleteRecursive(c.id));
        db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    };
    deleteRecursive(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/materials', (req, res) => {
    const materials = db.prepare('SELECT * FROM materials').all();
    res.json(materials.map((m: any) => ({
        id: m.id,
        fileName: m.file_name,
        type: m.type,
        uploadDate: m.upload_date,
        size: m.size,
        uploader: m.uploader,
        projectId: m.project_id
    })));
  });

  app.post('/api/materials', (req, res) => {
    const { id, fileName, type, uploadDate, size, uploader, projectId } = req.body;
    db.prepare('INSERT INTO materials (id, file_name, type, upload_date, size, uploader, project_id) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, fileName, type, uploadDate, size, uploader, projectId || null);
    
    // Update material count if project exists
    if (projectId) {
        db.prepare('UPDATE projects SET material_count = material_count + 1 WHERE id = ?').run(projectId);
    }
    res.json({ success: true });
  });

  app.put('/api/materials/:id', (req, res) => {
    const { fileName, type, uploadDate, size } = req.body;
    db.prepare('UPDATE materials SET file_name = ?, type = ?, upload_date = ?, size = ? WHERE id = ?').run(fileName, type, uploadDate, size, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/materials/:id', (req, res) => {
    const material = db.prepare('SELECT project_id FROM materials WHERE id = ?').get(req.params.id) as { project_id: string } | undefined;
    if (material && material.project_id) {
        db.prepare('UPDATE projects SET material_count = MAX(0, material_count - 1) WHERE id = ?').run(material.project_id);
    }
    db.prepare('DELETE FROM materials WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:3000`);
  });
}

startServer();
