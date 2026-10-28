import login from "./index.html"
import home from "./home.html"
import { db } from "./db"

const loggedUsers: any = {}

const srv = Bun.serve({
  port: 3000,
  routes: {

    "/": login,

    "/home": home,

    "/login": {
      POST: async (req) => {
        const body = await req.body?.json()
        const query = db.query(`
                    SELECT * FROM user
                    WHERE username=:username
                    LIMIT 1
                `)
        const data: any = query.get({
          ":username": body.username
        })
        if (!data) {
          return Response.json({ msg: "usuário não encontrado" }, { status: 404 })
        }
        const isMatch = await Bun.password.verify(body.password, data.password_hash)
        if (!isMatch) {
          return Response.json({ msg: "senha não confere" }, { status: 401 })
        }
        const uuid = crypto.randomUUID();
        loggedUsers[uuid] = data
        req.cookies.set("ses", uuid)
        return Response.json(isMatch)
      }
    },

    "/login/user": (req) => {
      const ses = req.cookies.get("ses")
      if (!ses || !loggedUsers[ses])
        return Response.json({ msg: "não permitido" }, { status: 401 })
      return Response.json(loggedUsers[ses])
    },

    "/user": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM user`)
        const dbResp = query.all({})
        return Response.json({ message: "deu bom", dbResp })
      },

      POST: async (req) => {
        let body: any;
        try {
          body = await req.json();
        } catch (e: any) {
          return Response.json({
            message: "O JSON tá num formato errado",
            parseError: e
          }, { status: 400 })
        }
        if (!body.username)
          return Response.json({ message: "Falta username" }, { status: 400 })
        if (!body.email)
          return Response.json({ message: "Falta email" }, { status: 400 })
        if (!body.password)
          return Response.json({ message: "Falta password" }, { status: 400 })
        const query = db.query(`
          INSERT INTO user(username, email, password_hash) 
          VALUES(:username, :email, :password_hash)
        `)
        try {
          const hash = await Bun.password.hash(body.password)
          const dbResp = query.run({
            ':username': body.username,
            ':email': body.email,
            ':password_hash': hash
          })
          return Response.json({ message: "deu bom", dbResp });
        } catch (e: any) {
          if (e.code == "SQLITE_CONSTRAINT_UNIQUE") {
            return Response.json({
              message: "Username e Email precisam ser únicos",
              code: "UNIQUE:CONSTRAINT"
            }, { status: 400 })
          }
          return Response.json({
            message: "Erro ao inserir no banco de dados",
            dbError: e
          }, { status: 500 })
        }
      },
    },

    "/user/:id": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM user WHERE id = :_id_`)
        const dbResp = query.get({ ":_id_": req.params.id })
        return Response.json(dbResp)
      },

      PUT: async (req) => {
        let body: any;
        try {
          body = await req.json()
        } catch (e: any) {
          return Response.json({
            message: "O JSON tá num formato errado",
            parseError: e
          }, { status: 400 })
        }
        const querySelect = db.query(`SELECT * FROM user WHERE id = :_id_`)
        const dbRespSelect = querySelect.get({ ":_id_": req.params.id })
        if (dbRespSelect == null)
          return Response.json({ message: "ID inexistente" }, { status: 400 })
        if (!body.username)
          return Response.json({ message: "Falta username" }, { status: 400 })
        if (!body.email)
          return Response.json({ message: "Falta email" }, { status: 400 })
        if (!body.password)
          return Response.json({ message: "Falta password" }, { status: 400 })
        const query = db.query(`
          UPDATE user
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
        const query = db.query(`DELETE FROM user WHERE id = :_id_`)
        const dbResp = query.run({ ":_id_": req.params.id })
        return Response.json({ message: "Usuário deletado", dbResp })
      }
    },

    "/imovel": {

      GET: (req) => {
        const query = db.query(`SELECT * FROM imovel;`)
        const dbResp = query.all({})
        return Response.json(dbResp)
      },

      POST: async (req) => {
        const body: any = await req.json();
        const query = db.query(`
          INSERT INTO imovel(descricao, endereco, valor) 
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
        const query = db.query(`SELECT * FROM imovel WHERE id = :_id_`)
        const dbResp = query.get({ ":_id_": req.params.id })
        return Response.json(dbResp)
      },

      PUT: async (req) => {
        const body: any = await req.json()
        const query = db.query(`
          UPDATE imovel
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
        const query = db.query(`DELETE FROM imovel WHERE id = :_id_`)
        const dbResp = query.run({ ":_id_": req.params.id })
        return Response.json({ message: "Imóvel deletado", dbResp })
      }
    }
  },
})

console.log(`Server running: ${srv.url}`)
