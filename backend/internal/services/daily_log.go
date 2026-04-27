// backend/internal/services/daily_log.go
package services

import (
	"backend/internal/db"
	"backend/models"
)

// SaveDailyLog upserts today's log for a user.
// Calling this on every change is safe — it uses ON CONFLICT DO UPDATE
// so it always results in exactly one row per user per day.
func SaveDailyLog(log models.DailyLog) error {
	_, err := db.DB.Exec(`
		INSERT INTO daily_logs
			(user_id, date, supp_iu, food_iu, sun_iu, uv_index, bracelet_status, updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (user_id, date)
		DO UPDATE SET
			supp_iu          = EXCLUDED.supp_iu,
			food_iu          = EXCLUDED.food_iu,
			sun_iu           = EXCLUDED.sun_iu,
			uv_index         = EXCLUDED.uv_index,
			bracelet_status  = EXCLUDED.bracelet_status,
			updated_at       = NOW()
	`,
		log.UserID,
		log.Date,
		log.SuppIU,
		log.FoodIU,
		log.SunIU,
		log.UVIndex,
		log.BraceletStatus,
	)
	return err
}

// GetDailyLog retrieves the log for a specific user and date ("YYYY-MM-DD").
// Returns an empty log (all zeros) if no row exists yet — never an error for
// missing rows, so the frontend always gets a valid response.
func GetDailyLog(userID int, date string) (models.DailyLog, error) {
	log := models.DailyLog{
		UserID:         userID,
		Date:           date,
		BraceletStatus: "Disconnected",
	}

	err := db.DB.QueryRow(`
		SELECT supp_iu, food_iu, sun_iu, uv_index, bracelet_status
		FROM daily_logs
		WHERE user_id = $1 AND date = $2
	`, userID, date).Scan(
		&log.SuppIU,
		&log.FoodIU,
		&log.SunIU,
		&log.UVIndex,
		&log.BraceletStatus,
	)

	if err != nil && err.Error() == "sql: no rows in result set" {
		// No log yet for today — return the empty default, not an error
		return log, nil
	}
	return log, err
}
