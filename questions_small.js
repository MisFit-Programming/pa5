// questions.js

const questions = [
    // Openness
    { trait: "Openness", cluster: "Intellect", facet: "Quickness", question: "I quickly understand complex ideas." },
    { trait: "Openness", cluster: "Intellect", facet: "Creativity", question: "I enjoy creating new ideas." },
    { trait: "Openness", cluster: "Intellect", facet: "Knowledge", question: "I seek knowledge in various fields." },
    { trait: "Openness", cluster: "Intellect", facet: "Curiosity", question: "I am curious about many different things." },
    { trait: "Openness", cluster: "Intellect", facet: "Ingenuity", question: "I find innovative solutions to problems." },
    { trait: "Openness", cluster: "Intellect", facet: "Competence", question: "I feel confident in my intellectual abilities." },
    { trait: "Openness", cluster: "Intellect", facet: "Introspection", question: "I often reflect on my thoughts and feelings." },
    { trait: "Openness", cluster: "Intellect", facet: "Depth", question: "I prefer deep conversations over surface-level talk." },
    
    { trait: "Openness", cluster: "Receptivity", facet: "Aesthetics", question: "I am moved by artistic beauty." },
    { trait: "Openness", cluster: "Receptivity", facet: "Imagination", question: "I have a vivid imagination." },
    { trait: "Openness", cluster: "Receptivity", facet: "Mindfulness", question: "I am mindful of my surroundings." },
    { trait: "Openness", cluster: "Receptivity", facet: "Fantasy", question: "I enjoy daydreaming." },
    { trait: "Openness", cluster: "Receptivity", facet: "Self-Awareness", question: "I am aware of my strengths and weaknesses." },
    { trait: "Openness", cluster: "Receptivity", facet: "Functionality", question: "I find functional beauty in things." },
    { trait: "Openness", cluster: "Receptivity", facet: "Flexibility", question: "I am open to change and new ideas." },

    // Conscientiousness
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Purposefulness", question: "I pursue my goals with determination." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Efficiency", question: "I use my time efficiently." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Willpower", question: "I stay focused on difficult tasks." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Competence", question: "I take pride in being competent at work." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Organization", question: "I organize my work well." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Achievement Striving", question: "I am motivated to achieve my goals." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Dutifulness", question: "I fulfill my responsibilities." },
    { trait: "Conscientiousness", cluster: "Industriousness", facet: "Deliberation", question: "I think carefully before making decisions." },
    
    { trait: "Conscientiousness", cluster: "Orderliness", facet: "Systematic", question: "I approach tasks in a systematic way." },
    { trait: "Conscientiousness", cluster: "Orderliness", facet: "Integrity", question: "I maintain a high level of integrity." },
    { trait: "Conscientiousness", cluster: "Orderliness", facet: "Patterned", question: "I prefer to follow established patterns." },
    { trait: "Conscientiousness", cluster: "Orderliness", facet: "Perfectionism", question: "I strive for perfection in my work." },
    { trait: "Conscientiousness", cluster: "Orderliness", facet: "Cautiousness", question: "I am careful and cautious." },
    { trait: "Conscientiousness", cluster: "Orderliness", facet: "Rationality", question: "I make rational, thought-out decisions." },

    // Extraversion
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Friendliness", question: "I make friends easily." },
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Warmth", question: "I am warm and affectionate with others." },
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Gregariousness", question: "I enjoy being in social groups." },
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Poise", question: "I am poised in social settings." },
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Cheerfulness", question: "I am generally cheerful and upbeat." },
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Self-Disclosure", question: "I am open about sharing personal details." },
    { trait: "Extraversion", cluster: "Enthusiasm", facet: "Sociability", question: "I enjoy socializing with others." },
    
    { trait: "Extraversion", cluster: "Assertiveness", facet: "Leadership", question: "I often take on leadership roles." },
    { trait: "Extraversion", cluster: "Assertiveness", facet: "Forcefulness", question: "I can be forceful when needed." },
    { trait: "Extraversion", cluster: "Assertiveness", facet: "Provocativeness", question: "I enjoy challenging others’ ideas." },
    { trait: "Extraversion", cluster: "Assertiveness", facet: "Activity", question: "I am highly active and energetic." },
    { trait: "Extraversion", cluster: "Assertiveness", facet: "Talkativeness", question: "I am talkative and expressive." },
    { trait: "Extraversion", cluster: "Assertiveness", facet: "Excitement Seeking", question: "I seek out exciting experiences." },

    // Agreeableness
    { trait: "Agreeableness", cluster: "Compassion", facet: "Caring", question: "I care deeply about others." },
    { trait: "Agreeableness", cluster: "Compassion", facet: "Sympathy", question: "I feel sympathy for others." },
    { trait: "Agreeableness", cluster: "Compassion", facet: "Understanding", question: "I am understanding of others’ feelings." },
    { trait: "Agreeableness", cluster: "Compassion", facet: "Empathy", question: "I empathize with others." },
    { trait: "Agreeableness", cluster: "Compassion", facet: "Altruism", question: "I often put others' needs before mine." },
    { trait: "Agreeableness", cluster: "Compassion", facet: "Tenderness", question: "I am tender-hearted." },
    { trait: "Agreeableness", cluster: "Compassion", facet: "Utopian", question: "I believe in making the world better." },

    { trait: "Agreeableness", cluster: "Politeness", facet: "Nurturing", question: "I nurture others when they are in need." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Cooperative", question: "I cooperate easily with others." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Pleasant", question: "I try to be pleasant with everyone." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Compliant", question: "I am compliant with others' requests." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Straightforward", question: "I am straightforward in my communication." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Modest", question: "I am modest about my achievements." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Trusting", question: "I tend to trust people easily." },
    { trait: "Agreeableness", cluster: "Politeness", facet: "Moral", question: "I act in ways that reflect my moral values." },

    // Neuroticism
    { trait: "Neuroticism", cluster: "Volatility", facet: "Stability", question: "I find it hard to stay stable under pressure." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Calmness", question: "I remain calm in difficult situations." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Angry Hostility", question: "I often feel intense anger." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Tranquility", question: "I feel tranquil even under stress." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Impulse Control", question: "I struggle with impulse control." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Moderation", question: "I moderate my reactions." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Impulsiveness", question: "I act impulsively at times." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Imperturbability", question: "I remain unperturbed in stressful situations." },
    { trait: "Neuroticism", cluster: "Volatility", facet: "Acceptance", question: "I accept things as they are." },

    { trait: "Neuroticism", cluster: "Withdrawal", facet: "Happiness", question: "I often feel happy and content." },
    { trait: "Neuroticism", cluster: "Withdrawal", facet: "Depression", question: "I frequently feel down or depressed." },
    { trait: "Neuroticism", cluster: "Withdrawal", facet: "Vulnerability", question: "I feel vulnerable in challenging situations." },
    { trait: "Neuroticism", cluster: "Withdrawal", facet: "Anxiety", question: "I experience anxiety often." },
    { trait: "Neuroticism", cluster: "Withdrawal", facet: "Toughness", question: "I feel resilient against adversity." },
    { trait: "Neuroticism", cluster: "Withdrawal", facet: "Self-Consciousness", question: "I am self-conscious around others." }
];
