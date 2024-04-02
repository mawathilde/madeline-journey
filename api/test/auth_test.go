package test

import (
	"bytes"
	"encoding/json"
	"madeline-journey/api/controllers"
	"madeline-journey/api/db"
	"madeline-journey/api/jwtUtils"
	"madeline-journey/api/middleware"
	"madeline-journey/api/models"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

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
	gin.SetMode(gin.TestMode)
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

func TestAuthenticatedWithValidTokenAndUserFound(t *testing.T) {
	router := SetUpRouter()

	router.GET("/api/auth/validate", middleware.RequireAuth, controllers.Validate)

	user := models.User{Email: time.Now().GoString(), Password: "bird"}

	db.DB.Create(&user)

	token, _ := jwtUtils.GenerateToken(user)

	print(user.ID)

	req, _ := http.NewRequest("GET", "/api/auth/validate", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp := httptest.NewRecorder()

	router.ServeHTTP(resp, req)

	print(resp.Body.String())
	print(resp.Code)

	assert.Equal(t, http.StatusOK, resp.Code)

	db.DB.Delete(&user)
}

func TestFullAuthentificationFlowWithCookie(t *testing.T) {
	router := SetUpRouter()

	router.POST("/api/auth/register", controllers.Register)
	router.POST("/api/auth/login", controllers.Login)
	router.GET("/api/auth/validate", middleware.RequireAuth, controllers.Validate)

	user := models.User{Email: time.Now().GoString(), Password: "bird"}

	// Register user
	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
	var userFromDb models.User
	db.DB.Where("email = ?", user.Email).First(&userFromDb)
	assert.Equal(t, user.Email, userFromDb.Email)

	// Login user
	req, _ = http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	resp = httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
	var tokenResponse models.TokenResponse
	json.NewDecoder(resp.Body).Decode(&tokenResponse)
	assert.NotEmpty(t, tokenResponse.Token)

	// Validate token locally
	token, err := jwtUtils.ParseToken(tokenResponse.Token)
	assert.Nil(t, err)
	assert.NotNil(t, token)

	// Validate user
	req, _ = http.NewRequest("GET", "/api/auth/validate", nil)
	req.Header.Set("Cookie", resp.Header().Get("Set-Cookie")) // Copy cookie from login response

	resp = httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)

	db.DB.Delete(&user)
}
