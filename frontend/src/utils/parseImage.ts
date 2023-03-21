export async function parseImage(file: File): Promise<unknown> {
    const base64Str = await new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

    return base64Str;
}