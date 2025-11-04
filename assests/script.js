async function loadPaper() {
  // 캐시 잔존 방지: paper.json에도 버전 쿼리 부여 가능
  const res = await fetch('data/paper.json?v=1', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load data/paper.json');
  return res.json();
}

const el = (s) => document.querySelector(s);
const show = (node, visible) => node && node.classList.toggle('d-none', !visible);
const setText = (s, t) => { const n = el(s); if (n) n.textContent = t ?? ''; };
const setHTML = (s, h) => { const n = el(s); if (n) n.innerHTML = h ?? ''; };

function setupMedia({ image_url, video_mp4_url }) {
  const imagePanel = el('#imagePanel');
  const videoPanel = el('#videoPanel');

  if (image_url) {
    setHTML('#imageWrap', `<img class="img-fluid" src="${image_url}" alt="teaser">`);
    show(imagePanel, true);
  } else {
    setHTML('#imageWrap', '');
    show(imagePanel, false);
  }

  if (video_mp4_url) {
    setHTML('#videoWrap', `
      <video class="w-100" controls preload="metadata" style="background:#000;">
        <source src="${video_mp4_url}" type="video/mp4">
        Your browser cannot play MP4 video.
      </video>`);
    show(videoPanel, true);
  } else {
    setHTML('#videoWrap', '');
    show(videoPanel, false);
  }
}

function setupLinks({ ieee_url, demo_url, github_url, DVL_url }) {
  // 버튼: 기본 숨김, 값이 있는 경우에만 href 설정 후 표시
  const map = [
    { btn: '#btnIeee', url: ieee_url },
    { btn: '#btnDemo', url: demo_url },
    { btn: '#btnGit',  url: github_url },
    { btn: '#btnDVL',  url: DVL_url },
  ];
  map.forEach(({ btn, url }) => {
    const a = el(btn);
    if (!a) return;
    if (url) {
      a.href = url;
      a.setAttribute('rel', 'noopener');
      a.setAttribute('target', '_blank');
      show(a, true);
    } else {
      a.removeAttribute('href');
      show(a, false);
    }
  });

  // Meta: 값 있는 행만 표시
  if (ieee_url) { setHTML('#metaIeee', `<a class="btn btn-sm btn-outline-dark" href="${ieee_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowIeee'), true); }
  if (demo_url) { setHTML('#metaDemo', `<a class="btn btn-sm btn-outline-dark" href="${demo_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowDemo'), true); }
  if (github_url) { setHTML('#metaGit', `<a class="btn btn-sm btn-outline-dark" href="${github_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowGit'), true); }
  if (DVL_url) { setHTML('#metaDVL', `<a class="btn btn-sm btn-outline-dark" href="${DVL_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowDVL'), true); }
  if (video_mp4_url) { setHTML('#metaMp4', `<code>${video_mp4_url}</code>`); show(el('#rowMp4'), true); }
}

async function main() {
  try {
    const paper = await loadPaper();

    // 제목/요약
    document.title = paper.title_main || 'Paper Page';
    setText('#titleMain', paper.title_main || '');
    setText('#titleSub',  paper.title_sub  || '');
    setText('#desc',      paper.description || '');

    // 미디어/링크/메타
    setupMedia(paper);
    setupLinks(paper);
  } catch (err) {
    console.error(err);
    // 오류 시 화면에 드러나지 않도록 모두 숨김
    show(el('#imagePanel'), false);
    show(el('#videoPanel'), false);
    ['#btnIeee','#btnDemo','#btnGit','#btnDVL']
      .forEach(s => show(el(s), false));
    ['#rowIeee','#rowDemo','#rowGit','#rowDVL','#rowMp4']
      .forEach(s => show(el(s), false));
    setText('#titleMain', 'Failed to load paper.json');
    setText('#titleSub',  '');
    setText('#desc', String(err));
  }
}

document.addEventListener('DOMContentLoaded', main);
