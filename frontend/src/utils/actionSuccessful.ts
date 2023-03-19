export function actionSuccessful(setCompleted: React.Dispatch<React.SetStateAction<boolean>>): void {
    setCompleted(true);
    setTimeout(() => {
        setCompleted(false);
    }, 2000);
}