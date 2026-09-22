import { db } from "./db"

const srv = Bun.serve({
  port: 3000,
  routes: {

    "/user": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM users`)
        const dbResp = query.all({})
        return Response.json({ message: "deu bom", dbResp })
      },

      POST: async (req) => {
        const body = await req.json();
        const query = db.query(`
          INSERT INTO users(username, email, password_hash) 
          VALUES(:username, :email, :password_hash)
        `)
        const dbResp = query.run({
          ':username': body.username,
          ':email': body.email,
          ':password_hash': body.password
        })
        return Response.json({ message: "deu bom", dbResp });
      }
    },

    "/user/:id": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM users WHERE id = :_id_`)
        const dbResp = query.get({ ":_id_": req.params.id })
        return Response.json(dbResp)
      },

      PUT: async (req) => {
        const body = await req.json()
        const query = db.query(`
          UPDATE users 
          SET username = :username, email = :email, password_hash = :password_hash 
          WHERE id = :_id_
        `)
        const dbResp = query.run({
          ":_id_": req.params.id,
          ":username": body.username,
          ":email": body.email,
          ":password_hash": body.password
        })
        return Response.json({ message: "Usuário atualizado com sucesso", dbResp })
      },

      DELETE: (req) => {
        const query = db.query(`DELETE FROM users WHERE id = :_id_`)
        const dbResp = query.run({ ":_id_": req.params.id })
        return Response.json({ message: "Usuário deletado", dbResp })
      }
    },

    "/imovel": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM imoveis;`)
        const dbResp = query.all({})
        return Response.json(dbResp)
      },

      POST: async (req) => {
        const body = await req.json();
        const query = db.query(`
          INSERT INTO imoveis(descricao, endereco, valor) 
          VALUES(:descricao, :endereco, :valor)
        `)
        const dbResp = query.run({
          ':descricao': body.descricao,
          ':endereco': body.endereco,
          ':valor': body.valor
        })
        return Response.json({ message: "deu bom", dbResp });
      }
    },

    "/imovel/:id": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM imoveis WHERE id = :_id_`)
        const dbResp = query.get({ ":_id_": req.params.id })
        return Response.json(dbResp)
      },

      PUT: async (req) => {
        const body = await req.json()
        const query = db.query(`
          UPDATE imoveis 
          SET descricao = :descricao, endereco = :endereco, valor = :valor 
          WHERE id = :_id_
        `)
        const dbResp = query.run({
          ":_id_": req.params.id,
          ":descricao": body.descricao,
          ":endereco": body.endereco,
          ":valor": body.valor
        })
        return Response.json({ message: "Imóvel atualizado com sucesso", dbResp })
      },

      DELETE: (req) => {
        const query = db.query(`DELETE FROM imoveis WHERE id = :_id_`)
        const dbResp = query.run({ ":_id_": req.params.id })
        return Response.json({ message: "Imóvel deletado", dbResp })
      }
    }
  },
})

console.log(`Server running: ${srv.url}`)
