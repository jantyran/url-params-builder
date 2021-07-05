// global
const cookieName = "createUrlParams"

const d = new Date()
const year = d.getFullYear()
const month = String(d.getMonth() + 1)
const date = String(d.getDate())

// vue local
let baseData = {
    created_date: '',
    saved_name: '',
    url: 'https://sample.url',
    is_source: false,
    is_medium: false,
    is_campaign: false,
    is_term: false,
    utm_source: '',
    select_source: '',
    input_source: false,
    input_source_text: 'others',
    source_site: false,
    input_source_site: '',
    utm_medium: '',
    select_medium: '',
    input_medium: false,
    input_medium_text: 'others',
    utm_campaign: '',
    select_campaign: '',
    input_campaign: false,
    input_campaign_text: '',
    utm_term: '',
    input_term_text: ''
}
let paramDatas = []

if(Cookies.get(cookieName)) {
    paramDatas = JSON.parse(Cookies.get(cookieName))
}
let data = {
    baseData,
    paramDatas
}
let methods = {
    copyUrl() {
        if(navigator.clipboard) {
            var copyText = this.outputurl;
            navigator.clipboard.writeText(copyText).then(function() {
                alert('クリップボードにコピーしました。');
            });
        } else {
            alert('コピーに失敗しました');
        }
    },
    saveParam() {
        this.baseData.created_date = year+"/"+month+"/"+date

        this.paramDatas.push(this.baseData)
        
        Cookies.set(cookieName, this.paramDatas, {expires: 180});
        getParams(cookieName)
    },  
    loadParam(param) {
        // 参照ワタシ・・・
        this.baseData = Object.assign({}, param)
    },
    deleteParam(num) {
        this.paramDatas.splice(num, 1)
        Cookies.set(cookieName, this.paramDatas, {expires: 180});
        getParams(cookieName)
    },
    deleteCookie() {
        Cookies.remove(cookieName);
        this.paramDatas.length = 0
        getParams(cookieName)
    }
}
let  computed = {
    outputurl: {
        get: function() {
            var utm_source = ''
            var utm_medium = ''
            var utm_campaign = ''
            var utm_term = ''

            if (this.baseData.is_source) {
                utm_source = "?utm_source=" + this.baseData.utm_source
            }
            if (this.baseData.is_medium) {
                utm_medium = "&utm_medium=" + this.baseData.utm_medium
            }
            if (this.baseData.is_campaign) {
                utm_campaign = "&utm_campaign=" + this.baseData.utm_campaign
            }
            if (this.baseData.is_term) {
                utm_term = "&utm_term=" + this.baseData.utm_term
            }
            return this.baseData.url + utm_source + utm_medium + utm_campaign + utm_term
        }
    }
}


// functions
function getParams(cookie) {
    if(Cookies.get(cookie)) {
        this.paramDatas = JSON.parse(Cookies.get(cookie))
    }
}

 function ch_source() {
    if (this.baseData.is_source == false ) { this.baseData.is_source = true }
    
    if (this.baseData.select_source == 'input') {
        this.baseData.input_source = true;
        this.baseData.source_site = false;
        this.baseData.utm_source = this.baseData.input_source_text;
    } else if (this.baseData.select_source == 'outside-website') {
        this.baseData.source_site = true
        this.baseData.input_source = false;
        this.baseData.utm_source = this.baseData.input_source_site
    } else {
        this.baseData.input_source = false;
        this.baseData.source_site = false;
        this.baseData.utm_source = this.baseData.select_source;
    }
 }

 function ch_source_text(val) {
    if (this.baseData.select_source == 'input') {
        this.baseData.input_source = true;
        this.baseData.utm_source = val;
    } else if (this.baseData.select_source == 'outside-website') {
        this.baseData.source_site = true;
        this.baseData.utm_source = val;
    }
 }

 function ch_medium() {
    if (this.baseData.is_medium == false ) { this.baseData.is_medium = true }
    if (this.baseData.select_medium == 'input') {
        this.baseData.input_medium = true;
        this.baseData.utm_medium = this.baseData.input_medium_text;
    } else {
        this.baseData.input_medium = false;
        this.baseData.utm_medium = this.baseData.select_medium;
    }  
 }

 function ch_medium_text(val) {
    if (this.baseData.select_medium == 'input') {
        this.baseData.input_medium = true;
        this.baseData.utm_medium = this.baseData.input_medium_text;
    } else {
        this.baseData.input_medium = false;
        this.baseData.utm_medium = this.baseData.select_medium;
    }  
 }

 function ch_campaign () {
    if (this.baseData.is_campaign == false ) { this.baseData.is_campaign = true }
    if (this.baseData.select_campaign == 'input') {
        this.baseData.input_campaign = true;
        this.baseData.utm_campaign = this.baseData.input_campaign_text;
    } else {
        this.baseData.input_campaign = false;
        this.baseData.utm_campaign = this.baseData.select_campaign;
    }  
 }
 function ch_campaign_text() {
    if (this.baseData.select_campaign == 'input') {
        this.baseData.input_campaign = true;
        this.baseData.utm_campaign = this.baseData.input_campaign_text;
    } else {
        this.baseData.input_campaign = false;
        this.baseData.utm_campaign = this.baseData.select_campaign;
    }  
 }

// term
function ch_term() {
    if (this.baseData.input_term_text !== '') {
        this.baseData.is_term = true
        this.baseData.utm_term = this.baseData.input_term_text;
    } else {
        this.baseData.is_term = false
    }
 }




const app = Vue.createApp({})
app.component('create-param', { 
    data() { return data },
    methods: methods,
    computed: computed,
    watch: {
        'baseData.select_source': ch_source,
        'baseData.input_source_text': ch_source_text,
        'baseData.input_source_site': ch_source_text,
        'baseData.select_medium': ch_medium,
        'baseData.input_medium_text': ch_medium_text,
        'baseData.select_campaign': ch_campaign,
        'baseData.input_campaign_text': ch_campaign_text,
        'baseData.input_term_text': ch_term
    },
    mounted() {
        getParams(cookieName)
    },
    template: `
    <div id="main">
                <h1 class="text-gradient text-line">URL パラメーター作成ツール</h1>
                <div id="output">
                　  <p>以下のURLをコピーしてご利用ください。</p>
                    <p class="outputurl">▶︎ {{ outputurl }}</p>
                    <div id="ops">
                        <button @click="copyUrl">クリップボードにコピー</button>
                        <button @click="saveParam">パラメータを保存</button>
                        <button @click="deleteCookie">保存データをすべて削除</button>
                    </div>
                    
                </div>

                <div class="saved">
                    <ul class="saved_boxes">
                        <li v-for="(param, index) in paramDatas" class="box">
                            <div>
                                <button @click="loadParam(param)">▶ 再利用</button>
                                <p>source: {{param.utm_source}}</p>
                                <p>medium: {{param.utm_medium}}</p>
                                <p>campaign: {{param.utm_campaign}}</p>
                                <p>term : {{param.utm_term   }}</p>
                                <p class="date">
                                    作成日: {{ param.created_date }}
                                </p>
                                <button class="del" @click="deleteParam(index)"> ☓ </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <hr>

                <form id="input" class="form">
                    <h3 class="text-important text-line">
                        必須項目
                    </h3>

                    <h4> URL:　パラメータをつけたいURLを入力</h4>
                    <input type="text" v-model="baseData.url" class="typed_url" style="margin-top: 0;">
                    <br>

                    <div class="required_utms">
                        <div class="utm">
                            <h4>1. utm_source(参照元/媒体名)</h4>
                            <p>どのサイト・経路からアクセスされたか</p>
                            <div id="utm_source">
                                <select name="utm_source" size="1" v-model="baseData.select_source">
                                    <option value='' disabled selected style='display:none;'>選択してください</option>
                                    <optgroup label="メール">
                                        <option value="mailmagazine">メールマガジン</option>
                                    <option value="newsletter">ニュースレター</option>
                                    <option value="personal-mail">個人メール</option>
                                    <option value="personal-mail">Sansan (個人名義)</option>
                                    </optgroup>
                                    <optgroup label="SNS">
                                        <option value="fb">Facebook</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="instagram">Instagram</option>
                                    </optgroup>
                                    <optgroup label="WEB媒体">
                                    <option value="google">Google</option>
                                    <option value="fb">Facebook</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="yahoo">Yahoo</option>
                                    <option value="outside-website">その他外部サイト（半角英字表記）</option>
                                    </optgroup>
                                    <optgroup label="その他">
                                        <option value="brochure">ブローシャー</option>
                                        <option value="qrcode">QRコード</option>
                                        <option value="input">その他入力（半角英字表記）</option>
                                    </optgroup>
                                </select>
                                <span v-if="baseData.source_site">
                                    <input type="text" v-model="baseData.input_source_site">
                                    <p>参照元のサイト名を半角英字にて入力ください。</p>
                                </span>
                                <span v-if="baseData.input_source">
                                    <input type="text" v-model="baseData.input_source_text">
                                    <p>その他のソース名を半角英字にて入力ください。</p>
                                </span>
                        
                            </div>
                        </div>
                        <br>
                        <div class="utm">
                            <h4>2. utm_medium(メディア)</h4>
                            <p>テキスト広告・バナー・メール等メディア等の媒体の種類</p>
                            <div id="utm_medium">
                                <select name="utm_medium" size="1" v-model="baseData.select_medium">
                                    <option value='' disabled selected style='display:none;'>選択してください</option>
                                    <optgroup label="頻出項目">
                                        <option value="email">メール</option>
                                        <option value="social">SNS</option>
                                        <option value="referral">参照元サイト</option>
                                        <option value="dm">ダイレクトメール</option>
                                        <option value="whitepapaer">ホワイトペーパー・紙媒体</option>
                                    </optgroup>
                                    <optgroup label="Paid Search">
                                    <option value="cpc">cpc</option>
                                    <option value="ppc">ppc</option>
                                    </optgroup>
                                    <optgroup label="ディスプレイ広告">
                                        <option value="banner">banner</option>
                                        <option value="display">display</option>
                                        <option value="cpm">cpm</option>
                                    </optgroup>
                                    <optgroup label="その他">
                                        <option value="input">その他入力（半角英字表記）</option>
                                    </optgroup>
                                </select>
                                <input type="text" v-if="baseData.input_medium" v-model="baseData.input_medium_text">
                                <p v-if="baseData.input_medium">その他の媒体を半角英字にて入力ください。</p>
                            </div>
                        </div>
                        <br>
                        <div class="utm">
                            <h4>3. utm_campaign(キャンペーン)</h4>
                            <p>販促する商品やキャンペーン名・広告のキャンペーンタイプ等</p>
                            <div id="utm_campaign">
                                <select name="utm_campaign" size="1" v-model="baseData.select_campaign">
                                    <option value='' disabled selected style='display:none;'>選択してください</option>
                                    <optgroup label="その他">
                                        <option value="input">その他入力（半角英字表記）</option>
                                    </optgroup>
                                </select>
                                <input type="text" v-if="baseData.input_campaign" v-model="baseData.input_campaign_text" placeholder="キャンペーンを半角英字にて入力ください。">
                            </div>
                        </div>
                    </div>

                    <h3 class="text-primary text-line" style="margin-top: 20px;">
                        任意項目
                    </h3>
                    <p> utm_term(キーワード)：検索広告で指定するキーワード等</p>
                    <div id="utm_term">
                        <input type="text" v-model="baseData.input_term_text" placeholder="キーワードを半角英字にて入力ください。">
                    </div>

                </form>
            </div>
    `
})
app.mount('#app')


