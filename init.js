addEventListener = init();




function save(){
  var playerObject = {
    locale :  locale,
    money : money,
    monFlowers : monFlowers,
    monFlask : monFlask,
    hasCamel : hasCamel,
    hasWater : hasWater,
    hasSword : hasSword,
  };

  console.log(playerObject);
  // Put the object into storage
  localStorage.setItem('playerObject', JSON.stringify(playerObject));
}

function load(){
  var retrievedObject = localStorage.getItem('playerObject');
  var json = JSON.parse(retrievedObject);
  locale =  json.locale;
  money =  json.money;
  monFlowers =  json.monFlowers;
  monFlask =  json.monFlask;
  hasCamel =  json.hasCamel;
  hasWater =  json.hasWater;
  hasSword =  json.hasSword;

  gotoRoom(locale);

  console.log(json);
  console.log(json.locale)
}


/***************************************************

 * The Game Variables Structure                    *

 ***************************************************/



var isPlaying = 0;  // Not playing yet

var descrip   = ''; // Description of the room you're in (for repeats)

var locale    = ''; // Global pointer to the room we're in

var money     = 0;  // Our cash

// var bitcoin = 0; // adding bitcoin later on will allow buying and selling of bitcoin :)

// var starthack = ""; // there will be animated screens in ascii showing a start of a hack then moving to the next room

// var upload = ""; // will eventuallly simulate a virus upload to servers you comprimised

// var cserv // stands for compromised servers you can add slaves maby by entering a website? and hypothetically using a vuln

// var bribe // say you broke a person from telling people who you are and if you dont pay it they will come raid your home

var exitNorth = ""; // Room IDs of the valid exits.

var exitSouth = "";

var exitEast  = "";

var exitWest  = "";

var monFlowers = 0; // Got the money from the flowers?

var monFlask   = 0; // Got the money from ye flask?

var hasCamel   = 0; // We don't own ye camel. Yet.

var hasWater = 0, hasSword = 0;

/***************************************************

 * Initialization Subroutine                       *

 ***************************************************/



function init() {

  if (document.getElementById) {

    // Start capturing keys.

    document.onkeyup = keyCaps;



    // Begin the blinking of the cursor.

    setTimeout ("cursor()", 500);



    // Send the "intro" command to start the game.

    sendMessage ("intro");



  }

  else {

    // getElementById is pretty important for this game.

    window.alert ("This game requires a browser that supports GetElementById.");

  }

}



function resetVars() {

  isPlaying = 0;

  descrip   = '';

  locale    = '';

  money     = 0;

  exitNorth = '';

  exitSouth = '';

  exitEast  = '';

  exitWest  = '';

  monFlowers = 0;

  monFlask   = 0;

  hasCamel   = 0;

  hasWater = 0;

   hasSword = 0;

}



/***************************************************

 * Capture all keys pressed.                       *

 ***************************************************/



function keyCaps(e) {

  var code = '';

  if (window.event) { // Internet Explorer

    code = window.event.keyCode;

  }

  else { // Firefox

    code = e.keyCode;

  }



  var chr = getKey(code);



  document.getElementById("debug").innerHTML = code;



  if (chr.length > 0) {

    if (chr == '<BACKSPACE>') {

      // Backspace = delete the last character

      var chars = document.getElementById("input").innerHTML.split("");

      chars [ (chars.length - 1) ] = "";

      document.getElementById("input").innerHTML = chars.join("");

    }

    else if (chr == '<RETURN>') {

      // Submit this message.

      sendMessage(document.getElementById("input").innerHTML);

      document.getElementById("input").innerHTML = "";

    }

    else {

      document.getElementById("input").innerHTML += chr;

    }

  }

}



/***************************************************

 * Make the cursor continuously blink.             *

 ***************************************************/



function cursor() {

  var html = document.getElementById("cursor").innerHTML;

  if (html == "") {

    html = "_";

  }

  else {

    html = "";

  }

  document.getElementById("cursor").innerHTML = html;

  setTimeout("cursor()", 500);

}



/***************************************************

 * Send a command into the game.                   *

 ***************************************************/



function sendMessage (msg) {

  // Ignore blank messages.

  if (msg.length == 0) {

    return;

  }



  // Separate the verb (first word) from args.

  var args = msg.split(" ");

  var verb = args[0];



  // Handle aliases to the verbs.

  verb = verbAliases(verb);



  // Handle the verbs (commands).

  if (verb == "intro") {

    if (isPlaying) {

      display("<span class=\"red\">Can't Access Introduction Screen</span><br><br>"

        + "You are currently playing the RPG adventure, and can't return to the title "

        + "screen without quitting your game. To quit and return, type "

        + "<span class=\"lime\">quit</span>.");

    }

    else {

      display("<span class=\"lime\">unamed text game</span> <span class=\"red\">v0.0.1</span><br><br>"

        + "Welcome to the unnamed text adventure game where you explore the world of unnamed!!!   " // really need a name for the game eventually lol

        + "standing before you is a terminal. to drive into depths of the internet, use the command <span class=\"lime\">start</span> "

        + "now. For help, type <span class=\"lime\">help</span>.");

    }

  }

  else if (verb == "debug") {

    try {

      if (args[1] == "on") {

        document.getElementById("dbgline").style.display = "block";

      }

      else {

        document.getElementById("dbgline").style.display = "none";

      }

    }

    catch (e) {

      // Ignore.

    }

  }

  else if (verb == "help") {

    var ret = "intro";

    if (isPlaying) {

      ret = "look";

    }

    display("<span class=\"yellow\">Help System</span><br><br>"

      + "This game is played with the use of typed commands. Commands begin with a verb, and "

      + "may contain other words as necessary. There are a number of different verbs you'll "

      + "encounter during the game, and they are noted by the use of <span class=\"lime\">lime green</span> "

      + "text.<br><br>"

      + "When a command was successful, the resulting text will usually have a <span class=\"yellow\">yellow</span> "

      + "title. <span class=\"red\">Red</span> otherwise.<br><br>"

      + "Some basic commands to get you started:<br>"

      + "<span class=\"lime\">intro</span> | Return to the introduction page (only when not currently playing the game).<br>"

      + "<span class=\"lime\">start</span> | Start a new game. You must <span class=\"lime\">quit</span> first if "

      + "you're currently playing.<br>"

      + "<span class=\"lime\">look</span> | Repeat the description of the room you're in.<br>"

      + "<span class=\"lime\">inventory</span> | See what's in your inventory.<br>"

      + "<span class=\"lime\">search</span> | Closely inspect an object.<br><br>"
      
      + "<span class=\"lime\">buy</span> | to buy an item from the market<br>"

      + "<span class=\"lime\">sell</span> | to sell an item to the market<br><br>"
      
      + "Remember you have to be a market location to use the buy or sell commands<br><br>"

      + "Some commands have aliases. <span class=\"lime\">examine</span> is an alias for <span class=\"lime\">search</span>. "

      + "The directional commands can be abbreviated as well.<br><br>"

      + "To return to where you were, type <span class=\"lime\">" + ret + "</span>.");

  }

  else if (verb == "look") {

    if (isPlaying) {

      // A special hack to refresh the camel shop.

      if (locale == "market") {

        gotoRoom("market");

      }

      else {

        display (descrip);

      }

    }

    else {

      display ("<span class=\"red\">You Can't Do That Here</span><br><br>"

        + "The <span class=\"lime\">look</span> command can only be used while playing "

        + "the game. Please type <span class=\"lime\">intro</span> to return to the front "

        + "screen.");

    }

  } else if (verb == "load"){
    	load();
    }

   else if (verb == "save"){

    save();
  }

  // lets say if verb

  else if (verb == "start") {

    // Starting a new game.

    if (isPlaying == 0) {

      isPlaying = 1;

      descrip = "<span class=\"yellow\">Welcome to unnamed</span><br><br>"

        + "Welcome to the darkside ! you have chosen to enter it and doing so will become my aprintence "

        + "I will teach you everything i know and one day you shall surpass my knowledge"

        + "Learn to cause anarchy and fight agiainst the worlds governments. "

        + "Introduce Anarchy and along the way. you will start infecting computers worldwide, "

        + "once you get enough tech you can start affecting larger networks<br><br>"

        + "Remember to use the compromised servers to your benifit. stealing financial infomation"

        + "is a good start and the compromised servers will allow you to profit by mining bitcoins"

        + "You will eventually have enough money to start bribing government officals to keep "

        + "from getting raided and rushed off to a maxiumn security prison, "

        + "<span class=\"orange\">Exits:</span> north."; // add something along the lines of telenet or other intresting hacking concepts or visit wesites to use carding methods etc etc.

      display (descrip);

      exitNorth = "well";

      exitSouth = "";

      exitEast  = "";

      exitWest  = "";

    }

    else {

      display("<span class=\"yellow\">You Can't Do That Here</span><br><br>"

        + "The <span class=\"lime\">start</span> command can only be used to start a new game. "

        + "Type <span class=\"lime\">look</span> to get a description of your current "

        + "surroundings.");

    }

  }

  else if (verb == "quit") {

    if (isPlaying) {

      resetVars();

      display ("<span class=\"yellow\">Game Abandoned</span><br><br>"

        + "You have quit playing the game. Please type <span class=\"lime\">intro</span> to "

        + "return to the front screen, or <span class=\"lime\">start</span> to start a new game.");

    }

  }

  else if (verb == "inventory") {

    // Check our inventory.

    if (isPlaying) {

      var txt = "<span class=\"yellow\">My Inventory</span><br><br>"

        + "You are wearing the adventurer's clothes that were present before you entered "

        + "the doorway to Honnalee. You had some Earth money in your pockets, but it was "

        + "washed away in the underground lake. You have <span class=\"yellow\">$" + money

        + "</span> of Honnalee money.<br><br>";



      if (hasCamel) {

        txt += "You have a camel to ride through the desert on. This thing cost you "

          + "<span class=\"yellow\">$500</span> of your hard-earned money.";

      }



      display (txt);

    }

    else {

      display ("<span class=\"red\">My Inventory</span><br><br>"

        + "You don't have an inventory, because you aren't playing the game.");

    }

  }

  else if (verb == "north") {

    // Can we travel north?

    if (exitNorth.length) {

      // Get the message for this room.

      gotoRoom(exitNorth);

    }

    else {

      display("<span class=\"yellow\">You Can't Go North</span><br><br>"

        + "North is not a valid exit from where you are. Type <span class=\"lime\">look</span> "

        + "again to find out where you are and where you can go.");

    }

  }

  else if (verb == "south") {

    // Can we travel south?

    if (exitSouth.length) {

      // Get the message for this room.

      gotoRoom(exitSouth);

    }

    else {

      display("<span class=\"yellow\">You Can't Go South</span><br><br>"

        + "South is not a valid exit from where you are. Type <span class=\"lime\">look</span> "

        + "again to find out where you are and where you can go.");

    }

  }

  else if (verb == "east") {

    // Can we travel east?

    if (exitEast.length) {

      // Get the message for this room.

      gotoRoom(exitEast);

    }

    else {

      display("<span class=\"yellow\">You Can't Go East</span><br><br>"

        + "East is not a valid exit from where you are. Type <span class=\"lime\">look</span> "

        + "again to find out where you are and where you can go.");

    }

  }

  else if (verb == "west") {

    // Can we travel west?

    if (exitWest.length) {

      // Get the message for this room.

      gotoRoom(exitWest);

    }

    else {

      display("<span class=\"yellow\">You Can't Go West</span><br><br>"

        + "West is not a valid exit from where you are. Type <span class=\"lime\">look</span> "

        + "again to find out where you are and where you can go.");

    }

  }
  else if (verb == "sell") {

    if (locale == "market2") {

      if (args.length >= 2) {

        //start item sell script here

        var matchFound = false;

        var item = "camel" , price = 500;

        if (args[1] == item) {



              matchFound = true;

            // Enough money?

            if (money == price) {

              money + price;

              // delete hasSword
              //removes camel

              display ("<span class=\"yellow\">Sound a "+  item + "!</span><br><br>"

                + "Congratulations");

            }

            else {

              display ("<span class=\"red\">error</span><br><br>"

                + "You don't have enough money yet to buy the "+  item + ".");

            }

          

        }



        item = "sword" , price = 100;

        if (args[1] == item) {



              matchFound = true;

            // Enough money?

            if (money >= price) {

              money = money - price;

              hasSword = 1;

              display ("<span class=\"yellow\">Bought a "+  item + "!</span><br><br>"

                + "Congratulations, you are now the proud owner of a trusty "

                + item + ". This steed will allow you to cross the desert quickly "

                + "and easily.");

            }

            else {

              display ("<span class=\"red\">Not Enough Money</span><br><br>"

                + "You don't have enough money yet to buy the "+  item + ".");

            }

          

        }

        //

        item = "water" , price = 100;

        if (args[1] == item) {



              matchFound = true;

            // Enough money?

            if (money >= price) {

              money = money - price;

              hasWater = 1;

              display ("<span class=\"yellow\">Bought a "+  item + "!</span><br><br>"

                + "Congratulations, you are now the proud owner of a trusty "

                + item + ". This steed will allow you to cross the desert quickly "

                + "and easily.");

            }

            else {

              display ("<span class=\"red\">Not Enough Money</span><br><br>"

                + "You don't have enough money yet to buy the "+  item + ".");

            }

          

        }





        if(!matchFound) { //encountered not in shop item, so ask again

          display ("<span class=\"red\">Buy Something</span><br><br>Buy what?");

        }

        //end buy script

    

      }

      else {

        display ("<span class=\"red\">Buy Something</span><br><br>Buy what?");

      }



    }else{

      display ("<span class=\"red\">This is not the market.</span><br><br>");

    }

  }



  else if (verb == "buy") {

    if (locale == "market") {

      if (args.length >= 2) {

        //start item buy script here

        var matchFound = false;

        var item = "camel" , price = 500;

        if (args[1] == item) {



              matchFound = true;

            // Enough money?

            if (money >= price) {

              money = money - price;

              hasCamel = 1;

              display ("<span class=\"yellow\">Bought a "+  item + "!</span><br><br>"

                + "Congratulations, you are now the proud owner of a trusty "

                + item + ". This steed will allow you to cross the desert quickly "

                + "and easily.");

            }

            else {

              display ("<span class=\"red\">Not Enough Money</span><br><br>"

                + "You don't have enough money yet to buy the "+  item + ".");

            }

          

        }



        item = "sword" , price = 100;

        if (args[1] == item) {



              matchFound = true;

            // Enough money?

            if (money >= price) {

              money = money - price;

              hasSword = 1;

              display ("<span class=\"yellow\">Bought a "+  item + "!</span><br><br>"

                + "Congratulations, you are now the proud owner of a trusty "

                + item + ". This steed will allow you to cross the desert quickly "

                + "and easily.");

            }

            else {

              display ("<span class=\"red\">Not Enough Money</span><br><br>"

                + "You don't have enough money yet to buy the "+  item + ".");

            }

          

        }

        //

        item = "water" , price = 100;

        if (args[1] == item) {



              matchFound = true;

            // Enough money?

            if (money >= price) {

              money = money - price;

              hasWater = 1;

              display ("<span class=\"yellow\">Bought a "+  item + "!</span><br><br>"

                + "Congratulations, you are now the proud owner of a trusty "

                + item + ". This steed will allow you to cross the desert quickly "

                + "and easily.");

            }

            else {

              display ("<span class=\"red\">Not Enough Money</span><br><br>"

                + "You don't have enough money yet to buy the "+  item + ".");

            }

          

        }





        if(!matchFound) { //encountered not in shop item, so ask again

          display ("<span class=\"red\">Buy Something</span><br><br>Buy what?");

        }

        //end buy script

    

      }

      else {

        display ("<span class=\"red\">Buy Something</span><br><br>Buy what?");

      }



    }else{

      display ("<span class=\"red\">This is not the market.</span><br><br>");

    }

  }

  else if (verb == "search") {

    if (args.length >= 2) {

      if (args[1] == "flowers" || args[1] == "plants" || args[1] == "vegetation") {

        // We ARE in the garden, right?

        if (locale == "garden") {

          // Did we already get the secret here?

          if (monFlowers) {

            display ("<span class=\"yellow\">Searching the Flowers</span><br><br>"

              + "After hours of frantic digging around in the flowers, you "

              + "turn up absolutely nothing of use to you.");

          }

          else {

            display ("<span class=\"yellow\">Searching the Flowers</span><br><br>"

              + "You thoroughly comb through the flowerbed, leaving no square inch "

              + "of soil unchecked, and collect a total of <span class=\"yellow\">$120</span> "

              + "in loose coins.");

            monFlowers = 1;

            money = money + 120;

          }

        }

        else {

          display ("<span class=\"red\">Search Something</span><br><br>"

            + "I don't know what you're on, but there are no flowers here.");

        }

      }

      else if (args[1] == "flask" || (args[1] == "ye" && args[2] == "flask")) {

        // We ARE in the cellar, right?

        if (locale == "cellar") {

          display ("<span class=\"yellow\">Examine Ye Flask</span><br><br>"

            + "The flask is hanging on the wall of the cellar. Upon closer inspection, "

            + "the flask appears to be full of coins. It's just out of reach, but is "

            + "barely hanging on the wall. If only you had something to <span class=\"lime\">throw</span>"

            + " at them... but you don't have much in your <span class=\"lime\">inventory</span>.");

        }

        else {

          display ("<span class=\"red\">Examine Ye Flask</span><br><br>"

            + "There is no flask here. What are you talking about?");

        }

      }

      else {

        display ("<span class=\"red\">Search Something</span><br><br>"

          + "There aren't any \"" + args[1] + "\" in sight. And if there were, they aren't "

          + "really worth such a close inspection.");

      }

    }

    else {

      display ("<span class=\"red\">Search Something</span><br><br>"

        + "Search what?");

    }

  }

  else if (verb == "take") {

    console.log(locale);

    if (args.length >= 2) {

      // Ignore ye's

      if (args.length >= 3) {

        if (args[1] == "ye") {

          args[1] = args[2];

        }

      }



      





      if (args[1] == "flask") {

        // We ARE in the cellar, right?

        if (locale == "cellar") {

          // Ye can't get ye flask.

          display ("<span class=\"red\">Get Ye Flask</span><br><br>"

            + "You can't get ye flask.");

        }

        else {

          display ("<span class=\"red\">Get Ye Flask</span><br><br>"

            + "There is no flask here. What are you talking about?");

        }

      }

      //add:for  take items

      else if(args[1] == "gold" && locale =="testingroom"){

        display("<span class=\"red\">Got gold, acquared 10000 money</span><br><br>.");

        money += 10000;

      }

      else {

        display ("<span class=\"red\">Get Something</span><br><br>"

          + "You can not get ye " + args[1] + ".");

      }

    }

    else {

      display ("<span class=\"red\">Get Something</span><br><br>"

        + "Get what?");

    }

  }

  else if (verb == "throw") {

    if (args.length >= 2) {

      if (args[1] == "money") {

        // Do we have money?

        if (money > 0) {

          // We ARE in the cellar, right?

          if (locale == "cellar" && monFlask == 0) {

            // Throw the money at the flask.

            money = money - 36;

            money = money + 750;

            display ("<span class=\"yellow\">Throw Money</span><br><br>"

              + "You nearly empty out your pockets throwing coins at the flask. "

              + "Finally, a few dozen coins later, the flask falls to the ground "

              + "and shatters. Inside, you collect an amazing "

              + "<span class=\"yellow\">$750</span> in coins. You lost "

              + "<span class=\"yellow\">$36</span> trying to knock the flask free, "

              + "so now you're up to <span class=\"yellow\">$" + money + "</span> "

              + "in your wallet.");

            monFlask = 1;

          }

          else {

            display ("<span class=\"red\">Throw Money</span><br><br>"

              + "You'd rather not waste your money. You've gotta save up to buy "

              + "that camel.");

          }

        }

        else {

          display ("<span class=\"red\">Throw Money</span><br><br>"

            + "You'd love to throw some money around, but you don't have any.");

        }

      }

      //add: throw

      else if(args[1] == "sword" && locale =="testingroom"){

        display("<span class=\"red\">You threw your sword.</span><br><br>.");

        hasSword =0;

      }

      else {

        display ("<span class=\"red\">Throw Something</span><br><br>"

          + "You do not have a \"" + args[1] + "\" that you could part with.");

      }

    }

    else {

      display ("<span class=\"red\">Throw Something</span><br><br>"

        + "Throw what?");

    }

  }

  else if (verb == "fuck") {

    if (msg.length >= 2) {

      if (args[1] == "you") {

        display ("<span class=\"red\">Fuck you, too.</span>");

      }

      else {

        display("<span class=\"red\">Unrecognized command:</span> You don\'t need to use the word \""

          + verb + "\" in this game.");

      }

    }

    else {

      display("<span class=\"red\">Unrecognized command:</span> You don\'t need to use the word \""

        + verb + "\" in this game.");

    }

  }

  else if (verb == "icheat") {

    // a developers way to cheat in the game

    money      = money + 500;

    monFlowers = 1;

    monFlask   = 1;

    hasCamel   = 1;
    
    display("you cheated");


    

  }

  else if (verb == "replay") {

    display ("<span class=\"yellow\">Replay</span><br><br>"

      + "So, you've beaten the game, huh? Here are a few neat things you might not have tried:<br><br>"

      + "- Have you wandered off into the desert without a camel?<br>"

      + "- Have you wandered into the northern desert WITH a camel?<br>"

      + "- Have you tried throwing objects or examining things that weren't there?<br>"

      + "- Have you tried swearing at the game, or dropping an F bomb at it?<br><br>"

      + "<span class=\"yellow\">About The Game</span><br><br>"

      + "This game was programmed on October 6, 2007, by Casey Kirsle as an assignment "

      + "to \"find or create a JavaScript to impress\" for his web design class. To be the most "

      + "original, he decided to write his own scripts rather than \"find\" them, and the best "

      + "way to make an original script: make a game out of it.<br><br>"

      + "Plus, he just wanted to play around with giving the user the ability to \"type\" things, "

      + "without actually using textboxes. Fun stuff.<br><br>"

      + "This game didn't go too in-depth because it didn't have any real direction from the "

      + "beginning, and everything \"special\" in the game, such as throwing money at the flask, "

      + "had to be hardcoded in there. I would've preferred an object-oriented approach, but didn't "

      + "think of that at the time. So, this is just a proof-of-concept and an interesting "

      + "demonstration of JavaScript.<br><br>"

      + "<a href=\"http://www.cuvou.com/\">Cuvou.com</a>");

  }

  else {

    display("<span class=\"red\">Unrecognized command:</span> You don\'t need to use the word \""

      + verb + "\" in this game.");

  }

}



// Put something to display.

function display(msg) {

  document.getElementById("view").innerHTML = msg;

}



/***************************************************

 * Handle all the rooms.                           *

 ***************************************************/



function gotoRoom (room) {

  locale = room;

  switch (room) {

    case "well":

      descrip = "<span class=\"yellow\">Bottom of the Well</span><br><br>"

        + "You swim towards the light, and sooner than you realize, there appears to be "

        + "land below you. Climbing up out of the water, you continue walking towards "

        + "the light, higher up on this shallow hill of mud. You eventually come to what "

        + "appears to be a tall stone wall, with a hole in it just big enough for you to "

        + "fit through. Climbing through the hole, you fall a good ten feet and land in "

        + "more water. The light you saw before is now directly above you, and is much "

        + "brighter here.<br><br>"

        + "Coming to your senses, you realize you're at the bottom of what appears to be "

        + "a well. There is a ladder carved into the stone wall to the east, which looks "

        + "like a way up to the top.<br><br>"

        + "<span class=\"orange\">Exits:</span> east";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "oasis";

      exitWest  = "";

      break;

    case "oasis":

      descrip = "<span class=\"yellow\">Village Oasis</span><br><br>"

        + "Climbing to the top of the well, you can finally get a good look at the "

        + "land of Honnalee. Or, at least, how much of it you're able to see. You seem "

        + "to be at the center of a small village. There are dusty roads going in almost "

        + "all directions, the light brown sand slicing through the vibrant green grass "

        + "of the field. In the far distance in each direction appears to be nothing but "

        + "desert, though.<br><br>"

        + "The nearby houses seem to be old and dated. There doesn't appear to be much "

        + "sign of life around here, though, except that the grass appears to have recently "

        + "been cut. To the north you hear a lot of noise.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, east, west";

      display (descrip);

      exitNorth = "market";

      exitSouth = "road";

      exitEast  = "garden";

      exitWest  = "well";

      break;

    case "market":

      descrip = "<span class=\"yellow\">Marketplace</span><br><br>"

        + "You arrive at the north end of town at what appears to be a marketplace. "

        + "This seems to be the popular spot of the whole village, as everybody "

        + "who lives around here seems to be present. You get some strange looks "

        + "from the villagers as you walk by, because it's obvious to them that "

        + "you're not from around here. If they knew you crawled out of the well, "

        + "though, they'd probably start a lynch mob, so you'd better keep that "

        + "information to yourself for now.<br><br>"

        + "There's a shop here that seems to sell camels for traveling across the "

        + "desert, but the price tag is more money than you have with you.<br><br>"

        + "To <span class=\"lime\">buy</span> a camel would cost $500. You "

        + "To <span class=\"lime\">buy</span> a sword would cost $500. You "

        + "To <span class=\"lime\">buy</span> a water would cost $500. You "

        + "currently have <span class=\"yellow\">$" + money + "</span> with you.<br><br>"

        + "To the north is the open desert. South leads back to the village oasis.<br><br>"

        + "To the east is the open testing room.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south,east";

      display (descrip);

      exitNorth = "northgate";

      exitSouth = "oasis";

      exitEast  = "testingroom";

      exitWest  = "";

      break;

    case 'server': // make the server hacka

      descrip = "<span class=\"yellow\">SECURE SERVER/span><br><br>"

        + "make this server hackable some howbr/>"

        + "<span class=\"orange\">Exits:</span> west,east";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "market2";

      exitWest  = "market";



    break;




    case 'testingroom':

      descrip = "<span class=\"yellow\">Testing room</span><br><br>"

        + "To test throw,take,item<br/>"



        + "You see a shiny thing inside the room, enter take gold to get<br/>"

        + "Try throwing a sword you got from marketplace, ex: throw sword"





        + "To the west is the marketplace.<br><br>"

        + "<span class=\"orange\">Exits:</span> west,east";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "market2";

      exitWest  = "market";



    break;

    case 'market2':

      descrip = "<span class=\"yellow\">Testing room</span><br><br>"

        + "To test throw,take,item<br/>"



        + "You see a shiny thing inside the room, enter take gold to get<br/>"

        + "Try throwing a sword you got from marketplace, ex: throw sword"





        + "To the west is the marketplace.<br><br>"

        + "<span class=\"orange\">Exits:</span> west";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "";

      exitWest  = "";



    break;



    case "garden":

      descrip = "<span class=\"yellow\">Flower Garden</span><br><br>"

        + "This particular corner of the village seems to be the most vibrant with "

        + "organic plant life. All around you are hundreds of colorful flowers. There's "

        + "an exit to the desert further to the east, but you'd have to walk through "

        + "these flowers to get to it, and there's nothing out there that looks worth "

        + "the effort.<br><br>"

        + "The vegetation is thick, and you can't even see the ground around you. "

        + "Something could easily be hidden around here.";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "";

      exitWest  = "oasis";

      break;

    case "road":

      descrip = "<span class=\"yellow\">Dusty Road</span><br><br>"

        + "You find yourself standing on what appears to be the main road into this "

        + "village. The path is all sandy and dusty, with a crudely laid-down stone "

        + "road beneath your feet. Suddenly you're glad to be wearing shoes--even "

        + "though they were soaked during your mid-day swim in the underground lake--"

        + "because those rocky slates don't look like they would feel that great on "

        + "bare feet.<br><br>"

        + "To the north is the familiar green center-of-the-village where you crawled "

        + "out of the well, like some kind of slimy demon from the underworld that "

        + "the villagers would probably fear, had any of them been there to see it.<br><br>"

        + "To the south is some more wide open desert. There's an open door on the "

        + "building to your right.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, west";

      display (descrip);

      exitNorth = "oasis";

      exitSouth = "southgate";

      exitEast  = "";

      exitWest  = "cellar";

      break;

    case "cellar":

      descrip = "<span class=\"yellow\">Cellar</span><br><br>"

        + "You enter a doorway which immediately leads to a flight of stairs, going "

        + "into the ground. Down here appears to be a cellar, although it's not very "

        + "well stocked. You're not as far underground as you were at the bottom of "

        + "the well, but still you get the eery feeling that the walls could cave "

        + "in on you and let all that underground water flood the entire room.<br><br>"

        + "There is a flask hanging on the wall.<br><br>"

        + "<span class=\"orange\">Exits:</span> east";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "road";

      exitWest = "";

      break;

    case "northgate":

      descrip = "<span class=\"yellow\">North Gate</span><br><br>"

        + "You stand at the north gate to the village. All you see ahead of you "

        + "is an endless desert. You really shouldn't proceed on your own; you may "

        + "get lost or killed out there.<br><br>"

        + "The village entrance is to your south.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, east, west</span>";

      display (descrip);

      exitNorth = "north1";

      exitSouth = "market";

      exitEast  = "north1";

      exitWest  = "north1";

      break;

    case "southgate":

      descrip = "<span class=\"yellow\">South Gate</span><br><br>"

        + "You stand at the south gate to the village. There is plenty of sand around, "

        + "with some very vague outlines of some mountains off in the southern horizon. You "

        + "couldn't hope to make it to the mountains on your own; you'd either get "

        + "lost or killed out there.<br><br>"

        + "The village is to the north.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, east, west</span>";

      display (descrip);

      exitNorth = "road";

      exitEast  = "north1";

      exitWest  = "north1";



      // Do we have the camel?

      if (hasCamel) {

        exitSouth = "mountain";

      }

      else {

        exitSouth = "north1";

      }



      break;

    case "north1":

      descrip = "<span class=\"yellow\">Desert</span><br><br>"

        + "You wander aimlessly around in the desert. All you can see "

        + "in any direction is sand. Nothing but sand as far as the eye can see.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, east, west</span>";

      display (descrip);

      exitNorth = "north2";

      exitSouth = "north2";

      exitEast  = "north2";

      exitWest  = "north2";

      break;

    case "north2":

      descrip = "<span class=\"yellow\">Desert</span><br><br>"

        + "You're still hopelessly clueless about where in the world you are. If you "

        + "don't find your way back to civilization soon, you may die out here.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, east, west</span>";

      display (descrip);

      exitNorth = "north3";

      exitSouth = "north3";

      exitEast  = "north3";

      exitWest  = "north3";

      break;

    case "north3":

      descrip = "<span class=\"yellow\">Desert</span><br><br>"

        + "You're really wishing the sun would just go away right about now. It's "

        + "bad enough that you're hopelessly lost in the desert, but the sun beating "

        + "down on you isn't helping at all.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south, east, west</span>";

      display (descrip);



      // If we have the camel, we're saved.

      if (hasCamel) {

        exitNorth = "northgate";

        exitSouth = "northgate";

        exitEast  = "northgate";

        exitWest  = "northgate";

      }

      else {

        exitNorth = "thirst";

        exitSouth = "thirst";

        exitEast  = "thirst";

        exitWest  = "thirst";

      }

      break;

    case "thirst":
      descrip = "<span class=\"red\">Death By Dehydration</span><br><br>"

        + "You got yourself hopelessly lost in the desert and eventually collapsed out "

        + "of dehydration and died, never to be found again.<br><br>"

        + "This is Game Over. You can return to the front screen by typing "

        + "<span class=\"lime\">intro</span>, or type <span class=\"lime\">start</span> "

        + "to start the game over.";

      display (descrip);

      resetVars();

      break;

    case "mountain":

      descrip = "<span class=\"yellow\">Mountains</span><br><br>"

        + "Standing at the base of this rocky mammoth, the mountains that looked so "

        + "small from the village are suddenly much larger. There is a path leading "

        + "up the side of the mountain to what looks like a shrine of some sort at the "

        + "top.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south";

      display (descrip);

      exitNorth = "southgate";

      exitSouth = "hill";

      exitEast  = "";

      exitWest  = "";

      break;

    case "hill":

      descrip = "<span class=\"yellow\">Mountain Trail</span><br><br>"

        + "You stand about halfway up the mountain trail, between the desert below "

        + "and the shrine higher up.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south";

      display (descrip);

      exitNorth = "mountain";

      exitSouth = "shrine";

      exitEast  = "";

      exitWest  = "";

      break;

    case "hs": // stands for hacked servers

      descrip = "<span class=\"yellow\">Hacked Servers/span><br><br>"
        + "GOod job you hacked into a server.<br><br>"
        // adding benifits for hacking into the server seems nice too add too. for now its just a small code added for a later time
        + "<span class=\"orange\">Exits:</span>";

      display (descrip);

      exitNorth = "";

      exitSouth = "";

      exitEast  = "";

      exitWest  = "";

      break;

    case "shrine":

      descrip = "<span class=\"yellow\">Shrine</span><br><br>"

        + "The shrine is a wide open building, circular-shaped with six pillars "

        + "holding up a domed roof. In the center is what appears to be a doorway. "

        + "It's much like the door that you entered to get here, but this one shines "

        + "in a bright white light, as opposed to the all-consuming darkness of the "

        + "first door.<br><br>"

        + "<span class=\"orange\">Exits:</span> north, south";

      display (descrip);

      exitNorth = "hill";

      exitSouth = "home";

      exitEast  = "";

      exitWest  = "";

      break;
      

    case "home":

      describ = "<span class=\"yellow\">Homeworld</span><br><br>"

        + "Being sucked through this doorway just like the black one, you enter a "

        + "state of freefall, this time in a field of brilliant light instead of darkness. "

        + "And this time, instead of having soft water to land in, you smack into a hard "

        + "floor. However, like falling into the water, it doesn't hurt as much as you'd "

        + "otherwise have anticipated. The bright light ceases, and it takes your eyes "

        + "a while to adjust to the normal lighting of the rest of the room. After your "

        + "strange adventure in the land of Honnalee, you eventually come to recognize "

        + "your surroundings. You're back on Earth, in front of the door of darkness that "

        + "took you to that weird world.<br><br>"

        + "<span class=\"lime\">Congratulations. You win.</span><br><br>"

        + "Type <span class=\"lime\">intro</span> to return to the front screen. As a little "

        + "extra reward for completing the game, you can use the command <span class=\"lime\">replay</span> "

        + "at any time for some extra tips and information about the game.<br><br>"

        + "<span class=\"orange\">JavaScript Copyright &copy; 2007</span> <span class=\"yellow\">Casey Kirsle</span>";

      display (describ);

      resetVars();

      break;

    default:

      display ("<span class=\"red\">Service Error:</span>  the website " + room + " doesn't exist. "

        + "Type <span class=\"lime\">look</span> to return to where you were.");

      break;

  }

}



/***************************************************

 * Handle aliases to verbs.                        *

 ***************************************************/



function verbAliases(verb) {

  switch (verb) {

    case "n":

      verb = "north";

      break;

    case "s":

      verb = "south";

      break;

    case "e":

      verb = "east";

      break;

    case "w":

      verb = "west";

      break;

    case "view":

      verb = "look";

      break;

    case "examine":

      verb = "search";

      break;

    case "items":

      verb = "inventory";

      break;

    case "inv":

      verb = "inventory";

      break;

    case "get":

      verb = "take";

      break;

    default:

      // Nothing.

  }



  return verb;

}



/***************************************************

 * Translate key codes to keys.                    *

 ***************************************************/



function getKey(code) {

  var map = new Array();

  map[48] = '0';

  map[49] = '1';

  map[50] = '2';

  map[51] = '3';

  map[52] = '4';

  map[53] = '5';

  map[54] = '6';

  map[55] = '7';

  map[56] = '8';

  map[57] = '9';

  map[81] = 'q';

  map[87] = 'w';

  map[69] = 'e';

  map[82] = 'r';

  map[84] = 't';

  map[89] = 'y';

  map[85] = 'u';

  map[73] = 'i';

  map[79] = 'o';

  map[80] = 'p';

  map[65] = 'a';

  map[83] = 's';

  map[68] = 'd';

  map[70] = 'f';

  map[71] = 'g';

  map[72] = 'h';

  map[74] = 'j';

  map[75] = 'k';

  map[76] = 'l';

  map[90] = 'z';

  map[88] = 'x';

  map[67] = 'c';

  map[86] = 'v';

  map[66] = 'b';

  map[78] = 'n';

  map[77] = 'm';

  map[219] = '[';

  map[221] = ']';

  map[186] = ';';

  map[222] = "'";

  map[188] = ',';

  map[190] = '.';



  // special characters

  map[32] = ' '; // space

  map[8]  = '<BACKSPACE>';

  map[13] = '<RETURN>';



  var result = '';

  try {

    result = map[code];

  }

  catch (e) {

    result = '';

  }



  return result;

}
