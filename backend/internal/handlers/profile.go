package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend/internal/services"
	"backend/models"
)

// GET or POST /profile?userId=...
func ProfileHandler(w http.ResponseWriter, r *http.Request) {
	// CORS headers
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
		profile, err := services.GetUserProfile(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// friendly message if profile empty
		if profile.Age == 0 && profile.SkinTone == "" {
			w.Write([]byte(`{"message":"No profile found"}`))
			return
		}

		json.NewEncoder(w).Encode(profile)

	case http.MethodPost:
		var p models.UserData
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		p.UserID = userID

		if err := services.UpdateUserProfile(p); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// return updated profile
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(p)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
