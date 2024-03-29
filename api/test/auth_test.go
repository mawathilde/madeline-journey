package test

import (
	"madeline-journey/api/controllers"
	"madeline-journey/api/db"
	"madeline-journey/api/jwtUtils"
	"madeline-journey/api/middleware"
	"madeline-journey/api/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	db.ConnectToDb()
	db.SyncDatabase()

	m.Run()
}

func SetUpRouter() *gin.Engine {
	router := gin.Default()
	return router
}

func TestNotAuthenticated(t *testing.T) {
	router := SetUpRouter()

	router.GET("/api/auth/validate", middleware.RequireAuth, controllers.Validate)

	req, _ := http.NewRequest("GET", "/api/auth/validate", nil)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusBadRequest, resp.Code)
}

func TestAuthenticatedWithInvalidToken(t *testing.T) {
	router := SetUpRouter()

	router.GET("/api/auth/validate", middleware.RequireAuth, controllers.Validate)

	req, _ := http.NewRequest("GET", "/api/auth/validate", nil)
	req.Header.Set("Authorization", "Bearer invalid_token")
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusUnauthorized, resp.Code)
}

func TestAuthenticatedWithValidTokenButUserNotFound(t *testing.T) {
	router := SetUpRouter()

	router.GET("/api/auth/validate", middleware.RequireAuth, controllers.Validate)

	req, _ := http.NewRequest("GET", "/api/auth/validate", nil)

	token, _ := jwtUtils.GenerateToken(models.User{Email: "madeline@celeste.game", Password: "bird"})

	req.Header.Set("Authorization", "Bearer "+token)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusUnauthorized, resp.Code)
}
