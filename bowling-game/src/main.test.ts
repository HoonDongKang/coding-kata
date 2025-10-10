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

    test("하나의 프레임에는 두 번의 투구가 가능하다.", () => {
        const frames = game.frames;
        const areEveryRollsSecond = frames.every((frame) => frame.rolls.length === 2);

        expect(areEveryRollsSecond).toBeTruthy();
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
});
