const questions = [
    {
        trait: "Openness",
        aspect: "Intellect",
        facet: {
            name: "Quickness",
            agreeScores: { Intellect: 0.86 },  // Higher score for Agree
            disagreeScores: { Receptivity: 0.38 }  // Lower score for Disagree
        },
        question: "I quickly understand complex ideas."
    },
    {
        trait: "Openness",
        aspect: "Receptivity",
        facet: {
            name: "Flexibility",
            agreeScores: { Receptivity: 0.75 },  // Higher score for Agree
            disagreeScores: { Intellect: 0.25 }  // Lower score for Disagree
        },
        question: "I am open to change and new ideas."
    },
    {
        trait: "Conscientiousness",
        aspect: "Industriousness",
        facet: {
            name: "Purposefulness",
            agreeScores: { Industriousness: 0.77 },  // Higher score for Agree
            disagreeScores: { Orderliness: 0.42 }  // Lower score for Disagree
        },
        question: "I pursue my goals with determination."
    },
    {
        trait: "Conscientiousness",
        aspect: "Orderliness",
        facet: {
            name: "Rationality",
            agreeScores: { Orderliness: 0.71 },  // Higher score for Agree
            disagreeScores: { Industriousness: 0.39 }  // Lower score for Disagree
        },
        question: "I make rational, thought-out decisions."
    },
    {
        trait: "Extraversion",
        aspect: "Enthusiasm",
        facet: {
            name: "Friendliness",
            agreeScores: { Enthusiasm: 0.78 },  // Higher score for Agree
            disagreeScores: { Assertiveness: 0.31 }  // Lower score for Disagree
        },
        question: "I make friends easily."
    },
    {
        trait: "Extraversion",
        aspect: "Assertiveness",
        facet: {
            name: "Excitement Seeking",
            agreeScores: { Assertiveness: 0.79 },  // Higher score for Agree
            disagreeScores: { Enthusiasm: 0.28 }  // Lower score for Disagree
        },
        question: "I seek out exciting experiences."
    },
    {
        trait: "Agreeableness",
        aspect: "Compassion",
        facet: {
            name: "Caring",
            agreeScores: { Compassion: 0.83 },  // Higher score for Agree
            disagreeScores: { Politeness: 0.41 }  // Lower score for Disagree
        },
        question: "I care deeply about others."
    },
    {
        trait: "Agreeableness",
        aspect: "Politeness",
        facet: {
            name: "Moral",
            agreeScores: { Politeness: 0.76 },  // Higher score for Agree
            disagreeScores: { Compassion: 0.32 }  // Lower score for Disagree
        },
        question: "I act in ways that reflect my moral values."
    },
    {
        trait: "Neuroticism",
        aspect: "Volatility",
        facet: {
            name: "Stability",
            agreeScores: { Volatility: 0.78 },  // Higher score for Agree
            disagreeScores: { Withdrawal: 0.34 }  // Lower score for Disagree
        },
        question: "I find it hard to stay stable under pressure."
    },
    {
        trait: "Neuroticism",
        aspect: "Withdrawal",
        facet: {
            name: "Self-Consciousness",
            agreeScores: { Withdrawal: 0.74 },  // Higher score for Agree
            disagreeScores: { Volatility: 0.37 }  // Lower score for Disagree
        },
        question: "I am self-conscious around others."
    }
];
