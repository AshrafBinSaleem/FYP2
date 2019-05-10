module.exports ={
    //login check
    isLoggedIn : function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }
  
}