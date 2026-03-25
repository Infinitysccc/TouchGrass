
package services

import (
	"math"

	"backend/models"
)

func CalculateVitaminD(user models.UserData) models.Result {
	var RDI float64
	if user.Age <= 1 {
		RDI = 400
	} else if user.Age <= 70 {
		RDI = 600
	} else {
		RDI = 800
	}

	// safe map lookup: default to 1 or 0 as appropriate
	skinFactorMap := map[string]float64{"Light": 1, "Medium": 0.75, "Dark": 0.5}
	coverageFactorMap := map[string]float64{"Full": 0, "Arms & Legs": 1, "Face only": 0.3}
	skinFactor := skinFactorMap[user.SkinTone]
	if skinFactor == 0 {
		skinFactor = 1
	}
	coverageFactor := coverageFactorMap[user.BodyCoverage]
	timeFactor := math.Min(user.TimeOutdoors/30, 1)

	sunlightIU := 600 * skinFactor * coverageFactor * timeFactor
	totalIU := sunlightIU + user.DietaryIU + user.SupplementIU

	adjustment := 1.0
	if user.Age > 70 {
		adjustment *= 1.2
	}

	// avoid division by zero for height
	if user.Height > 0 {
		BMI := user.Weight / (user.Height * user.Height)
		if BMI >= 30 {
			adjustment *= 1.3
		}
	}

	if user.MedicalConditions {
		adjustment *= 1.5
	}

	adjustedIU := totalIU * adjustment
	recommendedIU := math.Max(0, RDI-adjustedIU)

	if user.BloodLevel != nil {
		if *user.BloodLevel < 20 && recommendedIU < 1000 {
			recommendedIU = 1000
		} else if *user.BloodLevel < 30 && recommendedIU < 400 {
			recommendedIU = 400
		} else if *user.BloodLevel >= 30 {
			recommendedIU = 0
		}
	}

	category := "Sufficient"
	if recommendedIU == 0 {
		category = "Optimal"
	} else if recommendedIU < 400 {
		category = "Deficient"
	} else if recommendedIU < 600 {
		category = "Insufficient"
	}

	return models.Result{
		RecommendedIU: int(math.Round(recommendedIU)),
		Category:      category,
	}
}