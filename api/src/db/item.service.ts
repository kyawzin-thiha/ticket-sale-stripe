import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {ItemDto, ItemsDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';
import {Prisma} from '@prisma/client';

@Injectable()
export class ItemDbService {
    constructor(private readonly prisma: PrismaService) {}

    async find(id: string): Promise<[ItemDto, ErrorDto]> {
        try {
            const item = await this.prisma.item.findUnique({
                where: {id: id}
            });

            if (!item) {
                return [null, {message: 'Item not found', status: 400}];
            }

            return [item, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async get(id: string): Promise<[ItemDto, ErrorDto]> {
        try {
            const item = await this.prisma.item.findFirst({
                where: {
                    OR: [
                        {
                            id: id
                        },
                        {
                            slug: id
                        }
                    ]
                }
            });

            if (!item) {
                return [null, {message: 'Item not found', status: 400}];
            }

            return [item, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async getAll(): Promise<[ItemsDto, ErrorDto]> {
        try {
            const items = await this.prisma.item.findMany({
                orderBy: {createdAt: 'desc'}
            });

            return [items, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async getAllSlugs(): Promise<[string[], ErrorDto]> {
        try {
            const items = await this.prisma.item.findMany({
                orderBy: {createdAt: 'desc'},
                select: {slug: true}
            });
            const slugs = items.map(item => item.slug);
            return [slugs, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async create(name: string, slug: string, description: string, thumbnail: string, price: number, qty: number): Promise<[ItemDto, ErrorDto]> {
        try {
            const item = await this.prisma.item.create({
                data: {
                    name,
                    slug,
                    description,
                    thumbnail,
                    price,
                    qty
                }
            });

            return [item, null];
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return [null, {message: 'Item already exists', status: 400}];
                }
            }
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async update(id: string, name: string, description: string, thumbnail: string, price: number, qty: number): Promise<ErrorDto> {
        try {
            await this.prisma.item.update({
                where: {id: id},
                data: {
                    name,
                    description,
                    thumbnail,
                    price,
                    qty
                }
            });
        } catch (error) {
            return {message: 'Server Error', status: 500};
        }
    }

    async qtyIncrement(id: string, qty: number): Promise<ErrorDto> {
        try {
            await this.prisma.item.update({
                where: {id: id},
                data: {
                    qty: {
                        increment: qty
                    }
                }
            });
        } catch (error) {
            return {message: 'Server Error', status: 500};
        }
    }

    async qtyDecrement(id: string, qty: number): Promise<ErrorDto> {
        try {
            await this.prisma.item.update({
                where: {id: id},
                data: {
                    qty: {
                        decrement: qty
                    }
                }
            });
        } catch (error) {
            return {message: 'Server Error', status: 500};
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.item.delete({
                where: {id: id}
            });
        } catch (error) {
            return {message: 'Server Error', status: 500};
        }
    }
}