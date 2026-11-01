/* Scores transcribed from the supplied manuscript figures/results.png, panels (a)-(x).
 * Column order follows its model legend. Overall is reported independently of task means.
 * Trial count follows sections/experiment.tex; outcomes and timings are not supplied. */
window.MANUSCRIPT_RESULTS=(()=>{
 const identities=[["gpt6-astra", "GPT-6-Astra", "Codex"], ["opus5-5", "Claude Opus 5.5", "Claude Code"], ["gemini-4", "Gemini 4", "Argon"], ["grok-4-7", "Grok 4.7", "Grok Build"], ["deepseek-v4-1-flash", "DeepSeek V4.1 Flash", "DSH"], ["glm-5-3-flash", "GLM-5.3-Flash", "ZCode"], ["kimi-k3-1-pro", "Kimi K3.1 Pro", "Kimi Code"], ["minimax-m3-1-flash", "MiniMax-M3.1-Flash", "MiniMax Code"]];
 const scores=[
  [78, 78, 77, 62, 66, 59, 45, 47], // T01
  [66, 72, 66, 41, 55, 38, 25, 39], // T02
  [73, 66, 62, 45, 60, 52, 40, 51], // T03
  [58, 43, 30, 24, 30, 26, 18, 19], // T04
  [75, 79, 72, 70, 76, 66, 54, 39], // T05
  [60, 65, 51, 42, 44, 40, 36, 18], // T06
  [43, 66, 41, 43, 41, 37, 41, 30], // T07
  [80, 90, 73, 64, 62, 61, 45, 63], // T08
  [73, 67, 60, 58, 57, 42, 36, 40], // T09
  [56, 49, 47, 37, 25, 41, 24, 28], // T10
  [61, 30, 38, 26, 34, 25, 22, 20], // T11
  [79, 56, 58, 69, 49, 25, 37, 42], // T12
  [60, 61, 47, 32, 31, 44, 32, 21], // T13
  [81, 66, 60, 77, 43, 59, 48, 34], // T14
  [63, 64, 41, 31, 37, 26, 27, 31], // T15
  [66, 61, 42, 55, 48, 44, 32, 29], // T16
  [57, 51, 39, 51, 22, 36, 43, 33], // T17
  [78, 73, 67, 57, 54, 64, 48, 37], // T18
  [53, 26, 35, 26, 37, 29, 29, 40], // T19
  [83, 65, 59, 70, 66, 60, 43, 48], // T20
  [82, 80, 58, 50, 56, 40, 51, 45], // T21
  [69, 56, 47, 44, 36, 37, 43, 27], // T22
  [57, 39, 49, 22, 53, 33, 48, 25] // T23
 ];
 const overall=[67.0, 56.6, 50.6, 47.1, 44.2, 37.7, 39.1, 33.0];
 const models=identities.map(([id,name,agent])=>({id,name,version:name,agent}));
 return {schema_version:1,benchmark_version:'ege-2026-11-01',protocol:'EGE / Isaac Sim 5.1 + Isaac Lab / 3 trials per model-task',environment:'simulation',models,
  results:scores.flatMap((row,index)=>row.map((score,model)=>({model_id:models[model].id,task_id:'T'+String(index+1).padStart(2,'0'),trials:3,score_sum:score/100*3}))),
  overall_scores:Object.fromEntries(models.map((model,index)=>[model.id,overall[index]/100]))
 };
})();
