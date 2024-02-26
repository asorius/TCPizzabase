import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { z } from 'zod'
import { Pizza } from './pizza'
import { Rating } from './rating'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text', { unique: true })
  profile: string

  @OneToMany(() => Pizza, (pizza) => pizza.user, {
    cascade: ['insert'],
  })
  pizzas: Pizza[]

  @OneToMany(() => Rating, (rating) => rating.user, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  rating: Rating[]
}

export type UserBare = Omit<User, 'pizzas' | 'rating'>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),

  // We will trim and lowercase all emails, otherwise
  // lots of users will be frustrated when they try to
  // log in with "email@example" while they have
  // registered with "Email@example.com".
  email: z.string().trim().toLowerCase().email(),
  profile: z.string().min(8).max(64),
})

export const userInsertSchema = userSchema.omit({ id: true })

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<User, 'id'>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
})
