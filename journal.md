Entry 1, 11/18/2023: Ivan - Current issues to ponder
So, I have downloaded Redis and played around with it, seeing how to basically create 'tables', and I watched a video on caching previously grabbed table information from a seperate, persistant database. In our case, this persistant database could be made with Redis. Or our mariadb database, with Redis providing a caching layer to improve performance (which I think is the better way to go, we can still argue that it is faster, lowers the total amount of api or server calls, etc...).

One problem. 
To make this work, we will have to find a way to host a server that can hold our Redis database (or Redis caching layer, same thing). I can't just host one on my home network...because my home network is the school network, and I do not have permissions to open up or use any ports and host a server here I don't think. Another possible option is to host a server with AWS or something, and have a Redis database on there. This will work, but it might be a couple of dollars a month (suffering). There is a free server that we can use, provided by Redis. However, I am not sure if this will have the features that we need for our showcase. I will look into it. 
link to Redis Cloud: https://redis.com/try-free/?utm_source=redisio&utm_medium=referral&utm_campaign=2023-09-try_free&utm_content=cu-redis_cloud_users&_gl=1*x6s9y5*_ga*NDQ2NTg5ODE5LjE3MDAwODY4ODU.*_ga_8BKGRQKRPV*MTcwMDM1Nzk1NC40LjEuMTcwMDM1OTcyMC41OS4wLjA.*_gcl_au*OTUwMjE5MDMuMTcwMDA4Njg4NQ..&_ga=2.157509689.2045664065.1700352256-446589819.1700086885

If we do this, I do not think that our 
ps. I also made this project private, because it will likely show our server connection details/credentials in it. It seems dangerous to show the world everything.


