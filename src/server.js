import { createServer, Model } from "miragejs"

export const upServer = function () {
    createServer({
        models: {
            user: Model
        },

        seeds(server) {
            server.create('user', {
                id: 1,
                name: "José da Silva",
                cpf: "12345678901",
                address: "Rua teste, 1234",
                phone: "(65) 9 1234 4567",
                email: "jose@email.com",
                role: "Gerente"
            })
            server.create('user', {
                id: 2,
                name: "Maria José Siqueira",
                cpf: "98765432101",
                address: "Rua o teste, 4321",
                phone: "(65) 9 9876 5432",
                email: "maria@email.com",
                role: "recepcionista"
            })
        },

        routes() {
            this.get("/api/users", (schema) => {
                return schema.users.all()
            })

            this.get("/api/users/:id", (schema, request) => {
                let id = request.params.id
                return schema.users.find(id)
            })

            this.post("/api/users", (schema, request) => {
                const data = JSON.parse(request.requestBody)

                return schema.users.create(data)
            })

            this.put("/api/users/:id", (schema, request) => {
                const data = JSON.parse(request.requestBody)
                let id = request.params.id
                const user = schema.users.find(id)
                return user.update(data)
            })

            this.delete("/api/users/:id", (schema, request) => {
                const data = JSON.parse(request.requestBody)
                let id = request.params.id
                return schema.users.find(id).destroy()
            })
        }
    });
}