import { validates } from '@server/utils/validation'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Brand } from './brand'

@Entity()
export class Country {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text', { nullable: false })
  name: string

  @ManyToOne(() => Brand, (brand) => brand.country)
  brands: Brand[]
}

export type CountryBare = Omit<Country, 'brands'>

export const countrySchema = validates<CountryBare>().with({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(5, 'Country name must be at least 5 characters long')
    .max(100),
})

export const countryInsertSchema = countrySchema.omit({ id: true })

export type CountryInsert = z.infer<typeof countryInsertSchema>
