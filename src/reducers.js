import {
    UPDATE_GAME
} from './actions';

const initialState = { score: 0, highScore: 0, lives: 3 }

export const gameData = ( state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case UPDATE_GAME: {
            const { data } = payload;
            return {
                ...state,
                score: data.score,
                highScore: Math.max(state.highScore, data.candidateHighScore),
                lives: data.lives
            }
        }
        default:
            return state
    }
}