import {Cart, CartItem, Coupon, Item} from '@prisma/client';

export type ItemDto = Item | null;
export type ItemsDto = Item[] | null;

export type CouponDto = Coupon | null;
export type CouponsDto = Coupon[] | null;

export type CartDto = Cart & { cartItems: CartItem[], coupon: CouponDto } | null;
export type CartsDto = (Cart & { cartItems: CartItem[], coupon: CouponDto })[] | null;
