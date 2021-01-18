/*
AudioWorkout - Mobile Application
Code by Michael Conor Dever
*/

//-----------------||Document Ready Function||-----------------//
//-------------------------------------------------------------//
//Performs everything in the loop on pageload------------------//

$(document).ready(function () {
    
    //-----------------||Global Declarations||-----------------//
    //---------------------------------------------------------//
    //---------------------------------------------------------//
    //-----------------||HTML Element Globals||----------------//
    //---------------------------------------------------------//
    //// Declares HTML Elements as Javascript variables---------//
    var playBtn = document.getElementById("playBtn");
    var pauseBtn = document.getElementById("pauseBtn");
    var leftBtn = document.getElementById("leftBtn");
    var menuTitle = document.getElementById("menuTitle");
    var displayUserScore = document.getElementById("displayUserScore");
    var displaySettingsUserScore = document.getElementById("displaySettingsUserScore");
    var quizTitle = document.getElementById("quizTitle");
    var questionsLayout = document.getElementById("questionsLayout");
    
    
    //-----------------||Javascript Quiz Globals||------------------//
    //------------------------------------------------------------------//
    // Declares Javascript variable globals used within the quiz section//
    const quizGame = document.getElementById("quizGame");
    const question = document.getElementById("question");
    const choiceA = document.getElementById("A");
    const choiceB = document.getElementById("B");
    const choiceC = document.getElementById("C");
    const progress = document.getElementById("progress");
    const scoreDiv = document.getElementById("scoreContainer");
    var secondChoce = 2;
    var questions = [4];
    const lastQuestion = 4;
    let runningQuestion = 0;
    let score = 0;
    
    
    
    //-----------------||Javascript Variable Globals||------------------//
    //------------------------------------------------------------------//
    // Declares Javascript variable globals used throughout application-//
    
    // Used within frequency game generator
    var freq;
    var freq2;
    var freq3;
    
    // Used with chord game generator
    var midiNote;
    var midiNote2;
    var midiNote3;
    var chordType;
    var chordType2;
    var chordType3;
    
    // Used with interval game generator
    var intervalType;
    var intervalType2;
    var intervalType3;
    
    // Generates intial user score
    var userScore = 0;
    
    // Display User Score on Settings
    displaySettingsUserScore.innerHTML = userScore;
    
    //-----------------|Declare Tone.js Elements|--------------//
    //---------------------------------------------------------//
    
    // Monophonic synth to play intervals
    var monoSynth = new Tone.Synth().toMaster();
    
    // Polyphone synth to play chords
    var polySynth = new Tone.PolySynth(3, Tone.Synth, {
        "volume": 0,
        "oscillator": {},
        "portamento": 0.005
    }).toMaster();
    
    // Sine
    var sine = new Tone.Oscillator(freq, "sine").toMaster();

    //-----------------|Declare NEXUS UI Elements|--------------//
    //---------------------------------------------------------//
    var loopToggle = new Nexus.Toggle('#loopToggle', {
        'size': [40, 20],
        'state': true
    })
    
    // Colour UI Slider
    loopToggle.colorize("accent", "teal")
    loopToggle.colorize("fill", "#333")

    //--------------------| START AUDIO FUNCTION |----------------------//
    // This function changes the CSS style properities of the play/pause
    // buttons within the quiz section of the application 
    function startAudio() {
        //Hide play button
        playBtn.style = "display: none;";
        // show pause button
        pauseBtn.style = "display: unset;";
    }

    //--------------------| STOP AUDIO FUNCTION |----------------------//
    // This function changes the CSS style properities of the play/pause
    // buttons within the quiz section of the application and also stops
    // the transport and oscillators 
    function stopAudio() {
        // show play button
        playBtn.style = "display: unset;";
        // hide pause button
        pauseBtn.style = "display: none;";
        // stop Tone.js transport 
        Tone.Transport.stop();
        // stop the sine oscillator
        sine.stop(1);
    }

    //--------------| GENERATE RANDOM FREQUENCY FUNCTION |---------------//
    // This function generates a random frequency every times it's called
    // The generation of that frequency is done a chance basis to select
    // frequencies that can be heard through a phone's speaker
    function genRanFreq() {
        //Generating a random number between 1 and 100 (Percentage%)
        freq = (Math.random() * 100).toFixed(1);
        
        // 80% chance that the frequency generated is between 150 Hz
        // and 10 kHz
        if (freq <= 80) {
            freq = Math.floor(Math.random() * (10000 - 150 + 1)) + 150;
        } 
        // 15% chance its between 10 kHz and 20 kHz
        else if (freq <= 95 && freq > 80) {
            freq = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
        } 
        // 5% chance its below 150 Hz (not easily replicated on a phone speaker)
        else {
            freq = Math.floor(Math.random() * (150 - 0 + 1)) + 0;
        }
        
        // This generates a second random frequency used as a possibile outcome within the quiz element
        // It generates a number +/- 1000 Hz of the random frequency generated above
        freq2 = Math.floor(Math.random() * ((freq + 1000)  - (freq - 1000) + 1)) + (freq - 1000);
        
        // Loops around until the two random frequencies aren't equal to each other
        while (freq2 === freq || freq2 <0)
            {
                freq2 = Math.floor(Math.random() * ((freq + 1000)  - (freq - 1000) + 1)) + (freq - 1000);
            }
        
        
        // This generates a third random frequency used as a possibile outcome within the quiz element
        // It generates a number +/- 1000 Hz of the random frequency generated above
        freq3 = Math.floor(Math.random() * ((freq + 1000)  - (freq - 1000) + 1)) + (freq - 1000);
        
        // Loops around until the two random frequencies aren't equal to each other
        while (freq3 === freq2 || freq3 <0)
            {
                freq2 = Math.floor(Math.random() * ((freq + 1000)  - (freq - 1000) + 1)) + (freq - 1000);
            }
        
    }
    
    //--------------| GENERATE RANDOM MIDI NOTE |---------------//
    // This function generates a random midi note every times it's called
    // The generation of that frequency is done a chance basis to select
    // frequencies that can be heard through a phone's speaker
    function genRanNote() {
        
        //Generating a random number between 1 and 100 (Percentage%)
        midiNote = (Math.random() * 100).toFixed(1);
        
       // 97% chance that the frequency generated is between 36 (C2) and 71 (B4)
        if (midiNote <= 100) {
            midiNote = Math.floor(Math.random() * (71 - 36 + 1)) + 36;;
        } 
        
        // 2% chance it's above 71 (B4), high registers people are unfamilar with
        else if (midiNote <= 97 && midiNote > 99) {
            midiNote = Math.floor(Math.random() * (127 - 72 + 1)) + 72;;
        } 
        
        // 1% chance it's below C2, bass clef not easily heard on phone speaker
        else {
            midiNote = Math.floor(Math.random() * (35 - 0 + 1)) + 0;
        }
    }
    
    //--------------| GENERATE RANDOM INTERVAL |---------------//
    // This function generates a musical interval every times it's called
    // The generation of the interval is performed from a section of arrays
    // The variable argument is the midiNote variable populated by genRanNote()
    function genRanInterval(int) {
        
        // An array of all the semi tones, which added to the midiNote will produce the interval
        var semiToneArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        
        // An array of all the interval names
        var intervalTypeArray = ["Minor 2nd", "Major 2nd", "Minor 3rd", "Major Third", "Perfect 4th", "Augmented 4th", "Perfect 5th", "Minor 6th", "Major 6th", "Minor 7th", "Major 7th", "Octave"]
        
        // Creates a random variable that generates a step from 0 - 11 (12 possible outcomes, same length as the arrays above)
        var ranStep = Math.floor(Math.random() * (11 - 0 + 1)) + 0;
        
        // int = midiNote - input of function
        // midiNote2 is the midiNote + the selection from the semitone array
        midiNote2 = int + semiToneArray[ranStep];
        
        // the intervalType variable is used to populate answers for the quiz
        intervalType = intervalTypeArray[ranStep];

        // generates a second intervalType for the quiz
        intervalType2 = intervalTypeArray[Math.floor(Math.random() * intervalTypeArray.length)];

        // Generate Random Answer again if intervalTypes are the same
        while (intervalType2 === intervalType) {

            intervalType2 = intervalTypeArray[Math.floor(Math.random() * intervalTypeArray.length)];
        }

        // Generate Random Interval Answers for quiz
        intervalType3 = intervalTypeArray[Math.floor(Math.random() * intervalTypeArray.length)];
        // Generate Random Answer again if intervalTypes are the same
        while (intervalType3 === intervalType2 || intervalType3 === intervalType) {

            intervalType3 = intervalTypeArray[Math.floor(Math.random() * intervalTypeArray.length)];
        }
    }
    
    //--------------| GENERATE RANDOM CHORD |---------------//
    // This function generates a musical chord every times it's called
    // The generation of the interval is performed from a section of arrays
    // The variable argument is the midiNote variable populated by genRanNote()
    function genRanChord(int) {
        
        // semi tone values array for the creation of the chord
        var triads = [[0, 4, 7], [0, 3, 7], [0, 3, 6], [0, 4, 8]];
        
        // chord name array
        var triadNames = ["Major Triad", "Minor Triad", "Diminished Triad", "Augmented Triad"];
        
        // Generates a random number between 0 and 3
        var ranStep = Math.floor(Math.random() * triadNames.length);
        
        // This selects from the index generated by the random number
        // and the second item within that index (second semi-Tone)
        midiNote2 = int + triads[ranStep][1];
        // and the third item within that index (third semi-Tone)
        midiNote3 = int + triads[ranStep][2];
        
        // Generates a chord name using a Tone.js midi note to note name convertor
        // Pushed together with the chord type generated from the chord name array
        // Creating a full chord name in the format "C#2 Minor Triad"
        chordType = Tone.Frequency(int, "midi").toNote() + " " + triadNames[ranStep];

        // Generate other chord types to populate quiz
        chordType2 = Tone.Frequency(int, "midi").toNote() + " " + triadNames[Math.floor(Math.random() * triadNames.length)];

        // Generate Random Answer again if chordTypes are the same
        while (chordType2 === chordType) {

            chordType2 = Tone.Frequency(int, "midi").toNote() + " " + triadNames[Math.floor(Math.random() * triadNames.length)];
        }

        // Generate random chord Type for the quiz
        chordType3 = Tone.Frequency(int, "midi").toNote() + " " + triadNames[Math.floor(Math.random() * triadNames.length)];
        // Generate Random Answer again if chordTypes are the same
        while (chordType3 === chordType || chordType3 === chordType2) {

            chordType3 = Tone.Frequency(int, "midi").toNote() + " " + triadNames[Math.floor(Math.random() * triadNames.length)];

        }
    }
    
    //--------------| PLAY INTERVAL FUNCTION |---------------//
    // This function plays a msusical every times it's called using Tone.js
    // It also controls the functionality of the transport buttons within the
    // interval quiz section of the application
    // input variables are midiNote and midiNote2
    function playInterval(int, int2) {
        
        // Disconnects the tone.js chord synth
        polySynth.disconnect();
        // Connects the tone.js interval synth
        monoSynth.toMaster();

        // Convert Midi Note To Frequency
        var note1 = Nexus.mtof(int);
        var note2 = Nexus.mtof(int2);

        // Create Array of Notes
        var notes = [note1, note2];

        // Index Counter For Loop
        var index = 0;
        
        // Create a Tone.js repeat function (used to loop sound)
        // Repeats after one measure "1m" (one bar)
        Tone.Transport.scheduleRepeat(function (time) {
            repeat(time);
        }, "1m");
        
        // Create a Tone.js repeat function (used to loop sound)
        // Repeats after one measure "1m" (one bar)
        function repeat(time) {
            // %modulo around the whole notes array
            var note = notes[index % notes.length];
            // Play each note for a 1/4 note "4n"
            monoSynth.triggerAttackRelease(note, "4n", time);
            // advance loop index
            index++;
            
            // break out of the function if the Nexus UI loop toggle is off
            // Only happens after the second note is played, so whole interval is heard
            if (loopToggle.state === false && index === 2) {
                
                // Stop the tone.js transport and change style of play/pausebuttons
                stopAudio();
            }

        }

        // start playback
        Tone.Transport.start();
        // Change state of play/pause
        startAudio();
        
        // If pause button is clicked stop the audio
        $("#pauseBtn").click(function () {
            // stop playback t/o 500ms
            setTimeout(stopAudio(), 500);
        });
        
        // If the loopToggle is turned to off then pause after the second note is heard
        loopToggle.on('change', function (v) {
            if (loopToggle.state === false && index === 2) {
                // stop playback t/o 500ms
                setTimeout(stopAudio(), 500);
            }
        });

    }
    
    //--------------| PLAY CHORD FUNCTION|---------------//
    // This function plays a chord every times it's called using Tone.js
    // It also controls the functionality of the transport buttons within the
    // chord game section of the application
    // input variables are midiNote, midiNote2 and midiNote3
    function playChord(int, int2, int3) {
        
        // Disconnects the monoSynth used by playInterval()
        monoSynth.disconnect();
        // Connects the polySynth needed to play chords
        polySynth.toMaster();
        // Convert Midi Note To Frequency
        var chordNote1 = Nexus.mtof(int);
        var chordNote2 = Nexus.mtof(int2);
        var chordNote3 = Nexus.mtof(int3);

        // Index Counter For Loop
        var index = 0;
        
        // Create a Tone.js repeat function (used to loop sound)
        // Repeats after one measure "1m" (one bar)
        Tone.Transport.scheduleRepeat(function (time) {
            repeat(time);
        }, "1m");

        function repeat(time) {
            // Play chord for a 1/4 note "4n"
            polySynth.triggerAttackRelease([chordNote1, chordNote2, chordNote3], "4n");
            
            // advance index
            index++;
            
            // break out of the function if the Nexus UI loop toggle is off
            // Only happens after the second note is played, so whole chord is heard at least twice
            if (loopToggle.state === false && index === 2) {
                // Stops tone.js transport and changes state of play/pause buttons
                stopAudio();
            }

        }

        // start playback
        Tone.Transport.start();
        // Change state of play/pause
        startAudio();
            
        // If pause button is clicked stop playback
        $("#pauseBtn").click(function () {
            // stop playback
            setTimeout(stopAudio(), 500);
        });
        
        // If loop button is turned off stop playback
        loopToggle.on('change', function (v) {
            if (loopToggle.state === false && index === 2) {
                // stop playback t/o 500ms
                setTimeout(stopAudio(), 500);
            }
        });
    }
    
    //--------------| PLAY FREQUENCY FUNCTION|---------------//
    // This function plays a frequency when it's called using Tone.js
    // It also controls the functionality of the transport buttons within the
    // Frequency Accuracy section of the application
    // input variables are freq
    function playFreq(int) {
        
        // Assign the value of the frequency generated 
        // by genRanFreq() to the sine Oscillator
        sine.frequency.value = freq;
        // start the sine oscillator
        sine.start();
        // Change State of Play / Pause Button
        startAudio();
        
        // if the loop toggle is off stop the sine oscillator
        // after one second of play
        if (loopToggle.state === false) {
                // Stop sine oscillator and change state of play/pause buttons
                stopAudio();
            }
        
        // If the pause button is clicked stop the sine oscillator
        // change state of buttons
        $('#pauseBtn').click(function () {
            stopAudio();

        })
    }

    //--------------|POPULATE QUIZ FUNCTION|---------------//
    // This function generates questions for all three quizes
    // The beauty of this function is that the generation occurs
    // Randomly, a new question is generated randomly every time the
    // function is called. The input variable is runningQuestion
    function populateQuiz(int) {
        
        // Create a step variable
        var quizChoice = 1;
        // Generate a number between 1 and 3
        quizChoice = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        
        // If the user has selected interval quiz
        if (quizTitle.innerHTML === "Interval Identification") {
            
            // Generate a random midi note
            genRanNote();
            // Generate a random interval based on this midi note
            genRanInterval(midiNote);
            
            // In a multiple choice quiz there are three possible outcomes
            // This function randomly selects one of three outcomes
            // Therefore the user can't select answers based on probability
            if (quizChoice == 1) {
                questions[int] = {
                    question: "What Is This Interval?",
                    choiceA: intervalType,
                    choiceB: intervalType2,
                    choiceC: intervalType3,
                    correct: "A"
                }
            }

            if (quizChoice == 2) {
                questions[int] = {
                    question: "What Is This Interval?",
                    choiceA: intervalType2,
                    choiceB: intervalType,
                    choiceC: intervalType3,
                    correct: "B"
                }
            }
            
            else if (quizChoice == 3) {
                questions[int] = {
                    question: "What Is This Interval?",
                    choiceA: intervalType2,
                    choiceB: intervalType3,
                    choiceC: intervalType,
                    correct: "C"

                }
            }
        }
        
        // If the user has selected Chord Game
        if (quizTitle.innerHTML === "Chord Game") {
            
            // Generate a random Midi Note
            genRanNote();
            // Generate a random chord based on the Midi Note
            genRanChord(midiNote);

            // In a multiple choice quiz there are three possible outcomes
            // This function randomly selects one of three outcomes
            // Therefore the user can't select answers based on probability
            if (quizChoice == 1) {
                questions[int] = {
                    question: "What Is This Chord?",
                    choiceA: chordType,
                    choiceB: chordType2,
                    choiceC: chordType3,
                    correct: "A"
                }
            }

            if (quizChoice == 2) {
                questions[int] = {
                    question: "What Is This Chord?",
                    choiceA: chordType2,
                    choiceB: chordType,
                    choiceC: chordType3,
                    correct: "B"
                }
            } else if (quizChoice == 3) {
                questions[int] = {
                    question: "What Is This Chord?",
                    choiceA: chordType2,
                    choiceB: chordType3,
                    choiceC: chordType,
                    correct: "C"

                }
            }
        }
        
        // If the user has selected Frequency Accuracy
        if (quizTitle.innerHTML === "Frequency Accuracy") {
            // Generate random frequency
            genRanFreq();
            
            // In a multiple choice quiz there are three possible outcomes
            // This function randomly selects one of three outcomes
            // Therefore the user can't select answers based on probability
            if (quizChoice == 1) {
                questions[int] = {
                    question: "What Is This Frequency",
                    choiceA: freq,
                    choiceB: freq2,
                    choiceC: freq3,
                    correct: "A"
                }
            }

            if (quizChoice == 2) {
                questions[int] = {
                    question: "What Is This Frequency",
                    choiceA: freq2,
                    choiceB: freq,
                    choiceC: freq3,
                    correct: "B"
                }
            } else if (quizChoice == 3) {
                questions[int] = {
                    question: "What Is This Frequency",
                    choiceA: freq2,
                    choiceB: freq3,
                    choiceC: freq,
                    correct: "C"

                }
            }
        }
    }
    
    //--------------|RESET QUIZ FUNCTION|---------------//
    // This function resets the variables used in the quiz
    function resetQuiz() {
        progress.innerHTML = "";
        runningQuestion = 0;
        score = 0;
        // Calls function to start quiz
        startQuiz();
    }
    
    //--------------|RENDER QUESTION FUNCTION|---------------//
    // This function renders the quiz questions listed in populateQuiz()
    // It updates the html elements of the quiz page
    function renderQuestion() {
        
        // Calls the function to populate the quiz with a question
        populateQuiz(runningQuestion);
        
        // Create variable for question index
        let q = questions[runningQuestion];
        
        // Generate question title
        question.innerHTML = "<p>" + q.question + "</p>";
        // Generate choice A
        choiceA.innerHTML = q.choiceA;
        // Generate choice B
        choiceB.innerHTML = q.choiceB;
        // Generate choice C
        choiceC.innerHTML = q.choiceC;
    }


    //--------------|START QUIZ FUNCTION|---------------//
    // This function calls all the varies quiz functions
    // It also changes the html element to display the questions
    function startQuiz() {
        renderQuestion();
        questionsLayout.style.display = "block";
        renderProgress();
    }

    //--------------|RENDER PROGRESS FUNCTION|---------------//
    // This function displays the five progress circles
    // that appear on the right hand side of the quiz
    function renderProgress() {
        for (let qIndex = 0; qIndex <= lastQuestion; qIndex++) {
            progress.innerHTML += "<div class='prog' id=" + qIndex + "></div>";
        }
    }


    //--------------|CHECK ANSWER FUNCTION|---------------//
    // This function checks the user's input and calls another
    // function to colour the progress indicators green for 
    // correct answers and red for incorrect answers and increases
    // the userScore if the user answers correctly
    function checkAnswer(answer) {
        stopAudio();
        if (answer == questions[runningQuestion].correct) {
            // answer is correct
            userScore++;
            // change progress color to green
            answerIsCorrect();
        } else {
            // answer is wrong
            // change progress color to red
            answerIsWrong();
        }
        if (runningQuestion < lastQuestion) {
            runningQuestion++;
            renderQuestion();
        } else {
            // end the quiz and show the score
            scoreRender();
        }
    }
    //--------------|ANSWER CORRECT|---------------//
    // This function colours the progress icon with a green circle
    function answerIsCorrect() {
        document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
    }

    //--------------|ANSWER INCORRECT|---------------//
    // This function colours the progress icon with a red circle
    function answerIsWrong() {
        document.getElementById(runningQuestion).style.backgroundColor = "#f00";
    }

    //--------------|RENDER SCORE|---------------//
    // This function effectively ends the quiz and displays
    // The game over menu, rendering the users score after 
    // completeing the quiz
    function scoreRender() {

        menuTitle.innerHTML = "GAME OVER";
        closeBtn.style = "display: none;";
        displayUserScore.innerHTML = userScore;
        $('.quizMenuWrap').slideDown(1000);
        $('#quizGame').fadeToggle(200);

    }
    
    // If the user clicks option A check if it's correct

    $("#A").click(function () {
        checkAnswer('A');
        stopAudio();
    });
    // If the user clicks option B check if it's correct
    $("#B").click(function () {
        checkAnswer('B');
        stopAudio();
    });
    // If the user clicks option C check if it's correct
    $("#C").click(function () {
        checkAnswer('C');
        stopAudio();
    });

    // INTERVAL ICON Click Function, starts interval identification

    $("#intervalIcon").click(function () {
        $('#pitchGym').fadeToggle(500);
        quizTitle.innerHTML = "Interval Identification";
        resetQuiz();
        $('#quizGame').slideDown(1000);
        $('#controlMenu').slideDown(1800);

    });
    
    // Chord Icon Click Function, start chord game
    $("#chordIcon").click(function () {
        $('#pitchGym').fadeToggle(500);
        quizTitle.innerHTML = "Chord Game";
        resetQuiz();
        $('#quizGame').slideDown(1000);
        $('#controlMenu').slideDown(1800);

    });
    
    // Frequency Icon Click Function, starts Frequency Game
    $("#freqIcon").click(function () {
        $('#pitchGym').fadeToggle(500);
        quizTitle.innerHTML = "Frequency Accuracy";
        resetQuiz();
        $('#quizGame').slideDown(1000);
        $('#controlMenu').slideDown(1800);

    });
    
    // Play Button Click Function, calls correct game based on the H1 title of the game
    $("#playBtn").click(function () {
        //Class uses ., ID uses # (".controlMenu").hide();
        if (quizTitle.innerHTML === "Interval Identification") {
            playInterval(midiNote, midiNote2);
        }

        if (quizTitle.innerHTML === "Chord Game") {

            playChord(midiNote, midiNote2, midiNote3);
        }
        
        if (quizTitle.innerHTML === "Frequency Accuracy") {

            playFreq(freq);
        }
        
        

    });

    //------------------| Main Menu |-------------------//
    
    // Hide the popup quiz menu on document load
    $(".quizMenuWrap").hide();
    
    // Menu Close button click function
    $("#closeBtn").click(function () {
        //Class uses ., ID uses # 
        $('.quizMenuWrap').fadeOut(200);
        $('#quizGame').slideDown(500);

    });
    
    // Menu open button click function
    $("#menuBtn").click(function () {
        //Class uses ., ID uses # 
        $("#quizGame").hide();
        menuTitle.innerHTML = "PAUSED";
        stopAudio();
        displayUserScore.innerHTML = userScore;
        closeBtn.style = "display: unset;";
        $('.quizMenuWrap').slideDown(500);

    });
    
    // Reset start quiz button click function
    $("#startAgain").click(function () {
        //Class uses ., ID uses # 
        $(".quizMenuWrap").hide();
        
        if (quizTitle.innerHTML === "Interval Identification"){
                
                    genRanNote();
                    genRanInterval(midiNote);
                }
            if (quizTitle.innerHTML === "Chord Game") {
                
                genRanNote();
                genRanChord(midiNote);
            }
            
            if (quizTitle.innerHTML === "Frequency Accuracy"){
                
            genRanFreq
            }
        startQuiz();
        resetQuiz();
        $('#quizGame').slideDown(1000);

    });
    
    // Back to main menu click function
    $("#backToMain").click(function () {
        //Class uses ., ID uses # 
        $(".quizMenuWrap").hide();
        startQuiz();
        resetQuiz();
        $('#pitchGym').slideDown(1000);

    });

});

// This elements exist outside the document ready function as they would not function correctly within it

// HIDES THE MAIN PAGE SIDE BAR
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

// Click event on sidebar hide
$("[data-settingsHide]").click(function () {
    $("#sideBtn").toggle();
    $("#logoNav").toggle();
    $("#pageDesign").toggle();
});

// Click event for sidebar button
$('button[name=sidebarBtn]').click(function () {
    $("#setBtn").fadeToggle(500);
    $("#logoNav").fadeToggle(500);
    $("#pageDesign").fadeToggle(500);

});