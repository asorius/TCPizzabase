import { validates } from '@server/utils/validation'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Pizza } from './pizza'
import { Country } from './country'

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text', { nullable: false })
  title: string

  @OneToMany(() => Pizza, (pizza) => pizza.brand)
  pizzas: Pizza[]

  @OneToMany(() => Country, (country) => country.brands)
  country: Country
}

export type BrandBare = Omit<Brand, 'pizzas' | 'country'>

export const brandSchema = validates<BrandBare>().with({
  id: z.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(5, 'Pizzas name must be at least 5 characters long')
    .max(100),
})

export const brandInsertSchema = brandSchema.omit({ id: true })

export type BrandInsert = z.infer<typeof brandInsertSchema>
