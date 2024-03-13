import { validates } from '@server/utils/validation'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { User } from './user'
import { Pizza } from './pizza'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('numeric')
  rating: Number

  @Column('text')
  source: String

  @ManyToOne(() => User, (user) => user.images, { cascade: ['insert'] })
  user: User

  @ManyToOne(() => Pizza, (pizza) => pizza.images)
  pizza: Pizza

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
}

export type ImageBare = Omit<Image, 'user' | 'pizza' | 'createdAt'>

export const ratingSchema = validates<ImageBare>().with({
  id: z.number().int().positive(),
  rating: z.number().positive().min(0).max(5),
  source: z.string().min(2).max(200),
})

export const imageInsertSchema = ratingSchema.omit({ id: true })

export type ImageInsert = z.infer<typeof imageInsertSchema>
