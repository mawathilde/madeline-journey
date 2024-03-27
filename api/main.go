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
	app := gin.Default()

	api := app.Group("/api")
	api.Use(middleware.RequireAuth)

	app.POST("api/auth/register", controllers.Register)
	app.POST("api/auth/login", controllers.Login)

	api.GET("auth/validate", middleware.RequireAuth, controllers.Validate)

	app.Run()
}
