export class Frame {
    rolls: (number | null)[];
    currentRoll: number;
    frameScore: number | null;

    constructor() {
        this.rolls = [];
        this.currentRoll = 0;
        this.frameScore = null;
    }

    init(i: number) {
        this.rolls = i === 9 ? [null, null, null] : [null, null];
        return this;
    }

    isStrike() {
        return this.rolls[0] === 10;
    }

    isSpare() {
        return !this.isStrike() && (this.rolls[0] ?? 0) + (this.rolls[1] ?? 0) === 10;
    }

    isComplete(frameIndex: number) {
        if (frameIndex === 9) {
            const validRolls = this.rolls.filter((r) => r !== null);
            const first = validRolls[0] ?? 0;
            const second = validRolls[1] ?? 0;
            const bonus = first === 10 || first + second === 10;
            return bonus ? validRolls.length === 3 : validRolls.length === 2;
        }

        return this.isStrike() || this.rolls.every((r) => r !== null);
    }

    roll(pins: number) {
        this.rolls[this.currentRoll] = pins;
        if (this.currentRoll < this.rolls.length - 1) this.currentRoll++;
    }

    setFrameScore(score: number) {
        this.frameScore = score;
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
        this.frames = Array.from({ length: 10 }, (_, i) => new Frame().init(i));
    }

    roll(pins: number) {
        const frame = this.frames[this.currentFrame];
        frame.roll(pins);

        if (frame.isComplete(this.currentFrame) && this.currentFrame < 9) {
            this.currentFrame++;
        }
    }

    score(): number {
        let total = 0;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const rolls = frame.rolls.filter((r) => r !== null) as number[];

            if (frame.isStrike()) {
                const nextTwo = this.getNextRolls(i, 2);
                frame.setFrameScore(10 + nextTwo);
            } else if (frame.isSpare()) {
                const nextOne = this.getNextRolls(i, 1);
                frame.setFrameScore(10 + nextOne);
            } else {
                const score = rolls.reduce((a, b) => a + b, 0);
                frame.setFrameScore(score);
            }

            total += frame.frameScore ?? 0;
        }

        return total;
    }

    private getNextRolls(frameIndex: number, count: number): number {
        const rolls: number[] = [];

        for (const frame of this.frames.slice(frameIndex + 1)) {
            rolls.push(...frame.rolls.filter((r) => r !== null));
            if (rolls.length >= count) break;
        }

        if (frameIndex === 9) {
            const frame = this.frames[frameIndex];
            const bonusRolls = frame.rolls.slice(1).filter((r) => r !== null);
            rolls.push(...bonusRolls);
        }

        return rolls.slice(0, count).reduce((acc, cur) => (acc += cur), 0);
    }
}
