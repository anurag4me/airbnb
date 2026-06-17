const { check, validationResult } = require("express-validator")
const User = require("../models/user.model")
const bcrypt = require("bcryptjs")

exports.getLogin = (req, res, next) => {
    res.render("auth/login", { pageTitle: 'Login Page', isLoggedIn: false, user: {}})
}

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", { pageTitle: 'Signup Page', isLoggedIn: false, user: {}})
}

exports.postLogin = [
    check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()_+]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

    async (req, res, next) => {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render("auth/login", {
                pageTitle: 'Sign Up Page',
                isLoggedIn: false,
                errorMessages: errors.array().map(error => error.msg),
                user: {},
            })
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(422).render("auth/login", {
                pageTitle: 'Login Page',
                isLoggedIn: false,
                errorMessages: ['Invalid email'],
                oldInput: { email },
                user: {},
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.render("auth/login", {
                pageTitle: 'Login Page',
                isLoggedIn: false,
                errorMessages: ['Invalid Password'],
                oldInput: { email },
                user: {},
            })
        }
        
        req.session.isLoggedIn = true;
        req.session.user = user;
        await req.session.save();
        res.redirect("/");
    },
]

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should be atleast 2 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First name can only contain letters"),

  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last name can only contain letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()_+]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((val, { req }) => {
      if (val !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign Up Page',
            isLoggedIn: false,
            errorMessages: errors.array().map(error => error.msg),
            oldInput: { firstName, lastName, email, password, userType }
        })
    }

    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({firstName, lastName, email, password: hashedPassword, userType});
        return user.save()
    })
    .then(() => {
            res.redirect("/login")
    }).catch(err => {
        console.log("Error while saving user", err);
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign Up Page',
            isLoggedIn: false,
            errorMessages: [err.message],
            oldInput: { firstName, lastName, email, password, userType },
            user: {},
        })
    });
    
  },
];

exports.postLogout = (req, res, next) => {
    req.session.destroy(()=>{
        res.redirect("/login");
    })
}