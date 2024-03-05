import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Brand } from './brand'
import { Image } from './image'

@Entity()
export class Pizza {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text', { nullable: false })
  name: string

  @ManyToOne(() => User, (user) => user.pizzas, { cascade: ['insert'] })
  user: User

  @ManyToOne(() => Brand, (brand) => brand.pizzas, { cascade: ['insert'] })
  brand: Brand

  @OneToMany(() => Image, (image) => image.pizza, {
    cascade: ['insert'],
  })
  images: Image[]
}

export type PizzaBare = Omit<Pizza, 'user' | 'brand' | 'images'>

export const pizzaSchema = validates<PizzaBare>().with({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(5, 'Pizza name must be at least 5 characters long')
    .max(100),
})

export const pizzaInsertSchema = z.object({
  name: z.string(),
  brand: z.string(),
  country: z.string(),
  imageSource: z.string(),
  rating: z.number().positive().min(1).max(10),
})

export type PizzaInsert = z.infer<typeof pizzaInsertSchema>

// user can create multiple pizzas with added rating

// each pizza belongs to a brand
// each pizza has a rating by a user

// each brand belongs to a country(multiple)

// pizzas should be able to be filtered by name, brand, or country by the client

// user can: sign up, login, see pizzas with ratings
// if logged in user can: add new pizza with a rating, or add their rating to already existing pizza
// if user is admin, they can: delete pizzas, delete brands (country should automaticaly delete itself if there are no brands in it)
