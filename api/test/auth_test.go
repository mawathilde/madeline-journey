package test

import (
	"madeline-journey/api/controllers"
	"madeline-journey/api/db"
	"madeline-journey/api/middleware"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	db.ConnectToDb()

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

	assert.Equal(t, http.StatusUnauthorized, resp.Code)
}
