/* Catalog aligned with the EGE manuscript and task figure supplied on 2026-11-01. */
window.CATEGORIES=[
 {id:'manipulation',name:'Robotic manipulation',count:13,output:'Control program',hidden:'Initial layouts and target instructions'},
 {id:'navigation',name:'Navigation',count:2,output:'Control program',hidden:'Start states, goals and scene layouts'},
 {id:'scene-generation',name:'Scene generation and interaction reconstruction',count:3,output:'Scene / motion files',hidden:'Text constraints, reference geometry and motion'},
 {id:'policy-development',name:'Policy development and training',count:2,output:'Training code + policy weights',hidden:'Evaluation script and test conditions'},
 {id:'training-data',name:'Training data collection',count:1,output:'Trajectory dataset',hidden:'Task-specific collection and validation conditions'},
 {id:'in-context-learning',name:'In-context learning',count:2,output:'Control program',hidden:'New layouts, rules and robot interfaces'}
];
window.GROUPS=[
 {id:'manipulate',name:'Objects & contact',en:'MANIPULATION',color:'#b84b32',question:'Can a goal become precise contact?'},
 {id:'dexterity',name:'Hands & dexterity',en:'DEXTERITY',color:'#716399',question:'Can reasoning reach the fingertips?'},
 {id:'body',name:'Body & control',en:'BODY & CONTROL',color:'#42685d',question:'Can an agent control or train a body?'},
 {id:'navigate',name:'Space & movement',en:'SPATIAL REASONING',color:'#456d8b',question:'Can an agent act in unfamiliar, changing spaces?'},
 {id:'construct',name:'World construction',en:'WORLD BUILDING',color:'#8b692e',question:'Can observations become an interactive world?'}
];
window.TASKS=[
 ["T01", "Bimanual spatial puzzle", "manipulate", "A", "ARX X5", "Disentangle the blue keeper and orange key with two arms, place both objects in their color-coded target regions, release them and return both arms to their initial poses.", "Keep both arms and the interlock visible through unlocking, separation and release.", "Disentanglement, color-matched placement, release and arm return must remain physically valid and stable.", "Grasp and disentangle / Color-matched placement / Release and arm return", "Five dependent scoring milestones total 100 points."],
 ["T02", "Precision plug insertion", "manipulate", "A", "ARX X5", "Pick up a three-pin plug, identify the socket with the illuminated indicator, insert and release the plug, then return both arms to their initial poses.", "Use a wide view plus a socket-side close-up; preserve alignment, insertion and release.", "The plug remains fully seated in the illuminated socket after release, arm return and the final settling interval.", "Identify illuminated socket / Align and fully insert / Release and arm return", "Five dependent milestones and a 3,600-second wall-clock limit."],
 ["T03", "Keyboard typing", "manipulate", "A", "Franka Panda", "Type the requested case-sensitive string through physical keyboard contact, submit it with Enter and return the end effector to its initial pose.", "Pair a top view of the keys with the input buffer; retain press, release, correction and submission.", "The first submitted string matches the target exactly; all keys are released and the end effector returns and settles without physical failure.", "Target string / Physical key presses / Submitted buffer", "Only the first submitted string is scored."],
 ["T04", "Bimanual cucumber slicing", "manipulate", "A", "ARX X5", "Use one arm to stabilize a cucumber and the other to make two valid cuts, producing three pieces at least 20 mm long; return the knife to its holder.", "Show both arms continuously, with a side view of the knife at segment boundaries.", "Three separated pieces remain on the board after release and knife return; blade contact with robot grippers invalidates completion.", "Stabilize the cucumber / Execute two cuts / Return knife and release", "Three pieces are required; equal lengths are not required."],
 ["T05", "Reference-guided painting", "manipulate", "A", "Franka Panda", "Reproduce a landscape reference image on paper through physical pen motion, choosing stroke paths, colors and widths to preserve its objects, composition and colors.", "Pair the reference drawing with an overhead canvas view and a side view of pen contact.", "The drawing is nonblank, scores at least 80 out of 100 and has no recorded task failure.", "Inspect the reference / Draw with color and width control / Compare the final artwork", "Color similarity 20, structural similarity 20, edge agreement 10 and visual assessment 50 points."],
 ['T06','Semantic pick-and-place','manipulate','A','ARX X5','Choose the longest baguette, put it inside the basket and leave the other objects undisturbed.','Keep all candidates and the basket in frame; show selection, grasp, transport and the settled final state.','The correct baguette is inside the basket and other objects move no more than 5 cm.','Compare the candidates / Pick the longest / Place without disturbance','Complete reference implementation with documented judge checks; public model results pending.'],
 ["T07", "Humanoid dexterous cube manipulation", "dexterity", "A", "Unitree G1 + Wuji hands", "Use two dexterous hands to pick up a scrambled Rubik’s Cube, restore all nine green stickers to the face with the green center, then return and release it on the table.", "Show both Wuji hands, multiple cube faces, green-face restoration and the final tabletop release.", "Legal face turns restore the green face, and the cube is returned to the tabletop and released in a valid aligned configuration.", "Pick up the scrambled cube / Restore the green face / Return to table and release", "Stationary G1 with Wuji hands; three seeded legal face rotations initialize each scramble."],
 ["T08", "Apple-stem grasping", "dexterity", "A", "Unitree G1 + Wuji hands", "Pinch an apple stem with the right thumb and index finger, lift the fruit at least 10 cm above the table and hold it for three seconds without fruit contact or stem breakage.", "Synchronize a stem close-up with a side view of lift and hold.", "A valid stem-only pinch supports the apple at least 10 cm above the table for three seconds; recorded failures receive zero points.", "Fingertip contact / Clear of the table / Stable stem-only hold", "Stationary G1 with Wuji hands; stem grasp, lift and hold provide partial credit."],
 ["T09", "Humanoid ball pickup and placement", "body", "A", "Unitree G1", "Approach a ball on the floor, pick it up, stand upright while holding it and place it in the color-coded tabletop region, finishing in stable standing.", "Show the full body and head camera through reaching, grasping, placement and recovery.", "The ball rests in the target region with low motion while the robot remains stably standing for at least two seconds.", "Approach and pick up / Stand and carry / Place and stabilize", "Mobile G1 uses pretrained Agile locomotion, a crouching controller and arm inverse kinematics."],
 ['T10','Humanoid waypoint execution','body','A','Unitree G1','Visit the requested waypoints in order, retrieve a can from a shelf and finish at the target pose.','Combine a continuous third-person view with a synchronized overhead route.','Waypoint order, retrieval and final orientation all satisfy the instruction.','Ordered waypoints / Shelf retrieval / Final pose','Depends on G1 locomotion integration; task specification pending implementation.'],
 ["T11", "Humanoid code writing", "body", "A", "Unitree G1", "Move the right arm of a stationary humanoid to write a specified three-line program on a whiteboard, lift the pen and return the arm to its initial configuration.", "Record the full body, board front and pen side; preserve contact, pen lifts, writing and withdrawal.", "Writing is produced by pen contact, reproduces the target glyphs and satisfies the final withdrawal and arm-return conditions.", "Target program / Pen–board contact / Writing and recovery", "Only the seven right-arm joints move; the waist, legs, left arm and fingers are fixed."],
 ['T12','In-context mobile manipulation','navigate','A','Ridgeback + Franka','Infer an object-selection rule from a few demonstrations and apply it in a new layout.','Show the supplied demonstrations before the new-layout execution, with agent and external views.','Transfer the inferred rule; select the correct object and leave others undisturbed.','Supplied demonstrations / Unseen layout / Rule transfer','Explicit demonstration-based task: demonstrations are task inputs, not hidden ground truth.'],
 ['T13','Text-to-sim construction','construct','C','Scene / USD','Build an executable scene from text, including the requested objects, dimensions and articulated parts.','Show text constraints, scene overview and physical tests of doors, drawers and support regions.','The scene loads, steps and supports the requested interactions.','Text constraints / Generated scene / Interaction checks','Task specification; scene verifier and test instances pending.'],
 ["T14", "Single-image indoor scene reconstruction", "construct", "C", "Scene / USD", "Reconstruct an interactive indoor simulation from one room photograph, inferring spatial arrangement, object geometry and approximate scale.", "Pair the reference room photograph with the reconstructed scene, then show its isolated rebuild and interaction checks.", "The USD scene, scene-building script and structured scene description rebuild in isolation and pass the frozen scene evaluator.", "Single room photograph / Build the interactive scene / Rebuild and evaluate", "The appendix specifies a single room photograph as input."],
 ["T15", "Hand-object reconstruction", "construct", "C", "Wuji dexterous hands", "Recover hand motion, object pose and contact timing from calibrated multi-view RGB video, then synthesize a physically executable dexterous-hand replay.", "Synchronize input and replay; show multiple views and slow motion at contact transitions.", "Reconstruction and physical replay satisfy the frozen aggregate acceptance rule for pose, contact timing, penetration and trajectory errors.", "Source video / Synchronized replay / Contact verification", "The handover episode uses eight calibrated RGB cameras and simulated Wuji hands."],
 ["T16", "Quadruped policy training", "body", "B", "Unitree Go2", "Develop and train one Go2 policy from random initialization for forward/backward walking, left/right turning, left/right lateral motion, lying down and sitting.", "Show training briefly, then evaluate all eight behaviors using the same frozen policy.", "A single frozen policy passes the task-specific motion and posture tests for all eight behaviors.", "Develop training code / Train one policy from scratch / Evaluate eight behaviors", "Eight behaviors share one trained policy, separate from the frozen navigation controller."],
 ["T17", "Dexterous pen-spinning training", "dexterity", "B", "Allegro Hand", "Train an Allegro-hand policy to continuously transfer and rotate a pen between fingers during a ten-second rollout without dropping it.", "Show a hand close-up, pen-axis reference and complete evaluations; label training footage separately.", "The policy achieves at least two net rotations, at least 90 degrees in every two-second window and four transfers involving three fingers.", "Policy development / Continuous rotation / Pen retention", "Evaluation combines rotation continuity, multi-finger transfers and pen retention."],
 ['T18','Unfamiliar robot adaptation','manipulate','A','Unfamiliar robot','Read an unfamiliar robot interface, use the permitted interaction budget to understand its behavior, and complete the requested pick-and-place task.','Show the interface context, exploratory actions and the complete task execution on the unfamiliar robot.','The requested object reaches its target through the supplied interface within the interaction constraints.','Interface context / Limited exploration / Task completion','The manuscript restores unfamiliar robot adaptation; it does not specify a robot model.'],
 ["T19", "Liquid pouring to a target level", "manipulate", "A", "ARX X5", "Lift a liquid-filled jug, transfer its contents into the target cup without spillage, return the jug to the table and return both arms to their initial configurations.", "Keep target line, liquid surface and spillage visible through pouring, settling and return.", "The final score combines jug lifting, the fraction of initial liquid inside the cup, and jug placement with both arms returned.", "Lift the jug / Transfer liquid into the cup / Place jug and return arms", "PhysX particles represent equal liquid volumes; liquid left in the jug or spilled receives no transfer credit."],
 ["T20", "Shoelace knot tying", "manipulate", "A", "ARX X5", "Use two arms to form and tighten one overhand knot in already-threaded shoelaces, then release the ends and move the grippers away.", "Use an uninterrupted overhead view plus a side view of the knot, preserving threading and tightening.", "The knot preserves threading through all ten eyelets, persists for three seconds after release and passes the pull-resistance test.", "Lace-end control / Threading and tightening / Released knot", "The current task requires a single overhand knot."],
 ["T21", "Target search in unseen environments", "navigate", "A", "Unitree Go2", "Explore an unfamiliar nine-room home with a quadruped, find and report five specified objects from nearby clear camera views, then stop.", "Synchronize head view and route; retain exploration, visibility at each report and the final STOP.", "Confirm all five assigned targets with valid visible reports within 1 m, then execute STOP; no return to the start is required.", "Unfamiliar start / Explore and report five objects / Final STOP", "Go2 uses discrete navigation and target-reporting tools with a 700-command limit."],
 ["T22", "Cross-room semantic navigation", "navigate", "A", "Unitree G1", "Navigate across rooms, visit one or two instructed intermediate rooms in order, reach the destination room and finish within 1 m of the designated furniture.", "Synchronize instruction, head camera and overhead route; preserve room transitions and final position.", "The robot finishes in the destination-room core within 1 m of the target furniture, with the required room-entry order and no recorded failure.", "Recognize instructed rooms / Visit intermediate rooms in order / Approach destination furniture", "G1 navigation uses a frozen Isaac Lab Agile locomotion policy; arms and hands are not directly controlled."],
 ['T23','Training trajectory collection','manipulate','D','Task-defined embodiment','Collect robot interaction trajectories for training and deliver the recorded observations, actions and task outcomes in the required format.','Pair the collection process with synchronized observations, actions and the resulting trajectory records.','The collected trajectories satisfy the task-specific format, completeness and outcome checks.','Collection objective / Record interactions / Validate trajectory dataset','The manuscript defines a training-data collection category; detailed collection quotas and embodiment are not specified.']
].map(([id,name,group,track,robot,goal,video,proof,beats,note])=>({id,name,en:name,group,track,robot,goal,video,proof,beats:beats.split(' / '),note,category:id==='T23'?'training-data':['T12','T18'].includes(id)?'in-context-learning':['T21','T22'].includes(id)?'navigation':track==='B'?'policy-development':['T13','T14','T15'].includes(id)?'scene-generation':'manipulation'}));


/* Task-level explanations describe the intended test, not measured model abilities. */
{
 const details = {
  T01: {
   scoring: [["Grasping", 10], ["Disentanglement", 50], ["Placement", 25], ["Release and return", 10], ["Full completion", 5]],
   paperFigure: "assets/paper/t01-evaluation.webp",
   input: "Blue keeper and orange key, matching placement regions, two ARX X5 arms, RGB cameras and measured robot state.",
   capabilities: [
    ['Spatial reasoning', 'Understand how the parts constrain one another and find a path that frees them.'],
    ['Bimanual coordination', 'Move both grippers together while maintaining useful grasps.'],
    ['Contact-aware control', 'Separate and place the parts without using penetration as a shortcut.']
   ],
   checks: ["Disentangle the objects without penetration.", "Place both parts in the matching color-coded regions.", "Release both objects, return both arms and maintain the required stable configuration."]
  },
  T02: {
   scoring: [["Grasping", 10], ["Initial insertion", 30], ["Full seating", 45], ["Arm return", 10], ["Full completion", 5]],
   paperFigure: "assets/paper/t02-evaluation.webp",
   input: "A plug in its cradle, three sockets with one illuminated target indicator, RGB cameras and measured robot state.",
   capabilities: [
    ['Pose alignment', 'Match the plug orientation and approach direction to the socket.'],
    ['Precision control', 'Make small corrections when the pins approach and enter the socket.'],
    ['Contact reasoning', 'Distinguish touching the socket from a stable, completed insertion.']
   ],
   checks: ["Identify the illuminated target socket.", "Reach at least 14 mm insertion with the specified lateral and angular tolerances.", "Release the plug, return both arms and retain full seating after settling."]
  },
  T03: {
   input: "A case-sensitive target string, physical keyboard, RGB observations and robot proprioception.",
   capabilities: [
    ['Symbol-to-action mapping', 'Translate characters into positions and physical key presses.'],
    ['Sequential precision', 'Press and release the intended keys in the required order.'],
    ['Feedback and correction', 'Use the input buffer to identify mistakes before submitting.']
   ],
   checks: ["Only physical key contact enters characters.", "The first submitted string matches case and character order.", "All keys are released and the end effector returns and settles."]
  },
  T04: {
   input: "A cucumber, knife, cutting board and knife holder; produce three pieces at least 20 mm long.",
   capabilities: [
    ['Role assignment', 'Use one arm to stabilize the object while the other operates the knife.'],
    ['Bimanual coordination', 'Keep the holding and cutting motions compatible throughout the action.'],
    ['Geometric planning', 'Choose cut positions that match the requested sections.']
   ],
   checks: ["Two cuts produce three pieces, each at least 20 mm long.", "The knife returns to its holder and the cucumber is released.", "The final state is stable and the blade never contacts robot grippers."]
  },
  T05: {
   scoring: [["Color similarity", 20], ["Structural similarity", 20], ["Edge agreement", 10], ["Visual assessment", 50]],
   paperFigure: "assets/paper/t05-evaluation.webp",
   input: "A landscape reference image at /app/reference.png, a Franka-held pen, paper and set_brush color/width controls.",
   capabilities: [
    ['Visual-to-motor mapping', 'Translate the reference drawing into paths in the canvas frame.'],
    ['Stroke planning', 'Order separate strokes and lift the brush between disconnected marks.'],
    ['Contact precision', 'Maintain drawing contact while limiting missing and unwanted marks.']
   ],
   checks: ["The reference determines composition, recognizable objects and semantic colors.", "Color, structure, edge agreement and visual assessment sum to 100 points.", "Completion requires a nonblank drawing, score of at least 80 and no task failure."]
  },
  T06: {
   input: 'An instruction to select the longest baguette, a basket and several candidate objects.',
   capabilities: [
    ['Language grounding', 'Resolve “the longest” by comparing the visible candidates.'],
    ['Grasp and placement', 'Transport the selected object into the basket and release it.'],
    ['Constraint preservation', 'Complete the goal while keeping unrelated objects in place.']
   ],
   checks: ['The selected object is the longest baguette.', 'It is inside the basket in the settled final state.', 'Every other object moves no more than 5 cm.']
  },
  T07: {
   scoring: [["Pickup", 10], ["Legal face turns", 20], ["Green-face restoration", 50], ["Table return and release", 10]],
   input: "A seeded scrambled cube, the green-face objective and a stationary G1 with two Wuji hands.",
   capabilities: [
    ['Finger coordination', 'Redistribute fingertip contacts while retaining the cube.'],
    ['Relative-motion reasoning', 'Rotate the specified layer relative to the rest of the cube.'],
    ['Grasp stability', 'Keep the object supported through the required rotation.']
   ],
   checks: ["Pick up the cube and make legal face rotations.", "Restore all nine green stickers to the face containing the green center.", "Return and release the aligned cube on the tabletop; full completion awards 100 points."]
  },
  T08: {
   scoring: [["Stem grasp", 20], ["Lift", 40], ["Hold", 30]],
   input: "An apple with an inclined stem, RGB camera views and G1 wrist/finger controls.",
   capabilities: [
    ['Fine target localization', 'Locate a small graspable stem rather than the larger fruit body.'],
    ['Dexterous contact', 'Position the fingers on the stem without touching the apple.'],
    ['Delicate manipulation', 'Lift and hold while preserving the stem and a stable grasp.']
   ],
   checks: ["The right thumb and index finger grasp only the stem.", "The fruit reaches at least 10 cm above the table and stays held for three seconds.", "Fruit-body contact, stem breakage or leaving the permitted workspace yields zero points."]
  },
  T09: {
   scoring: [["Approach", 10], ["Hand contact", 10], ["Stand with ball", 30], ["Carry near table", 10], ["Placement", 20]],
   input: "A floor ball, color-coded tabletop target, RGB observations and G1 base, squat, arm and hand controls.",
   capabilities: [
    ['Whole-body coordination', 'Coordinate reaching, grasping and placement with body posture.'],
    ['Object transport', 'Retain the ball while moving it to the target region.'],
    ['Postural stability', 'Complete the manipulation and return to a stable configuration.']
   ],
   checks: ["Approach, contact, lift to stable standing and carry the ball toward the table.", "Place the ball in the target region 3.5–6 cm above the tabletop.", "Full completion requires low ball motion and stable standing for two seconds."]
  },
  T10: {
   input: 'An ordered waypoint list, a shelf-retrieval instruction and a required final pose.',
   capabilities: [
    ['Long-horizon planning', 'Keep track of waypoint order, retrieval and the final pose requirement.'],
    ['Navigation and manipulation', 'Connect travel through the scene with a shelf grasp.'],
    ['Pose control', 'Finish at the requested position and orientation.']
   ],
   checks: ['All required waypoints are visited in order.', 'The requested can is retrieved from the shelf.', 'The final position and orientation satisfy the task.']
  },
  T11: {
   scoring: [["Ink contact", 10], ["Stroke execution", 30], ["Glyph reproduction", 60]],
   input: "A target three-line program, pen geometry, whiteboard and right-arm-only G1 controls.",
   capabilities: [
    ['Text-to-stroke planning', 'Convert the requested code into an ordered set of writing strokes.'],
    ['Surface contact control', 'Use pen contact and lifts to produce distinct physical marks.'],
    ['Arm control', 'Move the seven right-arm joints while the rest of the body stays fixed.']
   ],
   checks: ["Ink comes from physical pen-tip contact on the board.", "Glyph reproduction is compared with the target program.", "Lift the pen clear and return the right arm; the rest of the body remains fixed."]
  },
  T12: {
   input: 'A few supplied demonstrations, a new object layout and the mobile-manipulation interface.',
   capabilities: [
    ['In-context rule learning', 'Infer which object-selection rule explains the demonstrations.'],
    ['Transfer to a new layout', 'Apply that rule when objects occupy unfamiliar positions.'],
    ['Mobile manipulation', 'Reach, grasp and place the chosen object while preserving other objects.']
   ],
   checks: ['The selected object follows the demonstrated rule.', 'Placement satisfies the current task target.', 'Unrelated objects remain within the permitted disturbance limits.']
  },
  T13: {
   input: 'A text specification of objects, dimensions, relationships and articulated parts.',
   capabilities: [
    ['Constraint translation', 'Turn language requirements into explicit scene geometry and relationships.'],
    ['Scene construction', 'Produce a loadable scene with assets, scale and joints configured.'],
    ['Physical validation', 'Check that support surfaces and requested interactions work when simulated.']
   ],
   checks: ['The generated scene loads and advances in simulation.', 'Objects, dimensions and spatial relationships meet the specification.', 'Required joints and support interactions pass the physical checks.']
  },
  T14: {
   input: "One reference room photograph and the required USD, reproducible scene-building script and structured description formats.",
   capabilities: [
    ['Single-image spatial reasoning', 'Infer layout, geometry and scale from one room photograph.'],
    ['Metric reconstruction', 'Preserve scene dimensions, clearances and navigable space.'],
    ['Interactive world modeling', 'Represent cabinets and drawers as usable articulated structures.']
   ],
   checks: ["Deliver the USD scene, scene-building script and structured scene description.", "Rebuild successfully in an isolated environment.", "Pass the frozen scene-evaluation procedure."]
  },
  T15: {
   input: "Eight calibrated RGB views of a handover and the dexterous-hand replay specification.",
   capabilities: [
    ['Motion reconstruction', 'Recover coherent hand and object motion from multiple views.'],
    ['Temporal reasoning', 'Align grasp, release and object motion with the source sequence.'],
    ['Physical consistency', 'Reconstruct contacts that support the observed interaction without penetration.']
   ],
   checks: ["Object-position error is within 2 cm and hand-position error within 3 cm.", "Contact-boundary error is within six frames.", "Replay penetration is within 5 mm and trajectory or final-state error within 3 cm, under the aggregate acceptance rule."]
  },
  T16: {
   input: "An Isaac Lab Go2 training environment, eight behavior objectives and random initial policy parameters.",
   capabilities: [
    ['Reward design', 'Express tracking, stability and movement objectives in trainable rewards.'],
    ['Learning-system development', 'Write and configure a reinforcement-learning training procedure.'],
    ['Policy generalization', 'Produce weights that work under fixed held-out evaluation conditions.']
   ],
   checks: ["Train from randomly initialized parameters.", "Submit one frozen policy for all eight behaviors.", "Full completion requires passing all eight motion/posture evaluations."]
  },
  T17: {
   input: "An Allegro-hand training environment, initial pen grasp and continuous-rotation evaluation requirements.",
   capabilities: [
    ['Reward and curriculum design', 'Shape learning toward useful rotation while retaining the pen.'],
    ['Dexterous policy learning', 'Train coordinated finger behavior rather than a text-only action plan.'],
    ['Evaluation discipline', 'Check the learned behavior under the fixed test conditions.']
   ],
   checks: ["Sustain ten seconds without dropping the pen.", "Achieve two net rotations and at least 90 degrees per two-second window.", "Complete at least four transfers involving three fingers."]
  },
  T19: {
   scoring: [["Jug lift", 10], ["Liquid transfer", 80], ["Jug placement and arm return", 10]],
   input: "A jug of equal-volume liquid particles, fixed target cup and two ARX X5 arms with RGB observations.",
   capabilities: [
    ['Visual state estimation', 'Relate the observed liquid surface to the target level.'],
    ['Dynamic control', 'Adjust pouring and stop in time for the final settled level.'],
    ['Multi-constraint execution', 'Limit spillage and return the pitcher after filling the cup.']
   ],
   checks: ["Lift the jug base at least 3 cm above the table.", "Score liquid transfer by the fraction of initial particles inside the cup.", "Place the jug upright on the table and return both arms within the specified tolerances."]
  },
  T20: {
   input: 'Threaded shoelaces, the required knot structure and the dual-arm interface.',
   capabilities: [
    ['Topological reasoning', 'Choose a threading sequence that creates the required knot.'],
    ['Deformable-object control', 'Manage moving lace ends and changing rope shape.'],
    ['Bimanual coordination', 'Coordinate threading and tightening before releasing both ends.']
   ],
   checks: ["Create one tightened overhand knot while preserving threading through ten eyelets.", "Release both ends and move the grippers away.", "The knot lasts three seconds and passes the pull-resistance test."]
  },
  T21: {
   scoring: [["Five target discoveries", 90]],
   input: 'Five requested object identities, an unfamiliar indoor start and frozen Go2 locomotion controls.',
   capabilities: [
    ['Exploration planning', 'Search an unfamiliar environment without privileged object coordinates.'],
    ['Visual grounding', 'Identify requested objects from the observations available to the agent.'],
    ['Goal bookkeeping', 'Report all five targets and stop only after completing the search.']
   ],
   checks: ["Confirm five distinct target labels with visible reports within 1 m.", "Avoid excess reports and blocked-forward penalties.", "Execute STOP after confirming all targets to receive 100 points."]
  },
  T22: {
   scoring: [["Ordered route milestones", 80]],
   input: "A semantic route with one or two ordered intermediate rooms, destination furniture, RGB observations and relative odometry.",
   capabilities: [
    ['Semantic grounding', 'Relate room descriptions and goal language to the observed scene.'],
    ['Route planning', 'Travel across rooms while honoring an intermediate destination.'],
    ['Completion recognition', 'Stop in the requested goal region after the required visit.']
   ],
   checks: ["Discover and enter required intermediate rooms in order.", "Partial progress requires ordered milestones; furniture approach uses a 2 m threshold.", "Full completion requires the destination-room core, distance within 1 m and no recorded failure."]
  },
  T18: {
   input: 'An unfamiliar robot interface, its documentation, permitted observations and a pick-and-place objective.',
   capabilities: [
    ['Interface understanding', 'Interpret the supplied robot documentation and control commands.'],
    ['Adaptation through feedback', 'Use permitted interactions to relate commands to observed behavior.'],
    ['Task transfer', 'Complete the objective using the unfamiliar embodiment.']
   ],
   checks: ['Actions use the supplied robot interface.', 'Exploration and execution stay within the declared budget.', 'The object reaches the requested target under the task evaluator.']
  },
  T23: {
   input: 'A collection objective, a task-defined robot environment, recording tools and a required trajectory format.',
   capabilities: [
    ['Data collection', 'Record the robot interactions required by the collection objective.'],
    ['Temporal alignment', 'Keep observations, actions and outcomes on a shared trajectory clock.'],
    ['Artifact validation', 'Check the delivered records against the task-specific collection criteria.']
   ],
   checks: ['The required observations, actions and outcomes are recorded.', 'Records are temporally aligned and readable in the required format.', 'The dataset passes the task-specific completeness and outcome checks.']
  }
 };
 for (const t of window.TASKS) Object.assign(t, details[t.id]);
}
