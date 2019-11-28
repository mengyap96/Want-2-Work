const express = require('express')
const session = require('express-session')
const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const moment = require('moment')
const fs = require('fs')

const PORT = process.env.PORT || 5000

//Connecting to mongoDB
var dbURL = "mongodb+srv://admin:admin@yap-yetry.mongodb.net/FYP?retryWrites=true&w=majority";
mongoose.connect(dbURL,{useUnifiedTopology: true,useNewUrlParser: true}).then(() => { 
  console.log('Database Connected Successful!');
})


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({secret: 'sshhh', saveUninitialized: true, resave: true}))
  .use(bodyParser())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  

  //Homepage Link
  .get('/', (req, res)=>{
    res.render('pages/index', { 
    id : req.session.email,
    name : req.session.name,
    userType : req.session.userType,
    error: false
    })
  })


  //Login Link
  .get('/login', (req, res)=>{
    res.render('pages/login',
    {
      id : req.session.email,
      name : req.session.name,
      userType : req.session.userType,
      error: false
    })
    
  })


  //Register Link
  .get('/register', (req, res)=>{
    var dateNow = new Date()

    res.render('pages/register',
    {
      id : req.session.email,
      name : req.session.name,      
      userType : req.session.userType,
      dateNow: moment(dateNow).format("YYYY-MM-DD"),
      error: false
    })
  })


  //User-Profile Link
  .get('/user-profile/:email',loginSession, (req, res)=>{
    //Acquired data from database
    var user = require('./userDB')
    

    user.find({
      "email": req.params.email,
    })
    .then((response)=>{
      res.render('pages/user-profile',{
        id : req.session.email,
        name : req.session.name,
        email:req.params.email,
        userType : req.session.userType,
        user : response,
        moment: require('moment')
      })
    })

  })

  //Company profile page
  .get('/company-profile/:email',loginSession, (req, res)=>{
    //Acquired data from database
    var user = require('./userDB')
    

    user.find({
      "email": req.params.email,
    })
    .then((response)=>{
      res.render('pages/company-profile',{
        id : req.session.email,
        name : req.session.name,
        email:req.params.email,
        userType : req.session.userType,
        user : response,
        moment: require('moment')
      })
    })

  })

  //Post-job Link
  .get('/post-job',loginSession, (req, res)=>{

    var job = require('./jobDB')
    var user = require('./userDB')

    user.find({
      "email": req.session.email,
    }).then((doc)=>{
      if(doc[0].approve=="approved"){
        job.find({})
        .sort({jobId:-1})
        .then((response=>{
          var dateNow = new Date()
          if(!response[0]){
            req.session.newId = 0
          }else{
            req.session.newId = parseInt(response[0].jobId+1)
          }
          res.render('pages/post-job',{
            id : req.session.email,
            name : req.session.name,      
            userType : req.session.userType,
            dateNow: moment(dateNow).format("YYYY-MM-DD")
        
      })
    }))
      }else if(doc[0].approve=="rejected"){
        console.log("Company rejected")
        res.render('pages/index',{
          id : req.session.email,
          name : req.session.name,      
          userType : req.session.userType,
          error: 5
        })
      }
    })
    

    
  })

  .post('/post-button',(req,res)=>{
    var job = require('./jobDB')

    newJob = new job({
      
      jobId: req.session.newId,
      jobTitle: req.body.jobTitle,
      jobDesc: req.body.jobDesc,
      jobSalary: req.body.jobSalary,
      jobCity: req.body.jobCity,
      jobState: req.body.jobState,
      jobLocation: req.body.jobLocation,
      jobStart: req.body.jobStart,
      jobEnd: req.body.jobEnd,
      jobTime: req.body.jobTime,
      companyEmail: req.session.email
    })


    newJob.save().then(result=>{
      console.log(result)
      res.redirect('/')
    })

  
  })


  //Logout Link       
  .get('/logout',(req,res) => {
    req.session.destroy()
    res.render('pages/index', { 
      id : false,
      name : false,      
      userType : false,
      error: false
      })
    
    console.log("User logged out!")
  })


  //Edit Profile
  .get('/edit-profile',loginSession ,(req, res) =>{
    //Acquired data from database
    var user = require('./userDB')
    var email = req.session.email

    user.find({
      "email": email,
    })
    .then((response)=>{
      res.render('pages/edit-profile',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        user : response,
        DOB : moment(response[0].DOB).format("YYYY-MM-DD")
      })
    })
  })


  //Job Detail Page
  .get('/job-detail/:jobId', (req, res)=>{
    var job = require('./jobDB')
    var user = require('./userDB')
    
    job.aggregate([
      {
        $match:{
          "jobId": parseInt(req.params.jobId)
        }},
      {
      $lookup:{
        from: 'User',
        localField: 'companyEmail',
        foreignField: 'email',
        as: 'companyDetail'
      }}
    ])
    .then((response)=>{
      res.render('pages/job-detail',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        jobDate : moment(response[0].jobStart).format('ll').replace(', ',' ').toString()+" to "+moment(response[0].jobEnd).format('ll').replace(', ',' ').toString(),
        jobs: response
      })
    })
  })

  //Apply job button
  .post('/apply-job/:jobId',loginSession, (req, res)=>{
    var job = require('./jobDB')
    var jobStatus = require('./jobStatusDB')
    
    
    job.findOneAndUpdate({ 
      "jobId": parseInt(req.params.jobId)
    },{
      $addToSet:
        { "candidateEmail" : [req.session.email]}
    }).then((response)=>{
      
      jobStatus.findOneAndUpdate({
        "jobId": parseInt(req.params.jobId),
        "candidateEmail": req.session.email
      },
      {$set:{
        jobId: parseInt(req.params.jobId),
        candidateEmail: req.session.email,
        companyEmail: response.companyEmail,
        status: "Pending",
        ratedCompany: false,
        ratedCandidate: false
      }},
      {upsert:true})
      .then((response2)=>{
        console.log("Job successfully applied!")
        res.redirect('/job-list')
      })
    })
  })

  

  //List all job from navbar search button
  .get('/job-list',(req,res)=>{
    var job = require('./jobDB')

    job.aggregate([{
      $lookup:
       {
         from: 'User',
         localField: 'companyEmail',
         foreignField: 'email',
         as: 'companyDetail'
       }
    }])
    .then((response)=>{
      res.render('pages/job-list',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        jobs: response,
        key: null,
        moment: require('moment')
      })
    })
  })
       
  
  //Search Result
  .post('/job-list',(req,res)=>{
    var job = require('./jobDB')
    
    console.log("searching "+req.body.key)

    job.aggregate([
      
      {
        $lookup:
        {
          from: 'User',
          localField: 'companyEmail',
          foreignField: 'email',
          as: 'companyDetail'
        }},
        {
          $match:{
            $or:[
            { "jobTitle": { $regex: req.body.key , $options: 'i' }},
            {"jobLocation": { $regex: req.body.key , $options: 'i' }},
            {"jobCity": { $regex: req.body.key , $options: 'i' }},
            {"jobState": { $regex: req.body.key , $options: 'i' }},
            {"companyDetail.name": { $regex: req.body.key , $options: 'i' }}]
          }}
      
    ])
    .then((response)=>{
      res.render('pages/job-list',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        key: req.body.key,
        jobs: response,
        moment: require('moment')
      })
    })

  })
 

  //Login button
  .post('/login-button', (req, res) => {
    var user = require('./userDB');
    var email = req.body.email;
    var password = req.body.password;

    user.find({
      "email": email,
      "password": password
    })
    .then((response) => {
        req.session.email = response[0].email;
        req.session.name = response[0].name;
        req.session.userType = response[0].userType

        res.render('pages/index',{
          id : req.session.email,
          name : req.session.name,      
          userType : req.session.userType,
          error: false
        })
        console.log(req.session.email+" logged in!")
    })
    .catch((error) => {
        
      console.log('User not found!');
        
      res.render('pages/login',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        error:3
      })
    })
  })

  //Company profile link
  .get('/company-profile/:email',loginSession,(req,res)=>{
    var user = require('./userDB')

    user.find({
      "email": req.params.email
    })
    .then((response)=>{
      res.render('pages/company-profile',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        email: req.params.email,
        error: false,
        user: response
      })
    })
    
  })

  

  //Company posted job list
  .get('/company-job-list',loginSession,(req,res)=>{
    var job = require('./jobDB')
    
    job.find({
      "companyEmail": req.session.email
    })
    .then((response)=>{
      res.render('pages/company-job-list',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        error: false,
        jobs: response,
        moment: require('moment')
      })
    })
  })

  //Delete job
  .get('/delete-job/:jobId',loginSession,(req,res)=>{
    var job = require('./jobDB')
    
    job.remove({
      "companyEmail": req.session.email,
      "jobId": req.params.jobId
    }).then((response)=>{
      res.redirect('/company-job-list')
    })
  })

  //
  .get('/user-rating/:email',(req,res)=>{
    var rating = require('./ratingDB')

    rating.aggregate([
      {$match:{
        "email":req.params.email
      }},
      {$lookup:{
        from: 'Job',
        localField: 'jobId',
        foreignField: 'jobId',
        as: 'jobDetail'
      }}
      
    ])
    .then((response)=>{
      console.log(response)
      res.render('pages/user-rating',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        ratings: response
      })
    })

  })

  

  
  //Company posted job detail
  .get('/company-job-detail/:jobId',loginSession,(req,res)=>{
    var job = require('./jobDB')
    
    job.aggregate([
      {$match:
        {"jobId": parseInt(req.params.jobId)}
      },
      {$lookup:{
        from: 'JobStatus',
        localField: 'jobId',
        foreignField: 'jobId',
        as: 'jobStatus'
      }}]
    )
    .then((response)=>{
      res.render('pages/company-job-detail',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        error: false,
        jobs: response
      })
    })
  })

  //Register button
  .post('/register-button',existUser,(req,res)=>{
    var user = require('./userDB')
    var dateNow = new Date();
    newUser = new user({
      name: req.body.name,
      userType: "user",
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      DOB: req.body.DOB,
      rating: 0
    })

    
    newUser.save().then(result=>{
      res.render('pages/login',{
        id : req.session.email,
        name : req.session.name,      
        userType : false,
        error: 1
      })
    })

  })


  //edit profile
  .post('/update-profile-button',loginSession,(req,res)=>{
    var user = require('./userDB')

    user.find({
      "email":req.session.email
    })
    .updateOne({
      $set: {
        name: req.body.name,
        gender : req.body.gender,
        DOB: req.body.DOB,
        about: req.body.about,
        phone: req.body.phone,
        address: req.body.address
      }
    })
    .then(response=>{
      
      req.session.name=req.body.name

      res.redirect('/'+req.session.userType+'-profile/'+req.session.email)
    })
  })

  //Register company page
  .get('/register-company',(req,res)=>{
    res.render('pages/register-company',{
      id : req.session.email,
      name : req.session.name,      
      userType : req.session.userType,
      error: false
    })
  })

  //Register company button
  .post('/register-company-button',existUser,(req,res)=>{
    var user = require('./userDB')

    newCompany = new user({
      name: req.body.name,
      userType: "company",
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      phone: req.body.phone,
      rating: 0,
      approve: "pending"
    })

    
    newCompany.save().then(result=>{
      res.render('pages/login',{
        id : req.session.email,
        name : req.session.name,      
        userType : false,
        error: 1
      })
    })
  })

  //User applied job list
  .get('/user-job-list',loginSession, (req,res)=>{
    var job = require('./jobDB')

    job.aggregate([
      {$lookup:
        {
          from: 'User',
          localField: 'companyEmail',
          foreignField: 'email',
          as: 'companyDetail'
        }},
      {$lookup:
        {
          from: 'JobStatus',
          localField: 'jobId',
          foreignField: 'jobId',
          as: 'jobStatus'
        }},
        {$unwind:
          "$jobStatus"
        },
      {$match:
        {"jobStatus.candidateEmail": req.session.email}
      }
      
    ])
    .then((response)=>{
      res.render('pages/user-job-list',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        jobs: response,
        moment: require('moment')

      })
    })

  })

   //User cancel job
   .get('/cancel-job/:jobId',loginSession, (req,res)=>{
    var job = require('./jobDB')
    var jobStatus = require('./jobStatusDB')

    job.findOneAndUpdate({
      "jobId": parseInt(req.params.jobId)
    },{$pull:
      {
        candidateEmail: req.session.email
      }

    }).then((doc)=>{
      
      jobStatus.remove({
        "jobId":parseInt(req.params.jobId),
        "candidateEmail":req.session.email
      }).then((response)=>{
        
        res.redirect('/user-job-list')
      })
    })

  })

  //Admin pending company list
  .get('/admin-company-list', (req,res)=>{
    var user = require('./userDB')

    if(req.session.userType=="admin"){
      user.find({
        "userType": "company",
        "approve": "pending"
      })
      .then((response)=>{
        console.log(response)
        res.render('pages/admin-company-list',{
          id : req.session.email,
          name : req.session.name,      
          userType : req.session.userType,
          users: response
        })
      })
    }else{
      res.redirect('/')
    }
  })

  //Admin changing company status
  .post('/admin-company-list', (req,res)=>{
    var user = require('./userDB')
    
    if(req.session.userType=="admin"){
      user.find({
        "email": req.body.email,
        "userType": "company",
        "approve": "pending"
      })
      .updateOne({
        "approve": req.body.status
      }).then((response)=>{
        res.redirect('/admin-company-list')
      })
    }else{
      res.redirect('/')
    }
  })

  //Admin view all user
  .get('/user-list',loginSession,(req,res)=>{
    
    var user = require('./userDB')

    
      if(req.session.userType=="admin"){
        user.find({
          "userType": "user"
        })
        .then((response)=>{
          console.log(response)
          res.render('pages/user-list',{
            id : req.session.email,
            name : req.session.name,      
            userType : req.session.userType,
            users: response,
            moment: require('moment'),
            key: null
          })
        })
      }else{
        res.redirect('/')
      }
  })

  //Admin view all company
  .get('/company-list',loginSession,(req,res)=>{
    
    var user = require('./userDB')

    
      if(req.session.userType=="admin"){
        user.find({
          $or:[
            {"approve": "approved"},
            {"approve": "rejected"}
          ]
        })
        .then((response)=>{
          res.render('pages/company-list',{
            id : req.session.email,
            name : req.session.name,      
            userType : req.session.userType,
            users: response,
            moment: require('moment'),
            key: null
          })
        })
      }else{
        res.redirect('/')
      }
  })

  .get('/user-list',loginSession,(req,res)=>{
    
    var user = require('./userDB')

    
      if(req.session.userType=="admin"){
        user.find({
          "userType": "user"
        })
        .then((response)=>{
          console.log(response)
          res.render('pages/user-list',{
            id : req.session.email,
            name : req.session.name,      
            userType : req.session.userType,
            users: response,
            moment: require('moment'),
            key: null
          })
        })
      }else{
        res.redirect('/')
      }
  })

  //Admin view all company
  .post('/user-list',loginSession,(req,res)=>{
    
    var user = require('./userDB')

    
      if(req.session.userType=="admin"){
        user.aggregate([
          {$match:
            {$or:[
              {"email":{ $regex: req.body.key , $options: 'i' }},
              {"name":{ $regex: req.body.key , $options: 'i' }},
              {"address":{ $regex: req.body.key , $options: 'i' }}
            ]
          }},
          {$match:
            {"userType":"user"}
          }
        ])
        .then((response)=>{
          res.render('pages/user-list',{
            id : req.session.email,
            name : req.session.name,      
            userType : req.session.userType,
            users: response,
            moment: require('moment'),
            key: req.body.key
          })
        })
      }else{
        res.redirect('/')
      }
  })

  //Admin update status of company
  .post('/company-list',loginSession,(req,res)=>{
    
    var user = require('./userDB')

    console.log(req.body.key)
    
      if(req.session.userType=="admin"){
        user.find({
          "email":req.body.email
        })
        .updateOne({
          "approve": req.body.status
        })
        .then((response)=>{
          res.redirect('/company-list')
          })
        
      }else{
        res.redirect('/')
      }
  })

  //Admin search company
  .post('/company-list/search',loginSession,(req,res)=>{
    
    var user = require('./userDB')

    console.log(req.body.key)
    
    if(req.body.key!=null&&req.body.key!=''){
      if(req.session.userType=="admin"){
        user.aggregate([
          {$match:
            {$or:[
              {"email":{ $regex: req.body.key , $options: 'i' }},
              {"name":{ $regex: req.body.key , $options: 'i' }},
              {"address":{ $regex: req.body.key , $options: 'i' }}
            ]
          }},
          {$match:
            {"userType":"company"}
          }
        ])
        .then((response)=>{
          res.render('pages/company-list',{
            id : req.session.email,
            name : req.session.name,      
            userType : req.session.userType,
            users: response,
            moment: require('moment'),
            key: req.body.key
          })
        })
        
      }else{
        res.redirect('/')
      }
    }else{
      res.redirect('/company-list')
    }
      
  })
  

  //Company view candidate
  .get('/view-candidate/:jobId',loginSession, (req,res)=>{
    var job = require('./jobDB')

    job.aggregate([
      {$lookup:
        {
          from: 'User',
          localField: 'candidateEmail',
          foreignField: 'email',
          as: 'userDetail'
        }},
      {$lookup:
        {
          from: 'JobStatus',
          localField: 'jobId',
          foreignField: 'jobId',
          as: 'jobStatus'
        }},
      {$match:
        {"jobId": parseInt(req.params.jobId)}
      }
      
    ])
    .then((response)=>{
      res.render('pages/view-candidate',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        jobs: response
      })
    })
  })
  
 

  //Company change candidate status
  .post('/view-candidate/:jobId',loginSession, (req,res)=>{
    var job = require('./jobDB')
    var user = require('./userDB')

    job.aggregate([
      {$lookup:
        {
          from: 'User',
          localField: 'candidateEmail',
          foreignField: 'email',
          as: 'userDetail'
        }},
      {$lookup:
        {
          from: 'JobStatus',
          localField: 'jobId',
          foreignField: 'jobId',
          as: 'jobStatus'
        }},
      
      {$match:
        {"jobId": parseInt(req.params.jobId)}
      }
      
    ])
    .then((response)=>{
      
      var jobStatus = require('./jobStatusDB')
      
      jobStatus.find({
        "jobId": response[0].jobId,
        "candidateEmail": req.body.email
      })

      .updateOne({
        $set: {
          status: req.body.status
        }
      })

      .then((response2)=>{
        if(req.body.status=="Finished"){
          user.updateOne({
            "email":req.body.email
          },{
            $addToSet:{
              experience: response[0].jobTitle
            }
          })
          .then((reponse3)=>{
            res.redirect('/view-candidate/'+response[0].jobId.toString())
          })
        }else{
          console.log("Changed status to "+req.body.status)
          res.redirect('/view-candidate/'+response[0].jobId.toString())
        }
        
      })
      
    })
  })

  //rate candidate page
  .get('/rate-candidate',loginSession,(req,res)=>{
    res.render('pages/rating',{
      id : req.session.email,
      name : req.session.name,      
      userType : req.session.userType,
      email : req.query.e,
      jobId : req.query.j,
      buffer: "candidate"
    })
  })

  //rate candidate submit
  .post('/rate-candidate',loginSession,(req,res)=>{
    var rating = require('./ratingDB')
    var jobStatus = require('./jobStatusDB')
    var user= require('./userDB')
    
    newRating = new rating({
      jobId: parseInt(req.query.j),
      email: req.query.e,
      score: parseInt(req.body.score),
      comment: req.body.comment,
      writer: req.session.email
    })
    
    newRating.save().then(result=>{
      
      jobStatus.find({
        "jobId": parseInt(req.query.j),
        "companyEmail": req.session.email,
        "candidateEmail": req.query.e
      })
      .updateOne({
        $set: {
          ratedCandidate: true
        }
      })
      .then((response)=>{
        console.log(req.session.email+" rated "+req.query.e)
        rating.aggregate([
          {$match:{
          "email":req.query.e,
        }},{
          $group:{  
            _id: "$email",
            avg:{$avg:"$score"}
          }
        }])
        .then((response2)=>{
          console.log(response2[0].avg)
          user.find({
            email: req.query.e
          })
          .updateOne({
            rating: parseFloat(response2[0].avg).toFixed(2)
          })
          .then((response3)=>{
            res.redirect('/view-candidate/'+req.query.j)
          })
        })
        
      })
    })
  })
  

  //rate company page
  .get('/rate-company',loginSession,(req,res)=>{
    res.render('pages/rating',{
      id : req.session.email,
      name : req.session.name,      
      userType : req.session.userType,
      email : req.query.e,
      jobId : req.query.j,
      buffer: "company"
    })
  })

  //rate company submit
  .post('/rate-company',loginSession,(req,res)=>{
    var rating = require('./ratingDB')
    var jobStatus = require('./jobStatusDB')
    var user= require('./userDB')
    
    console.log(req.session.email+" rated "+req.query.e)
    newRating = new rating({
      jobId: parseInt(req.query.j),
      email: req.query.e,
      score: parseInt(req.body.score),
      comment: req.body.comment,
      writer: req.session.email
    })
    
    newRating.save().then(result=>{
      console.log(req.session.email+" rated "+req.query.e)
      jobStatus.find({
        "jobId": parseInt(req.query.j),
        "candidateEmail": req.session.email,
        "companyEmail": req.query.e
      })
      .updateOne({
        $set: {
          ratedCompany: true
        }
      })
      .then((response)=>{
        rating.aggregate([
          {$match:{
          "email":req.query.e,
        }},{
          $group:{  
            _id: "$email",
            avg:{$avg:"$score"}
          }
        }])
        .then((response2)=>{
          console.log("New rating ="+response2[0].avg)
          user.find({
            email: req.query.e
          })
          .updateOne({
            rating: parseFloat(response2[0].avg).toFixed(2)
          })
          .then((response3)=>{
            res.redirect('/user-job-list')
          })
        })
        
      })
    })
  })



  //Setting up local host
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


//Login Session
function loginSession(req,res,next){
  var sessionName = req.session.userType;
  if(!sessionName){
    res.render('pages/login',{
      error: 2,
      id: req.session.email,
      name: req.session.name,
      userType: req.session.userType
    });
    console.log('Session invalid');
  }
  else{
    next();
  }
}



//Check if email registered
function existUser(req,res,next){
  var user = require('./userDB')

  user.find({
    "email":req.body.email
  })
  .then(response=>{
    if(response[0]!=null){
      console.log("User existed")
      res.render('pages/register',{
        id : req.session.email,
        name : req.session.name,      
        userType : req.session.userType,
        error: 1
      })
    }
    else{
      next();
    }
  })
}


