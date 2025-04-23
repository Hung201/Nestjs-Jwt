import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty({ message: 'Restaurant ID không được để trống' })
    @IsMongoId({ message: 'Restaurant ID không đúng định dạng' })
    restaurant_id: string;

    @IsNotEmpty({ message: 'User ID không được để trống' })
    @IsMongoId({ message: 'User ID không đúng định dạng' })
    user_id: string;

    @IsNotEmpty({ message: 'Đánh giá không được để trống' })
    @IsNumber({}, { message: 'Đánh giá phải là số' })
    @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
    @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
    rating: number;

    @IsOptional()
    comment: string;
}
