/* Fixed-size pages keep task browsing compact while preserving catalog order. */
window.TaskPagination=(()=>{
 const size=8;
 function select(tasks,requestedPage=1){
  const pages=Math.max(1,Math.ceil(tasks.length/size));
  const requested=Number(requestedPage);
  const page=Math.min(pages,Math.max(1,Number.isSafeInteger(requested)?requested:1));
  const offset=(page-1)*size;
  return {page,pages,total:tasks.length,start:tasks.length?offset+1:0,end:Math.min(offset+size,tasks.length),items:tasks.slice(offset,offset+size)};
 }
 return {size,select};
})();
