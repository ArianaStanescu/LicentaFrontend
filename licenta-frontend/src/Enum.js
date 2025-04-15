export const ActivityCategory = {
    SPORTS: "Sport",
    ART: "Artă",
    MUSIC: "Muzică",
    SCIENCE: "Știință",
    TECHNOLOGY: "Tehnologie",
    LANGUAGE: "Limbi străine",
    EDUCATION: "Educație",
    EXAM_PREP: "Pregătire examene",
};

export const Gender = {
    MALE: 'Masculin',
    FEMALE: 'Feminin',
    NEUTRAL: 'Neutru',
};

export const Weekday = {
    MONDAY: 'Luni',
    TUESDAY: 'Marți',
    WEDNESDAY: 'Miercuri',
    THURSDAY: 'Joi',
    FRIDAY: 'Vineri',
    SATURDAY: 'Sâmbătă',
    SUNDAY: 'Duminică',
}

export const dayIndexToEnum = {
    0: Weekday.SUNDAY,
    1: Weekday.MONDAY,
    2: Weekday.TUESDAY,
    3: Weekday.WEDNESDAY,
    4: Weekday.THURSDAY,
    5: Weekday.FRIDAY,
    6: Weekday.SATURDAY,
};

export const GroupStatus = {
    ACTIVE: 'Activă',
    COMPLETED: 'Finalizată',
}

export const TrainerReviewGradeFromNumberToText = {
    1: "ONE",
    2: "TWO",
    3: "THREE",
    4: "FOUR",
    5: "FIVE"
}

export const TrainerReviewGradeFromTextToNumber = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
}