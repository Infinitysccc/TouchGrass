// backend/internal/handlers/daily_log_history.go
// Add this file to your backend/internal/handlers/ directory.
//
// Route: GET /daily-log/history?userId=X&days=7
// Returns up to `days` rows from daily_logs ordered oldest→newest.
// Any missing days are NOT gap-filled here — the frontend handles that
// so the DB stays clean and the query stays simple.

package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"backend/internal/services"
)

func DailyLogHistoryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userIDStr := r.URL.Query().Get("userId")
	daysStr   := r.URL.Query().Get("days")

	userID, err := strconv.Atoi(userIDStr)
	if err != nil || userID <= 0 {
		http.Error(w, "invalid userId", http.StatusBadRequest)
		return
	}

	days := 7
	if daysStr != "" {
		if d, err := strconv.Atoi(daysStr); err == nil && d > 0 && d <= 90 {
			days = d
		}
	}

	logs, err := services.GetDailyLogHistory(userID, days)
	if err != nil {
		http.Error(w, "failed to fetch history: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}
