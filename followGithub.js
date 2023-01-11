import { Octokit } from "octokit";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from 'node:process';

let rl = readline.createInterface({
  input,
  output
})

const TOKEN = await rl.question(`Insira o token de autenticação do GitHub: `)

console.log("\n Realizando autenticação...");

const octoKit = new Octokit({
  auth: TOKEN,
})

console.log("\n Autenticação realizada com sucesso...");

async function followFollowers() {
  try {
    console.log("\n Obtendo dados de seguidores...");

    var followers = await octoKit.request("GET /user/followers?per_page=100");

    console.log("\n Dados obtidos com sucesso...");

    console.log("\n Realizando follow em quem é seguidor e não esta sendo seguido...");

    for (var j = 0; j < followers.data.length; j++) {
      let followFollower = await octoKit.request(`PUT /user/following/${followers.data[j].login}`, {
        headers: {
          accept: "application/vnd.github+json",
          "content-length": 0
        }
      })

      if (followFollower.status === 204) {
        console.log(`\n Seguindo: ${followers.data[j].login}`);
      }
    }

    console.log("\n Tarefa realizada com sucesso!!");

    process.exit(0);
  } catch (error) {
    console.log("\n Error:", error);
  }
}

followFollowers();
