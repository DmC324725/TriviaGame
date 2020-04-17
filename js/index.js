
        let peer;
        let conn;
        function addFriend(name) {
            const template = document.querySelector("template#friend-card-template");
            let newFriendCard = document.importNode(template.content, true);
            //let newFriendCard = htmlToElement(document.getElementById("friend-card-template").innerHTML);
            let randomNum = (Math.floor(Math.random() * 8)+1); 
            newFriendCard.querySelector(".friend-photo-img").setAttribute("src","img/icons/"+randomNum+".png");
            newFriendCard.querySelector(".friend-details").innerHTML = name;
             //STEP 2
            conn = peer.connect(name+'_1A2bcC2L');
             // var conn = peer.connect('dc_7iun3cuzuho');
             // on open will be launch when you successfully connect to PeerServer
             conn.on('open', function(){
                 // here you have conn.id
                 conn.send('You are now connected with '+ nameTxt.innerHTML+'!');
             });
            document.querySelector(".friends-card").appendChild(newFriendCard);
        }
        function deleteFriend(event){
            
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
            localStorage.setItem("friendNames",JSON.stringify(friendsarray));

            //Delete the parent from html
            parentEl.remove();
        }
       
        let friendsarray = localStorage.getItem("friendNames");
        if(friendsarray == null){
            friendsarray = new Array();
        }
        else{
            friendsarray = JSON.parse(friendsarray);
        }
        for (key in friendsarray){
            addFriend(friendsarray[key]);
        }
        let nameTxt = document.getElementById("myName");
        let usernamelocal = localStorage.getItem("username");
        if(usernamelocal != null){
            nameTxt.innerHTML = usernamelocal;
        }else{
            let myname = prompt("Enter your name (8 digits only)").substring(0,8);
            nameTxt.innerHTML = myname;
            localStorage.setItem("username", myname);
        }
        peer = new Peer(nameTxt.innerHTML+'_1A2bcC2L');
        peer.on('open', function(id) {
            console.log('My peer ID is: ' + id);
          });
        nameTxt.addEventListener("click",() => {
            let myname = prompt("Enter your name (8 digits only)").substring(0,8);
            nameTxt.innerHTML = myname;
            localStorage.setItem("username", myname);
            peer = new Peer(nameTxt.innerHTML+'_1A2bcC2L');
        });

        let addFriendBtn = document.getElementById("add-friend-btn");
        addFriendBtn.addEventListener("click", () => {
            
            let friendName = prompt("Enter your friend's name").substring(0,8);
            if(friendName != ""){
                friendsarray.push(friendName);
                localStorage.setItem("friendNames",JSON.stringify(friendsarray));
                addFriend(friendName);

               


            }
        });
        let elements = document.querySelectorAll(".delete-btn");
        for (let i = 0; i < elements.length; i++) {
            let delbtn = elements[i];
            delbtn.addEventListener("click", deleteFriend);
        }
        document.getElementById("exchange-btn").addEventListener("click",()=>{
            document.querySelector(".question-card").animate(
                [
                    {
                        transform: 'translateX(0px)'
                    },
                    {
                        transform: 'translateX(-1000px)'
                    }
                    ,{
                        transform: 'translateX(0px)'
                    }
                ], {
                    duration: 700
                
                    
                });
        });
        

        //Service Worker Registration
        if('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/serviceworker.js', {
              scope: '/'
            }).then(function() { console.log("Service Worker Registered"); });
          }
        
          
          peer.on('connection', function(conn) {
            conn.on('data', function(data){
              // Will print 'hi!'
              console.log(data);
            });
          });
        
        