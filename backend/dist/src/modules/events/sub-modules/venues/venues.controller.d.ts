import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto';
export declare class VenuesController {
    findAll(): Promise<any[]>;
    create(dto: CreateVenueDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateVenueDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
