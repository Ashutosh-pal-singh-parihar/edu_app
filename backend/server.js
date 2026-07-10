import { app } from "./src/app.js";
import { connectDb } from "./src/config/db.config.js";

const port = process.env.PORT

connectDb().then(()=>{
    app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})
})

