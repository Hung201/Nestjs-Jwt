import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateReviewDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsMongoId({ message: 'Restaurant ID không đúng định dạng' })
    restaurant_id: string;

    @IsOptional()
    @IsMongoId({ message: 'User ID không đúng định dạng' })
    user_id: string;

    @IsOptional()
    @IsNumber({}, { message: 'Đánh giá phải là số' })
    @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
    @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
    rating: number;

    @IsOptional()
    comment: string;
}
