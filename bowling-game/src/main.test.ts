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
