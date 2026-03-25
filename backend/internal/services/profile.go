package services

import (
	"database/sql"

	"backend/internal/db"
	"backend/models"
)

func GetUserProfile(userID int) (models.UserData, error) {
	var p models.UserData
	var bloodLevel sql.NullFloat64

	row := db.DB.QueryRow(`
        SELECT age, skin_tone, body_coverage, time_outdoors,
               dietary_iu, supplement_iu, weight, height,
               medical_conditions, blood_level
        FROM user_data
        WHERE user_id = $1
    `, userID)

	err := row.Scan(
		&p.Age,
		&p.SkinTone,
		&p.BodyCoverage,
		&p.TimeOutdoors,
		&p.DietaryIU,
		&p.SupplementIU,
		&p.Weight,
		&p.Height,
		&p.MedicalConditions,
		&bloodLevel,
	)

	if err == sql.ErrNoRows {
		p.UserID = userID
		return p, nil
	}
	if err != nil {
		return p, err
	}

	if bloodLevel.Valid {
		p.BloodLevel = &bloodLevel.Float64
	} else {
		p.BloodLevel = nil
	}

	p.UserID = userID
	return p, nil
}

func UpdateUserProfile(p models.UserData) error {
	_, err := db.DB.Exec(`
        INSERT INTO user_data
        (user_id, age, skin_tone, body_coverage, time_outdoors, dietary_iu, supplement_iu, weight, height, medical_conditions, blood_level)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (user_id) DO UPDATE SET
        age = EXCLUDED.age,
        skin_tone = EXCLUDED.skin_tone,
        body_coverage = EXCLUDED.body_coverage,
        time_outdoors = EXCLUDED.time_outdoors,
        dietary_iu = EXCLUDED.dietary_iu,
        supplement_iu = EXCLUDED.supplement_iu,
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        medical_conditions = EXCLUDED.medical_conditions,
        blood_level = EXCLUDED.blood_level
    `, p.UserID, p.Age, p.SkinTone, p.BodyCoverage, p.TimeOutdoors, p.DietaryIU,
		p.SupplementIU, p.Weight, p.Height, p.MedicalConditions, p.BloodLevel)

	return err
}
