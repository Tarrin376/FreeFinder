export function parseFileBase64(file: File): Promise<unknown> {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result !== null) resolve(reader.result);
                else reject("File could not be parsed.");
            };

            reader.readAsDataURL(file);
        }
        catch (err: any) {
            reject(err);
        }
    });
}