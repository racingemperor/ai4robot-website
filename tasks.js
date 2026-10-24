/* Specifications and filming plans, reviewed against research main on 2026-10-23. T18 excluded. */
window.CATEGORIES=[
 {id:'manipulation',name:'Manipulation',count:14,output:'Control program',hidden:'Initial layouts, target text or demonstration rule'},
 {id:'navigation',name:'Navigation',count:3,output:'Control program',hidden:'Start, goals and dynamic obstacles'},
 {id:'training',name:'Training',count:2,output:'Training code + policy weights',hidden:'Evaluation script and test conditions'},
 {id:'construction',name:'Construction',count:3,output:'Scene or motion files',hidden:'Test instances and reference ground truth'}
];
window.GROUPS=[
 {id:'manipulate',name:'Objects & contact',en:'MANIPULATION',color:'#b84b32',question:'Can a goal become precise contact?'},
 {id:'dexterity',name:'Hands & dexterity',en:'DEXTERITY',color:'#716399',question:'Can reasoning reach the fingertips?'},
 {id:'body',name:'Body & control',en:'BODY & CONTROL',color:'#42685d',question:'Can an agent control or train a body?'},
 {id:'navigate',name:'Space & movement',en:'SPATIAL REASONING',color:'#456d8b',question:'Can an agent act in unfamiliar, changing spaces?'},
 {id:'construct',name:'World construction',en:'WORLD BUILDING',color:'#8b692e',question:'Can observations become an interactive world?'}
];
window.TASKS=[
 ['T01','Dual-arm puzzle','manipulate','A','ARX X5','Separate interlocked rigid parts, place them in their matching regions, release and return both arms.','Keep both arms and the interlock visible through unlocking, separation and placement.','Separation without penetration, followed by stable placement.','Interlocked start / Coordinated unlocking / Released final state','Feasibility in progress: the reference solver currently reaches the two-arm grasp; full unlocking remains unresolved.'],
 ['T02','Precision plug insertion','manipulate','A','ARX X5','Orient and insert a three-pin plug into a power strip, then release it within the task contact limits.','Use a wide view plus a socket-side close-up; preserve alignment, insertion and release.','The plug is seated and stable after release; touching the socket is insufficient.','Plug orientation / Contact and alignment / Seated after release','Reference solver verified; public model results pending.'],
 ['T03','Physical keyboard typing','manipulate','A','Franka Panda','Press physical keys to enter the requested string, correct mistakes if needed and submit with Enter.','Pair a top view of the keys with the input buffer; retain press, release, correction and submission.','The submitted string comes from actual key presses and matches the target.','Target string / Physical key presses / Submitted buffer','Task specification; implementation and evaluation pending.'],
 ['T04','Coordinated slicing','manipulate','A','ARX X5','Use one arm to hold a cucumber and the other to cut it into the requested sections.','Show both arms continuously, with a side view of the knife at segment boundaries.','Coordinated holding and cutting under a stated simulation approximation.','Two-arm roles / Knife contact / Separated segments','Feasibility pending. Uses pre-segmented pieces and released constraints, rather than continuous soft-body cutting.'],
 ['T05','Brush drawing','manipulate','A','Franka Panda','Reproduce a supplied line drawing in the target area, avoiding missing strokes and unwanted connections.','Pair the reference drawing with an overhead canvas view and a side view of pen contact.','Stroke coverage and extra marks, with visible pen lifts between separate strokes.','Reference drawing / Contact and pen lifts / Stroke comparison','Task specification; implementation and evaluation pending.'],
 ['T06','Semantic pick & place','manipulate','A','ARX X5','Choose the longest baguette, put it inside the basket and leave the other objects undisturbed.','Keep all candidates and the basket in frame; show selection, grasp, transport and the settled final state.','The correct baguette is inside the basket and other objects move no more than 5 cm.','Compare the candidates / Pick the longest / Place without disturbance','Complete reference implementation with documented judge checks; public model results pending.'],
 ['T07','Cube face manipulation','dexterity','A','Allegro Hand','Hold an articulated cube and perform the specified face rotation without dropping it.','Use hand close-ups and a view showing multiple cube faces; display the required rotation.','A face rotates relative to the cube, rather than the whole cube simply turning.','Initial face state / Finger repositioning / Relative face rotation','Initial scope: a single rotating layer. Task implementation pending.'],
 ['T08','Apple-stem grasp','dexterity','A','Allegro Hand','Lift an apple by its stem and hold it steadily without touching the fruit or breaking the stem.','Synchronize a stem close-up with a side view of lift and hold.','Contact stays on the stem; the fruit remains unsupported and the stem intact.','Fingertip contact / Clear of the table / Stable stem-only hold','Reference solver under feasibility validation; public model results pending.'],
 ['T09','Humanoid ball pickup','body','A','Unitree G1','Pick up a ball, place it in the target region and maintain a stable body configuration.','Show the full body and head camera through reaching, grasping, placement and recovery.','Successful object placement together with body stability.','Reach the ball / Pick and place / Stable recovery','First stage uses a reachable ball on a low support; floor pickup depends on locomotion integration.'],
 ['T10','Waypoints & retrieval','body','A','Unitree G1','Visit the requested waypoints in order, retrieve a can from a shelf and finish at the target pose.','Combine a continuous third-person view with a synchronized overhead route.','Waypoint order, retrieval and final orientation all satisfy the instruction.','Ordered waypoints / Shelf retrieval / Final pose','Depends on G1 locomotion integration; task specification pending implementation.'],
 ['T11','Humanoid code writing','body','A','Unitree G1','Write a control program for a standing G1 to reproduce a specified short program on a whiteboard with a pre-held pen.','Record the full body, board front and pen side; preserve contact, pen lifts, writing and withdrawal.','Physical contact produces the strokes; target text and final posture can be checked.','Target program / Pen–board contact / Writing and recovery','Manipulation category. Initial scope is fixed standing and upper-body control; implementation pending.'],
 ['T12','In-context mobile manipulation','navigate','A','Ridgeback + Franka','Infer an object-selection rule from a few demonstrations and apply it in a new layout.','Show the supplied demonstrations before the new-layout execution, with agent and external views.','Transfer the inferred rule; select the correct object and leave others undisturbed.','Supplied demonstrations / Unseen layout / Rule transfer','Explicit demonstration-based task: demonstrations are task inputs, not hidden ground truth.'],
 ['T13','Text to simulation','construct','C','Scene / USD','Build an executable scene from text, including the requested objects, dimensions and articulated parts.','Show text constraints, scene overview and physical tests of doors, drawers and support regions.','The scene loads, steps and supports the requested interactions.','Text constraints / Generated scene / Interaction checks','Task specification; scene verifier and test instances pending.'],
 ['T14','Kitchen reconstruction','construct','C','Scene / USD','Reconstruct a dimensionally consistent, navigable and interactive kitchen from multi-view RGB-D observations.','Pair inputs with reconstruction; test dimensions, clear routes, cabinet doors and drawers.','Geometry, navigation and articulation agree with the task constraints.','Input observations / Geometric alignment / Articulation tests','Task specification; implementation and evaluation pending.'],
 ['T15','Video to hand–object interaction','construct','C','Allegro Hand','Reconstruct hand and object motion and contact timing from calibrated multi-view video for physically constrained replay.','Synchronize input and replay; show multiple views and slow motion at contact transitions.','Hand pose, object motion and contact timing align without penetration.','Source video / Synchronized replay / Contact verification','Construction category: delivers motion files for verification.'],
 ['T16','Quadruped policy learning','body','B','Unitree Go2','Write reinforcement-learning code and rewards to train velocity tracking, turning and terrain traversal.','Show development briefly, then complete held-out evaluations from side and overhead cameras.','Reliable behavior under the fixed evaluation, within the training budget.','Training code / Frozen evaluation / Terrain traversal','Uses an Isaac Lab training environment, separate from the frozen navigation controller in T21.'],
 ['T17','Learning to spin a pen','dexterity','B','Allegro Hand','Develop and train a policy that rotates a pen through the required angle without dropping it.','Show a hand close-up, pen-axis reference and complete evaluations; label training footage separately.','Required rotation and retention across fixed evaluation conditions.','Policy development / Continuous rotation / Pen retention','Training category: fixed evaluation and GPU budget required.'],
 ['T19','Pour to a target level','manipulate','A','ARX X5','Pour from a pitcher into a cup, stop at the target liquid level and return the pitcher with limited spillage.','Keep target line, liquid surface and spillage visible through pouring, settling and return.','The settled level is within tolerance, with spillage and pitcher placement checked.','Target level / Controlled pouring / Settled level and return','Particle-liquid implementation and reference solver verified; public model results pending.'],
 ['T20','Shoelace tying','manipulate','A','ARX X5','Manipulate threaded shoelaces into the required knot and leave it stable after release.','Use an uninterrupted overhead view plus a side view of the knot, preserving threading and tightening.','The released knot has the required structure and remains tied.','Lace-end control / Threading and tightening / Released knot','Initial feasibility scope is a single knot; a complete bow is a later target.'],
 ['T21','Object search','navigate','A','Unitree Go2','Explore an indoor scene, find and report all five requested objects, then stop.','Synchronize head view and route; retain exploration, visibility at each report and the final STOP.','All five reports are near visible targets; privileged coordinates are unavailable to the agent.','Unfamiliar start / Explore and report five objects / Final STOP','Reference solver verified. Uses frozen locomotion and discrete navigation; scene assets require their own license.'],
 ['T22','Semantic room navigation','navigate','A','Ridgeback + Franka','Follow a semantic instruction across rooms, visit the required intermediate room and stop in the target region.','Synchronize instruction, head camera and overhead route; preserve room transitions and final position.','The required room is visited and the correct destination reached.','Semantic instruction / Cross-room route / Destination check','Task specification; implementation and evaluation pending.'],
 ['T23','Navigation among people','navigate','A','Ridgeback + Franka','Reach the destination among moving pedestrians while maintaining clearance, waiting or detouring when needed.','Pair overhead and first-person views; show crossing traffic, closest approach and safe arrival.','Goal completion and safe clearance; state whether people are animated humans or capsule proxies.','Crossing traffic / Wait or detour / Safe arrival','Initial plan uses capsule proxies on predefined paths; public evaluation pending.']
].map(([id,name,group,track,robot,goal,video,proof,beats,note])=>({id,name,en:name,group,track,robot,goal,video,proof,beats:beats.split(' / '),note,category:['T21','T22','T23'].includes(id)?'navigation':track==='B'?'training':track==='C'?'construction':'manipulation'}));

/* Task-level explanations describe the intended test, not measured model abilities. */
{
 const details = {
  T01: {
   input: 'An interlocked pair of rigid parts, matching placement regions and the dual-arm interface.',
   capabilities: [
    ['Spatial reasoning', 'Understand how the parts constrain one another and find a path that frees them.'],
    ['Bimanual coordination', 'Move both grippers together while maintaining useful grasps.'],
    ['Contact-aware control', 'Separate and place the parts without using penetration as a shortcut.']
   ],
   checks: ['The two parts are physically separated.', 'Neither part passes through the other.', 'Both parts are released in their matching regions and remain stable.']
  },
  T02: {
   input: 'A three-pin plug, a power strip, an insertion instruction and the robot interface.',
   capabilities: [
    ['Pose alignment', 'Match the plug orientation and approach direction to the socket.'],
    ['Precision control', 'Make small corrections when the pins approach and enter the socket.'],
    ['Contact reasoning', 'Distinguish touching the socket from a stable, completed insertion.']
   ],
   checks: ['The pins align with the intended socket.', 'The plug satisfies the task insertion and contact limits.', 'The plug stays seated after the gripper releases it.']
  },
  T03: {
   input: 'A target string, a physical keyboard and the key-input feedback available to the agent.',
   capabilities: [
    ['Symbol-to-action mapping', 'Translate characters into positions and physical key presses.'],
    ['Sequential precision', 'Press and release the intended keys in the required order.'],
    ['Feedback and correction', 'Use the input buffer to identify mistakes before submitting.']
   ],
   checks: ['Characters are entered through physical key events.', 'The final input matches the requested string.', 'Enter submits the completed buffer.']
  },
  T04: {
   input: 'A cucumber, a knife and an instruction specifying the requested sections.',
   capabilities: [
    ['Role assignment', 'Use one arm to stabilize the object while the other operates the knife.'],
    ['Bimanual coordination', 'Keep the holding and cutting motions compatible throughout the action.'],
    ['Geometric planning', 'Choose cut positions that match the requested sections.']
   ],
   checks: ['The holding arm supports the cutting process.', 'Cuts occur at the required segment boundaries.', 'The resulting sections satisfy the task specification under its stated approximation.']
  },
  T05: {
   input: 'A supplied line drawing, a target canvas region and a brush-control interface.',
   capabilities: [
    ['Visual-to-motor mapping', 'Translate the reference drawing into paths in the canvas frame.'],
    ['Stroke planning', 'Order separate strokes and lift the brush between disconnected marks.'],
    ['Contact precision', 'Maintain drawing contact while limiting missing and unwanted marks.']
   ],
   checks: ['The intended strokes cover the reference drawing.', 'Extra marks and unintended connections are checked.', 'The drawing stays in the target area.']
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
   input: 'An articulated cube and a specified face-rotation instruction.',
   capabilities: [
    ['Finger coordination', 'Redistribute fingertip contacts while retaining the cube.'],
    ['Relative-motion reasoning', 'Rotate the specified layer relative to the rest of the cube.'],
    ['Grasp stability', 'Keep the object supported through the required rotation.']
   ],
   checks: ['The specified layer rotates through the required angle.', 'The motion is relative to the cube body.', 'The hand retains the cube throughout the action.']
  },
  T08: {
   input: 'An apple with a stem and an instruction to lift and hold it by the stem alone.',
   capabilities: [
    ['Fine target localization', 'Locate a small graspable stem rather than the larger fruit body.'],
    ['Dexterous contact', 'Position the fingers on the stem without touching the apple.'],
    ['Delicate manipulation', 'Lift and hold while preserving the stem and a stable grasp.']
   ],
   checks: ['Grasp contact is confined to the stem.', 'The apple clears the support and stays lifted for the required hold.', 'The stem remains intact and the fruit is not otherwise supported.']
  },
  T09: {
   input: 'A ball at the task start position, a target region and the G1 control interface.',
   capabilities: [
    ['Whole-body coordination', 'Coordinate reaching, grasping and placement with body posture.'],
    ['Object transport', 'Retain the ball while moving it to the target region.'],
    ['Postural stability', 'Complete the manipulation and return to a stable configuration.']
   ],
   checks: ['The ball is picked up from its stated start position.', 'The ball reaches the target region.', 'The body remains stable through placement and recovery.']
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
   input: 'A specified short program, a whiteboard and a standing G1 holding a pen.',
   capabilities: [
    ['Text-to-stroke planning', 'Convert the requested code into an ordered set of writing strokes.'],
    ['Surface contact control', 'Use pen contact and lifts to produce distinct physical marks.'],
    ['Upper-body coordination', 'Coordinate the arm and torso while keeping a stable standing pose.']
   ],
   checks: ['Marks result from physical pen–board contact.', 'The written characters or stroke template match the target.', 'The robot withdraws the pen and satisfies the final posture requirement.']
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
   input: 'Multi-view RGB-D observations and the camera, coordinate and scale information supplied by the task.',
   capabilities: [
    ['Multi-view spatial reasoning', 'Combine observations into a consistent reconstruction.'],
    ['Metric reconstruction', 'Preserve scene dimensions, clearances and navigable space.'],
    ['Interactive world modeling', 'Represent cabinets and drawers as usable articulated structures.']
   ],
   checks: ['Geometry and dimensions agree with the reference constraints.', 'Required routes through the kitchen remain navigable.', 'Cabinet doors and drawers support the specified interactions.']
  },
  T15: {
   input: 'Calibrated multi-view video of hand–object interaction and the required replay format.',
   capabilities: [
    ['Motion reconstruction', 'Recover coherent hand and object motion from multiple views.'],
    ['Temporal reasoning', 'Align grasp, release and object motion with the source sequence.'],
    ['Physical consistency', 'Reconstruct contacts that support the observed interaction without penetration.']
   ],
   checks: ['Reconstructed hand and object poses follow the source motion.', 'Contact transitions align with the reference timing.', 'The trajectory passes the task replay and physical-consistency checks.']
  },
  T16: {
   input: 'A Go2 learning environment, locomotion objectives and a fixed training-resource budget.',
   capabilities: [
    ['Reward design', 'Express tracking, stability and movement objectives in trainable rewards.'],
    ['Learning-system development', 'Write and configure a reinforcement-learning training procedure.'],
    ['Policy generalization', 'Produce weights that work under fixed held-out evaluation conditions.']
   ],
   checks: ['Training stays within the declared budget.', 'Submitted weights perform velocity tracking, turning and terrain traversal.', 'Performance is measured by the fixed held-out evaluator.']
  },
  T17: {
   input: 'A dexterous hand and pen learning environment, rotation objectives and a training budget.',
   capabilities: [
    ['Reward and curriculum design', 'Shape learning toward useful rotation while retaining the pen.'],
    ['Dexterous policy learning', 'Train coordinated finger behavior rather than a text-only action plan.'],
    ['Evaluation discipline', 'Check the learned behavior under the fixed test conditions.']
   ],
   checks: ['The pen reaches the required rotation under evaluation.', 'The policy retains the pen for the required duration.', 'Training budget, failures and fixed-test outcomes are recorded.']
  },
  T19: {
   input: 'A pitcher, a cup, a target liquid level and the pouring-control interface.',
   capabilities: [
    ['Visual state estimation', 'Relate the observed liquid surface to the target level.'],
    ['Dynamic control', 'Adjust pouring and stop in time for the final settled level.'],
    ['Multi-constraint execution', 'Limit spillage and return the pitcher after filling the cup.']
   ],
   checks: ['The settled liquid level is within the task tolerance.', 'Spillage satisfies the declared limit.', 'The pitcher is returned to the required placement.']
  },
  T20: {
   input: 'Threaded shoelaces, the required knot structure and the dual-arm interface.',
   capabilities: [
    ['Topological reasoning', 'Choose a threading sequence that creates the required knot.'],
    ['Deformable-object control', 'Manage moving lace ends and changing rope shape.'],
    ['Bimanual coordination', 'Coordinate threading and tightening before releasing both ends.']
   ],
   checks: ['The knot has the required structure.', 'The knot remains stable after the ends are released.', 'Any specified tightening or pull test passes; the current scope is one knot.']
  },
  T21: {
   input: 'Five requested object identities, an unfamiliar indoor start and frozen Go2 locomotion controls.',
   capabilities: [
    ['Exploration planning', 'Search an unfamiliar environment without privileged object coordinates.'],
    ['Visual grounding', 'Identify requested objects from the observations available to the agent.'],
    ['Goal bookkeeping', 'Report all five targets and stop only after completing the search.']
   ],
   checks: ['All five requested objects are reported.', 'Each report satisfies the target visibility and proximity checks.', 'The agent issues STOP after the required reports.']
  },
  T22: {
   input: 'A semantic navigation instruction specifying an intermediate room and a destination.',
   capabilities: [
    ['Semantic grounding', 'Relate room descriptions and goal language to the observed scene.'],
    ['Route planning', 'Travel across rooms while honoring an intermediate destination.'],
    ['Completion recognition', 'Stop in the requested goal region after the required visit.']
   ],
   checks: ['The required intermediate room is visited.', 'The route reaches the correct destination.', 'The robot stops inside the accepted target region.']
  },
  T23: {
   input: 'A destination, moving pedestrians or declared proxies and the mobile-robot interface.',
   capabilities: [
    ['Dynamic spatial reasoning', 'Account for crossing traffic and changes in free space.'],
    ['Reactive planning', 'Choose when to proceed, wait or detour as people move.'],
    ['Safe goal completion', 'Reach the destination while maintaining the required clearance.']
   ],
   checks: ['The robot reaches the destination.', 'Collisions and minimum clearance satisfy the task criteria.', 'Timing and the pedestrian representation are recorded with the result.']
  }
 };
 for (const t of window.TASKS) Object.assign(t, details[t.id]);
}
