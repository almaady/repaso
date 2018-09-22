const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const uploadCloud = require('../helpers/cloudinary')

const isLogged = (req,res,next)=>{
  if(req.isAuthenticated())return next()
  return res.redirect('/login')
}


router.get('/signup',(req,res)=>{
  configuration = {
    title: 'Sign up',
    btnValue: 'Crear cuenta',
    url:'/signup',
    password: true,
    id: ''
  }
  res.render('auth/signup', configuration)
})

router.post('/signup',(req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(user =>{
    res.redirect('/login')
  })
  .catch(e=> console.log(e))
})

router.get('/login',(req,res,next)=>{
  if(req.user)req.logOut()
  else res.render('auth/login')
})


router.post('/login', passport.authenticate('local'),(req,res,next)=>{
  req.app.locals.loggedUser = req.user
  res.redirect('/profile')
})


router.get('/profile',isLogged,(req,res)=>{
  console.log('user',req.app.locals.loggedUser)
  User.findById(req.app.locals.loggedUser._id).populate('notitas')
  .then(usuario =>{
    console.log(usuario)
    res.render('profile',usuario) //Lo que le tengo que apsar aquí es un objeto
  })
  
})


router.get ('/edit/:id', isLogged,(req,res)=>{
  let {url} = req
  let spliteado = url.split('/')
  configuration = {
    url: '/edit',
    title: 'Edit Profile',
    btnValue: 'Save',
    username: req.app.locals.loggedUser.username,
    email:req.app.locals.loggedUser.email,
    password:false,
    id: req.user._id
  }
  res.render('auth/signup',configuration)
})

router.post('/edit/:id', (req, res, next)=>{
  let {id} = req.params
  
  User.findByIdAndUpdate(id,req.body, {new:true})
  .then(user =>{
    req.app.locals.loggedUser = user
    res.redirect('/profile')
  })
  .catch(e => next(e))
})

router.get('/edit_image',isLogged, (req, res, next)=>{
  res.render('edit_image')
})

router.post('/edit_image',uploadCloud.single('photoURL'),(req,res, next)=>{
  User.findByIdAndUpdate(req.user._id,{photoURL:req.file.url}, {new:true})
  .then(user=>{
    console.log('perr',user)
    req.app.locals.loggedUser = user
    
    res.redirect('/profile')
  })
  .catch(e => next(e))
})


module.exports = router