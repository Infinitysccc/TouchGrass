/*export interface UserData {
    age: number;
    skinTone: "Light" | "Medium" | "Dark";
    bodyCoverage: "Full" | "Arms & Legs" | "Face only";
    timeOutdoors: number;
    dietaryIU: number;
    supplementIU: number;
    weight: number;
    height: number;
    medicalConditions: boolean;
    bloodLevel?: number;
}

export function calculateVitaminD(user: UserData) {
    const RDI = user.age <= 1 ? 400 : user.age <= 70 ? 600 : 800;

    const skinFactor = { Light: 1, Medium: 0.75, Dark: 0.5 }[user.skinTone];
    const coverageFactor = { "Arms & Legs": 1, "Face only": 0.3, Full: 0 }[user.bodyCoverage];
    const timeFactor = Math.min(user.timeOutdoors / 30, 1);
    const sunlightIU = 600 * skinFactor * coverageFactor * timeFactor;

    const totalIU = sunlightIU + user.dietaryIU + user.supplementIU;

    let adjustment = 1;
    if (user.age > 70) adjustment *= 1.2;
    const BMI = user.weight / (user.height * user.height);
    if (BMI >= 30) adjustment *= 1.3;
    if (user.medicalConditions) adjustment *= 1.5;

    const adjustedIU = totalIU * adjustment;

    let recommendedIU = Math.max(0, RDI - adjustedIU);

    // Adjust based on blood level only if calculated IU is below threshold
    if (user.bloodLevel !== undefined && user.bloodLevel !== null) {
        if (user.bloodLevel < 20 && recommendedIU < 1000) {
            recommendedIU = 1000;
        } else if (user.bloodLevel < 30 && recommendedIU < 400) {
            recommendedIU = 400;
        } else if (user.bloodLevel >= 30) {
            recommendedIU = 0;
        }
    }

    let category = "";
    if (recommendedIU === 0) category = "Optimal";
    else if (recommendedIU < 400) category = "Deficient";
    else if (recommendedIU < 600) category = "Insufficient";
    else category = "Sufficient";


    return { recommendedIU: Math.round(recommendedIU), category };
}
*/