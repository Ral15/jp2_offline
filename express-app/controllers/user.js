const User  = require('../models/user');

module.exports = {
  //Login for user
  loginUser: function(request, response) {
    const data = request.body
    User.findOne({ email:  data.email, password: data.password})
    .then((doc) => {
      if (doc) response.render('dashboard', {user: doc})
      else response.render('login', {msg: 'la cagaste perrooo'})
    })
     .catch((err) => {
        console.log(err)
    });
  },
  createUser: function(request, response) {
    // let User = new UserModel();
    const data = request.body
    let new_user = User.create({ 
      firstName: data.first_name,
      lastName: data.last_name, 
      email: data.email,
      password: data.password
    });
    new_user.save()
    .then((user) => {
      console.log(user);
    })
    .catch((err) => {
      console.log(err)
    });
  },
}
