/**
 * Shared XP / Level calculation used by Dashboard, Profile, and Leaderboard.
 * Keep this as the single source of truth so formulae never drift.
 */

export function calculateXP({ solvedProblems = 0, completedTopics = 0, quizzes = 0 }) {
    return solvedProblems * 50 + completedTopics * 30 + quizzes * 100;
}

export function calculateLevel(xp) {
    return Math.floor(xp / 500) + 1;
}

export function xpInCurrentLevel(xp) {
    return xp % 500;
}
