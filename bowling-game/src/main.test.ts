import { Game } from "./main";

describe("Game initialization suite", () => {
    let game: Game;
    beforeEach(() => {
        game = new Game();
        game.init();
    });
    test("한 게임은 10개의 프레임으로 이루어져 있다.", () => {
        //given
        //when
        const frames = game.frames;
        //then
        expect(frames).toHaveLength(10);
    });

    test("1에서 9 프레임에는 두 번의 투구가 가능하다. ", () => {
        const frames = game.frames;
        const firstToNinethRolls = frames.slice(0, 8);
        const areEveryRollsSecond = firstToNinethRolls.every((frame) => frame.rolls.length === 2);

        expect(areEveryRollsSecond).toBeTruthy();
    });

    test("10 프레임에는 세 번의 투구가 가능하다. ", () => {
        const frames = game.frames;
        const lastRoll = frames.pop();
        const isLastRollThird = lastRoll.rolls.length === 3;

        expect(isLastRollThird).toBeTruthy();
    });
});

describe("Game score suite", () => {
    let game: Game;
    beforeEach(() => {
        game = new Game();
        game.init();
    });
    test("모든 타구가 0점이라면, 최종 점수는 0점이다.", () => {
        //given
        //when
        const score = game.score();
        //then
        expect(score).toBe(0);
    });

    test("모든 타구가 1점이라면, 최종 점수는 20점이다.", () => {
        // given
        const pin = 1;

        //when
        for (let i = 0; i < 20; i++) {
            game.roll(pin);
        }

        const score = game.score();

        //then
        expect(score).toBe(20);
    });

    test("모든 타구를 스트라이크로 할 경우, 300점이다.", () => {
        // given
        const pin = 10;

        //when
        for (let i = 0; i < 12; i++) {
            game.roll(pin);
        }
        const score = game.score();

        //then
        expect(score).toBe(300);
    });
});
