export class Frame {
    rolls: number[];
    currentRoll: number;

    constructor() {
        this.rolls = [null, null];
        this.currentRoll = 0;
    }

    roll(pins: number) {
        this.rolls[this.currentRoll] = pins;

        this.updateCurrentroll();
    }

    updateCurrentroll() {
        const idx = this.currentRoll;
        this.currentRoll = idx < 1 ? idx + 1 : 0;
    }

    score() {
        return this.rolls.reduce((acc, cur) => (acc += cur), 0);
    }
}

export class Game {
    frames: Frame[];
    currentFrame: number;

    constructor() {
        this.frames = [];
        this.currentFrame = 0;
    }

    init() {
        this.frames = Array.from({ length: 10 }, () => new Frame());
    }

    isFinish() {
        return !this.frames.some((frame) => frame.rolls.some((roll) => roll === null));
    }

    updateCurrentFrame() {
        const frame = this.frames[this.currentFrame];
        const rolls = frame.rolls;

        if (rolls.every((roll) => roll !== null)) {
            this.currentFrame++;
        }
    }

    roll(pins: number): void {
        if (this.isFinish()) {
            console.error("이미 모든 타구를 던지셨습니다");
        }

        this.updateCurrentFrame();

        const frame = this.frames[this.currentFrame];
        frame.roll(pins);
    }
    score(): number {
        return this.frames.reduce((acc, cur) => (acc += cur.score()), 0);
    }
}
