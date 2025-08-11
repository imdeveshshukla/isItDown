import express from "express"
import { validateWebsite } from "./middleware"
const app = express()

app.use(express.json())



app.post("/api/v1/website",validateWebsite,(req, res) => {
    const { url } = req.body
    console.log(url)
    res.send("Website added")
})

app.get("/api/v1/websites",(req, res) => {
    res.send("All websites")
})

app.get("/api/v1/websites/status/:websiteId", (req, res) => {
    const { websiteId } = req.params
    console.log(websiteId)
    res.send("websites")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})


