// backend/internal/handlers/daily_log.go
package handlers

import (
	"backend/internal/services"
	"backend/models"
	"encoding/json"
	"net/http"
	"strconv"
	"time"
)

// DailyLogHandler handles GET and POST for /daily-log?userId=...&date=...
//
// GET  /daily-log?userId=1&date=2026-03-25
//      Returns today's saved log for the user.
//      If no log exists yet, returns zeroed defaults so the frontend
//      always gets a valid JSON response.
//
// POST /daily-log?userId=1
//      Body: { suppIU, foodIU, sunIU, uvIndex, braceletStatus }
//      Upserts the log for today (date is set server-side to avoid
//      timezone drift between client and server).
func DailyLogHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

	if r.Method == http.MethodOptions {
		return
	}

	userIDStr := r.URL.Query().Get("userId")
	if userIDStr == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "invalid userId", http.StatusBadRequest)
		return
	}

	switch r.Method {

	case http.MethodGet:
		// Use provided date or default to today
		date := r.URL.Query().Get("date")
		if date == "" {
			date = time.Now().Format("2006-01-02")
		}

		log, err := services.GetDailyLog(userID, date)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(log)

	case http.MethodPost:
		var body models.DailyLog
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Always set date server-side to today to avoid client timezone issues
		body.UserID = userID
		body.Date = time.Now().Format("2006-01-02")

		if err := services.SaveDailyLog(body); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "saved"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
