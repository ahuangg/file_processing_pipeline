import { useState } from "react";
import { Card, FileInput, TextInput, Label, Button } from "flowbite-react";
import {
    getSignedURL,
    putFileInS3,
    postInputData,
} from "components/input-form/input-form-data-access";

const InputForm = () => {
    const [formData, setFormData] = useState({
        textInput: "",
        fileInput: null as File | null,
    });

    const handleInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            textInput: event.target.value,
        });
    };

    const handleInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setFormData({
                ...formData,
                fileInput: file,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const uploadData = await getSignedURL();

            if (uploadData?.uploadURL && formData?.fileInput) {
                await putFileInS3(uploadData.uploadURL, formData.fileInput);
            }

            if (uploadData?.Key && formData?.textInput) {
                await postInputData(formData.textInput, uploadData.Key);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    FileProcessingPipeline
                </h5>
                <p className="font-normal text-gray-500 dark:text-gray-400">
                    Upload a file to s3
                </p>
                <div className="mb-4">
                    <Label htmlFor="inputText" value="Text Input" />
                    <TextInput
                        id="inputText"
                        className="border border-black "
                        value={formData.textInput}
                        onChange={handleInputText}
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="inputFile" value="File Input" />
                    <FileInput id="inputFile" onChange={handleInputFile} />
                </div>
                <div className="flex justify-center">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Card>
    );
};

export default InputForm;
