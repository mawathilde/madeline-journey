package db

import "madeline-journey/api/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
}
