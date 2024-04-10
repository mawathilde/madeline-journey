package main

import (
	"madeline-journey/api/controllers"
	"madeline-journey/api/db"
	"madeline-journey/api/middleware"
	"time"

	"github.com/gin-gonic/contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	db.LoadEnvVariables()
	db.ConnectToDb()
	db.SyncDatabase()
}

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowedOrigins:   []string{"http://localhost:8080"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           time.Hour,
	}))

	api := r.Group("/")
	api.Use(middleware.RequireAuth)

	r.POST("auth/register", controllers.Register)
	r.POST("auth/login", controllers.Login)

	api.GET("auth/validate", middleware.RequireAuth, controllers.Validate)

	r.Run()
}
