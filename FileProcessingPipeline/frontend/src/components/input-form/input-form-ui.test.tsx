import { render, screen, fireEvent } from "@testing-library/react";
import InputFormFeature from "components/input-form/input-form-feature";

test("renders input labels render correctly", () => {
    render(<InputFormFeature />);

    const inputTextLabelElement = screen.getByText(/Text input:/i);
    expect(inputTextLabelElement).toBeInTheDocument();

    const inputFileLabelElement = screen.getByText(/File input:/i);
    expect(inputFileLabelElement).toBeInTheDocument();
});

test("user is allowed to change input text", () => {
    const { getByLabelText } = render(<InputFormFeature />);

    const textInput = getByLabelText(/Text input:/i) as HTMLInputElement;
    fireEvent.change(getByLabelText(/Text input:/i), {
        target: { value: "hello world" },
    });

    expect(textInput.value).toBe("hello world");
});

test("user is allowed to select a file", () => {
    const { getByLabelText } = render(<InputFormFeature />);

    const file = new File(["hello world"], "hello.txt", { type: "text/plain" });
    fireEvent.change(getByLabelText(/File input:/i), {
        target: { files: [file] },
    });

    const fileInput = getByLabelText(/File input:/i) as HTMLInputElement;
    expect(fileInput.files?.[0]).toEqual(file);
});
