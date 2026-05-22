import { CreateSpeakerDto, UpdateSpeakerDto } from './dto/speaker.dto';
export declare class SpeakersController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: CreateSpeakerDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateSpeakerDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
