const express = require("express");
const storeRouter = require("./routes/store.router")
const hostRouter = require("./routes/host.router")
const app = express();
const path = require("path")
const rootDir = require('./utils/pathUtil');
const errorsController = require("./controllers/errors.controller");

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
    next();
})

app.use('/', storeRouter)

app.use('/host', hostRouter)

// if url does not matches with any above url it will print 404
app.use(errorsController.handlePageNotFound)

const PORT=3000;
app.listen(PORT, ()=>console.log(`server started running at http://localhost:${PORT}`));