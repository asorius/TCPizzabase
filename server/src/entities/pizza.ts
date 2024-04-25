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

  @ManyToOne(() => Brand, (brand) => brand.pizzas, {
    cascade: ['insert'],
  })
  brand: Brand

  @OneToMany(() => Image, (image) => image.pizza, {
    cascade: ['insert', 'remove'],
  })
  images: Image[]

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
}

export type PizzaBare = Omit<Pizza, 'user' | 'brand' | 'images' | 'createdAt'>

export const pizzaSchema = validates<PizzaBare>().with({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(4, 'Pizza name must be at least 4 characters long')
    .max(100),
})

export const pizzaInsertSchema = z.object({
  name: z.string(),
  brand: z.string(),
  country: z.string(),
  imageSource: z.string(),
  imagePath: z.string(),
  rating: z.number().positive().min(1).max(10),
})

export type PizzaInsert = z.infer<typeof pizzaInsertSchema>
