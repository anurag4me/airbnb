exports.getLogin = (req, res, next) => {
    res.render("auth/login", { pageTitle: 'Login Page', isLoggedIn: false})
}

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", { pageTitle: 'Signup Page', isLoggedIn: false})
}

exports.postLogin = (req, res, next) => {
    console.log(req.body);
    req.session.isLoggedIn = true;
    res.redirect("/");
}

exports.postSignup = (req, res, next) => {
    console.log(req.body);
    // req.session.isLoggedIn = true;
    res.redirect("/login");
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(()=>{
        res.redirect("/login");
    })
}