import { GithubUser } from "./github_User.js";
//Class who have the logic of data
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.load();
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }
  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    this.entries = filteredEntries;
    console.log(this.entries);
    if(filteredEntries.length === 0){
        this.removeAllTr()
    }
    this.save();
    console.log(filteredEntries);
    this.update();
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }
  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error("User already registered");
      }

      const github_user = await GithubUser.search(username);

      if (github_user.login === undefined) {
        throw new Error("User not found");
      }
      // console.log(github_user)

      console.log(username);
      this.entries = [github_user, ...this.entries];
      this.save();
      this.update();
    } catch (e) {
      alert(e.message);
    }
  }
}
//Class who will create the visualization and event of HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onAdd();
  }
  onAdd() {
    const addButton = document.querySelector("#search-user_button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector("input#user_search");
      this.add(value);
    };
  }
  update() {
    console.log(this.entries);
    if(this.entries.length > 0){
        this.removeAllTr()
    }
    
    this.entries.forEach((user) => {
        const row = this.createRow();
        row.querySelector(
            ".user img"
        ).src = `https://github.com/${user.login}.png`;
        row.querySelector(".user img").alt = ` Imagem de ${user.name}`;
        row.querySelector(".user p").textContent = user.name;
        row.querySelector(".user a").href = `https://github.com/${user.login}`;
        row.querySelector(".user span").textContent = user.login;
        row.querySelector(".repositories").textContent = user.public_repos;
        row.querySelector(".followers").textContent = user.followers;
        
        row.querySelector(".remove").onclick = () => {
            const isOk = confirm("Tem certeza que deseja deletar esse usuário?");
            if (isOk) {
                this.delete(user);
            }
      };
      this.tbody.append(row);
      this.save();
    });
  }
  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
         <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
            <a href="https://github.com/maykbrito" target="_blank"></a>
            <div class="box-table">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
            </div>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>`;
    return tr;
  }
  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
