export class UserDto {
    nickname;
    email;
    gender;
    id;
    constructor(user) {
        this.nickname = user.nickname;
        this.email = user.email;
        this.gender = user.gender;
        this.id = user.id;
    }
}