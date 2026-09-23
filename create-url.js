const DOCUMENTS_KEY = 'url-parameter-studio.documents.v1';
const PROFILES_KEY = 'url-parameter-studio.profiles.v1';
const LEGACY_RECORDS_KEY = 'url-params-builder.records.v2';
const LOCALE_KEY = 'url-parameter-studio.locale.v1';

const COMMON_SOURCES = ['newsletter', 'mailmagazine', 'google', 'yahoo', 'facebook', 'instagram', 'x', 'linkedin', 'qrcode', 'brochure', 'partner'];
const COMMON_MEDIA = ['email', 'social', 'paid_social', 'cpc', 'display', 'referral', 'affiliate', 'offline'];

const MESSAGES = {
  ja: {
    builder:'URLを作る', library:'ライブラリ', matrix:'一括生成', profiles:'プロファイル',
    hero:'URLパラメータを、<br>迷わず作る。', hero_sub:'GA4・Adobe・独自仕様に対応。',
    start:'はじめる', what:'何をしたい？', start_hint:'目的を選ぶだけで入力欄を準備する。',
    scratch:'ゼロから作る', scratch_hint:'キーと値を自由に追加', ga4_start:'GA4のURLを作る', ga4_hint:'UTMの入力欄を用意', adobe_start:'Adobe用に作る', adobe_hint:'Tracking Codeから開始', edit_url:'既存URLを編集', edit_hint:'貼り付けて解析', open_saved:'保存済みのURLを編集 →',
    inspector:'URLを解析', inspector_title:'既存URLを編集する場合', reset:'入力をリセット', parse:'URLを解析', parse_hint:'既存のクエリ・ハッシュも残して編集できる。',
    design:'パラメータを設計', profile:'プロファイル', save_name:'保存名', destination:'遷移先URL', hash:'ハッシュ', parameter:'パラメータ', value:'値', key:'キー', note:'ノート', add_param:'＋ パラメータを追加', no_params:'パラメータは未入力', no_params_hint:'キーと値を入力して追加できる。',
    review:'確認', complete_url:'完成URL', preview_empty:'遷移先URLを入力するとプレビューを表示。', copy:'URLをコピー', save:'保存する', save_hint:'保存方法を選べる。', check_before:'保存・コピー前に確認', quality:'品質チェック',
    saved_urls:'保存したURL', library_hint:'検索、編集、CSV出力、バックアップ。', export_csv:'CSV出力', backup:'バックアップ', restore:'復元', delete_all:'すべて削除', search:'保存名、ノート、URLで検索', no_saved:'保存したURLはない。', edit:'編集', delete:'削除', updated:'更新',
    matrix_title:'組み合わせて一括生成', matrix_hint:'現在のURLをベースに最大200件作成。', replace_key:'置き換えるキー', values:'値（改行またはカンマ区切り）', remove_axis:'この軸を削除', add_axis:'＋ 軸を追加', matrix_empty:'URLと軸の値を入力。', matrix_limit:'先頭200件のみ表示・出力。',
    my_profiles:'自分用のルール', profile_hint:'よく使うパラメータ構成を保存できる。', profile_name:'例: 自社メール計測ルール', save_profile:'現在の構成を保存', profile_info:'パラメータ名だけを保存する。', no_profiles:'自分用のルールはない。', use:'使う', update:'現在の構成で更新',
    save_url:'URLを保存', save_question:'どこに保存する？', save_description:'あとで編集する場合に保存方法を選ぶ。', device_save:'この端末に保存', device_save_hint:'あとからこの端末で編集できる。', account_save:'アカウントで保存', account_save_hint:'複数端末・共有に対応予定。準備中。', close:'閉じる',
    profile_generic:'汎用パラメータ', profile_generic_desc:'任意のキーと値を追加できる。', profile_ga4:'GA4 UTM', profile_ga4_desc:'一般的なUTMパラメータ。', profile_adobe:'Adobe Tracking Code', profile_adobe_desc:'Tracking Codeなどに使える。', profile_campaign:'広告・CRM連携', profile_campaign_desc:'広告・CRM向けの雛形。',
    source:'参照元', medium:'メディア', campaign:'キャンペーン名', content:'クリエイティブ / CTA', term:'キーワード', campaign_id:'キャンペーンID', platform:'広告プラットフォーム', creative:'クリエイティブ', channel:'チャネル', audience:'オーディエンス', custom_param:'任意パラメータ'
  },
  en: {
    builder:'Build URL', library:'Library', matrix:'Bulk create', profiles:'Profiles',
    hero:'Build URL parameters<br>with confidence.', hero_sub:'For GA4, Adobe, and custom schemes.',
    start:'START', what:'What do you want to do?', start_hint:'Choose a starting point.',
    scratch:'Start from scratch', scratch_hint:'Add any key and value', ga4_start:'Create a GA4 URL', ga4_hint:'Start with UTM fields', adobe_start:'Create an Adobe URL', adobe_hint:'Start with a tracking code', edit_url:'Edit an existing URL', edit_hint:'Paste and inspect it', open_saved:'Edit saved URLs →',
    inspector:'URL INSPECTOR', inspector_title:'Edit an existing URL', reset:'Reset', parse:'Inspect URL', parse_hint:'Keep and edit existing queries and hashes.',
    design:'Design parameters', profile:'Profile', save_name:'Save name', destination:'Destination URL', hash:'Hash', parameter:'Parameter', value:'Value', key:'Key', note:'Note', add_param:'＋ Add parameter', no_params:'No parameters yet', no_params_hint:'Add a key and a value.',
    review:'REVIEW', complete_url:'Final URL', preview_empty:'Enter a destination URL to preview.', copy:'Copy URL', save:'Save', save_hint:'Choose a save method.', check_before:'Check before saving or copying', quality:'Quality check',
    saved_urls:'Saved URLs', library_hint:'Search, edit, export CSV, or back up.', export_csv:'Export CSV', backup:'Back up', restore:'Restore', delete_all:'Delete all', search:'Search name, note, or URL', no_saved:'No saved URLs.', edit:'Edit', delete:'Delete', updated:'Updated',
    matrix_title:'Create in bulk', matrix_hint:'Create up to 200 URLs from the current URL.', replace_key:'Parameter to replace', values:'Values (new line or comma)', remove_axis:'Remove axis', add_axis:'＋ Add axis', matrix_empty:'Enter a URL and axis values.', matrix_limit:'Only the first 200 results are shown and exported.',
    my_profiles:'My profiles', profile_hint:'Save parameter structures you use often.', profile_name:'Example: Company email rules', save_profile:'Save current structure', profile_info:'Only parameter names are saved.', no_profiles:'No custom profiles.', use:'Use', update:'Update from current structure',
    save_url:'Save URL', save_question:'Where do you want to save it?', save_description:'Choose a save method to edit it later.', device_save:'Save on this device', device_save_hint:'Edit it later on this device.', account_save:'Save with an account', account_save_hint:'Multi-device access and sharing are coming soon.', close:'Close',
    profile_generic:'Generic parameters', profile_generic_desc:'Add any key and value.', profile_ga4:'GA4 UTM', profile_ga4_desc:'Common UTM parameters.', profile_adobe:'Adobe Tracking Code', profile_adobe_desc:'For tracking codes and more.', profile_campaign:'Ads & CRM', profile_campaign_desc:'A starter for ads and CRM.',
    source:'Source', medium:'Medium', campaign:'Campaign', content:'Creative / CTA', term:'Keyword', campaign_id:'Campaign ID', platform:'Ad platform', creative:'Creative', channel:'Channel', audience:'Audience', custom_param:'Custom parameter'
  }
};

const STARTER_PROFILES = [
  { id: 'generic', nameKey: 'profile_generic', descriptionKey: 'profile_generic_desc', fields: [] },
  { id: 'ga4', nameKey: 'profile_ga4', descriptionKey: 'profile_ga4_desc', fields: [
    { key: 'utm_source', labelKey: 'source', required: true, choices: COMMON_SOURCES, normalize: 'slug' },
    { key: 'utm_medium', labelKey: 'medium', required: true, choices: COMMON_MEDIA, normalize: 'slug' },
    { key: 'utm_campaign', labelKey: 'campaign', required: true, normalize: 'slug' },
    { key: 'utm_content', labelKey: 'content', normalize: 'slug' },
    { key: 'utm_term', labelKey: 'term', normalize: 'slug' },
    { key: 'utm_id', labelKey: 'campaign_id', normalize: 'slug' },
    { key: 'utm_source_platform', labelKey: 'platform', choices: ['google_ads', 'meta_ads', 'linkedin_ads', 'x_ads'], normalize: 'slug' }
  ] },
  { id: 'adobe', nameKey: 'profile_adobe', descriptionKey: 'profile_adobe_desc', fields: [
    { key: 'cid', label: 'Tracking Code (cid)', required: true },
    { key: 'source', labelKey: 'source', choices: COMMON_SOURCES, normalize: 'slug' },
    { key: 'campaign', labelKey: 'campaign', normalize: 'slug' },
    { key: 'creative', labelKey: 'creative', normalize: 'slug' }
  ] },
  { id: 'campaign', nameKey: 'profile_campaign', descriptionKey: 'profile_campaign_desc', fields: [
    { key: 'campaign_id', labelKey: 'campaign_id', required: true, normalize: 'slug' },
    { key: 'channel', labelKey: 'channel', required: true, choices: ['email', 'paid_social', 'search', 'display', 'partner', 'offline'], normalize: 'slug' },
    { key: 'creative_id', labelKey: 'creative', normalize: 'slug' },
    { key: 'audience', labelKey: 'audience', normalize: 'slug' }
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
      locale: localStorage.getItem(LOCALE_KEY) === 'en' ? 'en' : 'ja',
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
    tabs() { return [{ id:'builder', label:this.t('builder') }, { id:'library', label:this.t('library') }, { id:'matrix', label:this.t('matrix') }, { id:'profiles', label:this.t('profiles') }]; },
    profiles() { return [...STARTER_PROFILES, ...this.customProfiles]; },
    activeProfile() { return this.profiles.find((profile) => profile.id === this.document.profileId) || STARTER_PROFILES[0]; },
    outputUrl() { return buildUrl(this.document); },
    errors() {
      const errors = [];
      if (!this.document.baseUrl.trim()) errors.push(this.locale === 'ja' ? '遷移先URLを入力してください。' : 'Enter a destination URL.');
      else if (!safeUrl(this.document.baseUrl)) errors.push(this.locale === 'ja' ? '遷移先URLの形式が正しくありません。' : 'Enter a valid URL.');
      const required = profileFields(this.activeProfile).filter((field) => field.required);
      required.forEach((field) => { if (!this.paramValue(field.key).trim()) errors.push(this.locale === 'ja' ? `${this.fieldLabel(field)}（${field.key}）を入力してください。` : `Enter ${this.fieldLabel(field)} (${field.key}).`); });
      this.document.params.forEach((param, index) => { if (param.value && !param.key.trim()) errors.push(this.locale === 'ja' ? `${index + 1}行目のパラメータ名を入力してください。` : `Enter a parameter name on row ${index + 1}.`); });
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
    t(key) { return MESSAGES[this.locale]?.[key] || MESSAGES.ja[key] || key; },
    setLocale(locale) { this.locale = locale; localStorage.setItem(LOCALE_KEY, locale); },
    profileLabel(profile) { return profile?.nameKey ? this.t(profile.nameKey) : (profile?.name || ''); },
    profileDescription(profile) { return profile?.descriptionKey ? this.t(profile.descriptionKey) : (profile?.description || ''); },
    fieldLabel(field) { return field?.labelKey ? this.t(field.labelKey) : (field?.label || field?.key || ''); },
    formatDate(value) { return new Date(value).toLocaleString(this.locale === 'ja' ? 'ja-JP' : 'en-US'); },
    notify(message, type = 'success') { this.message = message; this.messageType = type; },
    paramValue(key) { return this.document.params.find((param) => param.key === key)?.value || ''; },
    fieldFor(key) { return profileFields(this.activeProfile).find((field) => field.key === key); },
    displayLabel(param) { return this.fieldFor(param.key) ? this.fieldLabel(this.fieldFor(param.key)) : this.t('custom_param'); },
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
      this.notify(this.locale === 'ja' ? `${this.profileLabel(profile)}の項目を適用しました。` : `Applied ${this.profileLabel(profile)} fields.`);
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
      this.notify(profileId === 'generic' ? (this.locale === 'ja' ? 'キーと値を入力してください。' : 'Add a key and value.') : (this.locale === 'ja' ? `${this.profileLabel(this.activeProfile)}の入力欄を用意しました。` : `${this.profileLabel(this.activeProfile)} fields are ready.`));
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
    profileNameFor(id) { const profile = this.profiles.find((item) => item.id === id); return profile ? this.profileLabel(profile) : (this.locale === 'ja' ? '不明なプロファイル' : 'Unknown profile'); },
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
      <header class="hero"><div><div class="locale-switch" aria-label="Language"><button type="button" :class="{active:locale==='ja'}" @click="setLocale('ja')">日本語</button><button type="button" :class="{active:locale==='en'}" @click="setLocale('en')">English</button></div><p class="eyebrow">URL PARAMETER STUDIO</p><h1 v-html="t('hero')"></h1><p>{{ t('hero_sub') }}</p></div></header>
      <nav class="tabs" :aria-label="t('builder')"><button v-for="tab in tabs" :key="tab.id" type="button" :class="{active:activeTab===tab.id}" @click="activeTab=tab.id">{{ tab.label }}</button></nav>

      <section v-if="activeTab==='builder'" class="workspace">
        <div class="builder-main">
          <section class="start-panel" aria-labelledby="start-title"><div><p class="eyebrow">{{ t('start') }}</p><h2 id="start-title">{{ t('what') }}</h2><p>{{ t('start_hint') }}</p></div><div class="start-grid"><button type="button" class="start-card primary-start" @click="startWithProfile('generic')"><strong>{{ t('scratch') }}</strong><span>{{ t('scratch_hint') }}</span></button><button type="button" class="start-card" @click="startWithProfile('ga4')"><strong>{{ t('ga4_start') }}</strong><span>{{ t('ga4_hint') }}</span></button><button type="button" class="start-card" @click="startWithProfile('adobe')"><strong>{{ t('adobe_start') }}</strong><span>{{ t('adobe_hint') }}</span></button><button type="button" class="start-card" @click="focusPaste"><strong>{{ t('edit_url') }}</strong><span>{{ t('edit_hint') }}</span></button></div><button type="button" class="library-link" @click="openLibrary">{{ t('open_saved') }}</button></section>
          <section class="panel intake"><div class="section-heading"><div><p class="eyebrow">{{ t('inspector') }}</p><h2>{{ t('inspector_title') }}</h2></div><button type="button" class="quiet" @click="newDocument">{{ t('reset') }}</button></div><div class="paste-row"><input id="paste-url" v-model="pasteUrl" type="url" inputmode="url" placeholder="https://example.com/page?existing=value#section" :aria-label="t('parse')"><button type="button" @click="parsePastedUrl">{{ t('parse') }}</button></div><p class="hint">{{ t('parse_hint') }}</p></section>
          <section class="panel"><div class="section-heading"><div><p class="eyebrow">02 / {{ t('design') }}</p><h2>{{ t('design') }}</h2></div><span class="profile-pill">{{ profileLabel(activeProfile) }}</span></div>
            <div class="field-grid compact"><div class="field"><label for="profile">{{ t('profile') }}</label><select id="profile" v-model="document.profileId" @change="changeProfile"><option v-for="profile in profiles" :key="profile.id" :value="profile.id">{{ profileLabel(profile) }}</option></select><p>{{ profileDescription(activeProfile) }}</p></div><div class="field"><label for="title">{{ t('save_name') }}</label><input id="title" v-model="document.title" :placeholder="t('save_name')"></div></div>
            <div class="field wide"><label for="base-url">{{ t('destination') }}</label><input id="base-url" v-model="document.baseUrl" type="url" inputmode="url" placeholder="https://example.com/service"><p v-if="document.hash">{{ t('hash') }}: {{ document.hash }}</p></div>
            <div class="parameter-head"><span>{{ t('parameter') }}</span><span>{{ t('value') }}</span><span aria-hidden="true"></span></div>
            <div v-for="(param,index) in document.params" :key="param.id" class="parameter-row"><div><label class="sr-only" :for="'key-'+param.id">パラメータ名</label><input :id="'key-'+param.id" v-model="param.key" placeholder="キー"><small>{{ displayLabel(param) }}</small></div><div><label class="sr-only" :for="'value-'+param.id">値</label><input :id="'value-'+param.id" v-model="param.value" @change="normalizeParameter(param)" :list="fieldFor(param.key)?.choices ? 'choices-'+param.id : null" placeholder="値"><datalist v-if="fieldFor(param.key)?.choices" :id="'choices-'+param.id"><option v-for="choice in fieldFor(param.key).choices" :key="choice" :value="choice"></option></datalist></div><div class="row-actions"><button type="button" class="icon-button" :disabled="index===0" @click="moveParameter(index,-1)" aria-label="上へ移動">↑</button><button type="button" class="icon-button" :disabled="index===document.params.length-1" @click="moveParameter(index,1)" aria-label="下へ移動">↓</button><button type="button" class="icon-button danger" @click="removeParameter(param.id)" aria-label="削除">×</button></div></div>
            <div v-if="!document.params.length" class="parameter-empty"><strong>{{ t('no_params') }}</strong><span>{{ t('no_params_hint') }}</span></div><button type="button" class="add-button" @click="addParameter">{{ t('add_param') }}</button>
            <div class="field note-field"><label for="note">{{ t('note') }}</label><textarea id="note" v-model="document.note" rows="3" :placeholder="t('note')"></textarea></div>
          </section>
        </div>
        <aside class="preview-column"><section class="panel sticky"><p class="eyebrow">03 / {{ t('review') }}</p><h2>{{ t('complete_url') }}</h2><output class="url-output" :class="{empty:!outputUrl}">{{ outputUrl || t('preview_empty') }}</output><div class="actions"><button type="button" class="primary" :disabled="!outputUrl || errors.length" @click="copyUrl">{{ t('copy') }}</button><button type="button" @click="openSaveChoices">{{ t('save') }}</button></div><p class="local-note">{{ t('save_hint') }}</p><div v-if="errors.length" class="notice error" role="alert"><strong>{{ t('check_before') }}</strong><ul><li v-for="error in errors" :key="error">{{ error }}</li></ul></div><div v-if="warnings.length" class="notice warning"><strong>{{ t('quality') }}</strong><ul><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul></div><p v-if="message" class="message" :class="messageType" role="status">{{ message }}</p></section></aside>
      </section>

      <section v-else-if="activeTab==='library'" class="panel full-panel"><div class="section-heading"><div><p class="eyebrow">SAVED URLS</p><h2>{{ t('saved_urls') }}</h2><p class="hint">{{ t('library_hint') }}</p></div><div class="section-actions"><button type="button" @click="exportDocumentsCsv">{{ t('export_csv') }}</button><button type="button" @click="exportBackup">{{ t('backup') }}</button><button type="button" @click="selectBackup">{{ t('restore') }}</button><button type="button" class="danger" @click="clearDocuments">{{ t('delete_all') }}</button><input ref="backupFile" class="sr-only" type="file" accept="application/json" @change="importBackup"></div></div><input v-model="search" class="search" type="search" :placeholder="t('search')"><p v-if="!filteredDocuments.length" class="empty-state">{{ t('no_saved') }}</p><ul v-else class="document-list"><li v-for="item in filteredDocuments" :key="item.id" class="document-card"><div><p class="document-profile">{{ profileNameFor(item.profileId) }}</p><h3>{{ item.title }}</h3><p v-if="item.note" class="document-note">{{ item.note }}</p><code>{{ buildUrl(item) }}</code><p class="timestamp">{{ t('updated') }}: {{ formatDate(item.updatedAt) }}</p></div><div class="record-actions"><button type="button" @click="openDocument(item)">{{ t('edit') }}</button><button type="button" class="danger" @click="deleteDocument(item.id)">{{ t('delete') }}</button></div></li></ul></section>

      <section v-else-if="activeTab==='matrix'" class="panel full-panel"><div class="section-heading"><div><p class="eyebrow">CAMPAIGN MATRIX</p><h2>{{ t('matrix_title') }}</h2><p class="hint">{{ t('matrix_hint') }}</p></div><button type="button" class="primary" @click="exportMatrix">{{ t('export_csv') }}</button></div><div class="matrix-grid"><div v-for="axis in matrixAxes" :key="axis.id" class="axis-card"><label>{{ t('replace_key') }}<input v-model="axis.key" placeholder="utm_content"></label><label>{{ t('values') }}<textarea v-model="axis.values" rows="5" placeholder="hero_cta\nfooter_cta"></textarea></label><button type="button" class="danger text-button" @click="removeAxis(axis.id)">{{ t('remove_axis') }}</button></div><button type="button" class="add-axis" @click="addAxis">{{ t('add_axis') }}</button></div><p v-if="matrixResults.length >= 200" class="notice warning">{{ t('matrix_limit') }}</p><p v-if="!matrixResults.length" class="empty-state">{{ t('matrix_empty') }}</p><ol v-else class="matrix-results"><li v-for="item in matrixResults" :key="item.url"><strong>{{ item.label }}</strong><code>{{ item.url }}</code></li></ol></section>

      <section v-else class="panel full-panel"><div class="section-heading"><div><p class="eyebrow">MY PROFILES</p><h2>{{ t('my_profiles') }}</h2><p class="hint">{{ t('profile_hint') }}</p></div></div><div class="profile-create"><input v-model="profileName" :placeholder="t('profile_name')"><button type="button" class="primary" @click="saveCustomProfile">{{ t('save_profile') }}</button></div><p class="hint">{{ t('profile_info') }}</p><p v-if="!customProfiles.length" class="empty-state">{{ t('no_profiles') }}</p><ul v-else class="profile-list"><li v-for="profile in customProfiles" :key="profile.id"><div><h3>{{ profile.name }}</h3><p>{{ profile.fields.map(field => field.key).join(', ') }}</p></div><div class="record-actions"><button type="button" @click="useProfile(profile)">{{ t('use') }}</button><button type="button" @click="updateCustomProfile(profile)">{{ t('update') }}</button><button type="button" class="danger" @click="deleteCustomProfile(profile.id)">{{ t('delete') }}</button></div></li></ul></section>
      <div v-if="showSaveChoices" class="modal-backdrop" role="presentation" @click.self="showSaveChoices=false"><section class="save-dialog" role="dialog" aria-modal="true" aria-labelledby="save-title"><button type="button" class="close-dialog" :aria-label="t('close')" @click="showSaveChoices=false">×</button><p class="eyebrow">SAVE URL</p><h2 id="save-title">{{ t('save_question') }}</h2><p>{{ t('save_description') }}</p><div class="save-options"><button type="button" class="save-option" @click="saveDocument"><strong>{{ t('device_save') }}</strong><span>{{ t('device_save_hint') }}</span></button><button type="button" class="save-option account-option" @click="saveToAccount"><strong>{{ t('account_save') }}</strong><span>{{ t('account_save_hint') }}</span></button></div></section></div>
    </main>`
});

app.mount('#app');
