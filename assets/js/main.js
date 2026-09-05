// 主交互：导航 / 进度条 / 回顶 / 首页搜索
(function () {
  // 移动端导航
  var toggle = document.getElementById('navToggle');
  var list = document.getElementById('navList');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    list.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        list.classList.remove('open');
        toggle.classList.remove('active');
      }
    });
  }

  // 阅读进度条 + 回顶
  var bar = document.getElementById('progressBar');
  var backTop = document.getElementById('backTop');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';
    if (backTop) backTop.classList.toggle('show', h.scrollTop > 600);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 首页搜索（读取 search.json）
  var input = document.getElementById('homeSearch');
  var results = document.getElementById('searchResults');
  if (!input || !results) return;

  var index = null;
  var base = document.querySelector('link[rel="stylesheet"]');
  var baseurl = '';
  if (base) {
    var m = base.getAttribute('href').match(/^(.*)\/assets\/css\/main\.css/);
    if (m) baseurl = m[1];
  }
  fetch(baseurl + '/search.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { index = data; })
    .catch(function () { index = []; });

  function render(q) {
    if (!q || q.trim().length < 1) {
      results.hidden = true;
      results.innerHTML = '';
      return;
    }
    q = q.trim().toLowerCase();
    var hits = (index || []).filter(function (d) {
      return (d.title + ' ' + d.category + ' ' + d.excerpt).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    if (!hits.length) {
      results.innerHTML = '<li class="no-hit">没有找到相关内容，换个关键词试试（如：失眠 / 称重 / 隔天）</li>';
    } else {
      results.innerHTML = hits.map(function (d) {
        return '<li><a href="' + d.url + '"><strong>' + d.title + '</strong><span>' + d.category + ' · ' + d.excerpt.slice(0, 60) + '…</span></a></li>';
      }).join('');
    }
    results.hidden = false;
  }

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { render(input.value); }, 180);
  });
  input.addEventListener('focus', function () { render(input.value); });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-wrap')) {
      results.hidden = true;
    }
  });
})();
