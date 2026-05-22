import { CreateFormDto, UpdateFormDto, FormResponseDto } from './dto/form.dto';
export declare class FormsController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: CreateFormDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateFormDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    respond(id: string, answers: FormResponseDto): Promise<{
        success: boolean;
    }>;
    getResponses(id: string): Promise<any[]>;
}
