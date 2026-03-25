
// models/user.go
package models

type UserData struct {
	UserID            int      `json:"userId"` // link to auth_users.id
	Age               int      `json:"age"`
	SkinTone          string   `json:"skinTone"`
	BodyCoverage      string   `json:"bodyCoverage"`
	TimeOutdoors      float64  `json:"timeOutdoors"`
	DietaryIU         float64  `json:"dietaryIU"`
	SupplementIU      float64  `json:"supplementIU"`
	Weight            float64  `json:"weight"`
	Height            float64  `json:"height"`
	MedicalConditions bool     `json:"medicalConditions"`
	BloodLevel        *float64 `json:"bloodLevel,omitempty"`
}

type Result struct {
	RecommendedIU int    `json:"recommendedIU"`
	Category      string `json:"category"`
}