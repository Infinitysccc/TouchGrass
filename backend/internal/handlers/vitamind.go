package handlers

import (
	"backend/models"
	"backend/internal/services"
	"encoding/json"
	"net/http"
)

func CalculateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var data models.UserData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	result := services.CalculateVitaminD(data)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}