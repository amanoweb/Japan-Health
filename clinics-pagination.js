(()=>{
  const grid=document.getElementById("providerGrid"),pager=document.getElementById("pagination");
  if(!grid||!pager)return;
  const prev=document.getElementById("pagePrev"),next=document.getElementById("pageNext"),status=document.getElementById("pageStatus");
  const PAGE_SIZE=12;let page=1;
  function apply(){
    const cards=[...grid.children];
    if(!cards.length){if(status)status.textContent="";return}
    const total=Math.max(1,Math.ceil(cards.length/PAGE_SIZE));
    if(page>total)page=total;
    cards.forEach((card,i)=>{card.style.display=(i>=(page-1)*PAGE_SIZE&&i<page*PAGE_SIZE)?"":"none"});
    if(status)status.textContent=`Page ${page} of ${total}`;
    if(prev)prev.disabled=page<=1;if(next)next.disabled=page>=total;
  }
  if(prev)prev.onclick=()=>{if(page>1){page--;apply();grid.scrollIntoView({behavior:"smooth",block:"start"})}};
  if(next)next.onclick=()=>{const total=Math.ceil(grid.children.length/PAGE_SIZE);if(page<total){page++;apply();grid.scrollIntoView({behavior:"smooth",block:"start"})}};
  const observer=new MutationObserver(()=>{page=1;requestAnimationFrame(apply)});
  observer.observe(grid,{childList:true});
  ["q","audience","city","language","coord","referral","sort","verifiedOnly"].forEach(id=>document.getElementById(id)?.addEventListener("input",()=>{page=1;requestAnimationFrame(apply)}));
  requestAnimationFrame(apply);
})();
