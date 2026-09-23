const DOCUMENTS_KEY = 'url-parameter-studio.documents.v1';
const PROFILES_KEY = 'url-parameter-studio.profiles.v1';
const LEGACY_RECORDS_KEY = 'url-params-builder.records.v2';

const COMMON_SOURCES = ['newsletter', 'mailmagazine', 'google', 'yahoo', 'facebook', 'instagram', 'x', 'linkedin', 'qrcode', 'brochure', 'partner'];
const COMMON_MEDIA = ['email', 'social', 'paid_social', 'cpc', 'display', 'referral', 'affiliate', 'offline'];

const STARTER_PROFILES = [
  { id: 'generic', name: '汎用パラメータ', description: '任意のキーと値を自由に追加できます。', fields: [] },
  { id: 'ga4', name: 'GA4 UTM', description: '一般的なUTMパラメータを入力します。', fields: [
    { key: 'utm_source', label: '参照元', required: true, choices: COMMON_SOURCES, normalize: 'slug' },
    { key: 'utm_medium', label: 'メディア', required: true, choices: COMMON_MEDIA, normalize: 'slug' },
    { key: 'utm_campaign', label: 'キャンペーン名', required: true, normalize: 'slug' },
    { key: 'utm_content', label: 'クリエイティブ / CTA', normalize: 'slug' },
    { key: 'utm_term', label: 'キーワード', normalize: 'slug' },
    { key: 'utm_id', label: 'キャンペーンID', normalize: 'slug' },
    { key: 'utm_source_platform', label: '広告プラットフォーム', choices: ['google_ads', 'meta_ads', 'linkedin_ads', 'x_ads'], normalize: 'slug' }
  ] },
  { id: 'adobe', name: 'Adobe Tracking Code', description: 'Adobe Analyticsの追跡コードなど、組織固有の形式で利用できます。', fields: [
    { key: 'cid', label: 'Tracking Code (cid)', required: true },
    { key: 'source', label: '参照元', choices: COMMON_SOURCES, normalize: 'slug' },
    { key: 'campaign', label: 'キャンペーン名', normalize: 'slug' },
    { key: 'creative', label: 'クリエイティブ', normalize: 'slug' }
  ] },
  { id: 'campaign', name: '広告・CRM連携', description: '広告配信やCRMに渡す独自パラメータを始めるための雛形です。', fields: [
    { key: 'campaign_id', label: 'キャンペーンID', required: true, normalize: 'slug' },
    { key: 'channel', label: 'チャネル', required: true, choices: ['email', 'paid_social', 'search', 'display', 'partner', 'offline'], normalize: 'slug' },
    { key: 'creative_id', label: 'クリエイティブID', normalize: 'slug' },
    { key: 'audience', label: 'オーディエンス', normalize: 'slug' }
  ] }
];

function createId() { return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function deepCopy(value) { return JSON.parse(JSON.stringify(value)); }
function readStorage(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key) || ''); return value ?? fallback; } catch (_) { return fallback; } }
function writeStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function slug(value) { return String(value || '').trim().toLowerCase().replace(/\s+/g, '_'); }
function normalizeValue(value, rule) { return rule === 'slug' ? slug(value) : String(value || '').trim(); }
function blankParameter(key = '', value = '') { return { id: createId(), key, value }; }
function blankDocument() { return { id: '', title: '', note: '', profileId: 'generic', baseUrl: '', hash: '', params: [], createdAt: '', updatedAt: '' }; }
function safeUrl(value) { try { const url = new URL(value.trim()); return ['http:', 'https:'].includes(url.protocol) ? url : null; } catch (_) { return null; } }
function parseUrl(value) {
  const url = safeUrl(value);
  if (!url) throw new Error('URLの形式が正しくありません。http または https で始まるURLを入力してください。');
  return { baseUrl: `${url.origin}${url.pathname}`, hash: url.hash, params: [...url.searchParams.entries()].map(([key, paramValue]) => blankParameter(key, paramValue)) };
}
function buildUrl(document) {
  const url = safeUrl(document.baseUrl);
  if (!url) return '';
  url.search = '';
  document.params.forEach((param) => { if (param.key.trim()) url.searchParams.append(param.key.trim(), param.value ?? ''); });
  url.hash = document.hash || '';
  return url.toString();
}
function csv(rows) { return rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'); }
function download(filename, content, type) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
function profileFields(profile) { return profile?.fields || []; }
function sensitiveWarning(param) {
  const text = `${param.key}=${param.value}`.toLowerCase();
  if (/(password|passwd|token|secret|api[_-]?key|authorization|session)/.test(text)) return '認証情報らしきキーまたは値が含まれています。URLに含めないでください。';
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(param.value)) return 'メールアドレスらしき値が含まれています。個人情報をURLに含めないでください。';
  if (/\d{3}[- ]?\d{4}[- ]?\d{4}/.test(param.value)) return '電話番号らしき値が含まれています。個人情報をURLに含めないでください。';
  return '';
}
function migrateLegacyDocuments() {
  if (localStorage.getItem(DOCUMENTS_KEY)) return readStorage(DOCUMENTS_KEY, []);
  const legacy = readStorage(LEGACY_RECORDS_KEY, []);
  if (!Array.isArray(legacy) || !legacy.length) return [];
  const migrated = legacy.map((record) => {
    const form = record.form || {};
    const params = [
      ['utm_source', form.source], ['utm_medium', form.medium], ['utm_campaign', form.campaign], ['utm_content', form.content],
      ['utm_term', form.term], ['utm_id', form.campaignId], ['utm_source_platform', form.sourcePlatform]
    ].filter(([, value]) => value).map(([key, value]) => blankParameter(key, value));
    const parsed = safeUrl(form.url || '') ? parseUrl(form.url) : { baseUrl: form.url || '', hash: '', params: [] };
    return { id: createId(), title: form.name || form.campaign || '移行したURL', note: '', profileId: 'ga4', baseUrl: parsed.baseUrl, hash: parsed.hash, params: params.length ? params : parsed.params, createdAt: record.createdAt || new Date().toISOString(), updatedAt: record.createdAt || new Date().toISOString() };
  });
  writeStorage(DOCUMENTS_KEY, migrated);
  return migrated;
}

const app = Vue.createApp({
  data() {
    return {
      activeTab: 'builder',
      document: blankDocument(),
      documents: migrateLegacyDocuments(),
      customProfiles: readStorage(PROFILES_KEY, []),
      pasteUrl: '',
      message: '',
      messageType: 'success',
      showSaveChoices: false,
      search: '',
      profileName: '',
      matrixAxes: [
        { id: createId(), key: 'utm_source', values: 'newsletter\npartner' },
        { id: createId(), key: 'utm_content', values: 'hero_cta\nfooter_cta' }
      ]
    };
  },
  computed: {
    profiles() { return [...STARTER_PROFILES, ...this.customProfiles]; },
    activeProfile() { return this.profiles.find((profile) => profile.id === this.document.profileId) || STARTER_PROFILES[0]; },
    outputUrl() { return buildUrl(this.document); },
    errors() {
      const errors = [];
      if (!this.document.baseUrl.trim()) errors.push('遷移先URLを入力してください。');
      else if (!safeUrl(this.document.baseUrl)) errors.push('遷移先URLの形式が正しくありません。');
      const required = profileFields(this.activeProfile).filter((field) => field.required);
      required.forEach((field) => { if (!this.paramValue(field.key).trim()) errors.push(`${field.label}（${field.key}）を入力してください。`); });
      this.document.params.forEach((param, index) => { if (param.value && !param.key.trim()) errors.push(`${index + 1}行目のパラメータ名を入力してください。`); });
      return errors;
    },
    warnings() {
      const warnings = [];
      const keys = new Map();
      this.document.params.forEach((param) => {
        const key = param.key.trim();
        if (!key) return;
        keys.set(key, (keys.get(key) || 0) + 1);
        if (!/^[A-Za-z][A-Za-z0-9_.-]*$/.test(key)) warnings.push(`${key}: 一般的なパラメータ名の形式ではありません。`);
        const sensitive = sensitiveWarning(param);
        if (sensitive) warnings.push(`${key}: ${sensitive}`);
      });
      [...keys.entries()].filter(([, count]) => count > 1).forEach(([key]) => warnings.push(`${key}: 同じキーが複数あります。意図した設定か確認してください。`));
      if (this.outputUrl.length > 2000) warnings.push('生成URLが2,000文字を超えています。配信先の上限を確認してください。');
      return [...new Set(warnings)];
    },
    filteredDocuments() {
      const word = this.search.trim().toLowerCase();
      if (!word) return this.documents;
      return this.documents.filter((item) => `${item.title} ${item.note} ${buildUrl(item)}`.toLowerCase().includes(word));
    },
    matrixResults() {
      if (!this.outputUrl) return [];
      const axes = this.matrixAxes.map((axis) => ({ key: axis.key.trim(), values: axis.values.split(/\n|,/).map((value) => value.trim()).filter(Boolean) })).filter((axis) => axis.key && axis.values.length);
      if (!axes.length) return [];
      let variants = [{ params: deepCopy(this.document.params), labels: [] }];
      axes.forEach((axis) => {
        variants = variants.flatMap((variant) => axis.values.map((value) => ({
          params: this.replaceParameter(variant.params, axis.key, value), labels: [...variant.labels, `${axis.key}=${value}`]
        })));
      });
      return variants.slice(0, 200).map((variant) => ({ label: variant.labels.join(' / '), url: buildUrl({ ...this.document, params: variant.params }) }));
    }
  },
  methods: {
    notify(message, type = 'success') { this.message = message; this.messageType = type; },
    paramValue(key) { return this.document.params.find((param) => param.key === key)?.value || ''; },
    fieldFor(key) { return profileFields(this.activeProfile).find((field) => field.key === key); },
    displayLabel(param) { return this.fieldFor(param.key)?.label || '任意パラメータ'; },
    parsePastedUrl() {
      try {
        const parsed = parseUrl(this.pasteUrl);
        this.document.baseUrl = parsed.baseUrl;
        this.document.hash = parsed.hash;
        this.document.params = parsed.params;
        this.notify('URLを解析しました。パラメータを確認・編集できます。');
      } catch (error) { this.notify(error.message, 'error'); }
    },
    applyProfile() {
      const profile = this.activeProfile;
      const existing = new Map(this.document.params.map((param) => [param.key, param.value]));
      const fields = profileFields(profile);
      if (!fields.length) return this.notify('汎用プロファイルでは任意のキーと値を追加できます。');
      const managedKeys = new Set(fields.map((field) => field.key));
      const profileParams = fields.map((field) => blankParameter(field.key, existing.get(field.key) || ''));
      const unknownParams = this.document.params.filter((param) => !managedKeys.has(param.key));
      this.document.params = [...profileParams, ...unknownParams];
      this.notify(`${profile.name}の項目を適用しました。`);
    },
    changeProfile() { this.applyProfile(); },
    addParameter() { this.document.params.push(blankParameter()); },
    removeParameter(id) { this.document.params = this.document.params.filter((param) => param.id !== id); },
    moveParameter(index, direction) {
      const target = index + direction;
      if (target < 0 || target >= this.document.params.length) return;
      const params = [...this.document.params];
      [params[index], params[target]] = [params[target], params[index]];
      this.document.params = params;
    },
    normalizeParameter(param) {
      const field = this.fieldFor(param.key);
      if (field?.normalize) param.value = normalizeValue(param.value, field.normalize);
    },
    replaceParameter(params, key, value) {
      const next = deepCopy(params);
      const first = next.find((param) => param.key === key);
      if (first) first.value = value;
      else next.push(blankParameter(key, value));
      return next;
    },
    async copyUrl() {
      if (this.errors.length) return this.notify('必須項目を確認してください。', 'error');
      try { await navigator.clipboard.writeText(this.outputUrl); this.notify('URLをクリップボードにコピーしました。'); }
      catch (_) { this.notify('コピーに失敗しました。URLを選択してコピーしてください。', 'error'); }
    },
    openSaveChoices() {
      if (this.errors.length) return this.notify('必須項目を確認してから保存してください。', 'error');
      this.showSaveChoices = true;
    },
    saveToAccount() {
      this.showSaveChoices = false;
      this.notify('アカウントでの保存・共有は現在準備中です。今は「この端末に保存」を利用できます。');
    },
    newDocument() { this.document = blankDocument(); this.pasteUrl = ''; this.message = ''; this.activeTab = 'builder'; },
    startWithProfile(profileId) {
      if ((this.document.baseUrl || this.document.params.length) && !window.confirm('現在の入力内容をリセットして、新しく作成します。よろしいですか？')) return;
      this.document = blankDocument();
      this.document.profileId = profileId;
      this.pasteUrl = '';
      if (profileId === 'generic') this.document.params = [blankParameter()];
      else this.applyProfile();
      this.notify(profileId === 'generic' ? '自由入力モードで開始しました。キーと値を入力してください。' : `${this.activeProfile.name}の入力欄を用意しました。`);
    },
    focusPaste() {
      this.$nextTick(() => document.getElementById('paste-url')?.focus());
    },
    openLibrary() { this.activeTab = 'library'; },
    saveDocument() {
      if (this.errors.length) return this.notify('必須項目を確認してから保存してください。', 'error');
      const now = new Date().toISOString();
      const snapshot = deepCopy({ ...this.document, title: this.document.title.trim() || new URL(this.document.baseUrl).hostname, updatedAt: now });
      if (!snapshot.id) { snapshot.id = createId(); snapshot.createdAt = now; this.documents.unshift(snapshot); }
      else { const index = this.documents.findIndex((item) => item.id === snapshot.id); if (index >= 0) this.documents.splice(index, 1, snapshot); else this.documents.unshift(snapshot); }
      this.document = deepCopy(snapshot);
      writeStorage(DOCUMENTS_KEY, this.documents);
      this.showSaveChoices = false;
      this.notify('保存しました。保存済みのURLは「ライブラリ」から編集できます。');
    },
    openDocument(item) { this.document = deepCopy(item); this.pasteUrl = buildUrl(item); this.activeTab = 'builder'; window.scrollTo({ top: 0, behavior: 'smooth' }); this.notify('保存したURLを読み込みました。'); },
    deleteDocument(id) { this.documents = this.documents.filter((item) => item.id !== id); writeStorage(DOCUMENTS_KEY, this.documents); this.notify('保存したURLを削除しました。'); },
    clearDocuments() {
      if (!this.documents.length || !window.confirm('この端末に保存したURLをすべて削除します。よろしいですか？')) return;
      this.documents = []; writeStorage(DOCUMENTS_KEY, this.documents); this.notify('保存済みURLをすべて削除しました。');
    },
    exportDocumentsCsv() {
      if (!this.documents.length) return this.notify('出力する保存URLがありません。', 'error');
      const rows = [['タイトル', 'プロファイル', 'URL', 'ノート', '更新日時'], ...this.documents.map((item) => [item.title, this.profileNameFor(item.profileId), buildUrl(item), item.note, item.updatedAt])];
      download(`url-parameter-library-${new Date().toISOString().slice(0, 10)}.csv`, `\uFEFF${csv(rows)}`, 'text/csv;charset=utf-8');
      this.notify('ライブラリをCSVで出力しました。');
    },
    exportBackup() {
      download(`url-parameter-studio-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ version: 1, documents: this.documents, profiles: this.customProfiles }, null, 2), 'application/json');
      this.notify('バックアップをダウンロードしました。');
    },
    selectBackup() { this.$refs.backupFile.click(); },
    importBackup(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const backup = JSON.parse(reader.result);
          if (!Array.isArray(backup.documents) || !Array.isArray(backup.profiles)) throw new Error();
          if (!window.confirm('現在のローカル保存データに、バックアップの内容を追加します。よろしいですか？')) return;
          this.documents = [...backup.documents.map((item) => ({ ...item, id: createId() })), ...this.documents];
          this.customProfiles = [...backup.profiles.map((item) => ({ ...item, id: `local-${createId()}` })), ...this.customProfiles];
          writeStorage(DOCUMENTS_KEY, this.documents); writeStorage(PROFILES_KEY, this.customProfiles);
          this.notify('バックアップを読み込みました。');
        } catch (_) { this.notify('バックアップの形式を確認できませんでした。', 'error'); }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    profileNameFor(id) { return this.profiles.find((profile) => profile.id === id)?.name || '不明なプロファイル'; },
    saveCustomProfile() {
      const name = this.profileName.trim();
      const fields = this.document.params.filter((param) => param.key.trim()).map((param) => ({ key: param.key.trim(), label: param.key.trim(), required: false }));
      if (!name) return this.notify('プロファイル名を入力してください。', 'error');
      if (!fields.length) return this.notify('プロファイルに含めるパラメータを1つ以上追加してください。', 'error');
      const profile = { id: `local-${createId()}`, name, description: 'この端末で作成したカスタムプロファイルです。', fields };
      this.customProfiles.unshift(profile); writeStorage(PROFILES_KEY, this.customProfiles); this.profileName = ''; this.notify('ローカルプロファイルを保存しました。');
    },
    updateCustomProfile(profile) {
      const fields = this.document.params.filter((param) => param.key.trim()).map((param) => ({ key: param.key.trim(), label: param.key.trim(), required: false }));
      if (!fields.length) return this.notify('更新するパラメータを1つ以上追加してください。', 'error');
      this.customProfiles = this.customProfiles.map((item) => item.id === profile.id ? { ...item, fields } : item);
      writeStorage(PROFILES_KEY, this.customProfiles); this.notify('現在のパラメータ構成でプロファイルを更新しました。');
    },
    deleteCustomProfile(id) {
      this.customProfiles = this.customProfiles.filter((profile) => profile.id !== id); writeStorage(PROFILES_KEY, this.customProfiles);
      if (this.document.profileId === id) this.document.profileId = 'generic';
      this.notify('ローカルプロファイルを削除しました。');
    },
    useProfile(profile) { this.document.profileId = profile.id; this.applyProfile(); this.activeTab = 'builder'; },
    addAxis() { this.matrixAxes.push({ id: createId(), key: '', values: '' }); },
    removeAxis(id) { this.matrixAxes = this.matrixAxes.filter((axis) => axis.id !== id); },
    exportMatrix() {
      if (!this.matrixResults.length) return this.notify('生成できる組み合わせがありません。URLと軸を入力してください。', 'error');
      const rows = [['条件', 'URL'], ...this.matrixResults.map((item) => [item.label, item.url])];
      download(`url-matrix-${new Date().toISOString().slice(0, 10)}.csv`, `\uFEFF${csv(rows)}`, 'text/csv;charset=utf-8');
      this.notify(`${this.matrixResults.length}件のURLをCSVで出力しました。`);
    }
  },
  template: `
    <main class="app-shell">
      <header class="hero"><div><p class="eyebrow">URL PARAMETER STUDIO</p><h1>URLパラメータを、<br>迷わず作る。</h1><p>GA4・Adobe・独自仕様に対応。ログインなしで、URLの作成・解析・コピーをすぐに使えます。</p></div><div class="privacy-card"><strong>アカウントなしで始められます</strong><span>保存する時だけ、保存方法を選べます。</span></div></header>
      <nav class="tabs" aria-label="機能メニュー"><button v-for="tab in [{id:'builder',label:'URLを作る'},{id:'library',label:'ライブラリ'},{id:'matrix',label:'一括生成'},{id:'profiles',label:'プロファイル'}]" :key="tab.id" type="button" :class="{active:activeTab===tab.id}" @click="activeTab=tab.id">{{ tab.label }}</button></nav>

      <section v-if="activeTab==='builder'" class="workspace">
        <div class="builder-main">
          <section class="start-panel" aria-labelledby="start-title"><div><p class="eyebrow">START HERE</p><h2 id="start-title">何をしたいですか？</h2><p>目的を選ぶだけで、必要な入力欄を準備します。</p></div><div class="start-grid"><button type="button" class="start-card primary-start" @click="startWithProfile('generic')"><strong>ゼロから作る</strong><span>自分でキーと値を追加する</span></button><button type="button" class="start-card" @click="startWithProfile('ga4')"><strong>GA4のURLを作る</strong><span>UTMの入力欄を用意する</span></button><button type="button" class="start-card" @click="startWithProfile('adobe')"><strong>Adobe用に作る</strong><span>Tracking Codeから始める</span></button><button type="button" class="start-card" @click="focusPaste"><strong>既存URLを編集する</strong><span>貼り付けてパラメータを解析</span></button></div><button type="button" class="library-link" @click="openLibrary">保存済みのURLを編集する →</button></section>
          <section class="panel intake"><div class="section-heading"><div><p class="eyebrow">URL INSPECTOR</p><h2>既存URLを編集する場合</h2></div><button type="button" class="quiet" @click="newDocument">入力をリセット</button></div><div class="paste-row"><input id="paste-url" v-model="pasteUrl" type="url" inputmode="url" placeholder="https://example.com/page?existing=value#section" aria-label="解析するURL"><button type="button" @click="parsePastedUrl">貼り付けたURLを解析</button></div><p class="hint">既存のクエリ・ハッシュを分解し、未知のパラメータも残したまま編集できます。</p></section>
          <section class="panel"><div class="section-heading"><div><p class="eyebrow">02 / DESIGN</p><h2>パラメータを設計</h2></div><span class="profile-pill">{{ activeProfile.name }}</span></div>
            <div class="field-grid compact"><div class="field"><label for="profile">プロファイル</label><select id="profile" v-model="document.profileId" @change="changeProfile"><option v-for="profile in profiles" :key="profile.id" :value="profile.id">{{ profile.name }}</option></select><p>{{ activeProfile.description }}</p></div><div class="field"><label for="title">保存名</label><input id="title" v-model="document.title" placeholder="例: 秋セール メール配信"></div></div>
            <div class="field wide"><label for="base-url">遷移先URL</label><input id="base-url" v-model="document.baseUrl" type="url" inputmode="url" placeholder="https://example.com/service"><p v-if="document.hash">ハッシュ: {{ document.hash }}</p></div>
            <div class="parameter-head"><span>パラメータ</span><span>値</span><span aria-hidden="true"></span></div>
            <div v-for="(param,index) in document.params" :key="param.id" class="parameter-row"><div><label class="sr-only" :for="'key-'+param.id">パラメータ名</label><input :id="'key-'+param.id" v-model="param.key" placeholder="キー"><small>{{ displayLabel(param) }}</small></div><div><label class="sr-only" :for="'value-'+param.id">値</label><input :id="'value-'+param.id" v-model="param.value" @change="normalizeParameter(param)" :list="fieldFor(param.key)?.choices ? 'choices-'+param.id : null" placeholder="値"><datalist v-if="fieldFor(param.key)?.choices" :id="'choices-'+param.id"><option v-for="choice in fieldFor(param.key).choices" :key="choice" :value="choice"></option></datalist></div><div class="row-actions"><button type="button" class="icon-button" :disabled="index===0" @click="moveParameter(index,-1)" aria-label="上へ移動">↑</button><button type="button" class="icon-button" :disabled="index===document.params.length-1" @click="moveParameter(index,1)" aria-label="下へ移動">↓</button><button type="button" class="icon-button danger" @click="removeParameter(param.id)" aria-label="削除">×</button></div></div>
            <div v-if="!document.params.length" class="parameter-empty"><strong>まだパラメータはありません</strong><span>「パラメータを追加」から、たとえば <code>source</code> と <code>newsletter</code> のように自由に入力できます。</span></div><button type="button" class="add-button" @click="addParameter">＋ パラメータを追加</button>
            <div class="field note-field"><label for="note">ノート</label><textarea id="note" v-model="document.note" rows="3" placeholder="用途、掲載場所、担当者、配信期限などを残せます。"></textarea></div>
          </section>
        </div>
        <aside class="preview-column"><section class="panel sticky"><p class="eyebrow">03 / REVIEW</p><h2>完成URL</h2><output class="url-output" :class="{empty:!outputUrl}">{{ outputUrl || '遷移先URLを入力するとプレビューが表示されます。' }}</output><div class="actions"><button type="button" class="primary" :disabled="!outputUrl || errors.length" @click="copyUrl">URLをコピー</button><button type="button" @click="openSaveChoices">保存する</button></div><p class="local-note">保存する場合のみ、保存方法を選べます。</p><div v-if="errors.length" class="notice error" role="alert"><strong>保存・コピー前に確認</strong><ul><li v-for="error in errors" :key="error">{{ error }}</li></ul></div><div v-if="warnings.length" class="notice warning"><strong>品質チェック</strong><ul><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul></div><p v-if="message" class="message" :class="messageType" role="status">{{ message }}</p></section></aside>
      </section>

      <section v-else-if="activeTab==='library'" class="panel full-panel"><div class="section-heading"><div><p class="eyebrow">SAVED URLS</p><h2>保存したURL</h2><p class="hint">検索、編集、CSV出力、バックアップができます。</p></div><div class="section-actions"><button type="button" @click="exportDocumentsCsv">CSV出力</button><button type="button" @click="exportBackup">バックアップ</button><button type="button" @click="selectBackup">復元</button><button type="button" class="danger" @click="clearDocuments">すべて削除</button><input ref="backupFile" class="sr-only" type="file" accept="application/json" @change="importBackup"></div></div><input v-model="search" class="search" type="search" placeholder="保存名、ノート、URLで検索"><p v-if="!filteredDocuments.length" class="empty-state">保存されたURLはありません。ビルダーで作成後、「保存する」から保存方法を選んでください。</p><ul v-else class="document-list"><li v-for="item in filteredDocuments" :key="item.id" class="document-card"><div><p class="document-profile">{{ profileNameFor(item.profileId) }}</p><h3>{{ item.title }}</h3><p v-if="item.note" class="document-note">{{ item.note }}</p><code>{{ buildUrl(item) }}</code><p class="timestamp">更新: {{ new Date(item.updatedAt).toLocaleString('ja-JP') }}</p></div><div class="record-actions"><button type="button" @click="openDocument(item)">編集する</button><button type="button" class="danger" @click="deleteDocument(item.id)">削除</button></div></li></ul></section>

      <section v-else-if="activeTab==='matrix'" class="panel full-panel"><div class="section-heading"><div><p class="eyebrow">CAMPAIGN MATRIX</p><h2>組み合わせて、一括生成</h2><p class="hint">現在のURLをベースに、媒体・クリエイティブなどの組み合わせを最大200件作れます。</p></div><button type="button" class="primary" @click="exportMatrix">CSVを出力</button></div><div class="matrix-grid"><div v-for="axis in matrixAxes" :key="axis.id" class="axis-card"><label>置き換えるキー<input v-model="axis.key" placeholder="utm_content"></label><label>値（改行またはカンマ区切り）<textarea v-model="axis.values" rows="5" placeholder="hero_cta\nfooter_cta"></textarea></label><button type="button" class="danger text-button" @click="removeAxis(axis.id)">この軸を削除</button></div><button type="button" class="add-axis" @click="addAxis">＋ 軸を追加</button></div><p v-if="matrixResults.length >= 200" class="notice warning">組み合わせが多いため、先頭200件のみ表示・出力します。</p><p v-if="!matrixResults.length" class="empty-state">ビルダーで遷移先URLを入力し、少なくとも1つの軸に値を指定してください。</p><ol v-else class="matrix-results"><li v-for="item in matrixResults" :key="item.url"><strong>{{ item.label }}</strong><code>{{ item.url }}</code></li></ol></section>

      <section v-else class="panel full-panel"><div class="section-heading"><div><p class="eyebrow">MY PROFILES</p><h2>自分用のルールを保存</h2><p class="hint">よく使う独自パラメータ構成を、次回からすぐ呼び出せます。</p></div></div><div class="profile-create"><input v-model="profileName" placeholder="例: 自社メール計測ルール"><button type="button" class="primary" @click="saveCustomProfile">現在の構成を保存</button></div><p class="hint">ビルダーにあるパラメータ名を、そのままプロファイルの項目として保存します。値は保存されません。</p><p v-if="!customProfiles.length" class="empty-state">まだ自分用のルールはありません。ビルダーで項目を整えてから保存してください。</p><ul v-else class="profile-list"><li v-for="profile in customProfiles" :key="profile.id"><div><h3>{{ profile.name }}</h3><p>{{ profile.fields.map(field => field.key).join(', ') }}</p></div><div class="record-actions"><button type="button" @click="useProfile(profile)">使う</button><button type="button" @click="updateCustomProfile(profile)">現在の構成で更新</button><button type="button" class="danger" @click="deleteCustomProfile(profile.id)">削除</button></div></li></ul></section>
      <div v-if="showSaveChoices" class="modal-backdrop" role="presentation" @click.self="showSaveChoices=false"><section class="save-dialog" role="dialog" aria-modal="true" aria-labelledby="save-title"><button type="button" class="close-dialog" aria-label="閉じる" @click="showSaveChoices=false">×</button><p class="eyebrow">SAVE URL</p><h2 id="save-title">どこに保存しますか？</h2><p>あとで編集したい場合に、保存方法を選べます。</p><div class="save-options"><button type="button" class="save-option" @click="saveDocument"><strong>この端末に保存</strong><span>アカウントなしで、あとからこの端末で編集できます。</span></button><button type="button" class="save-option account-option" @click="saveToAccount"><strong>アカウントで保存</strong><span>複数端末での利用・共有に対応予定です。現在は準備中です。</span></button></div></section></div>
    </main>`
});

app.mount('#app');
