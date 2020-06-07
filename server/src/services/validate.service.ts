class ValidateService {
    valid(condition: boolean, message: string) {
        if(condition) {
            throw new Error(message=message);
        }
    }
}

export default new ValidateService();