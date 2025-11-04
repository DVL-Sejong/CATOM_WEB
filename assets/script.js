'use strict';

// 도배 캐시 방지 로그로 현재 버전 확인
console.log('script.js v1001 loaded');

async function loadPaper() {
  // GitHub Pages 캐시 회피용 버전 파라미터
  const res = await fetch('data/paper.json?v=2', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load data/paper.json');
  return res.json();
}

const el = (s) => document.querySelector(s);
const show = (node, visible) => node && node.classList.toggle('d-none', !visible);
const setText = (s, t) => { const n = el(s); if (n) n.textContent = t ?? ''; };
const setHTML = (s, h) => { const n = el(s); if (n) n.innerHTML = h ?? ''; };

function setupMedia(paper) {
  const { image_url, video_mp4_url } = paper;
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

function setupLinks(paper) {
  const { ieee_url, demo_url, github_url, DVL_url } = paper;
  const map = [
    { sel: '#btnIeee', url: ieee_url },
    { sel: '#btnDemo', url: demo_url },
    { sel: '#btnGit',  url: github_url },
    { sel: '#btnDVL',  url: DVL_url },
  ];
  map.forEach(({ sel, url }) => {
    const a = el(sel);
    if (!a) return;
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; show(a, true); }
    else { a.removeAttribute('href'); show(a, false); }
  });
}

function fillMeta(paper) {
  const { ieee_url, demo_url, github_url, DVL_url, video_mp4_url } = paper;
  if (ieee_url) { setHTML('#metaIeee', `<a class="btn btn-sm btn-outline-dark" href="${ieee_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowIeee'), true); }
  if (demo_url) { setHTML('#metaDemo', `<a class="btn btn-sm btn-outline-dark" href="${demo_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowDemo'), true); }
  if (github_url) { setHTML('#metaGit', `<a class="btn btn-sm btn-outline-dark" href="${github_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowGit'), true); }
  if (DVL_url) { setHTML('#metaDVL', `<a class="btn btn-sm btn-outline-dark" href="${DVL_url}" target="_blank" rel="noopener">Open</a>`); show(el('#rowDVL'), true); }
  if (video_mp4_url) { setHTML('#metaMp4', `<code>${video_mp4_url}</code>`); show(el('#rowMp4'), true); }
}

async function main() {
  try {
    const paper = await loadPaper();

    document.title = paper.title_main || 'Paper Page';
    setText('#titleMain', paper.title_main || '');
    setText('#titleSub',  paper.title_sub  || '');
    setText('#desc',      paper.description || '');

    setupMedia(paper);
    setupLinks(paper);
    fillMeta(paper);
  } catch (err) {
    console.error(err);
    setText('#titleMain', 'Failed to load paper.json');
    setText('#titleSub',  '');
    setText('#desc', String(err));
    show(el('#imagePanel'), false);
    show(el('#videoPanel'), false);
    ['#btnIeee','#btnDemo','#btnGit','#btnDVL'].forEach(s => show(el(s), false));
    ['#rowIeee','#rowDemo','#rowGit','#rowDVL','#rowMp4'].forEach(s => show(el(s), false));
  }
}

document.addEventListener('DOMContentLoaded', main);
