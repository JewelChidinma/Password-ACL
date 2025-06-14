const fs = require("fs")
const path = require("path")

const userDbPath = path.join(__dirname, "db", "users.json")

function getAllUsers() {
    return new Promise((resolve, reject) => {
        fs.readFile(userDbPath, "utf8", (err, users) => {
            if (err) {
                reject(err)
            }

            resolve(JSON.parse(users))

        })
    })
}

function authenticateUser(req, res, roles) {
    return new Promise((resolve, reject) => {
        const body = []

        req.on("data", (chunk) => {
            body.push(chunk)
        })
        req.on("end", async () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log(parsedBody)

            if (!parsedBody) {
                reject("Enter username and password")
            }

            const {user: loginDetails, book} = JSON.parse(parsedBody)

            const users = await getAllUsers()
            const userFound = users.find(user => user.username === loginDetails.username && user.password === loginDetails.password)
            

            if (!userFound) {
                reject("User not found! Please sign up.")
            }

             if (!roles.includes(userFound.role)) {
                reject("You do not have the required role to access this resource.")
            }

            resolve(book)
        })

    })

}

module.exports = {
    authenticateUser
}