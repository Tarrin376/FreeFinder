export function actionSuccessful(setCompleted: React.Dispatch<React.SetStateAction<any>>, before: any, after: any): void {
    setCompleted(before);
    setTimeout(() => {
        setCompleted(after);
    }, 3000);
}