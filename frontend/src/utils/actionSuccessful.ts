export function actionSuccessful(setCompleted: React.Dispatch<React.SetStateAction<boolean>>, before: any, after: any): void {
    setCompleted(before);
    setTimeout(() => {
        setCompleted(after);
    }, 2000);
}