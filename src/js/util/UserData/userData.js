import { users, rosters } from '../initData.js';

var userData = users;

export function createOwnerAvatarImage(userId, page = null) { 

    let user = userData.find(x => x.user_id === userId);
    
    if (user.avatar)
    {
        const altURL = "https://sleepercdn.com/avatars/thumbs/" + user.avatar;
        var img = document.createElement("img");
        img.setAttribute('src', altURL);
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);

        if(page && page.toString().toLowerCase() == "home")
        {
            img.setAttribute('src', './src/static/images/trashcan.png');
        }
        else
        {
            img.setAttribute('src', '../src/static/images/trashcan.png');
        }
        
    }
    return img;
}

export function getTeamName(userid) {

    let user = rosters.find(x => x.owner_id === userid.toString());
    let userName = "";

    if(user)
    {
        userName = "Team_"+ user.roster_id;
    }
    else
    {
        userName = "Team_Test"
    }

    return userName.toString();
}

export function getUserByName(teamName) {
    let userId = teamName.toString().substring(teamName.toString().indexOf("_") + 1);
    if(userId)
    {
        return userId.toString();
    }
    else
    {
        return "";
    }
}

export function getRosterByUserId(userId) {

    let roster = rosters.find(x => x.owner_id === userId.toString());

    return roster.roster_id;
}
