export function actionSuccessful(setCompleted: React.Dispatch<React.SetStateAction<string>>, before: string,
    after: string, duration?: number): void {
    setCompleted(before);
    setTimeout(() => {
        setCompleted(after);
    }, duration || 3500);
}