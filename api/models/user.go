package models

type User struct {
	ID       uint   `gorm:"primary_key"`
	Email    string `gorm:"unique"`
	Password string
}
