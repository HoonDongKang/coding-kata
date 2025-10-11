export class Frame {
    rolls: number[];
    currentRoll: number;
    frameScore: number;

    constructor() {
        this.rolls = [null, null];
        this.currentRoll = 0;
        this.frameScore = null;
    }

    isComplete() {
        return this.isStrike() || this.rolls.every((roll) => roll !== null);
    }

    isStrike() {
        return this.rolls[0] === 10;
    }

    roll(pins: number) {
        this.rolls[this.currentRoll] = pins;

        this.updateCurrentRoll();
    }

    updateCurrentRoll() {
        if (!this.isStrike() && this.currentRoll < 1) {
            this.currentRoll++;
        }
    }

    getFrameScore(): number {
        if (this.frameScore === null) this.setFrameScore(null);
        return this.frameScore;
    }

    setFrameScore(score: number | null) {
        if (score === null) {
            this.frameScore = this.rolls.reduce((acc, cur) => acc + (cur ?? 0), 0);
        } else {
            this.frameScore = score;
        }
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

    isStrike(pins: number) {
        return pins === 10;
    }

    isNextFrame(rolls: number[]) {
        return rolls.every((roll) => roll !== null);
    }

    updateCurrentFrame(pins: number) {
        const frame = this.frames[this.currentFrame];
        const rolls = frame.rolls;

        if (this.isStrike(pins) || this.isNextFrame(rolls)) {
            this.currentFrame++;
        }
    }

    roll(pins: number): void {
        const frame = this.frames[this.currentFrame];
        frame.roll(pins);

        if (frame.isStrike() || frame.rolls.every((roll) => roll !== null)) {
            this.currentFrame++;
        }
    }
    score(): number {
        const totalScore = this.frames.reduce((acc, frame, i) => {
            let frameScore = frame.getFrameScore();

            if (this.isStrike(frame.rolls[0])) {
                const nextFrame = this.frames[i + 1];

                if (!nextFrame) {
                    acc += frameScore;
                    return acc;
                }
                const nextFrameScore = nextFrame.getFrameScore();

                frameScore += nextFrameScore;
                frame.setFrameScore(frameScore);
            }

            acc += frameScore;
            console.log(frame);
            return acc;
        }, 0);

        return totalScore;
    }
}
