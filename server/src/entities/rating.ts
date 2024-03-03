import { validates } from '@server/utils/validation'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Pizza } from './pizza'

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('numeric', { nullable: false })
  rating: Number

  @ManyToOne(() => User, (user) => user.ratings, { cascade: ['insert'] })
  user: User

  @ManyToOne(() => Pizza, (pizza) => pizza.ratings, {
    onDelete: 'CASCADE',
  })
  pizza: Pizza
}

export type RatingBare = Omit<Rating, 'user' | 'pizza'>

export const ratingSchema = validates<RatingBare>().with({
  id: z.number().int().positive(),
  rating: z.number().positive().min(0).max(5),
})

export const ratingInsertSchema = ratingSchema.omit({ id: true })

export type ProjectInsert = z.infer<typeof ratingInsertSchema>
