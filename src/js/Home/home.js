const rosterDataStorage = localStorage.getItem("RosterData");
var rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
var userData = JSON.parse(userDataStorage);
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
var matchupData = JSON.parse(matchupWeekStorage); 
const playerDataStorage = localStorage.getItem("PlayerData");
var playerData = JSON.parse(playerDataStorage); 

async function checkBrowserData() {

    if(!rosterData || !matchupData) //check for matchup data too because its stored in sessionstorage
    {
        try{
            initBrowserData();
        }
        catch (error){
            console.error(`Error: ${error.message}`);
        }
    }
    else
    {
        loadContents();
    }
}

function waitForLocalStorageItem(key) {
    return new Promise((resolve) => {
        const checkLocalStorage = () => {
            const item = localStorage.getItem(key);
            if (item !== null) {
                resolve(item);
            } else {
                setTimeout(checkLocalStorage, 100); // Check again in 100 milliseconds
            }
        };
        checkLocalStorage();
    });
}

function waitForSessionStorageItem(key) {
    return new Promise((resolve) => {
        const checkSessionStorage = () => {
            const item = sessionStorage.getItem(key);
            if (item !== null) {
                resolve(item);
            } else {
                setTimeout(checkSessionStorage, 100); // Check again in 100 milliseconds
            }
        };
        checkSessionStorage();
    });
}

async function initBrowserData() {
    try {
        const localRosterData = await waitForLocalStorageItem("RosterData");
        const localLeagueData = await waitForLocalStorageItem("LeagueData");
        const localPlayerData = await waitForLocalStorageItem("PlayerData");
        const localUserData = await waitForLocalStorageItem("UserData");
        const localMatchupData = await waitForSessionStorageItem("MatchupData");

        rosterData = JSON.parse(localRosterData);
        userData = JSON.parse(localUserData);
        playerData = JSON.parse(localPlayerData);
        leagueData = JSON.parse(localLeagueData);
        matchupData = JSON.parse(localMatchupData);

        loadContents();

    } catch (error) {
        console.error('Error loading or executing script:', error);
    }
}

//This loads the page contents dynamically
function loadContents() {
    loadTeams();
}

function loadTeams() {

    var teams = document.querySelectorAll('[id*=team]');

    for(let i = 0; i < teams.length; i++)
    {
        let rosterid = i + 1;
        let roster = rosterData.find(x => x.roster_id === rosterid);
        let teamName = getTeamName(roster.owner_id);
        let playerImg = createOwnerAvatarImage(roster.owner_id);

        teams[i].children[0].prepend(playerImg);
        teams[i].children[0].children[0].innerText = teamName;
    }
}

function getTeamName(userid) {

    let user = userData.find(x => x.user_id === userid.toString());
    let userName = "";

    if(user.metadata.team_name != undefined)
    {
        userName = user.metadata.team_name;
    }
    else
    {
        userName = user.display_name;
    }

    return userName.toString();
}

function createOwnerAvatarImage(userId) { 

    let user = userData.find(x => x.user_id === userId);
    const avatarURL = user.metadata.avatar;
    
    if(avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatarURL);
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('src', '../src/static/images/trashcan.png');
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('style', "border-radius: unset;");
        img.setAttribute('data-userid', user.user_id);
    }
    return img;
}