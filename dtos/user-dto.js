export class UserDto {
    nickname;
    email;
    gender;
    constructor(user) {
        this.nickname = user.nickname;
        this.email = user.email;
        this.gender = user.gender;
    }
}