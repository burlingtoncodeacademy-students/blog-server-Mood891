require("dotenv").config()
const
    express = require("express")
    cors = require("cors")
    routes = require("./controllers/routes")
    app = express()

    PORT = process.env.PORT || 4000
    URL = process.env.URL || "127.0.0.1"

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(PORT, URL, () => {
    console.log(`[server] listening on ${URL}:${PORT}`)
})