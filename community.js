/* Add the project's real group QR images here when supplied. */
window.Community=(()=>{
 const channels=[{id:'wechat',name:'WeChat',image:''},{id:'qq',name:'QQ',image:''}];
 function render(){return `<section class="community-channels" aria-label="Community contact channels">${channels.map(channel=>`<article aria-labelledby="community-${channel.id}"><h2 id="community-${channel.id}">${channel.name}</h2><figure class="community-card">${channel.image?`<a class="community-invitation" href="${esc(channel.image)}" target="_blank" rel="noopener" aria-label="Open the full-size ${channel.name} group QR code"><img src="${esc(channel.image)}" alt="Embodied Generalist Exam ${channel.name} group QR code" width="280" height="280" decoding="async"></a>`:`<div class="community-code-slot" role="img" aria-label="${channel.name} group QR code area"><span aria-hidden="true">+</span><span>Group QR code</span></div>`}<figcaption>Embodied Generalist Exam<br>${channel.name} discussion group</figcaption></figure></article>`).join('')}</section><div class="community-github"><a class="text-link" href="${RESEARCH_REPO}/issues" target="_blank" rel="noopener">Contact us on GitHub ↗</a></div>`;}
 return {render};
})();
document.querySelector('#page-content').innerHTML=Community.render();
