package controllers

import (
	"fmt"
	"madeline-journey/api/db"
	"madeline-journey/api/models"
	"madeline-journey/api/utils"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	// Get the email/pass off req Body
	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, models.Response{Message: "Failed to read body"})

		return
	}

	// check if the body is valid
	if body.Username == "" || body.Email == "" || body.Password == "" {
		c.JSON(http.StatusBadRequest, models.Response{Message: "Invalid body"})
		return
	}
	if !strings.Contains(body.Email, "@") {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid email",
		})
		return
	}
	if len(body.Password) < 6 {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Password must be at least 6 characters",
		})
		return
	}

	// Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Internal error. Failed to hash password.",
		})
		return
	}

	// Create the user
	user := models.User{
		Username:          body.Username,
		Email:             body.Email,
		Password:          string(hash),
		VerificationToken: uuid.New().String(),
	}

	result := db.DB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Username or email already exists.",
		})
	} else {

		mailData := struct {
			Username  string
			VerifyURL string
		}{
			Username:  user.Username,
			VerifyURL: fmt.Sprintf("http://localhost:8080/verify/%s", user.VerificationToken),
		}

		re := utils.NewRequest([]string{user.Email}, "Madeline's Journey - Verify your account", "")
		if err := re.ParseTemplate("templates/mail/verify_email.txt", mailData); err == nil {
			ok, _ := re.SendEmail()
			fmt.Println(ok)
		} else {
			fmt.Println(err)
		}

		c.JSON(http.StatusOK, models.Response{Message: "User created."})
	}
}

func Login(c *gin.Context) {
	// Get email & pass off req body
	var loginRequest models.LoginRequest

	if c.Bind(&loginRequest) != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Failed to read body",
		})

		return
	}

	// Look up for requested user
	var user models.User

	db.DB.First(&user, "username = ?", loginRequest.Username)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid username or password",
		})
		return
	}

	// Compare sent in password with saved users password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid email or password",
		})
		return
	}

	if !user.IsVerified {
		c.JSON(http.StatusUnauthorized, models.Response{
			Message: "Please verify your email before logging in. You can request a new verification email by clicking 'Verify my email'",
		})
		return
	}

	// Generate a JWT token
	tokenString, err := utils.GenerateToken(user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	// Respond
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24, "", "", false, true)

	tokenResponse := models.TokenResponse{Token: tokenString, ExpiresAt: time.Now().Add(time.Hour * 24).Unix()}

	c.JSON(http.StatusOK, tokenResponse)
}

func Validate(c *gin.Context) {
	user, _ := c.Get("user")

	c.JSON(http.StatusOK, gin.H{
		"message": "You are authenticated!",
		"user":    user,
	})
}

func Verify(c *gin.Context) {
	var body struct {
		Token string `json:"token"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Failed to read body",
		})
		return
	}

	if body.Token == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid token",
		})
		return
	}

	var user models.User

	db.DB.First(&user, "verification_token = ?", body.Token)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, models.Response{
			Message: "Invalid token",
		})
		return
	}

	user.IsVerified = true
	user.VerificationToken = ""

	db.DB.Save(&user)

	c.JSON(http.StatusOK, models.Response{
		Message: "Email verified",
	})
}
