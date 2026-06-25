/*
@title: getting_started
@author: leo, edits
@description: None
@tags: ['tutorial']
@addedOn: 2022-07-26

Check the tutorial in the bottom right, the run button is in the top right.
Make sure to remix this tutorial if you want to save your progress!
*/

// define the sprites in our game
const rocket_on = "r";
const rocket_off = "r";
const rock = "a";
const goal = "g";
const background = "b";
const rocket_died = "d"
const die_zone = "z"
const bgm = tune`

200,
200: E4~200 + A4-200,
200: F4^200,
200: E4~200,
200: G4^200,
200: E4~200 + E5/200,
200: D4^200 + G4-200,
200: E4~200 + B4-200,
200: G4^200,
200: E4~200,
200: E4^200 + A4-200,
200: E4~200,
200: G4^200 + C5-200,
200: E4~200,
200: D4^200 + E5/200 + A4/200,
200: E4~200 + A4-200,
200: F4^200,
200: E4~200 + G4-200 + E5/200,
200,
200: E4~200 + F4-200,
200: C4-200 + F5-200,
200: E4~200 + G4-200,
200: C5^200,
200: E4~200,
200: A4-200,
200: E4~200 + C5/200,
200: F4-200,
200: E4~200 + A4-200,
200,
200: E4~200 + C5/200 + C4-200,
200,
200: E4/200`
const bgmPlayback = playTune(bgm, Infinity);
const thrust = tune`
50: C5~50,
50: G4~50
`;
var gravity = 1;
let score = 0;
let fuel = 50;
let gameStarted = false;
// assign bitmap art to each sprite
setLegend(
  [ rocket_on, bitmap`
.......11.......
......1111......
......1771......
......1771......
......1111......
......1111......
......1111......
.....111111.....
.....111111.....
....11111111....
...1111111111...
.....111111.....
......1331......
.......66.......
................
................`],
  [ rocket_off, bitmap`
.......11.......
......1111......
......1771......
......1771......
......1111......
......1111......
......1111......
.....111111.....
.....111111.....
....11111111....
...1111111111...
.....111111.....
......1111......
................
................
................`],
  [ rock, bitmap`
................
................
................
................
................
......2222......
.....222212.....
.....212222.....
.....222122.....
.....222222.....
......2222......
................
................
................
................
................`],
  [ goal, bitmap`
................
................
................
................
................
................
................
................
................
................
................
................
................
................
..333333333333..
6666666666666666`],
  [ background, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [ die_zone, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`]
  )
setBackground(background);
// create game levels
let level = 0; // this tracks the level we are on
const levels = [
    map`
.............
.............
.............
.............
.............
.............
.............
.............
.............
.............`,//Start menu
  map`
...r.........
.............
.............
.............
.............
.............
.............
.............
.............
zzzzzgzzzzzzz`,
  map`
..........r..
.............
.............
...a.........
.............
.............
.............
.............
.............
.....g.......`,
  map`
..........r..
......a......
.............
.....a.......
.............
..a..........
.............
.............
.............
.....g.......`,
  map`
..........r..
.a...........
.............
.a...........
..a..........
.............
.............
..a...a......
.............
.....g.......`,
  map`
.............
............a
a............
..g..........
.............
.............
a............
.............
a........r..a
a...........a`,
  map`
.............
.............
.............
.............
.............
.............
.............
.............
.............
.............`,//Good Game

];
var total_levels = levels.length -1 
console.log("total levels(0-n):",total_levels)
// set the map displayed to the current level
const currentLevel = levels[level];
setMap(currentLevel);

setSolids([goal]); // other sprites cannot go inside of these sprites

// allow certain sprites to push certain other sprites
setPushables({

});

// inputs for player movement control
onInput("w", () => {
  if (gameStarted && level !== 0 && gravity !== 0 && fuel > 0) {
    fuel--;
    playTune(thrust);
    getFirst(rocket_on).y -= 1;
  } else if (!gameStarted) {
    startGame();
  }
});

onInput("a", () => {
  if (gameStarted && level !== 0 && gravity !== 0 && fuel > 0) {
    fuel--;
    playTune(thrust);
    getFirst(rocket_on).x -= 1;
  } else if (!gameStarted) {
    startGame();
  }
});

onInput("s", () => {
  if (gameStarted && level !== 0 && gravity !== 0 && fuel > 0) {
    fuel--;
    playTune(thrust);
    getFirst(rocket_on).y += 1; // positive y is downwards
  } else if (!gameStarted) {
    startGame();
  }
});

onInput("d", () => {
  if (gameStarted && level !== 0 && gravity !== 0 && fuel > 0) {
    fuel--;
    playTune(thrust);
    getFirst(rocket_on).x += 1;
  } else if (!gameStarted) {
    startGame();
  }
});

// input to reset level
onInput("j", () => {
  if (gameStarted) {
    const currentLevel = levels[level]; // get the original map of the level

    // make sure the level exists before we load it
    if (currentLevel !== undefined) {
      clearText("");
      setMap(currentLevel);
    }
    
    // Resetting the game over state
    if (gravity === 0) {
      gravity = 1; // Reset gravity
      level = 0; // Set level back to start menu
      gameStarted = false;
      fuel = 50;
      score = 0;
      const startMenu = levels[level];
      setMap(startMenu); // Display the start menu
      showStartScreen();
    }
  }
});

const showStartScreen = () => {
  clearText();
  addText("SPACE LANDER", {
    x: 4,
    y: 1,
    color: "4"
  });
  addText("==================", {
    x: 1,
    y: 2,
    color: "6"
  });
  addText("Objective:", {
    x: 5,
    y: 4,
    color: "2"
  });
  addText("- Land the Rocket", {
    x: 1,
    y: 6,
    color: "6"
  });
  addText("  On the Pad", {
    x: 1,
    y: 7,
    color: "6"
  });
  addText("- Avoid Asteroids!", {
    x: 1,
    y: 9,
    color: "3"
  });
  addText("* * * * * * * * * *", {
    x: 0,
    y: 11,
    color: "5"
  });
  addText("PRESS ANY KEY", {
    x: 3,
    y: 13,
    color: "4"
  });
  addText("TO START", {
    x: 6,
    y: 14,
    color: "4"
  });
}

const startGame = () => {
  if (!gameStarted && level === 0) {
    console.log("Game Starting!");
    gameStarted = true;
    level = 1;
    const currentLevel = levels[level];
    setMap(currentLevel);
    clearText();
    gravity = 1;
    fuel = 50;
  }
}

const drawHUD = () => {

  if(gameStarted && level !== 0 && gravity !== 0){
  clearText();
    addText("F:" + fuel,{
      x:0,
      y:0,
      color:"4"
    });

    addText("S:" + score,{
      x:8,
      y:0,
      color:"2"
    });
  }
}
const applyGravity = () => {
  if(!gameStarted) return;
  
  if(fuel <= 0 && gravity !== 0){
  gravity = 0;

  addText("OUT OF FUEL",{
    y:4,
    color:"3"
  });

  addText("PRESS J",{
    y:6,
    color:"5"
  });

  return;
}
    const hit = tilesWith(rock, rocket_on).length;
  const crash = tilesWith(die_zone, rocket_on).length;
  if (hit > 0 || crash > 0) {
    addText("GAME OVER", { y: 4, color: "3" });
    addText("Press J", { y: 5, color: "5" });
    const entityToUpdate = getFirst(rocket_off);
    gravity = 0
    entityToUpdate.bitmap = bitmap`
  33............33
  333....11....333
  .333..1111..333.
  ..333.1771.333..
  ...3331771333...
  ....333.1333....
  .....333333.....
  .....133331.....
  .....133331.....
  .....333333.....
  ....33311333....
  ...3331111333...
  ..333111111333..
  .333..1331..333.
  333....66....333
  33............33`;
}
  if (level !== 0) {
    const rocket = getFirst(rocket_on);
    if ((rocket.x, rocket.y + 1)) {
      rocket.y += gravity; 
        const targetNumber = tilesWith(goal).length;
  const numberCovered = tilesWith(goal, rocket_on).length;
  // count the number of tiles with goals and rocket
  

  // if the number of goals is the same as the number of goals covered
  // all goals are covered and we can go to the next level
  if (numberCovered === targetNumber && targetNumber > 0) {
    // increase the current level number
    score += 100;
    fuel += 20;
    level = level + 1;  
    rocket.y -= 2
    const currentLevel = levels[level];

    // make sure the level exists and if so set the map
    // otherwise, we have finished the last level, there is no level
    // after the last level
    if(level === total_levels){
  setMap(levels[level]);
  showWin();
    }
    else if(currentLevel !== undefined){
      setMap(currentLevel);
    } else {
      addText("you win!", { y: 4, color: color`3` });
    }
  }
    }
  }
}
const move_rock = () => {
  if(!gameStarted) return;
  
  if (level !== 0 && level !== 1 && level !== total_levels) {
    getAll(rock).forEach(sprite => {
  if(Math.random() > 0.5){
  sprite.x += 1;
}else{
  sprite.x -= 1;
}
    
});
  const hit = tilesWith(rock, rocket_on).length;
  const crash = tilesWith(die_zone, rocket_on).length;
  if (hit > 0 || crash > 0) {
    addText("GAME OVER", { y: 4, color: "3" });
    addText("Press J", { y: 5, color: "3" });
    const entityToUpdate = getFirst(rocket_off);
    gravity = 0
    entityToUpdate.bitmap = bitmap`
  33............33
  333....11....333
  .333..1111..333.
  ..333.1771.333..
  ...3331771333...
  ....333.1333....
  .....333333.....
  .....133331.....
  .....133331.....
  .....333333.....
  ....33311333....
  ...3331111333...
  ..333111111333..
  .333..1331..333.
  333....66....333
  33............33`;

}
  }
}
const showWin = () => {


  addText("MISSION",{
    x:3,
    y:4,
    color:"4"
  });

  addText("SUCCESS",{
    x:3,
    y:6,
    color:"2"
  });

  addText("SCORE: "+score,{
    x:1,
    y:9,
    color:"6"
  });

  addText("PRESS J",{
    x:3,
    y:12,
    color:"5"
  });
}
const die = () =>{
  console.log("you died")
  level = total_levels 
  const currentLevel = levels[level];
}
die
setInterval(applyGravity, 400); 
setInterval(move_rock, 100); 
//------Start Prompt------//
showStartScreen();

// these get run after every input
afterInput(() => {
    
  if(gameStarted && level !== 0 && gravity !== 0){
  clearText();
  addText("F:" + fuel,{
    x:0,
    y:0,
    color:"4"
  });

  addText("S:" + score,{
    x:8,
    y:0,
    color:"2"
  });
}
  
  // count the number of tiles with goals
  const targetNumber = tilesWith(goal).length;
  const numberCovered = tilesWith(goal, rocket_on).length;
  // count the number of tiles with goals and rocket
  

  // if the number of goals is the same as the number of goals covered
  // all goals are covered and we can go to the next level
  
  
const hit = tilesWith(rock, rocket_on).length;
const crash = tilesWith(die_zone, rocket_on).length;
if ((hit > 0 || crash > 0) && gameStarted) {
  addText("GAME OVER", { y: 4, color: "3" });
  addText("Press J", { y: 5, color: "5" });
  const entityToUpdate = getFirst(rocket_off);
  gravity = 0
  entityToUpdate.bitmap = bitmap`
33............33
333....11....333
.333..1111..333.
..333.1771.333..
...3331771333...
....333.1333....
.....333333.....
.....133331.....
.....133331.....
.....333333.....
....33311333....
...3331111333...
..333111111333..
.333..1331..333.
333....66....333
33............33`;
}


    }
,);