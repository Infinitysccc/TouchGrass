// backend/main.go  ← REPLACE your existing main.go with this
package main

import (
	"log"
	"net/http"
	"backend/internal/db"
	"backend/internal/handlers"
	"backend/internal/middleware"
)

func main() {
	mux := http.NewServeMux()

	db.Connect()

	mux.HandleFunc("/register",            handlers.RegisterHandler)
	mux.HandleFunc("/login",               handlers.LoginHandler)
	mux.HandleFunc("/profile",             handlers.ProfileHandler)
	mux.HandleFunc("/calculate",           handlers.CalculateHandler)
	mux.HandleFunc("/daily-log",           handlers.DailyLogHandler)
	mux.HandleFunc("/daily-log/history",   handlers.DailyLogHistoryHandler) // ← NEW

	log.Println("Server running on http://localhost:8080")
	err := http.ListenAndServe(":8080", middleware.CORS(mux))
	if err != nil {
		log.Fatal(err)
	}
}
