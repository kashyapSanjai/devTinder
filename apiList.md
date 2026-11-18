# API LIst


# authRouter
- POST /signup
- POST /login
- PATCH /forgot-password
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- POST /profile/update-password //old password, new passowrd, confirm password, chekc user exist, not same  pass with currebt pass 

# connectionRouter
- POST /request/send/status/userid      
- POST /request/review/status/requestId

# userRouter
- GET /user/requests/recieved
- GET /user/connections
- GET /user/feed?page=1&limit=10



