const express = require("express");
const storeRouter = require("./routes/store.router")
const hostRouter = require("./routes/host.router")
const app = express();
const path = require("path")
const rootDir = require('./utils/pathUtil');
const errorsController = require("./controllers/errors.controller");
const mongoConnect = require("./utils/databaseUtil");
const authRouter = require("./routes/auth.router")

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded())
app.use(express.static(path.join(rootDir, 'public')))

app.use((req, res, next)=>{
    console.log(req.url, req.method)
    next();
})

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    req.isLoggedIn = req.get('Cookie') ? req.get('Cookie').split('=')[1] === 'true' : false;
    next();
})

app.use(authRouter)

app.use('/', storeRouter)

app.use('/host', (req, res, next) => {
    if(!req.isLoggedIn) {
        return res.redirect("/login")
    }
    next();
}, hostRouter)

// if url does not matches with any above url it will print 404
app.use(errorsController.handlePageNotFound)

const PORT=3000;
mongoConnect().then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=>console.log(`server started running at http://localhost:${PORT}`));
}).catch(err=>{
    console.log("Error while connecting to MongoDB", err)
})