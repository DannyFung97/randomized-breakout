import { expect } from 'chai';
import { gameData } from '../reducers';
import { getData } from '../selectors';
import { UPDATE_GAME } from '../actions';

describe('getData returns win results correctly', () => {
    it('Win, no high score, no lives lost', () => {
        const fakeData = {
            score: 4,
            lives: 3
        };
        const fakeAction = {
            type: UPDATE_GAME,
            payload: { data: fakeData }
        }
        const originalState = {
            score: 1,
            highScore: 6,
            lives: 3
        }

        const expected = {
            score: 4,
            highScore: 6,
            lives: 3
        }

        const actual = gameData(originalState, fakeAction);

        expect(actual).to.deep.equal(expected);
    });

    it('Win, new high score, no lives lost', () => {
        const fakeData = {
            score: 8,
            lives: 3
        };
        const fakeAction = {
            type: UPDATE_GAME,
            payload: { data: fakeData }
        }
        const originalState = {
            score: 1,
            highScore: 4,
            lives: 3
        }

        const expected = {
            score: 8,
            highScore: 8,
            lives: 3
        }

        const actual = gameData(originalState, fakeAction);

        expect(actual).to.deep.equal(expected);
    });

    it('Win, no high score, and lives lost', () => {
        const fakeData = {
            score: 4,
            lives: 2
        };
        const fakeAction = {
            type: UPDATE_GAME,
            payload: { data: fakeData }
        }
        const originalState = {
            score: 1,
            highScore: 6,
            lives: 3
        }

        const expected = {
            score: 4,
            highScore: 6,
            lives: 2
        }

        const actual = gameData(originalState, fakeAction);

        expect(actual).to.deep.equal(expected);
    });

    it('Win, new high score, and lives lost', () => {
        const fakeData = {
            score: 8,
            lives: 1
        };
        const fakeAction = {
            type: UPDATE_GAME,
            payload: { data: fakeData }
        }
        const originalState = {
            score: 1,
            highScore: 4,
            lives: 3
        }

        const expected = {
            score: 8,
            highScore: 8,
            lives: 1
        }

        const actual = gameData(originalState, fakeAction);

        expect(actual).to.deep.equal(expected);
    });
});

describe('getData returns loss results correctly', () => {
    it('Lose, no high score', () => {
        const fakeData = {
            score: 4,
            lives: 0
        };
        const fakeAction = {
            type: UPDATE_GAME,
            payload: { data: fakeData }
        }
        const originalState = {
            score: 1,
            highScore: 6,
            lives: 3
        }

        const expected = {
            score: 4,
            highScore: 6,
            lives: 0
        }

        const actual = gameData(originalState, fakeAction);

        expect(actual).to.deep.equal(expected);
    });

    it('Lose, new high score', () => {
        const fakeData = {
            score: 8,
            lives: 0
        };
        const fakeAction = {
            type: UPDATE_GAME,
            payload: { data: fakeData }
        }
        const originalState = {
            score: 1,
            highScore: 4,
            lives: 2
        }

        const expected = {
            score: 8,
            highScore: 8,
            lives: 0
        }

        const actual = gameData(originalState, fakeAction);

        expect(actual).to.deep.equal(expected);
    });
});