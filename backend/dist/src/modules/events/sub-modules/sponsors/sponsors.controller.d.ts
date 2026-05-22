import { CreateSponsorDto, UpdateSponsorDto } from './dto/sponsor.dto';
export declare class SponsorsController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: CreateSponsorDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateSponsorDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
