/**
 * Jembatan Google Drive untuk Dashboard Pembelajaran.
 * Membaca isi folder "MATERI KULIAH" secara langsung (selalu terbaru),
 * hanya untuk permintaan yang membawa kunci akses yang benar.
 *
 * Cara pasang (sekali saja):
 * 1. Buka https://script.google.com → New project → tempel seluruh file ini.
 * 2. Jalankan fungsi `setup` (Run) → izinkan akses Drive → salin kunci dari Execution log.
 * 3. Deploy → New deployment → tipe "Web app"
 *      Execute as : Me
 *      Who has access : Anyone
 *    → Deploy → salin URL Web app (berakhiran /exec).
 * 4. Di dashboard, buka menu "Pengaturan Drive", tempel URL dan kunci.
 */

const ROOT_ID = '1mcNaAPQU6E2oXPmEa8gNL7aU0bdP8Fnp'; // folder MATERI KULIAH

function setup() {
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('ACCESS_KEY');
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '');
    props.setProperty('ACCESS_KEY', key);
  }
  DriveApp.getFolderById(ROOT_ID).getName(); // memicu permintaan izin Drive
  Logger.log('Kunci akses dashboard: ' + key);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const key = PropertiesService.getScriptProperties().getProperty('ACCESS_KEY');
  if (!key || p.key !== key) return out_({ ok: false, error: 'Kunci akses salah atau belum diatur' });
  try {
    if (p.q) return out_(search_(p.q));
    let folder;
    if (p.path !== undefined && p.path !== '') folder = byPath_(p.path);
    else if (p.id) {
      folder = DriveApp.getFolderById(p.id);
      if (!inside_(folder)) return out_({ ok: false, error: 'Folder di luar MATERI KULIAH' });
    } else folder = DriveApp.getFolderById(ROOT_ID);
    if (!folder) return out_({ ok: false, error: 'Folder tidak ditemukan di Drive: ' + p.path });
    return out_(listing_(folder));
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function listing_(folder) {
  const folders = [], files = [];
  const fi = folder.getFolders();
  while (fi.hasNext()) {
    const f = fi.next();
    if (f.isTrashed()) continue;
    folders.push({ id: f.getId(), name: f.getName(), modified: f.getLastUpdated().toISOString() });
  }
  const it = folder.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    if (f.isTrashed()) continue;
    files.push(fileInfo_(f));
  }
  const byName = (a, b) => a.name.localeCompare(b.name, 'id', { numeric: true });
  folders.sort(byName); files.sort(byName);
  return { ok: true, folder: { id: folder.getId(), name: folder.getName() }, crumbs: crumbs_(folder),
           folders: folders, files: files, time: new Date().toISOString() };
}

function fileInfo_(f) {
  return { id: f.getId(), name: f.getName(), mime: f.getMimeType(), size: f.getSize(),
           modified: f.getLastUpdated().toISOString(), url: f.getUrl() };
}

function search_(q) {
  const safe = String(q).replace(/\\/g, '\\\\').replace(/'/g, "\\'").slice(0, 80);
  const it = DriveApp.searchFiles("title contains '" + safe + "' and trashed = false");
  const files = [];
  let checked = 0;
  while (it.hasNext() && files.length < 60 && checked < 300) {
    const f = it.next(); checked++;
    const parents = f.getParents();
    if (!parents.hasNext()) continue;
    const parent = parents.next();
    if (!inside_(parent)) continue;
    const info = fileInfo_(f);
    info.folder = crumbs_(parent).map(c => c.name).slice(1).join(' / ');
    info.folderId = parent.getId();
    files.push(info);
  }
  return { ok: true, query: q, files: files, time: new Date().toISOString() };
}

function byPath_(path) {
  const parts = String(path).split(/[\\\/]+/).map(s => s.trim()).filter(Boolean);
  let cur = DriveApp.getFolderById(ROOT_ID);
  for (const name of parts) {
    const it = cur.getFoldersByName(name);
    if (!it.hasNext()) return null;
    cur = it.next();
  }
  return cur;
}

function inside_(folder) {
  let cur = folder;
  for (let i = 0; i < 25; i++) {
    if (cur.getId() === ROOT_ID) return true;
    const ps = cur.getParents();
    if (!ps.hasNext()) return false;
    cur = ps.next();
  }
  return false;
}

function crumbs_(folder) {
  const list = [];
  let cur = folder;
  for (let i = 0; i < 25; i++) {
    list.unshift({ id: cur.getId(), name: cur.getName() });
    if (cur.getId() === ROOT_ID) break;
    const ps = cur.getParents();
    if (!ps.hasNext()) break;
    cur = ps.next();
  }
  return list;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
