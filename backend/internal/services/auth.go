
package services

import (
	"database/sql"
	"errors"

	"backend/internal/db"
	"backend/models"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(req models.RegisterRequest) (models.AuthResponse, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.AuthResponse{}, err
	}

	var id int
	err = db.DB.QueryRow(`
        INSERT INTO auth_users (name, age, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, req.Name, req.Age, req.Email, string(hashedPassword)).Scan(&id)

	if err != nil {
		return models.AuthResponse{}, err
	}

	return models.AuthResponse{ID: id, Email: req.Email}, nil
}

func LoginUser(req models.LoginRequest) (models.AuthResponse, error) {
	var id int
	var email, hashedPassword string

	err := db.DB.QueryRow(`
        SELECT id, email, password_hash
        FROM auth_users
        WHERE email=$1
    `, req.Email).Scan(&id, &email, &hashedPassword)

	if err == sql.ErrNoRows {
		return models.AuthResponse{}, errors.New("invalid email or password")
	}
	if err != nil {
		return models.AuthResponse{}, err
	}

	if bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)) != nil {
		return models.AuthResponse{}, errors.New("invalid email or password")
	}

	return models.AuthResponse{ID: id, Email: email}, nil
}