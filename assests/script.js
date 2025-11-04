async function loadPaper(){
  const res = await fetch('data/paper.json', {cache:'no-store'});
  if(!res.ok){ throw new Error('paper.json load error'); }
  return await res.json();
}

function el(sel){ return document.querySelector(sel); }

function setText(sel, text){
  const node = el(sel);
  if(node) node.textContent = text ?? '';
}

function setHTML(sel, html){
  const node = el(sel);
  if(node) node.innerHTML = html ?? '';
}

function setupMedia({ image_url, video_mp4_url }) {
  const imgPanel = el('#imagePanel');
  const vidPanel = el('#videoPanel');
  const imgWrap  = el('#imageWrap');
  const vidWrap  = el('#videoWrap');

  if (image_url) {
    imgWrap.innerHTML = `<img src="${image_url}" alt="teaser">`;
    if (imgPanel) imgPanel.style.display = 'block';
  } else {
    if (imgPanel) imgPanel.style.display = 'none';
    imgWrap.innerHTML = '';
  }

  if (video_mp4_url) {
    vidWrap.innerHTML =
      `<video controls preload="metadata" style="width:100%;height:auto;display:block;background:#000;border-radius:12px;">
         <source src="${video_mp4_url}" type="video/mp4">
         MP4을 재생할 수 없습니다.
       </video>`;
    if (vidPanel) vidPanel.style.display = 'block';
  } else {
    if (vidPanel) vidPanel.style.display = 'none';
    vidWrap.innerHTML = '';
  }
}

function setupLinks({ ieee_url, demo_url, github_url, DVL_url }) {
  const aIeee = el('#btnIeee');
  const aDemo = el('#btnDemo');
  const aGit  = el('#btnGit');
  const aDVL  = el('#btnDVL');

  if (aIeee) {
    if (ieee_url) { aIeee.href = ieee_url; aIeee.style.display = 'inline-flex'; }
    else aIeee.style.display = 'none';
  }

  if (aDemo) {
    if (demo_url) { aDemo.href = demo_url; aDemo.style.display = 'inline-flex'; }
    else aDemo.style.display = 'none';
  }

  if (aGit) {
    if (github_url) { aGit.href = github_url; aGit.style.display = 'inline-flex'; }
    else aGit.style.display = 'none';
  }

  if (aDVL) {
    if (DVL_url) { aDVL.href = DVL_url; aDVL.style.display = 'inline-flex'; }
    else aDVL.style.display = 'none';
  }
}

function fillMeta({ ieee_url, demo_url, github_url, DVL_url, video_mp4_url }) {
  setHTML('#metaIeee', ieee_url ? `<a class="btn" href="${ieee_url}" target="_blank" rel="noopener">열기</a>` : '-');
  setHTML('#metaDemo', demo_url ? `<a class="btn" href="${demo_url}" target="_blank" rel="noopener">열기</a>` : '-');
  setHTML('#metaGit',  github_url ? `<a class="btn" href="${github_url}" target="_blank" rel="noopener">열기</a>` : '-');
  setHTML('#metaDVL',  DVL_url ? `<a class="btn" href="${DVL_url}" target="_blank" rel="noopener">열기</a>` : '-');
  setHTML('#metaMp4',  video_mp4_url ? `<code>${video_mp4_url}</code>` : '-');
}

async function main() {
  try {
    const paper = await loadPaper();

    document.title = paper.title_main || 'Paper Page';
    setText('#titleMain', paper.title_main || '');
    setText('#titleSub',  paper.title_sub  || '');

    setText('#desc', paper.description || '');

    setupMedia(paper);
    setupLinks(paper);
    fillMeta(paper);
  } catch (err) {
    console.error(err);
    setText('#titleMain', 'paper.json load error');
    setText('#titleSub',  '');
    setText('#desc', String(err));

    const imgPanel = el('#imagePanel');
    const vidPanel = el('#videoPanel');
    if (imgPanel) imgPanel.style.display = 'none';
    if (vidPanel) vidPanel.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', main);
