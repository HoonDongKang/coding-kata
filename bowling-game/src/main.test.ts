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
    test("첫 프레임 스페어, 다음 프레임 첫 투구 4점이면 총합 계산", () => {
        // given
        // 1프레임: 7 + 3 (스페어)
        game.roll(7);
        game.roll(3);

        // 2프레임: 4 + 2
        game.roll(4);
        game.roll(2);

        // 나머지 8프레임은 0점
        for (let i = 0; i < 16; i++) {
            game.roll(0);
        }

        // when
        const score = game.score();

        // then
        // 1프레임: 7+3+4 = 14, 2프레임: 4+2=6, 나머지: 0
        expect(score).toBe(20);
    });

    test("연속 스페어 처리", () => {
        // 1프레임: 5 + 5 (스페어)
        game.roll(5);
        game.roll(5);

        // 2프레임: 6 + 4 (스페어)
        game.roll(6);
        game.roll(4);

        // 3프레임: 3 + 2
        game.roll(3);
        game.roll(2);

        // 나머지: 0점
        for (let i = 0; i < 14; i++) game.roll(0);

        // when
        const score = game.score();

        // then
        // 1프레임: 10 + 6 = 16
        // 2프레임: 10 + 3 = 13
        // 3프레임: 3 + 2 = 5
        // 총합 = 16 + 13 + 5 = 34
        expect(score).toBe(34);
    });
});
