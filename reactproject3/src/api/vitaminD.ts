export type UserData = {
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
};

export type VitaminDResult = {
    recommendedIU: number;
    category: string;
};

export async function calculateVitaminD(user: UserData): Promise<VitaminDResult> {
    const response = await fetch("http://localhost:8080/api/vitamin-d/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Failed to calculate vitamin D");
    }

    return response.json();
}
