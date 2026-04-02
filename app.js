'use strict';

// ─── STATE ───────────────────────────────────────
let currentUser = null;
let currentView = 'feed';
let viewingCreator = null;
let selectedTier = null;
let selectedSubTier = null;

// ─── MOCK DATA ────────────────────────────────────
const COLORS = ['color-0','color-1','color-2','color-3','color-4','color-5','color-6','color-7'];

const CREATORS = [
  { id:'c1', name:'Alex Rivera', handle:'@alexrivera', bio:'Fitness coach & lifestyle creator. Sharing workouts, nutrition tips, and behind-the-scenes.', category:'fitness', avatar:'AR', color:'color-3', posts:142, likes:'24.5K', subscribers:1840, verified:true, banner:'linear-gradient(135deg,#0d3d1a,#1a4d0d)', tiers:[
    { id:'t1', name:'Supporter', price:9.99, desc:'Access to all regular posts and stories.', perks:['All posts','Stories','Monthly Q&A'] },
    { id:'t2', name:'VIP', price:24.99, desc:'Everything in Supporter plus exclusive workout plans.', perks:['Everything in Supporter','Exclusive workouts','Direct DMs','Monthly video call'] },
  ]},
  { id:'c2', name:'Mia Chen', handle:'@miachen', bio:'Digital artist and illustrator. Sharing my creative process and exclusive art.', category:'art', avatar:'MC', color:'color-5', posts:89, likes:'18.2K', subscribers:960, verified:true, banner:'linear-gradient(135deg,#1a0a4a,#2a0a3a)', tiers:[
    { id:'t3', name:'Fan', price:7.99, desc:'Access to all artwork and time-lapse videos.', perks:['All artwork','Time-lapses','WIP updates'] },
    { id:'t4', name:'Collector', price:19.99, desc:'Everything in Fan plus high-res files and brushes.', perks:['Everything in Fan','High-res downloads','Brush packs','PSD files'] },
  ]},
  { id:'c3', name:'Jordan Blake', handle:'@jordanblake', bio:'Singer-songwriter sharing exclusive demos, acoustic sessions, and tour life.', category:'music', avatar:'JB', color:'color-6', posts:67, likes:'31.0K', subscribers:2200, verified:true, banner:'linear-gradient(135deg,#3a0a2a,#4a0a1a)', tiers:[
    { id:'t5', name:'Listener', price:5.99, desc:'Early access to new songs and acoustic covers.', perks:['Early releases','Acoustic sessions','Monthly playlist'] },
    { id:'t6', name:'Backstage', price:14.99, desc:'Everything in Listener plus tour diaries and requests.', perks:['Everything in Listener','Tour diaries','Song requests','Signed merch discount'] },
  ]},
  { id:'c4', name:'Sam Torres', handle:'@samtorres', bio:'Home chef creating restaurant-quality recipes you can actually make.', category:'cooking', avatar:'ST', color:'color-2', posts:203, likes:'42.1K', subscribers:3100, verified:false, banner:'linear-gradient(135deg,#3a2a00,#2a1a00)', tiers:[
    { id:'t7', name:'Home Cook', price:8.99, desc:'Weekly recipes and cooking techniques.', perks:['Weekly recipes','Technique videos','Shopping guides'] },
    { id:'t8', name:'Chef\'s Table', price:22.99, desc:'Everything plus live cooking sessions.', perks:['Everything in Home Cook','Live cooking','Private cookbook','Personal feedback'] },
  ]},
  { id:'c5', name:'Riley Park', handle:'@rileypark', bio:'Lifestyle blogger. Travel, fashion, wellness and daily vlogs.', category:'lifestyle', avatar:'RP', color:'color-4', posts:318, likes:'55.8K', subscribers:4500, verified:true, banner:'linear-gradient(135deg,#002a3a,#001a3a)', tiers:[
    { id:'t9', name:'Friend', price:6.99, desc:'Daily updates and exclusive lifestyle content.', perks:['Daily posts','Exclusive vlogs','Style tips'] },
    { id:'t10', name:'BFF', price:18.99, desc:'Everything plus travel guides and 1-on-1 chats.', perks:['Everything in Friend','Travel guides','1-on-1 chat','Birthday shoutout'] },
  ]},
  { id:'c6', name:'Chris Nova', handle:'@chrisnova', bio:'Competitive gamer & streamer. Gaming tips, reviews, and exclusive streams.', category:'gaming', avatar:'CN', color:'color-0', posts:174, likes:'28.3K', subscribers:2800, verified:true, banner:'linear-gradient(135deg,#3a0a0a,#2a0000)', tiers:[
    { id:'t11', name:'Player', price:4.99, desc:'Access to gaming tips and exclusive clips.', perks:['Gaming tips','Exclusive clips','Discord role'] },
    { id:'t12', name:'Legend', price:12.99, desc:'Everything plus coaching sessions and early access.', perks:['Everything in Player','Coaching sessions','Early beta access','Co-op sessions'] },
  ]},
];

const POSTS = [
  { id:'p1', creatorId:'c1', caption:'Morning workout DONE 💪 New program drops next week for all VIP members. This is what consistency looks like after 6 months.', tags:['#fitness','#workout','#consistency'], time:'2h ago', likes:342, comments:28, locked:false, ppv:null, mediaColor:'#1a3a1a' },
  { id:'p2', creatorId:'c2', caption:'Working on a new piece inspired by cyberpunk cityscapes. High-res PSD available for Collector tier members!', tags:['#digitalart','#cyberpunk','#illustration'], time:'4h ago', likes:189, comments:14, locked:true, ppv:null, mediaColor:'#1a0a3a' },
  { id:'p3', creatorId:'c3', caption:'Recorded a new acoustic demo last night. Exclusively for Backstage members — this one hits different 🎵', tags:['#music','#acoustic','#newmusic'], time:'6h ago', likes:520, comments:67, locked:true, ppv:null, mediaColor:'#2a0a1a' },
  { id:'p4', creatorId:'c4', caption:'30-minute risotto that actually works every time. Full recipe with substitutions in the post — no gatekeeping here!', tags:['#cooking','#risotto','#recipe'], time:'8h ago', likes:891, comments:102, locked:false, ppv:null, mediaColor:'#2a1a00' },
  { id:'p5', creatorId:'c5', caption:'Tokyo vlog day 3 — hidden gem cafes and the best ramen I\'ve ever had. All details in this exclusive guide.', tags:['#travel','#tokyo','#lifestyle'], time:'12h ago', likes:1204, comments:88, locked:false, ppv:5.00, mediaColor:'#00162a' },
  { id:'p6', creatorId:'c6', caption:'Just hit Diamond rank for the 4th season in a row. Breaking down my macro strategy in tonight\'s exclusive stream!', tags:['#gaming','#ranked','#tips'], time:'1d ago', likes:678, comments:45, locked:true, ppv:null, mediaColor:'#2a0000' },
];

const NOTIFICATIONS = [
  { id:'n1', type:'like', avatar:'RP', color:'color-4', name:'Riley Park', text:'liked your post', time:'5m ago', unread:true },
  { id:'n2', type:'subscribe', avatar:'CN', color:'color-0', name:'Chris Nova', text:'subscribed to your page • VIP tier', time:'20m ago', unread:true },
  { id:'n3', type:'comment', avatar:'ST', color:'color-2', name:'Sam Torres', text:'commented: "This is incredible content!"', time:'1h ago', unread:true },
  { id:'n4', type:'tip', avatar:'MC', color:'color-5', name:'Mia Chen', text:'sent you a $10.00 tip', time:'2h ago', unread:true },
  { id:'n5', type:'follow', avatar:'JB', color:'color-6', name:'Jordan Blake', text:'started following you', time:'3h ago', unread:true },
  { id:'n6', type:'like', avatar:'AR', color:'color-3', name:'Alex Rivera', text:'liked 3 of your posts', time:'5h ago', unread:false },
  { id:'n7', type:'message', avatar:'RP', color:'color-4', name:'Riley Park', text:'sent you a message', time:'1d ago', unread:false },
];

const CONVERSATIONS = [
  { id:'m1', avatar:'RP', color:'color-4', name:'Riley Park', preview:'That sounds amazing! When are you...', time:'2m', unread:2 },
  { id:'m2', avatar:'AR', color:'color-3', name:'Alex Rivera', preview:'Thanks for subscribing! Here\'s the...', time:'1h', unread:1 },
  { id:'m3', avatar:'CN', color:'color-0', name:'Chris Nova', preview:'GG! Let\'s run some ranked games this...', time:'3h', unread:0 },
];

const TRENDING_TAGS = ['#fitness','#art','#music','#travel','#cooking','#gaming','#lifestyle','#photography'];

const DEMO_ACCOUNTS = {
  creator: { id:'me-creator', name:'Taylor Morgan', handle:'@taylormorgan', type:'creator', email:'creator@demo.com', bio:'Content creator sharing my journey. Exclusive behind-the-scenes, tutorials, and more.', avatar:'TM', color:'color-4', posts:47, likes:'8.3K', subscribers:520, earnings:2840, views:18400 },
  fan: { id:'me-fan', name:'Jamie Lee', handle:'@jamielee', type:'fan', email:'fan@demo.com', bio:'Avid fan of amazing creators!', avatar:'JL', color:'color-6', posts:0, likes:'0', subscribers:0 },
};

let userSubscriptions = ['c1','c4']; // creators user is subscribed to
let likedPosts = new Set(['p4']);
let following = new Set(['c1','c3','c4']);

// ─── AUTH ─────────────────────────────────────────
function login() { loginAs('fan'); }

function loginAs(type) {
  currentUser = { ...DEMO_ACCOUNTS[type] };
  initApp();
}

function signup() {
  const type = document.querySelector('.type-btn.active')?.dataset.type || 'fan';
  const name = document.getElementById('signup-name').value || 'New User';
  currentUser = { id:'me-new', name, handle:'@' + name.toLowerCase().replace(/\s+/g,''), type, email:'', bio:'', avatar: name.substring(0,2).toUpperCase(), color: COLORS[Math.floor(Math.random()*COLORS.length)], posts:0, likes:'0', subscribers:0 };
  initApp();
}

function logout() {
  currentUser = null;
  document.getElementById('auth-screen').classList.add('active');
  document.getElementById('app-screen').classList.remove('active');
  document.body.classList.remove('is-creator','is-fan');
}

// ─── APP INIT ──────────────────────────────────────
function initApp() {
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');

  const isCreator = currentUser.type === 'creator';
  document.body.classList.toggle('is-creator', isCreator);
  document.body.classList.toggle('is-fan', !isCreator);

  // Sidebar user info
  setAvatarEl('sidebar-avatar', currentUser);
  setAvatarEl('post-avatar', currentUser);
  document.getElementById('sidebar-name').textContent = currentUser.name;
  document.getElementById('sidebar-handle').textContent = currentUser.handle;

  renderFeed();
  renderExplore();
  renderSubscriptions();
  renderMessages();
  renderNotifications();
  renderSuggested();
  renderTrendingTags();
  if (isCreator) renderDashboard();
  renderProfile();

  navigate('feed');
}

// ─── NAVIGATION ────────────────────────────────────
function navigate(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const viewEl = document.getElementById('view-' + view);
  if (viewEl) viewEl.classList.add('active');

  const navEl = document.querySelector(`[data-view="${view}"]`);
  if (navEl) navEl.classList.add('active');

  // Clear notification badges when viewing those sections
  if (view === 'notifications') document.getElementById('notif-badge').style.display = 'none';
  if (view === 'messages') document.getElementById('msg-badge').style.display = 'none';
}

// ─── FEED ──────────────────────────────────────────
function renderFeed() {
  const container = document.getElementById('feed-posts');
  container.innerHTML = '';
  POSTS.forEach(post => {
    const creator = CREATORS.find(c => c.id === post.creatorId);
    if (!creator) return;
    container.appendChild(buildPostCard(post, creator));
  });
}

function buildPostCard(post, creator) {
  const isSubscribed = userSubscriptions.includes(creator.id);
  const isLocked = post.locked && !isSubscribed;
  const isPPV = post.ppv && !isSubscribed;
  const liked = likedPosts.has(post.id);

  const card = document.createElement('div');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-header">
      <div class="post-creator-avatar ${creator.color}" onclick="viewCreator('${creator.id}')">${creator.avatar}</div>
      <div class="post-creator-info" onclick="viewCreator('${creator.id}')">
        <div class="post-creator-name">${creator.name} ${creator.verified ? '<span style="color:var(--brand);font-size:12px;">✓</span>' : ''}</div>
        <div class="post-creator-handle">${creator.handle}</div>
      </div>
      <span class="post-time">${post.time}</span>
      ${isPPV ? `<span class="ppv-badge">$${post.ppv.toFixed(2)} PPV</span>` : ''}
      <button class="post-menu">···</button>
    </div>
    <div class="post-media${isLocked ? ' locked' : ''}" style="background:${post.mediaColor}">
      <div style="font-size:64px;opacity:.15;">${creator.avatar}</div>
      ${isLocked ? `
        <div class="locked-overlay">
          <div class="lock-icon">🔒</div>
          <p>Subscribe to unlock this content</p>
          <button onclick="openSubscribeModal('${creator.id}')">Subscribe from $${Math.min(...creator.tiers.map(t=>t.price)).toFixed(2)}/mo</button>
        </div>` : ''}
      ${isPPV && !isLocked ? `
        <div class="locked-overlay">
          <div class="lock-icon">💎</div>
          <p>Pay-per-view content</p>
          <button onclick="unlockPPV('${post.id}')">Unlock for $${post.ppv.toFixed(2)}</button>
        </div>` : ''}
    </div>
    <div class="post-body">
      <div class="post-caption">${post.caption}</div>
      <div class="post-tags">${post.tags.map(t=>`<span class="post-tag">${t}</span>`).join('')}</div>
    </div>
    <div class="post-actions">
      <button class="post-action${liked?' liked':''}" onclick="toggleLike('${post.id}',this)">
        <svg viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${liked ? post.likes+1 : post.likes}</span>
      </button>
      <button class="post-action">
        <svg viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${post.comments}</span>
      </button>
      <button class="post-action">
        <svg viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Share
      </button>
      <button class="post-action post-action-sep" style="margin-left:auto;" onclick="openSubscribeModal('${creator.id}')">
        <svg viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        ${isSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>`;
  return card;
}

function toggleLike(postId, btn) {
  if (likedPosts.has(postId)) { likedPosts.delete(postId); btn.classList.remove('liked'); }
  else { likedPosts.add(postId); btn.classList.add('liked'); }
  const countEl = btn.querySelector('span');
  const post = POSTS.find(p => p.id === postId);
  if (post) countEl.textContent = likedPosts.has(postId) ? post.likes + 1 : post.likes;
}

function unlockPPV(postId) { showToast('Content unlocked! Enjoy 🎉', 'success'); }

// ─── EXPLORE ───────────────────────────────────────
let activeCategory = 'all';

function renderExplore(filter = '') {
  const grid = document.getElementById('creators-grid');
  grid.innerHTML = '';
  const search = filter.toLowerCase();
  CREATORS.filter(c =>
    (activeCategory === 'all' || c.category === activeCategory) &&
    (!search || c.name.toLowerCase().includes(search) || c.handle.toLowerCase().includes(search))
  ).forEach(creator => {
    const isFollowing = following.has(creator.id);
    const card = document.createElement('div');
    card.className = 'creator-card';
    card.innerHTML = `
      <div class="creator-card-banner" style="background:${creator.banner}">
        <div class="creator-card-avatar ${creator.color}">${creator.avatar}</div>
      </div>
      <div class="creator-card-body">
        <div class="creator-card-name">${creator.name} ${creator.verified ? '<span style="color:var(--brand);font-size:11px;">✓</span>' : ''}</div>
        <div class="creator-card-handle">${creator.handle}</div>
        <div class="creator-card-tag">${creator.category}</div>
        <div class="creator-card-stats">
          <span>${creator.posts} posts</span>
          <span>${fmtNum(creator.subscribers)} fans</span>
        </div>
        <button class="btn-primary" onclick="openSubscribeModal('${creator.id}')">
          ${userSubscriptions.includes(creator.id) ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </div>`;
    card.querySelector('.creator-card-banner').addEventListener('click', () => viewCreator(creator.id));
    card.querySelector('.creator-card-name').addEventListener('click', () => viewCreator(creator.id));
    grid.appendChild(card);
  });
}

function filterCreators() { renderExplore(document.getElementById('explore-search').value); }

function filterCategory(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = cat;
  renderExplore(document.getElementById('explore-search').value);
}

// ─── SUBSCRIPTIONS ─────────────────────────────────
function renderSubscriptions() {
  const list = document.getElementById('subscriptions-list');
  list.innerHTML = '';
  if (userSubscriptions.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2)">
      <div style="font-size:48px;margin-bottom:12px;">💔</div>
      <p>No subscriptions yet. Explore creators to get started!</p>
      <button class="btn-primary" style="margin-top:16px;width:auto;padding:10px 24px;" onclick="navigate('explore')">Explore Creators</button>
    </div>`;
    return;
  }
  userSubscriptions.forEach(cid => {
    const creator = CREATORS.find(c => c.id === cid);
    if (!creator) return;
    const tier = creator.tiers[0];
    const item = document.createElement('div');
    item.className = 'sub-item';
    item.innerHTML = `
      <div class="sub-avatar ${creator.color}">${creator.avatar}</div>
      <div class="sub-info">
        <div class="sub-name">${creator.name}</div>
        <div class="sub-handle">${creator.handle}</div>
        <div class="sub-tier">${tier.name} tier</div>
      </div>
      <div style="text-align:right">
        <div class="sub-price">$${tier.price.toFixed(2)}/mo</div>
        <div class="sub-renewal">Renews Apr 30</div>
      </div>
      <div class="sub-actions">
        <button class="btn-secondary small" onclick="viewCreator('${creator.id}')">View</button>
        <button class="btn-secondary small" onclick="unsubscribe('${creator.id}',this)">Cancel</button>
      </div>`;
    list.appendChild(item);
  });
}

function unsubscribe(cid, btn) {
  userSubscriptions = userSubscriptions.filter(id => id !== cid);
  renderSubscriptions();
  showToast('Subscription cancelled', 'error');
}

// ─── MESSAGES ──────────────────────────────────────
function renderMessages() {
  const list = document.getElementById('conversations-list');
  list.innerHTML = '';
  CONVERSATIONS.forEach(conv => {
    const item = document.createElement('div');
    item.className = 'conv-item';
    item.innerHTML = `
      <div class="conv-avatar ${conv.color}">${conv.avatar}</div>
      <div class="conv-info">
        <div class="conv-name">${conv.name}</div>
        <div class="conv-preview">${conv.preview}</div>
      </div>
      <div class="conv-meta">
        <span class="conv-time">${conv.time}</span>
        ${conv.unread ? `<span class="conv-unread">${conv.unread}</span>` : ''}
      </div>`;
    item.addEventListener('click', () => openChat(conv));
    list.appendChild(item);
  });
}

function openChat(conv) {
  document.querySelectorAll('.conv-item').forEach(i => i.classList.remove('active'));
  event.currentTarget.classList.add('active');
  const panel = document.getElementById('chat-panel');
  const messages = [
    { text: "Hey! Love your content!", sent: true },
    { text: "Thank you so much! That means a lot 🙏", sent: false },
    { text: "When's your next exclusive post?", sent: true },
    { text: conv.preview, sent: false },
  ];
  panel.innerHTML = `
    <div class="chat-header">
      <div class="conv-avatar ${conv.color}">${conv.avatar}</div>
      <div>
        <div class="conv-name">${conv.name}</div>
        <div style="font-size:12px;color:var(--success)">● Online</div>
      </div>
    </div>
    <div class="chat-messages">
      ${messages.map(m => `<div class="chat-bubble ${m.sent?'sent':'received'}">${m.text}</div>`).join('')}
    </div>
    <div class="chat-input-row">
      <input type="text" placeholder="Send a message..." id="chat-input" onkeydown="if(event.key==='Enter')sendChatMsg()" />
      <button onclick="sendChatMsg()">Send</button>
    </div>`;
}

function sendChatMsg() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const msgs = document.querySelector('.chat-messages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble sent';
  bubble.textContent = input.value;
  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
}

// ─── NOTIFICATIONS ─────────────────────────────────
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  list.innerHTML = '';
  const icons = { like:'❤️', subscribe:'⭐', comment:'💬', tip:'💰', follow:'👤', message:'✉️' };
  NOTIFICATIONS.forEach(n => {
    const item = document.createElement('div');
    item.className = 'notif-item' + (n.unread ? ' unread' : '');
    item.innerHTML = `
      <div style="position:relative;flex-shrink:0;">
        <div class="notif-avatar ${n.color}">${n.avatar}</div>
        <div class="notif-icon" style="background:var(--bg2);border:1px solid var(--border)">${icons[n.type]}</div>
      </div>
      <div class="notif-text"><strong>${n.name}</strong> ${n.text}</div>
      <div class="notif-time">${n.time}</div>`;
    list.appendChild(item);
  });
}

// ─── DASHBOARD ─────────────────────────────────────
function renderDashboard() {
  if (!currentUser || currentUser.type !== 'creator') return;
  document.getElementById('stat-earnings').textContent = '$' + fmtNum(currentUser.earnings || 2840);
  document.getElementById('stat-subscribers').textContent = fmtNum(currentUser.subscribers || 520);
  document.getElementById('stat-posts').textContent = currentUser.posts || 47;
  document.getElementById('stat-views').textContent = fmtNum(currentUser.views || 18400);

  // Tiers
  const tiersEl = document.getElementById('creator-tiers');
  tiersEl.innerHTML = '';
  const myTiers = [
    { name:'Basic', price:9.99, subs:342 },
    { name:'VIP', price:24.99, subs:178 },
  ];
  myTiers.forEach(t => {
    tiersEl.innerHTML += `<div class="tier-item"><div><div class="tier-name">${t.name}</div><div class="tier-subs">${t.subs} subscribers</div></div><div class="tier-price-tag">$${t.price.toFixed(2)}/mo</div></div>`;
  });

  // Earnings chart
  const chart = document.getElementById('earnings-chart');
  chart.innerHTML = '';
  const data = [1200,1580,980,2100,1750,2840,2200];
  const labels = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  const max = Math.max(...data);
  data.forEach((v,i) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = (v/max*100) + '%';
    bar.dataset.label = labels[i];
    bar.title = `$${v.toLocaleString()}`;
    chart.appendChild(bar);
  });

  // Creator posts grid
  renderCreatorPostsGrid('creator-posts-grid', currentUser.id || 'me-creator');
}

function renderCreatorPostsGrid(containerId, creatorId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  const mockThumbData = [
    { color:'#1a3a1a', locked:false, likes:342, comments:28 },
    { color:'#1a0a3a', locked:true, likes:189, comments:14 },
    { color:'#2a1a00', locked:false, likes:520, comments:67 },
    { color:'#00162a', locked:false, likes:891, comments:102 },
    { color:'#2a0000', locked:true, likes:678, comments:45 },
    { color:'#1a1a00', locked:false, likes:234, comments:19 },
  ];
  mockThumbData.forEach(t => {
    const thumb = document.createElement('div');
    thumb.className = 'creator-post-thumb';
    thumb.innerHTML = `
      <div style="width:100%;height:100%;background:${t.color}"></div>
      ${t.locked ? '<div class="locked-thumb">🔒</div>' : ''}
      <div class="thumb-overlay">
        <span>❤️ ${t.likes}</span>
        <span>💬 ${t.comments}</span>
      </div>`;
    grid.appendChild(thumb);
  });
}

// ─── PROFILE ───────────────────────────────────────
function renderProfile() {
  if (!currentUser) return;
  const u = currentUser;

  const bannerColors = ['linear-gradient(135deg,#002a3a,#001a3a)','linear-gradient(135deg,#1a0a4a,#2a0a3a)','linear-gradient(135deg,#0d3d1a,#1a4d0d)'];
  document.getElementById('profile-banner').style.background = bannerColors[0];

  setAvatarEl('profile-avatar-large', u);
  document.getElementById('profile-display-name').textContent = u.name;
  document.getElementById('profile-display-handle').textContent = u.handle;
  document.getElementById('profile-bio-text').textContent = u.bio;
  document.getElementById('pstat-posts').textContent = u.posts || 0;
  document.getElementById('pstat-likes').textContent = u.likes || '0';
  document.getElementById('pstat-subs').textContent = fmtNum(u.subscribers || 0);

  if (u.type === 'creator') {
    // Subscription tiers
    const tiersEl = document.getElementById('profile-tiers');
    tiersEl.innerHTML = '';
    const myTiers = [
      { name:'Basic', price:9.99, desc:'Access to all my content.', perks:['All posts','Stories','Q&A'] },
      { name:'VIP', price:24.99, desc:'Premium access + direct messages.', perks:['Everything in Basic','Direct DMs','Exclusive content','Monthly call'] },
    ];
    myTiers.forEach(t => tiersEl.appendChild(buildTierCard(t, null)));
    renderCreatorPostsGrid('profile-posts-grid', 'me-creator');
  }
}

function buildTierCard(tier, creatorId) {
  const card = document.createElement('div');
  card.className = 'tier-card';
  card.innerHTML = `
    <div class="tier-card-name">${tier.name}</div>
    <div class="tier-card-price">$${tier.price.toFixed(2)}<span>/month</span></div>
    <div class="tier-card-desc">${tier.desc}</div>
    <ul class="tier-card-perks">${tier.perks.map(p=>`<li>${p}</li>`).join('')}</ul>
    ${creatorId ? `<button class="btn-primary" onclick="selectTier('${tier.id}','${creatorId}',this)">Select</button>` : '<button class="btn-secondary" disabled>Your Tier</button>'}`;
  return card;
}

// ─── CREATOR PROFILE (view others) ─────────────────
function viewCreator(creatorId) {
  const creator = CREATORS.find(c => c.id === creatorId);
  if (!creator) return;
  viewingCreator = creator;

  document.getElementById('cp-banner').style.background = creator.banner;
  setAvatarElById('cp-avatar', creator.avatar, creator.color);
  document.getElementById('cp-name').textContent = creator.name;
  document.getElementById('cp-handle').textContent = creator.handle;
  document.getElementById('cp-bio').textContent = creator.bio;
  document.getElementById('cp-posts').textContent = creator.posts;
  document.getElementById('cp-likes').textContent = creator.likes;
  document.getElementById('cp-subs').textContent = fmtNum(creator.subscribers);

  const subscribed = userSubscriptions.includes(creatorId);
  const subBtn = document.getElementById('cp-subscribe-btn');
  subBtn.textContent = subscribed ? 'Subscribed ✓' : 'Subscribe';
  subBtn.style.background = subscribed ? 'var(--success)' : '';

  // Tiers
  const tiersEl = document.getElementById('cp-tiers');
  tiersEl.innerHTML = '';
  creator.tiers.forEach(t => tiersEl.appendChild(buildTierCard(t, creatorId)));

  // Posts
  renderCreatorPostsGrid('cp-posts-grid', creatorId);

  navigate('creator-profile');
}

function subscribeToCreator() {
  if (!viewingCreator) return;
  openSubscribeModal(viewingCreator.id);
}

function sendMessage() {
  navigate('messages');
  showToast('Opening messages...', 'success');
}

// ─── SUBSCRIBE MODAL ───────────────────────────────
function openSubscribeModal(creatorId) {
  const creator = CREATORS.find(c => c.id === creatorId);
  if (!creator) return;
  viewingCreator = creator;
  selectedSubTier = creator.tiers[0];

  document.getElementById('sub-creator-name').textContent = creator.name;

  const list = document.getElementById('sub-tiers-list');
  list.innerHTML = '';
  creator.tiers.forEach((t, i) => {
    const opt = document.createElement('div');
    opt.className = 'sub-tier-option' + (i === 0 ? ' selected' : '');
    opt.innerHTML = `
      <input type="radio" name="sub-tier" value="${t.id}" ${i===0?'checked':''} onchange="selectSubTier('${t.id}','${creatorId}')"/>
      <div class="sub-tier-info">
        <div class="sub-tier-name">${t.name}</div>
        <div class="sub-tier-desc">${t.desc}</div>
      </div>
      <div class="sub-tier-price">$${t.price.toFixed(2)}/mo</div>`;
    opt.addEventListener('click', () => {
      document.querySelectorAll('.sub-tier-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      selectedSubTier = t;
    });
    list.appendChild(opt);
  });

  document.getElementById('subscribe-modal').classList.add('open');
}

function selectSubTier(tierId, creatorId) {
  const creator = CREATORS.find(c => c.id === creatorId);
  selectedSubTier = creator?.tiers.find(t => t.id === tierId);
}

function selectTier(tierId, creatorId, btn) {
  const creator = CREATORS.find(c => c.id === creatorId);
  const tier = creator?.tiers.find(t => t.id === tierId);
  if (!tier) return;
  selectedSubTier = tier;
  viewingCreator = creator;
  openSubscribeModal(creatorId);
}

function confirmSubscription() {
  if (!viewingCreator) return;
  const cid = viewingCreator.id;
  if (!userSubscriptions.includes(cid)) userSubscriptions.push(cid);
  closeModal('subscribe-modal');
  renderSubscriptions();
  renderExplore();
  const subBtn = document.getElementById('cp-subscribe-btn');
  if (subBtn) { subBtn.textContent = 'Subscribed ✓'; subBtn.style.background = 'var(--success)'; }
  showToast(`Subscribed to ${viewingCreator.name}! 🎉`, 'success');
}

// ─── UPLOAD MODAL ──────────────────────────────────
function openUploadModal() { document.getElementById('upload-modal').classList.add('open'); }

function triggerFileInput() { document.getElementById('file-input').click(); }

function handleFileUpload(event) {
  const preview = document.getElementById('upload-preview');
  preview.innerHTML = '';
  Array.from(event.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const thumb = document.createElement('div');
      thumb.className = 'preview-thumb';
      if (file.type.startsWith('image/')) {
        thumb.innerHTML = `<img src="${e.target.result}" alt="preview"/>`;
      } else {
        thumb.innerHTML = `<div style="width:100%;height:100%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:24px;">🎬</div>`;
      }
      preview.appendChild(thumb);
    };
    reader.readAsDataURL(file);
  });
}

function publishPost() {
  const caption = document.getElementById('post-caption').value;
  if (!caption.trim()) { showToast('Please add a caption', 'error'); return; }
  closeModal('upload-modal');
  document.getElementById('post-caption').value = '';
  document.getElementById('upload-preview').innerHTML = '';
  document.getElementById('file-input').value = '';
  showToast('Post published successfully! 🚀', 'success');
  if (currentUser) currentUser.posts = (currentUser.posts || 0) + 1;
  renderDashboard();
}

// ─── TIER MODAL ────────────────────────────────────
function openTierModal() { document.getElementById('tier-modal').classList.add('open'); }

function addPerk(btn) {
  const container = document.getElementById('perks-input');
  const row = document.createElement('div');
  row.className = 'perk-row';
  row.innerHTML = `<input type="text" placeholder="Add a perk..."/><button onclick="this.parentElement.remove()">−</button>`;
  container.insertBefore(row, btn.parentElement.nextSibling);
}

function saveTier() {
  const name = document.getElementById('tier-name').value;
  const price = document.getElementById('tier-price').value;
  if (!name || !price) { showToast('Please fill in tier name and price', 'error'); return; }
  closeModal('tier-modal');
  showToast(`Tier "${name}" created for $${parseFloat(price).toFixed(2)}/mo`, 'success');
  document.getElementById('tier-name').value = '';
  document.getElementById('tier-price').value = '';
  document.getElementById('tier-desc').value = '';
}

// ─── SUGGESTED / TRENDING ──────────────────────────
function renderSuggested() {
  const list = document.getElementById('suggested-creators');
  list.innerHTML = '';
  CREATORS.slice(0,4).forEach(c => {
    const item = document.createElement('div');
    item.className = 'suggested-item';
    const isFollowing_ = following.has(c.id);
    item.innerHTML = `
      <div class="sug-avatar ${c.color}" onclick="viewCreator('${c.id}')" style="cursor:pointer">${c.avatar}</div>
      <div class="sug-info" onclick="viewCreator('${c.id}')" style="cursor:pointer">
        <div class="sug-name">${c.name}</div>
        <div class="sug-handle">${c.handle}</div>
      </div>
      <button class="sug-follow${isFollowing_?' following':''}" onclick="toggleFollow('${c.id}',this)">${isFollowing_?'Following':'Follow'}</button>`;
    list.appendChild(item);
  });
}

function toggleFollow(cid, btn) {
  if (following.has(cid)) { following.delete(cid); btn.textContent = 'Follow'; btn.classList.remove('following'); }
  else { following.add(cid); btn.textContent = 'Following'; btn.classList.add('following'); showToast('Following!', 'success'); }
}

function renderTrendingTags() {
  const el = document.getElementById('trending-tags');
  el.innerHTML = TRENDING_TAGS.map(t => `<span class="trending-tag" onclick="filterTag('${t}')">${t}</span>`).join('');
}

function filterTag(tag) {
  navigate('explore');
  document.getElementById('explore-search').value = tag;
  filterCreators();
}

// ─── EDIT PROFILE ──────────────────────────────────
function openEditProfile() { showToast('Profile editor coming soon!', 'success'); }
function editBanner() { showToast('Banner editor coming soon!', 'success'); }
function editAvatar() { showToast('Avatar editor coming soon!', 'success'); }

// ─── MODAL HELPERS ─────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── AVATAR HELPERS ────────────────────────────────
function setAvatarEl(elId, user) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = (el.className.replace(/color-\d/g,'').trim() + ' ' + (user.color || 'color-4')).trim();
  if (!el.className.includes('user-avatar') && !el.className.includes('post-avatar') && !el.className.includes('profile-avatar')) el.classList.add('user-avatar');
  el.textContent = user.avatar || '?';
}

function setAvatarElById(elId, initials, colorClass) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = el.className.replace(/color-\d/g,'').trim() + ' ' + colorClass;
  el.textContent = initials;
}

// ─── UTILS ─────────────────────────────────────────
function fmtNum(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return n.toString();
}

let toastTimer;
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── EVENT LISTENERS ───────────────────────────────
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-form').classList.add('active');
  });
});

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.querySelectorAll('.feed-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.feed-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.querySelectorAll('.content-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.content-tabs');
    parent.querySelectorAll('.content-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
