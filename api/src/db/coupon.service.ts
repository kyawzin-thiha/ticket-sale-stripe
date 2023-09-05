import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {CouponDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';
import {Prisma} from '@prisma/client';

@Injectable()
export class CouponDbService {
    constructor(private readonly prisma: PrismaService) {}

    async find(id: string): Promise<[CouponDto, ErrorDto]> {
        try {
            const coupon = await this.prisma.coupon.findUnique({
                where: {id: id}
            });
            return [coupon, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async get(id: string): Promise<[CouponDto, ErrorDto]> {
        try {
            const coupon = await this.prisma.coupon.findFirst({
                where: {
                    OR: [
                        {
                            id: id
                        },
                        {
                            code: id
                        }
                    ]
                }
            });
            return [coupon, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async getAll(): Promise<[CouponDto[], ErrorDto]> {
        try {
            const coupons = await this.prisma.coupon.findMany({
                orderBy: {createdAt: 'desc'}
            });
            return [coupons, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async getAllCodes(): Promise<[string[], ErrorDto]> {
        try {
            const coupons = await this.prisma.coupon.findMany({
                orderBy: {createdAt: 'desc'},
                select: {code: true}
            });
            const codes = coupons.map(coupon => coupon.code);
            return [codes, null];
        } catch (error) {
            return [null, {message: 'Server Error', status: 500}];
        }
    }

    async create(name: string, code: string, description: string, discount: number): Promise<[CouponDto, ErrorDto]> {
        try {
            const coupon = await this.prisma.coupon.create({
                data: {
                    name,
                    code,
                    description,
                    discount
                }
            });
            return [coupon, null];
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return [null, {message: 'Coupon code already exists', status: 400}];
                }
            }
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async update(id: string, name: string, code: string, description: string, discount: number): Promise<ErrorDto> {
        try {
            await this.prisma.coupon.update({
                where: {
                    id: id
                },
                data: {
                    name,
                    code,
                    description,
                    discount
                }
            });
            return null;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return {message: 'Coupon code already exists', status: 400};
                }
            }
            return {message: 'Internal Server Error', status: 500};
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.coupon.delete({
                where: {
                    id: id
                }
            });
            return null;
        } catch (error) {
            return {message: 'Internal Server Error', status: 500};
        }
    }
}