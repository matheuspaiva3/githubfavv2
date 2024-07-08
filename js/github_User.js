export class GithubUser{
    static async search(username){
       const endpoint = `https://api.github.com/users/${username}`

       try{
        const data = await fetch(endpoint)
        const jsonData = await data.json()
        const { login, name, public_repos, followers} = jsonData
        return{
            login,
            name,
            public_repos,
            followers
        }
       }catch(e){
        console.log(e)
       }
    }
}