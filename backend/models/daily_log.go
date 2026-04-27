// backend/models/daily_log.go
package models

// DailyLog holds everything tracked for a single day for one user.
// The Date field is stored as "YYYY-MM-DD" so each user has at most
// one row per calendar day — saved with INSERT ON CONFLICT DO UPDATE.
type DailyLog struct {
	UserID      int     `json:"userId"`
	Date        string  `json:"date"`        // "YYYY-MM-DD"
	SuppIU      int     `json:"suppIU"`      // supplement IU logged today
	FoodIU      int     `json:"foodIU"`      // dietary IU logged today
	SunIU       int     `json:"sunIU"`       // estimated IU from UV readings
	UVIndex     float64 `json:"uvIndex"`     // last UV index reading of the day
	BraceletStatus string `json:"braceletStatus"` // last bracelet LED state
}
