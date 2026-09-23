const STORAGE_KEY = 'url-params-builder.records.v2';
const LEGACY_COOKIE_KEY = 'createUrlParams';

const PARAMS = [
  ['utm_source', 'source'], ['utm_medium', 'medium'], ['utm_campaign', 'campaign'],
  ['utm_content', 'content'], ['utm_term', 'term'], ['utm_id', 'campaignId'],
  ['utm_source_platform', 'sourcePlatform']
];
const PRESETS = [
  { label: '選択してください', source: '', medium: '' },
  { label: 'メール配信', source: 'newsletter', medium: 'email' },
  { label: 'SNS オーガニック', source: 'instagram', medium: 'social' },
  { label: 'SNS 広告', source: 'meta', medium: 'paid_social', sourcePlatform: 'meta_ads' },
  { label: 'Google 広告', source: 'google', medium: 'cpc', sourcePlatform: 'google_ads' },
  { label: '外部サイト掲載', source: '', medium: 'referral' },
  { label: 'QRコード・紙媒体', source: 'qrcode', medium: 'offline' }
];
const SOURCE_OPTIONS = ['newsletter', 'mailmagazine', 'google', 'yahoo', 'facebook', 'instagram', 'x', 'linkedin', 'qrcode', 'brochure', 'other'];
const MEDIUM_OPTIONS = ['email', 'social', 'paid_social', 'cpc', 'display', 'referral', 'affiliate', 'offline', 'other'];
const PLATFORM_OPTIONS = ['', 'google_ads', 'meta_ads', 'linkedin_ads', 'x_ads', 'yahoo_ads', 'other'];

function emptyForm() {
  return { name: '', url: '', source: '', medium: '', campaign: '', content: '', term: '', campaignId: '', sourcePlatform: '', preset: '' };
}
function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function normalizeValue(value) { return value.trim().toLowerCase().replace(/\s+/g, '_'); }
function buildUrl(form) {
  const url = new URL(form.url.trim());
  PARAMS.forEach(([parameter, field]) => {
    url.searchParams.delete(parameter);
    if (form[field].trim()) url.searchParams.set(parameter, normalizeValue(form[field]));
  });
  return url.toString();
}
function validate(form) {
  const errors = [];
  if (!form.url.trim()) errors.push('遷移先URLを入力してください。');
  else {
    try { if (!['http:', 'https:'].includes(new URL(form.url.trim()).protocol)) errors.push('遷移先URLは http または https で始めてください。'); }
    catch (_) { errors.push('遷移先URLの形式が正しくありません。'); }
  }
  [['source', '参照元'], ['medium', 'メディア'], ['campaign', 'キャンペーン名']].forEach(([field, label]) => {
    if (!form[field].trim()) errors.push(`${label}を入力してください。`);
  });
  return errors;
}
function warningsFor(form) {
  return PARAMS.filter(([, field]) => form[field].trim() && !/^[a-z0-9_-]+$/.test(normalizeValue(form[field])))
    .map(([parameter]) => `${parameter} は英小文字・数字・ハイフン・アンダースコアで統一すると、レポートを集計しやすくなります。`);
}
function readRecords() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(saved) ? saved : []; }
  catch (_) { return []; }
}
function migrateLegacyCookie() {
  if (localStorage.getItem(STORAGE_KEY) || !document.cookie.includes(`${LEGACY_COOKIE_KEY}=`)) return [];
  const match = document.cookie.match(new RegExp(`(?:^|; )${LEGACY_COOKIE_KEY}=([^;]*)`));
  if (!match) return [];
  try {
    const records = JSON.parse(decodeURIComponent(match[1])).map((item) => ({
      id: createId(), createdAt: item.created_date || new Date().toISOString(),
      form: { ...emptyForm(), name: item.saved_name || '', url: item.url || '', source: item.utm_source || '', medium: item.utm_medium || '', campaign: item.utm_campaign || '', term: item.utm_term || '' }
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return records;
  } catch (_) { return []; }
}

const app = Vue.createApp({
  data() {
    const migrated = migrateLegacyCookie();
    return { form: emptyForm(), records: migrated.length ? migrated : readRecords(), message: '', messageType: 'success', copied: false, PRESETS, SOURCE_OPTIONS, MEDIUM_OPTIONS, PLATFORM_OPTIONS };
  },
  computed: {
    errors() { return validate(this.form); },
    warnings() { return warningsFor(this.form); },
    outputUrl() {
      if (this.errors.some((error) => error.includes('URL'))) return '';
      try { return buildUrl(this.form); } catch (_) { return ''; }
    }
  },
  methods: {
    applyPreset() {
      const preset = PRESETS.find((item) => item.label === this.form.preset);
      if (!preset) return;
      ['source', 'medium', 'sourcePlatform'].forEach((field) => { if (preset[field] !== undefined) this.form[field] = preset[field]; });
    },
    notify(message, type = 'success') { this.message = message; this.messageType = type; },
    async copyUrl() {
      if (this.errors.length) return this.notify('必須項目を確認してください。', 'error');
      try { await navigator.clipboard.writeText(this.outputUrl); this.copied = true; this.notify('URLをクリップボードにコピーしました。'); }
      catch (_) { this.notify('コピーに失敗しました。URLを選択してコピーしてください。', 'error'); }
    },
    saveRecord() {
      if (this.errors.length) return this.notify('必須項目を確認してから保存してください。', 'error');
      const record = { id: createId(), createdAt: new Date().toISOString(), form: JSON.parse(JSON.stringify(this.form)), outputUrl: this.outputUrl };
      this.records.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
      this.notify('パラメータを保存しました。');
    },
    reuseRecord(record) { this.form = { ...emptyForm(), ...record.form }; this.copied = false; this.notify('保存した設定を読み込みました。'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    deleteRecord(id) { this.records = this.records.filter((record) => record.id !== id); localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records)); this.notify('保存データを削除しました。'); },
    clearRecords() {
      if (!this.records.length || !window.confirm('保存済みの設定をすべて削除します。よろしいですか？')) return;
      this.records = []; localStorage.removeItem(STORAGE_KEY); this.notify('保存データをすべて削除しました。');
    },
    resetForm() { this.form = emptyForm(); this.copied = false; this.message = ''; },
    exportCsv() {
      if (!this.records.length) return this.notify('出力する保存データがありません。', 'error');
      const header = ['保存名', '作成日時', 'URL', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'utm_source_platform'];
      const rows = this.records.map((record) => [record.form.name, record.createdAt, record.outputUrl || buildUrl(record.form), record.form.source, record.form.medium, record.form.campaign, record.form.content, record.form.term, record.form.campaignId, record.form.sourcePlatform]);
      const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })); link.download = `utm-parameters-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(link.href); this.notify('CSVをダウンロードしました。');
    }
  },
  template: `
    <main class="container">
      <header class="hero"><p class="eyebrow">GA4 CAMPAIGN URL BUILDER</p><h1>URLパラメータ作成ツール</h1><p>計測ルールに沿ったUTM付きURLを、迷わず正確に作成・保存できます。</p></header>
      <section class="output-panel" aria-labelledby="output-title"><div class="section-heading"><div><p class="eyebrow">PREVIEW</p><h2 id="output-title">生成されるURL</h2></div><span class="status" :class="messageType" v-if="message" role="status">{{ message }}</span></div><output class="url-output" :class="{ empty: !outputUrl }">{{ outputUrl || '必須項目を入力すると、ここにURLが表示されます。' }}</output><div class="actions"><button class="primary" type="button" @click="copyUrl" :disabled="!outputUrl">{{ copied ? 'コピー済み' : 'URLをコピー' }}</button><button type="button" @click="saveRecord">設定を保存</button><button class="quiet" type="button" @click="resetForm">入力をリセット</button></div></section>
      <section class="form-panel" aria-labelledby="form-title"><div class="section-heading"><div><p class="eyebrow">CREATE</p><h2 id="form-title">計測URLを作成</h2></div><p class="required-note">* は必須項目です</p></div><div class="field preset-field"><label for="preset">媒体テンプレート</label><select id="preset" v-model="form.preset" @change="applyPreset"><option v-for="preset in PRESETS" :key="preset.label" :value="preset.label">{{ preset.label }}</option></select><p>よく使うsource・mediumをまとめて入力します。</p></div><div class="field wide"><label for="url">遷移先URL *</label><input id="url" v-model="form.url" type="url" inputmode="url" placeholder="https://example.com/service?plan=standard#contact"><p>既存のクエリやハッシュは保ったままUTMを追加します。</p></div>
        <div class="field-grid">
          <div class="field"><label for="source">utm_source（参照元）*</label><input id="source" v-model="form.source" list="source-options" placeholder="newsletter"><datalist id="source-options"><option v-for="option in SOURCE_OPTIONS" :key="option" :value="option"></option></datalist><p>例: newsletter, google, instagram</p></div>
          <div class="field"><label for="medium">utm_medium（メディア）*</label><input id="medium" v-model="form.medium" list="medium-options" placeholder="email"><datalist id="medium-options"><option v-for="option in MEDIUM_OPTIONS" :key="option" :value="option"></option></datalist><p>例: email, paid_social, cpc</p></div>
          <div class="field"><label for="campaign">utm_campaign（キャンペーン名）*</label><input id="campaign" v-model="form.campaign" placeholder="autumn_sale"><p>施策を一意に表す、統一した名称を使います。</p></div>
          <div class="field"><label for="content">utm_content（クリエイティブ）</label><input id="content" v-model="form.content" placeholder="hero_banner"><p>同一施策内の広告素材・CTAを区別します。</p></div>
          <div class="field"><label for="term">utm_term（キーワード）</label><input id="term" v-model="form.term" placeholder="marketing_automation"><p>主に検索広告のキーワード用です。</p></div>
          <div class="field"><label for="campaignId">utm_id（キャンペーンID）</label><input id="campaignId" v-model="form.campaignId" placeholder="2026_autumn_01"><p>外部データと結合するための識別子です。</p></div>
          <div class="field"><label for="sourcePlatform">utm_source_platform</label><select id="sourcePlatform" v-model="form.sourcePlatform"><option v-for="option in PLATFORM_OPTIONS" :key="option" :value="option">{{ option || '選択しない' }}</option></select><p>広告配信プラットフォームを示します。</p></div>
          <div class="field"><label for="name">保存名</label><input id="name" v-model="form.name" placeholder="2026秋セール メール配信"><p>保存済み設定を見つけやすくするための名前です。</p></div>
        </div><div v-if="errors.length" class="notice error" role="alert"><strong>入力を確認してください</strong><ul><li v-for="error in errors" :key="error">{{ error }}</li></ul></div><div v-if="warnings.length" class="notice warning"><strong>命名のヒント</strong><ul><li v-for="warning in warnings" :key="warning">{{ warning }}</li></ul></div></section>
      <section class="saved-panel" aria-labelledby="saved-title"><div class="section-heading"><div><p class="eyebrow">LIBRARY</p><h2 id="saved-title">保存済みの設定</h2></div><div class="section-actions"><button type="button" class="quiet" @click="exportCsv">CSV出力</button><button type="button" class="danger" @click="clearRecords">すべて削除</button></div></div><p v-if="!records.length" class="empty-state">まだ保存された設定はありません。作成したURLを「設定を保存」から登録できます。</p><ul v-else class="record-list"><li v-for="record in records" :key="record.id" class="record"><div><h3>{{ record.form.name || record.form.campaign }}</h3><p class="record-meta">{{ new Date(record.createdAt).toLocaleString('ja-JP') }}</p><code>{{ record.outputUrl || buildUrl(record.form) }}</code></div><div class="record-actions"><button type="button" @click="reuseRecord(record)">再利用</button><button type="button" class="danger" @click="deleteRecord(record.id)">削除</button></div></li></ul></section>
    </main>`
});
app.mount('#app');
