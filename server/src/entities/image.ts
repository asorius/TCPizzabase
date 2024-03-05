import { validates } from '@server/utils/validation'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Pizza } from './pizza'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('numeric', { nullable: false })
  rating: Number

  @Column('text')
  source: String

  @ManyToOne(() => User, (user) => user.images, { cascade: ['insert'] })
  user: User

  @ManyToOne(() => Pizza, (pizza) => pizza.images)
  pizza: Pizza
}

export type RatingBare = Omit<Image, 'user' | 'pizza'>

export const ratingSchema = validates<RatingBare>().with({
  id: z.number().int().positive(),
  rating: z.number().positive().min(0).max(5),
  source: z.string().min(2).max(200),
})

export const ratingInsertSchema = ratingSchema.omit({ id: true })

export type ProjectInsert = z.infer<typeof ratingInsertSchema>
