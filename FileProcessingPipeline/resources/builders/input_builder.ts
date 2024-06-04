export class InputBuilder {
    private inputs: { [input: string]: string } = {};

    addInput(key: string, value: string): InputBuilder {
        this.inputs[key] = value;
        return this;
    }

    build(): { [input: string]: string } {
        return this.inputs;
    }
}
