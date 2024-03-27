package main

import (
	"madeline-journey/api/controllers"
	"madeline-journey/api/db"
	"madeline-journey/api/middleware"

	"github.com/gin-gonic/gin"
)

func init() {
	db.LoadEnvVariables()
	db.ConnectToDb()
	db.SyncDatabase()
}

func main() {
	r := gin.Default()

	api := r.Group("/api")
	api.Use(middleware.RequireAuth)

	r.POST("api/auth/register", controllers.Register)
	r.POST("api/auth/login", controllers.Login)

	api.GET("auth/validate", middleware.RequireAuth, controllers.Validate)

	r.Run()
}
