// src/pages/VitaminDTracker.tsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

type UserData = {
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

type Result = {
    recommendedIU: number;
    category: string;
};

/* ---------- OPTION CONSTANTS (MATCH BACKEND) ---------- */
const SKIN_TONES = ["Light", "Medium", "Dark"] as const;
const BODY_COVERAGE = ["Full", "Arms & Legs", "Face only"] as const;

export default function VitaminDTracker() {
    const [data, setData] = useState<UserData>({
        age: 0,
        skinTone: "Medium",
        bodyCoverage: "Full",
        timeOutdoors: 0,
        dietaryIU: 0,
        supplementIU: 0,
        weight: 0,
        height: 0,
        medicalConditions: false,
    });

    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---------- LOAD PROFILE DEFAULTS ---------- */
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const res = await fetch(`http://localhost:8080/profile?userId=${user.id}`);
                if (!res.ok) throw new Error();

                const p = await res.json();

                setData({
                    age: p.age ?? 0,
                    skinTone: p.skinTone ?? "Medium",
                    bodyCoverage: p.bodyCoverage ?? "Full",
                    timeOutdoors: p.timeOutdoors ?? 0,
                    dietaryIU: p.dietaryIU ?? 0,
                    supplementIU: p.supplementIU ?? 0,
                    weight: p.weight ?? 0,
                    height: p.height ?? 0,
                    medicalConditions: p.medicalConditions ?? false,
                    bloodLevel: p.bloodLevel,
                });
            } catch {
                console.warn("Profile not loaded — manual input only");
            } finally {
                setLoadingProfile(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = <K extends keyof UserData>(
        field: K,
        value: UserData[K]
    ) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("http://localhost:8080/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error(await res.text());
            setResult(await res.json());
        } catch (err: any) {
            setError(err.message || "Calculation failed");
        } finally {
            setLoading(false);
        }
    };

    if (loadingProfile) {
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box maxWidth={500} mx="auto" mt={4} p={3} bgcolor="background.paper" borderRadius={2}>
            <Typography variant="h5" mb={2}>
                Vitamin D Tracker
            </Typography>

            {/* -------- AGE -------- */}
            <TextField
                label="Age"
                type="number"
                fullWidth
                margin="normal"
                value={data.age}
                onChange={(e) => handleChange("age", Number(e.target.value))}
            />

            {/* -------- SKIN TONE -------- */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Skin Tone</InputLabel>
                <Select
                    value={data.skinTone}
                    label="Skin Tone"
                    onChange={(e) => handleChange("skinTone", e.target.value as UserData["skinTone"])}
                >
                    {SKIN_TONES.map((tone) => (
                        <MenuItem key={tone} value={tone}>
                            {tone}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* -------- BODY COVERAGE -------- */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Body Coverage</InputLabel>
                <Select
                    value={data.bodyCoverage}
                    label="Body Coverage"
                    onChange={(e) =>
                        handleChange("bodyCoverage", e.target.value as UserData["bodyCoverage"])
                    }
                >
                    {BODY_COVERAGE.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Time Outdoors Today (minutes)"
                type="number"
                fullWidth
                margin="normal"
                value={data.timeOutdoors}
                onChange={(e) => handleChange("timeOutdoors", Number(e.target.value))}
            />

            <TextField
                label="Dietary Vitamin D (IU)"
                type="number"
                fullWidth
                margin="normal"
                value={data.dietaryIU}
                onChange={(e) => handleChange("dietaryIU", Number(e.target.value))}
            />

            <TextField
                label="Supplement Vitamin D (IU)"
                type="number"
                fullWidth
                margin="normal"
                value={data.supplementIU}
                onChange={(e) => handleChange("supplementIU", Number(e.target.value))}
            />

            <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSubmit} disabled={loading}>
                {loading ? "Calculating..." : "Calculate"}
            </Button>

            {error && <Typography color="error" mt={2}>{error}</Typography>}

            {result && (
                <Box mt={3}>
                    <Typography fontWeight="bold">
                        Recommended IU: {result.recommendedIU}
                    </Typography>
                    <Typography>Category: {result.category}</Typography>
                </Box>
            )}
        </Box>
    );
}
