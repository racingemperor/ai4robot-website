/* Qualitative task requirements, separate from measured model results. */
window.Insights = (() => {
 const dimensions=[
  {id:'grounding',name:'Perception & grounding',short:'Grounding',lines:['Perception','& grounding'],description:'Connect observations, symbols and instructions to the right objects and actions.'},
  {id:'spatial',name:'Spatial reasoning',short:'Spatial reasoning',lines:['Spatial','reasoning'],description:'Reason about geometry, relative poses, routes and changing free space.'},
  {id:'contact',name:'Contact & dexterity',short:'Contact',lines:['Contact','& dexterity'],description:'Manage grasps, contact transitions and precise physical interactions.'},
  {id:'control',name:'Motion & coordination',short:'Motion & control',lines:['Motion','& coordination'],description:'Coordinate joints, effectors and movement while maintaining stability.'},
  {id:'planning',name:'Planning & feedback',short:'Planning',lines:['Planning','& feedback'],description:'Sequence actions, respect constraints and revise behavior using feedback.'},
  {id:'learning',name:'Learning & adaptation',short:'Learning',lines:['Learning','& adaptation'],description:'Infer a new rule or develop policies that transfer to evaluation conditions.'},
  {id:'construction',name:'World modeling',short:'World modeling',lines:['World','modeling'],description:'Construct or reconstruct executable geometry, motion and physical interactions.'}
 ];
 const levels=[
  {name:'Not a focus',description:'No dedicated requirement in the current task definition.'},
  {name:'Supporting',description:'Helps execution, but is not a defining test requirement.'},
  {name:'Important',description:'Explicitly supports a substantial part of the task.'},
  {name:'Central',description:'A defining requirement for successful completion.'}
 ];
 // Order: grounding, spatial, contact, control, planning, learning, construction.
 // Editorial judgments based on TASKS goals, capability descriptions and checks.
 // These are ordinal demands, not tag counts, measured difficulty or model scores.
 const demands={
  T01:{values:[1,3,3,3,2,0,0],reasons:[
   'Identify the interlocked parts and their matching placement regions.',
   'Find a separation path through the constraints imposed by both parts.',
   'Maintain grasps and avoid penetration while separating rigid parts.',
   'Coordinate both grippers throughout separation and stable placement.',
   'Sequence separation, transport and release while preserving valid contact.'
  ]},
  T02:{values:[1,3,3,3,2,0,0],reasons:[
   'Identify the specified socket and plug in the observation.',
   'Align plug orientation and approach direction with the socket.',
   'Distinguish surface contact from a stable, completed insertion.',
   'Make precise corrections as the pins enter the socket.',
   'Use insertion feedback and confirm the plug stays seated after release.'
  ]},
  T03:{values:[3,2,2,3,3,0,0],reasons:[
   'Translate each target character into the corresponding physical key.',
   'Locate keys and approach them in the keyboard frame.',
   'Press and release keys through physical contact events.',
   'Execute precise, ordered key presses and releases.',
   'Read the input buffer, correct mistakes and submit the completed string.'
  ]},
  T04:{values:[1,3,2,3,3,0,0],reasons:[
   'Relate the section instruction to the cucumber and knife.',
   'Choose cut positions that match the requested section boundaries.',
   'Maintain support and tool contact under the stated segmentation approximation.',
   'Coordinate the holding arm with the cutting arm.',
   'Assign arm roles and sequence stabilization and cuts.'
  ]},
  T05:{values:[3,3,3,3,3,0,0],reasons:[
   'Translate a supplied line drawing into physical brush paths.',
   'Map reference geometry into the target canvas frame.',
   'Maintain drawing contact while limiting unwanted marks.',
   'Control brush paths and lifts precisely.',
   'Order strokes and lift between disconnected marks.'
  ]},
  T06:{values:[3,2,3,2,3,0,0],reasons:[
   'Ground “the longest” by comparing visible baguette candidates.',
   'Reason about object extent and the basket placement region.',
   'Grasp, transport and release the selected baguette into the basket.',
   'Control transport and release without disturbing neighboring objects.',
   'Preserve the 5 cm disturbance constraint throughout the action.'
  ]},
  T07:{values:[1,3,3,3,2,0,0],reasons:[
   'Identify the specified cube layer and rotation instruction.',
   'Rotate the selected layer relative to the cube body.',
   'Redistribute fingertip contacts while retaining the cube.',
   'Coordinate fingers through the face rotation.',
   'Sequence regrasping and rotation without losing support.'
  ]},
  T08:{values:[3,2,3,3,2,0,0],reasons:[
   'Locate the small stem instead of grasping the fruit body.',
   'Align fingertips with the stem and avoid the fruit.',
   'Use delicate stem-only contact without breaking the stem.',
   'Lift and hold steadily with precise finger control.',
   'Check clearance, stem integrity and the unsupported hold.'
  ]},
  T09:{values:[1,2,2,3,2,0,0],reasons:[
   'Locate the ball and its target region.',
   'Relate the reachable ball, body and placement region.',
   'Retain the ball through pickup and transport.',
   'Coordinate reaching and placement with a stable body posture.',
   'Sequence pickup, placement and stable recovery.'
  ]},
  T10:{values:[2,3,2,3,3,0,0],reasons:[
   'Connect waypoint instructions and the requested can to scene observations.',
   'Navigate between waypoints and finish at the required pose.',
   'Grasp and retain the can during shelf retrieval.',
   'Connect locomotion and manipulation with final pose control.',
   'Track waypoint order, retrieval and the final orientation requirement.'
  ]},
  T11:{values:[3,2,3,3,3,0,0],reasons:[
   'Convert the requested short program into physical writing strokes.',
   'Place strokes in the whiteboard frame.',
   'Create marks using pen contact and controlled lifts.',
   'Coordinate arm and torso while maintaining a standing pose.',
   'Order strokes, withdraw the pen and satisfy the final posture requirement.'
  ]},
  T12:{values:[3,3,2,2,2,3,0],reasons:[
   'Infer the demonstrated object-selection rule from example observations.',
   'Transfer the selection rule to unfamiliar object positions.',
   'Grasp and place the chosen object while preserving other objects.',
   'Coordinate the mobile base and manipulator for execution.',
   'Sequence rule application, reaching and constrained placement.',
   'Learn a rule in context and apply it to a new layout.'
  ]},
  T13:{values:[3,3,2,0,2,0,3],reasons:[
   'Translate text constraints into objects, dimensions and relationships.',
   'Configure scene scale, geometry and articulated structures.',
   'Validate support regions and requested physical interactions.',
   null,
   'Organize scene construction and run the required physical checks.',
   null,
   'Produce a loadable, executable scene with functioning joints.'
  ]},
  T14:{values:[3,3,2,0,1,0,3],reasons:[
   'Combine multi-view observations into a consistent scene interpretation.',
   'Preserve dimensions, clearances and navigable space.',
   'Make cabinet and drawer interactions physically usable.',
   null,
   'Organize reconstruction and validate geometry, routes and joints.',
   null,
   'Reconstruct an interactive kitchen with articulated structures.'
  ]},
  T15:{values:[3,3,3,2,2,0,3],reasons:[
   'Interpret calibrated multi-view hand–object video.',
   'Recover coherent hand and object poses across views.',
   'Reconstruct contact transitions without penetration.',
   'Represent coordinated hand and object motion for replay.',
   'Align grasp, release and object movement in time.',
   null,
   'Deliver reconstructed motion and contacts for physically constrained replay.'
  ]},
  T16:{values:[0,1,1,2,2,3,0],reasons:[
   null,
   'Account for terrain traversal in the locomotion objectives.',
   'Support stable ground contact in learned locomotion.',
   'Develop behavior for velocity tracking, turning and stable traversal.',
   'Iterate on training code and evaluate within the fixed resource budget.',
   'Design rewards and train policies for held-out generalization.'
  ]},
  T17:{values:[0,2,3,2,2,3,0],reasons:[
   null,
   'Represent the required pen rotation and its axis.',
   'Learn dexterous retention through the required rotation.',
   'Train coordinated finger behavior that rotates the pen.',
   'Design curriculum and check outcomes under fixed evaluation conditions.',
   'Develop rewards and train a policy within the declared budget.'
  ]},
  T18:{values:[2,2,2,2,3,3,0],reasons:[
   'Interpret observations from an unfamiliar robot.',
   'Relate the new control interface to object and target geometry.',
   'Establish a valid grasp through the supplied interface.',
   'Connect unfamiliar commands to observed movement.',
   'Use limited exploration before completing the requested task.',
   'Adapt to the new embodiment from documentation and interaction feedback.'
  ]},
  T19:{values:[3,2,2,3,3,0,0],reasons:[
   'Estimate the observed liquid surface relative to the target line.',
   'Relate pitcher orientation to the cup and final placement.',
   'Maintain the pitcher grasp through pouring and return.',
   'Adjust dynamic pouring and stop for the settled target level.',
   'Use feedback to limit spillage and return the pitcher after filling.'
  ]},
  T20:{values:[1,3,3,3,3,0,0],reasons:[
   'Identify lace ends and the required knot structure.',
   'Reason about threading topology and changing lace geometry.',
   'Control deformable lace ends through threading and tightening.',
   'Coordinate both arms while forming and releasing the knot.',
   'Choose a threading sequence that leaves a stable released knot.'
  ]},
  T21:{values:[3,3,0,1,3,0,0],reasons:[
   'Recognize all five requested objects from available observations.',
   'Explore an unfamiliar scene without privileged target coordinates.',
   null,
   'Execute discrete navigation using a frozen locomotion controller.',
   'Plan exploration, record five valid reports and issue STOP.'
  ]},
  T22:{values:[3,3,0,1,3,0,0],reasons:[
   'Ground semantic room descriptions in the observed scene.',
   'Plan a route through the required intermediate room.',
   null,
   'Execute navigation commands to reach the accepted goal region.',
   'Honor the intermediate visit and recognize when to stop.'
  ]},
  T23:{values:[2,1,0,2,3,1,0],reasons:[
   'Record observations and outcomes relevant to the collection objective.',
   'Retain the task geometry in the collected observations.',
   null,
   'Execute and record robot actions on the trajectory clock.',
   'Organize collection and check record completeness.',
   'Prepare interaction records for downstream policy training.'
  ]}
 };
 function profile(task){
  const row=demands[task.id];
  return dimensions.map((dimension,i)=>({
   ...dimension,value:row.values[i],level:levels[row.values[i]].name,
   reason:row.reasons[i]||levels[0].description
  }));
 }
 function waveform(dimensionId){
  return TASKS.map(task=>({task,...profile(task).find(d=>d.id===dimensionId)}));
 }
 function topModels(report,limit=5){
  const ids=TASKS.map(t=>t.id);
  const models=Results.summarize(report,ids).filter(m=>m.complete&&m.score!==null)
   .sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,limit);
  return models.map(model=>({...model,categories:CATEGORIES.map(category=>{
   const row=Results.summarize(report,TASKS.filter(t=>t.category===category.id).map(t=>t.id)).find(m=>m.id===model.id);
   return {id:category.id,value:row?.complete?row.score:null};
  })}));
 }
 return {dimensions,levels,profile,waveform,topModels};
})();
