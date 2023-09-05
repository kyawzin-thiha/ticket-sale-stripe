import {Injectable} from '@nestjs/common';
import {PrismaService} from '../helper/prisma.service';
import {CartDto, CartsDto} from '../types/data.dto';
import {ErrorDto} from '../types/error.dto';

@Injectable()
export class CartDbService {
    constructor(private readonly prisma: PrismaService) {}

    async get(id: string): Promise<[CartDto, ErrorDto]> {
        try {
            const cart = await this.prisma.cart.findUnique({
                where: {id: id},
                include: {
                    cartItems: {
                        include: {
                            item: true
                        }
                    },
                    coupon: true
                }
            });

            if (!cart) {
                return [null, {message: 'Cart not found', status: 400}];
            }

            return [cart, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }

    async getAll(): Promise<[CartsDto, ErrorDto]> {
        try {
            const carts = await this.prisma.cart.findMany({
                orderBy: {createdAt: 'desc'},
                include: {
                    cartItems: {
                        include: {
                            item: true
                        }
                    },
                    coupon: true
                }
            });
            return [carts, null];
        } catch (error) {
            return [null, {message: 'Internal Server Error', status: 500}];
        }
    }
}