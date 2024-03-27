package middleware

import (
	"fmt"
	"madeline-journey/api/db"
	"madeline-journey/api/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	// Get the cookie off the request
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	// Decode/validate it
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if token != nil && token.Valid {
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// Check the expiry date
			if float64(time.Now().Unix()) > claims["exp"].(float64) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
			}

			// Find the user with token Subject
			var user models.User
			db.DB.First(&user, claims["sub"])

			if user.ID == 0 {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Valid token but user not found, wait what?"})
			}

			// Attach the request
			c.Set("user", user)
			c.Set("claims", claims)

			// Continue
			c.Next()
		} else {
			// Abort with a message
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		}
	} else {
		// Abort with a message
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
	}

}
