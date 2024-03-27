package main

import (
	"madeline-journey/api/controllers"
	"madeline-journey/api/db"

	"github.com/gin-gonic/gin"
)

func init() {
	//db.LoadEnvVariables()
	db.ConnectToDb()
	db.SyncDatabase()
}

func main() {
	r := gin.Default()

	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)
	//r.GET("/validate", middleware.RequireAuth ,controllers.Validate).  // here RequireAuth is a middleware that we will be creating below. It protects the route

	r.Run()
}
