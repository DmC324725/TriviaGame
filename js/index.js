let optiontxts = document.getElementsByClassName("option-text");
let score = 0;
let questions;
let selectedQ = new Array();
let questionnum = 1;
let answer = "";
let selectedAnswer = "";
let question, options;
for (let i = 0; i < 4; i++) {
    optiontxts[i].addEventListener("click", event => {
        document.getElementById("answer-text").innerHTML = event.currentTarget.innerHTML;
        selectedAnswer = event.currentTarget.innerHTML;
    });
}

function addFriend(name) {
    const template = document.querySelector("template#friend-card-template");
    let newFriendCard = document.importNode(template.content, true);
    //let newFriendCard = htmlToElement(document.getElementById("friend-card-template").innerHTML);
    let randomNum = (Math.floor(Math.random() * 8) + 1);
    newFriendCard.querySelector(".friend-photo-img").setAttribute("src", "img/icons/" + randomNum + ".png");
    newFriendCard.querySelector(".friend-details").innerHTML = name;

    document.querySelector(".friends-card").appendChild(newFriendCard);
}

function deleteFriend(event) {

    //Find the parent of the button
    let parentEl = event.currentTarget.parentElement;

    //Find the name from parents child
    let friendNameDelete = parentEl.querySelector(".friend-details").innerHTML;

    //Delete that name from Friendsarray
    const index = friendsarray.indexOf(friendNameDelete);
    if (index > -1) {
        friendsarray.splice(index, 1);
    }
    //Make changes to the local storage
    localStorage.setItem("friendNames", JSON.stringify(friendsarray));

    //Delete the parent from html
    parentEl.remove();
}

let friendsarray = localStorage.getItem("friendNames");
if (friendsarray == null) {
    friendsarray = new Array();
} else {
    friendsarray = JSON.parse(friendsarray);
}
for (key in friendsarray) {
    addFriend(friendsarray[key]);
}
let nameTxt = document.getElementById("myName");
let usernamelocal = localStorage.getItem("username");
if (usernamelocal != null) {
    nameTxt.innerHTML = usernamelocal;
} else {
    let myname = prompt("Enter your name (8 digits only)").substring(0, 8);
    nameTxt.innerHTML = myname;
    localStorage.setItem("username", myname);
}

nameTxt.addEventListener("click", () => {
    let myname = prompt("Enter your name (8 digits only)").substring(0, 8);
    nameTxt.innerHTML = myname;
    localStorage.setItem("username", myname);

});

let addFriendBtn = document.getElementById("add-friend-btn");
addFriendBtn.addEventListener("click", () => {

    let friendName = prompt("Enter your friend's name").substring(0, 8);
    if (friendName != "") {
        friendsarray.push(friendName);
        localStorage.setItem("friendNames", JSON.stringify(friendsarray));
        addFriend(friendName);




    }
});
let elements = document.querySelectorAll(".delete-btn");
for (let i = 0; i < elements.length; i++) {
    let delbtn = elements[i];
    delbtn.addEventListener("click", deleteFriend);
}
document.getElementById("exchange-btn").addEventListener("click", changeQuestion);

function changeQuestion() {
    document.querySelector(".question-card").animate(
        [{
                transform: 'translateX(0px)'
            },
            {
                transform: 'translateX(-1000px)'
            }, {
                transform: 'translateX(0px)'
            }
        ], {
            duration: 700


        });

    fillQuestion(randomQuestion());
}

//Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js', {
        scope: '/'
    }).then(function () {
        console.log("Service Worker Registered");
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
let res = fetch('https://opentdb.com/api.php?amount=50&category=15&type=multiple')
    .then((response) => {
        if (!response.ok) {

            throw Error(response.statusText);
        }
        return response.json();

    })
    .then((data) => {

        questions = data.results;
        localStorage.setItem("questions", JSON.stringify(questions));
        console.log(questions);
        fillQuestion(randomQuestion());
        return data.results;
    }).catch(function (error) {
        questions = JSON.parse(localStorage.getItem("questions"));
        fillQuestion(randomQuestion());
        console.log(error);
    });

function randomQuestion() {
    let random_num;
    do {
        random_num = Math.ceil(Math.random() * 50)
    } while (selectedQ.includes(random_num))
    selectedQ.push(random_num);
    return questions[random_num];
}

function fillQuestion(data) {
    question = JSON.stringify(data.question);
    options = (data.incorrect_answers);
    answer = (data.correct_answer);
    options.push(answer);
    console.log(options);
    options = shuffleArray(options);
    console.log(options);
    let questiontxt = document.getElementById("questiontxt");
    questiontxt.innerHTML = question;
    for (var i = 0; i < 4; i++) {
        optiontxts[i].innerHTML = options[i];
    }

    document.getElementById("answer-text").innerHTML = "";
}

function submitAnswer() {
    if (answer == selectedAnswer) {
        score += 10;
    } else {
        score -= 5;
    }
    document.getElementById("myScore").innerHTML = score;
    changeQuestion();
}

document.getElementById("next-btn").addEventListener("click", submitAnswer);