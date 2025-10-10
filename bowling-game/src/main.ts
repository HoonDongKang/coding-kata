export class Frame {
    rolls: number[];

    constructor() {
        this.rolls = [0, 0];
    }
}

export class Game {
    frames: Frame[];

    constructor() {
        this.frames = [];
    }

    init() {
        this.frames = Array.from({ length: 10 }, () => new Frame());
    }
    roll(pins: number): void {}
    score(): number {
        return 0;
    }
}
