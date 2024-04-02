package models

import "time"

type User struct {
	ID uint `gorm:"primary_key" json:"id"`

	Username string `gorm:"unique" json:"username"`
	Email    string `gorm:"unique" json:"email"`

	Password string `json:"-"`

	IsVerified        bool   `json:"is_verified" gorm:"default:false"`
	VerificationToken string `json:"-"`

	ResetPasswordToken string `json:"-"`

	CreatedAt time.Time `json:"created_at"`
}
