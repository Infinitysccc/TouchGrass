// backend/internal/services/daily_log_history.go
// Add this file to your backend/internal/services/ directory.
//
// Queries daily_logs for the last N calendar days for a given user.
// Rows are ordered oldest → newest so the frontend can map them
// directly into a left-to-right chart.

package services

import (
	"backend/internal/db"
	"backend/models"
)

// GetDailyLogHistory returns up to `days` rows from daily_logs,
// ordered oldest first (so charts render left→right naturally).
// Days with no data are omitted — the frontend gap-fills them.
func GetDailyLogHistory(userID int, days int) ([]models.DailyLog, error) {
	rows, err := db.DB.Query(`
		SELECT user_id, date::text, supp_iu, food_iu, sun_iu, uv_index, bracelet_status
		FROM   daily_logs
		WHERE  user_id = $1
		  AND  date >= CURRENT_DATE - ($2 - 1) * INTERVAL '1 day'
		ORDER  BY date ASC
		LIMIT  $2
	`, userID, days)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []models.DailyLog
	for rows.Next() {
		var l models.DailyLog
		if err := rows.Scan(
			&l.UserID, &l.Date, &l.SuppIU, &l.FoodIU,
			&l.SunIU, &l.UVIndex, &l.BraceletStatus,
		); err != nil {
			return nil, err
		}
		logs = append(logs, l)
	}
	// Return empty slice (not nil) so JSON encodes as [] not null
	if logs == nil {
		logs = []models.DailyLog{}
	}
	return logs, rows.Err()
}
