const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let page = parseInt(urlParams.get("page")) || 1;
let userName = urlParams.get("user")
let URL = "https://api.github.com"
let TOKEN="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"

const getUserDetails = async function(userName) {
    const data  = await fetch(`${URL}/users/${userName}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    });
    return data;
}
const getUserRepos = async function(userName) {
    const repo = await fetch(`${URL}/users/${userName}/repos?page=${page}&per_page=10`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    });
    return repo;
}

const getLanguages = async function(userName, projectName) {
    const data = await fetch(`${URL}/repos/${userName}/${projectName}/languages`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    });
    return data;
}
const start = async function(){

    if(userName){
        const data = await (await getUserDetails(userName)).json();
        if("message" in data){
            window.location.href = '/not-found.html';
            return;
        }
        $("#userName").text(data.name);
        $("#bio").text(data.bio);
        $("#location").text(data.location);
        $("#email").text(data.email);
        $("#twitter_username").text(data.twitter_username);
        $("#userImage").attr("src",data.avatar_url);
        $("#github_url").attr("href",data.html_url);
        $("#github").text(data.html_url);

        const userRepo = await (await getUserRepos(userName)).json();

        userRepo.forEach(async (repo) => {
            $("#repo_container").append(
                `<div id='${repo.id}' class='border p-4 flex flex-col gap-3 h-full w-full'> </div>`
            )
            $(`#${repo.id}`).append(
                `<a id='${repo.name}' href={repo.clone_url} target='_blank' class='text-[#3081F7] font-bold text-xl underline'>${repo.name}</a>`
            )
            if(repo.description){
                $(`#${repo.id}`).append(
                    `<p>${repo.description}</p>`
                )
            }
            $(`#${repo.id}`).append(
                `<div id='${repo.id}_${repo.name}' class='flex flex-wrap gap-3' > </div>`
            )
            
            const languages = await (await getLanguages(userName, repo.name)).json();
            Object.keys(languages).forEach((lan) => {
                $(`#${repo.id}_${repo.name}`).append(
                    `<div class='flex justify-center items-center bg-[#3081F7] p-2 rounded-lg' >${lan}</div>`
                )
            })
        });
        let hasNextPage = false;
        if(userRepo.length > 9) {
            hasNextPage = true;
        }else {
            hasNextPage = false;
        }

        if(userRepo.length <= 0){
            $("#pagination").attr("class","hidden")
        }else {
            $("#pagination").attr("class","block")
            $("#next-btn").attr("class","block")
            $("#prev-btn").attr("class","hidden")
            if(page > 1){
                $("#prev-btn").attr("class","block")
            }
            if(!hasNextPage){
                $("#next-btn").attr("class","hidden")
            }
            $("#next-btn").click(function() {
                window.location.assign(`/user.html?user=${userName}&page=${page+1}`)
            })
        
            $("#prev-btn").click(function() {
                window.location.assign(`/user.html?user=${userName}&page=${page-1}`)
            })
        }   
    }
}

start();