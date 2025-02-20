import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: "usename không được để trống" })
    usename: string;
    @IsNotEmpty({ message: "password không được để trống" })
    password: string;
}
