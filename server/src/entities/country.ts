import { validates } from '@server/utils/validation'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Brand } from './brand'

@Entity()
export class Country {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text', { nullable: false })
  name: string

  @OneToMany(() => Brand, (brand) => brand.country, {
    cascade: ['insert'],
  })
  brands: Brand[]
}

export type CountryBare = Omit<Country, 'brands'>

export const countrySchema = validates<CountryBare>().with({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(4, 'Country name must be at least 4 characters long')
    .max(100),
})

export const countryInsertSchema = countrySchema.omit({ id: true })

export type CountryInsert = z.infer<typeof countryInsertSchema>
